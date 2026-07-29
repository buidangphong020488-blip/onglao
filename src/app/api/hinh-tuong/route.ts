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
    console.error('Error fetching characters from DB (fallback to empty array):', error);
    return NextResponse.json([]);
  }
}
