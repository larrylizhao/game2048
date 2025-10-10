import { Board } from '../types';

/**
 * Identity function - returns the board unchanged
 * Used as a no-op transformation for the Left direction
 */
export function identity(board: Board): Board {
  return board;
}

/**
 * Transposes a board (swap rows and columns)
 *
 * Example:
 * [1, 2]    [1, 3]
 * [3, 4] -> [2, 4]
 *
 * Note: Transpose is its own inverse - applying it twice returns the original board
 */
export function transpose(board: Board): Board {
  const size = board.length;
  const result: Board = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      result[col][row] = board[row][col];
    }
  }

  return result;
}

/**
 * Reverses each row in the board
 *
 * Example:
 * [1, 2, 3]    [3, 2, 1]
 * [4, 5, 6] -> [6, 5, 4]
 * [7, 8, 9]    [9, 8, 7]
 *
 * Note: ReverseRows is its own inverse - applying it twice returns the original board
 */
export function reverseRows(board: Board): Board {
  return board.map(row => [...row].reverse());
}

/**
 * Composes multiple transformation functions from right to left
 *
 * Example:
 * compose(f, g, h)(x) = f(g(h(x)))
 *
 * This allows building complex transformations from simple ones:
 * - compose(reverseRows, transpose) means: first transpose, then reverseRows
 *
 * @param fns - Functions to compose (executed right to left)
 * @returns A new function that applies all transformations in sequence
 */
export function compose(
  ...fns: Array<(board: Board) => Board>
): (board: Board) => Board {
  return (board: Board) => fns.reduceRight((acc, fn) => fn(acc), board);
}
