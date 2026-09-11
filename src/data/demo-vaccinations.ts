import { Vaccination } from '@/types';

export const DEMO_VACCINATIONS: Vaccination[] = [
  // Mochi's Vaccines
  {
    id: 'vac_m_01',
    petId: 'pet_mochi_01',
    vaccineName: 'Rabies (วัคซีนป้องกันโรคพิษสุนัขบ้า)',
    administeredDate: '2026-03-15',
    nextDueDate: '2027-03-15',
    veterinarian: 'น.สพ. กิตติศักดิ์ ชัยชนะ (Dr. Kittisak)',
    clinicName: 'Thonglor Pet Hospital (รพ.สัตว์ทองหล่อ)',
    batchNumber: 'RB-2026-884A',
    notes: 'ไม่มีอาการแพ้ สุขภาพแข็งแรงดีมาก',
  },
  {
    id: 'vac_m_02',
    petId: 'pet_mochi_01',
    vaccineName: 'DHPP 5-in-1 (วัคซีนรวม 5 โรคหลัก)',
    administeredDate: '2026-04-10',
    nextDueDate: '2027-04-10',
    veterinarian: 'น.สพ. กิตติศักดิ์ ชัยชนะ (Dr. Kittisak)',
    clinicName: 'Thonglor Pet Hospital (รพ.สัตว์ทองหล่อ)',
    batchNumber: 'DHPP-9923B',
    notes: 'วัคซีนรวมประจำปีเข็มกระตุ้น',
  },
  {
    id: 'vac_m_03',
    petId: 'pet_mochi_01',
    vaccineName: 'Bordetella (วัคซีนป้องกันหลอดลมอักเสบติดต่อ)',
    administeredDate: '2026-05-20',
    nextDueDate: '2027-05-20',
    veterinarian: 'พญ. วรรณา สัตวแพทย์',
    clinicName: 'Sukhumvit Animal Clinic',
    batchNumber: 'BORD-4411',
    notes: 'หยอดจมูก ป้องกันไอคอกสุนัข',
  },

  // Lucky's Vaccines
  {
    id: 'vac_l_01',
    petId: 'pet_lucky_02',
    vaccineName: 'Rabies (วัคซีนป้องกันโรคพิษสุนัขบ้า)',
    administeredDate: '2025-11-05',
    nextDueDate: '2026-11-05',
    veterinarian: 'สพ.ญ. นลินี พฤกษา',
    clinicName: 'Ari Pet Care Clinic',
    batchNumber: 'RB-2025-771',
    notes: 'ฉีดครบตามกำหนด',
  },
  {
    id: 'vac_l_02',
    petId: 'pet_lucky_02',
    vaccineName: 'DHPP 5-in-1 (วัคซีนรวม 5 โรคหลัก)',
    administeredDate: '2025-11-05',
    nextDueDate: '2026-11-05',
    veterinarian: 'สพ.ญ. นลินี พฤกษา',
    clinicName: 'Ari Pet Care Clinic',
    batchNumber: 'DHPP-8812',
    notes: 'นัดตรวจสุขภาพรอบถัดไปปลายปี',
  },
];
