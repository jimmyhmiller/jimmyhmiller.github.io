const markup = `<div class="green-lab-modes"><span>Broken halo</span><button data-green-preset="screenshot">Your setting</button><button data-green-preset="spill">Wide spill</button><button data-green-preset="torn">Torn rows</button><button data-green-preset="islands">Islands</button></div><div class="green-lab-modes" role="group" aria-label="Podcast background"><span>Background</span><button data-green-background="paper" aria-pressed="true">Paper</button><button data-green-background="dark" aria-pressed="false">Deep green</button></div><div class="green-lab-sliders"><label>Ink <input id="green-amount" max="3" min="0" step=".01" type="range"><output id="green-amount-value"></output></label><label>Reach <input id="green-reach" max="8" min=".5" step=".05" type="range"><output id="green-reach-value"></output></label><label>Row shift <input id="green-shift" max="3" min="0" step=".01" type="range"><output id="green-shift-value"></output></label></div><details class="green-randomness" open><summary>Pattern randomness</summary><div class="green-random-controls"><button id="green-shuffle">Shuffle pattern ↻</button><label>Seed <input id="green-seed" max="65535" min="0" step="1" type="number"></label><label>Disorder <input id="green-disorder" max="3" min="0" step=".01" type="range"><output id="green-disorder-value"></output></label><label>Band size <input id="green-band-size" max="1" min="0" step=".01" type="range"><output id="green-band-size-value"></output></label><label>Speckle <input id="green-speckle" max="1" min="0" step=".01" type="range"><output id="green-speckle-value"></output></label><label>Tears <input id="green-tears" max="1" min="0" step=".01" type="range"><output id="green-tears-value"></output></label><label>Bursts <input id="green-bursts" max="1" min="0" step=".01" type="range"><output id="green-bursts-value"></output></label></div></details>`;

/** The podcast green-ink lab from experiments/paper-homepage. It sits under the
 * podcast paper whenever the homepage is showing; the runtime owns the state. */
export class GreenLab {
  constructor({ runtime, signal }) {
    this.signal = signal;
    this.runtime = runtime;
    this.state = structuredClone(runtime.green);
    this.lab = document.createElement('div');
    this.lab.className = 'green-lab';
    this.lab.dataset.paperUi = '';
    this.lab.setAttribute('aria-label', 'Podcast green experiments');
    this.lab.innerHTML = markup;
    const $ = selector => this.lab.querySelector(selector);
    this.$ = $;
    this.lab.querySelectorAll('[data-green-background]').forEach(button => button.onclick = () => {
      this.state.background = button.dataset.greenBackground;
      this.update();
    });
    for (const [id, property] of [['green-amount', 'amount'], ['green-reach', 'reach'], ['green-shift', 'shift'], ['green-disorder', 'disorder'], ['green-band-size', 'bandSize'], ['green-speckle', 'speckle'], ['green-tears', 'tears'], ['green-bursts', 'bursts']]) {
      $(`#${id}`).oninput = event => {
        if (property !== 'amount' && this.state.amount === 0) this.state.amount = .7;
        this.state[property] = +event.target.value;
        this.update();
      };
    }
    this.lab.querySelectorAll('[data-green-preset]').forEach(button => button.onclick = () => {
      const presets = {
        screenshot: { amount: 1, reach: 2.3, shift: .6, seed: 30670, disorder: 1, bandSize: 0, speckle: .5, tears: 0, bursts: 0 },
        spill: { amount: 1.6, reach: 5, shift: 1.8, disorder: 2, bandSize: 0, speckle: .5, tears: .15, bursts: .45 },
        torn: { amount: 1.5, reach: 3.8, shift: 2.5, disorder: 2.8, bandSize: .18, speckle: .55, tears: .75, bursts: .2 },
        islands: { amount: 2.1, reach: 4.6, shift: 1.4, disorder: 1.8, bandSize: .08, speckle: .65, tears: .35, bursts: .95 }
      };
      const preset = presets[button.dataset.greenPreset];
      Object.assign(this.state, preset, { mode: 'halo' });
      if (button.dataset.greenPreset !== 'screenshot') this.state.seed = (this.state.seed + 1 + Math.floor(Math.random() * 65535)) % 65536;
      this.update();
    });
    $('#green-shuffle').onclick = () => {
      this.state.seed = (this.state.seed + 1 + Math.floor(Math.random() * 65535)) % 65536;
      if (this.state.amount === 0) this.state.amount = .7;
      this.update();
    };
    $('#green-seed').onchange = event => {
      if (!event.target.validity.valid || event.target.value === '') { this.render(); return; }
      this.state.seed = +event.target.value;
      this.update();
    };
    this.place = () => {
      const podcast = runtime.root.querySelector('#podcast-title');
      if (podcast && podcast.nextElementSibling !== this.lab) podcast.after(this.lab);
      if (!podcast) this.lab.remove();
    };
    runtime.events.addEventListener('refresh', this.place, { signal: this.signal });
    this.place();
    this.render();
  }

  destroy() {
    this.lab.remove();
  }

  update() {
    this.runtime.setGreen(structuredClone(this.state));
    this.render();
  }

  render() {
    const $ = this.$;
    this.lab.querySelectorAll('[data-green-background]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.greenBackground === this.state.background)));
    for (const [id, property] of [['green-amount', 'amount'], ['green-reach', 'reach'], ['green-shift', 'shift'], ['green-disorder', 'disorder'], ['green-band-size', 'bandSize'], ['green-speckle', 'speckle'], ['green-tears', 'tears'], ['green-bursts', 'bursts']]) {
      $(`#${id}`).value = this.state[property];
      const output = $(`#${id}-value`);
      if (output) output.value = property === 'reach' ? `${this.state.reach.toFixed(1)}×` : property === 'bandSize' ? `${Math.pow(9, this.state.bandSize - .5).toFixed(1)}×` : `${Math.round(this.state[property] * 100)}%`;
    }
    $('#green-seed').value = this.state.seed;
  }
}
