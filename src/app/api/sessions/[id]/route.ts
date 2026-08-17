import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { authenticateUser, isResourceOwner } from '@/lib/authz';

// DELETE /api/sessions/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateUser(request);
    if (!auth.authenticated || !auth.user) {
      return auth.errorResponse!;
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing session id' }, { status: 400 });
    }

    const existing = await prisma.chatSession.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Session không tồn tại' }, { status: 404 });
    }

    if (!isResourceOwner(auth.user.id, existing.userId)) {
      return NextResponse.json(
        { success: false, message: 'Bạn không có quyền xóa phiên hội thoại này (403 Forbidden).' },
        { status: 403 }
      );
    }

    await prisma.chatSession.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[/api/sessions/[id] DELETE] Error:', error?.message || error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/sessions/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateUser(request);
    if (!auth.authenticated || !auth.user) {
      return auth.errorResponse!;
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing session id' }, { status: 400 });
    }

    const existing = await prisma.chatSession.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Session không tồn tại' }, { status: 404 });
    }

    if (!isResourceOwner(auth.user.id, existing.userId)) {
      return NextResponse.json(
        { success: false, message: 'Bạn không có quyền sửa đổi phiên hội thoại này (403 Forbidden).' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, type, isPinned, laoVoice, laoVoiceStyle, userVoice, userVoiceStyle, updatedAt } = body || {};

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (isPinned !== undefined) updateData.isPinned = Boolean(isPinned);
    if (laoVoice !== undefined) updateData.laoVoice = laoVoice;
    if (laoVoiceStyle !== undefined) updateData.laoVoiceStyle = laoVoiceStyle;
    if (userVoice !== undefined) updateData.userVoice = userVoice;
    if (userVoiceStyle !== undefined) updateData.userVoiceStyle = userVoiceStyle;
    if (updatedAt !== undefined) updateData.updatedAt = new Date(updatedAt);

    const session = await prisma.chatSession.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: session });
  } catch (error: any) {
    console.error('[/api/sessions/[id] PATCH] Error:', error?.message || error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
