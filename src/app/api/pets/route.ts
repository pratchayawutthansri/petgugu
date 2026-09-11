import { NextResponse } from 'next/server';
import { demoStore } from '@/lib/demo-store';

export async function GET() {
  try {
    const pets = demoStore.getPets();
    return NextResponse.json({
      success: true,
      data: pets,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, species, breed, age, gender, weight, healthNotes, primaryPhotoUrl, photoUrls, deviceId } = body;

    if (!name || !breed) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกชื่อและสายพันธุ์ของสัตว์เลี้ยง' },
        { status: 400 }
      );
    }

    const newPet = demoStore.createPet({
      userId: 'usr_demo_01',
      name,
      species: species || 'DOG',
      breed,
      age: Number(age) || 1,
      gender: gender || 'MALE',
      weight: Number(weight) || 10,
      healthNotes,
      primaryPhotoUrl: primaryPhotoUrl || photoUrls[0],
      photoUrls: photoUrls || [primaryPhotoUrl],
      deviceId,
      batterySaver: false,
      proAlerts: true,
      isLost: false,
    });

    return NextResponse.json({
      success: true,
      data: newPet,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
