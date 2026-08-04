import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// GET /api/sessions
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const type = searchParams.get('type'); // 'script' → thay getScriptSessionsAction
  const includeMessages = searchParams.get('includeMessages') === 'true';

  try {
    // Khi type=script: lọc kịch bản, include messages (thay thế getScriptSessionsAction)
    if (type === 'script') {
      const sessions = await prisma.chatSession.findMany({
        where: {
          userId: userId && userId !== 'guest_user' ? userId : null,
          type: { in: ['script', 'chat|script'] },
        },
        include: {
          messages: {
            select: {
              id: true,
              role: true,
              content: true,
              audioUrl: true,
              emotion: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });
      return NextResponse.json({ success: true, data: sessions });
    }

    // Default: lấy tất cả sessions (giữ nguyên logic cũ)
    const sessions = await prisma.chatSession.findMany({
      where: userId && userId !== 'guest_user'
        ? {
            OR: [
              { userId: userId },
              { userId: null }
            ]
          }
        : {},
      orderBy: { updatedAt: "desc" },
      include: includeMessages
        ? {
            messages: {
              select: { id: true, role: true, content: true, audioUrl: true, emotion: true, createdAt: true },
              orderBy: { createdAt: 'asc' },
            }
          }
        : {
            _count: { select: { messages: true } }
          }
    });
    return NextResponse.json({ success: true, data: sessions });
  } catch (error: any) {
    console.error('[/api/sessions GET] Error:', error?.message || error);
    return NextResponse.json({ success: false, error: error.message, data: [] });
  }
}

// POST /api/sessions (thay thế createChatSessionAction)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, title = "Hội thoại mới", type = "chat", createdAt } = body || {};

    let validUserId: string | null = null;
    if (userId && userId !== 'guest_user') {
      const dbUser = await prisma.user.findUnique({ where: { id: userId } });
      if (dbUser) validUserId = userId;
    }

    const session = await prisma.chatSession.create({
      data: {
        userId: validUserId,
        title: title,
        type: type,
        ...(createdAt ? { createdAt: new Date(createdAt), updatedAt: new Date(createdAt) } : {}),
      },
    });

    return NextResponse.json({ success: true, data: session });
  } catch (error: any) {
    console.error('[/api/sessions POST] Error:', error?.message || error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
