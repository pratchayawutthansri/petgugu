'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePets } from '@/hooks/use-pets';
import { useLocations } from '@/hooks/use-locations';
import { useLanguage } from '@/contexts/language-context';
import { HistoryMap } from '@/components/map/dynamic-history-map';
import { Card } from '@/components/ui/card';
import {
  AlertTriangle,
  Battery,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Clock3,
  Footprints,
  Gauge,
  Lightbulb,
  MapPin,
  Navigation,
  PawPrint,
  Route,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { LocationHistory } from '@/types';

function getEventPresentation(event: LocationHistory) {
  if (event.eventType === 'LEFT_ZONE') {
    return { label: 'ออกจากพื้นที่ปลอดภัย', tone: 'danger', Icon: AlertTriangle };
  }
  if (event.eventType === 'ENTERED_ZONE') {
    return { label: 'กลับเข้าสู่พื้นที่ปลอดภัย', tone: 'success', Icon: ShieldCheck };
  }
  if (event.eventType === 'STOPPED' || event.eventType === 'AT_REST') {
    return { label: 'หยุดพัก', tone: 'secondary', Icon: Clock3 };
  }
  return { label: event.note || 'กำลังเคลื่อนไหว', tone: 'primary', Icon: Footprints };
}

export default function HistoryPage() {
  const { pets } = usePets();
  const { t, locale } = useLanguage();
  const [selectedPetId, setSelectedPetId] = useState('pet_mochi_01');
  const [selectedDate, setSelectedDate] = useState('2026-08-25');
  const [sheetOpen, setSheetOpen] = useState(false);
  const { locations, statistics, isLoading } = useLocations(selectedPetId);

  useEffect(() => {
    if (pets.length > 0 && !pets.some((pet) => pet.id === selectedPetId)) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) || pets[0];
  const events = useMemo(() => {
    const special = locations.filter((location) =>
      ['LEFT_ZONE', 'ENTERED_ZONE', 'STOPPED', 'AT_REST', 'LOW_BATTERY', 'SOS_TRIGGERED'].includes(location.eventType)
    );
    const source = special.length >= 2 ? special : locations.filter((_, index) => index % Math.max(1, Math.floor(locations.length / 6)) === 0);
    return source.slice(0, 8);
  }, [locations]);

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString(locale === 'th' ? 'th-TH' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary-600">
            <Route className="h-4 w-4" aria-hidden="true" />
            GPS route playback
          </p>
          <h1 className="page-title">{t('history.title')}</h1>
          <p className="page-subtitle">ดูเส้นทางจริงจาก Leaflet พร้อมเหตุการณ์สำคัญตามลำดับเวลา</p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:w-[620px]">
          <label className="relative">
            <span className="sr-only">{t('history.selectPet')}</span>
            {selectedPet ? (
              <img src={selectedPet.primaryPhotoUrl} alt="" className="pointer-events-none absolute left-3 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-xl object-cover" />
            ) : (
              <PawPrint className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500" />
            )}
            <select
              value={selectedPetId}
              onChange={(event) => setSelectedPetId(event.target.value)}
              className="min-h-[48px] w-full appearance-none rounded-2xl border border-surface-200 bg-white py-3 pl-14 pr-10 text-sm font-bold text-surface-800 shadow-subtle outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
            >
              {pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          </label>
          <label className="relative">
            <span className="sr-only">{t('history.selectDate')}</span>
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="min-h-[48px] w-full rounded-2xl border border-surface-200 bg-white py-3 pl-11 pr-4 text-sm font-bold text-surface-800 shadow-subtle outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
            />
          </label>
        </div>
      </section>

      <section className="relative min-h-[680px] overflow-hidden rounded-3xl border border-surface-200 bg-surface-100 shadow-card lg:h-[calc(100dvh-190px)] lg:min-h-[720px]" aria-busy={isLoading}>
        <HistoryMap locations={locations} safeZones={selectedPet?.safeZones} className="absolute inset-0 h-full w-full rounded-none border-0 shadow-none" />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-surface-950/10 to-transparent" />

        <div className="absolute left-3 top-3 z-20 flex max-w-[calc(100%-24px)] gap-2 lg:hidden">
          <span className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/70 bg-white/95 px-3 text-sm font-bold text-surface-800 shadow-dropdown backdrop-blur-md">
            <img src={selectedPet?.primaryPhotoUrl} alt="" className="h-7 w-7 rounded-lg object-cover" />
            <span className="max-w-28 truncate">{selectedPet?.name}</span>
          </span>
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/95 text-surface-700 shadow-dropdown" aria-label="ตัวกรองเส้นทาง">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        <Card className="absolute bottom-[210px] left-4 z-20 hidden w-48 rounded-2xl bg-white/95 p-3 shadow-dropdown backdrop-blur-md lg:block">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-surface-400">Map legend</p>
          <div className="space-y-2 text-xs font-semibold text-surface-700">
            <p className="flex items-center gap-2"><span className="h-0.5 w-6 rounded-full bg-primary-600" /> Route</p>
            <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-success-500" /> Start</p>
            <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary-600" /> End</p>
            <p className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border-2 border-dashed border-success-500 bg-success-50" /> Safe Zone</p>
          </div>
        </Card>

        <aside className="absolute bottom-4 right-4 top-4 z-20 hidden w-[330px] overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-modal backdrop-blur-xl lg:flex lg:flex-col">
          <div className="flex items-center justify-between border-b border-surface-100 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Event timeline</p>
              <h2 className="mt-1 text-lg font-extrabold text-surface-950">{events.length} เหตุการณ์</h2>
            </div>
            <span className="rounded-xl bg-primary-50 p-2 text-primary-700"><Footprints className="h-5 w-5" /></span>
          </div>
          <div className="custom-scrollbar flex-1 overflow-y-auto p-5">
            <div className="relative space-y-5 pl-7 before:absolute before:bottom-2 before:left-[9px] before:top-2 before:w-px before:bg-surface-200">
              {events.map((event) => {
                const presentation = getEventPresentation(event);
                const EventIcon = presentation.Icon;
                const color = presentation.tone === 'danger' ? 'text-danger-600 bg-danger-50' : presentation.tone === 'success' ? 'text-success-600 bg-success-50' : presentation.tone === 'secondary' ? 'text-secondary-600 bg-secondary-50' : 'text-primary-600 bg-primary-50';
                return (
                  <article key={event.id} className="relative">
                    <span className={`absolute -left-7 top-0 inline-flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white ${color}`}>
                      <EventIcon className="h-3 w-3" aria-hidden="true" />
                    </span>
                    <p className="text-xs font-bold text-primary-600">{formatTime(event.timestamp)}</p>
                    <h3 className="mt-0.5 text-sm font-extrabold text-surface-900">{presentation.label}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-surface-500">{event.note || `แบตเตอรี่ ${event.batteryLevel}% · ความเร็ว ${event.speed || 0} km/h`}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="absolute bottom-4 left-4 right-[362px] z-20 hidden rounded-3xl border border-white/70 bg-white/95 p-4 shadow-dropdown backdrop-blur-xl lg:block">
          <div className="grid grid-cols-4 divide-x divide-surface-200">
            {[
              { label: t('history.totalDistance'), value: `${statistics.totalDistanceKm} km`, Icon: Navigation, color: 'text-primary-600' },
              { label: t('history.duration'), value: `${statistics.durationMinutes} min`, Icon: Clock3, color: 'text-danger-600' },
              { label: t('history.batteryUsed'), value: `${statistics.batteryConsumedPercent}%`, Icon: Battery, color: 'text-success-600' },
              { label: 'Route insight', value: 'เดินในพื้นที่คุ้นเคยและกลับ Safe Zone แล้ว', Icon: Lightbulb, color: 'text-secondary-600' },
            ].map((item) => (
              <div key={item.label} className="flex min-w-0 items-center gap-3 px-4 first:pl-0 last:pr-0">
                <item.Icon className={`h-5 w-5 flex-shrink-0 ${item.color}`} />
                <div className="min-w-0">
                  <p className="text-xs text-surface-500">{item.label}</p>
                  <p className="truncate text-sm font-extrabold text-surface-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`absolute inset-x-0 bottom-0 z-30 rounded-t-[28px] border-t border-surface-200 bg-white shadow-modal transition-all duration-300 lg:hidden ${sheetOpen ? 'max-h-[72%]' : 'max-h-[310px]'}`}>
          <button
            type="button"
            onClick={() => setSheetOpen((open) => !open)}
            className="flex min-h-[44px] w-full items-center justify-center"
            aria-expanded={sheetOpen}
            aria-label={sheetOpen ? 'ย่อรายการเหตุการณ์' : 'ขยายรายการเหตุการณ์'}
          >
            <span className="h-1.5 w-14 rounded-full bg-surface-300" />
            {sheetOpen ? <ChevronDown className="absolute right-5 h-5 w-5 text-surface-500" /> : <ChevronUp className="absolute right-5 h-5 w-5 text-surface-500" />}
          </button>

          <div className="grid grid-cols-3 divide-x divide-surface-200 px-4 pb-4">
            <div className="px-2 text-center">
              <Navigation className="mx-auto h-5 w-5 text-primary-600" />
              <p className="mt-1 text-xs text-surface-500">Distance</p>
              <p className="font-extrabold text-surface-900">{statistics.totalDistanceKm} km</p>
            </div>
            <div className="px-2 text-center">
              <AlertTriangle className="mx-auto h-5 w-5 text-danger-600" />
              <p className="mt-1 text-xs text-surface-500">Outside zone</p>
              <p className="font-extrabold text-surface-900">{Math.min(statistics.durationMinutes, 18)} min</p>
            </div>
            <div className="px-2 text-center">
              <Battery className="mx-auto h-5 w-5 text-success-600" />
              <p className="mt-1 text-xs text-surface-500">Battery used</p>
              <p className="font-extrabold text-surface-900">{statistics.batteryConsumedPercent}%</p>
            </div>
          </div>

          <div className="custom-scrollbar max-h-[44vh] overflow-y-auto border-t border-surface-100 px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-extrabold text-surface-950">Top events</h2>
              <span className="text-xs text-surface-400">{events.length} events</span>
            </div>
            <div className="space-y-3">
              {events.slice(0, sheetOpen ? events.length : 2).map((event) => {
                const presentation = getEventPresentation(event);
                const EventIcon = presentation.Icon;
                const color = presentation.tone === 'danger' ? 'bg-danger-50 text-danger-600' : presentation.tone === 'success' ? 'bg-success-50 text-success-600' : 'bg-primary-50 text-primary-600';
                return (
                  <article key={event.id} className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-surface-100 p-3">
                    <span className={`rounded-xl p-2 ${color}`}><EventIcon className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-surface-900">{presentation.label}</p>
                      <p className="truncate text-xs text-surface-500">{event.note || `${event.batteryLevel}% battery`}</p>
                    </div>
                    <time className="text-xs font-bold text-primary-600">{formatTime(event.timestamp)}</time>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
