'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pill' | 'underline';
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pill',
}: TabsProps) {
  if (variant === 'underline') {
    return (
      <div className={cn('border-b border-surface-200 flex space-x-6 overflow-x-auto scrollbar-hide', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex-shrink-0 flex items-center gap-2 pb-3.5 pt-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                isActive
                  ? 'border-primary-600 text-primary-800 font-bold'
                  : 'border-transparent text-surface-500 hover:text-surface-800 hover:border-surface-300'
              )}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs rounded-full font-semibold',
                    isActive ? 'bg-primary-100 text-primary-700' : 'bg-surface-200 text-surface-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Pill variant - mobile optimized with smooth scroll and zero squishing
  return (
    <div className={cn('w-full overflow-x-auto scrollbar-hide py-1', className)}>
      <div className="inline-flex items-center p-1.5 bg-surface-100/90 border border-surface-200/80 rounded-2xl gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-xl transition-all whitespace-nowrap',
                isActive
                  ? 'bg-white text-surface-950 font-bold shadow-sm border border-surface-200/60'
                  : 'text-surface-600 hover:text-surface-900 hover:bg-white/60 font-medium'
              )}
            >
              {tab.icon && (
                <span className={cn('flex-shrink-0', isActive ? 'text-primary-600' : 'text-surface-500')}>
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs rounded-full font-semibold',
                    isActive ? 'bg-primary-100 text-primary-700' : 'bg-surface-200 text-surface-700'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
