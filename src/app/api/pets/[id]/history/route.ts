import { NextResponse } from 'next/server';
import { demoStore } from '@/lib/demo-store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const locations = demoStore.getLocationsByPetId(params.id);
    return NextResponse.json({
      success: true,
      data: locations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
