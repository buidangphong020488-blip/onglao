import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import ffmpegPath from 'ffmpeg-static';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

function getCandidateDirs() {
  const dirs = [
    path.join(process.cwd(), 'public', 'uploads', 'canhquay'),
    '/www/wwwroot/onglao.giac.ngo/public/uploads/canhquay',
    '/www/wwwroot/onglao.giac.ngo/uploads/canhquay',
  ];

  dirs.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (e) {}
  });

  return dirs.filter(dir => fs.existsSync(dir));
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

    const candidateDirs = getCandidateDirs();
    if (candidateDirs.length === 0) {
      return NextResponse.json({ message: 'Không thể tạo thư mục lưu trữ file.' }, { status: 500 });
    }

    const primaryDir = candidateDirs[0];

    const isVideo = file.type.includes('video') || /\.(mp4|mov|webm|avi|mkv)$/i.test(file.name);
    const ext = path.extname(file.name) || (isVideo ? '.mp4' : '.jpg');
    const baseName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const filename = `${baseName}${ext}`;

    // 1. Ghi file gốc ra TẤT CẢ các thư mục candidate đồng bộ (Nginx + PM2 Standalone)
    candidateDirs.forEach(dir => {
      try {
        const dest = path.join(dir, filename);
        fs.writeFileSync(dest, buffer);
      } catch (e) {
        console.warn(`Lỗi ghi file sang dir ${dir}:`, e);
      }
    });

    const primaryFilePath = path.join(primaryDir, filename);
    const publicUrl = `/api/files/canhquay/${filename}`;
    let publicThumbUrl = publicUrl;

    // 2. Nếu là video, tự động chạy FFmpeg trích xuất Thumbnail .jpg ngầm ở mốc 0.1s
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
      const primaryThumbFilePath = path.join(primaryDir, thumbFilename);

      if (ffmpegBin) {
        try {
          // Lấy mốc -ss 00:00:00.1 để bất kỳ clip ngắn nào cũng cắt khung hình thành công
          await execAsync(`"${ffmpegBin}" -ss 00:00:00.1 -i "${primaryFilePath}" -vframes 1 -q:v 2 -y "${primaryThumbFilePath}"`);
          
          if (fs.existsSync(primaryThumbFilePath)) {
            const thumbBuffer = fs.readFileSync(primaryThumbFilePath);
            // Ghi file thumb ra TẤT CẢ các thư mục candidate đồng bộ
            candidateDirs.forEach(dir => {
              try {
                const dest = path.join(dir, thumbFilename);
                fs.writeFileSync(dest, thumbBuffer);
              } catch (e) {}
            });
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
