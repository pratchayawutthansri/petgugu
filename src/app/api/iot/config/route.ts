import { demoStore } from '@/lib/demo-store';
import {
  formatZodIssues,
  getDeviceConfig,
  IOT_PROTOCOL_VERSION,
  iotJson,
  verifyDeviceRequest,
} from '@/lib/iot-api';
import { iotConfigUpdateSchema } from '@/schemas/iot.schema';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('deviceId')?.trim() || '';

  if (!deviceId) {
    return iotJson({ success: false, error: 'DEVICE_ID_REQUIRED' }, 400);
  }

  const auth = verifyDeviceRequest(request, deviceId);
  if (!auth.ok) return auth.response;

  const config = getDeviceConfig(deviceId);
  if (!config) {
    return iotJson({ success: false, error: 'DEVICE_NOT_FOUND' }, 404);
  }

  return iotJson({
    success: true,
    data: {
      protocolVersion: IOT_PROTOCOL_VERSION,
      serverTime: new Date().toISOString(),
      config,
    },
  });
}

export async function PUT(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return iotJson({ success: false, error: 'INVALID_JSON' }, 400);
  }

  const parsed = iotConfigUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return iotJson({
      success: false,
      error: 'VALIDATION_ERROR',
      issues: formatZodIssues(parsed.error.issues),
    }, 422);
  }

  const auth = verifyDeviceRequest(request, parsed.data.deviceId);
  if (!auth.ok) return auth.response;

  const device = demoStore.getDeviceById(parsed.data.deviceId);
  if (!device) {
    return iotJson({ success: false, error: 'DEVICE_NOT_FOUND' }, 404);
  }

  const pet = demoStore.getPetByDeviceId(parsed.data.deviceId);
  if (pet && parsed.data.powerSaveMode !== undefined) {
    demoStore.updatePet(pet.id, { batterySaver: parsed.data.powerSaveMode });
  }

  const currentDevice = demoStore.getDeviceById(parsed.data.deviceId) || device;
  demoStore.updateDevice(parsed.data.deviceId, {
    updateIntervalSeconds: parsed.data.updateIntervalSeconds ?? currentDevice.updateIntervalSeconds,
    powerSaveMode: parsed.data.powerSaveMode ?? currentDevice.powerSaveMode,
  });

  return iotJson({
    success: true,
    data: {
      serverTime: new Date().toISOString(),
      config: getDeviceConfig(parsed.data.deviceId),
    },
  });
}
