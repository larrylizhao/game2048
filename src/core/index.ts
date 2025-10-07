/**
 * Core game logic - centralized exports
 */

// Types
export * from './types';

// Constants
export * from './constants';

// Board operations
export { initBoard } from './board/boardFactory';
export { 
  getEmptyCells, 
  hasEmptyCells, 
  isGameOver, 
  hasWinningTile, 
  areBoardsEqual 
} from './board/boardQuery';
export { rotateClockwise, rotate } from './board/boardTransform';

// Tile operations
export { addRandomTile } from './tile/tileGenerator';

// Merge operations
export { mergeLine } from './merge/lineMerger';
export { mergeBoard } from './merge/boardMerger';
export type { MergeResult } from './merge/lineMerger';
export type { BoardMergeResult } from './merge/boardMerger';
