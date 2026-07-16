/**
 * GET  /api/giacngo/ai-configs                         — danh sách AI agents
 * GET  /api/giacngo/ai-configs?id=X                    — chi tiết AI config
 * GET  /api/giacngo/ai-configs?id=X&type=training-data — dữ liệu huấn luyện RAG
 */
import { NextRequest, NextResponse } from 'next/server';
import { giacNgoAiConfig, GiacNgoApiError } from '@/lib/giacngo';

function getToken(req: NextRequest): string | undefined {
  const auth = req.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const token = getToken(req);
    const id = req.nextUrl.searchParams.get('id');
    const type = req.nextUrl.searchParams.get('type');

    if (id) {
      if (type === 'training-data') {
        // Trả về dữ liệu huấn luyện RAG của AI config
        // Dùng service token phía server nếu client không có token
        const data = await giacNgoAiConfig.trainingData(id, token);
        return NextResponse.json(data, {
          headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
        });
      }
      const data = await giacNgoAiConfig.detail(id, token);
      return NextResponse.json(data);
    }

    const data = await giacNgoAiConfig.list(undefined, token);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=120' }, // cache 2 phút
    });
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[/api/giacngo/ai-configs]', err);
    return NextResponse.json({ message: 'Lỗi khi tải AI configs.' }, { status: 500 });
  }
}

