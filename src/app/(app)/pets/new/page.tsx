'use client';

import React, { useState } from 'react';
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
import {
  PawPrint,
  Camera,
  Star,
  Trash2,
  Cpu,
  QrCode,
  CheckCircle2,
  ArrowLeft,
  Upload,
} from 'lucide-react';

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
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Photo URLs state (minimum 2, maximum 5)
  const [photos, setPhotos] = useState<string[]>([
    PRESET_PET_PHOTOS[0],
    PRESET_PET_PHOTOS[1],
  ]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string>(PRESET_PET_PHOTOS[0]);
  const [customPhotoInput, setCustomPhotoInput] = useState('');

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
      setPhotos(updated);
      setValue('photoUrls', updated);
      if (!primaryPhoto) {
        setPrimaryPhoto(url);
        setValue('primaryPhotoUrl', url);
      }
    }
  };

  const handleRemovePhoto = (urlToRemove: string) => {
    if (photos.length <= 2) {
      showToast({
        type: 'warning',
        message: 'ต้องมีรูปภาพอย่างน้อย 2 รูป (Minimum 2 photos required)',
      });
      return;
    }
    const updated = photos.filter((p) => p !== urlToRemove);
    setPhotos(updated);
    setValue('photoUrls', updated);
    if (primaryPhoto === urlToRemove && updated.length > 0) {
      setPrimaryPhoto(updated[0]);
      setValue('primaryPhotoUrl', updated[0]);
    }
  };

  const handleSetPrimaryPhoto = (url: string) => {
    setPrimaryPhoto(url);
    setValue('primaryPhotoUrl', url);
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
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                <CardTitle>{t('addPet.photosTitle')}</CardTitle>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary-700">
                {photos.length} / 5 รูป
              </span>
            </div>
            <p className="text-xs text-surface-500 mt-1">
              {t('addPet.photosDesc')}
            </p>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            {/* Active Selected Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {photos.map((url, idx) => {
                const isPrimary = url === primaryPhoto;
                return (
                  <div
                    key={url}
                    className="relative group rounded-xl overflow-hidden aspect-square border-2 border-surface-200 shadow-sm"
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

                    {/* Overlay Action Buttons */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryPhoto(url)}
                          className="p-1.5 rounded-lg bg-white text-surface-900 hover:text-primary transition-colors touch-target"
                          title="ตั้งเป็นรูปหลัก"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(url)}
                        className="p-1.5 rounded-lg bg-danger text-white hover:bg-danger-600 transition-colors touch-target"
                        title="ลบรูปนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Preset Selector for Demo */}
            <div className="pt-3 border-t border-surface-100">
              <label className="block text-xs font-semibold text-surface-500 mb-2">
                เลือกรูปภาพตัวอย่าง (Photo Gallery):
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

        {/* Section 3: Hardware Pairing */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              <CardTitle>{t('addPet.deviceTitle')}</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <Select
              label={t('addPet.deviceSelectLabel')}
              {...register('deviceId')}
            >
              {DEMO_DEVICES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.model} — SN: {d.serialNumber} ({d.macAddress})
                </option>
              ))}
            </Select>

            <div className="p-4 rounded-xl bg-surface-50 border border-surface-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-surface-600">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                <span>อุปกรณ์พร้อมจับคู่กับปลอกคอสุนัขแบบอัตโนมัติ (Mock Mode)</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<QrCode className="w-4 h-4" />}
                onClick={() => {
                  showToast({
                    type: 'info',
                    message: 'สแกน QR Code สำเร็จ — ผูกอุปกรณ์อัตโนมัติ',
                  });
                }}
              >
                สแกน QR ที่ตัวเครื่อง
              </Button>
            </div>
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
    </div>
  );
}
