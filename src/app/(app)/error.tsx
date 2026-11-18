'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AppErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Paws&Co. runtime boundary caught error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-white border border-surface-200 shadow-card p-6 sm:p-8 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-danger-50 text-danger-600 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold text-surface-950">
            เกิดข้อผิดพลาดชั่วคราว
          </h2>
          <p className="text-sm text-surface-500 leading-relaxed">
            ระบบไม่สามารถแสดงผลหน้านี้ได้ในขณะนี้ สามารถกดรีโหลดเพื่อใช้งานต่อได้ทันที
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Button
            variant="primary"
            onClick={() => reset()}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            ลองใหม่อีกครั้ง
          </Button>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              leftIcon={<Home className="w-4 h-4" />}
              className="w-full"
            >
              กลับหน้าหลัก
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
