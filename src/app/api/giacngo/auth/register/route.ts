/**
 * POST /api/giacngo/auth/register
 * Proxy đăng ký → GiacNgo /api/auth/register
 */
import { NextRequest, NextResponse } from 'next/server';
import { giacNgoAuth, GiacNgoApiError } from '@/lib/giacngo';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Tên, email và mật khẩu là bắt buộc.' }, { status: 400 });
    }
    const user = await giacNgoAuth.register(name, email, password);
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    if (err instanceof GiacNgoApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[/api/giacngo/auth/register]', err);
    return NextResponse.json({ message: 'Lỗi server khi đăng ký.' }, { status: 500 });
  }
}
