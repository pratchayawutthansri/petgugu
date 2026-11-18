'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default marker asset paths in Webpack / Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

export interface MapFocusCircle {
  latitude: number;
  longitude: number;
  radius: number;
  trigger: number;
}

function ChangeView({
  center,
  zoom,
  focusTrigger,
  focusCircle,
}: {
  center: [number, number];
  zoom: number;
  focusTrigger?: number;
  focusCircle?: MapFocusCircle | null;
}) {
  const map = useMap();
  const [lat, lng] = center;

  useEffect(() => {
    const current = map.getCenter();
    const distanceMoved = Math.hypot(current.lat - lat, current.lng - lng);
    if (distanceMoved > 0.0002) {
      map.panTo([lat, lng], { animate: true, duration: 0.4 });
    }
  }, [lat, lng, map]);

  useEffect(() => {
    if (!focusTrigger) return;
    map.flyTo([lat, lng], zoom, { animate: true, duration: 0.5 });
  }, [focusTrigger, lat, lng, zoom, map]);

  useEffect(() => {
    if (!focusCircle) return;
    const bounds = L.latLng(focusCircle.latitude, focusCircle.longitude).toBounds(
      Math.max(focusCircle.radius, 50) * 2.4
    );
    map.fitBounds(bounds, {
      padding: [36, 36],
      maxZoom: 17,
      animate: true,
    });
  }, [focusCircle, map]);

  return null;
}

export function LeafletMapInner({
  children,
  center,
  zoom,
  focusTrigger,
  focusCircle,
}: {
  children?: React.ReactNode;
  center: [number, number];
  zoom: number;
  focusTrigger?: number;
  focusCircle?: MapFocusCircle | null;
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      preferCanvas={true}
      className="h-full w-full z-0"
    >
      <ChangeView
        center={center}
        zoom={zoom}
        focusTrigger={focusTrigger}
        focusCircle={focusCircle}
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        keepBuffer={2}
        updateWhenZooming={false}
        updateWhenIdle={true}
      />
      {children}
    </MapContainer>
  );
}
