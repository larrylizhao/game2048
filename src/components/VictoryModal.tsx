import { Trophy } from './icons';

interface VictoryModalProps {
  winningTile: number;
  onContinue: () => void;
  onRestart: () => void;
}

/**
 * Victory modal component with overlay
 * Prevents user interaction with the game until they choose an action
 */
export const VictoryModal = ({ winningTile, onContinue, onRestart }: VictoryModalProps) => {
  return (
    <>
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="victory-title"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-up">
          {/* Trophy icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Trophy className="w-12 h-12 text-green-600 dark:text-green-500" />
            </div>
          </div>

          {/* Title */}
          <h2
            id="victory-title"
            className="text-3xl font-bold text-center mb-3 text-gray-900 dark:text-white"
          >
            Congratulations!
          </h2>

          {/* Message */}
          <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-8">
            You reached <span className="font-bold text-green-600 dark:text-green-500">{winningTile}</span>!
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onContinue}
              className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md"
              aria-label="Continue playing"
            >
              Continue Playing
            </button>
            <button
              onClick={onRestart}
              className="w-full py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
              aria-label="Start new game"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
