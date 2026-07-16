/**
 * POST /api/giacngo/tts
 * Proxy TTS generation qua GiacNgo /api/system/tts/generate
 * Trả về { audioContent: string (base64), mimeType: string }
 *
 * Body: {
 *   text: string,
 *   provider: 'gemini' | 'gpt',
 *   model: string,           // e.g. 'gemini-2.5-flash-preview-tts'
 *   voice?: string,
 *   lang?: string,
 *   userId: number,
 *   styleInstruction?: string,
 *   temperature?: number,
 *   aiId?: number,
 *   spaceId?: number
 * }
 */
import { NextRequest, NextResponse } from 'next/server';
import { giacNgoTts, GiacNgoApiError } from '@/lib/giacngo';

function getToken(req: NextRequest): string | undefined {
  const auth = req.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
}

export async function POST(req: NextRequest) {
  try {
    const token = getToken(req) || undefined;

    const body = await req.json();
    const { text, aiConfigId, aiId } = body;
    const resolvedAiConfigId = aiConfigId || aiId;

    if (!text || !resolvedAiConfigId) {
      return NextResponse.json(
        { message: 'Thiếu các trường bắt buộc: text và (aiConfigId hoặc aiId).' },
        { status: 400 }
      );
    }

    const result = await giacNgoTts.generate(
      { text, aiConfigId: resolvedAiConfigId },
      token
    );

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[/api/giacngo/tts]', err);
    return NextResponse.json({ message: 'Lỗi TTS.' }, { status: 500 });
  }
}
