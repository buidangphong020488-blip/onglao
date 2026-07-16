import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123';
function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-token') === ADMIN_PASSWORD;
}

// GET — public (cần để load khi tạo video)
export async function GET() {
  try {
    const list = await prisma.canhQuay.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(list);
  } catch {
    return NextResponse.json([]);
  }
}

// POST — upsert full list (admin)
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const list: any[] = await req.json();
    
    // Sync deletions: delete characters from database that are no longer in the list
    const ids = list.map(item => item.id);
    await prisma.canhQuay.deleteMany({
      where: {
        id: { notIn: ids }
      }
    });

    const parseJson = (val: any) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    };

    const results = await Promise.all(list.map(item =>
      prisma.canhQuay.upsert({
        where: { id: item.id },
        update: {
          name: item.name,
          assetsNgang: parseJson(item.assets?.ngang || item.assetsNgang || {}),
          assetsDoc: parseJson(item.assets?.doc || item.assetsDoc || {}),
          linkedIds: parseJson(item.linkedIds || null),
        },
        create: {
          id: item.id,
          name: item.name,
          assetsNgang: parseJson(item.assets?.ngang || item.assetsNgang || {}),
          assetsDoc: parseJson(item.assets?.doc || item.assetsDoc || {}),
          linkedIds: parseJson(item.linkedIds || null),
        },
      })
    ));
    return NextResponse.json({ success: true, data: results });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
