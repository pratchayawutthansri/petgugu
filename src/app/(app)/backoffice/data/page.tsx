'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { BackofficeNav } from '@/components/backoffice/backoffice-nav';
import {
  ERP_DEVICE_RECORDS,
  ErpDeviceRecord,
} from '@/data/erp-data';
import {
  BACKOFFICE_RAW_TELEMETRY_LOGS,
  RawTelemetryPing,
} from '@/data/backoffice-data';
import {
  Database,
  Search,
  Filter,
  Download,
  Cpu,
  Radio,
  Battery,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Terminal,
  ExternalLink,
  QrCode,
  Copy,
  Check,
} from 'lucide-react';
import { useToast } from '@/contexts/toast-context';
import { formatDate } from '@/lib/utils';

export default function BackofficeDataPage() {
  const { success, info } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [carrierFilter, setCarrierFilter] = useState('ALL');
  const [selectedDevice, setSelectedDevice] = useState<ErpDeviceRecord | null>(null);
  const [selectedLog, setSelectedLog] = useState<RawTelemetryPing | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered master records
  const filteredRecords = useMemo(() => {
    return ERP_DEVICE_RECORDS.filter((dev) => {
      const matchSearch =
        dev.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.boxCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.imei.includes(searchQuery) ||
        dev.macAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dev.assignedPetName && dev.assignedPetName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (dev.assignedOwnerName && dev.assignedOwnerName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || dev.status === statusFilter;
      const matchCarrier = carrierFilter === 'ALL' || dev.simCarrier === carrierFilter;

      return matchSearch && matchStatus && matchCarrier;
    });
  }, [searchQuery, statusFilter, carrierFilter]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Serial Number',
      'Box Code',
      'IMEI',
      'MAC Address',
      'Firmware',
      'Status',
      'Assigned Pet',
      'Owner Name',
      'Owner Phone',
      'SIM Carrier',
      'SIM ICCID',
      'Data Usage (MB)',
      'Battery Health (%)',
      'Total Km',
    ];

    const rows = filteredRecords.map((d) => [
      d.serialNumber,
      d.boxCode,
      d.imei,
      d.macAddress,
      d.firmwareVersion,
      d.status,
      d.assignedPetName || 'N/A',
      d.assignedOwnerName || 'N/A',
      d.assignedOwnerPhone || 'N/A',
      d.simCarrier,
      d.simIccid,
      d.simDataUsageMb,
      `${d.batteryHealthPercent}%`,
      d.totalKmTracked,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pawsandco-master-devices-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('ดาวน์โหลดตารางข้อมูลฮาร์ดแวร์ CSV สำเร็จ');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    info(`คัดลอก ${text} แล้ว`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Backoffice Navigation */}
      <BackofficeNav />

      {/* Header and Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-surface-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-surface-900">
              ฐานข้อมูลอุปกรณ์และโทรมาตรภาคสนาม (Hardware Master Registry)
            </h2>
          </div>
          <p className="text-xs text-surface-500 mt-0.5">
            สืบค้นข้อมูลเชิงเทคนิค Serial Number, IMEI, ซิมการ์ด IoT และประวัติ Telemetry รายเครื่อง
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4 text-emerald-600" />}
          >
            ส่งออก CSV ({filteredRecords.length})
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาตาม Serial, Box Code, IMEI, MAC, ชื่อสุนัข, หรือเบอร์เจ้าของ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-surface-200 bg-surface-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-surface-200 bg-white font-bold text-surface-800 outline-none"
            >
              <option value="ALL">สถานะทั้งหมด</option>
              <option value="ACTIVE">ประจำการจริง (Active)</option>
              <option value="IN_STOCK">ในสต็อกคลัง (In Stock)</option>
              <option value="MAINTENANCE">ซ่อมบำรุง / RMA</option>
              <option value="RESERVED">จองแล้ว (Reserved)</option>
            </select>

            {/* Carrier Filter */}
            <select
              value={carrierFilter}
              onChange={(e) => setCarrierFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-surface-200 bg-white font-bold text-surface-800 outline-none"
            >
              <option value="ALL">ค่ายซิมทั้งหมด</option>
              <option value="AIS NB-IoT">AIS NB-IoT</option>
              <option value="True IoT">True IoT</option>
              <option value="DTAC Cat-M1">DTAC Cat-M1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Master Data Table */}
      <Card className="border-surface-200 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-50 border-b border-surface-200 text-surface-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">รหัสฮาร์ดแวร์ & กล่อง</th>
                <th className="py-3 px-4">IMEI & MAC Address</th>
                <th className="py-3 px-4">สัตว์เลี้ยง & เจ้าของ</th>
                <th className="py-3 px-4">เครือข่าย & ดาต้าซิม</th>
                <th className="py-3 px-4">แบตเตอรี่ & สุขภาพ</th>
                <th className="py-3 px-4">ระยะสะสม</th>
                <th className="py-3 px-4">สถานะเครื่อง</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 font-medium">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-surface-400">
                    ไม่พบข้อมูลฮาร์ดแวร์ที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredRecords.map((dev) => (
                  <tr key={dev.id} className="hover:bg-surface-50/70 transition-colors">
                    {/* SN & Box */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-surface-900">{dev.serialNumber}</div>
                      <div className="text-[11px] text-surface-500 font-mono flex items-center gap-1 mt-0.5">
                        <QrCode className="w-3 h-3 text-amber-600" />
                        <span>{dev.boxCode}</span>
                      </div>
                    </td>

                    {/* IMEI & MAC */}
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div className="text-surface-800">{dev.imei}</div>
                      <div className="text-surface-400 text-[10px]">{dev.macAddress}</div>
                    </td>

                    {/* Assigned Pet */}
                    <td className="py-3 px-4">
                      {dev.assignedPetName ? (
                        <div>
                          <div className="font-bold text-surface-900">{dev.assignedPetName}</div>
                          <div className="text-[11px] text-surface-500">
                            {dev.assignedOwnerName} ({dev.assignedOwnerPhone})
                          </div>
                        </div>
                      ) : (
                        <span className="text-surface-400 italic">ยังไม่ผูกกับสัตว์เลี้ยง</span>
                      )}
                    </td>

                    {/* Carrier & Data */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-surface-800">{dev.simCarrier}</div>
                      <div className="text-[11px] text-surface-500 font-mono">
                        {dev.simDataUsageMb} MB / เดือน
                      </div>
                    </td>

                    {/* Battery */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-surface-900">{dev.batteryCurrentLevel}%</span>
                        <span className="text-[10px] text-surface-500 font-mono">
                          (สุขภาพ {dev.batteryHealthPercent}%)
                        </span>
                      </div>
                      <div className="w-20 h-1.5 rounded-full bg-surface-200 mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dev.batteryHealthPercent > 85
                              ? 'bg-emerald-500'
                              : dev.batteryHealthPercent > 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${dev.batteryHealthPercent}%` }}
                        />
                      </div>
                    </td>

                    {/* Km & Hours */}
                    <td className="py-3 px-4 font-mono text-surface-800">
                      <div>{dev.totalKmTracked} km</div>
                      <div className="text-[10px] text-surface-400">{dev.totalHoursTracked} ชม.</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          dev.status === 'ACTIVE'
                            ? 'success'
                            : dev.status === 'IN_STOCK'
                            ? 'secondary'
                            : dev.status === 'MAINTENANCE'
                            ? 'danger'
                            : 'warning'
                        }
                        className="text-[10px]"
                      >
                        {dev.status === 'ACTIVE'
                          ? 'ประจำการจริง'
                          : dev.status === 'IN_STOCK'
                          ? 'พร้อมจัดส่ง'
                          : dev.status === 'MAINTENANCE'
                          ? 'ส่งเคลม / ซ่อม'
                          : 'จองไว้'}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDevice(dev)}
                        className="text-surface-700 hover:text-surface-900"
                      >
                        ดูสเปกเชิงลึก
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Raw Telemetry JSON Log Stream */}
      <Card className="border-surface-200 shadow-sm bg-neutral-950 text-white overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-neutral-800 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <CardTitle className="text-sm font-bold text-white font-mono">
              สตรีมแพ็กเก็ตข้อมูลดิบ (Live Inbound Telemetry Logs)
            </CardTitle>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            โปรโตคอล: HTTP POST /api/iot/location
          </span>
        </CardHeader>

        <CardContent className="p-4 space-y-2">
          {BACKOFFICE_RAW_TELEMETRY_LOGS.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-all font-mono text-xs cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">{log.timestamp}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    {log.packetType}
                  </span>
                  <span className="text-white font-sans font-bold">{log.petName}</span>
                  <span className="text-neutral-400">({log.deviceSn})</span>
                </div>
                <span className="text-neutral-400 text-[10px]">{log.messageId}</span>
              </div>

              <div className="text-[11px] text-neutral-300 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-neutral-800/80">
                <span>Lat: {log.latitude.toFixed(4)}</span>
                <span>Lng: {log.longitude.toFixed(4)}</span>
                <span>Speed: {log.speed} km/h</span>
                <span>Battery: {log.battery}% ({log.voltage}V)</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Device Detail Modal */}
      {selectedDevice && (
        <Dialog
          isOpen={!!selectedDevice}
          onClose={() => setSelectedDevice(null)}
          title={`สเปกและข้อมูลฮาร์ดแวร์: ${selectedDevice.serialNumber}`}
          description="รายละเอียดประจำเครื่อง ชิปประมวลผล สัญญาณ และข้อมูลการรับประกัน"
          size="lg"
        >
          <div className="space-y-4 pt-2 text-xs">
            {/* Box & Hardware Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-surface-50 rounded-xl border border-surface-200">
              <div>
                <span className="text-surface-500 block text-[10px] font-bold">รหัสสติกเกอร์ข้างกล่อง</span>
                <span className="font-mono font-bold text-surface-900">{selectedDevice.boxCode}</span>
              </div>
              <div>
                <span className="text-surface-500 block text-[10px] font-bold">เวอร์ชันเฟิร์มแวร์</span>
                <span className="font-mono font-bold text-emerald-600">{selectedDevice.firmwareVersion}</span>
              </div>
              <div>
                <span className="text-surface-500 block text-[10px] font-bold">ล็อตการผลิต</span>
                <span className="font-mono font-bold text-surface-900">{selectedDevice.batchNumber}</span>
              </div>
              <div>
                <span className="text-surface-500 block text-[10px] font-bold">IMEI โมเด็ม SIM7080G</span>
                <span className="font-mono font-bold text-surface-900">{selectedDevice.imei}</span>
              </div>
              <div>
                <span className="text-surface-500 block text-[10px] font-bold">MAC Address Wi-Fi/BLE</span>
                <span className="font-mono font-bold text-surface-900">{selectedDevice.macAddress}</span>
              </div>
              <div>
                <span className="text-surface-500 block text-[10px] font-bold">วันหมดประกัน</span>
                <span className="font-bold text-surface-900">{selectedDevice.warrantyExpiryDate}</span>
              </div>
            </div>

            {/* SIM and Pet details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                <p className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-blue-600" />
                  <span>ข้อมูลซิมเซลลูลาร์ IoT</span>
                </p>
                <p className="text-blue-800">• ผู้ให้บริการ: <b>{selectedDevice.simCarrier}</b></p>
                <p className="text-blue-800 font-mono text-[11px]">• ICCID: {selectedDevice.simIccid}</p>
                <p className="text-blue-800">• ใช้งานเดือนนี้: {selectedDevice.simDataUsageMb} MB</p>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>ข้อมูลสัตว์เลี้ยงที่ผูกไว้</span>
                </p>
                <p className="text-amber-800">• สุนัข: <b>{selectedDevice.assignedPetName || 'ยังไม่ระบุ'}</b></p>
                <p className="text-amber-800">• สายพันธุ์: {selectedDevice.breed || 'N/A'}</p>
                <p className="text-amber-800">• เจ้าของ: {selectedDevice.assignedOwnerName} ({selectedDevice.assignedOwnerPhone})</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-surface-200">
              <Button variant="outline" size="sm" onClick={() => setSelectedDevice(null)}>
                ปิดหน้าต่าง
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
