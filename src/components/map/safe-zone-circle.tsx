'use client';

import React from 'react';
import { Circle, Popup } from 'react-leaflet';
import { SafeZone } from '@/types';
import { ShieldCheck } from 'lucide-react';

export interface SafeZoneCircleProps {
  zone: SafeZone;
}

export function SafeZoneCircle({ zone }: SafeZoneCircleProps) {
  if (!zone.isActive) return null;

  return (
    <Circle
      center={[zone.latitude, zone.longitude]}
      radius={zone.radius}
      pathOptions={{
        color: '#4F46E5', // Primary Purple
        fillColor: '#6366F1',
        fillOpacity: 0.12,
        weight: 2,
        dashArray: '6, 6',
      }}
    >
      <Popup>
        <div className="p-2 text-left text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-primary text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>{zone.name}</span>
          </div>
          <p className="text-surface-500">รัศมีปลอดภัย: {zone.radius} เมตร</p>
        </div>
      </Popup>
    </Circle>
  );
}
