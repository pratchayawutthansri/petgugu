'use client';

import React, { useMemo } from 'react';
import { MapContainer } from './map-container';
import { PetMarker } from './pet-marker';
import { SafeZoneCircle } from './safe-zone-circle';
import { Pet, SafeZone } from '@/types';
import type { MapFocusCircle } from './leaflet-map-inner';

export interface TrackingMapProps {
  pets: Pet[];
  safeZones?: SafeZone[];
  selectedPetId?: string;
  onSelectPet?: (petId: string) => void;
  focusTrigger?: number;
  focusCircle?: MapFocusCircle | null;
  className?: string;
}

export const TrackingMap = React.memo(function TrackingMap({
  pets,
  safeZones = [],
  selectedPetId,
  onSelectPet,
  focusTrigger,
  focusCircle,
  className = 'h-[500px] w-full rounded-2xl overflow-hidden shadow-card border border-surface-200',
}: TrackingMapProps) {
  const activePet = useMemo(
    () => pets.find((p) => p.id === selectedPetId) || pets[0],
    [pets, selectedPetId]
  );

  const petLat = activePet?.latestLocation?.latitude;
  const petLng = activePet?.latestLocation?.longitude;

  const center = useMemo<[number, number]>(
    () =>
      petLat !== undefined && petLng !== undefined
        ? [petLat, petLng]
        : [13.7314, 100.559],
    [petLat, petLng]
  );

  const allZones = useMemo(
    () => (safeZones.length > 0 ? safeZones : pets.flatMap((p) => p.safeZones || [])),
    [safeZones, pets]
  );

  return (
    <MapContainer
      center={center}
      zoom={15}
      focusTrigger={focusTrigger}
      focusCircle={focusCircle}
      className={className}
    >
      {/* Render Safe Zone Circles (key includes radius & coords so Leaflet always repaints) */}
      {allZones.map((zone) => (
        <SafeZoneCircle
          key={`${zone.id}-${zone.radius}-${zone.latitude}-${zone.longitude}-${zone.isActive}`}
          zone={zone}
        />
      ))}

      {/* Render Pet Live Markers */}
      {pets.map((pet) => (
        <PetMarker
          key={pet.id}
          pet={pet}
          onSelectPet={onSelectPet}
        />
      ))}
    </MapContainer>
  );
});
