import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const states = [
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
