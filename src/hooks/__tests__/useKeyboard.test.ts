import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboard } from '../useKeyboard';
import { Direction } from '../../core';

describe('useKeyboard', () => {
  it('should call onMove with correct direction when arrow keys are pressed', () => {
    const onMoveMock = vi.fn();
    renderHook(() => useKeyboard(onMoveMock));

    // Simulate ArrowLeft key press
    const eventLeft = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    window.dispatchEvent(eventLeft);
    expect(onMoveMock).toHaveBeenCalledWith(Direction.Left);

    // Simulate ArrowRight key press
    const eventRight = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    window.dispatchEvent(eventRight);
    expect(onMoveMock).toHaveBeenCalledWith(Direction.Right);

    // Simulate ArrowUp key press
    const eventUp = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    window.dispatchEvent(eventUp);
    expect(onMoveMock).toHaveBeenCalledWith(Direction.Up);

    // Simulate ArrowDown key press
    const eventDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    window.dispatchEvent(eventDown);
    expect(onMoveMock).toHaveBeenCalledWith(Direction.Down);
  });

  it('should not call onMove for non-arrow keys', () => {
    const onMoveMock = vi.fn();
    renderHook(() => useKeyboard(onMoveMock));

    const event = new KeyboardEvent('keydown', { key: 'a' });
    window.dispatchEvent(event);

    expect(onMoveMock).not.toHaveBeenCalled();
  });

  it('should prevent default behavior for arrow keys', () => {
    const onMoveMock = vi.fn();
    renderHook(() => useKeyboard(onMoveMock));

    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should clean up event listener on unmount', () => {
    const onMoveMock = vi.fn();
    const { unmount } = renderHook(() => useKeyboard(onMoveMock));

    unmount();

    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    window.dispatchEvent(event);

    // Should not be called after unmount
    expect(onMoveMock).not.toHaveBeenCalled();
  });

  it('should update listener when onMove callback changes', () => {
    const onMoveMock1 = vi.fn();
    const onMoveMock2 = vi.fn();

    const { rerender } = renderHook(
      ({ callback }) => useKeyboard(callback),
      { initialProps: { callback: onMoveMock1 } }
    );

    const event1 = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    window.dispatchEvent(event1);
    expect(onMoveMock1).toHaveBeenCalledWith(Direction.Left);

    // Change callback
    rerender({ callback: onMoveMock2 });

    const event2 = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    window.dispatchEvent(event2);
    expect(onMoveMock2).toHaveBeenCalledWith(Direction.Right);
  });

  it('should handle all four directions correctly', () => {
    const onMoveMock = vi.fn();
    renderHook(() => useKeyboard(onMoveMock));

    const directions = [
      { key: 'ArrowLeft', expected: Direction.Left },
      { key: 'ArrowRight', expected: Direction.Right },
      { key: 'ArrowUp', expected: Direction.Up },
      { key: 'ArrowDown', expected: Direction.Down },
    ];

    directions.forEach(({ key, expected }) => {
      onMoveMock.mockClear();
      const event = new KeyboardEvent('keydown', { key });
      window.dispatchEvent(event);
      expect(onMoveMock).toHaveBeenCalledWith(expected);
    });
  });
});
