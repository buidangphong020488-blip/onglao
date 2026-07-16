import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const expectedUser = process.env.ADMIN_USER || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'admin@123';
    
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
