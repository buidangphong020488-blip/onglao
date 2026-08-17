import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateUser, isResourceOwner } from '@/lib/authz';

export const dynamic = 'force-dynamic';

// GET — Fetch scenes from PostgreSQL DB
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateUser(request);
    const userId = auth.authenticated && auth.user ? auth.user.id : null;

    const { searchParams } = new URL(request.url);
    const isPublicParam = searchParams.get('isPublic');

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

// POST — Upsert single clip or array of clips in PostgreSQL DB (Auth required)
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated || !auth.user) {
      return auth.errorResponse!;
    }
    const userId = auth.user.id;

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
          isPublic: data.isPublic !== undefined ? Boolean(data.isPublic) : true,
          assetsNgang: data.assetsNgang || undefined,
          assetsDoc: data.assetsDoc || undefined,
        } as any,
        create: {
          id: String(data.id),
          userId: userId,
          phanMucId: data.phanMucId ? String(data.phanMucId) : undefined,
          name: String(data.name),
          category: data.category ? String(data.category) : 'lao',
          role: data.role ? String(data.role) : 'lao',
          emotion: data.emotion ? String(data.emotion) : 'calm',
          url: data.url ? String(data.url) : null,
          poster: data.poster ? String(data.poster) : null,
          isPublic: data.isPublic !== undefined ? Boolean(data.isPublic) : true,
          assetsNgang: data.assetsNgang || undefined,
          assetsDoc: data.assetsDoc || undefined,
        } as any
      });
      return NextResponse.json({ success: true, data: clip });
    }

    // 2. Nếu nhận danh sách clips
    const { canhQuay } = data;
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
            isPublic: item.isPublic !== undefined ? Boolean(item.isPublic) : true,
            assetsNgang: item.assets?.ngang || item.assetsNgang || undefined,
            assetsDoc: item.assets?.doc || item.assetsDoc || undefined,
          },
          create: {
            id: idStr,
            userId: userId,
            phanMucId: item.phanMucId ? String(item.phanMucId) : undefined,
            name: item.name || 'Cảnh quay',
            category: item.category || item.role || 'lao',
            role: item.role || 'lao',
            emotion: item.emotion || 'calm',
            url: item.url || null,
            poster: item.poster || null,
            isPublic: item.isPublic !== undefined ? Boolean(item.isPublic) : true,
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

// DELETE — Delete single clip, array of clip IDs (Phân quyền chính chủ)
export async function DELETE(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated || !auth.user) {
      return auth.errorResponse!;
    }
    const userId = auth.user.id;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    let bodyIds: string[] = [];
    try {
      const body = await req.json();
      if (Array.isArray(body?.ids)) bodyIds = body.ids;
    } catch {}

    if (id) {
      const existing = await prisma.canhQuay.findUnique({ where: { id } });
      if (existing && !isResourceOwner(auth.user, existing.userId)) {
        return NextResponse.json({ success: false, message: 'Bạn không có quyền xóa clip này (403 Forbidden)' }, { status: 403 });
      }
      const res = await prisma.canhQuay.deleteMany({ where: { id, userId: auth.user.isAdmin ? undefined : userId } });
      return NextResponse.json({ success: true, count: res.count, message: `Đã xóa clip ${id}` });
    }

    if (bodyIds.length > 0) {
      const res = await prisma.canhQuay.deleteMany({
        where: { id: { in: bodyIds }, userId: auth.user.isAdmin ? undefined : userId }
      });
      return NextResponse.json({ success: true, count: res.count, message: `Đã xóa ${res.count} clip` });
    }

    return NextResponse.json({ success: false, message: 'Thiếu tham số xóa (id hoặc ids)' }, { status: 400 });
  } catch (err: any) {
    console.error("Lỗi xóa PostgreSQL CanhQuay:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
