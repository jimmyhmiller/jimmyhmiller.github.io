/** Independent variation properties: a lock freezes exactly its own field. */
export function variationProperties(node) {
  const count = node.layer === 'inherit' ? 0 : 1 + (node.stack?.length ?? 0);
  const rows = [{ key: 'count', label: 'Layer count', value: count, kind: 'count' }];
  if (!count) return rows;
  rows.push(
    { key: 'offset', label: 'Base elevation', value: node.offset, kind: 'height' },
    { key: 'color', label: 'Base color', value: node.color, kind: 'color' },
    { key: 'relief', label: 'Paper texture', value: node.relief, kind: 'texture' }
  );
  (node.stack ?? []).forEach((step, index) => rows.push(
    { key: `stack.${index}.offset`, label: `Layer ${index + 2} elevation`, value: step.offset, kind: 'height' },
    { key: `stack.${index}.color`, label: `Layer ${index + 2} color`, value: step.color, kind: 'color' },
    { key: `stack.${index}.inset`, label: `Layer ${index + 2} edge spacing`, value: step.inset, kind: 'spacing' }
  ));
  return rows;
}

export function randomizeVariation(current, locks, palette, budget, rng = Math.random) {
  const choose = values => values[Math.min(values.length - 1, Math.floor(rng() * values.length))];
  const next = structuredClone(current);
  const currentCount = current.layer === 'inherit' ? 0 : 1 + (current.stack?.length ?? 0);
  const lockedInner = Object.entries(locks).filter(([, locked]) => locked)
    .map(([key]) => /^stack\.(\d+)\./.exec(key)).filter(Boolean).map(match => +match[1] + 2);
  const minimum = Math.max(1, ...lockedInner);
  const maximum = Math.min(7, budget);
  if (minimum > maximum) throw Error('Not enough surface capacity to preserve locked inner layers.');
  let count = currentCount;
  if (!locks.count) count = choose(Array.from({ length: Math.max(minimum, Math.min(3, maximum)) - minimum + 1 }, (_, index) => minimum + index));
  if (count > budget) throw Error('Not enough surface capacity for the locked layer count.');
  if (count === 0) return { ...next, layer: 'inherit', stack: [] };
  next.layer = next.layer === 'inherit' ? 'paper' : next.layer;
  const profile = choose(['raised', 'inset', 'flush', 'mixed']);
  const colors = ['cream', 'sage', 'mist', 'flax', 'recess', 'desk', 'code'].map(role => palette[role]);
  const stock = previous => choose(colors.filter(color => color !== previous));
  if (!locks.offset) next.offset = profile === 'inset' ? choose([-2, -3]) : profile === 'flush' ? 0 : choose([4, 6, 10, 14]);
  if (!locks.color) next.color = stock(null);
  if (!locks.relief) next.relief = choose([.12, .18, .22, .28, .35, .45]);
  let previousColor = next.color;
  next.stack = Array.from({ length: count - 1 }, (_, index) => {
    const previous = current.stack?.[index] ?? { offset: 6, color: palette.cream, inset: 6 };
    const step = { ...previous };
    if (!locks[`stack.${index}.offset`]) step.offset = profile === 'inset' ? choose([-2, -3]) : profile === 'flush' ? 0 : profile === 'mixed' && index % 2 === 0 ? -4 : choose([3, 5, 7]);
    if (!locks[`stack.${index}.color`]) step.color = stock(previousColor);
    previousColor = step.color;
    if (!locks[`stack.${index}.inset`]) step.inset = choose([3, 5, 7, 9, 11]);
    return step;
  });
  return next;
}
