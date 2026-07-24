import { NextResponse } from 'next/server';
import { getSystemSettingsAsync } from '@/lib/settings';

const DEFAULT_CHARACTER_STATES = [
  {
    "id": "binhthuong",
    "name": "🎙️ Bình thường (Calm)",
    "emotion": "calm",
    "text": "Trạng thái bình thường, điềm tĩnh"
  },
  {
    "id": "calm",
    "name": "🎙️ Calm (Bình thường)",
    "emotion": "calm",
    "text": "Trạng thái điềm tĩnh, trung tính"
  },
  {
    "id": "vui",
    "name": "😊 Vui vẻ (Joy)",
    "emotion": "joy",
    "text": "Trạng thái hoan hỷ, vui vẻ, an lạc"
  },
  {
    "id": "joy",
    "name": "😊 Joy (Vui vẻ)",
    "emotion": "joy",
    "text": "Trạng thái vui tươi, phấn khởi"
  },
  {
    "id": "buon",
    "name": "😢 Buồn bế tắc (Sad)",
    "emotion": "sad",
    "text": "Trạng thái ưu tư, trăn trở, bế tắc"
  },
  {
    "id": "sad",
    "name": "😢 Sad (Buồn bế tắc)",
    "emotion": "sad",
    "text": "Trạng thái u buồn, sầu não"
  },
  {
    "id": "tuc_gian",
    "name": "😡 Tức giận (Angry)",
    "emotion": "angry",
    "text": "Trạng thái giận dữ, bất bình, đổ lỗi"
  },
  {
    "id": "ngac_nhien",
    "name": "😲 Ngạc nhiên (Surprise)",
    "emotion": "surprise",
    "text": "Trạng thái ngỡ ngàng, giật mình"
  },
  {
    "id": "thiet_tha",
    "name": "🙏 Thiết tha (Earnest)",
    "emotion": "earnest",
    "text": "Trạng thái tha thiết, lắng đọng"
  },
  {
    "id": "nghiem_tuc",
    "name": "⚡ Nghiêm túc (Serious)",
    "emotion": "serious",
    "text": "Trạng thái sắc bén, thẳng thắn"
  },
  {
    "id": "tinh_thuc",
    "name": "✨ Tỉnh thức (Awakened)",
    "emotion": "awakened",
    "text": "Trạng thái bừng sáng, tỉnh mộng"
  }
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

    const cleanStates = states.filter((s: any) => !['hook', 'intro', 'outro', 'outtro'].includes(s.id) && !['hook', 'outro'].includes(s.emotion));
    return NextResponse.json(cleanStates);
  } catch (err) {
    console.error('Lỗi khi lấy từ điển trạng thái:', err);
    return NextResponse.json(DEFAULT_CHARACTER_STATES);
  }
}
