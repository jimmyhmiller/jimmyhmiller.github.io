import { contrast } from '../color';
import { palette } from '../materials';
import { propertyKinds, allowsPaper, allowsRelief, properties, validProps } from '../typography';

// Random variations for the type editor, like the section explorer's: every
// unlocked property is rolled again, a locked one keeps exactly its own.
// Most rolls land on "current" (the stylesheet's value), so each variation
// changes a handful of properties rather than all of them.

const CURRENT = undefined;
// Random leaves the typeface as the stylesheet designs it: a roll clears any
// of these overrides and only explores ink, spacing, rules, tint, paper and
// letter relief.
export const FIXED_TYPE = new Set(['font', 'size', 'lineHeight', 'weight', 'italic', 'caps', 'tracking']);
const KEEP_CURRENT = 0.65;

const labels = {
  paper: 'Paper', 'paper.offset': 'Paper height', 'paper.color': 'Paper color', 'paper.relief': 'Paper texture', 'paper.radius': 'Paper corner',
  relief: 'Letters', 'relief.depth': 'Letter depth', 'relief.spread': 'Letter spread',
};

/** Lockable properties for an element type, in panel order. */
export function typeProperties(type) {
  const rows = propertyKinds[type.kind].filter((key) => !FIXED_TYPE.has(key)).map((key) => ({ key, label: properties[key].label }));
  if (allowsPaper(type)) for (const key of ['paper', 'paper.offset', 'paper.color', 'paper.relief', 'paper.radius']) rows.push({ key, label: labels[key] });
  if (allowsRelief(type)) for (const key of ['relief', 'relief.depth', 'relief.spread']) rows.push({ key, label: labels[key] });
  return rows;
}

const inks = ['ink', 'code', 'deep-green', '#22373c', '#4a3a28', '#5e3527'];
const papers = ['cream', 'sage', 'mist', 'flax'];

/**
 * @param base the stylesheet's values for the element, without any overrides
 *   ({ spaceAbove, spaceBelow }), and the paper its text sits on (`surface`).
 */
export function randomizeType(type, current, locks, base, rng = Math.random) {
  const choose = (values) => values[Math.min(values.length - 1, Math.floor(rng() * values.length))];
  const maybe = (values) => (rng() < KEEP_CURRENT ? CURRENT : choose(values));
  // Scaled from the stylesheet's value, on the property's step, within its range.
  const scaled = (key, value, scales) => scales.map((scale) => {
    const { min, max, step } = properties[key];
    return Math.min(max, Math.max(min, Number((Math.round((value * scale) / step) * step).toFixed(3))));
  });
  const next = {};
  const keep = (key) => locks[key] === true;
  const allowed = new Set(propertyKinds[type.kind]);
  const roll = {
    color: () => maybe(inks),
    inkStrength: () => maybe([0.85, 0.7]),
    spaceAbove: () => maybe(scaled('spaceAbove', base.spaceAbove, [0.6, 1.4])),
    spaceBelow: () => maybe(scaled('spaceBelow', base.spaceBelow, [0.6, 1.4])),
    indent: () => maybe([0, 1, 2]),
    padding: () => maybe([0, 0.5, 1]),
    rule: () => maybe(['none', 'left', 'below']),
    // Width and strength only mean something once there is a rule or tint.
    ruleWidth: () => (['left', 'below', 'above', 'box'].includes(next.rule) ? maybe([1, 2, 3]) : CURRENT),
    tintStrength: () => (next.tint && next.tint !== 'none' ? maybe([0.06, 0.1, 0.16]) : CURRENT),
    tint: () => maybe(['none', 'sage', 'mist', 'flax', 'code']),
  };
  // Rule and tint before the properties that depend on them.
  const order = [...propertyKinds[type.kind]].sort((a, b) => ['ruleWidth', 'tintStrength'].includes(a) - ['ruleWidth', 'tintStrength'].includes(b));
  for (const key of order) {
    if (FIXED_TYPE.has(key)) continue;
    const value = keep(key) ? current[key] : roll[key]();
    if (value !== CURRENT) next[key] = value;
  }

  if (allowsPaper(type)) {
    const was = current.paper;
    const mode = keep('paper') ? (was ? Math.sign(was.offset) : 0) : maybe([1, -1]) ?? 0;
    if (mode !== 0) {
      const offset = keep('paper.offset') && was ? Math.abs(was.offset) : choose(mode > 0 ? [4, 6, 10, 14] : [3, 6, 8]);
      next.paper = {
        offset: mode * offset,
        color: keep('paper.color') && was ? was.color : choose(papers),
        relief: keep('paper.relief') && was ? was.relief : choose([0.12, 0.22, 0.3, 0.45]),
        radius: keep('paper.radius') && was ? was.radius : choose([0.7, 0.7, 2, 4]),
      };
      // Text on a paper needs room from its edge.
      if (!keep('padding') && allowed.has('padding') && !(next.padding >= 0.5)) next.padding = choose([0.6, 1]);
    }
  }

  if (allowsRelief(type)) {
    const was = current.relief;
    const mode = keep('relief') ? (was ? Math.sign(was.relief) : 0) : maybe([1, -1]) ?? 0;
    if (mode !== 0) {
      const depth = keep('relief.depth') && was ? Math.abs(was.relief) : choose([1, 2, 3, 4]);
      next.relief = { relief: mode * depth, spread: keep('relief.spread') && was ? was.spread : choose([0, 0, 0.5, 1]) };
    }
  }

  // Unlocked ink that would be hard to read on its paper goes back to the sheet's.
  if (!keep('color') && next.color !== CURRENT) {
    const surface = next.paper ? palette[next.paper.color] ?? next.paper.color : base.surface;
    const ink = palette[next.color] ?? (next.color === 'ink' ? palette.ink : next.color);
    if (contrast(ink, surface) < 4.5) delete next.color;
  }
  if (!validProps(type, next)) throw new Error(`Random type variation for "${type.key}" is invalid: ${JSON.stringify(next)}`);
  return next;
}
