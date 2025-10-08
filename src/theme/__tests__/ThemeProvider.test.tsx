import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from '../ThemeProvider';
import { useTheme } from '../ThemeContext';
import { Theme } from '../types';
import * as storage from '../storage';

// Test component that uses the theme context
function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear document classes
    document.documentElement.classList.remove('dark');

    // Mock localStorage
    vi.clearAllMocks();
  });

  it('should provide theme context to children', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(null);
    vi.spyOn(storage, 'getSystemTheme').mockReturnValue(Theme.Light);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent(Theme.Light);
  });

  it('should use saved theme if available', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Dark);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent(Theme.Dark);
  });

  it('should use system theme when no saved theme', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(null);
    vi.spyOn(storage, 'getSystemTheme').mockReturnValue(Theme.Dark);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent(Theme.Dark);
  });

  it('should toggle theme from light to dark', async () => {
    const user = userEvent.setup();
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(null);
    vi.spyOn(storage, 'getSystemTheme').mockReturnValue(Theme.Light);
    const saveThemeSpy = vi.spyOn(storage, 'saveTheme').mockImplementation(() => {});

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent(Theme.Light);

    await user.click(screen.getByText('Toggle'));

    expect(screen.getByTestId('theme')).toHaveTextContent(Theme.Dark);
    expect(saveThemeSpy).toHaveBeenCalledWith(Theme.Dark);
  });

  it('should toggle theme from dark to light', async () => {
    const user = userEvent.setup();
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Dark);
    const saveThemeSpy = vi.spyOn(storage, 'saveTheme').mockImplementation(() => {});

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent(Theme.Dark);

    await user.click(screen.getByText('Toggle'));

    expect(screen.getByTestId('theme')).toHaveTextContent(Theme.Light);
    expect(saveThemeSpy).toHaveBeenCalledWith(Theme.Light);
  });

  it('should apply dark class to document element when theme is dark', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Dark);

    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class from document element when theme is light', () => {
    document.documentElement.classList.add('dark');

    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(Theme.Light);

    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should update document class when theme changes', async () => {
    const user = userEvent.setup();
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(null);
    vi.spyOn(storage, 'getSystemTheme').mockReturnValue(Theme.Light);
    vi.spyOn(storage, 'saveTheme').mockImplementation(() => {});

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    await user.click(screen.getByText('Toggle'));

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    await user.click(screen.getByText('Toggle'));

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should render children', () => {
    vi.spyOn(storage, 'getSavedTheme').mockReturnValue(null);
    vi.spyOn(storage, 'getSystemTheme').mockReturnValue(Theme.Light);

    render(
      <ThemeProvider>
        <div data-testid="child">Child Content</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
