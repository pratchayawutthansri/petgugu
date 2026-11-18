import { NextResponse } from 'next/server';
import { demoStore } from '@/lib/demo-store';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';

async function getUserId() {
  const token = cookies().get('paws_auth_token')?.value;
  if (!token) return 'usr_demo_01';
  const payload = await verifyJWT(token);
  return payload?.userId || 'usr_demo_01';
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pet = demoStore.getPetById(params.id);
    if (pet && pet.userId !== await getUserId()) {
      return NextResponse.json({ success: false, error: 'Pet not found' }, { status: 404 });
    }
    if (!pet) {
      return NextResponse.json(
        { success: false, error: 'Pet not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: pet,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    let body: Record<string, any>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'ข้อมูล JSON ไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const pet = demoStore.getPetById(params.id);
    if (!pet || pet.userId !== await getUserId()) {
      return NextResponse.json({ success: false, error: 'Pet not found' }, { status: 404 });
    }

    // Prevent overwriting protected identifier fields
    const { id: _ignoreId, userId: _ignoreUserId, ...safeUpdates } = body || {};
    const updated = demoStore.updatePet(params.id, safeUpdates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Pet not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pet = demoStore.getPetById(params.id);
    if (!pet || pet.userId !== await getUserId()) {
      return NextResponse.json({ success: false, error: 'Pet not found' }, { status: 404 });
    }
    const deleted = demoStore.deletePet(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Pet not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Pet deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
