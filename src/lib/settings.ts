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

export const DEFAULT_CHARACTER_STATES = [
  { id: 'calm', name: '😐 Bình thường / Calm', aliases: ['calm', 'binhthuong', 'bình thường', 'thuong'] },
  { id: 'sad', name: '😢 Buồn & Bế tắc / Sad', aliases: ['sad', 'buon', 'buồn', 'khoc', 'khóc', 'be_tac', 'bế tắc'] },
  { id: 'joy', name: '😊 Vui vẻ & Hạnh phúc / Joy', aliases: ['joy', 'vui', 'vui vẻ', 'vui_ve', 'cuoi', 'cười', 'hanh_phuc'] },
  { id: 'hook', name: '🔥 Cảnh Mào đầu / Intro (Hook)', aliases: ['hook', 'intro', 'mao_dau', 'mào đầu', 'bat_dau', 'bắt đầu'] },
  { id: 'outro', name: '🎬 Cảnh Kết thúc / Outro (Ending)', aliases: ['outro', 'ending', 'kethuc', 'kết thúc', 'vailay', 'vái lạy'] }
];

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
  characterStates: JSON.stringify(DEFAULT_CHARACTER_STATES),
};


/**
 * Lấy toàn bộ settings từ DB (async)
 */
export async function getSystemSettingsAsync(): Promise<SystemSettings> {
  try {
    const rows = await prisma.systemSetting.findMany();
    if (rows.length === 0) {
      // DB trống
      await saveSystemSettingsAsync(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    const dbMap: Record<string, string> = {};
    rows.forEach((r) => { dbMap[r.key] = r.value; });
    if (!dbMap.characterStates || dbMap.characterStates === '[]') {
      dbMap.characterStates = JSON.stringify(DEFAULT_CHARACTER_STATES);
      await prisma.systemSetting.upsert({
        where: { key: 'characterStates' },
        update: { value: dbMap.characterStates },
        create: { key: 'characterStates', value: dbMap.characterStates },
      });
    }
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
