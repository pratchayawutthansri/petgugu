import { NextResponse } from 'next/server';
import { IOT_PROTOCOL_VERSION } from '@/lib/iot-api';
import { getTelemetryStorageStatus } from '@/lib/telemetry-repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const deviceKeysConfigured = Boolean(process.env.IOT_DEVICE_KEYS?.trim());
  const mqttConfigured = Boolean(process.env.MQTT_BROKER_URL?.trim());

  return NextResponse.json({
    status: deviceKeysConfigured ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    version: '1.1.0',
    environment: process.env.NODE_ENV || 'development',
    mode: demoMode ? 'demo' : 'production',
    services: {
      webApi: { status: 'online' },
      storage: demoMode
        ? getTelemetryStorageStatus()
        : { status: 'external_database_required', persistent: false },
      iotIngest: {
        status: deviceKeysConfigured ? 'ready' : 'configuration_required',
        protocolVersion: IOT_PROTOCOL_VERSION,
      },
      mqttBroker: {
        status: mqttConfigured ? 'configured' : 'disabled',
      },
    },
  }, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
