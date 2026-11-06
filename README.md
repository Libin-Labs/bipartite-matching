# @lp-labs/bipartite-matching

Maximum-cardinality bipartite matching using layered Hopcroft-Karp augmentation. Zero runtime and peer dependencies. MIT. Node.js 18+; ES2022-compatible browser runtimes with BigInt where used. No browser globals accessed at import.

## Install

```sh
npm install @lp-labs/bipartite-matching
```

## Quick start

```js
import { maximumMatching } from '@lp-labs/bipartite-matching';
console.log(maximumMatching([[0, 1], [0]], 2).pairs); // [[0,1],[1,0]]
```

ES modules use named imports above. CommonJS uses `const { maximumMatching } = require('@lp-labs/bipartite-matching');`. Both formats ship declarations.

## Public API and customization

- `MatchingOptions`: `maxEdges?`, default/maximum 1,000,000; duplicates count against this input budget.
- `MatchingResult`: `size`, `leftToRight`, `rightToLeft` (-1 unmatched), and `pairs: [number,number][]` ordered by left index.
- `maximumMatching(adjacency, rightCount, options?): MatchingResult`: row i contains eligible right indices for left i. Duplicate edges deduplicated preserving input order. Returns maximum cardinality, not merely a greedy maximal matching; no weights or capacities.

All runtime exports and public declaration types are listed above. Options are per call/instance; no global configuration.

## Errors, ownership and limits

Hopcroft-Karp O((V+E) sqrt(V)) time, O(V+E) storage. Maximum 512 left vertices (bounds recursive DFS depth), 100,000 right vertices and 1,000,000 input edges. TypeError for nonarray rows, RangeError for invalid dimensions/indices/budgets. No input mutation; result containers are owned by caller. Ties follow row and neighbor order; optimal matchings need not be unique.

Algorithms are synchronous and CPU/memory bounded by the stated limits, not cancellable or real-time. Validation does not sandbox hostile getters, proxies, callbacks or infinite iterables. TypeScript signatures are the supported input contract. No I/O, network, persistence or cryptographic guarantees.

## Development

```sh
npm ci --offline
npm run build
npm run typecheck
npm test
npm run format:check
```

Strict TypeScript, ESM/CommonJS, bare installed-package consumers with negative type assertions, and deterministic reference-oracle tests are included. Only TypeScript and Prettier are development dependencies.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
