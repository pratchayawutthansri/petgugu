'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/contexts/toast-context';
import { useLanguage } from '@/contexts/language-context';
import {
  ERP_SUMMARY_METRICS,
  ERP_DEVICE_RECORDS,
  ERP_INCIDENT_RECORDS,
  ERP_BILL_OF_MATERIALS,
  ErpDeviceRecord,
} from '@/data/erp-data';
import {
  Boxes,
  Cpu,
  Radio,
  Battery,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Wrench,
  BarChart3,
  TrendingUp,
  PawPrint,
  RefreshCw,
  Sliders,
  DollarSign,
  Smartphone,
  ExternalLink,
  Signal,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

type ErpTab = 'inventory' | 'analytics' | 'connectivity' | 'bom';

export default function ErpBackofficePage() {
  const { showToast } = useToast();
  const { locale } = useLanguage();

  const [activeTab, setActiveTab] = useState<ErpTab>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [carrierFilter, setCarrierFilter] = useState<string>('ALL');
  const [selectedDevice, setSelectedDevice] = useState<ErpDeviceRecord | null>(null);

  // New Batch Modal State
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [batchLotName, setBatchLotName] = useState('LOT-2026-Q4-02');
  const [batchQuantity, setBatchQuantity] = useState(10);
  const [batchCarrier, setBatchCarrier] = useState<'AIS NB-IoT' | 'True IoT' | 'DTAC Cat-M1'>('AIS NB-IoT');
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Filtered devices
  const filteredDevices = useMemo(() => {
    return ERP_DEVICE_RECORDS.filter((dev) => {
      const matchSearch =
        dev.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.boxCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.imei.includes(searchQuery) ||
        (dev.assignedPetName && dev.assignedPetName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (dev.assignedOwnerName && dev.assignedOwnerName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || dev.status === statusFilter;
      const matchCarrier = carrierFilter === 'ALL' || dev.simCarrier === carrierFilter;

      return matchSearch && matchStatus && matchCarrier;
    });
  }, [searchQuery, statusFilter, carrierFilter]);

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = [
      'Serial Number',
      'Box Code',
      'IMEI',
      'Status',
      'Assigned Pet',
      'Owner',
      'Carrier',
      'Battery Health %',
      'Battery Level %',
      'Total Km',
      'Geofence Breaches',
    ];

    const rows = filteredDevices.map((d) => [
      d.serialNumber,
      d.boxCode,
      d.imei,
      d.status,
      d.assignedPetName || '-',
      d.assignedOwnerName || '-',
      d.simCarrier,
      `${d.batteryHealthPercent}%`,
      `${d.batteryCurrentLevel}%`,
      d.totalKmTracked,
      d.geofenceBreachCount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PawsAndCo_ERP_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      title: 'ส่งออกรายงานเรียบร้อย',
      message: `บันทึกไฟล์ CSV จำนวน ${filteredDevices.length} รายการ`,
    });
  };

  const handleCreateBatch = () => {
    setIsProvisioning(true);
    setTimeout(() => {
      setIsProvisioning(false);
      setShowAddBatchModal(false);
      showToast({
        type: 'success',
        title: 'ผลิตและลงทะเบียนชุดอุปกรณ์สำเร็จ',
        message: `เพิ่มฮาร์ดแวร์ใหม่ ${batchQuantity} ชุด ในล็อต ${batchLotName} พร้อมรหัส QR กล่องเรียบร้อย`,
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* -------------------- Executive Header -------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-surface-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
              <Boxes className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-surface-950 tracking-tight">
                  ระบบ ERP &amp; แดชบอร์ดวิเคราะห์คลังอุปกรณ์ IoT
                </h1>
                <Badge variant="primary" size="sm">ERP v1.4</Badge>
              </div>
              <p className="text-xs text-surface-500 mt-0.5">
                ศูนย์กลางบริหารจัดการสต็อกปลอกคอ, วงจรชีวิตฮาร์ดแวร์, ซิมเครือข่าย และสถิติความปลอดภัยภาคสนาม
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
          >
            ส่งออก CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddBatchModal(true)}
          >
            + ผลิตล็อตใหม่ (New Batch)
          </Button>
          <Link href="/admin">
            <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
              หน้าแอดมิน
            </Button>
          </Link>
        </div>
      </div>

      {/* -------------------- Top 4 Key KPI Metrics Cards -------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Metric 1 */}
        <Card className="p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-white to-surface-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-500">คลังอุปกรณ์ฮาร์ดแวร์</span>
            <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-surface-950 tabular-nums">
              {ERP_SUMMARY_METRICS.totalDevicesManufactured}
            </span>
            <span className="text-xs text-surface-500 font-semibold">เครื่อง</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-surface-600">
            <span className="w-2 h-2 rounded-full bg-success inline-block" />
            <span>ทำงานจริง: <b>{ERP_SUMMARY_METRICS.activeInField}</b></span>
            <span className="text-surface-300">|</span>
            <span>สต็อก: <b>{ERP_SUMMARY_METRICS.inStockWarehouse}</b></span>
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-white to-surface-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-500">สุนัขในความคุ้มครอง</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PawPrint className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-surface-950 tabular-nums">
              {ERP_SUMMARY_METRICS.totalPetsProtected}
            </span>
            <span className="text-xs text-surface-500 font-semibold">ตัว</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>กู้คืนสำเร็จ 100% (เฉลี่ย 18.5 นาที)</span>
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-white to-surface-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-500">ปริมาณ Telemetry Pings</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-surface-950 tabular-nums">
              {(ERP_SUMMARY_METRICS.totalTelemetryPings / 1_000_000).toFixed(2)}M
            </span>
            <span className="text-xs text-surface-500 font-semibold">พิกัดสะสม</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-surface-600">
            <Signal className="w-3.5 h-3.5 text-indigo-600" />
            <span>ซิมแอ็กทีฟ: <b>{ERP_SUMMARY_METRICS.simFleetActive} ซิม</b> (4.35 GB)</span>
          </div>
        </Card>

        {/* Metric 4 */}
        <Card className="p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-white to-surface-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-500">สุขภาพแบต &amp; ต้นทุน BOM</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Battery className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-surface-950 tabular-nums">
              {ERP_SUMMARY_METRICS.fleetAverageBatteryPercent}%
            </span>
            <span className="text-xs text-surface-500 font-semibold">สุขภาพแบตเฉลี่ย</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-surface-600">
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>ต้นทุนวัสดุเฉลี่ย: <b>฿{ERP_SUMMARY_METRICS.averageBOMCostThb.toLocaleString()} / เครื่อง</b></span>
          </div>
        </Card>
      </div>

      {/* -------------------- Navigation Tabs -------------------- */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-100 border border-surface-200/80 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'inventory'
              ? 'bg-white text-surface-950 shadow-sm'
              : 'text-surface-600 hover:text-surface-900'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>คลังและฝูงอุปกรณ์ ({filteredDevices.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-white text-surface-950 shadow-sm'
              : 'text-surface-600 hover:text-surface-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>แดชบอร์ดสถิติ &amp; เหตุการณ์</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('connectivity')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'connectivity'
              ? 'bg-white text-surface-950 shadow-sm'
              : 'text-surface-600 hover:text-surface-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>เครือข่าย &amp; ซิมการ์ด IoT</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bom')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'bom'
              ? 'bg-white text-surface-950 shadow-sm'
              : 'text-surface-600 hover:text-surface-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>ต้นทุน BOM &amp; วัตถุดิบ</span>
        </button>
      </div>

      {/* -------------------- TAB 1: Hardware Fleet & Inventory Table -------------------- */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ค้นหาด้วยรหัส SN, รหัสกล่อง, IMEI, ชื่อสุนัข, หรือชื่อเจ้าของ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-surface-200 bg-surface-50/50 focus:bg-white focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-surface-400 font-semibold mr-1">สถานะ:</span>
                {[
                  { id: 'ALL', label: 'ทั้งหมด' },
                  { id: 'ACTIVE', label: 'ทำงานจริง' },
                  { id: 'IN_STOCK', label: 'พร้อมส่ง' },
                  { id: 'MAINTENANCE', label: 'ซ่อมบำรุง' },
                  { id: 'RESERVED', label: 'จองแล้ว' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      statusFilter === st.id
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Carrier Filter */}
              <select
                value={carrierFilter}
                onChange={(e) => setCarrierFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-surface-200 bg-white text-xs font-bold text-surface-700 outline-none"
              >
                <option value="ALL">ทุกเครือข่าย (All Telco)</option>
                <option value="AIS NB-IoT">AIS NB-IoT</option>
                <option value="True IoT">True IoT</option>
                <option value="DTAC Cat-M1">DTAC Cat-M1</option>
              </select>
            </div>
          </Card>

          {/* Master Table */}
          <Card className="overflow-hidden border border-surface-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-surface-800 border-collapse">
                <thead>
                  <tr className="bg-surface-100/70 border-b border-surface-200 text-surface-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">รหัสเครื่อง &amp; กล่อง</th>
                    <th className="py-3 px-4">สัตว์เลี้ยง &amp; เจ้าของ</th>
                    <th className="py-3 px-4">เครือข่าย &amp; ซิม</th>
                    <th className="py-3 px-4">แบตเตอรี่ &amp; สุขภาพ</th>
                    <th className="py-3 px-4">ระยะทางสะสม</th>
                    <th className="py-3 px-4">หลุดนอกเขต</th>
                    <th className="py-3 px-4">สถานะอุปกรณ์</th>
                    <th className="py-3 px-4 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filteredDevices.map((dev) => (
                    <tr
                      key={dev.id}
                      className="hover:bg-surface-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedDevice(dev)}
                    >
                      {/* SN & Box */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-surface-950 text-xs">
                          {dev.serialNumber}
                        </div>
                        <div className="text-[11px] text-surface-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span className="text-primary font-semibold">QR: {dev.boxCode}</span>
                          <span>·</span>
                          <span>{dev.firmwareVersion}</span>
                        </div>
                      </td>

                      {/* Pet & Owner */}
                      <td className="py-3 px-4">
                        {dev.assignedPetName ? (
                          <div>
                            <div className="font-bold text-surface-900 flex items-center gap-1">
                              <PawPrint className="w-3 h-3 text-primary" />
                              <span>{dev.assignedPetName}</span>
                            </div>
                            <div className="text-[11px] text-surface-500 mt-0.5">
                              {dev.assignedOwnerName} ({dev.assignedOwnerPhone})
                            </div>
                          </div>
                        ) : (
                          <span className="text-surface-400 italic">ยังไม่ได้จับคู่</span>
                        )}
                      </td>

                      {/* Network & SIM */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-surface-800 flex items-center gap-1">
                          <Radio className="w-3 h-3 text-indigo-500" />
                          <span>{dev.simCarrier}</span>
                        </div>
                        <div className="text-[11px] text-surface-400 font-mono mt-0.5">
                          ใช้ไป {dev.simDataUsageMb} MB / เดือน
                        </div>
                      </td>

                      {/* Battery Health & Level */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-surface-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                dev.batteryCurrentLevel > 50
                                  ? 'bg-success'
                                  : dev.batteryCurrentLevel > 20
                                  ? 'bg-amber-500'
                                  : 'bg-danger'
                              }`}
                              style={{ width: `${dev.batteryCurrentLevel}%` }}
                            />
                          </div>
                          <span className="font-bold tabular-nums text-surface-900">
                            {dev.batteryCurrentLevel}%
                          </span>
                        </div>
                        <div className="text-[10px] text-surface-400 mt-0.5 font-medium">
                          สุขภาพเซลล์: {dev.batteryHealthPercent}%
                        </div>
                      </td>

                      {/* Distance */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-surface-900 tabular-nums">
                          {dev.totalKmTracked} กม.
                        </div>
                        <div className="text-[10px] text-surface-400 font-medium mt-0.5">
                          {dev.totalHoursTracked} ชม.
                        </div>
                      </td>

                      {/* Geofence Breaches */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            dev.geofenceBreachCount > 5
                              ? 'bg-danger-50 text-danger-700'
                              : dev.geofenceBreachCount > 0
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-surface-100 text-surface-600'
                          }`}
                        >
                          {dev.geofenceBreachCount} ครั้ง
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            dev.status === 'ACTIVE'
                              ? 'success'
                              : dev.status === 'IN_STOCK'
                              ? 'primary'
                              : dev.status === 'MAINTENANCE'
                              ? 'danger'
                              : 'surface'
                          }
                          size="sm"
                          dot
                        >
                          {dev.status === 'ACTIVE'
                            ? 'กำลังทำงาน'
                            : dev.status === 'IN_STOCK'
                            ? 'พร้อมส่งมอบ'
                            : dev.status === 'MAINTENANCE'
                            ? 'ซ่อมบำรุง'
                            : 'จองแล้ว'}
                        </Badge>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDevice(dev);
                          }}
                        >
                          ดูประวัติ / RMA
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {filteredDevices.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-surface-400 text-sm">
                        ไม่พบข้อมูลอุปกรณ์ตามเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-surface-50/80 border-t border-surface-200 flex items-center justify-between text-xs text-surface-500 font-medium">
              <span>แสดงผล {filteredDevices.length} จากทั้งหมด {ERP_DEVICE_RECORDS.length} รายการ</span>
              <span>ล็อตการผลิตหลัก: LOT-2026-Q3 / Q4</span>
            </div>
          </Card>
        </div>
      )}

      {/* -------------------- TAB 2: Incidents & Telemetry Analytics -------------------- */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Incident Summary Card */}
            <Card className="p-5 md:col-span-2">
              <div className="flex items-center justify-between pb-3 border-b border-surface-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-surface-900 text-sm">
                    ประวัติเหตุการณ์หลุดนอกเขตและฉุกเฉินล่าสุด (Incident Log)
                  </h3>
                </div>
                <Badge variant="surface" size="sm">กู้คืนสำเร็จ 100%</Badge>
              </div>

              <div className="mt-4 space-y-3">
                {ERP_INCIDENT_RECORDS.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-3.5 rounded-xl border border-surface-200/80 bg-surface-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            inc.type === 'SOS_TRIGGERED'
                              ? 'danger'
                              : inc.type === 'ZONE_EXIT'
                              ? 'warning'
                              : 'surface'
                          }
                          size="sm"
                        >
                          {inc.type === 'SOS_TRIGGERED'
                            ? 'SOS แจ้งหาย'
                            : inc.type === 'ZONE_EXIT'
                            ? 'ออกนอกพื้นที่'
                            : inc.type}
                        </Badge>
                        <span className="font-bold text-surface-900 text-xs">
                          {inc.petName} ({inc.petBreed})
                        </span>
                        <span className="text-[11px] text-surface-400">· {inc.locationName}</span>
                      </div>
                      <p className="text-[11px] text-surface-500 mt-1">
                        รหัสอุปกรณ์: <span className="font-mono">{inc.deviceSn}</span> · เวลาที่อยู่นอกเขต:{' '}
                        <b>{inc.durationMinutes} นาที</b>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        {inc.recoveryMethod === 'OWNER_LOCATED'
                          ? 'เจ้าของตามพบ'
                          : inc.recoveryMethod === 'QR_TAG_FINDER'
                          ? 'คนสแกน QR จี้ห้อยคอช่วยส่ง'
                          : 'น้องเดินกลับมาเอง'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Analytics Bar */}
            <Card className="p-5 space-y-4">
              <h3 className="font-bold text-surface-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                สถิติการใช้งานฝูงอุปกรณ์ (Fleet Usage)
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-surface-600 mb-1">
                    <span>ระยะทางเฉลี่ยต่อวัน / ตัว</span>
                    <span className="font-bold text-surface-900">4.8 กม./วัน</span>
                  </div>
                  <div className="w-full bg-surface-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[65%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-surface-600 mb-1">
                    <span>เวลาค้นหาสัญญาณ GNSS (TTFF)</span>
                    <span className="font-bold text-surface-900">3.2 วินาที (A-GPS)</span>
                  </div>
                  <div className="w-full bg-surface-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-surface-600 mb-1">
                    <span>ความแม่นยำ Safe Zone Geofence</span>
                    <span className="font-bold text-surface-900">99.4%</span>
                  </div>
                  <div className="w-full bg-surface-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[99%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-surface-600 mb-1">
                    <span>อัตราสูญหายแพ็กเก็ต (Packet Loss)</span>
                    <span className="font-bold text-surface-900">&lt; 0.6%</span>
                  </div>
                  <div className="w-full bg-surface-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full w-[94%]" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* -------------------- TAB 3: Connectivity & SIM -------------------- */}
      {activeTab === 'connectivity' && (
        <Card className="p-5">
          <div className="flex items-center justify-between pb-4 border-b border-surface-200">
            <div>
              <h3 className="font-bold text-surface-950 text-sm">การบริหารซิมการ์ด IoT และแพ็กเกจเซลลูลาร์</h3>
              <p className="text-xs text-surface-500 mt-0.5">
                ติดตาม Data Traffic, ค่าบริการรายเดือน, และความครอบคลุมสัญญาณ Cat-M1 / NB-IoT ทั่วประเทศ
              </p>
            </div>
            <Badge variant="primary">102 ซิมแอ็กทีฟ</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
            <div className="p-4 rounded-2xl border border-surface-200 bg-surface-50 space-y-1">
              <span className="text-xs font-bold text-surface-500">AIS NB-IoT Fleet</span>
              <p className="text-2xl font-black text-surface-900">62 ซิม</p>
              <p className="text-[11px] text-surface-500">แพ็กเกจ 50MB/เดือน (฿35/เดือน) · สัญญาณครอบคลุม 98%</p>
            </div>

            <div className="p-4 rounded-2xl border border-surface-200 bg-surface-50 space-y-1">
              <span className="text-xs font-bold text-surface-500">True IoT Fleet</span>
              <p className="text-2xl font-black text-surface-900">28 ซิม</p>
              <p className="text-[11px] text-surface-500">แพ็กเกจ 50MB/เดือน (฿35/เดือน) · สัญญาณครอบคลุม 96%</p>
            </div>

            <div className="p-4 rounded-2xl border border-surface-200 bg-surface-50 space-y-1">
              <span className="text-xs font-bold text-surface-500">DTAC Cat-M1 Fleet</span>
              <p className="text-2xl font-black text-surface-900">12 ซิม</p>
              <p className="text-[11px] text-surface-500">แพ็กเกจ LTE-M High Throughput (฿49/เดือน) · สำหรับโหมดฉุกเฉิน</p>
            </div>
          </div>
        </Card>
      )}

      {/* -------------------- TAB 4: BOM & Costs -------------------- */}
      {activeTab === 'bom' && (
        <Card className="p-5">
          <div className="flex items-center justify-between pb-4 border-b border-surface-200">
            <div>
              <h3 className="font-bold text-surface-950 text-sm">
                ตารางวิเคราะห์ต้นทุนวัตถุดิบและอุปกรณ์ (Bill of Materials — BOM Breakdown)
              </h3>
              <p className="text-xs text-surface-500 mt-0.5">
                การแจกแจงโครงสร้างราคาฮาร์ดแวร์ต่อชิ้นเพื่อการผลิตจริงระดับอุตสาหกรรม
              </p>
            </div>
            <Badge variant="success">฿1,450 / ชุดปลอกคอ</Badge>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-50 text-surface-500 font-bold uppercase text-[11px] border-b border-surface-200">
                  <th className="py-2.5 px-3">รายการชิ้นส่วน / โมดูล</th>
                  <th className="py-2.5 px-3">ผู้ผลิต / แหล่งจัดซื้อ</th>
                  <th className="py-2.5 px-3 text-right">ต้นทุนต่อหน่วย (บาท)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {ERP_BILL_OF_MATERIALS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-50/50">
                    <td className="py-2.5 px-3 font-semibold text-surface-900">{item.component}</td>
                    <td className="py-2.5 px-3 text-surface-600">{item.supplier}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-surface-900 tabular-nums">
                      ฿{item.unitCostThb.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-surface-300 font-black text-surface-950 bg-surface-100/60">
                  <td className="py-3 px-3">รวมต้นทุนฮาร์ดแวร์สุทธิต่อเครื่อง (Total BOM Cost)</td>
                  <td className="py-3 px-3">-</td>
                  <td className="py-3 px-3 text-right font-mono text-sm text-primary">฿1,450 บาท</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {/* -------------------- Device Detail / RMA Dialog -------------------- */}
      {selectedDevice && (
        <Dialog
          isOpen={!!selectedDevice}
          onClose={() => setSelectedDevice(null)}
          title={`รายละเอียดอุปกรณ์: ${selectedDevice.serialNumber}`}
          description={`ล็อตการผลิต: ${selectedDevice.batchNumber} | วันประกอบ: ${selectedDevice.assemblyDate}`}
          size="lg"
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-surface-50 rounded-xl border border-surface-200">
              <div>
                <span className="text-surface-400 font-semibold">รหัส QR ข้างกล่อง</span>
                <p className="font-mono font-bold text-surface-900 mt-0.5">{selectedDevice.boxCode}</p>
              </div>
              <div>
                <span className="text-surface-400 font-semibold">IMEI</span>
                <p className="font-mono text-surface-900 mt-0.5">{selectedDevice.imei}</p>
              </div>
              <div>
                <span className="text-surface-400 font-semibold">MAC Address</span>
                <p className="font-mono text-surface-900 mt-0.5">{selectedDevice.macAddress}</p>
              </div>
              <div>
                <span className="text-surface-400 font-semibold">วันหมดประกัน</span>
                <p className="font-bold text-surface-900 mt-0.5">{selectedDevice.warrantyExpiryDate}</p>
              </div>
            </div>

            {selectedDevice.rmaNotes && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  บันทึกการส่งซ่อมบำรุง (RMA Service Note):
                </span>
                <p>{selectedDevice.rmaNotes}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-200">
              <Button variant="outline" size="sm" onClick={() => setSelectedDevice(null)}>
                ปิดหน้าต่าง
              </Button>
              {selectedDevice.assignedPetId && (
                <Link href={`/pet/${selectedDevice.assignedPetId}`}>
                  <Button variant="primary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                    ดูโปรไฟล์สุนัขที่ผูกไว้
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Dialog>
      )}

      {/* -------------------- New Batch Provisioning Modal -------------------- */}
      {showAddBatchModal && (
        <Dialog
          isOpen={showAddBatchModal}
          onClose={() => !isProvisioning && setShowAddBatchModal(false)}
          title="ผลิตและขึ้นทะเบียนล็อตอุปกรณ์ใหม่ (Batch Provisioning)"
          description="ระบบจะสร้างรหัส Serial Number, Box Code QR, และแมปเข้าฐานข้อมูลอัตโนมัติ"
          size="md"
        >
          <div className="space-y-4 pt-2 text-xs">
            <Input
              label="ชื่อล็อตการผลิต (Lot Identifier)"
              value={batchLotName}
              onChange={(e) => setBatchLotName(e.target.value)}
            />

            <div>
              <label className="block text-xs font-bold text-surface-700 mb-1">
                จำนวนที่ต้องการผลิต (Units)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={batchQuantity}
                onChange={(e) => setBatchQuantity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-surface-200 text-sm font-bold text-surface-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-700 mb-1">
                ซิมการ์ด IoT ประจำล็อต
              </label>
              <select
                value={batchCarrier}
                onChange={(e) => setBatchCarrier(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-surface-200 text-xs font-bold text-surface-900 outline-none"
              >
                <option value="AIS NB-IoT">AIS NB-IoT (ครอบคลุมทั่วไทย แนะนำ)</option>
                <option value="True IoT">True IoT (LTE Cat-M1 / NB-IoT)</option>
                <option value="DTAC Cat-M1">DTAC Cat-M1 (High-bandwidth SOS)</option>
              </select>
            </div>

            <div className="p-3 bg-surface-50 rounded-xl border border-surface-200 text-surface-600 space-y-1">
              <p className="font-bold text-surface-800">สรุปการผลิต:</p>
              <p>• ประมาณการต้นทุน BOM รวม: ฿{(batchQuantity * 1450).toLocaleString()} บาท</p>
              <p>• สร้างสติกเกอร์ QR สำหรับติดข้างกล่องปลอกคอ: {batchQuantity} รหัส</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddBatchModal(false)}
                disabled={isProvisioning}
              >
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateBatch}
                isLoading={isProvisioning}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                ยืนยันการขึ้นทะเบียน
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
