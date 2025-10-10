import { describe, it, expect } from 'vitest';
import { identity, transpose, reverseRows, compose } from '../boardTransform';
import type { Board } from '../../types';

describe('boardTransform', () => {
  describe('identity', () => {
    it('should return the board unchanged', () => {
      const board: Board = [
        [1, 2],
        [3, 4],
      ];
      const result = identity(board);
      expect(result).toBe(board); // Same reference
      expect(result).toEqual(board);
    });
  });

  describe('transpose', () => {
    it('should transpose 2x2 board (swap rows and columns)', () => {
      const board: Board = [
        [1, 2],
        [3, 4],
      ];
      const result = transpose(board);
      expect(result).toEqual([
        [1, 3],
        [2, 4],
      ]);
    });

    it('should transpose 3x3 board', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const result = transpose(board);
      expect(result).toEqual([
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
      ]);
    });

    it('should transpose 4x4 board', () => {
      const board: Board = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const result = transpose(board);
      expect(result).toEqual([
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
        [4, 8, 12, 16],
      ]);
    });

    it('should handle board with null values', () => {
      const board: Board = [
        [2, null, 4],
        [null, 8, null],
        [16, null, 32],
      ];
      const result = transpose(board);
      expect(result).toEqual([
        [2, null, 16],
        [null, 8, null],
        [4, null, 32],
      ]);
    });

    it('should handle empty board', () => {
      const board: Board = [
        [null, null],
        [null, null],
      ];
      const result = transpose(board);
      expect(result).toEqual([
        [null, null],
        [null, null],
      ]);
    });

    it('should be its own inverse (transpose twice returns original)', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const transposed = transpose(board);
      const twiceTransposed = transpose(transposed);
      expect(twiceTransposed).toEqual(board);
    });

    it('should work with asymmetric values', () => {
      const board: Board = [
        [2, 4, 8],
        [16, 32, 64],
        [128, 256, 512],
      ];
      const result = transpose(board);
      expect(result).toEqual([
        [2, 16, 128],
        [4, 32, 256],
        [8, 64, 512],
      ]);
    });
  });

  describe('reverseRows', () => {
    it('should reverse each row in 2x2 board', () => {
      const board: Board = [
        [1, 2],
        [3, 4],
      ];
      const result = reverseRows(board);
      expect(result).toEqual([
        [2, 1],
        [4, 3],
      ]);
    });

    it('should reverse each row in 3x3 board', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const result = reverseRows(board);
      expect(result).toEqual([
        [3, 2, 1],
        [6, 5, 4],
        [9, 8, 7],
      ]);
    });

    it('should reverse each row in 4x4 board', () => {
      const board: Board = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const result = reverseRows(board);
      expect(result).toEqual([
        [4, 3, 2, 1],
        [8, 7, 6, 5],
        [12, 11, 10, 9],
        [16, 15, 14, 13],
      ]);
    });

    it('should handle board with null values', () => {
      const board: Board = [
        [2, null, 4],
        [null, 8, null],
        [16, null, 32],
      ];
      const result = reverseRows(board);
      expect(result).toEqual([
        [4, null, 2],
        [null, 8, null],
        [32, null, 16],
      ]);
    });

    it('should be its own inverse (reverse twice returns original)', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const reversed = reverseRows(board);
      const twiceReversed = reverseRows(reversed);
      expect(twiceReversed).toEqual(board);
    });

    it('should work with asymmetric values', () => {
      const board: Board = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2048, 4096],
      ];
      const result = reverseRows(board);
      expect(result).toEqual([
        [16, 8, 4, 2],
        [256, 128, 64, 32],
        [4096, 2048, 1024, 512],
      ]);
    });

    it('should not mutate the original board', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      const original = JSON.parse(JSON.stringify(board));
      reverseRows(board);
      expect(board).toEqual(original);
    });
  });

  describe('compose', () => {
    it('should compose functions from right to left', () => {
      const board: Board = [
        [1, 2],
        [3, 4],
      ];

      // compose(reverseRows, transpose) means: first transpose, then reverseRows
      const composed = compose(reverseRows, transpose);
      const result = composed(board);

      // Manual verification:
      // 1. transpose: [[1,2],[3,4]] -> [[1,3],[2,4]]
      // 2. reverseRows: [[1,3],[2,4]] -> [[3,1],[4,2]]
      expect(result).toEqual([
        [3, 1],
        [4, 2],
      ]);
    });

    it('should compose with identity', () => {
      const board: Board = [
        [1, 2],
        [3, 4],
      ];

      const composed = compose(reverseRows, identity);
      const result = composed(board);

      // identity does nothing, so only reverseRows is applied
      expect(result).toEqual([
        [2, 1],
        [4, 3],
      ]);
    });

    it('should compose three functions', () => {
      const board: Board = [
        [1, 2],
        [3, 4],
      ];

      // compose(transpose, reverseRows, transpose)
      // Execution order: transpose -> reverseRows -> transpose
      const composed = compose(transpose, reverseRows, transpose);
      const result = composed(board);

      // Manual verification:
      // 1. transpose: [[1,2],[3,4]] -> [[1,3],[2,4]]
      // 2. reverseRows: [[1,3],[2,4]] -> [[3,1],[4,2]]
      // 3. transpose: [[3,1],[4,2]] -> [[3,4],[1,2]]
      expect(result).toEqual([
        [3, 4],
        [1, 2],
      ]);
    });

    it('should handle empty composition', () => {
      const board: Board = [
        [1, 2],
        [3, 4],
      ];

      const composed = compose();
      const result = composed(board);

      // No functions means identity
      expect(result).toEqual(board);
    });

    it('should verify inverse transformations for DOWN direction', () => {
      const board: Board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];

      // DOWN direction: prepare = compose(reverseRows, transpose)
      const prepare = compose(reverseRows, transpose);
      const transformed = prepare(board);

      // restore = compose(transpose, reverseRows)
      const restore = compose(transpose, reverseRows);
      const restored = restore(transformed);

      // Should get back the original board
      expect(restored).toEqual(board);
    });
  });
});
