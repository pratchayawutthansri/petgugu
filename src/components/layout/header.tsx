'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/contexts/toast-context';
import { DEMO_ALERTS } from '@/data/demo-alerts';
import { Avatar } from '@/components/ui/avatar';
import { BrandMark } from '@/components/ui/brand-mark';
import {
  Bell,
  Globe,
  Radio,
  Check,
  LogOut,
  User,
  Shield,
} from 'lucide-react';
import { cn, formatTimeAgo } from '@/lib/utils';

export function Header() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const { showToast } = useToast();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [alerts, setAlerts] = useState(DEMO_ALERTS);

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    showToast({
      type: 'info',
      message: 'ทำเครื่องหมายว่าอ่านทั้งหมดแล้ว',
    });
  };

  return (
    <header className="sticky top-0 z-sticky h-16 bg-surface-50/95 backdrop-blur-md border-b border-surface-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Brand / Title */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 lg:hidden">
          <BrandMark />
        </Link>

        {/* Demo Mode Badge */}
        <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-secondary-50 border border-secondary-200 text-xs font-semibold text-secondary-800">
          <Radio className="w-3.5 h-3.5 text-secondary-600" />
          <span>IoT prototype · live simulation</span>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-200 hover:bg-surface-50 text-surface-700 text-xs font-medium touch-target transition-colors"
            aria-label="Change Language"
          >
            <Globe className="w-4 h-4 text-surface-500" />
            <span className="uppercase font-bold">{locale}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white p-1.5 shadow-dropdown border border-surface-200 z-dropdown animate-scale-in">
              <button
                type="button"
                onClick={() => {
                  setLocale('th');
                  setShowLangMenu(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors',
                  locale === 'th' ? 'bg-primary-50 text-primary font-semibold' : 'text-surface-700 hover:bg-surface-50'
                )}
              >
                <span className="inline-flex items-center gap-2"><span className="w-6 text-[10px] font-extrabold tracking-wide text-surface-500">TH</span>ภาษาไทย</span>
                {locale === 'th' && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocale('en');
                  setShowLangMenu(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors',
                  locale === 'en' ? 'bg-primary-50 text-primary font-semibold' : 'text-surface-700 hover:bg-surface-50'
                )}
              >
                <span className="inline-flex items-center gap-2"><span className="w-6 text-[10px] font-extrabold tracking-wide text-surface-500">EN</span>English</span>
                {locale === 'en' && <Check className="w-3.5 h-3.5 text-primary" />}
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
            className="relative p-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-100 transition-colors touch-target flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white ring-2 ring-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-modal border border-surface-200 z-dropdown animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-surface-100 bg-surface-50">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-surface-900">การแจ้งเตือน</h4>
                  {unreadAlertsCount > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-700 font-semibold">
                      {unreadAlertsCount} ใหม่
                    </span>
                  )}
                </div>
                {unreadAlertsCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    อ่านทั้งหมด
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-surface-100 custom-scrollbar">
                {alerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-surface-400">
                    ไม่มีการแจ้งเตือน
                  </div>
                ) : (
                  alerts.map((alt) => (
                    <div
                      key={alt.id}
                      className={cn(
                        'p-3.5 hover:bg-surface-50 transition-colors flex items-start gap-3 text-left',
                        !alt.isRead && 'bg-primary-50/40'
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
                          <p className="text-xs font-semibold text-surface-900 truncate">
                            {alt.title}
                          </p>
                          <span className="text-[10px] text-surface-400 whitespace-nowrap">
                            {formatTimeAgo(alt.timestamp, locale)}
                          </span>
                        </div>
                        <p className="text-xs text-surface-600 mt-0.5 leading-snug">
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
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary-300 transition-all touch-target"
              aria-label="User Account"
            >
              <Avatar
                src={user.avatarUrl}
                name={user.displayName}
                size="sm"
                type="user"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-modal border border-surface-200 z-dropdown animate-scale-in">
                <div className="px-3 py-2 border-b border-surface-100">
                  <p className="text-sm font-semibold text-surface-900 truncate">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-surface-500 truncate">{user.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary-100 text-primary-700">
                    {user.role}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-surface-700 hover:bg-surface-50 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-surface-400" />
                    <span>{t('settings.title')}</span>
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-surface-700 hover:bg-surface-50 rounded-lg transition-colors"
                    >
                      <Shield className="w-4 h-4 text-primary" />
                      <span>{t('admin.title')}</span>
                    </Link>
                  )}
                </div>

                <div className="pt-1 border-t border-surface-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
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
