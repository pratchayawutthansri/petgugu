'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePets } from '@/hooks/use-pets';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/contexts/toast-context';
import { TrackingMap } from '@/components/map/dynamic-tracking-map';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import {
  AlertTriangle,
  ArrowRight,
  Battery,
  BellRing,
  LocateFixed,
  MapPinned,
  PawPrint,
  Plus,
  Radio,
  ShieldCheck,
  Signal,
  Wifi,
  Zap,
} from 'lucide-react';
import { formatTimeAgo, getSignalInfo } from '@/lib/utils';
import { DEMO_ALERTS } from '@/data/demo-alerts';

export default function DashboardPage() {
  const { pets, isLoading, updatePet } = usePets();
  const { t, locale } = useLanguage();
  const { showToast } = useToast();
  const [selectedPetId, setSelectedPetId] = useState('pet_mochi_01');
  const [sosPetId, setSosPetId] = useState<string | null>(null);

  useEffect(() => {
    if (pets.length > 0 && !pets.some((pet) => pet.id === selectedPetId)) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);

  const activePet = pets.find((pet) => pet.id === selectedPetId) || pets[0];
  const summary = useMemo(() => {
    const online = pets.filter((pet) => pet.device?.isOnline ?? true).length;
    const safe = pets.filter((pet) => (pet.safeZones?.length || 0) > 0 && !pet.isLost).length;
    const attention = pets.filter((pet) => {
      const battery = pet.device?.batteryLevel ?? pet.latestLocation?.batteryLevel ?? 80;
      return !(pet.device?.isOnline ?? true) || battery <= 30 || pet.isLost;
    }).length;
    return { online, safe, attention };
  }, [pets]);

  const handleTogglePowerSave = async () => {
    if (!activePet) return;
    await updatePet(activePet.id, { batterySaver: !activePet.batterySaver });
    showToast({
      type: 'info',
      message: activePet.batterySaver
        ? 'กลับสู่การติดตามทุก 10 วินาทีแล้ว'
        : 'เปิดโหมดประหยัดพลังงานและปรับรอบส่งพิกัดแล้ว',
    });
  };

  const handleConfirmSos = async () => {
    if (!sosPetId) return;
    const targetPet = pets.find((pet) => pet.id === sosPetId);
    await updatePet(sosPetId, { isLost: true });
    setSosPetId(null);
    showToast({
      type: 'error',
      title: 'ส่งสัญญาณ SOS แล้ว',
      message: `ระบบเปิดสถานะฉุกเฉินสำหรับ ${targetPet?.name || 'สัตว์เลี้ยง'} และบันทึกพิกัดล่าสุดแล้ว`,
      duration: 6000,
    });
  };

  const activeBattery = activePet?.device?.batteryLevel ?? activePet?.latestLocation?.batteryLevel ?? 0;
  const activeSignal = getSignalInfo(activePet?.device?.signalStrength ?? 0);
  const activeOnline = activePet?.device?.isOnline ?? false;

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-secondary-700">
            <Radio className="h-4 w-4" aria-hidden="true" />
            ระบบติดตามภาคสนาม · Live
          </div>
          <h1 className="page-title">{t('dashboard.title')}</h1>
          <p className="page-subtitle max-w-2xl">ดูตำแหน่ง ความปลอดภัย และสถานะปลอกคอของน้องทุกตัวจากหน้าจอเดียว</p>
        </div>
        <Link href="/pets/new">
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            {t('pets.addPet')}
          </Button>
        </Link>
      </section>

      <section className="scrollbar-hide -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0" aria-label="Tracking summary">
        {[
          { label: 'ออนไลน์', value: summary.online, note: `จาก ${pets.length} ตัว`, icon: Signal, tone: 'success' },
          { label: 'สัตว์เลี้ยง', value: pets.length, note: 'โปรไฟล์ทั้งหมด', icon: PawPrint, tone: 'primary' },
          { label: 'ปลอดภัย', value: summary.safe, note: 'อยู่ใน Safe Zone', icon: ShieldCheck, tone: 'success' },
          { label: 'ต้องตรวจสอบ', value: summary.attention, note: summary.attention ? 'มีสถานะผิดปกติ' : 'ไม่มีการแจ้งเตือน', icon: BellRing, tone: summary.attention ? 'warning' : 'secondary' },
        ].map((item) => {
          const Icon = item.icon;
          const toneClasses =
            item.tone === 'success'
              ? 'bg-success-50 text-success-700 border-success-100'
              : item.tone === 'warning'
              ? 'bg-warning-50 text-warning-700 border-warning-100'
              : item.tone === 'secondary'
              ? 'bg-secondary-50 text-secondary-700 border-secondary-100'
              : 'bg-primary-50 text-primary-700 border-primary-100';
          return (
            <Card key={item.label} className="min-w-[185px] snap-start rounded-xl border-surface-200 p-4 shadow-subtle sm:min-w-0">
              <div className="flex items-center gap-3">
                <span className={`rounded-lg border p-3 ${toneClasses}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-surface-500">{item.label}</p>
                  <p className="text-2xl font-extrabold text-surface-950">{item.value}</p>
                  <p className="text-xs text-surface-400">{item.note}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="relative overflow-hidden rounded-2xl border-primary-100 bg-primary-950 p-2 shadow-card">
          <div className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-primary-950/95 px-3 py-2 text-xs font-bold text-white shadow-dropdown backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-success-400 ring-2 ring-success-400/20" />
            LIVE · อัปเดต 10 วินาที
          </div>
          <TrackingMap
            pets={pets}
            selectedPetId={selectedPetId}
            onSelectPet={setSelectedPetId}
            className="h-[52vh] min-h-[440px] w-full rounded-xl sm:h-[600px]"
          />
          <div className="absolute bottom-5 left-5 right-5 z-20 hidden items-center justify-between rounded-lg border border-surface-200 bg-surface-50/95 p-3 shadow-dropdown backdrop-blur-sm sm:flex">
            <div className="flex items-center gap-4 text-xs font-semibold text-surface-700">
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary-600" /> ตำแหน่งสัตว์เลี้ยง</span>
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full border-2 border-success-500 bg-success-100" /> Safe Zone</span>
            </div>
            <span className="text-xs text-surface-400">Leaflet · OpenStreetMap</span>
          </div>
        </Card>

        <aside className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-surface-500">Pet control</h2>
            <Badge variant="surface">{pets.length} pets</Badge>
          </div>

          <div className="scrollbar-hide flex snap-x gap-3 overflow-x-auto pb-2 xl:block xl:space-y-3 xl:overflow-visible">
            {pets.map((pet) => {
              const isSelected = pet.id === activePet?.id;
              const isOnline = pet.device?.isOnline ?? true;
              const battery = pet.device?.batteryLevel ?? pet.latestLocation?.batteryLevel ?? 0;
              return (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => setSelectedPetId(pet.id)}
                  className={`min-w-[280px] snap-start rounded-xl border bg-white p-4 text-left shadow-subtle transition-colors xl:w-full ${
                    isSelected ? 'border-primary-700 bg-primary-50 ring-1 ring-primary-200' : 'border-surface-200 hover:border-primary-300'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center gap-3">
                    <img src={pet.primaryPhotoUrl} alt={pet.name} className="h-14 w-14 rounded-xl object-cover ring-1 ring-surface-200" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-extrabold text-surface-950">{pet.name}</p>
                        <Badge variant={pet.isLost ? 'danger' : isOnline ? 'success' : 'surface'} size="sm" dot>
                          {pet.isLost ? 'SOS' : isOnline ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-surface-500">{pet.breed}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs font-semibold text-surface-600">
                        <span className="inline-flex items-center gap-1"><Battery className="h-3.5 w-3.5" /> {battery}%</span>
                        <span className="inline-flex items-center gap-1"><Wifi className="h-3.5 w-3.5" /> {isOnline ? pet.device?.networkType : 'No signal'}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {activePet && (
            <Card className="overflow-hidden rounded-2xl border-primary-100 p-0">
              <div className="border-b border-primary-800 bg-primary-950 px-5 py-4 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-200">Selected pet</p>
                  <h2 className="mt-1 text-xl font-extrabold text-white">{activePet.name}</h2>
                </div>
                <Badge variant={activePet.isLost ? 'danger' : activeOnline ? 'success' : 'surface'} dot>
                  {activePet.isLost ? 'SOS active' : activeOnline ? 'Connected' : 'Offline'}
                </Badge>
              </div>
              </div>

              <div className="p-5">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-surface-200 bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Battery</p>
                  <p className="mt-1 flex items-center gap-2 font-extrabold text-surface-900"><Battery className="h-4 w-4 text-success-600" /> {activeBattery}%</p>
                </div>
                <div className="rounded-xl border border-surface-200 bg-surface-50 p-3">
                  <p className="text-xs text-surface-500">Signal</p>
                  <p className="mt-1 flex items-center gap-2 font-extrabold text-surface-900"><Wifi className="h-4 w-4 text-secondary-600" /> {activeSignal.label.split(' ')[0]}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTogglePowerSave}
                className="mt-3 flex min-h-[48px] w-full items-center justify-between rounded-xl border border-surface-200 px-4 text-sm font-semibold text-surface-700 hover:bg-surface-50"
              >
                <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-primary-600" /> Power Saver</span>
                <span className={`h-6 w-11 rounded-full p-0.5 transition ${activePet.batterySaver ? 'bg-secondary-600' : 'bg-surface-300'}`}>
                  <span className={`block h-5 w-5 rounded-full bg-white shadow transition ${activePet.batterySaver ? 'translate-x-5' : ''}`} />
                </span>
              </button>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => showToast({ type: 'info', message: `กำลังเลื่อนแผนที่ไปยัง ${activePet.name}` })} leftIcon={<LocateFixed className="h-4 w-4" />}>
                  Locate
                </Button>
                <Link href={`/pet/${activePet.id}`} className="block">
                  <Button variant="outline" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Profile
                  </Button>
                </Link>
              </div>

              <Button
                variant="danger"
                className="mt-2 w-full"
                onClick={() => setSosPetId(activePet.id)}
                leftIcon={<AlertTriangle className="h-4 w-4" />}
              >
                {t('dashboard.sos')}
              </Button>
              </div>
            </Card>
          )}
        </aside>
      </section>

      <Card className="flex flex-col gap-3 rounded-xl border-danger-200 bg-danger-50 p-4 shadow-subtle sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-white p-2 text-danger-600 shadow-subtle"><BellRing className="h-5 w-5" /></span>
          <div>
            <p className="font-bold text-danger-900">{DEMO_ALERTS[1]?.title || 'การแจ้งเตือนล่าสุด'}</p>
            <p className="text-sm text-danger-700">{DEMO_ALERTS[1]?.message}</p>
          </div>
        </div>
        <Link href="/history" className="inline-flex min-h-[44px] items-center gap-1 rounded-xl px-3 text-sm font-bold text-danger-700 hover:bg-white">
          ดูเหตุการณ์ <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>

      <ConfirmDialog
        isOpen={!!sosPetId}
        onClose={() => setSosPetId(null)}
        onConfirm={handleConfirmSos}
        title={t('dashboard.sosConfirmTitle')}
        description={t('dashboard.sosConfirmDesc')}
        confirmLabel="ส่งสัญญาณ SOS ทันที"
        cancelLabel="ยกเลิก"
        variant="danger"
      />
    </div>
  );
}
