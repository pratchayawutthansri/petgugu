import 'server-only';

import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'fs';
import path from 'path';
import type { Device, FoundPetReport, LocationHistory, Pet, SafeZone, User, Vaccination } from '@/types';

export interface PersistedAppState {
  version: number;
  updatedAt: string;
  pets: Pet[];
  users: User[];
  devices: Device[];
  safeZones: SafeZone[];
  vaccinations: Vaccination[];
  foundReports: FoundPetReport[];
}

function getTelemetryFilePath() {
  return process.env.IOT_TELEMETRY_FILE?.trim()
    || path.join(process.cwd(), '.runtime', 'iot-telemetry.jsonl');
}

function getAppStateFilePath() {
  return process.env.PAWS_STATE_FILE?.trim()
    || path.join(process.cwd(), '.runtime', 'demo-state.json');
}

export function loadPersistedAppState(): PersistedAppState | null {
  const filePath = getAppStateFilePath();
  if (!existsSync(filePath)) return null;

  try {
    const raw = readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as PersistedAppState;
    if (!parsed || !Array.isArray(parsed.pets) || !Array.isArray(parsed.users)) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('Unable to load persisted app state (falling back to demo seed)', error);
    return null;
  }
}

export function persistAppState(state: Omit<PersistedAppState, 'version' | 'updatedAt'>): boolean {
  const filePath = getAppStateFilePath();
  const tempPath = `${filePath}.tmp`;

  try {
    mkdirSync(path.dirname(filePath), { recursive: true });
    const payload: PersistedAppState = {
      version: 1,
      updatedAt: new Date().toISOString(),
      ...state,
    };
    writeFileSync(tempPath, JSON.stringify(payload), 'utf8');
    renameSync(tempPath, filePath);
    return true;
  } catch (error) {
    console.error('Unable to persist app state', error);
    return false;
  }
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
