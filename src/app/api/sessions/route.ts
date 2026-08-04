import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

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
    console.error('[/api/sessions] DB Error:', error?.message || error);
    return NextResponse.json({ success: true, data: [] });
  }
}
