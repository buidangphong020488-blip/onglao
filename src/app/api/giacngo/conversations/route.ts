/**
 * GET /api/giacngo/conversations  — danh sách hội thoại của user
 */
import { NextRequest, NextResponse } from 'next/server';
import { giacNgoChat, GiacNgoApiError } from '@/lib/giacngo';

function getToken(req: NextRequest): string | undefined {
  const auth = req.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const token = getToken(req);
    if (!token) return NextResponse.json({ message: 'Chưa đăng nhập.' }, { status: 401 });
    const data = await giacNgoChat.listConversations(token);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[/api/giacngo/conversations]', err);
    return NextResponse.json({ message: 'Lỗi khi tải lịch sử.' }, { status: 500 });
  }
}
