/**
 * GET  /api/giacngo/auth/me  — lấy thông tin user hiện tại
 * PUT  /api/giacngo/auth/me  — cập nhật profile
 * POST /api/giacngo/auth/me  — đổi mật khẩu (forward tới /api/auth/change-password)
 */
import { NextRequest, NextResponse } from 'next/server';
import { giacNgoAuth, callGiacNgo, GiacNgoApiError } from '@/lib/giacngo';

function getToken(req: NextRequest): string | undefined {
  const auth = req.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const token = getToken(req);
    if (!token) return NextResponse.json({ message: 'Chưa đăng nhập.' }, { status: 401 });
    const user = await giacNgoAuth.me(token);
    return NextResponse.json(user);
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: 'Lỗi server.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = getToken(req);
    if (!token) return NextResponse.json({ message: 'Chưa đăng nhập.' }, { status: 401 });
    const body = await req.json();
    const result = await callGiacNgo('/api/auth/profile', { method: 'PUT', body, token });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: 'Lỗi server.' }, { status: 500 });
  }
}
