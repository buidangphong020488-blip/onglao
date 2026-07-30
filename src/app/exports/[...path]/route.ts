import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }

    const safePath = pathSegments.map(p => path.basename(p)).join('/');
    const filename = path.basename(safePath);

    const candidatePaths = [
      path.join(process.cwd(), 'public', 'exports', safePath),
      path.join(process.cwd(), 'exports', safePath),
      path.join(process.cwd(), 'public', 'exports', filename),
      path.join(process.cwd(), 'exports', filename),
      path.join('/www/wwwroot/onglao.giac.ngo/public/exports', safePath),
      path.join('/www/wwwroot/onglao.giac.ngo/exports', safePath),
      path.join('/www/wwwroot/onglao.giac.ngo/public/exports', filename),
      path.join('/www/wwwroot/onglao.giac.ngo/exports', filename),
    ];

    let filePath = candidatePaths.find(p => fs.existsSync(p));

    if (!filePath || !fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return new NextResponse('Not a file', { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'video/mp4';
    if (ext === '.webm') contentType = 'video/webm';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.json') contentType = 'application/json';

    const fileStream = fs.readFileSync(filePath);

    return new NextResponse(fileStream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (err: any) {
    console.error('Error serving export file:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
