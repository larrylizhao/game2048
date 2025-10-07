import { Board as BoardType } from '../core';
import { Tile } from './Tile';

interface BoardProps {
  board: BoardType;
}

/**
 * Game board component displaying all tiles in a 4x4 grid
 */
export const Board = ({ board }: BoardProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-[420px] h-[420px]">
      {board.flat().map((cell, index) => (
        <Tile key={index} value={cell} />
      ))}
    </div>
  );
};
