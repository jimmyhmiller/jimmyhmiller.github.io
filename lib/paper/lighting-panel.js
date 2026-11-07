import { PaperScene } from './paper-scene';

const sun = () => document.querySelector('#lighting-sun');

/** All light controls remain visible together; selection only identifies a dragged source. */
export class LightingPanel {
  constructor({ getSettings, onChange, reset }) {
    Object.assign(this, { getSettings, onChange, reset });
    this.dialog = document.querySelector('#paper-settings');
    this.pad = this.dialog.querySelector('#study-light-pad');
    this.cards = this.dialog.querySelector('#lighting-cards');
    this.points = this.dialog.querySelector('#light-points');
    this.dragging = null;
    this.build();
    document.querySelector('#close-settings').onclick = () => this.dialog.close();
    this.dialog.addEventListener('close', () => { sun()?.setAttribute('aria-expanded', 'false'); this.surfaceScene?.destroy(); this.surfaceScene = null; this.surfaceCanvas?.remove(); });
    this.dialog.addEventListener('scroll', () => this.refreshSurfaces(), { passive: true });
    this.dialog.querySelector('details').addEventListener('toggle', () => this.refreshSurfaces());
    this.resized = () => this.refreshSurfaces();
    window.addEventListener('resize', this.resized);
    this.dialog.addEventListener('click', event => {
      if (event.target !== this.dialog) return;
      const r = this.dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) this.dialog.close();
    });
    this.pad.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault();
      const settings = this.getSettings();
      const marker = event.target.closest('[data-light]');
      if (marker) this.dragging = +marker.dataset.light;
      else {
        const r = this.pad.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width * 3 - 1, y = (event.clientY - r.top) / r.height * 3 - 1;
        const distance = light => (light.x - x) ** 2 + (light.y - y) ** 2;
        this.dragging = settings.lights.reduce((best, light, index) => distance(light) < distance(settings.lights[best]) ? index : best, 0);
      }
      settings.selected = this.dragging;
      this.pad.setPointerCapture(event.pointerId);
      this.move(event);
    });
    this.pad.addEventListener('pointermove', event => {
      if (this.dragging !== null && this.pad.hasPointerCapture(event.pointerId)) this.move(event);
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) this.pad.addEventListener(type, event => {
      this.dragging = null;
      if (this.pad.hasPointerCapture(event.pointerId)) this.pad.releasePointerCapture(event.pointerId);
    });
    this.dialog.querySelector('#add-light').onclick = () => {
      const settings = this.getSettings();
      if (settings.lights.length >= 4) return;
      settings.lights.push({ x: .5, y: .2, height: 850, intensity: .35, type: 'distributed' });
      settings.selected = settings.lights.length - 1;
      this.build(); this.changed();
    };
    for (const [id, property] of [['light-depth', 'depth'], ['paper-height', 'paperHeight']]) {
      this.dialog.querySelector(`#${id}`).addEventListener('input', event => {
        this.getSettings()[property] = +event.target.value;
        this.changed();
      });
    }
    this.dialog.querySelector('#reset-lighting').onclick = () => { this.reset(); this.build(); this.changed(); };
    this.render();
  }

  open() {
    const button = sun();
    if (!button) throw new Error('The lighting panel opens from #lighting-sun, which is not on this page');
    const anchor = button.getBoundingClientRect();
    const top = Math.max(12, Math.min(anchor.bottom + 10, innerHeight - 180));
    this.dialog.style.top = `${top}px`;
    this.dialog.style.maxHeight = `calc(100svh - ${top + 12}px)`;
    this.dialog.style.right = innerWidth <= 700 ? '12px' : `${Math.max(18, innerWidth - anchor.right)}px`;
    if (!this.dialog.open) this.dialog.showModal();
    button.setAttribute('aria-expanded', 'true');
    this.createSurfaceScene();
    this.refreshSurfaces();
  }

  createSurfaceScene() {
    if (this.surfaceScene) return;
    this.surfaceCanvas = document.createElement('canvas');
    this.surfaceCanvas.className = 'lighting-material-canvas';
    this.surfaceCanvas.setAttribute('aria-hidden', 'true');
    this.dialog.prepend(this.surfaceCanvas);
    this.surfaceScene = new PaperScene(this.surfaceCanvas, null, null, this.getSettings(), { desk: '#547076' }, {
      transparentBase: true, renderBounds: this.dialog, surfaces: [], onError: error => { this.dialog.querySelector('#render-status').textContent = error.message; }
    });
    this.surfaceScene.ready.catch(error => { this.dialog.querySelector('#render-status').textContent = error.message; });
  }

  refreshSurfaces() {
    if (!this.dialog.open || !this.surfaceScene) return;
    this.surfaceScene.settings = this.getSettings();
    const scale = innerWidth / 1280;
    const face = (element, height, color, radius, bounds) => ({ element, height, color, radius: radius / scale, relief: .28, bounds, clip: element === this.dialog ? null : this.dialog });
    const surfaces = [face(this.dialog, 48, '#ffefae', 18), face(this.pad, 43, '#c5c8ab', 10), face(this.dialog.querySelector('.lighting-page'), 46, '#e5d9b9', 3)];
    for (const point of this.points.children) surfaces.push(face(point, 54, '#ad9656', 14));
    for (const input of this.dialog.querySelectorAll('input[type=range]')) {
      if (!input.getClientRects().length || input.closest('details')?.open === false) continue;
      surfaces.push(face(input, 46, '#b6b99e', 2, r => ({ left:r.left, top:r.top+r.height/2-2, width:r.width, height:4 })));
      surfaces.push(face(input, 55, '#ffefae', 7, r => {
        const value = (input.value-input.min)/(input.max-input.min);
        return {left:r.left+7+(r.width-14)*value-7, top:r.top+r.height/2-7, width:14,height:14};
      }));
    }
    this.surfaceScene.setSurfaces(surfaces);
    this.surfaceScene.schedule();
  }

  build() {
    const settings = this.getSettings();
    this.cards.replaceChildren(); this.points.replaceChildren();
    settings.lights.forEach((light, index) => {
      const card = document.createElement('section');
      card.className = 'lighting-card'; card.dataset.lightCard = index;
      card.style.setProperty('--light-color', `var(--light-${index})`);
      card.innerHTML = `<header class="lighting-card-heading"><h3 class="lighting-card-title"><span class="lighting-card-dot" aria-hidden="true"></span>Light ${String(index + 1).padStart(2, '0')}</h3><div class="lighting-card-actions"><button class="lighting-toggle" role="switch"></button><button class="lighting-remove" aria-label="Remove Light ${index + 1}">×</button></div></header>
        <label class="lighting-source-kind">Source <select data-control="kind" aria-label="Light ${index + 1} source"><option value="distributed">Along page</option><option value="point">Single point</option></select></label>
        <label class="lighting-range">Strength <output data-output="strength"></output><input type="range" data-control="strength" aria-label="Light ${index + 1} strength" min="0" max="2" step=".001"></label>
        <label class="lighting-range">Height <output data-output="height"></output><input type="range" data-control="height" aria-label="Light ${index + 1} height" min="200" max="2000" step="1"></label>
        <p class="lighting-coordinates"></p>`;
      card.querySelector('[data-control=kind]').onchange = event => { this.getSettings().lights[index].type = event.target.value; this.changed(); };
      for (const [control, property] of [['strength', 'intensity'], ['height', 'height']]) {
        card.querySelector(`[data-control=${control}]`).oninput = event => {
          const settings = this.getSettings();
          settings.selected = index;
          settings.lights[index][property] = +event.target.value;
          this.changed();
        };
      }
      card.querySelector('.lighting-toggle').onclick = () => {
        const light = this.getSettings().lights[index];
        if (light.intensity > 0) { light.mutedIntensity = light.intensity; light.intensity = 0; }
        else light.intensity = light.mutedIntensity > 0 ? light.mutedIntensity : 1;
        this.changed();
      };
      card.querySelector('.lighting-remove').onclick = () => {
        const settings = this.getSettings();
        if (settings.lights.length === 1) return;
        settings.lights.splice(index, 1);
        settings.selected = Math.max(0, Math.min(settings.selected - (index < settings.selected ? 1 : 0), settings.lights.length - 1));
        this.build(); this.changed();
      };
      this.cards.append(card);
      const point = document.createElement('button');
      point.className = 'light-point'; point.dataset.light = index; point.textContent = index + 1;
      point.style.setProperty('--light-color', `var(--light-${index})`);
      point.setAttribute('aria-label', `Light ${index + 1} position; arrow keys move`);
      point.onkeydown = event => {
        const step = event.shiftKey ? .1 : .01;
        const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
        if (!delta) return;
        event.preventDefault();
        const settings = this.getSettings(), light = settings.lights[index];
        settings.selected = index;
        light.x = Math.max(-1, Math.min(2, light.x + delta[0]));
        light.y = Math.max(-1, Math.min(2, light.y + delta[1]));
        this.changed();
      };
      this.points.append(point);
    });
  }

  move(event) {
    const bounds = this.pad.getBoundingClientRect();
    const light = this.getSettings().lights[this.dragging];
    light.x = Math.max(-1, Math.min(2, (event.clientX - bounds.left) / bounds.width * 3 - 1));
    light.y = Math.max(-1, Math.min(2, (event.clientY - bounds.top) / bounds.height * 3 - 1));
    this.changed();
  }

  changed() {
    // The panel's own paper draws cheaply while edits stream in, like the page.
    this.surfaceScene?.setInteractive(true);
    clearTimeout(this.interactionTimer);
    this.interactionTimer = setTimeout(() => this.surfaceScene?.setInteractive(false), 200);
    this.render();
    this.onChange();
  }

  destroy() {
    clearTimeout(this.interactionTimer);
    window.removeEventListener('resize', this.resized);
    if (this.dialog.open) this.dialog.close();
    this.surfaceScene?.destroy();
    this.surfaceScene = null;
  }

  range(input, value) {
    input.value = value;
    input.style.setProperty('--fill', `${(value - +input.min) / (+input.max - +input.min) * 100}%`);
  }

  render() {
    const settings = this.getSettings();
    settings.lights.forEach((light, index) => {
      const card = this.cards.children[index], point = this.points.children[index];
      card.dataset.muted = light.intensity === 0;
      card.querySelector('[data-control=kind]').value = light.type === 'distributed' ? 'distributed' : 'point';
      point.title = light.type === 'distributed' ? 'Point lights repeated down the page — drag to adjust the pattern' : 'Point light — drag in both directions';
      this.range(card.querySelector('[data-control=strength]'), light.intensity);
      this.range(card.querySelector('[data-control=height]'), light.height);
      card.querySelector('[data-output=strength]').value = `${Math.round(light.intensity * 100)}%`;
      card.querySelector('[data-output=height]').value = `${Math.round(light.height)} pt`;
      const toggle = card.querySelector('.lighting-toggle');
      toggle.setAttribute('aria-checked', light.intensity > 0);
      toggle.setAttribute('aria-label', `Turn Light ${index + 1} ${light.intensity > 0 ? 'off' : 'on'}`);
      card.querySelector('.lighting-remove').disabled = settings.lights.length === 1;
      card.querySelector('.lighting-coordinates').textContent = `${light.type === 'distributed' ? 'Along page · ' : ''}x ${light.x.toFixed(2)} / y ${light.y.toFixed(2)}`;
      point.style.left = `${(light.x + 1) / 3 * 100}%`; point.style.top = `${(light.y + 1) / 3 * 100}%`;
      point.dataset.muted = light.intensity === 0;
      point.setAttribute('aria-pressed', index === settings.selected);
    });
    for (const [id, output, value] of [['light-depth', 'depth-value', settings.depth], ['paper-height', 'paper-height-value', settings.paperHeight]]) {
      this.range(this.dialog.querySelector(`#${id}`), value);
      this.dialog.querySelector(`#${output}`).value = value.toFixed(2);
    }
    this.dialog.querySelector('#add-light').disabled = settings.lights.length >= 4;
    this.refreshSurfaces();
  }
}
