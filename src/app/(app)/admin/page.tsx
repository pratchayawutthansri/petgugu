'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { DEMO_USERS } from '@/data/demo-users';
import { DEMO_PETS } from '@/data/demo-pets';
import { DEMO_DEVICES } from '@/data/demo-devices';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldAlert,
  Users,
  PawPrint,
  Cpu,
  Radio,
  Server,
  Database,
  Activity,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminPage() {
  const { user } = useAuth();
  const { t, locale } = useLanguage();

  const totalUsers = DEMO_USERS.length;
  const totalPets = DEMO_PETS.length;
  const totalDevices = DEMO_DEVICES.length;
  const activeDevices = DEMO_DEVICES.filter((d) => d.isOnline).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <h1 className="page-title">{t('admin.title')}</h1>
          </div>
          <p className="page-subtitle">{t('admin.subtitle')}</p>
        </div>

        <Badge variant="primary" size="md">
          {t('admin.demoBadge')}
        </Badge>
      </div>

      {/* Stats Summary Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-white flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-surface-500 block">{t('admin.totalUsers')}</span>
            <span className="text-2xl font-extrabold text-surface-900">{totalUsers} บัญชี</span>
          </div>
        </Card>

        <Card className="p-5 bg-white flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-secondary-50 text-secondary-600 border border-secondary-100 flex-shrink-0">
            <PawPrint className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-surface-500 block">{t('admin.totalPets')}</span>
            <span className="text-2xl font-extrabold text-surface-900">{totalPets} ตัว</span>
          </div>
        </Card>

        <Card className="p-5 bg-white flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-success-50 text-success-600 border border-success-100 flex-shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-surface-500 block">{t('admin.totalDevices')}</span>
            <span className="text-2xl font-extrabold text-surface-900">{totalDevices} เครื่อง</span>
          </div>
        </Card>

        <Card className="p-5 bg-white flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-warning-50 text-warning-600 border border-warning-100 flex-shrink-0">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-surface-500 block">{t('admin.activeDevices')}</span>
            <span className="text-2xl font-extrabold text-surface-900">{activeDevices} ออนไลน์</span>
          </div>
        </Card>
      </div>

      {/* System Health Server Status Card */}
      <Card className="p-6 bg-surface-900 text-white border-surface-700 shadow-modal">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-success-400" />
          <h3 className="text-lg font-bold text-white">{t('admin.systemHealth')}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-800 border border-surface-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-surface-300">API Gateway</span>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-success-400">HTTP 200 OK</p>
            <p className="text-[11px] text-surface-400">Response time: ~12ms</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-800 border border-surface-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-surface-300">PostgreSQL DB</span>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-success-400">Connected</p>
            <p className="text-[11px] text-surface-400">Prisma Schema v6.2 (Active)</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-800 border border-surface-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-surface-300">MQTT Broker (EMQX)</span>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-success-400">Ready for Telemetry</p>
            <p className="text-[11px] text-surface-400">Port 1883 / TLS 8883</p>
          </div>
        </div>
      </Card>

      {/* Users Directory Table */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-surface-900">{t('admin.usersTable')}</h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface-50 border-y border-surface-200 text-surface-600 font-semibold">
              <tr>
                <th className="py-3 px-4">ชื่อผู้ใช้</th>
                <th className="py-3 px-4">อีเมล</th>
                <th className="py-3 px-4">บทบาท (Role)</th>
                <th className="py-3 px-4">เบอร์โทรศัพท์</th>
                <th className="py-3 px-4">วันที่สมัคร</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {DEMO_USERS.map((u) => (
                <tr key={u.id} className="hover:bg-surface-50/50">
                  <td className="py-3 px-4 font-bold text-surface-900">{u.displayName}</td>
                  <td className="py-3 px-4 text-surface-600">{u.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant={u.role === 'ADMIN' ? 'primary' : 'surface'} size="sm">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-surface-600">{u.phoneNumber || '-'}</td>
                  <td className="py-3 px-4 text-surface-500">{formatDate(u.createdAt, locale, false)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pets Directory Table */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-surface-900">{t('admin.petsTable')}</h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface-50 border-y border-surface-200 text-surface-600 font-semibold">
              <tr>
                <th className="py-3 px-4">สัตว์เลี้ยง</th>
                <th className="py-3 px-4">สายพันธุ์</th>
                <th className="py-3 px-4">รหัสประจำเครื่อง</th>
                <th className="py-3 px-4">แบตเตอรี่</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4">QR Code Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {DEMO_PETS.map((p) => {
                const isOnline = p.device?.isOnline ?? true;
                return (
                  <tr key={p.id} className="hover:bg-surface-50/50">
                    <td className="py-3 px-4 font-bold text-surface-900 flex items-center gap-2">
                      <img src={p.primaryPhotoUrl} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                      <span>{p.name}</span>
                    </td>
                    <td className="py-3 px-4 text-surface-600">{p.breed}</td>
                    <td className="py-3 px-4 font-mono text-xs text-surface-600">{p.device?.macAddress || 'C4:DE:E2:88:42:0A'}</td>
                    <td className="py-3 px-4 font-bold text-surface-800">{p.device?.batteryLevel || 85}%</td>
                    <td className="py-3 px-4">
                      <Badge variant={isOnline ? 'success' : 'surface'} size="sm" dot>
                        {isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-primary font-bold">{p.qrCodeId}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
