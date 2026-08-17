import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { MessageRole } from "@prisma/client";
import { authenticateUser, isResourceOwner } from '@/lib/authz';

// POST /api/sessions/[id]/batch-save (thay thế batchSaveScriptAction)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateUser(request);
    if (!auth.authenticated || !auth.user) {
      return auth.errorResponse!;
    }

    const { id: sessionId } = await params;
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Missing session id' }, { status: 400 });
    }

    const existing = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (existing && !isResourceOwner(auth.user, existing.userId)) {
      return NextResponse.json(
        { success: false, message: 'Bạn không có quyền sửa kịch bản này (403 Forbidden).' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      messages = [],
      deleteMessageIds = [],
      title,
      updatedAt,
      voices
    } = body || {};

    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete messages
      if (Array.isArray(deleteMessageIds) && deleteMessageIds.length > 0) {
        await tx.chatMessage.deleteMany({
          where: {
            id: { in: deleteMessageIds },
            sessionId: sessionId,
          },
        });
      }

      // 2. Upsert messages
      const savedMessages = [];
      if (Array.isArray(messages)) {
        for (const msg of messages) {
          let rUpper = String(msg.role || '').toUpperCase();
          let prismaRole: MessageRole = MessageRole.USER;
          if (rUpper === 'USER') prismaRole = MessageRole.USER;
          else if (rUpper === 'ASSISTANT' || rUpper === 'AI' || rUpper === 'LAO') prismaRole = MessageRole.ASSISTANT;
          else if (rUpper === 'OUTRO') prismaRole = MessageRole.OUTRO;
          else if (rUpper === 'SYSTEM') prismaRole = MessageRole.SYSTEM;

          const m = await tx.chatMessage.upsert({
            where: { id: msg.id || "" },
            update: {
              audioUrl: msg.audioUrl || null,
              content: msg.content,
              role: prismaRole,
              emotion: msg.emotion || 'calm',
            },
            create: {
              id: msg.id && msg.id.length > 5 ? msg.id : undefined,
              sessionId: sessionId,
              role: prismaRole,
              content: msg.content,
              audioUrl: msg.audioUrl || null,
              voiceStyleId: msg.voiceStyleId || null,
              emotion: msg.emotion || 'calm',
            },
          });
          savedMessages.push(m);
        }
      }

      // 3. Update Session Info
      const sessionData: any = {};
      if (title !== undefined) sessionData.title = title;
      if (updatedAt !== undefined) sessionData.updatedAt = new Date(updatedAt);
      else sessionData.updatedAt = new Date();

      if (voices) {
        if (voices.laoVoice !== undefined) sessionData.laoVoice = voices.laoVoice;
        if (voices.laoVoiceStyle !== undefined) sessionData.laoVoiceStyle = voices.laoVoiceStyle;
        if (voices.userVoice !== undefined) sessionData.userVoice = voices.userVoice;
        if (voices.userVoiceStyle !== undefined) sessionData.userVoiceStyle = voices.userVoiceStyle;
      }

      const updatedSession = await tx.chatSession.upsert({
        where: { id: sessionId },
        update: sessionData,
        create: {
          id: sessionId,
          userId: auth.user!.id,
          title: title || "Kịch bản mới",
          type: "script",
          ...sessionData
        }
      });

      return { session: updatedSession, messages: savedMessages };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('[/api/sessions/[id]/batch-save POST] Error:', error?.message || error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
