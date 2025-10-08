import { useEffect } from 'react';
import { X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

/**
 * Toast notification component with auto-dismiss
 */
export const Toast = ({ message, type = 'info', duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500 dark:bg-green-600',
    error: 'bg-red-500 dark:bg-red-600',
    info: 'bg-blue-500 dark:bg-blue-600',
  }[type];

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 max-w-md w-auto animate-slide-down`}
      role="alert"
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
