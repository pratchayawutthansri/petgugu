'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  Database,
  AlertOctagon,
  LineChart,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BACKOFFICE_ISSUES } from '@/data/backoffice-data';

export function BackofficeNav() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const openIssuesCount = BACKOFFICE_ISSUES.filter(
    (i) => i.status === 'OPEN' || i.status === 'IN_PROGRESS'
  ).length;

  const navItems = [
    {
      label: 'ภาพรวมระบบ',
      href: '/backoffice',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'ติดตามการเคลื่อนไหว',
      href: '/backoffice/movement',
      icon: Compass,
      tag: 'Live GPS',
    },
    {
      label: 'ข้อมูลอุปกรณ์และสเปก',
      href: '/backoffice/data',
      icon: Database,
    },
    {
      label: 'การแจ้งปัญหาและงานซ่อม',
      href: '/backoffice/issues',
      icon: AlertOctagon,
      badge: openIssuesCount > 0 ? openIssuesCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      label: 'ดูการใช้งานและสถิติ',
      href: '/backoffice/usage',
      icon: LineChart,
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Enterprise Top Status Banner */}
      <div className="bg-[#111827] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 flex items-center justify-center font-black shadow-md flex-shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Paws&Co. Fleet ERP Backoffice
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                ระบบปฏิบัติการพร้อมใช้ (Uptime 99.82%)
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
              ศูนย์บริหารจัดการฮาร์ดแวร์และโทรมาตรภาคสนาม (Backoffice Hub)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700/80 text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>UTC+7:</span>
            <span className="font-bold text-amber-300">{currentTime || '12:30:00'}</span>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700"
            title="รีเฟรชข้อมูลพิกัดและโทรมาตรล่าสุด"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin text-amber-400')} />
            <span className="hidden sm:inline">รีเฟรช</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-surface-200 shadow-sm flex items-center gap-1 overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap select-none',
                isActive
                  ? 'bg-neutral-900 text-white shadow-sm font-bold'
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-amber-400' : 'text-surface-500')} />
              <span>{item.label}</span>
              {item.tag && (
                <span
                  className={cn(
                    'text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold uppercase',
                    isActive ? 'bg-amber-400 text-neutral-950' : 'bg-surface-200 text-surface-700'
                  )}
                >
                  {item.tag}
                </span>
              )}
              {item.badge !== undefined && (
                <span
                  className={cn(
                    'text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold',
                    item.badgeColor || 'bg-rose-500 text-white'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
