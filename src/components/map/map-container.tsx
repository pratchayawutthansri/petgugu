'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapSkeleton } from '@/components/ui/skeleton';

import type { MapFocusCircle } from './leaflet-map-inner';

export interface MapContainerProps {
  children?: React.ReactNode;
  center?: [number, number];
  zoom?: number;
  focusTrigger?: number;
  focusCircle?: MapFocusCircle | null;
  className?: string;
}

// Inner Leaflet Map Loader with dynamic client-side only import
const LeafletMapInner = dynamic(
  () => import('./leaflet-map-inner').then((mod) => mod.LeafletMapInner),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

export function MapContainer({
  children,
  center = [13.7314, 100.5590], // Default Bangkok Benjakitti Park
  zoom = 15,
  focusTrigger,
  focusCircle,
  className = 'h-[500px] w-full rounded-2xl overflow-hidden shadow-card border border-surface-200',
}: MapContainerProps) {
  const [mountKey, setMountKey] = useState<string | null>(null);

  useEffect(() => {
    setMountKey(`map_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
    return () => {
      setMountKey(null);
    };
  }, []);

  if (!mountKey) {
    return <MapSkeleton />;
  }

  return (
    <div className={className}>
      <LeafletMapInner
        key={mountKey}
        center={center}
        zoom={zoom}
        focusTrigger={focusTrigger}
        focusCircle={focusCircle}
      >
        {children}
      </LeafletMapInner>
    </div>
  );
}
