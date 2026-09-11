import { demoStore } from '@/lib/demo-store';
import {
  formatZodIssues,
  getDeviceConfig,
  IOT_PROTOCOL_VERSION,
  iotJson,
  verifyDeviceRequest,
} from '@/lib/iot-api';
import { iotHeartbeatSchema } from '@/schemas/iot.schema';

export const dynamic = 'force-dynamic';

/** Keep the device online when GNSS has no fix and no coordinates can be sent. */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return iotJson({ success: false, error: 'INVALID_JSON' }, 400);
  }

  const parsed = iotHeartbeatSchema.safeParse(body);
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

  const serverTime = new Date().toISOString();
  const updatedDevice = demoStore.updateDevice(input.deviceId, {
    batteryLevel: input.batteryLevel ?? device.batteryLevel,
    batteryVoltage: input.batteryVoltage ?? device.batteryVoltage,
    signalStrength: input.signalStrength ?? device.signalStrength,
    isOnline: true,
    lastSeenAt: serverTime,
    firmwareVersion: input.firmwareVersion ?? device.firmwareVersion,
    networkType: input.networkType ?? device.networkType,
    gpsStatus: input.gpsStatus ?? device.gpsStatus,
  });

  const pet = demoStore.getPetByDeviceId(input.deviceId);
  if (pet && updatedDevice) {
    demoStore.updatePet(pet.id, { device: updatedDevice });
  }

  return iotJson({
    success: true,
    data: {
      acknowledged: true,
      serverTime,
      protocolVersion: IOT_PROTOCOL_VERSION,
      config: getDeviceConfig(input.deviceId),
    },
  });
}

