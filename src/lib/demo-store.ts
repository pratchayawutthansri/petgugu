import { Pet, User, Device, SafeZone, LocationHistory, Alert, Vaccination, FoundPetReport, PublicPetProfile } from '@/types';
import { DEMO_PETS } from '@/data/demo-pets';
import { DEMO_USERS } from '@/data/demo-users';
import { DEMO_DEVICES } from '@/data/demo-devices';
import { DEMO_SAFE_ZONES } from '@/data/demo-zones';
import { DEMO_ALL_LOCATIONS } from '@/data/demo-locations';
import { DEMO_ALERTS } from '@/data/demo-alerts';
import { DEMO_VACCINATIONS } from '@/data/demo-vaccinations';
import { loadPersistedTelemetry, persistTelemetry } from '@/lib/telemetry-repository';

// Global singleton in-memory database store for Demo Mode
class DemoStore {
  private pets: Pet[] = [];
  private users: User[] = [];
  private devices: Device[] = [];
  private safeZones: SafeZone[] = [];
  private locations: LocationHistory[] = [];
  private alerts: Alert[] = [];
  private vaccinations: Vaccination[] = [];
  private foundReports: FoundPetReport[] = [];

  constructor() {
    this.reset();
  }

  public reset() {
    this.pets = JSON.parse(JSON.stringify(DEMO_PETS));
    this.users = JSON.parse(JSON.stringify(DEMO_USERS));
    this.devices = JSON.parse(JSON.stringify(DEMO_DEVICES));
    this.safeZones = JSON.parse(JSON.stringify(DEMO_SAFE_ZONES));
    const demoLocations: LocationHistory[] = JSON.parse(JSON.stringify(DEMO_ALL_LOCATIONS));
    const persistedLocations = loadPersistedTelemetry();
    const knownIds = new Set(demoLocations.map((location) => location.id));
    this.locations = [
      ...demoLocations,
      ...persistedLocations.filter((location) => !knownIds.has(location.id)),
    ];
    this.alerts = JSON.parse(JSON.stringify(DEMO_ALERTS));
    this.vaccinations = JSON.parse(JSON.stringify(DEMO_VACCINATIONS));
    this.foundReports = [];

    for (const pet of this.pets) {
      const latest = this.locations
        .filter((location) => location.petId === pet.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      if (!latest || !latest.deviceId) continue;
      pet.latestLocation = latest;

      const device = this.devices.find((candidate) => candidate.id === latest.deviceId);
      if (device) {
        device.batteryLevel = latest.batteryLevel;
        device.batteryVoltage = latest.batteryVoltage ?? device.batteryVoltage;
        device.signalStrength = latest.signalStrength ?? device.signalStrength;
        device.lastSeenAt = latest.receivedAt || latest.timestamp;
        device.isOnline = true;
        pet.device = device;
      }
    }
  }

  // --- Users ---
  public getUsers(): User[] {
    return [...this.users];
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = {
      ...this.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.users[idx];
  }

  // --- Pets ---
  public getPets(userId?: string): Pet[] {
    if (userId) {
      return this.pets.filter((p) => p.userId === userId);
    }
    return [...this.pets];
  }

  public getPetById(id: string): Pet | undefined {
    return this.pets.find((p) => p.id === id);
  }

  public getPetByQrId(qrId: string): Pet | undefined {
    return this.pets.find((p) => p.qrCodeId.toLowerCase() === qrId.toLowerCase());
  }

  public createPet(petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'qrCodeId' | 'photos' | 'safeZones' | 'vaccinations'> & { photoUrls: string[] }): Pet {
    const id = `pet_${Date.now()}`;
    const qrCodeId = `QR-${petData.name.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const photos = petData.photoUrls.map((url, i) => ({
      id: `photo_${id}_${i}`,
      petId: id,
      url,
      isPrimary: i === 0 || url === petData.primaryPhotoUrl,
      caption: `${petData.name} - Photo ${i + 1}`,
      createdAt: new Date().toISOString(),
    }));

    const newPet: Pet = {
      ...petData,
      id,
      qrCodeId,
      photos,
      safeZones: [],
      vaccinations: [],
      isLost: false,
      publicProfile: {
        id: `pub_${id}`,
        petId: id,
        qrCodeId,
        displayName: petData.name,
        species: petData.species,
        breed: petData.breed,
        photoUrl: petData.primaryPhotoUrl,
        secondaryPhotos: petData.photoUrls.slice(1),
        contactPhone: '081-234-5678',
        contactEmail: 'demo@pawsandco.com',
        allowDirectCall: true,
        allowFoundReport: true,
        isLost: false,
        customMessage: `ยินดีต้อนรับสู่หน้าข้อมูลของ ${petData.name}`,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Link device if provided
    if (petData.deviceId) {
      const dev = this.devices.find((d) => d.id === petData.deviceId);
      if (dev) newPet.device = dev;
    }

    this.pets.push(newPet);
    return newPet;
  }

  public updatePet(id: string, updates: Partial<Pet>): Pet | null {
    const idx = this.pets.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.pets[idx] = {
      ...this.pets[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (typeof updates.batterySaver === 'boolean' && this.pets[idx].deviceId) {
      const updatedDevice = this.updateDevice(this.pets[idx].deviceId!, {
        powerSaveMode: updates.batterySaver,
        updateIntervalSeconds: updates.batterySaver ? 300 : 10,
      });
      if (updatedDevice) this.pets[idx].device = updatedDevice;
    }

    return this.pets[idx];
  }

  public deletePet(id: string): boolean {
    const initialLen = this.pets.length;
    this.pets = this.pets.filter((p) => p.id !== id);
    return this.pets.length < initialLen;
  }

  // --- Safe Zones ---
  public getSafeZonesByPetId(petId: string): SafeZone[] {
    return this.safeZones.filter((z) => z.petId === petId);
  }

  public addSafeZone(zone: Omit<SafeZone, 'id' | 'createdAt' | 'updatedAt'>): SafeZone {
    const newZone: SafeZone = {
      ...zone,
      id: `zone_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.safeZones.push(newZone);

    // Update pet model copy as well
    const pet = this.getPetById(zone.petId);
    if (pet) {
      pet.safeZones.push(newZone);
    }

    return newZone;
  }

  public deleteSafeZone(id: string): boolean {
    this.safeZones = this.safeZones.filter((z) => z.id !== id);
    this.pets.forEach((p) => {
      p.safeZones = p.safeZones.filter((z) => z.id !== id);
    });
    return true;
  }

  // --- Vaccinations ---
  public getVaccinationsByPetId(petId: string): Vaccination[] {
    return this.vaccinations.filter((v) => v.petId === petId);
  }

  public addVaccination(vac: Omit<Vaccination, 'id'>): Vaccination {
    const newVac: Vaccination = {
      ...vac,
      id: `vac_${Date.now()}`,
    };
    this.vaccinations.push(newVac);

    const pet = this.getPetById(vac.petId);
    if (pet) {
      pet.vaccinations.push(newVac);
    }

    return newVac;
  }

  // --- Location Telemetry ---
  public getLocationsByPetId(petId: string): LocationHistory[] {
    return this.locations
      .filter((location) => location.petId === petId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public getLocationByMessageId(deviceId: string, messageId: string): LocationHistory | undefined {
    return this.locations.find(
      (location) => location.deviceId === deviceId && location.messageId === messageId
    );
  }

  public recordLocation(location: Omit<LocationHistory, 'id'>): LocationHistory {
    const newLoc: LocationHistory = {
      ...location,
      id: `loc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    };
    this.locations.push(newLoc);
    if (newLoc.deviceId) persistTelemetry(newLoc);

    // Update pet's latest location
    const pet = this.getPetById(location.petId);
    if (pet) {
      pet.latestLocation = newLoc;
    }

    return newLoc;
  }

  // --- Devices ---
  public getDevices(): Device[] {
    return [...this.devices];
  }

  public getDeviceById(id: string): Device | undefined {
    return this.devices.find((d) => d.id === id);
  }

  public getPetByDeviceId(deviceId: string): Pet | undefined {
    return this.pets.find((pet) => pet.deviceId === deviceId);
  }

  public updateDevice(id: string, updates: Partial<Device>): Device | null {
    const idx = this.devices.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.devices[idx] = {
      ...this.devices[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.devices[idx];
  }

  // --- Alerts ---
  public getAlerts(userId?: string): Alert[] {
    if (userId) {
      return this.alerts.filter((a) => a.userId === userId);
    }
    return [...this.alerts];
  }

  public markAlertAsRead(id: string): boolean {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.isRead = true;
      return true;
    }
    return false;
  }

  public triggerSos(petId: string, location?: { latitude: number; longitude: number }): Alert {
    const pet = this.getPetById(petId);
    const newAlert: Alert = {
      id: `alt_sos_${Date.now()}`,
      userId: pet?.userId || 'usr_demo_01',
      petId,
      petName: pet?.name || 'Pet',
      petAvatarUrl: pet?.primaryPhotoUrl,
      type: 'SOS',
      title: '🚨 สัญญาณขอความช่วยเหลือฉุกเฉิน (SOS Emergency)',
      message: `เจ้าของกดส่งสัญญาณ SOS สำหรับ ${pet?.name || 'สัตว์เลี้ยง'} ตำแหน่งปัจจุบันส่งไปยังระบบแล้ว!`,
      severity: 'CRITICAL',
      isRead: false,
      timestamp: new Date().toISOString(),
      location: location || {
        latitude: pet?.latestLocation?.latitude || 13.7314,
        longitude: pet?.latestLocation?.longitude || 100.5590,
      },
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }

  // --- Found Pet Reports ---
  public createFoundReport(report: Omit<FoundPetReport, 'id' | 'reportedAt' | 'status'>): FoundPetReport {
    const newReport: FoundPetReport = {
      ...report,
      id: `rep_${Date.now()}`,
      reportedAt: new Date().toISOString(),
      status: 'PENDING',
    };
    this.foundReports.unshift(newReport);
    return newReport;
  }

  public getFoundReports(): FoundPetReport[] {
    return [...this.foundReports];
  }
}

// Keep one store per Node.js process, including across independently bundled
// Next.js route handlers and development hot reloads.
const globalForDemoStore = globalThis as typeof globalThis & {
  __pawsDemoStore?: DemoStore;
};

export const demoStore = globalForDemoStore.__pawsDemoStore ?? new DemoStore();
globalForDemoStore.__pawsDemoStore = demoStore;
