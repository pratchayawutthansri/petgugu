'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { LocationHistory, RouteStatistics } from '@/types';
import { api } from '@/lib/api-client';
import { calculateDistanceMeters } from '@/lib/utils';

export function useLocations(petId: string, from?: string, to?: string) {
  const [locations, setLocations] = useState<LocationHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async (options?: { silent?: boolean }) => {
    if (!petId) return;
    if (!options?.silent) setIsLoading(true);
    setError(null);
    try {
      const res = await api.getPetHistory(petId, from, to);
      if (res.success && res.data) {
        setLocations(res.data);
      } else {
        setError(res.error || 'Failed to load telemetry');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching telemetry');
    } finally {
      if (!options?.silent) setIsLoading(false);
    }
  }, [petId, from, to]);

  useEffect(() => {
    fetchLocations();
    const pollingId = window.setInterval(() => {
      void fetchLocations({ silent: true });
    }, 15_000);

    return () => window.clearInterval(pollingId);
  }, [fetchLocations]);

  // Compute Route Statistics
  const statistics = useMemo<RouteStatistics>(() => {
    if (locations.length < 2) {
      return {
        petId,
        startDate: locations[0]?.timestamp || new Date().toISOString(),
        endDate: locations[0]?.timestamp || new Date().toISOString(),
        totalDistanceKm: 0,
        durationMinutes: 0,
        averageSpeedKmh: 0,
        maxSpeedKmh: 0,
        batteryConsumedPercent: 0,
        pointCount: locations.length,
      };
    }

    let totalMeters = 0;
    let maxSpeed = 0;
    let sumSpeed = 0;
    let speedCount = 0;

    for (let i = 1; i < locations.length; i++) {
      const prev = locations[i - 1];
      const curr = locations[i];
      const dist = calculateDistanceMeters(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
      totalMeters += dist;

      if (curr.speed !== undefined) {
        maxSpeed = Math.max(maxSpeed, curr.speed);
        sumSpeed += curr.speed;
        speedCount++;
      }
    }

    const firstTime = new Date(locations[0].timestamp).getTime();
    const lastTime = new Date(locations[locations.length - 1].timestamp).getTime();
    const durationMin = Math.max(1, Math.round((lastTime - firstTime) / (1000 * 60)));

    const firstBat = locations[0].batteryLevel;
    const lastBat = locations[locations.length - 1].batteryLevel;
    const batUsed = Math.max(0, firstBat - lastBat);

    return {
      petId,
      startDate: locations[0].timestamp,
      endDate: locations[locations.length - 1].timestamp,
      totalDistanceKm: Number((totalMeters / 1000).toFixed(2)),
      durationMinutes: durationMin,
      averageSpeedKmh: speedCount > 0 ? Number((sumSpeed / speedCount).toFixed(1)) : 0,
      maxSpeedKmh: Number(maxSpeed.toFixed(1)),
      batteryConsumedPercent: batUsed,
      pointCount: locations.length,
    };
  }, [locations, petId]);

  return {
    locations,
    statistics,
    isLoading,
    error,
    refreshLocations: fetchLocations,
  };
}
