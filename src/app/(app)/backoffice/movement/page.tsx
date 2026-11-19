'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BackofficeNav } from '@/components/backoffice/backoffice-nav';
import {
  BACKOFFICE_FLEET_COLLARS,
  FleetCollarPosition,
  FleetMovementStatus,
} from '@/data/backoffice-data';
import {
  Compass,
  Radio,
  Battery,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  Navigation,
  Signal,
  MapPin,
  Clock,
  Zap,
  Activity,
  Layers,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Pet } from '@/types';
import { MapSkeleton } from '@/components/ui/skeleton';

// Dynamic import of the TrackingMap to avoid SSR Leaflet issues
const TrackingMap = dynamic(
  () => import('@/components/map/tracking-map').then((mod) => mod.TrackingMap),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

export default function FleetMovementPage() {
  const [collars, setCollars] = useState<FleetCollarPosition[]>(BACKOFFICE_FLEET_COLLARS);
  const [selectedCollarId, setSelectedCollarId] = useState<string>(BACKOFFICE_FLEET_COLLARS[0].id);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simTick, setSimTick] = useState(0);

  // Selected collar
  const selectedCollar = useMemo(
    () => collars.find((c) => c.id === selectedCollarId) || collars[0],
    [collars, selectedCollarId]
  );

  // Filtered collars
  const filteredCollars = useMemo(() => {
    return collars.filter((c) => {
      const matchSearch =
        c.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.breed.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [collars, searchQuery, statusFilter]);

  // Live simulation effect (smooth random displacement for moving collars)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimTick((t) => t + 1);
      setCollars((prev) =>
        prev.map((col) => {
          if (col.status === 'MOVING' || col.status === 'OUT_OF_ZONE' || col.status === 'SOS_ALERT') {
            const latDelta = (Math.random() - 0.48) * 0.0003;
            const lngDelta = (Math.random() - 0.48) * 0.0003;
            const newLat = col.latitude + latDelta;
            const newLng = col.longitude + lngDelta;
            const newSpeed = Math.max(1.5, Math.min(18.0, col.speedKmh + (Math.random() - 0.5) * 1.2));

            return {
              ...col,
              latitude: newLat,
              longitude: newLng,
              speedKmh: Number(newSpeed.toFixed(1)),
              todayKm: Number((col.todayKm + 0.02).toFixed(2)),
              lastPingTime: 'เมื่อสักครู่ (พิกัดสด)',
              trail: [
                ...col.trail.slice(-6),
                {
                  lat: newLat,
                  lng: newLng,
                  timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
                  speed: Number(newSpeed.toFixed(1)),
                },
              ],
            };
          }
          return col;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Map collars to Pet interface for Leaflet map component
  const mapPets = useMemo<Pet[]>(() => {
    return filteredCollars.map((c) => ({
      id: c.petId,
      userId: 'admin',
      name: c.petName,
      species: c.species,
      breed: c.breed,
      age: 3,
      gender: 'MALE',
      weight: 22.5,
      coatColor: 'ธรรมชาติ',
      primaryPhotoUrl: c.photoUrl,
      photos: [],
      batterySaver: false,
      proAlerts: true,
      deviceId: c.id,
      qrCodeId: c.boxCode,
      vaccinations: [],
      isLost: c.status === 'SOS_ALERT' || c.status === 'OUT_OF_ZONE',
      latestLocation: {
        id: `loc-${c.id}`,
        petId: c.petId,
        latitude: c.latitude,
        longitude: c.longitude,
        speed: c.speedKmh,
        batteryLevel: c.batteryLevel,
        signalStrength: c.signalPercent,
        timestamp: new Date().toISOString(),
        eventType: c.status === 'MOVING' ? 'MOVING' : c.status === 'OUT_OF_ZONE' ? 'LEFT_ZONE' : 'AT_REST',
      },
      device: {
        id: c.id,
        serialNumber: c.serialNumber,
        model: 'LILYGO T-SIM7080G-S3',
        batteryLevel: c.batteryLevel,
        batteryVoltage: c.batteryVoltage,
        signalStrength: c.signalPercent,
        isOnline: c.status !== 'OFFLINE',
        lastSeenAt: new Date().toISOString(),
        networkType: 'NB_IOT',
        gpsStatus: 'FIX_3D',
        updateIntervalSeconds: 10,
        powerSaveMode: false,
        macAddress: c.macAddress,
        firmwareVersion: c.firmwareVersion,
        createdAt: '2026-08-01',
        updatedAt: '2026-11-19',
      },
      safeZones: [
        {
          id: `sz-${c.id}`,
          petId: c.petId,
          name: c.safeZoneName,
          latitude: c.latitude - 0.001,
          longitude: c.longitude - 0.001,
          radius: 250,
          isActive: true,
          createdAt: '2026-08-01',
          updatedAt: '2026-11-19',
        },
      ],
      createdAt: '2026-08-01',
      updatedAt: '2026-11-19',
    }));
  }, [filteredCollars]);

  return (
    <div className="space-y-6">
      {/* Backoffice Navigation */}
      <BackofficeNav />

      {/* Header & Controls Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-surface-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-lg font-bold text-surface-900">
              ติดตามการเคลื่อนไหวฝูงปลอกคอสด (Live Fleet Telemetry Map)
            </h2>
          </div>
          <p className="text-xs text-surface-500 mt-0.5">
            แสดงพิกัดดาวเทียม GNSS, ความเร็ว, ทิศทาง และขอบเขตพื้นที่ปลอดภัยของสุนัขทุกตัว
          </p>
        </div>

        {/* Live Simulation Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant={isSimulating ? 'danger' : 'primary'}
            size="sm"
            onClick={() => setIsSimulating(!isSimulating)}
            leftIcon={isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          >
            {isSimulating ? 'หยุดการจำลองสด' : 'เริ่มจำลองการเคลื่อนไหวสด'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCollars(BACKOFFICE_FLEET_COLLARS);
              setIsSimulating(false);
            }}
            title="รีเซ็ตพิกัดเริ่มต้น"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            รีเซ็ต
          </Button>
        </div>
      </div>

      {/* Main Map + Side Telemetry Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Map View (7 or 8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative">
            <TrackingMap
              pets={mapPets}
              selectedPetId={selectedCollar.petId}
              onSelectPet={(petId) => {
                const found = collars.find((c) => c.petId === petId);
                if (found) setSelectedCollarId(found.id);
              }}
              className="h-[540px] w-full rounded-2xl overflow-hidden shadow-sm border border-surface-200"
            />

            {/* Floating Live Indicator on Map */}
            <div className="absolute top-4 left-4 z-[400] bg-neutral-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 border border-neutral-700/80 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>กำลังติดตาม: {filteredCollars.length} อุปกรณ์</span>
              {isSimulating && (
                <span className="text-amber-400 font-bold ml-1">● SIMULATING #{simTick}</span>
              )}
            </div>
          </div>

          {/* Quick Filter Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-surface-500 font-bold mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> ตัวกรอง:
            </span>
            {[
              { id: 'ALL', label: 'ทั้งหมด', count: collars.length },
              { id: 'MOVING', label: 'กำลังเคลื่อนที่', count: collars.filter((c) => c.status === 'MOVING').length },
              { id: 'STATIONARY', label: 'อยู่กับที่', count: collars.filter((c) => c.status === 'STATIONARY').length },
              { id: 'OUT_OF_ZONE', label: 'หลุดนอก Safe Zone', count: collars.filter((c) => c.status === 'OUT_OF_ZONE').length },
              { id: 'SOS_ALERT', label: 'ส่งสัญญาณ SOS', count: collars.filter((c) => c.status === 'SOS_ALERT').length },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setStatusFilter(btn.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  statusFilter === btn.id
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-surface-600 border border-surface-200 hover:bg-surface-50'
                }`}
              >
                <span>{btn.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 text-inherit font-mono">
                  {btn.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Telemetry & Collar Selector Inspector (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Collar Live Telemetry Card */}
          <Card className="border-surface-200 shadow-sm bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCollar.photoUrl}
                    alt={selectedCollar.petName}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white/20 shadow-sm"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{selectedCollar.petName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">
                        {selectedCollar.breed}
                      </span>
                    </h3>
                    <p className="text-[11px] text-neutral-300 font-mono">
                      SN: {selectedCollar.serialNumber}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={
                    selectedCollar.status === 'SOS_ALERT'
                      ? 'danger'
                      : selectedCollar.status === 'OUT_OF_ZONE'
                      ? 'warning'
                      : selectedCollar.status === 'MOVING'
                      ? 'success'
                      : 'surface'
                  }
                  className="text-[10px]"
                >
                  {selectedCollar.status}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4 space-y-4 text-xs">
              {/* Telemetry Numbers Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200">
                  <span className="text-[10px] text-surface-500 font-bold block mb-0.5">ความเร็วเคลื่อนที่</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-surface-900 font-mono">
                      {selectedCollar.speedKmh}
                    </span>
                    <span className="text-[10px] text-surface-500 font-bold">km/h</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200">
                  <span className="text-[10px] text-surface-500 font-bold block mb-0.5">ระยะทางวันนี้</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-emerald-600 font-mono">
                      {selectedCollar.todayKm}
                    </span>
                    <span className="text-[10px] text-surface-500 font-bold">กม.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200">
                  <span className="text-[10px] text-surface-500 font-bold block mb-0.5">ระดับแบตเตอรี่</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-surface-900 font-mono">
                      {selectedCollar.batteryLevel}%
                    </span>
                    <span className="text-[10px] text-surface-500 font-bold">({selectedCollar.batteryVoltage}V)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200">
                  <span className="text-[10px] text-surface-500 font-bold block mb-0.5">ดาวเทียม GNSS</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-blue-600 font-mono">
                      {selectedCollar.satellites}
                    </span>
                    <span className="text-[10px] text-surface-500 font-bold">ดวง (±{selectedCollar.accuracyMeters}m)</span>
                  </div>
                </div>
              </div>

              {/* Coordinates & Carrier */}
              <div className="space-y-1.5 pt-1 border-t border-surface-100 text-[11px]">
                <div className="flex justify-between py-1 border-b border-surface-100">
                  <span className="text-surface-500">พิกัด GPS:</span>
                  <span className="font-mono font-bold text-surface-800">
                    {selectedCollar.latitude.toFixed(5)}, {selectedCollar.longitude.toFixed(5)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-100">
                  <span className="text-surface-500">เครือข่ายซิม:</span>
                  <span className="font-bold text-surface-800">
                    {selectedCollar.simCarrier} ({selectedCollar.signalPercent}%)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-100">
                  <span className="text-surface-500">เจ้าของ:</span>
                  <span className="font-bold text-surface-800">
                    {selectedCollar.ownerName} ({selectedCollar.ownerPhone})
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-surface-500">พื้นที่ปลอดภัย:</span>
                  <span className="font-bold text-surface-800">{selectedCollar.safeZoneName}</span>
                </div>
              </div>

              {/* Breadcrumb Path Trail */}
              <div>
                <span className="text-[10px] font-bold text-surface-500 uppercase block mb-1">
                  ประวัติเส้นทาง 5 จุดล่าสุด (Breadcrumbs)
                </span>
                <div className="space-y-1 font-mono text-[10px] bg-surface-50 p-2 rounded-xl border border-surface-200">
                  {selectedCollar.trail.map((point, idx) => (
                    <div key={idx} className="flex justify-between text-surface-600">
                      <span>• {point.timestamp}</span>
                      <span>{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</span>
                      <span className="font-bold text-surface-800">{point.speed} km/h</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Fleet Collar Selector List */}
          <Card className="border-surface-200 shadow-sm bg-white">
            <CardHeader className="p-3 border-b border-surface-100">
              <CardTitle className="text-xs font-bold text-surface-800 flex items-center justify-between">
                <span>เลือกสุนัขในฝูง ({filteredCollars.length})</span>
                <span className="text-[10px] text-surface-500 font-normal">คลิกเพื่อล็อกพิกัด</span>
              </CardTitle>
            </CardHeader>
            <div className="max-h-[260px] overflow-y-auto divide-y divide-surface-100">
              {filteredCollars.map((c) => {
                const isSelected = c.id === selectedCollar.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCollarId(c.id)}
                    className={`w-full p-2.5 text-left flex items-center justify-between gap-2.5 transition-colors text-xs ${
                      isSelected ? 'bg-amber-50/70 border-l-4 border-amber-500' : 'hover:bg-surface-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={c.photoUrl} alt={c.petName} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-surface-900">{c.petName}</p>
                        <p className="text-[10px] text-surface-500 font-mono">
                          {c.speedKmh > 0 ? `วิ่ง ${c.speedKmh} km/h` : 'อยู่กับที่'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          c.status === 'SOS_ALERT'
                            ? 'danger'
                            : c.status === 'OUT_OF_ZONE'
                            ? 'warning'
                            : c.status === 'MOVING'
                            ? 'success'
                            : 'surface'
                        }
                        className="text-[9px] px-1.5"
                      >
                        {c.status}
                      </Badge>
                      <p className="text-[10px] text-surface-400 mt-0.5">🔋{c.batteryLevel}%</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
