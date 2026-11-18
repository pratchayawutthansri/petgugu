import { z } from 'zod';

const photoUrlSchema = z
  .string()
  .min(1, 'ต้องมีรูปภาพ')
  .refine(
    (val) =>
      val.startsWith('data:image/') ||
      val.startsWith('http://') ||
      val.startsWith('https://') ||
      val.startsWith('/'),
    'รูปภาพต้องเป็นไฟล์ที่อัปโหลดหรือลิงก์ URL ที่ถูกต้อง'
  );

export const createPetSchema = z.object({
  name: z
    .string()
    .min(1, 'กรุณาระบุชื่อสัตว์เลี้ยง (Pet name is required)')
    .max(50, 'ชื่อยาวเกินไป (Max 50 characters)'),
  species: z.enum(['DOG', 'CAT', 'OTHER'], {
    errorMap: () => ({ message: 'กรุณาเลือกประเภทสัตว์เลี้ยง' }),
  }),
  breed: z
    .string()
    .min(1, 'กรุณาระบุสายพันธุ์ (Breed is required)')
    .max(50, 'สายพันธุ์ยาวเกินไป'),
  age: z
    .number({ invalid_type_error: 'กรุณาระบุอายุเป็นตัวเลข' })
    .min(0, 'อายุต้องไม่ต่ำกว่า 0 ปี')
    .max(30, 'อายุต้องไม่เกิน 30 ปี'),
  gender: z.enum(['MALE', 'FEMALE', 'UNKNOWN'], {
    errorMap: () => ({ message: 'กรุณาเลือกเพศ' }),
  }),
  weight: z
    .number({ invalid_type_error: 'กรุณาระบุน้ำหนักเป็นตัวเลข' })
    .min(0.1, 'น้ำหนักต้องมากกว่า 0.1 กก.')
    .max(150, 'น้ำหนักต้องไม่เกิน 150 กก.'),
  healthNotes: z.string().max(500, 'บันทึกสุขภาพยาวเกินไป').optional(),
  primaryPhotoUrl: photoUrlSchema,
  photoUrls: z
    .array(photoUrlSchema)
    .min(2, 'ต้องมีรูปภาพอย่างน้อย 2 รูป (Minimum 2 photos required)')
    .max(5, 'มีรูปภาพได้สูงสุด 5 รูป (Maximum 5 photos allowed)'),
  deviceId: z.string().optional(),
  batterySaver: z.boolean().default(false),
  proAlerts: z.boolean().default(true),
});

export const updatePetSchema = createPetSchema.partial();

export const vaccinationSchema = z.object({
  vaccineName: z.string().min(1, 'กรุณาระบุชื่อวัคซีน'),
  administeredDate: z.string().min(1, 'กรุณาระบุวันที่ฉีด'),
  nextDueDate: z.string().optional(),
  veterinarian: z.string().optional(),
  clinicName: z.string().optional(),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const safeZoneSchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อพื้นที่ปลอดภัย'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(50, 'รัศมีขั้นต่ำ 50 เมตร').max(5000, 'รัศมีสูงสุด 5,000 เมตร'),
  isActive: z.boolean().default(true),
});

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type VaccinationInput = z.infer<typeof vaccinationSchema>;
export type SafeZoneInput = z.infer<typeof safeZoneSchema>;
