import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import ffmpegPath from 'ffmpeg-static';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 phút max

export async function POST(req: NextRequest) {
  let tmpDir = '';

  try {
    const formData = await req.formData();
    const metadataStr = formData.get('metadata') as string;
    if (!metadataStr) {
      return NextResponse.json({ message: 'Thiếu dữ liệu metadata' }, { status: 400 });
    }

    const metadata = JSON.parse(metadataStr);
    const { scenes, bgmVolume = 0.15, resolution = '1080', aspectRatio = '16x9', format = 'mp4' } = metadata;

    if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
      return NextResponse.json({ message: 'Danh sách cảnh quay rỗng' }, { status: 400 });
    }

    let ffmpegBin = ffmpegPath;
    if (!ffmpegBin || ffmpegBin.includes('\\ROOT\\') || !fs.existsSync(ffmpegBin)) {
      const localFfmpeg = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
      if (fs.existsSync(localFfmpeg)) {
        ffmpegBin = localFfmpeg;
      }
    }

    if (!ffmpegBin || !fs.existsSync(ffmpegBin)) {
      return NextResponse.json({ message: `FFmpeg binary không tồn tại trên hệ thống: ${ffmpegBin}` }, { status: 500 });
    }

    tmpDir = path.join(process.cwd(), '.temp_export', `export_${Date.now()}`);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // 1. Lưu file Audio thuyết minh chính
    const audioFile = formData.get('audio') as File | null;
    let audioFilePath = path.join(tmpDir, 'narration.mp3');
    if (audioFile) {
      const audioArrayBuf = await audioFile.arrayBuffer();
      fs.writeFileSync(audioFilePath, Buffer.from(audioArrayBuf));
    } else {
      return NextResponse.json({ message: 'Thiếu file âm thanh thuyết minh (audio)' }, { status: 400 });
    }

    // 2. Lưu file Nhạc nền (BGM) nếu có
    const bgmFile = formData.get('bgm') as File | null;
    let bgmFilePath: string | null = null;
    if (bgmFile) {
      bgmFilePath = path.join(tmpDir, 'bgm.mp3');
      const bgmArrayBuf = await bgmFile.arrayBuffer();
      fs.writeFileSync(bgmFilePath, Buffer.from(bgmArrayBuf));
    }

    // 3. Xử lý từng video clip tương ứng với từng câu thoại
    const concatListPath = path.join(tmpDir, 'concat_list.txt');
    const concatLines: string[] = [];

    const isVertical = aspectRatio === '9x16';
    const renderW = isVertical ? 1080 : 1920;
    const renderH = isVertical ? 1920 : 1080;

    for (let i = 0; i < scenes.length; i++) {
      const sc = scenes[i];
      const clipDuration = Number(sc.duration) || 3.0;
      let clipSourcePath = '';

      // Kiểm tra xem clip có được gửi kèm dạng file binary trong FormData không
      const attachedClip = formData.get(`clip_${i}`) as File | null;
      if (attachedClip) {
        clipSourcePath = path.join(tmpDir, `src_clip_${i}.mp4`);
        const vidArrayBuf = await attachedClip.arrayBuffer();
        fs.writeFileSync(clipSourcePath, Buffer.from(vidArrayBuf));
      } else if (sc.url && fs.existsSync(sc.url)) {
        clipSourcePath = sc.url;
      } else if (sc.url && sc.url.startsWith('/')) {
        const localP = path.join(process.cwd(), 'public', sc.url);
        if (fs.existsSync(localP)) {
          clipSourcePath = localP;
        }
      }

      if (!clipSourcePath || !fs.existsSync(clipSourcePath)) {
        const existingClips = fs.readdirSync(tmpDir).filter(f => f.startsWith('src_clip_') && f.endsWith('.mp4'));
        if (existingClips.length > 0) {
          clipSourcePath = path.join(tmpDir, existingClips[0]);
        } else {
          return NextResponse.json({ message: `Không tìm thấy clip video hợp lệ cho cảnh ${i}` }, { status: 400 });
        }
      }

      // Cut / Loop clip mượt chuẩn 60FPS
      const trimmedClipPath = path.join(tmpDir, `trimmed_clip_${i}.mp4`);
      const trimCmd = `"${ffmpegBin}" -y -stream_loop -1 -i "${clipSourcePath}" -t ${clipDuration} -vf "scale=${renderW}:${renderH}:force_original_aspect_ratio=increase,crop=${renderW}:${renderH},fps=60" -c:v libx264 -preset ultrafast -an "${trimmedClipPath}"`;
      await execAsync(trimCmd);

      const normalizedPath = trimmedClipPath.replace(/\\/g, '/');
      concatLines.push(`file '${normalizedPath}'`);
    }

    fs.writeFileSync(concatListPath, concatLines.join('\n'));

    // 4. Nối tất cả các clip video lại và TÁO TẠO KHUNG HÌNH CHUẨN (Re-encode Keyframes - Khử 100% giật khựng chuyển cảnh)
    const concatenatedVideoPath = path.join(tmpDir, 'combined_video.mp4');
    const concatCmd = `"${ffmpegBin}" -y -f concat -safe 0 -i "${concatListPath}" -c:v libx264 -preset fast -r 60 -g 30 -keyint_min 30 -sc_threshold 0 -pix_fmt yuv420p "${concatenatedVideoPath}"`;
    await execAsync(concatCmd);

    // 5. Ghép Video + Audio thuyết minh + Nhạc nền
    const finalOutputPath = path.join(tmpDir, `output.${format === 'webm' ? 'webm' : 'mp4'}`);
    let finalCmd = `"${ffmpegBin}" -y -i "${concatenatedVideoPath}" -i "${audioFilePath}"`;

    if (bgmFilePath) {
      finalCmd += ` -i "${bgmFilePath}" -filter_complex "[1:a]volume=1.0[a1];[2:a]volume=${bgmVolume}[a2];[a1][a2]amix=inputs=2:duration=first[aout]" -map 0:v:0 -map "[aout]" -shortest`;
    } else {
      finalCmd += ` -map 0:v:0 -map 1:a:0 -shortest`;
    }

    if (format === 'webm') {
      finalCmd += ` -c:v libvpx-vp9 -b:v 15M -c:a libopus "${finalOutputPath}"`;
    } else {
      finalCmd += ` -c:v copy -c:a aac -b:a 192k "${finalOutputPath}"`;
    }

    console.log('Running FFmpeg Final Cmd:', finalCmd);
    await execAsync(finalCmd);

    if (!fs.existsSync(finalOutputPath) || fs.statSync(finalOutputPath).size === 0) {
      throw new Error('File video xuất ra rỗng hoặc không tồn tại');
    }

    // 6. Lưu file vật lý vĩnh viễn trực tiếp vào thư mục dự án public/exports/
    const exportsDir = path.join(process.cwd(), 'public', 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    const filename = `OngLao_Video_${Date.now()}.${format === 'webm' ? 'webm' : 'mp4'}`;
    const projectFilePath = path.join(exportsDir, filename);
    fs.copyFileSync(finalOutputPath, projectFilePath);
    const publicUrl = `/exports/${filename}`;

    const videoBuffer = fs.readFileSync(finalOutputPath);

    // Dọn dẹp thư mục tạm
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {}

    return new Response(videoBuffer, {
      headers: {
        'Content-Type': format === 'webm' ? 'video/webm' : 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Video-Url': publicUrl,
        'X-Video-Filename': filename
      }
    });
  } catch (error: any) {
    if (tmpDir && fs.existsSync(tmpDir)) {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
    }
    console.error('FFmpeg export error details:', error);
    return NextResponse.json({ message: 'Lỗi FFmpeg: ' + (error?.message || error) }, { status: 500 });
  }
}
