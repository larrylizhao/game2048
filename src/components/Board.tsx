import { Board as BoardType } from '../core';
import { Tile } from './Tile';

interface BoardProps {
  board: BoardType;
  boardSize: number;
}

/**
 * Game board component displaying all tiles in a dynamic grid
 */
export const Board = ({ board, boardSize }: BoardProps) => {
  // Calculate responsive size based on board dimensions
  const cellSize = boardSize === 4 ? 95 : boardSize === 5 ? 76 : 63;
  const gap = 16;
  const padding = 16;
  const boardPixelSize = boardSize * cellSize + (boardSize - 1) * gap + padding * 2;

  return (
    <div
      className="grid gap-4 p-4 bg-gray-300 dark:bg-gray-700 rounded-lg"
      style={{
        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        width: `${boardPixelSize}px`,
        height: `${boardPixelSize}px`,
      }}
    >
      {board.flat().map((cell, index) => (
        <Tile key={index} value={cell} size={cellSize} />
      ))}
    </div>
  );
};
