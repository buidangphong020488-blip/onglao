/**
 * POST /api/giacngo/chat
 * Chat với AI từ GiacNgo (JSON response)
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
    // Gọi trực tiếp API Giác Ngộ, nếu có lỗi thì throw trực tiếp để báo lỗi minh bạch
    const result = await giacNgoChat.sendJson(aiConfigId, message, token, language, undefined, spaceId ? Number(spaceId) : undefined);

    return NextResponse.json(result);
  } catch (err: any) {
    if (err instanceof GiacNgoApiError) {
      console.error('[/api/giacngo/chat error]', err.status, err.message);
      return NextResponse.json({ message: err.message, error: 'GiacNgoApiError', status: err.status }, { status: err.status });
    }
    console.error('[/api/giacngo/chat error]', err);
    return NextResponse.json({ message: err?.message || 'Lỗi khi gọi AI Giác Ngộ.', error: String(err) }, { status: 500 });
  }
}
