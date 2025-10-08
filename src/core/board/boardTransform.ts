import { Board } from '../types';

/**
 * Rotates the board 90 degrees clockwise
 * Used to reuse left merge logic for other directions
 */
export function rotateClockwise(board: Board, boardSize: number): Board {
  const rotated: Board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(null));

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      rotated[col][boardSize - 1 - row] = board[row][col];
    }
  }

  return rotated;
}

/**
 * Rotates the board N times clockwise
 */
export function rotate(board: Board, times: number, boardSize: number): Board {
  let result = board;
  for (let i = 0; i < times; i++) {
    result = rotateClockwise(result, boardSize);
  }
  return result;
}
