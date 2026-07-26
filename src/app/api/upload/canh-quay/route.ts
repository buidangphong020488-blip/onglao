import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import ffmpegPath from 'ffmpeg-static';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

function getUploadDir() {
  const candidateDirs = [
    path.join(process.cwd(), 'public', 'uploads', 'canhquay'),
    '/www/wwwroot/onglao.giac.ngo/public/uploads/canhquay',
    '/www/wwwroot/onglao.giac.ngo/uploads/canhquay',
  ];

  for (const dir of candidateDirs) {
    if (fs.existsSync(dir)) return dir;
  }

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

    const isVideo = file.type.includes('video') || /\.(mp4|mov|webm|avi|mkv)$/i.test(file.name);
    const ext = path.extname(file.name) || (isVideo ? '.mp4' : '.jpg');
    const baseName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const filename = `${baseName}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // 1. Ghi file gốc ra ổ cứng
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/api/files/canhquay/${filename}`;
    let publicThumbUrl = publicUrl;

    // 2. Nếu là video, tự động chạy FFmpeg trích xuất Thumbnail .jpg ngầm
    if (isVideo) {
      let ffmpegBin = ffmpegPath;
      try {
        const { stdout } = await execAsync('ffmpeg -version');
        if (stdout && stdout.includes('ffmpeg version')) {
          ffmpegBin = 'ffmpeg';
        }
      } catch (e) {}

      if (ffmpegBin !== 'ffmpeg') {
        if (!ffmpegBin || !fs.existsSync(ffmpegBin)) {
          const isWin = process.platform === 'win32';
          const candidate = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', isWin ? 'ffmpeg.exe' : 'ffmpeg');
          if (fs.existsSync(candidate)) ffmpegBin = candidate;
        }
      }

      const thumbFilename = `thumb_${baseName}.jpg`;
      const thumbFilePath = path.join(uploadDir, thumbFilename);

      if (ffmpegBin) {
        try {
          await execAsync(`"${ffmpegBin}" -ss 00:00:01 -i "${filePath}" -vframes 1 -q:v 2 -y "${thumbFilePath}"`);
          if (fs.existsSync(thumbFilePath)) {
            publicThumbUrl = `/api/files/canhquay/${thumbFilename}`;
          }
        } catch (ffmpegErr) {
          console.error('[/api/upload/canh-quay] Lỗi trích xuất thumbnail FFmpeg:', ffmpegErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      thumbnailUrl: publicThumbUrl
    });
  } catch (err: any) {
    console.error('[/api/upload/canh-quay] error:', err);
    return NextResponse.json({ success: false, message: `Lỗi upload: ${err.message}` }, { status: 500 });
  }
}
