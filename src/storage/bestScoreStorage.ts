/**
 * LocalStorage utilities for persisting best scores per board size
 */

const BEST_SCORE_PREFIX = 'game2048_best_score_';

/**
 * Get storage key for a specific board size
 */
function getStorageKey(boardSize: number): string {
  return `${BEST_SCORE_PREFIX}${boardSize}x${boardSize}`;
}

/**
 * Load best score for a specific board size from localStorage
 */
export function loadBestScore(boardSize: number): number {
  try {
    const key = getStorageKey(boardSize);
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.warn('Failed to load best score from localStorage:', error);
    return 0;
  }
}

/**
 * Save best score for a specific board size to localStorage
 */
export function saveBestScore(boardSize: number, score: number): void {
  try {
    const key = getStorageKey(boardSize);
    localStorage.setItem(key, score.toString());
  } catch (error) {
    console.warn('Failed to save best score to localStorage:', error);
  }
}

/**
 * Clear best score for a specific board size
 */
export function clearBestScore(boardSize: number): void {
  try {
    const key = getStorageKey(boardSize);
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear best score from localStorage:', error);
  }
}

/**
 * Clear all best scores
 */
export function clearAllBestScores(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(BEST_SCORE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear all best scores from localStorage:', error);
  }
}
