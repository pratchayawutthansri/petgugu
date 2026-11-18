'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/contexts/toast-context';
import { api } from '@/lib/api-client';
import { PublicPetProfile } from '@/types';
import { BrandMark } from '@/components/ui/brand-mark';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  PhoneCall,
  MapPin,
  AlertTriangle,
  Heart,
  ShieldCheck,
  Globe,
  Share2,
  CheckCircle2,
  Gift,
  Send,
  PawPrint,
} from 'lucide-react';

export default function PublicPetProfilePage() {
  const params = useParams();
  const qrId = (params.qrId as string) || 'QR-MOCHI-7749';
  const { t, locale, setLocale } = useLanguage();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<PublicPetProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsLoadingProfile(true);
      const response = await api.getPublicPetProfile(qrId);

      if (!isMounted) return;
      if (response.success && response.data) {
        setProfile(response.data);
        setProfileError(null);
      } else {
        setProfile(null);
        setProfileError(response.error || 'ไม่พบข้อมูลสัตว์เลี้ยงสำหรับ QR Tag นี้');
      }
      setIsLoadingProfile(false);
    };

    void loadProfile();
    return () => {
      isMounted = false;
    };
  }, [qrId]);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [locationDesc, setLocationDesc] = useState('');
  const [reportMsg, setReportMsg] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const handleSubmitReport = async () => {
    if (!reporterName || !reporterPhone || !locationDesc) {
      showToast({
        type: 'warning',
        message: 'กรุณากรอกชื่อ เบอร์โทร และสถานที่พบสัตว์เลี้ยงให้ครบถ้วน',
      });
      return;
    }

    if (!profile) return;

    setIsSubmittingReport(true);
    const response = await api.submitFoundReport(qrId, {
        reporterName,
        reporterPhone,
        locationDescription: locationDesc,
        message: reportMsg,
      });

    if (response.success) {
      setIsSubmittingReport(false);
      setShowReportModal(false);
      setReporterName('');
      setReporterPhone('');
      setLocationDesc('');
      setReportMsg('');

      showToast({
        type: 'success',
        title: 'ส่งข้อมูลเรียบร้อยแล้ว',
        message: t('public.reportSuccess'),
        duration: 5000,
      });
      return;
    }

    setIsSubmittingReport(false);
    showToast({
      type: 'error',
      title: 'ส่งข้อมูลไม่สำเร็จ',
      message: response.error || 'กรุณาลองใหม่อีกครั้ง',
    });
  };

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface-50 px-4">
        <div className="text-center text-surface-600">
          <span className="mx-auto mb-3 flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-primary-100 text-primary-800">
            <PawPrint className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold">กำลังตรวจสอบ QR Tag…</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface-50 px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-warning-600" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-extrabold text-surface-950">ไม่พบข้อมูล QR Tag</h1>
          <p className="mt-2 text-sm text-surface-600">{profileError}</p>
          <Link href="/" className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white">
            กลับหน้าหลัก
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-primary-50/50 via-surface-50 to-surface-50 py-8 px-4 sm:px-6">
      {/* Top Floating Header */}
      <div className="max-w-md mx-auto flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark />
        </Link>

        <button
          type="button"
          onClick={() => setLocale(locale === 'th' ? 'en' : 'th')}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg border border-surface-200 bg-white text-surface-700 hover:bg-surface-100 transition-colors shadow-sm touch-target"
        >
          <Globe className="w-3.5 h-3.5 text-surface-500" />
          <span>{locale === 'th' ? 'EN' : 'TH'}</span>
        </button>
      </div>

      {/* Main Public Profile Card */}
      <Card
        className={cn(
          'max-w-md mx-auto p-6 sm:p-8 shadow-modal text-center space-y-6 transition-all',
          profile.isLost ? 'border-2 border-danger-400 ring-4 ring-danger-100' : 'border-surface-200'
        )}
      >
        {/* Found Banner (Switches to Emergency Lost Pet alert if isLost is true) */}
        {profile.isLost ? (
          <div className="p-4 rounded-2xl bg-danger-50 border-2 border-danger-300 text-left space-y-1.5 animate-pulse-subtle">
            <div className="flex items-center gap-2 text-danger-700 font-extrabold text-sm sm:text-base">
              <span className="flex h-3 w-3 rounded-full bg-danger-600 animate-ping" />
              <AlertTriangle className="w-5 h-5 text-danger-600 flex-shrink-0" />
              <span>🚨 สัตว์เลี้ยงตัวนี้กำลังพลัดหลง! (เจ้าของตามหาด่วน)</span>
            </div>
            <p className="text-xs text-danger-900 font-semibold leading-relaxed">
              เจ้าของได้เปิดสัญญาณฉุกเฉินตามหาน้อง หากคุณพบเห็น กรุณาช่วยดูแลน้องในที่ปลอดภัย และกดปุ่มโทรหาเจ้าของด้านล่างนี้ทันที ขอบพระคุณมากครับ
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-primary-50 border border-primary-100 text-left space-y-1">
            <div className="flex items-center gap-2 text-primary-900 font-bold text-sm">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span>{t('public.foundTitle')}</span>
            </div>
            <p className="text-xs text-primary-700 leading-relaxed">
              {t('public.foundSubtitle')}
            </p>
          </div>
        )}

        {/* Pet Primary Photo with Halo */}
        <div className="relative mx-auto w-36 h-36 sm:w-40 sm:h-40">
          <img
            src={profile.photoUrl}
            alt={profile.displayName}
            className={cn(
              'w-full h-full rounded-full object-cover border-4 border-white shadow-lg',
              profile.isLost ? 'ring-4 ring-danger-500 animate-pulse' : 'ring-4 ring-primary-100'
            )}
          />
          {profile.isLost ? (
            <span className="absolute bottom-1 right-0 rounded-full bg-danger-600 px-2.5 py-1 text-white text-[11px] font-extrabold shadow-md flex items-center gap-1 border-2 border-white">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>ตามหาด่วน</span>
            </span>
          ) : (
            <span className="absolute bottom-1 right-2 rounded-full bg-primary p-2 text-white shadow-md">
              <PawPrint className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </div>

        {/* Pet Name & Identity */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight">
            {profile.displayName}
          </h1>
          <p className="text-sm font-semibold text-primary mt-1">
            {profile.breed}
          </p>
        </div>

        {/* Direct Emergency Call Button */}
        <div className="space-y-3 pt-2">
          <a
            href={`tel:${profile.contactPhone}`}
            className="block"
          >
            <Button
              variant="primary"
              size="lg"
              className={cn(
                'w-full py-4 text-base font-extrabold shadow-lg focus-visible:outline-none transition-all',
                profile.isLost
                  ? 'bg-danger-600 hover:bg-danger-700 ring-4 ring-danger-200'
                  : 'bg-success hover:bg-success-600 ring-2 ring-success-100'
              )}
              leftIcon={<PhoneCall className="w-5 h-5 animate-bounce-soft" />}
            >
              {profile.isLost ? `โทรแจ้งเจ้าของด่วน (${profile.contactPhone})` : `${t('public.callOwner')} (${profile.contactPhone})`}
            </Button>
          </a>

          <Button
            variant="outline"
            size="md"
            className="w-full font-bold"
            leftIcon={<MapPin className="w-4 h-4 text-primary" />}
            onClick={() => setShowReportModal(true)}
          >
            {t('public.reportFound')}
          </Button>
        </div>

        {/* Special Warnings & Health Notes */}
        {profile.specialNeeds && (
          <div className="p-4 rounded-xl bg-warning-50 border border-warning-200 text-left space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-warning-800">
              <AlertTriangle className="w-4 h-4 text-warning-600" />
              <span>{t('public.specialNeedsTitle')}</span>
            </div>
            <p className="text-xs text-warning-700 leading-relaxed">
              {profile.specialNeeds}
            </p>
          </div>
        )}

        {/* Reward Box */}
        {profile.rewardNote && (
          <div className="p-4 rounded-xl bg-success-50 border border-success-200 text-left space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-success-800">
              <Gift className="w-4 h-4 text-success-600" />
              <span>{t('public.rewardTitle')}</span>
            </div>
            <p className="text-xs text-success-700">
              {profile.rewardNote}
            </p>
          </div>
        )}

        {/* Friendly Owner Message */}
        {profile.customMessage && (
          <div className="p-4 rounded-xl bg-surface-50 border border-surface-100 text-xs text-surface-600 text-left italic">
            "{profile.customMessage}"
          </div>
        )}

        {/* Privacy Note */}
        <div className="pt-4 border-t border-surface-100 text-[11px] text-surface-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>{t('public.privacyNote')}</span>
        </div>
      </Card>

      {/* Sighting Report Modal */}
      {showReportModal && (
        <Dialog
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          title={t('public.reportFound')}
          size="md"
        >
          <div className="space-y-4 pt-2 text-left">
            <Input
              label={t('public.reporterName')}
              placeholder="เช่น คุณกมล"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
            />

            <Input
              label={t('public.reporterPhone')}
              type="tel"
              placeholder="089-123-4567"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">
                {t('public.locationDesc')}
              </label>
              <textarea
                rows={3}
                placeholder={t('public.locationPlaceholder')}
                value={locationDesc}
                onChange={(e) => setLocationDesc(e.target.value)}
                className="w-full rounded-lg border border-surface-300 p-3 text-sm text-surface-900 focus-visible:outline-primary"
              />
            </div>

            <Input
              label={t('public.reportMessage')}
              placeholder="เช่น น้องกำลังนอนพักอยู่ใต้ร่มไม้ มีคนคอยดูแลอยู่ครับ"
              value={reportMsg}
              onChange={(e) => setReportMsg(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReportModal(false)}>
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitReport}
                isLoading={isSubmittingReport}
                leftIcon={<Send className="w-4 h-4" />}
              >
                {t('public.submitReport')}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
