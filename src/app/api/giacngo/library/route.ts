/**
 * GET /api/giacngo/library          — danh sách tài liệu
 * GET /api/giacngo/library?type=sidebar    — sidebar data
 * GET /api/giacngo/library?type=filters    — bộ lọc
 * GET /api/giacngo/library?type=recommended — đề xuất
 * GET /api/giacngo/library?type=topics     — topics
 */
import { NextRequest, NextResponse } from 'next/server';
import { giacNgoLibrary, GiacNgoApiError } from '@/lib/giacngo';

function getToken(req: NextRequest): string | undefined {
  const auth = req.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const token = getToken(req);
    const type = req.nextUrl.searchParams.get('type');

    let data: unknown;
    switch (type) {
      case 'sidebar':
        data = await giacNgoLibrary.sidebar(token);
        break;
      case 'filters':
        data = await giacNgoLibrary.filters(token);
        break;
      case 'recommended':
        data = await giacNgoLibrary.recommended(token);
        break;
      case 'topics':
        data = await giacNgoLibrary.topics(token);
        break;
      default:
        data = await giacNgoLibrary.list(token);
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60', // cache 5 phút
      },
    });
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[/api/giacngo/library]', err);
    return NextResponse.json({ message: 'Lỗi khi tải thư viện.' }, { status: 500 });
  }
}
