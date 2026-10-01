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
import {
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  PawPrint,
  IdCard,
} from 'lucide-react';

function BrandLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center ${
          inverse ? 'bg-white text-[#181a20]' : 'bg-[#181a20] text-white'
        }`}
      >
        <PawPrint className="w-5 h-5 fill-current" />
      </div>
      <span
        className={`text-xl font-bold tracking-tight ${
          inverse ? 'text-white' : 'text-neutral-900'
        }`}
      >
        Paw&amp;Co.
      </span>
    </div>
  );
}

function PawWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="45" cy="65" rx="16" ry="24" transform="rotate(-25 45 65)" />
      <ellipse cx="80" cy="40" rx="17" ry="26" transform="rotate(-8 80 40)" />
      <ellipse cx="125" cy="42" rx="17" ry="26" transform="rotate(8 125 42)" />
      <ellipse cx="158" cy="68" rx="16" ry="24" transform="rotate(25 158 68)" />
      <path d="M 60 115 C 45 130 45 155 65 172 C 85 185 120 185 140 172 C 160 155 160 130 145 115 C 135 105 125 110 102 110 C 80 110 70 105 60 115 Z" />
    </svg>
  );
}

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { login, register: registerUser, loginAsDemoAccount } = useAuth();
  const { locale } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login Form
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: true,
    },
  });

  // Register Form
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      username: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleLoginSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    try {
      const res = await login(data.identifier, data.password);
      if (res.success) {
        showToast({
          type: 'success',
          title: locale === 'th' ? 'เข้าสู่ระบบสำเร็จ' : 'Login Successful',
          message: locale === 'th' ? 'ยินดีต้อนรับกลับสู่ Paw&Co.' : 'Welcome back to Paw&Co.',
        });
        router.push('/dashboard');
      } else {
        showToast({
          type: 'error',
          title: locale === 'th' ? 'เข้าสู่ระบบไม่สำเร็จ' : 'Login Failed',
          message: res.error || (locale === 'th' ? 'กรุณาตรวจสอบไอดีและรหัสผ่าน' : 'Invalid ID or password'),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    try {
      const res = await registerUser({
        displayName: data.displayName,
        username: data.username,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
      if (res.success) {
        showToast({
          type: 'success',
          title: locale === 'th' ? 'ลงทะเบียนสำเร็จ' : 'Registration Successful',
          message: locale === 'th' ? 'สร้างบัญชีผู้ใช้เรียบร้อยแล้ว' : 'Account created successfully',
        });
        router.push('/dashboard');
      } else {
        showToast({
          type: 'error',
          title: locale === 'th' ? 'ลงทะเบียนไม่สำเร็จ' : 'Registration Failed',
          message: res.error || (locale === 'th' ? 'เกิดข้อผิดพลาดในการลงทะเบียน' : 'Failed to create account'),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await loginAsDemoAccount('user');
      showToast({
        type: 'success',
        title: locale === 'th' ? 'เข้าสู่ระบบด้วย Google สำเร็จ' : 'Google Sign-In Successful',
        message: locale === 'th' ? 'เชื่อมต่อบัญชี Google เข้าสู่ระบบเรียบร้อยแล้ว' : 'Connected via Google account',
      });
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick login for prototype testing
  const handleQuickLogin = async (type: 'user' | 'admin') => {
    await loginAsDemoAccount(type);
    showToast({
      type: 'success',
      title: locale === 'th' ? 'เข้าสู่ระบบสำเร็จ' : 'Login Successful',
      message:
        locale === 'th'
          ? `เข้าสู่ระบบในฐานะ ${type === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'เจ้าของสัตว์เลี้ยง (สมชาย ใจดี)'}`
          : `Signed in as ${type === 'admin' ? 'Administrator' : 'Pet Owner'}`,
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Outer Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-[28px] border border-neutral-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 sm:p-7 lg:p-8">
        {/* Top Back Link (Desktop & Mobile) */}
        <div className="mb-4 sm:mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{locale === 'th' ? 'กลับสู่หน้าหลัก' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Content Container: Split Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* ================= LEFT SIDE: Dark Branding Box (Desktop Only) ================= */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#181a20] rounded-[22px] p-8 lg:p-10 text-white relative overflow-hidden flex-col justify-between min-h-[510px]">
            {/* Logo */}
            <div className="relative z-10">
              <BrandLogo inverse={true} />
            </div>

            {/* Dynamic Headline & Subtitle */}
            <div className="relative z-10 my-auto py-8">
              {activeTab === 'login' ? (
                <>
                  <h2 className="text-2xl lg:text-[26px] font-bold text-white leading-snug tracking-tight">
                    {locale === 'th' ? (
                      <>
                        ปกป้องเพื่อนสี่ขาที่คุณรัก
                        <br />
                        ได้ทุกที่ ตลอด 24 ชม.
                      </>
                    ) : (
                      <>
                        Protect Your Loved Pets
                        <br />
                        Anywhere, 24/7
                      </>
                    )}
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-3.5 leading-relaxed max-w-xs">
                    {locale === 'th'
                      ? 'เข้าถึงความช่วยเหลือและบริการดูแลสัตว์เลี้ยงของคุณ ได้อย่างสะดวก รวดเร็ว'
                      : 'Instant access to tracking, care services and smart alerts for your pets.'}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl lg:text-[26px] font-bold text-white leading-snug tracking-tight">
                    {locale === 'th' ? (
                      <>
                        ดูแลน้องเหมือน
                        <br />
                        ครอบครัวเดียวกัน
                      </>
                    ) : (
                      <>
                        Care for Your Pets
                        <br />
                        Like Family
                      </>
                    )}
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-3.5 leading-relaxed max-w-xs">
                    {locale === 'th'
                      ? 'พื้นที่สำหรับคนรักสัตว์ ให้การดูแลเรื่องเล็กๆ เป็นเรื่องง่ายขึ้น'
                      : 'The dedicated platform making everyday pet safety and wellness simple.'}
                  </p>
                </>
              )}
            </div>

            {/* Empty footer spacer for positioning */}
            <div className="h-4 relative z-10" />

            {/* Faint Paw Print Silhouette Watermark in Bottom-Left */}
            <PawWatermark className="absolute -bottom-8 -left-8 w-60 h-60 text-white/[0.04] pointer-events-none select-none" />
          </div>

          {/* ================= RIGHT SIDE: Clean Form Area (Desktop & Mobile) ================= */}
          <div className="lg:col-span-7 flex flex-col justify-center px-1 sm:px-4 lg:px-6 py-2">
            {/* Mobile Header (Shown on < lg screens) */}
            <div className="lg:hidden mb-6">
              <BrandLogo inverse={false} />
              {activeTab === 'login' ? (
                <div className="mt-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight">
                    {locale === 'th' ? (
                      <>
                        ปกป้องเพื่อนสี่ขาที่คุณรัก
                        <br />
                        ได้ทุกที่ ตลอด 24 ชม.
                      </>
                    ) : (
                      'Protect Your Loved Pets 24/7'
                    )}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    {locale === 'th'
                      ? 'เข้าถึงความช่วยเหลือและบริการดูแลสัตว์เลี้ยงของคุณ ได้อย่างสะดวก รวดเร็ว'
                      : 'Instant access to tracking and care services.'}
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                    {locale === 'th' ? 'สมัครสมาชิก' : 'Sign Up'}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    {locale === 'th'
                      ? 'สร้างบัญชีเพื่อเริ่มดูแลน้องๆ ของคุณ'
                      : 'Create an account to start caring for your pets.'}
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Form Title & Subtitle */}
            <div className="hidden lg:block mb-5">
              {activeTab === 'login' ? (
                <>
                  <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                    {locale === 'th' ? 'เข้าสู่ระบบ Paw&Co.' : 'Sign in to Paw&Co.'}
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                    {locale === 'th'
                      ? 'ยินดีต้อนรับกลับมา! กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ'
                      : 'Welcome back! Please enter your credentials.'}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                    {locale === 'th' ? 'สมัครสมาชิก' : 'Sign Up'}
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                    {locale === 'th'
                      ? 'สร้างบัญชีเพื่อเริ่มดูแลน้องๆ ของคุณ'
                      : 'Create an account to start managing your pets.'}
                  </p>
                </>
              )}
            </div>

            {/* ================= LOGIN FORM ================= */}
            {activeTab === 'login' && (
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-3">
                {/* ID Input */}
                <div>
                  <div className="relative rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={locale === 'th' ? 'ไอดี' : 'User ID / Username'}
                      className="w-full pl-11 pr-4 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent rounded-xl outline-none"
                      {...loginForm.register('identifier')}
                    />
                  </div>
                  {loginForm.formState.errors.identifier && (
                    <p className="text-[11px] text-red-600 mt-1 pl-1">
                      {loginForm.formState.errors.identifier.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="relative rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={locale === 'th' ? 'รหัสผ่าน' : 'Password'}
                      className="w-full pl-11 pr-11 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent rounded-xl outline-none"
                      {...loginForm.register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-[11px] text-red-600 mt-1 pl-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3.5 py-3.5 rounded-full text-white bg-[#181a20] hover:bg-neutral-800 active:scale-[0.99] transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <span>
                    {isSubmitting
                      ? locale === 'th'
                        ? 'กำลังเข้าสู่ระบบ...'
                        : 'Signing in...'
                      : locale === 'th'
                      ? 'เข้าสู่ระบบ'
                      : 'Sign In'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Divider */}
                <div className="relative my-3 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200" />
                  </div>
                  <span className="relative bg-white px-3 text-[11px] font-medium text-neutral-400">
                    {locale === 'th' ? 'หรือเข้าสู่ระบบด้วย' : 'or continue with'}
                  </span>
                </div>

                {/* Google Sign-in Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.99] transition-all font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 text-neutral-700 shadow-2xs"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>{locale === 'th' ? 'เข้าสู่ระบบด้วย Google' : 'Sign in with Google'}</span>
                </button>

                {/* Toggle to Register */}
                <div className="pt-2 text-center text-xs text-neutral-500">
                  <span>{locale === 'th' ? 'ยังไม่มีบัญชี? ' : "Don't have an account? "}</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="font-semibold text-neutral-900 hover:underline"
                  >
                    {locale === 'th' ? 'สมัครสมาชิก' : 'Sign Up'}
                  </button>
                </div>
              </form>
            )}

            {/* ================= REGISTER FORM ================= */}
            {activeTab === 'register' && (
              <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-2.5">
                {/* Display Name Input */}
                <div>
                  <div className="relative rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={locale === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name'}
                      className="w-full pl-11 pr-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent rounded-xl outline-none"
                      {...registerForm.register('displayName')}
                    />
                  </div>
                  {registerForm.formState.errors.displayName && (
                    <p className="text-[11px] text-red-600 mt-0.5 pl-1">
                      {registerForm.formState.errors.displayName.message}
                    </p>
                  )}
                </div>

                {/* Username / ID Input */}
                <div>
                  <div className="relative rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                    <IdCard className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={locale === 'th' ? 'ไอดีผู้ใช้ (ID)' : 'User ID'}
                      className="w-full pl-11 pr-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent rounded-xl outline-none"
                      {...registerForm.register('username')}
                    />
                  </div>
                  {registerForm.formState.errors.username && (
                    <p className="text-[11px] text-red-600 mt-0.5 pl-1">
                      {registerForm.formState.errors.username.message}
                    </p>
                  )}
                </div>

                {/* Phone Number Input */}
                <div>
                  <div className="relative rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="08X-XXX-XXXX"
                      className="w-full pl-11 pr-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent rounded-xl outline-none"
                      {...registerForm.register('phoneNumber')}
                    />
                  </div>
                  {registerForm.formState.errors.phoneNumber && (
                    <p className="text-[11px] text-red-600 mt-0.5 pl-1">
                      {registerForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="relative rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={locale === 'th' ? 'รหัสผ่าน' : 'Password'}
                      className="w-full pl-11 pr-11 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent rounded-xl outline-none"
                      {...registerForm.register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-[11px] text-red-600 mt-0.5 pl-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <div className="relative rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={locale === 'th' ? 'ยืนยันรหัสผ่าน' : 'Confirm Password'}
                      className="w-full pl-11 pr-11 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent rounded-xl outline-none"
                      {...registerForm.register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-[11px] text-red-600 mt-0.5 pl-1">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3.5 rounded-full text-white bg-[#181a20] hover:bg-neutral-800 active:scale-[0.99] transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <span>
                    {isSubmitting
                      ? locale === 'th'
                        ? 'กำลังบันทึก...'
                        : 'Creating account...'
                      : locale === 'th'
                      ? 'สมัครสมาชิก'
                      : 'Sign Up'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Toggle to Login */}
                <div className="pt-2 text-center text-xs text-neutral-500">
                  <span>{locale === 'th' ? 'มีบัญชีอยู่แล้ว? ' : 'Already have an account? '}</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="font-semibold text-neutral-900 underline hover:text-black"
                  >
                    {locale === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Discreet 1-Click Prototype Testing Bar */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-400">
        <span className="text-[11px]">ทดสอบระบบต้นแบบ:</span>
        <button
          type="button"
          onClick={() => handleQuickLogin('user')}
          className="px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-black hover:border-black transition-all font-medium text-[11px] shadow-xs"
        >
          เจ้าของสัตว์เลี้ยง (ไอดี: somchai)
        </button>
        <button
          type="button"
          onClick={() => handleQuickLogin('admin')}
          className="px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-black hover:border-black transition-all font-medium text-[11px] shadow-xs"
        >
          ผู้ดูแลระบบ (ไอดี: admin)
        </button>
      </div>
    </div>
  );
}
