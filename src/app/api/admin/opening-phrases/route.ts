import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123';

function checkAuth(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token');
  return token === ADMIN_PASSWORD;
}

// GET: Danh sách câu mào đầu (phân trang + tìm kiếm)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const audioFilter = searchParams.get('audioFilter') || 'all';

    const conditions: any[] = [];
    if (search) {
      conditions.push({ text: { contains: search, mode: 'insensitive' as const } });
    }
    if (audioFilter === 'has_audio') {
      conditions.push({ AND: [{ audioUrl: { not: null } }, { audioUrl: { not: '' } }] });
    } else if (audioFilter === 'no_audio') {
      conditions.push({ OR: [{ audioUrl: null }, { audioUrl: '' }] });
    }

    const where = conditions.length > 0 ? { AND: conditions } : {};

    const [items, total] = await Promise.all([
      prisma.openingPhrase.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.openingPhrase.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, limit });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// POST: Thêm câu mào đầu mới
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { text, audioUrl, category, isActive } = body;

    if (!text?.trim()) {
      return NextResponse.json({ message: 'text is required' }, { status: 400 });
    }

    const item = await prisma.openingPhrase.create({
      data: {
        text: text.trim(),
        audioUrl: audioUrl || null,
        category: category || null,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
