// @ts-nocheck
"use client";
import React from "react";
import { X, Film, Check, Save, Sliders, Maximize, Minimize, RefreshCw, Loader2, Play, Pause, ChevronDown, Sparkles, FileText, Volume2, Plus, Info, Upload, PlayCircle, Eye, EyeOff, Music, Video, Archive, Share as ShareIcon, Copy, ChevronUp, Trash2, Palette, Music4, Wand2, XCircle, Undo2, Redo2, LayoutTemplate, Image as ImageIcon, Pencil, Mic } from "lucide-react";

import { useOngLaoContext } from "../context/OngLaoContext";
import { idb } from "../constants";
import { updateChatMessageContentAction, getChatMessagesAction } from "@/actions/chat";



// Hàm tự động chụp 1 khung ảnh tĩnh JPEG (Poster Snapshot 160x160) từ video mà KHÔNG giữ thẻ video HTML5 trong bộ nhớ
const generateVideoPoster = (url: string): Promise<string> => {
    return new Promise((resolve) => {
        if (!url) { resolve(''); return; }
        const video = document.createElement('video');
        video.src = url;
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.preload = 'metadata';
        
        const cleanup = () => {
            video.removeAttribute('src');
            video.load();
        };

        const timeout = setTimeout(() => { cleanup(); resolve(''); }, 2000);

        video.onloadeddata = () => {
            video.currentTime = 0.3;
        };

        video.onseeked = () => {
            clearTimeout(timeout);
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 160;
                canvas.height = 160;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
                    cleanup();
                    resolve(dataUrl);
                    return;
                }
            } catch (e) {
                console.warn('Canvas poster capture failed:', e);
            }
            cleanup();
            resolve('');
        };

        video.onerror = () => {
            clearTimeout(timeout);
            cleanup();
            resolve('');
        };
    });
};

// SceneThumbnailItem: Component thumbnail chụp ảnh tĩnh poster, hiển thị ảnh xem trước sắc nét mà KHÔNG tốn RAM/GPU
const SceneThumbnailItem = ({ scene, setFfScenes }: { scene: any; setFfScenes: any }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [poster, setPoster] = React.useState(scene.poster || '');

    React.useEffect(() => {
        if (scene.url && !poster) {
            generateVideoPoster(scene.url).then(p => {
                if (p) {
                    setPoster(p);
                    setFfScenes((prev: any) => prev.map((s: any) => s.id === scene.id ? { ...s, poster: p } : s));
                }
            });
        }
    }, [scene.url]);

    const handleFile = async (file: File) => {
        if (!file) return;
        if (scene.url) URL.revokeObjectURL(scene.url);
        const url = URL.createObjectURL(file);
        const p = await generateVideoPoster(url);
        setPoster(p);
        const idbKey = `ff_clip_${scene.role}_${scene.emotion}_${Date.now()}_${Math.floor(Math.random()*10000)}`;
        setTimeout(() => { idb.set(idbKey, file).catch(err => console.warn('Lỗi lưu IDB:', err)); }, 50);
        setFfScenes((prev: any) => prev.map((s: any) => s.id === scene.id ? { ...s, url, poster: p, idbKey } : s));
    };

    return (
        <label 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-16 h-16 rounded-md border border-dashed border-emerald-500/30 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden bg-slate-900 shrink-0 group transition-all"
        >
            <input 
                type="file" 
                accept="video/*" 
                className="hidden" 
                onChange={(e: any) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = '';
                }} 
            />
            {scene.url ? (
                isHovered ? (
                    <video 
                        src={scene.url} 
                        autoPlay 
                        muted 
                        loop
                        playsInline 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    poster ? (
                        <div className="w-full h-full relative group">
                            <img src={poster} alt="thumbnail" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                                <Film size={14} className="text-white/80 drop-shadow" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/90 p-1 relative">
                            <Film size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-bold text-emerald-300 mt-1 truncate max-w-full px-1">Đã nạp</span>
                        </div>
                    )
                )
            ) : (
                <div className="flex flex-col items-center gap-0.5">
                    <Plus size={14} className="text-emerald-500" />
                    <span className="text-[7px] text-slate-500 font-bold">Thêm clip</span>
                </div>
            )}
        </label>
    );
};


// VideoCreatorModal: Modal xuất video pháp bảo
const VideoCreatorModal = () => {
  const p = useOngLaoContext();
  const previewVideoRef = React.useRef(null);
  const [selectedFfPackId, setSelectedFfPackId] = React.useState('');

  // States and Handlers for inline text/audio editing within VideoCreatorModal
  const [playingMsgId, setPlayingMsgId] = React.useState<string | null>(null);
  const [localAudio, setLocalAudio] = React.useState<HTMLAudioElement | null>(null);
  const [generatingMsgIds, setGeneratingMsgIds] = React.useState<Record<string, boolean>>({});

  const handlePlayMsgAudio = (msgId: string, audioUrl: string) => {
      if (localAudio) {
          localAudio.pause();
      }
      if (playingMsgId === msgId) {
          setPlayingMsgId(null);
          setLocalAudio(null);
          return;
      }
      const audio = new Audio(audioUrl);
      audio.play().catch(err => console.warn("Lỗi phát audio:", err));
      audio.onended = () => setPlayingMsgId(null);
      setLocalAudio(audio);
      setPlayingMsgId(msgId);
  };

  React.useEffect(() => {
    return () => {
      if (localAudio) {
        localAudio.pause();
      }
    };
  }, [localAudio]);

  const handleTextBlur = async (scene: any, newText: string) => {
      if (!newText.trim() || newText === scene.textSnippet) return;
      
      // 1. Cập nhật state local
      setFfScenes((prev: any) => prev.map((s: any) => s.id === scene.id ? { ...s, textSnippet: newText } : s));
      p.updateCurrentMessages((prevMsgs: any[]) => prevMsgs.map((m: any) => m.id === scene.msgId ? { ...m, text: newText, audioUrl: null } : m));
      
      // 2. Cập nhật database
      try {
          await updateChatMessageContentAction(scene.msgId, newText);
      } catch (err) {
          console.error("Lỗi cập nhật tin nhắn:", err);
      }
  };

  const handleGenerateSingleAudio = async (msgId: string, text: string, role: string) => {
      if (generatingMsgIds[msgId]) return;
      setGeneratingMsgIds(prev => ({ ...prev, [msgId]: true }));
      try {
          const targetRole = role === 'lao' ? 'ai' : 'user';
          const success = await p.generateVoice(msgId, text, targetRole, p.currentSessionId, false);
          if (success) {
              p.showToastMsg?.("Đã tạo audio câu thoại thành công!", "success");
              const res = await getChatMessagesAction(p.currentSessionId);
              if (res.success && res.data) {
                  const mapped = res.data.map((m: any) => ({
                      id: m.id,
                      role: m.role.toLowerCase() === 'user' ? 'user' : 'ai',
                      text: m.content,
                      audioUrl: m.audioUrl,
                      emotion: m.emotion || 'calm',
                      sessionId: p.currentSessionId
                  }));
                  p.updateCurrentMessages(mapped);
              }
          } else {
              p.showToastMsg?.("Lỗi tạo audio câu thoại.", "error");
          }
      } catch (err: any) {
          p.showToastMsg?.("Lỗi tạo audio: " + err.message, "error");
      } finally {
          setGeneratingMsgIds(prev => {
              const next = { ...prev };
              delete next[msgId];
              return next;
          });
      }
  };

  // Tự động nạp video đã render gần nhất của kịch bản hiện tại (hoặc theo tham số videoid từ URL)
  React.useEffect(() => {
    if (!p.showVideoExportModal) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlVideoId = urlParams.get('videoid');
    
    if (urlVideoId && p.renderHistory?.length > 0) {
      const matchedVideo = p.renderHistory.find((v: any) => v.id === urlVideoId);
      if (matchedVideo) {
        p.setRenderedVideoUrl(matchedVideo.url);
        p.setRenderedVideoBlob?.(matchedVideo.blob || null);
        return;
      }
    }
    
    if (p.renderHistory?.length > 0) {
      // 1. Tìm video của kịch bản hiện tại
      const sessionVideos = p.currentSessionId 
        ? p.renderHistory.filter((v: any) => v.sessionId === p.currentSessionId)
        : [];
        
      let targetVideo = null;
      if (sessionVideos.length > 0) {
        targetVideo = sessionVideos[0];
      } else {
        // Fallback: Lấy video mới nhất trong lịch sử làm mặc định nếu không có video khớp sessionId
        targetVideo = p.renderHistory[0];
      }
      
      if (targetVideo) {
        p.setRenderedVideoUrl(targetVideo.url);
        p.setRenderedVideoBlob?.(targetVideo.blob || null);
        
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('videoid', targetVideo.id);
          window.history.replaceState(null, '', url.toString());
        }
        return;
      }
    }
    
    // Nếu hoàn toàn không có lịch sử video nào
    p.setRenderedVideoUrl(null);
    p.setRenderedVideoBlob?.(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('videoid')) {
        url.searchParams.delete('videoid');
        window.history.replaceState(null, '', url.toString());
      }
    }
  }, [p.showVideoExportModal, p.currentSessionId, p.renderHistory]);

  // Tự động chia cảnh theo từng câu thoại khi mở modal (nếu chưa có scene gán message cụ thể)
  React.useEffect(() => {
    if (!p.showVideoExportModal) return;
    if (!p.messages?.length) return;
    if (p.messages[0]?.sessionId && p.messages[0]?.sessionId !== p.currentSessionId) return; // Đợi load đúng tin nhắn của session hiện tại

    const hasMessageScenes = p.ffScenes?.some((s: any) => s.msgId);
    if (hasMessageScenes) {
        // Kiểm tra xem các scene cũ có bị "lạc lõng" so với messages hiện tại không (do đổi kịch bản)
        const isStale = p.ffScenes.some((s: any) => s.msgId && !p.messages.find((m: any) => m.id === s.msgId));
        // Kiểm tra xem có các scene dư thừa (không có msgId và không phải outro) từ lần tải lên trước không
        const hasRedundant = p.ffScenes.some((s: any) => !s.msgId && s.role !== 'outro');
        
        if (!isStale && !hasRedundant) return; // Đã sạch sẽ và đồng bộ rồi, không cần làm lại
        
        if (hasRedundant && !isStale) {
            // Lọc bỏ tất cả các scene dư thừa mà không reset lại URL của các scene hợp lệ
            const cleaned = p.ffScenes.filter((s: any) => s.msgId || s.role === 'outro');
            p.setFfScenes(cleaned);
            return;
        }
    }
    
    const detectEmotion = (text: string) => {
        if (!text) return 'calm';
        const lower = text.toLowerCase();
        if (lower.match(/buồn|mệt|đau|khổ|chán|tuyệt vọng|khóc|sợ|lo lắng|chết|bế tắc/)) return 'sad';
        if (lower.match(/vui|cười|hạnh phúc|tuyệt vời|thích|yêu|cảm ơn|biết ơn|tuyệt/)) return 'joy';
        return 'calm';
    };

    const autoScenes = p.messages.map((m: any, idx: number) => {
      let em = m.emotion;
      if (!em || em === 'calm') em = detectEmotion(m.text);
      return {
          id: `scene_msg_${m.id || idx}_${Date.now() + idx}`,
          role: m.role === 'ai' || m.role === 'ASSISTANT' ? 'lao' : 'user',
          emotion: em,
          url: null,
          idbKey: null,
          msgId: m.id,
          textSnippet: m.text,
      };
    });
    
    p.setFfScenes(autoScenes);
  }, [p.showVideoExportModal, p.messages, p.currentSessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!p.showVideoExportModal) return null;

  const {
    showVideoExportModal, setShowVideoExportModal, videoAspectRatio, setVideoAspectRatio, videoTransition, setVideoTransition, videoTransitionDuration, setVideoTransitionDuration, chatLaoTransform, setChatLaoTransform, showChatLaoControls, setShowChatLaoControls, videoResolution, setVideoResolution, subtitleSentenceCount, setSubtitleSentenceCount, subtitleColor, setSubtitleColor, subtitleYPos, setSubtitleYPos, subtitleScale, setSubtitleScale, isExportingVideo, setIsExportingVideo, isPreparingVideoData, setIsPreparingVideoData, renderedVideoBlob, setRenderedVideoBlob, renderedVideoUrl, setRenderedVideoUrl, isVideoFullscreen, setIsVideoFullscreen, isPreviewFullscreen, setIsPreviewFullscreen, videoExt, setVideoExt, exportTab, setExportTab, hoveredElement, setHoveredElement, enableIntro, setEnableIntro, introTitle, setIntroTitle, introSubtitle, setIntroSubtitle, enableOutroText, setEnableOutroText, outroText, setOutroText, isFullFrameMode, setIsFullFrameMode, EMOTIONS, FULLFRAME_PACKS, ffScenes, setFfScenes, ffSaveData, setFfSaveData, showFfSaveModal, setShowFfSaveModal, logoData, setLogoData, logoSettings, setLogoSettings, bgmAudioData, setBgmAudioData, bgmVolume, setBgmVolume, aiBgmPrompt, setAiBgmPrompt, isGeneratingBgm, setIsGeneratingBgm, tempAiBgmData, setTempAiBgmData, showPresetModal, setShowPresetModal, presetFormData, setPresetFormData, showDownloadMenu, setShowDownloadMenu, showShareMenu, setShowShareMenu, localFfPacks, setLocalFfPacks, localFfClips, setLocalFfClips, showSavePackModal, setShowSavePackModal, savePackData, setSavePackData, diagnosticReport, setShowDiagnostics, ffScenesRef, exportCanvasRef, logoFileInputRef, bgmFileInputRef, exportMediaRecorderRef, exportAudioCtxRef, laoExportVidRefs, userExportVidRefs, chatLaoDragInfo, handleChatLaoPointerDown, handleChatLaoPointerMove, handleChatLaoPointerUp, handleChatLaoWheel, handleLoadPack, handleDeleteFfPack, showUploadGuide, handleUploadFolder, handleCopyFfScenesCode, executeSaveFfPack, moveFfScene, handleSelectFfClipV2, handleDeleteFfClipV2, handleUploadLogo, removeLogo, handleGenerateAiBgm, removeBgm, handleUploadBgm, handleClearCache, handleSaveVideoConfig, startVideoExport, cancelVideoExport, resetVideoExport, toggleFullscreen, handleDownloadVideo, handleShareVideoSocial, showDiagnostics, handleDeletePreset, isGlobalPlaying, setIsGlobalPlaying, globalAudioRef, stopLipSync, emotion, setEmotion, spellCheckControllersRef, spellCheckTimeoutsRef, latestAutoPlayaiMsgIdRef, showAutoPilotModal, setShowAutoPilotModal, apTopics, setApTopics, apSettings, setApSettings, apState, setApState, handleFetchTrendingTopics, handleGenerateAITopic, handleImportScript, startAutoPilot, stopAutoPilot, isGeneratingAITopic, setIsGeneratingAITopic, customBgs, setCustomBgs, presetBackgrounds, activeBgId, setActiveBgId, DEFAULT_BGM_LIST, playingMsg, isLaoSpeakingSession, messages, handleConfirmPreset, handleUndoPosition, handleRedoPosition, handleCanvasPointerDown, handleCanvasPointerMove, handleCanvasPointerUp, handleCanvasPointerLeave, handleCanvasWheel, executeSaveFfClip, pastOffsets, futureOffsets, showSaveCharModal, setShowSaveCharModal, saveCharData, setSaveCharData, handleSaveCharacterToLocal, executeSaveCharacter,
    allCharacters, currentLaoPresetId, setCurrentLaoPresetId, currentUserPresetId, setCurrentUserPresetId,
    renderHistory, setRenderHistory, deleteRenderHistoryItem
  } = p;

  return (
         <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex justify-center items-center p-4 md:p-6">
           <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col h-[90vh] md:h-[85vh] overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 shrink-0">
                <h2 className="font-black text-orange-400 tracking-widest flex items-center gap-2"><Film size={18}/> Xuất video pháp bảo</h2>
                {!isExportingVideo && <button onClick={cancelVideoExport} className="text-slate-400 hover:text-white"><X size={20}/></button>}
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 flex-1 min-h-0">
                 {/* BÊN TRÁI: BẢNG ĐIỀU CHỈNH THÔNG SỐ & LỊCH SỬ RENDER */}
                 <div className={`w-full md:w-5/12 flex flex-col gap-4 overflow-y-auto pb-4 pr-2 scrollbar-hide h-full ${isPreviewFullscreen ? 'hidden md:flex opacity-0 pointer-events-none' : ''}`}>
                    <div className="flex border-b border-white/10 mb-2 shrink-0 overflow-x-auto scrollbar-hide">
                       <button onClick={() => setExportTab('basic')} className={`flex-1 py-2.5 px-2 text-[11px] md:text-xs font-bold tracking-wider transition-all border-b-2 whitespace-nowrap ${exportTab === 'basic' ? 'border-orange-500 text-orange-400 bg-orange-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Cơ bản</button>
                       <button onClick={() => setExportTab('text')} className={`flex-1 py-2.5 px-2 text-[11px] md:text-xs font-bold tracking-wider transition-all border-b-2 whitespace-nowrap ${exportTab === 'text' ? 'border-yellow-500 text-yellow-400 bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Thông điệp</button>
                       <button onClick={() => setExportTab('history')} className={`flex-1 py-2.5 px-2 text-[11px] md:text-xs font-bold tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center justify-center gap-1 ${exportTab === 'history' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>📜 Lịch sử {renderHistory?.length > 0 ? `(${renderHistory.length})` : ''}</button>
                    </div>

                        {exportTab === 'basic' && (
                          <div className="flex flex-col gap-5 flex-1 animate-in fade-in">
                             <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-white/10">
                                <div className="flex flex-col gap-1.5">
                                   <label className="h-6 flex items-center text-xs font-bold text-orange-400 tracking-wider whitespace-nowrap">Khung hình (Tỉ lệ)</label>
                                   <select disabled={isExportingVideo || isPreparingVideoData} value={videoAspectRatio} onChange={e => setVideoAspectRatio(e.target.value)} className="w-full bg-slate-900 border border-white/10 text-white p-2 rounded-lg focus:border-orange-500 outline-none text-xs font-medium">
                                      <option value="16x9">16:9 (Youtube / Ngang)</option>
                                      <option value="9x16">9:16 (Tiktok / Dọc)</option>
                                      <option value="1x1">1:1 (Facebook / Vuông)</option>
                                      <option value="4x3">4:3 (Truyền thống)</option>
                                      <option value="3x4">3:4 (Dọc ngắn)</option>
                                   </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                   <label className="h-6 flex items-center text-xs font-bold text-orange-400 tracking-wider whitespace-nowrap">Độ phân giải</label>
                                   <select disabled={isExportingVideo || isPreparingVideoData} value={videoResolution} onChange={e => setVideoResolution(e.target.value)} className="w-full bg-slate-900 border border-white/10 text-white p-2 rounded-lg focus:border-orange-500 outline-none text-xs font-medium">
                                      <option value="480">480p (Rất nhẹ)</option>
                                      <option value="720">720p (HD tiêu chuẩn)</option>
                                      <option value="1080">1080p (Full HD)</option>
                                      <option value="1440">1440p (2K siêu nét)</option>
                                      <option value="2160">2160p (4K điện ảnh)</option>
                                   </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                   <label className="h-6 flex items-center text-xs font-bold text-orange-400 tracking-wider whitespace-nowrap gap-1.5"><Sparkles size={13}/> Chuyển cảnh</label>
                                   <select disabled={isExportingVideo || isPreparingVideoData} value={videoTransition} onChange={e => setVideoTransition(e.target.value)} className="w-full bg-slate-900 border border-white/10 text-white p-2 rounded-lg focus:border-orange-500 outline-none text-xs font-medium">
                                      <option value="none">Cắt cứng (Mặc định)</option>
                                      <option value="fade_black">Mờ đen (Dip to black)</option>
                                      <option value="fade_white">Chớp trắng (Flash)</option>
                                      <option value="blur">Lóa sáng tâm linh</option>
                                      <option value="random">Ngẫu nhiên tự động</option>
                                   </select>
                                   {videoTransition !== 'none' && (
                                       <div className="flex flex-col gap-1 mt-1 animate-in fade-in bg-slate-900 p-2 rounded-lg border border-white/5">
                                           <span className="text-[10px] text-orange-200 flex justify-between font-bold">Thời gian kéo dài: <span className="text-white">{videoTransitionDuration}s</span></span>
                                           <input type="range" min="0.1" max="2.0" step="0.1" value={videoTransitionDuration} onChange={e => setVideoTransitionDuration(Number(e.target.value))} className="accent-orange-500" disabled={isExportingVideo || isPreparingVideoData} />
                                       </div>
                                   )}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                   <label className="h-6 flex items-center text-xs font-bold text-orange-400 tracking-wider whitespace-nowrap">Định dạng file</label>
                                   <select disabled={isExportingVideo || isPreparingVideoData} value={videoExt} onChange={e => setVideoExt(e.target.value)} className="w-full bg-slate-900 border border-white/10 text-white p-2 rounded-lg focus:border-orange-500 outline-none text-xs font-medium">
                                      <option value="mp4">MP4 (.mp4 - Phổ thông)</option>
                                      <option value="webm">WebM (.webm - Siêu nhẹ)</option>
                                   </select>
                                </div>
                             </div>

                         {/* Chế độ Cắt ghép Video Dựng sẵn Toàn Cảnh */}
                         <div className="flex flex-col gap-2 mt-1 mb-1 animate-in fade-in">
                            <label className="text-xs font-bold text-emerald-400 tracking-wider flex items-center gap-1.5"><Film size={14}/> Video Dựng Sẵn Toàn Cảnh</label>
                            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-emerald-500/30 shadow-inner">
                                <div className="flex flex-col w-[80%]">
                                    <span className="text-[11px] font-bold text-emerald-300">Cắt Cảnh Đa Cảm Xúc</span>
                                    <span className="text-[9px] text-slate-400 mt-1 leading-relaxed">AI sẽ dựa vào cảm xúc của câu thoại (Vui, Buồn, Bình thường) để tự động chọn đúng video ghép vào.</span>
                                </div>
                                <button 
                                    onClick={() => setIsFullFrameMode(!isFullFrameMode)} 
                                    disabled={isExportingVideo || isPreparingVideoData}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${isFullFrameMode ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isFullFrameMode ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            
                            {/* Kho Tải Video Dựng Sẵn (Chỉ hiện khi bật Chế độ) */}
                            {isFullFrameMode && (
                                <div className="flex flex-col gap-3 mt-2 bg-emerald-900/10 p-3 rounded-xl border border-emerald-500/20 animate-in slide-in-from-top-2 max-h-[350px] overflow-y-auto scrollbar-hide">
                                    <div className="flex items-center justify-between mb-1 gap-2 flex-wrap sm:flex-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-emerald-300 font-bold shrink-0">Kho cảnh quay:</span>
                                            <select
                                                value={selectedFfPackId}
                                                onChange={(e) => {
                                                    const packId = e.target.value;
                                                    setSelectedFfPackId(packId);
                                                    if (!packId) return;
                                                    
                                                    const pack = FULLFRAME_PACKS.find((p: any) => p.id === packId);
                                                    if (pack) {
                                                        if (pack.aspect === 'doc' && setVideoAspectRatio) setVideoAspectRatio('9x16');
                                                        else if (pack.aspect === 'ngang' && setVideoAspectRatio) setVideoAspectRatio('16x9');
                                                        
                                                        // Nếu đang có các cảnh thoại (có msgId), chỉ cập nhật URL video mà không xóa cảnh thoại
                                                        const hasMessageScenes = ffScenes?.some((s: any) => s.msgId);
                                                        if (hasMessageScenes) {
                                                            setFfScenes((prev: any) => prev.map((scene: any) => {
                                                                const match = pack.scenes.find((x: any) => x.role === scene.role && x.emotion === scene.emotion) 
                                                                            || pack.scenes.find((x: any) => x.role === scene.role && x.emotion === 'calm');
                                                                if (match) {
                                                                    return { ...scene, url: match.url, idbKey: match.idbKey };
                                                                }
                                                                return scene;
                                                            }));
                                                            if (p.showToastMsg) p.showToastMsg(`Đã áp dụng ${pack.name} vào các cảnh thoại!`, 'success');
                                                        } else {
                                                            handleLoadPack(pack.id);
                                                        }
                                                    }
                                                }}
                                                className="bg-slate-900 border border-emerald-500/30 text-emerald-400 text-[10px] rounded px-2 py-1 outline-none cursor-pointer shadow-sm flex-1 min-w-[150px]"
                                            >
                                                <option value="">-- Chọn Bộ Cảnh --</option>
                                                {FULLFRAME_PACKS.length === 0 && (
                                                    <option value="" disabled>-- Bạn chưa có Bộ Cảnh nào --</option>
                                                )}
                                                {FULLFRAME_PACKS.filter((p: any) => p.aspect === 'ngang').length > 0 && (
                                                    <optgroup label="🌐 Cảnh Mặc Định (16:9)">
                                                        {FULLFRAME_PACKS.filter((p: any) => p.aspect === 'ngang').map((pack: any) => (
                                                            <option key={pack.id} value={pack.id}>{pack.name}</option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                                {FULLFRAME_PACKS.filter((p: any) => p.aspect === 'doc').length > 0 && (
                                                    <optgroup label="📱 Cảnh Mặc Định (9:16)">
                                                        {FULLFRAME_PACKS.filter((p: any) => p.aspect === 'doc').map((pack: any) => (
                                                            <option key={pack.id} value={pack.id}>{pack.name}</option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                                {localFfPacks && localFfPacks.length > 0 && (
                                                    <optgroup label="📁 Bộ Cảnh Của Con">
                                                        {localFfPacks.map((pack: any) => (
                                                            <option key={pack.id} value={pack.id}>{pack.name}</option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                            </select>
                                        </div>
                                        <span className="text-[9px] text-slate-500 italic">{messages?.length || 0} câu thoại trong hội thoại</span>
                                    </div>

                                     <div className="grid grid-cols-2 gap-2 my-1.5">
                                             <button 
                                                 onClick={() => {
                                                     if (!messages || messages.length === 0) {
                                                         showToastMsg("Không có lời thoại nào trong hội thoại hiện tại.", "error");
                                                         return;
                                                     }
                                                     const autoScenes = messages.map((m: any, idx: number) => ({
                                                         id: `scene_msg_${m.id || idx}_${Date.now()}`,
                                                         role: m.role === "ai" || m.role === "ASSISTANT" ? "lao" : "user",
                                                         emotion: m.emotion || "calm",
                                                         url: null,
                                                         idbKey: null,
                                                         msgId: m.id,
                                                         textSnippet: m.text
                                                     }));
                                                     setFfScenes(autoScenes);
                                                     showToastMsg(`Đã tạo ${autoScenes.length} cảnh từ lời thoại!`, "success");
                                                 }}
                                                 className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm font-sans"
                                             >
                                                 <Sparkles size={11}/> Chia cảnh theo thoại
                                             </button>
                                             <button 
                                                 onClick={() => setFfScenes((prev: any) => [...prev, { id: `scene_${Date.now()}`, role: "user", emotion: "calm", url: null, idbKey: null }])}
                                                 className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm font-sans"
                                             >
                                                 <Plus size={11}/> Thêm cảnh tự do
                                             </button>
                                             <button 
                                                 onClick={() => {
                                                     if (!ffScenes || ffScenes.length === 0) {
                                                         if (p.showToastMsg) p.showToastMsg("Chưa có cảnh quay nào để lưu.", "error");
                                                         return;
                                                     }
                                                     if (setSavePackData) {
                                                         setSavePackData({
                                                             name: `Bộ Cảnh ${new Date().toLocaleDateString("vi-VN")} ${new Date().toLocaleTimeString("vi-VN")}`,
                                                             aspect: videoAspectRatio === "16x9" ? "ngang" : "doc",
                                                             description: ""
                                                         });
                                                     }
                                                     setShowSavePackModal(true);
                                                 }}
                                                 className="bg-amber-600 hover:bg-amber-500 text-white px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm font-sans"
                                             >
                                                 <Save size={11}/> Lưu Bộ Cảnh Này
                                             </button>
                                             <button 
                                                 onClick={() => {
                                                     setFfScenes((prev: any[]) => prev.map((s: any) => {
                                                         if (s.url) URL.revokeObjectURL(s.url);
                                                         return { ...s, url: null, idbKey: null };
                                                     }));
                                                     if (p.showToastMsg) p.showToastMsg("Đã xoá toàn bộ video cảnh quay!", "success");
                                                 }}
                                                 className="bg-rose-600 hover:bg-rose-500 text-white px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-sm font-sans"
                                             >
                                                 <Trash2 size={11}/> Xóa tất cả cảnh
                                             </button>
                                     </div>

                                    {/* BATCH UPLOAD DROPZONE */}
                                    <div 
                                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                        onDrop={(e) => {
                                            e.preventDefault(); e.stopPropagation();
                                            const files = Array.from(e.dataTransfer.files).filter((f: any) => f.type.startsWith('video/'));
                                            if (!files.length) return;
                                            
                                            console.log("Batch Upload Drop - Received files:", files.map(f => f.name));
                                            const fileData = files.map((f: any) => {
                                                const name = f.name.toLowerCase();
                                                let role = 'user';
                                                if (name.includes('lao') || name.includes('lão') || name.includes('ai') || name.includes('đáp')) role = 'lao';
                                                else if (name.includes('outro') || name.includes('kết') || name.includes('ket')) role = 'outro';
                                                
                                                let em = 'calm';
                                                if (name.includes('buon') || name.includes('buồn') || name.includes('sad')) em = 'sad';
                                                else if (name.includes('vui') || name.includes('joy') || name.includes('hạnh phúc') || name.includes('hanh phuc')) em = 'joy';
                                                else if (name.includes('hook') || name.includes('nhan manh') || name.includes('nhấn mạnh')) em = 'hook';
                                                
                                                const idbKey = `ff_clip_${role}_${em}_${Date.now()}_${Math.floor(Math.random()*10000)}`;
                                                setTimeout(() => { idb.set(idbKey, f).catch(err => console.warn('Lỗi lưu IDB:', err)); }, 100);
                                                return { name: f.name, url: URL.createObjectURL(f), role, emotion: em, idbKey };
                                            });
                                            console.log("Parsed file data:", fileData);
                                            
                                            setFfScenes((prev: any[]) => {
                                                const newScenes = [...prev];
                                                const updatedIndices = new Set<number>();
                                                
                                                fileData.forEach(fd => {
                                                    let matchIdx = newScenes.findIndex((s, idx) => 
                                                        (s.msgId || s.role === 'outro') &&
                                                        s.role === fd.role && 
                                                        s.emotion === fd.emotion && 
                                                        !updatedIndices.has(idx)
                                                    );
                                                    if (matchIdx === -1) {
                                                        matchIdx = newScenes.findIndex((s, idx) => 
                                                            (s.msgId || s.role === 'outro') &&
                                                            s.role === fd.role && 
                                                            !updatedIndices.has(idx)
                                                        );
                                                    }
                                                    
                                                    if (matchIdx !== -1) {
                                                        newScenes[matchIdx] = { ...newScenes[matchIdx], url: fd.url, idbKey: fd.idbKey };
                                                        updatedIndices.add(matchIdx);
                                                    } else if (fd.role === 'outro') {
                                                        const hasOutro = newScenes.some(s => s.role === 'outro');
                                                        if (!hasOutro) {
                                                            newScenes.push({ id: `scene_batch_${Date.now()}_${Math.random()}`, role: fd.role, emotion: fd.emotion, url: fd.url, idbKey: fd.idbKey });
                                                        }
                                                    }
                                                });
                                                return newScenes;
                                            });
                                            if (p.showToastMsg) p.showToastMsg(`Đã ghép tự động ${files.length} video!`, 'success');
                                        }}
                                        className="w-full border-2 border-dashed border-emerald-500/30 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-500/10 transition-colors mb-2 bg-slate-900/50"
                                    >
                                        <Upload size={16} className="text-emerald-400 mb-1" />
                                        <span className="text-[10px] text-emerald-200 font-bold">Kéo thả nhiều video vào đây để ghép tự động</span>
                                        <span className="text-[9px] text-slate-400 text-center leading-tight mt-1">AI tự nhận diện qua tên file<br/>(vd: "con_vui.mp4", "lao_buon.mp4")</span>
                                        <input type="file" multiple accept="video/*" className="hidden" id="batch-upload" onChange={(e) => {
                                            if(!e.target.files) return;
                                            const files = Array.from(e.target.files);
                                            console.log("Batch Upload File Select - Received files:", files.map(f => f.name));
                                            const fileData = files.map((f: any) => {
                                                const name = f.name.toLowerCase();
                                                let role = 'user';
                                                if (name.includes('lao') || name.includes('lão') || name.includes('ai') || name.includes('đáp')) role = 'lao';
                                                else if (name.includes('outro') || name.includes('kết') || name.includes('ket')) role = 'outro';
                                                
                                                let em = 'calm';
                                                if (name.includes('buon') || name.includes('buồn') || name.includes('sad')) em = 'sad';
                                                else if (name.includes('vui') || name.includes('joy') || name.includes('hạnh phúc') || name.includes('hanh phuc')) em = 'joy';
                                                else if (name.includes('hook') || name.includes('nhan manh') || name.includes('nhấn mạnh')) em = 'hook';
                                                
                                                const idbKey = `ff_clip_${role}_${em}_${Date.now()}_${Math.floor(Math.random()*10000)}`;
                                                setTimeout(() => { idb.set(idbKey, f).catch(err => console.warn('Lỗi lưu IDB:', err)); }, 100);
                                                return { name: f.name, url: URL.createObjectURL(f), role, emotion: em, idbKey };
                                            });
                                            console.log("Parsed file data:", fileData);
                                            
                                            setFfScenes((prev: any[]) => {
                                                const newScenes = [...prev];
                                                const updatedIndices = new Set<number>();
                                                
                                                fileData.forEach(fd => {
                                                    let matchIdx = newScenes.findIndex((s, idx) => 
                                                        (s.msgId || s.role === 'outro') &&
                                                        s.role === fd.role && 
                                                        s.emotion === fd.emotion && 
                                                        !updatedIndices.has(idx)
                                                    );
                                                    if (matchIdx === -1) {
                                                        matchIdx = newScenes.findIndex((s, idx) => 
                                                            (s.msgId || s.role === 'outro') &&
                                                            s.role === fd.role && 
                                                            !updatedIndices.has(idx)
                                                        );
                                                    }
                                                    
                                                    if (matchIdx !== -1) {
                                                        newScenes[matchIdx] = { ...newScenes[matchIdx], url: fd.url, idbKey: fd.idbKey };
                                                        updatedIndices.add(matchIdx);
                                                    } else if (fd.role === 'outro') {
                                                        const hasOutro = newScenes.some(s => s.role === 'outro');
                                                        if (!hasOutro) {
                                                            newScenes.push({ id: `scene_batch_${Date.now()}_${Math.random()}`, role: fd.role, emotion: fd.emotion, url: fd.url, idbKey: fd.idbKey });
                                                        }
                                                    }
                                                });
                                                return newScenes;
                                            });
                                            if (p.showToastMsg) p.showToastMsg(`Đã ghép tự động ${files.length} video!`, 'success');
                                            e.target.value = '';
                                        }} />
                                        <label htmlFor="batch-upload" className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-[9px] font-bold cursor-pointer transition-all">Hoặc Chọn File</label>
                                    </div>
                                    
                                    {(() => {
                                        const hasMsgScenes = ffScenes?.some((s: any) => s.msgId);
                                        return ffScenes.map((scene: any, idx: any) => {
                                            const isRedundant = hasMsgScenes && !scene.msgId && scene.role !== 'outro';
                                            if (isRedundant) return null;
                                            return (
                                                <div key={scene.id} className="flex gap-2 items-center bg-slate-950 p-2 rounded-lg border border-white/5 relative group mt-1">
                                            {/* Bảng điều khiển mini (Move & Delete) */}
                                            <div className="absolute -top-3 -right-2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <div className="flex gap-0.5 bg-slate-800 p-1 rounded-md shadow-lg border border-white/10">
                                                    <button
                                                        onClick={() => moveFfScene(idx, -1)}
                                                        disabled={idx === 0}
                                                        className="p-0.5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded disabled:opacity-30 transition-colors"
                                                        title="Di chuyển lên ưu tiên trước"
                                                    >
                                                        <ChevronUp size={14}/>
                                                    </button>
                                                    <button
                                                        onClick={() => moveFfScene(idx, 1)}
                                                        disabled={idx === ffScenes.length - 1}
                                                        className="p-0.5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded disabled:opacity-30 transition-colors"
                                                        title="Di chuyển xuống"
                                                    >
                                                        <ChevronDown size={14}/>
                                                    </button>
                                                    <div className="w-px bg-white/10 mx-0.5"></div>
                                                    <button 
                                                        onClick={() => {
                                                            if (scene.url) URL.revokeObjectURL(scene.url);
                                                            setFfScenes((prev: any) => prev.filter((s: any) => s.id !== scene.id));
                                                        }} 
                                                        className="p-0.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition-colors"
                                                        title="Xóa cảnh này"
                                                    >
                                                        <X size={14}/>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Thumbnail Video - Lazy Unmounted để giải phóng RAM & GPU */}
                                            <SceneThumbnailItem scene={scene} setFfScenes={setFfScenes} />

                                            {/* Settings Cảnh */}
                                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                                {/* Hiển thị tóm tắt câu thoại, sửa chữ và tạo/phát âm thanh trực tiếp */}
                                                {(() => {
                                                    // Tìm message tương ứng với scene qua msgId
                                                    const msg = scene.msgId ? messages?.find((m: any) => m.id === scene.msgId) : null;
                                                    if (msg) {
                                                        const hasAudio = !!msg.audioUrl;
                                                        const isAudioPlaying = playingMsgId === scene.msgId;
                                                        const isAudioGenerating = !!generatingMsgIds[scene.msgId];

                                                        return (
                                                            <div className="flex flex-col gap-1 w-full bg-slate-900/40 p-1.5 rounded-lg border border-white/5">
                                                                <textarea
                                                                    defaultValue={msg.text}
                                                                    onBlur={(e) => handleTextBlur(scene, e.target.value)}
                                                                    placeholder="Nội dung câu thoại..."
                                                                    rows={1}
                                                                    className="w-full bg-slate-950 border border-white/10 focus:border-indigo-500/50 rounded px-1.5 py-0.5 text-[9px] text-slate-200 outline-none resize-none font-medium leading-normal min-h-[36px] scrollbar-hide"
                                                                    title="Bấm vào đây để sửa câu thoại trực tiếp"
                                                                />
                                                                <div className="flex items-center justify-between mt-0.5">
                                                                    <div className="flex items-center gap-1">
                                                                        {hasAudio ? (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handlePlayMsgAudio(scene.msgId, msg.audioUrl)}
                                                                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center cursor-pointer"
                                                                                title="Nghe thử giọng đọc"
                                                                            >
                                                                                {isAudioPlaying ? <Pause size={10} /> : <Play size={10} />}
                                                                            </button>
                                                                        ) : (
                                                                            <span className="text-[7px] text-amber-400 font-bold bg-amber-950/40 px-1 py-0.5 rounded border border-amber-500/20">
                                                                                Chưa có audio
                                                                            </span>
                                                                        )}

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleGenerateSingleAudio(scene.msgId, msg.text, scene.role)}
                                                                            disabled={isAudioGenerating}
                                                                            className={`p-1 rounded transition-colors flex items-center justify-center cursor-pointer ${
                                                                                isAudioGenerating 
                                                                                    ? 'bg-slate-800 text-emerald-400' 
                                                                                    : hasAudio 
                                                                                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200' 
                                                                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
                                                                            }`}
                                                                            title={hasAudio ? "Tạo lại audio" : "Tạo audio câu này"}
                                                                        >
                                                                            {isAudioGenerating ? <Loader2 size={10} className="animate-spin" /> : hasAudio ? <RefreshCw size={10} /> : <Mic size={10} />}
                                                                        </button>
                                                                    </div>
                                                                    <span className="text-[8px] text-slate-500 font-semibold italic">
                                                                        {scene.role === 'lao' ? '👳 Lão' : scene.role === 'user' ? '🙏 Con' : '🎬 Cảnh'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    // --- Fallback cũ cho các scene không có msgId trực tiếp ---
                                                    const targetRole = scene.role === 'lao' ? 'ai' : (scene.role === 'user' ? 'user' : 'outro');
                                                    if (scene.textSnippet) return (
                                                        <div className="w-full text-[10px] text-slate-300 italic truncate mb-0.5 bg-slate-900 px-1.5 py-0.5 rounded border border-white/5" title={scene.textSnippet}>
                                                            "{scene.textSnippet}"
                                                        </div>
                                                    );
                                                    if (targetRole === 'outro') return null;
                                                    
                                                    const matchedMsgs = messages.filter((m: any) => {
                                                        const mRole = m.role === 'ASSISTANT' || m.role === 'ai' ? 'ai' : 'user';
                                                        return mRole === targetRole;
                                                    });

                                                    if (matchedMsgs.length === 0) return (
                                                        <div className="w-full text-[8px] text-amber-400 bg-amber-900/20 px-1.5 py-1 rounded border border-amber-500/20 mb-0.5">
                                                            ⚠️ Chưa có thoại khớp vai này
                                                        </div>
                                                    );

                                                    if (matchedMsgs.length === 1) {
                                                        const m = matchedMsgs[0];
                                                        return (
                                                            <div className="w-full text-[10px] text-slate-300 italic mb-0.5 bg-slate-900 px-1.5 py-1 rounded border border-white/5" title={m.text}>
                                                                <span className="text-indigo-400 font-bold not-italic mr-1">Thoại:</span>
                                                                "{m.text}"
                                                            </div>
                                                        );
                                                    }

                                                    return null;
                                                })()}
                                                <div className="flex gap-1.5 w-full">
                                                    <select 
                                                        value={scene.role}
                                                        onChange={(e: any) => setFfScenes((prev: any) => prev.map((s: any) => s.id === scene.id ? {...s, role: e.target.value} : s))}
                                                        className="flex-1 bg-slate-800 border border-white/10 rounded px-1 py-1 text-[9px] text-white outline-none"
                                                    >
                                                        <option value="lao">👳 Máy quay Lão</option>
                                                        <option value="user">🙏 Máy quay Con</option>
                                                        <option value="outro">🎬 Cảnh Kết thúc</option>
                                                    </select>
                                                    <select 
                                                        value={scene.emotion}
                                                        onChange={(e: any) => setFfScenes((prev: any) => prev.map((s: any) => s.id === scene.id ? {...s, emotion: e.target.value} : s))}
                                                        className="flex-1 bg-slate-800 border border-white/10 rounded px-1 py-1 text-[9px] text-white outline-none"
                                                    >
                                                        <option value="calm">😐 Bình thường</option>
                                                        <option value="sad">😢 Buồn / Bế tắc</option>
                                                        <option value="joy">😊 Vui / Hạnh phúc</option>
                                                    </select>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                                </div>
                            )}
                         </div>

                         {/* Khu vực Tùy chỉnh Logo & Watermark */}
                         <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-amber-400 tracking-wider flex items-center gap-1.5"><ImageIcon size={14}/> Logo & Đóng Dấu (Watermark)</label>
                            <div className="flex flex-col gap-3 bg-slate-950 p-3 rounded-xl border border-white/10">
                               <div className="flex gap-2 w-full">
                                  <input type="file" ref={logoFileInputRef} className="hidden" accept="image/*" onChange={handleUploadLogo} />
                                  <button onClick={() => logoFileInputRef.current?.click()} disabled={isExportingVideo || isPreparingVideoData} className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-bold py-2 px-3 rounded-lg border border-white/10 flex justify-center items-center gap-1.5 transition-all">
                                    <Upload size={14} /> Chọn Logo
                                  </button>
                                  {logoData && (
                                     <button onClick={removeLogo} disabled={isExportingVideo || isPreparingVideoData} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-all">
                                        <X size={14} /> Gỡ bỏ
                                     </button>
                                  )}
                               </div>
                               
                               {logoData && (
                                  <div className="flex flex-col gap-3 p-3 bg-amber-900/20 rounded-lg border border-amber-500/30 animate-in fade-in">
                                     <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5"><Palette size={14}/> Xóa nền Logo (Chroma Key)</span>
                                     <select value={logoSettings.chromaType} onChange={e => setLogoSettings(p => ({...p, chromaType: e.target.value}))} className="w-full bg-slate-800 border border-white/10 text-white p-2 rounded-lg outline-none text-[11px] focus:border-amber-500">
                                        <option value="none">Giữ nguyên bản gốc</option>
                                        <option value="black">Xóa Nền Đen</option>
                                        <option value="white">Xóa Nền Trắng</option>
                                        <option value="custom">Tùy chọn màu cần xóa</option>
                                     </select>
                                     
                                     {logoSettings.chromaType !== 'none' && (
                                        <div className="flex flex-col gap-2 mt-1 animate-in fade-in">
                                           {logoSettings.chromaType === 'custom' && (
                                              <div className="flex items-center gap-2">
                                                 <input type="color" value={logoSettings.chromaColor} onChange={e => setLogoSettings(p => ({...p, chromaColor: e.target.value}))} className="w-8 h-8 rounded border-none bg-transparent cursor-pointer" />
                                                 <span className="text-[10px] text-slate-400">Chọn màu nền cần xóa</span>
                                              </div>
                                           )}
                                           <div className="grid grid-cols-2 gap-4">
                                              <div className="flex flex-col gap-1">
                                                 <span className="text-[10px] text-slate-400 font-mono flex justify-between"><span>Độ ăn lẹm</span> <span>{logoSettings.tolerance}</span></span>
                                                 <input type="range" min="5" max="250" value={logoSettings.tolerance} onChange={e => setLogoSettings(p => ({...p, tolerance: Number(e.target.value)}))} className="accent-amber-500" />
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                 <span className="text-[10px] text-slate-400 font-mono flex justify-between"><span>Độ mềm viền</span> <span>{logoSettings.smoothness || 0}</span></span>
                                                 <input type="range" min="0" max="100" value={logoSettings.smoothness || 0} onChange={e => setLogoSettings(p => ({...p, smoothness: Number(e.target.value)}))} className="accent-amber-500" />
                                              </div>
                                           </div>
                                        </div>
                                     )}
                                  </div>
                               )}
                            </div>
                         </div>

                         <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-emerald-400 tracking-wider flex items-center gap-1.5"><Music4 size={14}/> Thêm nhạc nền (Tùy chọn)</label>
                               <div className="flex flex-col gap-3 bg-slate-950 p-3 rounded-xl border border-white/10">
                                  <div className="flex gap-2 w-full">
                                     <input type="file" ref={bgmFileInputRef} className="hidden" accept="audio/*" onChange={handleUploadBgm} />
                                     <button onClick={() => bgmFileInputRef.current?.click()} disabled={isExportingVideo || isPreparingVideoData || isGeneratingBgm} className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-bold py-2 px-3 rounded-lg border border-white/10 flex justify-center items-center gap-1.5 transition-all">
                                       <Upload size={14} /> Tải MP3
                                     </button>
                                     <select 
                                        disabled={isExportingVideo || isPreparingVideoData || isGeneratingBgm}
                                        className="flex-1 bg-slate-800 border border-white/10 text-xs px-3 py-2 rounded-lg outline-none text-white focus:border-emerald-500 cursor-pointer"
                                        onChange={(e: any) => {
                                            const selected = DEFAULT_BGM_LIST.find(m => m.id === e.target.value);
                                            if (selected && selected.url && selected.url !== 'DÁN_LINK_NHẠC_CỦA_CON_VÀO_ĐÂY.mp3') {
                                                setBgmAudioData({ url: selected.url, name: selected.name, isPreset: true });
                                            } else {
                                                removeBgm();
                                            }
                                        }}
                                     >
                                        <option value="">-- Chọn Kho Nhạc --</option>
                                        {DEFAULT_BGM_LIST.filter((m: any) => m.url && m.url !== 'DÁN_LINK_NHẠC_CỦA_CON_VÀO_ĐÂY.mp3').map((bgm: any) => (
                                            <option key={bgm.id} value={bgm.id}>{bgm.name}</option>
                                        ))}
                                     </select>
                                  </div>
                                  
                                  <div className="flex w-full relative mt-1">
                                     <input type="text" value={aiBgmPrompt} onChange={(e: any) => setAiBgmPrompt(e.target.value)} disabled={isExportingVideo || isPreparingVideoData || isGeneratingBgm} placeholder="AI tự tạo nhạc thiền 30s, tiếng nước chảy..." className="w-full bg-slate-800 border border-white/10 text-xs px-3 py-2 rounded-l-lg outline-none text-white placeholder:text-slate-500 focus:border-emerald-500" />
                                     <button onClick={handleGenerateAiBgm} disabled={isExportingVideo || isPreparingVideoData || isGeneratingBgm || !aiBgmPrompt.trim()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-r-lg disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all whitespace-nowrap">
                                        {isGeneratingBgm ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Tạo AI
                                     </button>
                                  </div>

                                  {tempAiBgmData && (
                                     <div className="flex flex-col gap-2 w-full bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-2.5">
                                        <div className="flex items-center justify-between">
                                           <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5"><Sparkles size={12}/> Bản nháp nhạc AI (30s)</span>
                                           <button onClick={() => { URL.revokeObjectURL(tempAiBgmData.url); setTempAiBgmData(null); }} className="text-slate-400 hover:text-rose-400"><X size={14}/></button>
                                        </div>
                                        <audio src={tempAiBgmData.url} controls className="w-full h-8 outline-none" />
                                        <div className="flex gap-2 mt-1">
                                           <button onClick={() => { 
                                              if (bgmAudioData?.url) URL.revokeObjectURL(bgmAudioData.url);
                                              setBgmAudioData(tempAiBgmData); 
                                              setTempAiBgmData(null); 
                                              setAiBgmPrompt('');
                                           }} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold py-2 rounded-md transition-all">Sử dụng nhạc này</button>
                                        </div>
                                     </div>
                                  )}
                                  {bgmAudioData && !tempAiBgmData && (
                                     <div className="flex items-center justify-between w-full bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-2.5 mt-1">
                                       <span className="text-xs text-emerald-400 font-bold truncate pr-2 max-w-[200px]">{bgmAudioData.name}</span>
                                       <button onClick={removeBgm} disabled={isExportingVideo || isPreparingVideoData} className="text-rose-400 hover:text-rose-300 bg-rose-500/10 p-1.5 rounded"><X size={14}/></button>
                                     </div>
                                  )}

                                   <div className={`w-full flex flex-col gap-1.5 ${!bgmAudioData && !tempAiBgmData ? 'opacity-30' : ''}`}>
                                      <span className="text-[10px] text-slate-400 flex justify-between font-bold"><span>Âm lượng nhạc nền:</span> <span>{Math.round(bgmVolume * 100)}%</span></span>
                                      <input type="range" disabled={isExportingVideo || (!bgmAudioData && !tempAiBgmData)} min="0.01" max="1" step="0.01" value={bgmVolume} onChange={e => setBgmVolume(Number(e.target.value))} className="w-full accent-emerald-500 disabled:opacity-50" />
                                   </div>
                                </div>
                             </div>

                             <div className="mt-3 pt-3 border-t border-white/5">
                               {!isExportingVideo ? (
                                  <div className="grid grid-cols-2 gap-2 w-full">
                                     <button 
                                        onClick={handleSaveVideoConfig} 
                                        disabled={isPreparingVideoData} 
                                        className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold py-3 rounded-lg border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all shadow-md text-xs"
                                     >
                                        <Save size={14} /> Lưu Cài Đặt
                                     </button>
                                     <button 
                                        onClick={startVideoExport} 
                                        disabled={isPreparingVideoData} 
                                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-1.5 shadow-lg disabled:opacity-50 disabled:cursor-wait transition-all text-xs"
                                     >
                                        {isPreparingVideoData ? <><Loader2 size={14} className="animate-spin"/> Đang render...</> : <><Video size={14}/> Bắt Đầu Render</>}
                                     </button>
                                  </div>
                               ) : (
                                  <button onClick={cancelVideoExport} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-1.5 animate-pulse text-xs">
                                     <XCircle size={14}/> Dừng & Hủy Bỏ Render
                                  </button>
                               )}
                             </div>
                          </div>
                        )}

                        {/* TÂM AN THÊM TAB: THÔNG ĐIỆP (INTRO/OUTRO) */}
                        {exportTab === 'text' && (
                          <div className="flex flex-col gap-4 flex-1 animate-in fade-in overflow-y-auto pr-1">
                              <div className="bg-slate-900 border border-yellow-500/30 p-4 rounded-xl flex flex-col gap-3 shadow-inner">
                                  <div className="flex items-center justify-between">
                                      <h3 className="text-xs font-bold text-yellow-400 flex items-center gap-1.5"><Film size={14}/> Màn Hình Giới Thiệu (Intro)</h3>
                                      <button 
                                          onClick={() => setEnableIntro(!enableIntro)} 
                                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enableIntro ? 'bg-yellow-500' : 'bg-slate-700'}`}
                                      >
                                          <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enableIntro ? 'translate-x-3' : 'translate-x-0'}`} />
                                      </button>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-relaxed mb-1">Xuất hiện trong 4 giây đầu tiên của video để giới thiệu chủ đề. (Auto-Pilot sẽ tự động điền thông tin này cho bạn).</p>
                                  
                                  {enableIntro && (
                                      <div className="flex flex-col gap-3 animate-in fade-in">
                                          <div className="flex flex-col gap-1.5">
                                              <label className="text-[10px] font-bold text-slate-300">Tiêu đề chính (Màu Vàng):</label>
                                              <input 
                                                  type="text" 
                                                  defaultValue={introTitle} 
                                                  onBlur={(e: any) => setIntroTitle(e.target.value)} 
                                                  placeholder="VD: Chủ đề Vô Thường" 
                                                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-yellow-500 outline-none font-bold" 
                                              />
                                          </div>
                                          <div className="flex flex-col gap-1.5">
                                              <label className="text-[10px] font-bold text-slate-300">Dòng Phụ / Câu hỏi tự vấn (Màu Trắng):</label>
                                              <textarea 
                                                  defaultValue={introSubtitle} 
                                                  onBlur={(e: any) => setIntroSubtitle(e.target.value)} 
                                                  placeholder="VD: Làm sao để buông bỏ muộn phiền?" 
                                                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-yellow-500 outline-none resize-none h-16 scrollbar-hide italic" 
                                              />
                                          </div>
                                      </div>
                                  )}
                              </div>

                              <div className="bg-slate-900 border border-orange-500/30 p-4 rounded-xl flex flex-col gap-3 shadow-inner">
                                  <div className="flex items-center justify-between">
                                      <h3 className="text-xs font-bold text-orange-400 flex items-center gap-1.5"><FileText size={14}/> Lời Chúc Kết Màn (Outro)</h3>
                                      <button 
                                          onClick={() => setEnableOutroText(!enableOutroText)} 
                                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enableOutroText ? 'bg-orange-500' : 'bg-slate-700'}`}
                                      >
                                          <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enableOutroText ? 'translate-x-3' : 'translate-x-0'}`} />
                                      </button>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-relaxed mb-1">Hiện lên màn hình trong lúc người hỏi đang vái lạy (6 giây cuối video).</p>
                                  
                                  {enableOutroText && (
                                      <div className="flex flex-col gap-3 animate-in fade-in">
                                          <textarea 
                                              defaultValue={outroText} 
                                              onBlur={(e: any) => setOutroText(e.target.value)} 
                                              placeholder="VD: Nguyện người xem được giác ngộ giải thoát..." 
                                              className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-sm text-center text-orange-200 focus:border-orange-500 outline-none resize-none h-24 scrollbar-hide font-bold leading-relaxed" 
                                          />
                                      </div>
                                  )}
                              </div>
                              
                              <div className="mt-auto pt-4 border-t border-white/5">
                                 {!isExportingVideo ? (
                                    <button onClick={startVideoExport} disabled={isPreparingVideoData} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-1.5 shadow-lg disabled:opacity-50 disabled:cursor-wait transition-all text-xs">
                                       {isPreparingVideoData ? <><Loader2 size={14} className="animate-spin"/> Đang render...</> : <><Video size={14}/> Bắt Đầu Render Video</>}
                                    </button>
                                 ) : (
                                    <button onClick={cancelVideoExport} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 rounded-xl tracking-wider shadow-lg flex items-center justify-center gap-2 animate-pulse text-xs">
                                        <XCircle size={16}/> Dừng & Hủy Bỏ
                                     </button>
                                  )}
                               </div>
                            </div>
                         )}

                         {exportTab === 'history' && (
                           <div className="flex flex-col gap-4 flex-1 animate-in fade-in overflow-y-auto pr-1">
                              <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-white/10 shrink-0">
                                 <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5"><Film size={14}/> Lịch Sử Video Đã Render</span>
                                 <span className="text-[10px] text-slate-400 font-mono">{renderHistory?.length || 0} video</span>
                              </div>

                              {!renderHistory || renderHistory.length === 0 ? (
                                 <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-950/50 rounded-xl border border-dashed border-white/10 my-auto">
                                    <Film size={32} className="text-slate-600 mb-2" />
                                    <p className="text-xs text-slate-400 font-bold mb-1">Chưa có video nào trong lịch sử</p>
                                    <p className="text-[10px] text-slate-500">Bấm nút "Bắt Đầu Render Video" để xuất video mới.</p>
                                 </div>
                              ) : (
                                 <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-[60vh]">
                                    {renderHistory.map((item: any, idx: number) => (
                                       <div key={item.id || idx} className={`flex flex-col p-3 rounded-xl border transition-all ${renderedVideoUrl === item.url ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-slate-950 border-white/10 hover:border-white/20'}`}>
                                          <div className="flex items-center justify-between mb-1.5">
                                             <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center font-mono">#{renderHistory.length - idx}</span>
                                                <span className="text-xs font-bold text-white truncate max-w-[180px]">{item.name || `Video #${renderHistory.length - idx}`}</span>
                                             </div>
                                             <span className="text-[10px] text-slate-400 font-mono">{item.createdAt ? new Date(item.createdAt).toLocaleTimeString('vi-VN') : ''}</span>
                                          </div>

                                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-2.5">
                                             <span className="bg-slate-900 px-2 py-0.5 rounded font-mono text-amber-300 border border-white/5">{item.resolution || '1080'}p</span>
                                             <span className="bg-slate-900 px-2 py-0.5 rounded font-mono text-cyan-300 border border-white/5">{item.aspectRatio || '16x9'}</span>
                                             <span className="bg-slate-900 px-2 py-0.5 rounded font-mono uppercase text-emerald-300 border border-white/5">{item.format || 'mp4'}</span>
                                          </div>

                                          <div className="grid grid-cols-3 gap-2">
                                             <button onClick={() => { 
                                                setRenderedVideoUrl(item.url); 
                                                setRenderedVideoBlob(item.blob || null); 
                                                if (typeof window !== 'undefined') {
                                                   const url = new URL(window.location.href);
                                                   url.searchParams.set('videoid', item.id);
                                                   window.history.replaceState(null, '', url.toString());
                                                }
                                             }} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-all">
                                                <PlayCircle size={12}/> Xem
                                             </button>
                                             <button onClick={() => {
                                                const a = document.createElement('a');
                                                a.href = item.url;
                                                a.download = `${item.name || 'OngLao_Video'}.${item.format || 'mp4'}`;
                                                a.click();
                                             }} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 border border-white/10 transition-all">
                                                <Save size={12}/> Tải Về
                                             </button>
                                             <button onClick={() => { if (deleteRenderHistoryItem) deleteRenderHistoryItem(item.id); }} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-all">
                                                <X size={12}/> Xóa
                                             </button>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              )}

                           </div>
                         )}
                  </div>

                 {/* BÊN PHẢI: BẢNG PREVIEW / RENDER VIDEO */}
                 <div className={`w-full bg-black border border-white/10 overflow-hidden relative shadow-inner flex items-center justify-center flex-col shrink-0 transition-all duration-300 ${isPreviewFullscreen ? 'fixed inset-0 z-[250] rounded-none' : 'md:w-7/12 rounded-xl aspect-[16/9] md:aspect-auto md:h-full'}`}>
                    {renderedVideoUrl ? (
                       <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center">
                          {/* Thanh điều khiển trên cùng màn hình preview */}
                          <div className="absolute top-3 left-3 right-3 z-50 flex items-center justify-end bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-2xl">
                             <div className="flex items-center gap-2">
                                <button onClick={handleDownloadVideo} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow transition-all hover:scale-105">
                                   <Save size={14}/> Tải Video
                                </button>
                                <button onClick={handleShareVideoSocial} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow transition-all hover:scale-105">
                                   <ShareIcon size={14}/> Chia Sẻ
                                </button>
                             </div>
                          </div>

                          <video ref={previewVideoRef} controls autoPlay src={renderedVideoUrl} className="w-full h-full object-contain bg-slate-950 pt-12" />
                       </div>
                    ) : (
                       <>
                          {/* NÚT UNDO / REDO TRÊN MÀN HÌNH CANAVS */}
                          <div className="absolute top-4 left-4 z-50 flex gap-2">
                              <button 
                                 onClick={handleUndoPosition} 
                                 disabled={pastOffsets.length === 0 || isExportingVideo}
                                 className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-lg border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
                                 title="Hoàn tác thao tác di chuyển/phóng to"
                              >
                                 <Undo2 size={16} />
                              </button>
                              <button 
                                 onClick={handleRedoPosition} 
                                 disabled={futureOffsets.length === 0 || isExportingVideo}
                                 className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-lg border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
                                 title="Làm lại thao tác"
                              >
                                 <Redo2 size={16} />
                              </button>
                          </div>

                          {/* CỤM NÚT GÓC TRÊN BÊN PHẢI (RENDER STATUS & FULLSCREEN) */}
                          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                              {isExportingVideo && (
                                  <div className="flex flex-col items-end gap-1.5">
                                      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-4 py-2.5 rounded-lg text-xs text-red-400 font-mono font-bold border border-red-500/30 animate-pulse shadow-lg">
                                          <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_red]"></div> Đang thu hình...
                                      </div>
                                      {/* BẢNG ĐIỀU KHIỂN AI KIỂM DUYỆT (CHỈ HIỆN KHI ĐANG RENDER) */}
                                      <div id="ai-moderator-status" className="bg-emerald-900/60 backdrop-blur-md px-3 py-2 rounded-lg text-[10px] text-emerald-300 font-mono border border-emerald-500/40 shadow-lg text-right transition-all">
                                          <div className="font-bold flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> AI Đang khởi động...</div>
                                      </div>
                                  </div>
                              )}
                              {!isExportingVideo && (
                                  <button 
                                     onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)} 
                                     className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2.5 rounded-lg border border-white/10 transition-all shadow-lg flex items-center justify-center h-[42px] w-[42px]"
                                     title={isPreviewFullscreen ? "Thu nhỏ về mặc định" : "Mở rộng toàn màn hình để dễ chỉnh sửa"}
                                  >
                                     {isPreviewFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                                  </button>
                              )}
                          </div>

                          <canvas 
                             ref={exportCanvasRef} 
                             className="w-full h-full object-contain bg-slate-950 touch-none cursor-move" 
                             onPointerDown={handleCanvasPointerDown}
                             onPointerMove={handleCanvasPointerMove}
                             onPointerUp={handleCanvasPointerUp}
                             onPointerLeave={handleCanvasPointerLeave}
                             onWheel={handleCanvasWheel}
                          />
                          {!isExportingVideo && <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none"><div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white/50 border border-white/10">Màn Hình Xem Trước & Tùy Chỉnh (Có thể Undo/Redo)</div></div>}
                       </>
                    )}
                 </div>
              </div>
           </div>
           
           {/* MODAL LƯU / SỬA PRESET BỐI CẢNH */}
           {showPresetModal && (
               <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4" >
                  <div className="bg-slate-900 border border-amber-500/30 rounded-xl w-full max-w-sm shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-xl">
                          <h2 className="font-bold text-amber-400 tracking-wider flex items-center gap-2">
                             <LayoutTemplate size={16}/> {presetFormData.id ? 'Sửa thông tin Bối cảnh' : 'Lưu Bối cảnh mới'}
                          </h2>
                          <button onClick={() => setShowPresetModal(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                          <div className="flex flex-col gap-1.5">
                             <label className="text-xs font-bold text-slate-400">Tên bối cảnh:</label>
                             <input 
                                 type="text" 
                                 value={presetFormData.name} 
                                 onChange={(e: any) => setPresetFormData({...presetFormData, name: e.target.value})}
                                 autoFocus
                                 placeholder="Ví dụ: Rừng trúc ngang 1"
                                 className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-amber-500 outline-none"
                              />
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                             <label className="text-xs font-bold text-slate-400">Phân loại khung hình (Tọa độ):</label>
                             <select 
                                value={presetFormData.category} 
                                onChange={e => setPresetFormData({...presetFormData, category: e.target.value})}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none"
                             >
                                <option value="ngang">Khung hình Ngang (16:9, 4:3...)</option>
                                <option value="doc">Khung hình Dọc (9:16, 3:4...)</option>
                                <option value="vuong">Khung hình Vuông (1:1)</option>
                             </select>
                             {!presetFormData.id && (
                                <p className="text-[10px] text-amber-400/80 italic mt-1">Gợi ý: Đã tự động chọn phân loại dựa trên Tỉ lệ khung hình video đang bật.</p>
                             )}
                          </div>

                          <div className="flex justify-end gap-3 mt-2">
                              <button onClick={() => setShowPresetModal(false)} className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy</button>
                              <button onClick={handleConfirmPreset} disabled={!presetFormData.name.trim()} className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                                 <Check size={14}/> {presetFormData.id ? 'Cập nhật' : 'Lưu bối cảnh'}
                              </button>
                          </div>
                      </div>
                  </div>
               </div>
           )}

           {/* MODAL NỘI SOI CHẨN ĐOÁN RENDER (PROFILER) */}
           {showDiagnostics && diagnosticReport && (
               <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" >
                  <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col animate-in zoom-in-95 max-h-[85vh]" onClick={e => e.stopPropagation()}>
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                          <h2 className="font-bold text-indigo-400 tracking-wider flex items-center gap-2">
                             <Sliders size={18}/> Báo Cáo Nội Soi Kỹ Thuật
                          </h2>
                          <button onClick={() => setShowDiagnostics(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                      </div>
                      <div className="p-5 flex flex-col gap-4 overflow-hidden h-full">
                          <p className="text-[12px] text-slate-300 leading-relaxed shrink-0">
                              Đây là dữ liệu đo lường trực tiếp từ phần cứng của bạn trong quá trình Render video vừa rồi. Hãy bấm <b>"Sao chép Báo Cáo"</b> và dán vào khung chat để Tâm An giúp bạn tái cấu trúc, tối ưu mã nguồn nhé.
                          </p>
                          <textarea 
                              readOnly 
                              value={diagnosticReport} 
                              className="w-full h-full min-h-[40vh] bg-slate-950 border border-white/10 rounded-lg p-4 text-[11px] text-emerald-400 font-mono outline-none resize-none scrollbar-hide"
                          />
                          <div className="flex justify-end gap-3 mt-2 shrink-0">
                              <button onClick={() => setShowDiagnostics(false)} className="px-5 py-2.5 rounded-lg font-bold text-slate-400 hover:text-white text-xs transition-colors">Đóng</button>
                              <button 
                                  onClick={() => {
                                      copyToClipboard(diagnosticReport);
                                      showToastMsg('Đã sao chép Báo cáo Nội soi! Hãy dán vào khung chat cho Tâm An.', 'success', 5000);
                                      setShowDiagnostics(false);
                                  }} 
                                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-lg transition-all flex items-center gap-2"
                              >
                                 <Copy size={14}/> Sao chép Báo Cáo
                              </button>
                          </div>
                      </div>
                  </div>
               </div>
           )}

           {/* MODAL LƯU NHÂN VẬT VÀO KHO MÁY */}
           {showSaveCharModal && (
               <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" >
                  <div className="bg-slate-900 border border-orange-500/30 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                          <h2 className="font-bold text-orange-400 tracking-wider flex items-center gap-2"><Save size={16}/> Lưu Hình Tướng Mới</h2>
                           <button onClick={() => setShowSaveCharModal(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                          <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-400">Tên hình tướng:</label>
                              <input 
                                  type="text" 
                                  value={saveCharData.name} 
                                  onChange={(e: any) => setSaveCharData({...saveCharData, name: e.target.value})} 
                                  autoFocus 
                                  placeholder="VD: Lão Video Của Tôi" 
                                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-orange-500 outline-none" 
                              />
                          </div>
                          {saveCharData.role === 'user' && (
                              <div className="grid grid-cols-2 gap-3">
                                  <div className="flex flex-col gap-1.5">
                                      <label className="text-xs font-bold text-slate-400">Giới tính:</label>
                                      <select 
                                          value={saveCharData.gender} 
                                          onChange={e => setSaveCharData({...saveCharData, gender: e.target.value})} 
                                          className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-orange-500 outline-none"
                                      >
                                          <option value="Nam">Nam</option>
                                          <option value="Nữ">Nữ</option>
                                      </select>
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                      <label className="text-xs font-bold text-slate-400">Tuổi:</label>
                                      <input 
                                          type="number" 
                                          value={saveCharData.age} 
                                          onChange={e => setSaveCharData({...saveCharData, age: Number(e.target.value)})} 
                                          className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-orange-500 outline-none" 
                                      />
                                  </div>
                              </div>
                          )}
                          <div className="flex justify-end gap-3 mt-2">
                              <button onClick={() => setShowSaveCharModal(false)} className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy</button>
                              <button onClick={executeSaveCharacter} disabled={!saveCharData.name.trim()} className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                                  <Check size={14}/> Xác nhận lưu
                              </button>
                          </div>
                      </div>
                  </div>
               </div>
           )}

           {/* MODAL LƯU VIDEO DỰNG SẴN VÀO KHO */}
           {showFfSaveModal && (
               <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" >
                   <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                       <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                           <h2 className="font-bold text-emerald-400 tracking-wider flex items-center gap-2"><Save size={16}/> Lưu Video Lẻ</h2>
                           <button onClick={() => setShowFfSaveModal(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
                       </div>
                       <div className="p-5 flex flex-col gap-4">
                           <div className="flex flex-col gap-1.5">
                               <label className="text-xs font-bold text-slate-400">Tên video để dễ nhớ:</label>
                               <input 
                                   type="text" 
                                   value={ffSaveData.name} 
                                   onChange={(e: any) => setFfSaveData({...ffSaveData, name: e.target.value})} 
                                   autoFocus 
                                   placeholder="VD: Cảnh Lão ngồi thiền" 
                                   className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-emerald-500 outline-none" 
                               />
                           </div>
                           <div className="flex justify-end gap-3 mt-2">
                               <button onClick={() => setShowFfSaveModal(false)}  className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy</button>
                               <button onClick={executeSaveFfClipV2} disabled={!ffSaveData.name.trim()} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                                   <Check size={14}/> Xác nhận lưu
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
           )}

           {/* TÂM AN THÊM: MODAL LƯU TOÀN BỘ THÀNH BỘ CẢNH (PACK) CÁ NHÂN */}
           {showSavePackModal && (
               <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" >
                   <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                       <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                           <h2 className="font-bold text-amber-400 tracking-wider flex items-center gap-2"><Archive size={16}/> Lưu Bộ Cảnh Cá Nhân</h2>
                           <button onClick={() => setShowSavePackModal(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
                       </div>
                       <div className="p-5 flex flex-col gap-4">
                           <p className="text-[11px] text-slate-300 italic bg-amber-900/10 border border-amber-500/20 p-3 rounded-lg">
                               Tính năng này sẽ nén toàn bộ các video đang hiển thị trong danh sách cắt cảnh và lưu vào ổ cứng máy tính. Lần sau bạn chỉ cần chọn tên bộ cảnh là hệ thống tự động nạp toàn bộ mà không cần tải lại từng cái.
                           </p>

                           <div className="flex flex-col gap-1.5">
                               <label className="text-xs font-bold text-slate-400">Tên Bộ cảnh:</label>
                               <DebouncedInput 
                                   type="text" 
                                   value={savePackData.name} 
                                   onChange={(e: any) => setSavePackData({...savePackData, name: e.target.value})} 
                                   autoFocus 
                                   placeholder="VD: Cảnh Cô Gái Áo Xanh (Dọc)" 
                                   className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" 
                               />
                           </div>
                           
                           <div className="flex flex-col gap-1.5">
                               <label className="text-xs font-bold text-slate-400">Tỷ lệ video:</label>
                               <select 
                                   value={savePackData.aspect} 
                                   onChange={e => setSavePackData({...savePackData, aspect: e.target.value})} 
                                   className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none"
                               >
                                   <option value="ngang">Ngang (Youtube 16:9)</option>
                                   <option value="doc">Dọc (Tiktok/Reels 9:16)</option>
                               </select>
                           </div>

                           <div className="flex justify-end gap-3 mt-2">
                               <button onClick={() => setShowSavePackModal(false)}  className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy</button>
                               <button onClick={executeSaveFfPack} disabled={!savePackData.name.trim()} className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                                   <Check size={14}/> Xác nhận lưu
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
           )}

         </div>
  );
};

export default VideoCreatorModal;
