import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { AIHint } from '../AIHint';
import { Direction } from '../../core';
import type { Board } from '../../core';
import * as aiService from '../../services/aiService';

vi.mock('../../services/aiService');

describe('AIHint', () => {
  const mockBoard: Board = [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [null, null, null, null],
    [null, null, null, null],
  ];

  const mockOnMove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render AI hint button', () => {
    render(<AIHint board={mockBoard} onMove={mockOnMove} />);
    expect(screen.getByRole('button', { name: /AI Hint/i })).toBeInTheDocument();
  });

  it('should show loading state when fetching hint', async () => {
    const user = userEvent.setup();
    vi.spyOn(aiService, 'getAIHint').mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(Direction.Left), 100))
    );

    render(<AIHint board={mockBoard} onMove={mockOnMove} />);

    const button = screen.getByRole('button', { name: /AI Hint/i });
    await user.click(button);

    expect(screen.getByText(/Thinking.../i)).toBeInTheDocument();
  });

  it('should call onMove with AI suggestion when Apply is clicked', async () => {
    const user = userEvent.setup();
    vi.spyOn(aiService, 'getAIHint').mockResolvedValue(Direction.Left);

    render(<AIHint board={mockBoard} onMove={mockOnMove} />);

    const hintButton = screen.getByRole('button', { name: /AI Hint/i });
    await user.click(hintButton);

    const applyButton = await screen.findByRole('button', { name: /Apply/i });
    await user.click(applyButton);

    expect(mockOnMove).toHaveBeenCalledWith(Direction.Left);
  });

  it('should display error message when API call fails', async () => {
    const user = userEvent.setup();
    vi.spyOn(aiService, 'getAIHint').mockRejectedValue(new Error('API Error'));

    render(<AIHint board={mockBoard} onMove={mockOnMove} />);

    const button = screen.getByRole('button', { name: /AI Hint/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Failed to get AI hint/i)).toBeInTheDocument();
    });
  });

  it('should not call onMove when API call fails', async () => {
    const user = userEvent.setup();
    vi.spyOn(aiService, 'getAIHint').mockRejectedValue(new Error('API Error'));

    render(<AIHint board={mockBoard} onMove={mockOnMove} />);

    const button = screen.getByRole('button', { name: /AI Hint/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Failed to get AI hint/i)).toBeInTheDocument();
    });

    expect(mockOnMove).not.toHaveBeenCalled();
  });

  it('should be disabled while loading', async () => {
    const user = userEvent.setup();
    vi.spyOn(aiService, 'getAIHint').mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(Direction.Left), 100))
    );

    render(<AIHint board={mockBoard} onMove={mockOnMove} />);

    const button = screen.getByRole('button', { name: /AI Hint/i });
    await user.click(button);

    expect(button).toBeDisabled();
  });

  it('should re-enable button after hint is received', async () => {
    const user = userEvent.setup();
    vi.spyOn(aiService, 'getAIHint').mockResolvedValue(Direction.Right);

    render(<AIHint board={mockBoard} onMove={mockOnMove} />);

    const button = screen.getByRole('button', { name: /AI Hint/i });
    await user.click(button);

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('should re-enable button after error', async () => {
    const user = userEvent.setup();
    vi.spyOn(aiService, 'getAIHint').mockRejectedValue(new Error('API Error'));

    render(<AIHint board={mockBoard} onMove={mockOnMove} />);

    const button = screen.getByRole('button', { name: /AI Hint/i });
    await user.click(button);

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('should call getAIHint with current board', async () => {
    const user = userEvent.setup();
    const getAIHintSpy = vi.spyOn(aiService, 'getAIHint').mockResolvedValue(Direction.Up);

    render(<AIHint board={mockBoard} onMove={mockOnMove} />);

    const button = screen.getByRole('button', { name: /AI Hint/i });
    await user.click(button);

    await waitFor(() => {
      expect(getAIHintSpy).toHaveBeenCalledWith(mockBoard);
    });
  });

  it('should handle multiple consecutive clicks', async () => {
    const user = userEvent.setup();
    vi.spyOn(aiService, 'getAIHint').mockResolvedValue(Direction.Down);

    render(<AIHint board={mockBoard} onMove={mockOnMove} />);

    // First hint cycle
    const hintButton = screen.getByRole('button', { name: /AI Hint/i });
    await user.click(hintButton);

    let applyButton = await screen.findByRole('button', { name: /Apply/i });
    await user.click(applyButton);
    expect(mockOnMove).toHaveBeenCalledTimes(1);

    // Second hint cycle
    await user.click(hintButton);
    applyButton = await screen.findByRole('button', { name: /Apply/i });
    await user.click(applyButton);
    expect(mockOnMove).toHaveBeenCalledTimes(2);
  });
});
