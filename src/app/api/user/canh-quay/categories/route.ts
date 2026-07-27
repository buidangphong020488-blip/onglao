import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET — Lấy danh sách Phân Mục Cảnh Quay từ bảng PhanMucCanhQuay trong PostgreSQL DB
export async function GET() {
  try {
    const list = await prisma.phanMucCanhQuay.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('[/api/user/canh-quay/categories] DB Error:', error?.message || error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST — Thêm mới Phân Mục Cảnh Quay vào bảng PhanMucCanhQuay trong PostgreSQL DB
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    if (!name) {
      return NextResponse.json({ success: false, message: 'Tên phân mục không được để trống' }, { status: 400 });
    }

    const cat = await prisma.phanMucCanhQuay.upsert({
      where: { name },
      update: { name, description: body.description || undefined },
      create: { id: body.id || undefined, name, description: body.description || undefined },
    });

    const allCats = await prisma.phanMucCanhQuay.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json({ success: true, data: allCats, category: cat });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PUT — Đổi tên Phân Mục Cảnh Quay & Cập nhật category cho tất cả clip thuộc phân mục đó
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, oldName, newName } = body;
    const trimmedNew = String(newName || '').trim();
    if (!trimmedNew) {
      return NextResponse.json({ success: false, message: 'Tên phân mục mới không được để trống' }, { status: 400 });
    }

    const target = await prisma.phanMucCanhQuay.findFirst({
      where: { OR: [{ id: id || '' }, { name: oldName || '' }] },
    });

    if (target) {
      await prisma.phanMucCanhQuay.update({
        where: { id: target.id },
        data: { name: trimmedNew }
      });
    }

    // Cập nhật tên category trong bảng CanhQuay cho tất cả clip
    await prisma.canhQuay.updateMany({
      where: {
        OR: [
          { phanMucId: target ? target.id : (id || '') },
          { category: oldName },
          { category: id }
        ]
      },
      data: { category: trimmedNew }
    });

    const allCats = await prisma.phanMucCanhQuay.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json({ success: true, data: allCats });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE — Xóa Phân Mục Cảnh Quay khỏi bảng PhanMucCanhQuay & Xóa các clip thuộc phân mục đó
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const catId = searchParams.get('id') || searchParams.get('category');
    if (!catId) {
      return NextResponse.json({ success: false, message: 'Thiếu tham số category id' }, { status: 400 });
    }

    const target = await prisma.phanMucCanhQuay.findFirst({
      where: { OR: [{ id: catId }, { name: catId }] },
    });

    const catName = target ? target.name : catId;
    const realId = target ? target.id : catId;

    // 1. Xóa tất cả clip thuộc phân mục này trong CanhQuay
    await prisma.canhQuay.deleteMany({
      where: {
        OR: [
          { phanMucId: realId },
          { category: catId },
          { category: catName }
        ]
      }
    });

    // 2. Xóa bản ghi phân mục trong bảng PhanMucCanhQuay
    await prisma.phanMucCanhQuay.deleteMany({
      where: { OR: [{ id: realId }, { name: catName }] },
    });

    const remaining = await prisma.phanMucCanhQuay.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json({ success: true, data: remaining, message: `Đã xóa phân mục ${catName}` });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
