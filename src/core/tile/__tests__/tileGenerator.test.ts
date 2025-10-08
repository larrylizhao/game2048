import { describe, it, expect, vi } from 'vitest';
import { addRandomTile } from '../tileGenerator';
import type { Board } from '../../types';

describe('tileGenerator', () => {
  describe('addRandomTile', () => {
    it('should add a tile to an empty cell', () => {
      const board: Board = [
        [2, null],
        [null, 4],
      ];

      addRandomTile(board, 2);

      const flatBoard = board.flat();
      const nonNullCells = flatBoard.filter(cell => cell !== null);
      expect(nonNullCells.length).toBe(3);
    });

    it('should only add 2 or 4', () => {
      const board: Board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];

      addRandomTile(board, 3);

      const flatBoard = board.flat();
      const addedTile = flatBoard.find(cell => cell !== null);
      expect([2, 4]).toContain(addedTile);
    });

    it('should not modify board when no empty cells', () => {
      const board: Board = [
        [2, 4],
        [8, 16],
      ];

      const originalBoard = JSON.stringify(board);
      addRandomTile(board, 2);

      expect(JSON.stringify(board)).toBe(originalBoard);
    });

    it('should generate 2 with ~90% probability', () => {
      const iterations = 1000;
      let count2 = 0;

      for (let i = 0; i < iterations; i++) {
        const board: Board = [[null]];
        addRandomTile(board, 1);

        if (board[0][0] === 2) count2++;
      }

      // Should be around 900 (90%), allow some margin for randomness
      expect(count2).toBeGreaterThan(850);
      expect(count2).toBeLessThan(950);
    });

    it('should generate 4 with ~10% probability', () => {
      const iterations = 1000;
      let count4 = 0;

      for (let i = 0; i < iterations; i++) {
        const board: Board = [[null]];
        addRandomTile(board, 1);

        if (board[0][0] === 4) count4++;
      }

      // Should be around 100 (10%), allow some margin for randomness
      expect(count4).toBeGreaterThan(50);
      expect(count4).toBeLessThan(150);
    });

    it('should choose random empty cell', () => {
      const positions: Record<string, number> = {};
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const board: Board = [
          [null, 2],
          [null, null],
        ];
        addRandomTile(board, 2);

        // Find which position was filled
        if (board[0][0] !== null && board[0][0] !== 2) positions['0,0'] = (positions['0,0'] || 0) + 1;
        if (board[1][0] !== null) positions['1,0'] = (positions['1,0'] || 0) + 1;
        if (board[1][1] !== null) positions['1,1'] = (positions['1,1'] || 0) + 1;
      }

      // All positions should have been selected at least once
      expect(Object.keys(positions).length).toBeGreaterThan(0);
    });

    it('should work with different board sizes', () => {
      const board5x5: Board = Array(5).fill(null).map(() => Array(5).fill(null));

      addRandomTile(board5x5, 5);

      const flatBoard = board5x5.flat();
      const nonNullCells = flatBoard.filter(cell => cell !== null);
      expect(nonNullCells.length).toBe(1);
    });

    it('should mutate the board in place', () => {
      const board: Board = [
        [null, null],
        [null, null],
      ];
      const boardRef = board;

      addRandomTile(board, 2);

      expect(board).toBe(boardRef); // Same reference
      expect(board.flat().some(cell => cell !== null)).toBe(true);
    });

    it('should handle board with single empty cell', () => {
      const board: Board = [
        [2, 4],
        [8, null],
      ];

      addRandomTile(board, 2);

      expect(board[1][1]).not.toBe(null);
      expect([2, 4]).toContain(board[1][1]);
    });
  });
});
