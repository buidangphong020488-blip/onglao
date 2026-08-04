import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { MessageRole } from "@prisma/client";

// GET /api/sessions/[id]/messages (thay thế getChatMessagesAction)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Missing session id' }, { status: 400 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error('[/api/sessions/[id]/messages GET] Error:', error?.message || error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/sessions/[id]/messages (thay thế saveChatMessageAction)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Missing session id' }, { status: 400 });
    }

    const body = await request.json();
    const { role, content, audioUrl, voiceStyleId, messageId, emotion } = body || {};

    let prismaRole: MessageRole = MessageRole.USER;
    const rUpper = String(role || '').toUpperCase();
    if (rUpper === 'USER') prismaRole = MessageRole.USER;
    else if (rUpper === 'ASSISTANT' || rUpper === 'AI' || rUpper === 'LAO') prismaRole = MessageRole.ASSISTANT;
    else if (rUpper === 'OUTRO') prismaRole = MessageRole.OUTRO;
    else if (rUpper === 'SYSTEM') prismaRole = MessageRole.SYSTEM;

    // Đảm bảo ChatSession tồn tại
    const sessionExists = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (!sessionExists) {
      await prisma.chatSession.create({
        data: {
          id: sessionId,
          title: "Hội thoại mới",
          type: "chat"
        }
      });
    }

    const message = await prisma.chatMessage.upsert({
      where: { id: messageId || "" },
      update: {
        audioUrl: audioUrl || null,
        emotion: emotion || null,
        content: content !== undefined ? content : undefined,
      },
      create: {
        id: messageId || undefined,
        sessionId: sessionId,
        role: prismaRole,
        content: content || "",
        audioUrl: audioUrl || null,
        voiceStyleId: voiceStyleId || null,
        emotion: emotion || "calm",
      },
    });

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    console.error('[/api/sessions/[id]/messages POST] Error:', error?.message || error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/sessions/[id]/messages (thay thế updateChatMessageContentAction)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const body = await request.json();
    const { messageId, content, role } = body || {};

    if (!messageId) {
      return NextResponse.json({ success: false, error: 'Missing messageId' }, { status: 400 });
    }

    const existing = await prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (existing) {
      const msg = await prisma.chatMessage.update({
        where: { id: messageId },
        data: { content },
      });
      return NextResponse.json({ success: true, data: msg });
    }

    if (sessionId) {
      const sessionExists = await prisma.chatSession.findUnique({ where: { id: sessionId } });
      if (!sessionExists) {
        await prisma.chatSession.create({
          data: {
            id: sessionId,
            title: "Hội thoại mới",
            type: "chat"
          }
        });
      }

      let prismaRole: MessageRole = MessageRole.USER;
      if (role === 'ai' || role === 'ASSISTANT') prismaRole = MessageRole.ASSISTANT;
      else if (role === 'outro' || role === 'OUTRO') prismaRole = MessageRole.OUTRO;

      const msg = await prisma.chatMessage.create({
        data: {
          id: messageId && messageId.length > 5 ? messageId : undefined,
          sessionId: sessionId,
          role: prismaRole,
          content: content,
        }
      });
      return NextResponse.json({ success: true, data: msg });
    }

    return NextResponse.json({ success: false, error: "Không tìm thấy tin nhắn trong CSDL" }, { status: 404 });
  } catch (error: any) {
    console.error('[/api/sessions/[id]/messages PATCH] Error:', error?.message || error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/sessions/[id]/messages (thay thế deleteChatMessageAction)
export async function DELETE(
  request: Request
) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json({ success: false, error: 'Missing messageId' }, { status: 400 });
    }

    await prisma.chatMessage.delete({
      where: { id: messageId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[/api/sessions/[id]/messages DELETE] Error:', error?.message || error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
