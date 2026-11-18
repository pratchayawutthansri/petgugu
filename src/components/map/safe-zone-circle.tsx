'use client';

import React from 'react';
import { Circle, Popup, Tooltip } from 'react-leaflet';
import { SafeZone } from '@/types';
import { ShieldCheck } from 'lucide-react';

export interface SafeZoneCircleProps {
  zone: SafeZone;
}

const SAFE_ZONE_PATH_OPTIONS = {
  color: '#4F46E5', // Primary Indigo
  fillColor: '#6366F1',
  fillOpacity: 0.14,
  weight: 2.5,
  dashArray: '6, 6',
} as const;

export const SafeZoneCircle = React.memo(function SafeZoneCircle({ zone }: SafeZoneCircleProps) {
  if (!zone.isActive) return null;

  const radiusLabel =
    zone.radius >= 1000
      ? `${(zone.radius / 1000).toFixed(zone.radius % 1000 === 0 ? 0 : 1)} กม.`
      : `${zone.radius.toLocaleString()} ม.`;

  return (
    <Circle
      center={[zone.latitude, zone.longitude]}
      radius={zone.radius}
      pathOptions={SAFE_ZONE_PATH_OPTIONS}
    >
      <Tooltip direction="top" sticky>
        <span className="font-semibold text-xs">
          {zone.name} · รัศมี {radiusLabel}
        </span>
      </Tooltip>
      <Popup>
        <div className="p-2 text-left text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-primary text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>{zone.name}</span>
          </div>
          <p className="text-surface-500">
            รัศมีปลอดภัย: {zone.radius.toLocaleString()} เมตร
          </p>
        </div>
      </Popup>
    </Circle>
  );
});
