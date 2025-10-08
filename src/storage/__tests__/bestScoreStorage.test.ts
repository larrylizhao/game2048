import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  loadBestScore,
  saveBestScore,
  clearBestScore,
  clearAllBestScores,
} from '../bestScoreStorage';

describe('bestScoreStorage', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      get length() {
        return Object.keys(store).length;
      },
      key: (index: number) => {
        const keys = Object.keys(store);
        return keys[index] || null;
      },
    };
  })();

  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('loadBestScore', () => {
    it('should return 0 when no score is saved', () => {
      expect(loadBestScore(4)).toBe(0);
    });

    it('should load saved score for board size', () => {
      localStorage.setItem('game2048_best_score_4x4', '1000');
      expect(loadBestScore(4)).toBe(1000);
    });

    it('should return different scores for different board sizes', () => {
      localStorage.setItem('game2048_best_score_4x4', '1000');
      localStorage.setItem('game2048_best_score_5x5', '2000');
      localStorage.setItem('game2048_best_score_6x6', '3000');

      expect(loadBestScore(4)).toBe(1000);
      expect(loadBestScore(5)).toBe(2000);
      expect(loadBestScore(6)).toBe(3000);
    });

    it('should handle invalid stored values', () => {
      localStorage.setItem('game2048_best_score_4x4', 'invalid');
      expect(loadBestScore(4)).toBe(NaN);
    });

    it('should return 0 when localStorage fails', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Make getItem throw error by replacing it
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = () => {
        throw new Error('Storage error');
      };

      expect(loadBestScore(4)).toBe(0);
      expect(consoleWarnSpy).toHaveBeenCalled();

      localStorage.getItem = originalGetItem;
      consoleWarnSpy.mockRestore();
    });
  });

  describe('saveBestScore', () => {
    it('should save score for board size', () => {
      saveBestScore(4, 1500);
      expect(localStorage.getItem('game2048_best_score_4x4')).toBe('1500');
    });

    it('should save different scores for different board sizes', () => {
      saveBestScore(4, 1000);
      saveBestScore(5, 2000);
      saveBestScore(6, 3000);

      expect(localStorage.getItem('game2048_best_score_4x4')).toBe('1000');
      expect(localStorage.getItem('game2048_best_score_5x5')).toBe('2000');
      expect(localStorage.getItem('game2048_best_score_6x6')).toBe('3000');
    });

    it('should overwrite existing score', () => {
      saveBestScore(4, 1000);
      saveBestScore(4, 2000);
      expect(localStorage.getItem('game2048_best_score_4x4')).toBe('2000');
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        throw new Error('Storage error');
      };

      expect(() => saveBestScore(4, 1000)).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalled();

      localStorage.setItem = originalSetItem;
      consoleWarnSpy.mockRestore();
    });
  });

  describe('clearBestScore', () => {
    it('should clear score for specific board size', () => {
      saveBestScore(4, 1000);
      saveBestScore(5, 2000);

      clearBestScore(4);

      expect(loadBestScore(4)).toBe(0);
      expect(loadBestScore(5)).toBe(2000);
    });

    it('should handle clearing non-existent score', () => {
      expect(() => clearBestScore(4)).not.toThrow();
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = () => {
        throw new Error('Storage error');
      };

      expect(() => clearBestScore(4)).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalled();

      localStorage.removeItem = originalRemoveItem;
      consoleWarnSpy.mockRestore();
    });
  });

  describe('clearAllBestScores', () => {
    it('should clear all best scores', () => {
      // Spy on Object.keys to return our mock storage keys
      const originalKeys = Object.keys;
      Object.keys = vi.fn((obj) => {
        if (obj === localStorage) {
          return ['game2048_best_score_4x4', 'game2048_best_score_5x5', 'game2048_best_score_6x6'];
        }
        return originalKeys(obj);
      });

      saveBestScore(4, 1000);
      saveBestScore(5, 2000);
      saveBestScore(6, 3000);

      clearAllBestScores();

      expect(loadBestScore(4)).toBe(0);
      expect(loadBestScore(5)).toBe(0);
      expect(loadBestScore(6)).toBe(0);

      Object.keys = originalKeys;
    });

    it('should only clear game2048 scores, not other localStorage items', () => {
      const originalKeys = Object.keys;
      Object.keys = vi.fn((obj) => {
        if (obj === localStorage) {
          return ['game2048_best_score_4x4', 'other_app_data'];
        }
        return originalKeys(obj);
      });

      saveBestScore(4, 1000);
      localStorage.setItem('other_app_data', 'important');

      clearAllBestScores();

      expect(loadBestScore(4)).toBe(0);
      expect(localStorage.getItem('other_app_data')).toBe('important');

      Object.keys = originalKeys;
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => clearAllBestScores()).not.toThrow();

      consoleWarnSpy.mockRestore();
      vi.restoreAllMocks();
    });
  });
});
