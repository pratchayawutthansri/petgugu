// ============================================================================
// Paws&Co. — Dedicated Backoffice ERP Dataset & Telemetry Store
// Supporting: Movement Tracking, Master Data, Issue Reporting, Usage Analytics
// ============================================================================

export type FleetMovementStatus = 'MOVING' | 'STATIONARY' | 'OUT_OF_ZONE' | 'SOS_ALERT' | 'OFFLINE';

export interface FleetCollarPosition {
  id: string;
  serialNumber: string;
  boxCode: string;
  imei: string;
  macAddress: string;
  firmwareVersion: string;
  status: FleetMovementStatus;
  
  // Pet & Owner info
  petId: string;
  petName: string;
  breed: string;
  species: 'DOG' | 'CAT';
  photoUrl: string;
  ownerName: string;
  ownerPhone: string;
  safeZoneName: string;

  // Real-time telemetry
  latitude: number;
  longitude: number;
  altitude: number;
  speedKmh: number;
  heading: number;
  accuracyMeters: number;
  satellites: number;
  hdop: number;
  batteryLevel: number;
  batteryVoltage: number;
  batteryHealthPercent: number;
  signalDbm: number;
  signalPercent: number;
  simCarrier: 'AIS NB-IoT' | 'True IoT' | 'DTAC Cat-M1';
  simIccid: string;
  simDataUsageMb: number;
  lastPingTime: string;

  // Daily usage stats
  todayKm: number;
  todayActiveHours: number;
  geofenceBreachCount: number;

  // Recent coordinate trail (breadcrumbs)
  trail: Array<{
    lat: number;
    lng: number;
    timestamp: string;
    speed: number;
  }>;
}

export type IssueCategory =
  | 'HARDWARE_FAULT'
  | 'CONNECTIVITY_ISSUE'
  | 'BATTERY_DEGRADATION'
  | 'LOST_PET_EMERGENCY'
  | 'CUSTOMER_INQUIRY'
  | 'FIRMWARE_OTA';

export type IssuePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_PARTS' | 'RESOLVED' | 'CLOSED';

export interface BackofficeIssueTicket {
  id: string;
  ticketCode: string;
  title: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  deviceSn: string;
  boxCode?: string;
  petName: string;
  ownerName: string;
  ownerPhone: string;
  assignedTechnician: string;
  reportedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  description: string;
  resolutionNotes?: string;
  replacedParts?: string[];
}

export interface DailyUsageStat {
  date: string;
  dayLabel: string;
  totalKm: number;
  activeHours: number;
  totalPings: number;
  geofenceBreaches: number;
  avgBatteryDrainPercent: number;
}

export interface RawTelemetryPing {
  id: string;
  timestamp: string;
  deviceSn: string;
  petName: string;
  messageId: string;
  packetType: 'LOCATION_TELEMETRY' | 'HEARTBEAT' | 'SOS_ALARM' | 'GEOFENCE_EVENT';
  latitude: number;
  longitude: number;
  speed: number;
  battery: number;
  voltage: number;
  satellites: number;
  csq: number;
  status: string;
}

// ----------------------------------------------------------------------------
// 1. Live Fleet Collar Positions (Movement & Tracking)
// ----------------------------------------------------------------------------
export const BACKOFFICE_FLEET_COLLARS: FleetCollarPosition[] = [
  {
    id: 'col-01',
    serialNumber: 'LILYGO-S3-7080-8842A',
    boxCode: 'PAWS-BOX-8842A',
    imei: '864720059128471',
    macAddress: 'C4:DE:E2:88:42:0A',
    firmwareVersion: 'v1.4.2-paws',
    status: 'MOVING',
    petId: 'pet-01',
    petName: 'โมจิ (Mochi)',
    breed: 'โกลเด้น รีทรีฟเวอร์',
    species: 'DOG',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
    ownerName: 'สมชาย ใจดี',
    ownerPhone: '081-234-5678',
    safeZoneName: 'บ้านสุขุมวิท 39',
    latitude: 13.7385,
    longitude: 100.5682,
    altitude: 14.5,
    speedKmh: 4.8,
    heading: 145,
    accuracyMeters: 2.8,
    satellites: 14,
    hdop: 0.7,
    batteryLevel: 88,
    batteryVoltage: 4.12,
    batteryHealthPercent: 98,
    signalDbm: -72,
    signalPercent: 92,
    simCarrier: 'AIS NB-IoT',
    simIccid: '896602112456789012',
    simDataUsageMb: 42.5,
    lastPingTime: 'เมื่อสักครู่ (12 วินาทีที่แล้ว)',
    todayKm: 5.4,
    todayActiveHours: 4.2,
    geofenceBreachCount: 0,
    trail: [
      { lat: 13.7465, lng: 100.5530, timestamp: '08:00', speed: 0.0 },
      { lat: 13.7445, lng: 100.5560, timestamp: '08:15', speed: 3.2 },
      { lat: 13.7410, lng: 100.5610, timestamp: '08:35', speed: 4.5 },
      { lat: 13.7390, lng: 100.5650, timestamp: '08:50', speed: 5.1 },
      { lat: 13.7385, lng: 100.5682, timestamp: '09:05', speed: 4.8 },
    ],
  },
  {
    id: 'col-02',
    serialNumber: 'LILYGO-S3-7080-9921B',
    boxCode: 'PAWS-BOX-9921B',
    imei: '864720059128588',
    macAddress: 'C4:DE:E2:99:21:0B',
    firmwareVersion: 'v1.4.2-paws',
    status: 'STATIONARY',
    petId: 'pet-02',
    petName: 'ลัคกี้ (Lucky)',
    breed: 'ชิบะ อินุ (Shiba Inu)',
    species: 'DOG',
    photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80',
    ownerName: 'พิมพาพร รัตนวงศ์',
    ownerPhone: '089-876-5432',
    safeZoneName: 'คอนโดทองหล่อ ซอย 10',
    latitude: 13.7312,
    longitude: 100.5815,
    altitude: 12.0,
    speedKmh: 0.0,
    heading: 0,
    accuracyMeters: 3.1,
    satellites: 12,
    hdop: 0.9,
    batteryLevel: 94,
    batteryVoltage: 4.18,
    batteryHealthPercent: 96,
    signalDbm: -68,
    signalPercent: 96,
    simCarrier: 'True IoT',
    simIccid: '896601442198765431',
    simDataUsageMb: 36.8,
    lastPingTime: '1 นาทีที่แล้ว',
    todayKm: 2.1,
    todayActiveHours: 2.0,
    geofenceBreachCount: 0,
    trail: [
      { lat: 13.7305, lng: 100.5800, timestamp: '07:30', speed: 1.2 },
      { lat: 13.7312, lng: 100.5815, timestamp: '08:00', speed: 0.0 },
    ],
  },
  {
    id: 'col-03',
    serialNumber: 'LILYGO-S3-7080-1044C',
    boxCode: 'PAWS-BOX-1044C',
    imei: '864720059128699',
    macAddress: 'C4:DE:E2:10:44:0C',
    firmwareVersion: 'v1.4.2-paws',
    status: 'OUT_OF_ZONE',
    petId: 'pet-03',
    petName: 'ไมโล (Milo)',
    breed: 'ไซบีเรียน ฮัสกี้',
    species: 'DOG',
    photoUrl: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=400&q=80',
    ownerName: 'กิตติศักดิ์ เจริญดี',
    ownerPhone: '082-345-6789',
    safeZoneName: 'บ้านเดี่ยวราชพฤกษ์',
    latitude: 13.7540,
    longitude: 100.4615,
    altitude: 10.2,
    speedKmh: 12.4,
    heading: 280,
    accuracyMeters: 2.5,
    satellites: 16,
    hdop: 0.6,
    batteryLevel: 72,
    batteryVoltage: 3.94,
    batteryHealthPercent: 91,
    signalDbm: -78,
    signalPercent: 86,
    simCarrier: 'AIS NB-IoT',
    simIccid: '896602112456789099',
    simDataUsageMb: 68.2,
    lastPingTime: '5 วินาทีที่แล้ว (SOS High-rate)',
    todayKm: 9.8,
    todayActiveHours: 5.6,
    geofenceBreachCount: 3,
    trail: [
      { lat: 13.7480, lng: 100.4720, timestamp: '09:00', speed: 8.5 },
      { lat: 13.7510, lng: 100.4670, timestamp: '09:10', speed: 11.2 },
      { lat: 13.7540, lng: 100.4615, timestamp: '09:18', speed: 12.4 },
    ],
  },
  {
    id: 'col-04',
    serialNumber: 'LILYGO-S3-7080-3312D',
    boxCode: 'PAWS-BOX-3312D',
    imei: '864720059128712',
    macAddress: 'C4:DE:E2:33:12:0D',
    firmwareVersion: 'v1.4.1-paws',
    status: 'SOS_ALERT',
    petId: 'pet-04',
    petName: 'บราวนี่ (Brownie)',
    breed: 'พุดเดิ้ล ทอย',
    species: 'DOG',
    photoUrl: 'https://images.unsplash.com/photo-1546975490-e8b92a270b58?auto=format&fit=crop&w=400&q=80',
    ownerName: 'อรทัย วงศ์สุวรรณ',
    ownerPhone: '085-111-2233',
    safeZoneName: 'สวนเบญจกิติ',
    latitude: 13.7290,
    longitude: 100.5585,
    altitude: 11.0,
    speedKmh: 3.6,
    heading: 90,
    accuracyMeters: 1.9,
    satellites: 15,
    hdop: 0.7,
    batteryLevel: 24,
    batteryVoltage: 3.62,
    batteryHealthPercent: 78,
    signalDbm: -82,
    signalPercent: 74,
    simCarrier: 'DTAC Cat-M1',
    simIccid: '896605118944123001',
    simDataUsageMb: 84.1,
    lastPingTime: '2 วินาทีที่แล้ว (SOS บอร์ดกระพริบ LED)',
    todayKm: 6.2,
    todayActiveHours: 4.8,
    geofenceBreachCount: 2,
    trail: [
      { lat: 13.7270, lng: 100.5550, timestamp: '09:30', speed: 4.1 },
      { lat: 13.7290, lng: 100.5585, timestamp: '09:40', speed: 3.6 },
    ],
  },
  {
    id: 'col-05',
    serialNumber: 'LILYGO-S3-7080-5590E',
    boxCode: 'PAWS-BOX-5590E',
    imei: '864720059128855',
    macAddress: 'C4:DE:E2:55:90:0E',
    firmwareVersion: 'v1.4.2-paws',
    status: 'STATIONARY',
    petId: 'pet-05',
    petName: 'คุกกี้ (Cookie)',
    breed: 'บีเกิ้ล (Beagle)',
    species: 'DOG',
    photoUrl: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=400&q=80',
    ownerName: 'ปิยะ บุญมี',
    ownerPhone: '086-444-9988',
    safeZoneName: 'บ้านพักอารีย์ ซอย 4',
    latitude: 13.7795,
    longitude: 100.5435,
    altitude: 15.0,
    speedKmh: 0.0,
    heading: 0,
    accuracyMeters: 3.4,
    satellites: 11,
    hdop: 1.1,
    batteryLevel: 91,
    batteryVoltage: 4.15,
    batteryHealthPercent: 94,
    signalDbm: -70,
    signalPercent: 94,
    simCarrier: 'True IoT',
    simIccid: '896601442198765499',
    simDataUsageMb: 29.5,
    lastPingTime: '3 นาทีที่แล้ว (โหมดประหยัดพลังงาน)',
    todayKm: 1.8,
    todayActiveHours: 1.5,
    geofenceBreachCount: 0,
    trail: [
      { lat: 13.7795, lng: 100.5435, timestamp: '07:00', speed: 0.0 },
    ],
  },
  {
    id: 'col-06',
    serialNumber: 'LILYGO-S3-7080-7721F',
    boxCode: 'PAWS-BOX-7721F',
    imei: '864720059128933',
    macAddress: 'C4:DE:E2:77:21:0F',
    firmwareVersion: 'v1.4.0-paws',
    status: 'OFFLINE',
    petId: 'pet-06',
    petName: 'เบลล่า (Bella)',
    breed: 'คอร์กี้ (Corgi)',
    species: 'DOG',
    photoUrl: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=400&q=80',
    ownerName: 'ชัชวาลย์ สิริโชค',
    ownerPhone: '083-999-0011',
    safeZoneName: 'บ้านพระราม 9',
    latitude: 13.7505,
    longitude: 100.5920,
    altitude: 13.5,
    speedKmh: 0.0,
    heading: 0,
    accuracyMeters: 6.8,
    satellites: 0,
    hdop: 2.4,
    batteryLevel: 0,
    batteryVoltage: 3.10,
    batteryHealthPercent: 62,
    signalDbm: -110,
    signalPercent: 0,
    simCarrier: 'AIS NB-IoT',
    simIccid: '896602112456789123',
    simDataUsageMb: 12.0,
    lastPingTime: '18 ชั่วโมงที่แล้ว (แบตเตอรี่หมด)',
    todayKm: 0.0,
    todayActiveHours: 0.0,
    geofenceBreachCount: 1,
    trail: [],
  },
];

// ----------------------------------------------------------------------------
// 2. Issue Reporting & Maintenance Tickets (การแจ้งปัญหา & RMA)
// ----------------------------------------------------------------------------
export const BACKOFFICE_ISSUES: BackofficeIssueTicket[] = [
  {
    id: 'tkt-01',
    ticketCode: 'TKT-2026-1082',
    title: 'สัญญาณ NB-IoT ขาดหายเกิน 18 ชั่วโมง และแบตเตอรี่ดรอปเร็ว',
    category: 'BATTERY_DEGRADATION',
    priority: 'HIGH',
    status: 'OPEN',
    deviceSn: 'LILYGO-S3-7080-7721F',
    boxCode: 'PAWS-BOX-7721F',
    petName: 'เบลล่า (Bella)',
    ownerName: 'ชัชวาลย์ สิริโชค',
    ownerPhone: '083-999-0011',
    assignedTechnician: 'วิศวกร ธนพล (Hardware Lead)',
    reportedAt: '2026-11-19T02:15:00Z',
    updatedAt: '2026-11-19T03:30:00Z',
    description: 'ระบบ Telemetry Watchdog ตรวจพบบอร์ดไม่ส่ง Heartbeat มาเกิน 18 ชม. ล่าสุดรายงานแรงดันตกฮวบเหลือ 3.10V คาดว่าแบตเตอรี่ Li-Po เสื่อมสภาพ (สุขภาพ 62%) หรือวงจร PMU รั่วไหล',
    resolutionNotes: 'เตรียมจัดส่งปลอกคอสำรองฉุกเฉินให้เจ้าของ และรับเครื่องเดิมกลับมาตรวจวัดกระแสสแตนด์บาย',
    replacedParts: ['Li-Po 1,000mAh Battery', 'AXP2101 PMU IC'],
  },
  {
    id: 'tkt-02',
    ticketCode: 'TKT-2026-1079',
    title: 'สุนัขหลุดออกนอก Safe Zone พร้อมส่งสัญญาณ SOS ฉุกเฉิน',
    category: 'LOST_PET_EMERGENCY',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    deviceSn: 'LILYGO-S3-7080-3312D',
    boxCode: 'PAWS-BOX-3312D',
    petName: 'บราวนี่ (Brownie)',
    ownerName: 'อรทัย วงศ์สุวรรณ',
    ownerPhone: '085-111-2233',
    assignedTechnician: 'ศูนย์ประสานงานช่วยเหลือ (Safety Ops)',
    reportedAt: '2026-11-19T04:20:00Z',
    updatedAt: '2026-11-19T05:10:00Z',
    description: 'สุนัขหลุดออกจากรัศมีสวนเบญจกิติ บอร์ดเร่งความถี่ส่งพิกัด A-GPS ทุก 2 วินาที แบตเตอรี่เหลือ 24% พลเมืองดีกำลังช่วยสแกน QR บนจี้ห้อยคอ',
    resolutionNotes: 'เจ้าของกำลังเข้าถึงจุดพิกัดล่าสุด 13.7290, 100.5585 ปลอกคอกระพริบไฟ LED สีแดงช่วยการมองเห็น',
  },
  {
    id: 'tkt-03',
    ticketCode: 'TKT-2026-1065',
    title: 'ตัวเรือนเคสกันน้ำ IP67 สลักฝาหลังหลวมจากแรงกระแทก',
    category: 'HARDWARE_FAULT',
    priority: 'MEDIUM',
    status: 'WAITING_PARTS',
    deviceSn: 'LILYGO-S3-7080-1044C',
    boxCode: 'PAWS-BOX-1044C',
    petName: 'ไมโล (Milo)',
    ownerName: 'กิตติศักดิ์ เจริญดี',
    ownerPhone: '082-345-6789',
    assignedTechnician: 'ช่าง สุรชัย (Enclosure & 3D Specialist)',
    reportedAt: '2026-11-18T10:00:00Z',
    updatedAt: '2026-11-18T16:45:00Z',
    description: 'สุนัขชอบวิ่งชนพุ่มไม้ ฝาหลังกล่องปลอกคอมีรอยแยกเล็กน้อย เสี่ยงต่อความชื้นหากลุยน้ำลึก',
    resolutionNotes: 'สั่งเบิกชิ้นส่วน Enclosure Polycarbonate เสริมยางซิลิโคนซีลสองชั้น เตรียมประกอบเปลี่ยนใหม่',
    replacedParts: ['IP67 Waterproof Shell v2', 'Silicone Collar Strap Band'],
  },
  {
    id: 'tkt-04',
    ticketCode: 'TKT-2026-1042',
    title: 'ซิมการ์ด True IoT ค้างสถานะ CREG ไม่ได้รับ IP ภายใน 60 วินาที',
    category: 'CONNECTIVITY_ISSUE',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    deviceSn: 'LILYGO-S3-7080-9921B',
    boxCode: 'PAWS-BOX-9921B',
    petName: 'ลัคกี้ (Lucky)',
    ownerName: 'พิมพาพร รัตนวงศ์',
    ownerPhone: '089-876-5432',
    assignedTechnician: 'วิศวกร ภาณุพงศ์ (Network Engineer)',
    reportedAt: '2026-11-17T08:10:00Z',
    updatedAt: '2026-11-17T11:20:00Z',
    resolvedAt: '2026-11-17T11:20:00Z',
    description: 'บอร์ดส่ง AT+CGREG แจ้งเตือนปฏิเสธการแนบแพ็กเกจดาต้าชั่วคราว',
    resolutionNotes: 'ส่งคำสั่งรีเซ็ต APN ผ่าน OTA และอัปเดตเป็น iot.truemoveh.com โมเด็มเชื่อมต่อสมบูรณ์',
  },
  {
    id: 'tkt-05',
    ticketCode: 'TKT-2026-1020',
    title: 'ลูกค้าต้องการรีเซ็ตเพื่อย้ายปลอกคอไปให้สุนัขตัวใหม่ในบ้าน',
    category: 'CUSTOMER_INQUIRY',
    priority: 'LOW',
    status: 'CLOSED',
    deviceSn: 'LILYGO-S3-7080-8842A',
    boxCode: 'PAWS-BOX-8842A',
    petName: 'โมจิ (Mochi)',
    ownerName: 'สมชาย ใจดี',
    ownerPhone: '081-234-5678',
    assignedTechnician: 'เจ้าหน้าที่ กุลธิดา (Customer Support)',
    reportedAt: '2026-11-15T09:00:00Z',
    updatedAt: '2026-11-15T09:40:00Z',
    resolvedAt: '2026-11-15T09:40:00Z',
    description: 'สอบถามวิธีย้ายอุปกรณ์และสร้างรหัส QR ดิจิทัลอันใหม่',
    resolutionNotes: 'แนะนำการใช้ปุ่มสแกน QR ข้างกล่องในแอป และยกเลิก Device Binding เดิมสำเร็จ',
  },
];

// ----------------------------------------------------------------------------
// 3. Usage & Telemetry Analytics Data (สถิติการใช้งานฝูงปลอกคอ)
// ----------------------------------------------------------------------------
export const BACKOFFICE_DAILY_USAGE: DailyUsageStat[] = [
  { date: '2026-11-13', dayLabel: 'พฤ.', totalKm: 382.4, activeHours: 412.0, totalPings: 215400, geofenceBreaches: 4, avgBatteryDrainPercent: 14.2 },
  { date: '2026-11-14', dayLabel: 'ศ.', totalKm: 410.8, activeHours: 435.5, totalPings: 228900, geofenceBreaches: 6, avgBatteryDrainPercent: 15.1 },
  { date: '2026-11-15', dayLabel: 'ส.', totalKm: 540.2, activeHours: 580.0, totalPings: 289100, geofenceBreaches: 11, avgBatteryDrainPercent: 19.8 },
  { date: '2026-11-16', dayLabel: 'อา.', totalKm: 585.6, activeHours: 620.4, totalPings: 304500, geofenceBreaches: 14, avgBatteryDrainPercent: 21.4 },
  { date: '2026-11-17', dayLabel: 'จ.', totalKm: 360.1, activeHours: 390.2, totalPings: 198200, geofenceBreaches: 3, avgBatteryDrainPercent: 13.5 },
  { date: '2026-11-18', dayLabel: 'อ.', totalKm: 395.7, activeHours: 415.8, totalPings: 212000, geofenceBreaches: 5, avgBatteryDrainPercent: 14.0 },
  { date: '2026-11-19', dayLabel: 'พ.', totalKm: 422.3, activeHours: 440.1, totalPings: 234820, geofenceBreaches: 7, avgBatteryDrainPercent: 15.6 },
];

export const BACKOFFICE_CARRIER_USAGE = [
  {
    carrier: 'AIS NB-IoT',
    simCount: 62,
    activePercent: 98.4,
    monthlyTotalMb: 2480,
    costPerSimThb: 35,
    coverageRating: 'ครอบคลุมทั่วประเทศ (99.1%)',
    recommendedUse: 'โหมดปกติประหยัดพลังงาน (Power Saving Telemetry)',
  },
  {
    carrier: 'True IoT (LTE Cat-M1 / NB-IoT)',
    simCount: 28,
    activePercent: 96.4,
    monthlyTotalMb: 1240,
    costPerSimThb: 35,
    coverageRating: 'เขตเมืองและปริมณฑล (97.8%)',
    recommendedUse: 'ติดตามทั่วไปและ Safe Zone แจ้งเตือนฉุกเฉิน',
  },
  {
    carrier: 'DTAC Cat-M1 High Speed',
    simCount: 12,
    activePercent: 100.0,
    monthlyTotalMb: 630,
    costPerSimThb: 49,
    coverageRating: 'สัญญาณแรง เสถียรสูง (96.5%)',
    recommendedUse: 'โหมดติดตามความเร็วสูง (SOS Ultra Fast Ping)',
  },
];

export const BACKOFFICE_BATTERY_DISTRIBUTION = [
  { bracket: '90 - 100% (ยอดเยี่ยม)', count: 68, color: '#10B981', note: 'อายุใช้งานปกติ ชาร์จครั้งละ 3-5 วัน' },
  { bracket: '80 - 89% (ดี)', count: 34, color: '#3B82F6', note: 'ประสิทธิภาพสมบูรณ์ ไม่มีความร้อนสะสม' },
  { bracket: '70 - 79% (ปานกลาง)', count: 18, color: '#F59E0B', note: 'เริ่มสังเกตอัตราการคายประจุ' },
  { bracket: '< 70% (ต้องเปลี่ยน/RMA)', count: 8, color: '#EF4444', note: 'แจ้งเตือนเจ้าหน้าที่ส่งแบตเตอรี่สำรอง' },
];

// ----------------------------------------------------------------------------
// 4. Live Incoming Raw Telemetry Stream (Log Explorer)
// ----------------------------------------------------------------------------
export const BACKOFFICE_RAW_TELEMETRY_LOGS: RawTelemetryPing[] = [
  {
    id: 'ping-901',
    timestamp: '12:30:12',
    deviceSn: 'LILYGO-S3-7080-8842A',
    petName: 'โมจิ (Mochi)',
    messageId: '8842A-seq-4921',
    packetType: 'LOCATION_TELEMETRY',
    latitude: 13.7385,
    longitude: 100.5682,
    speed: 4.8,
    battery: 88,
    voltage: 4.12,
    satellites: 14,
    csq: 28,
    status: 'HTTP 200 OK — In Safe Zone',
  },
  {
    id: 'ping-900',
    timestamp: '12:30:05',
    deviceSn: 'LILYGO-S3-7080-3312D',
    petName: 'บราวนี่ (Brownie)',
    messageId: '3312D-seq-8120',
    packetType: 'SOS_ALARM',
    latitude: 13.7290,
    longitude: 100.5585,
    speed: 3.6,
    battery: 24,
    voltage: 3.62,
    satellites: 15,
    csq: 22,
    status: 'ALERT: ZONE_EXIT & SOS BROADCAST',
  },
  {
    id: 'ping-899',
    timestamp: '12:29:48',
    deviceSn: 'LILYGO-S3-7080-1044C',
    petName: 'ไมโล (Milo)',
    messageId: '1044C-seq-2104',
    packetType: 'LOCATION_TELEMETRY',
    latitude: 13.7540,
    longitude: 100.4615,
    speed: 12.4,
    battery: 72,
    voltage: 3.94,
    satellites: 16,
    csq: 26,
    status: 'HTTP 200 OK — High Speed Track',
  },
  {
    id: 'ping-898',
    timestamp: '12:28:30',
    deviceSn: 'LILYGO-S3-7080-9921B',
    petName: 'ลัคกี้ (Lucky)',
    messageId: '9921B-seq-6612',
    packetType: 'HEARTBEAT',
    latitude: 13.7312,
    longitude: 100.5815,
    speed: 0.0,
    battery: 94,
    voltage: 4.18,
    satellites: 12,
    csq: 29,
    status: 'HTTP 200 OK — Power Save Sleep',
  },
  {
    id: 'ping-897',
    timestamp: '12:25:10',
    deviceSn: 'LILYGO-S3-7080-5590E',
    petName: 'คุกกี้ (Cookie)',
    messageId: '5590E-seq-1194',
    packetType: 'HEARTBEAT',
    latitude: 13.7795,
    longitude: 100.5435,
    speed: 0.0,
    battery: 91,
    voltage: 4.15,
    satellites: 11,
    csq: 27,
    status: 'HTTP 200 OK — Standby Heartbeat',
  },
];
