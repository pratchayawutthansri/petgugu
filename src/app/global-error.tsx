'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="th">
      <body className="min-h-dvh bg-surface-50 flex items-center justify-center p-6 font-sans text-surface-900">
        <div className="max-w-md w-full rounded-3xl bg-white border border-surface-200 shadow-card p-8 text-center space-y-4">
          <h1 className="text-xl font-extrabold text-surface-950">
            ระบบขัดข้องชั่วคราว
          </h1>
          <p className="text-sm text-surface-500">
            กรุณากดปุ่มด้านล่างเพื่อโหลดหน้าเว็บใหม่อีกครั้ง
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#193D4F] text-white font-bold text-sm hover:opacity-90 transition"
          >
            โหลดหน้าใหม่
          </button>
        </div>
      </body>
    </html>
  );
}
