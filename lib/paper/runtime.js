import { PaperScene, MAX_PAPER_SURFACES, SHADOW_MARGIN } from './paper-scene';
import { TextRelief } from './text-relief';
import { TYPOGRAPHY_KEY, elementTypes, allowsPaper, allowsRelief, loadTypography, paperFor, typographyCss, validTypography } from './typography';
import { BakedBackground } from './baked-background';
import { LightingPanel } from './lighting-panel';
import { colorOf, inkAgainst, inkProperties } from './fallback';
import { palette, nodes, defaultLighting, defaultPodcastGreen, defaultPostInk, podcastEffect, projectPaper, DESK_HEIGHT, GRAIN } from './materials';
import { defaultLayout, loadSavedLayout, paperSelector } from './layout';

const STORAGE_KEY = 'jimmyhmiller-paper-lighting-v1';
export const GREEN_KEY = 'jimmyhmiller-paper-podcast-green-v1';
export const POST_INK_KEY = 'jimmyhmiller-paper-post-ink-v1';
const validPostInk = (value) => value === 'auto' || /^#[0-9a-f]{6}$/i.test(value);
// --ink-body is restated because post prose reads it, and a custom property
// resolved on the post sheet would otherwise keep the sheet's ink inside a
// darker paper.
const INK_PROPERTIES = ['color', '--ink', '--ink-body', '--quiet', '--line'];
const POST_INK_TONES = ['--ink-body', '--ink-soft', '--ink-mute'];

// Too many paper surfaces would meet in one draw (see densestDraw).
export class PaperBudgetError extends Error {
  name = 'PaperBudgetError';
}

const clampHeight = (value) => Math.max(0, Math.min(64, value));

function validSettings(value) {
  const bounded = (n, lo, hi) => Number.isFinite(n) && n >= lo && n <= hi;
  return value && bounded(value.depth, 0, 1.5) && bounded(value.grain, 0, 2)
    && bounded(value.paperHeight, 0.25, 1.3) && bounded(value.relief, 0, 0.85)
    && Array.isArray(value.lights) && value.lights.length >= 1 && value.lights.length <= 4
    && value.lights.every((light) => bounded(light.x, -1, 2) && bounded(light.y, -1, 2)
      && bounded(light.height, 200, 2000) && bounded(light.intensity, 0, 2)
      && (light.mutedIntensity === undefined || bounded(light.mutedIntensity, 0, 2))
      && (light.type === undefined || ['point', 'distributed'].includes(light.type)))
    && Number.isInteger(value.selected) && value.selected >= 0 && value.selected < value.lights.length;
}

// Resolve a `data-paper` value to its node spec. Unknown names are a bug in
// the page markup, so they fail loudly rather than rendering a guess.
export function nodeSpec(name) {
  if (name.startsWith('project:')) return projectPaper(name.slice('project:'.length)).sheet;
  if (name.startsWith('project-well:')) return projectPaper(name.slice('project-well:'.length)).well;
  const spec = nodes[name];
  if (!spec) throw new Error(`Unknown paper node "${name}" (define it in lib/paper/materials.js)`);
  return spec;
}

const panelMarkup = `<div class="lighting-sheet">
<header class="lighting-heading"><div><h2 id="settings-title">Lighting</h2><p>Point lights repeat gently down the page. Drag to shape the shadows.</p></div><button aria-label="Close lighting" id="close-settings"><svg aria-hidden="true" fill="none" height="20" stroke="currentColor" stroke-width="1.3" viewBox="0 0 20 20" width="20"><path d="m5 5 10 10M15 5 5 15"></path></svg></button></header>
<div class="lighting-map-label"><span>Light positions</span></div>
<div class="lighting-map" id="study-light-pad"><div aria-hidden="true" class="lighting-page"><div></div><div></div><i></i><i></i><i></i></div><div id="light-points"></div></div>
<div class="lighting-sources-heading"><span>Your lights</span><button id="add-light">+ Add a light</button></div>
<div class="lighting-cards" id="lighting-cards"></div>
<details class="lighting-surface"><summary>Paper &amp; surface <span aria-hidden="true">+</span></summary><div class="lighting-surface-controls">
<label class="lighting-range">Shadow relief <output id="depth-value"></output><input id="light-depth" max="1.5" min="0" step=".01" type="range"></label>
<label class="lighting-range">Paper height <output id="paper-height-value"></output><input id="paper-height" max="1.3" min=".25" step=".01" type="range"></label>
</div></details>
<footer class="lighting-footer"><button id="reset-lighting">Restore lighting</button></footer><p id="render-status" role="status"></p></div>`;

export class PaperRuntime {
  constructor({ canvas, root }) {
    this.root = root;
    this.settings = structuredClone(defaultLighting);
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved?.version === 1 && validSettings(saved.settings)) this.settings = saved.settings;
    } catch { /* Unavailable or malformed storage leaves the accepted defaults. */ }
    // Layout edits made with the dev tools persist in this browser and apply
    // on every page, without loading the tools themselves.
    this.defaultLayout = defaultLayout();
    this.layout = loadSavedLayout() ?? structuredClone(this.defaultLayout);
    this.green = structuredClone(defaultPodcastGreen);
    try {
      const saved = JSON.parse(localStorage.getItem(GREEN_KEY));
      if (saved && typeof saved === 'object') this.green = { ...this.green, ...saved };
    } catch { /* Start with the accepted ink. */ }
    this.postInk = defaultPostInk;
    try {
      const saved = JSON.parse(localStorage.getItem(POST_INK_KEY));
      if (saved?.version === 1 && validPostInk(saved.color)) this.postInk = saved.color;
    } catch { /* Start with the sheet's ink. */ }
    this.typography = loadTypography();
    this.typeSheet = document.createElement('style');
    this.typeSheet.id = 'paper-typography';
    this.typeSheet.textContent = typographyCss(this.typography);
    document.head.append(this.typeSheet);
    this.applied = new Set();
    this.resolved = new Map();
    this.events = new EventTarget();

    this.dialog = document.createElement('dialog');
    this.dialog.id = 'paper-settings';
    this.dialog.className = 'lighting-panel';
    this.dialog.setAttribute('aria-labelledby', 'settings-title');
    this.dialog.innerHTML = panelMarkup;
    document.body.append(this.dialog);

    // Before the WebGL context exists: from here the page's grain layer is
    // hidden (styles/globals.css #paper-grain), as Safari would not blend it
    // over the canvas.
    document.documentElement.dataset.lighting = 'starting';
    this.scene = new PaperScene(canvas, null, null, this.settings, { desk: palette.desk }, {
      surfaces: [], documentSpace: true, documentRoot: root, effects: new Map(), grainOverlay: true,
      onState: (state) => {
        document.documentElement.dataset.lighting = state;
        if (state === 'ready') document.documentElement.removeAttribute('data-paper-boot');
      },
      onError: (error) => this.fail(error),
    });
    this.refresh();
    this.background = new BakedBackground(this.scene, root);

    this.lighting = new LightingPanel({
      getSettings: () => this.settings,
      onChange: () => { this.interacting(); this.scene.schedule(); this.save(); },
      reset: () => {
        this.settings = structuredClone(defaultLighting);
        this.scene.settings = this.settings;
        this.materialsChanged();
      },
    });
    this.materialsChanged();
    this.scene.ready.catch((error) => this.fail(error));

    this.pageshow = () => { if (!this.background.ready) this.scene.schedule(); };
    window.addEventListener('pageshow', this.pageshow);

    // Layout and pattern tools from the paper-test homepage, hidden by default:
    //   window.devTools.show()  reveal the inspector, section explorer, green lab and post ink
    //   window.devTools.hide()  close them (lighting stays available)
    //   window.devTools.stats   renderer counters
    // Visibility is not persisted; edits are (see lib/paper/layout.js).
    const runtime = this;
    window.devTools = Object.freeze({
      show() { return runtime.showDevTools(); },
      hide() { runtime.hideDevTools(); },
      get visible() { return document.documentElement.dataset.devTools === 'visible'; },
      // Renderer counters: live draws, and the baked background's tiles and timings.
      get stats() { return { live: { ...runtime.scene.stats }, baked: { ...runtime.background.stats } }; },
    });
    // A runtime replaced while the tools are showing (a code edit in
    // development) brings them back bound to itself.
    if (document.documentElement.dataset.devTools === 'visible') this.showDevTools();
  }

  // Lighting edits arrive as a stream while a light is dragged or a slider
  // moves; the scene draws cheaply until they stop (PaperScene.setInteractive).
  interacting() {
    this.scene.setInteractive(true);
    clearTimeout(this.interactionTimer);
    // The bake replaces the live canvas at full resolution; drawing a full
    // resolution live frame first would only delay it.
    this.interactionTimer = setTimeout(() => this.scene.setInteractive(false, { redraw: false }), 200);
  }

  showDevTools() {
    document.documentElement.dataset.devTools = 'visible';
    this.devTools ??= import('./devtools').then(({ mountDevTools }) => {
      // A runtime destroyed while the tools were loading never mounts them.
      return this.destroyed ? null : mountDevTools(this);
    });
    this.devTools.catch((error) => console.error('Paper dev tools failed to load', error));
    return this.devTools;
  }

  hideDevTools() {
    this.devTools?.then((tools) => tools?.close());
    delete document.documentElement.dataset.devTools;
  }

  // The nearest ancestor that clips its overflow, such as the scrolling
  // wrapper of a wide table: paper never shows past what the page shows.
  clipFor(element) {
    for (let ancestor = element.parentElement; ancestor && ancestor !== this.root; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      if (style.overflowX !== 'visible' || style.overflowY !== 'visible') return ancestor;
    }
    return null;
  }

  get palette() {
    return palette;
  }

  color(name) {
    return colorOf(name, this.palette);
  }

  // Keeps the previous layout, and rethrows, if the new one cannot render
  // (for example a PaperBudgetError).
  setLayout(state) {
    const previous = this.layout;
    this.layout = state;
    try {
      this.refresh();
    } catch (error) {
      this.layout = previous;
      this.refresh();
      throw error;
    }
  }

  // Resolve the layout's nodes against the current page and rebuild the
  // scene's surfaces. Nodes whose element is not on this page are skipped.
  // Call after anything changes which papers exist or what they use (route
  // changes, project switching, layout edits).
  refresh() {
    const find = (selector) => {
      try { return this.root.querySelector(selector); } catch { return null; }
    };
    const depth = (element) => { let n = 0; for (let p = element; p !== this.root; p = p.parentElement) n++; return n; };
    const entries = Object.entries(this.layout.nodes)
      .map(([selector, node]) => ({ selector, node, element: find(selector) }))
      .filter((entry) => entry.element instanceof HTMLElement);
    // Post elements on their own paper: the design's (materials.js
    // postPapers) or the type tool's (typography.js).
    // A paper picked for one element in the layout editor takes precedence.
    const placed = new Set(entries.map((entry) => entry.element));
    for (const type of elementTypes) {
      if (!allowsPaper(type)) continue;
      const paper = paperFor(type, this.typography.elements[type.key]);
      if (!paper) continue;
      for (const element of this.postElements(type)) {
        if (placed.has(element)) continue;
        placed.add(element);
        entries.push({ selector: `type:${type.key}`, element, typeSpec: { radius: paper.radius, ink: true },
          node: { layer: 'paper', color: paper.color, offset: paper.offset, relief: paper.relief, stack: structuredClone(paper.stack ?? []) } });
      }
    }
    entries.sort((a, b) => depth(a.element) - depth(b.element));
    for (const element of this.root.querySelectorAll('[data-paper]')) {
      if (!Object.hasOwn(this.layout.nodes, paperSelector(element.dataset.paper))) nodeSpec(element.dataset.paper);
    }

    const resolved = new Map();
    const surfaces = [];
    const effects = this.scene.options.effects;
    effects.clear();
    this.scene.options.inkStructure = [0, 0];
    const applied = new Set();
    for (const { selector, node, element, typeSpec } of entries) {
      applied.add(element);
      const spec = typeSpec ?? (element.dataset.paper && selector === paperSelector(element.dataset.paper) ? nodeSpec(element.dataset.paper) : null);
      let ancestor = element.parentElement;
      while (ancestor && !resolved.has(ancestor)) ancestor = ancestor.parentElement;
      const parent = resolved.get(ancestor) ?? { height: DESK_HEIGHT, color: palette.desk, grain: GRAIN.deskStrength };
      element.classList.remove('green-dark-stock');
      if (node.layer === 'inherit') {
        resolved.set(element, parent);
        element.style.removeProperty('--surface-color');
        this.ink(element, parent.color);
        continue;
      }
      const layer = this.layout.layers.find((candidate) => candidate.id === node.layer);
      const offset = node.offset ?? layer.offset;
      const stock = node.color === 'auto' ? layer.color : node.color;
      const relief = node.relief ?? this.settings.relief;
      const radius = spec?.radius ?? 0.7;
      // `lift`: height above (or below) what the face rests on, for the
      // unlit fallback's shadows (lib/paper/fallback.js).
      const height = clampHeight(parent.height + offset);
      const clip = this.clipFor(element);
      // Texture is grain strength (materials.js GRAIN); `grainBelow` is what
      // shows through from beneath, which the page's grain patch corrects.
      const grain = relief / GRAIN.referenceRelief;
      const base = { element, height, lift: height - parent.height, color: stock === 'inherit' ? parent.color : this.color(stock), relief, radius, clip, grain, grainBelow: parent.grain };
      surfaces.push(base);
      let face = base;
      let inset = 0;
      for (const step of node.stack ?? []) {
        inset += step.inset;
        const stepHeight = clampHeight(face.height + step.offset);
        face = { element, height: stepHeight, lift: stepHeight - face.height, color: step.color === 'inherit' ? face.color : this.color(step.color), relief, radius, inset, clip, grain };
        surfaces.push(face);
      }
      if (spec?.effect === 'podcast-halo') {
        const focus = element.querySelector('.podcast-art');
        if (!focus) throw new Error('podcast-halo paper requires a .podcast-art element to centre its ink');
        const { inkStructure, ...effect } = podcastEffect(this.green);
        effects.set(element, { ...effect, focus });
        this.scene.options.inkStructure = inkStructure;
        if (effect.stock) {
          face = { ...face, color: effect.stock };
          element.classList.add('green-dark-stock');
        }
      } else if (spec?.effect) {
        throw new Error(`Unknown paper effect "${spec.effect}"`);
      }
      resolved.set(element, face);
      element.style.setProperty('--surface-color', face.color);
      if (!spec || typeSpec) element.dataset.paperNode = '';
      // Papers whose text color comes from CSS keep it until they are edited.
      const untouched = spec && !typeSpec && JSON.stringify(node) === JSON.stringify(this.defaultLayout.nodes[selector]);
      if (untouched && !spec.ink) for (const property of INK_PROPERTIES) element.style.removeProperty(property);
      else this.ink(element, face.color);
    }
    for (const element of this.applied) {
      if (applied.has(element)) continue;
      for (const property of [...INK_PROPERTIES, '--surface-color']) element.style.removeProperty(property);
      element.classList.remove('green-dark-stock');
      delete element.dataset.paperNode;
    }
    this.applied = applied;
    this.resolved = resolved;
    this.applyPostInk();
    const densest = this.densestDraw(surfaces);
    if (densest > MAX_PAPER_SURFACES) {
      throw new PaperBudgetError(`Up to ${densest} paper surfaces would share one draw on this page; the renderer handles ${MAX_PAPER_SURFACES}. Remove some paper, or keep it to fewer elements.`);
    }
    this.scene.options.textRelief = this.textRelief();
    this.scene.setSurfaces(surfaces);
    this.scene.schedule();
    this.events.dispatchEvent(new Event('refresh'));
  }

  // Every element of a post element type on this page.
  postElements(type) {
    const selector = type.selector.split(',').map((part) => `.post-sheet ${part.trim()}`).join(', ');
    return [...this.root.querySelectorAll(selector)].filter((element) => element instanceof HTMLElement);
  }

  textRelief() {
    const items = new Map();
    for (const type of elementTypes) {
      const relief = this.typography.elements[type.key]?.relief;
      if (!relief || !allowsRelief(type)) continue;
      for (const element of this.postElements(type)) items.set(element, { element, relief: relief.relief, spread: relief.spread });
    }
    return items.size ? new TextRelief(this.root, [...items.values()]) : null;
  }

  // The most paper surfaces any one draw (the viewport or a baked tile, plus
  // shadow reach) can meet on this page. The renderer handles MAX_PAPER_SURFACES.
  densestDraw(surfaces) {
    const page = this.root.getBoundingClientRect();
    const reach = SHADOW_MARGIN * (page.width / 1280);
    const span = Math.max(innerHeight, 1024) + reach * 2;
    const spans = surfaces.map((surface) => {
      const r = surface.element.getBoundingClientRect();
      return [r.top - page.top, r.bottom - page.top];
    });
    let densest = 0;
    for (const [top] of spans) {
      densest = Math.max(densest, spans.filter(([a, b]) => b > top && a < top + span).length);
    }
    return densest;
  }

  // Type tool state (lib/paper/typography.js). Throws PaperBudgetError, and
  // keeps the previous state, if a draw would meet too many paper surfaces.
  setTypography(state) {
    if (!validTypography(state)) throw new Error('Invalid typography state');
    const previous = this.typography;
    this.typography = state;
    this.typeSheet.textContent = typographyCss(state);
    try {
      this.refresh();
    } catch (error) {
      this.typography = previous;
      this.typeSheet.textContent = typographyCss(previous);
      this.refresh();
      throw error;
    }
    try { localStorage.setItem(TYPOGRAPHY_KEY, JSON.stringify(state)); } catch { /* Works without storage. */ }
  }

  setGreen(green) {
    this.green = green;
    try { localStorage.setItem(GREEN_KEY, JSON.stringify(green)); } catch { /* Works without storage. */ }
    this.refresh();
  }

  // The post's text color (title, headings, prose, quotes, footnotes) only
  // affects DOM text, so the scene is untouched. Code keeps its own tints.
  setPostInk(color) {
    if (!validPostInk(color)) throw new Error(`Post ink must be 'auto' or a six-digit hex color, got ${color}`);
    this.postInk = color;
    try { localStorage.setItem(POST_INK_KEY, JSON.stringify({ version: 1, color })); } catch { /* Works without storage. */ }
    this.applyPostInk();
  }

  applyPostInk() {
    for (const sheet of this.root.querySelectorAll('.post-sheet')) {
      const face = this.resolved.get(sheet);
      for (const property of POST_INK_TONES) sheet.style.removeProperty(property);
      if (!face) {
        for (const property of INK_PROPERTIES) sheet.style.removeProperty(property);
        continue;
      }
      if (this.postInk === 'auto') {
        this.ink(sheet, face.color);
        continue;
      }
      this.setInk(sheet, this.postInk);
      // The softer tones (h4, captions, footnotes, list markers) follow the
      // chosen ink, faded toward the paper like the defaults are.
      sheet.style.setProperty('--ink-soft', `color-mix(in srgb, ${this.postInk} 85%, ${face.color})`);
      sheet.style.setProperty('--ink-mute', `color-mix(in srgb, ${this.postInk} 62%, ${face.color})`);
    }
  }

  // The palette ink with the most contrast against a paper color.
  inkFor(color) {
    return inkAgainst(color, this.palette);
  }

  ink(element, color) {
    this.setInk(element, this.inkFor(color));
  }

  setInk(element, ink) {
    for (const [property, value] of Object.entries(inkProperties(ink))) element.style.setProperty(property, value);
  }

  // Changes page content and its paper in one step. `update` changes the DOM
  // synchronously (and may return a promise for anything else the new content
  // needs to show, such as decoded images). The page keeps showing its old
  // frame until the new content's light covers the viewport, then both appear
  // together; otherwise the new text would show for a few frames over the old
  // light, and the sheet would update one tile at a time. Before the first
  // bake (or without view transitions) the change shows at once.
  async transition(update) {
    if (!document.startViewTransition || !this.background.armed || document.hidden) {
      await update();
      return;
    }
    // While a view transition is active the browser sends every click to the
    // root element, so a click in that time (another project, a link) would be
    // lost. The last one is delivered to what is under it once the new frame
    // shows.
    let missed = null;
    const record = (event) => {
      if (event.target === document.documentElement) missed = { x: event.clientX, y: event.clientY };
    };
    document.addEventListener('click', record, true);
    const transition = document.startViewTransition(async () => {
      const release = this.background.hold();
      try {
        await update();
        await this.background.whenViewportCovered();
      } finally {
        release();
      }
    });
    // A transition skipped for another one starting is expected; anything else
    // (a timeout) means the page's light never caught up.
    transition.ready.catch((error) => {
      if (error.name !== 'AbortError') console.error('Paper transition did not complete', error);
    });
    try {
      await transition.updateCallbackDone;
      await transition.finished;
    } finally {
      document.removeEventListener('click', record, true);
    }
    if (missed) document.elementFromPoint(missed.x, missed.y)?.click();
  }

  materialsChanged() {
    this.refresh();
    this.save();
  }

  save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, settings: this.settings })); }
    catch { /* Rendering and controls remain usable without persistence. */ }
  }

  openLighting() {
    this.lighting.open();
  }

  destroy() {
    this.destroyed = true;
    this.devTools?.then((tools) => tools?.destroy());
    clearTimeout(this.interactionTimer);
    window.removeEventListener('pageshow', this.pageshow);
    delete window.devTools;
    this.lighting.destroy();
    this.typeSheet.remove();
    this.background.destroy();
    this.scene.destroy();
    this.dialog.remove();
  }

  fail(error) {
    document.documentElement.removeAttribute('data-paper-boot');
    document.documentElement.dataset.lighting = 'unavailable';
    const status = this.dialog.querySelector('#render-status');
    status.textContent = error.message;
    console.error(error);
  }
}
