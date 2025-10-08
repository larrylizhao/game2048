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
  // Calculate responsive size based on board dimensions and screen size
  // Desktop sizes
  const desktopCellSize = boardSize === 4 ? 95 : boardSize === 5 ? 76 : 63;
  // Mobile sizes (smaller to fit in viewport)
  const mobileCellSize = boardSize === 4 ? 70 : boardSize === 5 ? 56 : 46;

  const gap = 16;
  const padding = 16;

  // Calculate board sizes for both desktop and mobile
  const desktopBoardSize = boardSize * desktopCellSize + (boardSize - 1) * gap + padding * 2;
  const mobileBoardSize = boardSize * mobileCellSize + (boardSize - 1) * gap + padding * 2;

  return (
    <>
      {/* Desktop board */}
      <div
        className="hidden sm:grid gap-4 p-4 bg-gray-300 dark:bg-gray-700 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          width: `${desktopBoardSize}px`,
          height: `${desktopBoardSize}px`,
        }}
      >
        {board.flat().map((cell, index) => (
          <Tile key={index} value={cell} size={desktopCellSize} />
        ))}
      </div>

      {/* Mobile board */}
      <div
        className="grid sm:hidden gap-3 p-3 bg-gray-300 dark:bg-gray-700 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          width: `${mobileBoardSize}px`,
          height: `${mobileBoardSize}px`,
        }}
      >
        {board.flat().map((cell, index) => (
          <Tile key={index} value={cell} size={mobileCellSize} />
        ))}
      </div>
    </>
  );
};
