import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123';

function checkAuth(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token');
  return token === ADMIN_PASSWORD;
}

// PUT: Cập nhật câu mào đầu
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const { text, audioUrl, category, isActive } = body;
    const item = await prisma.openingPhrase.update({
      where: { id },
      data: {
        ...(text !== undefined && { text: text.trim() }),
        ...(audioUrl !== undefined && { audioUrl: audioUrl || null }),
        ...(category !== undefined && { category: category || null }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// DELETE: Xóa câu mào đầu
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAuth(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.openingPhrase.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
