import { PaperScene } from './paper-scene.js';

/** Lossless page-space tiles: the browser compositor handles ordinary scrolling. */
export class BakedBackground {
  constructor(scene, root) {
    Object.assign(this, { scene, root, generation: 0, ready: false, urls: [], destroyed: false });
    this.stats = { builds: 0, tiles: 0, encodedBytes: 0, cancelled: 0 };
    this.host = document.createElement('div');
    this.host.id = 'paper-background'; this.host.setAttribute('aria-hidden', 'true');
    scene.canvas.after(this.host);
    scene.options.lightSpace = { height: innerHeight };
    scene.options.onInvalidate = () => this.invalidate();
    this.scroll = () => { if (!this.ready) scene.schedule({ transient: true }); };
    this.resize = () => { scene.options.lightSpace = { height: innerHeight }; scene.schedule(); };
    window.addEventListener('scroll', this.scroll, { passive: true });
    window.addEventListener('resize', this.resize);
    this.visibility = () => { if (document.hidden && !this.ready) { this.generation++; clearTimeout(this.timer); } };
    document.addEventListener('visibilitychange', this.visibility);
    scene.ready.then(() => this.invalidate()).catch(() => {});
  }

  invalidate() {
    if (this.destroyed) return;
    this.generation++;
    clearTimeout(this.timer);
    this.ready = false;
    window.addEventListener('scroll', this.scroll, { passive: true });
    this.scene.paused = false;
    this.host.hidden = true;
    this.scene.canvas.style.visibility = '';
    document.documentElement.dataset.paperBackground = 'live';
    // While dragging, show live lighting. Bake only after the changes settle.
    if (!document.hidden) this.timer = setTimeout(() => this.bake(this.generation), 120);
  }

  async bake(generation) {
    if (this.destroyed || generation !== this.generation || !this.scene.program) return;
    const started=performance.now();
    const worker = document.createElement('canvas');
    worker.className = 'paper-bake-worker';
    const height = Math.ceil(this.root.getBoundingClientRect().height), tileHeight = 1024;
    const count = Math.ceil(height / tileHeight), images = new Array(count), urls = [];
    let encodedBytes=0;
    const visibleTop = Math.max(0, -this.root.getBoundingClientRect().top);
    const visibleBottom = visibleTop + innerHeight;
    const order = [...Array(count).keys()].sort((a,b) => Number(b*tileHeight<visibleBottom&&(b+1)*tileHeight>visibleTop)-Number(a*tileHeight<visibleBottom&&(a+1)*tileHeight>visibleTop));
    worker.style.top = `${order[0]*tileHeight}px`;
    worker.style.height = `${Math.min(tileHeight,height-order[0]*tileHeight)}px`;
    this.host.append(worker);
    // The host stays in layout while baking so its worker has real page coordinates.
    this.host.hidden = false; this.host.style.visibility = 'hidden';
    const source = this.scene;
    const renderer = new PaperScene(worker, null, null, structuredClone(source.settings), { ...source.theme }, {
      autoObserve: false, documentSpace: true, documentRoot: this.root,
      lightSpace: { ...source.options.lightSpace },
      surfaces: source.options.surfaces.map(surface => ({ ...surface })),
      effects: new Map([...(source.options.effects ?? [])].map(([element,effect]) => [element,{...effect,randomness:effect.randomness?.slice()}])),
      inkStructure: source.options.inkStructure?.slice(),
      // Shared, not copied: it only measures the page and caches word boxes.
      textRelief: source.options.textRelief
    });
    this.workerRenderer = renderer;
    const current = () => !this.destroyed && generation === this.generation;
    try {
      await renderer.ready;
      for (const index of order) {
        if (!current()) { this.stats.cancelled++; return; }
        const top=index*tileHeight, size=Math.min(tileHeight,height-top);
        worker.style.top=`${top}px`; worker.style.height=`${size}px`;
        renderer.draw();
        // Capture immediately after drawing: no preserved WebGL buffer is needed.
        const blob = await new Promise((resolve,reject) => worker.toBlob(value => value ? resolve(value) : reject(Error('Cannot encode paper background')), 'image/png'));
        if (!current()) { this.stats.cancelled++; return; }
        const url=URL.createObjectURL(blob); urls.push(url); encodedBytes+=blob.size;
        const image=new Image(); image.alt=''; image.draggable=false;
        image.style.top=`${top}px`; image.style.height=`${size}px`;
        // Every tile is decoded before the swap: a lazily loaded tile shows the
        // bare desk for a moment when it scrolls into view (flicker).
        image.decoding='async'; image.src=url;
        images[index]=image;
      }
      await Promise.all(images.map(image=>image.decode()));
      if (!current()) { this.stats.cancelled++; return; }
      this.host.replaceChildren(...images);
      this.urls.forEach(URL.revokeObjectURL); this.urls=urls.splice(0);
      this.stats.builds++; this.stats.tiles=count;
      this.stats.encodedBytes=encodedBytes; this.stats.bakeMs=performance.now()-started;
      if (!current()) return;
      this.host.hidden=false; this.host.style.visibility='';
      this.scene.canvas.style.visibility='hidden'; this.scene.suspend();
      this.ready=true; window.removeEventListener('scroll',this.scroll);
      document.documentElement.dataset.paperBackground='ready';
    } catch(error) {
      if (current()) { this.host.hidden=true; this.host.style.visibility=''; this.scene.paused=false; this.scene.schedule({transient:true}); console.error('Paper background bake failed; using live rendering.',error); }
    } finally {
      urls.forEach(URL.revokeObjectURL); worker.remove(); renderer.destroy();
      if (this.workerRenderer===renderer) this.workerRenderer=null;
    }
  }

  destroy() {
    this.destroyed=true; this.generation++; clearTimeout(this.timer);
    window.removeEventListener('scroll',this.scroll); window.removeEventListener('resize',this.resize);
    this.workerRenderer?.destroy(); this.urls.forEach(URL.revokeObjectURL); this.host.remove();
    document.removeEventListener('visibilitychange',this.visibility);
    this.scene.options.onInvalidate=null;
  }
}
