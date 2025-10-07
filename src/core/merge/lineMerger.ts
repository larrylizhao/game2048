import { Cell } from '../types';

export interface MergeResult {
  line: Cell[];
  score: number;
}

/**
 * Filters out null values from a line
 */
function compact(line: Cell[]): number[] {
  return line.filter((cell): cell is number => cell !== null);
}

/**
 * Pads a line with nulls to reach the target length
 */
function padWithNulls(values: number[], targetLength: number): Cell[] {
  const result: Cell[] = [...values];
  while (result.length < targetLength) {
    result.push(null);
  }
  return result;
}

/**
 * Merges adjacent equal tiles in a line from left to right
 * Returns the merged line and the score gained
 */
export function mergeLine(line: Cell[]): MergeResult {
  const compacted = compact(line);
  const merged: number[] = [];
  let score = 0;
  let i = 0;

  while (i < compacted.length) {
    const current = compacted[i];
    const next = compacted[i + 1];

    // Check if current and next tiles can merge
    if (next !== undefined && current === next) {
      const mergedValue = current * 2;
      merged.push(mergedValue);
      score += mergedValue;
      i += 2; // Skip the next tile as it's been merged
    } else {
      merged.push(current);
      i += 1;
    }
  }

  return {
    line: padWithNulls(merged, line.length),
    score,
  };
}
