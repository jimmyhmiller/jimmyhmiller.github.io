import { PaperScene, MAX_PAPER_SURFACES } from './paper-scene';
import { BakedBackground } from './baked-background';
import { LightingPanel } from './lighting-panel';
import { contrast } from './color';
import { palette, nodes, defaultLighting, podcastHalo, projectPaper, DESK_HEIGHT } from './materials';

const STORAGE_KEY = 'jimmyhmiller-paper-lighting-v1';

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

  // Re-read every `[data-paper]` element in the document and rebuild the
  // scene's surfaces. Call after any change to which papers exist or what
  // material they use (route changes, project switching).
  refresh() {
    const elements = [...this.root.querySelectorAll('[data-paper]')];
    const resolved = new Map();
    const surfaces = [];
    const effects = this.scene.options.effects;
    effects.clear();
    this.scene.options.inkStructure = [0, 0];
    for (const element of elements) {
      const spec = nodeSpec(element.dataset.paper);
      let ancestor = element.parentElement;
      while (ancestor && !resolved.has(ancestor)) ancestor = ancestor.parentElement;
      const parent = resolved.get(ancestor) ?? { height: DESK_HEIGHT, color: palette.desk };
      const relief = spec.relief ?? this.settings.relief;
      const base = { element, height: clampHeight(parent.height + spec.offset), color: this.color(spec.color), relief, radius: spec.radius };
      surfaces.push(base);
      let face = base;
      let inset = 0;
      for (const step of spec.stack ?? []) {
        inset += step.inset;
        face = { element, height: clampHeight(face.height + step.offset), color: this.color(step.color), relief, radius: spec.radius, inset };
        surfaces.push(face);
      }
      if (spec.effect === 'podcast-halo') {
        const focus = element.querySelector('.podcast-art');
        if (!focus) throw new Error('podcast-halo paper requires a .podcast-art element to centre its ink');
        const { inkStructure, ...effect } = podcastHalo;
        effects.set(element, { ...effect, randomness: effect.randomness.slice(), focus });
        this.scene.options.inkStructure = inkStructure.slice();
        face = { ...face, color: podcastHalo.stock };
      } else if (spec.effect) {
        throw new Error(`Unknown paper effect "${spec.effect}"`);
      }
      resolved.set(element, face);
      element.style.setProperty('--surface-color', face.color);
      if (spec.ink) this.ink(element, face.color);
      else for (const property of ['color', '--ink', '--quiet', '--line']) element.style.removeProperty(property);
    }
    if (surfaces.length > MAX_PAPER_SURFACES) {
      throw new Error(`This page uses ${surfaces.length} paper faces; the renderer supports ${MAX_PAPER_SURFACES}`);
    }
    this.scene.setSurfaces(surfaces);
    this.scene.schedule();
  }

  ink(element, color) {
    const colors = this.palette;
    const ink = contrast(colors.ink, color) >= contrast(colors.cream, color) ? colors.ink : colors.cream;
    element.style.color = ink;
    element.style.setProperty('--ink', ink);
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
    window.removeEventListener('pageshow', this.pageshow);
    this.lighting.destroy();
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
