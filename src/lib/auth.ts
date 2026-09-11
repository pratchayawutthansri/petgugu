import { SignJWT, jwtVerify } from 'jose';
import { User } from '@/types';
import { DEMO_USERS } from '@/data/demo-users';

const JWT_SECRET = process.env.JWT_SECRET || 'pawsandco-dev-secret-key-change-in-production-2026';
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  displayName: string;
  [key: string]: any;
}

/**
 * Sign a new JWT token using jose
 */
export async function signJWT(payload: JWTPayload, expiresIn = '7d'): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedKey);
}

/**
 * Verify a JWT token
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Verify mock credentials for Demo Mode
 */
export function verifyDemoCredentials(
  email: string,
  password: string
): User | null {
  const normalizedEmail = email.trim().toLowerCase();

  // Demo user check
  if (normalizedEmail === 'demo@pawsandco.com' && password === 'demo1234') {
    return DEMO_USERS[0];
  }

  // Admin user check
  if (normalizedEmail === 'admin@pawsandco.com' && password === 'admin1234') {
    return DEMO_USERS[1];
  }

  // In demo mode, allow any valid email + 6+ char password as a virtual user
  if (email.includes('@') && password.length >= 6) {
    return {
      id: `usr_${Date.now()}`,
      email: normalizedEmail,
      displayName: normalizedEmail.split('@')[0],
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      preferredLanguage: 'th',
      emailNotifications: true,
      smsNotifications: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return null;
}
