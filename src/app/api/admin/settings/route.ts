import { NextRequest, NextResponse } from 'next/server';
import { getSystemSettingsAsync, saveSystemSettingsAsync, maskApiKey } from '@/lib/settings';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123';

function checkAuth(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token');
  return token === ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const settings = await getSystemSettingsAsync();
  return NextResponse.json({
    ...settings,
    apiKey: maskApiKey(settings.apiKey),
  });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const currentSettings = await getSystemSettingsAsync();

    // Nếu apiKey bị mask (có "...") hoặc là placeholder thì giữ key cũ
    let newApiKey = body.apiKey;
    const currentMasked = maskApiKey(currentSettings.apiKey);
    if (newApiKey === currentMasked || newApiKey === '******' || (newApiKey && newApiKey.includes('...'))) {
      newApiKey = currentSettings.apiKey;
    }

    const updated = await saveSystemSettingsAsync({
      ...body,
      apiKey: newApiKey,
    });

    return NextResponse.json({
      ...updated,
      apiKey: maskApiKey(updated.apiKey),
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
