import { NextRequest, NextResponse } from 'next/server';
import { getSystemSettings } from '@/lib/settings';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;
    if (!prompt) {
      return NextResponse.json({ message: 'Thiếu trường prompt.' }, { status: 400 });
    }

    const settings = getSystemSettings();
    const apiKey = settings.apiKey || process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
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
