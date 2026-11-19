'use client';

import React, { useMemo } from 'react';
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
  Boxes,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar = React.memo(function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const navItems = useMemo(() => {
    const items = [
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
      items.push({
        name: t('nav.admin'),
        href: '/admin',
        icon: ShieldAlert,
      });
      items.push({
        name: t('nav.erp', 'ระบบ ERP หลังบ้าน'),
        href: '/erp',
        icon: Boxes,
      });
    }
    return items;
  }, [t, user?.role]);

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

      {/* Bottom User Profile Section */}
      {user && (
        <div className="p-3.5 border-t border-neutral-200/80 flex items-center justify-between bg-neutral-50/50">
          <Link href="/settings" className="flex items-center gap-2.5 min-w-0 group" title="ตั้งค่าโปรไฟล์และเปลี่ยนรูปภาพ">
            <img
              src={
                user.avatarUrl && !user.avatarUrl.includes('1535713875002')
                  ? user.avatarUrl
                  : '/images/default-avatar.svg'
              }
              alt={user.displayName}
              className="w-9 h-9 rounded-full object-cover border border-neutral-200 flex-shrink-0 group-hover:ring-2 group-hover:ring-primary-200 transition-all"
            />
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-neutral-900 truncate group-hover:text-primary-700 transition-colors">
                {user.displayName}
              </p>
              <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
            </div>
          </Link>

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
});
