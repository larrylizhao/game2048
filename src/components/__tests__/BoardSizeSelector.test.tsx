import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BoardSizeSelector } from '../BoardSizeSelector';
import { BOARD_CONFIGS } from '../../config/boardConfig';

describe('BoardSizeSelector', () => {
  it('should render with current board size selected', () => {
    const mockOnSizeChange = vi.fn();
    render(<BoardSizeSelector currentSize={4} onSizeChange={mockOnSizeChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('4');
  });

  it('should display all board size options', () => {
    const mockOnSizeChange = vi.fn();
    render(<BoardSizeSelector currentSize={4} onSizeChange={mockOnSizeChange} />);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(BOARD_CONFIGS.length);

    BOARD_CONFIGS.forEach((config, index) => {
      expect(options[index]).toHaveTextContent(config.name);
    });
  });

  it('should call onSizeChange when a new size is selected', async () => {
    const mockOnSizeChange = vi.fn();
    const user = userEvent.setup();

    render(<BoardSizeSelector currentSize={4} onSizeChange={mockOnSizeChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '5');

    expect(mockOnSizeChange).toHaveBeenCalledTimes(1);
    const config5x5 = BOARD_CONFIGS.find(c => c.size === 5);
    expect(mockOnSizeChange).toHaveBeenCalledWith(config5x5);
  });

  it('should change selected value when currentSize prop changes', () => {
    const mockOnSizeChange = vi.fn();
    const { rerender } = render(
      <BoardSizeSelector currentSize={4} onSizeChange={mockOnSizeChange} />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('4');

    rerender(<BoardSizeSelector currentSize={5} onSizeChange={mockOnSizeChange} />);
    expect(select).toHaveValue('5');
  });

  it('should have grid icon', () => {
    const mockOnSizeChange = vi.fn();
    const { container } = render(
      <BoardSizeSelector currentSize={4} onSizeChange={mockOnSizeChange} />
    );

    // Check for lucide icon (it's an SVG)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should handle selection of 6x6 board', async () => {
    const mockOnSizeChange = vi.fn();
    const user = userEvent.setup();

    render(<BoardSizeSelector currentSize={4} onSizeChange={mockOnSizeChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '6');

    const config6x6 = BOARD_CONFIGS.find(c => c.size === 6);
    expect(mockOnSizeChange).toHaveBeenCalledWith(config6x6);
  });

  it('should have modern card styling', () => {
    const mockOnSizeChange = vi.fn();
    const { container } = render(
      <BoardSizeSelector currentSize={4} onSizeChange={mockOnSizeChange} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('bg-white');
    expect(wrapper).toHaveClass('dark:bg-gray-800');
    expect(wrapper).toHaveClass('rounded-xl');
    expect(wrapper).toHaveClass('shadow-lg');
  });

  it('should have correct select styling', () => {
    const mockOnSizeChange = vi.fn();
    render(<BoardSizeSelector currentSize={4} onSizeChange={mockOnSizeChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('bg-gray-50');
    expect(select).toHaveClass('dark:bg-gray-700');
    expect(select).toHaveClass('rounded-lg');
  });

  it('should render options in correct order', () => {
    const mockOnSizeChange = vi.fn();
    render(<BoardSizeSelector currentSize={4} onSizeChange={mockOnSizeChange} />);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(BOARD_CONFIGS.length);

    BOARD_CONFIGS.forEach((config, index) => {
      expect(options[index]).toHaveValue(config.size.toString());
      expect(options[index]).toHaveTextContent(config.name);
    });
  });
});
