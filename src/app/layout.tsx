import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: {
    default: 'Paws&Co. — Dog Tracking System',
    template: '%s | Paws&Co.',
  },
  description:
    'ระบบติดตามสุนัขแบบใกล้เคียงเวลาจริงผ่านเครือข่ายอินเทอร์เน็ต — An Internet-based Near Real-time Dog Tracking System',
  keywords: [
    'dog tracking',
    'pet tracker',
    'GPS collar',
    'IoT',
    'QR Code',
    'safe zone',
    'ติดตามสุนัข',
    'ปลอกคออัจฉริยะ',
  ],
  authors: [{ name: 'Paws&Co. Team' }],
  icons: {
    icon: '/images/logo-icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4F46E5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-dvh bg-surface-50 text-surface-900 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
