'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { DEMO_USERS } from '@/data/demo-users';
import { api } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { displayName: string; email: string; password: string; phoneNumber?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginAsDemoAccount: (type?: 'user' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial session load
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('paws_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Default to demo user for smooth testing experience
          const defaultDemo = DEMO_USERS[0];
          setUser(defaultDemo);
          localStorage.setItem('paws_user', JSON.stringify(defaultDemo));
        }
      } catch (e) {
        setUser(DEMO_USERS[0]);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password: pass });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('paws_user', JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, error: res.error || 'เข้าสู่ระบบไม่สำเร็จ (Login failed)' };
    } catch (err: any) {
      return { success: false, error: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    displayName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await api.signup(data);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('paws_user', JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, error: res.error || 'ลงทะเบียนไม่สำเร็จ (Registration failed)' };
    } catch (err: any) {
      return { success: false, error: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('paws_user');
      setIsLoading(false);
    }
  };

  const loginAsDemoAccount = async (type: 'user' | 'admin' = 'user') => {
    const targetUser = type === 'admin' ? DEMO_USERS[1] : DEMO_USERS[0];
    setUser(targetUser);
    localStorage.setItem('paws_user', JSON.stringify(targetUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loginAsDemoAccount,
      }}
    >
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
