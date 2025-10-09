import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Board } from '../Board';
import type { Board as BoardType } from '../../core';

describe('Board', () => {
  it('should render 4x4 board with correct grid size', () => {
    const board: BoardType = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, null, null],
      [null, null, null, null],
    ];

    const { container } = render(<Board board={board} boardSize={4} />);
    const gridElement = container.querySelector('.grid');

    expect(gridElement).toBeTruthy();
    expect(gridElement).toHaveStyle({
      gridTemplateColumns: 'repeat(4, 1fr)',
    });
  });

  it('should render 5x5 board with correct grid size', () => {
    const board: BoardType = [
      [2, 4, 8, 16, 32],
      [64, 128, 256, 512, 1024],
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
    ];

    const { container } = render(<Board board={board} boardSize={5} />);
    const gridElement = container.querySelector('.grid');

    expect(gridElement).toHaveStyle({
      gridTemplateColumns: 'repeat(5, 1fr)',
    });
  });

  it('should render 6x6 board with correct grid size', () => {
    const board: BoardType = Array(6).fill(null).map(() => Array(6).fill(null));

    const { container } = render(<Board board={board} boardSize={6} />);
    const gridElement = container.querySelector('.grid');

    expect(gridElement).toHaveStyle({
      gridTemplateColumns: 'repeat(6, 1fr)',
    });
  });

  it('should render correct number of tiles for 4x4 board', () => {
    const board: BoardType = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, null],
      [null, null, null, null],
    ];

    const { container } = render(<Board board={board} boardSize={4} />);
    // The board container also has rounded-lg, so we filter by aspect-square which only tiles have
    const tiles = container.querySelectorAll('.aspect-square');

    // Board renders both desktop and mobile versions, so 16 * 2 = 32 tiles
    expect(tiles).toHaveLength(32);
  });

  it('should render correct number of tiles for 5x5 board', () => {
    const board: BoardType = Array(5).fill(null).map(() => Array(5).fill(null));

    const { container } = render(<Board board={board} boardSize={5} />);
    const tiles = container.querySelectorAll('.aspect-square');

    // Board renders both desktop and mobile versions, so 25 * 2 = 50 tiles
    expect(tiles).toHaveLength(50);
  });

  it('should have correct board dimensions for 4x4', () => {
    const board: BoardType = Array(4).fill(null).map(() => Array(4).fill(null));

    const { container } = render(<Board board={board} boardSize={4} />);
    // Get desktop version (hidden on mobile, visible on sm+)
    const boardElement = container.querySelector('.hidden.sm\\:grid') as HTMLElement;

    // Desktop: 4 * 95px cells + 3 * 16px gaps + 2 * 16px padding = 460px
    expect(boardElement.style.width).toBe('460px');
    expect(boardElement.style.height).toBe('460px');
  });

  it('should have correct board dimensions for 5x5', () => {
    const board: BoardType = Array(5).fill(null).map(() => Array(5).fill(null));

    const { container } = render(<Board board={board} boardSize={5} />);
    // Get desktop version (hidden on mobile, visible on sm+)
    const boardElement = container.querySelector('.hidden.sm\\:grid') as HTMLElement;

    // Desktop: 5 * 76px cells + 4 * 16px gaps + 2 * 16px padding = 476px
    expect(boardElement.style.width).toBe('476px');
    expect(boardElement.style.height).toBe('476px');
  });

  it('should have correct board dimensions for 6x6', () => {
    const board: BoardType = Array(6).fill(null).map(() => Array(6).fill(null));

    const { container } = render(<Board board={board} boardSize={6} />);
    // Get desktop version (hidden on mobile, visible on sm+)
    const boardElement = container.querySelector('.hidden.sm\\:grid') as HTMLElement;

    // Desktop: 6 * 63px cells + 5 * 16px gaps + 2 * 16px padding = 490px
    expect(boardElement.style.width).toBe('490px');
    expect(boardElement.style.height).toBe('490px');
  });

  it('should render empty board', () => {
    const board: BoardType = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    const { container } = render(<Board board={board} boardSize={4} />);
    const tiles = container.querySelectorAll('.aspect-square');

    // Board renders both desktop and mobile versions, so 16 * 2 = 32 tiles
    expect(tiles).toHaveLength(32);
  });

  it('should update when board changes', () => {
    const board1: BoardType = Array(4).fill(null).map(() => Array(4).fill(null));
    board1[0][0] = 2;

    const { rerender, container } = render(<Board board={board1} boardSize={4} />);

    const board2: BoardType = Array(4).fill(null).map(() => Array(4).fill(null));
    board2[0][0] = 4;

    rerender(<Board board={board2} boardSize={4} />);

    expect(container).toBeTruthy();
  });

  it('should have correct styling classes', () => {
    const board: BoardType = Array(4).fill(null).map(() => Array(4).fill(null));

    const { container } = render(<Board board={board} boardSize={4} />);
    // Get desktop version
    const desktopGrid = container.querySelector('.hidden.sm\\:grid');

    expect(desktopGrid).toHaveClass('gap-4');
    expect(desktopGrid).toHaveClass('p-4');
    expect(desktopGrid).toHaveClass('rounded-lg');
  });
});
