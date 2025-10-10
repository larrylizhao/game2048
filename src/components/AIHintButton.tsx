import { useState } from 'react';
import { Board, Direction } from '../core';
import { getAIHint } from '../services/aiService';
import { Sparkles } from './icons';

interface AIHintButtonProps {
  board: Board;
  boardSize: number;
  pause: () => void;
  resume: () => void;
  onHintReceived: (direction: Direction) => void;
  onError: (message: string) => void;
}

/**
 * Compact AI hint button for toolbar
 */
export const AIHintButton = ({ board, boardSize, pause, resume, onHintReceived, onError }: AIHintButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleGetHint = async () => {
    setLoading(true);
    pause();  // Pause game during AI computation

    try {
      const direction = await getAIHint(board, boardSize);
      onHintReceived(direction);
    } catch (err) {
      onError('Failed to get AI hint. Please check your API key.');
      console.error('AI hint failed:', err);
    } finally {
      setLoading(false);
      resume();  // Resume game after computation
    }
  };

  return (
    <button
      onClick={handleGetHint}
      disabled={loading}
      className="p-2 rounded-lg transition-colors duration-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Get AI hint"
      title="Get AI hint"
    >
      <Sparkles className={`w-5 h-5 text-gray-700 dark:text-gray-300 ${loading ? 'animate-pulse' : ''}`} />
    </button>
  );
};
