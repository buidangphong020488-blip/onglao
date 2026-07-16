import { NextRequest, NextResponse } from 'next/server';
import { callGiacNgo, GiacNgoApiError } from '@/lib/giacngo';

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get('spaceId') || process.env.GIACNGO_SPACE_ID || '1';

    const limit = searchParams.get('limit') || '10';
    const page = searchParams.get('page') || '1';

    const data = await callGiacNgo(`/api/v1/documents?spaceId=${spaceId}&limit=${limit}&page=${page}`, { token });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[/api/giacngo/documents]', err);
    return NextResponse.json({ message: 'Lỗi khi tải tài liệu.' }, { status: 500 });
  }
}
