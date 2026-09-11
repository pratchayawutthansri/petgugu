import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { demoStore } from '@/lib/demo-store';
import { calculateDistanceMeters } from '@/lib/utils';

export const IOT_PROTOCOL_VERSION = '1.0';

type DeviceAuthResult =
  | { ok: true }
  | { ok: false; response: NextResponse };

export function iotJson(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-IoT-Protocol-Version': IOT_PROTOCOL_VERSION,
    },
  });
}

function parseDeviceKeys(): Map<string, string> {
  const configured = process.env.IOT_DEVICE_KEYS || '';
  const entries = configured
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const separator = entry.indexOf(':');
      return separator > 0
        ? [entry.slice(0, separator).trim(), entry.slice(separator + 1).trim()] as const
        : ['', ''] as const;
    })
    .filter(([id, key]) => Boolean(id && key));

  return new Map(entries);
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyDeviceRequest(request: Request, deviceId: string): DeviceAuthResult {
  const expectedKey = parseDeviceKeys().get(deviceId);
  if (!expectedKey) {
    return {
      ok: false,
      response: iotJson({
        success: false,
        error: 'DEVICE_NOT_PROVISIONED',
        message: 'No server-side key is configured for this device',
      }, 403),
    };
  }

  const authorization = request.headers.get('authorization');
  const suppliedKey = request.headers.get('x-device-key')
    || (authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : '');

  if (!suppliedKey || !safeEqual(suppliedKey, expectedKey)) {
    return {
      ok: false,
      response: iotJson({
        success: false,
        error: 'UNAUTHORIZED_DEVICE',
        message: 'A valid X-Device-Key or Bearer token is required',
      }, 401),
    };
  }

  return { ok: true };
}

export function getDeviceConfig(deviceId: string) {
  const device = demoStore.getDeviceById(deviceId);
  const pet = demoStore.getPetByDeviceId(deviceId);

  if (!device) return null;

  return {
    deviceId,
    pairedPetId: pet?.id || null,
    updateIntervalSeconds: device.updateIntervalSeconds,
    heartbeatIntervalSeconds: device.powerSaveMode ? 300 : 60,
    powerSaveMode: device.powerSaveMode,
    sosActive: pet?.isLost || false,
    safeZones: (pet?.safeZones || [])
      .filter((zone) => zone.isActive)
      .map((zone) => ({
        id: zone.id,
        name: zone.name,
        latitude: zone.latitude,
        longitude: zone.longitude,
        radiusMeters: zone.radius,
      })),
  };
}

export function evaluateGeofence(petId: string, latitude: number, longitude: number) {
  const activeZones = demoStore.getSafeZonesByPetId(petId).filter((zone) => zone.isActive);
  const matchedZones = activeZones
    .map((zone) => ({
      id: zone.id,
      name: zone.name,
      distanceMeters: calculateDistanceMeters(latitude, longitude, zone.latitude, zone.longitude),
      radiusMeters: zone.radius,
    }))
    .filter((zone) => zone.distanceMeters <= zone.radiusMeters)
    .sort((left, right) => left.distanceMeters - right.distanceMeters);

  return {
    insideSafeZone: matchedZones.length > 0,
    matchedZones,
  };
}

export function formatZodIssues(issues: Array<{ path: Array<string | number>; message: string }>) {
  return issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }));
}
