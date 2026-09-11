import React from 'react';
import { PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandMarkProps {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
}

export function BrandMark({ compact = false, inverse = false, className }: BrandMarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)} aria-label="Paws and Co.">
      <span
        className={cn(
          'inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
          inverse ? 'bg-white/12 text-white ring-1 ring-white/20' : 'bg-primary-900 text-white ring-1 ring-primary-950/10'
        )}
      >
        <PawPrint className="h-5 w-5" aria-hidden="true" />
      </span>
      {!compact && (
        <span className={cn('text-lg font-extrabold tracking-tight', inverse ? 'text-white' : 'text-surface-950')}>
          Paws<span className={inverse ? 'text-secondary-300' : 'text-secondary-600'}>&amp;</span>Co.
        </span>
      )}
    </span>
  );
}
