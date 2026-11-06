import { propertyKinds, allowsPaper, properties, validProps, MAX_PAPER_LAYERS } from '../typography';

// Random variations for the type editor, like the section explorer's: every
// unlocked property is rolled again, a locked one keeps exactly its own.
//
// Random never touches the text itself: a roll puts the typeface, ink and
// letters (flat) back to the stylesheet's and explores the element's paper,
// inner layers, spacing, rule and tint.
export const FIXED_TYPE = new Set(['font', 'size', 'lineHeight', 'weight', 'italic', 'caps', 'tracking', 'color', 'inkStrength']);

const CURRENT = undefined;
// How often an unlocked property lands back on the stylesheet's value.
const KEEP_CURRENT = 0.2;

const labels = {
  paper: 'Paper', 'paper.offset': 'Paper height', 'paper.color': 'Paper color', 'paper.relief': 'Paper texture',
  'paper.radius': 'Paper corner', 'paper.layers': 'Inner layers',
};
const paperKeys = ['paper', 'paper.offset', 'paper.color', 'paper.relief', 'paper.radius', 'paper.layers'];

/** Lockable properties for an element type, in panel order. */
export function typeProperties(type) {
  const rows = propertyKinds[type.kind].filter((key) => !FIXED_TYPE.has(key)).map((key) => ({ key, label: properties[key].label }));
  if (allowsPaper(type)) for (const key of paperKeys) rows.push({ key, label: labels[key] });
  return rows;
}

// Code keeps its syntax colors, which only read on light paper.
const lightPapers = ['cream', 'sage', 'mist', 'flax', '#f4ead0', '#e6ecd8', '#d6e5e6', '#ede2c4', '#e9e0cf'];
const darkPapers = ['recess', 'code', 'desk', 'ink', 'deep-green', '#3f5c66', '#4f6650', '#5c5a48'];
const tints = ['none', 'sage', 'mist', 'flax', 'cream', 'code', 'recess', 'ink', 'deep-green'];

/**
 * @param base the stylesheet's values for the element, without any overrides
 *   ({ spaceAbove, spaceBelow }).
 */
export function randomizeType(type, current, locks, base, rng = Math.random) {
  const choose = (values) => values[Math.min(values.length - 1, Math.floor(rng() * values.length))];
  const maybe = (values) => (rng() < KEEP_CURRENT ? CURRENT : choose(values));
  // Scaled from the stylesheet's value, on the property's step, within its range.
  const scaled = (key, value, scales) => scales.map((scale) => {
    const { min, max, step } = properties[key];
    return Math.min(max, Math.max(min, Number((Math.round((value * scale) / step) * step).toFixed(3))));
  });
  const keep = (key) => locks[key] === true;
  const next = {};
  const roll = {
    spaceAbove: () => maybe(scaled('spaceAbove', base.spaceAbove, [0, 0.5, 0.75, 1.25, 1.6, 2])),
    spaceBelow: () => maybe(scaled('spaceBelow', base.spaceBelow, [0, 0.5, 0.75, 1.25, 1.6, 2])),
    indent: () => maybe([0, 0.5, 1, 2, 3]),
    padding: () => maybe([0, 0.4, 0.8, 1.2, 1.6]),
    rule: () => maybe(['none', 'left', 'below', 'above', 'box']),
    tint: () => maybe(tints),
    // Width and strength only mean something once there is a rule or tint.
    ruleWidth: () => (['left', 'below', 'above', 'box'].includes(next.rule) ? choose([1, 2, 3, 4, 6]) : CURRENT),
    tintStrength: () => (next.tint && next.tint !== 'none' ? choose([0.04, 0.08, 0.12, 0.18, 0.25]) : CURRENT),
  };
  const dependent = ['ruleWidth', 'tintStrength'];
  const order = propertyKinds[type.kind].filter((key) => !FIXED_TYPE.has(key))
    .sort((a, b) => dependent.includes(a) - dependent.includes(b));
  for (const key of order) {
    const value = keep(key) ? current[key] : roll[key]();
    if (value !== CURRENT) next[key] = value;
  }

  if (allowsPaper(type)) {
    const was = current.paper;
    const mode = keep('paper') ? (was ? Math.sign(was.offset) : 0) : choose([1, 1, -1, -1, 0]);
    if (mode !== 0) {
      const papers = type.key === 'code-block' ? lightPapers : [...lightPapers, ...darkPapers];
      const color = keep('paper.color') && was ? was.color : choose(papers);
      const layers = keep('paper.layers') ? (was?.stack?.length ?? 0) : choose([0, 0, 1, 1, 2, 3]);
      let previous = color;
      const stack = Array.from({ length: Math.min(layers, MAX_PAPER_LAYERS) }, (_, index) => {
        if (keep('paper.layers') && was?.stack?.[index]) return { ...was.stack[index] };
        const step = {
          offset: choose(mode > 0 ? [2, 3, 4, 6, -2, -3] : [-2, -3, -4, 2, 3]),
          inset: choose([4, 6, 8, 12, 16]),
          color: choose(papers.filter((candidate) => candidate !== previous)),
        };
        previous = step.color;
        return step;
      });
      next.paper = {
        offset: keep('paper.offset') && was ? was.offset : mode * choose(mode > 0 ? [3, 4, 6, 8, 10, 14, 18, 24] : [2, 3, 4, 6, 8, 10]),
        color,
        relief: keep('paper.relief') && was ? was.relief : choose([0.05, 0.12, 0.2, 0.3, 0.45, 0.6]),
        radius: keep('paper.radius') && was ? was.radius : choose([0, 0.7, 0.7, 2, 4, 8]),
        ...(stack.length ? { stack } : {}),
      };
      // Text on a paper needs room from its edge, more with inner layers.
      if (!keep('padding') && propertyKinds[type.kind].includes('padding') && !(next.padding >= 0.6)) {
        next.padding = choose(stack.length ? [1.2, 1.6, 2] : [0.6, 0.8, 1, 1.3]);
      }
    }
  }

  if (!validProps(type, next)) throw new Error(`Random type variation for "${type.key}" is invalid: ${JSON.stringify(next)}`);
  return next;
}
