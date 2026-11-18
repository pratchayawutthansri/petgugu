'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePets } from '@/hooks/use-pets';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { PetCardSkeleton } from '@/components/ui/skeleton';
import { EditPetDialog } from '@/components/pets/edit-pet-dialog';
import type { Pet } from '@/types';
import {
  AlertTriangle,
  ArrowRight,
  Battery,
  Camera,
  Compass,
  Edit3,
  MapPin,
  PawPrint,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Wifi,
} from 'lucide-react';
import { formatTimeAgo, cn } from '@/lib/utils';

type StatusFilter = 'all' | 'online' | 'attention';

export default function MyPetsPage() {
  const { pets, isLoading, updatePet } = usePets();
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const filteredPets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return pets.filter((pet) => {
      const battery = pet.device?.batteryLevel ?? pet.latestLocation?.batteryLevel ?? 80;
      const isOnline = pet.device?.isOnline ?? true;
      const matchesQuery =
        !normalizedQuery ||
        pet.name.toLowerCase().includes(normalizedQuery) ||
        pet.breed.toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'online' && isOnline) ||
        (statusFilter === 'attention' && (!isOnline || battery <= 30 || pet.isLost));
      return matchesQuery && matchesStatus;
    });
  }, [pets, query, statusFilter]);

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      {/* ================= PAGE HEADER ================= */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary-600">
            ระบบดูแลและติดตามสัตว์เลี้ยง
          </p>
          <h1 className="page-title text-2xl sm:text-3xl font-extrabold text-surface-950">
            {t('pets.title')}
          </h1>
          <p className="page-subtitle max-w-2xl text-sm text-surface-600 mt-1">
            {t('pets.subtitle')}
          </p>
        </div>

        <Link href="/pets/new" className="hidden sm:block">
          <Button variant="primary" size="md" leftIcon={<Plus className="h-5 w-5" />} className="shadow-subtle">
            {t('pets.addPet')}
          </Button>
        </Link>
      </section>

      {/* ================= SEARCH & STATUS FILTER ================= */}
      <section className="flex flex-col gap-3 sm:flex-row" aria-label="Pet filters">
        <label className="relative flex-1">
          <span className="sr-only">ค้นหาสัตว์เลี้ยง</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาจากชื่อน้องหมา หรือสายพันธุ์..."
            className="min-h-[48px] w-full rounded-2xl border border-surface-200 bg-white py-3 pl-12 pr-4 text-sm text-surface-900 shadow-subtle outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
          />
        </label>

        <label className="relative sm:w-52">
          <span className="sr-only">กรองสถานะ</span>
          <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="min-h-[48px] w-full appearance-none rounded-2xl border border-surface-200 bg-white py-3 pl-11 pr-10 text-sm font-semibold text-surface-700 shadow-subtle outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
          >
            <option value="all">แสดงทั้งหมด ({pets.length})</option>
            <option value="online">เฉพาะออนไลน์</option>
            <option value="attention">ต้องตรวจสอบ / แบตเตอรี่ต่ำ</option>
          </select>
        </label>
      </section>

      {/* ================= SKELETON LOADING ================= */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <PetCardSkeleton />
          <PetCardSkeleton />
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}
      {!isLoading && pets.length === 0 && (
        <EmptyState
          title={t('pets.emptyTitle')}
          description={t('pets.emptyDesc')}
          actionLabel={t('pets.addPet')}
          onAction={() => window.location.assign('/pets/new')}
        />
      )}

      {/* ================= NO SEARCH RESULTS ================= */}
      {!isLoading && pets.length > 0 && filteredPets.length === 0 && (
        <Card className="p-8 text-center rounded-3xl">
          <Search className="mx-auto h-8 w-8 text-surface-300" />
          <h2 className="mt-3 font-bold text-surface-900">ไม่พบสัตว์เลี้ยงที่ตรงกับตัวกรอง</h2>
          <p className="mt-1 text-sm text-surface-500">ลองเปลี่ยนคำค้นหาหรือเลือกสถานะอื่น</p>
        </Card>
      )}

      {/* ================= REDESIGNED CUSTOMER-FRIENDLY PET CARDS ================= */}
      {!isLoading && filteredPets.length > 0 && (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2" aria-live="polite">
          {filteredPets.map((pet) => {
            const isOnline = pet.device?.isOnline ?? true;
            const battery = pet.device?.batteryLevel ?? pet.latestLocation?.batteryLevel ?? 80;
            const activeSafeZone = (pet.safeZones || []).find((z) => z.isActive);
            const activeZone = activeSafeZone
              ? `${activeSafeZone.name} (${activeSafeZone.radius.toLocaleString()} ม.)`
              : 'ยังไม่กำหนดพื้นที่ปลอดภัย';
            const isLowBattery = battery <= 30;

            return (
              <Card
                key={pet.id}
                className={cn(
                  'group rounded-3xl border bg-white p-5 sm:p-6 shadow-subtle transition-all duration-200 hover:shadow-card-hover flex flex-col justify-between gap-5',
                  pet.isLost
                    ? 'border-rose-200 ring-2 ring-rose-100/60'
                    : isLowBattery
                    ? 'border-amber-200'
                    : 'border-surface-200/90 hover:border-surface-300'
                )}
              >
                {/* 1. TOP ROW: PET PORTRAIT + BASIC INFO + SINGLE EDIT BUTTON */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Rounded Pet Portrait with quick camera button */}
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-2xl overflow-hidden border border-surface-200 shadow-sm bg-surface-100 group-hover:scale-[1.02] transition-transform">
                      {pet.primaryPhotoUrl ? (
                        <img
                          src={pet.primaryPhotoUrl}
                          alt={`รูปโปรไฟล์ของ ${pet.name}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-surface-400">
                          <PawPrint className="w-8 h-8 opacity-40 text-primary-400" />
                          <span className="text-[10px] font-bold mt-1">ไม่มีรูป</span>
                        </div>
                      )}

                      {/* Photo change overlay icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingPet(pet);
                        }}
                        className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-surface-950/80 hover:bg-primary-600 text-white shadow-sm transition active:scale-95"
                        title="เปลี่ยนรูปถ่าย"
                        aria-label={`เปลี่ยนรูปภาพของ ${pet.name}`}
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-300" />
                      </button>
                    </div>

                    {/* Pet Details */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/pet/${pet.id}`} className="hover:text-primary-700 transition-colors">
                          <h2 className="text-xl sm:text-2xl font-extrabold text-surface-950 tracking-tight leading-snug truncate">
                            {pet.name}
                          </h2>
                        </Link>
                        {pet.isLost ? (
                          <Badge variant="danger" dot size="sm">
                            โหมดค้นหา SOS
                          </Badge>
                        ) : isOnline ? (
                          <Badge variant="success" dot size="sm">
                            กำลังติดตาม
                          </Badge>
                        ) : (
                          <Badge variant="surface" dot size="sm">
                            ออฟไลน์
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-surface-500 mt-0.5 truncate">
                        {pet.breed}
                        {pet.gender &&
                          ` • ${pet.gender === 'MALE' ? 'เพศผู้' : pet.gender === 'FEMALE' ? 'เพศเมีย' : 'ไม่ระบุเพศ'}`}
                        {pet.age !== undefined && ` • ${pet.age} ปี`}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-xs text-surface-600">
                        <span className="inline-flex items-center gap-1 font-semibold text-surface-700">
                          <MapPin className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                          <span className="truncate">{activeZone}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Single Clean Edit Button */}
                  <button
                    type="button"
                    onClick={() => setEditingPet(pet)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-primary-50 text-surface-700 hover:text-primary-800 text-xs font-bold transition shadow-xs flex-shrink-0 active:scale-95"
                    title="แก้ไขข้อมูลและรูปภาพ"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-primary-600" />
                    <span>แก้ไข</span>
                  </button>
                </div>

                {/* 2. MIDDLE ROW: 3 KEY TELEMETRY CARDS (CUSTOMER FRIENDLY) */}
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Battery */}
                  <div className="p-3 rounded-2xl bg-surface-50 border border-surface-100 flex flex-col justify-between">
                    <span className="text-[11px] font-semibold text-surface-400 block flex items-center gap-1">
                      <Battery className={cn('w-3.5 h-3.5', battery > 30 ? 'text-emerald-500' : 'text-amber-500')} />
                      แบตเตอรี่
                    </span>
                    <span className="text-sm font-bold text-surface-900 mt-1 block">
                      {battery}%
                    </span>
                    <span className="text-[10px] text-surface-500 font-medium">
                      {battery > 30 ? 'ใช้ได้อีก ~4 วัน' : 'ควรนำไปชาร์จ'}
                    </span>
                  </div>

                  {/* Connectivity */}
                  <div className="p-3 rounded-2xl bg-surface-50 border border-surface-100 flex flex-col justify-between">
                    <span className="text-[11px] font-semibold text-surface-400 block flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5 text-sky-500" />
                      สัญญาณ
                    </span>
                    <span className="text-sm font-bold text-surface-900 mt-1 block truncate">
                      {isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
                    </span>
                    <span className="text-[10px] text-surface-500 font-medium truncate">
                      {isOnline ? 'เชื่อมต่อตลอดเวลา' : 'ปิดเครื่อง'}
                    </span>
                  </div>

                  {/* GPS Fix */}
                  <div className="p-3 rounded-2xl bg-surface-50 border border-surface-100 flex flex-col justify-between">
                    <span className="text-[11px] font-semibold text-surface-400 block flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-indigo-500" />
                      ดาวเทียม
                    </span>
                    <span className="text-sm font-bold text-surface-900 mt-1 block truncate">
                      {isOnline ? 'แม่นยำสูง' : 'พักค้นหา'}
                    </span>
                    <span className="text-[10px] text-surface-500 font-medium truncate">
                      {isOnline ? 'พิกัดระดับเมตร' : 'ไม่มีสัญญาณ'}
                    </span>
                  </div>
                </div>

                {/* 3. SAFETY / STATUS ALERT BANNER */}
                {pet.isLost ? (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900 leading-relaxed animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">โหมดฉุกเฉินตามหา: </span>
                      <span>ปลอกคอกำลังส่งพิกัดดาวเทียมทุก 10 วินาทีเพื่อช่วยให้คุณตามหาน้องหมาได้เร็วที่สุด</span>
                    </div>
                  </div>
                ) : isLowBattery ? (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
                    <Battery className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">แบตเตอรี่เหลือน้อย ({battery}%): </span>
                      <span>แนะนำให้นำปลอกคอของ {pet.name} มาเสียบชาร์จด้วยสาย USB Type-C</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-900 leading-relaxed">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold">ปลอดภัย: </span>
                      <span>{pet.name} อยู่ในรั้วเขตปลอดภัย ({activeZone})</span>
                    </div>
                  </div>
                )}

                {/* 4. FOOTER: LAST UPDATED + DIRECT MAP & PROFILE ACTIONS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-surface-100 text-xs text-surface-500">
                  <p>อัปเดตล่าสุด: {formatTimeAgo(pet.updatedAt, locale)}</p>

                  <div className="flex items-center gap-2">
                    {/* View on Map Button */}
                    <Link
                      href={`/dashboard?pet=${encodeURIComponent(pet.id)}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-surface-800 font-bold text-xs transition active:scale-95"
                    >
                      <MapPin className="w-3.5 h-3.5 text-primary-600" />
                      <span>ดูบนแผนที่</span>
                    </Link>

                    {/* View Details Profile Link */}
                    <Link
                      href={`/pet/${pet.id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-surface-900 hover:bg-surface-800 text-white font-bold text-xs transition active:scale-95 shadow-xs"
                    >
                      <span>ดูรายละเอียด</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>
      )}

      {/* Floating Add Button for Mobile */}
      <Link
        href="/pets/new"
        className="fixed bottom-24 right-5 z-dropdown inline-flex h-14 items-center gap-2 rounded-full bg-primary-600 px-5 font-bold text-white shadow-modal sm:hidden"
        aria-label={t('pets.addPet')}
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
        {t('pets.addPet')}
      </Link>

      {/* Edit Dialog for Pet Photos and Information */}
      <EditPetDialog
        isOpen={Boolean(editingPet)}
        onClose={() => setEditingPet(null)}
        pet={editingPet}
        onSave={updatePet}
      />
    </div>
  );
}
