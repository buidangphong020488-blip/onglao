/**
 * src/lib/settings.ts
 * Quản lý cấu hình hệ thống — lưu trong PostgreSQL (bảng SystemSetting)
 * Fallback: đọc từ settings.json nếu DB chưa có giá trị (migration mượt)
 */
import prisma from './prisma';
export interface SystemSettings {
  apiKey: string;
  modelName: string;
  ttsModel: string;
  momoPhone: string;
  momoName: string;
  bankName: string;
  bankAccount: string;
  qrImageUrl: string;
  subscribeCodes: string;
  freeLimit: string;
  defaultAiConfigId?: string;
  characterStates?: string | any;
}

const DEFAULT_SETTINGS: SystemSettings = {
  apiKey: process.env.GEMINI_API_KEY || '',
  modelName: 'gemini-2.5-flash-preview-09-2025',
  ttsModel: 'gemini-2.5-flash-preview-tts',
  momoPhone: '',
  momoName: '',
  bankName: '',
  bankAccount: '',
  qrImageUrl: '',
  subscribeCodes: 'TAMVO2025,UNGDUNG888,THIENSUGD2025',
  freeLimit: '20',
  defaultAiConfigId: '1',
  characterStates: JSON.stringify([
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
]),
};


/**
 * Lấy toàn bộ settings từ DB (async)
 */
export async function getSystemSettingsAsync(): Promise<SystemSettings> {
  try {
    const rows = await prisma.systemSetting.findMany();
    if (rows.length === 0) {
      return DEFAULT_SETTINGS;
    }
    const dbMap: Record<string, string> = {};
    rows.forEach((r) => { dbMap[r.key] = r.value; });
    return { ...DEFAULT_SETTINGS, ...dbMap } as SystemSettings;
  } catch (err) {
    console.error('[settings] DB error:', err);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Lưu settings vào DB (upsert từng key)
 */
export async function saveSystemSettingsAsync(settings: Partial<SystemSettings>): Promise<SystemSettings> {
  const upserts = Object.entries(settings).map(([key, value]) =>
    prisma.systemSetting.upsert({
      where: { key },
      update: { value: String(value ?? '') },
      create: { key, value: String(value ?? '') },
    })
  );
  await Promise.all(upserts);
  return getSystemSettingsAsync();
}

/**
 * @deprecated Dùng getSystemSettingsAsync() thay thế.
 */
export function getSystemSettings(): SystemSettings {
  return DEFAULT_SETTINGS;
}

/**
 * @deprecated Dùng saveSystemSettingsAsync() thay thế.
 */
export function saveSystemSettings(settings: Partial<SystemSettings>): SystemSettings {
  // Đồng thời ghi DB (async, không chờ)
  saveSystemSettingsAsync(settings).catch(console.error);
  return { ...DEFAULT_SETTINGS, ...settings } as SystemSettings;
}

export function maskApiKey(key: string): string {
  if (!key) return '';
  if (key.length <= 10) return '******';
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}
