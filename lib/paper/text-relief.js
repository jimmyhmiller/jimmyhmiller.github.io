// Raised and pressed text for the paper renderer.
//
// The DOM keeps drawing the text itself. This only measures where each word
// sits on the page and rasterizes the same words, in the same fonts, into the
// renderer's height map (paper-scene.js prepareTextMask), so the letters are
// lit and shadowed like paper. `relief` is in the renderer's height units
// (a raised sheet is 18 above the desk); negative values press the letters in.
// `spread` widens the impression around each glyph, in CSS pixels.

const transforms = {
  none: (text) => text,
  uppercase: (text) => text.toUpperCase(),
  lowercase: (text) => text.toLowerCase(),
  capitalize: (text) => text.replace(/^\p{L}/u, (letter) => letter.toUpperCase()),
};

let generation = 0;

// The runtime makes a new TextRelief on every refresh (anything that can change
// fonts, sizes or which text is raised), so each instance is one generation of
// text: the renderer redraws its mask whenever the generation changes, even if
// every box kept its size.
export class TextRelief {
  constructor(root, items) {
    this.generation = ++generation;
    for (const item of items) {
      if (!Number.isInteger(item.relief) || item.relief === 0 || Math.abs(item.relief) > 40) {
        throw new Error(`Text relief must be a non-zero whole number within ±40, got ${item.relief}`);
      }
      if (!(item.spread >= 0 && item.spread <= 4)) throw new Error(`Text relief spread must be 0–4px, got ${item.spread}`);
    }
    this.root = root;
    this.items = items;
    this.owner = new Map(items.map((item) => [item.element, item]));
    this.layoutKey = null;
    this.runs = [];
  }

  get empty() {
    return this.items.length === 0;
  }

  // Changes whenever the words move relative to the page (layout, settings) or
  // the page moves relative to the viewport (scrolling a live draw).
  signature() {
    const page = this.root.getBoundingClientRect();
    return JSON.stringify([this.generation, this.layout(page), page.left, page.top]);
  }

  layout(page) {
    return JSON.stringify([page.width, page.height, document.fonts?.status, ...this.items.map((item) => {
      const r = item.element.getBoundingClientRect();
      return [r.left - page.left, r.top - page.top, r.width, r.height, item.relief, item.spread];
    })]);
  }

  // Word boxes in page coordinates, measured from the DOM.
  measure(page) {
    const key = this.layout(page);
    if (key === this.layoutKey) return this.runs;
    const runs = [];
    const range = document.createRange();
    for (const item of this.items) {
      const walker = document.createTreeWalker(item.element, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (this.ownerOf(node) !== item || !this.visible(node.parentElement, item.element)) continue;
        const style = getComputedStyle(node.parentElement);
        const font = `${style.fontStyle} ${style.fontVariantCaps === 'small-caps' ? 'small-caps' : 'normal'} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const transform = transforms[style.textTransform];
        if (!transform) throw new Error(`Text relief does not handle text-transform: ${style.textTransform}`);
        const letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
        const add = (text, start, end) => {
          range.setStart(node, start);
          range.setEnd(node, end);
          const rects = range.getClientRects();
          if (rects.length === 1) {
            const r = rects[0];
            if (r.width > 0) runs.push({ text: transform(text), font, letterSpacing, item, x: r.left - page.left, y: r.top - page.top, width: r.width, height: r.height });
            return true;
          }
          return rects.length === 0;
        };
        for (const match of node.data.matchAll(/\S+/g)) {
          // A word broken across lines falls back to one box per character.
          if (add(match[0], match.index, match.index + match[0].length)) continue;
          for (let i = 0; i < match[0].length; i++) add(match[0][i], match.index + i, match.index + i + 1);
        }
      }
    }
    this.layoutKey = key;
    this.runs = runs;
    return runs;
  }

  ownerOf(node) {
    for (let element = node.parentElement; element; element = element.parentElement) {
      const item = this.owner.get(element);
      if (item) return item;
    }
    throw new Error('Text relief found a text node outside every relief element');
  }

  visible(element, until) {
    for (let current = element; current; current = current.parentElement) {
      const style = getComputedStyle(current);
      if (style.visibility !== 'visible' || style.display === 'none' || Number(style.opacity) === 0) return false;
      if (current === until) return true;
    }
    return true;
  }

  // Draw the words within `window` (client coordinates) into `context`, which
  // is already transformed to client coordinates. Returns the tallest raise.
  draw(context, window) {
    const page = this.root.getBoundingClientRect();
    const runs = this.measure(page);
    let raise = 0;
    context.textBaseline = 'alphabetic';
    context.lineJoin = 'round';
    for (const run of runs) {
      const top = page.top + run.y;
      if (top > window.bottom || top + run.height < window.top) continue;
      const { relief, spread } = run.item;
      raise = Math.max(raise, relief);
      context.font = run.font;
      context.letterSpacing = run.letterSpacing;
      const metrics = context.measureText(run.text);
      if (metrics.width <= 0) continue;
      const ascent = metrics.fontBoundingBoxAscent, descent = metrics.fontBoundingBoxDescent;
      const baseline = top + (run.height - (ascent + descent)) / 2 + ascent;
      const stretch = run.width / metrics.width;
      const color = `rgb(${128 + relief},0,0)`;
      context.save();
      context.translate(page.left + run.x, baseline);
      context.scale(stretch, 1);
      context.fillStyle = color;
      context.fillText(run.text, 0, 0);
      if (spread > 0) {
        context.strokeStyle = color;
        context.lineWidth = spread * 2;
        context.strokeText(run.text, 0, 0);
      }
      context.restore();
    }
    return raise;
  }
}
