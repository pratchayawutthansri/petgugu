import React from 'react';
import Link from 'next/link';
import { PawPrint, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-surface-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl bg-white border border-surface-200 shadow-card p-8 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center">
          <PawPrint className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-surface-950">ไม่พบหน้าที่คุณต้องการ</h1>
        <p className="text-sm text-surface-500 leading-relaxed">
          ลิงก์นี้อาจถูกย้ายหรือไม่มีอยู่ในระบบ สามารถกลับไปยังหน้าหลักเพื่อติดตามสัตว์เลี้ยงต่อได้ทันที
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-600 transition"
          >
            <Home className="w-4 h-4" />
            <span>กลับหน้า Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
