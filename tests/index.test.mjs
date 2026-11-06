import test from 'node:test';
import assert from 'node:assert/strict';
import * as lib from '../dist/esm/index.js';
function random(seed = 123456789) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
test('augmenting path defeats greedy', () => {
  const r = lib.maximumMatching([[0, 1], [0]], 2);
  assert.equal(r.size, 2);
  assert.deepEqual(r.pairs, [
    [0, 1],
    [1, 0],
  ]);
});
test('empty partitions and unmatched sentinels', () => {
  assert.equal(lib.maximumMatching([], 3).size, 0);
  assert.deepEqual(lib.maximumMatching([[], []], 0).leftToRight, [-1, -1]);
});
test('duplicates do not reuse vertices', () => {
  const r = lib.maximumMatching([[0, 0], [0], [0]], 1);
  assert.equal(r.size, 1);
  assert.equal(r.rightToLeft[0], 0);
});
test('input ownership and deterministic pairs', () => {
  const a = [
      [1, 0],
      [0, 1],
    ],
    copy = structuredClone(a);
  const r = lib.maximumMatching(a, 2);
  r.pairs[0][1] = 99;
  assert.deepEqual(a, copy);
  assert.deepEqual(lib.maximumMatching(a, 2).pairs, [
    [0, 1],
    [1, 0],
  ]);
});
test('dimension, edge and index guards', () => {
  assert.throws(() => lib.maximumMatching([[2]], 2), RangeError);
  assert.throws(() => lib.maximumMatching([[0]], 1, { maxEdges: 0 }), RangeError);
  assert.throws(
    () =>
      lib.maximumMatching(
        Array.from({ length: 513 }, () => []),
        1,
      ),
    RangeError,
  );
  assert.throws(() => lib.maximumMatching([], NaN), RangeError);
});
test('all small graphs plus seeded exhaustive subset oracle', () => {
  const oracle = (g, n) => {
    const go = (u, used) =>
      u === g.length
        ? 0
        : Math.max(
            go(u + 1, used),
            ...g[u].filter((v) => !(used & (1 << v))).map((v) => 1 + go(u + 1, used | (1 << v))),
          );
    return go(0, 0);
  };
  const check = (g, n) => {
    const r = lib.maximumMatching(g, n);
    assert.equal(r.size, oracle(g, n));
    assert.equal(new Set(r.pairs.map((x) => x[1])).size, r.size);
    for (const [u, v] of r.pairs) {
      assert.ok(g[u].includes(v));
      assert.equal(r.rightToLeft[v], u);
    }
  };
  for (let mask = 0; mask < 512; mask++)
    check(
      Array.from({ length: 3 }, (_, u) => [0, 1, 2].filter((v) => mask & (1 << (u * 3 + v)))),
      3,
    );
  const rng = random();
  for (let t = 0; t < 100; t++)
    check(
      Array.from({ length: 6 }, () =>
        Array.from({ length: 5 }, (_, i) => i).filter(() => rng() < 0.4),
      ),
      5,
    );
});
