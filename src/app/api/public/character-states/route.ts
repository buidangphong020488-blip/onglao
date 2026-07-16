import { NextResponse } from 'next/server';
import { getSystemSettingsAsync } from '@/lib/settings';

// GET — public API to fetch character states map
export async function GET() {
  try {
    const settings = await getSystemSettingsAsync();
    let states = [];
    if (settings.characterStates) {
      if (typeof settings.characterStates === 'string') {
        states = JSON.parse(settings.characterStates);
      } else {
        states = settings.characterStates;
      }
    }
    return NextResponse.json(states);
  } catch (err) {
    console.error('Lỗi khi lấy từ điển trạng thái:', err);
    return NextResponse.json([]);
  }
}
