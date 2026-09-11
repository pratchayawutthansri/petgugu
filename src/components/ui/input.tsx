import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      disabled,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-surface-700"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-surface-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'w-full min-h-touch rounded-lg border bg-white px-3.5 py-2.5 text-base sm:text-sm text-surface-900 placeholder:text-surface-400 transition-colors shadow-sm',
              'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary focus:border-primary',
              'disabled:bg-surface-100 disabled:text-surface-400 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error
                ? 'border-danger-500 focus-visible:outline-danger-500 focus:border-danger-500 pr-10'
                : 'border-surface-300 hover:border-surface-400',
              className
            )}
            {...props}
          />

          {error ? (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-danger-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          ) : (
            rightIcon && (
              <div className="absolute right-3.5 flex items-center text-surface-400">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {error && (
          <p id={errorId} className="text-xs text-danger-600 flex items-center gap-1 font-medium mt-1">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-surface-500 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
