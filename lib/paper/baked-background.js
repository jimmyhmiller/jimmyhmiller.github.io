import { PaperScene } from './paper-scene.js';
import { depthShadow } from './fallback.js';
import { GRAIN } from './materials.js';

// Page-space tiles, CSS pixels tall.
const TILE_HEIGHT = 1024;
// Tiles within this many viewport heights of the viewport are drawn one per
// frame as soon as they are needed; the rest only as fast as they encode.
const NEAR_VIEWPORTS = 1;
// Encoded tiles waiting to swap in, at most, before another far tile is drawn.
const ENCODE_QUEUE = 2;

/**
 * Lossless page-space tiles of the page's light: the browser compositor
 * handles ordinary scrolling, so scrolling never draws. The grain is not in
 * them (a grain tile repeats over them, lib/paper/materials.js GRAIN), so
 * they are smooth and small. The grain layer sits over the tiles in the same
 * element, and the bake's WebGL canvas in an element of its own: Safari
 * composites a WebGL canvas separately and does not blend across composited
 * layers, so a grain layer sharing a layer with one (or over the live canvas)
 * is painted unblended and washes the page out.
 *
 * A bake draws the tiles at and around the viewport first, straight into the
 * page as canvases, then the rest. Each canvas is swapped for an encoded PNG,
 * which the browser can evict from memory when far away.
 *
 * The live canvas only shows before the first tiles exist and while lights
 * are being dragged; any other change redraws the tiles in place. It shows
 * without grain.
 */
export class BakedBackground {
  constructor(scene, root) {
    Object.assign(this, { scene, root, generation: 0, ready: false, revealed: false, armed: false, destroyed: false, tiles: [] });
    this.stats = { builds: 0, tiles: 0, encodedBytes: 0, cancelled: 0, tileDraws: 0, unencoded: 0, bakeMs: 0, firstViewMs: 0 };
    this.host = document.createElement('div');
    this.host.id = 'paper-background'; this.host.setAttribute('aria-hidden', 'true');
    this.host.style.visibility = 'hidden';
    scene.canvas.after(this.host);
    // Unlit papers beneath the live canvas and the tiles, showing wherever
    // neither has drawn yet.
    this.fallback = Object.assign(document.createElement('div'), { id: 'paper-fallback' });
    this.fallback.setAttribute('aria-hidden', 'true');
    scene.canvas.before(this.fallback);
    // The grain over the tiles, with patches for papers of another texture;
    // tiles go in before it.
    this.grain = Object.assign(document.createElement('div'), { className: 'paper-grain' });
    this.host.append(this.grain);
    this.bakeLayer = Object.assign(document.createElement('div'), { id: 'paper-bake' });
    this.bakeLayer.setAttribute('aria-hidden', 'true');
    this.host.before(this.bakeLayer);
    this.worker = Object.assign(document.createElement('canvas'), { className: 'paper-bake-worker', width: 1, height: 1 });
    this.bakeLayer.append(this.worker);
    scene.options.lightSpace = { height: innerHeight };
    scene.options.onInvalidate = () => this.invalidate();
    // Only until tiles cover the viewport: the live canvas is sticky, so it is
    // redrawn as the page moves under it.
    this.scroll = () => { if (!this.revealed) scene.schedule({ transient: true }); };
    // Resizing draws live, like dragging a light: tiles of the old layout
    // would tear against the new one, and a bake per frame cannot keep up.
    this.resize = () => {
      scene.options.lightSpace = { height: innerHeight };
      scene.setInteractive(true);
      scene.schedule();
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => scene.setInteractive(false, { redraw: false }), 200);
    };
    window.addEventListener('scroll', this.scroll, { passive: true });
    window.addEventListener('resize', this.resize);
    // The first bake waits for web fonts: text relief and layout depend on them.
    Promise.all([scene.ready, document.fonts?.ready]).then(() => { this.armed = true; this.invalidate(); }).catch(() => {});
  }

  invalidate() {
    if (this.destroyed) return;
    const generation = ++this.generation;
    this.ready = false;
    document.documentElement.dataset.paperBackground = 'live';
    // Dragging a light draws live; letting go invalidates again and bakes.
    if (this.scene.interactive || !this.revealed) this.showLive();
    if (this.scene.interactive || !this.armed) return;
    this.bake(generation).catch((error) => {
      if (generation !== this.generation || this.destroyed) return;
      this.showLive();
      this.scene.schedule({ transient: true });
      console.error('Paper background bake failed; using live rendering.', error);
    });
  }

  showLive() {
    this.revealed = false;
    this.host.style.visibility = 'hidden';
    this.scene.canvas.style.visibility = '';
    this.scene.paused = false;
    window.addEventListener('scroll', this.scroll, { passive: true });
  }

  reveal() {
    if (this.revealed) return;
    this.revealed = true;
    this.host.style.visibility = '';
    this.scene.canvas.style.visibility = 'hidden';
    this.scene.suspend();
    window.removeEventListener('scroll', this.scroll);
  }

  // The bake renderer, drawing the page as the live scene would now.
  renderer() {
    const source = this.scene;
    const options = {
      lightSpace: { ...source.options.lightSpace },
      surfaces: source.options.surfaces.map(surface => ({ ...surface })),
      effects: new Map([...(source.options.effects ?? [])].map(([element, effect]) => [element, { ...effect, randomness: effect.randomness?.slice() }])),
      inkStructure: source.options.inkStructure?.slice(),
      // Shared, not copied: it only measures the page and caches word boxes.
      textRelief: source.options.textRelief,
      grainOverlay: source.options.grainOverlay,
    };
    // One renderer for every bake: a new WebGL context per bake churns
    // contexts (and logs a context loss each time one is released).
    if (!this.workerRenderer) {
      this.workerRenderer = new PaperScene(this.worker, null, null, structuredClone(source.settings), { ...source.theme },
        { autoObserve: false, documentSpace: true, documentRoot: this.root, ...options });
    } else {
      this.workerRenderer.settings = structuredClone(source.settings);
      this.workerRenderer.theme = { ...source.theme };
      Object.assign(this.workerRenderer.options, options);
    }
    return this.workerRenderer;
  }

  layout() {
    const host = this.host.getBoundingClientRect();
    const height = Math.ceil(this.root.getBoundingClientRect().height);
    const dpr = Math.min(devicePixelRatio, 2);
    const tiles = Array.from({ length: Math.ceil(height / TILE_HEIGHT) }, (_, index) => {
      const top = index * TILE_HEIGHT, size = Math.min(TILE_HEIGHT, height - top);
      return { index, top, size, width: Math.round(host.width * dpr), height: Math.round(size * dpr) };
    });
    return { host, height, dpr, tiles };
  }

  // The scene's papers as the unlit fallback draws them (lib/paper/fallback.js),
  // in page coordinates. Returns where they are, to tell when the layout moved.
  layFallback() {
    const { surfaces, effects } = this.scene.options;
    const bounds = this.fallback.getBoundingClientRect();
    const top = new Map(surfaces.map((surface) => [surface.element, surface]));
    const rects = surfaces.map((surface) => this.scene.surfaceRect(surface, bounds, 1));
    this.fallback.replaceChildren(...surfaces.map((surface, index) => {
      if (!Number.isFinite(surface.lift)) throw new Error('Paper surfaces need a lift for the unlit fallback');
      const [left, y, width, height] = rects[index];
      // The podcast's top face is the effect's stock, as in the lit scene.
      const stock = top.get(surface.element) === surface ? effects?.get(surface.element)?.stock : null;
      const paper = document.createElement('div');
      Object.assign(paper.style, {
        left: `${left}px`, top: `${y}px`, width: `${width}px`, height: `${height}px`,
        background: stock ?? surface.color, borderRadius: `${surface.radius}px`, boxShadow: depthShadow(surface.lift),
      });
      return paper;
    }));
    this.layGrain(surfaces, rects, bounds);
    return JSON.stringify([bounds.width, bounds.height, devicePixelRatio, rects]);
  }

  // A patch for each paper whose grain strength differs from what shows
  // through from beneath, in the same pattern (positioned from the page's
  // origin) at the difference: stronger with the strong tiles, weaker with
  // the inverse ones.
  layGrain(surfaces, rects, bounds) {
    const layer = this.grain.getBoundingClientRect();
    const patches = [];
    surfaces.forEach((surface, index) => {
      if (surface.grainBelow === undefined) return;
      if (!Number.isFinite(surface.grain) || !Number.isFinite(surface.grainBelow)) throw new Error('Paper surfaces need grain strengths for the grain layer');
      const difference = surface.grain - surface.grainBelow;
      if (Math.abs(difference) < 0.005) return;
      const set = difference > 0 ? 'strong' : 'inverse';
      const opacity = Math.abs(difference) / Math.abs(GRAIN[set].strength);
      if (opacity > 1) throw new Error(`Paper grain strength ${surface.grain.toFixed(2)} is beyond the grain tiles' ${GRAIN.maxStrength}`);
      const [left, top, width, height] = rects[index];
      const x = left + bounds.left - layer.left, y = top + bounds.top - layer.top;
      const patch = document.createElement('div');
      patch.className = `paper-grain-${set}`;
      Object.assign(patch.style, { left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px`, borderRadius: `${surface.radius}px` });
      for (const tone of ['grain-dark', 'grain-light']) {
        const layerElement = document.createElement('div');
        layerElement.className = tone;
        Object.assign(layerElement.style, { opacity: String(opacity), backgroundPosition: `${-x}px ${-y}px` });
        patch.append(layerElement);
      }
      patches.push(patch);
    });
    this.grain.replaceChildren(...patches);
  }

  // Tiles ordered by distance from the viewport, in page pixels.
  byDistance(tiles) {
    const top = -this.host.getBoundingClientRect().top, bottom = top + innerHeight;
    const distance = (tile) => Math.max(0, tile.top - bottom, top - (tile.top + tile.size));
    return tiles.map((tile) => ({ tile, distance: distance(tile) })).sort((a, b) => a.distance - b.distance);
  }

  place(tile, element, generation) {
    element.classList.add('paper-tile');
    element.style.top = `${tile.top}px`;
    element.style.height = `${tile.size}px`;
    const previous = this.tiles[tile.index];
    if (previous) {
      previous.element.replaceWith(element);
      this.release(previous);
    } else {
      this.grain.before(element);
    }
    this.tiles[tile.index] = { element, generation, url: element.dataset.url };
  }

  release(entry) {
    if (entry.url) URL.revokeObjectURL(entry.url);
    if (entry.element instanceof HTMLCanvasElement) { entry.element.width = 0; entry.element.height = 0; }
  }

  // Drop tiles past the end of a page that got shorter.
  trim(count) {
    for (const entry of this.tiles.splice(count)) { entry.element.remove(); this.release(entry); }
  }

  viewportCovered(layout, generation) {
    return this.byDistance(layout.tiles).every(({ tile, distance }) => distance > 0 || this.tiles[tile.index]?.generation === generation);
  }

  async bake(generation) {
    const started = performance.now();
    const current = () => !this.destroyed && generation === this.generation;
    const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
    await this.scene.ready;
    if (!current()) return;
    const layout = this.layout();
    // Tiles from another layout would tear against this one: drop them, and
    // let the fallback show until their replacements are drawn. Tiles of the
    // same layout stay until redrawn (a lighting change shows the old light).
    const geometry = this.layFallback();
    if (geometry !== this.geometry && this.tiles.length) {
      this.trim(0);
      // The live canvas covers the viewport until its new tiles are drawn.
      if (this.revealed) { this.showLive(); this.scene.schedule({ transient: true }); }
    }
    this.trim(layout.tiles.length);
    this.geometry = geometry;

    const renderer = this.renderer();
    await renderer.ready;
    const blobs = new Array(layout.tiles.length);
    const encoding = new Set();
    let failure = null;
    for (;;) {
      await frame();
      if (failure) throw failure;
      if (!current()) { this.stats.cancelled++; return; }
      const missing = this.byDistance(layout.tiles.filter((tile) => this.tiles[tile.index]?.generation !== generation));
      if (!missing.length) break;
      const { tile, distance } = missing[0];
      const near = distance <= innerHeight * NEAR_VIEWPORTS;
      // One tile per frame, and only once the GPU has finished the last.
      if ((near || encoding.size < ENCODE_QUEUE) && !renderer.busy()) {
        this.drawTile(renderer, tile, generation);
        const job = this.encode(tile, generation, current)
          .then((blob) => { blobs[tile.index] = blob; })
          .catch((error) => { failure ??= error; })
          .finally(() => encoding.delete(job));
        encoding.add(job);
      }
      if (!this.revealed && this.viewportCovered(layout, generation)) {
        this.reveal();
        this.stats.firstViewMs = performance.now() - started;
      }
    }
    await Promise.all(encoding);
    if (failure) throw failure;
    if (!current()) { this.stats.cancelled++; return; }
    this.reveal();
    renderer.suspend();
    this.worker.width = 1; this.worker.height = 1;
    this.finish(started, layout, blobs.filter(Boolean));
  }

  finish(started, layout, blobs) {
    this.ready = true;
    this.stats.builds++;
    this.stats.tiles = layout.tiles.length;
    this.stats.encodedBytes = blobs.reduce((sum, blob) => sum + blob.size, 0);
    this.stats.bakeMs = performance.now() - started;
    document.documentElement.dataset.paperBackground = 'ready';
  }

  drawTile(renderer, tile, generation) {
    this.worker.style.top = `${tile.top}px`;
    this.worker.style.height = `${tile.size}px`;
    renderer.draw();
    if (this.worker.width !== tile.width || this.worker.height !== tile.height) {
      throw Error(`Paper bake drew ${this.worker.width}×${this.worker.height} for a ${tile.width}×${tile.height} tile`);
    }
    // Copy now: the WebGL drawing buffer is not preserved past this task.
    const canvas = Object.assign(document.createElement('canvas'), { width: tile.width, height: tile.height });
    canvas.getContext('2d', { alpha: false }).drawImage(this.worker, 0, 0);
    this.place(tile, canvas, generation);
    this.stats.tileDraws++;
  }

  // Swap a drawn tile's canvas for its PNG once encoded and decoded.
  // A tile that cannot be encoded (the browser out of blob memory) stays a
  // canvas: drawn and correct, only not evictable. Resolves to the blob, or
  // null.
  async encode(tile, generation, current) {
    const canvas = this.tiles[tile.index].element;
    let blob, image;
    try {
      blob = await new Promise((resolve, reject) => canvas.toBlob((value) => (value ? resolve(value) : reject(Error('Cannot encode paper background'))), 'image/png'));
      if (!current()) return blob;
      image = this.image(blob);
      await image.decode();
    } catch (error) {
      if (image) URL.revokeObjectURL(image.dataset.url);
      console.warn('Paper tile kept as a canvas: it could not be encoded.', error);
      this.stats.unencoded++;
      return null;
    }
    if (current() && this.tiles[tile.index]?.element === canvas) this.place(tile, image, generation);
    else URL.revokeObjectURL(image.dataset.url);
    return blob;
  }

  image(blob) {
    const image = new Image();
    image.alt = ''; image.draggable = false; image.decoding = 'async';
    image.dataset.url = image.src = URL.createObjectURL(blob);
    return image;
  }

  destroy() {
    this.destroyed = true; this.generation++; clearTimeout(this.resizeTimer);
    window.removeEventListener('scroll', this.scroll); window.removeEventListener('resize', this.resize);
    this.workerRenderer?.destroy(); this.workerRenderer = null;
    this.trim(0);
    this.host.remove();
    this.bakeLayer.remove();
    this.fallback.remove();
    this.scene.options.onInvalidate = null;
  }
}
