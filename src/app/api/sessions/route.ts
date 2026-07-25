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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
