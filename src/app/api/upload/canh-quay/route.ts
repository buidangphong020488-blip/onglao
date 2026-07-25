import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getUploadDir() {
  const candidateDirs = [
    path.join(process.cwd(), 'public', 'uploads', 'canhquay'),
    '/www/wwwroot/onglao.giac.ngo/public/uploads/canhquay',
    '/www/wwwroot/onglao.giac.ngo/uploads/canhquay',
  ];

  // Ưu tiên thư mục đã tồn tại, nếu chưa có thư mục nào thì tạo ở candidate 0 hoặc candidate 1 nếu đang trên VPS
  for (const dir of candidateDirs) {
    if (fs.existsSync(dir)) return dir;
  }

  // Nếu là môi trường Linux/aaPanel
  if (fs.existsSync('/www/wwwroot/onglao.giac.ngo')) {
    const vpsDir = '/www/wwwroot/onglao.giac.ngo/public/uploads/canhquay';
    fs.mkdirSync(vpsDir, { recursive: true });
    return vpsDir;
  }

  const defaultDir = candidateDirs[0];
  fs.mkdirSync(defaultDir, { recursive: true });
  return defaultDir;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ message: 'Thiếu file tải lên.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = getUploadDir();

    const ext = path.extname(file.name) || (file.type.includes('image') ? '.jpg' : '.mp4');
    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Ghi file ra ổ cứng
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/api/files/canhquay/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error('[/api/upload/canh-quay] error:', err);
    return NextResponse.json({ success: false, message: `Lỗi upload: ${err.message}` }, { status: 500 });
  }
}
