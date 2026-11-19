'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BackofficeNav } from '@/components/backoffice/backoffice-nav';
import {
  BACKOFFICE_FLEET_COLLARS,
  BACKOFFICE_ISSUES,
  BACKOFFICE_DAILY_USAGE,
  BACKOFFICE_RAW_TELEMETRY_LOGS,
} from '@/data/backoffice-data';
import {
  Compass,
  Database,
  AlertOctagon,
  LineChart,
  Radio,
  Battery,
  ShieldAlert,
  ArrowRight,
  Cpu,
  Clock,
  ExternalLink,
  ChevronRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function BackofficeOverviewPage() {
  const movingCollars = BACKOFFICE_FLEET_COLLARS.filter(
    (c) => c.status === 'MOVING' || c.status === 'OUT_OF_ZONE' || c.status === 'SOS_ALERT'
  );
  const openIssues = BACKOFFICE_ISSUES.filter(
    (i) => i.status === 'OPEN' || i.status === 'IN_PROGRESS' || i.status === 'WAITING_PARTS'
  );
  const todayStats = BACKOFFICE_DAILY_USAGE[BACKOFFICE_DAILY_USAGE.length - 1];

  return (
    <div className="space-y-6">
      {/* Backoffice Navigation Bar */}
      <BackofficeNav />

      {/* 4 Core Mission KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Movement Status */}
        <Link href="/backoffice/movement" className="group">
          <Card className="hover:border-amber-400 transition-all hover:shadow-md cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                  ติดตามการเคลื่อนไหว
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Compass className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-surface-900">
                  {movingCollars.length}
                </span>
                <span className="text-xs font-bold text-surface-500">
                  / {BACKOFFICE_FLEET_COLLARS.length} เครื่องกำลังแอ็กทีฟ
                </span>
              </div>
              <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>พิกัด GPS อัปเดตสดใกล้เคียงเวลาจริง</span>
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Card 2: Master Data */}
        <Link href="/backoffice/data" className="group">
          <Card className="hover:border-amber-400 transition-all hover:shadow-md cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                  ข้อมูลและสเปกอุปกรณ์
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Database className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-surface-900">128</span>
                <span className="text-xs font-bold text-surface-500">ยูนิตในฐานข้อมูล</span>
              </div>
              <p className="text-xs text-blue-600 mt-2 font-medium flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>LILYGO ESP32-S3 + SIM7080G</span>
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Card 3: Issue Tracking */}
        <Link href="/backoffice/issues" className="group">
          <Card className="hover:border-rose-400 transition-all hover:shadow-md cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                  การแจ้งปัญหา & RMA
                </span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertOctagon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-rose-600">
                  {openIssues.length}
                </span>
                <span className="text-xs font-bold text-surface-500">เคสที่กำลังดำเนินการ</span>
              </div>
              <p className="text-xs text-rose-600 mt-2 font-medium flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>1 เคสด่วนมาก (SOS หลุดเขต)</span>
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Card 4: Usage Analytics */}
        <Link href="/backoffice/usage" className="group">
          <Card className="hover:border-amber-400 transition-all hover:shadow-md cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                  สถิติการใช้งานวันนี้
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LineChart className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-surface-900">
                  {todayStats.totalKm.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-surface-500">กม. วิ่งสะสม</span>
              </div>
              <p className="text-xs text-purple-600 mt-2 font-medium flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" />
                <span>{todayStats.totalPings.toLocaleString()} พิกัดส่งเข้า Server</span>
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 4 Dedicated Backoffice Functional Modules (Quick Launchers) */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-surface-900 flex items-center gap-2">
          <span>ระบบงานแยกตามฟังก์ชัน (Dedicated Backoffice Modules)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Module 1: Movement */}
          <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-surface-900">
                1. ติดตามการเคลื่อนไหว (Fleet Movement & Live Tracking)
              </h3>
              <p className="text-xs text-surface-600 leading-relaxed">
                มอนิเตอร์ตำแหน่งการเคลื่อนไหวของสุนัขและปลอกคอทุกตัวพร้อมกันบนแผนที่ดาวเทียม
                ตรวจสอบความเร็ว (km/h), ทิศทาง, เส้นทางย้อนหลัง (Breadcrumbs), และสถานะใน/นอกพื้นที่ปลอดภัย
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-surface-100 flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-600 font-bold">
                ● รองรับการจำลองพิกัดสด (Live Simulator)
              </span>
              <Link href="/backoffice/movement">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  เปิดหน้าติดตาม
                </Button>
              </Link>
            </div>
          </div>

          {/* Module 2: Master Data */}
          <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-surface-900">
                2. ข้อมูลอุปกรณ์และสเปก (Device Master Registry & Raw Telemetry)
              </h3>
              <p className="text-xs text-surface-600 leading-relaxed">
                ฐานข้อมูลฮาร์ดแวร์รายเครื่องอย่างละเอียด: Serial Number, Box Code QR, IMEI, MAC Address,
                ค่ายซิม (AIS / True / DTAC), สุขภาพแบตเตอรี่, ข้อมูลเจ้าของ และสตรีมดูโค้ด JSON Telemetry สด
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-surface-100 flex items-center justify-between">
              <span className="text-xs font-mono text-blue-600 font-bold">
                ● ดาวน์โหลดตาราง CSV ได้ทันที
              </span>
              <Link href="/backoffice/data">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  ดูข้อมูลอุปกรณ์
                </Button>
              </Link>
            </div>
          </div>

          {/* Module 3: Issues */}
          <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm hover:border-rose-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-surface-900">
                3. การแจ้งปัญหาและงานซ่อม (Issue Reporting & Ticket Dispatch)
              </h3>
              <p className="text-xs text-surface-600 leading-relaxed">
                ระบบจัดการข้อร้องเรียนและงานซ่อมบำรุงฮาร์ดแวร์: แบตเตอรี่เสื่อม, สัญญาณเน็ตหลุด, เคสแตกร้าว,
                หรือแจ้งสุนัขพลัดหลง พร้อมฟังก์ชันเปิดเคสใหม่ มอบหมายช่าง และบันทึกประวัติการเปลี่ยนอะไหล่
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-surface-100 flex items-center justify-between">
              <span className="text-xs font-mono text-rose-600 font-bold">
                ● มีระบบบันทึกงานซ่อม & เคลม RMA
              </span>
              <Link href="/backoffice/issues">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  จัดการเคสปัญหา
                </Button>
              </Link>
            </div>
          </div>

          {/* Module 4: Usage Analytics */}
          <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-surface-900">
                4. ดูการใช้งานและสถิติ (Usage Behavior & SIM Analytics)
              </h3>
              <p className="text-xs text-surface-600 leading-relaxed">
                วิเคราะห์พฤติกรรมการใช้งานเชิงลึก: กราฟระยะทางสะสมรายวัน, ชั่วโมงการเปิดเครื่องใช้งาน,
                ปริมาณการใช้ดาต้าซิมรายค่าย, อัตราการเสื่อมของแบตเตอรี่ และช่วงเวลาที่สัตว์เลี้ยงเสี่ยงหลุดนอกโซน
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-surface-100 flex items-center justify-between">
              <span className="text-xs font-mono text-purple-600 font-bold">
                ● วิเคราะห์ความคุ้มค่าและ Cell Data
              </span>
              <Link href="/backoffice/usage">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  ดูสถิติการใช้งาน
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Live Telemetry Stream vs Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card className="border-surface-200 shadow-sm">
          <CardHeader className="p-5 border-b border-surface-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-surface-900 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-500" />
                <span>เคสแจ้งปัญหาล่าสุด (Active Issue Tickets)</span>
              </CardTitle>
              <p className="text-xs text-surface-500">ติดตามสถานะงานซ่อมบำรุงและเหตุฉุกเฉิน</p>
            </div>
            <Link href="/backoffice/issues">
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                ดูทั้งหมด ({BACKOFFICE_ISSUES.length})
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {BACKOFFICE_ISSUES.slice(0, 3).map((ticket) => (
              <div
                key={ticket.id}
                className="p-3.5 rounded-xl border border-surface-200 bg-surface-50/50 hover:bg-white hover:border-surface-300 transition-all text-xs space-y-2"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-surface-900">{ticket.ticketCode}</span>
                    <Badge
                      variant={
                        ticket.priority === 'CRITICAL'
                          ? 'danger'
                          : ticket.priority === 'HIGH'
                          ? 'warning'
                          : 'surface'
                      }
                      className="text-[10px]"
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                  <Badge
                    variant={
                      ticket.status === 'RESOLVED'
                        ? 'success'
                        : ticket.status === 'IN_PROGRESS'
                        ? 'warning'
                        : 'surface'
                    }
                    className="text-[10px]"
                  >
                    {ticket.status}
                  </Badge>
                </div>
                <p className="font-bold text-surface-800 line-clamp-1">{ticket.title}</p>
                <div className="flex items-center justify-between text-surface-500 text-[11px] pt-1 border-t border-surface-100">
                  <span>สุนัข: {ticket.petName}</span>
                  <span>{ticket.assignedTechnician}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Incoming Telemetry Packets */}
        <Card className="border-surface-200 shadow-sm">
          <CardHeader className="p-5 border-b border-surface-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-surface-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>สตรีมข้อมูลโทรมาตรสด (Live Telemetry Stream)</span>
              </CardTitle>
              <p className="text-xs text-surface-500">ข้อมูลจริงที่บอร์ด ESP32-S3 ส่งเข้า Web API</p>
            </div>
            <Link href="/backoffice/data">
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                ดู JSON Logs
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4 space-y-2 font-mono text-[11px]">
            {BACKOFFICE_RAW_TELEMETRY_LOGS.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-800 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-amber-400 font-bold">{log.timestamp}</span>
                  <span className="text-neutral-400 truncate">[{log.deviceSn.slice(-5)}]</span>
                  <span className="text-white font-sans font-bold text-xs truncate">
                    {log.petName}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-emerald-400 text-[10px] hidden sm:inline">
                    Lat:{log.latitude.toFixed(3)}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px]">
                    🔋{log.battery}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
