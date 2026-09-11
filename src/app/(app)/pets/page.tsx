'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePets } from '@/hooks/use-pets';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/ui/empty-state';
import { PetCardSkeleton } from '@/components/ui/skeleton';
import {
  AlertTriangle,
  ArrowRight,
  Battery,
  BellRing,
  ChevronRight,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Wifi,
} from 'lucide-react';
import { formatTimeAgo, getBatteryColor } from '@/lib/utils';

type StatusFilter = 'all' | 'online' | 'attention';

export default function MyPetsPage() {
  const { pets, isLoading, updatePet } = usePets();
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

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
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-primary-600">Pet care workspace</p>
          <h1 className="page-title">{t('pets.title')}</h1>
          <p className="page-subtitle max-w-2xl">{t('pets.subtitle')}</p>
        </div>
        <Link href="/pets/new" className="hidden sm:block">
          <Button variant="primary" size="lg" leftIcon={<Plus className="h-5 w-5" />}>
            {t('pets.addPet')}
          </Button>
        </Link>
      </section>

      <section className="flex flex-col gap-3 sm:flex-row" aria-label="Pet filters">
        <label className="relative flex-1">
          <span className="sr-only">ค้นหาสัตว์เลี้ยง</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาจากชื่อหรือสายพันธุ์"
            className="min-h-[48px] w-full rounded-2xl border border-surface-200 bg-white py-3 pl-12 pr-4 text-base text-surface-900 shadow-subtle outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
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
            <option value="all">ทุกสถานะ</option>
            <option value="online">ออนไลน์</option>
            <option value="attention">ต้องตรวจสอบ</option>
          </select>
        </label>
      </section>

      {isLoading && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <PetCardSkeleton />
          <PetCardSkeleton />
        </div>
      )}

      {!isLoading && pets.length === 0 && (
        <EmptyState
          title={t('pets.emptyTitle')}
          description={t('pets.emptyDesc')}
          actionLabel={t('pets.addPet')}
          onAction={() => window.location.assign('/pets/new')}
        />
      )}

      {!isLoading && pets.length > 0 && filteredPets.length === 0 && (
        <Card className="p-8 text-center">
          <Search className="mx-auto h-8 w-8 text-surface-300" />
          <h2 className="mt-3 font-bold text-surface-900">ไม่พบสัตว์เลี้ยงที่ตรงกับตัวกรอง</h2>
          <p className="mt-1 text-sm text-surface-500">ลองเปลี่ยนคำค้นหาหรือเลือกสถานะอื่น</p>
        </Card>
      )}

      {!isLoading && filteredPets.length > 0 && (
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2" aria-live="polite">
          {filteredPets.map((pet) => {
            const isOnline = pet.device?.isOnline ?? true;
            const battery = pet.device?.batteryLevel ?? pet.latestLocation?.batteryLevel ?? 80;
            const needsAttention = !isOnline || battery <= 30 || pet.isLost;
            const activeZone = pet.safeZones?.[0]?.name || 'ยังไม่ได้กำหนดพื้นที่';

            return (
              <Card
                key={pet.id}
                className={`group overflow-hidden rounded-3xl ${needsAttention ? 'border-danger-200' : 'border-surface-200'}`}
              >
                <div className="grid min-h-full grid-cols-1 sm:grid-cols-[190px_minmax(0,1fr)]">
                  <Link href={`/pet/${pet.id}`} className="relative block min-h-52 overflow-hidden sm:min-h-full">
                    <img
                      src={pet.primaryPhotoUrl}
                      alt={`รูปโปรไฟล์ของ ${pet.name}`}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-950/55 to-transparent sm:hidden" />
                  </Link>

                  <div className="flex min-w-0 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-2xl font-extrabold tracking-tight text-surface-950">{pet.name}</h2>
                        <p className="mt-0.5 truncate text-sm text-surface-500">{pet.breed}</p>
                      </div>
                      <Badge variant={pet.isLost ? 'danger' : isOnline ? 'success' : 'danger'} dot className="flex-shrink-0">
                        {pet.isLost ? 'SOS' : isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-surface-100 bg-surface-50 p-3">
                      <div className="flex items-center gap-2 border-r border-surface-200 pr-2">
                        <span className={`rounded-xl border p-2 ${getBatteryColor(battery)}`}>
                          <Battery className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-xs text-surface-500">แบตเตอรี่</p>
                          <p className="font-extrabold text-surface-900">{battery}%</p>
                        </div>
                      </div>
                      <div className="flex min-w-0 items-center gap-2 pl-1">
                        <span className="rounded-xl border border-secondary-100 bg-secondary-50 p-2 text-secondary-700">
                          <Wifi className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-surface-500">สัญญาณ</p>
                          <p className="truncate font-extrabold text-surface-900">
                            {isOnline ? pet.device?.networkType || 'NB-IoT' : 'ไม่มีสัญญาณ'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`mt-3 flex items-center gap-3 rounded-2xl border p-3 ${
                        needsAttention
                          ? 'border-warning-200 bg-warning-50 text-warning-900'
                          : 'border-success-100 bg-success-50 text-success-900'
                      }`}
                    >
                      {needsAttention ? (
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <ShieldCheck className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold">{needsAttention ? 'ต้องตรวจสอบสถานะ' : 'อยู่ในพื้นที่ปลอดภัย'}</p>
                        <p className="truncate text-xs opacity-75">{activeZone}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    </div>

                    <div className="mt-4 hidden grid-cols-2 gap-4 border-t border-surface-100 pt-3 sm:grid">
                      <Switch
                        label={t('pets.batterySaver')}
                        checked={pet.batterySaver}
                        onChange={() => updatePet(pet.id, { batterySaver: !pet.batterySaver })}
                        className="py-0"
                      />
                      <Switch
                        label={t('pets.proAlerts')}
                        checked={pet.proAlerts}
                        onChange={() => updatePet(pet.id, { proAlerts: !pet.proAlerts })}
                        className="py-0"
                      />
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-surface-100 pt-4 sm:mt-4">
                      <p className="text-xs text-surface-400">
                        {t('dashboard.lastUpdate')}: {formatTimeAgo(pet.updatedAt, locale)}
                      </p>
                      <Link
                        href={`/pet/${pet.id}`}
                        className="inline-flex min-h-[44px] items-center gap-1 rounded-xl px-3 text-sm font-bold text-primary-700 transition hover:bg-primary-50"
                      >
                        {t('pets.viewProfile')}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>
      )}

      <Card className="hidden rounded-3xl border-primary-100 bg-primary-50/70 p-5 sm:block">
        <div className="flex items-center gap-4">
          <span className="rounded-2xl bg-white p-3 text-primary-700 shadow-subtle">
            <BellRing className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-bold text-surface-900">ดูแลปลอกคอให้พร้อมติดตามอยู่เสมอ</h2>
            <p className="text-sm text-surface-600">ชาร์จแบตเตอรี่และตรวจสอบพื้นที่ปลอดภัยเป็นประจำ เพื่อให้การแจ้งเตือนทำงานต่อเนื่อง</p>
          </div>
        </div>
      </Card>

      <Link
        href="/pets/new"
        className="fixed bottom-24 right-5 z-dropdown inline-flex h-14 items-center gap-2 rounded-full bg-primary-600 px-5 font-bold text-white shadow-modal sm:hidden"
        aria-label={t('pets.addPet')}
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
        {t('pets.addPet')}
      </Link>
    </div>
  );
}
