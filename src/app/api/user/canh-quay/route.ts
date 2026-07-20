import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET — Fetch scenes for a specific user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });
  }

  try {
    const list = await prisma.canhQuay.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST — Upsert scenes for a specific user
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, canhQuay } = data; // canhQuay is an array of scene packs

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });
    }

    // Sync deletions: xóa các cảnh quay của user không còn trong danh sách (dành cho sync)
    const ids = canhQuay.map((item: any) => item.id);
    await prisma.canhQuay.deleteMany({
      where: {
        userId: userId,
        id: { notIn: ids }
      }
    });

    const parseJson = (val: any) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    };

    const results = await Promise.all(canhQuay.map((item: any) =>
      prisma.canhQuay.upsert({
        where: { id: item.id },
        update: {
          name: item.name,
          assetsNgang: parseJson(item.assets?.ngang || item.assetsNgang || {}),
          assetsDoc: parseJson(item.assets?.doc || item.assetsDoc || {}),
          linkedIds: parseJson(item.linkedIds || null),
        },
        create: {
          id: item.id,
          userId: userId,
          name: item.name,
          assetsNgang: parseJson(item.assets?.ngang || item.assetsNgang || {}),
          assetsDoc: parseJson(item.assets?.doc || item.assetsDoc || {}),
          linkedIds: parseJson(item.linkedIds || null),
        },
      })
    ));

    return NextResponse.json({ success: true, data: results });
  } catch (err: any) {
    console.error("Error saving user CanhQuay:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
