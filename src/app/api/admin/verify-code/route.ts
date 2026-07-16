import { NextRequest, NextResponse } from 'next/server';
import { getSystemSettings } from '@/lib/settings';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ success: false, message: 'Thiếu mã kích hoạt.' }, { status: 400 });
    }

    const settings = getSystemSettings();
    const codes = settings.subscribeCodes
      .split(',')
      .map(c => c.trim().toUpperCase())
      .filter(Boolean);

    if (codes.includes(code.trim().toUpperCase())) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: 'Mã kích hoạt không đúng hoặc đã hết hạn.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
