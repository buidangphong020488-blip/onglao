import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
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
      include: {
        _count: {
          select: { messages: true }
        }
      }
    });
    return NextResponse.json({ success: true, data: sessions });
  } catch (error: any) {
    console.error('[/api/sessions] DB Error (fallback to local state):', error?.message || error);
    return NextResponse.json({ success: true, data: [] });
  }
}
