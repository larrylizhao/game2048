import { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useKeyboard } from '../hooks/useKeyboard';
import { useSwipe } from '../hooks/useSwipe';
import { GameStatus, Direction } from '../core';
import { Board } from './Board';
import { ScoreBoard } from './ScoreBoard';
import { AIHintButton } from './AIHintButton';
import { Toast, ToastType } from './Toast';
import { VictoryModal } from './VictoryModal';
import { ThemeToggle } from '../theme';
import { BoardSizeSelector } from './BoardSizeSelector';
import { BOARD_CONFIGS, BoardConfig, DEFAULT_BOARD_SIZE } from '../config/boardConfig';
import { RotateCcw } from './icons';

interface ToastMessage {
  message: string;
  type: ToastType;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Main game component
 */
export const Game = () => {
  const [boardConfig, setBoardConfig] = useState<BoardConfig>(() =>
    BOARD_CONFIGS.find(c => c.size === DEFAULT_BOARD_SIZE) || BOARD_CONFIGS[0]
  );
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const isFirstRender = useRef(true);

  const { board, score, bestScore, status, boardSize, winningTile, hasWon, move, restart, continuePlaying, pause, resume } = useGameState({
    boardSize: boardConfig.size,
    winningTile: boardConfig.winningTile,
  });

  useKeyboard(move);
  useSwipe({ onSwipe: move });

  const handleBoardSizeChange = (newConfig: BoardConfig) => {
    setBoardConfig(newConfig);
  };

  const showToast = (message: string, type: ToastType = 'info', actionLabel?: string, onAction?: () => void) => {
    setToast({ message, type, actionLabel, onAction });
  };

  const handleAIHint = (direction: Direction) => {
    const arrows = {
      [Direction.Left]: '←',
      [Direction.Right]: '→',
      [Direction.Up]: '↑',
      [Direction.Down]: '↓',
    };
    showToast(
      `AI suggests: ${direction.toUpperCase()} ${arrows[direction]}`,
      'info'
    );
  };

  const handleAIError = (message: string) => {
    showToast(message, 'error');
  };

  // Reset game when board config changes (but skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    restart();
  }, [boardConfig, restart]);

  // Show modal/toast notifications for game status changes
  useEffect(() => {
    if (status === GameStatus.Won) {
      setShowVictoryModal(true);
    } else if (status === GameStatus.Lost) {
      showToast('Game Over! No more moves available.', 'error');
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-100 dark:bg-gray-900 transition-colors px-4 py-6 sm:px-6 overflow-hidden">
      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
        />
      )}

      {/* Victory modal */}
      {showVictoryModal && (
        <VictoryModal
          winningTile={winningTile}
          onContinue={() => {
            setShowVictoryModal(false);
            continuePlaying();
          }}
          onRestart={() => {
            setShowVictoryModal(false);
            restart();
          }}
        />
      )}

      {/* Top left controls */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
        <BoardSizeSelector currentSize={boardConfig.size} onSizeChange={handleBoardSizeChange} />
      </div>

      {/* Top right controls */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
        <AIHintButton
          board={board}
          boardSize={boardSize}
          pause={pause}
          resume={resume}
          onHintReceived={handleAIHint}
          onError={handleAIError}
        />
        <button
          onClick={restart}
          className="p-2 rounded-lg transition-colors duration-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="New game"
          title="New game"
        >
          <RotateCcw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <ThemeToggle />
      </div>

      {/* Game title */}
      <h1 className={`text-4xl sm:text-6xl font-bold mb-6 sm:mb-8 transition-colors ${
        hasWon
          ? 'text-green-500 dark:text-green-600'
          : 'text-yellow-600 dark:text-yellow-500'
      }`}>2048</h1>

      {/* Score board */}
      <div className="flex items-center justify-center mb-4">
        <ScoreBoard score={score} bestScore={bestScore} />
      </div>

      {/* Game board */}
      <Board board={board} boardSize={boardSize} />
    </div>
  );
};
