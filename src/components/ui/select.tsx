import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      options,
      id,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-surface-700"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full min-h-touch appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-base sm:text-sm text-surface-900 transition-colors shadow-sm cursor-pointer',
              'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary focus:border-primary',
              'disabled:bg-surface-100 disabled:text-surface-400 disabled:cursor-not-allowed',
              error
                ? 'border-danger-500 focus-visible:outline-danger-500'
                : 'border-surface-300 hover:border-surface-400',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-3.5 flex items-center pointer-events-none text-surface-400">
            {error ? (
              <AlertCircle className="w-4 h-4 text-danger-500" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>

        {error && (
          <p className="text-xs text-danger-600 font-medium mt-1">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-surface-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
