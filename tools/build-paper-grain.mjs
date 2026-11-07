// Builds the paper grain: one small tile that repeats over every paper and
// the desk (public/paper/grain-*.png; the sets are in materials.js GRAIN).
//
// The renderer's grain is `shade += grain * .4 * h` (lib/paper/shaders/
// paper-scene.frag): a brightness factor of about ±3% from the height noise
// in paper-kernels.glsl, the same on every material. Baking it into the page
// tiles made them incompressible noise, so the bake leaves it out and the
// page lays this tile over the light instead. The factor m = 1 + .4·grain·h
// is split into a multiply layer (the darkening part) and a color-dodge
// layer (cb / (1 - s) brightens by exactly m). Each set is the same pattern
// at another strength; opacity scales a layer's strength linearly.
//
// The noise is the shader's, with its lattice wrapped so the tile repeats:
// over a period of 140 noise units every octave needs a whole number of
// cells, so the ridge octave's 1.7 × 0.85 becomes 1.75 × 0.875.
//
// Run: node tools/build-paper-grain.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { defaultLighting, GRAIN } from '../lib/paper/materials.js';

const PERIOD = 140; // noise units per tile; a noise unit is 1.1 scene points
if (Math.abs(PERIOD * 1.1 - GRAIN.tilePoints) > 1e-9) throw new Error('GRAIN.tilePoints must be PERIOD × 1.1');
const PIXELS = GRAIN.tilePixels;

const hash = (x, y, seed) => {
  const a = (Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(seed, 1274126177)) >>> 0;
  const b = Math.imul(a ^ (a >>> 13), 1274126177) >>> 0;
  return ((b ^ (b >>> 16)) & 65535) / 65535;
};
const smooth = (x) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
const wrap = (i, n) => ((i % n) + n) % n;
// The shader's value noise, on a lattice of px × py cells that wraps.
function noise(x, y, seed, px, py) {
  if (!Number.isInteger(px) || !Number.isInteger(py)) throw new Error(`Grain octave does not tile: ${px} × ${py} cells`);
  const ix = Math.floor(x), iy = Math.floor(y);
  const u = smooth(x - ix), v = smooth(y - iy);
  const h = (i, j) => hash(wrap(i, px), wrap(j, py), seed);
  return mix(mix(h(ix, iy), h(ix + 1, iy), u), mix(h(ix, iy + 1), h(ix + 1, iy + 1), u), v) - 0.5;
}
const cells = (scale) => Math.round(PERIOD * scale * 1e9) / 1e9;
function height(x, y, seed) {
  const u = x + 1.4 * noise(x / 5, y / 5, seed + 7, cells(1 / 5), cells(1 / 5));
  const v = y + 1.4 * noise(x / 5, y / 5, seed + 13, cells(1 / 5), cells(1 / 5));
  const ridge = 1 - smooth(4.5 * Math.abs(noise(u / 1.75, v / 0.875, seed, cells(1 / 1.75), cells(1 / 0.875))));
  return 0.22 * ridge - 0.11 + 0.13 * noise(x * 2.1, y * 2.1, seed + 19, cells(2.1), cells(2.1))
    + 0.045 * noise(x / 7, y / 7, seed + 29, cells(1 / 7), cells(1 / 7));
}

const SEED = 14483; // the shader's pressed-paper seed
const heights = new Float64Array(PIXELS * PIXELS);
for (let j = 0; j < PIXELS; j++) for (let i = 0; i < PIXELS; i++) {
  // Pixel centers, like gl_FragCoord.
  heights[j * PIXELS + i] = height((i + 0.5) / PIXELS * PERIOD, (j + 0.5) / PIXELS * PERIOD, SEED);
}
// The brightness factor at a strength: 1 is the renderer's grain; a negative
// strength divides it back out (a paper less textured than what is beneath).
function layers(strength) {
  const dark = Buffer.alloc(PIXELS * PIXELS), light = Buffer.alloc(PIXELS * PIXELS);
  let low = Infinity, high = -Infinity;
  heights.forEach((h, index) => {
    const grain = 1 + 0.4 * defaultLighting.grain * Math.abs(strength) * h;
    const m = strength < 0 ? 1 / grain : grain;
    low = Math.min(low, m); high = Math.max(high, m);
    dark[index] = Math.round(255 * Math.min(1, m));
    light[index] = Math.round(255 * (1 - 1 / Math.max(1, m)));
  });
  return { dark, light, low, high };
}

const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (bytes) => { let c = 0xffffffff; for (const b of bytes) c = crcTable[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const out = Buffer.alloc(body.length + 8);
  out.writeUInt32BE(data.length, 0); body.copy(out, 4); out.writeUInt32BE(crc(body), body.length + 4);
  return out;
};
// An 8-bit grayscale PNG; each row Sub-filtered, which suits slow noise.
function png(pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(PIXELS, 0); header.writeUInt32BE(PIXELS, 4);
  header[8] = 8; header[9] = 0; header[10] = 0; header[11] = 0; header[12] = 0;
  const raw = Buffer.alloc(PIXELS * (PIXELS + 1));
  for (let j = 0; j < PIXELS; j++) {
    raw[j * (PIXELS + 1)] = 1;
    for (let i = 0; i < PIXELS; i++) raw[j * (PIXELS + 1) + 1 + i] = (pixels[j * PIXELS + i] - (i ? pixels[j * PIXELS + i - 1] : 0)) & 255;
  }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

mkdirSync(new URL('../public/paper/', import.meta.url), { recursive: true });
for (const set of [GRAIN.plain, GRAIN.strong, GRAIN.inverse]) {
  const built = layers(set.strength);
  for (const name of ['dark', 'light']) {
    const data = png(built[name]);
    writeFileSync(new URL(`../public${set[name]}`, import.meta.url), data);
    console.log(`${set[name]}: ${PIXELS}×${PIXELS}, ${(data.length / 1024).toFixed(1)} KB`);
  }
  console.log(`  strength ${set.strength}: brightness factor ${built.low.toFixed(4)}–${built.high.toFixed(4)}`);
}
