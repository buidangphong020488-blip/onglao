import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Lấy toàn bộ câu mào đầu đang hoạt động (public - không cần auth)
export async function GET(req: NextRequest) {
  try {
    const items = await prisma.openingPhrase.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(items);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
