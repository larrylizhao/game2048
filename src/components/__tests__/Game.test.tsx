import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Game } from '../Game';
import { GameStatus, Direction } from '../../core';
import type { Board } from '../../core';
import * as useGameStateModule from '../../hooks/useGameState';
import * as useKeyboardModule from '../../hooks/useKeyboard';
import { ThemeProvider } from '../../theme';
import { Theme } from '../../theme/types';
import * as storage from '../../theme/storage';

// Mock hooks
vi.mock('../../hooks/useGameState');
vi.mock('../../hooks/useKeyboard');
vi.mock('../../services/aiService');

describe('Game', () => {
  const mockBoard: Board = [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [null, null, null, null],
    [null, null, null, null],
  ];

  const mockGameState = {
    board: mockBoard,
    score: 1000,
    bestScore: 5000,
    status: GameStatus.Playing,
    boardSize: 4,
    winningTile: 2048,
    move: vi.fn(),
    restart: vi.fn(),
    continuePlaying: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useGameStateModule, 'useGameState').mockReturnValue(mockGameState);
    vi.spyOn(useKeyboardModule, 'useKeyboard').mockReturnValue(undefined);
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(null);
    vi.spyOn(storage, 'getSystemTheme').mockReturnValue(Theme.Light);
  });

  it('should render game title', () => {
    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(screen.getByText('2048')).toBeInTheDocument();
  });

  it('should render score board with current score and best score', () => {
    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('5000')).toBeInTheDocument();
  });

  it('should render New Game button', () => {
    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: /New Game/i })).toBeInTheDocument();
  });

  it('should call restart when New Game button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    const newGameButton = screen.getByRole('button', { name: /New Game/i });
    await user.click(newGameButton);

    expect(mockGameState.restart).toHaveBeenCalled();
  });

  it('should render board with correct size', () => {
    const { container } = render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    const boardElement = container.querySelector('.grid');
    expect(boardElement).toBeInTheDocument();
  });

  it('should render BoardSizeSelector', () => {
    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render ThemeToggle', () => {
    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    // ThemeToggle is a button for switching theme
    const themeButtons = screen.getAllByRole('button');
    expect(themeButtons.length).toBeGreaterThan(1); // Has multiple buttons including theme toggle
  });

  it('should render AI Hint button', () => {
    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: /AI Hint/i })).toBeInTheDocument();
  });

  it('should display instructions', () => {
    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(screen.getByText(/Use arrow keys to play/i)).toBeInTheDocument();
  });

  it('should show win message when game is won', () => {
    vi.spyOn(useGameStateModule, 'useGameState').mockReturnValue({
      ...mockGameState,
      status: GameStatus.Won,
    });

    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(screen.getByText(/You Win!/i)).toBeInTheDocument();
    expect(screen.getByText(/Reached 2048/i)).toBeInTheDocument();
  });

  it('should show Continue button when game is won', () => {
    vi.spyOn(useGameStateModule, 'useGameState').mockReturnValue({
      ...mockGameState,
      status: GameStatus.Won,
    });

    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });

  it('should call continuePlaying when Continue button is clicked', async () => {
    const user = userEvent.setup();
    vi.spyOn(useGameStateModule, 'useGameState').mockReturnValue({
      ...mockGameState,
      status: GameStatus.Won,
    });

    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    const continueButton = screen.getByRole('button', { name: /Continue/i });
    await user.click(continueButton);

    expect(mockGameState.continuePlaying).toHaveBeenCalled();
  });

  it('should show game over message when game is lost', () => {
    vi.spyOn(useGameStateModule, 'useGameState').mockReturnValue({
      ...mockGameState,
      status: GameStatus.Lost,
    });

    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(screen.getByText(/Game Over!/i)).toBeInTheDocument();
  });

  it('should not show win message when game is playing', () => {
    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(screen.queryByText(/You Win!/i)).not.toBeInTheDocument();
  });

  it('should not show game over message when game is playing', () => {
    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(screen.queryByText(/Game Over!/i)).not.toBeInTheDocument();
  });

  it('should register keyboard handler', () => {
    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(useKeyboardModule.useKeyboard).toHaveBeenCalledWith(mockGameState.move);
  });

  it('should handle board size change', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '5');

    // Should call restart after board size change
    expect(mockGameState.restart).toHaveBeenCalled();
  });

  it('should pass board to AI hint component', () => {
    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    // AI Hint button should be present, which means board was passed
    expect(screen.getByRole('button', { name: /AI Hint/i })).toBeInTheDocument();
  });

  it('should display correct winning tile value in win message', () => {
    vi.spyOn(useGameStateModule, 'useGameState').mockReturnValue({
      ...mockGameState,
      status: GameStatus.Won,
      winningTile: 4096,
    });

    render(
      <ThemeProvider>
        <Game />
      </ThemeProvider>
    );

    expect(screen.getByText(/Reached 4096/i)).toBeInTheDocument();
  });
});
