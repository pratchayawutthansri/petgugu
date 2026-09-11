import { NextResponse } from 'next/server';
import { demoStore } from '@/lib/demo-store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pet = demoStore.getPetById(params.id);
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
    const body = await request.json();
    const updated = demoStore.updatePet(params.id, body);
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
