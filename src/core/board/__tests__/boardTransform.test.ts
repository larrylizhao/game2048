import { describe, it, expect } from 'vitest';
import { rotateClockwise, rotate } from '../boardTransform';
import type { Board } from '../../types';

describe('boardTransform', () => {
  describe('rotateClockwise', () => {
    it('should rotate 2x2 board clockwise by 90 degrees', () => {
      const board: Board = [
        [1, 2],
        [3, 4],
      ];
      const result = rotateClockwise(board, 2);
      expect(result).toEqual([
        [3, 1],
        [4, 2],
      ]);
    });

    it('should rotate 3x3 board clockwise by 90 degrees', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const result = rotateClockwise(board, 3);
      expect(result).toEqual([
        [7, 4, 1],
        [8, 5, 2],
        [9, 6, 3],
      ]);
    });

    it('should rotate 4x4 board correctly', () => {
      const board: Board = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const result = rotateClockwise(board, 4);
      expect(result).toEqual([
        [13, 9, 5, 1],
        [14, 10, 6, 2],
        [15, 11, 7, 3],
        [16, 12, 8, 4],
      ]);
    });

    it('should handle board with null values', () => {
      const board: Board = [
        [2, null],
        [null, 4],
      ];
      const result = rotateClockwise(board, 2);
      expect(result).toEqual([
        [null, 2],
        [4, null],
      ]);
    });

    it('should handle empty board', () => {
      const board: Board = [
        [null, null],
        [null, null],
      ];
      const result = rotateClockwise(board, 2);
      expect(result).toEqual([
        [null, null],
        [null, null],
      ]);
    });
  });

  describe('rotate', () => {
    it('should rotate 0 times (no rotation)', () => {
      const board: Board = [
        [1, 2],
        [3, 4],
      ];
      const result = rotate(board, 0, 2);
      expect(result).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });

    it('should rotate once (90 degrees)', () => {
      const board: Board = [
        [1, 2],
        [3, 4],
      ];
      const result = rotate(board, 1, 2);
      expect(result).toEqual([
        [3, 1],
        [4, 2],
      ]);
    });

    it('should rotate twice (180 degrees)', () => {
      const board: Board = [
        [1, 2],
        [3, 4],
      ];
      const result = rotate(board, 2, 2);
      expect(result).toEqual([
        [4, 3],
        [2, 1],
      ]);
    });

    it('should rotate three times (270 degrees)', () => {
      const board: Board = [
        [1, 2],
        [3, 4],
      ];
      const result = rotate(board, 3, 2);
      expect(result).toEqual([
        [2, 4],
        [1, 3],
      ]);
    });

    it('should rotate four times (360 degrees - back to original)', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const result = rotate(board, 4, 3);
      expect(result).toEqual([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
    });

    it('should handle asymmetric board values', () => {
      const board: Board = [
        [2, 4, 8],
        [16, 32, 64],
        [128, 256, 512],
      ];
      const result = rotate(board, 2, 3);
      expect(result).toEqual([
        [512, 256, 128],
        [64, 32, 16],
        [8, 4, 2],
      ]);
    });

    it('should work with different board sizes', () => {
      const board5x5: Board = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25],
      ];
      const result = rotate(board5x5, 1, 5);
      expect(result[0]).toEqual([21, 16, 11, 6, 1]);
      expect(result[4]).toEqual([25, 20, 15, 10, 5]);
    });
  });
});
