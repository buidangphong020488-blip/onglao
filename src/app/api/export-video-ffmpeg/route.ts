import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import ffmpegPath from 'ffmpeg-static';
import prisma from '@/lib/prisma';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const MAX_CONCURRENT_RENDERS = 3;
let activeRenderCount = 0;
const renderTaskQueue: Array<() => Promise<void>> = [];

async function enqueueRenderTask(taskFn: () => Promise<void>) {
  if (activeRenderCount < MAX_CONCURRENT_RENDERS) {
    activeRenderCount++;
    try {
      await taskFn();
    } finally {
      activeRenderCount--;
      if (renderTaskQueue.length > 0) {
        const nextTask = renderTaskQueue.shift();
        if (nextTask) enqueueRenderTask(nextTask);
      }
    }
  } else {
    renderTaskQueue.push(taskFn);
  }
}

// Hàm xử lý Render Video ngầm trên Server (Async Background Task)
async function runFfmpegBackgroundProcess({
  taskId,
  tmpDir,
  scenes,
  audioFilePath,
  bgmFilePath,
  logoFilePath,
  bgmVolume,
  resolution,
  aspectRatio,
  format,
  userFolder,
  title,
  sessionId,
  ffmpegBin,
}: any) {
  try {
    const resHeight = Number(resolution) || 1080;
    let renderW = 1920;
    let renderH = 1080;

    if (aspectRatio === '9x16') {
      renderH = Math.round((resHeight * 16) / 9);
      renderW = resHeight;
      if (renderW % 2 !== 0) renderW += 1;
      if (renderH % 2 !== 0) renderH += 1;
    } else if (aspectRatio === '1x1') {
      renderW = resHeight;
      renderH = resHeight;
      if (renderW % 2 !== 0) renderW += 1;
    } else if (aspectRatio === '4x3') {
      renderH = resHeight;
      renderW = Math.round((resHeight * 4) / 3);
      if (renderW % 2 !== 0) renderW += 1;
      if (renderH % 2 !== 0) renderH += 1;
    } else if (aspectRatio === '3x4') {
      renderH = Math.round((resHeight * 4) / 3);
      renderW = resHeight;
      if (renderW % 2 !== 0) renderW += 1;
      if (renderH % 2 !== 0) renderH += 1;
    } else {
      renderH = resHeight;
      renderW = Math.round((resHeight * 16) / 9);
      if (renderW % 2 !== 0) renderW += 1;
      if (renderH % 2 !== 0) renderH += 1;
    }

    const concatListPath = path.join(tmpDir, 'concat_list.txt');
    const concatLines: string[] = [];

    // Xử lý song song tất cả các cảnh quay
    await Promise.all(scenes.map(async (sc: any, i: number) => {
      const clipDuration = Number(sc.duration) || 3.0;
      let clipSourcePath = sc.attachedClipPath || '';

      if (!clipSourcePath && sc.url) {
        if (fs.existsSync(sc.url)) {
          clipSourcePath = sc.url;
        } else {
          const cleanUrl = sc.url.replace(/^\/+/, '');
          const filename = path.basename(cleanUrl);
          const candidates = [
            path.join(process.cwd(), 'public', 'uploads', 'canhquay', filename),
            path.join(process.cwd(), 'uploads', 'canhquay', filename),
            path.join(process.cwd(), 'public', 'uploads', filename),
            path.join(process.cwd(), 'uploads', filename),
            path.join(process.cwd(), 'public', 'canhquay', filename),
            path.join(process.cwd(), 'public', cleanUrl),
            path.join('/www/wwwroot/onglao.giac.ngo/public/uploads/canhquay', filename),
            path.join('/www/wwwroot/onglao.giac.ngo/uploads/canhquay', filename),
            path.join('/www/wwwroot/onglao.giac.ngo/public/uploads', filename),
            path.join('/www/wwwroot/onglao.giac.ngo/public', cleanUrl),
            path.join('/www/wwwroot/onglao.giac.ngo', cleanUrl),
          ];
          for (const candidate of candidates) {
            if (fs.existsSync(candidate)) {
              clipSourcePath = candidate;
              break;
            }
          }
        }
      }

      if (!clipSourcePath || !fs.existsSync(clipSourcePath)) {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'canhquay');
        if (fs.existsSync(uploadDir)) {
          const allFiles = fs.readdirSync(uploadDir).filter(f => f.endsWith('.mp4'));
          if (allFiles.length > 0) {
            clipSourcePath = path.join(uploadDir, allFiles[0]);
          }
        }
      }

      if (clipSourcePath && fs.existsSync(clipSourcePath)) {
        const trimmedClipPath = path.join(tmpDir, `trimmed_clip_${i}.mp4`);
        const trimCmd = `"${ffmpegBin}" -y -stream_loop -1 -i "${clipSourcePath}" -t ${clipDuration} -vf "scale=${renderW}:${renderH}:force_original_aspect_ratio=increase,crop=${renderW}:${renderH},fps=30" -c:v libx264 -preset ultrafast -an "${trimmedClipPath}"`;
        await execAsync(trimCmd);
      }
    }));

    for (let i = 0; i < scenes.length; i++) {
      const trimmedClipPath = path.join(tmpDir, `trimmed_clip_${i}.mp4`);
      if (fs.existsSync(trimmedClipPath)) {
        const normalizedPath = trimmedClipPath.replace(/\\/g, '/');
        concatLines.push(`file '${normalizedPath}'`);
      }
    }

    if (concatLines.length === 0) {
      throw new Error('Không thể xử lý clip nào cho video này.');
    }

    fs.writeFileSync(concatListPath, concatLines.join('\n'));

    const concatenatedVideoPath = path.join(tmpDir, 'combined_video.mp4');
    const concatCmd = `"${ffmpegBin}" -y -f concat -safe 0 -i "${concatListPath}" -c:v libx264 -preset ultrafast -r 30 -g 30 -keyint_min 30 -sc_threshold 0 -pix_fmt yuv420p "${concatenatedVideoPath}"`;
    await execAsync(concatCmd);

    // Tạo file phụ đề ASS Karaoke tự động từ text/textSnippet của từng cảnh quay
    let assPath: string | null = null;
    let currentTime = 0;
    const assLines: string[] = [
      `[Script Info]`,
      `ScriptType: v4.00+`,
      `PlayResX: 1920`,
      `PlayResY: 1080`,
      `ScaledBorderAndShadow: yes`,
      ``,
      `[V4+ Styles]`,
      `Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding`,
      `Style: Karaoke,Arial,52,&H0000FFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,4,2,2,40,40,65,1`,
      ``,
      `[Events]`,
      `Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`
    ];

    const formatAssTime = (sec: number) => {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60);
      const cs = Math.floor((sec % 1) * 100);
      const pad = (n: number, z = 2) => String(n).padStart(z, '0');
      return `${h}:${pad(m)}:${pad(s)}.${pad(cs)}`;
    };

    for (let i = 0; i < scenes.length; i++) {
      const sc = scenes[i];
      // Khớp chính xác thời lượng clip theo audioDuration thoại của người nói (Tránh lệch cảnh Vấn đề 4)
      const clipDuration = Number(sc.audioDuration) || Number(sc.duration) || 3.5;
      const text = (sc.textSnippet || sc.text || sc.content || '').trim();
      if (text) {
        const words = text.split(/\s+/).filter(Boolean);
        if (words.length > 0) {
          // Chia câu thoại dài thành từng vế ngắn 6 từ để phụ đề to rõ nét (Giải quyết Vấn đề 5)
          const chunkSize = 6;
          const chunkCount = Math.ceil(words.length / chunkSize);
          const chunkDuration = clipDuration / chunkCount;

          for (let c = 0; c < chunkCount; c++) {
            const subWords = words.slice(c * chunkSize, (c + 1) * chunkSize);
            const subStart = currentTime + c * chunkDuration;
            const subEnd = subStart + chunkDuration;
            const totalCs = Math.floor(chunkDuration * 100);
            const csPerWord = Math.max(5, Math.floor(totalCs / subWords.length));
            const karaokeText = subWords.map((w: string) => `{\\kf${csPerWord}}${w}`).join(' ');
            const startTimeStr = formatAssTime(subStart);
            const endTimeStr = formatAssTime(subEnd);
            assLines.push(`Dialogue: 0,${startTimeStr},${endTimeStr},Karaoke,,0,0,0,,${karaokeText}`);
          }
        }
      }
      currentTime += clipDuration;
    }

    if (assLines.length > 12) {
      assPath = path.join(tmpDir, 'subtitles.ass');
      fs.writeFileSync(assPath, assLines.join('\n'), 'utf-8');
    }

    const finalOutputPath = path.join(tmpDir, `output.${format === 'webm' ? 'webm' : 'mp4'}`);
    
    // Tích hợp Video Filter Chain (Subtitles + Logo Overlay)
    let videoFilters: string[] = [];
    if (assPath && fs.existsSync(assPath)) {
      const escapedAss = assPath.replace(/\\/g, '/').replace(/:/g, '\\:');
      videoFilters.push(`subtitles='${escapedAss}'`);
    }

    let finalCmd = `"${ffmpegBin}" -y -i "${concatenatedVideoPath}" -i "${audioFilePath}"`;
    let inputCount = 2;
    let bgmIndex = -1;
    let logoIndex = -1;

    if (bgmFilePath) {
      bgmIndex = inputCount;
      finalCmd += ` -i "${bgmFilePath}"`;
      inputCount++;
    }

    if (logoFilePath && fs.existsSync(logoFilePath)) {
      logoIndex = inputCount;
      finalCmd += ` -i "${logoFilePath}"`;
      inputCount++;
    }

    // Xây dựng Filter Complex cho Video & Audio
    let filterComplex = '';
    let currentVideoLabel = '0:v';

    // 1. Phủ Logo nếu có
    if (logoIndex !== -1) {
      filterComplex += `[${logoIndex}:v]scale=120:-1[scaled_logo];[${currentVideoLabel}][scaled_logo]overlay=main_w-overlay_w-30:30[vlogo];`;
      currentVideoLabel = 'vlogo';
    }

    // 2. Chèn Phụ Đề ASS nếu có
    if (videoFilters.length > 0) {
      filterComplex += `[${currentVideoLabel}]${videoFilters.join(',')}[vout];`;
      currentVideoLabel = 'vout';
    }

    // 3. Trộn Audio (Thuyết minh + Nhạc nền BGM)
    if (bgmIndex !== -1) {
      filterComplex += `[1:a]volume=1.0[a1];[${bgmIndex}:a]volume=${bgmVolume}[a2];[a1][a2]amix=inputs=2:duration=first[aout]`;
    }

    if (filterComplex) {
      finalCmd += ` -filter_complex "${filterComplex}"`;
      finalCmd += ` -map "[${currentVideoLabel}]"`;
      if (bgmIndex !== -1) {
        finalCmd += ` -map "[aout]"`;
      } else {
        finalCmd += ` -map 1:a:0`;
      }
    } else {
      finalCmd += ` -map 0:v:0 -map 1:a:0`;
    }

    if (format === 'webm') {
      finalCmd += ` -c:v libvpx-vp9 -b:v 15M -c:a libopus -shortest -movflags +faststart "${finalOutputPath}"`;
    } else {
      finalCmd += ` -c:v libx264 -preset ultrafast -profile:v main -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "${finalOutputPath}"`;
    }

    await execAsync(finalCmd);

    if (!fs.existsSync(finalOutputPath) || fs.statSync(finalOutputPath).size === 0) {
      throw new Error('File video xuất ra rỗng hoặc không tồn tại');
    }

    const exportsDir = path.join(process.cwd(), 'public', 'exports', userFolder);
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    const filename = `OngLao_Video_${Date.now()}.${format === 'webm' ? 'webm' : 'mp4'}`;
    const projectFilePath = path.join(exportsDir, filename);
    fs.copyFileSync(finalOutputPath, projectFilePath);
    const publicUrl = `/exports/${userFolder}/${filename}`;

    // Cập nhật RenderHistory vào PostgreSQL DB với kết quả video hoàn tất
    await (prisma.renderHistory as any).upsert({
      where: { id: taskId },
      update: {
        videoUrl: publicUrl,
        title: title || 'Video Pháp Bảo',
        aspectRatio: aspectRatio || '16:9',
        sessionId: sessionId || undefined,
      },
      create: {
        id: taskId,
        videoUrl: publicUrl,
        title: title || 'Video Pháp Bảo',
        aspectRatio: aspectRatio || '16:9',
        sessionId: sessionId || undefined,
      }
    });

    console.log(`[Background Render SUCCESS] Task ${taskId} finished! Public URL: ${publicUrl}`);
  } catch (error: any) {
    console.error(`[Background Render ERROR] Task ${taskId} failed:`, error);
    await (prisma.renderHistory as any).upsert({
      where: { id: taskId },
      update: { videoUrl: 'ERROR: ' + error.message },
      create: { id: taskId, title: 'Lỗi Render Video', videoUrl: 'ERROR: ' + error.message, sessionId }
    }).catch(() => {});
  } finally {
    if (tmpDir && fs.existsSync(tmpDir)) {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const metadataStr = formData.get('metadata') as string;
    if (!metadataStr) {
      return NextResponse.json({ message: 'Thiếu dữ liệu metadata' }, { status: 400 });
    }

    const metadata = JSON.parse(metadataStr);
    const { scenes, bgmVolume = 0.15, resolution = '1080', aspectRatio = '16x9', format = 'mp4', userId, title, sessionId } = metadata;
    const userFolder = userId ? String(userId).replace(/[^a-zA-Z0-9_-]/g, '') : 'guest';

    if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
      return NextResponse.json({ message: 'Danh sách cảnh quay rỗng' }, { status: 400 });
    }

    const taskId = `vid_${Date.now()}`;
    const tmpDir = path.join(process.cwd(), '.temp_export', `export_${Date.now()}`);
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

    // 2b. Lưu file Logo đính kèm nếu có
    const logoFile = formData.get('logo') as File | null;
    const logoDataStr = formData.get('logoData') as string | null;
    let logoFilePath: string | null = null;

    if (logoFile && logoFile.size > 0) {
      logoFilePath = path.join(tmpDir, 'logo.png');
      const logoArrayBuf = await logoFile.arrayBuffer();
      fs.writeFileSync(logoFilePath, Buffer.from(logoArrayBuf));
    } else if (logoDataStr && logoDataStr.startsWith('data:image')) {
      logoFilePath = path.join(tmpDir, 'logo.png');
      const base64Data = logoDataStr.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(logoFilePath, Buffer.from(base64Data, 'base64'));
    }

    // 3. Lưu các clip đính kèm dạng binary (nếu có)
    for (let i = 0; i < scenes.length; i++) {
      const attachedClip = formData.get(`clip_${i}`) as File | null;
      if (attachedClip) {
        const attachedPath = path.join(tmpDir, `src_clip_${i}.mp4`);
        const vidBuf = await attachedClip.arrayBuffer();
        fs.writeFileSync(attachedPath, Buffer.from(vidBuf));
        scenes[i].attachedClipPath = attachedPath;
      }
    }

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

    // Khởi tạo bản ghi trong CSDL PostgreSQL đánh dấu đang Render
    await (prisma.renderHistory as any).upsert({
      where: { id: taskId },
      update: { title: title || 'Video Render (Đang xử lý...)', videoUrl: 'PROCESSING', sessionId: sessionId || undefined, aspectRatio: aspectRatio || '16:9' },
      create: { id: taskId, title: title || 'Video Render (Đang xử lý...)', videoUrl: 'PROCESSING', sessionId: sessionId || undefined, aspectRatio: aspectRatio || '16:9' }
    });

    // KHỞI CHẠY TÁC VỤ RENDER NGẦM BẤT ĐỒNG BỘ (Bao bọc hàng chờ giới hạn Concurrency = 3)
    enqueueRenderTask(() => runFfmpegBackgroundProcess({
      taskId,
      tmpDir,
      scenes,
      audioFilePath,
      bgmFilePath,
      logoFilePath,
      bgmVolume,
      resolution,
      aspectRatio,
      format,
      userFolder,
      title,
      sessionId,
      ffmpegBin,
    }));

    // Trả về kết quả ngay lập tức cho Trình duyệt
    return NextResponse.json({
      success: true,
      taskId,
      status: 'processing',
      message: 'Đã khởi tạo tác vụ Render video ngầm thành công trên server!'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
