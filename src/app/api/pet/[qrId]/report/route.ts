import { NextResponse } from 'next/server';
import { demoStore } from '@/lib/demo-store';

export async function POST(
  request: Request,
  { params }: { params: { qrId: string } }
) {
  try {
    const body = await request.json();
    const { reporterName, reporterPhone, reporterEmail, locationDescription, message, photoUrl } = body;

    if (!reporterName || !reporterPhone || !locationDescription) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const pet = demoStore.getPetByQrId(params.qrId);
    const petId = pet?.id || 'unknown';

    const report = demoStore.createFoundReport({
      petId,
      qrCodeId: params.qrId,
      reporterName,
      reporterPhone,
      reporterEmail,
      locationDescription,
      message,
      photoUrl,
    });

    return NextResponse.json({
      success: true,
      data: report,
      message: 'Report submitted successfully to pet owner',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
