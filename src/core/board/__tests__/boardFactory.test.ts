import { describe, it, expect } from 'vitest';
import { initBoard } from '../boardFactory';

describe('boardFactory', () => {
  describe('initBoard', () => {
    it('should create board with correct size', () => {
      const board = initBoard(4);
      expect(board).toHaveLength(4);
      expect(board[0]).toHaveLength(4);
    });

    it('should create 3x3 board', () => {
      const board = initBoard(3);
      expect(board).toHaveLength(3);
      board.forEach(row => {
        expect(row).toHaveLength(3);
      });
    });

    it('should create 5x5 board', () => {
      const board = initBoard(5);
      expect(board).toHaveLength(5);
      board.forEach(row => {
        expect(row).toHaveLength(5);
      });
    });

    it('should initialize with 2-4 tiles', () => {
      const board = initBoard(4);
      const nonNullCells = board
        .flat()
        .filter(cell => cell !== null);
      expect(nonNullCells.length).toBeGreaterThanOrEqual(2);
      expect(nonNullCells.length).toBeLessThanOrEqual(4);
    });

    it('should only contain values 2 or 4', () => {
      const board = initBoard(4);
      const nonNullCells = board
        .flat()
        .filter(cell => cell !== null);

      nonNullCells.forEach(value => {
        expect([2, 4]).toContain(value);
      });
    });

    it('should create different boards on multiple calls', () => {
      const board1 = initBoard(4);
      const board2 = initBoard(4);

      // Flatten and stringify to compare
      const str1 = JSON.stringify(board1);
      const str2 = JSON.stringify(board2);

      // There's a very small chance they could be identical, but extremely unlikely
      // This test might rarely fail due to randomness, but validates randomization
      const board3 = initBoard(4);
      const str3 = JSON.stringify(board3);

      // At least one should be different
      const allSame = str1 === str2 && str2 === str3;
      expect(allSame).toBe(false);
    });

    it('should have mostly null cells initially', () => {
      const board = initBoard(4);
      const nullCells = board.flat().filter(cell => cell === null);
      const totalCells = 16;

      // Should have at least 12 null cells (since max 4 tiles are added)
      expect(nullCells.length).toBeGreaterThanOrEqual(totalCells - 4);
    });

    it('should work with edge case board size 2', () => {
      const board = initBoard(2);
      expect(board).toHaveLength(2);
      expect(board[0]).toHaveLength(2);

      const nonNullCells = board.flat().filter(cell => cell !== null);
      expect(nonNullCells.length).toBeGreaterThanOrEqual(2);
      expect(nonNullCells.length).toBeLessThanOrEqual(4);
    });

    it('should work with larger board size 6', () => {
      const board = initBoard(6);
      expect(board).toHaveLength(6);
      board.forEach(row => {
        expect(row).toHaveLength(6);
      });
    });
  });
});
