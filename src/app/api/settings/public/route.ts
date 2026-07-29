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
      laoVoiceStyle: settings.laoVoiceStyle || 'Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu',
      userVoiceName: settings.userVoiceName || 'Kore',
      userVoiceStyle: settings.userVoiceStyle || 'giọng thanh niên, phong cách đọc tỏ vẻ rối rắm, thắc mắc, chuẩn giọng miền Nam Việt Nam, đúng chính tả',
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
