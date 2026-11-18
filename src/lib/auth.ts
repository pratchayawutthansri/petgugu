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
  identifierOrEmail: string,
  password: string
): User | null {
  const normalized = identifierOrEmail.trim().toLowerCase();

  // Primary user check (Somchai)
  if (
    (normalized === 'somchai' ||
      normalized === 'somchai@pawsandco.com' ||
      normalized === 'demo@pawsandco.com' ||
      normalized === 'user') &&
    (password === 'paws1234' || password === 'demo1234')
  ) {
    return DEMO_USERS[0];
  }

  // Admin user check
  if (
    (normalized === 'admin' ||
      normalized === 'admin@pawsandco.com') &&
    (password === 'admin1234' || password === 'paws1234')
  ) {
    return DEMO_USERS[1];
  }

  // Allow any typed ID (min 3 chars) or email with 6+ char password as a user
  if (normalized.length >= 3 && password.length >= 6) {
    return {
      id: `usr_${Date.now()}`,
      email: normalized.includes('@') ? normalized : `${normalized}@pawsandco.com`,
      displayName: normalized.split('@')[0],
      role: 'USER',
      avatarUrl: '/images/default-avatar.svg',
      preferredLanguage: 'th',
      emailNotifications: true,
      smsNotifications: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return null;
}
