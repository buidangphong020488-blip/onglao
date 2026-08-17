import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/authz';

// PUT: Cập nhật câu mào đầu
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (!auth.authenticated) {
    return auth.errorResponse || NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const { text, audioUrl, category, tags, isActive } = body;
    const item = await prisma.openingPhrase.update({
      where: { id },
      data: {
        ...(text !== undefined && { text: text.trim() }),
        ...(audioUrl !== undefined && { audioUrl: audioUrl || null }),
        ...(category !== undefined && { category: category || null }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? tags.map((t: string) => String(t).trim()).filter(Boolean) : [] }),
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
  const auth = await requireAdmin(req);
  if (!auth.authenticated) {
    return auth.errorResponse || NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.openingPhrase.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
