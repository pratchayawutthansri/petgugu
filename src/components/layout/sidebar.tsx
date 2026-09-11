'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Avatar } from '@/components/ui/avatar';
import { BrandMark } from '@/components/ui/brand-mark';
import {
  LayoutDashboard,
  PawPrint,
  History,
  Cpu,
  Settings,
  ShieldAlert,
  LogOut,
  Radio,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
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

  if (user?.role === 'ADMIN') {
    navItems.push({
      name: t('nav.admin'),
      href: '/admin',
      icon: ShieldAlert,
    });
  }

  return (
    <aside className="hidden lg:flex flex-col w-[280px] h-dvh bg-surface-50 border-r border-surface-200 fixed top-0 left-0 z-sticky select-none shadow-sidebar">
      {/* Brand Header */}
      <div className="p-6 border-b border-surface-200 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <BrandMark />
        </Link>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-surface-400">
          เมนูหลัก (Navigation)
        </div>

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
                'flex items-center gap-3 px-3.5 py-3 rounded-lg border text-sm font-medium transition-colors duration-150 touch-target',
                isActive
                  ? 'border-primary-900 bg-primary-900 text-white font-semibold'
                  : 'border-transparent text-surface-600 hover:border-surface-200 hover:text-surface-950 hover:bg-white'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'text-surface-500')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Prototype Info Box */}
      <div className="p-4 mx-4 mb-3 rounded-xl bg-secondary-50 border border-secondary-200 text-left">
        <div className="flex items-center gap-2 text-xs font-bold text-secondary-800">
          <Radio className="w-4 h-4 text-secondary-600" />
          <span>LILYGO T-SIM7080G</span>
        </div>
        <p className="text-xs text-secondary-700 mt-1 leading-relaxed">
          Field unit · NB-IoT / Cat-M1 · GPS ready
        </p>
      </div>

      {/* Bottom User Profile Section */}
      {user && (
        <div className="p-4 border-t border-surface-200 flex items-center justify-between bg-surface-100/45">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              src={user.avatarUrl}
              name={user.displayName}
              size="md"
              type="user"
            />
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold text-surface-900 truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-surface-500 truncate">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-2 text-surface-400 hover:text-danger-600 rounded-lg hover:bg-danger-50 transition-colors touch-target flex items-center justify-center"
            title={t('nav.logout')}
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
