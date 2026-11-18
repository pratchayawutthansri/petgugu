import { User } from '@/types';

export const DEMO_USERS: User[] = [
  {
    id: 'usr_demo_01',
    email: 'somchai@pawsandco.com',
    displayName: 'สมชาย ใจดี',
    role: 'USER',
    avatarUrl: '/images/default-avatar.svg',
    phoneNumber: '081-234-5678',
    preferredLanguage: 'th',
    emailNotifications: true,
    smsNotifications: false,
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-08-20T10:30:00.000Z',
  },
  {
    id: 'usr_admin_01',
    email: 'admin@pawsandco.com',
    displayName: 'Admin Manager (ผู้ดูแลระบบ)',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    phoneNumber: '089-999-8888',
    preferredLanguage: 'th',
    emailNotifications: true,
    smsNotifications: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-08-25T12:00:00.000Z',
  },
];
