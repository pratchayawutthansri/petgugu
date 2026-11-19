'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPetSchema, CreatePetInput } from '@/schemas/pet.schema';
import { usePets } from '@/hooks/use-pets';
import { useLanguage } from '@/contexts/language-context';
import { useToast } from '@/contexts/toast-context';
import { DEMO_DEVICES } from '@/data/demo-devices';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { QrBoxScannerDialog } from '@/components/pets/qr-box-scanner-dialog';
import {
  PawPrint,
  Camera,
  Star,
  Trash2,
  QrCode,
  CheckCircle2,
  ArrowLeft,
  Smartphone,
  Plus,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

/**
 * Compress and resize uploaded images from mobile camera or photo gallery
 * to keep uploads fast and lightweight.
 */
function compressImage(file: File, maxDim = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการโหลดไฟล์'));
    reader.readAsDataURL(file);
  });
}

// Preset Dog Images for easy demo selection
const PRESET_PET_PHOTOS = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
];

export default function AddPetPage() {
  const router = useRouter();
  const { createPet } = usePets();
  const { t, locale } = useLanguage();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Hidden file inputs for mobile gallery and mobile camera
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Photo URLs state (minimum 2, maximum 5)
  const [photos, setPhotos] = useState<string[]>([
    PRESET_PET_PHOTOS[0],
    PRESET_PET_PHOTOS[1],
  ]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string>(PRESET_PET_PHOTOS[0]);
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  // Initial Safe Zone Radius configuration
  const [enableSafeZone, setEnableSafeZone] = useState(true);
  const [safeZoneName, setSafeZoneName] = useState('บ้าน');
  const [safeZoneRadius, setSafeZoneRadius] = useState<number>(300);

  // QR Box Pairing state
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [pairedBoxCode, setPairedBoxCode] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreatePetInput>({
    resolver: zodResolver(createPetSchema),
    defaultValues: {
      name: '',
      species: 'DOG',
      breed: 'โกลเด้น รีทรีฟเวอร์',
      age: 2,
      gender: 'MALE',
      weight: 15,
      healthNotes: '',
      primaryPhotoUrl: PRESET_PET_PHOTOS[0],
      photoUrls: [PRESET_PET_PHOTOS[0], PRESET_PET_PHOTOS[1]],
      deviceId: DEMO_DEVICES[0].id,
      batterySaver: false,
      proAlerts: true,
    },
  });

  const syncPhotosState = (updated: string[], nextPrimary?: string) => {
    setPhotos(updated);
    setValue('photoUrls', updated, { shouldValidate: true });
    const resolvedPrimary =
      nextPrimary !== undefined
        ? nextPrimary
        : primaryPhoto && updated.includes(primaryPhoto)
          ? primaryPhoto
          : updated[0] || '';
    setPrimaryPhoto(resolvedPrimary);
    setValue('primaryPhotoUrl', resolvedPrimary, { shouldValidate: true });
  };

  const handleAddPhoto = (url: string) => {
    if (photos.length >= 5) {
      showToast({
        type: 'warning',
        message: 'เพิ่มรูปได้สูงสุด 5 รูป (Maximum 5 photos)',
      });
      return;
    }
    if (!photos.includes(url)) {
      const updated = [...photos, url];
      syncPhotosState(updated, primaryPhoto || url);
    }
  };

  const processSelectedFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const remainingSlots = 5 - photos.length;
    if (remainingSlots <= 0) {
      showToast({
        type: 'warning',
        message: 'เพิ่มรูปครบ 5 รูปแล้ว หากต้องการเพิ่มใหม่กรุณาลบรูปเดิมออกก่อน',
      });
      return;
    }

    setIsProcessingImage(true);
    try {
      const imageFiles = files.filter((f) => f.type.startsWith('image/'));
      if (imageFiles.length === 0) {
        showToast({
          type: 'warning',
          message: 'กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (JPG, PNG, WebP)',
        });
        return;
      }

      const filesToProcess = imageFiles.slice(0, remainingSlots);
      const compressedUrls: string[] = [];
      for (const file of filesToProcess) {
        const compressed = await compressImage(file, 1200, 0.85);
        compressedUrls.push(compressed);
      }

      const updated = [...photos];
      for (const url of compressedUrls) {
        if (!updated.includes(url) && updated.length < 5) {
          updated.push(url);
        }
      }

      // If user had no photos yet, set the first uploaded photo as primary
      const nextPrimary = primaryPhoto || compressedUrls[0] || updated[0] || '';
      syncPhotosState(updated, nextPrimary);

      const skippedCount = imageFiles.length - filesToProcess.length;
      showToast({
        type: 'success',
        title: 'เพิ่มรูปภาพสำเร็จ',
        message:
          skippedCount > 0
            ? `เพิ่มรูปจากอุปกรณ์ ${compressedUrls.length} รูป (ครบสูงสุด 5 รูปแล้ว)`
            : `เพิ่มรูปจากอุปกรณ์ ${compressedUrls.length} รูปเรียบร้อยแล้ว`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'อัปโหลดรูปไม่สำเร็จ',
        message: err?.message || 'ไม่สามารถอ่านไฟล์รูปภาพได้ กรุณาลองใหม่',
      });
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processSelectedFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleRemovePhoto = (urlToRemove: string) => {
    const updated = photos.filter((p) => p !== urlToRemove);
    const nextPrimary =
      primaryPhoto === urlToRemove ? updated[0] || '' : primaryPhoto;
    syncPhotosState(updated, nextPrimary);
  };

  const handleSetPrimaryPhoto = (url: string) => {
    setPrimaryPhoto(url);
    setValue('primaryPhotoUrl', url, { shouldValidate: true });
    showToast({
      type: 'info',
      message: 'ตั้งเป็นรูปโปรไฟล์หลักแล้ว',
    });
  };

  const onSubmit = async (data: CreatePetInput) => {
    setIsSubmitting(true);
    try {
      const res = await createPet({
        ...data,
        primaryPhotoUrl: primaryPhoto,
        photoUrls: photos,
        initialSafeZone:
          enableSafeZone && safeZoneName.trim()
            ? {
                name: safeZoneName.trim(),
                radius: Math.min(5000, Math.max(50, Number(safeZoneRadius) || 300)),
              }
            : undefined,
      });
      if (res.success) {
        router.push('/pets');
      } else {
        showToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: res.error || 'ไม่สามารถบันทึกข้อมูลสัตว์เลี้ยงได้',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/pets">
          <Button variant="ghost" size="icon" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="page-title">{t('addPet.title')}</h1>
          <p className="page-subtitle">{t('addPet.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Basic Info */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-primary" />
              <CardTitle>{t('addPet.step1')}</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('addPet.nameLabel')}
              placeholder={t('addPet.namePlaceholder')}
              error={errors.name?.message}
              {...register('name')}
            />

            <Select
              label={t('addPet.speciesLabel')}
              error={errors.species?.message}
              {...register('species')}
            >
              <option value="DOG">สุนัข (Dog)</option>
              <option value="CAT">แมว (Cat)</option>
              <option value="OTHER">อื่นๆ (Other)</option>
            </Select>

            <Input
              label={t('addPet.breedLabel')}
              placeholder={t('addPet.breedPlaceholder')}
              error={errors.breed?.message}
              {...register('breed')}
            />

            <Select
              label={t('addPet.genderLabel')}
              error={errors.gender?.message}
              {...register('gender')}
            >
              <option value="MALE">{t('addPet.genderMale')}</option>
              <option value="FEMALE">{t('addPet.genderFemale')}</option>
              <option value="UNKNOWN">{t('addPet.genderUnknown')}</option>
            </Select>

            <Input
              label={t('addPet.ageLabel')}
              type="number"
              step="0.5"
              error={errors.age?.message}
              {...register('age', { valueAsNumber: true })}
            />

            <Input
              label={t('addPet.weightLabel')}
              type="number"
              step="0.1"
              error={errors.weight?.message}
              {...register('weight', { valueAsNumber: true })}
            />

            <div className="sm:col-span-2 space-y-1.5 text-left">
              <label className="block text-sm font-medium text-surface-700">
                {t('addPet.healthLabel')}
              </label>
              <textarea
                rows={3}
                placeholder={t('addPet.healthPlaceholder')}
                className="w-full rounded-lg border border-surface-300 bg-white p-3 text-sm text-surface-900 focus-visible:outline-primary placeholder:text-surface-400"
                {...register('healthNotes')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Photos Upload Gallery (2-5 photos rule) */}
        <Card className="p-6">
          {/* Hidden file inputs for Mobile Gallery & Mobile Camera */}
          <input
            type="file"
            ref={galleryInputRef}
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            aria-hidden="true"
          />
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleFileInputChange}
            className="hidden"
            aria-hidden="true"
          />

          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Camera className="w-5 h-5 text-primary flex-shrink-0" />
                <CardTitle className="truncate">
                  {locale === 'th' ? 'อัปโหลดรูปภาพสัตว์เลี้ยง' : 'Upload Pet Photos'}
                  <span className="text-danger ml-1" title="จำเป็นต้องระบุ">*</span>
                </CardTitle>
              </div>
              <span
                className={`whitespace-nowrap flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full tabular-nums ${
                  photos.length < 2
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-primary-50 text-primary-700 border border-primary-200'
                }`}
              >
                {photos.length} / 5 {locale === 'th' ? 'รูป' : 'photos'}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-surface-500">
              <span className="inline-flex items-center font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap">
                {locale === 'th' ? 'ขั้นต่ำ 2 รูป · สูงสุด 5 รูป' : 'Min 2 · Max 5 photos'}
              </span>
              <span>
                {t('addPet.photosDesc')}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            {/* Direct Upload Controls (Mobile Photo Library & Camera) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isProcessingImage || photos.length >= 5}
                onClick={() => galleryInputRef.current?.click()}
                leftIcon={
                  isProcessingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Smartphone className="w-4 h-4" />
                  )
                }
              >
                {isProcessingImage ? 'กำลังประมวลผลรูป...' : 'เลือกรูปจากมือถือ / ไฟล์'}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isProcessingImage || photos.length >= 5}
                onClick={() => cameraInputRef.current?.click()}
                leftIcon={<Camera className="w-4 h-4 text-primary" />}
              >
                ถ่ายรูปด้วยกล้อง
              </Button>

              <span className="text-[11px] text-surface-400">
                รองรับ JPG, PNG, WebP (เลือกได้หลายรูปพร้อมกัน)
              </span>
            </div>

            {/* Active Selected Photos Grid + Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                if (photos.length < 5) setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.length) {
                  void processSelectedFiles(e.dataTransfer.files);
                }
              }}
              className={`grid grid-cols-2 sm:grid-cols-5 gap-3 rounded-2xl transition-all ${
                isDragging
                  ? 'p-2 bg-primary-50/50 ring-2 ring-dashed ring-primary-400'
                  : ''
              }`}
            >
              {photos.map((url, idx) => {
                const isPrimary = url === primaryPhoto;
                return (
                  <div
                    key={`${url.slice(0, 48)}-${idx}`}
                    className={`relative group rounded-xl overflow-hidden aspect-square border-2 shadow-sm transition-all ${
                      isPrimary
                        ? 'border-primary ring-2 ring-primary-200'
                        : 'border-surface-200 hover:border-primary-300'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Primary Badge */}
                    {isPrimary && (
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-current" />
                        <span>รูปหลัก</span>
                      </div>
                    )}

                    {/* Action Buttons: Always accessible on touch devices, clean hover overlay on desktop */}
                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/70 via-black/35 to-transparent flex items-center justify-end gap-1.5 sm:inset-0 sm:bg-black/45 sm:bg-none sm:opacity-0 sm:group-hover:opacity-100 sm:justify-center transition-opacity">
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryPhoto(url)}
                          className="p-1.5 rounded-lg bg-white/95 text-surface-900 hover:text-primary transition-colors shadow-sm"
                          title="ตั้งเป็นรูปหลัก"
                          aria-label="ตั้งเป็นรูปหลัก"
                        >
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(url)}
                        className="p-1.5 rounded-lg bg-danger text-white hover:bg-danger-600 transition-colors shadow-sm"
                        title="ลบรูปนี้"
                        aria-label="ลบรูปนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Photo Card Slot (opens phone gallery / file picker) */}
              {photos.length < 5 && (
                <button
                  type="button"
                  disabled={isProcessingImage}
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/35 hover:bg-primary-50 active:scale-[0.98] text-primary-700 transition aspect-square gap-1.5 p-3 text-center group disabled:opacity-50"
                >
                  <span className="p-2 rounded-xl bg-white text-primary shadow-sm group-hover:scale-110 transition-transform">
                    {isProcessingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                  <span className="text-xs font-bold leading-tight">
                    เพิ่มรูปภาพ
                  </span>
                  <span className="text-[10px] text-surface-500 leading-tight">
                    จากมือถือ / ไฟล์
                  </span>
                </button>
              )}
            </div>

            {/* Minimum Photos Helper / Validation Error */}
            {(photos.length < 2 || errors.photoUrls?.message || errors.primaryPhotoUrl?.message) && (
              <p className="text-xs font-medium text-danger">
                {errors.photoUrls?.message ||
                  errors.primaryPhotoUrl?.message ||
                  `กรุณาเพิ่มรูปภาพอีกอย่างน้อย ${2 - photos.length} รูป (ขั้นต่ำ 2 รูป)`}
              </p>
            )}

            {/* Quick Preset Selector for Demo */}
            <div className="pt-3 border-t border-surface-100">
              <label className="block text-xs font-semibold text-surface-500 mb-2">
                หรือเลือกรูปภาพตัวอย่าง (Photo Gallery):
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_PET_PHOTOS.map((presetUrl, i) => (
                  <button
                    key={presetUrl}
                    type="button"
                    onClick={() => handleAddPhoto(presetUrl)}
                    disabled={photos.includes(presetUrl) || photos.length >= 5}
                    className="w-12 h-12 rounded-lg overflow-hidden border-2 border-surface-200 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary transition-all"
                  >
                    <img
                      src={presetUrl}
                      alt={`Preset ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Photo URL Adder */}
            <div className="flex gap-2 pt-2">
              <Input
                placeholder="หรือใส่ลิงก์รูปภาพออนไลน์ (Image URL)..."
                value={customPhotoInput}
                onChange={(e) => setCustomPhotoInput(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (customPhotoInput.startsWith('http')) {
                    handleAddPhoto(customPhotoInput);
                    setCustomPhotoInput('');
                  } else {
                    showToast({
                      type: 'warning',
                      message: 'กรุณากรอก URL ที่ถูกต้อง (http:// หรือ https://)',
                    });
                  }
                }}
              >
                เพิ่ม
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Initial Safe Zone Radius */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <CardTitle>กำหนดพื้นที่ปลอดภัยและรัศมี (Safe Zone)</CardTitle>
              </div>
              <button
                type="button"
                onClick={() => setEnableSafeZone((prev) => !prev)}
                aria-label="เปิดปิดการตั้งค่าพื้นที่ปลอดภัยเริ่มต้น"
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                  enableSafeZone ? 'bg-primary' : 'bg-surface-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    enableSafeZone ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-surface-500 mt-1">
              กำหนดรัศมีปลอดภัยเริ่มต้นได้ตั้งแต่ 50 ถึง 5,000 เมตร เพื่อแจ้งเตือนเมื่อสุนัขออกนอกเขต
            </p>
          </CardHeader>

          {enableSafeZone && (
            <CardContent className="p-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="ชื่อพื้นที่ปลอดภัย"
                  placeholder="เช่น บ้าน, สวนสาธารณะ"
                  value={safeZoneName}
                  onChange={(e) => setSafeZoneName(e.target.value)}
                />

                <Input
                  label="รัศมี (เมตร)"
                  type="number"
                  min={50}
                  max={5000}
                  step={10}
                  value={safeZoneRadius}
                  onChange={(e) => setSafeZoneRadius(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-surface-50 border border-surface-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-surface-600">ปรับรัศมีด้วยแถบเลื่อน</span>
                  <span className="font-extrabold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full">
                    {safeZoneRadius >= 1000
                      ? `${(safeZoneRadius / 1000).toFixed(safeZoneRadius % 1000 === 0 ? 0 : 1)} กม. (${safeZoneRadius.toLocaleString()} ม.)`
                      : `${safeZoneRadius.toLocaleString()} เมตร`}
                  </span>
                </div>

                <input
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={Math.min(5000, Math.max(50, Number(safeZoneRadius) || 50))}
                  onChange={(e) => setSafeZoneRadius(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-surface-200"
                  aria-label="แถบเลื่อนกำหนดรัศมีพื้นที่ปลอดภัยเริ่มต้น"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { label: '50 ม.', value: 50 },
                    { label: '100 ม.', value: 100 },
                    { label: '200 ม.', value: 200 },
                    { label: '300 ม.', value: 300 },
                    { label: '500 ม.', value: 500 },
                    { label: '1 กม.', value: 1000 },
                    { label: '2 กม.', value: 2000 },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setSafeZoneRadius(preset.value)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                        Number(safeZoneRadius) === preset.value
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-surface-700 border-surface-200 hover:border-primary-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 4: QR Box Collar Pairing */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              <CardTitle>{t('addPet.deviceTitle')}</CardTitle>
            </div>
            <p className="text-xs text-surface-500 mt-1">
              สแกน QR Code ที่ติดอยู่ข้างกล่องปลอกคอ เพื่อเชื่อมต่อกับโปรไฟล์ของน้องหมาอัตโนมัติ
            </p>
          </CardHeader>

          <CardContent className="p-0">
            {pairedBoxCode ? (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-emerald-950">
                      เชื่อมต่อปลอกคอจากกล่องเรียบร้อยแล้ว
                    </p>
                    <p className="text-xs text-emerald-700 font-mono truncate mt-0.5">
                      รหัสกล่อง: {pairedBoxCode}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<QrCode className="w-4 h-4" />}
                  onClick={() => setShowQrScanner(true)}
                  className="bg-white flex-shrink-0"
                >
                  สแกนใหม่
                </Button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl border-2 border-dashed border-surface-200 bg-surface-50/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 text-center sm:text-left">
                  <span className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white border border-surface-200 text-primary shadow-subtle">
                    <QrCode className="w-6 h-6" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-surface-900">
                      สแกน QR Code ที่ตัวกล่อง
                    </p>
                    <p className="text-xs text-surface-500 mt-0.5">
                      เปิดกล้องสแกนสติกเกอร์ QR ข้างกล่องปลอกคอเพื่อจับคู่อุปกรณ์ได้ทันที
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  leftIcon={<QrCode className="w-4 h-4" />}
                  onClick={() => setShowQrScanner(true)}
                  className="w-full sm:w-auto flex-shrink-0"
                >
                  สแกน QR ที่ตัวกล่อง
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <Link href="/pets">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              {t('addPet.cancel')}
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full sm:w-auto"
          >
            {t('addPet.submit')}
          </Button>
        </div>
      </form>

      {/* QR Box Scanner Modal */}
      <QrBoxScannerDialog
        isOpen={showQrScanner}
        onClose={() => setShowQrScanner(false)}
        onScanned={(code) => {
          setPairedBoxCode(code);
          setValue('deviceId', DEMO_DEVICES[0].id);
          showToast({
            type: 'success',
            title: 'สแกน QR ที่ตัวกล่องสำเร็จ',
            message: `เชื่อมต่อปลอกคอรหัส ${code} เรียบร้อยแล้ว`,
          });
        }}
      />
    </div>
  );
}
