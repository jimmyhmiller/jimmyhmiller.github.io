import { MAX_PAPER_SURFACES } from '../paper-scene';
import { LAYOUT_KEY, validLayout, withDefaults } from '../layout';

const clone = value => structuredClone(value);
const hex = value => /^#[0-9a-f]{6}$/i.test(value);

/**
 * The paper inspector from experiments/paper-homepage, editing the site-wide
 * layout held by PaperRuntime (lib/paper/layout.js). Picking, layers, stacks,
 * undo/redo and saved variations behave as they did there.
 */
export class PaperEditor {
  constructor({ runtime, signal }) {
    this.signal = signal;
    this.runtime = runtime;
    this.scene = runtime.scene;
    this.root = runtime.root;
    this.undoStack = [];
    this.redoStack = [];
    this.historyParticipants = new Map();
    this.events = new EventTarget();
    this.variations = Object.create(null);
    this.defaultState = clone(runtime.defaultLayout);
    this.state = clone(runtime.layout);
    try {
      const saved = JSON.parse(localStorage.getItem(LAYOUT_KEY));
      if (saved?.variations && typeof saved.variations === 'object') {
        for (const [name, state] of Object.entries(saved.variations).slice(0, 30)) {
          if (name.length <= 60 && validLayout(state)) this.variations[name] = withDefaults(state);
        }
      }
    } catch { /* Invalid or unavailable storage leaves no saved variations. */ }
    this.mount();
    runtime.events.addEventListener('refresh', () => {
      if (this.selected && !this.root.contains(this.selected)) this.selected = null;
      this.render();
    }, { signal: this.signal });
    this.render();
  }

  get palette() { return this.runtime.palette; }
  get relief() { return this.runtime.settings.relief; }
  get resolved() { return this.runtime.resolved; }

  // Named papers are keyed by name so one node covers every page showing
  // them; other elements by a path from the nearest paper, id or page root.
  selector(element) {
    if (element.dataset.paper) return `[data-paper="${element.dataset.paper}"]`;
    const parts = [];
    for (let node = element; node && node !== this.root; node = node.parentElement) {
      if (node !== element && node.dataset.paper) { parts.unshift(`[data-paper="${node.dataset.paper}"]`); break; }
      if (node.id) { parts.unshift(`#${CSS.escape(node.id)}`); break; }
      if (node.dataset.paperPage) { parts.unshift(`[data-paper-page="${node.dataset.paperPage}"]`); break; }
      const peers = [...node.parentElement.children].filter(peer => peer.tagName === node.tagName);
      parts.unshift(`${node.localName}:nth-of-type(${peers.indexOf(node) + 1})`);
    }
    return parts.join(' > ');
  }

  find(selector) {
    try {
      const element = this.root.querySelector(selector);
      return element instanceof HTMLElement ? element : null;
    } catch { return null; }
  }

  // Paper faces this page would render with `state`.
  surfaceCount(state = this.state) {
    return Object.entries(state.nodes).reduce((count, [selector, node]) =>
      count + (node.layer === 'inherit' || !this.find(selector) ? 0 : 1 + (node.stack?.length ?? 0)), 0);
  }

  save() {
    try { localStorage.setItem(LAYOUT_KEY, JSON.stringify({ state: this.state, variations: this.variations })); }
    catch { this.message('Browser storage is unavailable. Export a variation to keep it.'); }
  }

  captureHistory() {
    return { state: clone(this.state), participants: Object.fromEntries(
      [...this.historyParticipants].map(([name, participant]) => [name, clone(participant.capture())])
    ) };
  }

  restoreHistory(snapshot) {
    this.state = clone(snapshot.state);
    this.apply();
    for (const [name, participant] of this.historyParticipants) participant.restore(clone(snapshot.participants[name]));
    this.render();
    this.save();
    this.events.dispatchEvent(new Event('change'));
  }

  change(update, group = null, afterApply = null) {
    const previous = this.captureHistory();
    update(this.state);
    if (this.surfaceCount() > MAX_PAPER_SURFACES) {
      this.state = previous.state;
      this.message(`The scene supports ${MAX_PAPER_SURFACES} total paper layers. Remove a layer before adding another.`);
      return;
    }
    if (JSON.stringify(previous.state) !== JSON.stringify(this.state)) this.apply();
    afterApply?.();
    if (JSON.stringify(previous) === JSON.stringify(this.captureHistory())) return;
    if (!group || group !== this.editGroup) {
      this.undoStack.push(previous);
      if (this.undoStack.length > 50) this.undoStack.shift();
    }
    this.editGroup = group;
    this.message('');
    this.redoStack = [];
    this.render();
    this.save();
    this.events.dispatchEvent(new Event('change'));
  }

  apply() {
    this.runtime.setLayout(clone(this.state));
  }

  mount() {
    const toggle = document.createElement('button');
    toggle.id = 'open-paper-editor';
    toggle.textContent = 'Edit paper';
    toggle.dataset.paperUi = '';
    toggle.setAttribute('aria-controls', 'paper-editor');
    toggle.setAttribute('aria-expanded', 'false');
    this.toggle = toggle;
    const panel = document.createElement('aside');
    panel.id = 'paper-editor';
    panel.className = 'paper-editor';
    panel.dataset.paperUi = '';
    panel.hidden = true;
    panel.setAttribute('aria-label', 'Paper inspector');
    panel.innerHTML = `
      <header><h2>Paper inspector</h2><button data-action="dock" aria-label="Move inspector to the other side">↔</button><button data-action="close">Done</button></header>
      <div class="editor-toolbar"><button data-action="pick" aria-pressed="false">Pick an element</button><button data-action="undo">Undo</button><button data-action="redo">Redo</button></div>
      <button id="open-settings" aria-haspopup="dialog">Lighting &amp; palette</button>
      <p class="editor-help">Pick any section, post, heading or paragraph. Select a parent below to edit a larger piece.</p>
      <div class="editor-breadcrumb"></div><h3 class="editor-target">Choose an element</h3><p class="editor-selector"></p>
      <div class="editor-fields" hidden>
        <label>Multi-layer construction</label><div class="editor-layer-buttons"><button data-action="multi-raised">Multi raised</button><button data-action="multi-inset">Multi inset</button><button data-action="single-layer">Single layer</button></div>
        <p class="editor-note">The outer surface is the base. Inner layers reveal colored edges and cast real shadows.</p>
        <div class="editor-stack"></div><div class="editor-actions"><button data-action="add-raised">+ Raised layer</button><button data-action="add-inset">+ Inset layer</button></div>
        <label for="editor-layer">Base layer</label><select id="editor-layer"></select>
        <div class="editor-layer-buttons"><button data-layer="inset">Inset</button><button data-layer="flat">Flush</button><button data-layer="paper">Paper</button><button data-layer="lifted">Raised</button></div>
        <label for="editor-offset">Base elevation relative to parent <output id="editor-height" class="editor-number"></output></label><input id="editor-offset" type="range" min="-12" max="48" step="1"><p class="editor-note" id="editor-height-note"></p><button data-action="layer-height">Use layer elevation</button>
        <label for="editor-color">Base paper color</label><select id="editor-color"></select><div class="editor-swatches"></div>
        <div class="editor-color-row"><input id="editor-custom-color" type="color" aria-label="Custom paper color"><span class="editor-note" id="editor-color-value"></span></div>
        <label for="editor-texture">Texture relief <output id="editor-texture-value" class="editor-number"></output></label><input id="editor-texture" type="range" min="0" max=".85" step=".01">
        <div class="editor-actions"><button data-action="reset-element">Reset element</button><button data-action="inherit">Remove its paper</button></div>
        <details><summary>Edit the selected layer for every assigned element</summary><div class="editor-layer-definition"><label for="editor-layer-name">Layer name</label><input id="editor-layer-name" type="text" maxlength="40"><label for="editor-layer-offset">Layer elevation <output id="editor-layer-offset-value" class="editor-number"></output></label><input id="editor-layer-offset" type="range" min="-12" max="48" step="1"><label for="editor-layer-color">Layer color</label><select id="editor-layer-color"></select><p class="editor-note">Changes apply to every element using this layer. Individual overrides stay in place.</p></div></details>
      </div>
      <hr><label for="editor-variations">Saved paper variations</label><select id="editor-variations"><option value="">Choose a variation…</option></select><label for="editor-variation-name">Variation name</label><input id="editor-variation-name" type="text" placeholder="e.g. Sage sections" maxlength="60"><div class="editor-variation-actions"><button data-action="save-variation">Save</button><button data-action="delete-variation">Delete</button><button data-action="export">Export JSON</button></div><button data-action="original">Restore original layout</button><p class="editor-status" role="status"></p>`;
    this.panel = panel;
    this.$ = selector => panel.querySelector(selector);
    document.body.append(panel, toggle);
    toggle.onclick = () => this.open(panel.hidden);
    this.$('#open-settings').onclick = () => this.runtime.openLighting();
    panel.addEventListener('click', event => {
      const layer = event.target.closest('[data-layer]')?.dataset.layer;
      if (layer) this.editNode(node => { node.layer = layer; node.offset = null; });
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (action) this.action(action);
    });
    const input = (id, event, update, group = null) => this.$(id).addEventListener(event, e => {
      update(e.target.value, group);
    });
    input('#editor-layer', 'change', value => this.editNode(node => { node.layer = value; node.offset = null; }));
    input('#editor-offset', 'input', value => this.editNode(node => { node.offset = +value; }, 'offset'));
    input('#editor-color', 'change', value => { if (value !== 'custom') this.editNode(node => { node.color = value; }); });
    input('#editor-custom-color', 'input', value => this.editNode(node => { node.color = value; }, 'color'));
    input('#editor-texture', 'input', value => this.editNode(node => { node.relief = +value; }, 'texture'));
    input('#editor-layer-name', 'change', value => this.editLayer(layer => { layer.name = value.trim().slice(0, 40) || layer.name; }));
    input('#editor-layer-offset', 'input', value => this.editLayer(layer => { layer.offset = +value; }, 'layer-offset'));
    input('#editor-layer-color', 'change', value => this.editLayer(layer => { layer.color = value; }));
    panel.addEventListener('change', () => { this.editGroup = null; });
    input('#editor-variations', 'change', value => {
      if (!Object.hasOwn(this.variations, value)) return;
      this.change(() => { this.state = clone(this.variations[value]); });
      this.$('#editor-variation-name').value = value;
      this.message(`Loaded “${value}”.`);
    });
    document.addEventListener('click', event => {
      if (!this.picking || !(event.target instanceof Element) || !this.root.contains(event.target)) return;
      if (event.target.closest('[data-paper-ui]')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.select(event.target.closest('svg') ?? event.target);
    }, { capture: true, signal: this.signal });
    document.addEventListener('pointerover', event => {
      if (!this.picking) return;
      this.hovered?.classList.remove('paper-editor-hover');
      this.hovered = this.root.contains(event.target) && !event.target.closest('[data-paper-ui]') ? event.target : null;
      this.hovered?.classList.add('paper-editor-hover');
    }, { signal: this.signal });
    document.addEventListener('keydown', event => {
      if (panel.hidden) return;
      if (event.key === 'Escape') { this.setPicking(false); return; }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z' && !event.target.matches('input,textarea,select')) {
        event.preventDefault();
        this.action(event.shiftKey ? 'redo' : 'undo');
      }
    }, { signal: this.signal });
  }

  // Remove the editor's DOM; its document listeners end with `signal`.
  destroy() {
    this.hovered?.classList.remove('paper-editor-hover');
    this.panel.remove();
    this.toggle.remove();
  }

  open(open) {
    this.panel.hidden = !open;
    this.toggle.setAttribute('aria-expanded', open);
    this.toggle.textContent = open ? 'Close inspector' : 'Edit paper';
    this.setPicking(open);
    if (!open) this.selected?.classList.remove('paper-editor-selected');
    else this.selected?.classList.add('paper-editor-selected');
  }

  setPicking(active) {
    this.picking = active;
    document.documentElement.classList.toggle('paper-picking', active);
    this.$('[data-action=pick]').setAttribute('aria-pressed', active);
    if (!active) this.hovered?.classList.remove('paper-editor-hover');
  }

  select(element) {
    if (!(element instanceof HTMLElement) || !this.root.contains(element) || element === this.root) return;
    this.selected?.classList.remove('paper-editor-selected');
    this.selected = element;
    element.classList.add('paper-editor-selected');
    this.editGroup = null;
    this.render();
  }

  editNode(update, group = null) {
    if (!this.selected) return;
    const selector = this.selector(this.selected);
    this.change(state => {
      state.nodes[selector] ??= { layer: 'paper', color: 'auto', offset: null, relief: null };
      if (state.nodes[selector].layer === 'inherit') state.nodes[selector].layer = 'paper';
      update(state.nodes[selector]);
    }, group);
  }

  selectedLayer() {
    const node = this.selected && this.state.nodes[this.selector(this.selected)];
    return this.state.layers.find(layer => layer.id === node?.layer) ?? this.state.layers.find(layer => layer.id === 'paper');
  }

  editLayer(update, group = null) {
    const id = this.selectedLayer().id;
    this.change(state => update(state.layers.find(layer => layer.id === id)), group);
  }

  action(action) {
    if (action === 'close') this.open(false);
    if (action === 'pick') this.setPicking(!this.picking);
    if (action === 'dock') this.panel.dataset.dock = this.panel.dataset.dock === 'left' ? 'right' : 'left';
    if (action === 'undo' || action === 'redo') {
      const from = action === 'undo' ? this.undoStack : this.redoStack;
      const to = action === 'undo' ? this.redoStack : this.undoStack;
      if (!from.length) return;
      to.push(this.captureHistory());
      const snapshot = from.pop();
      this.editGroup = null;
      this.restoreHistory(snapshot);
    }
    if (action === 'multi-raised') this.editNode(node => {
      Object.assign(node, { layer: 'paper', offset: 6, color: 'flax', stack: [
        { offset: 6, inset: 8, color: 'sage' }, { offset: 6, inset: 8, color: 'cream' }
      ] });
    });
    if (action === 'multi-inset') this.editNode(node => {
      Object.assign(node, { layer: 'inset', offset: -2, color: 'desk', stack: [
        { offset: -3, inset: 8, color: 'sage' }, { offset: -3, inset: 8, color: 'recess' }
      ] });
    });
    if (action === 'single-layer') this.editNode(node => { delete node.stack; });
    if (action === 'add-raised' || action === 'add-inset') this.editNode(node => {
      node.stack ??= [];
      if (node.stack.length >= 6) { this.message('Use up to six inner layers per element.'); return; }
      node.stack.push({ offset: action === 'add-raised' ? 6 : -3, inset: 8,
        color: action === 'add-raised' ? 'cream' : 'recess' });
    });
    if (action === 'layer-height') this.editNode(node => { node.offset = null; });
    if (action === 'inherit' && this.selected) this.change(state => {
      const selector = this.selector(this.selected);
      if (Object.hasOwn(this.defaultState.nodes, selector)) state.nodes[selector] = { ...state.nodes[selector], layer: 'inherit' };
      else delete state.nodes[selector];
    });
    if (action === 'reset-element' && this.selected) this.change(state => {
      const selector = this.selector(this.selected);
      if (this.defaultState.nodes[selector]) state.nodes[selector] = clone(this.defaultState.nodes[selector]);
      else delete state.nodes[selector];
    });
    if (action === 'original') {
      this.change(() => { this.state = clone(this.defaultState); });
      this.$('#editor-variations').value = '';
      this.$('#editor-variation-name').value = '';
      this.message('Original layout restored.');
    }
    if (action === 'save-variation') {
      const name = this.$('#editor-variation-name').value.trim();
      if (!name) { this.message('Name this variation first.'); return; }
      if (!Object.hasOwn(this.variations, name) && Object.keys(this.variations).length >= 30) { this.message('Keep up to 30 variations; delete one before adding another.'); return; }
      Object.defineProperty(this.variations, name, { value: clone(this.state), enumerable: true, writable: true, configurable: true });
      this.save(); this.render(); this.$('#editor-variations').value = name;
      this.message(`Saved “${name}” in this browser.`);
    }
    if (action === 'delete-variation') {
      delete this.variations[this.$('#editor-variations').value];
      this.save(); this.render();
    }
    if (action === 'export') {
      const blob = new Blob([JSON.stringify(this.state, null, 2) + '\n'], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = 'paper-variation.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  message(text) { this.$('.editor-status').textContent = text; }

  options(select, entries, value) {
    select.replaceChildren(...entries.map(([key, label]) => {
      const option = document.createElement('option'); option.value = key; option.textContent = label; return option;
    }));
    select.value = value;
  }

  render() {
    this.$('[data-action=undo]').disabled = !this.undoStack.length;
    this.$('[data-action=redo]').disabled = !this.redoStack.length;
    const variation = this.$('#editor-variations').value;
    this.options(this.$('#editor-variations'), [['', 'Choose a variation…'], ...Object.keys(this.variations).map(name => [name, name === variation && JSON.stringify(this.variations[name]) !== JSON.stringify(this.state) ? `${name} · modified` : name])], variation);
    const element = this.selected;
    this.$('.editor-fields').hidden = !element;
    if (!element) return;
    const selector = this.selector(element);
    const node = this.state.nodes[selector];
    const layer = this.selectedLayer();
    const classes = [...element.classList].filter(name => !name.startsWith('paper-editor')).slice(0, 2);
    this.$('.editor-target').textContent = element.id ? `#${element.id}` : element.localName + (classes.length ? `.${classes.join('.')}` : '');
    this.$('.editor-selector').textContent = selector;
    const ancestors = []; for (let parent = element; parent && parent !== this.root; parent = parent.parentElement) ancestors.unshift(parent);
    this.$('.editor-breadcrumb').replaceChildren(...ancestors.map(parent => {
      const button = document.createElement('button'); button.textContent = parent.id || parent.localName;
      button.setAttribute('aria-pressed', parent === element); button.onclick = () => this.select(parent); return button;
    }));
    this.options(this.$('#editor-layer'), [['inherit', 'Underlying paper · no surface'], ...this.state.layers.map(layer => [layer.id, layer.name])], node?.layer ?? 'inherit');
    for (const button of this.panel.querySelectorAll('[data-layer]')) button.setAttribute('aria-pressed', button.dataset.layer === node?.layer);
    const stack = this.$('.editor-stack');
    stack.replaceChildren();
    (node?.stack ?? []).forEach((step, index) => {
      const row = document.createElement('fieldset');
      const height = this.scene.options.surfaces.filter(surface => surface.element === element)[index + 1]?.height;
      const title = document.createElement('legend'); title.textContent = `Inner layer ${index + 1} · ${step.offset >= 0 ? 'raised' : 'inset'} · height ${height ?? 'inherited'}`;
      row.append(title);
      const field = (label, input) => {
        const wrapper = document.createElement('label'); wrapper.append(document.createTextNode(label), input); row.append(wrapper);
      };
      const offset = document.createElement('input'); offset.type = 'number'; offset.min = -12; offset.max = 24; offset.step = 1; offset.value = step.offset;
      offset.setAttribute('aria-label', `Inner layer ${index + 1} elevation`);
      offset.onchange = () => { if (offset.validity.valid && offset.value !== '') this.editNode(node => { node.stack[index].offset = +offset.value; }); };
      field('Elevation from previous layer', offset);
      const inset = document.createElement('input'); inset.type = 'number'; inset.min = 1; inset.max = 40; inset.step = 1; inset.value = step.inset;
      inset.setAttribute('aria-label', `Inner layer ${index + 1} edge spacing`);
      inset.onchange = () => { if (inset.validity.valid && inset.value !== '') this.editNode(node => { node.stack[index].inset = +inset.value; }); };
      field('Edge spacing (px)', inset);
      const color = document.createElement('select'); color.setAttribute('aria-label', `Inner layer ${index + 1} color`);
      this.options(color, [['inherit', 'Previous layer color'], ...Object.keys(this.palette).map(role => [role, role]), ...(hex(step.color) ? [[step.color, step.color]] : [])], step.color);
      color.onchange = () => this.editNode(node => { node.stack[index].color = color.value; }); field('Color', color);
      const custom = document.createElement('input'); custom.type = 'color'; custom.setAttribute('aria-label', `Inner layer ${index + 1} custom color`);
      custom.value = this.palette[step.color] ?? (hex(step.color) ? step.color : this.palette.cream);
      custom.onchange = () => this.editNode(node => { node.stack[index].color = custom.value; }); field('Custom color', custom);
      const remove = document.createElement('button'); remove.textContent = 'Remove layer'; remove.onclick = () => this.editNode(node => { node.stack.splice(index, 1); }); row.append(remove);
      stack.append(row);
    });
    this.$('[data-action=add-raised]').disabled = (node?.stack?.length ?? 0) >= 6;
    this.$('[data-action=add-inset]').disabled = (node?.stack?.length ?? 0) >= 6;
    const offset = node?.offset ?? layer.offset;
    this.$('#editor-offset').value = offset;
    const surface = this.resolved.get(element);
    const baseSurface = this.scene.options.surfaces.find(surface => surface.element === element && !surface.inset);
    this.$('#editor-height').value = `${offset > 0 ? '+' : ''}${offset}`;
    this.$('#editor-height-note').textContent = `${node?.offset === null ? 'Using layer elevation. ' : ''}Base height ${baseSurface?.height ?? 'inherited'}${node?.stack?.length ? `; inner face ${surface?.height}` : ''}; desk height 12. Heights stay within 0–64.`;
    const color = node?.color ?? 'auto';
    this.options(this.$('#editor-color'), [['auto', 'Use layer color'], ['inherit', 'Match underlying paper'], ...Object.keys(this.palette).map(role => [role, role]), ['custom', 'Custom color']], hex(color) ? 'custom' : color);
    const effective = baseSurface?.color ?? surface?.color ?? this.palette.desk;
    this.$('#editor-custom-color').value = effective;
    this.$('#editor-color-value').textContent = effective;
    this.$('.editor-swatches').replaceChildren(...Object.entries(this.palette).map(([role, stock]) => {
      const button = document.createElement('button'); button.style.background = stock; button.title = `${role} ${stock}`;
      button.setAttribute('aria-label', `Use ${role} paper`); button.setAttribute('aria-pressed', color === role);
      button.onclick = () => this.editNode(node => { node.color = role; }); return button;
    }));
    const relief = node?.relief ?? surface?.relief ?? this.relief;
    this.$('#editor-texture').value = relief; this.$('#editor-texture-value').value = relief.toFixed(2);
    this.$('#editor-layer-name').value = layer.name;
    this.$('#editor-layer-offset').value = layer.offset;
    this.$('#editor-layer-offset-value').value = `${layer.offset > 0 ? '+' : ''}${layer.offset}`;
    const layerColor = layer.color;
    this.options(this.$('#editor-layer-color'), [['inherit', 'Match underlying paper'], ...Object.keys(this.palette).map(role => [role, role]), ...(hex(layerColor) ? [[layerColor, layerColor]] : [])], layerColor);
  }
}
