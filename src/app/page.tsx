'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import {
  PawPrint,
  MapPin,
  ShieldCheck,
  QrCode,
  TrendingUp,
  Clock,
  Radio,
  Droplets,
  Cpu,
  Battery,
  Sparkles,
  Zap,
  Globe,
  User,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  Compass,
  Menu,
  X,
  Wifi,
  Activity,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const { t, locale, setLocale } = useLanguage();

  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active section tracking
  const [activeSection, setActiveSection] = useState<'hero' | 'features' | 'how-it-works' | 'hardware' | 'faq'>('hero');

  // FAQ Accordion State (item 1 opened by default)
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const navLinks = [
    { id: 'hero', labelTh: 'หน้าแรก', labelEn: 'Home', href: '#hero' },
    { id: 'features', labelTh: 'ฟีเจอร์', labelEn: 'Features', href: '#features' },
    { id: 'how-it-works', labelTh: 'วิธีใช้งาน', labelEn: 'How It Works', href: '#how-it-works' },
    { id: 'hardware', labelTh: 'ฮาร์ดแวร์', labelEn: 'Hardware', href: '#hardware' },
    { id: 'faq', labelTh: 'คำถามที่พบบ่อย', labelEn: 'FAQ', href: '#faq' },
  ];

  const faqItems = [
    {
      q: 'ปลอกคอครอบคลุมพื้นที่การใช้งานทั่วประเทศหรือไม่?',
      qEn: 'Does the tracking work nationwide across Thailand?',
      a: 'ครอบคลุมทุกพื้นที่ทั่วประเทศที่มีสัญญาณเซลลูลาร์ NB-IoT และ LTE Cat-M1 โดยทำงานเชื่อมต่อตรงกับดาวเทียม GNSS จึงสามารถระบุตำแหน่งและส่งข้อมูลได้แม้ในพื้นที่ห่างไกล โดยไม่ถูกจำกัดระยะทางเหมือนระบบบลูทูธ (Bluetooth) หรือ AirTag',
      aEn: 'Yes, it works across Thailand via cellular NB-IoT and LTE Cat-M1 networks coupled with GNSS satellites, completely eliminating short Bluetooth range limits.',
    },
    {
      q: 'แบตเตอรี่ใช้งานได้นานแค่ไหน และชาร์จอย่างไร?',
      qEn: 'How long does the battery last and how to charge it?',
      a: 'แบตเตอรี่ Li-Po พร้อมชิปบริหารจัดการพลังงานอัจฉริยะ (PMU) ใช้งานต่อเนื่องได้ประมาณ 3-7 วันตามความถี่ในการส่งพิกัด พร้อมระบบแจ้งเตือนเมื่อแบตเตอรี่ต่ำกว่า 20% และสามารถชาร์จไฟผ่านพอร์ต USB Type-C ทั่วไปได้อย่างสะดวกรวดเร็ว',
      aEn: 'The battery lasts approximately 3-7 days with smart PMU power optimization. Low-battery alerts trigger below 20%, and it recharges quickly via standard USB Type-C.',
    },
    {
      q: 'หากมีผู้พบสัตว์เลี้ยง สแกน QR Code แล้วจะแสดงข้อมูลอะไรบ้าง?',
      qEn: 'What happens when someone scans the collar QR Code?',
      a: 'ผู้พบสัตว์เลี้ยงสามารถใช้กล้องมือถือทั่วไปสแกน QR Code บนปลอกคอได้ทันทีโดยไม่ต้องโหลดแอป หน้าจอจะแสดงชื่อ รูปภาพ และปุ่มโทรติดต่อเจ้าของฉุกเฉินได้ใน 1 คลิก พร้อมระบบปกป้องความเป็นส่วนตัว ไม่เปิดเผยที่อยู่บ้าน',
      aEn: 'Anyone can scan the QR code with their standard camera to see the pet profile and one-tap emergency call button, with home address strictly shielded.',
    },
    {
      q: 'ต้องดาวน์โหลดแอปพลิเคชันลงในมือถือหรือไม่?',
      qEn: 'Do I need to download and install a mobile app?',
      a: 'ไม่จำเป็นต้องดาวน์โหลด สามารถเข้าใช้งานระบบติดตามสดผ่าน WebApp บนเบราว์เซอร์มือถือ แท็บเล็ต หรือคอมพิวเตอร์ได้ทันที รองรับทั้งระบบ iOS และ Android สะดวก ใช้งานง่าย ไม่เปลืองพื้นที่หน่วยความจำ',
      aEn: 'No app download required. The live tracking WebApp runs seamlessly in modern browsers across iOS, Android, and desktop without taking up device storage.',
    },
    {
      q: 'ระบบแจ้งเตือนโซนปลอดภัย (Safe Zone Geofence) ทำงานอย่างไร?',
      qEn: 'How does the Smart Geofence alert work?',
      a: 'คุณสามารถกำหนดรัศมีพื้นที่ปลอดภัยรอบบ้านหรือสวนได้ผ่านหน้าแผนที่ หากสัตว์เลี้ยงก้าวข้ามขอบเขตที่ตั้งไว้ ระบบจะส่งการแจ้งเตือนฉุกเฉินถึงคุณทันที เพื่อให้ติดตามตัวน้องกลับมาได้อย่างรวดเร็วที่สุด',
      aEn: 'You can set a customizable virtual radius around your home. If your pet wanders beyond the boundary, instant push notifications alert you immediately.',
    },
  ];

  return (
    <div className="min-h-dvh bg-white text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white overflow-x-hidden">
      {/* -------------------- Top Accent Edge (Inspired by Image 2) -------------------- */}
      <div className="h-[3px] w-full bg-[#1e293b]" />

      {/* -------------------- Sleek Header Navbar (Inspired by Image 2) -------------------- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-18 sm:h-20 flex items-center justify-between">
          {/* Left: Modern Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <span className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center transition-transform group-hover:scale-105">
              <PawPrint className="w-4.5 h-4.5 fill-white text-white" />
            </span>
            <span className="font-extrabold text-xl sm:text-2xl text-neutral-950 tracking-tight">
              Paw<span className="text-neutral-500 font-semibold">&amp;</span>Co.
            </span>
          </Link>

          {/* Right: Navigation Items + Actions Grouped Right (Like Image 2) */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-8">
            {/* Nav Links */}
            <nav className="flex items-center gap-6 xl:gap-8 text-[14px] font-medium text-neutral-600">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setActiveSection(link.id as any)}
                    className={`transition-colors duration-150 py-1 hover:text-neutral-950 ${
                      isActive ? 'text-neutral-950 font-semibold' : 'text-neutral-600'
                    }`}
                  >
                    {locale === 'th' ? link.labelTh : link.labelEn}
                  </a>
                );
              })}
            </nav>

            {/* Language Switcher Pill */}
            <button
              type="button"
              onClick={() => setLocale(locale === 'th' ? 'en' : 'th')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span>{locale === 'th' ? 'EN' : 'TH'}</span>
            </button>

            {/* Solid Black Pill Sign In Button */}
            <Link href="/auth">
              <button
                type="button"
                className="rounded-full px-6 py-2.5 text-[14px] font-semibold text-white bg-black hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                {locale === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
              </button>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2.5">
            <button
              type="button"
              onClick={() => setLocale(locale === 'th' ? 'en' : 'th')}
              className="px-2.5 py-1 text-xs font-semibold rounded-full border border-neutral-200 text-neutral-700"
            >
              {locale === 'th' ? 'EN' : 'TH'}
            </button>

            <Link href="/auth">
              <button
                type="button"
                className="rounded-full px-4 py-1.5 text-xs font-semibold text-white bg-black"
              >
                {locale === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
              </button>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-100 bg-white px-6 py-4 space-y-3 animate-slide-down">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => {
                  setActiveSection(link.id as any);
                  setMobileMenuOpen(false);
                }}
                className="block text-sm font-medium text-neutral-800 py-1.5 hover:text-black"
              >
                {locale === 'th' ? link.labelTh : link.labelEn}
              </a>
            ))}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-center">
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <button className="w-full rounded-full py-2.5 text-xs font-semibold text-white bg-black">
                  {locale === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* -------------------- Concise & Captivating Editorial Problem Hero -------------------- */}
      <section id="hero" className="pt-14 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden bg-gradient-to-b from-[#FAFBFB] via-white to-white">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Punchy Catchy Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-950 tracking-tight leading-[1.18] max-w-2xl mx-auto">
            {locale === 'th' ? (
              <>
                ทำไมสัตว์เลี้ยง
                <br />
                ยังคงหลุดหาย?
              </>
            ) : (
              <>
                Why Do Pets
                <br />
                Still Go Missing?
              </>
            )}
          </h1>

          {/* Concise & Engaging Narrative (No wall of text) */}
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl mx-auto font-normal">
            {locale === 'th'
              ? 'บลูทูธส่งได้แค่ 15 เมตร ส่วนแอร์แท็กต้องรอคนอื่นเดินผ่าน เมื่อน้องตกใจเตลิดหนี ทุกวินาทีที่ช้าไปคือระยะทางที่ไกลขึ้น เราจึงพัฒนาปลอกคอดาวเทียม IoT ที่แจ้งเตือนและระบุตำแหน่งสดได้ทันทีทั่วไทย'
              : 'Bluetooth only reaches 15 meters, and AirTags rely on passing strangers. When a pet flees in panic, every lost second matters. Paw&Co. brings dedicated satellite & cellular IoT tracking directly to your phone.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto rounded-full px-8 py-3.5 text-sm font-semibold text-white bg-black hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{locale === 'th' ? 'เข้าสู่แดชบอร์ดติดตามสด' : 'Launch Live Dashboard'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </Link>

            <Link href="/auth" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto rounded-full px-7 py-3.5 text-sm font-semibold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-300 active:scale-[0.98] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                {locale === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
              </button>
            </Link>
          </div>
        </div>

        {/* -------------------- Mobile Live Tracking App Showcase -------------------- */}
        <div className="max-w-4xl mx-auto mt-10 sm:mt-14">
          <div className="rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-2 sm:p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAFBFB]">
              <img
                src="/images/mobile-tracking-app.jpg"
                alt="Paw&Co. Real-Time Pet Tracking Mobile WebApp"
                className="w-full h-auto object-cover max-h-[520px]"
              />
            </div>
          </div>
        </div>

        {/* Feature Stats Metric Row with Clean Dividers & Mobile Alignment */}
        <div className="max-w-4xl mx-auto mt-12 sm:mt-18 pt-8 border-t border-neutral-200/80 px-2 sm:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-3 sm:gap-x-6 md:gap-0 md:divide-x md:divide-neutral-200/80 items-center">
            {/* Metric 1 */}
            <div className="group flex items-center justify-center px-1 sm:px-3 py-1 transition-all">
              <div className="flex items-center gap-2.5 sm:gap-3.5 w-full max-w-[165px] sm:max-w-[185px]">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-50 border border-neutral-200/70 flex items-center justify-center flex-shrink-0 text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-colors duration-200">
                  <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-bold text-[13px] sm:text-sm text-neutral-950 tracking-tight truncate">
                    {locale === 'th' ? '10 วินาที' : '10 Seconds'}
                  </div>
                  <div className="text-[11px] sm:text-xs text-neutral-500 leading-tight mt-0.5 truncate">
                    {locale === 'th' ? 'อัปเดตตำแหน่งสด' : 'Live location update'}
                  </div>
                </div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="group flex items-center justify-center px-1 sm:px-3 py-1 transition-all">
              <div className="flex items-center gap-2.5 sm:gap-3.5 w-full max-w-[165px] sm:max-w-[185px]">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-50 border border-neutral-200/70 flex items-center justify-center flex-shrink-0 text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-colors duration-200">
                  <Radio className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-bold text-[13px] sm:text-sm text-neutral-950 tracking-tight truncate">
                    NB-IoT
                  </div>
                  <div className="text-[11px] sm:text-xs text-neutral-500 leading-tight mt-0.5 truncate">
                    {locale === 'th' ? 'สัญญาณทั่วประเทศ' : 'Nationwide cellular'}
                  </div>
                </div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="group flex items-center justify-center px-1 sm:px-3 py-1 transition-all">
              <div className="flex items-center gap-2.5 sm:gap-3.5 w-full max-w-[165px] sm:max-w-[185px]">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-50 border border-neutral-200/70 flex items-center justify-center flex-shrink-0 text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-colors duration-200">
                  <Droplets className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-bold text-[13px] sm:text-sm text-neutral-950 tracking-tight truncate">
                    IP67
                  </div>
                  <div className="text-[11px] sm:text-xs text-neutral-500 leading-tight mt-0.5 truncate">
                    {locale === 'th' ? 'กันน้ำและกันฝุ่น' : 'Water & dust proof'}
                  </div>
                </div>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="group flex items-center justify-center px-1 sm:px-3 py-1 transition-all">
              <div className="flex items-center gap-2.5 sm:gap-3.5 w-full max-w-[165px] sm:max-w-[185px]">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-50 border border-neutral-200/70 flex items-center justify-center flex-shrink-0 text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-colors duration-200">
                  <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-bold text-[13px] sm:text-sm text-neutral-950 tracking-tight truncate">
                    100% Free
                  </div>
                  <div className="text-[11px] sm:text-xs text-neutral-500 leading-tight mt-0.5 truncate">
                    {locale === 'th' ? 'เข้าใช้งานได้ฟรี' : 'Free access'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- Core Features Section -------------------- */}
      <section id="features" className="py-18 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFBFB] border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
              {locale === 'th' ? 'ฟีเจอร์หลักที่ออกแบบมาเพื่อคุณ' : 'Core Features Designed For You'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {locale === 'th'
                ? 'ดูแลได้มากกว่า ด้วยเทคโนโลยีที่เข้าใจทั้งคุณและสัตว์เลี้ยง'
                : 'Comprehensive care powered by technology that understands you and your pet.'}
            </p>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-md transition-all duration-200 text-left space-y-3.5">
              <div className="w-10 h-10 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-800">
                <MapPin className="w-5 h-5 text-neutral-800" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">
                {locale === 'th' ? 'ติดตามพิกัดแม่นยำสูง' : 'High Precision GPS'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {locale === 'th'
                  ? 'รองรับ GNSS Multi-Constellation อัปเดตตำแหน่งทุก 10 วินาที แม่นยำ ทั้งในเมืองและพื้นที่ห่างไกล'
                  : 'Multi-Constellation GNSS updates every 10 seconds with high accuracy across both urban and remote areas.'}
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-md transition-all duration-200 text-left space-y-3.5">
              <div className="w-10 h-10 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-800">
                <ShieldCheck className="w-5 h-5 text-neutral-800" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">
                {locale === 'th' ? 'พื้นที่ปลอดภัยอัจฉริยะ' : 'Smart Geofencing'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {locale === 'th'
                  ? 'ตั้งโซนปลอดภัย (Safe Zone) และรับการแจ้งเตือนทันที เมื่อสัตว์เลี้ยงออกจากพื้นที่'
                  : 'Define custom safe zones and receive immediate push alerts when your pet leaves the designated boundary.'}
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-md transition-all duration-200 text-left space-y-3.5">
              <div className="w-10 h-10 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-800">
                <QrCode className="w-5 h-5 text-neutral-800" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">
                {locale === 'th' ? 'ป้ายชื่อดิจิทัล QR Tag' : 'Digital QR Collar Tag'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {locale === 'th'
                  ? 'สแกน QR เพื่อดูข้อมูลเจ้าของ และติดต่อกลับได้ทันที พร้อมระบบปกป้องความเป็นส่วนตัว'
                  : 'Finders can scan the QR code to contact the owner instantly while strictly shielding private home addresses.'}
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-7 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-md transition-all duration-200 text-left space-y-3.5">
              <div className="w-10 h-10 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-800">
                <TrendingUp className="w-5 h-5 text-neutral-800" />
              </div>
              <h3 className="text-base font-bold text-neutral-950">
                {locale === 'th' ? 'ประวัติเส้นทาง & สถิติ' : 'Route History & Stats'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {locale === 'th'
                  ? 'ดูเส้นทางย้อนหลัง ระยะทาง ความเร็ว และประวัติรีโมตแบตเตอรี่ได้ตลอด 24 ชม.'
                  : 'Replay past movement routes, total distance, average speed, and battery health analytics 24/7.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- How It Works Section -------------------- */}
      <section id="how-it-works" className="py-18 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
              {locale === 'th' ? 'ขั้นตอนการเริ่มต้นใช้งาน 3 ขั้นตอน' : '3 Easy Steps to Get Started'}
            </h2>
          </div>

          {/* 3 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-white border border-neutral-200/90 shadow-sm hover:border-neutral-300 transition-all text-left space-y-4">
              <div className="w-10 h-10 rounded-full border border-neutral-400 text-neutral-900 font-bold flex items-center justify-center text-sm bg-neutral-50">
                1
              </div>
              <h3 className="text-lg font-bold text-neutral-950">
                {locale === 'th' ? 'ลงทะเบียนสัตว์เลี้ยง' : 'Register Your Pet'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {locale === 'th'
                  ? 'สร้างโปรไฟล์สัตว์เลี้ยง พร้อมแนบรูปภาพ 2-5 รูป หรือระบุข้อมูลสายพันธุ์และประวัติสำคัญ'
                  : 'Create your dog profile with 2-5 photos, breed details, medical notes, and emergency contact numbers.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-white border border-neutral-200/90 shadow-sm hover:border-neutral-300 transition-all text-left space-y-4">
              <div className="w-10 h-10 rounded-full border border-neutral-400 text-neutral-900 font-bold flex items-center justify-center text-sm bg-neutral-50">
                2
              </div>
              <h3 className="text-lg font-bold text-neutral-950">
                {locale === 'th' ? 'สวมปลอกคออัจฉริยะ' : 'Attach Smart Collar'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {locale === 'th'
                  ? 'จับคู่อุปกรณ์ LILYGO ESP32-S3 เข้ากับบัญชีผู้ใช้ และตั้งค่าพื้นที่ปลอดภัย (Safe Zone)'
                  : 'Pair the LILYGO ESP32-S3 tracker to your account and configure your home safe zone boundary.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-white border border-neutral-200/90 shadow-sm hover:border-neutral-300 transition-all text-left space-y-4">
              <div className="w-10 h-10 rounded-full border border-neutral-400 text-neutral-900 font-bold flex items-center justify-center text-sm bg-neutral-50">
                3
              </div>
              <h3 className="text-lg font-bold text-neutral-950">
                {locale === 'th' ? 'ติดตามผลได้ทันที' : 'Track in Real-Time'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {locale === 'th'
                  ? 'ดูตำแหน่งแบบเรียลไทม์ผ่านแผนที่ และรับการแจ้งเตือนเมื่อมีความผิดปกติได้ตลอด 24 ชม.'
                  : 'Monitor real-time positions on the map and receive instant alert notifications 24/7.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- Hardware Section -------------------- */}
      <section id="hardware" className="py-18 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFBFB] border-t border-neutral-100">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
              {locale === 'th' ? 'อุปกรณ์ที่ใช้ในการพัฒนา' : 'Hardware & Architecture'}
            </h2>
            <div className="pt-1">
              <div className="text-base sm:text-lg font-bold text-neutral-900">
                LILYGO T-SIM7080G-S3
              </div>
              <div className="text-xs font-medium text-neutral-500 mt-0.5">
                ESP32-S3 Dual-Core Xtensa LX7
              </div>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl mx-auto">
              {locale === 'th'
                ? 'บอร์ดไมโครคอนโทรลเลอร์ที่ออกแบบสำหรับการสื่อสารระยะไกล ผสานชิปประมวลผล ESP32-S3 และโมดูล GNSS หรือรองรับ NB-IoT และ LTE Cat-M1 พร้อมระบบจัดการพลังงาน PMU ในตัว'
                : 'Long-range IoT microcontroller board integrating ESP32-S3 processing power, GNSS satellite location, and dual NB-IoT / LTE Cat-M1 connectivity with onboard PMU.'}
            </p>
          </div>

          {/* 3x2 Grid of 6 Specification Cards (Centered, No Right Image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* 1. GNSS */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-800">
                <Compass className="w-5 h-5 text-neutral-800" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-neutral-950">GNSS / GPS</div>
                <div className="text-xs text-neutral-500 leading-relaxed">
                  {locale === 'th' ? 'รองรับหลายกลุ่มดาวเทียม ระบุตำแหน่งแม่นยำสูง' : 'Multi-constellation satellite tracking'}
                </div>
              </div>
            </div>

            {/* 2. Battery */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-800">
                <Battery className="w-5 h-5 text-neutral-800" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-neutral-950">Li-Po 100 mAh</div>
                <div className="text-xs text-neutral-500 leading-relaxed">
                  {locale === 'th' ? 'แบตเตอรี่พร้อมวงจรจัดการพลังงาน PMU ในตัว' : 'Onboard battery & smart PMU power management'}
                </div>
              </div>
            </div>

            {/* 3. Enclosure */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-800">
                <Shield className="w-5 h-5 text-neutral-800" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-neutral-950">IP67 Enclosure</div>
                <div className="text-xs text-neutral-500 leading-relaxed">
                  {locale === 'th' ? 'กันน้ำกันฝุ่น เคสโครงสร้างทนทานทุกกิจกรรม' : 'Rugged waterproof and dustproof protection'}
                </div>
              </div>
            </div>

            {/* 4. RGB LED */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-800">
                <Sparkles className="w-5 h-5 text-neutral-800" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-neutral-950">WS2812B RGB</div>
                <div className="text-xs text-neutral-500 leading-relaxed">
                  {locale === 'th' ? 'ไฟแสดงสถานะระบบ และไฟเตือนระบุตำแหน่ง' : 'Visual beacon & smart multi-color status LED'}
                </div>
              </div>
            </div>

            {/* 5. MQTT */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-800">
                <Radio className="w-5 h-5 text-neutral-800" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-neutral-950">MQTT Protocol</div>
                <div className="text-xs text-neutral-500 leading-relaxed">
                  {locale === 'th' ? 'ส่งข้อมูลพิกัดแบบเรียลไทม์ผ่าน NB-IoT / LTE' : 'Real-time telemetry stream via cellular NB-IoT'}
                </div>
              </div>
            </div>

            {/* 6. Type-C */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center flex-shrink-0 text-neutral-800">
                <Zap className="w-5 h-5 text-neutral-800" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-neutral-950">Type-C Fast Charge</div>
                <div className="text-xs text-neutral-500 leading-relaxed">
                  {locale === 'th' ? 'พอร์ตสากล ชาร์จสะดวก รวดเร็ว ปลอดภัย' : 'Universal fast and convenient recharging'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- FAQ Section (Modern Rounded Cards - Image 2 Style) -------------------- */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F7F4EE] border-t border-[#ECE7DC]">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
              {locale === 'th' ? 'คำถามที่พบบ่อย' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {locale === 'th'
                ? 'ข้อสงสัยเกี่ยวกับการทำงานของระบบติดตามและปลอกคออัจฉริยะ'
                : 'Common questions about the tracking system and smart collar features.'}
            </p>
          </div>

          {/* Individual Rounded Pill Cards (Inspired by Image 2) */}
          <div className="space-y-3.5 sm:space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl sm:rounded-[22px] transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-black/5'
                      : 'shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 sm:px-8 py-5 sm:py-5.5 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                      {locale === 'th' ? item.q : item.qEn}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-[#8C6D46] transition-transform duration-300 ease-out ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 sm:px-8 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100/80 animate-fade-in">
                      {locale === 'th' ? item.a : item.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------- Grand Dark CTA Banner -------------------- */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-[#FAFBFB]">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-black p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden space-y-6">
            {/* Center Paw Icon */}
            <div className="flex justify-center">
              <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white fill-white" />
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {locale === 'th' ? 'เริ่มต้นปกป้องเพื่อนรักได้แล้ววันนี้' : 'Start Protecting Your Best Friend Today'}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
                {locale === 'th'
                  ? 'มาร่วมเป็นส่วนหนึ่งในการดูแลสัตว์เลี้ยงของคุณ ด้วยเทคโนโลยีที่เข้าถึงได้'
                  : 'Join us in caring for your pets with accessible, state-of-the-art IoT tracking.'}
              </p>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto rounded-full px-8 py-3.5 text-xs sm:text-sm font-semibold text-black bg-white hover:bg-neutral-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-black" />
                  <span>{locale === 'th' ? 'เข้าสู่หน้าติดตามสด' : 'Open Live Tracking'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>

              <Link href="/auth" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto rounded-full px-7 py-3.5 text-xs sm:text-sm font-semibold text-white bg-transparent hover:bg-white/10 border border-white/30 active:scale-[0.98] transition-all"
                >
                  {locale === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- Footer -------------------- */}
      <footer className="py-10 bg-black text-neutral-400 text-xs border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Brand */}
          <div className="flex items-center gap-2.5">
            <PawPrint className="w-5 h-5 text-white fill-white" />
            <span className="font-extrabold text-white text-base tracking-tight">Paw&amp;Co.</span>
          </div>

          {/* Center Project Purpose */}
          <div className="text-center text-[12px] text-neutral-400">
            {locale === 'th'
              ? 'โครงการพัฒนาและเพื่อการศึกษา | ระบบติดตามตำแหน่งสัตว์เลี้ยงผ่าน NB-IoT และ GPS'
              : 'Academic & Prototype Project | Pet Tracking System via NB-IoT & GPS'}
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-6 text-[12px] text-neutral-400">
            <Link href="/settings" className="hover:text-white transition-colors">
              {locale === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}
            </Link>
            <Link href="/hardware" className="hover:text-white transition-colors">
              {locale === 'th' ? 'ติดต่อเรา' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
