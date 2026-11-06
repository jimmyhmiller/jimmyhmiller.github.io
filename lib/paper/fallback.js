// The paper without the renderer: flat stock, the ink chosen for it, soft
// shadows for height and rings for stacked layers. All of it comes from
// materials.js, so it always matches the lit design's colors.
//
// It is the page's look before the renderer's first frame and whenever there
// is no renderer (no JavaScript, no WebGL, a lost context): fallbackCss() is
// rendered into every page's head (pages/_document.js). Baked backgrounds also
// lay the same papers under their tiles (baked-background.js), so a part of
// the page whose tile is not drawn yet shows these instead of the bare desk.

import { palette, postPapers, defaultPostInk, podcastEffect, defaultPodcastGreen } from './materials';
import { namedPapers } from './layout';
import { contrast } from './color';
import { elementTypes } from './typography';

export function colorOf(name, colors = palette) {
  if (Object.hasOwn(colors, name)) return colors[name];
  if (/^#[0-9a-f]{6}$/i.test(name)) return name;
  throw new Error(`Unknown paper color "${name}"`);
}

/** The palette ink with the most contrast against a paper color. */
export function inkAgainst(color, colors = palette) {
  return contrast(colors.ink, color) >= contrast(colors.cream, color) ? colors.ink : colors.cream;
}

/** The custom properties and color that print text in `ink`. */
export function inkProperties(ink) {
  const channels = [1, 3, 5].map((index) => parseInt(ink.slice(index, index + 2), 16));
  return { color: ink, '--ink': ink, '--ink-body': ink, '--quiet': ink, '--line': `rgba(${channels.join(',')},.25)` };
}

const round = (value) => Math.round(value * 10) / 10;

/** A shadow for paper `lift` height units above (or below) what it rests on. */
export function depthShadow(lift) {
  if (lift > 0) {
    return `0 ${round(0.4 + lift * 0.3)}px ${round(1 + lift * 0.8)}px rgba(16,30,34,${round(Math.min(0.42, 0.18 + lift * 0.012) * 100) / 100}),`
      + ' 0 1px 1.5px rgba(16,30,34,.18)';
  }
  if (lift < 0) return `inset 0 ${round(-lift * 0.3)}px ${round(-lift * 0.75)}px rgba(10,22,26,.38)`;
  return 'none';
}

// A node spec's look: its top face as the background, the faces beneath it as
// inset rings from the edge, and a shadow for its height above its parent.
function specLook(spec) {
  const faces = [{ color: colorOf(spec.color), inset: 0 }];
  let inset = 0;
  for (const step of spec.stack ?? []) {
    inset += step.inset;
    faces.push({ color: step.color === 'inherit' ? faces.at(-1).color : colorOf(step.color), inset });
  }
  if (spec.effect === 'podcast-halo') {
    const { stock } = podcastEffect(defaultPodcastGreen);
    if (stock) faces[faces.length - 1] = { ...faces.at(-1), color: stock };
  } else if (spec.effect) {
    throw new Error(`Unknown paper effect "${spec.effect}"`);
  }
  const shadows = [];
  // Rings, outermost on top: each face shows from its own inset to the next.
  for (let i = 0; i < faces.length - 1; i++) shadows.push(`inset 0 0 0 ${faces[i + 1].inset}px ${faces[i].color}`);
  if (spec.offset !== 0) shadows.unshift(depthShadow(spec.offset));
  return { face: faces.at(-1).color, shadow: shadows.length ? shadows.join(', ') : 'none', radius: spec.radius ?? 0.7 };
}

const declarations = (properties) => Object.entries(properties).map(([name, value]) => `${name}:${value}`).join(';');

/** The fallback stylesheet, for the page head. */
export function fallbackCss() {
  const rules = [];
  const unlit = 'html:not([data-lighting=ready])';
  for (const [name, spec] of namedPapers()) {
    const look = specLook(spec);
    const selector = `[data-paper="${name}"]`;
    rules.push(`${selector}{--surface-color:${look.face}}`);
    rules.push(`${unlit} ${selector}{${declarations({
      'box-shadow': look.shadow, 'border-radius': `${look.radius}px`, ...(spec.ink ? inkProperties(inkAgainst(look.face)) : {}),
    })}}`);
  }
  // Post text prints in the post ink, or the sheet's own.
  const sheet = specLook(namedPapers().find(([name]) => name === 'sheet')[1]).face;
  const postInk = defaultPostInk === 'auto' ? inkAgainst(sheet) : defaultPostInk;
  rules.push(`${unlit} .post-sheet{${declarations({
    ...inkProperties(postInk),
    ...(defaultPostInk === 'auto' ? {} : {
      '--ink-soft': `color-mix(in srgb, ${postInk} 85%, ${sheet})`,
      '--ink-mute': `color-mix(in srgb, ${postInk} 62%, ${sheet})`,
    }),
  })}}`);
  // Post elements on their own paper. Their tints are background images, so
  // the stock goes underneath as the background color.
  for (const [key, paper] of Object.entries(postPapers)) {
    const type = elementTypes.find((candidate) => candidate.key === key);
    const look = specLook(paper);
    const selector = type.selector.split(',').map((part) => `${unlit} .post-sheet ${part.trim()}`).join(',');
    rules.push(`${selector}{${declarations({
      'background-color': look.face, 'box-shadow': look.shadow, 'border-radius': `${look.radius}px`, ...inkProperties(inkAgainst(look.face)),
    })}}`);
  }
  return rules.join('\n');
}
