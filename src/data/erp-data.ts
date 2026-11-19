export interface ErpDeviceRecord {
  id: string;
  serialNumber: string;
  boxCode: string;
  imei: string;
  macAddress: string;
  firmwareVersion: string;
  batchNumber: string;
  assemblyDate: string;
  status: 'ACTIVE' | 'IN_STOCK' | 'MAINTENANCE' | 'RESERVED';
  assignedPetId?: string;
  assignedPetName?: string;
  assignedOwnerName?: string;
  assignedOwnerPhone?: string;
  species?: 'DOG' | 'CAT';
  breed?: string;
  simCarrier: 'AIS NB-IoT' | 'True IoT' | 'DTAC Cat-M1';
  simIccid: string;
  simDataUsageMb: number;
  batteryHealthPercent: number;
  batteryCurrentLevel: number;
  totalKmTracked: number;
  totalHoursTracked: number;
  geofenceBreachCount: number;
  sosAlertCount: number;
  lastPingTimestamp: string;
  unitCostThb: number;
  warrantyExpiryDate: string;
  rmaNotes?: string;
}

export interface ErpIncidentAnalytics {
  id: string;
  timestamp: string;
  petName: string;
  petBreed: string;
  deviceSn: string;
  type: 'ZONE_EXIT' | 'SOS_TRIGGERED' | 'LOW_BATTERY' | 'SIGNAL_LOST';
  locationName: string;
  durationMinutes: number;
  resolved: boolean;
  recoveryMethod: 'AUTO_RETURN' | 'OWNER_LOCATED' | 'QR_TAG_FINDER';
}

export const ERP_SUMMARY_METRICS = {
  totalDevicesManufactured: 128,
  activeInField: 94,
  inStockWarehouse: 26,
  underMaintenanceRma: 8,
  totalTelemetryPings: 1_482_920,
  averageUptimePercent: 99.82,
  totalPetsProtected: 94,
  lostIncidentsThisMonth: 12,
  successfulRecoveries: 12,
  averageRecoveryTimeMinutes: 18.5,
  simFleetActive: 102,
  monthlySimDataTotalMb: 4_350,
  averageBOMCostThb: 1_450,
  fleetAverageBatteryPercent: 82.4,
};

export const ERP_DEVICE_RECORDS: ErpDeviceRecord[] = [
  {
    id: 'erp-dev-01',
    serialNumber: 'LILYGO-S3-7080-8842A',
    boxCode: 'PAWS-BOX-8842A',
    imei: '864720059128471',
    macAddress: 'C4:DE:E2:88:42:0A',
    firmwareVersion: 'v1.4.2-paws',
    batchNumber: 'LOT-2026-Q3-01',
    assemblyDate: '2026-08-15',
    status: 'ACTIVE',
    assignedPetId: 'pet-01',
    assignedPetName: 'โมจิ (Mochi)',
    assignedOwnerName: 'สมชาย ใจดี',
    assignedOwnerPhone: '081-234-5678',
    species: 'DOG',
    breed: 'โกลเด้น รีทรีฟเวอร์ (Golden Retriever)',
    simCarrier: 'AIS NB-IoT',
    simIccid: '896602112456789012',
    simDataUsageMb: 42.5,
    batteryHealthPercent: 98,
    batteryCurrentLevel: 88,
    totalKmTracked: 142.8,
    totalHoursTracked: 620,
    geofenceBreachCount: 4,
    sosAlertCount: 1,
    lastPingTimestamp: '2026-11-19T05:12:00Z',
    unitCostThb: 1450,
    warrantyExpiryDate: '2027-08-15',
  },
  {
    id: 'erp-dev-02',
    serialNumber: 'LILYGO-S3-7080-9921B',
    boxCode: 'PAWS-BOX-9921B',
    imei: '864720059128588',
    macAddress: 'C4:DE:E2:99:21:0B',
    firmwareVersion: 'v1.4.2-paws',
    batchNumber: 'LOT-2026-Q3-01',
    assemblyDate: '2026-08-15',
    status: 'ACTIVE',
    assignedPetId: 'pet-02',
    assignedPetName: 'ลัคกี้ (Lucky)',
    assignedOwnerName: 'สมชาย ใจดี',
    assignedOwnerPhone: '081-234-5678',
    species: 'DOG',
    breed: 'ชิบะ อินุ (Shiba Inu)',
    simCarrier: 'True IoT',
    simIccid: '896604112456789034',
    simDataUsageMb: 38.1,
    batteryHealthPercent: 96,
    batteryCurrentLevel: 94,
    totalKmTracked: 89.4,
    totalHoursTracked: 480,
    geofenceBreachCount: 2,
    sosAlertCount: 0,
    lastPingTimestamp: '2026-11-19T05:10:00Z',
    unitCostThb: 1450,
    warrantyExpiryDate: '2027-08-15',
  },
  {
    id: 'erp-dev-03',
    serialNumber: 'LILYGO-S3-7080-1044C',
    boxCode: 'PAWS-BOX-1044C',
    imei: '864720059128699',
    macAddress: 'C4:DE:E2:10:44:0C',
    firmwareVersion: 'v1.4.2-paws',
    batchNumber: 'LOT-2026-Q3-02',
    assemblyDate: '2026-09-02',
    status: 'ACTIVE',
    assignedPetId: 'pet-03',
    assignedPetName: 'บราวนี่ (Brownie)',
    assignedOwnerName: 'วิภาดา รักสัตว์',
    assignedOwnerPhone: '089-888-1122',
    species: 'DOG',
    breed: 'พุดเดิ้ลทอย (Toy Poodle)',
    simCarrier: 'AIS NB-IoT',
    simIccid: '896602112456789056',
    simDataUsageMb: 51.4,
    batteryHealthPercent: 94,
    batteryCurrentLevel: 62,
    totalKmTracked: 210.5,
    totalHoursTracked: 810,
    geofenceBreachCount: 7,
    sosAlertCount: 2,
    lastPingTimestamp: '2026-11-19T04:45:00Z',
    unitCostThb: 1450,
    warrantyExpiryDate: '2027-09-02',
  },
  {
    id: 'erp-dev-04',
    serialNumber: 'LILYGO-S3-7080-3312D',
    boxCode: 'PAWS-BOX-3312D',
    imei: '864720059128712',
    macAddress: 'C4:DE:E2:33:12:0D',
    firmwareVersion: 'v1.4.1-paws',
    batchNumber: 'LOT-2026-Q3-02',
    assemblyDate: '2026-09-02',
    status: 'MAINTENANCE',
    assignedPetId: 'pet-04',
    assignedPetName: 'คุกกี้ (Cookie)',
    assignedOwnerName: 'ธนพล สุขสันต์',
    assignedOwnerPhone: '086-444-5566',
    species: 'DOG',
    breed: 'บีเกิล (Beagle)',
    simCarrier: 'DTAC Cat-M1',
    simIccid: '896605112456789078',
    simDataUsageMb: 19.8,
    batteryHealthPercent: 74,
    batteryCurrentLevel: 18,
    totalKmTracked: 340.2,
    totalHoursTracked: 950,
    geofenceBreachCount: 11,
    sosAlertCount: 3,
    lastPingTimestamp: '2026-11-17T14:20:00Z',
    unitCostThb: 1450,
    warrantyExpiryDate: '2027-09-02',
    rmaNotes: 'ส่งเปลี่ยนเซลล์แบตเตอรี่ Li-Po และอัปเดต Firmware v1.4.2',
  },
  {
    id: 'erp-dev-05',
    serialNumber: 'LILYGO-S3-7080-5590E',
    boxCode: 'PAWS-BOX-5590E',
    imei: '864720059128823',
    macAddress: 'C4:DE:E2:55:90:0E',
    firmwareVersion: 'v1.4.2-paws',
    batchNumber: 'LOT-2026-Q4-01',
    assemblyDate: '2026-10-10',
    status: 'IN_STOCK',
    simCarrier: 'AIS NB-IoT',
    simIccid: '896602112456789101',
    simDataUsageMb: 0.8,
    batteryHealthPercent: 100,
    batteryCurrentLevel: 100,
    totalKmTracked: 0.5,
    totalHoursTracked: 4,
    geofenceBreachCount: 0,
    sosAlertCount: 0,
    lastPingTimestamp: '2026-11-18T09:00:00Z',
    unitCostThb: 1450,
    warrantyExpiryDate: '2027-10-10',
  },
  {
    id: 'erp-dev-06',
    serialNumber: 'LILYGO-S3-7080-7721F',
    boxCode: 'PAWS-BOX-7721F',
    imei: '864720059128945',
    macAddress: 'C4:DE:E2:77:21:0F',
    firmwareVersion: 'v1.4.2-paws',
    batchNumber: 'LOT-2026-Q4-01',
    assemblyDate: '2026-10-10',
    status: 'IN_STOCK',
    simCarrier: 'True IoT',
    simIccid: '896604112456789123',
    simDataUsageMb: 0.4,
    batteryHealthPercent: 100,
    batteryCurrentLevel: 98,
    totalKmTracked: 0.2,
    totalHoursTracked: 2,
    geofenceBreachCount: 0,
    sosAlertCount: 0,
    lastPingTimestamp: '2026-11-18T09:00:00Z',
    unitCostThb: 1450,
    warrantyExpiryDate: '2027-10-10',
  },
  {
    id: 'erp-dev-07',
    serialNumber: 'LILYGO-S3-7080-8809G',
    boxCode: 'PAWS-BOX-8809G',
    imei: '864720059129056',
    macAddress: 'C4:DE:E2:88:09:0G',
    firmwareVersion: 'v1.4.2-paws',
    batchNumber: 'LOT-2026-Q4-01',
    assemblyDate: '2026-10-10',
    status: 'RESERVED',
    assignedPetName: 'จัสติน (Justin)',
    assignedOwnerName: 'กิตติศักดิ์ พานิช',
    assignedOwnerPhone: '081-777-3344',
    simCarrier: 'AIS NB-IoT',
    simIccid: '896602112456789145',
    simDataUsageMb: 1.2,
    batteryHealthPercent: 100,
    batteryCurrentLevel: 95,
    totalKmTracked: 1.1,
    totalHoursTracked: 12,
    geofenceBreachCount: 0,
    sosAlertCount: 0,
    lastPingTimestamp: '2026-11-18T18:30:00Z',
    unitCostThb: 1450,
    warrantyExpiryDate: '2027-10-10',
  },
];

export const ERP_INCIDENT_RECORDS: ErpIncidentAnalytics[] = [
  {
    id: 'inc-01',
    timestamp: '2026-11-18T14:22:00Z',
    petName: 'โมจิ (Mochi)',
    petBreed: 'Golden Retriever',
    deviceSn: 'LILYGO-S3-7080-8842A',
    type: 'ZONE_EXIT',
    locationName: 'เขตบ้าน (สุขุมวิท 16)',
    durationMinutes: 18,
    resolved: true,
    recoveryMethod: 'OWNER_LOCATED',
  },
  {
    id: 'inc-02',
    timestamp: '2026-11-17T09:15:00Z',
    petName: 'บราวนี่ (Brownie)',
    petBreed: 'Toy Poodle',
    deviceSn: 'LILYGO-S3-7080-1044C',
    type: 'SOS_TRIGGERED',
    locationName: 'สวนเบญจกิติ',
    durationMinutes: 32,
    resolved: true,
    recoveryMethod: 'QR_TAG_FINDER',
  },
  {
    id: 'inc-03',
    timestamp: '2026-11-15T18:40:00Z',
    petName: 'คุกกี้ (Cookie)',
    petBreed: 'Beagle',
    deviceSn: 'LILYGO-S3-7080-3312D',
    type: 'ZONE_EXIT',
    locationName: 'หมู่บ้านพฤกษา 12',
    durationMinutes: 14,
    resolved: true,
    recoveryMethod: 'AUTO_RETURN',
  },
  {
    id: 'inc-04',
    timestamp: '2026-11-12T11:05:00Z',
    petName: 'ลัคกี้ (Lucky)',
    petBreed: 'Shiba Inu',
    deviceSn: 'LILYGO-S3-7080-9921B',
    type: 'LOW_BATTERY',
    locationName: 'บ้านพักอารีย์',
    durationMinutes: 45,
    resolved: true,
    recoveryMethod: 'OWNER_LOCATED',
  },
];

export const ERP_BILL_OF_MATERIALS = [
  { component: 'MCU Board: LILYGO ESP32-S3 (16MB Flash, 8MB PSRAM)', unitCostThb: 520, supplier: 'LilyGO Official' },
  { component: 'Cellular & GNSS Modem: SIMCom SIM7080G (Cat-M1/NB-IoT)', unitCostThb: 480, supplier: 'SIMCom Direct' },
  { component: 'Power Management: AXP2101 PMU + Fuel Gauge', unitCostThb: 85, supplier: 'X-Powers' },
  { component: 'Rechargeable Battery: Li-Po 3.7V 1,000 mAh (Protection Circuit)', unitCostThb: 140, supplier: 'EEMB Energy' },
  { component: 'Waterproof Enclosure: IP67 Custom Silicone Sealed Casing', unitCostThb: 110, supplier: '3D SLA / Injection' },
  { component: 'Accessories: Nylon Collar Belt, Stainless Ring, Metal Fasteners', unitCostThb: 75, supplier: 'Local Thai Textile' },
  { component: 'Smart Tag: Dual QR Laser-Etched Acrylic Collar Tag', unitCostThb: 40, supplier: 'Laser Tag Studio' },
];
