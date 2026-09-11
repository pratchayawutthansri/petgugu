'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/ui/brand-mark';
import {
  MapPin,
  ShieldCheck,
  QrCode,
  History,
  Cpu,
  ArrowRight,
  Sparkles,
  Wifi,
  Battery,
  Globe,
  Radio,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Zap,
  PhoneCall,
  Activity,
  Layers,
  Heart,
  Navigation,
  Compass,
  BellRing,
  Shield,
  Smartphone,
  Check,
  PawPrint,
} from 'lucide-react';

export default function LandingPage() {
  const { t, locale, setLocale } = useLanguage();

  // Active section tracking for navbar underline
  const [activeSection, setActiveSection] = useState<'features' | 'how-it-works' | 'hardware' | 'faq'>('features');

  // Interactive Live Preview State on Hero
  const [activeHeroPet, setActiveHeroPet] = useState<'mochi' | 'lucky'>('mochi');
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseKey((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const navLinks = [
    { id: 'features', labelTh: 'ฟีเจอร์เด่น', labelEn: 'Features', href: '#features' },
    { id: 'how-it-works', labelTh: 'วิธีใช้งาน', labelEn: 'How It Works', href: '#how-it-works' },
    { id: 'hardware', labelTh: 'สเปกฮาร์ดแวร์', labelEn: 'Hardware', href: '#hardware' },
    { id: 'faq', labelTh: 'คำถามที่พบบ่อย', labelEn: 'FAQ', href: '#faq' },
  ];

  const faqItems = [
    {
      q: 'ปลอกคออัจฉริยะ Paws&Co. ใช้งานได้ไกลแค่ไหน?',
      qEn: 'How far can the Paws&Co. tracker work?',
      a: 'ระบบส่งข้อมูลผ่านสัญญาณเซลลูลาร์ NB-IoT และ LTE Cat-M1 จึงสามารถติดตามตำแหน่งสุนัขได้ทั่วประเทศ ทุกที่ที่มีสัญญาณมือถือ โดยไม่จำกัดระยะทางเหมือนระบบบลูทูธ (Bluetooth) หรือ AirTag ทั่วไป',
      aEn: 'The device transmits data over NB-IoT and LTE Cat-M1 cellular networks, tracking your dog anywhere with mobile coverage across the country, unlike limited-range Bluetooth tags.',
    },
    {
      q: 'แบตเตอรี่ใช้งานได้นานเท่าไหร่ และชาร์จอย่างไร?',
      qEn: 'How long does the battery last and how is it charged?',
      a: 'มาพร้อมแบตเตอรี่ Li-Po 1,000 mAh พร้อมวงจร PMU อัจฉริยะ เมื่อสุนัขอยู่ในบ้าน (Safe Zone) ระบบจะปรับเป็นโหมดประหยัดพลังงาน ส่งข้อมูลทุก 5 นาที ช่วยให้แบตเตอรี่ใช้งานได้ต่อเนื่องหลายวัน ชาร์จผ่านพอร์ต Type-C ได้สะดวกและรวดเร็ว',
      aEn: 'Powered by a 1,000 mAh Li-Po battery with smart PMU power management. When inside the home safe zone, it updates every 5 minutes to conserve power for multi-day usage, recharged via USB Type-C.',
    },
    {
      q: 'หากมีคนพบสุนัข สแกน QR Code แล้วจะเห็นพิกัดบ้านเราหรือไม่?',
      qEn: 'If someone scans the collar QR Code, will they see my home address?',
      a: 'ไม่เห็นแน่นอนครับ! หน้าป้ายชื่อดิจิทัลสาธารณะ (Digital Pet ID) ได้รับการออกแบบตามหลักความปลอดภัยและความเป็นส่วนตัวสูงสุด จะแสดงเฉพาะชื่อสุนัข, รูปถ่าย, อาการแพ้/เบอร์ฉุกเฉิน, และปุ่มโทรติดต่อเจ้าของทันที โดยไม่เปิดเผยพิกัดบ้านเด็ดขาด',
      aEn: 'Definitely not! The public QR ID profile strictly shields private home coordinates and only displays the dog name, photo, care warnings, and a direct 1-tap call button.',
    },
    {
      q: 'เวอร์ชันนี้ (Phase 1) สามารถทดลองใช้งานฟังก์ชันใดได้บ้าง?',
      qEn: 'What features are available in this Phase 1 prototype?',
      a: 'สามารถทดลองใช้งาน Web Application ได้ครบถ้วนทุกหน้า: แผนที่ติดตามสด (Live Tracking), จำลองแจ้งเตือน SOS, ดูประวัติเส้นทาง (Location History), จัดการข้อมูลสุนัขและวัคซีน, หน้าป้ายชื่อ QR Code, และแดชบอร์ด Admin',
      aEn: 'You can explore all WebApp modules in full Demo Mode: Live interactive tracking map, SOS broadcasts, route history analytics, pet & vaccine profiles, public QR tags, and the admin panel.',
    },
  ];

  return (
    <div className="min-h-dvh bg-surface-50 text-surface-900 flex flex-col selection:bg-primary-100 selection:text-primary-900 font-sans relative overflow-x-hidden">
      {/* Background Ambient Glow Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-primary-400/15 via-secondary-300/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-secondary-400/10 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Floating Island / Capsule Pill Navigation Bar */}
      <div className="sticky top-3 sm:top-5 z-sticky px-3 sm:px-6 w-full max-w-6xl mx-auto">
        <header className="rounded-full bg-white/90 backdrop-blur-2xl border border-surface-200/90 shadow-modal px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300 hover:border-primary-200/80">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <BrandMark />
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200/60 hidden md:inline-block">
                IoT GPS
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Pill Style with Active Underline) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setActiveSection(link.id as any)}
                className={`relative px-4 py-1.5 text-xs xl:text-sm font-semibold transition-all duration-200 hover:text-primary-600 ${
                  activeSection === link.id ? 'text-primary-600 font-bold' : 'text-surface-600'
                }`}
              >
                <span>{locale === 'th' ? link.labelTh : link.labelEn}</span>
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.8)] animate-scale-in" />
                )}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Language Switcher Capsule */}
            <button
              type="button"
              onClick={() => setLocale(locale === 'th' ? 'en' : 'th')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border border-surface-200 bg-surface-50 hover:bg-surface-100 text-surface-700 hover:text-primary-600 transition-all shadow-subtle touch-target"
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-primary-600" />
              <span>{locale === 'th' ? 'EN' : 'TH'}</span>
            </button>

            {/* Sign In Link */}
            <Link href="/auth" className="hidden sm:inline-block">
              <span className="text-xs font-bold text-surface-700 hover:text-primary-600 px-2 py-1 transition-colors">
                {locale === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
              </span>
            </Link>

            {/* Pill CTA Button */}
            <Link href="/dashboard">
              <button
                type="button"
                className="rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-card shadow-primary-500/25 hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 flex items-center gap-1.5 group"
              >
                <span>{locale === 'th' ? 'ทดลองใช้ฟรี' : 'Try Live Demo'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-20 lg:pt-16 lg:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border border-primary-200/90 text-primary-800 text-xs sm:text-sm font-semibold shadow-card backdrop-blur-md animate-fade-in hover:border-primary-400 transition-colors">
              <span className="flex h-2.5 w-2.5 rounded-full bg-primary-600 animate-pulse-soft shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span>{locale === 'th' ? 'นวัตกรรมติดตามสัตว์เลี้ยงอัจฉริยะ 2026' : 'Next-Gen Smart Pet Tracking 2026'}</span>
            </div>

            {/* Main Title with Primary Gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-900 tracking-tight leading-[1.12]">
              {locale === 'th' ? 'ปกป้องเพื่อนสี่ขาที่คุณรัก' : 'Protect Your Beloved Dogs'}{' '}
              <span className="text-gradient-primary">
                {locale === 'th' ? 'ได้ทุกที่ ทุกเวลา' : 'Anywhere, Anytime'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-surface-600 leading-relaxed max-w-2xl mx-auto font-normal">
              {locale === 'th'
                ? 'ระบบติดตามสุนัขแบบใกล้เคียงเวลาจริงผ่านเครือข่าย NB-IoT และ LTE Cat-M1 ผสานเทคโนโลยีพิกัดดาวเทียม GNSS พร้อมป้ายชื่อดิจิทัล QR Tag อัจฉริยะ'
                : 'Near real-time dog tracking system over NB-IoT and LTE Cat-M1 cellular networks powered by GNSS satellites and smart digital QR collar tags.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto rounded-full px-8 py-4 text-base font-extrabold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-card shadow-primary-600/30 hover:shadow-card-hover hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <span>{locale === 'th' ? 'เข้าสู่แดชบอร์ดติดตามสด' : 'Launch Live Dashboard'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>

              <Link href="/auth" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto rounded-full px-7 py-4 text-base font-bold text-surface-700 bg-white hover:bg-surface-50 border border-surface-300/80 hover:border-primary-300 shadow-subtle transition-all"
                >
                  {locale === 'th' ? 'เข้าสู่ระบบ (Demo Mode)' : 'Sign In (Demo Mode)'}
                </button>
              </Link>
            </div>

            {/* Feature Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-surface-600 font-medium">
              <div className="flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full border border-surface-200 shadow-subtle">
                <Check className="w-4 h-4 text-success" />
                <span>ESP32-S3 + SIM7080G</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full border border-surface-200 shadow-subtle">
                <Check className="w-4 h-4 text-success" />
                <span>NB-IoT & LTE Cat-M1</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full border border-surface-200 shadow-subtle">
                <Check className="w-4 h-4 text-success" />
                <span>Digital QR Collar Tag</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Telemetry Device Mockup */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-white/95 to-white/70 p-3 sm:p-5 border border-surface-200/90 shadow-2xl backdrop-blur-xl relative">
            <div className="rounded-2xl border border-surface-800 bg-surface-900 text-white overflow-hidden shadow-2xl">
              {/* Window Header Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-surface-800/90 border-b border-surface-700/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-danger shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                  <div className="w-3 h-3 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                  <div className="w-3 h-3 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span className="ml-2 text-xs font-mono text-surface-400 truncate hidden sm:inline">
                    pawsandco.app/dashboard • Live Telemetry Stream
                  </span>
                </div>

                {/* Pet Switcher Buttons on Mockup */}
                <div className="flex items-center gap-2 bg-surface-900/90 p-1 rounded-xl border border-surface-700/80">
                  <button
                    type="button"
                    onClick={() => setActiveHeroPet('mochi')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeHeroPet === 'mochi'
                        ? 'bg-primary-600 text-white shadow-card shadow-primary-500/40'
                        : 'text-surface-400 hover:text-white hover:bg-surface-800'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5"><PawPrint className="h-3.5 w-3.5" /> โมจิ (Mochi)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveHeroPet('lucky')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeHeroPet === 'lucky'
                        ? 'bg-primary-600 text-white shadow-card shadow-primary-500/40'
                        : 'text-surface-400 hover:text-white hover:bg-surface-800'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5"><PawPrint className="h-3.5 w-3.5" /> ลัคกี้ (Lucky)</span>
                  </button>
                </div>
              </div>

              {/* Main Mockup Screen Content */}
              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-900">
                {/* Simulated Radar Map View (Left 7 Cols) */}
                <div className="lg:col-span-7 rounded-2xl bg-surface-800/90 border border-surface-700/80 p-5 relative min-h-[320px] flex flex-col justify-between overflow-hidden shadow-inner">
                  {/* Grid Lines Pattern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #818CF8 1px, transparent 1px)',
                      backgroundSize: '28px 28px',
                    }}
                  />

                  {/* Top Map Indicators */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-900/90 text-xs font-mono text-success border border-surface-700 shadow-sm">
                      <Radio className="w-4 h-4 animate-pulse text-success" />
                      <span>GPS 3D Fix ({activeHeroPet === 'mochi' ? '13.7314° N, 100.5590° E' : '13.7780° N, 100.5360° E'})</span>
                    </div>
                    <span className="text-[11px] font-mono text-primary-300 bg-primary-950/80 border border-primary-800/60 px-2.5 py-1 rounded-md">
                      Rate: 10s
                    </span>
                  </div>

                  {/* Center Radar Dog Marker */}
                  <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
                    <div className="relative">
                      {/* Pulsing Radar Rings */}
                      <div className="absolute -inset-6 rounded-full bg-primary-500/20 animate-ping" />
                      <div className="absolute -inset-10 rounded-full border border-primary-500/30 animate-pulse-soft" />

                      {/* Dog Avatar Pin */}
                      <div className="relative w-20 h-20 rounded-full border-4 border-primary-500 bg-white overflow-hidden shadow-[0_0_25px_rgba(79,70,229,0.5)]">
                        <img
                          src={
                            activeHeroPet === 'mochi'
                              ? 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80'
                              : 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80'
                          }
                          alt="Pet Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="mt-4 px-4 py-1.5 rounded-full bg-surface-900/95 border border-surface-700 text-xs font-bold text-white shadow-card flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span>{activeHeroPet === 'mochi' ? 'โมจิ (Golden Retriever)' : 'ลัคกี้ (Shiba Inu)'}</span>
                    </div>
                  </div>

                  {/* Bottom Map Zone Badge */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-surface-300 bg-surface-900/80 p-2.5 rounded-xl border border-surface-700/80">
                    <span className="flex items-center gap-2 text-primary-300 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-primary-400" />
                      <span>พื้นที่ปลอดภัย: {activeHeroPet === 'mochi' ? 'สวนเบญจกิติ (Benjakitti)' : 'บ้านสวนอารีย์ (Ari)'}</span>
                    </span>
                    <span className="text-[11px] text-surface-400 font-mono">
                      Radius: 450m
                    </span>
                  </div>
                </div>

                {/* Simulated Telemetry Cards (Right 5 Cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                  {/* Status Card */}
                  <div className="rounded-2xl bg-surface-800/90 border border-surface-700/80 p-5 space-y-4 shadow-card">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">
                        สถานะอุปกรณ์ (Hardware Status)
                      </span>
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-success/20 text-success-300 border border-success/30 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        {activeHeroPet === 'mochi' ? 'ONLINE (Cat-M1)' : 'STANDBY (NB-IoT)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-1">
                      <div className="p-4 rounded-xl bg-surface-900/90 border border-surface-700/80 shadow-inner">
                        <div className="flex items-center gap-1.5 text-primary-300 mb-1.5">
                          <Battery className="w-4 h-4 text-success" />
                          <span className="text-xs font-semibold">แบตเตอรี่</span>
                        </div>
                        <span className="text-2xl font-extrabold text-white">
                          {activeHeroPet === 'mochi' ? '88%' : '32%'}
                        </span>
                        <span className="text-[11px] text-surface-400 block mt-0.5 font-mono">
                          {activeHeroPet === 'mochi' ? '4.12V • PMU Normal' : '3.70V • Power Save'}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-surface-900/90 border border-surface-700/80 shadow-inner">
                        <div className="flex items-center gap-1.5 text-secondary-300 mb-1.5">
                          <Wifi className="w-4 h-4 text-secondary-400" />
                          <span className="text-xs font-semibold">สัญญาณคลื่น</span>
                        </div>
                        <span className="text-2xl font-extrabold text-white">
                          {activeHeroPet === 'mochi' ? '92%' : '45%'}
                        </span>
                        <span className="text-[11px] text-surface-400 block mt-0.5 font-mono">
                          {activeHeroPet === 'mochi' ? 'CSQ 28 • Excellent' : 'CSQ 14 • Moderate'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Action / Live Simulator CTA */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-primary-900/80 via-indigo-900/60 to-surface-800 border border-primary-500/40 flex items-center justify-between shadow-card">
                    <div className="space-y-1 text-left">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>ทดลองฟังก์ชันบนแดชบอร์ดจริง</span>
                      </span>
                      <p className="text-xs text-primary-200/80">
                        กดจำลองฉุกเฉิน SOS, ดูประวัติเส้นทาง, สแกน QR
                      </p>
                    </div>

                    <Link href="/dashboard">
                      <button
                        type="button"
                        className="rounded-full px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-md transition-all"
                      >
                        เปิดระบบ &rarr;
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Numbers / Trust Proof Metrics Bar */}
      <section className="py-12 bg-white border-y border-surface-200/80 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-600 tracking-tight">10 วิ</span>
              <p className="text-xs sm:text-sm text-surface-600 font-semibold">
                ความถี่ส่งพิกัดเมื่ออยู่นอกพื้นที่
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-secondary-600 tracking-tight">NB-IoT</span>
              <p className="text-xs sm:text-sm text-surface-600 font-semibold">
                รองรับเสาสัญญาณเซลลูลาร์ทั่วไทย
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-success tracking-tight">IP67</span>
              <p className="text-xs sm:text-sm text-surface-600 font-semibold">
                มาตรฐานเคสกันน้ำกันฝุ่นสำหรับสัตว์เลี้ยง
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-warning-600 tracking-tight">100% Free</span>
              <p className="text-xs sm:text-sm text-surface-600 font-semibold">
                ทดลองใช้งานฟรีในโหมด Prototype
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid Section */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest px-3.5 py-1 rounded-full bg-primary-50 border border-primary-200">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
              {locale === 'th' ? 'ฟีเจอร์หลักเพื่อความปลอดภัยสูงสุด' : 'Core Features for Maximum Safety'}
            </h2>
            <p className="text-base text-surface-600">
              {locale === 'th'
                ? 'ออกแบบให้ครอบคลุมทุกมิติ ทั้งการติดตามระยะไกล การป้องกัน และการส่งต่อความช่วยเหลือ'
                : 'Engineered for complete pet safety: tracking, geofencing, and digital recovery.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-7 rounded-3xl bg-white border border-surface-200/90 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 space-y-4 text-left group">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-subtle">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 tracking-tight">
                {locale === 'th' ? 'ติดตามพิกัดแม่นยำสูง' : 'Near Real-time GPS'}
              </h3>
              <p className="text-sm text-surface-600 leading-relaxed">
                {locale === 'th'
                  ? 'ส่งพิกัดดาวเทียม GNSS ทุก 10 วินาทีเมื่ออยู่นอกพื้นที่ปลอดภัย ครอบคลุมทั่วประเทศผ่านเครือข่ายมือถือ'
                  : 'High-precision GNSS coordinates updated every 10 seconds outside safe zones across cellular networks.'}
              </p>
              <div className="pt-2 text-xs font-bold text-primary-600 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                <span>GNSS Multi-Constellation</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-3xl bg-white border border-surface-200/90 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 space-y-4 text-left group">
              <div className="w-14 h-14 rounded-2xl bg-secondary-50 text-secondary-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary-600 group-hover:text-white transition-all duration-300 shadow-subtle">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 tracking-tight">
                {locale === 'th' ? 'พื้นที่ปลอดภัยอัจฉริยะ' : 'Smart Geofencing'}
              </h3>
              <p className="text-sm text-surface-600 leading-relaxed">
                {locale === 'th'
                  ? 'กำหนดขอบเขตรัศมีที่ปลอดภัย แจ้งเตือนทันทีเมื่อสัตว์เลี้ยงหลุดออกจากบ้าน และปรับโหมดประหยัดพลังงานเมื่ออยู่ในบ้าน'
                  : 'Define custom safe zones with instant push alerts upon exit and automatic power saving inside.'}
              </p>
              <div className="pt-2 text-xs font-bold text-secondary-600 flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5" />
                <span>Geofencing Push Alerts</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-3xl bg-white border border-surface-200/90 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 space-y-4 text-left group">
              <div className="w-14 h-14 rounded-2xl bg-success-50 text-success flex items-center justify-center group-hover:scale-110 group-hover:bg-success group-hover:text-white transition-all duration-300 shadow-subtle">
                <QrCode className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 tracking-tight">
                {locale === 'th' ? 'ป้ายชื่อดิจิทัล QR Tag' : 'Digital QR Collar Tag'}
              </h3>
              <p className="text-sm text-surface-600 leading-relaxed">
                {locale === 'th'
                  ? 'เมื่อมีคนพบสุนัข สามารถสแกนป้ายเพื่อโทรติดต่อเจ้าของได้ทันที โดยไม่เปิดเผยพิกัดบ้านเพื่อความเป็นส่วนตัว'
                  : 'Allows finders to scan and contact the owner via 1-tap call while strictly hiding private home coordinates.'}
              </p>
              <div className="pt-2 text-xs font-bold text-success flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>1-Tap Call & Privacy Shield</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-7 rounded-3xl bg-white border border-surface-200/90 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 space-y-4 text-left group">
              <div className="w-14 h-14 rounded-2xl bg-warning-50 text-warning flex items-center justify-center group-hover:scale-110 group-hover:bg-warning group-hover:text-white transition-all duration-300 shadow-subtle">
                <History className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 tracking-tight">
                {locale === 'th' ? 'ประวัติเส้นทาง & สถิติ' : 'Route History & Stats'}
              </h3>
              <p className="text-sm text-surface-600 leading-relaxed">
                {locale === 'th'
                  ? 'ดูเส้นทางการเดินทางย้อนหลังแบบ Polyline พร้อมสรุประยะทาง ความเร็วเฉลี่ย และการใช้พลังงานแบตเตอรี่'
                  : 'Replay historical movement paths with total distance, average speed, and battery consumption metrics.'}
              </p>
              <div className="pt-2 text-xs font-bold text-warning-600 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Route Distance & Speed Stats</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white border-t border-surface-200/80 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest px-3.5 py-1 rounded-full bg-primary-50 border border-primary-200">
              Step-by-step Setup
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
              {locale === 'th' ? 'ขั้นตอนการเริ่มต้นใช้งาน 3 ขั้นตอน' : '3 Easy Steps to Get Started'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-8 rounded-3xl bg-surface-50 border border-surface-200 text-center space-y-4 relative shadow-subtle hover:shadow-card hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-card shadow-primary-500/25">
                1
              </div>
              <h3 className="text-xl font-bold text-surface-900">
                {locale === 'th' ? '1. ลงทะเบียนสัตว์เลี้ยง' : '1. Register Your Pet'}
              </h3>
              <p className="text-sm text-surface-600 leading-relaxed">
                {locale === 'th'
                  ? 'สร้างโปรไฟล์สุนัข อัปโหลดรูปภาพ 2-5 รูป พร้อมระบุข้อมูลสายพันธุ์และประวัติวัคซีน'
                  : 'Create your dog profile, upload 2-5 photos, and input breed and health records.'}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-surface-50 border border-surface-200 text-center space-y-4 relative shadow-subtle hover:shadow-card hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-secondary-500 to-sky-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-card shadow-secondary-500/25">
                2
              </div>
              <h3 className="text-xl font-bold text-surface-900">
                {locale === 'th' ? '2. สวมปลอกคออัจฉริยะ' : '2. Attach Collar Device'}
              </h3>
              <p className="text-sm text-surface-600 leading-relaxed">
                {locale === 'th'
                  ? 'จับคู่บอร์ด LILYGO ESP32-S3 เข้ากับบัญชีผู้ใช้ และตั้งค่ารัศมีเขตพื้นที่ปลอดภัย (Safe Zone)'
                  : 'Pair the LILYGO ESP32-S3 tracker to your account and configure safe zone boundaries.'}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-surface-50 border border-surface-200 text-center space-y-4 relative shadow-subtle hover:shadow-card hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-success to-emerald-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-card shadow-success/25">
                3
              </div>
              <h3 className="text-xl font-bold text-surface-900">
                {locale === 'th' ? '3. ติดตามสดได้ทันที' : '3. Track in Real-Time'}
              </h3>
              <p className="text-sm text-surface-600 leading-relaxed">
                {locale === 'th'
                  ? 'ดูตำแหน่งสดผ่าน WebApp บนมือถือหรือคอมพิวเตอร์ รับแจ้งเตือนเมื่อออกนอกเขตได้ 24 ชม.'
                  : 'Monitor live positions on web dashboard 24/7 with instant alerts when escaping safe zones.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Architecture Highlight Section */}
      <section id="hardware" className="py-24 bg-surface-900 text-white relative overflow-hidden">
        {/* Decorative lighting */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hardware Info (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary-950/80 text-primary-300 text-xs font-semibold border border-primary-500/40 shadow-sm">
                <Cpu className="w-4 h-4 text-primary-400" />
                <span>Hardware Architecture & Specifications</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                LILYGO T-SIM7080G-S3 ESP32-S3
              </h2>

              <p className="text-surface-300 text-base leading-relaxed">
                บอร์ดไมโครคอนโทรลเลอร์ที่ออกแบบสำหรับการสื่อสารระยะไกล ผสานชิปประมวลผล 
                <strong className="text-white"> ESP32-S3 Dual-Core Xtensa LX7</strong> (16MB Flash, 8MB PSRAM) และโมดูล 
                <strong className="text-white"> SIM7080G</strong> รองรับทั้ง NB-IoT และ LTE Cat-M1 พร้อมวงจรจัดการพลังงาน PMU ในตัว
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-surface-800/90 border border-surface-700/80 shadow-card">
                  <span className="text-xs font-bold text-primary-300 block">GNSS / GPS</span>
                  <span className="text-[11px] text-surface-400 mt-0.5 block">พิกัดดาวเทียมความแม่นยำสูง</span>
                </div>
                <div className="p-4 rounded-2xl bg-surface-800/90 border border-surface-700/80 shadow-card">
                  <span className="text-xs font-bold text-secondary-300 block">Li-Po 1000 mAh</span>
                  <span className="text-[11px] text-surface-400 mt-0.5 block">แบตเตอรี่น้ำหนักเบา + PMU</span>
                </div>
                <div className="p-4 rounded-2xl bg-surface-800/90 border border-surface-700/80 shadow-card">
                  <span className="text-xs font-bold text-success-300 block">WS2812B RGB</span>
                  <span className="text-[11px] text-surface-400 mt-0.5 block">ไฟบอกสถานะ & ค้นหากลางคืน</span>
                </div>
                <div className="p-4 rounded-2xl bg-surface-800/90 border border-surface-700/80 shadow-card">
                  <span className="text-xs font-bold text-warning-300 block">IP67 Enclosure</span>
                  <span className="text-[11px] text-surface-400 mt-0.5 block">กล่องกันน้ำสำหรับสัตว์เลี้ยง</span>
                </div>
                <div className="p-4 rounded-2xl bg-surface-800/90 border border-surface-700/80 shadow-card">
                  <span className="text-xs font-bold text-danger-300 block">MQTT Protocol</span>
                  <span className="text-[11px] text-surface-400 mt-0.5 block">ส่ง Telemetry ขึ้นคลาวด์</span>
                </div>
                <div className="p-4 rounded-2xl bg-surface-800/90 border border-surface-700/80 shadow-card">
                  <span className="text-xs font-bold text-surface-300 block">Type-C Fast Charge</span>
                  <span className="text-[11px] text-surface-400 mt-0.5 block">ชาร์จสะดวก ปลอดภัย</span>
                </div>
              </div>
            </div>

            {/* Right Card CTA (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="p-8 sm:p-10 rounded-3xl bg-surface-800/90 border border-surface-700/90 text-center max-w-md w-full space-y-6 shadow-2xl backdrop-blur-xl">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-primary-600/20 text-primary-400 flex items-center justify-center shadow-inner border border-primary-500/30">
                  <Radio className="h-10 w-10" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    พร้อมสำหรับการเชื่อมต่อ IoT
                  </h3>
                  <p className="text-xs sm:text-sm text-surface-400 leading-relaxed">
                    ระบบ API Backend พร้อมรองรับการส่งพิกัด Telemetry จากบอร์ด ESP32-S3
                  </p>
                </div>

                <Link href="/hardware" className="block">
                  <button
                    type="button"
                    className="w-full rounded-full py-4 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-card shadow-primary-600/30 transition-all"
                  >
                    {locale === 'th' ? 'ดูรายละเอียดฮาร์ดแวร์' : 'View Hardware Specs'} &rarr;
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section id="faq" className="py-24 bg-surface-50 border-t border-surface-200/80 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest px-3.5 py-1 rounded-full bg-primary-50 border border-primary-200">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
              {locale === 'th' ? 'คำถามที่พบบ่อย (FAQ)' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-surface-200 bg-white overflow-hidden shadow-subtle hover:shadow-card transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-surface-50/50 transition-colors touch-target"
                  >
                    <span className="text-base font-bold text-surface-900">
                      {locale === 'th' ? item.q : item.qEn}
                    </span>
                    <div className="flex-shrink-0 text-surface-400 w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-primary-600" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-sm text-surface-600 leading-relaxed border-t border-surface-100 animate-fade-in text-left">
                      {locale === 'th' ? item.a : item.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grand CTA Banner */}
      <section className="py-20 bg-white border-t border-surface-200/80 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-primary-700 via-indigo-700 to-secondary-600 p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden space-y-6">
            {/* Ambient circle glow inside banner */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                {locale === 'th' ? 'เริ่มต้นปกป้องสุนัขที่คุณรักได้แล้ววันนี้' : 'Start Protecting Your Dog Today'}
              </h2>
              <p className="text-primary-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-normal">
                {locale === 'th'
                  ? 'สัมผัสนวัตกรรมการติดตามสุนัขอัจฉริยะผ่านระบบจำลองและแดชบอร์ดติดตามสดได้ทันที'
                  : 'Experience smart real-time dog tracking with our interactive dashboard and prototype telemetry.'}
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto rounded-full px-8 py-4 text-base font-extrabold text-primary-900 bg-white hover:bg-surface-100 shadow-xl transition-all"
                >
                  {locale === 'th' ? 'เข้าสู่หน้าติดตามสด (Live Dashboard) →' : 'Open Live Dashboard →'}
                </button>
              </Link>
              <Link href="/auth" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto rounded-full px-8 py-4 text-base font-bold text-white border border-white/40 hover:bg-white/10 transition-all"
                >
                  {locale === 'th' ? 'เข้าสู่ระบบ / Demo Account' : 'Sign In / Demo Account'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-14 bg-surface-900 text-surface-400 border-t border-surface-800 text-xs relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandMark compact inverse />
            <div>
              <span className="font-extrabold text-white text-base">Paws<span className="text-primary-400">&</span>Co.</span>
              <p className="text-[11px] text-surface-400">
                ระบบติดตามสุนัขแบบใกล้เคียงเวลาจริงผ่านเครือข่ายอินเทอร์เน็ต
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8 text-xs font-semibold text-surface-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              แดชบอร์ด
            </Link>
            <Link href="/pets" className="hover:text-white transition-colors">
              สัตว์เลี้ยง
            </Link>
            <Link href="/hardware" className="hover:text-white transition-colors">
              ฮาร์ดแวร์
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              ผู้ดูแลระบบ
            </Link>
          </div>

          <div className="text-center md:text-right text-[11px] text-surface-500">
            © 2026 Paws&Co. Academic Prototype Project. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
