import { palette } from '../materials';
import {
  elementTypes, elementType, properties, paperProperties, reliefProperties, propertyKinds,
  allowsPaper, allowsRelief, presets, validTypography, MAX_PAPER_LAYERS,
} from '../typography';
import { FIXED_TYPE, randomizeType, typeProperties } from './type-variation';

const EXPLORE_KEY = 'jimmyhmiller-paper-type-explore-v1';

const clone = (value) => structuredClone(value);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fullSelector = (type) => type.selector.split(',').map((part) => `.post-sheet ${part.trim()}`).join(', ');
const colorNames = ['ink', ...Object.keys(palette).filter((name) => name !== 'ink')];

// Element types to try when picking, most specific first.
const pickOrder = [...elementTypes.filter((type) => type.kind === 'inline'), ...elementTypes.filter((type) => type.kind !== 'inline' && type.kind !== 'pseudo')];

const groups = [
  ['Type', ['font', 'size', 'lineHeight', 'weight', 'italic', 'caps', 'tracking']],
  ['Ink', ['color', 'inkStrength']],
  ['Space', ['spaceAbove', 'spaceBelow', 'indent', 'padding']],
  ['Rule and tint', ['rule', 'ruleWidth', 'tint', 'tintStrength']],
];

/** Edits post typography per markdown element type: CSS, paper and text
 * relief, with starting variations and saved ones. Best used on
 * /dev/markdown, which shows every element type; choices apply to all posts. */
export class TypeEditor {
  constructor({ runtime, signal }) {
    this.runtime = runtime;
    this.signal = signal;
    this.state = clone(runtime.typography);
    this.key = 'paragraph';
    this.around = [];
    this.picking = false;
    this.undo = [];
    this.redo = [];
    // Random exploration per element type: locks and rolls, like the section explorer.
    this.explore = { version: 1, elements: {} };
    try {
      const saved = JSON.parse(localStorage.getItem(EXPLORE_KEY));
      if (saved?.version === 1 && saved.elements && typeof saved.elements === 'object') {
        for (const [key, meta] of Object.entries(saved.elements)) {
          if (!elementTypes.some((type) => type.key === key) || !meta?.locks || !Number.isInteger(meta.rolls)) continue;
          this.explore.elements[key] = { locks: Object.fromEntries(Object.entries(meta.locks).filter(([, locked]) => locked === true)), rolls: meta.rolls };
        }
      }
    } catch { /* Exploration starts fresh without storage. */ }
    this.mount();
    runtime.events.addEventListener('refresh', () => this.placeToggle(), { signal });
    this.placeToggle();
    this.render();
  }

  get type() { return elementType(this.key); }
  get props() { return this.state.elements[this.key] ?? {}; }
  get meta() { return this.explore.elements[this.key] ??= { locks: {}, rolls: 0 }; }
  // Elements of a type on this page; for a ::first-letter, the element that has it.
  matches(type = this.type) {
    const selector = type.kind === 'pseudo' ? fullSelector(type).replace(/::first-letter$/, '') : fullSelector(type);
    return [...this.runtime.root.querySelectorAll(selector)];
  }

  mount() {
    const toggle = document.createElement('button');
    toggle.id = 'open-type-editor';
    toggle.textContent = 'Edit type';
    toggle.dataset.paperUi = '';
    toggle.setAttribute('aria-controls', 'type-editor');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.onclick = () => this.open(this.panel.hidden);
    const panel = document.createElement('aside');
    panel.id = 'type-editor';
    panel.className = 'paper-editor type-editor';
    panel.hidden = true;
    panel.dataset.paperUi = '';
    panel.setAttribute('aria-label', 'Post type editor');
    panel.innerHTML = `<header><h2>Post type</h2><button data-type-action="dock" aria-label="Move type panel to the other side">↔</button><button data-type-action="close">Done</button></header>
      <p class="editor-help">Pick an element type, or click one in the post. Choices apply to every post.</p>
      <div class="editor-toolbar"><button data-type-action="pick" aria-pressed="false">Click to pick</button><button data-type-action="undo">Undo</button><button data-type-action="redo">Redo</button></div>
      <label for="type-element">Element</label><select id="type-element">${elementTypes.map((type) => `<option value="${type.key}">${type.label}</option>`).join('')}</select>
      <p class="type-count editor-note"></p>
      <div class="type-around editor-breadcrumb"></div>
      <label>Variations</label><div class="type-variations"></div>
      <div class="explore-actions type-random"><button data-type-action="random">Random variation</button><button data-type-action="next">Next element</button></div>
      <div class="explore-actions"><button data-type-action="lock-all">Lock all</button><button data-type-action="unlock-all">Unlock all</button></div>
      <p class="type-explore-count editor-note"></p>
      <div class="type-save-row"><input id="type-variation-name" type="text" maxlength="40" placeholder="Name this variation"><button data-type-action="save-variation">Save</button></div>
      <div class="type-controls"></div>
      <hr><div class="editor-actions"><button data-type-action="reset">Reset element</button><button data-type-action="reset-all">Reset all</button></div>
      <div class="editor-actions type-review"><button data-type-action="review" class="explore-save">Save choices for review</button><button data-type-action="download">Download choices</button></div>
      <p class="editor-status" role="status"></p>`;
    document.body.append(panel, toggle);
    this.panel = panel;
    this.toggle = toggle;
    this.$ = (selector) => panel.querySelector(selector);
    this.$('#type-element').onchange = (event) => this.select(event.target.value, { scroll: true });
    panel.addEventListener('click', (event) => {
      const action = event.target.closest('[data-type-action]')?.dataset.typeAction;
      if (action) this.action(action);
      const chip = event.target.closest('[data-variation]');
      if (chip && !event.target.closest('[data-forget]')) this.applyVariation(chip.dataset.source, chip.dataset.variation);
      const forget = event.target.closest('[data-forget]');
      if (forget) this.forget(forget.dataset.forget);
    });
    document.addEventListener('click', (event) => {
      if (!this.picking || panel.hidden || !(event.target instanceof Element) || event.target.closest('[data-paper-ui]')) return;
      const types = this.typesAt(event.target);
      if (!types.length) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.around = types;
      this.select(types[0].key);
    }, { capture: true, signal: this.signal });
    document.addEventListener('keydown', (event) => {
      if (panel.hidden) return;
      if (event.key === 'Escape') { this.setPicking(false); return; }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z' && !event.target.matches('input,textarea,select')) {
        event.preventDefault();
        this.action(event.shiftKey ? 'redo' : 'undo');
      }
    }, { signal: this.signal });
  }

  placeToggle() {
    const post = !!this.runtime.root.querySelector('.post-sheet');
    this.toggle.hidden = !post;
    if (!post) this.open(false);
    this.highlight();
  }

  // Element types under a click, innermost first (a paragraph, then its quote).
  typesAt(target) {
    const types = [];
    for (let node = target; node && !node.classList?.contains('post-sheet'); node = node.parentElement) {
      for (const type of pickOrder) if (!types.includes(type) && node.matches(fullSelector(type))) types.push(type);
    }
    return types;
  }

  open(open) {
    this.panel.hidden = !open;
    this.toggle.setAttribute('aria-expanded', String(open));
    this.toggle.textContent = open ? 'Close type' : 'Edit type';
    if (!open) this.setPicking(false);
    this.highlight();
  }

  setPicking(picking) {
    this.picking = picking;
    this.$('[data-type-action="pick"]').setAttribute('aria-pressed', String(picking));
  }

  select(key, { scroll = false } = {}) {
    this.key = elementType(key).key;
    this.render();
    if (scroll) this.matches()[0]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  highlight() {
    for (const element of this.runtime.root.querySelectorAll('.type-editor-match')) element.classList.remove('type-editor-match');
    if (this.panel.hidden || this.type.kind === 'pseudo') return;
    for (const element of this.matches()) element.classList.add('type-editor-match');
  }

  // Apply a new state through the runtime. A page that cannot draw it keeps
  // the previous state and says why.
  commit(update) {
    const previous = clone(this.state);
    const next = clone(this.state);
    update(next);
    for (const [key, props] of Object.entries(next.elements)) if (Object.keys(props).length === 0) delete next.elements[key];
    if (!validTypography(next)) throw new Error('The type editor produced an invalid typography state');
    if (same(previous, next)) return true;
    try {
      this.runtime.setTypography(next);
    } catch (error) {
      if (error.name !== 'PaperBudgetError') throw error;
      this.message(error.message);
      this.render();
      return false;
    }
    this.state = next;
    this.undo.push(previous);
    this.redo = [];
    this.message('');
    this.render();
    return true;
  }

  saveExplore() {
    try { localStorage.setItem(EXPLORE_KEY, JSON.stringify(this.explore)); }
    catch { this.message('Browser storage is unavailable. Download your choices before leaving.'); }
  }

  allLocked() {
    return typeProperties(this.type).every((property) => this.meta.locks[property.key]);
  }

  randomize() {
    if (this.allLocked()) { this.message('Every property is locked. Unlock a property to try more.'); return; }
    const base = this.baseline();
    // A roll can put more paper in one draw than the renderer takes; roll
    // again a few times before giving up (commit says why).
    for (let attempt = 0; attempt < 6; attempt++) {
      const next = randomizeType(this.type, this.props, this.meta.locks, base);
      if (this.commit((state) => { state.elements[this.key] = next; })) {
        this.meta.rolls++;
        this.saveExplore();
        this.render();
        return;
      }
    }
  }

  // The stylesheet's own values for this element, read with the overrides off,
  // so successive rolls scale from the design rather than from the last roll.
  baseline() {
    const sheet = this.runtime.typeSheet;
    sheet.disabled = true;
    try {
      const read = (name, fallback) => this.current(name) ?? fallback;
      return { spaceAbove: read('spaceAbove', 1), spaceBelow: read('spaceBelow', 1) };
    } finally {
      sheet.disabled = false;
    }
  }

  setLock(key, locked) {
    if (locked) this.meta.locks[key] = true;
    else delete this.meta.locks[key];
    this.saveExplore();
    this.render();
  }

  nextElement() {
    const index = elementTypes.indexOf(this.type);
    for (let step = 1; step <= elementTypes.length; step++) {
      const type = elementTypes[(index + step) % elementTypes.length];
      if (type.kind === 'pseudo' || this.matches(type).length) { this.around = []; this.select(type.key, { scroll: true }); return; }
    }
  }

  // Text rows: random never changes them, so they read as always locked.
  fixedLock(label) {
    const button = document.createElement('button');
    button.className = 'type-lock';
    button.textContent = 'Locked';
    button.disabled = true;
    button.setAttribute('aria-pressed', 'true');
    button.title = `Random never changes ${label.toLowerCase()}`;
    return button;
  }

  lockButton(key, label) {
    const locked = !!this.meta.locks[key];
    const button = document.createElement('button');
    button.className = 'type-lock';
    button.textContent = locked ? 'Locked' : 'Lock';
    button.setAttribute('aria-pressed', String(locked));
    button.setAttribute('aria-label', `${locked ? 'Unlock' : 'Lock'} ${label}`);
    button.onclick = () => this.setLock(key, !locked);
    return button;
  }

  restore(state) {
    this.runtime.setTypography(state);
    this.state = clone(state);
    this.render();
  }

  setProp(name, value) {
    this.commit((state) => {
      const props = state.elements[this.key] ?? {};
      if (value === undefined) delete props[name];
      else props[name] = value;
      state.elements[this.key] = props;
    });
  }

  applyVariation(source, name) {
    const props = source === 'current' ? {} : source === 'preset' ? presets[this.key][name] : this.state.saved[this.key]?.[name];
    if (!props) throw new Error(`No ${source} variation "${name}" for ${this.key}`);
    this.commit((state) => { state.elements[this.key] = clone(props); });
  }

  forget(name) {
    this.commit((state) => {
      delete state.saved[this.key][name];
      if (Object.keys(state.saved[this.key]).length === 0) delete state.saved[this.key];
    });
  }

  action(action) {
    if (action === 'close') this.open(false);
    if (action === 'dock') this.panel.dataset.dock = this.panel.dataset.dock === 'left' ? 'right' : 'left';
    if (action === 'pick') this.setPicking(!this.picking);
    if (action === 'reset') this.commit((state) => { delete state.elements[this.key]; });
    if (action === 'reset-all') this.commit((state) => { state.elements = {}; });
    if (action === 'save-variation') {
      const name = this.$('#type-variation-name').value.trim();
      if (!name) { this.message('Name the variation first.'); return; }
      if (Object.keys(this.props).length === 0) { this.message('This element has no changes to save.'); return; }
      this.commit((state) => { state.saved[this.key] = { ...(state.saved[this.key] ?? {}), [name]: clone(this.props) }; });
      this.$('#type-variation-name').value = '';
    }
    if (action === 'undo' && this.undo.length) { this.redo.push(clone(this.state)); this.restore(this.undo.pop()); }
    if (action === 'redo' && this.redo.length) { this.undo.push(clone(this.state)); this.restore(this.redo.pop()); }
    if (action === 'random') this.randomize();
    if (action === 'next') this.nextElement();
    if (action === 'lock-all') { for (const property of typeProperties(this.type)) this.meta.locks[property.key] = true; this.saveExplore(); this.render(); }
    if (action === 'unlock-all') { this.meta.locks = {}; this.saveExplore(); this.render(); }
    if (action === 'review') this.submit();
    if (action === 'download') this.download();
  }

  report() {
    return { version: 1, kind: 'typography', createdAt: new Date().toISOString(), page: location.pathname,
      palette: clone(this.runtime.palette), typography: clone(this.state), explore: clone(this.explore) };
  }

  async submit() {
    this.message('Saving…');
    try {
      const response = await fetch('/api/paper-preferences', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.report()) });
      if (!response.ok) throw new Error(await response.text() || `HTTP ${response.status}`);
      this.message('Saved to paper-preferences/latest.json.');
    } catch (error) {
      this.message(`Could not save: ${error.message}`);
    }
  }

  download() {
    const url = URL.createObjectURL(new Blob([`${JSON.stringify(this.report(), null, 2)}\n`], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'paper-typography.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  message(text) {
    this.$('.editor-status').textContent = text;
  }

  // The value the page shows now, for a property this element does not override.
  current(name) {
    const element = this.matches()[0];
    if (!element) return null;
    const style = getComputedStyle(element, this.type.kind === 'pseudo' ? '::first-letter' : null);
    const size = parseFloat(style.fontSize);
    const em = (px) => Math.round((parseFloat(px) / size) * 100) / 100;
    switch (name) {
      case 'font': {
        const family = style.fontFamily.toLowerCase();
        if (/menlo|consolas|monospace/.test(family)) return 'mono';
        return /^\W*(arial|helvetica)|^sans-serif/.test(family) ? 'sans' : 'serif';
      }
      case 'size': return size;
      case 'lineHeight': return style.lineHeight === 'normal' ? 1.2 : Math.round((parseFloat(style.lineHeight) / size) * 100) / 100;
      case 'weight': return Number(style.fontWeight);
      case 'italic': return style.fontStyle === 'italic';
      case 'caps': return style.textTransform === 'uppercase' ? 'uppercase' : style.fontVariantCaps === 'small-caps' ? 'small-caps' : 'none';
      case 'tracking': return style.letterSpacing === 'normal' ? 0 : em(style.letterSpacing);
      case 'spaceAbove': return em(style.marginTop);
      case 'spaceBelow': return em(style.marginBottom);
      case 'indent': return em(style.marginLeft);
      case 'padding': return em(style.paddingTop);
      case 'ruleWidth': return 1;
      case 'inkStrength': return 1;
      case 'tintStrength': return 0.1;
      default: return null;
    }
  }

  render() {
    const type = this.type;
    const props = this.props;
    this.$('#type-element').value = this.key;
    const count = this.matches().length;
    this.$('.type-count').textContent = type.kind === 'pseudo' ? 'A first letter; type and ink only.' : `${count} on this page.`;
    const around = this.around.length > 1 && this.around.includes(type) ? this.around : [];
    this.$('.type-around').replaceChildren(...around.map((candidate) => {
      const button = document.createElement('button');
      button.textContent = candidate.label;
      button.setAttribute('aria-pressed', String(candidate === type));
      button.onclick = () => this.select(candidate.key);
      return button;
    }));
    const chips = [['current', 'Current', {}], ...Object.entries(presets[type.key]).map(([name, value]) => ['preset', name, value]),
      ...Object.entries(this.state.saved[type.key] ?? {}).map(([name, value]) => ['saved', name, value])];
    this.$('.type-variations').replaceChildren(...chips.map(([source, name, value]) => {
      const chip = document.createElement('button');
      chip.dataset.source = source;
      chip.dataset.variation = name;
      chip.setAttribute('aria-pressed', String(same(value, props)));
      chip.textContent = name;
      if (source === 'saved') {
        const forget = document.createElement('span');
        forget.dataset.forget = name;
        forget.setAttribute('aria-label', `Forget ${name}`);
        forget.textContent = ' ×';
        chip.append(forget);
      }
      return chip;
    }));
    const lockable = typeProperties(type);
    const locked = lockable.filter((property) => this.meta.locks[property.key]).length;
    this.$('.type-explore-count').textContent = `${type.label} · ${locked} / ${lockable.length} properties locked · ${this.meta.rolls} variations tried`;
    const random = this.$('[data-type-action="random"]');
    random.textContent = this.meta.rolls ? 'Random again' : 'Random variation';
    random.disabled = locked === lockable.length;
    const controls = this.$('.type-controls');
    controls.replaceChildren();
    const allowed = new Set(propertyKinds[type.kind]);
    for (const [title, names] of groups) {
      const shown = names.filter((name) => allowed.has(name));
      if (!shown.length) continue;
      controls.append(this.heading(title));
      for (const name of shown) controls.append(this.control(name, properties[name], props[name], (value) => this.setProp(name, value)));
    }
    if (allowsPaper(type)) controls.append(...this.paperControls(props.paper));
    if (allowsRelief(type)) controls.append(...this.reliefControls(props.relief));
    this.highlight();
  }

  heading(text) {
    const heading = document.createElement('h3');
    heading.className = 'type-group';
    heading.textContent = text;
    return heading;
  }

  // One property row: its input, the value, and a clear button when overridden.
  control(name, spec, value, set, fallback = this.current(name), clearable = true, lockable = !FIXED_TYPE.has(name)) {
    const row = document.createElement('div');
    row.className = 'type-row';
    row.dataset.overridden = String(value !== undefined);
    const label = document.createElement('span');
    label.className = 'type-label';
    label.textContent = spec.label;
    const shown = value ?? fallback;
    let input;
    if (spec.color) {
      input = document.createElement('span');
      input.className = 'type-color';
      const select = document.createElement('select');
      const names = spec.allowNone ? ['none', ...colorNames] : colorNames;
      const custom = typeof value === 'string' && value.startsWith('#');
      if (value === undefined && clearable) select.append(new Option('(current)', ''));
      select.append(...[...names, 'custom'].map((name) => new Option(name === 'ink' ? 'sheet ink' : name, name)));
      select.value = value === undefined ? '' : custom ? 'custom' : value;
      const picker = document.createElement('input');
      picker.type = 'color';
      picker.value = custom ? value : palette[value] ?? '#304c52';
      picker.hidden = !custom;
      select.onchange = () => {
        if (select.value === '') set(undefined);
        else if (select.value === 'custom') { picker.hidden = false; set(picker.value); }
        else set(select.value);
      };
      picker.onchange = () => set(picker.value);
      input.append(select, picker);
    } else if (spec.options) {
      input = document.createElement('select');
      if (value === undefined) input.append(new Option(`(current: ${fallback ?? '—'})`, '', true, true));
      input.append(...spec.options.map((option) => new Option(String(option), String(option))));
      if (value !== undefined) input.value = String(value);
      input.onchange = () => {
        if (input.value === '') { set(undefined); return; }
        const option = spec.options.find((candidate) => String(candidate) === input.value);
        set(option);
      };
    } else {
      input = document.createElement('input');
      input.type = 'range';
      Object.assign(input, { min: spec.min, max: spec.max, step: spec.step });
      input.value = String(shown ?? spec.min);
      const output = document.createElement('output');
      output.className = 'editor-number';
      const format = (v) => `${Math.round(v * 1000) / 1000}${spec.unit ?? ''}`;
      output.value = shown === null || shown === undefined ? '—' : format(Number(shown));
      input.oninput = () => { output.value = format(Number(input.value)); };
      input.onchange = () => set(Number(input.value));
      label.append(output);
    }
    row.append(label, input);
    const clear = document.createElement('button');
    clear.className = 'type-clear';
    clear.setAttribute('aria-label', `Clear ${spec.label}`);
    clear.textContent = '×';
    clear.onclick = () => set(undefined);
    clear.hidden = !(value !== undefined && clearable);
    // Random never changes the text itself, so those rows need no lock.
    row.append(clear, lockable ? this.lockButton(name, spec.label) : FIXED_TYPE.has(name) ? this.fixedLock(spec.label) : document.createElement('span'));
    return row;
  }

  paperControls(paper) {
    const rows = [this.heading('Paper')];
    const mode = document.createElement('select');
    mode.append(new Option('No paper', 'none'), new Option('Raised paper', 'raised'), new Option('Pressed-in well', 'inset'));
    mode.value = !paper ? 'none' : paper.offset < 0 ? 'inset' : 'raised';
    mode.onchange = () => {
      if (mode.value === 'none') { this.setProp('paper', undefined); return; }
      const offset = Math.abs(paper?.offset ?? 6) * (mode.value === 'inset' ? -1 : 1) || (mode.value === 'inset' ? -6 : 6);
      this.setProp('paper', { offset, color: paper?.color ?? 'sage', relief: paper?.relief ?? 0.3, radius: paper?.radius ?? 0.7 });
    };
    rows.push(this.wrap('Treatment', mode, 'paper'));
    if (paper) {
      for (const [name, spec] of Object.entries(paperProperties)) {
        rows.push(this.control(`paper.${name}`, spec, paper[name], (value) => this.setProp('paper', { ...paper, [name]: value }), paper[name], false));
      }
      const layers = document.createElement('select');
      for (let count = 0; count <= MAX_PAPER_LAYERS; count++) layers.append(new Option(String(count), String(count)));
      layers.value = String(paper.stack?.length ?? 0);
      layers.onchange = () => {
        const count = Number(layers.value);
        const stack = Array.from({ length: count }, (_, index) => paper.stack?.[index] ?? { offset: paper.offset > 0 ? 3 : -3, inset: 8, color: paper.color });
        const { stack: _old, ...rest } = paper;
        this.setProp('paper', count ? { ...rest, stack } : rest);
      };
      rows.push(this.wrap('Inner layers', layers, 'paper.layers'));
    }
    return rows;
  }

  reliefControls(relief) {
    const rows = [this.heading('Letters')];
    const mode = document.createElement('select');
    mode.append(new Option('Flat', 'none'), new Option('Raised', 'raised'), new Option('Pressed in', 'pressed'));
    mode.value = !relief ? 'none' : relief.relief > 0 ? 'raised' : 'pressed';
    mode.onchange = () => {
      if (mode.value === 'none') { this.setProp('relief', undefined); return; }
      const depth = Math.abs(relief?.relief ?? 2);
      this.setProp('relief', { relief: mode.value === 'raised' ? depth : -depth, spread: relief?.spread ?? 0 });
    };
    rows.push(this.wrap('Relief', mode));
    if (relief) {
      const depth = { ...reliefProperties.relief, label: 'Depth', min: 1, max: 12 };
      rows.push(this.control('relief.depth', depth, Math.abs(relief.relief),
        (value) => this.setProp('relief', { ...relief, relief: Math.sign(relief.relief) * Math.round(value) }), Math.abs(relief.relief), false, false));
      rows.push(this.control('relief.spread', reliefProperties.spread, relief.spread,
        (value) => this.setProp('relief', { ...relief, spread: value }), relief.spread, false, false));
    }
    return rows;
  }

  wrap(text, input, lockKey = null) {
    const row = document.createElement('div');
    row.className = 'type-row';
    const label = document.createElement('span');
    label.className = 'type-label';
    label.textContent = text;
    const spacer = document.createElement('span');
    row.append(label, input, spacer, lockKey ? this.lockButton(lockKey, text) : document.createElement('span'));
    return row;
  }

  destroy() {
    for (const element of this.runtime.root.querySelectorAll('.type-editor-match')) element.classList.remove('type-editor-match');
    this.panel.remove();
    this.toggle.remove();
  }
}

