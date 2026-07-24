import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET — Fetch scenes from PostgreSQL DB
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const list = await prisma.canhQuay.findMany({
      where: userId ? { OR: [{ userId }, { userId: null }] } : {},
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST — Upsert single clip or array of clips in PostgreSQL DB
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // 1. Nếu nhận single clip
    if (data.id && data.name) {
      const clip = await prisma.canhQuay.upsert({
        where: { id: String(data.id) },
        update: {
          name: String(data.name),
          category: data.category ? String(data.category) : 'lao',
          role: data.role ? String(data.role) : 'lao',
          emotion: data.emotion ? String(data.emotion) : 'calm',
          url: data.url ? String(data.url) : null,
          assetsNgang: data.assetsNgang || undefined,
          assetsDoc: data.assetsDoc || undefined,
        },
        create: {
          id: String(data.id),
          userId: data.userId ? String(data.userId) : undefined,
          name: String(data.name),
          category: data.category ? String(data.category) : 'lao',
          role: data.role ? String(data.role) : 'lao',
          emotion: data.emotion ? String(data.emotion) : 'calm',
          url: data.url ? String(data.url) : null,
          assetsNgang: data.assetsNgang || undefined,
          assetsDoc: data.assetsDoc || undefined,
        }
      });
      return NextResponse.json({ success: true, data: clip });
    }

    // 2. Nếu nhận danh sách clips
    const { userId, canhQuay } = data;
    if (Array.isArray(canhQuay)) {
      const results = await Promise.all(canhQuay.map((item: any) => {
        const idStr = String(item.id || `cq_${Date.now()}_${Math.random()}`);
        return prisma.canhQuay.upsert({
          where: { id: idStr },
          update: {
            name: item.name || 'Cảnh quay',
            category: item.category || item.role || 'lao',
            role: item.role || 'lao',
            emotion: item.emotion || 'calm',
            url: item.url || null,
            assetsNgang: item.assets?.ngang || item.assetsNgang || undefined,
            assetsDoc: item.assets?.doc || item.assetsDoc || undefined,
          },
          create: {
            id: idStr,
            userId: userId ? String(userId) : undefined,
            name: item.name || 'Cảnh quay',
            category: item.category || item.role || 'lao',
            role: item.role || 'lao',
            emotion: item.emotion || 'calm',
            url: item.url || null,
            assetsNgang: item.assets?.ngang || item.assetsNgang || undefined,
            assetsDoc: item.assets?.doc || item.assetsDoc || undefined,
          },
        });
      }));
      return NextResponse.json({ success: true, data: results });
    }

    return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
  } catch (err: any) {
    console.error("Lỗi lưu PostgreSQL CanhQuay:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE — Delete single clip, array of clip IDs, or entire category in PostgreSQL DB
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    
    // Đọc body nếu có batch IDs
    let bodyIds: string[] = [];
    try {
      const body = await req.json();
      if (Array.isArray(body?.ids)) bodyIds = body.ids;
    } catch {
      // no body
    }

    if (id) {
      await prisma.canhQuay.deleteMany({ where: { id } });
      return NextResponse.json({ success: true, message: `Đã xóa clip ${id}` });
    }

    if (bodyIds.length > 0) {
      await prisma.canhQuay.deleteMany({ where: { id: { in: bodyIds } } });
      return NextResponse.json({ success: true, message: `Đã xóa ${bodyIds.length} clip` });
    }

    if (category) {
      await prisma.canhQuay.deleteMany({ where: { category } });
      return NextResponse.json({ success: true, message: `Đã xóa phân mục ${category}` });
    }

    return NextResponse.json({ success: false, message: 'Thiếu tham số xóa (id, ids hoặc category)' }, { status: 400 });
  } catch (err: any) {
    console.error("Lỗi xóa PostgreSQL CanhQuay:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
