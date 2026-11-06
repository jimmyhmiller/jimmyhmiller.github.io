// Post typography overrides, edited with the type tool (lib/paper/devtools/type.js)
// on /dev/markdown and applied on every post.
//
// Each markdown element type has a CSS selector under `.post-sheet`. Its entry
// in `state.elements` holds only the properties that differ from the
// stylesheet (styles/globals.css); an empty entry is the current design.
// Besides CSS, a block element can sit on its own paper (`paper`) and any
// element's letters can be raised or pressed into the page (`relief`); the
// runtime turns those into renderer surfaces and text relief.

import { palette, postPapers } from './materials';

export const TYPOGRAPHY_KEY = 'jimmyhmiller-paper-typography-v1';

// kind: 'block' may take paper; 'inline' takes type and relief; 'media' takes
// paper only; 'pseudo' (a ::first-letter) takes type only.
export const elementTypes = [
  { key: 'title', label: 'Title', selector: '.article-title', kind: 'block' },
  { key: 'date', label: 'Date', selector: '.article-date', kind: 'block' },
  { key: 'h2', label: 'Heading 2', selector: '.article h2', kind: 'block' },
  { key: 'h3', label: 'Heading 3', selector: '.article h3', kind: 'block' },
  { key: 'h4', label: 'Heading 4', selector: '.article h4', kind: 'block' },
  { key: 'paragraph', label: 'Paragraph', selector: '.article p', kind: 'block' },
  { key: 'dropcap', label: 'Drop cap', selector: '.article > p:first-of-type:has(+ p)::first-letter', kind: 'pseudo' },
  { key: 'link', label: 'Link', selector: '.article a:not(.heading-anchor)', kind: 'inline' },
  { key: 'strong', label: 'Bold', selector: '.article strong', kind: 'inline' },
  { key: 'em', label: 'Italic', selector: '.article em', kind: 'inline' },
  { key: 'inline-code', label: 'Inline code', selector: '.article :not(pre) > code', kind: 'inline' },
  { key: 'code-block', label: 'Code block', selector: '.article pre', kind: 'block' },
  { key: 'blockquote', label: 'Quote', selector: '.article blockquote', kind: 'block' },
  { key: 'attribution', label: 'Quote attribution', selector: '.article blockquote cite', kind: 'inline' },
  { key: 'ordered-list', label: 'Numbered list', selector: '.article ol', kind: 'block' },
  { key: 'unordered-list', label: 'Bulleted list', selector: '.article ul', kind: 'block' },
  { key: 'list-item', label: 'List item', selector: '.article li', kind: 'block' },
  { key: 'table', label: 'Table', selector: '.article table', kind: 'block' },
  { key: 'table-head', label: 'Table header', selector: '.article th', kind: 'inline' },
  { key: 'table-cell', label: 'Table cell', selector: '.article td', kind: 'inline' },
  { key: 'image', label: 'Image', selector: '.article img, .article video', kind: 'media' },
  { key: 'rule', label: 'Rule', selector: '.article hr', kind: 'media' },
  { key: 'aside', label: 'Aside', selector: '.article .post-aside', kind: 'block' },
  { key: 'note', label: 'Note', selector: '.article .post-note', kind: 'block' },
];

export const elementType = (key) => {
  const type = elementTypes.find((candidate) => candidate.key === key);
  if (!type) throw new Error(`Unknown post element type "${key}" (see lib/paper/typography.js)`);
  return type;
};

const fonts = { serif: 'var(--serif)', sans: 'var(--sans)', mono: 'var(--mono)' };

// Every editable property: its control and how it becomes CSS.
export const properties = {
  font: { label: 'Font', options: Object.keys(fonts), css: (v) => ({ 'font-family': fonts[v] }) },
  size: { label: 'Size', min: 9, max: 120, step: 0.5, unit: 'px', css: (v) => ({ 'font-size': `${v}px` }) },
  lineHeight: { label: 'Line height', min: 0.9, max: 2.4, step: 0.05, css: (v) => ({ 'line-height': String(v) }) },
  weight: { label: 'Weight', options: [300, 400, 500, 600, 700], css: (v) => ({ 'font-weight': String(v) }) },
  italic: { label: 'Italic', options: [false, true], css: (v) => ({ 'font-style': v ? 'italic' : 'normal' }) },
  caps: { label: 'Caps', options: ['none', 'uppercase', 'small-caps'],
    css: (v) => ({ 'text-transform': v === 'uppercase' ? 'uppercase' : 'none', 'font-variant-caps': v === 'small-caps' ? 'small-caps' : 'normal' }) },
  tracking: { label: 'Letter spacing', min: -0.06, max: 0.3, step: 0.005, unit: 'em', css: (v) => ({ 'letter-spacing': `${v}em` }) },
  // Post paragraphs and lists take their color from --ink-body, so ink set on
  // a container (a quote, a note) restates it for the prose inside.
  color: { label: 'Ink', color: true, css: (v) => ({ color: inkValue(v), '--ink-body': inkValue(v) }) },
  inkStrength: { label: 'Ink strength', min: 0, max: 1, step: 0.05, css: (v, props) => {
    const ink = `color-mix(in srgb, ${inkValue(props.color ?? 'ink')} ${Math.round(v * 100)}%, transparent)`;
    return { color: ink, '--ink-body': ink };
  } },
  spaceAbove: { label: 'Space above', min: 0, max: 4, step: 0.05, unit: 'em', css: (v) => ({ 'margin-top': `${v}em` }) },
  spaceBelow: { label: 'Space below', min: 0, max: 4, step: 0.05, unit: 'em', css: (v) => ({ 'margin-bottom': `${v}em` }) },
  indent: { label: 'Indent', min: 0, max: 4, step: 0.05, unit: 'em', css: (v) => ({ 'margin-left': `${v}em` }) },
  padding: { label: 'Padding', min: 0, max: 3, step: 0.05, unit: 'em', css: (v) => ({ padding: `${v}em` }) },
  rule: { label: 'Rule', options: ['none', 'left', 'below', 'above', 'box'], css: (v, props) => ruleCss(v, props) },
  ruleWidth: { label: 'Rule width', min: 1, max: 8, step: 1, unit: 'px', css: () => ({}) },
  // A tint is printed over whatever is beneath, paper included, so it is a
  // background image: paper nodes only clear their background color.
  tint: { label: 'Tint', color: true, allowNone: true, css: (v, props) => {
    if (v === 'none') return { background: 'none' };
    const tint = `color-mix(in srgb, ${inkValue(v)} ${Math.round((props.tintStrength ?? 0.1) * 100)}%, transparent)`;
    return { 'background-color': 'transparent', 'background-image': `linear-gradient(${tint}, ${tint})` };
  } },
  tintStrength: { label: 'Tint strength', min: 0, max: 1, step: 0.02, css: () => ({}) },
};

// Paper and relief are separate groups: they drive the renderer, not CSS.
export const paperProperties = {
  offset: { label: 'Height', min: -12, max: 30, step: 1 },
  color: { label: 'Paper', color: true },
  relief: { label: 'Texture', min: 0, max: 0.85, step: 0.01 },
  radius: { label: 'Corner', min: 0, max: 12, step: 0.1 },
};
// Inner faces a post element's paper may carry (see paper.stack).
export const MAX_PAPER_LAYERS = 3;
export const reliefProperties = {
  relief: { label: 'Depth', min: -12, max: 12, step: 1 },
  spread: { label: 'Spread', min: 0, max: 4, step: 0.25, unit: 'px' },
};

export const propertyKinds = {
  block: [...Object.keys(properties)],
  inline: Object.keys(properties).filter((key) => !['spaceAbove', 'spaceBelow', 'indent'].includes(key)),
  media: ['color', 'inkStrength', 'spaceAbove', 'spaceBelow', 'indent', 'padding', 'rule', 'ruleWidth', 'tint', 'tintStrength'],
  pseudo: ['font', 'size', 'lineHeight', 'weight', 'italic', 'tracking', 'color', 'inkStrength'],
};
export const allowsPaper = (type) => type.kind === 'block' || type.kind === 'media';

// The paper an element type sits on: its override in the type tool (null
// meaning none), else the design's (materials.js postPapers), else none.
export function paperFor(type, props = {}) {
  if (Object.hasOwn(props, 'paper')) return props.paper;
  return postPapers[type.key] ?? null;
}
for (const key of Object.keys(postPapers)) {
  const type = elementTypes.find((candidate) => candidate.key === key);
  if (!type || !allowsPaper(type)) throw new Error(`materials.js postPapers names "${key}", which cannot take paper`);
}
export const allowsRelief = (type) => type.kind === 'block' || type.kind === 'inline';

function inkValue(value) {
  if (value === 'ink') return 'var(--ink)';
  if (Object.hasOwn(palette, value)) return palette[value];
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  throw new Error(`Unknown ink "${value}"`);
}

function ruleCss(rule, props) {
  const line = `${props.ruleWidth ?? 1}px solid currentColor`;
  const none = { 'border-left': '0', 'border-top': '0', 'border-bottom': '0', 'border-right': '0' };
  if (rule === 'none') return { ...none, 'padding-left': props.padding === undefined ? '0' : undefined };
  if (rule === 'box') return { border: line };
  const side = { left: 'border-left', below: 'border-bottom', above: 'border-top' }[rule];
  return { ...none, [side]: line };
}

export function emptyTypography() {
  return { version: 1, elements: {}, saved: {} };
}

const validColor = (value, allowNone = false) => value === 'ink' || (allowNone && value === 'none') || Object.hasOwn(palette, value) || /^#[0-9a-f]{6}$/i.test(value);

function validValue(spec, value) {
  if (spec.color) return validColor(value, spec.allowNone);
  if (spec.options) return spec.options.includes(value);
  return Number.isFinite(value) && value >= spec.min && value <= spec.max;
}

export function validProps(type, props) {
  if (!props || typeof props !== 'object' || Array.isArray(props)) return false;
  const allowed = new Set(propertyKinds[type.kind]);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'paper') {
      if (!allowsPaper(type)) return false;
      if (value === null) continue;
      if (typeof value !== 'object') return false;
      if (!Object.entries(paperProperties).every(([name, spec]) => validValue(spec, value[name]))) return false;
      // Optional inner faces, each inset from and stepped above or below the last.
      if (value.stack !== undefined && !(Array.isArray(value.stack) && value.stack.length <= MAX_PAPER_LAYERS && value.stack.every((step) =>
        Number.isInteger(step?.offset) && step.offset >= -12 && step.offset <= 24 && step.offset !== 0
        && Number.isFinite(step.inset) && step.inset >= 1 && step.inset <= 40 && validColor(step.color)))) return false;
      continue;
    }
    if (key === 'relief') {
      if (!allowsRelief(type) || !value || typeof value !== 'object') return false;
      if (!Number.isInteger(value.relief) || value.relief === 0 || !validValue(reliefProperties.relief, value.relief) || !validValue(reliefProperties.spread, value.spread)) return false;
      continue;
    }
    if (!allowed.has(key) || !validValue(properties[key], value)) return false;
  }
  return true;
}

export function validTypography(state) {
  if (state?.version !== 1 || !state.elements || typeof state.elements !== 'object' || !state.saved || typeof state.saved !== 'object') return false;
  for (const [key, props] of Object.entries(state.elements)) {
    const type = elementTypes.find((candidate) => candidate.key === key);
    if (!type || !validProps(type, props)) return false;
  }
  for (const [key, variations] of Object.entries(state.saved)) {
    const type = elementTypes.find((candidate) => candidate.key === key);
    if (!type || !variations || typeof variations !== 'object') return false;
    for (const [name, props] of Object.entries(variations)) {
      if (name.length < 1 || name.length > 40 || !validProps(type, props)) return false;
    }
  }
  return true;
}

export function loadTypography() {
  try {
    const saved = JSON.parse(localStorage.getItem(TYPOGRAPHY_KEY));
    if (validTypography(saved)) return saved;
  } catch { /* Unavailable or malformed storage leaves the stylesheet as is. */ }
  return emptyTypography();
}

// The stylesheet for the overrides. Declarations are !important so a choice
// made in the tool wins over the post stylesheet and inline component styles.
export function typographyCss(state) {
  const rules = [];
  for (const [key, props] of Object.entries(state.elements)) {
    const type = elementType(key);
    const declarations = {};
    for (const name of propertyKinds[type.kind]) {
      if (props[name] === undefined) continue;
      Object.assign(declarations, properties[name].css(props[name], props));
    }
    // Ink strength restates the color it fades, so it goes last.
    if (props.inkStrength !== undefined) Object.assign(declarations, properties.inkStrength.css(props.inkStrength, props));
    const body = Object.entries(declarations).filter(([, value]) => value !== undefined)
      .map(([property, value]) => `${property}: ${value} !important;`).join(' ');
    if (!body) continue;
    const selector = type.selector.split(',').map((part) => `.post-sheet ${part.trim()}`).join(', ');
    rules.push(`${selector} { ${body} }`);
  }
  return rules.join('\n');
}

// Starting points for each element. "Current" is the stylesheet as it is.
const raised = (relief, spread = 0) => ({ relief: { relief, spread } });
const paper = (offset, color, extra = {}) => ({ paper: { offset, color, relief: 0.3, radius: 0.7 }, padding: 1, ...extra });
export const presets = {
  title: { Raised: raised(3), Pressed: raised(-3, 0.5), 'Blind emboss': { inkStrength: 0.08, ...raised(4, 0.5) }, 'Small caps': { caps: 'small-caps', tracking: 0.02 } },
  date: { Pressed: raised(-2), Serif: { font: 'serif', caps: 'none', size: 14, italic: true, tracking: 0 } },
  h2: { Raised: raised(3), Pressed: raised(-3, 0.5), 'Sans caps': { font: 'sans', caps: 'uppercase', size: 14, weight: 700, tracking: 0.12 }, 'Rule below': { rule: 'below', padding: 0.25 } },
  h3: { Upright: { italic: false }, Sans: { font: 'sans', italic: false, size: 17, weight: 700 }, Pressed: raised(-2, 0.25) },
  h4: { 'Serif italic': { font: 'serif', caps: 'none', italic: true, size: 19, tracking: 0 }, Pressed: raised(-2) },
  paragraph: { Sans: { font: 'sans', size: 17, lineHeight: 1.6 }, Larger: { size: 21 }, Tighter: { lineHeight: 1.5 }, 'Pressed ink': raised(-1) },
  dropcap: { Sans: { font: 'sans', weight: 700 }, Italic: { italic: true } },
  link: { Raised: raised(1), 'Ink color': { color: 'code' } },
  strong: { Raised: raised(1), 'Sans bold': { font: 'sans', size: 16 } },
  em: { Raised: raised(1), Pressed: raised(-1) },
  'inline-code': { 'No tint': { tint: 'none' }, Pressed: { tint: 'none', ...raised(-2) } },
  'code-block': { 'Mist well': paper(-6, 'mist', { tint: 'none' }), 'Flax well': paper(-6, 'flax', { tint: 'none' }), 'Raised card': paper(8, 'cream', { tint: 'none' }) },
  blockquote: { 'Sage slip': paper(6, 'sage', { rule: 'none' }), 'Mist slip': paper(6, 'mist', { rule: 'none' }), 'Pressed well': paper(-6, 'flax', { rule: 'none' }), 'Large italic': { size: 24 } },
  attribution: { Pressed: raised(-1), Serif: { font: 'serif', caps: 'none', italic: true, size: 15, tracking: 0 } },
  'ordered-list': { 'Indented less': { indent: 0 } },
  'unordered-list': { 'Indented less': { indent: 0 } },
  'list-item': { Looser: { spaceBelow: 0.8 } },
  table: { 'Sage paper': paper(6, 'sage', { padding: 0.5 }), 'Mist well': paper(-6, 'mist', { padding: 0.5 }) },
  'table-head': { Pressed: raised(-1), Serif: { font: 'serif', caps: 'none', size: 15, tracking: 0, italic: true } },
  'table-cell': { Sans: { font: 'sans' }, Pressed: raised(-1) },
  image: { 'Raised mount': paper(10, 'cream', { padding: 0.6 }), 'Inset': paper(-6, 'recess', { padding: 0.6 }) },
  rule: { Faint: { rule: 'above', inkStrength: 0.3 } },
  aside: { 'Raised slip': paper(6, 'mist', { tint: 'none', rule: 'none' }), 'Inset': paper(-6, 'flax', { tint: 'none', rule: 'none' }) },
  note: { 'Raised slip': paper(6, 'sage', { tint: 'none', rule: 'none' }), 'Inset': paper(-6, 'mist', { tint: 'none', rule: 'none' }) },
};
for (const type of elementTypes) {
  if (!presets[type.key]) throw new Error(`No type presets for "${type.key}"`);
  for (const [name, props] of Object.entries(presets[type.key])) {
    if (!validProps(type, props)) throw new Error(`Type preset "${name}" for "${type.key}" is invalid`);
  }
}
