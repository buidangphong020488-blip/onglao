/**
 * POST /api/giacngo/chat/stream
 * Forward SSE stream từ GiacNgo /api/conversations/chat → client
 *
 * Body: {
 *   aiConfigId?: number,
 *   aiConfig?: object,       // Hoặc pass thẳng aiConfig object
 *   messages: [{id, sender, text, timestamp}],
 *   conversationId?: string,
 *   language?: string,
 *   guestTurnCount?: number
 * }
 */
import { NextRequest, NextResponse } from 'next/server';
import { streamFromGiacNgo, GiacNgoApiError } from '@/lib/giacngo';

function getToken(req: NextRequest): string | undefined {
  const auth = req.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = getToken(req);

    body.stream = true;
    const giacNgoRes = await streamFromGiacNgo('/api/v1/chat', {
      method: 'POST',
      body,
      token,
    });

    if (!giacNgoRes.ok) {
      const errText = await giacNgoRes.text();
      return NextResponse.json(
        { message: errText || 'GiacNgo chat error' },
        { status: giacNgoRes.status }
      );
    }

    // Pipe SSE stream về client
    return new NextResponse(giacNgoRes.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no', // tắt Nginx buffering nếu có
      },
    });
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[/api/giacngo/chat/stream]', err);
    return NextResponse.json({ message: 'Lỗi khi stream AI.' }, { status: 500 });
  }
}
