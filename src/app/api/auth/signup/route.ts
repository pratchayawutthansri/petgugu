import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';
import { User } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { displayName, email, password, phoneNumber } = body;

    if (!displayName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: email.toLowerCase().trim(),
      displayName,
      role: 'USER',
      phoneNumber,
      preferredLanguage: 'th',
      emailNotifications: true,
      smsNotifications: false,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

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
