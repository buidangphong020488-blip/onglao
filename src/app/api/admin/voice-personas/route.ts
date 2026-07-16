import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123';
function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-token') === ADMIN_PASSWORD;
}

// GET — list all (admin)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const list = await prisma.voicePersona.findMany({ orderBy: { createdAt: 'asc' } });
  return NextResponse.json(list);
}

// POST — save full list (replace strategy: delete removed, create/update existing)
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const list: any[] = await req.json();
    if (!Array.isArray(list)) return NextResponse.json({ message: 'Expected array' }, { status: 400 });

    const results = [];
    for (const item of list) {
      const existing = await prisma.voicePersona.findFirst({ where: { id: item.id } });
      if (existing) {
        const updated = await prisma.voicePersona.update({
          where: { id: item.id },
          data: {
            name: item.name,
            listenVideo: item.listenVideo || null,
            speakVideo: item.speakVideo || null,
          },
        });
        results.push(updated);
      } else {
        // Tạo mới — nếu id hợp lệ dùng id đó, nếu không để DB tự sinh UUID
        const created = await prisma.voicePersona.create({
          data: {
            ...(item.id && item.id.length > 10 ? { id: item.id } : {}),
            name: item.name,
            listenVideo: item.listenVideo || null,
            speakVideo: item.speakVideo || null,
          },
        });
        results.push(created);
      }
    }
    return NextResponse.json({ success: true, data: results });
  } catch (err: any) {
    console.error('[voice-personas POST]', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
