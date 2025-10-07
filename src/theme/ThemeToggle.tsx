import { Theme } from './types';
import { useTheme } from './ThemeContext';
import { Sun, Moon } from '../components/icons';

/**
 * Theme toggle button component with accessible icon
 */
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === Theme.Dark;
  const label = isDark ? 'light' : 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors duration-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      aria-label={'Switch to ' + label + ' mode'}
      title={'Switch to ' + label + ' mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};
