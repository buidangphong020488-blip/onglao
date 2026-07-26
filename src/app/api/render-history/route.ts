import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await prisma.renderHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    console.error('Error fetching render history from DB:', error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || (!body.id && !body.videoUrl)) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const item = await (prisma.renderHistory as any).upsert({
      where: { id: String(body.id || `rh_${Date.now()}`) },
      update: {
        title: body.title || undefined,
        videoUrl: body.videoUrl || body.url || '',
        thumbnailUrl: body.thumbnailUrl || body.poster || undefined,
        duration: body.duration ? Number(body.duration) : undefined,
        aspectRatio: body.aspectRatio || body.aspect || undefined,
        sessionId: body.sessionId || undefined,
      },
      create: {
        id: String(body.id || `rh_${Date.now()}`),
        title: body.title || 'Video Render',
        videoUrl: body.videoUrl || body.url || '',
        thumbnailUrl: body.thumbnailUrl || body.poster || undefined,
        duration: body.duration ? Number(body.duration) : undefined,
        aspectRatio: body.aspectRatio || body.aspect || undefined,
        sessionId: body.sessionId || undefined,
      },
    });

    const list = await prisma.renderHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, data: list, item });
  } catch (error: any) {
    console.error('Error saving render history to DB:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
    }

    const item = await prisma.renderHistory.findUnique({ where: { id } }).catch(() => null);
    if (item && item.videoUrl && item.videoUrl.startsWith('/exports/')) {
      try {
        const cleanUrl = item.videoUrl.replace(/^\/+/, '');
        const diskPath = path.join(process.cwd(), 'public', cleanUrl);
        if (fs.existsSync(diskPath)) {
          fs.unlinkSync(diskPath);
        }
      } catch (e) {}
    }

    await prisma.renderHistory.deleteMany({
      where: { id },
    });

    const list = await prisma.renderHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    console.error('Error deleting render history from DB:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
