import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET — Lay danh sach Goi Canh Quay tu PostgreSQL DB
export async function GET() {
  try {
    const list = await prisma.goiCanhQuay.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST — Upsert Goi Canh Quay vao PostgreSQL DB
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    if (!name) {
      return NextResponse.json({ success: false, message: 'Ten goi canh quay khong duoc de trong' }, { status: 400 });
    }

    const scenesData = body.scenes || body.scenesData || [];
    const pack = await prisma.goiCanhQuay.upsert({
      where: { name },
      update: {
        aspect: body.aspect || 'ngang',
        scenesData: scenesData,
      },
      create: {
        id: body.id || undefined,
        name,
        aspect: body.aspect || 'ngang',
        scenesData: scenesData,
      },
    });

    const list = await prisma.goiCanhQuay.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: list, pack });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE — Xoa Goi Canh Quay khoi PostgreSQL DB
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || searchParams.get('name');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Thieu tham so id/name' }, { status: 400 });
    }

    await prisma.goiCanhQuay.deleteMany({
      where: { OR: [{ id }, { name: id }] },
    });

    const list = await prisma.goiCanhQuay.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
