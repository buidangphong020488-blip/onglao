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

    // Sanitize path to prevent directory traversal
    const safePath = pathSegments.map(p => path.basename(p)).join('/');
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'uploads', safePath),
      path.join(process.cwd(), 'uploads', safePath),
      path.join('/www/wwwroot/onglao.giac.ngo/public/uploads', safePath),
      path.join('/www/wwwroot/onglao.giac.ngo/uploads', safePath),
    ];

    let filePath = candidatePaths.find(p => fs.existsSync(p));

    // Fallback: Nếu không tìm thấy theo đường dẫn chính xác (ví dụ: audio/gn_2/filename.wav), tìm theo tên tệp trong thư mục audio và các thư mục con
    if (!filePath || !fs.existsSync(filePath)) {
      const filename = path.basename(safePath);
      const fallbackCandidates = [
        path.join(process.cwd(), 'public', 'uploads', 'audio', filename),
        path.join(process.cwd(), 'uploads', 'audio', filename),
        path.join(process.cwd(), 'public', 'uploads', filename),
        path.join(process.cwd(), 'uploads', filename),
        path.join('/www/wwwroot/onglao.giac.ngo/public/uploads/audio', filename),
        path.join('/www/wwwroot/onglao.giac.ngo/uploads/audio', filename),
      ];
      filePath = fallbackCandidates.find(p => fs.existsSync(p));

      // Tìm kiếm sâu trong các subfolder của public/uploads nếu vẫn chưa thấy
      if (!filePath) {
        const audioBaseDir = path.join(process.cwd(), 'public', 'uploads', 'audio');
        if (fs.existsSync(audioBaseDir)) {
          try {
            const subdirs = fs.readdirSync(audioBaseDir, { withFileTypes: true });
            for (const sub of subdirs) {
              if (sub.isDirectory()) {
                const subPath = path.join(audioBaseDir, sub.name, filename);
                if (fs.existsSync(subPath)) {
                  filePath = subPath;
                  break;
                }
              }
            }
          } catch (e) {
            console.error('Error searching subdirs:', e);
          }
        }
      }
    }

    if (!filePath || !fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return new NextResponse('Not a file', { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.wav') contentType = 'audio/wav';
    else if (ext === '.mp3') contentType = 'audio/mpeg';
    else if (ext === '.ogg') contentType = 'audio/ogg';
    else if (ext === '.m4a') contentType = 'audio/mp4';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.webm') contentType = 'video/webm';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.webp') contentType = 'image/webp';
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
    console.error('Error serving upload file:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
