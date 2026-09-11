'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapSkeleton } from '@/components/ui/skeleton';

export interface MapContainerProps {
  children?: React.ReactNode;
  center?: [number, number];
  zoom?: number;
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
  className = 'h-[500px] w-full rounded-2xl overflow-hidden shadow-card border border-surface-200',
}: MapContainerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <MapSkeleton />;
  }

  return (
    <div className={className}>
      <LeafletMapInner center={center} zoom={zoom}>
        {children}
      </LeafletMapInner>
    </div>
  );
}
