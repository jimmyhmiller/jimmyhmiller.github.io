import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const draftPath = process.argv[2] ?? '/Users/jimmyhmiller/Documents/Code/PlayGround/writings/What Does the React Compiler Even Do.md';
const htmlPath = process.argv[3] ?? '/Users/jimmyhmiller/Documents/Code/PlayGround/writings/react-compiler-review-simple.html';
const draft = fs.readFileSync(draftPath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');
const match = html.match(/<script type="application\/json" id="article-data">([\s\S]*?)<\/script>/);
assert.ok(match, 'Review HTML must contain compiled article data');
const data = JSON.parse(match[1]);
const append = /```tsx preview=inline-components[^\n]*\n([\s\S]*?)```/.exec(draft)?.[1];
assert.equal(append, data.fixtures.append.source, 'Draft workload differs from measured builds; regenerate the review and measurements before importing');
const hashes = {};
for (const [id, fixture] of Object.entries(data.fixtures)) {
  for (const [variant, build] of Object.entries(fixture.builds)) {
    if (build.bundle) {
      const name = `${id}-${variant}.js`;
      fs.writeFileSync(path.join(site, 'public/react-compiler', name), build.bundle);
      hashes[name] = createHash('sha256').update(build.bundle).digest('hex');
      build.bundleUrl = `/react-compiler/${name}?v=${hashes[name].slice(0, 16)}`;
    }
    delete build.bundle;
  }
}
fs.writeFileSync(path.join(site, 'data/react-compiler/article.json'), JSON.stringify(data, null, 2) + '\n');

const title = /^# (.+)$/m.exec(draft)[1];
const imports = 'import { GlobalLayout } from "../utils.mjs";\nimport { CompilerArticleProvider, CompilerSourcePair, CompilerCode, CompilerTiming, CompilerSummary } from "../components/react-compiler/CompilerArticle";\n\n';
const layout = `\n\nexport default function ReactCompilerPage({ children }) {\n  return <GlobalLayout title={${JSON.stringify(title)}}><CompilerArticleProvider>{children}</CompilerArticleProvider></GlobalLayout>;\n}\n`;
let body = draft;
const inserted = [];
const replacements = [
  ['[COMPILE:inline-components:inlining]()', '<CompilerCode id="inline-code" />'],
  ['[PREVIEW:inline-components]()', '<CompilerTiming id="inlining" />'],
  ['[PREVIEW:block-inline-components]()', '<CompilerTiming id="blocks" />'],
  ['[show timing results]', '<CompilerTiming id="lists" />'],
  ['[PREVIEW:optimization-stack]()', '{/* The optimization stack is included in CompilerSummary. */}'],
  ['[SCENARIOS:final]()', '<CompilerSummary />'],
];
for (const [marker, component] of replacements) {
  assert.equal(body.split(marker).length, 2, `Expected one ${marker}`);
  body = body.replace(marker, component);
}
for (const [heading, id] of [['### Optimizing Context','selection'],['### Speeding up External Stores','context'],['## Other Optimizations','store']]) {
  assert.equal(body.split(heading).length, 2, `Expected one ${heading}`);
  const addition = `<CompilerTiming id="${id}" />\n\n`;
  inserted.push(addition);
  body = body.replace(heading, addition + heading);
}
const pairPattern = /```jsx\n(?:(?!```)[\s\S])*?```\n\nturns into\n\n```jsx\n(?:(?!```)[\s\S])*?```/g;
let pairs = 0;
body = body.replace(pairPattern, pair => {pairs++; return `<CompilerSourcePair>\n\n${pair}\n\n</CompilerSourcePair>`;});
assert.equal(pairs, 3, 'Expected exactly three existing source/output pairs');

// Reversing only mechanical markup changes must recover every original byte.
let recovered = body.replaceAll('<CompilerSourcePair>\n\n', '').replaceAll('\n\n</CompilerSourcePair>', '');
for (const addition of inserted) recovered = recovered.replace(addition, '');
for (const [marker, component] of replacements) recovered = recovered.replace(component, marker);
assert.equal(recovered, draft, 'The port must preserve all original prose and code');
const page = path.join(site, 'pages/what-does-the-react-compiler-even-do.mdx');
fs.writeFileSync(page, imports + body + layout);
fs.writeFileSync(path.join(site, 'data/react-compiler/provenance.json'), JSON.stringify({
  sourcePath:draftPath,
  sourceSha256:createHash('sha256').update(draft).digest('hex'),
  sourceBytes:Buffer.byteLength(draft),
  preservedExactly:true,
  title,
  bundles:hashes,
}, null, 2) + '\n');
console.log(`Imported ${page}; verified byte-for-byte draft preservation; ${Object.keys(hashes).length} isolated benchmark bundles.`);
