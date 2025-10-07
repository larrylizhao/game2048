import { Board } from '../types';
import { BOARD_SIZE } from '../constants';

/**
 * Rotates the board 90 degrees clockwise
 * Used to reuse left merge logic for other directions
 */
export function rotateClockwise(board: Board): Board {
  const rotated: Board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      rotated[col][BOARD_SIZE - 1 - row] = board[row][col];
    }
  }

  return rotated;
}

/**
 * Rotates the board N times clockwise
 */
export function rotate(board: Board, times: number): Board {
  let result = board;
  for (let i = 0; i < times; i++) {
    result = rotateClockwise(result);
  }
  return result;
}
