import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-surface-200', className)}
      {...props}
    />
  );
}

export function PetCardSkeleton() {
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-card space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-100">
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="w-full h-full min-h-[400px] bg-surface-100 rounded-xl flex flex-col items-center justify-center text-surface-400 p-6 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-surface-200 mb-3" />
      <Skeleton className="h-4 w-48 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
