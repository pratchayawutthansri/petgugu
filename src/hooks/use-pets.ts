'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Pet } from '@/types';
import { api } from '@/lib/api-client';
import { useToast } from '@/contexts/toast-context';

// Lightweight client-side SWR cache so switching pages renders instantly without skeleton flashes
let petsCache: Pet[] | null = null;
let inFlightPetsRequest: Promise<{ success: boolean; data?: Pet[]; error?: string }> | null = null;

/**
 * Fast O(N) structural fingerprint that avoids expensive JSON.stringify on large base64 photo payloads.
 */
function getPetsFingerprint(list: Pet[]): string {
  return list
    .map((p) => {
      const zoneSig = (p.safeZones || [])
        .map((z) => `${z.id}:${z.name}:${z.radius}:${z.latitude}:${z.longitude}:${z.isActive ? 1 : 0}`)
        .join(',');
      const vacCount = p.vaccinations?.length ?? 0;
      const photoSig = `${p.primaryPhotoUrl?.length ?? 0}:${p.photos?.length ?? 0}`;
      return [
        p.id,
        p.name,
        p.breed,
        p.updatedAt,
        p.isLost ? 1 : 0,
        p.batterySaver ? 1 : 0,
        p.proAlerts ? 1 : 0,
        p.device?.isOnline ? 1 : 0,
        p.device?.batteryLevel ?? '',
        p.device?.signalStrength ?? '',
        p.device?.lastSeenAt ?? '',
        p.latestLocation?.id ?? '',
        p.latestLocation?.latitude ?? '',
        p.latestLocation?.longitude ?? '',
        photoSig,
        vacCount,
        zoneSig,
      ].join('|');
    })
    .join('||');
}

export function usePets() {
  const [pets, setPets] = useState<Pet[]>(() => petsCache ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(() => petsCache === null);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const isMountedRef = useRef(true);
  const lastFingerprintRef = useRef<string>(petsCache ? getPetsFingerprint(petsCache) : '');

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchPets = useCallback(async (options?: { silent?: boolean }) => {
    const shouldShowLoader = !options?.silent && petsCache === null;
    if (shouldShowLoader) setIsLoading(true);
    setError(null);

    try {
      if (!inFlightPetsRequest) {
        inFlightPetsRequest = api.getPets().finally(() => {
          inFlightPetsRequest = null;
        });
      }
      const res = await inFlightPetsRequest;
      if (!isMountedRef.current) return;

      if (res.success && res.data) {
        const incomingPets = res.data;
        petsCache = incomingPets;
        const nextFp = getPetsFingerprint(incomingPets);
        if (nextFp !== lastFingerprintRef.current) {
          lastFingerprintRef.current = nextFp;
          setPets(incomingPets);
        }
      } else if (res.error !== 'Request aborted') {
        setError(res.error || 'Failed to load pets');
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message || 'Error connecting to server');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchPets({ silent: petsCache !== null });

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void fetchPets({ silent: true });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const pollingId = window.setInterval(() => {
      if (!document.hidden) {
        void fetchPets({ silent: true });
      }
    }, 10_000);

    return () => {
      window.clearInterval(pollingId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchPets]);

  const createPet = useCallback(
    async (petData: any): Promise<{ success: boolean; data?: Pet; error?: string }> => {
      try {
        const res = await api.createPet(petData);
        if (res.success && res.data) {
          setPets((prev) => {
            const next = [...prev, res.data];
            petsCache = next;
            lastFingerprintRef.current = getPetsFingerprint(next);
            return next;
          });
          showToast({
            type: 'success',
            title: 'เพิ่มสัตว์เลี้ยงสำเร็จ',
            message: `ลงทะเบียน ${res.data.name} เข้าสู่ระบบแล้ว`,
          });
          return { success: true, data: res.data };
        }
        return { success: false, error: res.error };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [showToast]
  );

  const updatePet = useCallback(
    async (id: string, updates: any): Promise<{ success: boolean; data?: Pet; error?: string }> => {
      try {
        const res = await api.updatePet(id, updates);
        if (res.success && res.data) {
          setPets((prev) => {
            const next = prev.map((p) => (p.id === id ? res.data : p));
            petsCache = next;
            lastFingerprintRef.current = getPetsFingerprint(next);
            return next;
          });
          showToast({
            type: 'success',
            title: 'อัปเดตข้อมูลสำเร็จ',
            message: `บันทึกข้อมูลของ ${res.data.name} เรียบร้อยแล้ว`,
          });
          return { success: true, data: res.data };
        }
        return { success: false, error: res.error };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [showToast]
  );

  const deletePet = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await api.deletePet(id);
        if (res.success) {
          setPets((prev) => {
            const next = prev.filter((p) => p.id !== id);
            petsCache = next;
            lastFingerprintRef.current = getPetsFingerprint(next);
            return next;
          });
          showToast({
            type: 'info',
            title: 'ลบข้อมูลสำเร็จ',
            message: 'ลบข้อมูลสัตว์เลี้ยงออกจากระบบแล้ว',
          });
          return { success: true };
        }
        return { success: false, error: res.error };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [showToast]
  );

  return {
    pets,
    isLoading,
    error,
    refreshPets: fetchPets,
    createPet,
    updatePet,
    deletePet,
  };
}
