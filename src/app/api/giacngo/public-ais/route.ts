import { NextRequest, NextResponse } from 'next/server';
import { callGiacNgo, GiacNgoApiError } from '@/lib/giacngo';

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') || '';
    const userToken = auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
    const searchParams = req.nextUrl.searchParams;
    const spaceId = searchParams.get('spaceId') || process.env.GIACNGO_SPACE_ID || '1';

    // Thử lấy từ /api/ai-configs với spaceId filter trước
    // Nếu GiacNgo không filter → fallback sang /api/v1/public-ais với service token
    let list: any[] = [];

    try {
      const data = await callGiacNgo<any[]>('/api/ai-configs', {
        method: 'POST',
        body: { spaceId: Number(spaceId) },
        token: userToken,
      });
      if (Array.isArray(data) && data.length > 0) {
        // Filter theo spaceId nếu API trả về field spaceId
        const filtered = data.filter(a => !a.spaceId || String(a.spaceId) === String(spaceId));
        list = filtered.length > 0 ? filtered : data;
      }
    } catch {
      // fallback: dùng endpoint public
      const data = await callGiacNgo<any>(`/api/v1/public-ais?spaceId=${spaceId}`, {
        token: userToken,
        // service token được dùng tự động nếu userToken undefined
      });
      list = Array.isArray(data) ? data : (data?.data ?? []);
    }

    return NextResponse.json(list);
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[/api/giacngo/public-ais]', err);
    return NextResponse.json({ message: 'Lỗi khi tải danh sách AI.' }, { status: 500 });
  }
}
