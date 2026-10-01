'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import {
  LayoutDashboard,
  PawPrint,
  History,
  Cpu,
  Settings,
  ShieldAlert,
  LogOut,
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
    <aside className="hidden lg:flex flex-col w-[270px] h-dvh bg-white border-r border-neutral-200/80 fixed top-0 left-0 z-sticky select-none shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-200/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#181a20] text-white flex items-center justify-center flex-shrink-0">
            <PawPrint className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">
            Paw&amp;Co.
          </span>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          เมนูหลัก
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
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[#181a20] text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-white' : 'text-neutral-400')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Hardware Status Widget */}
      <div className="p-3.5 mx-3.5 mb-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>LILYGO T-SIM7080G</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-md">
            Online
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 mt-1.5 leading-snug">
          NB-IoT / Cat-M1 · GPS Active
        </p>
      </div>

      {/* Bottom User Profile Section */}
      {user && (
        <div className="p-3.5 border-t border-neutral-200/80 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user.displayName}
              className="w-9 h-9 rounded-full object-cover border border-neutral-200 flex-shrink-0"
            />
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-neutral-900 truncate">
                {user.displayName}
              </p>
              <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors touch-target flex items-center justify-center"
            title="ออกจากระบบ"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
