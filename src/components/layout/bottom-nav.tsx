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
      name: t('nav.dashboard').split(' ')[0], // Compact name for mobile
      fullName: t('nav.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t('nav.pets').split(' ')[0],
      fullName: t('nav.pets'),
      href: '/pets',
      icon: PawPrint,
    },
    {
      name: t('nav.history').split(' ')[0],
      fullName: t('nav.history'),
      href: '/history',
      icon: History,
    },
    {
      name: t('nav.hardware').split(' ')[0],
      fullName: t('nav.hardware'),
      href: '/hardware',
      icon: Cpu,
    },
    {
      name: t('nav.settings').split(' ')[0],
      fullName: t('nav.settings'),
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-sticky bg-surface-50/95 backdrop-blur-md border-t border-surface-200 shadow-bottom-nav pb-safe">
      <div className="flex items-center justify-around h-[68px] px-2 max-w-lg mx-auto">
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
                'flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 rounded-lg transition-colors duration-150 touch-target',
                isActive
                  ? 'text-primary font-bold'
                  : 'text-surface-400 hover:text-surface-700 active:scale-95'
              )}
              aria-label={item.fullName}
            >
              <div className={cn('p-1 rounded-md transition-colors', isActive && 'bg-primary-100 text-primary-800')}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs leading-none mt-1 truncate max-w-[64px]">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
