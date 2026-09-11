'use client';

import dynamic from 'next/dynamic';
import { MapSkeleton } from '@/components/ui/skeleton';

export const TrackingMap = dynamic(
  () => import('./tracking-map').then((mod) => mod.TrackingMap),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);
