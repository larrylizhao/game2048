import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { Theme } from '../theme/types';
import * as storage from '../theme/storage';

// Mock the Game component to avoid complex integration testing
vi.mock('../components/Game', () => ({
  Game: () => <div data-testid="game-component">Game Component</div>,
}));

describe('App', () => {
  it('should render without crashing', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(null);
    vi.spyOn(storage, 'getSystemTheme').mockReturnValue(Theme.Light);

    render(<App />);
    expect(screen.getByTestId('game-component')).toBeInTheDocument();
  });

  it('should wrap Game component with ThemeProvider', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Dark);

    render(<App />);

    // The game component should be rendered
    expect(screen.getByTestId('game-component')).toBeInTheDocument();

    // The document should have dark class when theme is dark
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should apply light theme when saved', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Light);

    render(<App />);

    expect(screen.getByTestId('game-component')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should use system theme when no saved theme', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(null);
    vi.spyOn(storage, 'getSystemTheme').mockReturnValue(Theme.Dark);

    render(<App />);

    expect(screen.getByTestId('game-component')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
