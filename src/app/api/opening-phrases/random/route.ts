import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LAO_GREETINGS_DB } from '@/components/onglao/constants';

// GET: Lấy 1 câu mào đầu random có audio khớp với tag, text hoặc category (Optimized)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const text = searchParams.get('text');

  const baseWhere: any = { isActive: true, audioUrl: { not: null } };
  let candidateItems: any[] = [];

  try {
    // 1. Ưu tiên tìm theo Tag cụ thể nếu truyền param tag
    if (tag) {
      const cleanTag = tag.toLowerCase().trim();
      try {
        candidateItems = await prisma.openingPhrase.findMany({
          where: {
            ...baseWhere,
            tags: { has: cleanTag }
          },
          take: 50
        });
      } catch {
        // Fallback
      }
    }

    // 2. Nếu có text (câu thoại chat của người dùng), tìm các câu mào đầu
    if (candidateItems.length === 0 && text) {
      const lowerText = text.toLowerCase().trim();
      const allActiveWithAudio = await prisma.openingPhrase.findMany({
        where: {
          ...baseWhere,
          tags: { isEmpty: false }
        },
        take: 100
      });

      candidateItems = allActiveWithAudio.filter((item: any) => {
        if (!item.tags || !Array.isArray(item.tags) || item.tags.length === 0) return false;
        return item.tags.some((t: string) => {
          const cleanT = String(t).toLowerCase().trim();
          return cleanT.length > 0 && lowerText.includes(cleanT);
        });
      });
    }

    // 3. Nếu không tìm thấy theo Tag và có category -> tìm theo category
    if (candidateItems.length === 0 && category) {
      candidateItems = await prisma.openingPhrase.findMany({
        where: {
          ...baseWhere,
          category
        },
        take: 50
      });
    }

    // 4. Fallback: Lấy danh sách câu mào đầu ngẫu nhiên từ DB
    if (candidateItems.length === 0) {
      candidateItems = await prisma.openingPhrase.findMany({
        where: baseWhere,
        take: 50
      });
    }
  } catch (dbErr: any) {
    console.warn('[/api/opening-phrases/random] DB query warning:', dbErr?.message || dbErr);
  }

  // 5. Fallback in-memory nếu DB rỗng hoặc offline
  if (candidateItems.length === 0) {
    const list = (category && (LAO_GREETINGS_DB as any)[category]) || LAO_GREETINGS_DB.waiting_long || [];
    if (list.length > 0) {
      const randomText = list[Math.floor(Math.random() * list.length)];
      return NextResponse.json({
        data: {
          id: 'default_phrase_1',
          text: randomText,
          audioUrl: null,
          category: category || 'waiting_long',
          tags: []
        }
      });
    }
    return NextResponse.json({ data: null, message: 'Không có câu mào đầu nào' }, { status: 404 });
  }

  const item = candidateItems[Math.floor(Math.random() * candidateItems.length)];
  return NextResponse.json({ data: item });
}
