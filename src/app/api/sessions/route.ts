import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { authenticateUser } from '@/lib/authz';

// GET /api/sessions
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if (!auth.authenticated || !auth.user) {
      return auth.errorResponse!;
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const includeMessages = searchParams.get('includeMessages') === 'true';
    const userId = String(auth.user.id);

    if (type === 'script') {
      const sessions = await prisma.chatSession.findMany({
        where: {
          userId,
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
        orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
      });
      return NextResponse.json({ success: true, data: sessions });
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      orderBy: [{ isPinned: 'desc' }, { updatedAt: "desc" }],
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

// POST /api/sessions
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    if (!auth.authenticated || !auth.user) {
      return auth.errorResponse!;
    }

    const body = await request.json();
    const { title = "Hội thoại mới", type = "chat", createdAt } = body || {};
    const userId = String(auth.user.id);

    const session = await prisma.chatSession.create({
      data: {
        userId,
        title,
        type,
        ...(createdAt ? { createdAt: new Date(createdAt), updatedAt: new Date(createdAt) } : {}),
      },
    });

    return NextResponse.json({ success: true, data: session });
  } catch (error: any) {
    console.error('[/api/sessions POST] Error:', error?.message || error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
