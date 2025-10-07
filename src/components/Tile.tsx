import { Cell } from '../core';

interface TileProps {
  value: Cell;
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
  };

  return colorMap[value] || 'bg-gray-800 text-white dark:bg-gray-900';
};

/**
 * Single tile component
 */
export const Tile = ({ value }: TileProps) => {
  const colorClass = getTileColorClass(value);

  return (
    <div
      className={`${colorClass} rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-150 shadow-md aspect-square`}
    >
      {value || ''}
    </div>
  );
};
