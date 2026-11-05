// The editable paper layout: named layers plus one node per paper element,
// keyed by a CSS selector relative to `.site-content`. This is the model of
// the paper-test homepage editor (experiments/paper-homepage/paper-editor.js),
// extended to every page of the site.
//
// Every `data-paper` element in materials.js gets a default node keyed
// `[data-paper="<name>"]`, so the same paper (the post sheet, a project's
// sheet) is one node across all pages that show it. Elements picked in the
// inspector that have no `data-paper` are keyed by a path from the nearest
// `data-paper`, id or `data-paper-page` ancestor, which scopes them to that
// kind of page.

import { nodes, projectPapers, palette } from './materials';

export const LAYOUT_KEY = 'jimmyhmiller-paper-layout-v1';
export const MAX_NODE_STACK = 6;

export const initialLayers = [
  { id: 'inset', name: 'Inset', offset: -8, color: 'recess' },
  { id: 'flat', name: 'Flush', offset: 0, color: 'inherit' },
  { id: 'paper', name: 'Butter paper', offset: 18, color: 'cream' },
  { id: 'sage', name: 'Sage paper', offset: 18, color: 'sage' },
  { id: 'mist', name: 'Mist paper', offset: 18, color: 'mist' },
  { id: 'flax', name: 'Flax paper', offset: 18, color: 'flax' },
  { id: 'code', name: 'Code inset', offset: -8, color: 'code' },
  { id: 'lifted', name: 'Raised', offset: 30, color: 'mist' },
];

export const paperSelector = (name) => `[data-paper="${name}"]`;

// All named papers and their material specs (see materials.js).
export function namedPapers() {
  const named = Object.entries(nodes).map(([name, spec]) => [name, spec]);
  for (const [id, paper] of Object.entries(projectPapers)) {
    named.push([`project:${id}`, paper.sheet], [`project-well:${id}`, paper.well]);
  }
  return named;
}

const layerFor = (offset) => (offset > 0 ? 'paper' : offset < 0 ? 'inset' : 'flat');

export function defaultLayout() {
  return {
    version: 1,
    layers: structuredClone(initialLayers),
    nodes: Object.fromEntries(namedPapers().map(([name, spec]) => [paperSelector(name), {
      layer: layerFor(spec.offset),
      color: spec.color,
      offset: spec.offset,
      relief: spec.relief,
      stack: structuredClone(spec.stack ?? []),
    }])),
  };
}

const hex = (value) => /^#[0-9a-f]{6}$/i.test(value);
const bounded = (value, low, high) => Number.isFinite(value) && value >= low && value <= high;
const knownColor = (value) => value === 'inherit' || Object.hasOwn(palette, value) || hex(value);

export function validLayout(state) {
  if (state?.version !== 1 || !Array.isArray(state.layers) || state.layers.length !== initialLayers.length
    || !state.nodes || typeof state.nodes !== 'object' || Array.isArray(state.nodes)) return false;
  const ids = new Set(initialLayers.map((layer) => layer.id));
  if (new Set(state.layers.map((layer) => layer.id)).size !== ids.size) return false;
  if (!state.layers.every((layer) => ids.has(layer.id) && typeof layer.name === 'string' && layer.name.trim().length > 0
    && layer.name.length <= 40 && bounded(layer.offset, -12, 48) && knownColor(layer.color))) return false;
  return Object.entries(state.nodes).every(([selector, node]) => typeof selector === 'string'
    && selector.length <= 1500 && node && (ids.has(node.layer) || node.layer === 'inherit')
    && (node.color === 'auto' || knownColor(node.color)) && (node.offset === null || bounded(node.offset, -12, 48))
    && (node.relief === null || bounded(node.relief, 0, 0.85))
    && (node.stack === undefined || Array.isArray(node.stack) && node.stack.length <= MAX_NODE_STACK && node.stack.every((step) =>
      bounded(step.offset, -12, 24) && bounded(step.inset, 1, 40) && knownColor(step.color))));
}

// A saved layout keeps every node it has; papers added to materials.js since
// it was saved get their defaults.
export function withDefaults(state) {
  const defaults = defaultLayout();
  return { ...state, nodes: { ...defaults.nodes, ...state.nodes } };
}

export function loadSavedLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem(LAYOUT_KEY));
    if (validLayout(saved?.state)) return withDefaults(saved.state);
  } catch { /* Unavailable or malformed storage leaves the default layout. */ }
  return null;
}
