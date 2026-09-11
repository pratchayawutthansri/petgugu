import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { demoStore } from '@/lib/demo-store';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('paws_auth_token')?.value;

    if (!token) {
      // Default to demo user for smooth prototype demonstration
      return NextResponse.json({
        success: true,
        data: { user: demoStore.getUsers()[0] },
      });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = demoStore.getUserById(payload.userId) || demoStore.getUsers()[0];
    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
