// @ts-nocheck
import { processChromaKeyPixels } from '../constants';

export const EMOTIONS = { 
  calm: '😐 Bình thường', 
  sad: '😢 Buồn/Bế tắc', 
  joy: '😊 Vui/Hạnh phúc', 
  hook: '🔥 Mào đầu (Hook)' 
};

export const DEFAULT_CAM_PRESETS = [
  { id: 'cam_1', name: '1. Ngẫu nhiên Điện ảnh (Mặc định)', type: 'random' },
  { id: 'cam_2', name: '2. Đặc tả khuôn mặt & Lùi xa dần', type: 'focus_zoom_out' },
  { id: 'cam_3', name: '3. Đặc tả khuôn mặt & Lia ngang', type: 'focus_pan' },
  { id: 'cam_4', name: '4. Tĩnh tại (Không di chuyển camera)', type: 'static' },
  { id: 'cam_5', name: '5. Chậm rãi tiến sát vào người nói', type: 'slow_zoom_in' },
  { id: 'cam_6', name: '6. Nổi trôi nhẹ nhàng (Bồng bềnh)', type: 'float' },
  { id: 'cam_7', name: '7. Góc thấp ngước nhìn lên', type: 'low_angle_up' },
  { id: 'cam_8', name: '8. Góc cao nhìn xuống', type: 'high_angle_down' },
  { id: 'cam_9', name: '9. Khung hình động (Chuyển động mạnh)', type: 'dynamic' },
  { id: 'cam_10', name: '10. Góc quay tĩnh vi tế (Xê dịch siêu nhỏ)', type: 'micro_move' }
];

export const DEFAULT_CHARACTERS = [
  { id: 'char_lao_thang', name: 'Lão Thẳng', avatar: '/media/M-Vu__a_a7zprp.jpg', desc: 'Video Lão nhìn thẳng', role: 'lao', visualType: 'video', assets: { idle: '/media/Nghe_chua__n_khuo_n_cinlhv.webm', talking: '/media/No_i_ko_quay__a__u_f3lakj.webm' }, chromaSettings: { mode: 'manual', chromaType: 'none', tolerance: 50, smoothness: 20 } },
  { id: 'char_lao_quay_dau', name: 'Lão Quay Đầu', avatar: '/media/M-Vu__a_a7zprp.jpg', desc: 'Video Lão quay đầu nghe/nói', role: 'lao', visualType: 'video', assets: { idle: '/media/Nghe_xa1tuf.webm', talking: '/media/No_i_20s_mppyx3.webm' }, chromaSettings: { mode: 'manual', chromaType: 'none', tolerance: 50, smoothness: 20 } },
  { id: 'char_lao_xeo', name: 'Lão Xéo', avatar: '/media/thumbnail_2_fiifx4.png', desc: 'Video Lão ngồi góc nghiêng', role: 'lao', visualType: 'video', assets: { idle: '/media/Nghe_Da_i_jkhqsf.webm', talking: '/media/No_i_lj5ng1.webm' }, chromaSettings: { mode: 'manual', chromaType: 'none', tolerance: 50, smoothness: 20 } },
  { id: 'char_lao_lua', name: 'Lão Lúa', avatar: '/media/Thumbnail_lu_a_nuyekq.png', desc: 'Video Lão Lúa phông nền đồng lúa', role: 'lao', visualType: 'video', assets: { idle: '/lao_co_nen/nghe_lua.mp4', talking: '/lao_co_nen/noi_lua.mp4' }, chromaSettings: { mode: 'manual', chromaType: 'none', tolerance: 50, smoothness: 20 } },
  { id: 'char_lao_suoi', name: 'Lão Suối', avatar: '/media/thumbnail_i2q96w.png', desc: 'Video Lão Suối phông nền dòng suối', role: 'lao', visualType: 'video', assets: { idle: '/lao_co_nen/nghe_16.mp4', talking: '/lao_co_nen/noi_16.mp4' }, chromaSettings: { mode: 'manual', chromaType: 'none', tolerance: 50, smoothness: 20 } }
];

export const pcmToWav = (base64Data: any, sampleRate: any) => {
  if (!base64Data) return null;
  try {
    const decoded = atob(base64Data);
    if (decoded.length < 4) return null;
    const buffer = Uint8Array.from(decoded, (c: any) => c.charCodeAt(0)).buffer;
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    const writeString = (offset: any, string: any) => {
      for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };
    writeString(0, 'RIFF'); view.setUint32(4, 32 + buffer.byteLength, true);
    writeString(8, 'WAVE'); writeString(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true);
    view.setUint16(34, 16, true); writeString(36, 'data');
    view.setUint32(40, buffer.byteLength, true);
    return new Blob([wavHeader, buffer], { type: 'audio/wav' });
  } catch (e) {
    console.error("Lỗi biên dịch âm thanh:", e);
    return null;
  }
};

export const combineWavs = async (items: any[]) => {
  const buffers = await Promise.all(items.map(async (item: any) => {
    try {
      const r = await fetch(item.url);
      if (!r.ok) return new ArrayBuffer(0);
      const contentType = r.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        console.warn(`[combineWavs] Skip invalid HTML response for ${item.url}`);
        return new ArrayBuffer(0);
      }
      const buf = await r.arrayBuffer();
      if (buf.byteLength >= 44) {
         const view = new DataView(buf);
         const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
         if (riff !== 'RIFF') {
            console.warn(`[combineWavs] Skip non-RIFF audio buffer for ${item.url}`);
            return new ArrayBuffer(0);
         }
      }
      return buf;
    } catch (e) {
      console.warn(`[combineWavs] Failed to fetch ${item.url}:`, e);
      return new ArrayBuffer(0);
    }
  }));
  if (buffers.length === 0) return { blob: null, metadata: [] };
  
  let totalDataLen = 0;
  for (let i = 0; i < buffers.length; i++) {
    totalDataLen += Math.max(0, buffers[i].byteLength - 44);
  }
  
  if (totalDataLen === 0) return { blob: null, metadata: [] };

  const validFirstBuffer = buffers.find((b: any) => b.byteLength >= 44);
  if (!validFirstBuffer) return { blob: null, metadata: [] };

  const combined = new Uint8Array(44 + totalDataLen);
  combined.set(new Uint8Array(validFirstBuffer.slice(0, 44)), 0);
  
  const view = new DataView(combined.buffer);
  view.setUint32(4, 36 + totalDataLen, true);
  view.setUint32(40, totalDataLen, true);
  
  let offset = 44;
  let timeOffset = 0;
  const metadata = [];
  const SAMPLE_RATE = 24000;
  const BYTES_PER_SAMPLE = 2;
  
  for (let i = 0; i < buffers.length; i++) {
    const dataLen = Math.max(0, buffers[i].byteLength - 44);
    if (dataLen > 0) {
        combined.set(new Uint8Array(buffers[i].slice(44)), offset);
        offset += dataLen;
        
        const durationSec = dataLen / (SAMPLE_RATE * BYTES_PER_SAMPLE);
        metadata.push({ 
          role: items[i].role, 
          text: items[i].text, 
          emotion: items[i].emotion || 'calm', 
          msgId: items[i].msgId, 
          start: timeOffset, 
          end: timeOffset + durationSec 
        });
        timeOffset += durationSec;
    }
  }
  
  return { blob: new Blob([combined.buffer], { type: 'audio/wav' }), metadata };
};

export const formatTime = (seconds: any) => {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
};

export const getVideoCategory = (ratio: any) => {
  if (ratio === '9x16') return 'doc';
  return 'ngang';
};

export const calculateAutoFlip = (laoOffsetX: any, userOffsetX: any, laoPresetId: any, userPresetId: any) => {
  let laoFacing = 'right';
  let userFacing = 'left';
  
  const matchedLao = DEFAULT_CHARACTERS.find(c => c.id === laoPresetId);
  const matchedUser = DEFAULT_CHARACTERS.find(c => c.id === userPresetId);
  
  if (matchedLao?.naturalFacing) laoFacing = matchedLao.naturalFacing;
  if (matchedUser?.naturalFacing) userFacing = matchedUser.naturalFacing;
  
  let laoFlip = false;
  let userFlip = false;
  
  if (laoFacing === userFacing) {
      if (laoFacing === 'right') userFlip = true;
      else laoFlip = true;
  }
  
  return { laoFlip, userFlip };
};

export const applyChromaKey = (imgElement: any, type: any, colorHex: any, tolerance: any) => {
  if (type === 'none') return imgElement;
  
  const canvas = document.createElement('canvas');
  canvas.width = imgElement.width || imgElement.videoWidth || imgElement.naturalWidth;
  canvas.height = imgElement.height || imgElement.videoHeight || imgElement.naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;
  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  
  try {
      processChromaKeyPixels(ctx, canvas.width, canvas.height, { chromaType: type, chromaColor: colorHex, tolerance });
  } catch(e: any) { 
      console.warn("Lỗi Chroma Key (có thể do CORS):", e); 
  }
  
  return canvas;
};

export const buildDiagnosticReport = (stats: any, errorMsg: any = null) => {
  const avgDraw = stats.drawTimes.length ? (stats.drawTimes.reduce((a: any, b: any) => a + b, 0) / stats.drawTimes.length) : 0;
  const avgChroma = stats.chromaProcessingTimes.length ? (stats.chromaProcessingTimes.reduce((a: any, b: any) => a + b, 0) / stats.chromaProcessingTimes.length) : 0;
  const totalSecs = ((stats.endTime - stats.startTime) / 1000).toFixed(2);

  let report = `=== BÁO CÁO NỘI SOI KỸ THUẬT (TÂM AN PROFILER V2) ===\n`;
  report += `Mục tiêu cốt lõi: Xuất video 4K siêu nét, mượt mà tuyệt đối (60FPS), không giật lag, không nhấp nháy người và bối cảnh.\n\n`;

  report += `[1] THÔNG SỐ VẬN HÀNH THỰC TẾ:\n`;
  report += `- Độ phân giải render: ${stats.resolution}\n`;
  report += `- Thời gian chạy thực tế: ${totalSecs} giây\n`;
  report += `- Tổng số khung hình đã xử lý: ${stats.totalFrames} frames\n`;
  report += `- Số khung hình bị chậm (>16ms/frame): ${stats.slowFrames} frames\n`;
  report += `- Số khung hình rớt nhịp/nháy đen (>33ms/frame): ${stats.droppedFrames} frames\n`;
  report += `- Tốc độ vẽ Engine 2D trung bình: ${avgDraw.toFixed(2)} ms/frame (Ngưỡng an toàn 60fps: < 16.6ms)\n`;
  report += `- Thuật toán tách nền (Chroma Key): ${avgChroma.toFixed(2)} ms/frame\n`;
  report += `- Hoà hợp ánh sáng (Bóng đổ, Color Match): ${stats.fxEnabled ? 'Đang Bật' : 'Đã Tắt'}\n\n`;

  if (errorMsg) {
      report += `[!] CẢNH BÁO LỖI HỆ THỐNG KHI RENDER: ${errorMsg}\n\n`;
  }

  report += `[2] KẾT LUẬN & VẤN ĐỀ CỤ THỂ:\n`;
  let hasIssues = false;
  let prompts: any[] = [];

  if (avgDraw > 16.6) {
      hasIssues = true;
      report += `❌ Cổ chai CPU (Draw Time): Tốc độ vẽ vượt quá giới hạn 16ms/frame. Việc dùng Canvas 2D API để nội suy ảnh 4K đang quá sức với CPU, gây giật lag tổng thể.\n`;
      prompts.push(`Tâm An, hãy nâng cấp engine vẽ từ Canvas 2D hiện tại sang WebGL (Sử dụng thư viện trung gian hoặc raw WebGL) để dồn toàn bộ tác vụ nội suy hình ảnh và scale 4K cho card đồ họa (GPU) xử lý, giảm tải hoàn toàn cho CPU.`);
  }

  if (avgChroma > 8) {
      hasIssues = true;
      report += `❌ Cổ chai Tách nền (Chroma Key): Vòng lặp trên mảng pixel bằng Javascript thuần đang ăn quá nhiều thời gian CPU.\n`;
      prompts.push(`Tâm An, hãy viết lại hàm 'processChromaKeyPixels'. Thay vì dùng vòng lặp JS thuần trên CPU, hãy chuyển thuật toán tách nền xanh (Chroma Key) thành WebGL Fragment Shader, hoặc đưa tác vụ này vào Web Worker / OffscreenCanvas để không làm đứng luồng render chính.`);
  }

  if (stats.droppedFrames > 3 || stats.slowFrames > (stats.totalFrames * 0.15)) {
      hasIssues = true;
      report += `❌ Nhấp nháy Bối Cảnh & Desync: Quá trình bắt hình (requestAnimationFrame) đang không đồng bộ chuẩn xác với tốc độ giải mã thực tế của thẻ <video> nền, gây ra hiện tượng chớp đen hoặc đứng hình khấc khấc.\n`;
      prompts.push(`Tâm An, để triệt tiêu vĩnh viễn hiện tượng nhấp nháy nền video, hãy thay thế cơ chế đồng bộ video hiện tại bằng API 'requestVideoFrameCallback' (RVFC) kết hợp 'WebCodecs/VideoFrame'. Điều này đảm bảo mỗi frame video nền đều được giải mã và bắt dính chính xác 100% trước khi vẽ lên Canvas xuất.`);
  }

  if (errorMsg && errorMsg.toLowerCase().includes('memory')) {
       hasIssues = true;
       report += `❌ Tràn RAM (Out of Memory): Trình duyệt không đủ dung lượng RAM tạm để chứa luồng video 4K quá dài.\n`;
       prompts.push(`Tâm An, hãy tối ưu lại quản lý luồng MediaRecorder. Thay vì lưu toàn bộ mảng 'chunks' vào RAM rồi mới xuất Blob một lần, hãy cấu trúc lại để ghi luồng dữ liệu thẳng xuống ổ cứng cục bộ thông qua 'File System Access API (createWritable)', giúp xuất video dài vài tiếng chuẩn 4K mà không bao giờ tràn RAM.`);
  }

  if (!hasIssues && !errorMsg) {
      report += `✅ HỆ THỐNG ĐẠT CHUẨN MƯỢT MÀ. Mọi thông số nội suy và tách nền đều nằm dưới ngưỡng cảnh báo. Không phát hiện nguy cơ giật lag hay nhấp nháy ở độ phân giải hiện tại.\n\n`;
  } else {
      report += `\n[3] ĐỀ XUẤT NÂNG CẤP MÃ NGUỒN CHO TÂM AN (COPY ĐOẠN DƯỚI ĐÂY GỬI VÀO KHUNG CHAT):\n`;
      report += `Dựa trên kết quả nội soi này, Tâm An hãy tái cấu trúc lại mã nguồn theo các yêu cầu kỹ thuật sau để đạt mục tiêu xuất video 4K siêu mượt, không nhấp nháy:\n\n`;
      prompts.forEach((p: any, idx: any) => {
          report += `👉 Yêu cầu ${idx + 1}: ${p}\n\n`;
      });
  }

  return report;
};

export const loadSvgToImage = (svgString: any) => {
  return new Promise((resolve) => {
    const img = new window.Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.src = url;
  });
};

export const wrapTextToLines = (ctx: any, text: any, maxWidth: any) => {
  const str = String(text || '');
  if (!str) return [];
  
  const hasSpaces = str.indexOf(' ') !== -1;
  const tokens = hasSpaces ? str.split(' ') : str.split('');
  
  let lines = [];
  let currentLine = tokens[0] || '';

  for (let i = 1; i < tokens.length; i++) {
      let token = tokens[i];
      let testLine = hasSpaces ? currentLine + " " + token : currentLine + token;
      let width = ctx.measureText(testLine).width;
      if (width < maxWidth) {
          currentLine = testLine;
      } else {
          lines.push(currentLine);
          currentLine = token;
      }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
};
