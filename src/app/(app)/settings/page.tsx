'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/contexts/toast-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import {
  User,
  Bell,
  Globe,
  Sparkles,
  ShieldAlert,
  Save,
  Check,
  Zap,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'language' | 'plan'>('account');

  // Account State
  const [displayName, setDisplayName] = useState(user?.displayName || 'สมชาย ใจดี');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '081-234-5678');

  // Notification Toggles State
  const [zoneAlert, setZoneAlert] = useState(true);
  const [lowBatAlert, setLowBatAlert] = useState(true);
  const [offlineAlert, setOfflineAlert] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const handleSaveAccount = () => {
    showToast({
      type: 'success',
      title: 'บันทึกสำเร็จ',
      message: 'อัปเดตข้อมูลบัญชีผู้ใช้เรียบร้อยแล้ว',
    });
  };

  const handleSaveNotifications = () => {
    showToast({
      type: 'success',
      title: 'บันทึกสำเร็จ',
      message: 'บันทึกการตั้งค่าการแจ้งเตือนแล้ว',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">{t('settings.title')}</h1>
        <p className="page-subtitle">{t('settings.subtitle')}</p>
      </div>

      {/* Settings Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'account', label: t('settings.accountTab'), icon: <User className="w-4 h-4" /> },
          { id: 'notifications', label: t('settings.notificationTab'), icon: <Bell className="w-4 h-4" /> },
          { id: 'language', label: t('settings.languageTab'), icon: <Globe className="w-4 h-4" /> },
          { id: 'plan', label: t('settings.planTab'), icon: <Sparkles className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* TAB 1: Account */}
      {activeTab === 'account' && (
        <Card className="p-5 sm:p-6 space-y-6">
          <CardHeader className="p-0 pb-3 border-b border-surface-100">
            <CardTitle>{t('settings.accountTab')}</CardTitle>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <Input
              label={t('settings.displayName')}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <Input
              label={t('settings.email')}
              value={user?.email || 'demo@pawsandco.com'}
              disabled
              helperText="อีเมลผูกกับระบบบัญชีและไม่สามารถเปลี่ยนแปลงได้"
            />

            <Input
              label={t('settings.phone')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <div className="pt-4 flex justify-end">
              <Button
                variant="primary"
                onClick={handleSaveAccount}
                leftIcon={<Save className="w-4 h-4" />}
              >
                {t('settings.saveChanges')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: Notifications */}
      {activeTab === 'notifications' && (
        <Card className="p-5 sm:p-6 space-y-6">
          <CardHeader className="p-0 pb-3 border-b border-surface-100">
            <CardTitle>{t('settings.notificationTab')}</CardTitle>
          </CardHeader>

          <CardContent className="p-0 space-y-4 divide-y divide-surface-100">
            <Switch
              label={t('settings.zoneExitAlert')}
              description="ส่งการแจ้งเตือนทันทีเมื่อสัตว์เลี้ยงก้าวออกจากพื้นที่ปลอดภัยที่กำหนดไว้"
              checked={zoneAlert}
              onChange={(e) => setZoneAlert(e.target.checked)}
            />

            <Switch
              label={t('settings.lowBatteryAlert')}
              description="ส่งการแจ้งเตือนเมื่อแบตเตอรี่ปลอกคอเหลือน้อยกว่า 30%"
              checked={lowBatAlert}
              onChange={(e) => setLowBatAlert(e.target.checked)}
            />

            <Switch
              label={t('settings.offlineAlert')}
              description="แจ้งเตือนเมื่อปลอกคอขาดการเชื่อมต่อเกิน 1 ชั่วโมง"
              checked={offlineAlert}
              onChange={(e) => setOfflineAlert(e.target.checked)}
            />

            <Switch
              label="รายงานสรุปกิจกรรมประจำสัปดาห์"
              description="รับสรุปสถิติการเดินและกิจกรรมของสัตว์เลี้ยงทุกวันอาทิตย์"
              checked={weeklyReport}
              onChange={(e) => setWeeklyReport(e.target.checked)}
            />

            <div className="pt-4 flex justify-end">
              <Button
                variant="primary"
                onClick={handleSaveNotifications}
                leftIcon={<Save className="w-4 h-4" />}
              >
                {t('settings.saveChanges')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Language */}
      {activeTab === 'language' && (
        <Card className="p-5 sm:p-6 space-y-6">
          <CardHeader className="p-0 pb-3 border-b border-surface-100">
            <CardTitle>{t('settings.languageTab')}</CardTitle>
          </CardHeader>

          <CardContent className="p-0 space-y-3">
            {/* Thai Radio Card */}
            <div
              onClick={() => {
                setLocale('th');
                showToast({ type: 'info', message: 'เปลี่ยนภาษาเป็น ภาษาไทย เรียบร้อยแล้ว' });
              }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                locale === 'th' ? 'border-primary bg-primary-50/20' : 'border-surface-200 hover:border-surface-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇹🇭</span>
                <div>
                  <span className="font-bold text-surface-900 block">ภาษาไทย</span>
                  <span className="text-xs text-surface-500">ตั้งค่าเริ่มต้นสำหรับผู้ใช้ในประเทศไทย</span>
                </div>
              </div>
              {locale === 'th' && <Check className="w-5 h-5 text-primary" />}
            </div>

            {/* English Radio Card */}
            <div
              onClick={() => {
                setLocale('en');
                showToast({ type: 'info', message: 'Language switched to English successfully.' });
              }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                locale === 'en' ? 'border-primary bg-primary-50/20' : 'border-surface-200 hover:border-surface-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇬🇧</span>
                <div>
                  <span className="font-bold text-surface-900 block">English</span>
                  <span className="text-xs text-surface-500">International language option</span>
                </div>
              </div>
              {locale === 'en' && <Check className="w-5 h-5 text-primary" />}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: Plan & Usage Limits */}
      {activeTab === 'plan' && (
        <Card className="p-5 sm:p-6 space-y-6">
          <CardHeader className="p-0 pb-3 border-b border-surface-100">
            <div className="flex items-center justify-between">
              <CardTitle>{t('settings.planTab')}</CardTitle>
              <Badge variant="primary" size="md">
                {t('settings.planName')}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
              <div className="flex items-center gap-2 text-primary-900 font-bold">
                <Zap className="w-5 h-5 text-primary" />
                <span>{t('settings.currentPlan')}: {t('settings.planName')}</span>
              </div>
              <p className="text-xs text-primary-700 mt-1">
                {t('settings.planDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-surface-50 border border-surface-100 text-left">
                <span className="text-xs text-surface-500 block">สัตว์เลี้ยงที่ดูแล</span>
                <span className="text-lg font-bold text-surface-900">2 / 5 ตัว</span>
                <div className="w-full bg-surface-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '40%' }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-50 border border-surface-100 text-left">
                <span className="text-xs text-surface-500 block">พื้นที่ปลอดภัย (Safe Zones)</span>
                <span className="text-lg font-bold text-surface-900">2 / 3 จุด</span>
                <div className="w-full bg-surface-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '66%' }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-50 border border-surface-100 text-left">
                <span className="text-xs text-surface-500 block">เก็บบันทึกประวัติ (Retention)</span>
                <span className="text-lg font-bold text-surface-900">30 วัน</span>
                <div className="w-full bg-surface-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-success h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Tooltip content="เวอร์ชันต้นแบบวิจัย — ใช้งานฟรีทุกฟังก์ชัน ไม่ต้องชำระเงิน">
                <Button variant="outline" disabled>
                  อัปเกรดแผน (Coming Soon)
                </Button>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="p-5 sm:p-6 border-danger-200 bg-danger-50/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-danger-700 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-danger-600" />
              <span>{t('settings.dangerZone')}</span>
            </h4>
            <p className="text-xs text-surface-600 mt-1">
              {t('settings.demoNotice')}
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              showToast({
                type: 'warning',
                message: t('settings.demoNotice'),
              });
            }}
          >
            {t('settings.deleteAccount')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
