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
      'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 touch-target select-none focus-visible:outline-2 focus-visible:outline-offset-2';

    const variants = {
      primary:
        'bg-[#181a20] text-white hover:bg-neutral-800 active:bg-black shadow-xs focus-visible:outline-neutral-900',
      secondary:
        'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 focus-visible:outline-neutral-300',
      outline:
        'border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 active:bg-neutral-100 shadow-2xs focus-visible:outline-neutral-900',
      ghost:
        'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 focus-visible:outline-neutral-900',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-xs focus-visible:outline-red-600',
      sos:
        'bg-red-600 text-white font-bold tracking-wide hover:bg-red-700 active:bg-red-800 shadow-modal animate-pulse-soft focus-visible:outline-red-600',
      success:
        'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-xs focus-visible:outline-emerald-600',
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
