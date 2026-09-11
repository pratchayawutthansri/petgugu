import React from 'react';
import { cn } from '@/lib/utils';
import { PawPrint } from 'lucide-react';
import { Button } from './button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-surface-200 bg-surface-50/50',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-4 shadow-sm">
        {icon || <PawPrint className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-semibold text-surface-900 leading-snug">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-surface-500 max-w-sm mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
