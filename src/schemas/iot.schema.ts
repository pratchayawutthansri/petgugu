import { z } from 'zod';

const deviceId = z.string().trim().min(3).max(64).regex(/^[A-Za-z0-9_-]+$/);
const messageId = z.string().trim().min(6).max(96).regex(/^[A-Za-z0-9._:-]+$/);

const deviceStateSchema = z.object({
  deviceId,
  messageId: messageId.optional(),
  sequence: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).optional(),
  sentAt: z.string().datetime({ offset: true }).optional(),
  firmwareVersion: z.string().trim().min(1).max(40).optional(),
  batteryLevel: z.number().finite().min(0).max(100).optional(),
  batteryVoltage: z.number().finite().min(0).max(6).optional(),
  signalStrength: z.number().finite().min(0).max(100).optional(),
  networkType: z.enum(['NB_IOT', 'LTE_CAT_M1', 'WIFI', 'OFFLINE']).optional(),
  gpsStatus: z.enum(['FIX_3D', 'FIX_2D', 'SEARCHING', 'OFFLINE']).optional(),
});

export const iotLocationSchema = deviceStateSchema.extend({
  petId: z.string().trim().min(3).max(64).optional(),
  latitude: z.number().finite().min(-90).max(90),
  longitude: z.number().finite().min(-180).max(180),
  altitude: z.number().finite().min(-500).max(10000).optional(),
  speed: z.number().finite().min(0).max(400).optional(),
  heading: z.number().finite().min(0).max(360).optional(),
  accuracy: z.number().finite().min(0).max(10000).optional(),
  satellites: z.number().int().min(0).max(100).optional(),
  hdop: z.number().finite().min(0).max(100).optional(),
  eventType: z.enum([
    'MOVING',
    'STOPPED',
    'ENTERED_ZONE',
    'LEFT_ZONE',
    'AT_REST',
    'LOW_BATTERY',
    'SOS_TRIGGERED',
  ]).optional(),
});

export const iotHeartbeatSchema = deviceStateSchema.extend({
  uptimeSeconds: z.number().int().nonnegative().optional(),
  freeHeapBytes: z.number().int().nonnegative().optional(),
});

export const iotConfigUpdateSchema = z.object({
  deviceId,
  updateIntervalSeconds: z.number().int().min(5).max(3600).optional(),
  powerSaveMode: z.boolean().optional(),
}).refine(
  (value) => value.updateIntervalSeconds !== undefined || value.powerSaveMode !== undefined,
  { message: 'At least one configuration field is required' }
);

export type IotLocationInput = z.infer<typeof iotLocationSchema>;
export type IotHeartbeatInput = z.infer<typeof iotHeartbeatSchema>;

