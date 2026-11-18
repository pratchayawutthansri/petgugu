'use client';

import React, { useEffect, useState } from 'react';
import { Pet, SafeZone } from '@/types';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/contexts/toast-context';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  LocateFixed,
  Navigation,
  Check,
  MapPin,
} from 'lucide-react';
import { cn, calculateDistanceMeters } from '@/lib/utils';

const RADIUS_PRESETS = [
  { label: '50 ม.', value: 50 },
  { label: '100 ม.', value: 100 },
  { label: '200 ม.', value: 200 },
  { label: '300 ม.', value: 300 },
  { label: '500 ม.', value: 500 },
  { label: '1 กม.', value: 1000 },
  { label: '2 กม.', value: 2000 },
];

export interface SafeZoneDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet | null;
  initialEditZoneId?: string | null;
  onZoneSaved?: (zone: SafeZone) => void;
  onSave: (
    petId: string,
    updates: Partial<Pet>
  ) => Promise<{ success: boolean; data?: Pet; error?: string }>;
}

export function SafeZoneDialog({
  isOpen,
  onClose,
  pet,
  initialEditZoneId = null,
  onZoneSaved,
  onSave,
}: SafeZoneDialogProps) {
  const { showToast } = useToast();
  const [zones, setZones] = useState<SafeZone[]>([]);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [zoneName, setZoneName] = useState('');
  const [zoneRadius, setZoneRadius] = useState<number>(300);
  const [zoneLat, setZoneLat] = useState<string>('13.731400');
  const [zoneLng, setZoneLng] = useState<string>('100.559000');
  const [zoneActive, setZoneActive] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const defaultLat = pet?.latestLocation?.latitude ?? 13.7314;
  const defaultLng = pet?.latestLocation?.longitude ?? 100.559;

  useEffect(() => {
    if (!pet || !isOpen) return;
    const currentZones = pet.safeZones || [];
    setZones(currentZones);

    // Pick explicitly requested zone, otherwise pick the active zone closest to the pet's current GPS position
    const sortedByProximity = [...currentZones].sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      const distA = calculateDistanceMeters(defaultLat, defaultLng, a.latitude, a.longitude);
      const distB = calculateDistanceMeters(defaultLat, defaultLng, b.latitude, b.longitude);
      return distA - distB;
    });

    const targetZone =
      (initialEditZoneId && currentZones.find((z) => z.id === initialEditZoneId)) ||
      sortedByProximity[0] ||
      null;

    if (targetZone) {
      setEditingZoneId(targetZone.id);
      setZoneName(targetZone.name);
      setZoneRadius(targetZone.radius);
      setZoneLat(targetZone.latitude.toFixed(6));
      setZoneLng(targetZone.longitude.toFixed(6));
      setZoneActive(targetZone.isActive);
    } else {
      setEditingZoneId(null);
      setZoneName('บ้าน');
      setZoneRadius(300);
      setZoneLat(defaultLat.toFixed(6));
      setZoneLng(defaultLng.toFixed(6));
      setZoneActive(true);
    }
  }, [pet, isOpen, initialEditZoneId, defaultLat, defaultLng]);

  if (!pet) return null;

  const startNewZone = () => {
    setEditingZoneId(null);
    setZoneName('');
    setZoneRadius(300);
    setZoneLat(defaultLat.toFixed(6));
    setZoneLng(defaultLng.toFixed(6));
    setZoneActive(true);
  };

  const selectZoneToEdit = (zone: SafeZone) => {
    setEditingZoneId(zone.id);
    setZoneName(zone.name);
    setZoneRadius(zone.radius);
    setZoneLat(zone.latitude.toFixed(6));
    setZoneLng(zone.longitude.toFixed(6));
    setZoneActive(zone.isActive);
  };

  const handleUsePetLocation = () => {
    setZoneLat(defaultLat.toFixed(6));
    setZoneLng(defaultLng.toFixed(6));
    showToast({
      type: 'info',
      message: `ตั้งจุดศูนย์กลางตามตำแหน่งล่าสุดของ ${pet.name} แล้ว`,
    });
  };

  const handleUseMyLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      showToast({
        type: 'warning',
        message: 'เบราว์เซอร์นี้ไม่รองรับการดึงพิกัด GPS อัตโนมัติ',
      });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setZoneLat(pos.coords.latitude.toFixed(6));
        setZoneLng(pos.coords.longitude.toFixed(6));
        setIsLocating(false);
        showToast({
          type: 'success',
          message: 'ดึงตำแหน่งปัจจุบันของคุณเรียบร้อยแล้ว',
        });
      },
      () => {
        setIsLocating(false);
        showToast({
          type: 'warning',
          message: 'ไม่สามารถเข้าถึงตำแหน่งปัจจุบันได้ กรุณาอนุญาตสิทธิ์ Location',
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const persistZones = async (nextZones: SafeZone[], successMsg: string) => {
    setIsSaving(true);
    try {
      const res = await onSave(pet.id, { safeZones: nextZones });
      if (res.success) {
        setZones(nextZones);
        showToast({
          type: 'success',
          title: 'อัปเดตพื้นที่ปลอดภัยแล้ว',
          message: successMsg,
        });
        return true;
      }
      showToast({
        type: 'error',
        message: res.error || 'บันทึกพื้นที่ปลอดภัยไม่สำเร็จ',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = zoneName.trim();
    if (!trimmedName) {
      showToast({ type: 'warning', message: 'กรุณากรอกชื่อพื้นที่ปลอดภัย' });
      return;
    }

    const parsedRadius = Math.round(Number(zoneRadius));
    if (!Number.isFinite(parsedRadius) || parsedRadius < 50 || parsedRadius > 5000) {
      showToast({
        type: 'warning',
        message: 'รัศมีพื้นที่ปลอดภัยต้องอยู่ระหว่าง 50 – 5,000 เมตร',
      });
      return;
    }

    const parsedLat = Number(zoneLat);
    const parsedLng = Number(zoneLng);
    if (
      !Number.isFinite(parsedLat) ||
      !Number.isFinite(parsedLng) ||
      parsedLat < -90 ||
      parsedLat > 90 ||
      parsedLng < -180 ||
      parsedLng > 180
    ) {
      showToast({
        type: 'warning',
        message: 'พิกัดละติจูด / ลองจิจูดไม่ถูกต้อง',
      });
      return;
    }

    const now = new Date().toISOString();
    let nextZones: SafeZone[];

    if (editingZoneId) {
      let updatedZone: SafeZone | null = null;
      nextZones = zones.map((z) => {
        if (z.id === editingZoneId) {
          updatedZone = {
            ...z,
            name: trimmedName,
            radius: parsedRadius,
            latitude: parsedLat,
            longitude: parsedLng,
            isActive: zoneActive,
            updatedAt: now,
          };
          return updatedZone;
        }
        return z;
      });
      const ok = await persistZones(
        nextZones,
        `ปรับรัศมี "${trimmedName}" เป็น ${parsedRadius.toLocaleString()} เมตรแล้ว`
      );
      if (ok) {
        if (updatedZone) onZoneSaved?.(updatedZone);
        onClose();
      }
    } else {
      const newZone: SafeZone = {
        id: `zone_${Date.now()}`,
        petId: pet.id,
        name: trimmedName,
        radius: parsedRadius,
        latitude: parsedLat,
        longitude: parsedLng,
        isActive: zoneActive,
        createdAt: now,
        updatedAt: now,
      };
      nextZones = [...zones, newZone];
      const ok = await persistZones(
        nextZones,
        `เพิ่มพื้นที่ "${trimmedName}" รัศมี ${parsedRadius.toLocaleString()} เมตรแล้ว`
      );
      if (ok) {
        setEditingZoneId(newZone.id);
        onZoneSaved?.(newZone);
        onClose();
      }
    }
  };

  const handleToggleZoneActive = async (zone: SafeZone) => {
    const nextZones = zones.map((z) =>
      z.id === zone.id
        ? { ...z, isActive: !z.isActive, updatedAt: new Date().toISOString() }
        : z
    );
    if (editingZoneId === zone.id) {
      setZoneActive(!zone.isActive);
    }
    await persistZones(
      nextZones,
      !zone.isActive
        ? `เปิดใช้งานพื้นที่ "${zone.name}" แล้ว`
        : `พักการแจ้งเตือนพื้นที่ "${zone.name}" ชั่วคราว`
    );
  };

  const handleDeleteZone = async (zone: SafeZone) => {
    const nextZones = zones.filter((z) => z.id !== zone.id);
    const ok = await persistZones(nextZones, `ลบพื้นที่ "${zone.name}" แล้ว`);
    if (ok && editingZoneId === zone.id) {
      if (nextZones.length > 0) {
        selectZoneToEdit(nextZones[0]);
      } else {
        startNewZone();
      }
    }
  };

  const formatRadiusText = (m: number) =>
    m >= 1000 ? `${(m / 1000).toFixed(m % 1000 === 0 ? 0 : 1)} กม. (${m.toLocaleString()} ม.)` : `${m.toLocaleString()} เมตร`;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => !isSaving && onClose()}
      title={`ตั้งค่าพื้นที่ปลอดภัยและรัศมี — ${pet.name}`}
      description="กำหนดรัศมี (50–5,000 เมตร) เพื่อให้ระบบแจ้งเตือนทันทีเมื่อสุนัขออกนอกขอบเขต"
      size="lg"
    >
      <div className="space-y-5 pt-1 max-h-[75vh] overflow-y-auto px-0.5">
        {/* Existing Safe Zones List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-600">
              พื้นที่ปลอดภัยทั้งหมด ({zones.length})
            </span>
            <button
              type="button"
              onClick={startNewZone}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มพื้นที่ใหม่</span>
            </button>
          </div>

          {zones.length > 0 ? (
            <div className="space-y-2">
              {zones.map((zone) => {
                const isSelected = editingZoneId === zone.id;
                const distToPet = calculateDistanceMeters(
                  defaultLat,
                  defaultLng,
                  zone.latitude,
                  zone.longitude
                );
                const petInsideZone = zone.isActive && distToPet <= zone.radius;
                return (
                  <div
                    key={zone.id}
                    className={cn(
                      'flex items-center justify-between gap-2 p-3 rounded-xl border transition-all',
                      isSelected
                        ? 'border-primary-400 bg-primary-50/40 ring-1 ring-primary-200'
                        : 'border-surface-200 bg-white hover:border-surface-300'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => selectZoneToEdit(zone)}
                      className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                    >
                      <span
                        className={cn(
                          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
                          zone.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-surface-100 text-surface-400'
                        )}
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-bold text-surface-900 truncate">
                            {zone.name}
                          </p>
                          {petInsideZone && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              น้องอยู่ในวงนี้
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-surface-500">
                          รัศมี {formatRadiusText(zone.radius)}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleToggleZoneActive(zone)}
                        className="focus:outline-none"
                        title={zone.isActive ? 'คลิกเพื่อพักการใช้งาน' : 'คลิกเพื่อเปิดใช้งาน'}
                      >
                        <Badge variant={zone.isActive ? 'success' : 'surface'} size="sm">
                          {zone.isActive ? 'เปิดใช้งาน' : 'พักไว้'}
                        </Badge>
                      </button>

                      <button
                        type="button"
                        onClick={() => selectZoneToEdit(zone)}
                        className="p-1.5 rounded-lg text-surface-500 hover:text-primary-700 hover:bg-primary-50 transition"
                        title="แก้ไขรัศมีและชื่อพื้นที่"
                        aria-label="แก้ไขพื้นที่"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleDeleteZone(zone)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition"
                        title="ลบพื้นที่นี้"
                        aria-label="ลบพื้นที่"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-surface-300 bg-surface-50 text-center text-xs text-surface-500">
              ยังไม่มีพื้นที่ปลอดภัย กรอกรายละเอียดและกำหนดรัศมีด้านล่างเพื่อสร้างพื้นที่แรก
            </div>
          )}
        </div>

        {/* Add / Edit Safe Zone Form */}
        <form
          onSubmit={handleSaveForm}
          className="p-4 rounded-2xl bg-surface-50 border border-surface-200 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-surface-700">
              {editingZoneId ? 'แก้ไขพื้นที่ปลอดภัยที่เลือก' : 'สร้างพื้นที่ปลอดภัยใหม่'}
            </h3>
            {editingZoneId && (
              <span className="text-[11px] font-semibold text-primary-700">
                ปรับแล้ววงกลมบนแผนที่จะอัปเดตทันที
              </span>
            )}
          </div>

          <Input
            label="ชื่อพื้นที่ปลอดภัย *"
            placeholder="เช่น บ้าน, สวนเบญจกิติ, สนามหญ้าหน้าบ้าน"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
          />

          {/* Radius Slider + Exact Input + Quick Presets */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-surface-700">
                รัศมีพื้นที่ปลอดภัย (เมตร) *
              </label>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 text-xs font-extrabold tabular-nums">
                {formatRadiusText(Number(zoneRadius) || 50)}
              </span>
            </div>

            <input
              type="range"
              min={50}
              max={5000}
              step={50}
              value={Math.min(5000, Math.max(50, Number(zoneRadius) || 50))}
              onChange={(e) => setZoneRadius(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-surface-200"
              aria-label="แถบเลื่อนกำหนดรัศมีพื้นที่ปลอดภัย"
            />

            <div className="flex justify-between text-[10px] font-medium text-surface-400">
              <span>50 ม. (ในบ้าน)</span>
              <span>300 ม. (รอบบ้าน)</span>
              <span>1 กม. (สวนสาธารณะ)</span>
              <span>5 กม. (สูงสุด)</span>
            </div>

            {/* Quick Preset Radius Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {RADIUS_PRESETS.map((preset) => {
                const active = Number(zoneRadius) === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setZoneRadius(preset.value)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-bold border transition-all',
                      active
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-white text-surface-700 border-surface-200 hover:border-primary-300 hover:text-primary-700'
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Exact Meter Number Input */}
            <div className="pt-1">
              <Input
                type="number"
                min={50}
                max={5000}
                step={10}
                value={zoneRadius}
                onChange={(e) => setZoneRadius(Number(e.target.value))}
                helperText="พิมพ์ค่ารัศมีเองได้ตั้งแต่ 50 ถึง 5,000 เมตร (แนะนำ: บ้าน 100–300 ม., สวน 300–500 ม.)"
              />
            </div>
          </div>

          {/* Center Position */}
          <div className="space-y-2 pt-2 border-t border-surface-200/80">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-surface-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>พิกัดจุดศูนย์กลาง (Latitude / Longitude)</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={handleUsePetLocation}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-surface-200 hover:border-primary-300 text-[11px] font-bold text-surface-700 transition"
                >
                  <LocateFixed className="w-3 h-3 text-primary" />
                  <span>ตำแหน่งน้องหมา</span>
                </button>
                <button
                  type="button"
                  disabled={isLocating}
                  onClick={handleUseMyLocation}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-surface-200 hover:border-primary-300 text-[11px] font-bold text-surface-700 transition disabled:opacity-50"
                >
                  <Navigation className="w-3 h-3 text-emerald-600" />
                  <span>{isLocating ? 'กำลังหาพิกัด...' : 'ตำแหน่งปัจจุบันของฉัน'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Input
                label="Latitude"
                type="number"
                step="0.000001"
                value={zoneLat}
                onChange={(e) => setZoneLat(e.target.value)}
              />
              <Input
                label="Longitude"
                type="number"
                step="0.000001"
                value={zoneLng}
                onChange={(e) => setZoneLng(e.target.value)}
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-surface-200">
            <div>
              <p className="text-xs font-bold text-surface-900">เปิดใช้งานการแจ้งเตือนขอบเขตนี้</p>
              <p className="text-[11px] text-surface-500">
                แสดงวงกลมบนแผนที่และแจ้งเตือนเมื่อสุนัขออกนอกรัศมี
              </p>
            </div>
            <button
              type="button"
              onClick={() => setZoneActive((prev) => !prev)}
              aria-label="เปิดปิดพื้นที่ปลอดภัย"
              className={cn(
                'w-10 h-5 rounded-full p-0.5 transition-colors',
                zoneActive ? 'bg-primary' : 'bg-surface-300'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-full bg-white shadow-xs transition-transform',
                  zoneActive ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              ปิด
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<Check className="w-4 h-4" />}
            >
              {editingZoneId ? 'บันทึกการแก้ไขรัศมี' : 'บันทึกพื้นที่ปลอดภัย'}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
