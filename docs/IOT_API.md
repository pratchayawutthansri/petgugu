# Paws&Co. IoT API Contract v1.0

เอกสารนี้เป็นสัญญาระหว่าง Web API กับบอร์ด LILYGO T-SIM7080G-S3 ESP32-S3 สำหรับโหมดต้นแบบภาคสนาม

## สิ่งที่บอร์ดต้องมี

- `DEVICE_ID` เช่น `dev_lilygo_01`
- `DEVICE_KEY` ที่ตรงกับค่า server-side ใน `IOT_DEVICE_KEYS`
- `API_BASE_URL` ที่บอร์ดเข้าถึงได้จริง
- ส่ง `Content-Type: application/json`
- ส่ง `X-Device-Key: <DEVICE_KEY>` ทุก request ของอุปกรณ์

> บอร์ดที่ต่อผ่าน SIM7080G ไม่สามารถเรียก `localhost` ของคอมพิวเตอร์ได้ ต้องใช้ HTTPS URL ที่เปิดจากอินเทอร์เน็ตได้ หรือ IP ภายในวง LAN เมื่อทดสอบผ่าน Wi-Fi เดียวกัน

## Provisioning

ตั้งค่าที่ server เท่านั้น ห้ามนำตัวแปรนี้ไปฝั่ง browser:

```env
IOT_DEVICE_KEYS="dev_lilygo_01:long-random-key,dev_lilygo_02:another-long-random-key"
```

หนึ่งบอร์ดต้องใช้ key แยกกัน เมื่อ key รั่วให้เปลี่ยนเฉพาะบอร์ดนั้น

## 1. ส่งพิกัด GNSS

`POST /api/iot/location`

```json
{
  "deviceId": "dev_lilygo_01",
  "messageId": "dev_lilygo_01-boot7-10420",
  "sequence": 10420,
  "sentAt": "2026-09-10T10:20:30.000Z",
  "firmwareVersion": "1.0.0",
  "latitude": 13.73165,
  "longitude": 100.55935,
  "altitude": 8.2,
  "speed": 2.1,
  "heading": 95,
  "accuracy": 3.8,
  "satellites": 11,
  "hdop": 0.8,
  "batteryLevel": 82,
  "batteryVoltage": 4.02,
  "signalStrength": 73,
  "networkType": "LTE_CAT_M1",
  "gpsStatus": "FIX_3D"
}
```

ฟิลด์บังคับคือ `deviceId`, `latitude`, `longitude` ส่วน `messageId` ควรส่งทุกครั้งเพื่อให้ server ตรวจ request ซ้ำจากการ retry ได้

ช่วงค่าที่รับ:

- latitude `-90..90`, longitude `-180..180`
- batteryLevel `0..100`, batteryVoltage `0..6`
- signalStrength `0..100`
- speed `0..400 km/h`, heading `0..360`
- networkType: `NB_IOT`, `LTE_CAT_M1`, `WIFI`, `OFFLINE`
- gpsStatus: `FIX_3D`, `FIX_2D`, `SEARCHING`, `OFFLINE`

Response สำเร็จ:

```json
{
  "success": true,
  "data": {
    "accepted": true,
    "duplicate": false,
    "telemetryId": "loc_...",
    "pairedPetId": "pet_mochi_01",
    "serverTime": "2026-09-10T10:20:31.000Z",
    "protocolVersion": "1.0",
    "config": {
      "deviceId": "dev_lilygo_01",
      "pairedPetId": "pet_mochi_01",
      "updateIntervalSeconds": 10,
      "heartbeatIntervalSeconds": 60,
      "powerSaveMode": false,
      "sosActive": false,
      "safeZones": [
        {
          "id": "zone_mochi_park",
          "name": "สวนเบญจกิติ (Benjakitti Park)",
          "latitude": 13.7314,
          "longitude": 100.559,
          "radiusMeters": 450
        }
      ]
    }
  }
}
```

หาก response มี `duplicate: true` ให้ถือว่า server ได้รับ message เดิมแล้วและไม่ต้องส่งซ้ำอีก

## 2. Heartbeat เมื่อ GNSS ยังไม่มี Fix

`POST /api/iot/heartbeat`

ใช้ endpoint นี้เพื่อให้หน้าเว็บทราบว่าบอร์ดยังออนไลน์ แม้อยู่ในอาคารและยังส่งพิกัดไม่ได้

```json
{
  "deviceId": "dev_lilygo_01",
  "messageId": "dev_lilygo_01-heartbeat-210",
  "firmwareVersion": "1.0.0",
  "batteryLevel": 82,
  "batteryVoltage": 4.02,
  "signalStrength": 73,
  "networkType": "LTE_CAT_M1",
  "gpsStatus": "SEARCHING",
  "uptimeSeconds": 1260,
  "freeHeapBytes": 198240
}
```

Response จะคืน config ล่าสุดเหมือน endpoint พิกัด

## 3. อ่านค่าควบคุมจากเว็บ

`GET /api/iot/config?deviceId=dev_lilygo_01`

บอร์ดควรอ่าน config หลังเชื่อมต่อสำเร็จ และใช้ config ที่แนบกลับมากับ response ของ telemetry/heartbeat ทุกครั้ง

- `updateIntervalSeconds`: รอบส่งพิกัด
- `heartbeatIntervalSeconds`: รอบ heartbeat เมื่อไม่มีพิกัด
- `powerSaveMode`: เปิด/ปิดโหมดประหยัดพลังงาน
- `sosActive`: สถานะฉุกเฉินจากเจ้าของ
- `safeZones`: พื้นที่ปลอดภัยสำหรับตรวจ geofence บนบอร์ดเมื่อสัญญาณเครือข่ายขาดหาย

Response ของการส่งพิกัดจะมี `geofence.insideSafeZone`, รายการ `matchedZones` และ `transition` (`ENTERED_ZONE`/`LEFT_ZONE`) ที่ server คำนวณจากพิกัดจริง

## HTTP status ที่ firmware ต้องจัดการ

- `200`: สำเร็จ รวมกรณี message ซ้ำที่เคยบันทึกแล้ว
- `400`: JSON ไม่ถูกต้องหรือขาด deviceId
- `401`: key ไม่ถูกต้อง — หยุด retry ถี่และแจ้งสถานะ provisioning
- `403`: device ยังไม่ provision หรือ petId ไม่ตรงกับการจับคู่
- `404`: ไม่พบ deviceId ในระบบ
- `409`: device ยังไม่ได้จับคู่กับสัตว์เลี้ยง
- `422`: ค่าข้อมูลอยู่นอกช่วงที่อนุญาต
- `500`: server ขัดข้อง — ใช้ exponential backoff แล้วส่ง messageId เดิมซ้ำ

## Retry policy สำหรับเครือข่ายเซลลูลาร์

1. เก็บ payload ล่าสุดไว้ใน flash/queue ก่อนส่ง
2. ใช้ `messageId` เดิมทุกครั้งที่ retry payload เดิม
3. Retry หลัง 5, 15, 30, 60 วินาที แล้วคงที่สูงสุด 5 นาที
4. ลบ payload จาก queue เมื่อได้ HTTP 200 และ `accepted: true`
5. จำกัด queue เพื่อไม่ให้ flash เต็ม และส่งข้อมูลเก่าตามลำดับ

## ทดสอบ server ก่อนต่อบอร์ด

PowerShell:

```powershell
$env:IOT_DEVICE_KEY='paws-demo-device-key-change-me'
npm run test:iot
```

Smoke test ตรวจ health, authentication, heartbeat, validation, telemetry, duplicate retry, History และข้อมูลล่าสุดบน Dashboard

## ขอบเขตปัจจุบัน

- โหมด demo เก็บ Telemetry แบบ append-only ที่ `.runtime/iot-telemetry.jsonl` จึงอ่านคืนได้หลังรีสตาร์ต dev server
- production ต้องใช้ PostgreSQL/Prisma และ HTTPS endpoint ที่เข้าถึงจากเครือข่ายมือถือได้
- MQTT เป็น transport เสริมในอนาคต ปัจจุบัน firmware เชื่อม REST/JSON ได้โดยตรง
