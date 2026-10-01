'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Avatar } from '@/components/ui/avatar';
import {
  Bell,
  Globe,
  Check,
  User,
  Shield,
  LogOut,
  PawPrint,
} from 'lucide-react';
import { cn, formatTimeAgo } from '@/lib/utils';
import { DEMO_ALERTS } from '@/data/demo-alerts';

export function Header() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [alerts, setAlerts] = useState(DEMO_ALERTS);

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, isRead: true })));
  };

  return (
    <header className="sticky top-0 z-sticky h-16 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-6 flex items-center justify-between select-none">
      {/* Left: Mobile Brand / Title */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 lg:hidden">
          <div className="w-8 h-8 rounded-full bg-[#181a20] text-white flex items-center justify-center flex-shrink-0">
            <PawPrint className="w-4 h-4 fill-current" />
          </div>
          <span className="text-lg font-bold tracking-tight text-neutral-900">
            Paw&amp;Co.
          </span>
        </Link>

        {/* System Status Badge */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-xs font-medium text-neutral-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>IoT System Active</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowAlertMenu(false);
              setShowUserMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200/80 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold touch-target transition-colors"
            aria-label="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <span className="uppercase">{locale}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-neutral-200 z-dropdown animate-scale-in">
              <button
                type="button"
                onClick={() => {
                  setLocale('th');
                  setShowLangMenu(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors',
                  locale === 'th' ? 'bg-[#181a20] text-white font-semibold' : 'text-neutral-700 hover:bg-neutral-100'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <span className={cn('w-5 text-[10px] font-bold', locale === 'th' ? 'text-neutral-400' : 'text-neutral-400')}>TH</span>
                  ภาษาไทย
                </span>
                {locale === 'th' && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocale('en');
                  setShowLangMenu(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors',
                  locale === 'en' ? 'bg-[#181a20] text-white font-semibold' : 'text-neutral-700 hover:bg-neutral-100'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <span className={cn('w-5 text-[10px] font-bold', locale === 'en' ? 'text-neutral-400' : 'text-neutral-400')}>EN</span>
                  English
                </span>
                {locale === 'en' && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowAlertMenu(!showAlertMenu);
              setShowLangMenu(false);
              setShowUserMenu(false);
            }}
            className="relative p-2 text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors touch-target flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white ring-2 ring-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-neutral-200 z-dropdown animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-neutral-50/70">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900">การแจ้งเตือน</h4>
                  {unreadAlertsCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-neutral-900 text-white font-semibold">
                      {unreadAlertsCount} ใหม่
                    </span>
                  )}
                </div>
                {unreadAlertsCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs text-neutral-600 hover:text-black hover:underline font-medium"
                  >
                    อ่านทั้งหมด
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 custom-scrollbar">
                {alerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-400">
                    ไม่มีการแจ้งเตือน
                  </div>
                ) : (
                  alerts.map((alt) => (
                    <div
                      key={alt.id}
                      className={cn(
                        'p-3.5 hover:bg-neutral-50 transition-colors flex items-start gap-3 text-left',
                        !alt.isRead && 'bg-neutral-50/50'
                      )}
                    >
                      <Avatar
                        src={alt.petAvatarUrl}
                        name={alt.petName}
                        size="sm"
                        type="pet"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-neutral-900 truncate">
                            {alt.title}
                          </p>
                          <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                            {formatTimeAgo(alt.timestamp, locale)}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-0.5 leading-snug">
                          {alt.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        {user && (
          <div className="relative hidden min-[360px]:block">
            <button
              type="button"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowLangMenu(false);
                setShowAlertMenu(false);
              }}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-neutral-300 transition-all touch-target"
              aria-label="User Account"
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={user.displayName}
                className="w-8 h-8 rounded-full object-cover border border-neutral-200"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-neutral-200 z-dropdown animate-scale-in">
                <div className="px-3 py-2 border-b border-neutral-100">
                  <p className="text-sm font-bold text-neutral-900 truncate">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                    {user.role}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-neutral-400" />
                    <span>{t('settings.title')}</span>
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 rounded-xl transition-colors"
                    >
                      <Shield className="w-4 h-4 text-neutral-700" />
                      <span>{t('admin.title')}</span>
                    </Link>
                  )}
                </div>

                <div className="pt-1 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
