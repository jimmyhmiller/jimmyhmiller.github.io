import { MAX_NODE_STACK } from '../layout';
import { randomizeVariation, variationProperties } from './variation';

const KEY = 'jimmyhmiller-paper-section-choices-v1';
const clone = value => structuredClone(value);
// Sections are the named papers on the current page (`data-paper`), so the
// explorer works on posts, the archive and project pages as well as home.
const key = section => section.dataset.paper;
const lockKey = /^(count|offset|color|relief|stack\.[0-5]\.(offset|color|inset))$/;

export class SectionExplorer {
  constructor({ editor, environment, signal }) {
    this.signal = signal;
    this.editor = editor;
    this.environment = environment;
    this.choices = Object.create(null);
    try {
      const stored = JSON.parse(localStorage.getItem(KEY));
      for (const [name, item] of Object.entries(stored?.sections ?? {})) {
        if (!item || !Number.isInteger(item.rolls) || item.rolls < 0 || !item.locks || typeof item.locks !== 'object') continue;
        const locks = Object.fromEntries(Object.entries(item.locks).filter(([key, value]) => lockKey.test(key) && typeof value === 'boolean'));
        this.choices[name] = { locks, rolls: item.rolls, reviewed: item.reviewed === true,
          fingerprint: typeof item.fingerprint === 'string' ? item.fingerprint : '',
          events: Array.isArray(item.events) ? item.events.slice(-40) : [] };
      }
    } catch { /* The existing layout remains usable without saved exploration. */ }
    this.mount();
    this.editor.historyParticipants.set('section-explorer', {
      capture: () => ({ choices: this.choices, selected: this.selected ? key(this.selected) : null }),
      restore: snapshot => {
        this.selected?.classList.remove('paper-explorer-selected');
        this.choices = snapshot?.choices ?? Object.create(null);
        this.selected = this.sections.find(section => key(section) === snapshot?.selected);
        if (!this.panel.hidden) this.selected?.classList.add('paper-explorer-selected');
        this.save(); this.render();
      }
    });
    this.editor.events.addEventListener('change', () => this.render(), { signal: this.signal });
    this.editor.runtime.events.addEventListener('refresh', () => {
      if (this.selected && !this.editor.root.contains(this.selected)) this.selected = null;
      this.render();
    }, { signal: this.signal });
    this.render();
  }

  get sections() {
    return [...this.editor.root.querySelectorAll('[data-paper]')];
  }

  metadata(section = this.selected) {
    return this.choices[key(section)] ??= { locks: {}, rolls: 0, reviewed: false, fingerprint: '', events: [] };
  }

  canonical(section) {
    const selector = this.editor.selector(section);
    const node = clone(this.editor.state.nodes[selector] ?? { layer: 'inherit', color: 'auto', offset: null, relief: null });
    const layer = this.editor.state.layers.find(layer => layer.id === node.layer);
    const surfaces = this.editor.scene.options.surfaces.filter(surface => surface.element === section);
    const base = surfaces[0] ?? this.editor.resolved.get(section);
    node.offset ??= layer?.offset ?? 0;
    node.color = base?.color ?? this.editor.palette.desk;
    node.relief ??= base?.relief ?? this.editor.relief;
    node.stack = (node.stack ?? []).map((step, index) => ({ ...step, color: surfaces[index + 1]?.color ?? this.editor.palette[step.color] ?? node.color }));
    return node;
  }

  complete(section) {
    const meta = this.metadata(section);
    const node = this.canonical(section);
    return meta.reviewed && meta.fingerprint === JSON.stringify(node) && variationProperties(node).every(property => meta.locks[property.key]);
  }

  record(action, key = null) {
    const meta = this.metadata();
    const node = this.canonical(this.selected);
    meta.reviewed = true;
    meta.fingerprint = JSON.stringify(node);
    meta.events.push({ at: new Date().toISOString(), action, key, properties: variationProperties(node) });
    meta.events = meta.events.slice(-40);
    this.save();
    this.render();
  }

  save() {
    try { localStorage.setItem(KEY, JSON.stringify({ version: 1, sections: this.choices })); }
    catch { this.message('Browser storage is unavailable. Download your choices before leaving.'); }
  }

  select(section) {
    this.selected?.classList.remove('paper-explorer-selected');
    this.selected = section;
    section.classList.add('paper-explorer-selected');
    this.message('');
    this.render();
  }

  randomize() {
    if (!this.selected) return;
    const meta = this.metadata();
    if (this.complete(this.selected)) { this.render(); this.message('Every property is locked. Unlock a property to try more.'); return; }
    const current = this.canonical(this.selected);
    const selector = this.editor.selector(this.selected);
    // Faces for this section; the editor refuses a result the page cannot draw.
    const budget = 1 + MAX_NODE_STACK;
    try {
      const next = randomizeVariation(current, meta.locks, this.editor.palette, budget);
      this.editor.change(state => { state.nodes[selector] = next; }, null, () => {
        meta.rolls++;
        this.record('randomize');
      });
      this.message('');
    } catch (error) { this.message(error.message); }
  }

  toggle(key) {
    const meta = this.metadata();
    this.editor.change(() => {
      meta.locks[key] = !meta.locks[key];
      this.record(meta.locks[key] ? 'lock' : 'unlock', key);
    });
  }

  report() {
    return {
      version: 1, createdAt: new Date().toISOString(), page: location.pathname,
      palette: clone(this.editor.palette), environment: this.environment(), layout: clone(this.editor.state),
      sections: this.sections.map(section => {
        const meta = this.metadata(section);
        const node = this.canonical(section);
        const reviewed = meta.reviewed && meta.fingerprint === JSON.stringify(node);
        return { id: key(section), label: key(section), selector: this.editor.selector(section),
          reviewed, allLocked: this.complete(section), rolls: meta.rolls,
          properties: variationProperties(node).map(property => ({ ...property, locked: !!meta.locks[property.key] })),
          node, renderedLayers: this.editor.scene.options.surfaces.filter(surface => surface.element === section)
            .map(surface => ({ height: surface.height, color: surface.color, inset: surface.inset ?? 0, relief: surface.relief })),
          events: clone(meta.events) };
      })
    };
  }

  async submit() {
    this.$('[data-explore-action=save]').disabled = true;
    try {
      const response = await fetch('/api/paper-preferences', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.report()) });
      if (!response.ok) throw Error('The preview could not save your choices. Download them instead.');
      this.message('Choices saved for review. Tell me when you are ready to discuss them.');
    } catch (error) { this.message(error.message); }
    finally { this.$('[data-explore-action=save]').disabled = false; }
  }

  download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(this.report(), null, 2) + '\n'], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'paper-preferences.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  mount() {
    const button = document.createElement('button'); button.id = 'open-section-explorer'; button.textContent = 'Explore sections'; button.dataset.paperUi = '';
    button.setAttribute('aria-controls', 'section-explorer'); button.setAttribute('aria-expanded', 'false');
    const panel = document.createElement('aside'); panel.id = 'section-explorer'; panel.className = 'paper-editor section-explorer'; panel.hidden = true; panel.dataset.paperUi = '';
    panel.setAttribute('aria-label', 'Section variation explorer');
    panel.innerHTML = `<header><h2>Section variations</h2><button data-explore-action="dock" aria-label="Move variation panel to the other side">↔</button><button data-explore-action="close">Done</button></header>
      <p class="editor-help">Click a section to review its current treatment. Lock what you like, then randomize the rest.</p>
      <label for="explore-section">Section</label><select id="explore-section"></select><p class="explore-progress" aria-live="polite"></p>
      <div class="explore-actions"><button data-explore-action="random">Random again</button><button data-explore-action="next">Next section</button></div>
      <div class="explore-actions"><button data-explore-action="undo">Undo</button><button data-explore-action="redo">Redo</button></div>
      <p class="explore-count"></p><div class="explore-properties"></div>
      <div class="explore-actions"><button data-explore-action="lock-all">Lock all</button><button data-explore-action="unlock-all">Unlock all</button></div>
      <p class="editor-note">Locking an inner layer keeps it present when the layer count changes. Elevations are relative to the previous surface.</p>
      <hr><div class="explore-actions"><button data-explore-action="pick" aria-pressed="true">Click sections to select</button><button data-explore-action="inspect">Fine-tune</button></div>
      <button data-explore-action="save" class="explore-save">Save choices for review</button><button data-explore-action="download">Download choices</button>
      <p class="explore-status" role="status"></p>`;
    this.panel = panel; this.button = button; this.$ = selector => panel.querySelector(selector);
    document.body.append(panel, button);
    button.onclick = () => this.open(panel.hidden);
    this.editor.toggle.addEventListener('click', () => this.open(false));
    panel.addEventListener('click', event => {
      const action = event.target.closest('[data-explore-action]')?.dataset.exploreAction;
      if (!action) return;
      if (action === 'close') this.open(false);
      if (action === 'dock') panel.dataset.dock = panel.dataset.dock === 'left' ? 'right' : 'left';
      if (action === 'random') this.randomize();
      if (action === 'undo' || action === 'redo') this.editor.action(action);
      if (action === 'next') {
        const index = this.sections.indexOf(this.selected);
        const next = this.sections.slice(index + 1).concat(this.sections.slice(0, index + 1)).find(section => !this.complete(section));
        if (next) { this.select(next); next.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
      }
      if (action === 'pick') { this.picking = !this.picking; this.render(); }
      if (action === 'inspect' && this.selected) { const selected = this.selected; this.open(false); this.editor.open(true); this.editor.select(selected); }
      if ((action === 'lock-all' || action === 'unlock-all') && this.selected) {
        const meta = this.metadata();
        this.editor.change(() => {
          for (const property of variationProperties(this.canonical(this.selected))) meta.locks[property.key] = action === 'lock-all';
          this.record(action);
        });
      }
      if (action === 'save') this.submit();
      if (action === 'download') this.download();
    });
    this.$('#explore-section').onchange = event => { const section = this.sections.find(section => key(section) === event.target.value); if (section) { this.select(section); section.scrollIntoView({ block: 'start', behavior: 'smooth' }); } };
    document.addEventListener('click', event => {
      if (panel.hidden || !this.picking || !(event.target instanceof Element) || !this.editor.root.contains(event.target)) return;
      const section = event.target.closest('[data-paper]');
      if (!this.sections.includes(section)) return;
      event.preventDefault(); event.stopImmediatePropagation(); this.select(section);
    }, { capture: true, signal: this.signal });
    document.addEventListener('pointerover', event => {
      this.hovered?.classList.remove('paper-explorer-hover');
      this.hovered = !panel.hidden && this.picking && event.target instanceof Element ? event.target.closest('[data-paper]') : null;
      if (this.sections.includes(this.hovered)) this.hovered.classList.add('paper-explorer-hover');
    }, { signal: this.signal });
    document.addEventListener('keydown', event => {
      if (panel.hidden) return;
      if (event.key === 'Escape') { this.picking = false; this.render(); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z' && !event.target.matches('input,textarea,select')) {
        event.preventDefault();
        this.editor.action(event.shiftKey ? 'redo' : 'undo');
      }
    }, { signal: this.signal });
  }

  // Remove the explorer's DOM; its document listeners end with `signal`.
  destroy() {
    this.hovered?.classList.remove('paper-explorer-hover');
    this.selected?.classList.remove('paper-explorer-selected');
    this.panel.remove();
    this.button.remove();
  }

  open(open) {
    if (open) this.editor.open(false);
    this.panel.hidden = !open; this.picking = open;
    this.button.setAttribute('aria-expanded', open);
    this.button.textContent = open ? 'Close exploration' : 'Explore sections';
    if (!open) { this.selected?.classList.remove('paper-explorer-selected'); this.hovered?.classList.remove('paper-explorer-hover'); }
    else this.selected?.classList.add('paper-explorer-selected');
    this.render();
  }

  message(text) { this.$('.explore-status').textContent = text; }

  render() {
    document.documentElement.classList.toggle('paper-exploring', !this.panel.hidden && this.picking);
    const selected = this.selected;
    const chooser = this.$('#explore-section');
    chooser.replaceChildren(new Option('Click a section…', ''), ...this.sections.map(section => new Option(`${key(section)}${this.complete(section) ? ' · locked' : ''}`, key(section))));
    chooser.value = selected ? key(selected) : '';
    this.$('.explore-progress').textContent = `${this.sections.filter(section => this.complete(section)).length} / ${this.sections.length} sections fully locked`;
    this.$('[data-explore-action=pick]').setAttribute('aria-pressed', this.picking !== false);
    this.$('[data-explore-action=random]').disabled = !selected || this.complete(selected);
    this.$('[data-explore-action=random]').textContent = selected && this.metadata().rolls ? 'Random again' : 'Random variation';
    this.$('[data-explore-action=undo]').disabled = !this.editor.undoStack.length;
    this.$('[data-explore-action=redo]').disabled = !this.editor.redoStack.length;
    this.$('[data-explore-action=lock-all]').disabled = !selected;
    this.$('[data-explore-action=unlock-all]').disabled = !selected;
    this.$('[data-explore-action=inspect]').disabled = !selected;
    const container = this.$('.explore-properties'); container.replaceChildren();
    if (!selected) { this.$('.explore-count').textContent = 'Select a section to review it. Only the Random button changes its treatment.'; return; }
    const meta = this.metadata();
    const properties = variationProperties(this.canonical(selected));
    const locked = properties.filter(property => meta.locks[property.key]).length;
    this.$('.explore-count').textContent = `${key(selected)} · ${locked} / ${properties.length} properties locked · ${meta.rolls} variations tried`;
    for (const property of properties) {
      const row = document.createElement('div'); row.className = 'explore-property'; row.dataset.property = property.key;
      const description = document.createElement('div');
      const label = document.createElement('span'); label.className = 'explore-label'; label.textContent = property.label;
      const value = document.createElement('strong');
      if (property.kind === 'color') {
        const swatch = document.createElement('i'); swatch.style.background = property.value; value.append(swatch);
        const name = Object.entries(this.editor.palette).find(([, color]) => color === property.value)?.[0];
        value.append(document.createTextNode(`${name ? name + ' · ' : ''}${property.value}`));
      } else value.textContent = property.kind === 'height' ? `${property.value > 0 ? '+' : ''}${property.value} · ${property.value > 0 ? 'raised' : property.value < 0 ? 'inset' : 'flush'}` : property.kind === 'spacing' ? `${property.value}px` : property.kind === 'texture' ? property.value.toFixed(2) : `${property.value} ${property.value === 1 ? 'layer' : 'layers'}`;
      description.append(label, value);
      const lock = document.createElement('button'); lock.textContent = meta.locks[property.key] ? 'Locked' : 'Lock';
      lock.setAttribute('aria-label', `${meta.locks[property.key] ? 'Unlock' : 'Lock'} ${property.label}`);
      lock.setAttribute('aria-pressed', !!meta.locks[property.key]); lock.onclick = () => this.toggle(property.key);
      row.append(description, lock); container.append(row);
    }
  }
}
