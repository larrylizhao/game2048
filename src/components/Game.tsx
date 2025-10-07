import { useGameState } from '../hooks/useGameState';
import { useKeyboard } from '../hooks/useKeyboard';
import { GameStatus } from '../core';
import { Board } from './Board';
import { ScoreBoard } from './ScoreBoard';
import { AIHint } from './AIHint';
import { Button } from './Button';
import { ThemeToggle } from '../theme';

/**
 * Main game component
 */
export const Game = () => {
  const { board, score, bestScore, status, move, restart, continuePlaying } = useGameState();

  useKeyboard(move);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="text-6xl font-bold mb-8 text-yellow-600 dark:text-yellow-500">2048</h1>

      <div className="flex items-center gap-4 mb-4">
        <ScoreBoard score={score} bestScore={bestScore} />
        <Button onClick={restart}>New Game</Button>
      </div>

      <Board board={board} />

      {status === GameStatus.Won && (
        <div className="mt-4 p-4 bg-green-500 dark:bg-green-600 text-white rounded-lg flex items-center gap-4">
          <span className="font-bold">🎉 You Win!</span>
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
