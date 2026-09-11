'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => showToast({ type: 'success', message, title }),
    [showToast]
  );
  const error = useCallback(
    (message: string, title?: string) => showToast({ type: 'error', message, title }),
    [showToast]
  );
  const warning = useCallback(
    (message: string, title?: string) => showToast({ type: 'warning', message, title }),
    [showToast]
  );
  const info = useCallback(
    (message: string, title?: string) => showToast({ type: 'info', message, title }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* Toast Notification Container (WCAG compliant polite region) */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-toast flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none"
      >
        {toasts.map((toast) => {
          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-modal border animate-slide-up transition-all duration-200',
                toast.type === 'success' && 'bg-white border-success-200 text-surface-900',
                toast.type === 'error' && 'bg-white border-danger-200 text-surface-900',
                toast.type === 'warning' && 'bg-white border-warning-200 text-surface-900',
                toast.type === 'info' && 'bg-white border-secondary-200 text-surface-900'
              )}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-success-500" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-danger-500" />}
                {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-warning-500" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-secondary-500" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {toast.title && <h4 className="text-sm font-semibold text-surface-900">{toast.title}</h4>}
                <p className="text-sm text-surface-600 leading-snug">{toast.message}</p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 text-surface-400 hover:text-surface-600 rounded transition-colors touch-target flex items-center justify-center -mr-1 -mt-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
