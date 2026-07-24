import { NextResponse } from 'next/server';
import { getSystemSettingsAsync } from '@/lib/settings';

const DEFAULT_CHARACTER_STATES = [
  { id: 'binhthuong', name: 'Bình thường (Calm)' },
  { id: 'calm', name: 'Calm (Bình thường)' },
  { id: 'vui', name: 'Vui (Joy)' },
  { id: 'joy', name: 'Joy (Vui vẻ)' },
  { id: 'buon', name: 'Buồn (Sad)' },
  { id: 'sad', name: 'Sad (Buồn)' },
  { id: 'hook', name: 'Hook (Mào đầu)' },
  { id: 'intro', name: 'Intro (Mào đầu)' },
  { id: 'outro', name: 'Outro (Kết thúc)' },
  { id: 'outtro', name: 'Outtro (Kết thúc)' },
  { id: 'tuc_gian', name: 'Tức giận (Angry)' },
  { id: 'ngac_nhien', name: 'Ngạc nhiên (Surprise)' },
  { id: 'thiet_tha', name: 'Thiết tha (Earnest)' },
  { id: 'nghiem_tuc', name: 'Nghiêm túc (Serious)' },
  { id: 'tinh_thuc', name: 'Tỉnh thức (Awakened)' }
];

// GET — public API to fetch character states map
export async function GET() {
  try {
    const settings = await getSystemSettingsAsync();
    let states: any[] = [];
    if (settings.characterStates) {
      if (typeof settings.characterStates === 'string') {
        try {
          states = JSON.parse(settings.characterStates);
        } catch (e) {
          states = [];
        }
      } else if (Array.isArray(settings.characterStates)) {
        states = settings.characterStates;
      }
    }

    if (!Array.isArray(states) || states.length === 0) {
      states = DEFAULT_CHARACTER_STATES;
    } else {
      // Merge defaults if DB states only has subset
      const existingIds = new Set(states.map((s: any) => s.id));
      DEFAULT_CHARACTER_STATES.forEach(ds => {
        if (!existingIds.has(ds.id)) {
          states.push(ds);
        }
      });
    }

    return NextResponse.json(states);
  } catch (err) {
    console.error('Lỗi khi lấy từ điển trạng thái:', err);
    return NextResponse.json(DEFAULT_CHARACTER_STATES);
  }
}
