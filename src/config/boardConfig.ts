/**
 * Board size configuration
 */

export interface BoardConfig {
  size: number;
  name: string;
  winningTile: number;
}

export const BOARD_CONFIGS: BoardConfig[] = [
  { size: 4, name: "4×4", winningTile: 16 },
  { size: 5, name: "5×5", winningTile: 4096 },
  { size: 6, name: "6×6", winningTile: 8192 },
];

export const DEFAULT_BOARD_SIZE = 4;
