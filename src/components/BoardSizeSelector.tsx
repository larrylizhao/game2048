import { BOARD_CONFIGS, BoardConfig } from '../config/boardConfig';
import { Grid3x3Icon } from './icons';

interface BoardSizeSelectorProps {
  currentSize: number;
  onSizeChange: (config: BoardConfig) => void;
}

/**
 * Board size selector dropdown with modern design
 */
export const BoardSizeSelector = ({ currentSize, onSizeChange }: BoardSizeSelectorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSize = parseInt(e.target.value);
    const config = BOARD_CONFIGS.find(c => c.size === selectedSize);
    if (config) {
      onSizeChange(config);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <Grid3x3Icon className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
      <select
        id="board-size"
        value={currentSize}
        onChange={handleChange}
        className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-transparent cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-600"
        aria-label="Board size"
      >
        {BOARD_CONFIGS.map(config => (
          <option key={config.size} value={config.size}>
            {config.name}
          </option>
        ))}
      </select>
    </div>
  );
};
