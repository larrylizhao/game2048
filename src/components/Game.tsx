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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="absolute top-4 left-4">
        <BoardSizeSelector currentSize={boardConfig.size} onSizeChange={handleBoardSizeChange} />
      </div>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="text-6xl font-bold mb-8 text-yellow-600 dark:text-yellow-500">2048</h1>

      <div className="flex items-center gap-4 mb-4">
        <ScoreBoard score={score} bestScore={bestScore} />
        <Button onClick={restart}>New Game</Button>
      </div>

      <Board board={board} boardSize={boardSize} />

      {status === GameStatus.Won && (
        <div className="mt-4 p-4 bg-green-500 dark:bg-green-600 text-white rounded-lg flex items-center gap-4">
          <span className="font-bold">🎉 You Win! (Reached {winningTile})</span>
          <Button onClick={continuePlaying} className="bg-white text-green-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700">
            Continue
          </Button>
        </div>
      )}

      {status === GameStatus.Lost && (
        <div className="mt-4 p-4 bg-red-500 dark:bg-red-600 text-white rounded-lg font-bold">
          Game Over!
        </div>
      )}

      <AIHint board={board} onMove={move} />

      <div className="mt-8 text-gray-600 dark:text-gray-400 text-sm">
        Use arrow keys to play
      </div>
    </div>
  );
};
