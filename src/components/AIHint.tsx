import { useState } from 'react';
import { Board, Direction } from '../core';
import { getAIHint } from '../services/aiService';
import { Button } from './Button';

interface AIHintProps {
  board: Board;
  onMove: (direction: Direction) => void;
}

/**
 * AI hint component that suggests the best move
 */
export const AIHint = ({ board, onMove }: AIHintProps) => {
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<Direction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetHint = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const direction = await getAIHint(board);
      setHint(direction);
    } catch (err) {
      setError('Failed to get AI hint. Please check your API key.');
      console.error('AI hint failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyHint = () => {
    if (hint) {
      onMove(hint);
      setHint(null);
    }
  };

  const getDirectionArrow = (direction: Direction): string => {
    const arrows = {
      [Direction.Left]: '←',
      [Direction.Right]: '→',
      [Direction.Up]: '↑',
      [Direction.Down]: '↓',
    };
    return arrows[direction];
  };

  return (
    <div className="flex flex-col gap-2 mt-4 w-full">
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <Button onClick={handleGetHint} disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Thinking...' : '🤖 Get AI Hint'}
        </Button>
        {hint && (
          <Button onClick={handleApplyHint} variant="secondary" className="w-full sm:w-auto">
            Apply: {hint.toUpperCase()} {getDirectionArrow(hint)}
          </Button>
        )}
      </div>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-xs sm:text-sm text-center">{error}</div>
      )}
    </div>
  );
};
