'use client';

import React, { useEffect } from 'react';
import { Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapContainer } from './map-container';
import { SafeZoneCircle } from './safe-zone-circle';
import { LocationHistory, SafeZone } from '@/types';
import { formatDate } from '@/lib/utils';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

export interface HistoryMapProps {
  locations: LocationHistory[];
  safeZones?: SafeZone[];
  className?: string;
}

function FitRouteBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length < 2) return;
    map.fitBounds(L.latLngBounds(positions), { padding: [56, 56], maxZoom: 16 });
  }, [map, positions]);

  return null;
}

export function HistoryMap({
  locations,
  safeZones = [],
  className = 'h-[500px] w-full rounded-2xl overflow-hidden shadow-card border border-surface-200',
}: HistoryMapProps) {
  if (locations.length === 0) {
    return (
      <div className={`${className} bg-surface-100 flex items-center justify-center text-surface-400`}>
        ไม่มีข้อมูลเส้นทาง
      </div>
    );
  }

  const positions: [number, number][] = locations.map((l) => [l.latitude, l.longitude]);
  const startPoint = locations[0];
  const endPoint = locations[locations.length - 1];
  const center: [number, number] = [endPoint.latitude, endPoint.longitude];

  // Custom Start Icon (Green)
  const startIcon = L.divIcon({
    className: 'custom-start-marker',
    html: `
      <div style="background-color: #10B981; color: white; border-radius: 9999px; padding: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; font-size: 11px; font-weight: bold;">
        S
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  // Custom End Icon (Red / Primary)
  const endIcon = L.divIcon({
    className: 'custom-end-marker',
    html: `
      <div style="background-color: #4F46E5; color: white; border-radius: 9999px; padding: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; font-size: 11px; font-weight: bold;">
        E
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  return (
    <MapContainer center={center} zoom={15} className={className}>
      <FitRouteBounds positions={positions} />

      {safeZones.filter((zone) => zone.isActive).map((zone) => (
        <SafeZoneCircle key={zone.id} zone={zone} />
      ))}

      {/* Route Path Polyline */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: '#4F46E5', // Primary Purple
          weight: 4,
          opacity: 0.85,
          lineJoin: 'round',
        }}
      />

      {/* Start Marker */}
      <Marker position={[startPoint.latitude, startPoint.longitude]} icon={startIcon}>
        <Popup>
          <div className="p-2 text-left text-xs">
            <p className="font-bold text-success-600">จุดเริ่มต้น (Start Point)</p>
            <p className="text-surface-500 mt-1">{formatDate(startPoint.timestamp, 'th')}</p>
            {startPoint.note && <p className="text-surface-600 mt-0.5">{startPoint.note}</p>}
          </div>
        </Popup>
      </Marker>

      {/* End Marker */}
      <Marker position={[endPoint.latitude, endPoint.longitude]} icon={endIcon}>
        <Popup>
          <div className="p-2 text-left text-xs">
            <p className="font-bold text-primary">จุดสิ้นสุด (Latest Point)</p>
            <p className="text-surface-500 mt-1">{formatDate(endPoint.timestamp, 'th')}</p>
            {endPoint.note && <p className="text-surface-600 mt-0.5">{endPoint.note}</p>}
          </div>
        </Popup>
      </Marker>

      {/* Intermediate Event Markers for special events (e.g. LEFT_ZONE, ENTERED_ZONE, LOW_BATTERY) */}
      {locations
        .filter(
          (l) =>
            l.eventType === 'LEFT_ZONE' ||
            l.eventType === 'ENTERED_ZONE' ||
            l.eventType === 'LOW_BATTERY' ||
            l.eventType === 'SOS_TRIGGERED'
        )
        .map((evt) => {
          const eventIcon = L.divIcon({
            className: 'custom-event-marker',
            html: `
              <div style="background-color: ${
                evt.eventType === 'SOS_TRIGGERED' || evt.eventType === 'LEFT_ZONE'
                  ? '#EF4444'
                  : evt.eventType === 'LOW_BATTERY'
                  ? '#F59E0B'
                  : '#3B82F6'
              }; color: white; border-radius: 9999px; width: 18px; height: 18px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
            `,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          });

          return (
            <Marker
              key={evt.id}
              position={[evt.latitude, evt.longitude]}
              icon={eventIcon}
            >
              <Popup>
                <div className="p-2 text-left text-xs">
                  <p className="font-bold text-surface-900">{evt.eventType}</p>
                  <p className="text-surface-500">{formatDate(evt.timestamp, 'th')}</p>
                  {evt.note && <p className="text-surface-700 mt-1">{evt.note}</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}
