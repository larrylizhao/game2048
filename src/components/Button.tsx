import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

/**
 * Reusable button component
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '',
  ...props 
}: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 dark:bg-gray-500 dark:hover:bg-gray-600',
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
