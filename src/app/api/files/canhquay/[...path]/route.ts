import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathArray = resolvedParams?.path || [];
  
  if (!pathArray || pathArray.length === 0) {
    return new NextResponse('Not found', { status: 404 });
  }

  const rawFilename = pathArray[pathArray.length - 1];
  const safeName = path.basename(rawFilename);

  if (!safeName || safeName.includes('..')) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  const possibleDirs = [
    path.join(process.cwd(), 'public', 'uploads', 'canhquay'),
    path.join(process.cwd(), 'uploads', 'canhquay'),
    path.join(process.cwd(), 'public', 'uploads'),
    path.join(process.cwd(), 'uploads'),
    path.join(process.cwd(), '..', 'public', 'uploads', 'canhquay'),
    path.join(process.cwd(), '..', '..', 'public', 'uploads', 'canhquay'),
    '/www/wwwroot/onglao.giac.ngo/public/uploads/canhquay',
    '/www/wwwroot/onglao.giac.ngo/uploads/canhquay',
    '/www/wwwroot/onglao.giac.ngo/public/uploads',
    '/www/wwwroot/onglao.giac.ngo/uploads',
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
    return new NextResponse(`File not found: ${safeName}`, { status: 404 });
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
