import { Board } from '../types';
import { NEW_TILE_VALUE_2, NEW_TILE_VALUE_4, NEW_TILE_4_PROBABILITY } from '../constants';
import { getEmptyCells } from '../board/boardQuery';

/**
 * Generates a random tile value (2 or 4)
 * 90% chance for 2, 10% chance for 4
 */
function generateTileValue(): number {
  return Math.random() < NEW_TILE_4_PROBABILITY ? NEW_TILE_VALUE_4 : NEW_TILE_VALUE_2;
}

/**
 * Adds a random tile (2 or 4) to a random empty cell on the board
 * Mutates the board in place
 */
export function addRandomTile(board: Board): void {
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const [row, col] = emptyCells[randomIndex];
  
  board[row][col] = generateTileValue();
}
