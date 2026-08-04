import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// DELETE /api/sessions/[id] (thay thế deleteChatSessionAction)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing session id' }, { status: 400 });
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

// PATCH /api/sessions/[id] (thay thế updateChatSessionTitleAction, updateChatSessionVoicesAction, updateChatSessionTypeAction)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing session id' }, { status: 400 });
    }

    const body = await request.json();
    const { title, type, laoVoice, laoVoiceStyle, userVoice, userVoiceStyle, updatedAt } = body || {};

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
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
