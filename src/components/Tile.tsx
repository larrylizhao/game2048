import { Cell } from '../core';

interface TileProps {
  value: Cell;
  size: number;
}

/**
 * Returns the background color class for a tile value
 */
const getTileColorClass = (value: Cell): string => {
  if (!value) return 'bg-gray-200 dark:bg-gray-600';

  const colorMap: Record<number, string> = {
    2: 'bg-tile-2 text-gray-700 dark:bg-tile-2 dark:text-gray-800',
    4: 'bg-tile-4 text-gray-700 dark:bg-tile-4 dark:text-gray-800',
    8: 'bg-tile-8 text-white',
    16: 'bg-tile-16 text-white',
    32: 'bg-tile-32 text-white',
    64: 'bg-tile-64 text-white',
    128: 'bg-tile-128 text-white',
    256: 'bg-tile-256 text-white',
    512: 'bg-tile-512 text-white',
    1024: 'bg-tile-1024 text-white',
    2048: 'bg-tile-2048 text-white',
    4096: 'bg-purple-600 text-white',
    8192: 'bg-purple-700 text-white',
  };

  return colorMap[value] || 'bg-gray-800 text-white dark:bg-gray-900';
};

/**
 * Returns font size based on tile size and value
 */
const getFontSize = (size: number, value: number): string => {
  if (!value) return 'text-2xl';

  const digits = value.toString().length;
  if (size < 70) {
    // For 6x6 boards
    return digits > 3 ? 'text-lg' : 'text-xl';
  } else if (size < 80) {
    // For 5x5 boards
    return digits > 3 ? 'text-xl' : 'text-2xl';
  } else {
    // For 4x4 boards
    return digits > 3 ? 'text-xl' : 'text-2xl';
  }
};

/**
 * Single tile component
 */
export const Tile = ({ value, size }: TileProps) => {
  const colorClass = getTileColorClass(value);
  const fontSize = getFontSize(size, value || 0);

  return (
    <div
      className={`${colorClass} ${fontSize} rounded-lg flex items-center justify-center font-bold transition-all duration-150 shadow-md aspect-square`}
    >
      {value || ''}
    </div>
  );
};
