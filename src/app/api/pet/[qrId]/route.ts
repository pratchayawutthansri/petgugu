import { NextResponse } from 'next/server';
import { demoStore } from '@/lib/demo-store';

export async function GET(
  request: Request,
  { params }: { params: { qrId: string } }
) {
  try {
    const pet = demoStore.getPetByQrId(params.qrId);
    if (!pet || !pet.publicProfile) {
      return NextResponse.json(
        { success: false, error: 'Pet profile not found' },
        { status: 404 }
      );
    }

    // Return sanitized public profile — strictly exclude live GPS coordinates
    return NextResponse.json({
      success: true,
      data: pet.publicProfile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
