'use client';

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Pet } from '@/types';
import { Battery, Wifi, Navigation } from 'lucide-react';
import Link from 'next/link';

export interface PetMarkerProps {
  pet: Pet;
  onClick?: () => void;
}

export function PetMarker({ pet, onClick }: PetMarkerProps) {
  const loc = pet.latestLocation;
  if (!loc) return null;

  const isOnline = pet.device?.isOnline ?? true;
  const isLost = pet.isLost;

  // Status Ring Color
  const ringColor = isLost
    ? '#EF4444' // Red SOS
    : isOnline
    ? '#10B981' // Green Online
    : '#94A3B8'; // Gray Offline

  // Create custom HTML DivIcon with avatar image
  const customIcon = L.divIcon({
    className: 'custom-pet-marker',
    html: `
      <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background-color: ${ringColor};
          opacity: 0.35;
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          border: 3px solid ${ringColor};
          background-color: white;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15);
        ">
          <img 
            src="${pet.primaryPhotoUrl}" 
            alt="${pet.name}" 
            style="width: 100%; height: 100%; object-fit: cover;" 
          />
        </div>
        <div style="
          position: absolute;
          bottom: -4px;
          right: -2px;
          background-color: ${ringColor};
          color: white;
          font-size: 9px;
          font-weight: bold;
          padding: 1px 4px;
          border-radius: 9999px;
          border: 1.5px solid white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        ">
          ${isLost ? 'SOS' : isOnline ? 'ON' : 'OFF'}
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -26],
  });

  return (
    <Marker
      position={[loc.latitude, loc.longitude]}
      icon={customIcon}
      eventHandlers={{
        click: () => onClick && onClick(),
      }}
    >
      <Popup className="pet-map-popup">
        <div className="p-3 max-w-[240px] text-left">
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src={pet.primaryPhotoUrl}
              alt={pet.name}
              className="w-10 h-10 rounded-full object-cover border border-surface-200"
            />
            <div>
              <h4 className="font-bold text-sm text-surface-900 leading-tight">
                {pet.name}
              </h4>
              <p className="text-xs text-surface-500 truncate">{pet.breed}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 py-2 border-y border-surface-100 text-xs text-surface-600 mb-2">
            <div className="flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-primary" />
              <span>{pet.device?.batteryLevel ?? loc.batteryLevel}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-secondary-600" />
              <span>{pet.device?.networkType ?? 'NB-IoT'}</span>
            </div>
            {loc.speed !== undefined && (
              <div className="flex items-center gap-1 col-span-2">
                <Navigation className="w-3.5 h-3.5 text-surface-400" />
                <span>ความเร็ว: {loc.speed} km/h</span>
              </div>
            )}
          </div>

          <Link
            href={`/pet/${pet.id}`}
            className="block text-center text-xs font-semibold text-primary hover:underline"
          >
            ดูรายละเอียดสัตว์เลี้ยง &rarr;
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
