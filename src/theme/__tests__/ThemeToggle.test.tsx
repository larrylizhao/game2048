import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '../ThemeProvider';
import { Theme } from '../types';
import * as storage from '../storage';

describe('ThemeToggle', () => {
  it('should render theme toggle button', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(null);
    vi.spyOn(storage, 'getSystemTheme').mockReturnValue(Theme.Light);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show moon icon in light mode', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Light);

    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should show sun icon in dark mode', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Dark);

    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should toggle theme when clicked', async () => {
    const user = userEvent.setup();
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Light);
    const saveThemeSpy = vi.spyOn(storage, 'saveTheme').mockImplementation(() => {});

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(saveThemeSpy).toHaveBeenCalledWith(Theme.Dark);
  });

  it('should have correct aria-label for accessibility', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Light);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('should have correct title attribute', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Dark);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveAttribute('title', 'Switch to light mode');
  });

  it('should have transition and hover classes', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Light);

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('transition-colors');
    expect(button).toHaveClass('hover:bg-gray-300');
  });

  it('should update icon when theme changes', async () => {
    const user = userEvent.setup();
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Light);
    vi.spyOn(storage, 'saveTheme').mockImplementation(() => {});

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Should show moon icon initially (light mode)
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

    // Click to toggle
    await user.click(button);

    // Should now show sun icon (dark mode)
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });
});
