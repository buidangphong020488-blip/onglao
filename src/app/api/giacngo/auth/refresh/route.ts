/**
 * POST /api/giacngo/auth/refresh
 * Refresh access token dùng refreshToken (api_token dài hạn từ DB GiacNgo)
 */
import { NextRequest, NextResponse } from 'next/server';
import { giacNgoAuth, GiacNgoApiError } from '@/lib/giacngo';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return NextResponse.json({ message: 'refreshToken là bắt buộc.' }, { status: 400 });
    }
    const result = await giacNgoAuth.refreshToken(refreshToken);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: 'Lỗi server.' }, { status: 500 });
  }
}
