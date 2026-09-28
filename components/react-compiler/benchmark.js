import article from '../../data/react-compiler/article.json';
import {frameHtml} from './frame';

const names = Object.fromEntries(article.variants.map(variant => [variant.id, variant.label]));
const median = values => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

function guard(signal) {
  if (signal.aborted) throw new Error('Stopped. Previous completed results are preserved.');
  if (document.hidden) throw new Error('Tab was hidden. Run again with this tab visible.');
}

function abortable(promise, signal) {
  return new Promise((resolve, reject) => {
    const stop = () => reject(new Error('Stopped. Previous completed results are preserved.'));
    if (signal.aborted) return stop();
    signal.addEventListener('abort', stop, {once:true});
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', stop));
  });
}

async function mount(frame, fixtureId, variantId, signal) {
  await abortable(new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Frame load timed out')), 10000);
    frame.onload = () => {clearTimeout(timeout); resolve();};
    frame.srcdoc = frameHtml(fixtureId, variantId);
  }), signal);
  const deadline = performance.now() + 15000;
  while (performance.now() < deadline) {
    guard(signal);
    const doc = frame.contentDocument;
    const win = frame.contentWindow;
    if (win.__errors?.length) throw new Error(win.__errors.join('; '));
    if (doc.querySelector('#run, #run-2000')) {
      await abortable(new Promise(resolve => win.requestAnimationFrame(() => win.requestAnimationFrame(resolve))), signal);
      return doc;
    }
    await abortable(new Promise(resolve => setTimeout(resolve, 25)), signal);
  }
  throw new Error('App did not mount');
}

function canonical(node) {
  if (node.nodeType === 3) return node.data;
  if (node.nodeType !== 1) return '';
  const attributes = [...node.attributes].map(attribute => `${attribute.name}=${JSON.stringify(attribute.value)}`).sort().join(' ');
  return `<${node.localName} ${attributes}>${[...node.childNodes].map(canonical).join('')}</${node.localName}>`;
}

async function sample(frame, fixtureId, variantId, signal) {
  guard(signal);
  const doc = await mount(frame, fixtureId, variantId, signal);
  guard(signal);
  const start = performance.now();
  doc.querySelector('#run, #run-2000').click();
  // These workloads yield only to microtasks; the next task follows their
  // commits. The layout read includes final style/layout and excludes paint.
  await abortable(new Promise(resolve => frame.contentWindow.setTimeout(resolve, 0)), signal);
  void doc.body.offsetHeight;
  const elapsed = performance.now() - start;
  guard(signal);
  if (frame.contentWindow.__errors.length) throw new Error(frame.contentWindow.__errors.join('; '));
  const fixture = article.fixtures[fixtureId];
  const rows = doc.querySelectorAll('li').length;
  if (rows !== fixture.expectedRows) throw new Error(`Expected ${fixture.expectedRows} rows; found ${rows}`);
  if (fixture.expectedSelected && doc.querySelector('.selected')?.id !== 'row-' + fixture.expectedSelected) throw new Error('Final selection did not match');
  if (fixture.expectedText && !doc.body.textContent.includes(fixture.expectedText)) throw new Error('Context updates did not finish');
  return {elapsed, dom:canonical(doc.getElementById('root'))};
}

function shuffle(values) {
  for (let i = values.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

export async function measure(fixtureId, ids, {host, signal, onProgress}) {
  const frame = document.createElement('iframe');
  frame.title = 'Benchmark executing ' + article.fixtures[fixtureId].label;
  host.append(frame);
  const rounds = 3;
  const samples = Object.fromEntries(ids.map(id => [id, []]));
  const doms = {};
  const orders = [];
  try {
    for (const id of ids) {
      onProgress('Warm-up · ' + names[id]);
      await sample(frame, fixtureId, id, signal);
    }
    const initialOrder = shuffle([...ids]);
    for (let round = 0; round < rounds; round++) {
      const offset = round % ids.length;
      const order = initialOrder.slice(offset).concat(initialOrder.slice(0, offset));
      orders.push(order);
      for (const id of order) {
        onProgress(`${names[id]} · round ${round + 1}/${rounds}`);
        const result = await sample(frame, fixtureId, id, signal);
        samples[id].push(result.elapsed);
        if (doms[id] !== undefined && doms[id] !== result.dom) throw new Error(`${names[id]}: inconsistent final DOM`);
        doms[id] = result.dom;
      }
    }
    const reference = doms.plain ?? doms.compiler ?? doms[ids[0]];
    for (const id of ids) if (doms[id] !== reference) throw new Error(`${names[id]}: final DOM differs from reference`);
    return {fixture:fixtureId, rounds, orders, samples, medians:Object.fromEntries(ids.map(id => [id, median(samples[id])])), domVerified:true, recorded:new Date().toISOString(), userAgent:navigator.userAgent, runtime:article.runtime, frame:{width:frame.clientWidth,height:frame.clientHeight}};
  } finally {
    frame.onload = null;
    frame.remove();
  }
}
