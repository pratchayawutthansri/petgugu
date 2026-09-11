'use client';

import React, { useState } from 'react';
import { DEMO_DEVICES } from '@/data/demo-devices';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/contexts/toast-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import {
  Cpu,
  Radio,
  Battery,
  Wifi,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Plus,
  Zap,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function HardwarePage() {
  const { t, locale } = useLanguage();
  const { showToast } = useToast();

  const [devices, setDevices] = useState(DEMO_DEVICES);
  const [showPairModal, setShowPairModal] = useState(false);
  const [macInput, setMacInput] = useState('');
  const [isPairing, setIsPairing] = useState(false);

  const handlePairDevice = async () => {
    if (!macInput || macInput.length < 8) {
      showToast({ type: 'warning', message: 'กรุณากรอก MAC Address หรือ Serial Number ที่ถูกต้อง' });
      return;
    }
    setIsPairing(true);
    setTimeout(() => {
      const newDev = {
        id: `dev_${Date.now()}`,
        serialNumber: `LILYGO-S3-${Math.floor(1000 + Math.random() * 9000)}X`,
        model: 'LILYGO T-SIM7080G-S3 ESP32-S3',
        macAddress: macInput.toUpperCase(),
        firmwareVersion: 'v1.4.2-paws',
        batteryLevel: 95,
        signalStrength: 88,
        isOnline: true,
        lastSeenAt: new Date().toISOString(),
        networkType: 'LTE_CAT_M1' as const,
        gpsStatus: 'FIX_3D' as const,
        updateIntervalSeconds: 10,
        powerSaveMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDevices((prev) => [newDev, ...prev]);
      setIsPairing(false);
      setShowPairModal(false);
      setMacInput('');
      showToast({
        type: 'success',
        title: 'จับคู่อุปกรณ์สำเร็จ',
        message: `เชื่อมต่อกับบอร์ด ${newDev.serialNumber} เรียบร้อยแล้ว`,
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">{t('hardware.title')}</h1>
          <p className="page-subtitle">{t('hardware.subtitle')}</p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => setShowPairModal(true)}
        >
          {t('hardware.pairNew')}
        </Button>
      </div>

      {/* Hardware Architecture Specs Showcase */}
      <Card className="p-6 bg-gradient-to-br from-surface-900 to-surface-800 text-white border-surface-700 shadow-modal">
        <div className="flex items-center gap-2 text-xs font-bold text-primary-300 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span>{t('hardware.specsTitle')}</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          LILYGO T-SIM7080G-S3 ESP32-S3 IoT Tracker
        </h2>
        <p className="text-sm text-surface-300 max-w-3xl leading-relaxed">
          บอร์ดไมโครคอนโทรลเลอร์รุ่นพิเศษสำหรับการทดลองระบบ IoT พิกัดสูง ออกแบบมาเพื่อปลอกคอสุนัข
          รวมชิป ESP32-S3, โมดูล SIM7080G, เสาอากาศ GNSS, และวงจรจัดการพลังงาน PMU ในแผงเดียว
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-6">
          <div className="p-3.5 rounded-xl bg-surface-800/80 border border-surface-700 space-y-1">
            <span className="text-xs font-bold text-primary-300 block">⚡ ไมโครคอนโทรลเลอร์ (MCU)</span>
            <p className="text-xs text-surface-200">ESP32-S3 Dual-Core Xtensa LX7 (16MB Flash / 8MB PSRAM)</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-800/80 border border-surface-700 space-y-1">
            <span className="text-xs font-bold text-secondary-300 block">📡 โมเด็มไร้สาย (Cellular)</span>
            <p className="text-xs text-surface-200">SIM7080G รองรับ NB-IoT และ LTE Cat-M1 คลื่นความถี่สากล</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-800/80 border border-surface-700 space-y-1">
            <span className="text-xs font-bold text-success-300 block">🛰️ ระบุพิกัดดาวเทียม (GNSS)</span>
            <p className="text-xs text-surface-200">GPS / GLONASS / BeiDou / Galileo ความไวสูง</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-800/80 border border-surface-700 space-y-1">
            <span className="text-xs font-bold text-warning-300 block">🔋 แบตเตอรี่ & PMU</span>
            <p className="text-xs text-surface-200">Li-Po 3.7V 1,000 mAh พร้อมระบบชาร์จ Type-C และ PMU จัดการพลังงาน</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-800/80 border border-surface-700 space-y-1">
            <span className="text-xs font-bold text-danger-300 block">💡 ไฟสถานะ (RGB LED)</span>
            <p className="text-xs text-surface-200">WS2812B Addressable LED แจ้งสถานะเชื่อมต่อและไฟนำทางกลางคืน</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-800/80 border border-surface-700 space-y-1">
            <span className="text-xs font-bold text-surface-300 block">🛡️ กล่องป้องกัน (Enclosure)</span>
            <p className="text-xs text-surface-200">กล่องโปรเจกต์กันน้ำมาตรฐาน IP67 ปลอดภัยต่อสรีระสุนัข</p>
          </div>
        </div>
      </Card>

      {/* Registered Devices Directory */}
      <div className="space-y-4">
        <h3 className="section-heading flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          <span>{t('hardware.myDevices')} ({devices.length} เครื่อง)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((dev) => (
            <Card key={dev.id} className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-base text-surface-900 leading-tight">
                    {dev.model}
                  </h4>
                  <p className="text-xs text-surface-500 font-mono mt-0.5">
                    SN: {dev.serialNumber}
                  </p>
                </div>
                <Badge variant={dev.isOnline ? 'success' : 'surface'} dot>
                  {dev.isOnline ? 'ONLINE' : 'OFFLINE'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-surface-600 bg-surface-50 p-3 rounded-xl border border-surface-100">
                <div>
                  <span className="text-surface-400 block text-[11px]">MAC Address</span>
                  <span className="font-mono font-bold text-surface-800">{dev.macAddress}</span>
                </div>
                <div>
                  <span className="text-surface-400 block text-[11px]">Firmware</span>
                  <span className="font-mono font-bold text-surface-800">{dev.firmwareVersion}</span>
                </div>
                <div className="mt-2">
                  <span className="text-surface-400 block text-[11px]">แบตเตอรี่</span>
                  <span className="font-bold text-surface-800">{dev.batteryLevel}%</span>
                </div>
                <div className="mt-2">
                  <span className="text-surface-400 block text-[11px]">เครือข่าย</span>
                  <span className="font-bold text-surface-800">{dev.networkType}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-surface-400 pt-1">
                <span>อัปเดตล่าสุด: {formatDate(dev.lastSeenAt, locale)}</span>
                <span className="text-success font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> GPS Fix
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Pair New Device Modal */}
      {showPairModal && (
        <Dialog
          isOpen={showPairModal}
          onClose={() => setShowPairModal(false)}
          title={t('hardware.pairNew')}
          size="md"
        >
          <div className="space-y-4 pt-2 text-left">
            <div className="p-3.5 rounded-xl bg-primary-50 border border-primary-100 text-xs text-primary-800 space-y-1">
              <p className="font-bold">{t('hardware.pairStep1')}</p>
              <p>{t('hardware.pairStep2')}</p>
              <p>{t('hardware.pairStep3')}</p>
            </div>

            <Input
              label="MAC Address / Device ID *"
              placeholder="เช่น C4:DE:E2:88:42:0A"
              value={macInput}
              onChange={(e) => setMacInput(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPairModal(false)}>
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handlePairDevice}
                isLoading={isPairing}
              >
                จับคู่อุปกรณ์
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
