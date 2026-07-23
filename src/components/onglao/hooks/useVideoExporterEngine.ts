// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { 
  getLaoSvgString, 
  getUserSvgString, 
  processChromaKeyPixels 
} from '../constants';
import { 
  combineWavs, 
  formatTime, 
  getVideoCategory, 
  calculateAutoFlip, 
  applyChromaKey, 
  buildDiagnosticReport,
  loadSvgToImage,
  wrapTextToLines
} from '../utils/videoExportUtils';
import { saveChatMessageAction } from '@/actions/chat';

export const useVideoExporterEngine = ({
  showToastMsg,
  messages,
  currentSessionId,
  
  // Refs from parent
  exportCanvasRef,
  exportMediaRecorderRef,
  exportAudioCtxRef,
  exportAnimFrameRef,
  preloadedLaoFrames,
  preloadedUserFrames,
  preloadedBowFrames,
  preloadedBgImgRef,
  ffVidRefs,
  laoExportVidRefs,
  userExportVidRefs,
  bgVideoRefs,
  processedBgsRef,
  processedLogoRef,
  spellCheckControllersRef,
  spellCheckTimeoutsRef,
  globalAudioRef,
  
  // Settings & appearance configurations
  laoAppearance,
  laoVisualType,
  laoChromaSettings,
  userGender,
  userAge,
  userAppearance,
  userVisualType,
  userChromaSettings,
  enableAutoHarmonization,
  laoShadow,
  userShadow,
  harmonizeSettings,
  charOffsets,
  customBgs,
  bgmAudioData,
  bgmVolume,
  logoData,
  logoSettings,
  
  // Export option values
  videoResolution,
  videoAspectRatio,
  videoTransition,
  videoTransitionDuration,
  enableIntro,
  introTitle,
  introSubtitle,
  enableOutroText,
  outroText,
  subtitleSentenceCount,
  subtitleColor,
  subtitleYPos,
  subtitleScale,
  videoExt,
  isFullFrameMode,
  
  // Exporter states and setters
  isExportingVideo,
  setIsExportingVideo,
  setIsPreparingVideoData,
  setRenderedVideoBlob,
  setRenderedVideoUrl,
  setIsPreviewFullscreen,
  setShowVideoExportModal,
  setExportTab,
  saveRenderHistoryItem,
  videoExportSource,
  bgUpdateTrigger,
  setBgUpdateTrigger,
  
  // Timeline cache refs
  globalAudioUrlRef,
  globalMessageCountRef,
  globalAudioMetadataRef,
  
  // Diagnostic states
  setDiagnosticReport,
  setShowDiagnostics,
  renderDiagnosticsRef,
  
  // Fullframe configuration
  ffScenesRef,
  setFfScenes
}: any) => {
  const blurCanvasRef = useRef<any>(null);

  const resetVideoExport = () => {
    setIsExportingVideo(false);
    setIsPreparingVideoData(false);
    setBgUpdateTrigger((prev: any) => prev + 1);
  };

  const releaseExportRAM = () => {
    try {
      // 1. Phá hủy tất cả các phần tử Video ngầm đã nạp vào RAM
      if (ffVidRefs.current) {
        Object.keys(ffVidRefs.current).forEach((key) => {
          const v = ffVidRefs.current[key];
          if (v) {
            try {
              v.pause();
              v.src = "";
              v.removeAttribute('src');
              v.load();
            } catch (e) {}
          }
        });
        ffVidRefs.current = {};
      }

      // 2. Dọn các canvas mờ & canvas đệm
      if (blurCanvasRef.current) {
        blurCanvasRef.current.width = 1;
        blurCanvasRef.current.height = 1;
        blurCanvasRef.current = null;
      }

      // 3. Xóa bộ nhớ đệm frame tạm
      preloadedLaoFrames.current = {};
      preloadedUserFrames.current = {};
      preloadedBowFrames.current = {};
      processedBgsRef.current = {};
      processedLogoRef.current = null;

      // 4. Gọi Garbage Collector nếu trình duyệt hỗ trợ
      if (typeof window !== 'undefined' && (window as any).gc) {
        try { (window as any).gc(); } catch (e) {}
      }
    } catch (e) {}
  };

  const handleClearCache = () => {
      showToastMsg('Đang dọn dẹp bộ nhớ đệm (RAM/VRAM)...', 'loading', 2500);

      releaseExportRAM();

      // 1. Phá hủy các Canvas xử lý điểm ảnh (Nặng RAM nhất) của Bối cảnh Video
      Object.values(bgVideoRefs.current).forEach((vObj: any) => {
          if (vObj) {
              vObj.chromaCanvas = null;
              vObj.chromaCtx = null;
              vObj.lastValidCanvas = null;
          }
      });

      // 2. Phá hủy Canvas tách nền của Lão
      ['idle', 'talking'].forEach(state => {
          const videoEl = laoExportVidRefs.current[state] as any;
          if (videoEl) {
              videoEl.chromaCanvas = null;
              videoEl.chromaCtx = null;
          }
      });

      // 3. Phá hủy Canvas tách nền của Người hỏi
      ['idle', 'talking', 'bowing'].forEach(state => {
          const videoEl = userExportVidRefs.current[state] as any;
          if (videoEl) {
              videoEl.chromaCanvas = null;
              videoEl.chromaCtx = null;
          }
      });

      // 4. Xóa bộ nhớ đệm Ảnh tĩnh & Logo đã xử lý (Sẽ tự động vẽ lại mới, sắc nét hơn)
      processedBgsRef.current = {};
      processedLogoRef.current = null;

      // 5. Xóa rác của luồng Render cũ
      if (exportAudioCtxRef.current) {
          exportAudioCtxRef.current.laoLastValidCanvas = null;
          exportAudioCtxRef.current.userLastValidCanvas = null;
      }
      preloadedLaoFrames.current = {};
      preloadedUserFrames.current = {};
      preloadedBowFrames.current = {};

      // 6. Xóa Video Preview cũ nếu có (Nhưng chưa lưu) để trả lại dung lượng
      if (exportAudioCtxRef.current && !isExportingVideo) {
          // url revocation is handled in parent hook or when setting URL to null
          setRenderedVideoUrl(null);
          setRenderedVideoBlob(null);
      }

      // 7. Kích hoạt render lại giao diện để khởi tạo bộ nhớ sạch
      setBgUpdateTrigger((prev: any) => prev + 1);

      setTimeout(() => {
          showToastMsg('Đã giải phóng RAM thành công! Khung hình đã sẵn sàng để render ở chất lượng cao nhất.', 'success', 5000);
      }, 1000);
  };

  const startVideoExport = async () => {
    if (isExportingVideo) return;
    setIsPreparingVideoData(true);
    setDiagnosticReport(null); // Reset báo cáo cũ

    // TÂM AN FIX: Tiêu diệt triệt để vòng lặp bóng ma từ lần render trước
    if (exportAnimFrameRef.current) {
        cancelAnimationFrame(exportAnimFrameRef.current);
        exportAnimFrameRef.current = null;
    }

    // Auto-persist tất cả video blobs chưa có idbKey vào IndexedDB để lưu trữ vĩnh viễn
    if (ffScenesRef.current && ffScenesRef.current.length > 0) {
        for (const scene of ffScenesRef.current) {
            if (scene.url && scene.url.startsWith('blob:') && !scene.idbKey) {
                try {
                    const blob = await fetch(scene.url).then(r => r.blob());
                    const key = `ff_clip_${scene.role}_${scene.emotion}_${Date.now()}_${Math.floor(Math.random()*10000)}`;
                    await idb.set(key, blob);
                    scene.idbKey = key;
                } catch (e) {
                    console.warn("Auto-persist blob to IDB error:", e);
                }
            }
        }
    }

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      exportAudioCtxRef.current = new AudioContextClass();
      
      const audioUrl = await combineWavs(messages.filter((m: any) => m.audioUrl).map((m: any) => ({ url: m.audioUrl, role: m.role, text: m.text, emotion: m.emotion || 'calm', msgId: m.id })));
      if (!audioUrl || !audioUrl.blob) {
          showToastMsg('Không có đoạn âm thanh nào để tạo video.', 'error');
          setIsPreparingVideoData(false);
          return;
      }
      const combinedAudioBlob = audioUrl.blob;
      const combinedAudioMetadata = audioUrl.metadata;

      // Tách riêng danh sách timeline nói của Lão và Con từ Metadata của file gộp
      const laoTalkingBlocks = combinedAudioMetadata.filter((m: any) => m.role === 'ai');
      const userTalkingBlocks = combinedAudioMetadata.filter((m: any) => m.role === 'user');

      // Tách khung hình SVG/Ảnh cho Lão & Con dựa trên các mốc thời gian để vẽ FullFrame cực nhanh
      showToastMsg('Đang tải trước bối cảnh...', 'loading', 0);
      
      // Khởi tạo các khung hình SVG
      preloadedLaoFrames.current = {};
      preloadedUserFrames.current = {};
      preloadedBowFrames.current = {};

      const loadSvgToImage = (svgString: any) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
          img.src = url;
        });
      };

      // Tải trước toàn bộ các trạng thái miệng nhép của Lão (Từ 0 đến 16)
      if (laoVisualType === 'svg') {
          for (let state = 0; state <= 16; state += 4) {
              preloadedLaoFrames.current[state] = await loadSvgToImage(getLaoSvgString(state, laoAppearance));
          }
      } else if (laoVisualType === 'image') {
          const openImg = await loadSvgToImage(`<svg><image href="${laoAppearance.customImages?.open || ''}" width="300" height="400"/></svg>`);
          const halfImg = await loadSvgToImage(`<svg><image href="${laoAppearance.customImages?.half || ''}" width="300" height="400"/></svg>`);
          const closedImg = await loadSvgToImage(`<svg><image href="${laoAppearance.customImages?.closed || ''}" width="300" height="400"/></svg>`);
          for (let state = 0; state <= 16; state += 4) {
              if (state >= 12) preloadedLaoFrames.current[state] = openImg;
              else if (state >= 4) preloadedLaoFrames.current[state] = halfImg;
              else preloadedLaoFrames.current[state] = closedImg;
          }
      }

      // Tải trước các trạng thái miệng của Người hỏi (user)
      if (userVisualType === 'svg') {
          for (let state = 0; state <= 16; state += 4) {
              preloadedUserFrames.current[state] = await loadSvgToImage(getUserSvgString(state, userGender, userAge, 0, userAppearance));
          }
          // Tải trước các frame lạy của Outro (độ mở lạy từ 0 đến 20)
          for (let state = 0; state <= 20; state += 4) {
              preloadedBowFrames.current[state] = await loadSvgToImage(getUserSvgString(0, userGender, userAge, state, userAppearance));
          }
      } else if (userVisualType === 'image') {
          const openImg = await loadSvgToImage(`<svg><image href="${userAppearance.customImages?.open || ''}" width="300" height="400"/></svg>`);
          const halfImg = await loadSvgToImage(`<svg><image href="${userAppearance.customImages?.half || ''}" width="300" height="400"/></svg>`);
          const closedImg = await loadSvgToImage(`<svg><image href="${userAppearance.customImages?.closed || ''}" width="300" height="400"/></svg>`);
          const bowImg = await loadSvgToImage(`<svg><image href="${userAppearance.customImages?.bow || ''}" width="300" height="400"/></svg>`);
          for (let state = 0; state <= 16; state += 4) {
              if (state >= 12) preloadedUserFrames.current[state] = openImg;
              else if (state >= 4) preloadedUserFrames.current[state] = halfImg;
              else preloadedUserFrames.current[state] = closedImg;
          }
          for (let state = 0; state <= 20; state += 4) {
              preloadedBowFrames.current[state] = bowImg;
          }
      }

      // Tải trước hình nền tĩnh nếu bối cảnh chính là ảnh tĩnh để tránh giật lag lúc render
      const activeBgForBounds = customBgs.find((b: any) => b.visible !== false);
      if (activeBgForBounds && activeBgForBounds.type === 'image') {
          preloadedBgImgRef.current = await new Promise((resolve) => {
              const img = new window.Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(img);
              img.onerror = () => resolve(null);
              // Lấy thẳng từ cache tách nền nếu có
              const cached = processedBgsRef.current[activeBgForBounds.id];
              img.src = cached ? cached.canvas.toDataURL() : activeBgForBounds.url;
          });
      }

      // Nạp audio gộp vào AudioContext
      const combinedAudioBuffer = await combinedAudioBlob.arrayBuffer();
      const decodedAudioBuffer = await exportAudioCtxRef.current.decodeAudioData(combinedAudioBuffer);

      // --- FFMEG ENGINE EXPORT (SIÊU TỐC - 0% GIẬT LAG VIA FORMDATA MULTIPART) ---
      try {
        showToastMsg('Đang render Video...', 'loading', 0);

        const formData = new FormData();
        formData.append('audio', combinedAudioBlob, 'narration.mp3');

        if (bgmAudioData && bgmAudioData.url) {
          try {
            const bgmRes = await fetch(bgmAudioData.url);
            if (bgmRes.ok) {
              const bgmBlob = await bgmRes.blob();
              formData.append('bgm', bgmBlob, 'bgm.mp3');
            }
          } catch (e) {}
        }

        const scenesList: any[] = [];
        const totalDur = decodedAudioBuffer.duration || 10;
        
        if (combinedAudioMetadata && combinedAudioMetadata.length > 0) {
          for (let i = 0; i < combinedAudioMetadata.length; i++) {
            const meta = combinedAudioMetadata[i];
            const segDuration = (meta.durationMs || 3000) / 1000;
            let matchedScene = ffScenesRef.current.find((s: any) => s.msgId === meta.msgId || s.id.endsWith(`_${meta.msgId}`));
            if (!matchedScene) {
              matchedScene = ffScenesRef.current.find((s: any) => s.role === meta.role) || ffScenesRef.current[i % ffScenesRef.current.length];
            }
            
            let clipUrl = matchedScene?.url || '';
            let blobToConvert: Blob | null = null;

            if (!clipUrl) {
              if (meta.role === 'ai') {
                const vidEl = laoExportVidRefs.current?.talking || laoExportVidRefs.current?.idle;
                clipUrl = vidEl?.src || laoAppearance?.videoUrl || laoAppearance?.customVideos?.talking || '';
              } else {
                const vidEl = userExportVidRefs.current?.talking || userExportVidRefs.current?.idle;
                clipUrl = vidEl?.src || userAppearance?.videoUrl || userAppearance?.customVideos?.talking || '';
              }
            }

            if (matchedScene?.idbKey) {
              try { blobToConvert = await idb.get(matchedScene.idbKey); } catch (e) {}
            }
            if (!blobToConvert && clipUrl.startsWith('idb://')) {
              try { blobToConvert = await idb.get(clipUrl.replace('idb://', '')); } catch (e) {}
            }
            if (!blobToConvert && clipUrl) {
              try {
                const fetchTarget = (clipUrl.startsWith('http') || clipUrl.startsWith('blob:'))
                  ? clipUrl 
                  : (clipUrl.startsWith('/') ? window.location.origin + clipUrl : window.location.origin + '/' + clipUrl);
                const vRes = await fetch(fetchTarget);
                if (vRes.ok) blobToConvert = await vRes.blob();
              } catch (e) {}
            }

            if (!blobToConvert && ffScenesRef.current && ffScenesRef.current.length > 0) {
              for (const altSc of ffScenesRef.current) {
                let altUrl = altSc?.url || '';
                if (altSc?.idbKey) {
                  try { blobToConvert = await idb.get(altSc.idbKey); } catch (e) {}
                }
                if (!blobToConvert && altUrl.startsWith('idb://')) {
                  try { blobToConvert = await idb.get(altUrl.replace('idb://', '')); } catch (e) {}
                }
                if (!blobToConvert && altUrl) {
                  try {
                    const fetchTarget = (altUrl.startsWith('http') || altUrl.startsWith('blob:'))
                      ? altUrl 
                      : (altUrl.startsWith('/') ? window.location.origin + altUrl : window.location.origin + '/' + altUrl);
                    const vRes = await fetch(fetchTarget);
                    if (vRes.ok) blobToConvert = await vRes.blob();
                  } catch (e) {}
                }
                if (blobToConvert) break;
              }
            }

            if (blobToConvert) {
              formData.append(`clip_${i}`, blobToConvert, `clip_${i}.mp4`);
            }

            scenesList.push({
              id: matchedScene?.id || `scene_${i}`,
              role: meta.role,
              url: clipUrl,
              duration: segDuration
            });
          }
        } else {
          const firstScene = ffScenesRef.current[0];
          let clipUrl = firstScene?.url || '';
          let blobToConvert: Blob | null = null;
          if (firstScene?.idbKey) {
            try { blobToConvert = await idb.get(firstScene.idbKey); } catch (e) {}
          }
          if (!blobToConvert && clipUrl.startsWith('idb://')) {
            try { blobToConvert = await idb.get(clipUrl.replace('idb://', '')); } catch (e) {}
          }
          if (!blobToConvert && clipUrl) {
            try {
              const fetchTarget = (clipUrl.startsWith('http') || clipUrl.startsWith('blob:'))
                ? clipUrl 
                : (clipUrl.startsWith('/') ? window.location.origin + clipUrl : window.location.origin + '/' + clipUrl);
              const vRes = await fetch(fetchTarget);
              if (vRes.ok) blobToConvert = await vRes.blob();
            } catch (e) {}
          }
          if (blobToConvert) {
            formData.append('clip_0', blobToConvert, 'clip_0.mp4');
          }
          scenesList.push({
            id: firstScene?.id || 'scene_0',
            role: firstScene?.role || 'lao',
            url: clipUrl,
            duration: totalDur
          });
        }

        formData.append('metadata', JSON.stringify({
          scenes: scenesList,
          bgmVolume: bgmVolume !== undefined ? bgmVolume : 0.15,
          resolution: videoResolution,
          aspectRatio: videoAspectRatio,
          format: videoExt || 'mp4'
        }));

        let hasAnyClips = false;
        for (const pair of (formData as any).entries()) {
          if (pair[0].startsWith('clip_')) {
            hasAnyClips = true;
            break;
          }
        }

        if (hasAnyClips) {
          const res = await fetch('/api/export-video-ffmpeg', {
            method: 'POST',
            body: formData
          });

          if (res.ok) {
            const serverVideoUrlHeader = res.headers.get('X-Video-Url');
            const serverFilenameHeader = res.headers.get('X-Video-Filename');
            const exportedBlob = await res.blob();
            const videoUrl = serverVideoUrlHeader 
              ? serverVideoUrlHeader 
              : URL.createObjectURL(exportedBlob);

            setRenderedVideoBlob(exportedBlob);
            setRenderedVideoUrl(videoUrl);
            if (saveRenderHistoryItem) saveRenderHistoryItem(exportedBlob, videoUrl, serverFilenameHeader || undefined);
            if (setExportTab) setExportTab('history');
            setIsExportingVideo(false);
            setIsPreparingVideoData(false);
            releaseExportRAM();
            showToastMsg('🎉 Đã render xong video bằng FFmpeg Engine! Video mượt 100% không giật!', 'success', 5000);
            return;
          } else {
            console.warn('FFmpeg server returned non-ok status, falling back to frame-accurate canvas');
          }
        } else {
          console.warn('Không có video clip MP4 dựng sẵn (2D Character Mode). Tự động dùng Canvas Exporter Engine.');
        }
      } catch (ffmpegErr: any) {
        console.warn('FFmpeg Engine export error, falling back to canvas:', ffmpegErr);
      }

      // Cấu hình tham số xuất video (Kích thước tùy thuộc vào độ phân giải đã chọn)
      let width = 1920;
      let height = 1080;
      if (videoResolution === '720') { width = 1280; height = 720; }
      else if (videoResolution === '4k') { width = 3840; height = 2160; }
      else if (videoResolution === '1080') { width = 1920; height = 1080; }

      // Tráo đổi chiều rộng/cao nếu là khung hình dọc (9x16)
      const isVertical = videoAspectRatio === '9x16';
      if (isVertical) {
          const temp = width;
          width = height;
          height = temp;
      }

      const canvas = exportCanvasRef.current;
      canvas.width = width;
      canvas.height = height;

      // Chuẩn bị luồng MediaStream ghi hình từ Canvas (60 FPS chuẩn xác để khử 100% giật lag)
      const canvasStream = canvas.captureStream(60);
      const videoTrack = canvasStream.getVideoTracks()[0] as any;
      
      // Tạo nút âm thanh phát file Audio gộp
      const audioSourceNode = exportAudioCtxRef.current.createBufferSource();
      audioSourceNode.buffer = decodedAudioBuffer;

      // Tạo bộ thu phát sóng âm (Analyser) để nhép môi đồng bộ theo thời gian thực
      const analyserNode = exportAudioCtxRef.current.createAnalyser();
      analyserNode.fftSize = 256;
      audioSourceNode.connect(analyserNode);

      // Ghi âm luồng âm thanh
      const audioDestinationNode = exportAudioCtxRef.current.createMediaStreamDestination();
      audioSourceNode.connect(audioDestinationNode);
      audioSourceNode.connect(exportAudioCtxRef.current.destination);

      // MIX BGM: Nạp và kết hợp nhạc nền (BGM) nếu được lựa chọn
      let bgmSourceNode = null;
      if (bgmAudioData && bgmAudioData.url) {
          try {
              showToastMsg('Đang nạp nhạc nền...', 'loading', 0);
              const bgmRes = await fetch(bgmAudioData.url);
              if (bgmRes.ok) {
                  const bgmArrayBuf = await bgmRes.arrayBuffer();
                  const bgmDecodedBuffer = await exportAudioCtxRef.current.decodeAudioData(bgmArrayBuf);
                  
                  bgmSourceNode = exportAudioCtxRef.current.createBufferSource();
                  bgmSourceNode.buffer = bgmDecodedBuffer;
                  bgmSourceNode.loop = true;
                  
                  const bgmGainNode = exportAudioCtxRef.current.createGain();
                  bgmGainNode.gain.setValueAtTime(bgmVolume !== undefined ? bgmVolume : 0.15, exportAudioCtxRef.current.currentTime);
                  
                  bgmSourceNode.connect(bgmGainNode);
                  bgmGainNode.connect(audioDestinationNode);
                  bgmGainNode.connect(exportAudioCtxRef.current.destination);
              }
          } catch (bgmErr) {
              console.warn("Không thể nạp nhạc nền:", bgmErr);
          }
      }

      // Gộp luồng Video từ Canvas và luồng Audio thành MediaStream tổng
      const combinedStream = new MediaStream([
          canvasStream.getVideoTracks()[0],
          audioDestinationNode.stream.getAudioTracks()[0]
      ]);

      // Bắt đầu khởi tạo bộ mã hóa (Recorder) để đóng gói video (Dùng VP8 phần cứng siêu mượt)
      let options: any = { mimeType: 'video/webm;codecs=vp8,opus', videoBitsPerSecond: 12000000 };
      if (videoResolution === '4k') options.videoBitsPerSecond = 35000000;
      else if (videoResolution === '720') options.videoBitsPerSecond = 6000000;

      if (videoExt === 'mp4' && MediaRecorder.isTypeSupported('video/mp4;codecs=h264,aac')) {
          options.mimeType = 'video/mp4;codecs=h264,aac';
      }

      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'video/webm;codecs=vp9,opus';
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              options.mimeType = 'video/webm';
          }
      }

      const mediaRecorder = new MediaRecorder(combinedStream, options);
      exportMediaRecorderRef.current = mediaRecorder;
      const chunks: any[] = [];

      mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
          setRenderedVideoBlob(blob);
          const videoUrl = URL.createObjectURL(blob);
          setRenderedVideoUrl(videoUrl);
          if (saveRenderHistoryItem) saveRenderHistoryItem(blob, videoUrl);
          if (setExportTab) setExportTab('history');
          setIsExportingVideo(false);
          releaseExportRAM();
          showToastMsg('🎉 Đã xuất video thành công!', 'success');
      };

      // TÂM AN PROFILER V2: Khởi tạo các biến đo đạc
      const profilerStats = {
          startTime: Date.now(),
          endTime: 0,
          totalFrames: 0,
          slowFrames: 0,
          droppedFrames: 0,
          drawTimes: [],
          chromaProcessingTimes: [],
          resolution: `${width}x${height}`,
          fxEnabled: enableAutoHarmonization
      };

      // Tua mồi tất cả video trước khi quay
      const resetAndPause = (vid: any) => {
          if (vid) {
              vid.pause();
              vid.currentTime = 0.05;
              if (vid.chromaCtx && vid.chromaCanvas) {
                  vObj.chromaCtx.clearRect(0, 0, vObj.chromaCanvas.width, vObj.chromaCanvas.height);
              }
              resetAndPause(vObj.elementA);
              resetAndPause(vObj.elementB);
          }
      };

      const waitForSeek = (vid: any) => {
          return new Promise<void>(resolve => {
              if (!vid) return resolve();
              vid.currentTime = 0.05;
              if (!vid.seeking) return resolve();
              const onSeeked = () => { vid.removeEventListener('seeked', onSeeked); resolve(); };
              vid.addEventListener('seeked', onSeeked);
              setTimeout(() => { vid.removeEventListener('seeked', onSeeked); resolve(); }, 1500);
          });
      };

      const bgWaitPromises = customBgs.reduce((acc: any[], bg: any) => {
          if (bg.type === 'video') {
              acc.push(waitForSeek(bgVideoRefs.current[bg.id]?.elementA));
              acc.push(waitForSeek(bgVideoRefs.current[bg.id]?.elementB));
          }
          return acc;
      }, []);

      await Promise.all([
          waitForSeek(laoExportVidRefs.current.idle),
          waitForSeek(laoExportVidRefs.current.talking),
          waitForSeek(userExportVidRefs.current.idle),
          waitForSeek(userExportVidRefs.current.talking),
          waitForSeek(userExportVidRefs.current.bowing),
          ...ffScenesRef.current.map((scene: any) => waitForSeek(ffVidRefs.current[scene.id])), 
          ...bgWaitPromises
      ]);

      const attachRVFC = (vid: any) => {
          if (!vid || !vid.requestVideoFrameCallback) return;
          vid.lastRvfFrameTime = 0;
          vid.requestVideoFrameCallback((now: any, metadata: any) => {
              vid.lastRvfFrameTime = metadata.mediaTime;
          });
      };

      ['idle', 'talking'].forEach(t => attachRVFC(laoExportVidRefs.current[t]));
      ['idle', 'talking', 'bowing'].forEach(t => attachRVFC(userExportVidRefs.current[t]));
      ffScenesRef.current.forEach((scene: any) => attachRVFC(ffVidRefs.current[scene.id]));

      customBgs.forEach((bg: any) => { 
          if (bg.type === 'video') {
              attachRVFC(bgVideoRefs.current[bg.id]?.elementA);
              attachRVFC(bgVideoRefs.current[bg.id]?.elementB);
          } 
      });

      customBgs.forEach((bg: any) => {
          if (bg.type === 'video' && bg.visible !== false) {
              const vObj = bgVideoRefs.current[bg.id];
              if (vObj && vObj.elementA) { vObj.elementA.play().catch(()=>{}); }
          }
      });

      ['idle'].forEach(t => { 
          if(laoExportVidRefs.current[t]) { laoExportVidRefs.current[t].play().catch(()=>{}); }
          if(userExportVidRefs.current[t]) { userExportVidRefs.current[t].play().catch(()=>{}); }
      });
      
      ffScenesRef.current.forEach((scene: any) => { 
          if(ffVidRefs.current[scene.id]) { 
              const v = ffVidRefs.current[scene.id];
              v.loop = true;
              v.play().catch(()=>{}); 
          }
      });

      // Bắt đầu quay hình và phát âm thanh đồng thời
      if (exportAudioCtxRef.current && exportAudioCtxRef.current.state === 'suspended') {
          await exportAudioCtxRef.current.resume();
      }
      const audioStartCtxTime = exportAudioCtxRef.current.currentTime;
      mediaRecorder.start(100);
      audioSourceNode.start();
      if (bgmSourceNode) {
          bgmSourceNode.start(0);
      }
      if (typeof window !== 'undefined') {
          (window as any)._testExporter = {
              mediaRecorder,
              audioSourceNode,
              exportAudioCtx: exportAudioCtxRef.current
          };
      }
      setIsPreparingVideoData(false);
      setIsExportingVideo(true);
      showToastMsg('Đang xuất video... Vui lòng không đóng tab này!', 'loading', 0);

      // --- GAME LOOP: KHỞI CHẠY BỘ MÁY VẼ KHUNG HÌNH (ENGINE 2D/GL) ---
      const totalDuration = decodedAudioBuffer.duration;
      let currentLaoBlockIdx = 0;
      let currentUserBlockIdx = 0;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const frequencyDataArray = new Uint8Array(analyserNode.frequencyBinCount);

      const drawFrame = () => {
        const frameStart = performance.now();
        const ct = Math.max(0, exportAudioCtxRef.current.currentTime - audioStartCtxTime);

        let introDuration = 4.0;
        let outroStart = totalDuration - 2.5;
        let isOutro = ct >= outroStart;

        // Clear canvas to prevent frame residuals and overlapping text
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, width, height);

        // Update progress status inside the modal UI
        const progress = Math.min(99, Math.round((ct / totalDuration) * 100));
        
        // Find active segment in timeline
        const activeProgressSegmentIdx = combinedAudioMetadata.findIndex((m: any) => ct >= m.start && ct <= m.end);
        const activeProgressSegment = activeProgressSegmentIdx !== -1 ? combinedAudioMetadata[activeProgressSegmentIdx] : null;
        
        let progressDetail = '';
        if (ct <= introDuration && enableIntro) {
            progressDetail = `Đang chạy Intro: "${introTitle || 'Giới thiệu'}"`;
        } else if (isOutro) {
            progressDetail = `Đang chạy Outro kết thúc`;
        } else if (activeProgressSegment) {
            const roleName = activeProgressSegment.role === 'ai' ? 'Lão' : 'Con';
            progressDetail = `Đang thoại (${roleName}): "${activeProgressSegment.text.substring(0, 35)}..."`;
        } else {
            progressDetail = `Đang chuyển cảnh...`;
        }

        const statusEl = document.getElementById('ai-moderator-status');
        if (statusEl) {
            statusEl.innerHTML = `
                <div class="font-mono flex flex-col gap-1 text-left text-xs">
                    <div class="font-bold flex items-center gap-1.5 text-emerald-400">
                        <span class="animate-pulse text-red-500">⏺️</span> 
                        Đang render video: ${progress}% (${Math.floor(ct)}s / ${Math.floor(totalDuration)}s)
                    </div>
                    <div class="text-[10px] text-slate-300 italic truncate max-w-[280px]">
                        ${progressDetail}
                    </div>
                </div>
            `;
        }

        if (ct >= totalDuration) {
            mediaRecorder.stop();
            audioSourceNode.stop();
            if (bgmSourceNode) {
                try { bgmSourceNode.stop(); } catch(e){}
            }
            exportAudioCtxRef.current.close().catch(()=>{});
            
            profilerStats.endTime = Date.now();
            const report = buildDiagnosticReport(profilerStats);
            setDiagnosticReport(report);
            return;
        }

        // 1. Vẽ bối cảnh video nền kép hoặc ảnh tĩnh
        const activeBg = customBgs.find((b: any) => b.visible !== false);
        if (activeBg) {
            if (activeBg.type === 'image' && preloadedBgImgRef.current) {
                ctx.drawImage(preloadedBgImgRef.current, 0, 0, width, height);
            } else if (activeBg.type === 'video') {
                const vObj = bgVideoRefs.current[activeBg.id];
                if (vObj) {
                    const primary = vObj.elementA;
                    const secondary = vObj.elementB;
                    
                    if (primary && primary.readyState >= 2) {
                        if (!vObj.chromaCanvas) {
                            vObj.chromaCanvas = document.createElement('canvas');
                            vObj.chromaCanvas.width = primary.videoWidth;
                            vObj.chromaCanvas.height = primary.videoHeight;
                            vObj.chromaCtx = vObj.chromaCanvas.getContext('2d', { willReadFrequently: true });
                        }
                        
                        const cCanvas = vObj.chromaCanvas;
                        const cCtx = vObj.chromaCtx;
                        
                        const currentDecoderTime = primary.lastRvfFrameTime || primary.currentTime;
                        if (currentDecoderTime !== vObj.lastRenderedTime) {
                            cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
                            cCtx.drawImage(primary, 0, 0, cCanvas.width, cCanvas.height);
                            const tChromaStart = performance.now();
                            processChromaKeyPixels(cCtx, cCanvas.width, cCanvas.height, activeBg);
                            profilerStats.chromaProcessingTimes.push(performance.now() - tChromaStart);
                            vObj.lastRenderedTime = currentDecoderTime;
                            
                            // Đổi vai bản sao A và B nếu gần đến điểm cuối video nền
                            if (primary.duration && primary.currentTime >= primary.duration - 0.25) {
                                if (secondary) {
                                    secondary.currentTime = 0.05;
                                    secondary.play().catch(()=>{});
                                    vObj.elementA = secondary;
                                    vObj.elementB = primary;
                                }
                            }
                        }
                        ctx.drawImage(cCanvas, 0, 0, width, height);
                    }
                }
            }
        } else {
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, width, height);
        }

        // TÍNH TOÁN CẢM XÚC VÀ LỜI PHỤ ĐỀ THEO HÀNG ĐỢI
        const segment = combinedAudioMetadata.find((m: any) => ct >= (m.start - 0.3) && ct <= (m.end + 0.3));
        const activeEmotion = segment ? (segment.emotion || 'calm') : 'calm';
        const activeText = segment ? (segment.text || '') : '';
        const activeRole = segment ? segment.role : 'ai';

        const lines = wrapTextToLines(ctx, activeText, width * 0.85);

        isOutro = ct >= outroStart;

        // 2. Chế độ Video Dựng sẵn Toàn cảnh (Bypass 3D)
        if (isFullFrameMode) {
            let isUserSpeaking = false;
            let isLaoSpeaking = false;
            let isUserBowing = false;
            isOutro = false;

            // Dò tìm trên timeline xem ai đang là người nói chính
            let currentLaoSpeaking = false;
            if (currentLaoBlockIdx < laoTalkingBlocks.length) {
                const block = laoTalkingBlocks[currentLaoBlockIdx];
                if (ct >= block.start && ct <= block.end) {
                    currentLaoSpeaking = true;
                } else if (ct > block.end) {
                    currentLaoBlockIdx++;
                }
            }

            let currentUserSpeaking = false;
            if (currentUserBlockIdx < userTalkingBlocks.length) {
                const block = userTalkingBlocks[currentUserBlockIdx];
                if (ct >= block.start && ct <= block.end) {
                    currentUserSpeaking = true;
                } else if (ct > block.end) {
                    currentUserBlockIdx++;
                }
            }

            // Giai đoạn Outro ở cuối video gộp
            outroStart = totalDuration - 2.5; 
            if (ct >= outroStart) {
                isOutro = true;
            }

            if (currentLaoSpeaking) { isLaoSpeaking = true; isUserSpeaking = false; }
            else if (currentUserSpeaking) { isUserSpeaking = true; isLaoSpeaking = false; }
            
            if (isOutro) { isUserBowing = true; isUserSpeaking = false; isLaoSpeaking = false; }

            // Giới hạn chống race condition: không cho cả 2 nói đồng thời
            if (isLaoSpeaking && isUserSpeaking) {
                if (activeRole === 'ai') isUserSpeaking = false;
                else isLaoSpeaking = false;
            }

            let currentUserState = isUserSpeaking ? 'talking' : (isUserBowing ? 'bowing' : 'idle');
            let currentLaoState = isLaoSpeaking ? 'talking' : 'idle';

            let activeScreenRole = isOutro ? 'user' : (isUserSpeaking ? 'user' : (isLaoSpeaking ? 'ai' : (isUserBowing ? 'user' : (exportAudioCtxRef.current.lastScreenRole || 'ai'))));
            exportAudioCtxRef.current.lastScreenRole = activeScreenRole;

            // Tua trước video Talking của cảnh kế tiếp
            let lookAheadCt = ct + 0.5;
            let isNextLaoSpeaking = (currentLaoBlockIdx < laoTalkingBlocks.length && laoTalkingBlocks[currentLaoBlockIdx].start <= lookAheadCt && !isLaoSpeaking);
            let isNextUserSpeaking = (currentUserBlockIdx < userTalkingBlocks.length && userTalkingBlocks[currentUserBlockIdx].start <= lookAheadCt && !isUserSpeaking);

            if (isNextUserSpeaking && !isUserSpeaking) {
                if (!exportAudioCtxRef.current.preWarmedUserTalking && userVisualType === 'video' && userExportVidRefs.current.talking) {
                    userExportVidRefs.current.talking.currentTime = 0.01; 
                    userExportVidRefs.current.talking.pause();
                    exportAudioCtxRef.current.preWarmedUserTalking = true;
                }
            } else {
                exportAudioCtxRef.current.preWarmedUserTalking = false;
            }

            if (isNextLaoSpeaking && !isLaoSpeaking) {
                if (!exportAudioCtxRef.current.preWarmedLaoTalking && laoVisualType === 'video' && laoExportVidRefs.current.talking) {
                     laoExportVidRefs.current.talking.currentTime = 0.01; 
                     laoExportVidRefs.current.talking.pause();
                     exportAudioCtxRef.current.preWarmedLaoTalking = true;
                }
            } else {
                exportAudioCtxRef.current.preWarmedLaoTalking = false;
            }

            // GIAO DIỆN LĂN LIÊM (CẮT CẢNH ĐA CẢM XÚC - MULTI CAMERA DIRECTION)
            let currentActiveSceneId = 'scene_lao_calm';
            if (activeScreenRole === 'ai') {
                currentActiveSceneId = `scene_lao_${activeEmotion}`;
            } else if (activeScreenRole === 'user') {
                currentActiveSceneId = isOutro ? 'scene_outro_calm' : `scene_user_${activeEmotion}`;
            }

            let currentActiveScene = null;
            if (segment && segment.msgId) {
                // Ưu tiên tìm cảnh khớp đúng ID hoặc msgId của câu thoại đang phát
                currentActiveScene = ffScenesRef.current.find((s: any) => 
                    s.msgId === segment.msgId || 
                    s.id === `scene_msg_${segment.msgId}` || 
                    s.id.endsWith(`_${segment.msgId}`)
                );
            }
            if (!currentActiveScene) {
                // Fallback về cách cũ (theo cảm xúc / vai trò)
                currentActiveScene = ffScenesRef.current.find((s: any) => s.id.startsWith(currentActiveSceneId)) || 
                                     ffScenesRef.current.find((s: any) => s.role === activeScreenRole);
            }

            if (currentActiveScene && ffVidRefs.current[currentActiveScene.id]) {
                const activeV = ffVidRefs.current[currentActiveScene.id];
                
                // Tách nền & vẽ video dựng sẵn
                if (activeV.readyState >= 2) {
                    if (!activeV.chromaCanvas) {
                        activeV.chromaCanvas = document.createElement('canvas');
                        activeV.chromaCanvas.width = activeV.videoWidth;
                        activeV.chromaCanvas.height = activeV.videoHeight;
                        activeV.chromaCtx = activeV.chromaCanvas.getContext('2d', { willReadFrequently: true });
                    }
                    
                    const cCanvas = activeV.chromaCanvas;
                    const cCtx = activeV.chromaCtx;
                    
                    if (activeV.paused) activeV.play().catch(()=>{});
                    
                    const currentDecoderTime = activeV.lastRvfFrameTime || activeV.currentTime;
                    if (currentDecoderTime !== activeV.lastRenderedTime) {
                        cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
                        cCtx.drawImage(activeV, 0, 0, cCanvas.width, cCanvas.height);
                        
                        if (laoChromaSettings?.enabled) {
                            const tChromaStart = performance.now();
                            processChromaKeyPixels(cCtx, cCanvas.width, cCanvas.height, laoChromaSettings);
                            profilerStats.chromaProcessingTimes.push(performance.now() - tChromaStart);
                        }
                        activeV.lastRenderedTime = currentDecoderTime;
                    }
                    
                    // Tính toán tỉ lệ Object-Fit chuẩn mượt 60FPS
                    const canvasAspect = width / height;
                    const videoAspect = (cCanvas.width && cCanvas.height) ? (cCanvas.width / cCanvas.height) : canvasAspect;
                    let drawW = width;
                    let drawH = height;
                    let drawX = 0;
                    let drawY = 0;
                    
                    if (videoAspect > canvasAspect) {
                        drawH = height;
                        drawW = height * videoAspect;
                        drawX = (width - drawW) / 2;
                    } else {
                        drawW = width;
                        drawH = width / videoAspect;
                        drawY = (height - drawH) / 2;
                    }
                    
                    ctx.drawImage(cCanvas, drawX, drawY, drawW, drawH);
                }
            } else {
                // FALLBACK: VẼ KHUNG HÌNH 2.5D CỦA LÃO/USER NẾU THIẾU VIDEO DỰNG SẴN
                let activeFullFrameImg = null;
                
                // Nhép miệng dựa trên sóng âm (Analyser) cho Ảnh tĩnh/SVG
                analyserNode.getByteFrequencyData(frequencyDataArray);
                const average = frequencyDataArray.reduce((sum, val) => sum + val, 0) / frequencyDataArray.length;
                const mouthVal = Math.min(100, average * 1.5);
                let mouthState = 0;
                if (mouthVal >= 12) mouthState = 16;
                else if (mouthVal >= 4) mouthState = 8;

                if (activeScreenRole === 'user') {
                    if (isOutro) {
                        // Outro: Người hỏi vái lạy Lão (Tiến trình lạy từ 0% đến 100%)
                        const outroDuration = totalDuration - outroStart;
                        const elapsedOutro = ct - outroStart;
                        const bowPct = Math.min(1.0, elapsedOutro / outroDuration);
                        const bowState = Math.min(20, Math.floor(bowPct * 5) * 4);
                        activeFullFrameImg = preloadedBowFrames.current[bowState] || preloadedUserFrames.current[0];
                    } else {
                        activeFullFrameImg = preloadedUserFrames.current[isUserSpeaking ? mouthState : 0] || preloadedUserFrames.current[0];
                    }
                } else {
                    activeFullFrameImg = preloadedLaoFrames.current[isLaoSpeaking ? mouthState : 0] || preloadedLaoFrames.current[0];
                }

                if (activeFullFrameImg) {
                    ctx.fillStyle = '#0b1329';
                    ctx.fillRect(0, 0, width, height);

                    const scale = Math.max(width / activeFullFrameImg.width, height / activeFullFrameImg.height) * 1.1;
                    const w = activeFullFrameImg.width * scale;
                    const h = activeFullFrameImg.height * scale;
                    const dx = (width - w) / 2;
                    const dy = (height - h) / 2 + (height * 0.05);

                    ctx.save();
                    if (enableAutoHarmonization && harmonizeSettings) {
                        ctx.filter = `contrast(${harmonizeSettings.contrast}%) brightness(${harmonizeSettings.brightness}%) saturate(${harmonizeSettings.saturate}%) grayscale(${harmonizeSettings.grayscale}%) sepia(${harmonizeSettings.sepia}%)`;
                    }
                    ctx.drawImage(activeFullFrameImg, dx, dy, w, h);
                    ctx.restore();
                }
            }

        } else {
            // 3. Chế độ Video 3D (2 nhân vật đối thoại trên 1 khung hình)
            // Lấy sóng âm để cử động miệng
            analyserNode.getByteFrequencyData(frequencyDataArray);
            const average = frequencyDataArray.reduce((sum, val) => sum + val, 0) / frequencyDataArray.length;
            const mouthVal = Math.min(100, average * 1.5);
            let mouthState = 0;
            if (mouthVal >= 12) mouthState = 16;
            else if (mouthVal >= 4) mouthState = 8;

            let isUserSpeaking = false;
            let isLaoSpeaking = false;
            let isUserBowing = false;
            isOutro = false;

            let currentLaoSpeaking = false;
            if (currentLaoBlockIdx < laoTalkingBlocks.length) {
                const block = laoTalkingBlocks[currentLaoBlockIdx];
                if (ct >= block.start && ct <= block.end) currentLaoSpeaking = true;
                else if (ct > block.end) currentLaoBlockIdx++;
            }

            let currentUserSpeaking = false;
            if (currentUserBlockIdx < userTalkingBlocks.length) {
                const block = userTalkingBlocks[currentUserBlockIdx];
                if (ct >= block.start && ct <= block.end) currentUserSpeaking = true;
                else if (ct > block.end) currentUserBlockIdx++;
            }

            outroStart = totalDuration - 2.5; 
            if (ct >= outroStart) isOutro = true;

            if (currentLaoSpeaking) { isLaoSpeaking = true; isUserSpeaking = false; }
            else if (currentUserSpeaking) { isUserSpeaking = true; isLaoSpeaking = false; }
            
            if (isOutro) { isUserBowing = true; isUserSpeaking = false; isLaoSpeaking = false; }

            if (isLaoSpeaking && isUserSpeaking) {
                if (activeRole === 'ai') isUserSpeaking = false;
                else isLaoSpeaking = false;
            }

            let currentUserState = isUserSpeaking ? 'talking' : (isUserBowing ? 'bowing' : 'idle');
            let currentLaoState = isLaoSpeaking ? 'talking' : 'idle';

            // Vẽ Lão
            let laoImgToDraw = null;
            if (laoVisualType === 'video') {
                const activeV = laoExportVidRefs.current[currentLaoState];
                if (activeV && activeV.readyState >= 2) {
                    if (!activeV.chromaCanvas) {
                        activeV.chromaCanvas = document.createElement('canvas');
                        activeV.chromaCanvas.width = activeV.videoWidth;
                        activeV.chromaCanvas.height = activeV.videoHeight;
                        activeV.chromaCtx = activeV.chromaCanvas.getContext('2d', { willReadFrequently: true });
                    }
                    
                    const cCanvas = activeV.chromaCanvas;
                    const cCtx = activeV.chromaCtx;
                    
                    const currentDecoderTime = activeV.lastRvfFrameTime || activeV.currentTime;
                    if (currentDecoderTime !== activeV.lastRenderedTime) {
                        cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
                        cCtx.drawImage(activeV, 0, 0, cCanvas.width, cCanvas.height);
                        const tChromaStart = performance.now();
                        processChromaKeyPixels(cCtx, cCanvas.width, cCanvas.height, laoChromaSettings);
                        profilerStats.chromaProcessingTimes.push(performance.now() - tChromaStart);
                        activeV.lastRenderedTime = currentDecoderTime;
                        
                        if (activeV.duration && activeV.currentTime >= activeV.duration - 0.15) {
                            activeV.currentTime = 0.05;
                        }
                    }
                    if (activeV.paused) activeV.play().catch(()=>{});
                    laoImgToDraw = cCanvas;
                }
            } else {
                laoImgToDraw = preloadedLaoFrames.current[isLaoSpeaking ? mouthState : 0] || preloadedLaoFrames.current[0];
            }

            // Vẽ Người hỏi
            let userImgToDraw = null;
            if (userVisualType === 'video') {
                const activeV = userExportVidRefs.current[currentUserState];
                if (activeV && activeV.readyState >= 2) {
                    if (!activeV.chromaCanvas) {
                        activeV.chromaCanvas = document.createElement('canvas');
                        activeV.chromaCanvas.width = activeV.videoWidth;
                        activeV.chromaCanvas.height = activeV.videoHeight;
                        activeV.chromaCtx = activeV.chromaCanvas.getContext('2d', { willReadFrequently: true });
                    }
                    
                    const cCanvas = activeV.chromaCanvas;
                    const cCtx = activeV.chromaCtx;
                    
                    const currentDecoderTime = activeV.lastRvfFrameTime || activeV.currentTime;
                    if (currentDecoderTime !== activeV.lastRenderedTime) {
                        cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
                        cCtx.drawImage(activeV, 0, 0, cCanvas.width, cCanvas.height);
                        const tChromaStart = performance.now();
                        processChromaKeyPixels(cCtx, cCanvas.width, cCanvas.height, userChromaSettings);
                        profilerStats.chromaProcessingTimes.push(performance.now() - tChromaStart);
                        activeV.lastRenderedTime = currentDecoderTime;
                        
                        if (activeV.duration && activeV.currentTime >= activeV.duration - 0.15) {
                            activeV.currentTime = 0.05;
                        }
                    }
                    if (activeV.paused) activeV.play().catch(()=>{});
                    userImgToDraw = cCanvas;
                }
            } else {
                if (isOutro) {
                    const outroDuration = totalDuration - outroStart;
                    const elapsedOutro = ct - outroStart;
                    const bowPct = Math.min(1.0, elapsedOutro / outroDuration);
                    const bowState = Math.min(20, Math.floor(bowPct * 5) * 4);
                    userImgToDraw = preloadedBowFrames.current[bowState] || preloadedUserFrames.current[0];
                } else {
                    userImgToDraw = preloadedUserFrames.current[isUserSpeaking ? mouthState : 0] || preloadedUserFrames.current[0];
                }
            }

            // Tự động lật hướng nhân vật để nhìn đối diện nhau
            const { laoFlip, userFlip } = calculateAutoFlip(charOffsets.lao.x, charOffsets.user.x, authState?.currentLaoPresetId || 'char_lao_xeo', authState?.currentUserPresetId || 'char_user_nu');

            // Vẽ Lão lên khung hình chung
            if (laoImgToDraw) {
                const laoW = (laoImgToDraw.width || 300);
                const laoH = (laoImgToDraw.height || 400);
                const baseScale = Math.min(width, height) / 400;
                const scale = baseScale * charOffsets.lao.s;
                const w = laoW * scale;
                const h = laoH * scale;

                const baseLaoX = width * 0.25;
                const baseLaoY = height * 0.85 - h;
                const x = baseLaoX + (charOffsets.lao.x * baseScale);
                const y = baseLaoY - (charOffsets.lao.y * baseScale);

                ctx.save();
                if (enableAutoHarmonization && harmonizeSettings) {
                    ctx.filter = `contrast(${harmonizeSettings.contrast}%) brightness(${harmonizeSettings.brightness}%) saturate(${harmonizeSettings.saturate}%) grayscale(${harmonizeSettings.grayscale}%) sepia(${harmonizeSettings.sepia}%)`;
                }
                ctx.translate(x + w/2, y);
                if (laoFlip) ctx.scale(-1, 1);
                ctx.drawImage(laoImgToDraw, -w/2, 0, w, h);
                ctx.restore();
            }

            // Vẽ Người hỏi lên khung hình chung
            if (userImgToDraw) {
                const userW = (userImgToDraw.width || 300);
                const userH = (userImgToDraw.height || 400);
                const baseScale = Math.min(width, height) / 400;
                const scale = baseScale * charOffsets.user.s;
                const w = userW * scale;
                const h = userH * scale;

                const baseUserX = width * 0.75 - w;
                const baseUserY = height * 0.85 - h;
                const x = baseUserX + (charOffsets.user.x * baseScale);
                const y = baseUserY - (charOffsets.user.y * baseScale);

                ctx.save();
                if (enableAutoHarmonization && harmonizeSettings) {
                    ctx.filter = `contrast(${harmonizeSettings.contrast}%) brightness(${harmonizeSettings.brightness}%) saturate(${harmonizeSettings.saturate}%) grayscale(${harmonizeSettings.grayscale}%) sepia(${harmonizeSettings.sepia}%)`;
                }
                ctx.translate(x + w/2, y);
                if (userFlip) ctx.scale(-1, 1);
                ctx.drawImage(userImgToDraw, -w/2, 0, w, h);
                ctx.restore();
            }
        }

        // 4. Vẽ Logo đóng dấu thương hiệu
        if (logoData && logoSettings.visible !== false) {
            const logoSize = Math.round(Math.min(width, height) * 0.15 * (logoSettings.scale || 1.0));
            const padding = Math.round(Math.min(width, height) * 0.03);
            
            let logoX = padding;
            let logoY = padding;
            
            if (logoSettings.x !== undefined && logoSettings.y !== undefined && logoSettings.position === 'custom') {
                logoX = Math.round(width * (logoSettings.x / 100));
                logoY = Math.round(height * (logoSettings.y / 100));
            } else if (logoSettings.position === 'top-right' || (!logoSettings.position)) { logoX = width - logoSize - padding; }
            else if (logoSettings.position === 'bottom-left') { logoY = height - logoSize - padding; }
            else if (logoSettings.position === 'bottom-right') {
                logoX = width - logoSize - padding;
                logoY = height - logoSize - padding;
            }

            ctx.save();
            ctx.globalAlpha = logoSettings.opacity !== undefined ? logoSettings.opacity : 0.8;
            if (logoSettings.isCircular) {
                ctx.beginPath();
                ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI*2);
                ctx.closePath();
                ctx.clip();
            }
            if (processedLogoRef.current) {
                ctx.drawImage(processedLogoRef.current, logoX, logoY, logoSize, logoSize);
            } else {
                const img = new window.Image();
                img.onload = () => { processedLogoRef.current = img; };
                img.src = logoData;
            }
            ctx.restore();
        }

        // introDuration is defined at the top of drawFrame 
        const hasValidIntro = enableIntro && Boolean(introTitle?.trim() || introSubtitle?.trim());
        if (hasValidIntro && ct <= introDuration) {
            const opacity = ct <= 1.0 ? ct : (ct >= introDuration - 1.0 ? (introDuration - ct) : 1.0);
            
            ctx.fillStyle = `rgba(15, 23, 42, ${opacity * 0.95})`;
            ctx.fillRect(0, 0, width, height);

            const titleSize = Math.max(24, Math.min(width, height) * 0.05);
            ctx.font = `black ${titleSize}px sans-serif`;
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.textAlign = 'center';
            if (introTitle) ctx.fillText(introTitle, width / 2, height / 2 - (titleSize * 0.6));

            const subtitleSize = Math.max(16, Math.min(width, height) * 0.03);
            ctx.font = `500 ${subtitleSize}px sans-serif`;
            ctx.fillStyle = `rgba(249, 115, 22, ${opacity})`; 
            if (introSubtitle) ctx.fillText(introSubtitle, width / 2, height / 2 + (subtitleSize * 0.8));
        }

        // 6. Vẽ Phụ đề lời thoại (Subtitles)
        if (lines.length > 0 && ct > (hasValidIntro ? introDuration - 0.5 : 0)) {
            const fontSizeText = Math.max(18, Math.min(width, height) * 0.035 * subtitleScale);
            ctx.font = `bold ${fontSizeText}px sans-serif`;
            ctx.textAlign = 'center';

            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            ctx.lineWidth = fontSizeText * 0.15;
            ctx.strokeStyle = '#020617'; 

            let textY = height * (subtitleYPos / 100);
            if (lines.length > 1) {
                textY -= (lines.length - 1) * fontSizeText * 0.65;
            }

            lines.forEach((line: any) => {
                ctx.fillStyle = subtitleColor;
                ctx.strokeText(line, width/2, textY);
                ctx.fillText(line, width/2, textY);
                textY += fontSizeText * 1.3;
            });
            ctx.shadowColor = 'transparent';
        }

        // 7. Vẽ Outro ở cuối video
        if (enableOutroText && isOutro) {
            const opacity = Math.min(1.0, (ct - outroStart) / 1.0);
            
            ctx.fillStyle = `rgba(15, 23, 42, ${opacity * 0.95})`;
            ctx.fillRect(0, 0, width, height);

            const outroLines = String(outroText || '').split('\n');
            const outroSize = Math.max(20, Math.min(width, height) * 0.04);
            ctx.font = `bold ${outroSize}px sans-serif`;
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.textAlign = 'center';
            
            let textY = height / 2 - (outroLines.length - 1) * outroSize * 0.5;
            outroLines.forEach((line: any) => {
                ctx.fillText(line, width / 2, textY);
                textY += outroSize * 1.4;
            });
        }

        // Đo đạc FPS và lưu vào Diagnostic
        const frameEnd = performance.now();
        profilerStats.drawTimes.push(frameEnd - frameStart);
        profilerStats.totalFrames++;
        if (frameEnd - frameStart > 16.6) {
            profilerStats.slowFrames++;
            if (frameEnd - frameStart > 33.3) {
                profilerStats.droppedFrames++;
            }
        }

        if (videoTrack && typeof videoTrack.requestFrame === 'function') {
            videoTrack.requestFrame();
        }

        exportAnimFrameRef.current = requestAnimationFrame(drawFrame);
      };

      // Đâm luồng phát và bắt đầu game loop render
      exportAnimFrameRef.current = requestAnimationFrame(drawFrame);

    } catch (err: any) {
      console.error(err);
      showToastMsg(`Lỗi khi xuất video: ${err.message}`, 'error');
      setIsPreparingVideoData(false);
    }
  };

  const cancelVideoExport = () => {
    if (exportAnimFrameRef.current) {
        cancelAnimationFrame(exportAnimFrameRef.current);
        exportAnimFrameRef.current = null;
    }
    if (exportMediaRecorderRef.current && exportMediaRecorderRef.current.state === 'recording') {
      exportMediaRecorderRef.current.stop();
    }
    if (exportAudioCtxRef.current && exportAudioCtxRef.current.state !== 'closed') {
      exportAudioCtxRef.current.close().catch((err: any) => console.warn("Lỗi khi đóng AudioContext:", err));
    }
    exportAudioCtxRef.current = null; // Dọn rác
    
    resetVideoExport();
    releaseExportRAM();
    setIsExportingVideo(false);
    setIsPreviewFullscreen(false); // Reset trạng thái fullscreen khi thoát
    setShowVideoExportModal(false);

    // Xử lý childmodal routing: nếu mở từ script form (childmodal=create-video)
    // thì xóa childmodal+videoid param và giữ AiDirectorManagerModal đang mở
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const childModal = url.searchParams.get('childmodal');
      if (childModal === 'create-video') {
        // Xóa childmodal, videoid và scriptid
        url.searchParams.delete('childmodal');
        url.searchParams.delete('videoid');
        url.searchParams.delete('scriptid');
        window.history.replaceState(null, '', url.toString());
        // AiDirectorManagerModal vẫn đang mở (showAiManager không thay đổi)
        return;
      }
    }

    // Trường hợp thông thường (từ chat): kiểm tra videoExportSource cũ
    if (videoExportSource === 'ai_director' && setShowAiManager) {
        setShowAiManager(true);
    }
  };


  return {
    startVideoExport,
    cancelVideoExport,
    resetVideoExport,
    handleClearCache
  };
};
