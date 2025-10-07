import { Board } from '../types';
import { BOARD_SIZE, INITIAL_TILE_COUNT_MIN, INITIAL_TILE_COUNT_MAX } from '../constants';
import { addRandomTile } from '../tile/tileGenerator';

/**
 * Creates an empty board filled with null values
 */
function createEmptyBoard(): Board {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
}

/**
 * Initializes a new game board with random tiles
 * @returns A new board with 2-4 random tiles
 */
export function initBoard(): Board {
  const board = createEmptyBoard();
  const tileCount = 
    Math.floor(Math.random() * (INITIAL_TILE_COUNT_MAX - INITIAL_TILE_COUNT_MIN + 1)) + 
    INITIAL_TILE_COUNT_MIN;

  for (let i = 0; i < tileCount; i++) {
    addRandomTile(board);
  }

  return board;
}
