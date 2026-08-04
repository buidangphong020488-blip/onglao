import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Lấy 1 câu mào đầu random có audio khớp với tag, text hoặc category
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const text = searchParams.get('text');

    const baseWhere: any = { isActive: true, audioUrl: { not: null } };
    let candidateItems: any[] = [];

    // 1. Nếu có text (câu thoại chat của người dùng), tìm các câu mào đầu có Tag nằm trong câu thoại
    if (text) {
      const lowerText = text.toLowerCase().trim();
      const allActiveWithAudio = await prisma.openingPhrase.findMany({ where: baseWhere });
      candidateItems = allActiveWithAudio.filter((item: any) => {
        if (!item.tags || !Array.isArray(item.tags) || item.tags.length === 0) return false;
        return item.tags.some((t: string) => {
          const cleanT = String(t).toLowerCase().trim();
          return cleanT.length > 0 && lowerText.includes(cleanT);
        });
      });
    }

    // 2. Ưu tiên tìm theo Tag cụ thể nếu truyền param tag
    if (candidateItems.length === 0 && tag) {
      const cleanTag = tag.toLowerCase().trim();
      try {
        candidateItems = await prisma.openingPhrase.findMany({
          where: {
            ...baseWhere,
            tags: { has: cleanTag }
          }
        });
      } catch {
        const all = await prisma.openingPhrase.findMany({ where: baseWhere });
        candidateItems = all.filter((i: any) => 
          (i.tags || []).some((t: string) => String(t).toLowerCase().includes(cleanTag)) ||
          (i.text || '').toLowerCase().includes(cleanTag)
        );
      }
    }

    // 3. Nếu không tìm thấy theo Tag và có category -> tìm theo category
    if (candidateItems.length === 0 && category) {
      candidateItems = await prisma.openingPhrase.findMany({
        where: {
          ...baseWhere,
          category
        }
      });
    }

    // 4. Fallback: Lấy danh sách tất cả câu mào đầu có audio
    if (candidateItems.length === 0) {
      candidateItems = await prisma.openingPhrase.findMany({
        where: baseWhere
      });
    }

    if (candidateItems.length === 0) {
      return NextResponse.json({ data: null, message: 'Không có câu mào đầu nào trong CSDL' }, { status: 404 });
    }

    const item = candidateItems[Math.floor(Math.random() * candidateItems.length)];
    return NextResponse.json({ data: item });
  } catch (err: any) {
    console.error('[/api/opening-phrases/random] DB Error:', err?.message || err);
    return NextResponse.json({ data: null, message: `Lỗi CSDL PostgreSQL: ${err.message}` }, { status: 500 });
  }
}
