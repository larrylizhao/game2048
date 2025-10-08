import { describe, it, expect } from 'vitest';
import { mergeLine } from '../lineMerger';

describe('lineMerger', () => {
  describe('mergeLine', () => {
    it('should handle empty line', () => {
      const line = [null, null, null, null];
      const result = mergeLine(line);
      expect(result.line).toEqual([null, null, null, null]);
      expect(result.score).toBe(0);
    });

    it('should handle line with single tile', () => {
      const line = [2, null, null, null];
      const result = mergeLine(line);
      expect(result.line).toEqual([2, null, null, null]);
      expect(result.score).toBe(0);
    });

    it('should merge two identical tiles', () => {
      const line = [2, 2, null, null];
      const result = mergeLine(line);
      expect(result.line).toEqual([4, null, null, null]);
      expect(result.score).toBe(4);
    });

    it('should merge multiple pairs', () => {
      const line = [2, 2, 4, 4];
      const result = mergeLine(line);
      expect(result.line).toEqual([4, 8, null, null]);
      expect(result.score).toBe(12); // 4 + 8
    });

    it('should not merge different tiles', () => {
      const line = [2, 4, null, null];
      const result = mergeLine(line);
      expect(result.line).toEqual([2, 4, null, null]);
      expect(result.score).toBe(0);
    });

    it('should merge from left to right only once per move', () => {
      const line = [4, 4, 4, null];
      const result = mergeLine(line);
      expect(result.line).toEqual([8, 4, null, null]);
      expect(result.score).toBe(8);
    });

    it('should compact tiles before merging', () => {
      const line = [null, 2, null, 2];
      const result = mergeLine(line);
      expect(result.line).toEqual([4, null, null, null]);
      expect(result.score).toBe(4);
    });

    it('should handle complex scenario', () => {
      const line = [2, null, 2, 4];
      const result = mergeLine(line);
      expect(result.line).toEqual([4, 4, null, null]);
      expect(result.score).toBe(4);
    });

    it('should handle all same values', () => {
      const line = [2, 2, 2, 2];
      const result = mergeLine(line);
      expect(result.line).toEqual([4, 4, null, null]);
      expect(result.score).toBe(8); // 4 + 4
    });

    it('should preserve line length', () => {
      const line = [2, 4, 8];
      const result = mergeLine(line);
      expect(result.line).toHaveLength(3);
    });

    it('should handle larger values', () => {
      const line = [1024, 1024, null, null];
      const result = mergeLine(line);
      expect(result.line).toEqual([2048, null, null, null]);
      expect(result.score).toBe(2048);
    });
  });
});
