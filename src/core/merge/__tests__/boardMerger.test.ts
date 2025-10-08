import { describe, it, expect } from 'vitest';
import { mergeBoard } from '../boardMerger';
import { Direction } from '../../types';
import type { Board } from '../../types';

describe('boardMerger', () => {
  describe('mergeBoard - Left', () => {
    it('should merge tiles to the left', () => {
      const board: Board = [
        [null, 2, 2, null],
        [4, null, 4, null],
        [null, null, 8, 8],
        [2, 4, 8, 16],
      ];
      const result = mergeBoard(board, Direction.Left, 4);
      expect(result.board).toEqual([
        [4, null, null, null],
        [8, null, null, null],
        [16, null, null, null],
        [2, 4, 8, 16],
      ]);
      expect(result.score).toBe(28); // 4 + 8 + 16
    });

    it('should not change board if no merge possible', () => {
      const board: Board = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
      ];
      const result = mergeBoard(board, Direction.Left, 2);
      expect(result.board).toEqual(board);
      expect(result.score).toBe(0);
    });
  });

  describe('mergeBoard - Right', () => {
    it('should merge tiles to the right', () => {
      const board: Board = [
        [2, 2, null],
        [null, 4, 4],
        [8, 8, null],
      ];
      const result = mergeBoard(board, Direction.Right, 3);
      expect(result.board).toEqual([
        [null, null, 4],
        [null, null, 8],
        [null, null, 16],
      ]);
      expect(result.score).toBe(28); // 4 + 8 + 16
    });
  });

  describe('mergeBoard - Up', () => {
    it('should merge tiles upward', () => {
      const board: Board = [
        [2, 4, 8],
        [2, null, 8],
        [4, 4, 16],
      ];
      const result = mergeBoard(board, Direction.Up, 3);
      expect(result.board).toEqual([
        [4, 8, 16],
        [4, null, 16],
        [null, null, null],
      ]);
      expect(result.score).toBe(28); // 4 + 8 + 16
    });
  });

  describe('mergeBoard - Down', () => {
    it('should merge tiles downward', () => {
      const board: Board = [
        [2, 4, 8],
        [2, null, 8],
        [4, 4, 16],
      ];
      const result = mergeBoard(board, Direction.Down, 3);
      expect(result.board).toEqual([
        [null, null, null],
        [4, null, 16],
        [4, 8, 16],
      ]);
      expect(result.score).toBe(28); // 4 + 8 + 16
    });
  });

  describe('mergeBoard - Score calculation', () => {
    it('should calculate total score correctly', () => {
      const board: Board = [
        [2, 2, 4, 4],
        [8, 8, 16, 16],
      ];
      const result = mergeBoard(board, Direction.Left, 2);
      expect(result.score).toBe(60); // (4+8) + (16+32)
    });

    it('should return zero score when no merges occur', () => {
      const board: Board = [
        [2, 4, 8],
        [16, 32, 64],
      ];
      const result = mergeBoard(board, Direction.Up, 2);
      expect(result.score).toBe(0);
    });
  });

  describe('mergeBoard - Different board sizes', () => {
    it('should work with 3x3 board', () => {
      const board: Board = [
        [2, 2, 4],
        [null, null, null],
        [8, 8, 16],
      ];
      const result = mergeBoard(board, Direction.Left, 3);
      expect(result.board).toEqual([
        [4, 4, null],
        [null, null, null],
        [16, 16, null],
      ]);
    });

    it('should work with 5x5 board', () => {
      const board: Board = [
        [2, 2, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [4, 4, null, null, null],
      ];
      const result = mergeBoard(board, Direction.Left, 5);
      expect(result.board[0]).toEqual([4, null, null, null, null]);
      expect(result.board[4]).toEqual([8, null, null, null, null]);
    });
  });

  describe('mergeBoard - Edge cases', () => {
    it('should handle empty board', () => {
      const board: Board = [
        [null, null],
        [null, null],
      ];
      const result = mergeBoard(board, Direction.Left, 2);
      expect(result.board).toEqual(board);
      expect(result.score).toBe(0);
    });

    it('should handle board with single tile', () => {
      const board: Board = [
        [2, null],
        [null, null],
      ];
      const result = mergeBoard(board, Direction.Right, 2);
      expect(result.board).toEqual([
        [null, 2],
        [null, null],
      ]);
      expect(result.score).toBe(0);
    });
  });
});
