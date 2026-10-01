import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';
import { User } from '@/types';
import { demoStore } from '@/lib/demo-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { displayName, email, username, password, phoneNumber } = body;
    const finalIdentifier = username || email;

    if (!displayName || !finalIdentifier || !password) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const calculatedEmail = email
      ? email.toLowerCase().trim()
      : `${finalIdentifier.toLowerCase().trim()}@pawsandco.com`;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: calculatedEmail,
      displayName,
      role: 'USER',
      phoneNumber: phoneNumber || '',
      preferredLanguage: 'th',
      emailNotifications: true,
      smsNotifications: false,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    demoStore.addUser(newUser);

    const token = await signJWT({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      displayName: newUser.displayName,
    });

    const response = NextResponse.json({
      success: true,
      data: { user: newUser, token },
    });

    response.cookies.set('paws_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
