'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/contexts/toast-context';
import { DEMO_USERS } from '@/data/demo-users';
import { DEMO_PETS } from '@/data/demo-pets';
import { DEMO_DEVICES } from '@/data/demo-devices';
import { ACADEMIC_PROJECT_DATA, ProjectTask } from '@/data/academic-project';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GraduationCap,
  Users,
  PawPrint,
  Cpu,
  Radio,
  Server,
  Database,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Send,
  Terminal,
  ExternalLink,
  Layers,
  Search,
  Filter,
  Check,
  RefreshCw,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  Sliders,
  PlayCircle,
  HeartHandshake,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

type AdminTab = 'academic' | 'tasks' | 'health' | 'tools' | 'directory';

export default function AdminPage() {
  const { user } = useAuth();
  const { t, locale } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('academic');
  const [tasks, setTasks] = useState<ProjectTask[]>(ACADEMIC_PROJECT_DATA.tasks);
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // IoT Simulator State
  const [simDevice, setSimDevice] = useState('dev_lilygo_01');
  const [simLat, setSimLat] = useState('13.73671');
  const [simLng, setSimLng] = useState('100.56041');
  const [simBattery, setSimBattery] = useState(88);
  const [simSpeed, setSimSpeed] = useState(2.4);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatorResponse, setSimulatorResponse] = useState<any>(null);

  const totalUsers = DEMO_USERS.length;
  const totalPets = DEMO_PETS.length;
  const totalDevices = DEMO_DEVICES.length;
  const activeDevices = DEMO_DEVICES.filter((d) => d.isOnline).length;

  // Task calculation
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const overallProgressPercentage = Math.round(
    tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length
  );

  const filteredTasks = tasks.filter((task) => {
    const matchesPhase = phaseFilter === 'all' || task.phase === phaseFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesPhase && matchesStatus;
  });

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((item) => {
        if (item.id !== taskId) return item;
        let nextStatus: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' = 'COMPLETED';
        let nextProgress = 100;
        if (item.status === 'COMPLETED') {
          nextStatus = 'IN_PROGRESS';
          nextProgress = 70;
        } else if (item.status === 'IN_PROGRESS') {
          nextStatus = 'PENDING';
          nextProgress = 0;
        } else {
          nextStatus = 'COMPLETED';
          nextProgress = 100;
        }
        return { ...item, status: nextStatus, progress: nextProgress };
      })
    );
    showToast({
      type: 'info',
      title: 'อัปเดตสถานะงานโครงงาน',
      message: 'ปรับปรุงความคืบหน้าของ Task เรียบร้อยแล้ว',
    });
  };

  const handleRunSimulateLocation = async () => {
    setIsSimulating(true);
    try {
      const payload = {
        deviceId: simDevice,
        messageId: `${simDevice}-test-${Date.now()}`,
        sequence: Math.floor(Math.random() * 9000) + 1000,
        sentAt: new Date().toISOString(),
        firmwareVersion: '1.0.0',
        latitude: parseFloat(simLat),
        longitude: parseFloat(simLng),
        altitude: 12.5,
        speed: simSpeed,
        heading: 90,
        accuracy: 3.2,
        satellites: 12,
        hdop: 0.8,
        batteryLevel: simBattery,
        batteryVoltage: 4.12,
        signalStrength: 82,
        networkType: 'LTE_CAT_M1',
        gpsStatus: 'FIX_3D',
      };

      const res = await fetch('/api/iot/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Key':
            simDevice === 'dev_lilygo_01'
              ? 'paws-demo-device-key-change-me'
              : 'paws-demo-device-key-2-change-me',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setSimulatorResponse({
        httpStatus: res.status,
        timestamp: new Date().toLocaleTimeString(),
        request: payload,
        response: data,
      });

      showToast({
        type: 'success',
        title: 'ยิง Telemetry สำเร็จ (HTTP 200 OK)',
        message: `ส่งพิกัดดาวเทียม GNSS ของ ${simDevice} ไปยังเซิร์ฟเวอร์แล้ว`,
      });
    } catch (err: any) {
      setSimulatorResponse({
        httpStatus: 500,
        error: err.message || 'Simulation failed',
      });
      showToast({
        type: 'error',
        title: 'การส่งข้อมูลจำลองล้มเหลว',
        message: err.message,
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRunSimulateHeartbeat = async () => {
    setIsSimulating(true);
    try {
      const payload = {
        deviceId: simDevice,
        messageId: `${simDevice}-hb-${Date.now()}`,
        sentAt: new Date().toISOString(),
        firmwareVersion: '1.0.0',
        batteryLevel: simBattery,
        batteryVoltage: 4.05,
        signalStrength: 75,
        networkType: 'LTE_CAT_M1',
        gpsStatus: 'SEARCHING',
      };

      const res = await fetch('/api/iot/heartbeat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Key':
            simDevice === 'dev_lilygo_01'
              ? 'paws-demo-device-key-change-me'
              : 'paws-demo-device-key-2-change-me',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setSimulatorResponse({
        httpStatus: res.status,
        timestamp: new Date().toLocaleTimeString(),
        request: payload,
        response: data,
      });

      showToast({
        type: 'info',
        title: 'Heartbeat สำเร็จ (Online Keep-Alive)',
        message: `อัปเดตสถานะบอร์ด ${simDevice} ถึงแม้ยังไม่พบสัญญาณดาวเทียม`,
      });
    } catch (err: any) {
      setSimulatorResponse({
        httpStatus: 500,
        error: err.message || 'Heartbeat failed',
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Academic Capstone Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-950 via-surface-900 to-primary-950 p-6 sm:p-8 text-white shadow-xl border border-surface-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                <GraduationCap className="w-4 h-4 text-primary-400" />
                {ACADEMIC_PROJECT_DATA.code}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-surface-200">
                {ACADEMIC_PROJECT_DATA.academicYear} · {ACADEMIC_PROJECT_DATA.semester}
              </span>
              <Badge variant="primary" size="sm">
                {t('admin.demoBadge')}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              {locale === 'th' ? ACADEMIC_PROJECT_DATA.titleTh : ACADEMIC_PROJECT_DATA.titleEn}
            </h1>
            <p className="text-sm sm:text-base text-surface-300 font-medium">
              {locale === 'th' ? ACADEMIC_PROJECT_DATA.titleEn : ACADEMIC_PROJECT_DATA.titleTh}
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-surface-400 pt-1">
              <span>🏛️ {locale === 'th' ? ACADEMIC_PROJECT_DATA.faculty : ACADEMIC_PROJECT_DATA.facultyEn}</span>
              <span>•</span>
              <span>🎓 {locale === 'th' ? ACADEMIC_PROJECT_DATA.department : ACADEMIC_PROJECT_DATA.departmentEn}</span>
              <span>•</span>
              <span>📅 สอบจบโครงงาน: {ACADEMIC_PROJECT_DATA.defenseDate}</span>
            </div>
          </div>

          {/* Quick Progress Ring / Card */}
          <div className="flex-shrink-0 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-w-[200px]">
            <span className="text-xs uppercase tracking-wider text-surface-400 font-bold mb-1">
              ความคืบหน้าโครงงานรวม
            </span>
            <div className="text-4xl font-extrabold text-primary-400">
              {overallProgressPercentage}%
            </div>
            <div className="w-full bg-surface-700/60 h-2 rounded-full overflow-hidden mt-3 mb-1">
              <div
                className="bg-gradient-to-r from-primary-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallProgressPercentage}%` }}
              />
            </div>
            <span className="text-[11px] text-surface-300 mt-1">
              {completedTasks}/{tasks.length} งานเสร็จสมบูรณ์ ({inProgressTasks} กำลังดำเนินการ)
            </span>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Core KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5 bg-white border border-surface-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-surface-500 block truncate">ความก้าวหน้าวิทยานิพนธ์</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-surface-900">{overallProgressPercentage}%</span>
              <span className="text-xs text-primary-600 font-bold">Phase 1-3</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-white border border-surface-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-secondary-50 text-secondary-600 border border-secondary-100 flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-surface-500 block truncate">{t('admin.totalUsers')}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-surface-900">{totalUsers}</span>
              <span className="text-xs text-surface-500 font-medium">บัญชีในระบบ</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-white border border-surface-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex-shrink-0">
            <PawPrint className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-surface-500 block truncate">{t('admin.totalPets')}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-surface-900">{totalPets}</span>
              <span className="text-xs text-surface-500 font-medium">สุนัขทดสอบ</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-white border border-surface-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex-shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-surface-500 block truncate">{t('admin.totalDevices')}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-surface-900">{activeDevices}/{totalDevices}</span>
              <span className="text-xs text-emerald-600 font-bold">ออนไลน์</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-surface-200/80 custom-scrollbar">
        <button
          onClick={() => setActiveTab('academic')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200',
            activeTab === 'academic'
              ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
              : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
          )}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{t('admin.academicTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200',
            activeTab === 'tasks'
              ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
              : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
          )}
        >
          <Clock className="w-4 h-4" />
          <span>{t('admin.tasksTab')}</span>
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/20 text-current">
            {tasks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200',
            activeTab === 'health'
              ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
              : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
          )}
        >
          <Activity className="w-4 h-4" />
          <span>{t('admin.healthTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('tools')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200',
            activeTab === 'tools'
              ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
              : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
          )}
        >
          <Sliders className="w-4 h-4" />
          <span>{t('admin.toolsTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200',
            activeTab === 'directory'
              ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
              : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
          )}
        >
          <Users className="w-4 h-4" />
          <span>{t('admin.directoryTab')}</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: ACADEMIC PROJECT & TEAM PROFILE                        */}
      {/* ============================================================ */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          {/* Advisors Card */}
          <Card className="p-6 bg-white border border-surface-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-surface-100">
              <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-surface-900">{t('admin.advisorLabel')}</h2>
                <p className="text-xs text-surface-500">
                  อาจารย์ผู้ควบคุมและให้คำปรึกษาทางวิชาการตลอดการดำเนินโครงงาน
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACADEMIC_PROJECT_DATA.advisors.map((adv, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-surface-50 border border-surface-200/60 flex items-start gap-3.5 hover:border-primary-200 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary-600 to-emerald-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm">
                    {adv.name.slice(3, 4) || 'อ'}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-surface-900 text-sm sm:text-base">{adv.name}</span>
                      <Badge variant="primary" size="sm">
                        {idx === 0 ? 'ที่ปรึกษาหลัก' : 'ที่ปรึกษาร่วม'}
                      </Badge>
                    </div>
                    <p className="text-xs text-surface-500">{adv.nameEn}</p>
                    <p className="text-xs text-surface-600 font-medium">{adv.department}</p>
                    <p className="text-xs text-primary-600 font-mono">{adv.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Student Team Members Cards */}
          <Card className="p-6 bg-white border border-surface-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-surface-100">
              <div className="p-2.5 rounded-xl bg-secondary-50 text-secondary-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-surface-900">{t('admin.teamLabel')}</h2>
                <p className="text-xs text-surface-500">
                  นักศึกษาผู้จัดทำโครงงานปริญญานิพนธ์ ภาควิชาวิศวกรรมคอมพิวเตอร์
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {ACADEMIC_PROJECT_DATA.teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-5 rounded-2xl bg-white border border-surface-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-primary-100 shadow-sm"
                      />
                      <div>
                        <h4 className="font-bold text-surface-900 text-sm sm:text-base leading-tight">
                          {member.name}
                        </h4>
                        <span className="font-mono text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                          รหัสนักศึกษา {member.studentId}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-surface-100 text-surface-800 border border-surface-200">
                        {member.role}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-surface-100">
                      <span className="text-[11px] font-bold text-surface-400 uppercase tracking-wider block">
                        หน้าที่รับผิดชอบหลัก:
                      </span>
                      <ul className="space-y-1 text-xs text-surface-600 list-disc list-inside">
                        {member.responsibilities.map((resp, rIdx) => (
                          <li key={rIdx} className="leading-relaxed">
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-between text-xs text-surface-500 font-mono">
                    <span>{member.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Objectives and Scope Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Objectives */}
            <Card className="p-6 bg-white border border-surface-200/80 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-100">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900">{t('admin.objectivesLabel')}</h3>
                  <p className="text-xs text-surface-500">เป้าหมายเชิงผลลัพธ์ของโครงงานวิจัย 4 ประการ</p>
                </div>
              </div>

              <div className="space-y-3">
                {ACADEMIC_PROJECT_DATA.objectives.map((obj) => (
                  <div
                    key={obj.id}
                    className="p-3.5 rounded-xl bg-surface-50 border border-surface-100 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-surface-800 leading-snug">
                        {obj.textTh}
                      </p>
                      <p className="text-[11px] text-surface-500 italic">{obj.textEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Scope of Work */}
            <Card className="p-6 bg-white border border-surface-200/80 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-100">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900">{t('admin.scopeLabel')}</h3>
                  <p className="text-xs text-surface-500">ขอบเขตทางเทคนิคและสถาปัตยกรรมระบบ</p>
                </div>
              </div>

              <div className="space-y-3">
                {ACADEMIC_PROJECT_DATA.scopeItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-surface-50 border border-surface-100 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary-700">{item.category}</span>
                      <span className="text-[11px] font-mono text-surface-400">{item.categoryEn}</span>
                    </div>
                    <p className="text-xs text-surface-700 leading-relaxed">{item.detailTh}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: MILESTONES & TASK TRACKER                              */}
      {/* ============================================================ */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Phase Filter & Overview Header */}
          <Card className="p-5 bg-white border border-surface-200/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-surface-900">
                  ตารางความคืบหน้าโครงงานวิจัย (Task Progress & Milestones)
                </h2>
                <p className="text-xs text-surface-500">
                  ติดตามผลการส่งมอบงานแบ่งตาม Phase ทั้งฝั่ง WebApp, IoT Firmware และการทดสอบภาคสนาม
                </p>
              </div>

              {/* Status counter pills */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  สำเร็จ: {completedTasks} งาน
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  กำลังทำ: {inProgressTasks} งาน
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-surface-100">
              <span className="text-xs font-bold text-surface-400 mr-2">เลือก Phase:</span>
              <button
                onClick={() => setPhaseFilter('all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors',
                  phaseFilter === 'all'
                    ? 'bg-surface-900 text-white'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                )}
              >
                ทุก Phase ({tasks.length})
              </button>
              <button
                onClick={() => setPhaseFilter('phase1')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors',
                  phaseFilter === 'phase1'
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                )}
              >
                Phase 1: WebApp (4)
              </button>
              <button
                onClick={() => setPhaseFilter('phase2')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors',
                  phaseFilter === 'phase2'
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                )}
              >
                Phase 2: IoT Firmware (4)
              </button>
              <button
                onClick={() => setPhaseFilter('phase3')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors',
                  phaseFilter === 'phase3'
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                )}
              >
                Phase 3: Testing & Defense (3)
              </button>
            </div>
          </Card>

          {/* Task Items List */}
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const isCompleted = task.status === 'COMPLETED';
              const isInProgress = task.status === 'IN_PROGRESS';

              return (
                <Card
                  key={task.id}
                  className={cn(
                    'p-5 bg-white border transition-all duration-200 hover:shadow-md',
                    isCompleted
                      ? 'border-emerald-200/80 bg-emerald-50/10'
                      : isInProgress
                      ? 'border-amber-200/80 bg-amber-50/10'
                      : 'border-surface-200'
                  )}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-surface-100 text-surface-700">
                          {task.phaseName}
                        </span>
                        <Badge
                          variant={isCompleted ? 'success' : isInProgress ? 'warning' : 'surface'}
                          size="sm"
                        >
                          {isCompleted
                            ? 'เสร็จสมบูรณ์'
                            : isInProgress
                            ? 'กำลังดำเนินการ'
                            : 'รอดำเนินการ'}
                        </Badge>
                        <span className="text-xs text-surface-400 font-mono">
                          กำหนดส่ง: {task.dueDate}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-surface-900 leading-snug">
                        {task.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                        {task.description}
                      </p>

                      {/* Deliverables Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-bold text-surface-400 mr-1">ผลลัพธ์:</span>
                        {task.deliverables.map((del, dIdx) => (
                          <span
                            key={dIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-100 text-surface-700 text-[11px] font-medium"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            {del}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="flex flex-col items-start lg:items-end justify-between min-w-[200px] space-y-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-surface-100">
                      <div className="w-full text-left lg:text-right">
                        <div className="flex items-center justify-between lg:justify-end gap-2 mb-1">
                          <span className="text-xs text-surface-500 font-medium">ผู้รับผิดชอบ:</span>
                          <span className="text-xs font-bold text-surface-800">{task.assignee}</span>
                        </div>
                        <div className="w-full bg-surface-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-300',
                              isCompleted
                                ? 'bg-emerald-500'
                                : isInProgress
                                ? 'bg-amber-500'
                                : 'bg-surface-300'
                            )}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-surface-400 block mt-1">
                          ความคืบหน้า {task.progress}%
                        </span>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className="text-xs font-semibold w-full sm:w-auto"
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-surface-500" />
                        สลับสถานะจำลอง
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: SYSTEM HEALTH & INFRASTRUCTURE                         */}
      {/* ============================================================ */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {/* Main Health Status Panel */}
          <Card className="p-6 bg-surface-900 text-white border-surface-700 shadow-xl">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-surface-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    สถานะการทำงานของโครงสร้างพื้นฐาน (Infrastructure Health)
                  </h3>
                  <p className="text-xs text-surface-400">
                    ตรวจสอบความพร้อมของระบบ API Gateway, ฐานข้อมูล PostgreSQL และช่องทางรับข้อมูล Cellular
                  </p>
                </div>
              </div>
              <Badge variant="success" size="md">
                ระบบทำงานปกติ 100%
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-surface-800/90 border border-surface-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-surface-300">API Gateway (Next.js 14)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-base font-bold text-emerald-400">HTTP 200 OK</p>
                <div className="space-y-1 text-[11px] text-surface-400 font-mono">
                  <p>• Uptime: 99.98%</p>
                  <p>• Latency: ~12ms</p>
                  <p>• 19 Active Endpoints</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-800/90 border border-surface-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-surface-300">Database (PostgreSQL / Prisma)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-base font-bold text-emerald-400">Connected</p>
                <div className="space-y-1 text-[11px] text-surface-400 font-mono">
                  <p>• Prisma Client v6.2 (Active)</p>
                  <p>• 9 Relational Models</p>
                  <p>• Fallback Local JSONL Storage</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-800/90 border border-surface-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-surface-300">Cellular IoT Telemetry Receiver</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-base font-bold text-emerald-400">Ready for Cat-M1 / NB-IoT</p>
                <div className="space-y-1 text-[11px] text-surface-400 font-mono">
                  <p>• Authentication: X-Device-Key</p>
                  <p>• Idempotency Check: Active</p>
                  <p>• Polling Rate: 10s Dashboard</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Endpoints Audit Table */}
          <Card className="p-6 bg-white border border-surface-200/80 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-surface-900">
              สารบบ API Endpoints สำหรับโครงงาน (19 HTTP Routes)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-50 border border-surface-200 font-mono">
                <span className="font-bold text-primary-600 block mb-1">🔐 Authentication</span>
                <p className="text-surface-600">POST /api/auth/login</p>
                <p className="text-surface-600">POST /api/auth/signup</p>
                <p className="text-surface-600">POST /api/auth/logout</p>
                <p className="text-surface-600">GET  /api/auth/me</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-50 border border-surface-200 font-mono">
                <span className="font-bold text-emerald-600 block mb-1">🛰️ IoT Telemetry & Hardware</span>
                <p className="text-surface-600">POST /api/iot/location (GNSS)</p>
                <p className="text-surface-600">POST /api/iot/heartbeat</p>
                <p className="text-surface-600">GET  /api/iot/config</p>
                <p className="text-surface-600">PUT  /api/iot/config</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-50 border border-surface-200 font-mono">
                <span className="font-bold text-secondary-600 block mb-1">🐕 Pets & Public QR Tag</span>
                <p className="text-surface-600">GET/POST /api/pets</p>
                <p className="text-surface-600">GET/PUT/DELETE /api/pets/[id]</p>
                <p className="text-surface-600">GET /api/pets/[id]/history</p>
                <p className="text-surface-600">GET /api/pet/[qrId]</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: IOT TEST BENCH & SIMULATOR                             */}
      {/* ============================================================ */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white border border-surface-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-surface-100">
              <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-surface-900">
                  เครื่องมือทดสอบส่งพิกัดจำลอง (IoT Telemetry Test Bench)
                </h2>
                <p className="text-xs text-surface-500">
                  สำหรับอาจารย์ที่ปรึกษาและกรรมการสอบทดสอบยิงพิกัดเสมือนจากบอร์ด LILYGO ESP32-S3 เข้าเซิร์ฟเวอร์จริง
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-surface-700 block mb-1.5">
                  อุปกรณ์ทดสอบ (Device)
                </label>
                <select
                  value={simDevice}
                  onChange={(e) => setSimDevice(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-surface-300 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="dev_lilygo_01">dev_lilygo_01 (โมจิ - Golden Retriever)</option>
                  <option value="dev_lilygo_02">dev_lilygo_02 (ลัคกี้ - Shiba Inu)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-surface-700 block mb-1.5">
                  ละติจูด (Latitude)
                </label>
                <Input
                  value={simLat}
                  onChange={(e) => setSimLat(e.target.value)}
                  placeholder="13.73671"
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-surface-700 block mb-1.5">
                  ลองจิจูด (Longitude)
                </label>
                <Input
                  value={simLng}
                  onChange={(e) => setSimLng(e.target.value)}
                  placeholder="100.56041"
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-surface-700 block mb-1.5">
                  แบตเตอรี่ ({simBattery}%)
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={simBattery}
                  onChange={(e) => setSimBattery(Number(e.target.value))}
                  className="w-full accent-primary mt-2"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={handleRunSimulateLocation}
                disabled={isSimulating}
                className="font-bold text-xs"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {isSimulating ? 'กำลังส่งข้อมูล...' : 'ส่งพิกัด GNSS ไปยัง /api/iot/location'}
              </Button>

              <Button
                variant="secondary"
                onClick={handleRunSimulateHeartbeat}
                disabled={isSimulating}
                className="font-bold text-xs"
              >
                <Activity className="w-3.5 h-3.5 mr-1.5 text-primary" />
                ส่ง Heartbeat (Offline Fix)
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSimLat('13.73165');
                  setSimLng('100.55935');
                  showToast({
                    type: 'info',
                    title: 'รีเซ็ตพิกัดจำลอง',
                    message: 'กำหนดพิกัดกลับสู่บริเวณบ้านสุขุมวิท 21',
                  });
                }}
                className="text-xs text-surface-500"
              >
                รีเซ็ตพิกัดเริ่มต้น
              </Button>
            </div>

            {/* Response Console Box */}
            {simulatorResponse && (
              <div className="rounded-2xl bg-surface-950 p-4 border border-surface-800 text-surface-200 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-surface-400 border-b border-surface-800 pb-2">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Server Response Output · {simulatorResponse.timestamp}
                  </span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[11px] font-bold',
                      simulatorResponse.httpStatus === 200
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    )}
                  >
                    HTTP {simulatorResponse.httpStatus}
                  </span>
                </div>
                <pre className="overflow-x-auto text-[11px] text-emerald-300 custom-scrollbar p-1">
                  {JSON.stringify(simulatorResponse.response || simulatorResponse.error, null, 2)}
                </pre>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: USERS & DEVICE DIRECTORY                               */}
      {/* ============================================================ */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Users Directory Table */}
          <Card className="p-6 bg-white border border-surface-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-surface-900">
                  {t('admin.usersTable')}
                </h3>
                <p className="text-xs text-surface-500">
                  บัญชีผู้ใช้งานที่ลงทะเบียนในฐานข้อมูลระบบ Paws&Co.
                </p>
              </div>
              <Badge variant="surface" size="md">
                ทั้งหมด {DEMO_USERS.length} บัญชี
              </Badge>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-surface-50 border-y border-surface-200 text-surface-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">ชื่อผู้ใช้</th>
                    <th className="py-3 px-4">อีเมล</th>
                    <th className="py-3 px-4">บทบาท (Role)</th>
                    <th className="py-3 px-4">เบอร์โทรศัพท์</th>
                    <th className="py-3 px-4">วันที่สมัคร</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {DEMO_USERS.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-50/50">
                      <td className="py-3 px-4 font-bold text-surface-900">{u.displayName}</td>
                      <td className="py-3 px-4 text-surface-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={u.role === 'ADMIN' ? 'primary' : 'surface'} size="sm">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-surface-600">{u.phoneNumber || '-'}</td>
                      <td className="py-3 px-4 text-surface-500">
                        {formatDate(u.createdAt, locale, false)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pets Directory Table */}
          <Card className="p-6 bg-white border border-surface-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-surface-900">
                  {t('admin.petsTable')}
                </h3>
                <p className="text-xs text-surface-500">
                  สุนัขที่จับคู่กับบอร์ดทดลอง LILYGO T-SIM7080G-S3 ESP32-S3
                </p>
              </div>
              <Badge variant="surface" size="md">
                ทั้งหมด {DEMO_PETS.length} ตัว
              </Badge>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-surface-50 border-y border-surface-200 text-surface-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">สัตว์เลี้ยง</th>
                    <th className="py-3 px-4">สายพันธุ์</th>
                    <th className="py-3 px-4">MAC Address</th>
                    <th className="py-3 px-4">แบตเตอรี่</th>
                    <th className="py-3 px-4">สถานะบอร์ด</th>
                    <th className="py-3 px-4">QR Code Tag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {DEMO_PETS.map((p) => {
                    const isOnline = p.device?.isOnline ?? true;
                    return (
                      <tr key={p.id} className="hover:bg-surface-50/50">
                        <td className="py-3 px-4 font-bold text-surface-900 flex items-center gap-2">
                          <img
                            src={p.primaryPhotoUrl}
                            alt={p.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span>{p.name}</span>
                        </td>
                        <td className="py-3 px-4 text-surface-600">{p.breed}</td>
                        <td className="py-3 px-4 font-mono text-xs text-surface-600">
                          {p.device?.macAddress || 'C4:DE:E2:88:42:0A'}
                        </td>
                        <td className="py-3 px-4 font-bold text-surface-800">
                          {p.device?.batteryLevel || 85}%
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={isOnline ? 'success' : 'surface'} size="sm" dot>
                            {isOnline ? 'Online' : 'Offline'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-primary font-bold">
                          {p.qrCodeId}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
