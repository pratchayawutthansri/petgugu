import { demoStore } from '@/lib/demo-store';
import {
  formatZodIssues,
  evaluateGeofence,
  getDeviceConfig,
  IOT_PROTOCOL_VERSION,
  iotJson,
  verifyDeviceRequest,
} from '@/lib/iot-api';
import { iotLocationSchema } from '@/schemas/iot.schema';
import { LocationEventType } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * Hardware ingest endpoint for the LILYGO T-SIM7080G-S3.
 * Authentication: X-Device-Key or Authorization: Bearer <device-key>.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return iotJson({
      success: false,
      error: 'INVALID_JSON',
      message: 'Request body must be valid JSON',
    }, 400);
  }

  const parsed = iotLocationSchema.safeParse(body);
  if (!parsed.success) {
    return iotJson({
      success: false,
      error: 'VALIDATION_ERROR',
      issues: formatZodIssues(parsed.error.issues),
    }, 422);
  }

  const input = parsed.data;
  const auth = verifyDeviceRequest(request, input.deviceId);
  if (!auth.ok) return auth.response;

  const device = demoStore.getDeviceById(input.deviceId);
  if (!device) {
    return iotJson({ success: false, error: 'DEVICE_NOT_FOUND' }, 404);
  }

  const pet = demoStore.getPetByDeviceId(input.deviceId);
  if (!pet) {
    return iotJson({
      success: false,
      error: 'DEVICE_NOT_PAIRED',
      message: 'Pair this device with a pet before sending telemetry',
    }, 409);
  }

  if (input.petId && input.petId !== pet.id) {
    return iotJson({
      success: false,
      error: 'PAIRING_MISMATCH',
      message: 'The supplied petId is not paired with this device',
    }, 403);
  }

  if (input.messageId) {
    const existing = demoStore.getLocationByMessageId(input.deviceId, input.messageId);
    if (existing) {
      return iotJson({
        success: true,
        data: {
          accepted: true,
          duplicate: true,
          telemetryId: existing.id,
          serverTime: new Date().toISOString(),
          protocolVersion: IOT_PROTOCOL_VERSION,
          config: getDeviceConfig(input.deviceId),
        },
      });
    }
  }

  const serverTime = new Date().toISOString();
  const batteryLevel = input.batteryLevel ?? device.batteryLevel;
  const signalStrength = input.signalStrength ?? device.signalStrength;
  const geofence = evaluateGeofence(pet.id, input.latitude, input.longitude);
  const previousGeofence = pet.latestLocation
    ? evaluateGeofence(pet.id, pet.latestLocation.latitude, pet.latestLocation.longitude)
    : null;
  const geofenceTransition: LocationEventType | null = previousGeofence
    ? previousGeofence.insideSafeZone && !geofence.insideSafeZone
      ? 'LEFT_ZONE'
      : !previousGeofence.insideSafeZone && geofence.insideSafeZone
        ? 'ENTERED_ZONE'
        : null
    : null;
  const eventType: LocationEventType = input.eventType
    || geofenceTransition
    || (batteryLevel <= 20 ? 'LOW_BATTERY' : (input.speed ?? 0) > 0.5 ? 'MOVING' : 'STOPPED');

  const recorded = demoStore.recordLocation({
    petId: pet.id,
    deviceId: input.deviceId,
    messageId: input.messageId,
    sequence: input.sequence,
    latitude: input.latitude,
    longitude: input.longitude,
    altitude: input.altitude,
    speed: input.speed,
    heading: input.heading,
    accuracy: input.accuracy,
    satellites: input.satellites,
    hdop: input.hdop,
    batteryLevel,
    batteryVoltage: input.batteryVoltage,
    signalStrength,
    eventType,
    timestamp: input.sentAt || serverTime,
    receivedAt: serverTime,
  });

  const updatedDevice = demoStore.updateDevice(input.deviceId, {
    batteryLevel,
    batteryVoltage: input.batteryVoltage ?? device.batteryVoltage,
    signalStrength,
    isOnline: true,
    lastSeenAt: serverTime,
    firmwareVersion: input.firmwareVersion ?? device.firmwareVersion,
    networkType: input.networkType ?? device.networkType,
    gpsStatus: input.gpsStatus ?? 'FIX_3D',
  });

  if (updatedDevice) {
    demoStore.updatePet(pet.id, { device: updatedDevice, latestLocation: recorded });
  }

  return iotJson({
    success: true,
    data: {
      accepted: true,
      duplicate: false,
      telemetryId: recorded.id,
      pairedPetId: pet.id,
      serverTime,
      protocolVersion: IOT_PROTOCOL_VERSION,
      geofence: {
        ...geofence,
        transition: geofenceTransition,
      },
      config: getDeviceConfig(input.deviceId),
    },
  });
}
