import { useEffect } from 'react';
import { Direction } from '../core';

/**
 * Maps keyboard keys to game directions
 */
const KEY_MAP: Record<string, Direction> = {
  ArrowLeft: Direction.Left,
  ArrowRight: Direction.Right,
  ArrowUp: Direction.Up,
  ArrowDown: Direction.Down,
};

/**
 * Custom hook for handling keyboard controls
 * @param onMove - Callback function to execute when a valid direction key is pressed
 */
export function useKeyboard(onMove: (direction: Direction) => void): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const direction = KEY_MAP[event.key];

      if (direction) {
        event.preventDefault(); // Prevent scrolling
        onMove(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMove]);
}
