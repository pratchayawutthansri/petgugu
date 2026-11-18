'use client';

import React, { useEffect, useMemo } from 'react';
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

// Static memoized markers for start and end
const startIcon = L.divIcon({
  className: 'custom-start-marker',
  html: `
    <div style="background-color: #10B981; color: white; border-radius: 9999px; padding: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; font-size: 11px; font-weight: bold; transform: translateZ(0);">
      S
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const endIcon = L.divIcon({
  className: 'custom-end-marker',
  html: `
    <div style="background-color: #4F46E5; color: white; border-radius: 9999px; padding: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; font-size: 11px; font-weight: bold; transform: translateZ(0);">
      E
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function createEventDotIcon(color: string) {
  return L.divIcon({
    className: 'custom-event-marker',
    html: `<div style="background-color: ${color}; color: white; border-radius: 9999px; width: 18px; height: 18px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

// Static cached event icons so markers are never recreated on re-render
const EVENT_ICONS: Record<string, L.DivIcon> = {
  SOS_TRIGGERED: createEventDotIcon('#EF4444'),
  LEFT_ZONE: createEventDotIcon('#EF4444'),
  LOW_BATTERY: createEventDotIcon('#F59E0B'),
  ENTERED_ZONE: createEventDotIcon('#3B82F6'),
};

const ROUTE_PATH_OPTIONS = {
  color: '#4F46E5',
  weight: 4,
  opacity: 0.85,
  lineJoin: 'round' as const,
};

function FitRouteBounds({
  positions,
  routeKey,
}: {
  positions: [number, number][];
  routeKey: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (positions.length < 2) return;
    map.fitBounds(L.latLngBounds(positions), { padding: [56, 56], maxZoom: 16 });
    // Only re-fit when the route identity/endpoints actually change, not on silent polling
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, routeKey]);

  return null;
}

export const HistoryMap = React.memo(function HistoryMap({
  locations,
  safeZones = [],
  className = 'h-[500px] w-full rounded-2xl overflow-hidden shadow-card border border-surface-200',
}: HistoryMapProps) {
  const positions: [number, number][] = useMemo(
    () => locations.map((l) => [l.latitude, l.longitude]),
    [locations]
  );

  const eventLocations = useMemo(
    () =>
      locations.filter(
        (l) =>
          l.eventType === 'LEFT_ZONE' ||
          l.eventType === 'ENTERED_ZONE' ||
          l.eventType === 'LOW_BATTERY' ||
          l.eventType === 'SOS_TRIGGERED'
      ),
    [locations]
  );

  const activeZones = useMemo(
    () => safeZones.filter((zone) => zone.isActive),
    [safeZones]
  );

  if (locations.length === 0) {
    return (
      <div className={`${className} bg-surface-100 flex items-center justify-center text-surface-400`}>
        ไม่มีข้อมูลเส้นทาง
      </div>
    );
  }

  const startPoint = locations[0];
  const endPoint = locations[locations.length - 1];
  const center: [number, number] = [endPoint.latitude, endPoint.longitude];
  const routeKey = `${startPoint.id}|${endPoint.id}|${locations.length}`;

  return (
    <MapContainer center={center} zoom={15} className={className}>
      <FitRouteBounds positions={positions} routeKey={routeKey} />

      {activeZones.map((zone) => (
        <SafeZoneCircle
          key={`${zone.id}-${zone.radius}-${zone.latitude}-${zone.longitude}`}
          zone={zone}
        />
      ))}

      {/* Route Path Polyline */}
      <Polyline positions={positions} pathOptions={ROUTE_PATH_OPTIONS} />

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

      {/* Intermediate Event Markers using static cached icons */}
      {eventLocations.map((evt) => (
        <Marker
          key={evt.id}
          position={[evt.latitude, evt.longitude]}
          icon={EVENT_ICONS[evt.eventType || 'ENTERED_ZONE'] || EVENT_ICONS.ENTERED_ZONE}
        >
          <Popup>
            <div className="p-2 text-left text-xs">
              <p className="font-bold text-surface-900">{evt.eventType}</p>
              <p className="text-surface-500">{formatDate(evt.timestamp, 'th')}</p>
              {evt.note && <p className="text-surface-700 mt-1">{evt.note}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
});
