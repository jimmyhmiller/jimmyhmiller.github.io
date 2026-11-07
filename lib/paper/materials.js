// Paper materials for the whole site.
//
// Every lit surface is a DOM element carrying `data-paper="<name>"`. The name
// selects one of the node specs below. Heights are relative: a node sits on
// the nearest ancestor paper (or the desk, at height 12) and adds `offset`.
// `stack` adds successively inset faces, each `offset` above/below the
// previous face. This is the same model as the paper-test homepage editor
// (experiments/paper-homepage/paper-editor.js); the homepage values below are
// the accepted capture from experiments/paper-homepage/defaults.json.

export const palette = {
  desk: '#547076',
  recess: '#5c6e72',
  cream: '#ffefae',
  sage: '#dce3c9',
  mist: '#c4d9da',
  flax: '#e5d9b9',
  ink: '#304c52',
  code: '#476267',
  'deep-green': '#021810',
};

export const DESK_HEIGHT = 12;

// The paper grain, a tile repeated under every paper and the desk instead of
// being rendered (tools/build-paper-grain.mjs builds the images). It spans
// tilePoints scene points (1280 per page width).
export const GRAIN = { tilePoints: 154, tilePixels: 384, dark: '/paper/grain-dark.png', light: '/paper/grain-light.png' };

// Accepted lighting (defaults.json → environment.lighting).
export const defaultLighting = {
  version: 1,
  relief: 0.35,
  depth: 0.95,
  grain: 0.35,
  paperHeight: 1.09,
  selected: 0,
  lights: [
    { x: -0.10795830855320077, y: -0.3022972434480732, height: 850, intensity: 0.696671195652174, type: 'distributed' },
    { x: 1.1234286889097742, y: -0.5155400815217391, height: 850, intensity: 2, type: 'distributed' },
  ],
};

// Accepted podcast ink (defaults.json → environment.podcastGreen), in the
// green lab's terms. `background: 'dark'` overrides the top face with deep green.
export const defaultPodcastGreen = {
  mode: 'halo',
  amount: 1.25,
  reach: 3.7,
  shift: 0,
  seed: 14961,
  disorder: 1.76,
  bandSize: 0,
  speckle: 0.21,
  tears: 0.58,
  bursts: 0.64,
  background: 'dark',
};

// Post text (everything on the post sheet except code). 'auto' prints it in
// the sheet's ink, chosen for contrast with the sheet's top face; a hex color
// overrides it.
export const defaultPostInk = '#021810';

// `ink: true` recolors the element's text for contrast against its top face
// (the editor did this whenever a node departed from its original material).
// `relief: null` follows the lighting panel's texture setting.
export const nodes = {
  // ── Homepage (accepted layout) ──────────────────────────────────
  intro:   { offset: 0,  color: 'desk',    relief: 0.28, radius: 0.7, ink: true },
  popular: { offset: 10, color: '#547076', relief: 0.28, radius: 2,   ink: true,
             stack: [{ offset: 5, color: '#476267', inset: 7 }] },
  'project-code': { offset: -8, color: 'code', relief: null, radius: 0.7, ink: true },
  podcast: { offset: -5, color: 'deep-green', relief: 0.14, radius: 2, ink: true,
             stack: [{ offset: -12, inset: 8, color: 'ink' }, { offset: 12, inset: 11, color: 'ink' }],
             effect: 'podcast-halo' },
  posts:   { offset: -12, color: 'code',   relief: 0.17, radius: 2,   ink: true },
  advent:  { offset: 14, color: '#5c6e72', relief: 0.22, radius: 0.7, ink: true },
  papers:  { offset: 18, color: 'mist',    relief: null, radius: 0.7, ink: false },
  talks:   { offset: 18, color: 'sage',    relief: null, radius: 0.7, ink: false },

  // ── Articles, archive and project pages ─────────────────────────
  sheet:      { offset: 18, color: 'mist',   relief: 0.45, radius: 0.7, ink: true },
  'sheet-foot': { offset: -2, color: '#476267', relief: 0.12, radius: 2, ink: true },
  'archive-a': { offset: 18, color: 'cream', relief: null, radius: 0.7, ink: true },
  'archive-b': { offset: 18, color: 'sage',  relief: null, radius: 0.7, ink: true },
  'archive-c': { offset: 18, color: 'mist',  relief: null, radius: 0.7, ink: true },
  'project-rail': { offset: -8, color: 'recess', relief: 0.22, radius: 2, ink: true },
  'project-preface': { offset: 0, color: 'desk', relief: 0.28, radius: 0.7, ink: true },
};

// Post elements that sit on their own paper, by element type
// (lib/paper/typography.js). The type tool can change or remove these.
export const postPapers = {
  blockquote: { offset: 5, color: 'flax', relief: 0.3, radius: 0 },
  'code-block': { offset: -3, color: '#d6e5e6', relief: 0.6, radius: 2 },
  table: { offset: 6, color: 'sage', relief: 0.3, radius: 0.7 },
  note: { offset: -6, color: 'flax', relief: 0.3, radius: 0.7 },
};

// Each project gets its own sheet: pigment, height, edge treatment and the
// stock of its recessed artifact well. `beagle` keeps the accepted homepage
// treatment (raised blue-gray, offset 6, relief .45).
export const projectPapers = {
  beagle: {
    sheet: { offset: 6, color: '#5c6e72', relief: 0.45, radius: 0.7, ink: true },
    well:  { offset: -8, color: 'code', relief: null, radius: 0.7, ink: true },
  },
  'tensor-lang': {
    // Sage terraces: two raised steps, like stacked layers.
    sheet: { offset: 14, color: 'sage', relief: 0.35, radius: 0.7, ink: true,
             stack: [{ offset: 4, inset: 9, color: '#d3dbbc' }] },
    well:  { offset: -8, color: '#4f6650', relief: null, radius: 0.7, ink: true },
  },
  'turbopack-visualizer': {
    // Mist sheet with a recessed window rim.
    sheet: { offset: 18, color: 'mist', relief: 0.3, radius: 0.7, ink: true,
             stack: [{ offset: -5, inset: 10, color: '#b7cfd0' }] },
    well:  { offset: -6, color: '#3f5c66', relief: null, radius: 0.7, ink: true },
  },
  'simd-lang': {
    // Flax with three narrow raised steps — lanes.
    sheet: { offset: 10, color: 'flax', relief: 0.4, radius: 0.7, ink: true,
             stack: [{ offset: 3, inset: 5, color: 'flax' }, { offset: 3, inset: 5, color: 'flax' }, { offset: 3, inset: 5, color: '#ece2c6' }] },
    well:  { offset: -10, color: '#5c5a48', relief: null, radius: 0.7, ink: true },
  },
  'bevy-whiteboard': {
    // A tall, smooth butter pad.
    sheet: { offset: 26, color: 'cream', relief: 0.18, radius: 0.7, ink: true },
    well:  { offset: -6, color: '#6b6a4f', relief: null, radius: 0.7, ink: true },
  },
  'datalog-db': {
    // Deep ink sheet with a raised inner rim.
    sheet: { offset: 4, color: 'ink', relief: 0.3, radius: 2, ink: true,
             stack: [{ offset: 6, inset: 8, color: '#3a5a61' }] },
    well:  { offset: -8, color: '#26404a', relief: null, radius: 0.7, ink: true },
  },
  'keep-running': {
    // Recessed deep-green tray with a raised ink inner bed.
    sheet: { offset: -4, color: 'deep-green', relief: 0.14, radius: 2, ink: true,
             stack: [{ offset: 10, inset: 9, color: '#173a33' }] },
    well:  { offset: -6, color: '#0b241d', relief: null, radius: 0.7, ink: true },
  },
};

export function projectPaper(id) {
  const paper = projectPapers[id];
  if (!paper) throw new Error(`No paper treatment defined for project "${id}" in lib/paper/materials.js`);
  return paper;
}

// The renderer's effect for the podcast paper, derived from the green state.
export function podcastEffect(green) {
  return {
    kind: 1,
    amount: green.amount,
    reach: green.reach,
    shift: green.shift,
    stock: green.background === 'dark' ? palette['deep-green'] : null,
    randomness: [green.seed, green.disorder, green.bandSize, green.speckle],
    inkStructure: [green.tears, green.bursts],
  };
}

export const podcastHalo = podcastEffect(defaultPodcastGreen);
