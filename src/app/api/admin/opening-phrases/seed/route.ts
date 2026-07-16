import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LAO_GREETINGS_DB } from '@/components/onglao/constants';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123';
function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-token') === ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    // Flatten tất cả categories thành 1 mảng câu
    const allPhrases: { text: string; category: string }[] = [];
    for (const [category, phrases] of Object.entries(LAO_GREETINGS_DB)) {
      if (Array.isArray(phrases)) {
        for (const text of phrases) {
          if (typeof text === 'string' && text.trim()) {
            allPhrases.push({ text: text.trim(), category });
          }
        }
      }
    }

    // Lấy tất cả text đã có trong DB để skip trùng
    const existing = await prisma.openingPhrase.findMany({ select: { text: true } });
    const existingSet = new Set(existing.map(e => e.text.trim()));

    const toInsert = allPhrases.filter(p => !existingSet.has(p.text));

    if (toInsert.length > 0) {
      await prisma.openingPhrase.createMany({
        data: toInsert.map(p => ({ text: p.text, category: p.category, isActive: true })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ success: true, inserted: toInsert.length, skipped: allPhrases.length - toInsert.length });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
