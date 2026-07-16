import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Lấy 1 câu mào đầu random đã có audio (public — không cần auth)
export async function GET(req: NextRequest) {
  try {
    // Đếm tổng số câu có audio và đang active
    const count = await prisma.openingPhrase.count({
      where: { isActive: true, audioUrl: { not: null } },
    });

    if (count === 0) {
      return NextResponse.json({ data: null, message: 'No opening phrase with audio available' });
    }

    // Lấy random bằng skip
    const skip = Math.floor(Math.random() * count);
    const item = await prisma.openingPhrase.findFirst({
      where: { isActive: true, audioUrl: { not: null } },
      skip,
    });

    return NextResponse.json({ data: item });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
