import { z } from 'zod';

export const updateUserSchema = z.object({
  displayName: z
    .string()
    .min(2, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(50, 'ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร'),
  phoneNumber: z
    .string()
    .regex(/^[0-9+ -]{9,15}$/, 'เบอร์โทรศัพท์ไม่ถูกต้อง')
    .optional()
    .or(z.literal('')),
  avatarUrl: z.string().url('URL รูปภาพไม่ถูกต้อง').optional().or(z.literal('')),
  preferredLanguage: z.enum(['th', 'en']).default('th'),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
});

export const foundPetReportSchema = z.object({
  reporterName: z.string().min(1, 'กรุณาระบุชื่อผู้พบ (Your name is required)'),
  reporterPhone: z
    .string()
    .min(1, 'กรุณาระบุเบอร์โทรติดต่อ (Phone number is required)')
    .regex(/^[0-9+ -]{9,15}$/, 'เบอร์โทรศัพท์ไม่ถูกต้อง'),
  reporterEmail: z.string().email('อีเมลไม่ถูกต้อง').optional().or(z.literal('')),
  locationDescription: z
    .string()
    .min(5, 'กรุณาระบุสถานที่พบสัตว์เลี้ยงอย่างชัดเจน (Please describe location where found)'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  message: z.string().max(500, 'ข้อความยาวเกินไป').optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type FoundPetReportInput = z.infer<typeof foundPetReportSchema>;
