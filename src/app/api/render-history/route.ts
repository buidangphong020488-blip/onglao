import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'render_history' }
    });
    const history = setting?.value ? JSON.parse(setting.value) : [];
    return NextResponse.json({ success: true, data: history });
  } catch (error: any) {
    console.error('Error fetching render history from DB:', error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.id) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'render_history' }
    });

    let history: any[] = setting?.value ? JSON.parse(setting.value) : [];
    
    // Check if already exists
    const idx = history.findIndex(h => h.id === body.id);
    if (idx !== -1) {
      history[idx] = { ...history[idx], ...body };
    } else {
      history.unshift(body);
    }

    // Limit history to 50 entries
    if (history.length > 50) history = history.slice(0, 50);

    await prisma.systemSetting.upsert({
      where: { key: 'render_history' },
      update: { value: JSON.stringify(history) },
      create: { key: 'render_history', value: JSON.stringify(history) }
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error: any) {
    console.error('Error saving render history to DB:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
    }

    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'render_history' }
    });

    let history: any[] = setting?.value ? JSON.parse(setting.value) : [];
    history = history.filter(h => h.id !== id);

    await prisma.systemSetting.upsert({
      where: { key: 'render_history' },
      update: { value: JSON.stringify(history) },
      create: { key: 'render_history', value: JSON.stringify(history) }
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error: any) {
    console.error('Error deleting render history from DB:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
