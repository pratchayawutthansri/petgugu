import assert from 'node:assert/strict';

const baseUrl = (process.env.IOT_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const deviceId = process.env.IOT_DEVICE_ID || 'dev_lilygo_01';
const deviceKey = process.env.IOT_DEVICE_KEY;

if (!deviceKey) {
  throw new Error('Set IOT_DEVICE_KEY before running the IoT smoke test');
}

const headers = {
  'Content-Type': 'application/json',
  'X-Device-Key': deviceKey,
};

async function readJson(response) {
  const body = await response.json();
  return { response, body };
}

const health = await readJson(await fetch(`${baseUrl}/api/health`));
assert.equal(health.response.status, 200);
assert.equal(health.body.services.iotIngest.status, 'ready');

const unauthorized = await fetch(`${baseUrl}/api/iot/config?deviceId=${deviceId}`);
assert.equal(unauthorized.status, 401);

const config = await readJson(await fetch(
  `${baseUrl}/api/iot/config?deviceId=${deviceId}`,
  { headers: { 'X-Device-Key': deviceKey } }
));
assert.equal(config.response.status, 200);
assert.equal(config.body.success, true);
assert.equal(config.body.data.config.deviceId, deviceId);
assert.equal(Array.isArray(config.body.data.config.safeZones), true);
assert.equal(config.body.data.config.safeZones.length > 0, true);

const heartbeat = await readJson(await fetch(`${baseUrl}/api/iot/heartbeat`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    deviceId,
    messageId: `smoke-heartbeat-${Date.now()}`,
    firmwareVersion: 'smoke-test',
    batteryLevel: 84,
    batteryVoltage: 4.04,
    signalStrength: 76,
    networkType: 'LTE_CAT_M1',
    gpsStatus: 'SEARCHING',
    uptimeSeconds: 120,
  }),
}));
assert.equal(heartbeat.response.status, 200);
assert.equal(heartbeat.body.data.acknowledged, true);

const invalidTelemetry = await fetch(`${baseUrl}/api/iot/location`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ deviceId, latitude: 999, longitude: 100.56 }),
});
assert.equal(invalidTelemetry.status, 422);

const messageId = `smoke-location-${Date.now()}`;
const telemetryPayload = {
  deviceId,
  messageId,
  sequence: Date.now(),
  latitude: 13.73165,
  longitude: 100.55935,
  accuracy: 3.8,
  speed: 2.1,
  heading: 95,
  batteryLevel: 82,
  batteryVoltage: 4.02,
  signalStrength: 73,
  satellites: 11,
  hdop: 0.8,
  networkType: 'LTE_CAT_M1',
  gpsStatus: 'FIX_3D',
};

const firstTelemetry = await readJson(await fetch(`${baseUrl}/api/iot/location`, {
  method: 'POST',
  headers,
  body: JSON.stringify(telemetryPayload),
}));
assert.equal(firstTelemetry.response.status, 200);
assert.equal(firstTelemetry.body.data.duplicate, false);
assert.equal(firstTelemetry.body.data.geofence.insideSafeZone, true);

const duplicateTelemetry = await readJson(await fetch(`${baseUrl}/api/iot/location`, {
  method: 'POST',
  headers,
  body: JSON.stringify(telemetryPayload),
}));
assert.equal(duplicateTelemetry.response.status, 200);
assert.equal(duplicateTelemetry.body.data.duplicate, true);

const history = await readJson(await fetch(`${baseUrl}/api/pets/pet_mochi_01/history`));
assert.equal(history.response.status, 200);
assert.equal(history.body.data.some((location) => location.messageId === messageId), true);

const pets = await readJson(await fetch(`${baseUrl}/api/pets`));
const pairedPet = pets.body.data.find((pet) => pet.deviceId === deviceId);
assert.equal(pairedPet.latestLocation.messageId, messageId);
assert.equal(pairedPet.device.isOnline, true);

console.log('IoT smoke test passed');
console.log(JSON.stringify({
  baseUrl,
  deviceId,
  telemetryId: firstTelemetry.body.data.telemetryId,
  updateIntervalSeconds: firstTelemetry.body.data.config.updateIntervalSeconds,
}, null, 2));
