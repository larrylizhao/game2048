import { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useKeyboard } from '../hooks/useKeyboard';
import { GameStatus } from '../core';
import { Board } from './Board';
import { ScoreBoard } from './ScoreBoard';
import { AIHint } from './AIHint';
import { Button } from './Button';
import { ThemeToggle } from '../theme';
import { BoardSizeSelector } from './BoardSizeSelector';
import { BOARD_CONFIGS, BoardConfig, DEFAULT_BOARD_SIZE } from '../config/boardConfig';

/**
 * Main game component
 */
export const Game = () => {
  const [boardConfig, setBoardConfig] = useState<BoardConfig>(() =>
    BOARD_CONFIGS.find(c => c.size === DEFAULT_BOARD_SIZE) || BOARD_CONFIGS[0]
  );

  const { board, score, bestScore, status, boardSize, winningTile, move, restart, continuePlaying } = useGameState({
    boardSize: boardConfig.size,
    winningTile: boardConfig.winningTile,
  });

  useKeyboard(move);

  const handleBoardSizeChange = (newConfig: BoardConfig) => {
    setBoardConfig(newConfig);
  };

  // Reset game when board config changes
  useEffect(() => {
    restart();
  }, [boardConfig, restart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors px-4 py-6 sm:px-6">
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
        <BoardSizeSelector currentSize={boardConfig.size} onSizeChange={handleBoardSizeChange} />
      </div>

      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <ThemeToggle />
      </div>

      <h1 className="text-4xl sm:text-6xl font-bold mb-6 sm:mb-8 text-yellow-600 dark:text-yellow-500">2048</h1>

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4 w-full max-w-md sm:w-auto">
        <ScoreBoard score={score} bestScore={bestScore} />
        <Button onClick={restart}>New Game</Button>
      </div>

      <Board board={board} boardSize={boardSize} />

      {status === GameStatus.Won && (
        <div className="mt-4 p-3 sm:p-4 bg-green-500 dark:bg-green-600 text-white rounded-lg flex flex-col sm:flex-row items-center gap-2 sm:gap-4 max-w-md w-full sm:w-auto">
          <span className="font-bold text-sm sm:text-base text-center sm:text-left">🎉 You Win! (Reached {winningTile})</span>
          <Button onClick={continuePlaying} className="bg-white text-green-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700 w-full sm:w-auto">
            Continue
          </Button>
        </div>
      )}

      {status === GameStatus.Lost && (
        <div className="mt-4 p-3 sm:p-4 bg-red-500 dark:bg-red-600 text-white rounded-lg font-bold text-center max-w-md w-full sm:w-auto">
          Game Over!
        </div>
      )}

      <div className="w-full max-w-md sm:w-auto">
        <AIHint board={board} onMove={move} />
      </div>

      <div className="mt-6 sm:mt-8 text-gray-600 dark:text-gray-400 text-xs sm:text-sm text-center px-4">
        Use arrow keys to play
      </div>
    </div>
  );
};
