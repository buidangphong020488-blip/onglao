/**
 * POST /api/giacngo/auth/login
 * Proxy đăng nhập → GiacNgo /api/auth/login
 */
import { NextRequest, NextResponse } from 'next/server';
import { giacNgoAuth, GiacNgoApiError } from '@/lib/giacngo';

export async function POST(req: NextRequest) {
  try {
    const { email, password, context, spaceSlug } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'email và password là bắt buộc.' }, { status: 400 });
    }
    const user = await giacNgoAuth.login(email, password, context, spaceSlug);
    return NextResponse.json(user);
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[/api/giacngo/auth/login]', err);
    return NextResponse.json({ message: 'Lỗi server khi đăng nhập.' }, { status: 500 });
  }
}
