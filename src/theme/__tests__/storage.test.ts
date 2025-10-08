import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSavedTheme, saveTheme, getSystemTheme } from '../storage';
import { Theme, THEME_STORAGE_KEY } from '../types';

describe('theme/storage', () => {
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
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
  });

  describe('getSavedTheme', () => {
    it('should return saved light theme', () => {
      localStorage.setItem(THEME_STORAGE_KEY, Theme.Light);
      expect(getSavedTheme()).toBe(Theme.Light);
    });

    it('should return saved dark theme', () => {
      localStorage.setItem(THEME_STORAGE_KEY, Theme.Dark);
      expect(getSavedTheme()).toBe(Theme.Dark);
    });

    it('should return null when no theme is saved', () => {
      expect(getSavedTheme()).toBeNull();
    });

    it('should return null for invalid theme values', () => {
      localStorage.setItem(THEME_STORAGE_KEY, 'invalid-theme');
      expect(getSavedTheme()).toBeNull();
    });

    it('should return null when localStorage throws error', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = () => {
        throw new Error('Storage error');
      };

      expect(getSavedTheme()).toBeNull();

      localStorage.getItem = originalGetItem;
    });
  });

  describe('saveTheme', () => {
    it('should save light theme to localStorage', () => {
      saveTheme(Theme.Light);
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(Theme.Light);
    });

    it('should save dark theme to localStorage', () => {
      saveTheme(Theme.Dark);
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(Theme.Dark);
    });

    it('should overwrite existing theme', () => {
      saveTheme(Theme.Light);
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(Theme.Light);

      saveTheme(Theme.Dark);
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(Theme.Dark);
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        throw new Error('Storage error');
      };

      expect(() => saveTheme(Theme.Dark)).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalled();

      localStorage.setItem = originalSetItem;
      consoleWarnSpy.mockRestore();
    });
  });

  describe('getSystemTheme', () => {
    it('should return dark theme when system prefers dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      expect(getSystemTheme()).toBe(Theme.Dark);
    });

    it('should return light theme when system prefers light', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      expect(getSystemTheme()).toBe(Theme.Light);
    });

    it('should return light theme when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error - testing undefined window
      delete global.window;

      expect(getSystemTheme()).toBe(Theme.Light);

      global.window = originalWindow;
    });
  });

  describe('integration', () => {
    it('should save and retrieve theme correctly', () => {
      saveTheme(Theme.Dark);
      expect(getSavedTheme()).toBe(Theme.Dark);

      saveTheme(Theme.Light);
      expect(getSavedTheme()).toBe(Theme.Light);
    });

    it('should use correct storage key', () => {
      saveTheme(Theme.Dark);
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(Theme.Dark);
      expect(THEME_STORAGE_KEY).toBe('game-2048-theme');
    });
  });
});
