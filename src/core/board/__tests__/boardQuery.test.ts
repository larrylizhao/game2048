import { describe, it, expect } from 'vitest';
import {
  getEmptyCells,
  hasEmptyCells,
  isGameOver,
  hasWinningTile,
  areBoardsEqual,
} from '../boardQuery';
import { Board } from '../../types';

describe('boardQuery', () => {
  describe('getEmptyCells', () => {
    it('should find all empty cells in board', () => {
      const board: Board = [
        [2, null, 4],
        [null, 8, null],
        [16, null, null],
      ];
      const result = getEmptyCells(board, 3);
      expect(result).toEqual([
        [0, 1],
        [1, 0],
        [1, 2],
        [2, 1],
        [2, 2],
      ]);
    });

    it('should return empty array when board is full', () => {
      const board: Board = [
        [2, 4, 8],
        [16, 32, 64],
        [128, 256, 512],
      ];
      const result = getEmptyCells(board, 3);
      expect(result).toEqual([]);
    });

    it('should return all positions when board is empty', () => {
      const board: Board = [
        [null, null],
        [null, null],
      ];
      const result = getEmptyCells(board, 2);
      expect(result).toEqual([
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]);
    });
  });

  describe('hasEmptyCells', () => {
    it('should return true when board has empty cells', () => {
      const board: Board = [
        [2, null],
        [4, 8],
      ];
      expect(hasEmptyCells(board, 2)).toBe(true);
    });

    it('should return false when board is full', () => {
      const board: Board = [
        [2, 4],
        [8, 16],
      ];
      expect(hasEmptyCells(board, 2)).toBe(false);
    });
  });

  describe('isGameOver', () => {
    it('should return false when board has empty cells', () => {
      const board: Board = [
        [2, null],
        [4, 8],
      ];
      expect(isGameOver(board, 2)).toBe(false);
    });

    it('should return false when tiles can merge horizontally', () => {
      const board: Board = [
        [2, 2],
        [4, 8],
      ];
      expect(isGameOver(board, 2)).toBe(false);
    });

    it('should return false when tiles can merge vertically', () => {
      const board: Board = [
        [2, 4],
        [2, 8],
      ];
      expect(isGameOver(board, 2)).toBe(false);
    });

    it('should return true when no moves available', () => {
      const board: Board = [
        [2, 4, 8],
        [8, 2, 4],
        [4, 8, 2],
      ];
      expect(isGameOver(board, 3)).toBe(true);
    });

    it('should handle 4x4 game over scenario', () => {
      const board: Board = [
        [2, 4, 8, 16],
        [4, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 128],
      ];
      expect(isGameOver(board, 4)).toBe(true);
    });
  });

  describe('hasWinningTile', () => {
    it('should return true when winning tile exists', () => {
      const board: Board = [
        [2, 4, 8],
        [16, 2048, 32],
        [64, 128, 256],
      ];
      expect(hasWinningTile(board, 3, 2048)).toBe(true);
    });

    it('should return false when winning tile does not exist', () => {
      const board: Board = [
        [2, 4, 8],
        [16, 32, 64],
        [128, 256, 512],
      ];
      expect(hasWinningTile(board, 3, 2048)).toBe(false);
    });

    it('should work with different winning tiles', () => {
      const board: Board = [
        [2, 4],
        [8, 1024],
      ];
      expect(hasWinningTile(board, 2, 1024)).toBe(true);
      expect(hasWinningTile(board, 2, 2048)).toBe(false);
    });
  });

  describe('areBoardsEqual', () => {
    it('should return true for identical boards', () => {
      const board1: Board = [
        [2, 4],
        [8, 16],
      ];
      const board2: Board = [
        [2, 4],
        [8, 16],
      ];
      expect(areBoardsEqual(board1, board2, 2)).toBe(true);
    });

    it('should return false for different boards', () => {
      const board1: Board = [
        [2, 4],
        [8, 16],
      ];
      const board2: Board = [
        [2, 4],
        [8, 32],
      ];
      expect(areBoardsEqual(board1, board2, 2)).toBe(false);
    });

    it('should handle boards with null values', () => {
      const board1: Board = [
        [2, null],
        [null, 4],
      ];
      const board2: Board = [
        [2, null],
        [null, 4],
      ];
      expect(areBoardsEqual(board1, board2, 2)).toBe(true);
    });
  });
});
