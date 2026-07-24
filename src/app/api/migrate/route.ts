import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const states = [
  {
    "id": "calm",
    "name": "🎙️ Bình thường (Calm)",
    "emotion": "calm",
    "text": "Trạng thái bình thường, điềm tĩnh"
  },
  {
    "id": "joy",
    "name": "😊 Vui vẻ (Joy)",
    "emotion": "joy",
    "text": "Trạng thái hoan hỷ, vui vẻ, an lạc"
  },
  {
    "id": "sad",
    "name": "😢 Buồn bế tắc (Sad)",
    "emotion": "sad",
    "text": "Trạng thái ưu tư, trăn trở, bế tắc"
  },
  {
    "id": "angry",
    "name": "😡 Tức giận (Angry)",
    "emotion": "angry",
    "text": "Trạng thái giận dữ, bất bình, đổ lỗi"
  },
  {
    "id": "surprise",
    "name": "😲 Ngạc nhiên (Surprise)",
    "emotion": "surprise",
    "text": "Trạng thái ngỡ ngàng, giật mình"
  },
  {
    "id": "earnest",
    "name": "🙏 Thiết tha (Earnest)",
    "emotion": "earnest",
    "text": "Trạng thái tha thiết, lắng đọng"
  },
  {
    "id": "serious",
    "name": "⚡ Nghiêm túc (Serious)",
    "emotion": "serious",
    "text": "Trạng thái sắc bén, thẳng thắn"
  },
  {
    "id": "awakened",
    "name": "✨ Tỉnh thức (Awakened)",
    "emotion": "awakened",
    "text": "Trạng thái bừng sáng, tỉnh mộng"
  }
];

    const value = JSON.stringify(states);

    await prisma.systemSetting.upsert({
      where: { key: 'characterStates' },
      update: { value },
      create: { key: 'characterStates', value }
    });

    return NextResponse.json({ success: true, seededStatesCount: states.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
