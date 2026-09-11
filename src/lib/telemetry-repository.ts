import 'server-only';

import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import path from 'path';
import type { LocationHistory } from '@/types';

function getTelemetryFilePath() {
  return process.env.IOT_TELEMETRY_FILE?.trim()
    || path.join(process.cwd(), '.runtime', 'iot-telemetry.jsonl');
}

export function loadPersistedTelemetry(): LocationHistory[] {
  const filePath = getTelemetryFilePath();
  if (!existsSync(filePath)) return [];

  try {
    return readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line) as LocationHistory)
      .filter((location) => (
        typeof location.id === 'string'
        && typeof location.petId === 'string'
        && Number.isFinite(location.latitude)
        && Number.isFinite(location.longitude)
      ));
  } catch (error) {
    console.error('Unable to load persisted IoT telemetry', error);
    return [];
  }
}

export function persistTelemetry(location: LocationHistory): boolean {
  const filePath = getTelemetryFilePath();

  try {
    mkdirSync(path.dirname(filePath), { recursive: true });
    appendFileSync(filePath, `${JSON.stringify(location)}\n`, 'utf8');
    return true;
  } catch (error) {
    console.error('Unable to persist IoT telemetry', error);
    return false;
  }
}

export function getTelemetryStorageStatus() {
  return {
    status: 'local_jsonl',
    persistent: true,
  } as const;
}
