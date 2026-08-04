import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import ffmpegPath from 'ffmpeg-static';

const execAsync = promisify(exec);

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

    // Nếu không tìm thấy tệp default_video.mp4 trên đĩa, tự động tạo tệp MP4 mẫu bằng FFmpeg
    if ((!filePath || !fs.existsSync(filePath)) && (filename === 'default_video.mp4' || filename.includes('default'))) {
      const defaultExportDir = path.join(process.cwd(), 'public', 'exports');
      const defaultVideoPath = path.join(defaultExportDir, 'default_video.mp4');
      try {
        if (!fs.existsSync(defaultExportDir)) {
          fs.mkdirSync(defaultExportDir, { recursive: true });
        }
        const ffmpegBin = ffmpegPath || 'ffmpeg';
        await execAsync(`"${ffmpegBin}" -y -f lavfi -i color=c=black:s=1280x720:d=3 -f lavfi -i anullsrc=r=44100:cl=stereo -t 3 -c:v libx264 -c:a aac "${defaultVideoPath}"`);
        if (fs.existsSync(defaultVideoPath)) {
          filePath = defaultVideoPath;
        }
      } catch (genErr) {
        console.error('Lỗi khi tự tạo default_video.mp4:', genErr);
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
