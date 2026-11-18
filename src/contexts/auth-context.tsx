'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '@/types';
import { DEMO_USERS } from '@/data/demo-users';
import { api } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    displayName: string;
    username?: string;
    email?: string;
    password: string;
    phoneNumber?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginAsDemoAccount: (type?: 'user' | 'admin') => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function safeSetStoredUser(user: User) {
  try {
    localStorage.setItem('paws_user', JSON.stringify(user));
  } catch {
    // Ignore storage quota or private-mode errors
  }
}

function safeRemoveStoredUser() {
  try {
    localStorage.removeItem('paws_user');
  } catch {
    // Ignore private-mode errors
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial session load
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('paws_user');
        if (storedUser) {
          const parsed: User = JSON.parse(storedUser);
          if (!parsed.avatarUrl || parsed.avatarUrl.includes('1535713875002')) {
            parsed.avatarUrl = '/images/default-avatar.svg';
            safeSetStoredUser(parsed);
          }
          setUser(parsed);
        } else {
          // Default to demo user for smooth testing experience
          const defaultDemo = DEMO_USERS[0];
          setUser(defaultDemo);
          safeSetStoredUser(defaultDemo);
        }
      } catch {
        setUser(DEMO_USERS[0]);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await api.login({ identifier, email: identifier, password: pass });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        safeSetStoredUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'เข้าสู่ระบบไม่สำเร็จ (Login failed)' };
    } catch (err: any) {
      return { success: false, error: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: {
    displayName: string;
    username?: string;
    email?: string;
    password: string;
    phoneNumber?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await api.signup(data);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        safeSetStoredUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'ลงทะเบียนไม่สำเร็จ (Registration failed)' };
    } catch (err: any) {
      return { success: false, error: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } finally {
      setUser(null);
      safeRemoveStoredUser();
      setIsLoading(false);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }, []);

  const loginAsDemoAccount = useCallback(async (type: 'user' | 'admin' = 'user') => {
    const targetUser = type === 'admin' ? DEMO_USERS[1] : DEMO_USERS[0];
    setUser(targetUser);
    safeSetStoredUser(targetUser);
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await api.updateUser(updates);
        const mergedUser: User | null = user
          ? {
              ...user,
              ...(res.success && res.data ? res.data : updates),
              updatedAt: new Date().toISOString(),
            }
          : null;
        if (mergedUser) {
          setUser(mergedUser);
          safeSetStoredUser(mergedUser);
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message || 'อัปเดตโปรไฟล์ไม่สำเร็จ' };
      }
    },
    [user]
  );

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      loginAsDemoAccount,
      updateProfile,
    }),
    [user, isLoading, login, register, logout, loginAsDemoAccount, updateProfile]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
