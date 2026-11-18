import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Noto_Sans_Thai } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-thai',
  display: 'swap',
});

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
    <html
      lang="th"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${notoSansThai.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://tile.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-dvh bg-surface-50 text-surface-900 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
