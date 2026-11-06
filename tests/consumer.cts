import {
  maximumMatching,
  type MatchingOptions,
  type MatchingResult,
} from '@lp-labs/bipartite-matching';
export type PublicTypes = [MatchingOptions, MatchingResult];
void maximumMatching;
const result: MatchingResult = maximumMatching([[0, 1], [1]], 2);
void result;
// @ts-expect-error right indices are numeric
maximumMatching([['a']], 2);
