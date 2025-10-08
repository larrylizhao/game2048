import { useEffect, useRef } from 'react';
import { Direction } from '../core';

interface SwipeHandlers {
  onSwipe: (direction: Direction) => void;
}

/**
 * Hook for handling touch swipe gestures on mobile devices
 */
export function useSwipe({ onSwipe }: SwipeHandlers) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  useEffect(() => {
    const minSwipeDistance = 50; // Minimum distance for a swipe

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isSwiping.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isSwiping.current) {
        // Already detected as swipe, prevent scrolling
        e.preventDefault();
        return;
      }

      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;

      const deltaX = touchCurrentX - touchStartX.current;
      const deltaY = touchCurrentY - touchStartY.current;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // If movement is significant, mark as swiping and prevent scroll
      if (absDeltaX > 10 || absDeltaY > 10) {
        isSwiping.current = true;
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Check if swipe distance is sufficient
      if (Math.max(absDeltaX, absDeltaY) < minSwipeDistance) {
        isSwiping.current = false;
        return;
      }

      // Determine direction based on larger delta
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        onSwipe(deltaX > 0 ? Direction.Right : Direction.Left);
      } else {
        // Vertical swipe
        onSwipe(deltaY > 0 ? Direction.Down : Direction.Up);
      }

      isSwiping.current = false;
    };

    // Use passive: false to allow preventDefault
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipe]);
}
