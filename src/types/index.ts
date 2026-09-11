// ==========================================
// Paws&Co. — Core TypeScript Types & Interfaces
// ==========================================

export type Role = 'USER' | 'ADMIN';
export type Gender = 'MALE' | 'FEMALE' | 'UNKNOWN';
export type PetSpecies = 'DOG' | 'CAT' | 'OTHER';
export type NetworkType = 'NB_IOT' | 'LTE_CAT_M1' | 'WIFI' | 'OFFLINE';
export type GpsStatus = 'FIX_3D' | 'FIX_2D' | 'SEARCHING' | 'OFFLINE';

export type AlertType = 
  | 'ZONE_EXIT' 
  | 'ZONE_ENTER' 
  | 'LOW_BATTERY' 
  | 'DEVICE_OFFLINE' 
  | 'DEVICE_ONLINE'
  | 'SOS' 
  | 'SYSTEM';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export type LocationEventType = 
  | 'MOVING' 
  | 'STOPPED' 
  | 'ENTERED_ZONE' 
  | 'LEFT_ZONE' 
  | 'AT_REST' 
  | 'LOW_BATTERY' 
  | 'SOS_TRIGGERED';

export type Language = 'th' | 'en';

// --- User Entity ---
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  avatarUrl?: string;
  phoneNumber?: string;
  preferredLanguage: Language;
  emailNotifications: boolean;
  smsNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Pet Photo Entity ---
export interface PetPhoto {
  id: string;
  petId: string;
  url: string;
  isPrimary: boolean;
  caption?: string;
  createdAt: string;
}

// --- Device Entity (LILYGO T-SIM7080G-S3 ESP32-S3 IoT Tracker) ---
export interface Device {
  id: string;
  serialNumber: string;
  model: string; // e.g. "LILYGO T-SIM7080G-S3"
  imei?: string;
  macAddress: string;
  firmwareVersion: string;
  batteryLevel: number; // 0 - 100%
  batteryVoltage?: number; // e.g. 3.7V - 4.2V
  signalStrength: number; // 0 - 100% (or CSQ 0-31)
  isOnline: boolean;
  lastSeenAt: string;
  networkType: NetworkType;
  gpsStatus: GpsStatus;
  updateIntervalSeconds: number; // 10s out of zone, 300s in zone
  powerSaveMode: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Safe Zone Entity ---
export interface SafeZone {
  id: string;
  petId: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters (e.g. 100, 300, 500)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Location History Entity ---
export interface LocationHistory {
  id: string;
  petId: string;
  deviceId?: string;
  messageId?: string;
  sequence?: number;
  latitude: number;
  longitude: number;
  altitude?: number; // meters
  speed?: number; // km/h
  heading?: number; // 0 - 360 degrees
  accuracy?: number; // meters
  satellites?: number;
  hdop?: number;
  batteryVoltage?: number;
  batteryLevel: number;
  signalStrength?: number;
  eventType: LocationEventType;
  note?: string;
  timestamp: string;
  receivedAt?: string;
}

// --- Vaccination Entity ---
export interface Vaccination {
  id: string;
  petId: string;
  vaccineName: string;
  administeredDate: string;
  nextDueDate?: string;
  veterinarian?: string;
  clinicName?: string;
  batchNumber?: string;
  notes?: string;
}

// --- Public Pet Profile (QR code scan landing view) ---
export interface PublicPetProfile {
  id: string;
  petId: string;
  qrCodeId: string;
  displayName: string;
  species: PetSpecies;
  breed: string;
  photoUrl: string;
  secondaryPhotos?: string[];
  contactPhone: string;
  contactEmail?: string;
  allowDirectCall: boolean;
  allowFoundReport: boolean;
  specialNeeds?: string;
  rewardNote?: string;
  customMessage?: string;
  isLost: boolean;
}

// --- Found Pet Report ---
export interface FoundPetReport {
  id: string;
  petId: string;
  qrCodeId: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail?: string;
  locationDescription: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  message?: string;
  reportedAt: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';
}

// --- Alert Entity ---
export interface Alert {
  id: string;
  userId: string;
  petId: string;
  petName: string;
  petAvatarUrl?: string;
  type: AlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  isRead: boolean;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// --- Pet Entity (Aggregated / Full Model) ---
export interface Pet {
  id: string;
  userId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  age: number; // in years
  gender: Gender;
  weight: number; // in kg
  healthNotes?: string;
  primaryPhotoUrl: string;
  photos: PetPhoto[];
  batterySaver: boolean;
  proAlerts: boolean;
  deviceId?: string;
  device?: Device;
  qrCodeId: string;
  safeZones: SafeZone[];
  vaccinations: Vaccination[];
  latestLocation?: LocationHistory;
  publicProfile?: PublicPetProfile;
  isLost: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Navigation Item ---
export interface NavItem {
  name: string;
  nameTh: string;
  href: string;
  iconName: string;
  badge?: number | string;
  adminOnly?: boolean;
}

// --- API Response Standard ---
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// --- Dashboard Summary Stats ---
export interface DashboardStats {
  totalPets: number;
  onlinePets: number;
  offlinePets: number;
  safePets: number;
  outOfZonePets: number;
  activeAlertsCount: number;
}

// --- Location Route Analytics / Statistics ---
export interface RouteStatistics {
  petId: string;
  startDate: string;
  endDate: string;
  totalDistanceKm: number;
  durationMinutes: number;
  averageSpeedKmh: number;
  maxSpeedKmh: number;
  batteryConsumedPercent: number;
  pointCount: number;
}
