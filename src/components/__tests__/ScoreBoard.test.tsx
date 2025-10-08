import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreBoard } from '../ScoreBoard';

describe('ScoreBoard', () => {
  it('should display current score', () => {
    render(<ScoreBoard score={100} bestScore={500} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should display best score', () => {
    render(<ScoreBoard score={100} bestScore={500} />);
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('should display score label', () => {
    render(<ScoreBoard score={100} bestScore={500} />);
    expect(screen.getByText('Score')).toBeInTheDocument();
  });

  it('should display best score label', () => {
    render(<ScoreBoard score={100} bestScore={500} />);
    expect(screen.getByText('Best')).toBeInTheDocument();
  });

  it('should display zero scores', () => {
    render(<ScoreBoard score={0} bestScore={0} />);
    expect(screen.getAllByText('0')).toHaveLength(2);
  });

  it('should display large scores correctly', () => {
    render(<ScoreBoard score={999999} bestScore={1000000} />);
    expect(screen.getByText('999999')).toBeInTheDocument();
    expect(screen.getByText('1000000')).toBeInTheDocument();
  });

  it('should update when scores change', () => {
    const { rerender } = render(<ScoreBoard score={100} bestScore={200} />);
    expect(screen.getByText('100')).toBeInTheDocument();

    rerender(<ScoreBoard score={150} bestScore={200} />);
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
  });

  it('should handle score exceeding best score', () => {
    render(<ScoreBoard score={600} bestScore={500} />);
    expect(screen.getByText('600')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('should render two separate score containers', () => {
    const { container } = render(<ScoreBoard score={100} bestScore={500} />);
    const scoreContainers = container.querySelectorAll('.bg-yellow-600, .bg-yellow-700');
    expect(scoreContainers).toHaveLength(2);
  });

  it('should have correct styling classes', () => {
    const { container } = render(<ScoreBoard score={100} bestScore={500} />);
    const scoreContainer = container.querySelector('.bg-yellow-600');
    const bestContainer = container.querySelector('.bg-yellow-700');

    expect(scoreContainer).toBeTruthy();
    expect(bestContainer).toBeTruthy();
  });
});
