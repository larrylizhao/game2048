import { Board } from '../types';
import { INITIAL_TILE_COUNT_MIN, INITIAL_TILE_COUNT_MAX } from '../constants';
import { addRandomTile } from '../tile/tileGenerator';

/**
 * Creates an empty board filled with null values
 */
function createEmptyBoard(size: number): Board {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
}

/**
 * Initializes a new game board with random tiles
 * @param boardSize - Size of the board (e.g., 4 for 4x4)
 * @returns A new board with 2-4 random tiles
 */
export function initBoard(boardSize: number): Board {
  const board = createEmptyBoard(boardSize);
  const tileCount =
    Math.floor(Math.random() * (INITIAL_TILE_COUNT_MAX - INITIAL_TILE_COUNT_MIN + 1)) +
    INITIAL_TILE_COUNT_MIN;

  for (let i = 0; i < tileCount; i++) {
    addRandomTile(board, boardSize);
  }

  return board;
}
