import { ReactNode, useEffect, useState, useCallback } from 'react';
import { Theme } from './types';
import { getSavedTheme, saveTheme, getSystemTheme } from './storage';
import { ThemeContext } from './ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Applies theme to the document element
 */
const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  
  if (theme === Theme.Dark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

/**
 * Theme provider component that manages theme state and persistence
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Priority: saved theme > system preference > light
    return getSavedTheme() || getSystemTheme();
  });

  // Apply theme to DOM
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      if (!getSavedTheme()) {
        const newTheme = e.matches ? Theme.Dark : Theme.Light;
        setTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light;
    setTheme(newTheme);
    saveTheme(newTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
