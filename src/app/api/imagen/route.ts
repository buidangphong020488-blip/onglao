import { NextRequest, NextResponse } from 'next/server';
import { getSystemSettingsAsync, getApiKeyList, getRotatedApiKey } from '@/lib/settings';
import { authenticateUser } from '@/lib/authz';
import { checkRateLimit } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated || !auth.user) {
      return auth.errorResponse!;
    }

    const rateCheck = checkRateLimit(`imagen:${auth.user.id}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Bạn đã vượt quá giới hạn tạo ảnh AI (10 ảnh/phút). Vui lòng thử lại sau.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { prompt } = body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ message: 'Thiếu trường prompt.' }, { status: 400 });
    }
    if (prompt.length > 2000) {
      return NextResponse.json({ message: 'Prompt vượt quá độ dài tối đa 2000 ký tự.' }, { status: 400 });
    }

    const settings = await getSystemSettingsAsync();
    const apiKeyList = getApiKeyList(settings.apiKey);
    const apiKey = getRotatedApiKey(settings.apiKey);

    if (apiKeyList.length === 0) {
      return NextResponse.json(
        { message: 'Chưa cấu hình Gemini API Key trên hệ thống.' },
        { status: 401 }
      );
    }

    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1 }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[/api/imagen] Google API error:', errText);
      return NextResponse.json(
        { message: `Lỗi tạo ảnh AI: ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[/api/imagen] error:', err);
    return NextResponse.json({ message: `Lỗi: ${err.message}` }, { status: 500 });
  }
}
