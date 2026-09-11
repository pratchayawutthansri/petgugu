import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'sos' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 touch-target select-none focus-visible:outline-2 focus-visible:outline-offset-2';

    const variants = {
      primary:
        'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm focus-visible:outline-primary',
      secondary:
        'bg-secondary-100 text-secondary-800 hover:bg-secondary-200 active:bg-secondary-300 focus-visible:outline-secondary',
      outline:
        'border border-surface-300 bg-white text-surface-700 hover:bg-surface-50 active:bg-surface-100 shadow-sm focus-visible:outline-primary',
      ghost:
        'bg-transparent text-surface-600 hover:bg-surface-100 hover:text-surface-900 active:bg-surface-200 focus-visible:outline-primary',
      danger:
        'bg-danger text-white hover:bg-danger-600 active:bg-danger-700 shadow-sm focus-visible:outline-danger',
      sos:
        'bg-danger-600 text-white font-bold tracking-wide hover:bg-danger-700 active:bg-danger-800 shadow-modal animate-pulse-soft focus-visible:outline-danger-600',
      success:
        'bg-success text-white hover:bg-success-600 active:bg-success-700 shadow-sm focus-visible:outline-success',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 min-h-[38px] gap-1.5',
      md: 'text-sm px-4 py-2.5 min-h-[44px] gap-2',
      lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5',
      icon: 'p-2.5 min-h-[44px] min-w-[44px]',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
