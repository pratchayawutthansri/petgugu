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
  const { locale } = useLanguage();

  const navItems = [
    {
      name: locale === 'th' ? 'หน้าหลัก' : 'Home',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: locale === 'th' ? 'สัตว์เลี้ยง' : 'Pets',
      href: '/pets',
      icon: PawPrint,
    },
    {
      name: locale === 'th' ? 'เส้นทาง' : 'History',
      href: '/history',
      icon: History,
    },
    {
      name: locale === 'th' ? 'ปลอกคอ' : 'Collar',
      href: '/hardware',
      icon: Cpu,
    },
    {
      name: locale === 'th' ? 'ตั้งค่า' : 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-sticky bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] pb-safe select-none">
      <div className="flex items-center justify-around h-[64px] px-1 max-w-lg mx-auto">
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
                'flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 transition-all',
                isActive
                  ? 'text-neutral-900 font-bold'
                  : 'text-neutral-500 hover:text-neutral-700 active:scale-95'
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
              <span
                className={cn(
                  'text-[11px] leading-tight mt-1 whitespace-nowrap tracking-tight',
                  isActive ? 'font-bold text-neutral-950' : 'font-medium text-neutral-600'
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
