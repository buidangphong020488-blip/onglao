import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET — Fetch scenes from PostgreSQL DB
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const isPublicParam = searchParams.get('isPublic');

  try {
    let whereCondition: any;
    if (isPublicParam !== null) {
      const isPub = isPublicParam === 'true';
      whereCondition = userId ? {
        OR: [
          { isPublic: isPub },
          { userId: userId }
        ]
      } : { isPublic: isPub };
    } else {
      whereCondition = userId ? {
        OR: [
          { isPublic: true },
          { userId: userId }
        ]
      } : { isPublic: true };
    }

    const list = await prisma.canhQuay.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('[/api/user/canh-quay] DB Error:', error?.message || error);
    return NextResponse.json([], { status: 200 });
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
          phanMucId: data.phanMucId ? String(data.phanMucId) : undefined,
          role: data.role ? String(data.role) : 'lao',
          emotion: data.emotion ? String(data.emotion) : 'calm',
          url: data.url ? String(data.url) : null,
          poster: data.poster ? String(data.poster) : null,
          assetsNgang: data.assetsNgang || undefined,
          assetsDoc: data.assetsDoc || undefined,
        } as any,
        create: {
          id: String(data.id),
          userId: data.userId ? String(data.userId) : undefined,
          phanMucId: data.phanMucId ? String(data.phanMucId) : undefined,
          name: String(data.name),
          category: data.category ? String(data.category) : 'lao',
          role: data.role ? String(data.role) : 'lao',
          emotion: data.emotion ? String(data.emotion) : 'calm',
          url: data.url ? String(data.url) : null,
          poster: data.poster ? String(data.poster) : null,
          assetsNgang: data.assetsNgang || undefined,
          assetsDoc: data.assetsDoc || undefined,
        } as any
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
            phanMucId: item.phanMucId ? String(item.phanMucId) : undefined,
            role: item.role || 'lao',
            emotion: item.emotion || 'calm',
            url: item.url || null,
            poster: item.poster || null,
            assetsNgang: item.assets?.ngang || item.assetsNgang || undefined,
            assetsDoc: item.assets?.doc || item.assetsDoc || undefined,
          },
          create: {
            id: idStr,
            userId: userId ? String(userId) : undefined,
            phanMucId: item.phanMucId ? String(item.phanMucId) : undefined,
            name: item.name || 'Cảnh quay',
            category: item.category || item.role || 'lao',
            role: item.role || 'lao',
            emotion: item.emotion || 'calm',
            url: item.url || null,
            poster: item.poster || null,
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

// DELETE — Delete single clip, array of clip IDs, or entire category in PostgreSQL DB (Phân quyền chính chủ)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');
    
    // Đọc body nếu có batch IDs
    let bodyIds: string[] = [];
    let bodyUserId = userId;
    try {
      const body = await req.json();
      if (Array.isArray(body?.ids)) bodyIds = body.ids;
      if (body?.userId) bodyUserId = body.userId;
    } catch {
      // no body
    }

    if (id) {
      // Nếu có userId -> chỉ cho xóa bài của chính mình hoặc bài chưa gán userId
      const whereCondition: any = { id };
      if (bodyUserId) {
        whereCondition.OR = [{ userId: bodyUserId }, { userId: null }];
      }
      const res = await prisma.canhQuay.deleteMany({ where: whereCondition });
      return NextResponse.json({ success: true, count: res.count, message: `Đã xóa clip ${id}` });
    }

    if (bodyIds.length > 0) {
      const whereCondition: any = { id: { in: bodyIds } };
      if (bodyUserId) {
        whereCondition.OR = [{ userId: bodyUserId }, { userId: null }];
      }
      const res = await prisma.canhQuay.deleteMany({ where: whereCondition });
      return NextResponse.json({ success: true, count: res.count, message: `Đã xóa ${res.count} clip` });
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
