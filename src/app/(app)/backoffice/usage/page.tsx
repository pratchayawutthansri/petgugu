'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BackofficeNav } from '@/components/backoffice/backoffice-nav';
import {
  BACKOFFICE_DAILY_USAGE,
  BACKOFFICE_CARRIER_USAGE,
  BACKOFFICE_BATTERY_DISTRIBUTION,
  BACKOFFICE_FLEET_COLLARS,
} from '@/data/backoffice-data';
import {
  LineChart,
  Activity,
  Battery,
  Radio,
  Clock,
  TrendingUp,
  ShieldCheck,
  Zap,
  Award,
} from 'lucide-react';

export default function BackofficeUsagePage() {
  const totalWeeklyKm = BACKOFFICE_DAILY_USAGE.reduce((acc, d) => acc + d.totalKm, 0);
  const totalWeeklyHours = BACKOFFICE_DAILY_USAGE.reduce((acc, d) => acc + d.activeHours, 0);
  const totalWeeklyPings = BACKOFFICE_DAILY_USAGE.reduce((acc, d) => acc + d.totalPings, 0);
  const totalBreaches = BACKOFFICE_DAILY_USAGE.reduce((acc, d) => acc + d.geofenceBreaches, 0);

  // Sort dogs by today km
  const sortedDogs = [...BACKOFFICE_FLEET_COLLARS].sort((a, b) => b.todayKm - a.todayKm);

  return (
    <div className="space-y-6">
      {/* Backoffice Navigation */}
      <BackofficeNav />

      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-surface-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-surface-900">
              วิเคราะห์พฤติกรรมการใช้งานฝูงปลอกคอ (Fleet Usage & Telematics Analytics)
            </h2>
          </div>
          <p className="text-xs text-surface-500 mt-0.5">
            สถิติระยะทางการวิ่งสะสม, ชั่วโมงการเชื่อมต่อ, การใช้ดาต้าซิมการ์ด และอัตราการเสื่อมของแบตเตอรี่
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold border border-purple-200">
            📊 สถิติรอบ 7 วันล่าสุด
          </span>
        </div>
      </div>

      {/* 4 Weekly Core Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-surface-200 shadow-sm">
          <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block mb-1">
            ระยะทางเดินสะสมรวม (7 วัน)
          </span>
          <span className="text-2xl font-black text-purple-600 font-mono">
            {totalWeeklyKm.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-surface-500 ml-1">กม.</span>
          <p className="text-[11px] text-surface-500 mt-1">เฉลี่ย 4.5 กม. / วัน / ตัว</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-surface-200 shadow-sm">
          <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block mb-1">
            ชั่วโมงที่เปิดใช้งานสะสม
          </span>
          <span className="text-2xl font-black text-blue-600 font-mono">
            {totalWeeklyHours.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-surface-500 ml-1">ชม.</span>
          <p className="text-[11px] text-surface-500 mt-1">อัตรา Uptime 99.82%</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-surface-200 shadow-sm">
          <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block mb-1">
            พิกัดที่ส่งเข้าเซิร์ฟเวอร์
          </span>
          <span className="text-2xl font-black text-emerald-600 font-mono">
            {(totalWeeklyPings / 1_000_000).toFixed(2)}M
          </span>
          <span className="text-xs font-bold text-surface-500 ml-1">Pings</span>
          <p className="text-[11px] text-surface-500 mt-1">ผ่าน HTTP POST API</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-surface-200 shadow-sm">
          <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block mb-1">
            สุนัขหลุดออกนอก Safe Zone
          </span>
          <span className="text-2xl font-black text-amber-500 font-mono">{totalBreaches}</span>
          <span className="text-xs font-bold text-surface-500 ml-1">ครั้ง</span>
          <p className="text-[11px] text-emerald-600 mt-1 font-bold">กู้คืนสำเร็จ 100%</p>
        </div>
      </div>

      {/* Daily Usage 7-Day Trend Visual Bars */}
      <Card className="border-surface-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-surface-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-surface-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>แนวโน้มระยะทางเดินและกิจกรรมรายวัน (Daily Activity Trend)</span>
            </CardTitle>
            <p className="text-xs text-surface-500">เปรียบเทียบระยะทางรวม (กม.) และจำนวนพิกัดที่ประมวลผล</p>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center">
            {BACKOFFICE_DAILY_USAGE.map((day) => {
              const maxKm = 600;
              const heightPercent = Math.min(100, (day.totalKm / maxKm) * 100);

              return (
                <div key={day.date} className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-surface-700">
                    {day.totalKm}k
                  </span>

                  {/* Visual Bar Column */}
                  <div className="w-full max-w-[42px] h-36 bg-surface-100 rounded-xl flex items-end p-1 overflow-hidden">
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-purple-600 to-purple-400 transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-surface-900 block">{day.dayLabel}</span>
                    <span className="text-[10px] text-surface-400 font-mono">{day.date.slice(5)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Two Columns: Carrier SIM Usage & Battery Degradation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carrier Cellular SIM Breakdown */}
        <Card className="border-surface-200 shadow-sm bg-white">
          <CardHeader className="p-4 sm:p-5 border-b border-surface-100">
            <CardTitle className="text-sm font-bold text-surface-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600" />
              <span>การใช้งานซิมเซลลูลาร์ IoT แยกตามผู้ให้บริการ</span>
            </CardTitle>
            <p className="text-xs text-surface-500">รวม 102 ซิมการ์ดแอ็กทีฟในภาคสนาม</p>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {BACKOFFICE_CARRIER_USAGE.map((c) => (
              <div
                key={c.carrier}
                className="p-3.5 rounded-xl border border-surface-200 bg-surface-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-surface-900">{c.carrier}</span>
                  <Badge variant="surface" className="font-mono text-[10px]">
                    {c.simCount} ซิม ({c.activePercent}%)
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-surface-600">
                  <div>
                    <span>ปริมาณเน็ต: </span>
                    <b className="text-surface-900 font-mono">{c.monthlyTotalMb} MB/ด.</b>
                  </div>
                  <div>
                    <span>ค่าบริการเฉลี่ย: </span>
                    <b className="text-surface-900 font-mono">฿{c.costPerSimThb}/ซิม</b>
                  </div>
                </div>
                <p className="text-[11px] text-surface-500 italic">• {c.recommendedUse}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Battery Health Distribution */}
        <Card className="border-surface-200 shadow-sm bg-white">
          <CardHeader className="p-4 sm:p-5 border-b border-surface-100">
            <CardTitle className="text-sm font-bold text-surface-900 flex items-center gap-2">
              <Battery className="w-4 h-4 text-emerald-600" />
              <span>การกระจายตัวของสุขภาพแบตเตอรี่ (Battery Degradation Index)</span>
            </CardTitle>
            <p className="text-xs text-surface-500">ตรวจสอบอัตราการเสื่อมของเซลล์ Li-Po 1,000mAh</p>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {BACKOFFICE_BATTERY_DISTRIBUTION.map((item) => (
              <div key={item.bracket} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-surface-800">{item.bracket}</span>
                  <span className="font-mono font-bold text-surface-900">{item.count} เครื่อง</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(item.count / 128) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <p className="text-[10px] text-surface-500">{item.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard: Top Active Dogs Today */}
      <Card className="border-surface-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-surface-100">
          <CardTitle className="text-sm font-bold text-surface-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>อันดับสุนัขที่มีกิจกรรมการเคลื่อนไหวสูงสุดวันนี้ (Top Active Dogs)</span>
          </CardTitle>
          <p className="text-xs text-surface-500">ข้อมูลจริงจากเซ็นเซอร์ความเร็วและพิกัดดาวเทียม</p>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-50 border-b border-surface-200 text-surface-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">อันดับ</th>
                <th className="py-3 px-4">สุนัข & สายพันธุ์</th>
                <th className="py-3 px-4">ระยะทางวันนี้</th>
                <th className="py-3 px-4">ชั่วโมงแอ็กทีฟ</th>
                <th className="py-3 px-4">ความเร็วเฉลี่ย</th>
                <th className="py-3 px-4">ระดับแบตเตอรี่</th>
                <th className="py-3 px-4">สถานะล่าสุด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 font-medium">
              {sortedDogs.map((dog, idx) => (
                <tr key={dog.id} className="hover:bg-surface-50/70 transition-colors">
                  <td className="py-3 px-4 font-black text-amber-600 font-mono">#{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img src={dog.photoUrl} alt={dog.petName} className="w-7 h-7 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-surface-900">{dog.petName}</span>
                        <span className="text-[10px] text-surface-400 block">{dog.breed}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-surface-900">{dog.todayKm} กม.</td>
                  <td className="py-3 px-4 font-mono text-surface-700">{dog.todayActiveHours} ชม.</td>
                  <td className="py-3 px-4 font-mono text-surface-700">{dog.speedKmh} km/h</td>
                  <td className="py-3 px-4 font-mono text-surface-700">{dog.batteryLevel}%</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        dog.status === 'SOS_ALERT'
                          ? 'danger'
                          : dog.status === 'OUT_OF_ZONE'
                          ? 'warning'
                          : dog.status === 'MOVING'
                          ? 'success'
                          : 'surface'
                      }
                      className="text-[9px]"
                    >
                      {dog.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
