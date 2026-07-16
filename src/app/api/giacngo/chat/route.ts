/**
 * POST /api/giacngo/chat
 * Chat với AI từ GiacNgo (JSON response)
 *
 * Body: {
 *   aiConfigId: number,
 *   message: string,
 *   language?: string  // 'vi' | 'en' | ...
 * }
 */
import { NextRequest, NextResponse } from 'next/server';
import { giacNgoChat, GiacNgoApiError } from '@/lib/giacngo';

function getToken(req: NextRequest): string | undefined {
  const auth = req.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { aiConfigId, message, language = 'vi', spaceId } = body;

    // Fallback nếu Client bị mất aiConfigId (VD: do chưa lấy được public-ais từ .env chưa nạp)
    if (!aiConfigId) {
      aiConfigId = process.env.GIACNGO_DEFAULT_AI_CONFIG_ID || 1;
    }

    if (!message) {
      return NextResponse.json(
        { message: 'message là bắt buộc.' },
        { status: 400 }
      );
    }

    const token = getToken(req);
    const result = await giacNgoChat.sendJson(aiConfigId, message, token, language, undefined, spaceId ? Number(spaceId) : undefined);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[/api/giacngo/chat]', err);
    return NextResponse.json({ message: 'Lỗi khi gọi AI.' }, { status: 500 });
  }
}
