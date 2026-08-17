import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/authz';

function getUploadDirectories() {
  const dirs = [
    path.join(process.cwd(), 'public', 'uploads'),
    path.join(process.cwd(), 'uploads'),
    '/www/wwwroot/onglao.giac.ngo/public/uploads',
    '/www/wwwroot/onglao.giac.ngo/uploads',
  ];

  const validDirs: string[] = [];
  for (const dir of dirs) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      validDirs.push(dir);
    } catch (e) {}
  }
  return validDirs.length > 0 ? validDirs : [dirs[0]];
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authenticated) {
    return auth.errorResponse || NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'Thiếu file.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique name
    const ext = path.extname(file.name || '');
    const base = path.basename(file.name || 'file', ext);
    const cleanBase = base.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${cleanBase}_${Date.now()}${ext}`;

    // Ghi đồng bộ ra toàn bộ các thư mục uploads trên VPS Server
    const targetDirs = getUploadDirectories();
    for (const dir of targetDirs) {
      try {
        const filePath = path.join(dir, filename);
        fs.writeFileSync(filePath, buffer);
      } catch (err) {
        console.warn(`[admin/upload] Không thể ghi file vào ${dir}:`, err);
      }
    }

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error('[/api/admin/upload] error:', err);
    return NextResponse.json({ success: false, message: `Lỗi upload: ${err.message}` }, { status: 500 });
  }
}
