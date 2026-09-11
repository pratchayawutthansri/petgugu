'use client';

import dynamic from 'next/dynamic';
import { MapSkeleton } from '@/components/ui/skeleton';

export const HistoryMap = dynamic(
  () => import('./history-map').then((mod) => mod.HistoryMap),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);
