import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Lấy 1 câu mào đầu random đã có audio khớp với category (public — không cần auth)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const whereClause: any = { isActive: true, audioUrl: { not: null } };
    if (category) {
      whereClause.category = category;
    }

    let count = await prisma.openingPhrase.count({ where: whereClause });
    let finalWhere = { ...whereClause };

    // Nếu không có câu nào trong category này -> Lùi về tìm câu mào đầu bất kỳ có audio
    if (count === 0 && category) {
      delete finalWhere.category;
      count = await prisma.openingPhrase.count({ where: finalWhere });
    }

    if (count === 0) {
      return NextResponse.json({ data: null, message: 'No opening phrase with audio available' });
    }

    const skip = Math.floor(Math.random() * count);
    const item = await prisma.openingPhrase.findFirst({
      where: finalWhere,
      skip,
    });

    return NextResponse.json({ data: item });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
