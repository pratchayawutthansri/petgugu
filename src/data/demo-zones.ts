import { SafeZone } from '@/types';

export const DEMO_SAFE_ZONES: SafeZone[] = [
  {
    id: 'zone_mochi_home',
    petId: 'pet_mochi_01',
    name: 'บ้าน (Home - Sukhumvit)',
    latitude: 13.7465,
    longitude: 100.5530,
    radius: 300, // 300 meters
    isActive: true,
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-08-20T08:00:00.000Z',
  },
  {
    id: 'zone_mochi_park',
    petId: 'pet_mochi_01',
    name: 'สวนเบญจกิติ (Benjakitti Park)',
    latitude: 13.7314,
    longitude: 100.5590,
    radius: 450, // 450 meters
    isActive: true,
    createdAt: '2026-02-10T12:00:00.000Z',
    updatedAt: '2026-08-20T08:00:00.000Z',
  },
  {
    id: 'zone_lucky_home',
    petId: 'pet_lucky_02',
    name: 'บ้านสวน (Garden Residence - Ari)',
    latitude: 13.7820,
    longitude: 100.5440,
    radius: 250,
    isActive: true,
    createdAt: '2026-03-01T15:00:00.000Z',
    updatedAt: '2026-08-22T09:00:00.000Z',
  },
];
