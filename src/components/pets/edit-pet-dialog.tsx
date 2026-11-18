'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pet, PetSpecies, Gender, PetPhoto } from '@/types';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/contexts/toast-context';
import {
  Camera,
  Check,
  Sparkles,
  Image as ImageIcon,
  AlertTriangle,
  HeartPulse,
  Plus,
  Trash2,
  Star,
  Smartphone,
  Upload,
  Link as LinkIcon,
  ShieldCheck,
  Phone,
  Mail,
  Stethoscope,
  QrCode,
  Tag,
  Zap,
  Info,
  ChevronRight,
  Eye,
  PawPrint,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const POPULAR_PET_PHOTOS = [
  {
    name: 'โกลเด้น รีทรีฟเวอร์',
    breed: 'โกลเด้น รีทรีฟเวอร์',
    species: 'DOG' as PetSpecies,
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'ชิบะ อินุ',
    breed: 'ชิบะ อินุ',
    species: 'DOG' as PetSpecies,
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'คอร์กี้',
    breed: 'คอร์กี้',
    species: 'DOG' as PetSpecies,
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'บีเกิ้ล',
    breed: 'บีเกิ้ล',
    species: 'DOG' as PetSpecies,
    url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'พุดเดิ้ล',
    breed: 'พุดเดิ้ล',
    species: 'DOG' as PetSpecies,
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'ไซบีเรียน ฮัสกี้',
    breed: 'ไซบีเรียน ฮัสกี้',
    species: 'DOG' as PetSpecies,
    url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'เฟรนช์ บูลด็อก',
    breed: 'เฟรนช์ บูลด็อก',
    species: 'DOG' as PetSpecies,
    url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'ปอมเมอเรเนียน',
    breed: 'ปอมเมอเรเนียน',
    species: 'DOG' as PetSpecies,
    url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'แมวเปอร์เซีย',
    breed: 'เปอร์เซีย',
    species: 'CAT' as PetSpecies,
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'แมวบริติช ช็อตแฮร์',
    breed: 'บริติช ช็อตแฮร์',
    species: 'CAT' as PetSpecies,
    url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
  },
];

/**
 * Utility to compress and scale down image files from phone/camera
 * Keeps payload lightweight and avoids browser memory slowdowns
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
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = event.target?.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export interface EditPetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet | null;
  onSave: (petId: string, updates: Partial<Pet>) => Promise<{ success: boolean; data?: Pet; error?: string }>;
}

type TabKey = 'photos' | 'basic' | 'emergency';

export function EditPetDialog({ isOpen, onClose, pet, onSave }: EditPetDialogProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>('photos');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Hidden file input refs for phone gallery & camera
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Photo states
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Basic info states
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('DOG');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<Gender>('MALE');
  const [age, setAge] = useState(1);
  const [weight, setWeight] = useState(10);
  const [coatColor, setCoatColor] = useState('');

  // Health & Care states
  const [healthNotes, setHealthNotes] = useState('');
  const [clinicName, setClinicName] = useState('');

  // Emergency & QR Profile states
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [rewardNote, setRewardNote] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  // Toggles
  const [isLost, setIsLost] = useState(false);
  const [batterySaver, setBatterySaver] = useState(false);
  const [proAlerts, setProAlerts] = useState(true);

  useEffect(() => {
    if (pet) {
      setName(pet.name);
      setSpecies(pet.species || 'DOG');
      setBreed(pet.breed);
      setGender((pet.gender as Gender) || 'MALE');
      setAge(pet.age ?? 1);
      setWeight(pet.weight ?? 10);
      setCoatColor((pet as any).coatColor || '');
      setHealthNotes(pet.healthNotes || '');
      setClinicName(pet.vaccinations?.[0]?.clinicName || '');
      setEmergencyPhone(pet.publicProfile?.contactPhone || '081-234-5678');
      setContactEmail(pet.publicProfile?.contactEmail || 'owner@pawsandco.com');
      setMicrochipNumber((pet as any).microchipNumber || pet.qrCodeId || '');
      setRewardNote(pet.publicProfile?.rewardNote || '');
      setCustomMessage(
        pet.publicProfile?.customMessage ||
          `น้องชื่อ ${pet.name} ใจดี ไม่ดุ หากพบเห็นกรุณาติดต่อเจ้าของได้ทันที ขอบคุณครับ`
      );
      setIsLost(Boolean(pet.isLost));
      setBatterySaver(Boolean(pet.batterySaver));
      setProAlerts(pet.proAlerts !== false);

      // Photos array initialization
      const existingPhotos = pet.photos?.length
        ? pet.photos.map((p) => p.url)
        : pet.primaryPhotoUrl
        ? [pet.primaryPhotoUrl]
        : [POPULAR_PET_PHOTOS[0].url];

      setPhotos(existingPhotos);
      setPhotoUrl(pet.primaryPhotoUrl || existingPhotos[0]);
      setCustomUrlInput('');
      setActiveTab('photos');
    }
  }, [pet, isOpen]);

  if (!pet) return null;

  // Handle files selected from mobile photo library or camera
  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>, asPrimary = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImage(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImage(file, 1200, 0.85);
        newUrls.push(compressed);
      }

      if (newUrls.length === 0) {
        showToast({ type: 'warning', message: 'กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (JPG, PNG, WebP)' });
        return;
      }

      setPhotos((prev) => {
        const combined = [...prev];
        for (const url of newUrls) {
          if (!combined.includes(url)) combined.push(url);
        }
        return combined;
      });

      if (asPrimary || !photoUrl || newUrls.length === 1) {
        setPhotoUrl(newUrls[0]);
      }

      showToast({
        type: 'success',
        title: 'เพิ่มรูปภาพสำเร็จ',
        message: `เพิ่มรูปภาพจากอุปกรณ์ ${newUrls.length} รูปเรียบร้อยแล้ว`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: err.message || 'ไม่สามารถโหลดรูปภาพได้',
      });
    } finally {
      setIsProcessingImage(false);
      e.target.value = '';
    }
  };

  // Add custom photo URL
  const handleAddUrlPhoto = () => {
    const trimmed = customUrlInput.trim();
    if (!trimmed) {
      showToast({ type: 'warning', message: 'กรุณากรอก URL ของรูปภาพ' });
      return;
    }
    if (!photos.includes(trimmed)) {
      setPhotos((prev) => [...prev, trimmed]);
    }
    setPhotoUrl(trimmed);
    setCustomUrlInput('');
    showToast({ type: 'info', message: 'เพิ่มรูปภาพจากลิงก์และตั้งเป็นรูปหลักแล้ว' });
  };

  // Add preset photo
  const handleSelectPreset = (presetUrl: string) => {
    if (!photos.includes(presetUrl)) {
      setPhotos((prev) => [...prev, presetUrl]);
    }
    setPhotoUrl(presetUrl);
    showToast({ type: 'info', message: 'เลือกรูปภาพสำเร็จรูปและตั้งเป็นรูปหลักแล้ว' });
  };

  // Set a specific photo as primary
  const handleSetPrimary = (url: string) => {
    setPhotoUrl(url);
    showToast({ type: 'info', message: 'ตั้งรูปนี้เป็นรูปโปรไฟล์หลักแล้ว' });
  };

  // Remove a photo from the gallery (no restriction, can delete down to 0)
  const handleRemovePhoto = (urlToRemove: string) => {
    const updated = photos.filter((p) => p !== urlToRemove);
    setPhotos(updated);
    if (photoUrl === urlToRemove) {
      setPhotoUrl(updated.length > 0 ? updated[0] : '');
    }
    showToast({ type: 'info', message: 'ลบรูปภาพเรียบร้อยแล้ว' });
  };

  // Delete all photos at once
  const handleClearAllPhotos = () => {
    setPhotos([]);
    setPhotoUrl('');
    showToast({
      type: 'info',
      title: 'ลบรูปภาพทั้งหมดแล้ว',
      message: 'ลบรูปภาพทั้งหมดออกจากโปรไฟล์แล้ว สามารถกดบันทึกหรือเลือกรูปใหม่ได้',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast({ type: 'warning', message: 'กรุณากรอกชื่อสัตว์เลี้ยง' });
      setActiveTab('basic');
      return;
    }
    if (!breed.trim()) {
      showToast({ type: 'warning', message: 'กรุณากรอกสายพันธุ์' });
      setActiveTab('basic');
      return;
    }

    setIsSubmitting(true);
    try {
      const activePrimary = photoUrl.trim() || (photos.length > 0 ? photos[0] : '');

      // Map photos into PetPhoto entity models
      const updatedPhotos: PetPhoto[] = photos.map((url, i) => ({
        id: pet.photos?.find((p) => p.url === url)?.id || `photo_${pet.id}_${Date.now()}_${i}`,
        petId: pet.id,
        url,
        isPrimary: url === activePrimary,
        caption: `${name} photo ${i + 1}`,
        createdAt: new Date().toISOString(),
      }));

      const updates: Partial<Pet> & Record<string, any> = {
        name: name.trim(),
        species,
        breed: breed.trim(),
        gender,
        age: Number(age) || 1,
        weight: Number(weight) || 1,
        coatColor: coatColor.trim(),
        primaryPhotoUrl: activePrimary,
        photos: updatedPhotos,
        healthNotes: healthNotes.trim(),
        microchipNumber: microchipNumber.trim(),
        isLost,
        batterySaver,
        proAlerts,
        publicProfile: {
          ...(pet.publicProfile || {
            id: `pub_${pet.id}`,
            petId: pet.id,
            qrCodeId: pet.qrCodeId,
            displayName: name.trim(),
            species,
            breed: breed.trim(),
            photoUrl: activePrimary,
            allowDirectCall: true,
            allowFoundReport: true,
          }),
          displayName: name.trim(),
          species,
          breed: breed.trim(),
          photoUrl: activePrimary,
          secondaryPhotos: photos.filter((p) => p !== activePrimary),
          contactPhone: emergencyPhone.trim() || '081-234-5678',
          contactEmail: contactEmail.trim(),
          specialNeeds: healthNotes.trim(),
          rewardNote: rewardNote.trim(),
          customMessage: customMessage.trim(),
          isLost,
        },
      };

      const res = await onSave(pet.id, updates);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'บันทึกข้อมูลเรียบร้อย',
          message: `อัปเดตข้อมูลและรูปภาพของ ${name} สำเร็จแล้ว`,
        });
        onClose();
      } else {
        showToast({
          type: 'error',
          title: 'ไม่สามารถบันทึกข้อมูลได้',
          message: res.error || 'เกิดข้อผิดพลาดในการบันทึก',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: err.message || 'Error updating pet',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose()}
      title={`แก้ไขข้อมูลของ ${pet.name}`}
      description="อัปเดตข้อมูลและรูปภาพประจำตัวของน้อง"
      size="xl"
    >
      {/* Hidden file inputs for Mobile Camera and Mobile Photo Library */}
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        multiple
        onChange={(e) => handleFilesSelect(e, false)}
        className="hidden"
        aria-hidden="true"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFilesSelect(e, true)}
        className="hidden"
        aria-hidden="true"
      />

      <form onSubmit={handleSubmit} className="space-y-5 pt-1">
        {/* ================= TAB NAVIGATION ================= */}
        <div className="flex p-1 bg-surface-100 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all',
              activeTab === 'photos'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-surface-600 hover:text-surface-900'
            )}
          >
            <Camera className="w-4 h-4 text-primary-600" />
            <span>รูปภาพ ({photos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all',
              activeTab === 'basic'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-surface-600 hover:text-surface-900'
            )}
          >
            <Info className="w-4 h-4 text-primary-600" />
            <span>ข้อมูลทั่วไป & สุขภาพ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('emergency')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all',
              activeTab === 'emergency'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-surface-600 hover:text-surface-900'
            )}
          >
            <AlertTriangle className={cn('w-4 h-4', isLost ? 'text-danger-600 animate-pulse' : 'text-amber-500')} />
            <span>เบอร์ติดต่อฉุกเฉิน & SOS</span>
            {isLost && (
              <span className="px-1.5 py-0.5 rounded-full bg-danger-100 text-danger-800 text-[10px] font-extrabold">
                SOS
              </span>
            )}
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="custom-scrollbar max-h-[64vh] overflow-y-auto px-1 space-y-5">
          {/* ========================================================================= */}
          {/* TAB 1: PHOTOS & GALLERY (MOBILE UPLOAD & CAMERA)                           */}
          {/* ========================================================================= */}
          {activeTab === 'photos' && (
            <div className="space-y-5">
              {/* Active Primary Photo Showcase */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-50/60 via-white to-surface-50 border border-primary-100">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group/preview flex-shrink-0">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={name || 'Pet primary preview'}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-md ring-2 ring-primary-200"
                      />
                    ) : (
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-surface-300 bg-surface-100 flex flex-col items-center justify-center text-surface-400 gap-1.5 p-2 text-center">
                        <PawPrint className="w-8 h-8 opacity-40 text-surface-500" />
                        <span className="text-[10px] font-bold text-surface-600">ไม่มีรูปภาพ</span>
                      </div>
                    )}
                    {photoUrl && (
                      <span className="absolute bottom-1 right-1 p-1.5 rounded-full bg-primary-600 text-white shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-white" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold">
                      {photoUrl ? (
                        <>
                          <Star className="w-3.5 h-3.5 fill-primary-700 text-primary-700" />
                          <span>รูปโปรไฟล์ปัจจุบัน</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>ยังไม่มีรูปโปรไฟล์</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-surface-600 leading-relaxed">
                      {photoUrl
                        ? 'รูปนี้จะแสดงในหน้ารวมสัตว์เลี้ยง แผนที่ติดตาม และป้าย QR Tag'
                        : 'คุณสามารถกดบันทึกเพื่อใช้โปรไฟล์แบบไม่มีรูป หรือเลือกรูปภาพใหม่จากมือถือได้ครับ'}
                    </p>

                    {/* Mobile Direct Upload Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={isProcessingImage}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-xs font-bold shadow-sm transition"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{isProcessingImage ? 'กำลังโหลดรูป...' : 'เลือกรูปจากมือถือ'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        disabled={isProcessingImage}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-200 bg-white hover:bg-surface-50 active:scale-95 text-surface-800 text-xs font-bold shadow-subtle transition"
                      >
                        <Camera className="w-3.5 h-3.5 text-primary-600" />
                        <span>ถ่ายรูป</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multiple Photos Gallery Management */}
              <div className="p-4 rounded-2xl bg-surface-50 border border-surface-200/80 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary-600" />
                    <h3 className="text-xs font-bold text-surface-900">
                      รูปภาพทั้งหมดของ {name || 'น้อง'} ({photos.length} รูป)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {photos.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllPhotos}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-danger-600 hover:text-danger-700 hover:bg-danger-50 transition border border-danger-200 active:scale-95"
                        title="ลบรูปภาพทั้งหมดออกจากแกลเลอรี่"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ลบภาพทั้งหมด</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Photo thumbnails grid or empty state */}
                {photos.length === 0 ? (
                  <div className="p-6 rounded-2xl border-2 border-dashed border-surface-300 bg-white text-center space-y-2">
                    <PawPrint className="w-9 h-9 mx-auto text-surface-300" />
                    <p className="text-xs font-bold text-surface-800">ยังไม่มีรูปภาพในแกลเลอรี่</p>
                    <p className="text-[11px] text-surface-500">
                      สามารถเลือกรูปจากมือถือ หรือเลือกจากรูปแนะนำด้านล่างได้ครับ
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>เลือกรูปจากมือถือ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-200 bg-white text-surface-800 text-xs font-bold hover:bg-surface-50 transition"
                      >
                        <Camera className="w-3.5 h-3.5 text-primary-600" />
                        <span>ถ่ายรูปด้วยกล้อง</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {photos.map((url, idx) => {
                      const isPrimary = url === photoUrl;
                      return (
                        <div
                          key={idx}
                          className={cn(
                            'relative group rounded-2xl overflow-hidden aspect-square border-2 transition-all bg-surface-200',
                            isPrimary
                              ? 'border-primary-600 ring-2 ring-primary-300 shadow-md'
                              : 'border-surface-200 hover:border-primary-400'
                          )}
                        >
                          <img
                            src={url}
                            alt={`รูปที่ ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />

                          {/* Primary Badge */}
                          {isPrimary && (
                            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-primary-600/95 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm">
                              <Star className="w-2.5 h-2.5 fill-white" />
                              <span>รูปหลัก</span>
                            </div>
                          )}

                          {/* Action Overlays */}
                          <div className="absolute inset-0 bg-surface-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                            {!isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(url)}
                                className="px-2 py-1 rounded-lg bg-primary-600 text-white text-[10px] font-bold shadow-sm hover:bg-primary-700 transition"
                              >
                                ตั้งเป็นรูปหลัก
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(url)}
                              className="px-2.5 py-1 rounded-lg bg-danger-600 text-white text-[10px] font-bold shadow-sm hover:bg-danger-700 transition flex items-center gap-1 active:scale-95"
                              title="ลบรูปนี้"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>ลบรูป</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add Photo Card Slot */}
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50/40 hover:bg-primary-50 text-primary-700 transition aspect-square gap-1.5 p-2 text-center group"
                    >
                      <span className="p-2 rounded-xl bg-white text-primary-600 shadow-sm group-hover:scale-110 transition">
                        <Plus className="w-4 h-4" />
                      </span>
                      <span className="text-[11px] font-bold">เพิ่มรูปภาพ</span>
                      <span className="text-[9px] text-surface-500">จากมือถือ / ไฟล์</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Paste URL Option */}
              <div className="p-3.5 rounded-2xl bg-surface-50 border border-surface-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5 text-surface-600" />
                  <span className="text-xs font-bold text-surface-800">หรือใส่ลิงก์รูปภาพ (URL)</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="วางลิงก์รูปภาพที่นี่ (https://...)"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="text-xs font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddUrlPhoto}
                    className="whitespace-nowrap text-xs font-bold"
                  >
                    เพิ่มรูป
                  </Button>
                </div>
              </div>

              {/* Preset Gallery Palette */}
              <div className="p-3.5 rounded-2xl bg-surface-50 border border-surface-200/80 space-y-2">
                <span className="text-[11px] font-bold text-surface-500 uppercase tracking-wider block">
                  หรือเลือกจากรูปตัวอย่าง:
                </span>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {POPULAR_PET_PHOTOS.map((preset, idx) => {
                    const isSelected = photoUrl === preset.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        className={cn(
                          'relative aspect-square rounded-xl overflow-hidden border-2 transition-all group',
                          isSelected
                            ? 'border-primary-600 ring-2 ring-primary-200 scale-105'
                            : 'border-transparent hover:border-surface-300 opacity-80 hover:opacity-100'
                        )}
                        title={`${preset.name} (${preset.breed})`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        {isSelected && (
                          <span className="absolute inset-0 bg-primary-600/40 flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: BASIC INFORMATION & HEALTH CARE                                     */}
          {/* ========================================================================= */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Pet Name, Species, Breed */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="ชื่อสัตว์เลี้ยง *"
                  placeholder="เช่น โมจิ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <div>
                  <label className="text-xs font-bold text-surface-700 block mb-1.5">ประเภทสัตว์เลี้ยง *</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as PetSpecies)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-surface-300 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="DOG">สุนัข (Dog)</option>
                    <option value="CAT">แมว (Cat)</option>
                    <option value="OTHER">อื่นๆ</option>
                  </select>
                </div>

                <Input
                  label="สายพันธุ์ *"
                  placeholder="เช่น โกลเด้น รีทรีฟเวอร์"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  required
                />
              </div>

              {/* Gender, Age, Weight, Coat Color */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-surface-700 block mb-1.5">เพศ *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-surface-300 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="MALE">ตัวผู้</option>
                    <option value="FEMALE">ตัวเมีย</option>
                    <option value="UNKNOWN">ไม่ระบุ</option>
                  </select>
                </div>

                <Input
                  label="อายุ (ปี)"
                  type="number"
                  min={0}
                  max={30}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />

                <Input
                  label="น้ำหนัก (กก.)"
                  type="number"
                  min={0.1}
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                />

                <Input
                  label="สีขน / ลักษณะเด่น"
                  placeholder="เช่น สีน้ำตาลทอง ขนยาว มีแต้มขาวที่อก"
                  value={coatColor}
                  onChange={(e) => setCoatColor(e.target.value)}
                />
              </div>

              {/* Health and Medical Notes */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-surface-50 border border-surface-200">
                <label className="text-xs font-bold text-surface-700 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-danger-500" />
                  <span>ข้อมูลสุขภาพ / อาหารที่แพ้ / ข้อควรระวัง</span>
                </label>
                <textarea
                  rows={3}
                  value={healthNotes}
                  onChange={(e) => setHealthNotes(e.target.value)}
                  placeholder="เช่น แพ้อาหารไก่ ทานได้เฉพาะสูตรปลาแซลมอน ไม่ดุ เข้ากับเด็กและสัตว์อื่นได้ดี"
                  className="w-full text-xs p-3 rounded-xl border border-surface-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none leading-relaxed custom-scrollbar bg-white"
                />
              </div>

              {/* Vet Clinic */}
              <div className="p-3.5 rounded-2xl bg-surface-50 border border-surface-200">
                <Input
                  label="คลินิก / สัตวแพทย์ประจำตัว"
                  placeholder="เช่น โรงพยาบาลสัตว์ทองหล่อ (โทร. 02-123-4567)"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: EMERGENCY & PUBLIC QR TAG                                          */}
          {/* ========================================================================= */}
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              {/* Lost & SOS Emergency Switch */}
              <div
                className={cn(
                  'p-4 rounded-2xl border transition-all flex items-center justify-between gap-3',
                  isLost
                    ? 'border-danger-300 bg-danger-50/80 ring-2 ring-danger-200'
                    : 'border-amber-200 bg-amber-50/60'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      'p-2.5 rounded-xl flex-shrink-0',
                      isLost ? 'bg-danger-600 text-white animate-bounce' : 'bg-amber-100 text-amber-700'
                    )}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-surface-900">
                      {isLost ? '🚨 โหมดสัตว์เลี้ยงหาย (เปิดใช้งานอยู่)' : 'โหมดสัตว์เลี้ยงหาย (SOS)'}
                    </p>
                    <p className="text-[11px] text-surface-600">
                      เปิดเมื่อน้องพลัดหลง ปลอกคอจะส่งพิกัดถี่ขึ้น และหน้า QR Tag จะขึ้นป้ายช่วยตามหาทันที
                    </p>
                  </div>
                </div>
                <Switch checked={isLost} onChange={() => setIsLost(!isLost)} className="flex-shrink-0" />
              </div>

              {/* Emergency Contact Information */}
              <div className="p-4 rounded-2xl bg-surface-50 border border-surface-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary-600" />
                  <h4 className="text-xs font-bold text-surface-900">
                    ข้อมูลติดต่อเจ้าของ (แสดงเมื่อมีคนสแกน QR Tag)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="เบอร์โทรติดต่อเจ้าของ *"
                    placeholder="เช่น 081-234-5678"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    required
                  />

                  <Input
                    label="อีเมลติดต่อ (ถ้ามี)"
                    placeholder="เช่น owner@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="หมายเลขไมโครชิป"
                    placeholder="เช่น 900215000123456"
                    value={microchipNumber}
                    onChange={(e) => setMicrochipNumber(e.target.value)}
                  />

                  <Input
                    label="รางวัลนำส่ง (ถ้ามี)"
                    placeholder="เช่น มีสินน้ำใจ 3,000 บาท ขอบคุณที่ช่วยดูแลน้องครับ"
                    value={rewardNote}
                    onChange={(e) => setRewardNote(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-surface-700 block">
                    ข้อความถึงคนที่เจอน้อง (แสดงบนหน้าสแกน QR)
                  </label>
                  <textarea
                    rows={2}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="เช่น น้องชื่อโมจิ นิสัยเป็นมิตร ไม่กัด สามารถโทรหาเจ้าของได้ตลอดเวลา ขอบคุณครับ"
                    className="w-full text-xs p-3 rounded-xl border border-surface-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none leading-relaxed bg-white"
                  />
                </div>
              </div>

              {/* Collar Tracking Device Settings */}
              <div className="p-4 rounded-2xl bg-surface-50 border border-surface-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-surface-900">การตั้งค่าปลอกคอ</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-surface-200">
                    <div>
                      <p className="text-xs font-bold text-surface-900">ประหยัดแบตเตอรี่ (Battery Saver)</p>
                      <p className="text-[10px] text-surface-500">ลดการส่งพิกัดเมื่อน้องพักผ่อนอยู่ในบ้าน</p>
                    </div>
                    <Switch checked={batterySaver} onChange={() => setBatterySaver(!batterySaver)} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-surface-200">
                    <div>
                      <p className="text-xs font-bold text-surface-900">แจ้งเตือนด่วน (Pro Alerts)</p>
                      <p className="text-[10px] text-surface-500">เตือนทันทีเมื่อออกนอกพื้นที่ปลอดภัยหรือแบตต่ำ</p>
                    </div>
                    <Switch checked={proAlerts} onChange={() => setProAlerts(!proAlerts)} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-surface-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs font-bold"
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="text-xs font-bold shadow-sm px-6"
          >
            บันทึกข้อมูล
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
