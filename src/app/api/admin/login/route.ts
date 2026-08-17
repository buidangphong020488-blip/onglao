import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit('admin_login_attempt', 5, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Đăng nhập sai quá nhiều lần. Vui lòng chờ 1 phút.' },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();
    const expectedUser = process.env.ADMIN_USER || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD;

    if (!expectedPass) {
      console.error('[Admin Login] Lỗi cấu hình: Biến ADMIN_PASSWORD chưa được thiết lập trong .env!');
      return NextResponse.json(
        { success: false, message: 'Hệ thống quản trị chưa được cấu hình mật khẩu an toàn.' },
        { status: 500 }
      );
    }
    
    if (username === expectedUser && password === expectedPass) {
      return NextResponse.json({ success: true, token: expectedPass });
    }
    return NextResponse.json(
      { success: false, message: 'Sai tài khoản hoặc mật khẩu.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: `Lỗi đăng nhập: ${err.message}` },
      { status: 500 }
    );
  }
}
