import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ success: false, message: 'Missing sessionId' }, { status: 400 });
  }

  try {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { id: true, videoConfig: true }
    });
    return NextResponse.json({ success: true, data: session?.videoConfig || null });
  } catch (error: any) {
    console.error('[/api/sessions/video-config] DB Error:', error?.message || error);
    return NextResponse.json({ success: true, data: null }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, videoConfig } = body;
    if (!sessionId || !videoConfig) {
      return NextResponse.json({ success: false, message: 'Missing sessionId or videoConfig' }, { status: 400 });
    }

    const updated = await prisma.chatSession.update({
      where: { id: sessionId },
      data: { videoConfig }
    });

    return NextResponse.json({ success: true, data: updated.videoConfig });
  } catch (error: any) {
    console.error('Error saving session videoConfig to DB:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
