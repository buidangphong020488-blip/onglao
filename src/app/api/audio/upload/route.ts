import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('audio') as File | null;
    
    if (!file) {
      return NextResponse.json({ message: 'Thiếu file audio.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tạo thư mục lưu trữ nếu chưa có
    const uploadDir = path.join(process.cwd(), 'public/uploads/audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Đặt tên file theo tên gửi lên hoặc UUID ngẫu nhiên
    const filename = file.name || `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.wav`;
    const filePath = path.join(uploadDir, filename);

    // Ghi file ra ổ đĩa
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/audio/${filename}`;
    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    console.error('[/api/audio/upload] error:', err);
    return NextResponse.json({ message: `Lỗi upload: ${err.message}` }, { status: 500 });
  }
}
