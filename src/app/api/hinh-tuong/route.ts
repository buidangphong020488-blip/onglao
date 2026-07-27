import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const characters = await prisma.voicePersona.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(characters);
  } catch (error: any) {
    console.error('Error fetching characters from DB:', error);
    return NextResponse.json({ message: `Lỗi truy vấn CSDL PostgreSQL: ${error.message}` }, { status: 500 });
  }
}
