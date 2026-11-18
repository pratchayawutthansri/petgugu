'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pet } from '@/types';
import { api } from '@/lib/api-client';
import { useToast } from '@/contexts/toast-context';

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchPets = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setIsLoading(true);
    setError(null);
    try {
      const res = await api.getPets();
      if (res.success && res.data) {
        const incomingPets = res.data;
        setPets((prev) => {
          if (
            prev.length === incomingPets.length &&
            JSON.stringify(prev) === JSON.stringify(incomingPets)
          ) {
            return prev;
          }
          return incomingPets;
        });
      } else {
        setError(res.error || 'Failed to load pets');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to server');
    } finally {
      if (!options?.silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();

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

  const createPet = async (petData: any): Promise<{ success: boolean; data?: Pet; error?: string }> => {
    try {
      const res = await api.createPet(petData);
      if (res.success && res.data) {
        setPets((prev) => [...prev, res.data]);
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
  };

  const updatePet = async (id: string, updates: any): Promise<{ success: boolean; data?: Pet; error?: string }> => {
    try {
      const res = await api.updatePet(id, updates);
      if (res.success && res.data) {
        setPets((prev) => prev.map((p) => (p.id === id ? res.data : p)));
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
  };

  const deletePet = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.deletePet(id);
      if (res.success) {
        setPets((prev) => prev.filter((p) => p.id !== id));
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
  };

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
