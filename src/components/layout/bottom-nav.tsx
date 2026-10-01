'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import {
  LayoutDashboard,
  PawPrint,
  History,
  Cpu,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t('nav.pets'),
      href: '/pets',
      icon: PawPrint,
    },
    {
      name: t('nav.history'),
      href: '/history',
      icon: History,
    },
    {
      name: t('nav.hardware'),
      href: '/hardware',
      icon: Cpu,
    },
    {
      name: t('nav.settings'),
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-sticky bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] pb-safe select-none">
      <div className="flex items-center justify-around h-[64px] px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 transition-all touch-target',
                isActive
                  ? 'text-neutral-900 font-bold'
                  : 'text-neutral-400 hover:text-neutral-700 active:scale-95'
              )}
              aria-label={item.name}
            >
              <div
                className={cn(
                  'p-1.5 rounded-xl transition-all',
                  isActive ? 'bg-[#181a20] text-white shadow-xs' : 'text-neutral-500'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] leading-tight mt-1 truncate max-w-[64px]">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
