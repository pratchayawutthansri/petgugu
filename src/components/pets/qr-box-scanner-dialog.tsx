'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, Camera, CheckCircle2, Keyboard } from 'lucide-react';

export interface QrBoxScannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScanned: (code: string) => void;
}

export function QrBoxScannerDialog({
  isOpen,
  onClose,
  onScanned,
}: QrBoxScannerDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const [cameraState, setCameraState] = useState<'starting' | 'active' | 'unavailable'>('starting');
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setCameraState('starting');
    setManualCode('');
    setShowManual(false);

    const stopCamera = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };

    const startCamera = async () => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) setCameraState('unavailable');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraState('active');

        // Use native BarcodeDetector if available (Chrome / Edge / Android)
        const BarcodeDetectorCtor = (window as any).BarcodeDetector;
        if (BarcodeDetectorCtor) {
          const detector = new BarcodeDetectorCtor({ formats: ['qr_code'] });
          const scanLoop = async () => {
            if (cancelled || !videoRef.current) return;
            try {
              if (videoRef.current.readyState >= 2) {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes.length > 0 && barcodes[0].rawValue) {
                  stopCamera();
                  onScanned(String(barcodes[0].rawValue).trim());
                  onClose();
                  return;
                }
              }
            } catch {
              // Ignore transient frame detection errors
            }
            rafRef.current = requestAnimationFrame(scanLoop);
          };
          rafRef.current = requestAnimationFrame(scanLoop);
        }
      } catch {
        if (!cancelled) setCameraState('unavailable');
      }
    };

    void startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [isOpen, onScanned, onClose]);

  const handleConfirmManual = (e: React.FormEvent) => {
    e.preventDefault();
    const code = manualCode.trim().toUpperCase();
    if (!code) return;
    onScanned(code);
    onClose();
  };

  const handleQuickDemoScan = () => {
    onScanned('PAWS-BOX-8842A');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="สแกน QR Code ที่ตัวกล่องปลอกคอ"
      description="นำกล้องส่องไปที่สติกเกอร์ QR Code ข้างกล่องหรือใต้ตัวเครื่องเพื่อเชื่อมต่ออัตโนมัติ"
      size="md"
    >
      <div className="space-y-4 pt-1">
        {/* Live Camera Viewfinder */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-950 aspect-[4/3] flex items-center justify-center border border-surface-200">
          {cameraState !== 'unavailable' && (
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          )}

          {/* Scanning Frame Overlay */}
          {cameraState === 'active' && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 rounded-2xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                <span className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                <span className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                <span className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
              </div>
              <span className="mt-4 px-3 py-1 rounded-full bg-black/65 text-white text-xs font-semibold">
                จัด QR Code ให้อยู่ในกรอบสีเขียว
              </span>
            </div>
          )}

          {cameraState === 'starting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 gap-2 bg-surface-950">
              <Camera className="w-8 h-8 animate-pulse text-emerald-400" />
              <p className="text-xs font-semibold">กำลังเปิดกล้อง...</p>
            </div>
          )}

          {cameraState === 'unavailable' && (
            <div className="p-6 text-center space-y-2 text-white/90">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/10 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-sm font-bold">ไม่สามารถเปิดกล้องบนอุปกรณ์นี้ได้</p>
              <p className="text-xs text-white/70 leading-relaxed">
                คุณสามารถกรอกรหัสใต้ QR Code ข้างกล่อง หรือกดยืนยันจับคู่จากกล่องได้เลย
              </p>
            </div>
          )}
        </div>

        {/* Manual Box Code Option */}
        {showManual ? (
          <form onSubmit={handleConfirmManual} className="flex gap-2">
            <Input
              placeholder="กรอกรหัสใต้ QR ที่กล่อง เช่น PAWS-BOX-8842A"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
            />
            <Button type="submit" variant="primary" disabled={!manualCode.trim()}>
              ยืนยัน
            </Button>
          </form>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowManual(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-600 hover:text-primary-700 transition"
            >
              <Keyboard className="w-4 h-4" />
              <span>กรอกรหัสข้างกล่องเอง</span>
            </button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={handleQuickDemoScan}
            >
              จับคู่กล่องนี้ทันที
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
