import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/authz';

// GET: Danh sách câu mào đầu (phân trang + tìm kiếm)
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authenticated) {
    return auth.errorResponse || NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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
  const auth = await requireAdmin(req);
  if (!auth.authenticated) {
    return auth.errorResponse || NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { text, audioUrl, category, tags, isActive } = body;

    if (!text?.trim()) {
      return NextResponse.json({ message: 'text is required' }, { status: 400 });
    }

    const item = await prisma.openingPhrase.create({
      data: {
        text: text.trim(),
        audioUrl: audioUrl || null,
        category: category || null,
        tags: Array.isArray(tags) ? tags.map((t: string) => String(t).trim()).filter(Boolean) : [],
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
