import { createContext, useContext } from 'react';
import { Theme } from './types';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Custom hook to access theme context
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
