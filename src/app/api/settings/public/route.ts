import { NextRequest, NextResponse } from 'next/server';
import { getSystemSettings } from '@/lib/settings';

export async function GET(req: NextRequest) {
  try {
    const settings = getSystemSettings();
    return NextResponse.json({
      modelName: settings.modelName,
      ttsModel: settings.ttsModel,
      momoPhone: settings.momoPhone,
      momoName: settings.momoName,
      bankName: settings.bankName,
      bankAccount: settings.bankAccount,
      qrImageUrl: settings.qrImageUrl,
      freeLimit: settings.freeLimit,
      defaultAiConfigId: settings.defaultAiConfigId || '1',
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
