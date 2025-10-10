import { Board, Direction } from '../types';
import { identity, transpose, reverseRows, compose } from '../board/boardTransform';
import { mergeLine } from './lineMerger';

export interface BoardMergeResult {
  board: Board;
  score: number;
}

/**
 * Type definition for board transformation functions
 */
type Transform = (board: Board) => Board;

/**
 * Mapping of each direction to its transformation strategy
 *
 * Strategy: Transform board to make the merge a "left merge", then transform back
 *
 * Visual representation of transformations:
 *
 * LEFT:  No transformation needed
 *   [1, 2]       [2, 0]
 *   [3, 4]  ==>  [7, 0]
 *
 * RIGHT: Reverse rows → merge left → reverse rows
 *   [1, 2]       [2, 1]       [0, 2]       [2, 0]
 *   [3, 4]  ==>  [4, 3]  ==>  [0, 7]  ==>  [7, 0]
 *
 * UP: Transpose → merge left → transpose
 *   [1, 2]       [1, 3]       [4, 0]       [4, 2]
 *   [3, 4]  ==>  [2, 4]  ==>  [2, 0]  ==>  [0, 4]
 *
 * DOWN: Transpose → reverse rows → merge left → reverse rows → transpose
 *   [1, 2]       [1, 3]       [3, 1]       [0, 4]       [4, 0]       [2, 4]
 *   [3, 4]  ==>  [2, 4]  ==>  [4, 2]  ==>  [0, 2]  ==>  [2, 0]  ==>  [0, 4]
 */
const DIRECTION_TRANSFORMS: Record<Direction, {
  prepare: Transform;
  restore: Transform;
}> = {
  [Direction.Left]: {
    prepare: identity,
    restore: identity,
  },
  [Direction.Right]: {
    // Reverse each row to convert right merge to left merge
    prepare: reverseRows,
    // Reverse back to restore orientation (reverseRows is its own inverse)
    restore: reverseRows,
  },
  [Direction.Up]: {
    // Transpose to convert columns to rows
    prepare: transpose,
    // Transpose back to restore orientation (transpose is its own inverse)
    restore: transpose,
  },
  [Direction.Down]: {
    // Compose transformations: first transpose, then reverse rows
    prepare: compose(reverseRows, transpose),
    // Inverse: first reverse rows, then transpose
    restore: compose(transpose, reverseRows),
  },
};

/**
 * Merges all rows to the left
 * This is the core merge logic that other directions are transformed into
 */
function mergeLeft(board: Board, boardSize: number): BoardMergeResult {
  const newBoard: Board = [];
  let totalScore = 0;

  for (let row = 0; row < boardSize; row++) {
    const { line, score } = mergeLine(board[row]);
    newBoard.push(line);
    totalScore += score;
  }

  return { board: newBoard, score: totalScore };
}

/**
 * Merges the board in the specified direction
 *
 * This implementation uses function composition for efficiency:
 * - LEFT:  0 operations (direct merge)
 * - RIGHT: 2 operations (reverse → merge → reverse)
 * - UP:    2 operations (transpose → merge → transpose)
 * - DOWN:  4 operations (transpose → reverse → merge → reverse → transpose)
 *
 * This is more efficient than the previous rotation-based approach which required 4 operations for all non-left directions.
 */
export function mergeBoard(board: Board, direction: Direction, boardSize: number): BoardMergeResult {
  const { prepare, restore } = DIRECTION_TRANSFORMS[direction];

  // Step 1: Transform board to left-merge orientation
  const transformedBoard = prepare(board);

  // Step 2: Perform left merge
  const { board: mergedBoard, score } = mergeLeft(transformedBoard, boardSize);

  // Step 3: Transform back to original orientation
  const finalBoard = restore(mergedBoard);

  return { board: finalBoard, score };
}
