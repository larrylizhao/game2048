import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tile } from '../Tile';

describe('Tile', () => {
  it('should render empty tile', () => {
    const { container } = render(<Tile value={null} size={95} />);
    const tile = container.querySelector('.rounded-lg');
    expect(tile).toHaveClass('bg-gray-200');
  });

  it('should render tile with value 2', () => {
    render(<Tile value={2} size={95} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render tile with value 4', () => {
    render(<Tile value={4} size={95} />);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should render tile with value 2048', () => {
    render(<Tile value={2048} size={95} />);
    expect(screen.getByText('2048')).toBeInTheDocument();
  });

  it('should have correct color for tile 2', () => {
    const { container } = render(<Tile value={2} size={95} />);
    const tile = container.querySelector('.rounded-lg');
    expect(tile).toHaveClass('bg-tile-2');
  });

  it('should have correct color for tile 4', () => {
    const { container } = render(<Tile value={4} size={95} />);
    const tile = container.querySelector('.rounded-lg');
    expect(tile).toHaveClass('bg-tile-4');
  });

  it('should have correct color for tile 2048', () => {
    const { container } = render(<Tile value={2048} size={95} />);
    const tile = container.querySelector('.rounded-lg');
    expect(tile).toHaveClass('bg-tile-2048');
  });

  it('should apply correct size styling', () => {
    const { container } = render(<Tile value={2} size={95} />);
    const tile = container.querySelector('.rounded-lg');
    expect(tile).toHaveClass('aspect-square');
  });

  it('should have smaller font for larger numbers on small tiles', () => {
    const { container: container1 } = render(<Tile value={2} size={63} />);
    const tile1 = container1.querySelector('.rounded-lg');
    expect(tile1).toHaveClass('text-xl');

    const { container: container2 } = render(<Tile value={1024} size={63} />);
    const tile2 = container2.querySelector('.rounded-lg');
    expect(tile2).toHaveClass('text-lg');
  });

  it('should have appropriate font size for medium tiles (5x5)', () => {
    const { container } = render(<Tile value={256} size={76} />);
    const tile = container.querySelector('.rounded-lg');
    expect(tile?.className).toMatch(/text-(xl|2xl)/);
  });

  it('should have appropriate font size for large tiles (4x4)', () => {
    const { container } = render(<Tile value={256} size={95} />);
    const tile = container.querySelector('.rounded-lg');
    expect(tile?.className).toMatch(/text-(xl|2xl)/);
  });

  it('should render high value tiles (4096)', () => {
    render(<Tile value={4096} size={95} />);
    expect(screen.getByText('4096')).toBeInTheDocument();
  });

  it('should render high value tiles (8192)', () => {
    render(<Tile value={8192} size={95} />);
    expect(screen.getByText('8192')).toBeInTheDocument();
  });

  it('should have purple color for 4096 tile', () => {
    const { container } = render(<Tile value={4096} size={95} />);
    const tile = container.querySelector('.rounded-lg');
    expect(tile).toHaveClass('bg-purple-600');
  });

  it('should not render text for empty tiles', () => {
    const { container } = render(<Tile value={null} size={95} />);
    expect(container.textContent).toBe('');
  });

  it('should have white text for values >= 8', () => {
    const { container } = render(<Tile value={8} size={95} />);
    const tile = container.querySelector('.rounded-lg');
    expect(tile).toHaveClass('text-white');
  });

  it('should have transition animation class', () => {
    const { container } = render(<Tile value={2} size={95} />);
    const tile = container.querySelector('.rounded-lg');
    expect(tile).toHaveClass('transition-all');
  });

  it('should have shadow class', () => {
    const { container } = render(<Tile value={2} size={95} />);
    const tile = container.querySelector('.rounded-lg');
    expect(tile).toHaveClass('shadow-md');
  });
});
