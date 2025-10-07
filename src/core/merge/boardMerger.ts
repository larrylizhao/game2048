import { Board, Direction } from '../types';
import { BOARD_SIZE } from '../constants';
import { rotate } from '../board/boardTransform';
import { mergeLine } from './lineMerger';

export interface BoardMergeResult {
  board: Board;
  score: number;
}

/**
 * Determines how many clockwise rotations are needed for each direction
 * to convert the move into a left merge
 */
function getRotationCount(direction: Direction): number {
  switch (direction) {
    case Direction.Left:
      return 0;
    case Direction.Down:
      return 1;
    case Direction.Right:
      return 2;
    case Direction.Up:
      return 3;
    default:
      return 0;
  }
}

/**
 * Merges all rows to the left
 */
function mergeLeft(board: Board): BoardMergeResult {
  const newBoard: Board = [];
  let totalScore = 0;

  for (let row = 0; row < BOARD_SIZE; row++) {
    const { line, score } = mergeLine(board[row]);
    newBoard.push(line);
    totalScore += score;
  }

  return { board: newBoard, score: totalScore };
}

/**
 * Merges the board in the specified direction
 * Strategy: rotate board to make the merge a left merge, then rotate back
 */
export function mergeBoard(board: Board, direction: Direction): BoardMergeResult {
  const rotationCount = getRotationCount(direction);

  // Rotate to convert the move into a left merge
  const rotatedBoard = rotate(board, rotationCount);

  // Perform left merge
  const { board: mergedBoard, score } = mergeLeft(rotatedBoard);

  // Rotate back to original orientation
  const unrotationCount = (4 - rotationCount) % 4;
  const finalBoard = rotate(mergedBoard, unrotationCount);

  return { board: finalBoard, score };
}
