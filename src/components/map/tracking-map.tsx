'use client';

import React from 'react';
import { MapContainer } from './map-container';
import { PetMarker } from './pet-marker';
import { SafeZoneCircle } from './safe-zone-circle';
import { Pet, SafeZone } from '@/types';

export interface TrackingMapProps {
  pets: Pet[];
  safeZones?: SafeZone[];
  selectedPetId?: string;
  onSelectPet?: (petId: string) => void;
  className?: string;
}

export function TrackingMap({
  pets,
  safeZones = [],
  selectedPetId,
  onSelectPet,
  className = 'h-[500px] w-full rounded-2xl overflow-hidden shadow-card border border-surface-200',
}: TrackingMapProps) {
  // Find selected pet or default to first pet with location
  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const center: [number, number] = activePet?.latestLocation
    ? [activePet.latestLocation.latitude, activePet.latestLocation.longitude]
    : [13.7314, 100.5590];

  // Collect all safe zones from props or aggregated pets
  const allZones = safeZones.length > 0 ? safeZones : pets.flatMap((p) => p.safeZones || []);

  return (
    <MapContainer center={center} zoom={15} className={className}>
      {/* Render Safe Zone Circles */}
      {allZones.map((zone) => (
        <SafeZoneCircle key={zone.id} zone={zone} />
      ))}

      {/* Render Pet Live Markers */}
      {pets.map((pet) => (
        <PetMarker
          key={pet.id}
          pet={pet}
          onClick={() => onSelectPet && onSelectPet(pet.id)}
        />
      ))}
    </MapContainer>
  );
}
