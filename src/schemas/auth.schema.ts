import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'กรุณากรอกอีเมล (Email is required)')
    .email('รูปแบบอีเมลไม่ถูกต้อง (Invalid email format)'),
  password: z
    .string()
    .min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร (Password must be at least 6 characters)'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 2 ตัวอักษร (Display name must be at least 2 characters)')
      .max(50, 'ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร'),
    email: z
      .string()
      .min(1, 'กรุณากรอกอีเมล (Email is required)')
      .email('รูปแบบอีเมลไม่ถูกต้อง (Invalid email format)'),
    password: z
      .string()
      .min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร (Password must be at least 6 characters)'),
    confirmPassword: z
      .string()
      .min(1, 'กรุณายืนยันรหัสผ่าน (Please confirm password)'),
    phoneNumber: z
      .string()
      .regex(/^[0-9+ -]{9,15}$/, 'เบอร์โทรศัพท์ไม่ถูกต้อง (Invalid phone number)')
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน (Passwords do not match)',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
