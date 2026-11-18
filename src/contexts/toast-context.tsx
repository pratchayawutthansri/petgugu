'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 3200 }: Omit<ToastItem, 'id'>) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      // Keep at most 3 toasts visible so they don't flood the top-left screen
      setToasts((prev) => [...prev.slice(-2), newToast]);

      if (duration > 0) {
        const timer = setTimeout(() => {
          timersRef.current.delete(id);
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
        timersRef.current.set(id, timer);
      }
    },
    []
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

  const contextValue = useMemo(
    () => ({ showToast, success, error, warning, info }),
    [showToast, success, error, warning, info]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast Notification Container (Positioned Top-Left as requested) */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="toast-container-top-left flex flex-col gap-2.5 max-w-[calc(100vw-32px)] sm:max-w-md w-auto pointer-events-none"
      >
        {toasts.map((toast) => {
          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl shadow-modal border transition-all duration-200 animate-fade-in backdrop-blur-md',
                toast.type === 'success' && 'bg-white border-emerald-200 text-surface-900',
                toast.type === 'error' && 'bg-white border-rose-200 text-surface-900',
                toast.type === 'warning' && 'bg-white border-amber-200 text-surface-900',
                toast.type === 'info' && 'bg-white border-sky-200 text-surface-900'
              )}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-sky-600" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-1">
                {toast.title && <h4 className="text-sm font-bold text-surface-950 leading-snug">{toast.title}</h4>}
                <p className="text-xs sm:text-sm text-surface-600 leading-snug mt-0.5">{toast.message}</p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors -mr-1 -mt-1"
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
