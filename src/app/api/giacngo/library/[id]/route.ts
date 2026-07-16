/**
 * GET /api/giacngo/library/[id]  — chi tiết tài liệu
 */
import { NextRequest, NextResponse } from 'next/server';
import { giacNgoLibrary, GiacNgoApiError } from '@/lib/giacngo';

function getToken(req: NextRequest): string | undefined {
  const auth = req.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = getToken(req);
    const data = await giacNgoLibrary.detail(id, token);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=600' },
    });
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[/api/giacngo/library/[id]]', err);
    return NextResponse.json({ message: 'Lỗi khi tải tài liệu.' }, { status: 500 });
  }
}
