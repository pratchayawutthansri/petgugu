import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'กรุณากรอกไอดีผู้ใช้งาน (User ID is required)'),
  password: z
    .string()
    .min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร (Password must be at least 6 characters)'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, 'ชื่อ-นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร')
      .max(50, 'ชื่อ-นามสกุลต้องไม่เกิน 50 ตัวอักษร'),
    username: z
      .string()
      .min(3, 'ไอดีต้องมีอย่างน้อย 3 ตัวอักษร')
      .max(30, 'ไอดีต้องไม่เกิน 30 ตัวอักษร'),
    phoneNumber: z
      .string()
      .min(1, 'กรุณากรอกเบอร์โทรศัพท์')
      .refine(
        (val) => {
          const digits = val.replace(/\D/g, '');
          return digits.length >= 9 && digits.length <= 15;
        },
        { message: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (เช่น 08X-XXX-XXXX)' }
      ),
    password: z
      .string()
      .min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร (Password must be at least 6 characters)'),
    confirmPassword: z
      .string()
      .min(1, 'กรุณายืนยันรหัสผ่าน (Please confirm password)'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน (Passwords do not match)',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
