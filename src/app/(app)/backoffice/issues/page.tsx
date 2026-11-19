'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { BackofficeNav } from '@/components/backoffice/backoffice-nav';
import {
  BACKOFFICE_ISSUES,
  BackofficeIssueTicket,
  IssueCategory,
  IssuePriority,
  IssueStatus,
} from '@/data/backoffice-data';
import {
  AlertOctagon,
  Search,
  Filter,
  Plus,
  Wrench,
  CheckCircle2,
  Clock,
  ShieldAlert,
  BatteryCharging,
  Radio,
  User,
  Phone,
  FileText,
  Save,
  Check,
} from 'lucide-react';
import { useToast } from '@/contexts/toast-context';
import { formatDate } from '@/lib/utils';

export default function BackofficeIssuesPage() {
  const { success, warning } = useToast();
  const [issues, setIssues] = useState<BackofficeIssueTicket[]>(BACKOFFICE_ISSUES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [selectedIssue, setSelectedIssue] = useState<BackofficeIssueTicket | null>(null);

  // New Issue Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<IssueCategory>('HARDWARE_FAULT');
  const [newPriority, setNewPriority] = useState<IssuePriority>('HIGH');
  const [newDeviceSn, setNewDeviceSn] = useState('LILYGO-S3-7080-8842A');
  const [newPetName, setNewPetName] = useState('โมจิ (Mochi)');
  const [newOwnerName, setNewOwnerName] = useState('สมชาย ใจดี');
  const [newOwnerPhone, setNewOwnerPhone] = useState('081-234-5678');
  const [newTechnician, setNewTechnician] = useState('วิศวกร ธนพล (Hardware Lead)');
  const [newDescription, setNewDescription] = useState('');

  // Edit Issue State
  const [editStatus, setEditStatus] = useState<IssueStatus>('OPEN');
  const [editResolutionNotes, setEditResolutionNotes] = useState('');

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      const matchSearch =
        iss.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        iss.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        iss.deviceSn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        iss.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        iss.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || iss.status === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || iss.priority === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [issues, searchQuery, statusFilter, priorityFilter]);

  // Handle open detail modal
  const handleOpenDetail = (issue: BackofficeIssueTicket) => {
    setSelectedIssue(issue);
    setEditStatus(issue.status);
    setEditResolutionNotes(issue.resolutionNotes || '');
  };

  // Save changes to issue
  const handleSaveIssue = () => {
    if (!selectedIssue) return;

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === selectedIssue.id) {
          return {
            ...item,
            status: editStatus,
            resolutionNotes: editResolutionNotes,
            resolvedAt: editStatus === 'RESOLVED' || editStatus === 'CLOSED' ? new Date().toISOString() : item.resolvedAt,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );

    success(`อัปเดตสถานะเคส ${selectedIssue.ticketCode} เรียบร้อยแล้ว`);
    setSelectedIssue(null);
  };

  // Create new issue ticket
  const handleCreateTicket = () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      warning('กรุณาระบุหัวข้อปัญหาและรายละเอียดให้ครบถ้วน');
      return;
    }

    const newCode = `TKT-2026-${Math.floor(Math.random() * 900) + 1100}`;
    const newRecord: BackofficeIssueTicket = {
      id: `tkt-${Date.now()}`,
      ticketCode: newCode,
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      status: 'OPEN',
      deviceSn: newDeviceSn,
      petName: newPetName,
      ownerName: newOwnerName,
      ownerPhone: newOwnerPhone,
      assignedTechnician: newTechnician,
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: newDescription,
    };

    setIssues([newRecord, ...issues]);
    success(`เปิดเคสแจ้งปัญหาใหม่ ${newCode} สำเร็จ`);
    setShowCreateModal(false);

    // Reset fields
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Backoffice Navigation */}
      <BackofficeNav />

      {/* Header and Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-surface-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-surface-900">
              ระบบแจ้งปัญหาและงานซ่อมบำรุงฮาร์ดแวร์ (Issue & Maintenance Dispatch)
            </h2>
          </div>
          <p className="text-xs text-surface-500 mt-0.5">
            บันทึกข้อร้องเรียน, ปัญหาฮาร์ดแวร์ขัดข้อง, แบตเตอรี่เสื่อมสภาพ, สุนัขพลัดหลง และการจัดการงานซ่อม RMA
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + แจ้งปัญหาใหม่ / เปิดเคส
          </Button>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-surface-200 shadow-sm">
          <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block mb-1">
            เคสเปิดอยู่ (Open)
          </span>
          <span className="text-2xl font-black text-rose-600 font-mono">
            {issues.filter((i) => i.status === 'OPEN').length}
          </span>
          <p className="text-[11px] text-surface-500 mt-1">ต้องเข้าดำเนินการ</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-surface-200 shadow-sm">
          <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block mb-1">
            กำลังตรวจสอบ (In Progress)
          </span>
          <span className="text-2xl font-black text-amber-500 font-mono">
            {issues.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'WAITING_PARTS').length}
          </span>
          <p className="text-[11px] text-surface-500 mt-1">ช่างกำลังตรวจเช็ค</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-surface-200 shadow-sm">
          <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block mb-1">
            แก้ไขแล้วเสร็จ (Resolved)
          </span>
          <span className="text-2xl font-black text-emerald-600 font-mono">
            {issues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length}
          </span>
          <p className="text-[11px] text-surface-500 mt-1">พร้อมปิดเคส</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-surface-200 shadow-sm">
          <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block mb-1">
            เวลาแก้ไขเฉลี่ย (MTTR)
          </span>
          <span className="text-2xl font-black text-blue-600 font-mono">3.2 ชม.</span>
          <p className="text-[11px] text-surface-500 mt-1">SLA Compliance 98.2%</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาตามรหัสเคส, ชื่อปัญหา, รหัสเครื่อง, หรือชื่อสุนัข..."
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
              <option value="ALL">ทุกสถานะงาน</option>
              <option value="OPEN">รอตรวจสอบ (Open)</option>
              <option value="IN_PROGRESS">กำลังดำเนินการ (In Progress)</option>
              <option value="WAITING_PARTS">รออะไหล่สำรอง (Waiting Parts)</option>
              <option value="RESOLVED">แก้ไขแล้ว (Resolved)</option>
              <option value="CLOSED">ปิดเคสสมบูรณ์ (Closed)</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-surface-200 bg-white font-bold text-surface-800 outline-none"
            >
              <option value="ALL">ทุกระดับความเร่งด่วน</option>
              <option value="CRITICAL">เร่งด่วนสูงสุด (Critical)</option>
              <option value="HIGH">ด่วนมาก (High)</option>
              <option value="MEDIUM">ปานกลาง (Medium)</option>
              <option value="LOW">ทั่วไป (Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-surface-200 text-surface-400">
            ไม่พบเคสแจ้งปัญหาที่ตรงกับเงื่อนไขการค้นหา
          </div>
        ) : (
          filteredIssues.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleOpenDetail(ticket)}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-surface-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-surface-900 text-sm">
                    {ticket.ticketCode}
                  </span>
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
                    {ticket.priority === 'CRITICAL'
                      ? 'เร่งด่วนสูงสุด'
                      : ticket.priority === 'HIGH'
                      ? 'ด่วนมาก'
                      : ticket.priority === 'MEDIUM'
                      ? 'ปานกลาง'
                      : 'ทั่วไป'}
                  </Badge>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-100 font-bold text-surface-600">
                    หมวด: {ticket.category}
                  </span>
                </div>

                <Badge
                  variant={
                    ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                      ? 'success'
                      : ticket.status === 'IN_PROGRESS' || ticket.status === 'WAITING_PARTS'
                      ? 'warning'
                      : 'danger'
                  }
                  className="text-xs"
                >
                  {ticket.status === 'OPEN'
                    ? 'รอดำเนินการ (Open)'
                    : ticket.status === 'IN_PROGRESS'
                    ? 'กำลังตรวจสอบ'
                    : ticket.status === 'WAITING_PARTS'
                    ? 'รออะไหล่สำรอง'
                    : 'แก้ไขสำเร็จ'}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-bold text-surface-900">{ticket.title}</h3>
                <p className="text-xs text-surface-600 mt-1 line-clamp-2 leading-relaxed">
                  {ticket.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-surface-500 pt-2 border-t border-surface-100">
                <div className="flex items-center gap-4 flex-wrap">
                  <span>🐕 สุนัข: <b>{ticket.petName}</b></span>
                  <span>📟 อุปกรณ์: <b className="font-mono">{ticket.deviceSn}</b></span>
                  <span>👤 เจ้าของ: {ticket.ownerName}</span>
                </div>
                <div className="flex items-center gap-2 text-surface-400">
                  <Wrench className="w-3.5 h-3.5 text-surface-500" />
                  <span>ผู้รับผิดชอบ: <b>{ticket.assignedTechnician}</b></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ticket Details & Action Modal */}
      {selectedIssue && (
        <Dialog
          isOpen={!!selectedIssue}
          onClose={() => setSelectedIssue(null)}
          title={`จัดการเคส: ${selectedIssue.ticketCode}`}
          description={selectedIssue.title}
          size="lg"
        >
          <div className="space-y-4 pt-2 text-xs">
            {/* Meta info */}
            <div className="p-3 bg-surface-50 rounded-xl border border-surface-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-surface-500 block text-[10px] font-bold">รหัสเครื่องที่เกิดปัญหา</span>
                <span className="font-mono font-bold text-surface-900">{selectedIssue.deviceSn}</span>
              </div>
              <div>
                <span className="text-surface-500 block text-[10px] font-bold">สุนัข & เจ้าของ</span>
                <span className="font-bold text-surface-900">
                  {selectedIssue.petName} ({selectedIssue.ownerName})
                </span>
              </div>
              <div>
                <span className="text-surface-500 block text-[10px] font-bold">เบอร์โทรศัพท์ติดต่อ</span>
                <span className="font-bold text-emerald-600">{selectedIssue.ownerPhone}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-700 mb-1">
                รายละเอียดปัญหาที่ได้รับแจ้ง
              </label>
              <div className="p-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-800 leading-relaxed">
                {selectedIssue.description}
              </div>
            </div>

            {/* Change Status */}
            <div>
              <label className="block text-xs font-bold text-surface-700 mb-1">
                อัปเดตสถานะงานซ่อม / การแก้ไข
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as IssueStatus)}
                className="w-full p-2.5 rounded-xl border border-surface-200 text-xs font-bold text-surface-900 outline-none"
              >
                <option value="OPEN">รอตรวจสอบ (OPEN)</option>
                <option value="IN_PROGRESS">กำลังดำเนินการซ่อม/ตรวจสอบ (IN_PROGRESS)</option>
                <option value="WAITING_PARTS">รออะไหล่สำรอง (WAITING_PARTS)</option>
                <option value="RESOLVED">แก้ไขสำเร็จ พร้อมส่งมอบ (RESOLVED)</option>
                <option value="CLOSED">ปิดเคสถาวร (CLOSED)</option>
              </select>
            </div>

            {/* Resolution Notes */}
            <div>
              <label className="block text-xs font-bold text-surface-700 mb-1">
                บันทึกการซ่อมบำรุง / รายการอะไหล่ที่เปลี่ยน (Resolution Notes)
              </label>
              <textarea
                rows={3}
                value={editResolutionNotes}
                onChange={(e) => setEditResolutionNotes(e.target.value)}
                placeholder="ระบุผลการตรวจสอบ การอัปเดตเฟิร์มแวร์ หรือการเปลี่ยนชิ้นส่วนฮาร์ดแวร์..."
                className="w-full p-2.5 rounded-xl border border-surface-200 text-xs text-surface-900 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-200">
              <Button variant="outline" size="sm" onClick={() => setSelectedIssue(null)}>
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveIssue}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                บันทึกการแก้ไขเคส
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Create New Ticket Modal */}
      {showCreateModal && (
        <Dialog
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="เปิดเคสแจ้งปัญหาใหม่ (Create Maintenance Ticket)"
          description="กรอกข้อมูลปัญหาฮาร์ดแวร์หรือเหตุขัดข้องเพื่อส่งต่อให้ทีมวิศวกรเข้าตรวจสอบ"
          size="lg"
        >
          <div className="space-y-4 pt-2 text-xs">
            <Input
              label="หัวข้อปัญหา (Title)"
              placeholder="เช่น สัญญาณเซลลูลาร์ขาดหาย หรือแบตเตอรี่คายประจุเร็ว..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-surface-700 mb-1">หมวดหมู่ปัญหา</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as IssueCategory)}
                  className="w-full p-2.5 rounded-xl border border-surface-200 text-xs font-bold text-surface-900 outline-none"
                >
                  <option value="HARDWARE_FAULT">ฮาร์ดแวร์ชำรุด / เสียหาย (Hardware Fault)</option>
                  <option value="CONNECTIVITY_ISSUE">สัญญาณขาดหาย (Connectivity Issue)</option>
                  <option value="BATTERY_DEGRADATION">แบตเตอรี่เสื่อมสภาพ (Battery Degradation)</option>
                  <option value="LOST_PET_EMERGENCY">สุนัขหลุดสูญหาย (Lost Pet Emergency)</option>
                  <option value="CUSTOMER_INQUIRY">คำถามทั่วไป / รีเซ็ต QR (Customer Inquiry)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 mb-1">ระดับความเร่งด่วน</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as IssuePriority)}
                  className="w-full p-2.5 rounded-xl border border-surface-200 text-xs font-bold text-surface-900 outline-none"
                >
                  <option value="CRITICAL">เร่งด่วนสูงสุด (Critical - สุนัขหลุดหาย)</option>
                  <option value="HIGH">ด่วนมาก (High - เครื่องไม่ตอบสนอง)</option>
                  <option value="MEDIUM">ปานกลาง (Medium - แบตเริ่มเสื่อม)</option>
                  <option value="LOW">ทั่วไป (Low)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="รหัสเครื่อง (Serial Number)"
                value={newDeviceSn}
                onChange={(e) => setNewDeviceSn(e.target.value)}
              />
              <Input
                label="ชื่อสุนัข (Pet Name)"
                value={newPetName}
                onChange={(e) => setNewPetName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="ชื่อเจ้าของ"
                value={newOwnerName}
                onChange={(e) => setNewOwnerName(e.target.value)}
              />
              <Input
                label="เบอร์โทรติดต่อ"
                value={newOwnerPhone}
                onChange={(e) => setNewOwnerPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-700 mb-1">รายละเอียดปัญหา</label>
              <textarea
                rows={3}
                placeholder="ระบุอาการผิดปกติ พฤติกรรมที่พบ หรือจุดสังเกต..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-surface-200 text-xs text-surface-900 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-200">
              <Button variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateTicket}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                ยืนยันเปิดเคส
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
