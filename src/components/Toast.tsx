import { useEffect } from 'react';
import { X } from './icons';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Toast notification component with auto-dismiss and optional action button
 */
export const Toast = ({ message, type = 'info', duration = 3000, onClose, actionLabel, onAction }: ToastProps) => {
  useEffect(() => {
    // Don't auto-dismiss if there's an action button
    if (actionLabel && onAction) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, actionLabel, onAction]);

  const bgColor = {
    success: 'bg-green-500 dark:bg-green-600',
    error: 'bg-red-500 dark:bg-red-600',
    info: 'bg-blue-500 dark:bg-blue-600',
  }[type];

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-xl max-w-md w-auto animate-slide-down`}
      role="alert"
    >
      {/* Message and close button row */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action button (shown on second row if present) */}
      {actionLabel && onAction && (
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => {
              onAction();
              onClose();
            }}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-semibold transition-colors"
            aria-label={actionLabel}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};
