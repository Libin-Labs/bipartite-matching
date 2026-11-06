export interface MatchingOptions {
  maxEdges?: number;
}
export interface MatchingResult {
  size: number;
  leftToRight: number[];
  rightToLeft: number[];
  pairs: [number, number][];
}
export function maximumMatching(
  adjacency: readonly (readonly number[])[],
  rightCount: number,
  options: MatchingOptions = {},
): MatchingResult {
  if (
    !Array.isArray(adjacency) ||
    adjacency.length > 512 ||
    !Number.isSafeInteger(rightCount) ||
    rightCount < 0 ||
    rightCount > 100000
  )
    throw new RangeError('Invalid partition dimensions');
  const limit = options.maxEdges ?? 1000000;
  if (!Number.isSafeInteger(limit) || limit < 0 || limit > 1000000)
    throw new RangeError('Invalid maxEdges');
  let edgeCount = 0;
  const graph = adjacency.map((row) => {
    if (!Array.isArray(row)) throw new TypeError('Adjacency rows must be arrays');
    edgeCount += row.length;
    if (edgeCount > limit) throw new RangeError('Edge limit exceeded');
    for (const v of row)
      if (!Number.isSafeInteger(v) || v < 0 || v >= rightCount)
        throw new RangeError('Invalid right vertex');
    return [...new Set(row)];
  });
  const left = Array<number>(graph.length).fill(-1),
    right = Array<number>(rightCount).fill(-1),
    distance = Array<number>(graph.length).fill(Infinity);
  let size = 0;
  while (true) {
    const queue: number[] = [];
    for (let u = 0; u < left.length; u++) {
      distance[u] = left[u] === -1 ? 0 : Infinity;
      if (left[u] === -1) queue.push(u);
    }
    let shortest = Infinity;
    for (let head = 0; head < queue.length; head++) {
      const u = queue[head]!;
      if (distance[u]! >= shortest) continue;
      for (const v of graph[u]!) {
        const mate = right[v]!;
        if (mate === -1) shortest = distance[u]! + 1;
        else if (distance[mate] === Infinity) {
          distance[mate] = distance[u]! + 1;
          queue.push(mate);
        }
      }
    }
    if (shortest === Infinity) break;
    const cursor = Array<number>(left.length).fill(0);
    const augment = (u: number): boolean => {
      while (cursor[u]! < graph[u]!.length) {
        const v = graph[u]![cursor[u]!]!;
        cursor[u] = cursor[u]! + 1;
        const mate = right[v]!;
        if (
          (mate === -1 && distance[u]! + 1 === shortest) ||
          (mate !== -1 && distance[mate] === distance[u]! + 1 && augment(mate))
        ) {
          left[u] = v;
          right[v] = u;
          return true;
        }
      }
      distance[u] = Infinity;
      return false;
    };
    for (let u = 0; u < left.length; u++) if (left[u] === -1 && augment(u)) size++;
  }
  const pairs: [number, number][] = [];
  for (let u = 0; u < left.length; u++) if (left[u] !== -1) pairs.push([u, left[u]!]);
  return { size, leftToRight: left, rightToLeft: right, pairs };
}
