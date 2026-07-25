import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// API route serve file tĩnh từ public/uploads/canhquay/ 
// Dò tìm trên nhiều đường dẫn khả thi (bao gồm standalone build & aaPanel paths)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  if (!filename) {
    return new NextResponse('Not found', { status: 404 });
  }

  // Sanitize: chỉ lấy tên file an toàn
  const safeName = path.basename(filename);
  if (!safeName || safeName.includes('..')) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  // Danh sách các vị trí thư mục lưu file có thể có trên server VPS & Local
  const possibleDirs = [
    path.join(process.cwd(), 'public', 'uploads', 'canhquay'),
    path.join(process.cwd(), 'uploads', 'canhquay'),
    path.join(process.cwd(), '..', 'public', 'uploads', 'canhquay'),
    path.join(process.cwd(), '..', '..', 'public', 'uploads', 'canhquay'),
    '/www/wwwroot/onglao.giac.ngo/public/uploads/canhquay',
    '/www/wwwroot/onglao.giac.ngo/uploads/canhquay',
  ];

  let filePath = '';
  for (const dir of possibleDirs) {
    const testPath = path.join(dir, safeName);
    if (fs.existsSync(testPath)) {
      filePath = testPath;
      break;
    }
  }

  if (!filePath) {
    console.error(`[/api/files/canhquay] File not found anywhere: ${safeName}. Checked dirs:`, possibleDirs);
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(safeName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg':  'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png':  'image/png',
      '.gif':  'image/gif',
      '.webp': 'image/webp',
      '.mp4':  'video/mp4',
      '.mov':  'video/quicktime',
      '.webm': 'video/webm',
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error('[/api/files/canhquay] read error:', err);
    return new NextResponse('Server error: ' + err.message, { status: 500 });
  }
}
