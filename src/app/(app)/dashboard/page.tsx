'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePets } from '@/hooks/use-pets';
import { useToast } from '@/contexts/toast-context';
import { TrackingMap } from '@/components/map/dynamic-tracking-map';
import { ConfirmDialog } from '@/components/ui/dialog';
import {
  AlertTriangle,
  ArrowRight,
  Battery,
  Bell,
  CheckCircle2,
  LocateFixed,
  MapPin,
  Plus,
  Signal,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { pets, isLoading, updatePet } = usePets();
  const { showToast } = useToast();
  const [selectedPetId, setSelectedPetId] = useState('pet_mochi_01');
  const [sosPetId, setSosPetId] = useState<string | null>(null);

  useEffect(() => {
    if (pets.length > 0 && !pets.some((pet) => pet.id === selectedPetId)) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);

  const activePet = pets.find((pet) => pet.id === selectedPetId) || pets[0];

  const handleTogglePowerSave = async () => {
    if (!activePet) return;
    const nextState = !activePet.batterySaver;
    await updatePet(activePet.id, { batterySaver: nextState });
    showToast({
      type: 'info',
      title: nextState ? 'เปิดโหมดประหยัดพลังงาน' : 'กลับสู่โหมดปกติ',
      message: nextState
        ? 'ปรับรอบการส่งพิกัดเพื่อประหยัดแบตเตอรี่'
        : 'อัปเดตตำแหน่งสดทุก 10 วินาที',
    });
  };

  const handleRingBuzzer = () => {
    if (!activePet) return;
    showToast({
      type: 'info',
      title: `ส่งเสียงเรียกปลอกคอ ${activePet.name}`,
      message: 'ปลอกคอกำลังส่งเสียงบี๊บเพื่อช่วยให้คุณหาน้องเจอได้ง่ายขึ้น',
    });
  };

  const handleFocusLocation = () => {
    if (!activePet) return;
    showToast({
      type: 'info',
      title: 'โฟกัสตำแหน่ง',
      message: `เลื่อนแผนที่ไปยังตำแหน่งล่าสุดของ ${activePet.name}`,
    });
  };

  const handleToggleSos = async () => {
    if (!activePet) return;
    if (activePet.isLost) {
      // Turn off emergency mode
      await updatePet(activePet.id, { isLost: false });
      showToast({
        type: 'success',
        title: 'ยกเลิกโหมดฉุกเฉินแล้ว',
        message: `${activePet.name} กลับสู่สถานะปกติเรียบร้อยแล้ว`,
      });
    } else {
      // Open confirm dialog
      setSosPetId(activePet.id);
    }
  };

  const handleConfirmSos = async () => {
    if (!sosPetId) return;
    const targetPet = pets.find((pet) => pet.id === sosPetId);
    await updatePet(sosPetId, { isLost: true });
    setSosPetId(null);
    showToast({
      type: 'error',
      title: 'เปิดโหมดสัตว์เลี้ยงหาย (SOS) แล้ว',
      message: `ระบบเพิ่มความถี่การส่งพิกัดของ ${targetPet?.name || 'สัตว์เลี้ยง'} เป็นแบบความแม่นยำสูงทันที`,
      duration: 6000,
    });
  };

  const activeBattery = activePet?.device?.batteryLevel ?? activePet?.latestLocation?.batteryLevel ?? 80;
  const activeOnline = activePet?.device?.isOnline ?? true;

  return (
    <div className="space-y-4 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* ================= COMPACT HEADER ================= */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-neutral-200/80 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            ติดตามสัตว์เลี้ยง
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            ดูตำแหน่งสดและสถานะปลอกคอแบบเรียลไทม์
          </p>
        </div>

        <div>
          <Link href="/pets/new">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181a20] hover:bg-neutral-800 text-white font-medium text-xs shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มสัตว์เลี้ยง</span>
            </button>
          </Link>
        </div>
      </section>

      {/* ================= MAIN 2-COLUMN DISPLAY ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ================= LEFT: EXPANSIVE LIVE MAP ================= */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden relative flex flex-col min-h-[520px] lg:min-h-[620px]">
          {/* Top Floating Map Badge */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-xs text-xs font-semibold text-neutral-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>กำลังติดตามสด</span>
            </div>
          </div>

          {/* Leaflet Live Map */}
          <div className="w-full h-full flex-1 relative">
            <TrackingMap
              pets={pets}
              selectedPetId={selectedPetId}
              onSelectPet={setSelectedPetId}
              className="h-full min-h-[520px] lg:min-h-[620px] w-full"
            />
          </div>

          {/* Bottom Floating Map Card */}
          <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/90 p-3.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                <span className="font-semibold text-neutral-800 truncate">
                  {activePet?.latestLocation?.address || 'เลขที่ 88/1 ถนนสุขุมวิท 21, วัฒนา กรุงเทพฯ'}
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 flex-shrink-0 font-medium">
                อัปเดตเมื่อสักครู่
              </span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: SINGLE UNIFIED PET CARD ================= */}
        <aside className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl border border-neutral-200/80 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[520px] lg:min-h-[620px]">
          {/* 1. PET SWITCHER TABS */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              เลือกสัตว์เลี้ยง
            </p>
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100/80 rounded-2xl">
              {pets.map((pet) => {
                const isSelected = pet.id === activePet?.id;
                return (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => setSelectedPetId(pet.id)}
                    className={cn(
                      'py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all',
                      isSelected
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    )}
                  >
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        pet.isLost
                          ? 'bg-red-500'
                          : pet.device?.isOnline ?? true
                          ? 'bg-emerald-500'
                          : 'bg-neutral-300'
                      )}
                    />
                    <span className="truncate">{pet.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. ACTIVE PET HERO & STATUS */}
          {activePet && (
            <div className="my-auto py-4 text-center">
              {/* Pet Photo */}
              <div className="relative inline-block mx-auto">
                <img
                  src={activePet.primaryPhotoUrl}
                  alt={activePet.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-neutral-100 shadow-xs mx-auto"
                />
                <span
                  className={cn(
                    'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
                    activePet.isLost
                      ? 'bg-red-500'
                      : activeOnline
                      ? 'bg-emerald-500'
                      : 'bg-neutral-300'
                  )}
                />
              </div>

              {/* Name & Breed */}
              <h2 className="text-2xl font-extrabold text-neutral-900 mt-2.5 tracking-tight">
                {activePet.name}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {activePet.breed}
              </p>

              {/* Main Status Chip */}
              <div className="mt-3 flex justify-center">
                {activePet.isLost ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    โหมดฉุกเฉิน (SOS)
                  </span>
                ) : (activePet.safeZones?.length || 0) > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    อยู่ในพื้นที่ปลอดภัย (บ้าน)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    สถานะปกติ
                  </span>
                )}
              </div>

              {/* 2 Clean Stat Boxes */}
              <div className="grid grid-cols-2 gap-3 mt-5 text-left">
                <div className="p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-200/70">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>แบตเตอรี่</span>
                    <Battery className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-lg font-extrabold text-neutral-900 mt-1">
                    {activeBattery}%
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-0.5 font-medium">
                    {activeBattery > 20 ? 'ใช้งานได้อีก 3 วัน' : 'ควรชาร์จไฟ'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-200/70">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>สัญญาณ</span>
                    <Signal className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-lg font-extrabold text-neutral-900 mt-1">
                    {activeOnline ? 'ปกติ' : 'ออฟไลน์'}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-0.5 font-medium">
                    {activeOnline ? 'เชื่อมต่อออนไลน์' : 'ไม่มีสัญญาณ'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. QUICK ACTION BUTTONS */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            {/* Call / Ring Collar Button */}
            <button
              type="button"
              onClick={handleRingBuzzer}
              className="w-full py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Bell className="w-4 h-4 text-neutral-700" />
              <span>ส่งเสียงเรียกปลอกคอ</span>
            </button>

            {/* Locate Button */}
            <button
              type="button"
              onClick={handleFocusLocation}
              className="w-full py-3 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <LocateFixed className="w-4 h-4 text-neutral-600" />
              <span>โฟกัสตำแหน่งบนแผนที่</span>
            </button>

            {/* Power Saver Toggle Row */}
            <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-neutral-50/60 border border-neutral-200/60">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-neutral-500" />
                <span className="text-xs font-semibold text-neutral-700">
                  โหมดประหยัดแบตเตอรี่
                </span>
              </div>
              <button
                type="button"
                onClick={handleTogglePowerSave}
                aria-label="Toggle Power Saver"
                className={cn(
                  'w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out',
                  activePet?.batterySaver ? 'bg-[#181a20]' : 'bg-neutral-300'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out',
                    activePet?.batterySaver ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>

            {/* SOS / Lost Pet Button */}
            <button
              type="button"
              onClick={handleToggleSos}
              className={cn(
                'w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.99]',
                activePet?.isLost
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              )}
            >
              {activePet?.isLost ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ปิดโหมดฉุกเฉิน (พบสัตว์เลี้ยงแล้ว)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>แจ้งสัตว์เลี้ยงหาย (SOS)</span>
                </>
              )}
            </button>

            {/* View History Link */}
            <div className="pt-2 text-center">
              <Link
                href="/history"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
              >
                <span>ดูประวัติการเดินทางย้อนหลัง</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* SOS Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!sosPetId}
        onClose={() => setSosPetId(null)}
        onConfirm={handleConfirmSos}
        title="ยืนยันการแจ้งสัตว์เลี้ยงหาย (SOS)"
        description={`คุณต้องการเปิดสถานะฉุกเฉินสำหรับ ${activePet?.name || 'สัตว์เลี้ยง'} หรือไม่? ระบบจะปรับความถี่การส่งสัญญาณ GPS สูงสุดเพื่อช่วยค้นหา`}
        confirmLabel="เปิดโหมด SOS ทันที"
        cancelLabel="ยกเลิก"
        variant="danger"
      />
    </div>
  );
}
