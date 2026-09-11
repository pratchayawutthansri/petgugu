import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, checked, id, disabled, onChange, ...props }, ref) => {
    const generatedId = useId();
    const switchId = id || generatedId;

    return (
      <label
        htmlFor={switchId}
        className={cn(
          'flex items-center justify-between gap-4 py-2 cursor-pointer select-none touch-target',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {(label || description) && (
          <div className="flex flex-col text-left">
            {label && (
              <span className="text-sm font-medium text-surface-900">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-surface-500 mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}

        <div className="relative inline-flex flex-shrink-0 items-center">
          <input
            ref={ref}
            id={switchId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-11 h-6 bg-surface-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors'
            )}
          />
        </div>
      </label>
    );
  }
);

Switch.displayName = 'Switch';
