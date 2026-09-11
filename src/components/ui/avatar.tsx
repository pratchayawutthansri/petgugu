import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { PawPrint, User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'pet' | 'user';
  status?: 'online' | 'offline' | 'warning' | 'danger';
}

export function Avatar({
  className,
  src,
  alt = '',
  name,
  size = 'md',
  type = 'pet',
  status,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const statusColors = {
    online: 'bg-success-500 border-white',
    offline: 'bg-surface-400 border-white',
    warning: 'bg-warning-500 border-white',
    danger: 'bg-danger-500 border-white animate-pulse-soft',
  };

  const statusSizes = {
    sm: 'w-2.5 h-2.5 right-0 bottom-0 border-2',
    md: 'w-3 h-3 right-0 bottom-0 border-2',
    lg: 'w-4 h-4 right-0.5 bottom-0.5 border-2',
    xl: 'w-5 h-5 right-1 bottom-1 border-2',
  };

  const getInitials = (n?: string) => {
    if (!n) return '';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)} {...props}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden bg-primary-100 text-primary-700 font-semibold border border-surface-200 shadow-sm select-none',
          sizes[size]
        )}
      >
        {src && !hasError ? (
          // Use standard img with error fallback
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : name ? (
          <span>{getInitials(name)}</span>
        ) : type === 'pet' ? (
          <PawPrint className="w-1/2 h-1/2 text-primary-500" />
        ) : (
          <User className="w-1/2 h-1/2 text-primary-500" />
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute rounded-full ring-1 ring-black/5',
            statusColors[status],
            statusSizes[size]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}
