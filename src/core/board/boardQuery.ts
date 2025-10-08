import { Board } from '../types';

/**
 * Gets all empty cell positions on the board
 */
export function getEmptyCells(board: Board, boardSize: number): [number, number][] {
  const emptyCells: [number, number][] = [];

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
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
export function hasEmptyCells(board: Board, boardSize: number): boolean {
  return getEmptyCells(board, boardSize).length > 0;
}

/**
 * Checks if there are any adjacent tiles with the same value
 */
function hasAdjacentMatchingTiles(board: Board, boardSize: number): boolean {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const currentValue = board[row][col];
      if (currentValue === null) continue;

      // Check right neighbor
      if (col < boardSize - 1 && board[row][col + 1] === currentValue) {
        return true;
      }

      // Check bottom neighbor
      if (row < boardSize - 1 && board[row + 1][col] === currentValue) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if the game is over (no valid moves remaining)
 */
export function isGameOver(board: Board, boardSize: number): boolean {
  return !hasEmptyCells(board, boardSize) && !hasAdjacentMatchingTiles(board, boardSize);
}

/**
 * Checks if the winning tile exists on the board
 */
export function hasWinningTile(board: Board, boardSize: number, winningTile: number): boolean {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (board[row][col] === winningTile) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks if two boards are equal
 */
export function areBoardsEqual(board1: Board, board2: Board, boardSize: number): boolean {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (board1[row][col] !== board2[row][col]) {
        return false;
      }
    }
  }
  return true;
}
