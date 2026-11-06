import { PaperScene, MAX_PAPER_SURFACES, SHADOW_MARGIN } from './paper-scene';
import { TextRelief } from './text-relief';
import { TYPOGRAPHY_KEY, elementTypes, allowsPaper, allowsRelief, loadTypography, typographyCss, validTypography } from './typography';
import { BakedBackground } from './baked-background';
import { LightingPanel } from './lighting-panel';
import { contrast } from './color';
import { palette, nodes, defaultLighting, defaultPodcastGreen, defaultPostInk, podcastEffect, projectPaper, DESK_HEIGHT } from './materials';
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

const balances = {
  balanced: { sage: palette.sage, mist: palette.mist, flax: palette.flax },
  cool: { sage: '#d3dfd4', mist: '#d1e1de', flax: '#cdd9cb' },
  warm: { sage: '#d8ddc0', mist: '#d5dfd5', flax: '#ecdfba' },
};

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

const panelMarkup = `
<header class="lighting-heading"><div><h2 id="settings-title">Lighting</h2><p>Point lights repeat gently down the page. Drag to shape the shadows.</p></div><button aria-label="Close lighting" id="close-settings"><svg aria-hidden="true" fill="none" height="20" stroke="currentColor" stroke-width="1.3" viewBox="0 0 20 20" width="20"><path d="m5 5 10 10M15 5 5 15"></path></svg></button></header>
<div class="lighting-map-label"><span>Light positions</span><span>The sheet marks the page</span></div>
<div class="lighting-map" id="study-light-pad"><div aria-hidden="true" class="lighting-page"><div></div><div></div><i></i><i></i><i></i></div><div id="light-points"></div><span aria-hidden="true" class="map-boundary map-boundary-top">ABOVE THE PAGE</span><span aria-hidden="true" class="map-boundary map-boundary-bottom">BELOW THE PAGE</span></div>
<div class="lighting-sources-heading"><span>Your lights</span><button id="add-light">+ Add a light</button></div>
<div class="lighting-cards" id="lighting-cards"></div>
<details class="lighting-surface"><summary>Paper &amp; surface <span aria-hidden="true">+</span></summary><div class="lighting-surface-controls">
<label class="lighting-range">Shadow relief <output id="depth-value"></output><input id="light-depth" max="1.5" min="0" step=".01" type="range"></label>
<label class="lighting-range">Paper height <output id="paper-height-value"></output><input id="paper-height" max="1.3" min=".25" step=".01" type="range"></label>
<label class="lighting-range">Texture <output id="texture-value"></output><input id="texture-relief" max=".85" min="0" step=".01" type="range"></label>
</div><div class="lighting-palette"><label for="material-balance">Secondary papers</label><select id="material-balance"><option value="balanced">Balanced</option><option value="cool">Cool · more mist</option><option value="warm">Warm · more flax</option></select><div class="palette-swatches" id="palette-swatches"></div></div></details>
<footer class="lighting-footer"><button id="reset-lighting">Restore lighting</button></footer><p id="render-status" role="status"></p>`;

export class PaperRuntime {
  constructor({ canvas, root }) {
    this.root = root;
    this.settings = structuredClone(defaultLighting);
    this.balance = 'balanced';
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved?.version === 1 && validSettings(saved.settings)) this.settings = saved.settings;
      if (Object.hasOwn(balances, saved?.balance)) this.balance = saved.balance;
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

    this.scene = new PaperScene(canvas, null, null, this.settings, { desk: palette.desk }, {
      surfaces: [], documentSpace: true, documentRoot: root, effects: new Map(),
      onState: (state) => {
        document.documentElement.dataset.lighting = state;
        if (state === 'ready') document.documentElement.removeAttribute('data-paper-boot');
      },
      onError: (error) => this.fail(error),
    });
    this.refresh();
    this.background = new BakedBackground(this.scene, root);

    this.dialog.querySelector('#material-balance').addEventListener('change', (event) => {
      this.balance = event.target.value;
      this.materialsChanged();
    });
    this.lighting = new LightingPanel({
      getSettings: () => this.settings,
      onChange: () => { this.scene.schedule(); this.save(); },
      onMaterialChange: () => this.materialsChanged(),
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
    // Visibility is not persisted; edits are (see lib/paper/layout.js).
    const runtime = this;
    window.devTools = Object.freeze({
      show() { return runtime.showDevTools(); },
      hide() { runtime.hideDevTools(); },
      get visible() { return document.documentElement.dataset.devTools === 'visible'; },
    });
    // A runtime replaced while the tools are showing (a code edit in
    // development) brings them back bound to itself.
    if (document.documentElement.dataset.devTools === 'visible') this.showDevTools();
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

  get palette() {
    return { ...palette, ...balances[this.balance] };
  }

  color(name) {
    const colors = this.palette;
    if (Object.hasOwn(colors, name)) return colors[name];
    if (/^#[0-9a-f]{6}$/i.test(name)) return name;
    throw new Error(`Unknown paper color "${name}"`);
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
    // Post elements given their own paper in the type tool (typography.js).
    // A paper picked for one element in the layout editor takes precedence.
    const placed = new Set(entries.map((entry) => entry.element));
    for (const type of elementTypes) {
      const paper = this.typography.elements[type.key]?.paper;
      if (!paper || !allowsPaper(type)) continue;
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
      const parent = resolved.get(ancestor) ?? { height: DESK_HEIGHT, color: palette.desk };
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
      const base = { element, height: clampHeight(parent.height + offset), color: stock === 'inherit' ? parent.color : this.color(stock), relief, radius };
      surfaces.push(base);
      let face = base;
      let inset = 0;
      for (const step of node.stack ?? []) {
        inset += step.inset;
        face = { element, height: clampHeight(face.height + step.offset), color: step.color === 'inherit' ? face.color : this.color(step.color), relief, radius, inset };
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
    const colors = this.palette;
    return contrast(colors.ink, color) >= contrast(colors.cream, color) ? colors.ink : colors.cream;
  }

  ink(element, color) {
    this.setInk(element, this.inkFor(color));
  }

  setInk(element, ink) {
    element.style.color = ink;
    element.style.setProperty('--ink', ink);
    element.style.setProperty('--ink-body', ink);
    element.style.setProperty('--quiet', ink);
    const channels = [1, 3, 5].map((index) => parseInt(ink.slice(index, index + 2), 16));
    element.style.setProperty('--line', `rgba(${channels.join(',')},.25)`);
  }

  materialsChanged() {
    const colors = this.palette;
    for (const role of ['sage', 'mist', 'flax']) document.documentElement.style.setProperty(`--${role}`, colors[role]);
    this.dialog.querySelector('#material-balance').value = this.balance;
    this.dialog.querySelector('#palette-swatches').replaceChildren(...['desk', 'cream', 'sage', 'mist', 'flax', 'ink'].map((role) => {
      const item = document.createElement('div');
      item.className = 'swatch';
      const chip = document.createElement('span');
      chip.style.background = colors[role];
      item.title = colors[role];
      item.append(chip, document.createTextNode(`${role} · ${colors[role]}`));
      return item;
    }));
    this.refresh();
    this.save();
  }

  save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, balance: this.balance, settings: this.settings })); }
    catch { /* Rendering and controls remain usable without persistence. */ }
  }

  openLighting() {
    this.lighting.open();
  }

  destroy() {
    this.destroyed = true;
    this.devTools?.then((tools) => tools?.destroy());
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
