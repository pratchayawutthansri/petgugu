'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema, LoginInput, RegisterInput } from '@/schemas/auth.schema';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/contexts/toast-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Radio,
  PawPrint,
  Heart,
  Shield,
  Zap,
  MapPin,
  Check,
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { login, register: registerUser, loginAsDemoAccount } = useAuth();
  const { t, locale } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login Form
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@pawsandco.com',
      password: 'demo1234',
      rememberMe: true,
    },
  });

  // Register Form
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
  });

  const handleLoginSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    try {
      const res = await login(data.email, data.password);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          message: t('auth.loginSuccess'),
        });
        router.push('/dashboard');
      } else {
        showToast({
          type: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          message: res.error || 'กรุณาตรวจสอบอีเมลและรหัสผ่าน',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    try {
      const res = await registerUser(data);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'ลงทะเบียนสำเร็จ',
          message: t('auth.registerSuccess'),
        });
        router.push('/dashboard');
      } else {
        showToast({
          type: 'error',
          title: 'ลงทะเบียนไม่สำเร็จ',
          message: res.error || 'เกิดข้อผิดพลาดในการลงทะเบียน',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (type: 'user' | 'admin') => {
    await loginAsDemoAccount(type);
    showToast({
      type: 'success',
      title: 'Demo Mode',
      message: `เข้าสู่ระบบในฐานะ ${type === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'เจ้าของสัตว์เลี้ยง (สมชาย ใจดี)'} เรียบร้อยแล้ว`,
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-dvh bg-surface-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-surface-900 font-sans">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-primary-400/10 via-secondary-300/10 to-transparent rounded-full blur-[140px]" />
      </div>

      {/* Back to Home Link */}
      <div className="max-w-5xl mx-auto w-full mb-5 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-surface-600 hover:text-primary-600 transition-colors bg-white/90 px-4 py-2 rounded-full border border-surface-200 shadow-subtle hover:border-primary-300"
        >
          <ArrowLeft className="w-4 h-4 text-primary-600" />
          <span>{locale === 'th' ? 'กลับสู่หน้าแรก (Back to Home)' : 'Back to Home'}</span>
        </Link>
      </div>

      {/* Main Dual-Pane Card */}
      <div className="max-w-5xl mx-auto w-full rounded-3xl bg-white border border-surface-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* Left Branding Art Pane (5 Cols on Desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-primary-700 via-indigo-800 to-primary-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-surface-800">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white font-bold text-2xl shadow-inner border border-white/25 group-hover:scale-105 transition-transform">
                🐾
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white block">
                  Paws<span className="text-secondary-300">&</span>Co.
                </span>
                <span className="text-xs text-primary-200 font-semibold">
                  IoT Dog Tracking System
                </span>
              </div>
            </Link>

            <div className="space-y-2 pt-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white tracking-tight">
                {locale === 'th' ? 'ปกป้องเพื่อนสี่ขาที่คุณรัก ได้ทุกที่ ทุกเวลา' : 'Protect Your Beloved Dogs Anywhere'}
              </h3>
              <p className="text-xs sm:text-sm text-primary-100/80 leading-relaxed font-normal">
                {locale === 'th'
                  ? 'เข้าถึงตำแหน่งสัตว์เลี้ยงแบบใกล้เคียงเวลาจริง จัดการเขตปลอดภัย และสร้างป้ายชื่อดิจิทัล QR Tag ได้ในระบบเดียว'
                  : 'Access near real-time pet locations, manage geofences, and configure digital QR tags in one unified platform.'}
              </p>
            </div>
          </div>

          {/* Feature Highlights on Left Pane */}
          <div className="relative z-10 my-8 space-y-3">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs shadow-subtle">
              <div className="w-9 h-9 rounded-xl bg-success/20 text-success-300 flex items-center justify-center flex-shrink-0">
                <Radio className="w-4 h-4 text-success-300 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-white block text-sm">
                  {locale === 'th' ? 'ส่งพิกัดทุก 10 วินาที' : '10s GPS Updates'}
                </span>
                <span className="text-[11px] text-primary-200">
                  {locale === 'th' ? 'ระบุพิกัดดาวเทียมแม่นยำด้วย GPS + NB-IoT' : 'High precision satellite positioning'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs shadow-subtle">
              <div className="w-9 h-9 rounded-xl bg-secondary-400/20 text-secondary-200 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-secondary-300" />
              </div>
              <div>
                <span className="font-bold text-white block text-sm">
                  {locale === 'th' ? 'พื้นที่ปลอดภัยอัจฉริยะ' : 'Smart Geofencing'}
                </span>
                <span className="text-[11px] text-primary-200">
                  {locale === 'th' ? 'รับแจ้งเตือนทันทีเมื่อสัตว์เลี้ยงออกนอกบ้าน' : 'Instant alerts when escaping boundary'}
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial / Dog Avatar Quote */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center gap-3.5">
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80"
              alt="Mochi"
              className="w-11 h-11 rounded-full object-cover border-2 border-white/40 shadow-card"
            />
            <div className="text-xs text-primary-100">
              <p className="font-bold text-white text-sm">โมจิ (Mochi) & ลัคกี้ (Lucky)</p>
              <p className="text-primary-200/80 text-[11px]">สุนัขตัวอย่างในระบบ Demo พร้อมทดสอบ</p>
            </div>
          </div>
        </div>

        {/* Right Form Pane (7 Cols on Desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Header / Tabs */}
            <div className="flex flex-col items-center sm:items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight">
                {activeTab === 'login' ? t('auth.signInTitle') : t('auth.signUpTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-surface-500 mt-1">
                {activeTab === 'login' ? t('auth.signInSubtitle') : t('auth.signUpSubtitle')}
              </p>

              <div className="mt-6 w-full flex justify-center sm:justify-start">
                <Tabs
                  tabs={[
                    { id: 'login', label: t('nav.signIn') },
                    { id: 'register', label: t('auth.registerBtn') },
                  ]}
                  activeTab={activeTab}
                  onChange={(id) => setActiveTab(id as 'login' | 'register')}
                />
              </div>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                <Input
                  label={t('auth.emailLabel')}
                  type="email"
                  placeholder="demo@pawsandco.com"
                  leftIcon={<Mail className="w-4 h-4 text-surface-400" />}
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register('email')}
                />

                <Input
                  label={t('auth.passwordLabel')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-4 h-4 text-surface-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-surface-400 hover:text-surface-600 touch-target flex items-center justify-center p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  error={loginForm.formState.errors.password?.message}
                  {...loginForm.register('password')}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 font-extrabold py-3.5 rounded-full text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-card shadow-primary-500/25 hover:shadow-card-hover transition-all flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'กำลังเข้าสู่ระบบ...' : t('auth.loginBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-3.5">
                <Input
                  label={t('auth.displayNameLabel')}
                  type="text"
                  placeholder="ชื่อ-นามสกุลของคุณ"
                  leftIcon={<UserIcon className="w-4 h-4 text-surface-400" />}
                  error={registerForm.formState.errors.displayName?.message}
                  {...registerForm.register('displayName')}
                />

                <Input
                  label={t('auth.emailLabel')}
                  type="email"
                  placeholder="yourname@example.com"
                  leftIcon={<Mail className="w-4 h-4 text-surface-400" />}
                  error={registerForm.formState.errors.email?.message}
                  {...registerForm.register('email')}
                />

                <Input
                  label="เบอร์โทรศัพท์ (Phone Number)"
                  type="tel"
                  placeholder="081-234-5678"
                  leftIcon={<Phone className="w-4 h-4 text-surface-400" />}
                  error={registerForm.formState.errors.phoneNumber?.message}
                  {...registerForm.register('phoneNumber')}
                />

                <Input
                  label={t('auth.passwordLabel')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  leftIcon={<Lock className="w-4 h-4 text-surface-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-surface-400 hover:text-surface-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  error={registerForm.formState.errors.password?.message}
                  {...registerForm.register('password')}
                />

                <Input
                  label={t('auth.confirmPasswordLabel')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                  leftIcon={<Lock className="w-4 h-4 text-surface-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-surface-400 hover:text-surface-600 p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  error={registerForm.formState.errors.confirmPassword?.message}
                  {...registerForm.register('confirmPassword')}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 font-extrabold py-3.5 rounded-full text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-card shadow-primary-500/25 transition-all"
                >
                  <span>{isSubmitting ? 'กำลังบันทึก...' : t('auth.registerBtn')}</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Demo Login Cards */}
          <div className="mt-8 pt-6 border-t border-surface-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                เข้าสู่ระบบด่วน (Quick Demo Mode)
              </span>
              <span className="text-[11px] font-bold text-primary-700 px-2.5 py-0.5 rounded-full bg-primary-50 border border-primary-200">
                1-Click Login
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* User Demo Card */}
              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="p-3.5 rounded-2xl border border-surface-200 bg-surface-50/80 hover:bg-primary-50/50 hover:border-primary-300 hover:shadow-card transition-all text-left flex items-center gap-3.5 group touch-target"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                  alt="Somchai"
                  className="w-10 h-10 rounded-full object-cover border-2 border-surface-300 flex-shrink-0 group-hover:border-primary-400 transition-colors"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-extrabold text-surface-900 block truncate group-hover:text-primary-700">
                    สมชาย (Demo User)
                  </span>
                  <span className="text-[11px] text-surface-500 block truncate">
                    demo@pawsandco.com (2 สุนัข)
                  </span>
                </div>
              </button>

              {/* Admin Demo Card */}
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-3.5 rounded-2xl border border-surface-200 bg-surface-50/80 hover:bg-secondary-50/50 hover:border-secondary-300 hover:shadow-card transition-all text-left flex items-center gap-3.5 group touch-target"
              >
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
                  alt="Admin"
                  className="w-10 h-10 rounded-full object-cover border-2 border-surface-300 flex-shrink-0 group-hover:border-secondary-400 transition-colors"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-extrabold text-surface-900 block truncate group-hover:text-secondary-700">
                    ผู้ดูแลระบบ (Admin)
                  </span>
                  <span className="text-[11px] text-surface-500 block truncate">
                    admin@pawsandco.com (Full Control)
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
