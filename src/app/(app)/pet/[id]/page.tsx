'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePets } from '@/hooks/use-pets';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/contexts/toast-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, ConfirmDialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TrackingMap } from '@/components/map/dynamic-tracking-map';
import {
  AlertTriangle,
  ArrowLeft,
  Battery,
  CalendarDays,
  CheckCircle2,
  Cpu,
  Edit,
  ExternalLink,
  HeartPulse,
  MapPinned,
  Navigation,
  PawPrint,
  Plus,
  QrCode,
  Radio,
  Share2,
  ShieldCheck,
  Trash2,
  UserRound,
  Weight,
  Wifi,
  Zap,
} from 'lucide-react';
import { formatDate, formatTimeAgo, getSignalInfo } from '@/lib/utils';
import type { Vaccination } from '@/types';

type VaccineStatus = {
  label: string;
  variant: 'success' | 'warning' | 'danger';
  helper: string;
};

function getVaccineStatus(vaccine: Vaccination): VaccineStatus {
  if (!vaccine.nextDueDate) {
    return { label: 'บันทึกแล้ว', variant: 'success', helper: 'ยังไม่กำหนดวันนัดครั้งถัดไป' };
  }

  const due = new Date(vaccine.nextDueDate);
  const today = new Date();
  const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);

  if (daysUntilDue < 0) {
    return { label: 'เกินกำหนด', variant: 'danger', helper: `เกินกำหนด ${Math.abs(daysUntilDue)} วัน` };
  }
  if (daysUntilDue <= 30) {
    return { label: 'ใกล้ถึงกำหนด', variant: 'warning', helper: `อีก ${daysUntilDue} วัน` };
  }
  return { label: 'ปกติ', variant: 'success', helper: `อีก ${daysUntilDue} วัน` };
}

export default function PetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const petId = params.id as string;
  const { pets, isLoading, updatePet, deletePet } = usePets();
  const { t, locale } = useLanguage();
  const { showToast } = useToast();

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBreed, setEditBreed] = useState('');
  const [editAge, setEditAge] = useState(0);
  const [editWeight, setEditWeight] = useState(0);
  const [editHealth, setEditHealth] = useState('');
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [isAddingVaccine, setIsAddingVaccine] = useState(false);
  const [vacName, setVacName] = useState('');
  const [vacDate, setVacDate] = useState('');
  const [vacNextDue, setVacNextDue] = useState('');
  const [vacClinic, setVacClinic] = useState('');
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [zoneRadius, setZoneRadius] = useState(300);

  const pet = pets.find((item) => item.id === petId);

  if (isLoading) {
    return (
      <div className="space-y-5" aria-busy="true" aria-label={t('common.loading')}>
        <div className="h-12 animate-pulse rounded-2xl bg-surface-200/70" />
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="h-[460px] animate-pulse rounded-3xl bg-surface-200/70" />
          <div className="h-[460px] animate-pulse rounded-3xl bg-surface-200/70" />
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <Card className="mx-auto max-w-lg rounded-3xl p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
          <PawPrint className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-surface-950">ไม่พบข้อมูลสัตว์เลี้ยง</h1>
        <p className="mt-2 text-sm text-surface-500">สัตว์เลี้ยงรายการนี้อาจถูกลบหรือคุณไม่มีสิทธิ์เข้าถึง</p>
        <Link href="/pets" className="mt-6 inline-block"><Button>กลับไปหน้าสัตว์เลี้ยง</Button></Link>
      </Card>
    );
  }

  const isOnline = pet.device?.isOnline ?? true;
  const battery = pet.device?.batteryLevel ?? pet.latestLocation?.batteryLevel ?? 0;
  const signalStrength = pet.device?.signalStrength ?? pet.latestLocation?.signalStrength ?? 0;
  const signal = getSignalInfo(signalStrength);
  const gallery = pet.photos?.length
    ? pet.photos
    : [{ id: 'primary', petId: pet.id, url: pet.primaryPhotoUrl, isPrimary: true, createdAt: pet.createdAt }];
  const secondaryPhotos = gallery.filter((photo) => photo.url !== pet.primaryPhotoUrl).slice(0, 2);
  const safeZoneCount = pet.safeZones?.filter((zone) => zone.isActive).length || 0;
  const profileUrl = typeof window === 'undefined' ? `/p/${pet.qrCodeId}` : `${window.location.origin}/p/${pet.qrCodeId}`;

  const handleOpenEdit = () => {
    setEditName(pet.name);
    setEditBreed(pet.breed);
    setEditAge(pet.age);
    setEditWeight(pet.weight);
    setEditHealth(pet.healthNotes || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editBreed.trim()) {
      showToast({ type: 'warning', message: 'กรุณากรอกชื่อและสายพันธุ์ให้ครบถ้วน' });
      return;
    }
    setIsSavingEdit(true);
    try {
      const response = await updatePet(pet.id, { name: editName.trim(), breed: editBreed.trim(), age: editAge, weight: editWeight, healthNotes: editHealth.trim() });
      if (response.success) setShowEditModal(false);
      else showToast({ type: 'error', message: response.error || 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง' });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deletePet(pet.id);
      if (response.success) router.push('/pets');
      else showToast({ type: 'error', message: response.error || 'ลบข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง' });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddVaccine = async () => {
    if (!vacName.trim() || !vacDate) {
      showToast({ type: 'warning', message: 'กรุณากรอกชื่อวัคซีนและวันที่ฉีด' });
      return;
    }
    setIsAddingVaccine(true);
    try {
      const response = await updatePet(pet.id, {
        vaccinations: [...(pet.vaccinations || []), { id: `vac_${Date.now()}`, petId: pet.id, vaccineName: vacName.trim(), administeredDate: vacDate, nextDueDate: vacNextDue || undefined, clinicName: vacClinic.trim() || 'Pet Clinic' }],
      });
      if (!response.success) {
        showToast({ type: 'error', message: response.error || 'เพิ่มบันทึกไม่สำเร็จ กรุณาลองอีกครั้ง' });
        return;
      }
      setShowVaccineModal(false);
      setVacName('');
      setVacDate('');
      setVacNextDue('');
      setVacClinic('');
    } finally {
      setIsAddingVaccine(false);
    }
  };

  const handleAddZone = async () => {
    if (!zoneName.trim()) {
      showToast({ type: 'warning', message: 'กรุณากรอกชื่อพื้นที่ปลอดภัย' });
      return;
    }
    if (zoneRadius < 50 || zoneRadius > 5000) {
      showToast({ type: 'warning', message: 'รัศมีพื้นที่ต้องอยู่ระหว่าง 50–5,000 เมตร' });
      return;
    }
    setIsAddingZone(true);
    try {
      const now = new Date().toISOString();
      const response = await updatePet(pet.id, {
        safeZones: [...(pet.safeZones || []), { id: `zone_${Date.now()}`, petId: pet.id, name: zoneName.trim(), latitude: pet.latestLocation?.latitude || 13.7314, longitude: pet.latestLocation?.longitude || 100.559, radius: Number(zoneRadius), isActive: true, createdAt: now, updatedAt: now }],
      });
      if (!response.success) {
        showToast({ type: 'error', message: response.error || 'เพิ่มพื้นที่ไม่สำเร็จ กรุณาลองอีกครั้ง' });
        return;
      }
      setShowZoneModal(false);
      setZoneName('');
    } finally {
      setIsAddingZone(false);
    }
  };

  const handleShareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${pet.name} — Paws&Co.`, text: `โปรไฟล์สัตว์เลี้ยงของ ${pet.name}`, url: profileUrl });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        showToast({ type: 'success', message: 'คัดลอกลิงก์ QR Profile แล้ว' });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      showToast({ type: 'error', message: 'แชร์โปรไฟล์ไม่สำเร็จ กรุณาลองอีกครั้ง' });
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <nav className="flex min-h-[44px] items-center justify-between gap-3" aria-label="Pet profile actions">
        <Link href="/pets" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-2 text-sm font-bold text-surface-600 transition-colors hover:bg-white hover:text-surface-950 focus-visible:outline-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /><span>สัตว์เลี้ยงของฉัน</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Edit className="h-4 w-4" aria-hidden="true" />} onClick={handleOpenEdit}>แก้ไข</Button>
          <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(true)} aria-label={t('petDetails.deletePet')}><Trash2 className="h-4 w-4 text-danger-600" aria-hidden="true" /></Button>
        </div>
      </nav>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(400px,0.82fr)]" aria-labelledby="pet-profile-title">
        <Card className="overflow-hidden rounded-3xl border-0 bg-surface-950 shadow-card xl:h-full">
          <div className="grid h-[460px] grid-cols-1 gap-1.5 sm:h-[540px] sm:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)] xl:h-full xl:min-h-[620px]">
            <button type="button" onClick={() => setSelectedPhoto(pet.primaryPhotoUrl)} className="group relative min-w-0 overflow-hidden bg-surface-900 text-left" aria-label={`เปิดรูปหลักของ ${pet.name}`}>
              <img src={pet.primaryPhotoUrl} alt={`รูปหลักของ ${pet.name}`} loading="eager" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-950/95 via-surface-950/55 to-transparent p-4 pt-20 sm:p-5 sm:pt-24">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-white">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/15 px-3 py-1.5 backdrop-blur-md"><Radio className="h-3.5 w-3.5 text-success-300" aria-hidden="true" />{isOnline ? 'เชื่อมต่อสด' : 'ออฟไลน์'}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/15 px-3 py-1.5 backdrop-blur-md"><Battery className="h-3.5 w-3.5 text-success-300" aria-hidden="true" /> {battery}%</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/15 px-3 py-1.5 backdrop-blur-md"><ShieldCheck className="h-3.5 w-3.5 text-secondary-300" aria-hidden="true" /> {safeZoneCount} Safe zones</span>
                </div>
                <p className="mt-3 text-sm font-medium text-white/80">แตะเพื่อดูรูปขนาดเต็ม</p>
              </div>
              <span className="absolute right-4 top-4 rounded-full bg-surface-950/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">1 / {gallery.length}</span>
            </button>
            <div className="hidden grid-rows-2 gap-1.5 sm:grid">
              {secondaryPhotos.map((photo, index) => (
                <button key={photo.id} type="button" onClick={() => setSelectedPhoto(photo.url)} className="group relative overflow-hidden bg-surface-900" aria-label={`เปิดรูปที่ ${index + 2} ของ ${pet.name}`}>
                  <img src={photo.url} alt={`${pet.name} รูปที่ ${index + 2}`} loading="lazy" className="h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" />
                </button>
              ))}
              {secondaryPhotos.length < 2 && <div className="flex items-center justify-center bg-gradient-to-br from-primary-700 to-surface-950 text-white"><PawPrint className="h-10 w-10 opacity-35" aria-hidden="true" /></div>}
            </div>
          </div>
        </Card>

        <Card className="flex min-w-0 flex-col rounded-3xl p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Badge variant={pet.isLost ? 'danger' : isOnline ? 'success' : 'surface'} dot>{pet.isLost ? 'กำลังแจ้งหาย' : isOnline ? 'ออนไลน์' : 'ออฟไลน์'}</Badge>
              <h1 id="pet-profile-title" className="mt-4 break-words text-4xl font-extrabold tracking-tight text-surface-950 sm:text-5xl">{pet.name}</h1>
              <p className="mt-2 text-base text-surface-500 sm:text-lg">{pet.breed}</p>
            </div>
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"><PawPrint className="h-6 w-6" aria-hidden="true" /></span>
          </div>

          <dl className="mt-7 grid grid-cols-3 divide-x divide-surface-200 rounded-2xl border border-surface-100 bg-surface-50 py-4">
            <div className="px-2 text-center sm:px-3"><CalendarDays className="mx-auto h-5 w-5 text-primary-600" aria-hidden="true" /><dt className="mt-1 text-xs text-surface-500">อายุ</dt><dd className="mt-0.5 text-lg font-extrabold text-surface-950">{pet.age} <span className="text-xs font-semibold text-surface-500">ปี</span></dd></div>
            <div className="px-2 text-center sm:px-3"><UserRound className="mx-auto h-5 w-5 text-primary-600" aria-hidden="true" /><dt className="mt-1 text-xs text-surface-500">เพศ</dt><dd className="mt-0.5 text-lg font-extrabold text-surface-950">{pet.gender === 'MALE' ? 'ผู้' : pet.gender === 'FEMALE' ? 'เมีย' : '-'}</dd></div>
            <div className="px-2 text-center sm:px-3"><Weight className="mx-auto h-5 w-5 text-primary-600" aria-hidden="true" /><dt className="mt-1 text-xs text-surface-500">น้ำหนัก</dt><dd className="mt-0.5 text-lg font-extrabold text-surface-950">{pet.weight} <span className="text-xs font-semibold text-surface-500">กก.</span></dd></div>
          </dl>

          <div className="mt-6 rounded-2xl border border-warning-100 bg-warning-50/70 p-4">
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-warning-800"><HeartPulse className="h-4 w-4" aria-hidden="true" /> ข้อมูลดูแลสำคัญ</p>
            <p className="mt-2 text-sm leading-6 text-warning-900">{pet.healthNotes || 'ยังไม่มีบันทึกสุขภาพหรือข้อควรระวัง'}</p>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-surface-100 pt-5 text-sm">
            <div className="min-w-0"><dt className="text-xs font-semibold text-surface-400">ประเภท</dt><dd className="mt-1 font-bold text-surface-900">{pet.species}</dd></div>
            <div className="min-w-0"><dt className="text-xs font-semibold text-surface-400">QR Tag ID</dt><dd className="mt-1 break-words font-bold text-surface-900">{pet.qrCodeId}</dd></div>
            <div className="col-span-2 min-w-0"><dt className="text-xs font-semibold text-surface-400">อัปเดตข้อมูลล่าสุด</dt><dd className="mt-1 font-bold text-surface-900">{formatDate(pet.updatedAt, locale)}</dd></div>
          </dl>

          <div className="mt-auto grid gap-2 pt-7 sm:grid-cols-2">
            <Link href="/dashboard" className="block"><Button size="lg" className="w-full" leftIcon={<Navigation className="h-5 w-5" aria-hidden="true" />}>ติดตาม {pet.name}</Button></Link>
            <Button size="lg" variant="outline" className="w-full" leftIcon={<Edit className="h-5 w-5" aria-hidden="true" />} onClick={handleOpenEdit}>แก้ไขโปรไฟล์</Button>
          </div>
        </Card>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <Card className="overflow-hidden rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-100 p-5 sm:p-6">
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger-50 text-danger-600"><HeartPulse className="h-5 w-5" aria-hidden="true" /></span><div><h2 className="text-lg font-extrabold text-surface-950">สุขภาพและการดูแล</h2><p className="text-sm text-surface-500">ประวัติวัคซีนและข้อมูลที่ต้องรู้</p></div></div>
              <Button variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />} onClick={() => setShowVaccineModal(true)}>เพิ่มวัคซีน</Button>
            </div>

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(220px,0.72fr)_minmax(0,1.45fr)]">
              <div className="min-w-0 rounded-2xl border border-warning-100 bg-gradient-to-br from-warning-50 to-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-100 text-warning-700"><AlertTriangle className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="mt-4 font-extrabold text-warning-950">ข้อควรระวังประจำตัว</h3>
                <p className="mt-2 text-sm leading-6 text-warning-900">{pet.healthNotes || 'ไม่พบข้อมูลอาการแพ้หรือข้อควรระวังที่บันทึกไว้'}</p>
                <div className="mt-5 flex items-center gap-2 border-t border-warning-100 pt-4 text-xs font-semibold text-warning-800"><ShieldCheck className="h-4 w-4" aria-hidden="true" /> เก็บเป็นข้อมูลส่วนตัวของเจ้าของ</div>
              </div>

              <div className="min-w-0 space-y-2.5">
                {(pet.vaccinations || []).slice(0, 5).map((vaccine) => {
                  const status = getVaccineStatus(vaccine);
                  return (
                    <div key={vaccine.id} className="grid min-h-[72px] min-w-0 gap-3 rounded-2xl border border-surface-100 px-4 py-3 transition-colors hover:border-primary-100 hover:bg-primary-50/30 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
                      <CheckCircle2 className="hidden h-5 w-5 flex-shrink-0 text-success-600 sm:block" aria-hidden="true" />
                      <div className="min-w-0"><p className="break-words text-sm font-extrabold text-surface-950">{vaccine.vaccineName}</p><p className="mt-1 text-xs text-surface-500">ฉีดเมื่อ {formatDate(vaccine.administeredDate, locale, false)}{vaccine.clinicName ? ` · ${vaccine.clinicName}` : ''}</p>{vaccine.nextDueDate && <p className="mt-1 text-xs font-semibold text-surface-600">นัดถัดไป {formatDate(vaccine.nextDueDate, locale, false)}</p>}</div>
                      <div className="flex items-center justify-between gap-2 sm:block sm:text-right"><Badge variant={status.variant} size="sm">{status.label}</Badge><p className="text-[11px] text-surface-400 sm:mt-1">{status.helper}</p></div>
                    </div>
                  );
                })}
                {!pet.vaccinations?.length && <div className="rounded-2xl border border-dashed border-surface-200 px-5 py-10 text-center"><CalendarDays className="mx-auto h-6 w-6 text-surface-300" aria-hidden="true" /><p className="mt-3 text-sm font-bold text-surface-700">ยังไม่มีบันทึกวัคซีน</p><p className="mt-1 text-xs text-surface-500">เพิ่มประวัติเพื่อช่วยติดตามวันนัดครั้งถัดไป</p></div>}
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-100 p-5 sm:p-6">
              <div className="flex min-w-0 items-center gap-3"><span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-700"><Cpu className="h-5 w-5" aria-hidden="true" /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-extrabold text-surface-950">Smart collar</h2><Badge variant={isOnline ? 'success' : 'surface'} size="sm" dot>{isOnline ? 'Connected' : 'Offline'}</Badge></div><p className="mt-0.5 break-words text-sm text-surface-500">{pet.device?.model || 'LILYGO T-SIM7080G-S3'}</p></div></div>
              <Link href="/hardware"><Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}>จัดการอุปกรณ์</Button></Link>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
              <div className="rounded-2xl border border-surface-100 bg-surface-50 p-4"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-surface-500">Battery</span><Battery className="h-5 w-5 text-success-600" aria-hidden="true" /></div><p className="mt-3 text-2xl font-extrabold tabular-nums text-surface-950">{battery}%</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-200" role="progressbar" aria-label="ระดับแบตเตอรี่" aria-valuemin={0} aria-valuemax={100} aria-valuenow={battery}><div className={`h-full rounded-full ${battery > 60 ? 'bg-success-500' : battery > 25 ? 'bg-warning-500' : 'bg-danger-500'}`} style={{ width: `${Math.max(0, Math.min(100, battery))}%` }} /></div></div>
              <div className="rounded-2xl border border-surface-100 bg-surface-50 p-4"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-surface-500">GPS</span><MapPinned className="h-5 w-5 text-primary-600" aria-hidden="true" /></div><p className="mt-3 text-2xl font-extrabold text-surface-950">{pet.device?.gpsStatus || 'FIX_3D'}</p><p className="mt-2 text-xs font-semibold text-success-700">พร้อมระบุตำแหน่ง</p></div>
              <div className="rounded-2xl border border-surface-100 bg-surface-50 p-4"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-surface-500">Network</span><Wifi className={`h-5 w-5 ${signal.color}`} aria-hidden="true" /></div><p className="mt-3 text-2xl font-extrabold text-surface-950">{signal.label.split(' ')[0]}</p><p className="mt-2 text-xs font-semibold text-surface-500">{pet.device?.networkType || 'LTE CAT-M1'}</p></div>
            </div>

            <dl className="grid gap-x-6 gap-y-4 border-t border-surface-100 bg-surface-50/50 px-5 py-4 text-sm sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
              <div><dt className="text-xs font-semibold text-surface-400">Firmware</dt><dd className="mt-1 font-bold text-surface-800">{pet.device?.firmwareVersion || '-'}</dd></div>
              <div><dt className="text-xs font-semibold text-surface-400">อัปเดตพิกัดทุก</dt><dd className="mt-1 font-bold text-surface-800">{pet.device?.updateIntervalSeconds || '-'} วินาที</dd></div>
              <div><dt className="text-xs font-semibold text-surface-400">ประหยัดพลังงาน</dt><dd className="mt-1 flex items-center gap-1.5 font-bold text-surface-800"><Zap className="h-4 w-4 text-warning-500" aria-hidden="true" />{pet.device?.powerSaveMode ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</dd></div>
              <div><dt className="text-xs font-semibold text-surface-400">พบสัญญาณล่าสุด</dt><dd className="mt-1 font-bold text-surface-800">{formatTimeAgo(pet.device?.lastSeenAt, locale)}</dd></div>
            </dl>
          </Card>
        </div>

        <aside className="min-w-0 space-y-6 xl:sticky xl:top-24">
          <Card className="overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between gap-3 p-5 pb-4"><div><p className="text-xs font-extrabold uppercase tracking-wider text-primary-600">Live geofence</p><h2 className="mt-1 font-extrabold text-surface-950">พื้นที่ปลอดภัย</h2><p className="text-xs text-surface-500">เปิดใช้งาน {safeZoneCount} พื้นที่</p></div><Button variant="ghost" size="sm" leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />} onClick={() => setShowZoneModal(true)}>เพิ่ม</Button></div>
            <div className="relative"><TrackingMap pets={[pet]} className="h-[280px] w-full rounded-none" /><div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-xs font-bold text-surface-700 shadow-card backdrop-blur-md">ตำแหน่งล่าสุดของ {pet.name}</div></div>
            <div className="divide-y divide-surface-100 p-4 pt-2">
              {(pet.safeZones || []).slice(0, 3).map((zone) => <div key={zone.id} className="flex min-h-[64px] items-center gap-3 py-3"><span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${zone.isActive ? 'bg-success-50 text-success-700' : 'bg-surface-100 text-surface-500'}`}><ShieldCheck className="h-4 w-4" aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-surface-900" title={zone.name}>{zone.name}</p><p className="text-xs text-surface-500">รัศมี {zone.radius.toLocaleString()} เมตร</p></div><Badge variant={zone.isActive ? 'success' : 'surface'} size="sm">{zone.isActive ? 'Active' : 'Paused'}</Badge></div>)}
              {!pet.safeZones?.length && <p className="py-5 text-center text-sm text-surface-500">ยังไม่มีพื้นที่ปลอดภัย</p>}
            </div>
          </Card>

          <Card className="relative overflow-hidden rounded-3xl border-primary-100 bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-5">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-100/60 blur-2xl" />
            <div className="relative flex items-start gap-4"><span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-primary-700 shadow-subtle"><QrCode className="h-7 w-7" aria-hidden="true" /></span><div className="min-w-0"><p className="text-xs font-extrabold uppercase tracking-wider text-primary-600">Privacy-safe profile</p><h2 className="mt-1 font-extrabold text-surface-950">Public QR Pet Tag</h2><p className="mt-2 text-sm leading-6 text-surface-600">ผู้พบเห็นติดต่อเจ้าของได้ โดยไม่เห็นตำแหน่งสดหรือพิกัดบ้าน</p></div></div>
            <div className="relative mt-4 rounded-2xl border border-primary-100 bg-white/80 px-4 py-3"><p className="text-[11px] font-bold uppercase tracking-wider text-surface-400">Tag ID</p><p className="mt-1 break-all font-mono text-sm font-bold text-surface-800">{pet.qrCodeId}</p></div>
            <div className="relative mt-4 grid grid-cols-2 gap-2"><Link href={`/p/${pet.qrCodeId}`} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full" rightIcon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}>Preview</Button></Link><Button variant="outline" className="w-full" leftIcon={<Share2 className="h-4 w-4" aria-hidden="true" />} onClick={handleShareProfile}>Share</Button></div>
          </Card>
        </aside>
      </section>

      {selectedPhoto && <Dialog isOpen onClose={() => setSelectedPhoto(null)} size="xl" title={`รูปภาพของ ${pet.name}`}><img src={selectedPhoto} alt={`ภาพขยายของ ${pet.name}`} className="mx-auto max-h-[78vh] w-full rounded-2xl object-contain" /></Dialog>}

      {showEditModal && (
        <Dialog isOpen onClose={() => !isSavingEdit && setShowEditModal(false)} title="แก้ไขข้อมูลสัตว์เลี้ยง" description="ข้อมูลนี้จะแสดงในโปรไฟล์ส่วนตัวของคุณ" size="md">
          <div className="space-y-4 pt-2"><Input label="ชื่อสัตว์เลี้ยง *" value={editName} onChange={(event) => setEditName(event.target.value)} /><Input label="สายพันธุ์ *" value={editBreed} onChange={(event) => setEditBreed(event.target.value)} /><div className="grid grid-cols-2 gap-3"><Input label="อายุ (ปี)" type="number" min={0} value={editAge} onChange={(event) => setEditAge(Number(event.target.value))} /><Input label="น้ำหนัก (กก.)" type="number" min={0} step="0.1" value={editWeight} onChange={(event) => setEditWeight(Number(event.target.value))} /></div><label className="block text-sm font-medium text-surface-700">บันทึกสุขภาพ<textarea rows={4} value={editHealth} onChange={(event) => setEditHealth(event.target.value)} className="mt-1 w-full rounded-xl border border-surface-300 p-3 text-base focus:border-primary-500 focus:ring-2 focus:ring-primary-100" /></label><div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => setShowEditModal(false)} disabled={isSavingEdit}>ยกเลิก</Button><Button onClick={handleSaveEdit} isLoading={isSavingEdit}>บันทึกข้อมูล</Button></div></div>
        </Dialog>
      )}

      {showVaccineModal && (
        <Dialog isOpen onClose={() => !isAddingVaccine && setShowVaccineModal(false)} title="เพิ่มบันทึกวัคซีน" description="กำหนดวันนัดถัดไปเพื่อให้ระบบช่วยติดตามสถานะ" size="md">
          <div className="space-y-4 pt-2"><Input label="ชื่อวัคซีน *" value={vacName} onChange={(event) => setVacName(event.target.value)} /><div className="grid gap-3 sm:grid-cols-2"><Input label="วันที่ฉีด *" type="date" value={vacDate} onChange={(event) => setVacDate(event.target.value)} /><Input label="นัดครั้งถัดไป" type="date" value={vacNextDue} onChange={(event) => setVacNextDue(event.target.value)} /></div><Input label="คลินิก / สัตวแพทย์" value={vacClinic} onChange={(event) => setVacClinic(event.target.value)} /><div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => setShowVaccineModal(false)} disabled={isAddingVaccine}>ยกเลิก</Button><Button onClick={handleAddVaccine} isLoading={isAddingVaccine}>เพิ่มบันทึก</Button></div></div>
        </Dialog>
      )}

      {showZoneModal && (
        <Dialog isOpen onClose={() => !isAddingZone && setShowZoneModal(false)} title="เพิ่มพื้นที่ปลอดภัย" description={`ใช้พิกัดล่าสุดของ ${pet.name} เป็นจุดศูนย์กลาง`} size="md">
          <div className="space-y-4 pt-2"><Input label="ชื่อพื้นที่ *" value={zoneName} onChange={(event) => setZoneName(event.target.value)} /><Input label="รัศมี (เมตร) *" type="number" min={50} max={5000} value={zoneRadius} onChange={(event) => setZoneRadius(Number(event.target.value))} /><p className="rounded-xl bg-surface-50 px-3 py-2 text-xs leading-5 text-surface-500">ค่าที่แนะนำสำหรับบ้านคือ 100–300 เมตร และพื้นที่สาธารณะ 300–500 เมตร</p><div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => setShowZoneModal(false)} disabled={isAddingZone}>ยกเลิก</Button><Button onClick={handleAddZone} isLoading={isAddingZone}>บันทึกพื้นที่</Button></div></div>
        </Dialog>
      )}

      <ConfirmDialog isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDelete} title={t('petDetails.deleteConfirmTitle')} description={t('petDetails.deleteConfirmDesc')} isLoading={isDeleting} />
    </div>
  );
}
