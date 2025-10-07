import { Theme, THEME_STORAGE_KEY } from './types';

/**
 * Get saved theme from localStorage
 */
export const getSavedTheme = (): Theme | null => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === Theme.Light || saved === Theme.Dark ? saved : null;
  } catch {
    return null;
  }
};

/**
 * Save theme to localStorage
 */
export const saveTheme = (theme: Theme): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme:', error);
  }
};

/**
 * Get system preference for dark mode
 */
export const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return Theme.Light;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? Theme.Dark
    : Theme.Light;
};
