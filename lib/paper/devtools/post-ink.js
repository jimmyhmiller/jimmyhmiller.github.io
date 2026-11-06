import { contrast } from '../color';

// Candidate body-text colors for posts, tried against the sheet's paper.
const options = [
  { value: 'auto', name: 'Sheet ink' },
  { value: '#22373c', name: 'Deeper ink' },
  { value: '#021810', name: 'Deep green' },
  { value: '#1f2523', name: 'Charcoal' },
  { value: '#41585c', name: 'Quiet ink' },
  { value: '#476267', name: 'Code slate' },
  { value: '#4a3a28', name: 'Umber' },
  { value: '#5e3527', name: 'Oxblood' },
];

const markup = `<div class="post-ink-options" role="group" aria-label="Post body text"><span>Body text</span>${options.map((option) =>
  `<button type="button" data-post-ink="${option.value}" aria-pressed="false"><i></i>${option.name}</button>`).join('')}</div>
<label class="post-ink-custom">Custom <input id="post-ink-custom" type="color"></label>
<span class="post-ink-readout"><output id="post-ink-hex"></output> · <output id="post-ink-contrast"></output> on paper</span>`;

/** Body-text color lab for posts. It sits above the post sheet whenever a
 * post is showing; the runtime owns and persists the choice. */
export class PostInkLab {
  constructor({ runtime }) {
    this.runtime = runtime;
    this.lab = document.createElement('div');
    this.lab.className = 'post-ink-lab';
    this.lab.dataset.paperUi = '';
    this.lab.setAttribute('aria-label', 'Post body text color');
    this.lab.innerHTML = markup;
    this.lab.querySelectorAll('[data-post-ink]').forEach((button) => {
      button.onclick = () => this.choose(button.dataset.postInk);
    });
    this.lab.querySelector('#post-ink-custom').oninput = (event) => this.choose(event.target.value);
    this.place = () => {
      const sheet = runtime.root.querySelector('.post-sheet');
      if (sheet && sheet.previousElementSibling !== this.lab) sheet.before(this.lab);
      if (!sheet) this.lab.remove();
      if (sheet) this.render();
    };
    runtime.events.addEventListener('refresh', this.place);
    this.place();
  }

  choose(color) {
    this.runtime.setPostInk(color);
    this.render();
  }

  render() {
    const sheet = this.runtime.root.querySelector('.post-sheet');
    if (!sheet) return;
    const face = this.runtime.resolved.get(sheet);
    if (!face) throw new Error('The post sheet has no resolved paper face; is [data-paper="sheet"] in the layout?');
    const sheetInk = sheet.style.getPropertyValue('--ink') || this.runtime.palette.ink;
    const chosen = this.runtime.postInk;
    const shown = chosen === 'auto' ? sheetInk : chosen;
    for (const button of this.lab.querySelectorAll('[data-post-ink]')) {
      const value = button.dataset.postInk;
      const color = value === 'auto' ? sheetInk : value;
      button.querySelector('i').style.background = color;
      button.title = `${color} · ${contrast(color, face.color).toFixed(1)}:1`;
      button.setAttribute('aria-pressed', String(value === chosen));
    }
    this.lab.querySelector('#post-ink-custom').value = shown;
    this.lab.querySelector('#post-ink-hex').value = shown;
    this.lab.querySelector('#post-ink-contrast').value = `${contrast(shown, face.color).toFixed(1)}:1`;
  }
}
