import { NextRequest, NextResponse } from 'next/server';
import { getSystemSettingsAsync } from '@/lib/settings';

export async function GET(req: NextRequest) {
  try {
    const settings = await getSystemSettingsAsync();
    return NextResponse.json({
      modelName: settings.modelName,
      ttsModel: settings.ttsModel,
      momoPhone: settings.momoPhone,
      momoName: settings.momoName,
      bankName: settings.bankName,
      bankAccount: settings.bankAccount,
      qrImageUrl: settings.qrImageUrl,
      freeLimit: settings.freeLimit,
      defaultLogoUrl: settings.defaultLogoUrl || '',
      defaultAiConfigId: settings.defaultAiConfigId || '1',
      characterStates: settings.characterStates || '[]',
      laoVoiceName: settings.laoVoiceName || 'Algieba',
      laoVoiceStyle: settings.laoVoiceStyle || 'Trầm ấm, từ hòa, thong dong, minh triết, từ tốn, ngắt nhịp rõ ràng',
      userVoiceName: settings.userVoiceName || 'Kore',
      userVoiceStyle: settings.userVoiceStyle || 'Lắng đọng, kính cẩn, chân thành, nhẹ nhàng, tìm cầu đạo lý',
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
