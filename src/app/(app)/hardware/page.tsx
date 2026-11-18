'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DEMO_DEVICES } from '@/data/demo-devices';
import { DEMO_PETS } from '@/data/demo-pets';
import { useToast } from '@/contexts/toast-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import {
  Battery,
  Plus,
  HelpCircle,
  Volume2,
  RotateCcw,
  Sparkles,
  Droplets,
  Satellite,
  Lightbulb,
  Shield,
  BellRing,
  Heart,
  Smartphone,
  CheckCircle2,
  Wifi,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ================= CUSTOMER-FRIENDLY COLLAR FEATURES =================
interface CollarFeature {
  id: string;
  icon: React.ReactNode;
  title: string;
  shortDesc: string;
  detail: string;
  tip: string;
}

const COLLAR_FEATURES: CollarFeature[] = [
  {
    id: 'feat_waterproof',
    icon: <Droplets className="w-5 h-5 text-sky-500" />,
    title: 'กันน้ำ 100% เล่นน้ำ ตากฝน ลุยโคลนได้สบาย',
    shortDesc: 'ตัวเครื่องซีลกันน้ำรอบทิศทาง ไม่ต้องกังวลเมื่อน้องหมาเล่นซน',
    detail:
      'ปลอกคอได้รับการออกแบบและซีลยางกันน้ำอย่างหนาแน่น น้องหมาสามารถใส่ว่ายน้ำ ลุยฝน หรือวิ่งเล่นในสนามหญ้าที่เปียกชื้นได้ตลอดทั้งวันโดยไม่ต้องถอดออก และสามารถล้างทำความสะอาดด้วยน้ำเปล่าได้เลย',
    tip: 'เหมาะมากสำหรับสุนัขที่ชอบวิ่งเล่นกลางแจ้งหรือชอบเล่นน้ำ',
  },
  {
    id: 'feat_battery',
    icon: <Battery className="w-5 h-5 text-emerald-500" />,
    title: 'แบตเตอรี่อึด ชาร์จครั้งเดียวอยู่ได้ 3–7 วัน',
    shortDesc: 'มีโหมดประหยัดพลังงานอัตโนมัติ ชาร์จง่ายด้วยสายชาร์จมือถือ Type-C',
    detail:
      'เมื่อน้องหมานอนพักผ่อนอยู่ในบ้าน ปลอกคอจะปรับเข้าสู่โหมดประหยัดแบตเตอรี่โดยอัตโนมัติ ทำให้ใช้งานได้ยาวนานเกือบสัปดาห์ และเมื่อแบตหมด สามารถชาร์จด้วยสาย USB Type-C ทั่วไป เต็มเร็วภายใน 1.5 ชั่วโมง',
    tip: 'มีระบบเตือนผ่านมือถือทันทีเมื่อแบตเตอรี่เหลือต่ำกว่า 20%',
  },
  {
    id: 'feat_gps',
    icon: <Satellite className="w-5 h-5 text-indigo-500" />,
    title: 'รู้ตำแหน่งน้องหมาตลอดเวลา ทุกที่ทั่วไทย',
    shortDesc: 'ระบุพิกัดดาวเทียมแม่นยำ พร้อมส่งข้อมูลเข้ามือถือคุณแบบเรียลไทม์',
    detail:
      'ระบบดาวเทียมความแม่นยำสูงช่วยให้คุณเปิดดูตำแหน่งของน้องหมาบนแผนที่ได้ทันที ไม่ว่าน้องจะแอบวิ่งออกไปนอกบ้านหรือไปเที่ยวเล่นที่ไหน ช่วยให้ตามหาน้องเจออย่างรวดเร็วและปลอดภัย',
    tip: 'สามารถตั้งรั้วบ้านปลอดภัย (Safe Zone) เพื่อรับแจ้งเตือนเมื่อน้องแอบออกนอกบ้านได้',
  },
  {
    id: 'feat_light',
    icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
    title: 'มีไฟ LED ส่องสว่าง ปลอดภัยเวลาน้องเดินเล่นตอนกลางคืน',
    shortDesc: 'กดสั่งเปิดไฟที่ปลอกคอผ่านแอปได้ทันทีเมื่อเริ่มมืด',
    detail:
      'เวลาพาน้องหมาไปเดินเล่นยามค่ำคืน คุณสามารถกดเปิดไฟส่องสว่างที่ตัวปลอกคอ เพื่อให้คนเดินถนนและรถยนต์บนท้องถนนมองเห็นน้องหมาได้อย่างชัดเจนจากระยะไกล ป้องกันอุบัติเหตุได้อย่างดีเยี่ยม',
    tip: 'เลือกปรับเป็นไฟค้างหรือไฟกระพริบได้จากหน้าแอป',
  },
  {
    id: 'feat_sound',
    icon: <BellRing className="w-5 h-5 text-rose-500" />,
    title: 'กดส่งเสียงเรียกหาน้องหมาได้จากระยะไกล',
    shortDesc: 'เสียงบี๊บที่ปลอกคอช่วยตามหาน้องเวลาไปแอบซ่อน หรือใช้ฝึกเรียกกลับบ้าน',
    detail:
      'หากคุณหาน้องหมาไม่เจอเพราะน้องชอบไปแอบใต้เตียง หรือหลังพุ่มไม้ เพียงกดปุ่ม "ส่งเสียงเรียก" ในแอป ปลอกคอจะส่งเสียง Beep ทันที ช่วยให้คุณเดินตามหาต้นเสียงได้ง่ายๆ หรือจะใช้ฝึกเป็นสัญญาณเรียกน้องหมากินข้าวก็ได้',
    tip: 'ระดับเสียงปลอดภัยต่อหูของสุนัข ไม่ทำให้ตกใจหรือแสบแก้วหู',
  },
  {
    id: 'feat_comfort',
    icon: <Shield className="w-5 h-5 text-teal-500" />,
    title: 'น้ำหนักเบา นุ่มสบาย สวมใส่ได้ทั้งวันไม่อึดอัด',
    shortDesc: 'น้ำหนักเบาเพียง 48 กรัม ออกแบบตามสรีระน้องหมา ไม่กดทับหลอดลม',
    detail:
      'ออกแบบตัวเรือนโค้งมนรับกับลำคอน้องหมา ไม่มีเหลี่ยมคม และมีรูระบายอากาศป้องกันความอับชื้นใต้ขน น้ำหนักเบามากจนน้องหมาแทบไม่รู้สึกว่ากำลังสวมใส่ สุนัขพันธุ์เล็กถึงใหญ่สามารถใส่ติดตัวได้ทั้งวันอย่างมีความสุข',
    tip: 'สายปลอกคอสามารถปรับระดับความยาวให้พอดีกับน้องหมาได้ทุกขนาด',
  },
];

// ================= CUSTOMER FAQS =================
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const COLLAR_FAQS: FaqItem[] = [
  {
    id: 'faq_1',
    question: 'ต้องชาร์จแบตเตอรี่บ่อยไหม และใช้งานได้กี่วัน?',
    answer:
      'ชาร์จ 1 ครั้งใช้งานได้เฉลี่ย 3 ถึง 7 วันครับ หากน้องหมาพักผ่อนอยู่ในบ้าน ปลอกคอจะประหยัดพลังงานอัตโนมัติ ทำให้แบตเตอรี่อยู่ได้นานเกือบสัปดาห์ และเมื่อต้องชาร์จ ใช้สายชาร์จมือถือ USB Type-C เสียบเพียง 1 ชั่วโมงครึ่งก็เต็มแล้วครับ',
  },
  {
    id: 'faq_2',
    question: 'น้องหมาใส่เล่นน้ำ ลุยฝน หรือว่ายน้ำได้จริงไหม?',
    answer:
      'ใส่เล่นน้ำได้สบายเลยครับ ปลอกคอมีซีลกันน้ำมาตรฐานสูง (IP67) น้องหมาสามารถว่ายน้ำในสระ วิ่งตากฝน หรือเล่นโคลนได้เต็มที่ เมื่อกลับเข้าบ้านสามารถใช้น้ำสะอาดล้างปลอกคอได้โดยตรงเลยครับ',
  },
  {
    id: 'faq_3',
    question: 'ต้องซื้อซิมการ์ดหรือเติมเงินอินเทอร์เน็ตเองไหม?',
    answer:
      'ไม่ต้องยุ่งยากเลยครับ ปลอกคอมาพร้อมซิมการ์ดและแพ็กเกจสัญญาณสำหรับติดตามสัตว์เลี้ยงในตัวพร้อมใช้งานทันที กินอินเทอร์เน็ตน้อยมาก และระบบดูแลเรื่องการเชื่อมต่อให้โดยอัตโนมัติ',
  },
  {
    id: 'faq_4',
    question: 'ถ้าน้องหมาหลุดเข้าไปในที่ไม่มีสัญญาณ จะรู้ตำแหน่งไหม?',
    answer:
      'ปลอกคอมีความจำบันทึกเส้นทางในตัวครับ แม้น้องจะแอบมุดเข้าไปในที่อับสัญญาณ ตัวปลอกคอจะบันทึกทุกก้าวเดินไว้ในตัวเครื่อง และทันทีที่กลับมามีสัญญาณ ข้อมูลเส้นทางทั้งหมดจะอัปเดตกลับเข้ามือถือของคุณทันที ไม่สูญหายแน่นอนครับ',
  },
  {
    id: 'faq_5',
    question: 'จะรู้ได้อย่างไรว่าแบตเตอรี่ของปลอกคอใกล้หมด?',
    answer:
      'ระบบจะส่งการแจ้งเตือนเตือนเข้ามือถือของคุณทันทีเมื่อแบตเตอรี่เหลือต่ำกว่า 20% และไฟดวงเล็กบนปลอกคอจะกระพริบเตือนสีแดง เพื่อให้คุณถอดมาชาร์จได้อย่างทันท่วงทีครับ',
  },
];

export default function HardwarePage() {
  const { showToast } = useToast();

  const [devices] = useState(DEMO_DEVICES);
  const [pets] = useState(DEMO_PETS);
  const [showPairModal, setShowPairModal] = useState(false);
  const [collarCodeInput, setCollarCodeInput] = useState('');
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || '');
  const [isPairing, setIsPairing] = useState(false);

  // Night light toggle state per collar
  const [activeLights, setActiveLights] = useState<Record<string, boolean>>({});

  // Accordion open states
  const [openCollars, setOpenCollars] = useState<Record<string, boolean>>({
    dev_lilygo_01: true,
  });

  const [openFeatures, setOpenFeatures] = useState<Record<string, boolean>>({
    feat_waterproof: true,
  });

  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({
    faq_1: true,
  });

  const toggleCollar = (id: string) => {
    setOpenCollars((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFeature = (id: string) => {
    setOpenFeatures((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTriggerBeep = (petName: string) => {
    showToast({
      type: 'info',
      title: 'ส่งเสียงเรียกน้องหมาแล้ว',
      message: `สั่งให้ปลอกคอของน้อง ${petName} ส่งเสียงร้องเตือนเรียบร้อยแล้ว`,
    });
  };

  const handleToggleNightLight = (devId: string, petName: string) => {
    const newState = !activeLights[devId];
    setActiveLights((prev) => ({ ...prev, [devId]: newState }));
    showToast({
      type: newState ? 'success' : 'info',
      title: newState ? 'เปิดไฟส่องสว่างแล้ว' : 'ปิดไฟส่องสว่างแล้ว',
      message: newState
        ? `เปิดไฟ LED ปลอกคอของ ${petName} เพื่อความปลอดภัยตอนกลางคืน`
        : `ปิดไฟปลอกคอของ ${petName} เรียบร้อยแล้ว`,
    });
  };

  const handleRestartCollar = (petName: string) => {
    showToast({
      type: 'info',
      title: 'รีเฟรชการเชื่อมต่อ',
      message: `สั่งรีเฟรชสัญญาณปลอกคอของ ${petName} ให้จับสัญญาณใหม่แล้วครับ`,
    });
  };

  const handlePairCollar = () => {
    if (!collarCodeInput.trim()) {
      showToast({
        type: 'warning',
        message: 'กรุณากรอกรหัสปลอกคอ 8 หลัก หรือสแกนจากกล่องสินค้า',
      });
      return;
    }

    setIsPairing(true);
    setTimeout(() => {
      setIsPairing(false);
      setShowPairModal(false);
      setCollarCodeInput('');
      showToast({
        type: 'success',
        title: 'เชื่อมต่อปลอกคอสำเร็จ!',
        message: 'ปลอกคอเชื่อมต่อเข้ากับระบบและพร้อมดูแลน้องหมาแล้วครับ',
      });
    }, 900);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ================= PAGE HEADER (SIMPLE & FRIENDLY) ================= */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl sm:text-3xl font-extrabold text-surface-950">
            ปลอกคออัจฉริยะ
          </h1>
          <p className="page-subtitle text-sm text-surface-600 mt-1">
            ตรวจเช็กสถานะปลอกคอ แบตเตอรี่ และฟังก์ชันดูแลความปลอดภัยสำหรับน้องหมาของคุณ
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => setShowPairModal(true)}
          className="shadow-subtle"
        >
          เพิ่มปลอกคอใหม่
        </Button>
      </section>

      {/* ================= SECTION 1: MY PET COLLARS (ACCORDION CARDS - IMAGE 2 STYLE) ================= */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary-600" />
            <span>ปลอกคอของน้องหมาที่คุณดูแล ({devices.length} ชิ้น)</span>
          </h2>
          <p className="text-xs text-surface-500 mt-0.5">
            คลิกที่การ์ดเพื่อดูระดับแบตเตอรี่ สั่งส่งเสียงเรียก หรือเปิดไฟส่องสว่างตอนกลางคืน
          </p>
        </div>

        {/* Stack of clean white accordion cards matching Image 2 */}
        <div className="space-y-3">
          {devices.map((dev, idx) => {
            const pet = pets[idx] || pets[0];
            const isOpen = Boolean(openCollars[dev.id]);
            const isLightOn = Boolean(activeLights[dev.id]);

            return (
              <div
                key={dev.id}
                className={cn(
                  'rounded-2xl border bg-white transition-all duration-200 shadow-subtle',
                  isOpen
                    ? 'border-primary-200 ring-2 ring-primary-100/50'
                    : 'border-surface-200/90 hover:border-surface-300'
                )}
              >
                {/* Header Row: Pet info & Battery on left, circular plus button on right */}
                <button
                  type="button"
                  onClick={() => toggleCollar(dev.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Pet Avatar */}
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-2xl overflow-hidden border border-surface-200 shadow-sm bg-surface-100">
                      {pet?.primaryPhotoUrl ? (
                        <Image
                          src={pet.primaryPhotoUrl}
                          alt={pet.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-surface-400">
                          {pet?.name?.charAt(0) || 'P'}
                        </div>
                      )}
                    </div>

                    {/* Pet & Collar quick status */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-surface-900 leading-snug group-hover:text-primary-700 transition-colors">
                          ปลอกคอของ &ldquo;{pet?.name}&rdquo;
                        </h3>
                        <Badge variant={dev.isOnline ? 'success' : 'surface'} dot size="sm">
                          {dev.isOnline ? 'กำลังเชื่อมต่อ' : 'ออฟไลน์ / ปิดเครื่อง'}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-surface-500 mt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <Battery
                            className={cn(
                              'w-3.5 h-3.5',
                              dev.batteryLevel > 30 ? 'text-emerald-500' : 'text-amber-500'
                            )}
                          />
                          แบตเตอรี่ {dev.batteryLevel}%
                        </span>
                        <span>•</span>
                        <span>{dev.isOnline ? 'อยู่ในเขตปลอดภัย' : 'อัปเดตล่าสุดเมื่อสักครู่'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Circular Plus Button on Right (Matching Image 2) */}
                  <span
                    className={cn(
                      'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200',
                      isOpen
                        ? 'rotate-45 bg-primary-100 text-primary-800'
                        : 'bg-surface-100/90 text-surface-600 group-hover:bg-primary-50 group-hover:text-primary-700'
                    )}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </button>

                {/* Expanded Collar Details & Quick Actions */}
                {isOpen && (
                  <div className="border-t border-surface-100 p-5 pt-4 space-y-4 animate-fade-in">
                    {/* Status grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-100/90">
                        <span className="text-[11px] font-semibold text-surface-500 block flex items-center gap-1">
                          <Battery className="w-3.5 h-3.5 text-emerald-500" /> แบตเตอรี่คงเหลือ
                        </span>
                        <span className="text-sm font-bold text-surface-900 mt-1 block">
                          {dev.batteryLevel}% {dev.batteryLevel > 30 ? '(ใช้ได้อีก ~4 วัน)' : '(ควรชาร์จ)'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-100/90">
                        <span className="text-[11px] font-semibold text-surface-500 block flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-indigo-500" /> พิกัดดาวเทียม
                        </span>
                        <span className="text-sm font-bold text-surface-900 mt-1 block">
                          {dev.isOnline ? 'ระบุตำแหน่งแม่นยำ' : 'กำลังค้นหาสัญญาณ'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-100/90">
                        <span className="text-[11px] font-semibold text-surface-500 block flex items-center gap-1">
                          <Wifi className="w-3.5 h-3.5 text-sky-500" /> การเชื่อมต่อ
                        </span>
                        <span className="text-sm font-bold text-surface-900 mt-1 block">
                          {dev.isOnline ? 'ออนไลน์ตลอดเวลา' : 'พักการส่งข้อมูล'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-100/90">
                        <span className="text-[11px] font-semibold text-surface-500 block flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary-500" /> บริเวณที่อยู่
                        </span>
                        <span className="text-sm font-bold text-surface-900 mt-1 block truncate">
                          {dev.isOnline ? 'ในบ้าน (สุขุมวิท)' : 'บ้านสวน (อารีย์)'}
                        </span>
                      </div>
                    </div>

                    {/* Quick action buttons for the pet owner */}
                    <div className="pt-2 border-t border-surface-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-surface-500">
                        <span>ส่งข้อมูลพิกัดอัตโนมัติเมื่อน้องเริ่มขยับตัว</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Beep Sound */}
                        <button
                          type="button"
                          onClick={() => handleTriggerBeep(pet.name)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-surface-800 font-bold text-xs transition active:scale-95 shadow-sm"
                        >
                          <Volume2 className="w-4 h-4 text-primary-600" />
                          <span>ส่งเสียงเรียกน้องหมา</span>
                        </button>

                        {/* Night Light */}
                        <button
                          type="button"
                          onClick={() => handleToggleNightLight(dev.id, pet.name)}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition active:scale-95 shadow-sm border',
                            isLightOn
                              ? 'bg-amber-100 border-amber-300 text-amber-900'
                              : 'bg-white border-surface-200 hover:bg-surface-50 text-surface-700'
                          )}
                        >
                          <Lightbulb
                            className={cn('w-4 h-4', isLightOn ? 'text-amber-600 fill-amber-500' : 'text-surface-500')}
                          />
                          <span>{isLightOn ? 'เปิดไฟอยู่ (คลิกเพื่อปิด)' : 'เปิดไฟตอนกลางคืน'}</span>
                        </button>

                        {/* Refresh Signal */}
                        <button
                          type="button"
                          onClick={() => handleRestartCollar(pet.name)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-surface-200 hover:bg-surface-50 text-surface-600 font-semibold text-xs transition active:scale-95"
                          title="สั่งให้อุปกรณ์รีเฟรชสัญญาณใหม่"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>รีเฟรชสัญญาณ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= SECTION 2: WHAT THE COLLAR DOES FOR YOUR PET (IMAGE 2 STYLE) ================= */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span>ฟังก์ชันเด่นที่ปลอกคอช่วยดูแลน้องหมาของคุณ</span>
          </h2>
          <p className="text-xs text-surface-500 mt-0.5">
            คลิกดูความสามารถและการดูแลความปลอดภัยที่ออกแบบมาเพื่อสุนัขโดยเฉพาะ
          </p>
        </div>

        {/* Stack of clean white accordion cards matching Image 2 */}
        <div className="space-y-3">
          {COLLAR_FEATURES.map((feat) => {
            const isOpen = Boolean(openFeatures[feat.id]);

            return (
              <div
                key={feat.id}
                className={cn(
                  'rounded-2xl border bg-white transition-all duration-200 shadow-subtle',
                  isOpen
                    ? 'border-primary-200 ring-2 ring-primary-100/50'
                    : 'border-surface-200/90 hover:border-surface-300'
                )}
              >
                {/* Header row */}
                <button
                  type="button"
                  onClick={() => toggleFeature(feat.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-50 border border-surface-100 group-hover:scale-105 transition-transform">
                      {feat.icon}
                    </span>

                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-surface-900 leading-snug group-hover:text-primary-700 transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-surface-500 mt-0.5 truncate">{feat.shortDesc}</p>
                    </div>
                  </div>

                  {/* Circular Plus Button on Right */}
                  <span
                    className={cn(
                      'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200',
                      isOpen
                        ? 'rotate-45 bg-primary-100 text-primary-800'
                        : 'bg-surface-100/90 text-surface-600 group-hover:bg-primary-50 group-hover:text-primary-700'
                    )}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-surface-100 p-5 pt-4 text-sm text-surface-600 space-y-3 animate-fade-in leading-relaxed">
                    <p className="text-surface-700">{feat.detail}</p>
                    <div className="p-3 rounded-xl bg-primary-50/70 border border-primary-100 flex items-center gap-2 text-xs text-primary-900 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      <span>{feat.tip}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= SECTION 3: FAQ ACCORDION (EXACT IMAGE 2 STYLE) ================= */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary-600" />
            <span>คำถามที่พบบ่อยเกี่ยวกับการใช้งานปลอกคอ</span>
          </h2>
          <p className="text-xs text-surface-500 mt-0.5">
            รวมข้อสงสัยที่ผู้ใช้งานถามบ่อยเกี่ยวกับการชาร์จแบต การกันน้ำ และค่าบริการ
          </p>
        </div>

        {/* Stack of clean white FAQ cards matching Image 2 */}
        <div className="space-y-3">
          {COLLAR_FAQS.map((faq) => {
            const isOpen = Boolean(openFaqs[faq.id]);
            return (
              <div
                key={faq.id}
                className={cn(
                  'rounded-2xl border bg-white transition-all duration-200 shadow-subtle',
                  isOpen
                    ? 'border-primary-200 ring-2 ring-primary-100/50'
                    : 'border-surface-200/90 hover:border-surface-300'
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left group"
                >
                  <span className="text-base font-bold text-surface-900 leading-snug group-hover:text-primary-700 transition-colors">
                    {faq.question}
                  </span>

                  {/* Circular Plus Button on right */}
                  <span
                    className={cn(
                      'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200',
                      isOpen
                        ? 'rotate-45 bg-primary-100 text-primary-800'
                        : 'bg-surface-100/90 text-surface-600 group-hover:bg-primary-50 group-hover:text-primary-700'
                    )}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-surface-100 p-5 pt-4 text-sm text-surface-600 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= PAIR NEW COLLAR MODAL (SIMPLE & CLEAR) ================= */}
      {showPairModal && (
        <Dialog
          isOpen={showPairModal}
          onClose={() => setShowPairModal(false)}
          title="เพิ่มปลอกคอใหม่ให้น้องหมา"
          description="กรอกรหัสปลอกคอเพื่อเริ่มต้นเชื่อมต่อและระบุพิกัด"
          size="md"
        >
          <div className="space-y-4 pt-2 text-left">
            <div className="p-3.5 rounded-xl bg-primary-50 border border-primary-100 text-xs text-primary-800 space-y-1.5 leading-relaxed">
              <p className="font-bold flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-primary-600" /> วิธีการเชื่อมต่อง่ายๆ:
              </p>
              <p>1. เปิดสวิตช์ปลอกคอ แล้วตรวจดูว่าไฟที่ปลอกคอสว่างขึ้น</p>
              <p>2. ตรวจสอบรหัส 8 หลักที่พิมพ์อยู่ใต้ตัวปลอกคอ หรือข้างกล่องสินค้า</p>
              <p>3. กรอกรหัสด้านล่าง แล้วเลือกน้องหมาที่ต้องการผูกปลอกคอ</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-surface-700 mb-1.5 block">
                เลือกน้องหมาที่จะใส่ปลอกคอนี้:
              </label>
              <select
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-surface-300 bg-white text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    น้อง {p.name} ({p.breed})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="รหัสปลอกคอ (ตัวเลข 8 หลัก) *"
              placeholder="เช่น 7080-8842 หรือดูที่สติกเกอร์ใต้เครื่อง"
              value={collarCodeInput}
              onChange={(e) => setCollarCodeInput(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPairModal(false)}>
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handlePairCollar}
                isLoading={isPairing}
                className="shadow-sm"
              >
                เชื่อมต่อปลอกคอ
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
