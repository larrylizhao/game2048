import { describe, it, expect } from 'vitest';
import { BOARD_CONFIGS, DEFAULT_BOARD_SIZE } from '../boardConfig';

describe('boardConfig', () => {
  describe('BOARD_CONFIGS', () => {
    it('should have configurations for 4x4, 5x5, and 6x6 boards', () => {
      expect(BOARD_CONFIGS).toHaveLength(3);

      const sizes = BOARD_CONFIGS.map(config => config.size);
      expect(sizes).toContain(4);
      expect(sizes).toContain(5);
      expect(sizes).toContain(6);
    });

    it('should have valid winning tiles', () => {
      BOARD_CONFIGS.forEach(config => {
        expect(config.winningTile).toBeGreaterThan(0);
        expect(config.winningTile).toBeTypeOf('number');
      });
    });

    it('should have correct winning tile for 4x4 board', () => {
      const config4x4 = BOARD_CONFIGS.find(c => c.size === 4);
      expect(config4x4?.winningTile).toBe(2048);
    });

    it('should have correct winning tile for 5x5 board', () => {
      const config5x5 = BOARD_CONFIGS.find(c => c.size === 5);
      expect(config5x5?.winningTile).toBe(4096);
    });

    it('should have correct winning tile for 6x6 board', () => {
      const config6x6 = BOARD_CONFIGS.find(c => c.size === 6);
      expect(config6x6?.winningTile).toBe(8192);
    });

    it('should have display names', () => {
      BOARD_CONFIGS.forEach(config => {
        expect(config.name).toBeTruthy();
        expect(config.name).toBeTypeOf('string');
      });
    });

    it('should have proper display name format', () => {
      const config4x4 = BOARD_CONFIGS.find(c => c.size === 4);
      expect(config4x4?.name).toBe('4×4');

      const config5x5 = BOARD_CONFIGS.find(c => c.size === 5);
      expect(config5x5?.name).toBe('5×5');

      const config6x6 = BOARD_CONFIGS.find(c => c.size === 6);
      expect(config6x6?.name).toBe('6×6');
    });

    it('should have unique sizes', () => {
      const sizes = BOARD_CONFIGS.map(config => config.size);
      const uniqueSizes = new Set(sizes);
      expect(uniqueSizes.size).toBe(sizes.length);
    });

    it('should have progressively higher winning tiles for larger boards', () => {
      const sorted = [...BOARD_CONFIGS].sort((a, b) => a.size - b.size);

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].winningTile).toBeGreaterThan(sorted[i - 1].winningTile);
      }
    });
  });

  describe('DEFAULT_BOARD_SIZE', () => {
    it('should be defined', () => {
      expect(DEFAULT_BOARD_SIZE).toBeDefined();
    });

    it('should be a valid board size', () => {
      const validSizes = BOARD_CONFIGS.map(c => c.size);
      expect(validSizes).toContain(DEFAULT_BOARD_SIZE);
    });

    it('should be 4 (classic 2048 size)', () => {
      expect(DEFAULT_BOARD_SIZE).toBe(4);
    });
  });
});
