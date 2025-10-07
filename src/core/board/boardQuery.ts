import { Board } from '../types';
import { BOARD_SIZE, WINNING_TILE } from '../constants';

/**
 * Gets all empty cell positions on the board
 */
export function getEmptyCells(board: Board): [number, number][] {
  const emptyCells: [number, number][] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        emptyCells.push([row, col]);
      }
    }
  }

  return emptyCells;
}

/**
 * Checks if the board has any empty cells
 */
export function hasEmptyCells(board: Board): boolean {
  return getEmptyCells(board).length > 0;
}

/**
 * Checks if there are any adjacent tiles with the same value
 */
function hasAdjacentMatchingTiles(board: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const currentValue = board[row][col];
      if (currentValue === null) continue;

      // Check right neighbor
      if (col < BOARD_SIZE - 1 && board[row][col + 1] === currentValue) {
        return true;
      }

      // Check bottom neighbor
      if (row < BOARD_SIZE - 1 && board[row + 1][col] === currentValue) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if the game is over (no valid moves remaining)
 */
export function isGameOver(board: Board): boolean {
  return !hasEmptyCells(board) && !hasAdjacentMatchingTiles(board);
}

/**
 * Checks if the winning tile (2048) exists on the board
 */
export function hasWinningTile(board: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === WINNING_TILE) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks if two boards are equal
 */
export function areBoardsEqual(board1: Board, board2: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board1[row][col] !== board2[row][col]) {
        return false;
      }
    }
  }
  return true;
}
