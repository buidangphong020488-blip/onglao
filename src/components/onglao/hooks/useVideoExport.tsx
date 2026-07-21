// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { 
  db, 
  appId, 
  idb, 
  doc, 
  getDoc, 
  setDoc,
  VIDEO_BACKGROUNDS,
  DEFAULT_BGM_LIST,
  processChromaKeyPixels,
  getLaoSvgString,
  getUserSvgString,
  drawContactShadow
} from '../constants';
import { fetchWithRetry, cleanTextForTTS } from '../utils';
import { useAutopilot } from './useAutopilot';
import { useFullFrameScenes } from './useFullFrameScenes';
import { useVideoExporterEngine } from './useVideoExporterEngine';
import { 
  createChatSessionAction, 
  saveChatMessageAction, 
  updateChatSessionTitleAction, 
  deleteChatSessionAction 
} from '@/actions/chat';
import {
  EMOTIONS,
  DEFAULT_CAM_PRESETS,
  DEFAULT_CHARACTERS,
  pcmToWav,
  combineWavs,
  formatTime,
  getVideoCategory,
  calculateAutoFlip,
  applyChromaKey,
  buildDiagnosticReport,
  loadSvgToImage,
  wrapTextToLines
} from '../utils/videoExportUtils';

export const useVideoExport = ({
  user,
  currentUser,
  messages,
  poemDatabase,
  updateCurrentMessages,
  sessions,
  setSessions,
  currentSessionId,
  setCurrentSessionId,
  laoVoiceRef,
  laoVoiceStyleRef,
  userVoiceRef,
  userVoiceStyleRef,
  laoSelfCallRef,
  laoCallUserRef,
  userSelfCallRef,
  userCallLaoRef,
  userName,
  userGender,
  userAge,
  appLanguage,
  selectedAiConfigIdRef,
  geminiApiKeyRef,
  resolveStanzaAudioUrl,
  resolveMeaningAudioUrl,
  resolveGreetingAudioUrl,
  getOrGenerateTransitionAudio,
  generateVoice,
  showToastMsg,
  setConfirmDialog,
  currentlyPlayingId,
  setCurrentlyPlayingId,
  currentLiveSubTextRef,
  setShowAITopicModal,
  setShowHistory,
  setShowAiManager,
  importMode,
  aiLaoStyle,
  aiScriptLength,
  aiTopicText,
  setAiTopicText,
  aiUserEmotionArc,
  aiScriptTitle,
  aiScriptDate,
  customLaoName,
  customUserName,
  laoSelfCall,
  laoCallUser,
  userSelfCall,
  userCallLao,
  laoVoice,
  laoVoiceStyle,
  userVoice,
  userVoiceStyle,
  generatedScriptText,
  setGeneratedScriptText,
}: any) => {

  // --- Video Export & Custom Appearance State ---
  const [showVideoExportModal, setShowVideoExportModal] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('onglao_show_video_export_modal') === 'true';
    }
    return false;
  });
  useEffect(() => {
    localStorage.setItem('onglao_show_video_export_modal', showVideoExportModal.toString());
  }, [showVideoExportModal]);
  const [videoExportSource, setVideoExportSource] = useState<string | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState('16x9'); 
  const videoAspectRatioRef = useRef(videoAspectRatio);
  useEffect(() => { videoAspectRatioRef.current = videoAspectRatio; }, [videoAspectRatio]);

  const latestSessionsRef = useRef(sessions);
  useEffect(() => { latestSessionsRef.current = sessions; }, [sessions]);

  const currentSessionIdRef = useRef(currentSessionId);
  useEffect(() => { currentSessionIdRef.current = currentSessionId; }, [currentSessionId]);

  const [showSaveCharModal, setShowSaveCharModal] = useState(false);
  const [saveCharData, setSaveCharData] = useState<any>({ role: 'lao', name: '', age: 25, gender: 'Nữ' });

  // TÂM AN THÊM: State quản lý hiệu ứng chuyển cảnh
  const [videoTransition, setVideoTransition] = useState('none');
  const videoTransitionRef = useRef(videoTransition);
  useEffect(() => { videoTransitionRef.current = videoTransition; }, [videoTransition]);
  const [videoTransitionDuration, setVideoTransitionDuration] = useState(0.7);
  const videoTransitionDurationRef = useRef(videoTransitionDuration);
  useEffect(() => { videoTransitionDurationRef.current = videoTransitionDuration; }, [videoTransitionDuration]);

  // --- TÂM AN THÊM: STATE & REFS CHO TÍNH NĂNG ZOOM/PAN LÃO �? KHUNG CHAT ---
  // TÂM AN FIX: Đặt mặc định scale = 1.8 cho Lão Chat
  const [chatLaoTransform, setChatLaoTransform] = useState({ x: -4, y: 164, s: 1.8 });
  const [showChatLaoControls, setShowChatLaoControls] = useState(false); // Thêm state ẩn hiện bảng điều khiển
  const chatLaoDragInfo = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleChatLaoPointerDown = (e: any) => {
      chatLaoDragInfo.current = {
          isDragging: true,
          startX: e.clientX || e.touches?.[0].clientX,
          startY: e.clientY || e.touches?.[0].clientY,
          initialX: chatLaoTransform.x,
          initialY: chatLaoTransform.y
      };
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch(err) {}
  };

  const handleChatLaoPointerMove = (e: any) => {
      if (!chatLaoDragInfo.current.isDragging) return;
      const clientX = e.clientX || e.touches?.[0].clientX;
      const clientY = e.clientY || e.touches?.[0].clientY;
      const dx = clientX - chatLaoDragInfo.current.startX;
      const dy = clientY - chatLaoDragInfo.current.startY;

      setChatLaoTransform((prev: any) => ({
          ...prev,
          x: chatLaoDragInfo.current.initialX + dx,
          y: chatLaoDragInfo.current.initialY + dy
      }));
  };

  const handleChatLaoPointerUp = (e: any) => {
      chatLaoDragInfo.current.isDragging = false;
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err) {}
  };

  const handleChatLaoWheel = (e: any) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setChatLaoTransform((prev: any) => ({
          ...prev,
          s: Math.max(0.5, Math.min(4.0, prev.s + delta)) // Giới hạn thu phóng từ 0.5x đến 4.0x
      }));
  };
  // -----------------------------------------------------------------------

  // TÂM AN FIX: Đặt mặc định độ phân giải video là 1080p (Full HD)
  const [videoResolution, setVideoResolution] = useState('1080'); 
  const videoResolutionRef = useRef(videoResolution);
  useEffect(() => { videoResolutionRef.current = videoResolution; }, [videoResolution]);
  const [videoSlug, setVideoSlug] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('onglao_video_slug') || '';
    }
    return '';
  });
  useEffect(() => {
    localStorage.setItem('onglao_video_slug', videoSlug || '');
  }, [videoSlug]);

  const [subtitleSentenceCount, setSubtitleSentenceCount] = useState(1);
  const [subtitleColor, setSubtitleColor] = useState('#f8fafc'); 
  const [subtitleYPos, setSubtitleYPos] = useState(94); 
  const [subtitleScale, setSubtitleScale] = useState(1.0);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [isPreparingVideoData, setIsPreparingVideoData] = useState(false);
  const [renderedVideoBlob, setRenderedVideoBlob] = useState<any>(null);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<any>(null);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false); 
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false); // Thêm state cho chế độ Fullscreen lúc đang edit
  const [videoExt, setVideoExt] = useState('mp4');
  const [exportTab, setExportTab] = useState('basic'); // basic | advance | background | appearance | history
  const [hoveredElement, setHoveredElement] = useState<any>(null);

  // --- TÂM AN THÊM: QUẢN LÝ LỊCH SỬ VIDEO ĐÃ RENDER (TÍCH HỢP POSTGRESQL DB) ---
  const [renderHistory, setRenderHistory] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('onglao_video_render_history');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {}
    }
    return [];
  });

  // Nạp dữ liệu lịch sử từ PostgreSQL Database khi khởi tạo
  useEffect(() => {
    fetch('/api/render-history')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          setRenderHistory(prev => {
            const map = new Map();
            resData.data.forEach((item: any) => map.set(item.id, item));
            prev.forEach((item: any) => {
              if (!map.has(item.id)) map.set(item.id, item);
            });
            const merged = Array.from(map.values()).sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
            try {
              localStorage.setItem('onglao_video_render_history', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      })
      .catch(err => console.warn('Lỗi nạp lịch sử từ PostgreSQL:', err));
  }, []);

  const saveRenderHistoryItem = (blob: Blob, url: string, customName?: string) => {
    try {
      const id = 'vid_' + Date.now();
      const newItem = {
        id,
        name: customName || `Video_${new Date().toLocaleTimeString('vi-VN')} (${videoResolution}p)`,
        url,
        createdAt: Date.now(),
        resolution: videoResolution,
        aspectRatio: videoAspectRatio,
        format: videoExt || 'mp4'
      };

      if (blob) {
        idb.set('rendered_vid_' + id, blob).catch(err => console.warn('Lỗi lưu IDB video history:', err));
      }

      // Lưu Metadata & Đường dẫn file vật lý dự án vào PostgreSQL DB vĩnh viễn
      fetch('/api/render-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newItem.id,
          name: newItem.name,
          url: newItem.url,
          createdAt: newItem.createdAt,
          resolution: newItem.resolution,
          aspectRatio: newItem.aspectRatio,
          format: newItem.format
        })
      }).catch(err => console.warn('Lỗi lưu PostgreSQL:', err));

      setRenderHistory(prev => {
        const updated = [newItem, ...prev];
        try {
          const jsonList = updated.map(h => ({
            id: h.id,
            name: h.name,
            url: h.url,
            createdAt: h.createdAt,
            resolution: h.resolution,
            aspectRatio: h.aspectRatio,
            format: h.format
          }));
          localStorage.setItem('onglao_video_render_history', JSON.stringify(jsonList));
        } catch (e) {}
        return updated;
      });
    } catch (e) {}
  };

  const deleteRenderHistoryItem = (id: string) => {
    try {
      idb.del('rendered_vid_' + id).catch(() => {});
      
      // Xóa trong PostgreSQL DB
      fetch(`/api/render-history?id=${id}`, { method: 'DELETE' }).catch(() => {});

      setRenderHistory(prev => {
        const updated = prev.filter(item => item.id !== id);
        try {
          const jsonList = updated.map(h => ({
            id: h.id,
            name: h.name,
            createdAt: h.createdAt,
            resolution: h.resolution,
            aspectRatio: h.aspectRatio,
            format: h.format
          }));
          localStorage.setItem('onglao_video_render_history', JSON.stringify(jsonList));
        } catch (e) {}
        return updated;
      });
    } catch (e) {}
  };

  // --- TÂM AN THÊM: STATE CHO INTRO & OUTRO ---
  const [enableIntro, setEnableIntro] = useState(true);
  const [introTitle, setIntroTitle] = useState('Chủ đề: Giác Ngộ'); // TÂM AN FIX: Thêm chữ mặc định để Preview luôn thấy
  const [introSubtitle, setIntroSubtitle] = useState('Làm sao để buông bỏ vọng niệm?'); 
  const [enableOutroText, setEnableOutroText] = useState(true);
  const [outroText, setOutroText] = useState('Nguyện người xem được giác ngộ giải thoát\nsống an nhiên tự tại');
  
  const enableIntroRef = useRef(enableIntro);
  const introTitleRef = useRef(introTitle);
  const introSubtitleRef = useRef(introSubtitle);
  const outroTextRef = useRef(outroText);
  
  useEffect(() => { enableIntroRef.current = enableIntro; }, [enableIntro]);
  useEffect(() => { introTitleRef.current = introTitle; }, [introTitle]);
  useEffect(() => { introSubtitleRef.current = introSubtitle; }, [introSubtitle]);
  useEffect(() => { outroTextRef.current = outroText; }, [outroText]);

  // TÂM AN THÊM: State quản lý chế độ Video Dựng sẵn Toàn cảnh (Bypass 3D)
  const [isFullFrameMode, setIsFullFrameMode] = useState(true); // TÂM AN FIX: Bật mặc định Cắt cảnh đa cảm xúc
  const isFullFrameModeRef = useRef(isFullFrameMode);
  useEffect(() => { isFullFrameModeRef.current = isFullFrameMode; }, [isFullFrameMode]);






  const [FULLFRAME_PACKS, setFullFramePacks] = useState<any[]>([]);

  // --- STATE KHO NHÂN VẬT ĐỊNH VỊ SẴN ---
  const [characterPresets, setCharacterPresets] = useState<any[]>([]);
  const [localCharacters, setLocalCharacters] = useState<any[]>([]);

  const loadLocalCharacters = () => {
      const list = JSON.parse(localStorage.getItem('taman_local_chars') || '[]');
      setLocalCharacters(list);
  };
  useEffect(() => { loadLocalCharacters(); }, []);

  const mergedPresets = [...DEFAULT_CHARACTERS];
  characterPresets.forEach(cp => {
      const idx = mergedPresets.findIndex(p => 
          p.id === cp.id || 
          p.name.toLowerCase().trim() === cp.name.toLowerCase().trim()
      );
      if (idx !== -1) {
          mergedPresets[idx] = {
              ...mergedPresets[idx],
              ...cp,
              id: cp.id
          };
      } else {
          mergedPresets.push(cp);
      }
  });

  const allCharacters = [...mergedPresets, ...localCharacters];

  // TÂM AN FIX: Mặc định chọn Lão Chat
  const [currentLaoPresetId, setCurrentLaoPresetId] = useState('char_lao_chat');
  const [currentUserPresetId, setCurrentUserPresetId] = useState<any>(null);

  const {
    ffScenes,
    setFfScenes,
    ffScenesRef,
    localFfClips,
    setLocalFfClips,
    localFfPacks,
    setLocalFfPacks,
    ffVidRefs,
    showFfSaveModal,
    setShowFfSaveModal,
    ffSaveData,
    setFfSaveData,
    showSavePackModal,
    setShowSavePackModal,
    savePackData,
    setSavePackData,
    moveFfScene,
    handleSelectFfClipV2,
    handleDeleteFfClipV2,
    handleUploadFolder,
    showUploadGuide,
    executeSaveFfClipV2,
    executeSaveFfPack,
    handleLoadPack,
    handleDeleteFfPack,
    handleCopyFfScenesCode
  } = useFullFrameScenes({
    showToastMsg,
    setConfirmDialog,
    copyToClipboard,
    videoAspectRatio,
    FULLFRAME_PACKS,
    setFullFramePacks,
    allCharacters,
    currentLaoPresetId,
    currentUserPresetId
  });

  useEffect(() => {
    fetch('/api/admin/canh-quay')
      .then((r) => r.json())
      .then((data: any[]) => {
        if (!Array.isArray(data)) return;
        
        // Map database NhanVat records to character presets
        const presets = data.map((nv: any) => {
          const ngang = typeof nv.assetsNgang === 'string' ? JSON.parse(nv.assetsNgang || '{}') : (nv.assetsNgang || {});
          const doc = typeof nv.assetsDoc === 'string' ? JSON.parse(nv.assetsDoc || '{}') : (nv.assetsDoc || {});
          
          // Reconstruct properties from ngang/doc json
          const role = ngang.role || doc.role || 'user';
          const age = ngang.age || doc.age || 25;
          const gender = ngang.gender || doc.gender || 'Nữ';
          const thumb = ngang.thumb || doc.thumb || '';
          const visualType = ngang.visualType || doc.visualType || 'video';
          const chromaSettings = ngang.chromaSettings || doc.chromaSettings || {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"};
          const recommendedScale = ngang.recommendedScale || doc.recommendedScale || 1.3;
          const recommendedX = ngang.recommendedX !== undefined ? ngang.recommendedX : (doc.recommendedX !== undefined ? doc.recommendedX : 2);
          const recommendedY = ngang.recommendedY !== undefined ? ngang.recommendedY : (doc.recommendedY !== undefined ? doc.recommendedY : -3);
          const defaultLiveFullScreen = ngang.defaultLiveFullScreen || doc.defaultLiveFullScreen || false;
          const naturalFacing = ngang.naturalFacing || doc.naturalFacing || 'right';
          
          let assets = ngang.assets || doc.assets || {};
          if (!assets.idle) {
            assets = {
              idle: ngang.idle || ngang.binhthuong || ngang.con_binhthuong || doc.idle || doc.binhthuong || doc.con_binhthuong || null,
              talking: ngang.talking || ngang.vui || ngang.con_vui || doc.talking || doc.vui || doc.con_vui || null,
              bowing: ngang.bowing || ngang.outro || ngang.outtro || doc.bowing || doc.outro || doc.outtro || null
            };
          }
          
          // Merge fullFramePacks from both ngang and doc
          const fullFramePacks = [];
          if (ngang.fullFramePacks && Array.isArray(ngang.fullFramePacks)) {
            fullFramePacks.push(...ngang.fullFramePacks);
          }
          if (doc.fullFramePacks && Array.isArray(doc.fullFramePacks)) {
            fullFramePacks.push(...doc.fullFramePacks);
          }
          
          // Flat map fallback: construct packs if none defined in DB JSON
          if (fullFramePacks.length === 0) {
            // Horizontal pack
            const ngangScenes = [];
            const addNgangScene = (id: string, role: string, emotion: string, keys: string[]) => {
              const url = keys.map(k => ngang[k]).find(u => u);
              if (url) ngangScenes.push({ id, role, emotion, url, idbKey: null });
            };
            addNgangScene('scene_lao_calm', 'lao', 'calm', ['lao_binhthuong', 'lao_calm', 'idle']);
            addNgangScene('scene_lao_sad', 'lao', 'sad', ['lao_buon', 'lao_sad']);
            addNgangScene('scene_lao_joy', 'lao', 'joy', ['lao_vui', 'lao_joy', 'talking']);
            addNgangScene('scene_user_calm', 'user', 'calm', ['con_binhthuong', 'con_calm', 'user_calm']);
            addNgangScene('scene_user_sad', 'user', 'sad', ['con_buon', 'con_sad', 'user_sad']);
            addNgangScene('scene_user_joy', 'user', 'joy', ['con_vui', 'con_joy', 'user_joy']);
            addNgangScene('scene_outro_calm', 'outro', 'calm', ['outro', 'outtro', 'bowing']);
            if (ngangScenes.length > 0) {
              fullFramePacks.push({ id: `pack_${nv.id}`, name: nv.name, aspect: 'ngang', scenes: ngangScenes });
            }
            
            // Vertical pack
            const docScenes = [];
            const addDocScene = (id: string, role: string, emotion: string, keys: string[]) => {
              const url = keys.map(k => doc[k]).find(u => u);
              if (url) docScenes.push({ id, role, emotion, url, idbKey: null });
            };
            addDocScene('scene_lao_calm', 'lao', 'calm', ['lao_binhthuong', 'lao_calm', 'idle']);
            addDocScene('scene_lao_sad', 'lao', 'sad', ['lao_buon', 'lao_sad']);
            addDocScene('scene_lao_joy', 'lao', 'joy', ['lao_vui', 'lao_joy', 'talking']);
            addDocScene('scene_user_calm', 'user', 'calm', ['con_binhthuong', 'con_calm', 'user_calm']);
            addDocScene('scene_user_sad', 'user', 'sad', ['con_buon', 'con_sad', 'user_sad']);
            addDocScene('scene_user_joy', 'user', 'joy', ['con_vui', 'con_joy', 'user_joy']);
            addDocScene('scene_outro_calm', 'outro', 'calm', ['outro', 'outtro', 'bowing']);
            if (docScenes.length > 0) {
              fullFramePacks.push({ id: `pack_${nv.id}_doc`, name: nv.name, aspect: 'doc', scenes: docScenes });
            }
          }
          
          return {
            id: nv.id,
            name: nv.name,
            role,
            age,
            gender,
            thumb,
            visualType,
            assets,
            chromaSettings,
            recommendedScale,
            recommendedX,
            recommendedY,
            defaultLiveFullScreen,
            naturalFacing,
            fullFramePacks,
            linkedIds: typeof nv.linkedIds === 'string' ? JSON.parse(nv.linkedIds || '[]') : (nv.linkedIds || [])
          };
        });
        
        // Resolve character linkages and merge their fullFramePacks
        presets.forEach((char: any) => {
          if (char.linkedIds && char.linkedIds.length > 0) {
            char.linkedIds.forEach((linkedId: string) => {
              const linkedPreset = presets.find((p: any) => p.id === linkedId);
              if (linkedPreset && linkedPreset.fullFramePacks) {
                // Merge linked character's scenes into primary character's fullFramePacks
                linkedPreset.fullFramePacks.forEach((linkedPack: any) => {
                  let targetPack = char.fullFramePacks.find((p: any) => p.aspect === linkedPack.aspect);
                  
                  // If target pack doesn't exist, create it
                  if (!targetPack) {
                    targetPack = { id: `pack_${char.id}_${linkedPack.aspect}`, name: char.name, aspect: linkedPack.aspect, scenes: [] };
                    char.fullFramePacks.push(targetPack);
                  }
                  
                  // Merge scenes
                  linkedPack.scenes.forEach((s: any) => {
                    // Override any existing scene in primary with same role and emotion
                    targetPack.scenes = targetPack.scenes.filter((x: any) => !(x.role === s.role && x.emotion === s.emotion));
                    targetPack.scenes.push(s);
                  });
                });
              }
            });
          }
        });
        
        setCharacterPresets(presets);
        
        // Extract FULLFRAME_PACKS dynamically
        const packs = presets.reduce((acc: any[], char: any) => {
          if (char.fullFramePacks && Array.isArray(char.fullFramePacks)) {
            acc.push(...char.fullFramePacks);
          }
          return acc;
        }, []);
        setFullFramePacks(packs);
        
        // Initialize ffScenes with first matching aspect pack if not already set or saved
        if (packs.length > 0) {
          const saved = typeof window !== 'undefined' ? localStorage.getItem('onglao_ff_scenes') : null;
          if (!saved || saved === '[]') {
            const isDoc = videoAspectRatioRef.current === '9x16';
            const initialPack = packs.find((p: any) => p.aspect === (isDoc ? 'doc' : 'ngang')) || packs[0];
            if (initialPack) {
              setFfScenes(JSON.parse(JSON.stringify(initialPack.scenes)));
            }
          }
        }
      })
      .catch((err) => console.error('Error fetching characters:', err));
  }, []);

  // --- HỆ THỐNG NỘI SOI & CHẨN ĐOÁN RENDER (PROFILER) ---
  const renderDiagnosticsRef = useRef<any>(null);
  const [diagnosticReport, setDiagnosticReport] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);



  const [cameraPresets, setCameraPresets] = useState(DEFAULT_CAM_PRESETS);
  const [selectedCamId, setSelectedCamId] = useState('cam_2'); // Mặc định chọn góc máy bạn yêu cầu
  const [editingCamId, setEditingCamId] = useState<any>(null);
  const [editCamName, setEditCamName] = useState('');

  const handleSaveCamName = (id: any) => {
      if (editCamName.trim()) {
          setCameraPresets((prev: any[]) => prev.map((c: any) => c.id === id ? { ...c, name: editCamName } : c));
      }
      setEditingCamId(null);
  };

  // --- TÂM AN FX: State Bật/Tắt & Cấu hình chế độ Hoà Hợp ---
  const [enableAutoHarmonization, setEnableAutoHarmonization] = useState(true);
  
  // Tách riêng bóng cho từng nhân vật (TÂM AN FIX: Chỉnh lý vật lý bóng đổ chuẩn xác)
  // Lão đứng: Base hẹp, bóng gọn dưới gót chân
  const defaultLaoShadowConfig = { shadowOpacity: 0.9, shadowWidth: 1.5, shadowHeight: 0.09, shadowOffsetY: -2, shadowOffsetX: -9, shadowSkewX: 5, shadowStretchY: 2 };
  // Người hỏi ngồi/quỳ: Theo thông số tùy chỉnh chuẩn
  const defaultUserShadowConfig = { shadowOpacity: 0.9, shadowWidth: 1.6, shadowHeight: 0.12, shadowOffsetY: -1, shadowOffsetX: -3, shadowSkewX: 23, shadowStretchY: 1.3 };
  
  const [laoShadow, setLaoShadow] = useState({ ...defaultLaoShadowConfig });
  const [userShadow, setUserShadow] = useState({ ...defaultUserShadowConfig });
  const [shadowEditTarget, setShadowEditTarget] = useState('chung'); // 'chung', 'lao' hoặc 'user'

  const [harmonizeSettings, setHarmonizeSettings] = useState({
      // Color (Màu sắc tổng thể chung) - Đưa về chuẩn 1.0 để bypass CPU khi không dùng
      brightness: 1.0,
      contrast: 1.0,
      saturation: 1.0,
      warmth: 0 // -100 (Lạnh/Xanh) đến 100 (Ấm/Vàng)
  });

  // --- Preset Filter & Modal States ---
  const [presetFilterMode, setPresetFilterMode] = useState('auto'); // 'auto' | 'all'
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetFormData, setPresetFormData] = useState({ id: null, name: '', category: 'ngang' });

  const getVideoCategory = (ratio: any) => {
      if (['16x9', '4x3', '21x9'].includes(ratio)) return 'ngang';
      if (['9x16', '3x4', '2x3'].includes(ratio)) return 'doc';
      if (['1x1'].includes(ratio)) return 'vuong';
      return 'ngang';
  };
  
  // --- Cấu hình Ngoại Hình & Offset ---
  const [laoAppearance, setLaoAppearance] = useState({
      robeColor: '#92400e', innerRobeColor: '#b45309', hairColor: '#e2e8f0', hairStyle: 'bald'
  });
  const [showLaoAura, setShowLaoAura] = useState(false); // TÂM AN THÊM: Tắt hào quang mặc định
  const [userAppearance, setUserAppearance] = useState({
      robeColor: '#78350f', innerRobeColor: '#92400e', hairColor: '#1e293b', hairStyle: 'long'
  });

  // --- ẢNH & VIDEO THẬT CHO LÃO ---
  // Tâm An: Đã gán mặc định hiển thị Video động và tích hợp sẵn link Google Drive Direct
  const [laoVisualType, setLaoVisualType] = useState('video'); 
  
  // TÂM AN FIX: Thay đổi video khởi tạo mặc định thành Lão Chat
  const [laoCustomVideos, setLaoCustomVideos] = useState({ 
      idle: '/media/NGHE_zic1jb.webm',
      talking: '/media/NO_I_xx4wc2.webm'
  });
  
  // Video mặc định cho Khung Chat (Vẫn giữ Lão Thẳng/Lão Chat)
  const [chatLaoVideos, setChatLaoVideos] = useState({ 
      idle: '/media/NGHE_zic1jb.webm',
      talking: '/media/NO_I_xx4wc2.webm'
  });
  
  const laoExportVidRefs = useRef<any>({ idle: null, talking: null });
  const [laoCustomImages, setLaoCustomImages] = useState({ closed: null, half: null, open: null });
  
  // Tâm An: Đã thiết lập thông số Xóa nền Thủ công mặc định cho Lão
  const [laoChromaSettings, setLaoChromaSettings] = useState({ 
      mode: 'manual', chromaType: 'none', chromaColor: '#00ff00', tolerance: 50, smoothness: 20, spill: 0.5,
      crop: { t: 0, b: 0, l: 0, r: 0 }, loopMode: 'normal'
  });
  const [processedLaoImages, setProcessedLaoImages] = useState({ closed: null, half: null, open: null });

  // --- ẢNH & VIDEO THẬT CHO NGƯỜI HỎI (USER) ---
  const [userVisualType, setUserVisualType] = useState('video'); 
  const [userCustomVideos, setUserCustomVideos] = useState({ 
      idle: '',
      talking: '',
      bowing: ''
  });
  const userExportVidRefs = useRef<any>({ idle: null, talking: null, bowing: null });
  const [userCustomImages, setUserCustomImages] = useState({ closed: null, half: null, open: null, bow: null });
  
  // Tâm An: Đã reset xóa nền mặc định của Người hỏi về 'none' (Không xóa nền)
  const [userChromaSettings, setUserChromaSettings] = useState({ 
      mode: 'manual', chromaType: 'none', chromaColor: '#00ff00', tolerance: 50, smoothness: 20, spill: 0.5,
      crop: { t: 0, b: 0, l: 0, r: 0 }, loopMode: 'normal'
  });
  const [processedUserImages, setProcessedUserImages] = useState({ closed: null, half: null, open: null, bow: null });

  // --- FIX LỖI SỐ 3: KÍCH HOẠT AUTO CHROMA NGAY KHI BẤM NÚT ---
  useEffect(() => {
      const detectAndSet = async (vidRefs: any, imgRef: any, visualType: any, setSettings: any) => {
          let srcElement = null;
          if (visualType === 'video') {
              srcElement = vidRefs.current.idle || vidRefs.current.talking;
          } else if (visualType === 'image' && imgRef.closed) {
              srcElement = await loadExternalImage(imgRef.closed);
          }
          
          if (srcElement) {
              if (srcElement.tagName === 'VIDEO' && srcElement.readyState < 2) {
                  srcElement.addEventListener('loadeddata', () => {
                      const color = autoDetectBgColor(srcElement);
                      setSettings((prev: any) => ({...prev, chromaType: 'custom', chromaColor: color}));
                  }, { once: true });
              } else {
                  const color = autoDetectBgColor(srcElement);
                  setSettings((prev: any) => ({...prev, chromaType: 'custom', chromaColor: color}));
              }
          }
      };

      if (laoChromaSettings.mode === 'auto') {
          detectAndSet(laoExportVidRefs, laoCustomImages, laoVisualType, setLaoChromaSettings);
      }
  }, [laoChromaSettings.mode, laoVisualType, laoCustomImages]);

  useEffect(() => {
      const detectAndSet = async (vidRefs: any, imgRef: any, visualType: any, setSettings: any) => {
          let srcElement = null;
          if (visualType === 'video') {
              srcElement = vidRefs.current.idle || vidRefs.current.talking || vidRefs.current.bowing;
          } else if (visualType === 'image' && imgRef.closed) {
              srcElement = await loadExternalImage(imgRef.closed);
          }
          
          if (srcElement) {
              if (srcElement.tagName === 'VIDEO' && srcElement.readyState < 2) {
                  srcElement.addEventListener('loadeddata', () => {
                      const color = autoDetectBgColor(srcElement);
                      setSettings((prev: any) => ({...prev, chromaType: 'custom', chromaColor: color}));
                  }, { once: true });
              } else {
                  const color = autoDetectBgColor(srcElement);
                  setSettings((prev: any) => ({...prev, chromaType: 'custom', chromaColor: color}));
              }
          }
      };

      if (userChromaSettings.mode === 'auto') {
          detectAndSet(userExportVidRefs, userCustomImages, userVisualType, setUserChromaSettings);
      }
  }, [userChromaSettings.mode, userVisualType, userCustomImages]);

  // Tự động tạo và quản lý Video Element Lão
  useEffect(() => {
      ['idle', 'talking'].forEach((type: any) => {
          const url = (laoCustomVideos as any)[type];
          if (url) {
              if (!laoExportVidRefs.current[type]) {
                  const v = document.createElement('video');
                  v.muted = true; v.loop = true; v.playsInline = true; v.crossOrigin = "anonymous";
                  
                  // Kích hoạt Xoá nền Tự Động khi tải video xong
                  v.onloadeddata = () => { 
                      setBgUpdateTrigger((p: any) => p+1); 
                      if (laoChromaSettings.mode === 'auto') {
                          const autoColor = autoDetectBgColor(v);
                          setLaoChromaSettings((prev: any) => ({...prev, chromaType: 'custom', chromaColor: autoColor}));
                      }
                  };
                  v.onerror = async () => {
                      if (!(v as any).proxyAttempted && url.startsWith('http') && !url.startsWith('blob:')) {
                          (v as any).proxyAttempted = true;
                          try {
                              const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
                              v.src = proxyUrl;
                              v.load();
                              v.play().catch((e: any)=>console.log(e));
                          } catch (err: any) {}
                      }
                  };
                  laoExportVidRefs.current[type] = v;
              }
              if (laoExportVidRefs.current[type].src !== url && laoExportVidRefs.current[type].src !== `/api/proxy?url=${encodeURIComponent(url)}`) {
                  laoExportVidRefs.current[type].proxyAttempted = false;
                  laoExportVidRefs.current[type].src = url;
                  laoExportVidRefs.current[type].play().catch((e: any) => console.log("Lao Export Vid:", e));
              }
          } else if (laoExportVidRefs.current[type]) {
              laoExportVidRefs.current[type].pause();
              laoExportVidRefs.current[type] = null;
          }
      });
  }, [laoCustomVideos, laoChromaSettings.mode]);

  // Tự động tạo và quản lý Video Element Người Hỏi
  useEffect(() => {
      ['idle', 'talking', 'bowing'].forEach((type: any) => {
          const url = (userCustomVideos as any)[type];
          if (url) {
              if (!userExportVidRefs.current[type]) {
                  const v = document.createElement('video');
                  v.muted = true; 
                  v.loop = true; // TÂM AN FIX: Đã cho phép video vái lạy lặp lại trơn tru đến hết Outro
                  v.playsInline = true; 
                  v.crossOrigin = "anonymous";
                  v.onloadeddata = () => { 
                      setBgUpdateTrigger((p: any) => p+1); 
                      if (userChromaSettings.mode === 'auto') {
                          const autoColor = autoDetectBgColor(v);
                          setUserChromaSettings((prev: any) => ({...prev, chromaType: 'custom', chromaColor: autoColor}));
                      }
                  };
                  v.onerror = async () => {
                      if (!(v as any).proxyAttempted && url.startsWith('http') && !url.startsWith('blob:')) {
                          (v as any).proxyAttempted = true;
                          try {
                             const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
                              v.src = proxyUrl;
                              v.load();
                              v.play().catch((e: any)=>console.log(e));
                          } catch (err: any) {}
                      }
                  };
                  userExportVidRefs.current[type] = v;
              }
              if (userExportVidRefs.current[type].src !== url && userExportVidRefs.current[type].src !== `/api/proxy?url=${encodeURIComponent(url)}`) {
                  userExportVidRefs.current[type].proxyAttempted = false;
                  userExportVidRefs.current[type].src = url;
                  userExportVidRefs.current[type].play().catch((e: any) => console.log("User Export Vid:", e));
              }
          } else if (userExportVidRefs.current[type]) {
              userExportVidRefs.current[type].pause();
              userExportVidRefs.current[type] = null;
          }
      });
  }, [userCustomVideos, userChromaSettings.mode]);

  // Tự động xử lý tách nền cho ảnh thật của Lão
  useEffect(() => {
      let isMounted = true;
      const processLaoImages = async () => {
          if (laoChromaSettings.chromaType === 'none') {
              setProcessedLaoImages(laoCustomImages);
              return;
          }
          const result: any = { closed: null, half: null, open: null };
          for (const key of ['closed', 'half', 'open']) {
              if ((laoCustomImages as any)[key]) {
                  try {
                      const img = await loadExternalImage((laoCustomImages as any)[key]);
                      if (!isMounted) return;
                      const canvas = applyChromaKey(img, laoChromaSettings.chromaType, laoChromaSettings.chromaColor, laoChromaSettings.tolerance);
                      result[key] = canvas.toDataURL('image/png');
                  } catch(e) { console.error("Lỗi Chroma Key ảnh Lão:", e); result[key] = (laoCustomImages as any)[key]; }
              }
          }
          if (isMounted) setProcessedLaoImages(result);
      };
      processLaoImages();
      return () => { isMounted = false; };
  }, [laoCustomImages, laoChromaSettings]);

  // Tự động xử lý tách nền cho ảnh thật của Người Hỏi
  useEffect(() => {
      let isMounted = true;
      const processUserImages = async () => {
          if (userChromaSettings.chromaType === 'none') {
              setProcessedUserImages(userCustomImages);
              return;
          }
          const result: any = { closed: null, half: null, open: null, bow: null };
          for (const key of ['closed', 'half', 'open', 'bow']) {
              if ((userCustomImages as any)[key]) {
                  try {
                      const img = await loadExternalImage((userCustomImages as any)[key]);
                      if (!isMounted) return;
                      const canvas = applyChromaKey(img, userChromaSettings.chromaType, userChromaSettings.chromaColor, userChromaSettings.tolerance);
                      result[key] = canvas.toDataURL('image/png');
                  } catch(e) { console.error("Lỗi Chroma Key ảnh User:", e); result[key] = (userCustomImages as any)[key]; }
              }
          }
          if (isMounted) setProcessedUserImages(result);
      };
      processUserImages();
      return () => { isMounted = false; };
  }, [userCustomImages, userChromaSettings]);

  // Tự động nhận diện & gán tóc khi mở cửa sổ Render Video
  useEffect(() => {
      if (showVideoExportModal) {
          const isOld = userAge >= 65;
          const defaultHairColor = isOld ? '#e2e8f0' : '#0f172a'; // Trắng bạc hoặc Đen tuyền
          const defaultHairStyle = userGender === 'Nam' ? 'short' : 'long';
          
          setUserAppearance((prev: any) => ({
              ...prev,
              hairColor: defaultHairColor,
              hairStyle: defaultHairStyle
          }));
      }
  }, [showVideoExportModal, userAge, userGender]);

  const [charOffsets, setCharOffsets] = useState({
     lao: { x: 5, y: -15, s: 0.85, flip: false },
     user: { x: 6, y: -5, s: 1.15, flip: false }
  });

  const EMOTIONS = { calm: '😐 Bình thường', sad: '😢 Buồn/Bế tắc', joy: '😊 Vui/Hạnh phúc', hook: '🔥 Mào đầu (Hook)' };

  // --- STATES & REFS FOR GLOBAL PLAY (PHÁT TOÀN BỘ ĐÀM ĐẠO) ---
  const [isGlobalPlaying, setIsGlobalPlaying] = useState(false);
  const [isPreparingGlobal, setIsPreparingGlobal] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [globalCurrentTime, setGlobalCurrentTime] = useState(0);
  const [globalDuration, setGlobalDuration] = useState(0);

  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingQueueRef = useRef<any>(false);
  const globalAudioRef = useRef<any>(null);
  const audioQueueRef = useRef<any[]>([]);
  const latestAutoPlayaiMsgIdRef = useRef<any>(null);
  const animationFrameRef = useRef<any>(null);
  const globalAudioUrlRef = useRef<any>(null);
  const globalMessageCountRef = useRef<any>(0);
  const globalAudioMetadataRef = useRef<any[]>([]);

  // --- REFS FOR VIDEO RENDER AND FRAME PRELOAD ---
  const exportCanvasRef = useRef<any>(null);
  const exportMediaRecorderRef = useRef<any>(null);
  const exportAudioCtxRef = useRef<any>(null);
  const exportAnimFrameRef = useRef<any>(null);
  const preloadedLaoFrames = useRef<any>({});
  const preloadedUserFrames = useRef<any>({});
  const preloadedBowFrames = useRef<any>({});
  const preloadedBgImgRef = useRef<any>(null);
  const spellCheckControllersRef = useRef<any>({});
  const spellCheckTimeoutsRef = useRef<any>({});

  // --- STATE VÀ REF CHO BGM & LOGO ---
  const [bgmAudioData, setBgmAudioData] = useState<any>(() => {
      const defaultTrack = DEFAULT_BGM_LIST.find(m => m.id === 'bgm_dha');
      return defaultTrack ? { url: defaultTrack.url, name: defaultTrack.name, isPreset: true } : null;
  });
  const [tempAiBgmData, setTempAiBgmData] = useState<any>(null); 
  const [bgmVolume, setBgmVolume] = useState(0.15);
  const bgmFileInputRef = useRef<any>(null);
  const [aiBgmPrompt, setAiBgmPrompt] = useState('');
  const [isGeneratingBgm, setIsGeneratingBgm] = useState(false);

  const [logoData, setLogoData] = useState<string | null>(null);
  const [logoSettings, setLogoSettings] = useState({
     chromaType: 'black', chromaColor: '#000000', tolerance: 45, smoothness: 35
  });
  const logoFileInputRef = useRef<any>(null);
  const logoImgRef = useRef<any>(null);
  const processedLogoRef = useRef<any>(null);

  // --- STATE KHO BỐI CẢNH ĐỊNH VỊ SẴN (PRESETS) ---
  const INITIAL_PRESETS: any[] = [];

const [presetBackgrounds, setPresetBackgrounds] = useState<any[]>(INITIAL_PRESETS);

  // --- COMPONENT THUMBNAIL TỐI ƯU CHO KHO NHÂN VẬT (SIÊU NHẸ) ---
  // Hiển thị ảnh tĩnh thay vì load video động để chống giật lag cho hệ thống
  const OptimizedThumb = ({ src }: { src: any }) => {
      const [url, setUrl] = useState('');
      const [isVideo, setIsVideo] = useState(false);

      useEffect(() => {
          let objUrl: any = null;
          if (src && src.startsWith('idb://')) {
              idb.get(src.replace('idb://', '')).then((blob: any) => { 
                  if (blob) {
                      objUrl = URL.createObjectURL(blob);
                      setUrl(objUrl); 
                      // Nhận diện nếu file tải lên từ máy là Video
                      if (blob.type.startsWith('video/')) setIsVideo(true);
                  }
              });
          } else {
              setUrl(src);
              // Nhận diện link video thông thường
              if (src && src.match(/\.(mp4|webm|ogg)$/i)) setIsVideo(true);
          }
          return () => { if (objUrl) URL.revokeObjectURL(objUrl); }
      }, [src]);

      if (!url) return <div className="w-full h-full bg-slate-900"></div>;

      if (isVideo) {
          // Chỉ load khung hình đầu (metadata), KHÔNG autoplay, KHÔNG loop để tiết kiệm CPU/RAM
          return <video src={url} className="w-full h-full object-cover opacity-80" preload="metadata" muted playsInline />;
      }
      
      // Mặc định render Ảnh Thumbnail tĩnh (Siêu nhẹ)
  return <img src={url} alt="thumbnail" className="w-full h-full object-cover opacity-80" onError={(e: any) => { if (e.currentTarget) e.currentTarget.style.display='none'; }}/>;
  };

  // --- HÀM TỰ ĐỘNG PHÂN TÍCH HƯỚNG NHÌN ---
  const calculateAutoFlip = (laoOffsetX: any, userOffsetX: any, laoPresetId: any, userPresetId: any) => {
      // Mặc định: Lão ở tọa độ gốc là 65% (bên phải), User ở 35% (bên trái)
      const laoRealX = 65 + laoOffsetX;
      const userRealX = 35 + userOffsetX;
      const laoIsOnRight = laoRealX > userRealX;

      const laoChar = allCharacters.find(c => c.id === laoPresetId);
      const userChar = allCharacters.find(c => c.id === userPresetId);

      // Lấy hướng nhìn tự nhiên của nhân vật (gốc chưa lật)
      const laoNatural = laoChar?.naturalFacing || 'left';
      const userNatural = userChar?.naturalFacing || 'right';

      // Tính toán cần lật hay không để 2 người luôn nhìn về phía nhau
      return {
          laoFlip: laoIsOnRight ? (laoNatural !== 'left') : (laoNatural !== 'right'),
          userFlip: laoIsOnRight ? (userNatural !== 'right') : (userNatural !== 'left')
      };
  };

// HÀM CHUYỂN ĐỔI LÃO CHO KHUNG CHAT
  const handleChangeChatLao = async (charId: any) => {
      const preset: any = allCharacters.find((c: any) => c.id === charId);
      if (!preset) return;

      const resolvedAssets: any = {};
      for (const [key, val] of Object.entries((preset as any).assets)) {
          if (val && typeof val === 'string' && val.startsWith('idb://')) {
              const idbKey = val.replace('idb://', '');
              const blob = await idb.get(idbKey);
              if (blob) resolvedAssets[key] = URL.createObjectURL(blob);
              else resolvedAssets[key] = null;
          } else {
              resolvedAssets[key] = val;
          }
      }

      setCurrentLaoPresetId(charId);
      setLaoVisualType(preset.visualType);
      if (preset.visualType === 'video') {
          setChatLaoVideos({ idle: resolvedAssets.idle || null, talking: resolvedAssets.talking || null });
      } else if (preset.visualType === 'image') {
          setProcessedLaoImages({ closed: resolvedAssets.closed || null, half: resolvedAssets.half || null, open: resolvedAssets.open || null });
      } else if (preset.visualType === 'svg') {
          setLaoAppearance(preset.svgAppearance);
      }
      if (preset.chromaSettings) setLaoChromaSettings(preset.chromaSettings);
      
      // TÂM AN FIX: Tự động áp dụng tỉ lệ thu phóng mặc định (VD: Lão Chat = 1.8) cho màn hình Chat
      setChatLaoTransform((prev: any) => ({
          s: preset.recommendedScale || 1.8,
          x: preset.recommendedX !== undefined ? preset.recommendedX : -4,
          y: preset.recommendedY !== undefined ? preset.recommendedY : 164
      }));
      
      showToastMsg(`Đã thỉnh ${preset.name} vào khung đàm đạo`, 'success', 3000);
  };
  // Hàm áp dụng Nhân vật từ Kho vào thực tế
  const applyCharacterPreset = async (preset: any, targetRole: any, silent: any = false, overrideOtherId: any = null) => {
      if (!silent) showToastMsg(`Đang thiết lập nhân vật "${preset.name}"...`, 'loading', 0);
      const resolvedAssets: any = {};
      
      try {
          // Giải nén các file từ IndexedDB thành Blob URL nếu là nhân vật lưu cục bộ
          for (const [key, val] of Object.entries(preset.assets)) {
              if (val && typeof val === 'string' && val.startsWith('idb://')) {
                  const idbKey = val.replace('idb://', '');
                  const blob = await idb.get(idbKey);
                  if (blob) {
                      resolvedAssets[key] = URL.createObjectURL(blob);
                  } else {
                      resolvedAssets[key] = null;
                  }
              } else {
                  resolvedAssets[key] = val;
              }
          }

          const nextLaoId = targetRole === 'lao' ? preset.id : (overrideOtherId || currentLaoPresetId);
          const nextUserId = targetRole === 'user' ? preset.id : (overrideOtherId || currentUserPresetId);

          if (targetRole === 'lao') {
              setCurrentLaoPresetId(preset.id);
              setLaoVisualType(preset.visualType);
              if (preset.visualType === 'video') {
                  setLaoCustomVideos({ idle: resolvedAssets.idle || null, talking: resolvedAssets.talking || null });
                  // Đã xóa setChatLaoVideos ở đây để giữ nhân vật Lão Thẳng mặc định trên giao diện Chat
              }
              if (preset.visualType === 'image') setLaoCustomImages({ closed: resolvedAssets.closed || null, half: resolvedAssets.half || null, open: resolvedAssets.open || null });
              if (preset.visualType === 'svg') setLaoAppearance(preset.svgAppearance);
              if (preset.chromaSettings) setLaoChromaSettings(preset.chromaSettings);
              
              setCharOffsets((prev: any) => { 
                  // Lấy state mới nhất để tính hướng, chống race condition
                  const { laoFlip, userFlip } = calculateAutoFlip(prev.lao.x, prev.user.x, nextLaoId, nextUserId);
                  return { 
                      ...prev, 
                      lao: { 
                          ...prev.lao, 
                          s: preset.recommendedScale || prev.lao.s, 
                          y: preset.recommendedY !== undefined ? preset.recommendedY : prev.lao.y,
                          x: preset.recommendedX !== undefined ? preset.recommendedX : prev.lao.x,
                          flip: laoFlip
                      },
                      user: {
                          ...prev.user,
                          flip: userFlip
                      }
                  };
              });
          } else {
              setCurrentUserPresetId(preset.id);
              setUserVisualType(preset.visualType);
              if (preset.visualType === 'video') setUserCustomVideos({ idle: resolvedAssets.idle || null, talking: resolvedAssets.talking || null, bowing: resolvedAssets.bowing || null });
              if (preset.visualType === 'image') setUserCustomImages({ closed: resolvedAssets.closed || null, half: resolvedAssets.half || null, open: resolvedAssets.open || null, bow: resolvedAssets.bow || null });
              if (preset.visualType === 'svg') setUserAppearance(preset.svgAppearance);
              if (preset.chromaSettings) setUserChromaSettings(preset.chromaSettings);
              
              if (preset.fullFramePacks && preset.fullFramePacks.length > 0) {
                  const isDoc = videoAspectRatioRef.current === '9x16';
                  const targetPack = preset.fullFramePacks.find((p: any) => p.aspect === (isDoc ? 'doc' : 'ngang')) || preset.fullFramePacks[0];
                  if (targetPack) {
                      setFfScenes(JSON.parse(JSON.stringify(targetPack.scenes)));
                  }
              }

              
              setCharOffsets((prev: any) => { 
                  // Lấy state mới nhất để tính hướng, chống race condition
                  const { laoFlip, userFlip } = calculateAutoFlip(prev.lao.x, prev.user.x, nextLaoId, nextUserId);
                  return { 
                      ...prev, 
                      user: { 
                          ...prev.user, 
                          s: preset.recommendedScale || prev.user.s, 
                          y: preset.recommendedY !== undefined ? preset.recommendedY : prev.user.y,
                          x: preset.recommendedX !== undefined ? preset.recommendedX : prev.user.x,
                          flip: userFlip
                      },
                      lao: {
                          ...prev.lao,
                          flip: laoFlip
                      }
                  };
              });
          }
          if (!silent) showToastMsg(`Đã áp dụng nhân vật "${preset.name}".`, 'success');
      } catch (err: any) {
          console.error(err);
          if (!silent) showToastMsg('Có lỗi xảy ra khi trích xuất file từ bộ nhớ máy.', 'error');
      }
  };

  // LƯU CẤU HÌNH KÈM FILE GỐC VÀO TRÌNH DUYỆT CÁ NHÂN (VĨNH VI�??N)
  const handleSaveCharacterToLocal = (targetRole: any) => {
      // TÂM AN FIX: Thay thế window.prompt bị chặn bằng Modal Custom
      setSaveCharData({
          role: targetRole,
          name: `Nhân vật mới (${new Date().toLocaleTimeString()})`,
          age: 25,
          gender: 'Nữ'
      });
      setShowSaveCharModal(true);
  };

  const executeSaveCharacter = async () => {
      const { role: targetRole, name, age, gender } = saveCharData;
      setShowSaveCharModal(false);

      const visualType = targetRole === 'lao' ? laoVisualType : userVisualType;
      const assets = targetRole === 'lao'
          ? (visualType === 'video' ? laoCustomVideos : laoCustomImages)
          : (visualType === 'video' ? userCustomVideos : userCustomImages);
      const chroma = targetRole === 'lao' ? laoChromaSettings : userChromaSettings;
      const svgApp = targetRole === 'lao' ? laoAppearance : userAppearance;

      const charId = `local_char_${Date.now()}`;
      const savedAssets: any = {};
      let thumbVal = '';

      showToastMsg('Đang lưu trữ dữ liệu khổng lồ vào ổ cứng trình duyệt...', 'loading', 0);

      try {
          for (const [key, url] of Object.entries(assets)) {
              if (url) {
                  // Nếu là file tải lên từ máy tính, hút trọn cục Blob lưu vào IndexedDB
                  if (url.startsWith('blob:') || url.startsWith('data:')) {
                      const blob = await fetch(url).then(r => r.blob());
                      const idbKey = `${charId}_${key}`;
                      await idb.set(idbKey, blob);
                      savedAssets[key] = `idb://${idbKey}`;
                  } else {
                      savedAssets[key] = url;
                  }
              }
          }

          thumbVal = visualType === 'video' ? (savedAssets.idle || '') : (visualType === 'image' ? (savedAssets.closed || '') : '');

          const newChar = {
              id: charId,
              name: name,
              thumb: thumbVal,
              visualType: visualType,
              assets: savedAssets,
              chromaSettings: chroma,
              svgAppearance: svgApp,
              isLocal: true, 
              role: targetRole, 
              age: Number(age),
              gender: gender,
              naturalFacing: targetRole === 'lao' ? 'left' : 'right'
          };

          const currentList = JSON.parse(localStorage.getItem('taman_local_chars') || '[]');
          currentList.push(newChar);
          localStorage.setItem('taman_local_chars', JSON.stringify(currentList));

          loadLocalCharacters();
          showToastMsg('Đã lưu nhân vật vĩnh viễn vào bộ nhớ trình duyệt của bạn!', 'success');
      } catch (err: any) {
          console.error(err);
          showToastMsg('Không đủ dung lượng hoặc trình duyệt từ chối lưu file.', 'error');
      }
  };

  const handleDeleteLocalChar = (charId: any, e: any) => {
      e.stopPropagation();
      setConfirmDialog({
          isOpen: true,
          message: 'Bạn có chắc chắn muốn xoá nhân vật cá nhân này khỏi hệ thống? Dữ liệu không thể khôi phục.',
          onConfirm: () => {
              const list = JSON.parse(localStorage.getItem('taman_local_chars') || '[]');
              const char = list.find((c: any) => c.id === charId);
              if (char) {
                  // Xoá tận gốc các file Blob trong cơ sở dữ liệu ngầm
                  Object.values((char as any).assets).forEach((val: any) => {
                      if (val && typeof val === 'string' && val.startsWith('idb://')) {
                          idb.remove(val.replace('idb://', ''));
                      }
                  });
              }
              const newList = list.filter((c: any) => c.id !== charId);
              localStorage.setItem('taman_local_chars', JSON.stringify(newList));
              loadLocalCharacters();
              showToastMsg('Đã xoá nhân vật.', 'info');
          }
      });
  };

  const openPresetModal = (preset: any = null) => {
      if (preset) {
          setPresetFormData({ id: preset.id, name: preset.name, category: preset.aspectCategory || 'ngang' });
          setShowPresetModal(true);
      } else {
          if (!activeBgId) {
              showToastMsg('Hãy chọn một lớp nền đang hiển thị để lưu làm Preset.', 'error');
              return;
          }
          setPresetFormData({
              id: null,
              name: `Bối cảnh ${presetBackgrounds.length + 1}`,
              category: getVideoCategory(videoAspectRatio)
          });
          setShowPresetModal(true);
      }
  };

  const handleConfirmPreset = () => {
      if (!presetFormData.name.trim()) return;

      if (presetFormData.id) {
          setPresetBackgrounds((prev: any) => prev.map((p: any) => 
              p.id === presetFormData.id 
                  ? { ...p, name: presetFormData.name, aspectCategory: presetFormData.category }
                  : p
          ));
          showToastMsg('Đã cập nhật thông tin bối cảnh.', 'success');
      } else {
          const activeBg = customBgs.find(b => b.id === activeBgId);
          if (!activeBg) return;

          const newPreset = {
              id: `preset_${Date.now()}`,
              name: presetFormData.name,
              thumb: activeBg.url,
              url: activeBg.url,
              type: activeBg.type,
              bgSettings: {
                  x: activeBg.x,
                  y: activeBg.y,
                  s: activeBg.s,
                  flip: activeBg.flip,
                  chromaType: activeBg.chromaType,
                  chromaColor: activeBg.chromaColor,
                  tolerance: activeBg.tolerance,
                  muted: activeBg.muted,
                  volume: activeBg.volume !== undefined ? activeBg.volume : 1,
                  loopMode: activeBg.loopMode
              },
              defaultOffsets: JSON.parse(JSON.stringify(charOffsets)),
              aspectCategory: presetFormData.category
          };
          setPresetBackgrounds((prev: any) => [...prev, newPreset]);
          showToastMsg('Đã lưu bối cảnh và vị trí nhân vật vào kho!', 'success');
      }
      setShowPresetModal(false);
  };

  const handleExportPresetsCode = () => {
      const codeString = `const INITIAL_PRESETS = [\n` + presetBackgrounds.map((p: any) => {
          return `  {
    id: '${p.id}',
    name: '${p.name}',
    thumb: '${p.thumb}',
    url: '${p.url}',
    type: '${p.type}',
    bgSettings: ${JSON.stringify(p.bgSettings)},
    defaultOffsets: ${JSON.stringify(p.defaultOffsets)},
    aspectCategory: '${p.aspectCategory || 'ngang'}'
  }`;
      }).join(',\n') + `\n];`;
      
      copyToClipboard(codeString);
      showToastMsg('Đã sao chép tọa độ thành công! Hãy dán (Ctrl+V) vào khung chat cho Tâm An nhé.', 'success', 6000);
  };

  const handleExportPoemDatabaseCode = () => {
      const cleanDb = poemDatabase.map((p: any) => ({
          id: p.id,
          title: p.title,
          stanzas: p.stanzas.map((s: any) => ({
              id: s.id,
              tags: s.tags,
              content: s.content,
              meaning: s.meaning || '',
              audioUrl: null,
              isSaved: false
          }))
      }));
      const codeString = `const POEM_DATABASE = ${JSON.stringify(cleanDb, null, 2)};`;
      
      copyToClipboard(codeString);
      showToastMsg('Đã sao chép toàn bộ mã nguồn Kho Kệ! Hãy dán (Ctrl+V) vào khung chat cho Tâm An nhé.', 'success', 6000);
  };

  const handleDeletePreset = (id: any, e: any) => {
      e.stopPropagation();
      const presetToRemove = presetBackgrounds.find((p: any) => p.id === id);
      
      // Dọn dẹp memory an toàn: Chỉ xóa blob nếu không còn Layer hay Preset nào khác xài chung
      if (presetToRemove && presetToRemove.url?.startsWith('blob:')) {
          const isUsedInLayers = customBgs.some((bg: any) => bg.url === presetToRemove.url);
          const isUsedInOtherPresets = presetBackgrounds.some((p: any) => p.id !== id && p.url === presetToRemove.url);
          if (!isUsedInLayers && !isUsedInOtherPresets) {
              URL.revokeObjectURL(presetToRemove.url);
          }
      }

      setPresetBackgrounds((prev: any) => prev.filter((p: any) => p.id !== id));
      showToastMsg('Đã xóa bối cảnh khỏi kho.', 'info');
  };

  // --- LỊCH SỬ HOÀN TÁC (UNDO/REDO) CHO VỊ TRÍ ---
  const [pastOffsets, setPastOffsets] = useState<any[]>([]);
  const [futureOffsets, setFutureOffsets] = useState<any[]>([]);

  const saveOffsetHistory = (newOffsets: any) => {
      setPastOffsets((prev: any) => [...prev, charOffsets]);
      setFutureOffsets([]);
      setCharOffsets(newOffsets);
  };

  const handleUndoPosition = () => {
      if (pastOffsets.length === 0) return;
      const previous = pastOffsets[pastOffsets.length - 1];
      const newPast = pastOffsets.slice(0, pastOffsets.length - 1);
      setFutureOffsets((prev: any) => [charOffsets, ...prev]);
      setPastOffsets(newPast);
      setCharOffsets(previous);
  };

  const handleRedoPosition = () => {
      if (futureOffsets.length === 0) return;
      const next = futureOffsets[0];
      const newFuture = futureOffsets.slice(1);
      setPastOffsets((prev: any) => [...prev, charOffsets]);
      setFutureOffsets(newFuture);
      setCharOffsets(next);
  };

  const handleApplyPresetBackground = (preset: any) => {
      // Đọc thông số background đã lưu (nếu preset cũ không có thì dùng mặc định)
      const bgProps = preset.bgSettings || {
          x: 0, y: 0, s: 1, flip: false,
          chromaType: 'none', chromaColor: '#000000', tolerance: 50,
          muted: true, loopMode: 'normal', volume: 1
      };
      
      if (bgProps.volume === undefined) bgProps.volume = 1;

      // Thêm bối cảnh vào danh sách Lớp nền
      const newBg = {
          id: Date.now(),
          type: preset.type,
          url: preset.url,
          visible: true,
          ...bgProps
      };
      
      // TÂM AN FIX: Thay thế toàn bộ mảng bằng Bối cảnh mới để xóa các bối cảnh cũ, chống đè lớp
      setCustomBgs([newBg]);
      setActiveBgId(newBg.id);

      // TÂM AN FIX TRỌNG ĐIỂM: Áp dụng nhân vật được ghim kèm với bối cảnh (Bao gồm cả Lão Xéo và Người hỏi)
      const targetLaoId = preset.defaultCharacters?.lao || currentLaoPresetId;
      const targetUserId = preset.defaultCharacters?.user || currentUserPresetId;

      if (preset.defaultCharacters) {
          if (preset.defaultCharacters.lao && currentLaoPresetId !== preset.defaultCharacters.lao) {
              const laoChar = allCharacters.find((c: any) => c.id === preset.defaultCharacters.lao);
              if (laoChar) applyCharacterPreset(laoChar, 'lao', true, targetUserId);
          }
          if (preset.defaultCharacters.user && currentUserPresetId !== preset.defaultCharacters.user) {
              const userChar = allCharacters.find((c: any) => c.id === preset.defaultCharacters.user);
              if (userChar) applyCharacterPreset(userChar, 'user', true, targetLaoId);
          }
      }

      // Cập nhật vị trí nhân vật (có lưu lịch sử Undo) an toàn bằng callback
      setCharOffsets((currentOffsets: any) => {
          const newOffsets = JSON.parse(JSON.stringify(preset.defaultOffsets));
          
          // Tính toán lật mặt dựa trên nhân vật mới được tải vào
          const { laoFlip, userFlip } = calculateAutoFlip(newOffsets.lao.x, newOffsets.user.x, targetLaoId, targetUserId);
          
          newOffsets.lao.flip = laoFlip;
          newOffsets.user.flip = userFlip;

          setPastOffsets((past: any) => [...past, currentOffsets]);
          setFutureOffsets([]);
          
          return newOffsets;
      });

      showToastMsg(`Đã áp dụng bối cảnh "${preset.name}" và định vị lại nhân vật.`, 'success');
  };

  // --- HỆ THỐNG BACKGROUND ĐA LỚP & CHROMA KEY ---
  const defaultBgId = Date.now();
  const [customBgs, setCustomBgs] = useState([{
      id: defaultBgId,
      type: 'video',
      url: '', // Tiếng Suối (Mặc định mới)
      visible: true,
      x: -2.9423597395947625,
      y: 9.811262162721688,
      s: 0.7,
      flip: false,
      chromaType: 'none',
      chromaColor: '#000000',
      tolerance: 50,
      muted: true, // Mặc định tắt tiếng trên UI lúc đang edit
      loopMode: 'normal',
      volume: 0.15
  }]);
  const [activeBgId, setActiveBgId] = useState<number | null>(defaultBgId);
  const [aiBgPrompt, setAiBgPrompt] = useState('');
  const [isGeneratingBg, setIsGeneratingBg] = useState(false);
  const bgFileInputRef = useRef<any>(null);
  const processedBgsRef = useRef<any>({}); // Cache các ảnh đã xử lý Chroma Key
  const bgVideoRefs = useRef<any>({}); // Quản lý Video Elements ẩn cho render và preview
  const [bgUpdateTrigger, setBgUpdateTrigger] = useState(0);

  const dragInfo = useRef<any>({ isDragging: false, target: null, bgId: null, startX: 0, startY: 0, initialX: 0, initialY: 0 });

  // --- Nhạc Nền (BGM)  // --- TÂM AN AUTO-PILOT (XƯỞNG PHIM TỰ ĐỘNG) HOOK ---
  const renderPromiseRef = useRef<any>(null);
  const startVideoExportRef = useRef<any>(null);

  useEffect(() => {
      startVideoExportRef.current = startVideoExport;
  });






  // --- TÂM AN LÕI MỚI: THUẬT TOÁN TÁCH CÂU VÀ TÍNH TỶ LỆ CHO PHỤ ĐỀ LIVESTREAM (BẢN CHỐNG GIẬT 100%) ---
  const buildLiveSubMeta = (rawText: any) => {
      if (!rawText) {
          liveSubtitlesMetaRef.current = null;
          currentLiveSubTextRef.current = '';
          const subEl = document.getElementById('live-subtitle-text');
          if (subEl) subEl.innerText = '';
          return;
      }

      const cleanFullText = rawText.replace(/\[.*?\]|\(.*?\)/g, '').trim();
      
      // TÂM AN FIX: Tách theo MỌI dấu câu (phẩy, chấm, hỏi, than, hai chấm...) theo yêu cầu để chia câu siêu ngắn
      const rawParts = cleanFullText.split(/([.,!?;:\n。，、？！：；]+)/);
      const sentences: any[] = [];
      let tempStr = "";

      for (let i = 0; i < rawParts.length; i++) {
          tempStr += rawParts[i];
          // Gom nội dung chữ và dấu câu đi kèm thành 1 khối
          if (i % 2 !== 0 || i === rawParts.length - 1) {
              let s = tempStr.trim();
              if (s) sentences.push(s);
              tempStr = "";
          }
      }

      // TÂM AN FIX: Hủy bỏ thuật toán gộp câu (Smart Grouping) để mỗi dấu câu là 1 màn hình phụ đề riêng biệt
      const mergedSentences = sentences;

      if (mergedSentences.length === 0) {
          liveSubtitlesMetaRef.current = null;
          return;
      }

      // 3. Tính toán Tỷ lệ xuất hiện (Percentage Mapping) trên tổng thời gian của file Audio
      const totalChars = mergedSentences.reduce((sum: number, s: any) => sum + s.length, 0);
      let currentStartPct = 0;
      
      const meta = mergedSentences.map((s: any) => {
          const pctLen = s.length / Math.max(totalChars, 1);
          const endPct = currentStartPct + pctLen;
          const item = { text: s, startPct: currentStartPct, endPct: endPct };
          currentStartPct = endPct;
          return item;
      });
      
      liveSubtitlesMetaRef.current = meta;
      currentLiveSubTextRef.current = meta[0].text;
      
      // Đẩy thẳng ra màn hình ngay lập tức để không bị delay do React
      const subEl = document.getElementById('live-subtitle-text');
      if (subEl) subEl.innerText = meta[0].text;
  };

  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);



  // Quản lý Video Background Elements ẩn
  useEffect(() => {
    const currentIds = customBgs.map((b: any) => b.id);
    
    // Dọn dẹp video đã xóa
    Object.keys(bgVideoRefs.current).forEach((id: any) => {
        if (!currentIds.includes(Number(id))) {
            const vObj = bgVideoRefs.current[id];
            if (vObj) {
                // TÂM AN FIX V6: Xoá trọn bộ cả 2 bản sao video
                if (vObj.elementA) { vObj.elementA.pause(); vObj.elementA.removeAttribute('src'); vObj.elementA.load(); }
                if (vObj.elementB) { vObj.elementB.pause(); vObj.elementB.removeAttribute('src'); vObj.elementB.load(); }
            }
            delete bgVideoRefs.current[id];
        }
    });

    customBgs.forEach(bg => {
        if (bg.type === 'video') {
            if (!bgVideoRefs.current[bg.id]) {
                // TÂM AN FIX V6: Hàm tạo Video nguyên mẫu cho chiến thuật Double Buffering
                const createBgVideo = () => {
                    const v = document.createElement('video');
                    v.src = bg.url;
                    v.muted = true; // Mặc định tắt tiếng ở DOM
                    v.loop = false; // TẮT VÒNG LẶP NATIVE - Ta sẽ xử lý vòng lặp đè (crossfade) bằng JS
                    v.playsInline = true;
                    v.crossOrigin = "anonymous";
                    return v;
                };

                const vA = createBgVideo();
                const vB = createBgVideo();

                const onMetaLoaded = (v: any) => {
                    if (bgVideoRefs.current[bg.id]) {
                        bgVideoRefs.current[bg.id].isLoaded = true;
                        bgVideoRefs.current[bg.id].duration = v.duration;
                        bgVideoRefs.current[bg.id].videoWidth = v.videoWidth;
                        bgVideoRefs.current[bg.id].videoHeight = v.videoHeight;
                        setBgUpdateTrigger((prev: number) => prev + 1); // Kích hoạt render lại preview
                    }
                };

                vA.onloadedmetadata = () => onMetaLoaded(vA);
                vB.onloadedmetadata = () => onMetaLoaded(vB);

                // --- BẮT ĐẦU VÁ LỖI GOOGLE DRIVE ---
                const attachProxyHandler = (v: any, isPrimary: boolean) => {
                    let proxyAttempted = false;
                    v.onerror = async () => {
                        if (!proxyAttempted && bg.url.startsWith('http') && !bg.url.startsWith('blob:')) {
                            proxyAttempted = true;
                            if (isPrimary) showToastMsg('Đang tải video qua proxy...', 'loading', 8000);
                            try {
                                 const proxyUrl = `/api/proxy?url=${encodeURIComponent(bg.url)}`;
                                 const res = await fetch(proxyUrl);
                                 if (!res.ok) {
                                     console.warn("Proxy video error:", res.status, res.statusText);
                                     if (res.status === 403) {
                                         if (isPrimary) showToastMsg('File Google Drive chưa công khai. Vào Drive → Chia sẻ → "Bất kỳ ai có link" rồi thử lại.', 'error', 10000);
                                     } else {
                                         if (isPrimary) showToastMsg('Không tải được video. Hãy tải về máy rồi dùng nút [Tải Ảnh/Video].', 'error', 8000);
                                     }
                                     return;
                                 }
                                 const blob = await res.blob();
                                 v.src = URL.createObjectURL(blob);
                                 v.load();
                                 if (isPrimary && v === bgVideoRefs.current[bg.id]?.elementA) v.play().catch((e: any)=>console.log(e));
                                 if (isPrimary) showToastMsg('✅ Kết nối video thành công!', 'success');
                             } catch (err: any) {
                                console.error("Proxy fetch failed:", err);
                                if (isPrimary) showToastMsg('Không tải được video. Hãy tải về máy rồi dùng nút [Tải Ảnh/Video].', 'error', 8000);
                            }
                        }
                    };
                };
                attachProxyHandler(vA, true);
                attachProxyHandler(vB, false);
                // --- KẾT THÚC VÁ LỖI GOOGLE DRIVE ---

                vA.play().catch((e: any) => console.log("Bg Video Autoplay Prevented", e));
                
                // Lưu cả 2 bản sao vào Refs. activeKey quyết định video nào đang làm chủ.
                bgVideoRefs.current[bg.id] = { 
                    elementA: vA, 
                    elementB: vB, 
                    activeKey: 'A', 
                    isLoaded: false, 
                    duration: 0 
                };
            }
            
            // Đồng bộ âm lượng và trạng thái tắt tiếng cho CẢ 2 BẢN SAO
            const vObj = bgVideoRefs.current[bg.id];
            if (vObj && vObj.elementA && vObj.elementB) {
                vObj.elementA.muted = true;
                vObj.elementA.volume = bg.volume !== undefined ? bg.volume : 1;
                vObj.elementB.muted = true;
                vObj.elementB.volume = bg.volume !== undefined ? bg.volume : 1;
            }
        }
    });
  }, [customBgs, isExportingVideo]);

  // Pre-process Image Backgrounds khi có thay đổi
  useEffect(() => {
    let isMounted = true;
    const processImages = async () => {
      // Xử lý Lớp Nền (Chỉ dành cho Ảnh, Video xử lý trực tiếp khi Render)
      for (const bg of customBgs) {
        if (bg.type === 'image' && (!processedBgsRef.current[bg.id] || processedBgsRef.current[bg.id].hash !== `${bg.url}_${bg.chromaType}_${bg.chromaColor}_${bg.tolerance}`)) {
          try {
             const img = await loadExternalImage(bg.url);
             if (!isMounted) return;
             const processedCanvas = applyChromaKey(img, bg.chromaType, bg.chromaColor, bg.tolerance);
             processedBgsRef.current[bg.id] = {
                element: processedCanvas,
                hash: `${bg.url}_${bg.chromaType}_${bg.chromaColor}_${bg.tolerance}`
             };
          } catch(e) { console.error("Không thể load Bg Ảnh", e); }
        }
      }
      
      // Xử lý Logo Chroma Key
      if (logoData) {
          try {
             if (!logoImgRef.current || logoImgRef.current.src !== logoData) {
                 logoImgRef.current = await loadExternalImage(logoData);
             }
             if (!isMounted) return;
             processedLogoRef.current = applyChromaKey(logoImgRef.current, logoSettings.chromaType, logoSettings.chromaColor, logoSettings.tolerance);
          } catch(e) { console.error("Không thể load Logo", e); }
      } else {
          processedLogoRef.current = null;
          logoImgRef.current = null;
      }

      if (isMounted) setBgUpdateTrigger((prev: any) => prev + 1);
    };
    processImages();
    return () => { isMounted = false; };
  }, [customBgs, logoData, logoSettings]);
  
  const [emotion, setEmotion] = useState('calm'); 
  const [mouthOpen, setMouthOpen] = useState(0); 
  const [mouthWidth, setMouthWidth] = useState(0); 
  const [browLift, setBrowLift] = useState(0); 
  const [eyeSquint, setEyeSquint] = useState(0); 

  const handleUploadBgm = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (bgmAudioData?.url && !bgmAudioData.isPreset) URL.revokeObjectURL(bgmAudioData.url);
      const url = URL.createObjectURL(file as any);
      setBgmAudioData({ file, url, name: file.name });
    }
  };

  const removeBgm = () => {
    if (bgmAudioData?.url && !bgmAudioData.isPreset) URL.revokeObjectURL(bgmAudioData.url);
    setBgmAudioData(null);
    if (bgmFileInputRef.current) (bgmFileInputRef.current as any).value = '';
  };

  const handleUploadLogo = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoData(null);
    if (logoImgRef.current) logoImgRef.current = null;
    if (logoFileInputRef.current) (logoFileInputRef.current as any).value = '';
  };

  // --- Nâng cấp Web Audio BGM Generator (30s) ---
  const handleGenerateAiBgm = async () => {
    if (!aiBgmPrompt.trim() || isGeneratingBgm) return;
    setIsGeneratingBgm(true);

    await new Promise(resolve => setTimeout(resolve, 500)); // UI delay

    try {
      const AudioContextClass = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
      const sampleRate = 44100;
      const duration = 30; // Nâng lên 30 giây
      const offlineCtx = new AudioContextClass(2, sampleRate * duration, sampleRate);

      const isWater = aiBgmPrompt.toLowerCase().includes('nước') || aiBgmPrompt.toLowerCase().includes('mưa');
      const isWind = aiBgmPrompt.toLowerCase().includes('gió');
      const isBell = aiBgmPrompt.toLowerCase().includes('chuông');

      // 1. Meditation Drone (Base)
      const osc1 = offlineCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 136.1; // Tần số Om
      
      const osc2 = offlineCtx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = 139.1;

      const osc3 = offlineCtx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.value = 68.05; // Sub bass

      const droneGain = offlineCtx.createGain();
      droneGain.gain.value = 0.15;

      const lfo = offlineCtx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05; 
      const lfoGain = offlineCtx.createGain();
      lfoGain.gain.value = 0.1;
      lfo.connect(lfoGain);
      lfoGain.connect(droneGain.gain);

      const filter = offlineCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(offlineCtx.destination);

      osc1.start(); osc2.start(); osc3.start(); lfo.start();

      // 2. Tự động mix thêm âm thanh dựa vào Prompt
      if (isWater || isWind) {
        const bufferSize = sampleRate * duration;
        const noiseBuffer = offlineCtx.createBuffer(1, bufferSize, sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = offlineCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        
        const noiseFilter = offlineCtx.createBiquadFilter();
        noiseFilter.type = isWind ? 'bandpass' : 'lowpass';
        noiseFilter.frequency.value = isWind ? 400 : 800;
        
        const noiseGain = offlineCtx.createGain();
        noiseGain.gain.value = isWind ? 0.05 : 0.03;

        // Nếu là gió, thêm LFO vào filter frequency để tạo tiếng gió thổi vù vù
        if (isWind) {
            const windLfo = offlineCtx.createOscillator();
            windLfo.type = 'sine';
            windLfo.frequency.value = 0.2;
            const windLfoGain = offlineCtx.createGain();
            windLfoGain.gain.value = 300;
            windLfoGain.connect(noiseFilter.frequency);
            windLfo.start();
        }

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(offlineCtx.destination);
        whiteNoise.start();
      }

      if (isBell || !isWater && !isWind) { // Random bell nếu không có từ khóa đặc biệt
          const strikeBell = (time: number) => {
             const bellOsc = offlineCtx.createOscillator();
             bellOsc.type = 'sine';
             bellOsc.frequency.setValueAtTime(440, time);
             
             const bellGain = offlineCtx.createGain();
             bellGain.gain.setValueAtTime(0, time);
             bellGain.gain.linearRampToValueAtTime(0.3, time + 0.05);
             bellGain.gain.exponentialRampToValueAtTime(0.001, time + 6);

             bellOsc.connect(bellGain);
             bellGain.connect(offlineCtx.destination);
             bellOsc.start(time);
             bellOsc.stop(time + 6);
          };
          // Gõ chuông ngẫu nhiên vài lần trong 30s
          strikeBell(2);
          strikeBell(14);
          strikeBell(25);
      }

      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = audioBufferToWav(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);

      if (tempAiBgmData?.url) URL.revokeObjectURL(tempAiBgmData.url);
      setTempAiBgmData({ file: wavBlob, url, name: `Nhạc AI (${aiBgmPrompt.substring(0, 10)}...).wav` });
    } catch(e: any) {
      console.error("Lỗi tạo nhạc AI", e);
      showToastMsg('Trình duyệt không hỗ trợ tạo nhạc thời lượng dài.', 'error');
    } finally {
      setIsGeneratingBgm(false);
    }
  };

  const handleUploadBg = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const url = URL.createObjectURL(file as any);
      
      const newBg = {
          id: Date.now(),
          type: isVideo ? 'video' : 'image',
          url: url,
          x: 0, y: 0, s: 1, flip: false,
          chromaType: 'none', chromaColor: '#000000', tolerance: 50,
          visible: true,
          muted: isVideo ? false : true, // TÂM AN FIX: Bật âm thanh mặc định cho Video tải lên
          volume: isVideo ? 0.15 : 1, // TÂM AN FIX: Đặt âm lượng 15% mặc định
          loopMode: 'normal' 
      };
      setCustomBgs((prev: any) => [...prev, newBg]);
      setActiveBgId(newBg.id);
    }
    e.target.value = '';
  };

  const handleUpdateBg = (id: any, field: any, value: any) => {
      setCustomBgs((prev: any) => prev.map((bg: any) => bg.id === id ? { ...bg, [field]: value } : bg));
  };

  const handleDeleteCustomBg = (id: any, e: any) => {
      e.stopPropagation();
      const bgToRemove = customBgs.find(b => b.id === id);
      
      // Dọn dẹp memory an toàn: Chỉ xóa blob nếu Preset không xài và không có layer khác copy chung
      if (bgToRemove && bgToRemove.url?.startsWith('blob:')) {
          const isUsedInPresets = presetBackgrounds.some(p => p.url === bgToRemove.url);
          const isUsedInOtherLayers = customBgs.some(bg => bg.id !== id && bg.url === bgToRemove.url);
          
          if (!isUsedInPresets && !isUsedInOtherLayers) {
              URL.revokeObjectURL(bgToRemove.url);
          }
      }
      
      setCustomBgs((prev: any) => prev.filter((bg: any) => bg.id !== id));
      if (activeBgId === id) setActiveBgId(null);
      delete processedBgsRef.current[id];
  };

  const handleGenerateAiBg = async () => {
    if (!aiBgPrompt.trim() || isGeneratingBg) return;
    setIsGeneratingBg(true);
    try {
      const fullPrompt = `Cảnh nền thiền định tĩnh lặng, phong cách nghệ thuật tâm linh, ${aiBgPrompt.trim()}, chất lượng siêu nét, phong cảnh mờ ảo, không có người`;
      const data = await fetchWithRetry(`/api/imagen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt
        })
      });
      if (data?.predictions?.[0]?.bytesBase64Encoded) {
        const url = `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
        const newBg = {
            id: Date.now(),
            type: 'image',
            url: url,
            x: 0, y: 0, s: 1, flip: false,
            chromaType: 'none', chromaColor: '#000000', tolerance: 50,
            visible: true,
            muted: true,
            volume: 1,
            loopMode: 'normal'
        };
        setCustomBgs((prev: any) => [...prev, newBg]);
        setActiveBgId(newBg.id);
        setAiBgPrompt('');
      } else {
        showToastMsg('AI không trả về kết quả ảnh. Xin thử lại.', 'error');
      }
    } catch (e: any) {
      console.error("Lỗi tạo nền AI", e);
      showToastMsg('Không thể kết nối để tạo ảnh AI lúc này.', 'error');
    } finally {
      setIsGeneratingBg(false);
    }
  };

  // showToastMsg is passed in props

  const handleCreateSession = async () => {
    const title = `Cuộc đàm đạo ${sessions.length + 1}`;
    const res = await createChatSessionAction(undefined, title);
    if (res.success && res.data) {
      const newSession = {
        id: res.data.id,
        title: res.data.title,
        isPinned: false,
        messages: [],
        messagesLoaded: true
      };
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(res.data.id);
    }
  };

  // --- Hàm bổ trợ lưu phiên đàm đạo và tin nhắn kịch bản vào PostgreSQL ---
  const saveNewSessionWithMessages = async (title: string, messages: any[], createdAt?: Date) => {
      const userId = currentUser?.id || null;
      try {
          const res = await createChatSessionAction(userId, title, "script", createdAt);
          if (res.success && res.data) {
              const newSessionId = res.data.id;
              const savedMessages: any[] = [];
              for (const msg of messages) {
                  const saveRes = await saveChatMessageAction(
                      newSessionId,
                      msg.role === 'ai' ? 'ASSISTANT' : (msg.role === 'outro' ? 'OUTRO' : 'USER'),
                      msg.text,
                      msg.audioUrl,
                      null,
                      msg.id.toString(),
                      msg.emotion
                  );
                  if (saveRes.success && saveRes.data) {
                      savedMessages.push({
                          ...msg,
                          sessionId: newSessionId
                      });
                  } else {
                      savedMessages.push(msg);
                  }
              }
              const newSession = {
                  id: newSessionId,
                  title: title,
                  isPinned: false,
                  messages: savedMessages,
                  messagesLoaded: true,
                  type: 'script',
                  createdAt: createdAt || new Date()
              };
              setSessions((prev: any) => [newSession, ...prev]);
              setCurrentSessionId(newSessionId);
              return newSessionId;
          }
      } catch (err) {
          console.error("Lỗi khi lưu kịch bản vào cơ sở dữ liệu:", err);
      }
      return null;
  };

  // --- Parse Kịch Bản Thủ Công ---
  const handleImportScript = async () => {
      if (!scriptText.trim()) return;
      const lines = scriptText.split('\n');
      const newMsgs: any[] = [];
      let currentRole = 'ai';

      lines.forEach(line => {
         const text = line.trim();
         if (!text) return;

         let role = null;
         let cleanText = text;

         if (/^(con|người hỏi|hỏi)(?:\s*\[.*?\]|\s*\(.*?\))?\s*:/i.test(text)) {
            role = 'user';
            cleanText = text.replace(/^(con|người hỏi|hỏi)(?:\s*\[.*?\]|\s*\(.*?\))?\s*:\s*/i, '').trim();
            currentRole = 'user';
         } else if (/^(lão|đáp|ai)(?:\s*\[.*?\]|\s*\(.*?\))?\s*:/i.test(text)) {
            role = 'ai';
            cleanText = text.replace(/^(lão|đáp|ai)(?:\s*\[.*?\]|\s*\(.*?\))?\s*:\s*/i, '').trim();
            currentRole = 'ai';
         } else {
            role = currentRole;
            cleanText = text;
         }

         if (role && cleanText) {
             if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === role) {
                 newMsgs[newMsgs.length - 1].text += '\n' + cleanText;
             } else {
                 newMsgs.push({
                     id: Date.now() + Math.random(),
                     role,
                     text: cleanText,
                     timestamp: new Date(),
                     audioUrl: null,
                     reactions: {}
                 });
             }
         }
      });

      if (newMsgs.length > 0) {
          if (importMode === 'append') {
              const targetSessionId = currentSessionIdRef.current;
              if (targetSessionId) {
                  updateCurrentMessages((prev: any) => [...prev, ...newMsgs]);
                  for (const msg of newMsgs) {
                      await saveChatMessageAction(
                          targetSessionId,
                          msg.role === 'ai' ? 'ASSISTANT' : 'USER',
                          msg.text,
                          null,
                          null,
                          msg.id.toString()
                      );
                  }
                  showToastMsg('Đã nhập kịch bản và nối tiếp thành công!', 'success', 5000);
              } else {
                  showToastMsg('Vui lòng chọn hoặc tạo hội thoại trước khi nối tiếp.', 'error');
              }
          } else {
              const title = `Kịch bản ${new Date().toLocaleTimeString().slice(0, 5)}`;
              await saveNewSessionWithMessages(title, newMsgs);
              showToastMsg('Đã lưu kịch bản mới vào dữ liệu!', 'success', 5000);
          }
          setShowScriptModal(false);
          setScriptText('');
          setTimeout(() => setShowHistory(true), 500);
      }
  };

  // --- Tạo Kịch Bản Tự Động Bằng AI Theo Chủ Đề ---
  // Nhận optional overrides để AiDirectorModal truyền giá trị local-state trực tiếp
  // (tránh stale closure khi local state chưa sync lên parent)
  const handleGenerateAITopic = async (overrides?: {
      topic?: string; laoName?: string; laoSelf?: string; laoCallU?: string;
      userName?: string; userSelf?: string; userCallL?: string;
  }) => {
      const _topic    = overrides?.topic    ?? aiTopicText;
      const _laoName  = overrides?.laoName  ?? customLaoName;
      const _laoSelf  = overrides?.laoSelf  ?? laoSelfCall;
      const _laoCallU = overrides?.laoCallU ?? laoCallUser;
      const _userName = overrides?.userName ?? customUserName;
      const _userSelf = overrides?.userSelf ?? userSelfCall;
      const _userCallL = overrides?.userCallL ?? userCallLao;
      if (!_topic.trim()) return;
      setIsGeneratingAITopic(true);
      try {
        // TÂM AN FIX: Ép AI xuống dòng từng câu kệ
        const quoteRule = (appLanguage === 'Tiếng Việt' || appLanguage === 'vi') 
            ? '- Tắt hoàn toàn chức năng tự làm thơ. Chọn đúng 4 câu kệ (không kèm ngày tháng) phù hợp nhất từ kho dữ liệu. Giữ nguyên văn. BẮT BUỘC: Mỗi câu kệ phải nằm trên một dòng riêng biệt (Enter xuống dòng). Trước khi trích dẫn, bắt buộc nói: "Sư Cha Tam Vô đã khai thị như sau:".'
            : `- Tắt hoàn toàn chức năng tự làm thơ. Chọn đúng 4 câu kệ (không kèm ngày tháng) phù hợp nhất từ kho. BẮT BUỘC DỊCH 4 câu kệ đó sang ${appLanguage}. MANDATORY: Each line of the poem MUST be separated by a new line (Enter). Trước khi trích dẫn, nói câu (bằng ${appLanguage}) có nghĩa là: "Sư Cha Tam Vô đã khai thị như sau:".`;

        // TÂM AN FIX: Ép buộc độ dài kịch bản tuyệt đối cho Đạo diễn AI
        const lengthInstruction = `
        YÊU CẦU ÉP BUỘC VỀ SỐ LƯỢNG LƯỢT THOẠI (RẤT QUAN TRỌNG):
        - Kịch bản BẮT BUỘC phải kéo dài ${aiScriptLength} (Mỗi lần một người cất tiếng nói được tính là 1 câu/lượt).
        - Nếu yêu cầu kịch bản dài (10-21 câu), bạn PHẢI để nhân vật Người hỏi phản biện, thắc mắc, vòng vo nhiều lần, Minh Sư giải thích từ từ, đào sâu từng lớp vấn đề.
        - TUYỆT ĐỐI KHÔNG cho nhân vật ngộ đạo quá nhanh ở câu thứ 3 hay thứ 4. Phải duy trì cuộc trò chuyện hỏi - đáp liên tục đạt đúng số lượng câu đã yêu cầu mới được kết thúc. Bắt buộc đếm số lượt thoại trước khi trả về kết quả!`;

        const prompt = `Viết một kịch bản đàm đạo tâm linh sâu sắc giữa hai nhân vật.
        
        NGÔN NGỮ KỊCH BẢN BẮT BUỘC: ${appLanguage === 'vi' || appLanguage === 'Tiếng Việt' ? 'Tiếng Việt' : 'English'}

        THÔNG TIN VÀ QUY TẮC XƯNG HÔ (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT 100%):
        
        1. Nhân vật Minh Sư (Người đáp):
        - Tên hiển thị kịch bản: ${_laoName || 'Lão'}
        - Phong cách lời dạy: ${aiLaoStyle}
        - Khi nói chuyện, bắt buộc tự xưng mình là: "${_laoSelf}"
        - Khi gọi/nhắc đến đối phương, bắt buộc dùng từ: "${_laoCallU}"

        2. Nhân vật Phàm Trần (Người hỏi):
        - Tên hiển thị kịch bản: ${_userName || 'Con'} (Giới tính: ${userGender}, ${userAge} tuổi)
        - Khi nói chuyện, bắt buộc tự xưng mình là: "${_userSelf}"
        - Khi gọi/nhắc đến Minh Sư, bắt buộc dùng từ: "${_userCallL}"

        LƯU Ý XƯNG HÔ: Tuyệt đối không xưng hô lộn xộn. Nếu quy định Người hỏi tự xưng "Em" gọi Minh sư "Anh", thì kịch bản phải ghi "Anh ơi, em đang buồn...". Nếu Minh sư xưng "Đu" gọi người hỏi "Hào", thì ghi "Hào ơi, Đu nói cho nghe...".

        - Chủ đề vướng mắc của Người hỏi: "${_topic}"
        ${lengthInstruction}

        QUY TẮC CỐT LÕI VỀ DIỄN BIẾN (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT):
        1. Mở đầu (Intro-Hook BẮT BUỘC): Lượt thoại ĐẦU TIÊN của kịch bản PHẢI LÀ CỦA LÃO. Đây là một câu mào đầu mang tính châm biếm, hài hước, mỉa mai nhẹ nhàng để đánh trúng tim đen và dẫn dắt người xem vào chủ đề. (Ví dụ chủ đề 'Cúng sao giải hạn' thì Lão nói: 'Mới nghe thầy bói hù vài câu, tính đem tiền đi cúng sao giải hạn hả? Vào đây, Lão giải các tâm cho bớt hạn hẹp đi nè!'). Bắt buộc dùng thẻ [hook] ngay sau tên Lão ở câu này.
        2. Mê lầm: Tiếp theo, ${_userName || 'Con'} mang theo nỗi khổ, vô minh, dính mắc vào mộng ảo của đời thường (Tuân theo quỹ đạo cảm xúc: ${aiUserEmotionArc}).
        3. Phá mê: ${_laoName || 'Lão'} dùng lời đốn giáo, chỉ ra sự giả tạm của mọi hiện tượng.
        4. Tỉnh mộng & Tìm cầu: ${_userName || 'Con'} hết mê, nhận ra thế gian là ảo ảnh. Bắt đầu thao thức tìm lại Bản lai diện mục.
        5. Khai ngộ & Hạnh phúc: ${_laoName || 'Lão'} chỉ thẳng vào chân tâm. ${_userName || 'Con'} bừng ngộ, cảm xúc vỡ òa.
        6. Tán thán & Khuyến tấn: Khi ${_userName || 'Con'} đã ngộ đạo, ${_laoName || 'Lão'} BẮT BUỘC phải nói "Lành thay, lành thay" (hoặc dịch ra ${appLanguage}). Sau đó, ${_laoName || 'Lão'} ĐẶT MỘT CÂU HỎI TỰ VẤN sâu sắc.

        Quy tắc định dạng văn bản:
        - Định dạng kịch bản trả về BẮT BUỘC phải bắt đầu bằng tiền tố "${_userName || 'Con'}:" và "${_laoName || 'Lão'}:" ở mỗi dòng.
        - CHÈN THẺ CẢM XÚC: Phân tích nội tâm nhân vật ở câu đó và chèn 1 trong 4 thẻ: [hook] (Châm biếm mào đầu - CHỈ DÙNG CHO CÂU ĐẦU CỦA LÃO), [calm] (Bình thường), [sad] (Buồn bã), [joy] (Vui vẻ) ngay sau tên. Ví dụ: "${_laoName || 'Lão'} [hook]: ..." BẮT BUỘC CÓ.
        - KHÔNG ĐƯỢC viết HOA toàn bộ từ. Thay dấu gạch chéo "/" bằng dấu phẩy ",".
        ${quoteRule}
        - Định dạng text trả về bắt buộc phải đúng form sau:
        ${_laoName || 'Lão'} [hook]: [Lời thoại mào đầu]
        ${_userName || 'Con'} [cảm_xúc]: [Lời thoại]
        ${_laoName || 'Lão'} [cảm_xúc]: [Lời thoại]
        
        KHO TÀNG KỆ CỦA SƯ CHA TAM VÔ:
        ${(() => {
          const topicWords = _topic.toLowerCase().split(/\s+/).filter(w => w.length > 2);
          let filtered = poemDatabase;
          if (topicWords.length > 0) {
            filtered = poemDatabase.filter((po: any) => {
              return topicWords.some(word => {
                const titleMatch = po.title.toLowerCase().includes(word);
                const stanzaMatch = po.stanzas.some((s: any) => 
                  s.content.toLowerCase().includes(word) || 
                  (s.meaning && s.meaning.toLowerCase().includes(word)) || 
                  (s.tags && s.tags.some((t: string) => t.toLowerCase().includes(word)))
                );
                return titleMatch || stanzaMatch;
              });
            });
          }
          if (filtered.length === 0) {
            filtered = poemDatabase.slice(0, 15);
          } else if (filtered.length > 20) {
            filtered = filtered.slice(0, 20);
          }
          return filtered.map((po: any) => `Tên bài: ${po.title}\n` + po.stanzas.map((s: any) => `Tags: ${s.tags.join(', ')}\nNội dung Kệ:\n${s.content}${s.meaning ? '\nÝ nghĩa diễn giải:\n' + s.meaning : ''}`).join('\n\n')).join('\n\n---\n\n');
        })()}`;


        const data = await fetchWithRetry(`/api/giacngo/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            aiConfigId: selectedAiConfigIdRef.current,
            message: prompt,
            language: (appLanguage === 'Tiếng Việt' || appLanguage === 'vi') ? 'vi' : 'en'
          })
        });

        const rawResult = data.message;
        if (!rawResult) throw new Error("AI không trả về kết quả");

        const lines = rawResult.split('\n');
        const newMsgs: any[] = [];
        let currentRole: any = null;
        let currentEmotion = 'calm';
        
        // TÂM AN FIX: Regex động dựa trên tên nhân vật tùy chỉnh
        const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const laoNameSafe = escapeRegExp(customLaoName || 'Lão');
        const userNameSafe = escapeRegExp(customUserName || 'Con');
        
        lines.forEach((line: string) => {
           let text = line.replace(/\*\*/g, '').trim(); // Xóa dấu in đậm nếu AI vô tình cho vào
           if (!text) return;
           
           let role = null;
           let cleanText = text;

           const matchUser = text.match(new RegExp(`^(${userNameSafe}|con|người hỏi|hỏi)(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:\\s*(.*)`, 'i'));
           const matchAi = text.match(new RegExp(`^(${laoNameSafe}|lão|đáp|ai)(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:\\s*(.*)`, 'i'));

           if (matchUser) {
              role = 'user';
              currentRole = 'user';
              currentEmotion = (matchUser[2] || matchUser[3] || 'calm').toLowerCase().trim();
              cleanText = matchUser[4].trim();
           } else if (matchAi) {
              role = 'ai';
              currentRole = 'ai';
              currentEmotion = (matchAi[2] || matchAi[3] || 'calm').toLowerCase().trim();
              cleanText = matchAi[4].trim();
           } else if (currentRole) {
              role = currentRole;
              cleanText = text;
           }

           if (!['calm', 'sad', 'joy', 'hook'].includes(currentEmotion)) currentEmotion = 'calm';

           if (role && cleanText) {
               // Ghộp thoại cùng nhân vật nhưng BẢO TOÀN XUỐNG DÒNG (\n)
               if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === role) {
                   newMsgs[newMsgs.length - 1].text += '\n' + cleanText;
               } else {
                   newMsgs.push({
                       id: Date.now() + Math.random(),
                       role,
                       text: cleanText,
                       emotion: currentEmotion,
                       timestamp: new Date(),
                       audioUrl: null,
                       reactions: {}
                   });
               }
           }
        });

        setGeneratedScriptText(rawResult);
        showToastMsg('Đã tạo kịch bản AI thành công! Hãy kiểm tra và chỉnh sửa bên dưới trước khi lưu.', 'success', 5000);

      } catch (e) {
        console.error("Lỗi tạo chủ đề AI:", e);
        showToastMsg('Mạch khí gián đoạn, không thể nhờ AI tạo kịch bản lúc này.', 'error');
      } finally {
        setIsGeneratingAITopic(false);
      }
  };

  const handleSaveGeneratedScript = async (overrides?: {
      scriptText?: string; laoName?: string; userName?: string;
  }) => {
      const _script   = overrides?.scriptText ?? generatedScriptText;
      const _laoName  = overrides?.laoName    ?? customLaoName;
      const _userName = overrides?.userName   ?? customUserName;
      if (!_script.trim()) return;
      
      try {
          const lines = _script.split('\n');
          const newMsgs: any[] = [];
          let currentRole: any = null;
          let currentEmotion = 'calm';
          
          const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const laoNameSafe = escapeRegExp(_laoName || 'Lão');
          const userNameSafe = escapeRegExp(_userName || 'Con');
          
          lines.forEach((line: string) => {
             let text = line.replace(/\*\*/g, '').trim();
             if (!text) return;
             
             let role = null;
             let cleanText = text;
  
             const matchUser = text.match(new RegExp(`^(${userNameSafe}|con|người hỏi|hỏi)(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:\\s*(.*)`, 'i'));
             const matchAi = text.match(new RegExp(`^(${laoNameSafe}|lão|đáp|ai)(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:\\s*(.*)`, 'i'));
  
             if (matchUser) {
                role = 'user';
                currentRole = 'user';
                currentEmotion = (matchUser[2] || matchUser[3] || 'calm').toLowerCase().trim();
                cleanText = matchUser[4].trim();
             } else if (matchAi) {
                role = 'ai';
                currentRole = 'ai';
                currentEmotion = (matchAi[2] || matchAi[3] || 'calm').toLowerCase().trim();
                cleanText = matchAi[4].trim();
             } else if (currentRole) {
                role = currentRole;
                cleanText = text;
             }
  
             if (role && cleanText) {
                 const isAi = role === 'ai';
                 const defaultStyle = isAi ? (laoVoiceStyle || '') : (userVoiceStyle || '');
                 
                 newMsgs.push({
                     id: Math.random().toString(36).substring(7),
                     role: isAi ? 'ai' : 'user',
                     text: cleanText,
                     emotion: currentEmotion,
                     voice: isAi ? (laoVoice || 'Algieba') : (userVoice || 'Aoede'),
                     voiceStyle: defaultStyle,
                     audioUrl: null,
                     reactions: {}
                 });
             }
          });
  
          if (newMsgs.length > 0) {
              const title = (aiScriptTitle && aiScriptTitle.trim()) || `CĐ: ${(_userName || 'Chủ đề').substring(0, 20)}...`;
              const createdDate = aiScriptDate ? new Date(aiScriptDate) : new Date();
              await saveNewSessionWithMessages(title, newMsgs, createdDate);
              
              setGeneratedScriptText('');
              setAiTopicText('');
              setShowAITopicModal(false);
              showToastMsg('Kịch bản AI đã được lưu thành công! Hãy mở "Pháp bảo khai thị" để tạo âm thanh.', 'success', 6000);
              setTimeout(() => setShowHistory(true), 500);
              if (setShowAiManager) {
                  setShowAiManager(true);
              }
          } else {
              showToastMsg(`Không nhận diện được vai hội thoại. Định dạng phải là "${_userName || 'Con'}: ..." và "${_laoName || 'Lão'}: ...".`, 'error');
          }
      } catch (err: any) {
          console.error("Lỗi lưu kịch bản AI:", err);
          showToastMsg(`Lỗi lưu kịch bản: ${err.message}`, 'error');
      }
  };

  const handleGenerateScriptVoices = async () => {
      if (isRegeneratingAll) return;
      setIsRegeneratingAll(true);
      setRegenerationProgress(0);
      setRegenerationComplete(false);

      try {
        // Chỉ lọc ra những tin nhắn CHƯA có âm thanh của CẢ Lão và Con
        const missingVoices = messages.filter((m: any) => !m.audioUrl);
        const total = missingVoices.length;
        if (total === 0) {
            showToastMsg('Tất cả hội thoại đã có sẵn âm thanh.', 'success');
            setIsRegeneratingAll(false);
            return;
        }
        
        let processedCount = 0;
        
        for (let i = 0; i < total; i++) {
          const msg = missingVoices[i];
          let success = false;
          let retries = 0;

          // Cơ chế tự động thử lại nếu API bị nghẽn (tối đa 3 lần)
          while (!success && retries < 3) {
             success = await generateVoice(msg.id, msg.text, msg.role, currentSessionId, false);
             if (!success) {
                 retries++;
                 await new Promise(resolve => setTimeout(resolve, 2500)); // Nghỉ 2.5s rồi thử lại
             }
          }
          
          processedCount++;
          setRegenerationProgress(Math.round((processedCount / total) * 100));
          await new Promise(resolve => setTimeout(resolve, 1500)); // Delay an toàn giữa các tin nhắn
        }
        
        setRegenerationComplete(true);
        setTimeout(() => setRegenerationComplete(false), 4000);
      } catch (error) {
        console.error("Lỗi khi tạo giọng hàng loạt", error);
      } finally {
        setIsRegeneratingAll(false);
      }
  };

  const saveSessionTitle = async (id: any, newTitle?: string) => {
    const titleToSave = newTitle !== undefined ? newTitle : editSessionTitle;
    if(titleToSave.trim() !== '') {
      const res = await updateChatSessionTitleAction(id, titleToSave);
      if (res.success) {
        setSessions((prev: any) => prev.map((s: any) => s.id === id ? { ...s, title: titleToSave } : s));
      }
    }
    setEditingSessionId(null);
  };

  const togglePin = (id: any) => {
    setSessions((prev: any) => prev.map((s: any) => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
  };

  const handleDeleteSession = async (id: any, e: any) => {
    e.stopPropagation();
    const res = await deleteChatSessionAction(id);
    if (res.success) {
      const newSessions = sessions.filter((s: any) => s.id !== id);
      if (newSessions.length === 0) {
        const createRes = await createChatSessionAction(undefined, 'Cuộc đàm đạo mới');
        if (createRes.success && createRes.data) {
          const newSession = {
            id: createRes.data.id,
            title: createRes.data.title,
            isPinned: false,
            messages: [],
            messagesLoaded: true
          };
          setSessions([newSession]);
          setCurrentSessionId(createRes.data.id);
        }
      } else {
        setSessions(newSessions);
        if (currentSessionId === id) setCurrentSessionId(newSessions[0].id);
      }
    }
  };

  const toggleCamera = async () => {
    if (!cameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraOn(true);
      } catch (err: any) { console.error("Camera error:", err); }
    } else {
      if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach((t: any) => t.stop());
      setCameraOn(false);
    }
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = (id: any) => {
    updateCurrentMessages((prev: any) => prev.map((m: any) => m.id === id ? { ...m, text: tempEditText, audioUrl: null } : m));
    setEditingId(null); setTempEditText('');
  };

  const toggleReaction = (id: any, type: any) => {
    updateCurrentMessages((prev: any) => prev.map((m: any) => m.id === id ? { ...m, reactions: { ...m.reactions, [type]: !m.reactions?.[type] } } : m));
  };

  const shareCombinedAudioFile = async () => {
    setIsPreparingGlobal(true);
    const url = await getCombinedAudioUrl();
    setIsPreparingGlobal(false);
    if (url) {
      const blob = await fetch(url).then((r: any) => r.blob());
      const file = new File([blob], `Khai_thi_${currentSession?.title || "Hoi_thoai"}.wav`, { type: 'audio/wav' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `Hội thoại cùng Lão - ${currentSession?.title || "Hội thoại"}`,
            files: [file]
          });
        } catch (e: any) { 
          if (e.name !== 'AbortError' && !e.message?.includes('canceled')) {
            console.error("Share failed", e); 
            showToastMsg('Môi trường chặn chia sẻ trực tiếp. Đang tự động tải về...', 'info', 3000);
            downloadAudio(url, `Khai_thi_Toan_bo_${currentSession?.title || "Hoi_thoai"}`);
          }
        }
      } else {
        showToastMsg('Không hỗ trợ chia sẻ trực tiếp. Đang tự động tải về...', 'info', 3000);
        downloadAudio(url, `Khai_thi_Toan_bo_${currentSession?.title || "Hoi_thoai"}`);
      }
    }
    setShowShareMenu(false);
  };

  const startLipSync = (audioElement: any) => {
    try {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (!analyserRef.current) {
        analyserRef.current = ctx.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.1; // Chỉnh thấp xuống để nhận diện từng âm tiết, không bị đơ há miệng
        analyserRef.current.connect(ctx.destination);
      }
      const analyser = analyserRef.current;

      if (!audioElement.sourceNode) {
        audioElement.sourceNode = ctx.createMediaElementSource(audioElement);
        audioElement.sourceNode.connect(analyser);
      }

      // TÂM AN FIX TRÀN RAM (Memory Leak): Khởi tạo mảng dữ liệu 1 LẦN DUY NHẤT ngoài vòng lặp
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAnimation = () => {
        let shouldLipSync = true;
        if (audioElement === globalAudioRef.current) {
           const ct = audioElement.currentTime;
           const metadata = globalAudioMetadataRef.current;
           const segment = metadata.find(m => ct >= m.start && ct <= m.end);
           if (segment && segment.role === 'user') {
              shouldLipSync = false;
           }
        }

        if (shouldLipSync) {
          // TÂM AN FIX: Tái sử dụng mảng dataArray đã tạo, thay vì tạo mới liên tục làm phình RAM
          analyser.getByteFrequencyData(dataArray);
          
          let speechEnergy = 0;
          // Tập trung vào dải tần số chứa âm lượng giọng nói để bắt nhịp nhả chữ
          for (let i = 2; i < 15; i++) speechEnergy += dataArray[i];
          let speechAvg = speechEnergy / 13;

          // Cắt bỏ nhiễu nền và khuếch đại mạnh để miệng đóng/mở dứt khoát
          const noiseFloor = 15;
          let activeEnergy = Math.max(0, speechAvg - noiseFloor);
          
          let targetMouthOpen = (activeEnergy / 80) * 20; 

          // Phát hiện phụ âm để mở rộng khẩu hình ngang
          let highEnergy = 0;
          for (let i = 30; i < 70; i++) highEnergy += dataArray[i];
          let highAvg = highEnergy / 40;

          setMouthOpen(Math.min(Math.max(targetMouthOpen, 0), 20)); 
          setMouthWidth(Math.min(Math.max(highAvg / 10, 0), 6));
          setBrowLift(Math.min(Math.max(activeEnergy / 20, 0), 4)); 
          setEyeSquint(Math.min(Math.max(activeEnergy / 30, 0), 2));
        } else {
          setMouthOpen(0); setMouthWidth(0); setBrowLift(0); setEyeSquint(0);
        }
        
        // --- TÂM AN LÕI MỚI: ĐỒNG BỘ PHỤ ĐỀ LIVESTREAM TỐC ĐỘ CAO (60FPS) VÀ CHỐNG KẸT FRAME ---
        if (isLiveModeRef.current && liveShowSubtitlesRef.current && liveSubtitlesMetaRef.current) {
            let currentPct = 0;
            // Kiểm tra an toàn để tránh chia cho Infinity lúc File Audio vừa nạp
            if (audioElement.duration && !isNaN(audioElement.duration) && audioElement.duration !== Infinity) {
                currentPct = audioElement.currentTime / audioElement.duration;
            }
            
            const meta = liveSubtitlesMetaRef.current;
            let activeText = meta[meta.length - 1]?.text || ''; // Mặc định ở câu cuối cùng
            
            for (let i = 0; i < meta.length; i++) {
                if (currentPct >= meta[i].startPct && currentPct <= meta[i].endPct) {
                    activeText = meta[i].text;
                    break;
                }
            }
            
            // Chỉ can thiệp DOM khi câu nói THỰC SỰ chuyển sang câu mới (Giảm tải CPU tuyệt đối)
            if (currentLiveSubTextRef.current !== activeText) {
                currentLiveSubTextRef.current = activeText;
                const subEl = document.getElementById('live-subtitle-text');
                if (subEl) subEl.innerText = activeText;
            }
        }

        animationFrameRef.current = requestAnimationFrame(updateAnimation);
      };
      updateAnimation();
    } catch (e) {
      console.error("Lip sync failed to start", e);
    }
  };

  const stopLipSync = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setMouthOpen(0); setMouthWidth(0); setBrowLift(0); setEyeSquint(0);
    
    // Tự động dọn dẹp phụ đề khi audio dừng
    if (!isPlayingQueueRef.current && currentlyPlayingId === null) {
        currentLiveSubTextRef.current = '';
        const subEl = document.getElementById('live-subtitle-text');
        if (subEl) subEl.innerText = '';
    }
  };

  const pcmToWav = (base64Data: any, sampleRate: any) => {
    if (!base64Data) return null;
    try {
      const decoded = atob(base64Data);
      if (decoded.length < 4) return null; // Bỏ qua dữ liệu rỗng hoặc không hợp lệ
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

  const combineWavs = async (items: any[]) => {
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
          // TÂM AN FIX: Đưa thêm Emotion và msgId vào Metadata Timeline để máy quay biết cảm xúc và định danh chính xác đoạn thoại
          metadata.push({ role: items[i].role, text: items[i].text, emotion: items[i].emotion || 'calm', msgId: items[i].msgId, start: timeOffset, end: timeOffset + durationSec });
          timeOffset += durationSec;
      }
    }
    
    return { blob: new Blob([combined.buffer], { type: 'audio/wav' }), metadata };
  };

  const getCombinedAudioUrl = async () => {
    // TÂM AN FIX: Vượt qua Stale Closure bằng cách dùng Ref truy xuất dữ liệu nóng
    const targetSession = latestSessionsRef.current.find((s: any) => s.id === currentSessionIdRef.current) || latestSessionsRef.current[0];
    const currentMsgs = targetSession?.messages || [];
    
    const messagesWithAudio = currentMsgs.filter((m: any) => m.audioUrl);
    if (messagesWithAudio.length === 0) {
        globalAudioMetadataRef.current = [];
        return null;
    }

    if (globalAudioUrlRef.current && globalMessageCountRef.current === messagesWithAudio.length) {
      return globalAudioUrlRef.current;
    }

    // TÂM AN FIX: Truyền cả Emotion và msgId vào items
    const items = messagesWithAudio.map((m: any) => ({ url: m.audioUrl, role: m.role, text: m.text, emotion: m.emotion || 'calm', msgId: m.id }));
    const { blob, metadata } = await combineWavs(items);
    if (!blob) return null;

    const url = URL.createObjectURL(blob);
    globalAudioUrlRef.current = url;
    globalAudioMetadataRef.current = metadata;
    globalMessageCountRef.current = messagesWithAudio.length;
    return url;
  };

  const formatTime = (seconds: any) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleGlobalPlay = async () => {
    if (isGlobalPlaying) {
      globalAudioRef.current?.pause();
      setIsGlobalPlaying(false);
      stopLipSync();
    } else {
      setIsPreparingGlobal(true);
      const url = await getCombinedAudioUrl();
      setIsPreparingGlobal(false);
      if (!url) return;

      if (!globalAudioRef.current) {
        globalAudioRef.current = new Audio();
        globalAudioRef.current.crossOrigin = "anonymous";
        globalAudioRef.current.onloadedmetadata = () => {
          setGlobalDuration(globalAudioRef.current.duration);
        };
        globalAudioRef.current.ontimeupdate = () => {
          const ct = globalAudioRef.current.currentTime;
          const dur = globalAudioRef.current.duration || 1; 
          setGlobalCurrentTime(ct);
          setGlobalDuration(globalAudioRef.current.duration);
          const pct = (ct / dur) * 100;
          setGlobalProgress(pct || 0);
        };
        globalAudioRef.current.onended = () => {
          setIsGlobalPlaying(false);
          setGlobalProgress(0);
          setGlobalCurrentTime(0);
          stopLipSync();
        };
        globalAudioRef.current.onplay = () => {
          startLipSync(globalAudioRef.current);
        };
      }
      
      if (globalAudioRef.current.src !== url) {
        globalAudioRef.current.src = url;
      }
      
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        setCurrentlyPlayingId(null);
      }

      globalAudioRef.current.play().catch((e: any) => {
        if (e.name !== 'AbortError' && !e.message?.includes('interrupted')) {
           console.error("Global play error", e);
        }
      });
      setIsGlobalPlaying(true);
    }
  };

  const handleGlobalSeek = (e: any) => {
    const pct = parseFloat(e.target.value);
    setGlobalProgress(pct);
    if (globalAudioRef.current && globalAudioRef.current.duration) {
      const newTime = (pct / 100) * globalAudioRef.current.duration;
      globalAudioRef.current.currentTime = newTime;
      setGlobalCurrentTime(newTime);
    }
  };

  const playNextInQueue = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingQueueRef.current = false;
      stopLipSync();
      setCurrentlyPlayingId(null);
      return;
    }

    const nextItem = audioQueueRef.current.shift();
    const nextAudioUrl = typeof nextItem === 'string' ? nextItem : nextItem?.url;
    const nextText = typeof nextItem === 'string' ? '' : nextItem?.text;

    // TÂM AN LÕI: Áp thẳng khối Text vào bộ chia tỷ lệ ngay khi Audio bắt đầu phát
    if (isLiveModeRef.current && liveShowSubtitlesRef.current) {
        buildLiveSubMeta(nextText);
    }
    
    let advanced = false;
    const advance = () => {
        if (!advanced) {
            advanced = true;
            setTimeout(playNextInQueue, 0); // Tiến lên câu tiếp theo an toàn
        }
    };

    if (!nextAudioUrl) {
        advance();
        return;
    }

    if (!activeAudioRef.current) {
      activeAudioRef.current = new Audio();
      activeAudioRef.current.crossOrigin = "anonymous";
    }
    
    const audio = activeAudioRef.current;
    
    audio.onplay = () => { startLipSync(audio); };
    audio.onended = advance;
    audio.onerror = advance;

    audio.src = nextAudioUrl;
    audio.load(); // Bắt buộc tải ngay để kiểm tra nguồn
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => { 
        if (e.name !== 'AbortError' && !e.message?.includes('interrupted') && !e.message?.includes('supported source')) {
           console.error("Lỗi phát Queue audio", e); 
        }
        advance(); // Bỏ qua đoạn lỗi, phát đoạn tiếp theo ngay lập tức
      });
    }
  };

  const playVoice = (audioUrl: any, id: any, role = 'ai', onEndCallback: any = null) => {
    if (!activeAudioRef.current) {
      activeAudioRef.current = new Audio();
      activeAudioRef.current.crossOrigin = "anonymous";
    }
    const audio = activeAudioRef.current;

    audio.pause(); stopLipSync();
    if (currentlyPlayingId === id) { setCurrentlyPlayingId(null); return; }
    
    if (globalAudioRef.current && !globalAudioRef.current.paused) {
      globalAudioRef.current.pause();
      setIsGlobalPlaying(false);
    }

    audio.src = audioUrl;
    audio.load();
    setCurrentlyPlayingId(id);
    
    // TÂM AN LÕI: Lấy Text của đoạn hội thoại và gửi cho bộ máy vẽ Phụ Đề
    const pMsg = messages.find((m: any) => m.id === id);
    if (isLiveModeRef.current && liveShowSubtitlesRef.current && pMsg && role === 'ai') {
        buildLiveSubMeta(pMsg.text);
    }

    const handleEnd = () => {
      stopLipSync(); 
      setCurrentlyPlayingId(null); 
      if (onEndCallback) onEndCallback();
    };

    audio.onplay = () => { if (role === 'ai') startLipSync(audio); };
    audio.onended = handleEnd;
    audio.onerror = handleEnd;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        if (e.name !== 'AbortError' && !e.message?.includes('interrupted') && !e.message?.includes('supported source')) {
           console.error("Audio playback blocked/error", e);
        }
        setCurrentlyPlayingId(null);
        if (onEndCallback) onEndCallback();
      });
    }
  };

  function copyToClipboard(text: any) {
    const textArea = document.createElement("textarea");
    textArea.value = text; document.body.appendChild(textArea);
    textArea.select(); 
    try { document.execCommand('copy'); } catch (e: any) { console.error("Copy failed"); }
    document.body.removeChild(textArea);
  };

  const downloadAudio = (url: any, filename: any) => {
    const link = document.createElement('a'); link.href = url;
    link.download = `${filename}.wav`; document.body.appendChild(link);
    link.click(); document.body.removeChild(link);
  };

  const downloadAllAudios = () => {
    messages.forEach((msg: any, index: any) => {
      if (msg.audioUrl) {
        setTimeout(() => { downloadAudio(msg.audioUrl, `${msg.role === 'ai' ? 'Lao_day' : 'Con_thua'}_${msg.id}`); }, index * 400);
      }
    });
    setShowDownloadMenu(false);
  };

  const downloadCombinedAudio = async () => {
    setIsPreparingGlobal(true);
    const url = await getCombinedAudioUrl();
    setIsPreparingGlobal(false);
    if (url) downloadAudio(url, `Khai_thi_Toan_bo_${currentSession?.title || "Hoi_thoai"}`);
    setShowDownloadMenu(false);
  };

  const shareTextContent = async () => {
    let content = `Lời khai thị từ Lão - ${currentSession?.title || "Hội thoại"}:\n\n`;
    messages.forEach((msg: any) => { content += `${msg.role === 'user' ? "Con" : "Lão"}: ${msg.text}\n\n`; });
    if (navigator.share) {
      try { 
         await navigator.share({ title: `Hội thoại cùng Lão - ${currentSession?.title || "Hội thoại"}`, text: content }); 
      } catch (err: any) { 
         if (err.name !== 'AbortError' && !err.message?.includes('canceled')) { 
            copyToClipboard(content); 
            showToastMsg('Đã chép nội dung vào khay nhớ tạm.', 'success');
         } 
      }
    } else { 
       copyToClipboard(content); 
       showToastMsg('Đã chép nội dung vào khay nhớ tạm.', 'success');
    }
    setShowShareMenu(false);
  };

  // --- Nâng cấp tính năng Share Video MXH ---
  const handleShareVideoSocial = async () => {
      if (!renderedVideoBlob && !renderedVideoUrl) return;
      const filename = `Khai_thi_Lao_${Date.now()}.${videoExt || 'webm'}`;
      const file = renderedVideoBlob ? new File([renderedVideoBlob], filename, { type: renderedVideoBlob.type || 'video/webm' }) : null;
      
      const fallbackToDownload = () => {
          showToastMsg('Trình duyệt máy tính chưa cấp quyền chia sẻ trực tiếp. Đã tải video về máy để bạn đăng MXH!', 'info', 4000);
          const link = document.createElement('a');
          link.href = renderedVideoUrl || (renderedVideoBlob ? URL.createObjectURL(renderedVideoBlob) : '');
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      };

      if (file && typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
              await navigator.share({
                  title: 'Đàm đạo cùng Lão',
                  text: 'Hãy xem đoạn video khai thị này.',
                  files: [file]
              });
          } catch (e: any) {
              if (e?.name !== 'AbortError') {
                  fallbackToDownload();
              }
          }
      } else {
          fallbackToDownload();
      }
  };

  // --- TÍNH NĂNG LƯU CẤU HÌNH CÀI ĐẶT VIDEO ---
  const handleSaveVideoConfig = () => {
    try {
      const config = {
        videoAspectRatio,
        videoResolution,
        videoTransition,
        videoTransitionDuration,
        subtitleYPos,
        subtitleScale,
        subtitleColor,
        subtitleSentenceCount,
        logoData,
        logoSettings,
        bgmVolume,
        enableIntro,
        introTitle,
        introSubtitle,
        enableOutroText,
        outroText,
        charOffsets,
        customBgs,
        savedAt: Date.now()
      };
      
      const key = currentSessionId ? `onglao_video_config_${currentSessionId}` : 'onglao_video_config_global';
      localStorage.setItem(key, JSON.stringify(config));
      localStorage.setItem('onglao_video_config_latest', JSON.stringify(config));
      
      showToastMsg('Đã lưu thành công tất cả cài đặt tạo video!', 'success', 3500);
      return true;
    } catch (e: any) {
      showToastMsg('Lỗi khi lưu cài đặt: ' + e.message, 'error');
      return false;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = currentSessionId ? `onglao_video_config_${currentSessionId}` : 'onglao_video_config_global';
      const saved = localStorage.getItem(key) || localStorage.getItem('onglao_video_config_latest');
      if (saved) {
        try {
          const cfg = JSON.parse(saved);
          if (cfg.videoAspectRatio) setVideoAspectRatio(cfg.videoAspectRatio);
          if (cfg.videoResolution) setVideoResolution(cfg.videoResolution);
          if (cfg.videoTransition) setVideoTransition(cfg.videoTransition);
          if (cfg.videoTransitionDuration) setVideoTransitionDuration(cfg.videoTransitionDuration);
          if (cfg.subtitleYPos !== undefined) setSubtitleYPos(cfg.subtitleYPos);
          if (cfg.subtitleScale !== undefined) setSubtitleScale(cfg.subtitleScale);
          if (cfg.subtitleColor) setSubtitleColor(cfg.subtitleColor);
          if (cfg.subtitleSentenceCount !== undefined) setSubtitleSentenceCount(cfg.subtitleSentenceCount);
          if (cfg.logoData && !logoData) setLogoData(cfg.logoData);
          if (cfg.logoSettings) setLogoSettings(cfg.logoSettings);
          if (cfg.bgmVolume !== undefined) setBgmVolume(cfg.bgmVolume);
          if (cfg.enableIntro !== undefined) setEnableIntro(cfg.enableIntro);
          if (cfg.introTitle !== undefined) setIntroTitle(cfg.introTitle);
          if (cfg.introSubtitle !== undefined) setIntroSubtitle(cfg.introSubtitle);
          if (cfg.enableOutroText !== undefined) setEnableOutroText(cfg.enableOutroText);
          if (cfg.outroText !== undefined) setOutroText(cfg.outroText);
          if (cfg.charOffsets) setCharOffsets(cfg.charOffsets);
          if (cfg.customBgs) setCustomBgs(cfg.customBgs);
        } catch (e) {}
      }
    }
  }, [currentSessionId]);

  const getLogoBounds = (canvasW: number, canvasH: number, logoImg: any, settings: any) => {
    const scale = settings?.scale || 1.0;
    const logoSize = Math.round(Math.min(canvasW, canvasH) * 0.15 * scale);
    const padding = Math.round(Math.min(canvasW, canvasH) * 0.03);
    const aspect = (logoImg && logoImg.width && logoImg.height) ? (logoImg.height / logoImg.width) : 1.0;
    const logoH = Math.round(logoSize * aspect);

    let logoX = padding;
    let logoY = padding;

    if (settings?.x !== undefined && settings?.y !== undefined && settings?.position === 'custom') {
        logoX = Math.round(canvasW * (settings.x / 100));
        logoY = Math.round(canvasH * (settings.y / 100));
    } else if (settings?.position === 'top-right' || (!settings?.position)) {
        logoX = canvasW - logoSize - padding;
        logoY = padding;
    } else if (settings?.position === 'bottom-left') {
        logoX = padding;
        logoY = canvasH - logoH - padding;
    } else if (settings?.position === 'bottom-right') {
        logoX = canvasW - logoSize - padding;
        logoY = canvasH - logoH - padding;
    } else if (settings?.position === 'top-left') {
        logoX = padding;
        logoY = padding;
    }

    return { logoX, logoY, logoW: logoSize, logoH };
  };

  const getCanvasHitTarget = (clientX: any, clientY: any, canvas: any) => {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (clientX - rect.left) * scaleX;
    const mouseY = (clientY - rect.top) * scaleY;

    if (processedLogoRef.current && logoSettings?.visible !== false) {
        const bounds = getLogoBounds(canvas.width, canvas.height, processedLogoRef.current, logoSettings);
        if (mouseX >= bounds.logoX - 10 && mouseX <= bounds.logoX + bounds.logoW + 10 && mouseY >= bounds.logoY - 10 && mouseY <= bounds.logoY + bounds.logoH + 10) {
            return { type: 'logo', ...bounds };
        }
    }

    const { laoW, laoH, laoX, laoY, userW, userH, userX, userY, refWidth, refHeight } = calculatePositions(canvas.width, canvas.height);
    
    const finalLaoW = laoW * charOffsets.lao.s;
    const finalLaoH = laoH * charOffsets.lao.s;
    const finalLaoX = laoX + (refWidth * (charOffsets.lao.x / 100));
    const finalLaoY = laoY + (refHeight * (charOffsets.lao.y / 100));

    const finalUserW = userW * charOffsets.user.s;
    const finalUserH = userH * charOffsets.user.s;
    const finalUserX = userX + (refWidth * (charOffsets.user.x / 100));
    const finalUserY = userY + (refHeight * (charOffsets.user.y / 100));

    const subY_pixel = canvas.height * (subtitleYPos / 100);

    if (mouseY > subY_pixel - 80 && mouseY < subY_pixel + 80) return { type: 'sub' };
    if (mouseX > finalLaoX - finalLaoW/2 && mouseX < finalLaoX + finalLaoW/2 && mouseY > finalLaoY && mouseY < finalLaoY + finalLaoH) return { type: 'lao' };
    if (mouseX > finalUserX - finalUserW/2 && mouseX < finalUserX + finalUserW/2 && mouseY > finalUserY && mouseY < finalUserY + finalUserH) return { type: 'user' };
    
    if (exportTab === 'background' && activeBgId) return { type: 'bg', id: activeBgId };
    
    return null;
  };

  const handleCanvasPointerDown = (e: any) => {
    if (isExportingVideo || renderedVideoUrl) return;
    const clientX = e.clientX || e.touches?.[0].clientX;
    const clientY = e.clientY || e.touches?.[0].clientY;
    
    const targetInfo = getCanvasHitTarget(clientX, clientY, exportCanvasRef.current);
    
    if (targetInfo) {
        let initialX = 0;
        let initialY = 0;
        if (targetInfo.type === 'lao') { initialX = charOffsets.lao.x; initialY = charOffsets.lao.y; }
        else if (targetInfo.type === 'user') { initialX = charOffsets.user.x; initialY = charOffsets.user.y; }
        else if (targetInfo.type === 'sub') { initialY = subtitleYPos; }
        else if (targetInfo.type === 'bg') { initialX = customBgs.find((b: any)=>b.id===targetInfo.id)?.x || 0; initialY = customBgs.find((b: any)=>b.id===targetInfo.id)?.y || 0; }
        else if (targetInfo.type === 'logo') {
            const bounds = getLogoBounds(exportCanvasRef.current.width, exportCanvasRef.current.height, processedLogoRef.current, logoSettings);
            initialX = logoSettings.x !== undefined ? logoSettings.x : ((bounds.logoX / exportCanvasRef.current.width) * 100);
            initialY = logoSettings.y !== undefined ? logoSettings.y : ((bounds.logoY / exportCanvasRef.current.height) * 100);
        }

        dragInfo.current = {
            isDragging: true,
            target: targetInfo.type,
            bgId: targetInfo.id || null,
            startX: clientX,
            startY: clientY,
            initialX,
            initialY,
            startOffsetsSnapshot: JSON.parse(JSON.stringify(charOffsets))
        };
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch(err) {}
    }
  };

  const handleCanvasPointerMove = (e: any) => {
    const clientX = e.clientX || e.touches?.[0].clientX;
    const clientY = e.clientY || e.touches?.[0].clientY;

    if (!dragInfo.current.isDragging) {
        if (isExportingVideo || renderedVideoUrl) return;
        const hit = getCanvasHitTarget(clientX, clientY, exportCanvasRef.current);
        const hitString = JSON.stringify(hit);
        const hoverString = JSON.stringify(hoveredElement);
        if (hitString !== hoverString) {
            setHoveredElement(hit);
        }
        return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const deltaX_pct = ((clientX - dragInfo.current.startX) / rect.width) * 100;
    const deltaY_pct = ((clientY - dragInfo.current.startY) / rect.height) * 100;

    const { target, bgId, initialX, initialY } = dragInfo.current;

    if (target === 'sub') {
        setSubtitleYPos(Math.max(5, Math.min(95, initialY + deltaY_pct)));
    } else if (target === 'lao') {
        setCharOffsets((prev: any) => ({...prev, lao: {...prev.lao, x: initialX + deltaX_pct, y: initialY + deltaY_pct}}));
    } else if (target === 'user') {
        setCharOffsets((prev: any) => ({...prev, user: {...prev.user, x: initialX + deltaX_pct, y: initialY + deltaY_pct}}));
    } else if (target === 'bg' && bgId) {
        setCustomBgs((prev: any) => prev.map((bg: any) => bg.id === bgId ? { ...bg, x: initialX + deltaX_pct, y: initialY + deltaY_pct } : bg));
    } else if (target === 'logo') {
        setLogoSettings((prev: any) => ({
            ...prev,
            position: 'custom',
            x: Math.max(0, Math.min(95, initialX + deltaX_pct)),
            y: Math.max(0, Math.min(95, initialY + deltaY_pct))
        }));
    }
  };

  const handleCanvasPointerLeave = (e: any) => {
    dragInfo.current.isDragging = false;
    setHoveredElement(null);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err) {}
  };

  const handleCanvasPointerUp = (e: any) => {
    if (dragInfo.current.isDragging) {
        if (dragInfo.current.target === 'lao' || dragInfo.current.target === 'user') {
             setCharOffsets((prev: any) => {
                 const { laoFlip, userFlip } = calculateAutoFlip(prev.lao.x, prev.user.x, currentLaoPresetId, currentUserPresetId);
                 return {
                     lao: { ...prev.lao, flip: laoFlip },
                     user: { ...prev.user, flip: userFlip }
                 };
             });
             
             setPastOffsets((prev: any) => [...prev, dragInfo.current.startOffsetsSnapshot]);
             setFutureOffsets([]);
        }
    }
    dragInfo.current.isDragging = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err) {}
  };

  const handleCanvasWheel = (e: any) => {
    if (isExportingVideo || renderedVideoUrl) return;
    e.preventDefault();
    const hit = getCanvasHitTarget(e.clientX, e.clientY, exportCanvasRef.current);
    const delta = e.deltaY > 0 ? -0.05 : 0.05;

    if (!hit || hit.type === 'sub') {
        setSubtitleScale((prev: any) => Math.max(0.4, Math.min(3.0, prev + delta)));
    } else if (hit.type === 'logo') {
        setLogoSettings((prev: any) => ({
            ...prev,
            scale: Math.max(0.2, Math.min(3.0, (prev.scale || 1.0) + delta))
        }));
    } else if (hit.type === 'lao') {
        setCharOffsets((prev: any) => ({...prev, lao: {...prev.lao, s: Math.max(0.5, Math.min(2.5, prev.lao.s + delta))}}));
    } else if (hit.type === 'user') {
        setCharOffsets((prev: any) => ({...prev, user: {...prev.user, s: Math.max(0.5, Math.min(2.5, prev.user.s + delta))}}));
    } else if (hit.type === 'bg' && hit.id) {
        setCustomBgs((prev: any) => prev.map((bg: any) => bg.id === hit.id ? { ...bg, s: Math.max(0.1, Math.min(5.0, bg.s + delta)) } : bg));
    }
  };

  const loadExternalImage = async (url: any) => {
    return new Promise((resolve) => {
      const createFallbackCanvas = () => {
          const cvs = document.createElement('canvas');
          cvs.width = 1280; cvs.height = 720;
          const ctx = cvs.getContext('2d');
          if (ctx) {
              const grad = ctx.createLinearGradient(0, 0, 1280, 720);
              grad.addColorStop(0, '#1e293b');
              grad.addColorStop(1, '#020617');
              ctx.fillStyle = grad;
              ctx.fillRect(0, 0, 1280, 720);
              ctx.fillStyle = '#64748b';
              ctx.font = 'bold 40px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('Đang kết nối bối cảnh...', 640, 360);
          }
          return cvs;
      };

      const img = new window.Image();
      
      // Chỉ thêm crossOrigin cho link ngoài (http/https) để tránh lỗi CORS với blob: hoặc data:
      if (url.startsWith('http://') || url.startsWith('https://')) {
          img.crossOrigin = "anonymous";
      }
      
      img.onload = () => resolve(img);
      
      img.onerror = async () => {
          console.warn("Lỗi tải ảnh qua thẻ Image, đang thử tải bằng Fetch qua Proxy...", url);
          // Nếu là link ngoài, thử dùng Fetch để tải blob (giúp lách một số lỗi CORS/Tracking blocker)
          if (url.startsWith('http://') || url.startsWith('https://')) {
              try {
                  const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
                  const response = await fetch(proxyUrl);
                  if (!response.ok) {
                      console.warn("Lỗi kết nối khi fetch ảnh qua proxy: response not ok");
                      resolve(createFallbackCanvas());
                      return;
                  }
                  const blob = await response.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  
                  const fallbackImg = new window.Image();
                  fallbackImg.onload = () => resolve(fallbackImg);
                  fallbackImg.onerror = () => resolve(createFallbackCanvas());
                  fallbackImg.src = blobUrl;
              } catch (fetchErr) {
                  console.error("Fetch ảnh dự phòng cũng thất bại:", fetchErr);
                  resolve(createFallbackCanvas());
              }
          } else {
              resolve(createFallbackCanvas());
          }
      };
      
      img.src = url;
    });
  };

  const drawCoverBackground = (ctx: any, img: any, canvasWidth: any, canvasHeight: any) => {
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;
    let renderWidth, renderHeight, x, y;

    if (canvasRatio > imgRatio) {
      renderWidth = canvasWidth;
      renderHeight = canvasWidth / imgRatio;
      x = 0;
      y = (canvasHeight - renderHeight) / 2;
    } else {
      renderWidth = canvasHeight * imgRatio;
      renderHeight = canvasHeight;
      x = (canvasWidth - renderWidth) / 2;
      y = 0;
    }
    ctx.drawImage(img, x, y, renderWidth, renderHeight);
  };

  // --- TÂM AN FIX: Hàm lấy Tỉ lệ thực tế của Media để chống bóp méo ---
  const getMediaRatio = (media: any) => {
      if (!media) return 300 / 400; // Tỉ lệ mặc định của SVG (3:4)
      const w = media.videoWidth || media.naturalWidth || media.width;
      const h = media.videoHeight || media.naturalHeight || media.height;
      if (!w || !h) return 300 / 400;
      return w / h;
  };

  const calculatePositions = (width: any, height: any) => {
    const isPortrait = width < height;
    const isSquare = width === height;
    
    // TÂM AN FIX TỐI THƯỢNG: Tạo "Không Gian Ảo" (Virtual Space) 16:9
    let refWidth = width;
    let refHeight = height;
    
    if (isPortrait || isSquare) {
        refWidth = height * (16/9);
    } else if (width / height > 16/9) {
        refHeight = width / (16/9);
    } else {
        refWidth = height * (16/9);
    }
    
    let laoW, laoH, laoX, laoY;
    let userW, userH, userX, userY;

    laoH = height * 0.65;
    laoW = laoH * (300/400);
    laoX = (width / 2) + (refWidth * 0.15);
    laoY = (height / 2) - (refHeight / 2) + (refHeight * 0.15);

    userH = height * 0.55;
    userW = userH * (300/400);
    userX = (width / 2) - (refWidth * 0.15);
    userY = laoY + (laoH * 0.15);

    return { laoW, laoH, laoX, laoY, userW, userH, userX, userY, isPortrait, isSquare, refWidth, refHeight };
  };

  // Preview tĩnh
  useEffect(() => {
    if (!showVideoExportModal || isExportingVideo || renderedVideoUrl) return;
    let isMounted = true;
    
    const drawStaticPreview = async () => {
        const canvas = exportCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        const res = parseInt(videoResolution);
        let width, height;
        if (videoAspectRatio === '16x9') { width = Math.round(res * 16 / 9); height = res; }
        else if (videoAspectRatio === '9x16') { width = res; height = Math.round(res * 16 / 9); }
        else if (videoAspectRatio === '1x1') { width = res; height = res; }
        else if (videoAspectRatio === '4x3') { width = Math.round(res * 4 / 3); height = res; }
        else if (videoAspectRatio === '3x4') { width = res; height = Math.round(res * 4 / 3); }
        else if (videoAspectRatio === '2x3') { width = res; height = Math.round(res * 3 / 2); }
        else if (videoAspectRatio === '21x9') { width = Math.round(res * 21 / 9); height = res; }
        else { width = Math.round(res * 16 / 9); height = res; }
        
        canvas.width = width; 
        canvas.height = height;

        // XÁC ĐỊNH GÓC MÁY MẶC ĐỊNH (MEDIUM SHOT) CHO PREVIEW TRONG KHÔNG GIAN 3D
        const { laoW, laoH, laoX, laoY, userW, userH, userX, userY, isPortrait, isSquare, refWidth, refHeight } = calculatePositions(width, height);
        
        // TÂM AN FIX: Đưa các biến tọa độ ra ngoài để Hào Quang và Camera cùng sử dụng được
        const finalLaoW = laoW * charOffsets.lao.s;
        const finalLaoH = laoH * charOffsets.lao.s;
        const finalLaoX = laoX + (refWidth * (charOffsets.lao.x / 100));
        const finalLaoY = laoY + (refHeight * (charOffsets.lao.y / 100));

        const finalUserW = userW * charOffsets.user.s;
        const finalUserH = userH * charOffsets.user.s;
        const finalUserX = userX + (refWidth * (charOffsets.user.x / 100));
        const finalUserY = userY + (refHeight * (charOffsets.user.y / 100));

        // Giả lập Camera ở vị trí Lão đang nói (Medium shot) để người dùng dễ căn chỉnh
        const charCenterOffset = isPortrait ? 0 : -(finalLaoX - finalUserX) * 0.05;
        
        let previewCamera = {
            x: isPortrait ? finalLaoX : finalLaoX + charCenterOffset, // TÂM AN FIX: Khung dọc focus thẳng mặt Lão
            y: finalLaoY + finalLaoH * 0.22 - (isPortrait ? height * 0.05 : 0),
            scale: isPortrait ? 1.25 : (isSquare ? 1.25 : 1.35) // TÂM AN FIX: Vuông & Dọc để 1.25 lấy đủ thân hình
        };

        // --- TÂM AN FIX: Khóa giới hạn Camera (Dựa trên diện tích thực của Lớp Nền) ---
        const viewHalfW_prev = width / (2 * previewCamera.scale);
        const viewHalfH_prev = height / (2 * previewCamera.scale);
        
        let safeMinX_prev = viewHalfW_prev;
        let safeMaxX_prev = width - viewHalfW_prev;
        let safeMinY_prev = viewHalfH_prev;
        let safeMaxY_prev = height - viewHalfH_prev;

        // Tính toán ranh giới dựa vào lớp nền đầu tiên
        const activeBgForBoundsPrev = customBgs.find(b => b.visible !== false);
        if (activeBgForBoundsPrev) {
            const OVERSCAN = 1.6;
            const baseBgW = width * OVERSCAN;
            const baseBgH = height * OVERSCAN;
            
            const finalBgW = baseBgW * activeBgForBoundsPrev.s;
            const finalBgH = baseBgH * activeBgForBoundsPrev.s;
            const finalBgX = width/2 + (width * (activeBgForBoundsPrev.x / 100));
            const finalBgY = height/2 + (height * (activeBgForBoundsPrev.y / 100));

            const bgLeft = finalBgX - finalBgW/2;
            const bgRight = finalBgX + finalBgW/2;
            const bgTop = finalBgY - finalBgH/2;
            const bgBottom = finalBgY + finalBgH/2;

            safeMinX_prev = bgLeft + viewHalfW_prev;
            safeMaxX_prev = bgRight - viewHalfW_prev;
            safeMinY_prev = bgTop + viewHalfH_prev;
            safeMaxY_prev = bgBottom - viewHalfH_prev;

            // Nếu background bị thu nhỏ quá mức, khóa chặt camera ở trung tâm background
            if (safeMinX_prev > safeMaxX_prev) { safeMinX_prev = finalBgX; safeMaxX_prev = finalBgX; }
            if (safeMinY_prev > safeMaxY_prev) { safeMinY_prev = finalBgY; safeMaxY_prev = finalBgY; }
        }

        // TÂM AN FIX: Nới lỏng khóa Camera cho video Dọc và Vuông để luôn chĩa ống kính vào nhân vật, không bị ép về giữa
        if (isPortrait || isSquare) {
            safeMinX_prev = Math.min(safeMinX_prev, previewCamera.x);
            safeMaxX_prev = Math.max(safeMaxX_prev, previewCamera.x);
        }

        // CƯỠNG CHẾ TOÀN CẢNH CHO PREVIEW
        if (isFullFrameMode) {
            // TÂM AN AI: Phân tích giả lập Auto-Focus trong lúc Xem Trước
            const isUserCamera = !isLaoSpeakingSession;
            const charX = isUserCamera ? finalUserX : finalLaoX;
            const charY = isUserCamera ? finalUserY + finalUserH * 0.25 : finalLaoY + finalLaoH * 0.25;

            // Lia máy về phía nhân vật đang nói dựa trên tọa độ X/Y do người dùng thiết lập
            previewCamera.x = width/2 + (charX - width/2) * 0.5;
            previewCamera.y = height/2 + (charY - height/2) * 0.35;
            
            // Zoom cận mặt 30% để lấy nét khuôn mặt
            previewCamera.scale = 1.3;
        }

        previewCamera.x = Math.max(safeMinX_prev, Math.min(safeMaxX_prev, previewCamera.x));
        previewCamera.y = Math.max(safeMinY_prev, Math.min(safeMaxY_prev, previewCamera.y));

        // Xóa nền đen
        ctx.fillStyle = '#020617'; 
        ctx.fillRect(0, 0, width, height);

        // Tạo ảnh/video tĩnh On-the-fly để luôn cập nhật Ngoại hình mới nhất
        let previewLaoImg;
        let laoVideoCanvasForPreview = null;

        if (laoVisualType === 'video') {
            const v = laoExportVidRefs.current.idle || laoExportVidRefs.current.talking;
            if (v && v.readyState >= 2) {
                // FIX LỖI SỐ 1: Dùng native playback thay vì ép scrub currentTime
                if (v.paused) v.play().catch(()=>{});

                laoVideoCanvasForPreview = document.createElement('canvas');
                laoVideoCanvasForPreview.width = v.videoWidth;
                laoVideoCanvasForPreview.height = v.videoHeight;
                const ctxLao = laoVideoCanvasForPreview.getContext('2d', { willReadFrequently: true });
                if (ctxLao) {
                    ctxLao.globalCompositeOperation = 'copy';
                    ctxLao.drawImage(v, 0, 0);
                    
                    if (laoChromaSettings.chromaType !== 'none') {
                        ctxLao.globalCompositeOperation = 'source-over';
                        processChromaKeyPixels(ctxLao, v.videoWidth, v.videoHeight, laoChromaSettings);
                    }
                    previewLaoImg = laoVideoCanvasForPreview;
                }
            }
        } else if (laoVisualType === 'image' && processedLaoImages.closed) {
            previewLaoImg = await loadExternalImage(processedLaoImages.closed);
        } else {
            previewLaoImg = await loadSvgToImage(getLaoSvgString(0, laoAppearance));
        }
        
        let previewUserImg;
        let userVideoCanvasForPreview = null;

        if (userVisualType === 'video') {
            const v = userExportVidRefs.current.idle || userExportVidRefs.current.talking || userExportVidRefs.current.bowing;
            if (v && v.readyState >= 2) {
                // FIX LỖI SỐ 1: Dùng native playback thay vì ép scrub currentTime
                if (v.paused) v.play().catch(()=>{});

                userVideoCanvasForPreview = document.createElement('canvas');
                userVideoCanvasForPreview.width = v.videoWidth;
                userVideoCanvasForPreview.height = v.videoHeight;
                const ctxUser = userVideoCanvasForPreview.getContext('2d', { willReadFrequently: true });
                if (ctxUser) {
                    ctxUser.globalCompositeOperation = 'copy';
                    ctxUser.drawImage(v, 0, 0);
                    
                    if (userChromaSettings.chromaType !== 'none') {
                        ctxUser.globalCompositeOperation = 'source-over';
                        processChromaKeyPixels(ctxUser, v.videoWidth, v.videoHeight, userChromaSettings);
                    }
                    previewUserImg = userVideoCanvasForPreview;
                }
            }
        } else if (userVisualType === 'image' && processedUserImages.closed) {
            previewUserImg = await loadExternalImage(processedUserImages.closed);
        } else {
            previewUserImg = await loadSvgToImage(getUserSvgString(0, userGender, userAge, 0, userAppearance));
        }
        
        if (!isMounted) return;

        // --- BẮT ĐẦU KHÔNG GIAN CAMERA 3D ---
        ctx.save();
        ctx.translate(width/2, height/2); 
        ctx.scale(previewCamera.scale, previewCamera.scale);
        ctx.translate(-previewCamera.x, -previewCamera.y);

        if (isFullFrameMode) {
            // --- CHẾ ĐỘ TOÀN CẢNH (CẮT GHÉP TRỰC TIẾP TRONG XEM TRƯỚC) ---
            let activeFullFrameImg = null;
            let activeFullFrameFlip = false;

            // TÂM AN LÕI: Trích xuất trực tiếp từ kho Video Dựng Sẵn (ffVidRefs) ra màn hình Xem Trước
            if (isLaoSpeakingSession) {
                const vid = ffVidRefs.current['lao'];
                activeFullFrameImg = (vid && vid.readyState >= 2) ? vid : previewLaoImg;
                activeFullFrameFlip = (vid && vid.readyState >= 2) ? false : charOffsets.lao.flip;
            } else {
                // Giả định lúc không phải Lão nói thì là Người hỏi (vì Preview tĩnh không có khái niệm Outro)
                const vid = ffVidRefs.current['user'];
                activeFullFrameImg = (vid && vid.readyState >= 2) ? vid : previewUserImg;
                activeFullFrameFlip = (vid && vid.readyState >= 2) ? false : charOffsets.user.flip;
            }

            if (activeFullFrameImg) {
                ctx.save();
                ctx.translate(width/2, height/2);
                if (activeFullFrameFlip) ctx.scale(-1, 1);
                ctx.translate(-width/2, -height/2);
                
                const imgW = activeFullFrameImg.width || activeFullFrameImg.videoWidth || 1;
                const imgH = activeFullFrameImg.height || activeFullFrameImg.videoHeight || 1;
                const imgRatio = imgW / imgH;
                const canvasRatio = width / height;
                let renderW, renderH, dx, dy;

                if (canvasRatio > imgRatio) {
                  renderW = width;
                  renderH = width / imgRatio;
                  dx = 0;
                  dy = (height - renderH) / 2;
                } else {
                  renderW = height * imgRatio;
                  renderH = height;
                  dx = (width - renderW) / 2;
                  dy = 0;
                }
                ctx.drawImage(activeFullFrameImg, dx, dy, renderW, renderH);
                ctx.restore();
            }
        } else {
            // 1. Vẽ Lớp Nền (Đã bỏ Parallax để ghim chặt nhân vật vào nền)
            const OVERSCAN = 1.6; // Vẽ nền to hơn 1.6 lần để không lộ viền đen khi camera di chuyển

            ctx.save();

            // Nền Gradient cơ bản (overscan)
            const grad = ctx.createRadialGradient(width/2, height/2, height/4, width/2, height/2, height * OVERSCAN);
            grad.addColorStop(0, '#1e293b');
            grad.addColorStop(1, '#020617');
            ctx.fillStyle = grad;
            ctx.fillRect(-(width * (OVERSCAN-1)/2), -(height * (OVERSCAN-1)/2), width * OVERSCAN, height * OVERSCAN);

            // Các lớp nền Custom Backgrounds
            customBgs.filter((bg: any) => bg.visible !== false).forEach(bg => {
                let sourceCanvasOrImage = null;
                let sourceW = 0, sourceH = 0;
                let videoData = null; // Trữ dữ liệu làm mờ chéo (crossfade)

                if (bg.type === 'image') {
                    const cached = processedBgsRef.current[bg.id];
                    if (cached && cached.element) {
                        sourceCanvasOrImage = cached.element;
                        sourceW = sourceCanvasOrImage.width;
                        sourceH = sourceCanvasOrImage.height;
                    }
                } else if (bg.type === 'video') {
                    const vObj = bgVideoRefs.current[bg.id];
                    if (vObj && vObj.isLoaded) {
                        // TÂM AN FIX V6: Lấy ra video chủ và video dự bị
                        const activeVid = vObj.activeKey === 'A' ? vObj.elementA : vObj.elementB;
                        const nextVid = vObj.activeKey === 'A' ? vObj.elementB : vObj.elementA;

                        if (activeVid.readyState >= 2) {
                            sourceCanvasOrImage = activeVid; // Vẽ khung hình hiện tại
                            sourceW = vObj.videoWidth;
                            sourceH = vObj.videoHeight;
                            
                            const OVERLAP = 0.8; // Thời gian đè (giây)
                            let crossfadeAlpha = 0;

                            // TÂM AN TỐI ƯU V6: Xử lý Vòng lặp Seamless (Không giật, Không đen) lúc Xem trước
                            if (bg.loopMode !== 'boomerang' && activeVid.duration && activeVid.currentTime >= activeVid.duration - OVERLAP) {
                                if (nextVid.paused) { 
                                    nextVid.currentTime = 0; 
                                    nextVid.play().catch(()=>{}); 
                                }
                                // Tính toán độ trong suốt đè chéo
                                crossfadeAlpha = (activeVid.currentTime - (activeVid.duration - OVERLAP)) / OVERLAP;
                                crossfadeAlpha = Math.max(0, Math.min(1, crossfadeAlpha));

                                // Đổi cờ lệnh khi Video A chính thức chạm đáy
                                if (activeVid.currentTime >= activeVid.duration - 0.05 || activeVid.ended) {
                                    vObj.activeKey = vObj.activeKey === 'A' ? 'B' : 'A';
                                    activeVid.pause();
                                    activeVid.currentTime = 0;
                                    crossfadeAlpha = 0;
                                }
                            } else if (bg.loopMode === 'boomerang' && activeVid.duration && activeVid.currentTime >= activeVid.duration - 0.15) {
                                // Kỹ thuật cho boomerang (Lùi thời gian)
                                activeVid.currentTime = 0.05;
                            }

                            videoData = { nextVid, crossfadeAlpha };
                        }
                    }
                }

                if (sourceCanvasOrImage) {
                    const imgRatio = sourceW / sourceH;
                    const canvasRatio = width / height;
                    let baseW, baseH;
                    if (canvasRatio > imgRatio) { baseW = width; baseH = width / imgRatio; } 
                    else { baseH = height; baseW = height * imgRatio; }
                    
                    // Mở rộng kích thước base theo Overscan
                    baseW *= OVERSCAN;
                    baseH *= OVERSCAN;
                    
                    const finalW = baseW * bg.s;
                    const finalH = baseH * bg.s;
                    const finalX = width/2 + (refWidth * (bg.x / 100));
                    const finalY = height/2 + (refHeight * (bg.y / 100));

                    ctx.save();
                    
                    // Hiệu ứng Hover cho Background
                    const isHoveredBg = hoveredElement?.type === 'bg' && hoveredElement?.id === bg.id;
                    if (isHoveredBg) {
                        ctx.filter = 'brightness(1.3) contrast(1.1)';
                        ctx.shadowColor = 'rgba(16, 185, 129, 0.8)'; // Emerald glow
                        ctx.shadowBlur = 20;
                    } else if (hoveredElement) {
                        ctx.filter = 'brightness(0.6)'; // Làm mờ khi đang trỏ vào cái khác
                    }

                    ctx.translate(finalX, finalY);
                    if (bg.flip) ctx.scale(-1, 1);
                    
                    ctx.globalAlpha = 1.0;
                    ctx.drawImage(sourceCanvasOrImage, -finalW/2, -finalH/2, finalW, finalH);

                    // TÂM AN CROSSFADE FIX: Đè lớp video bản sao lên để triệt tiêu chớp giật
                    if (videoData && videoData.crossfadeAlpha > 0 && videoData.nextVid && videoData.nextVid.readyState >= 2) {
                        ctx.globalAlpha = videoData.crossfadeAlpha;
                        ctx.drawImage(videoData.nextVid, -finalW/2, -finalH/2, finalW, finalH);
                    }

                    ctx.restore();
                }
            });
            
            // Màn sương tối để nhân vật nổi bật (TÂM AN FIX: Đổi thành Vignette Gradient để giữ độ trong trẻo cho ảnh/video nền ban ngày)
            const overlayGrad = ctx.createRadialGradient(previewCamera.x, previewCamera.y, height * 0.3, previewCamera.x, previewCamera.y, height * OVERSCAN);
            overlayGrad.addColorStop(0, 'rgba(2, 6, 23, 0.02)'); // Tâm sáng rực
            overlayGrad.addColorStop(1, 'rgba(2, 6, 23, 0.5)'); // Viền tối dần làm điện ảnh
            ctx.fillStyle = overlayGrad;
            ctx.fillRect(-(width * (OVERSCAN-1)/2), -(height * (OVERSCAN-1)/2), width * OVERSCAN, height * OVERSCAN);
            ctx.restore(); // Kết thúc Parallax lớp nền

            // --- Vẽ Hào Quang (Preview Tĩnh) ---
            if (showLaoAura && previewLaoImg) {
                ctx.save();
                const headCx = finalLaoX;
                const headCy = finalLaoY + finalLaoH * (95/400);
                ctx.beginPath();
                ctx.arc(headCx, headCy, 120 * (finalLaoH / 400), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(253, 224, 71, 0.15)`;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(headCx, headCy, 160 * (finalLaoH / 400), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(253, 224, 71, 0.05)`;
                ctx.fill();
                ctx.restore();
            }

            // 2. Vẽ Nhân vật trong không gian 3D
            if (previewLaoImg) {
                // --- TÂM AN FIX: Giữ nguyên tỉ lệ gốc, chống bóp méo (Lão) ---
                const laoRatio = getMediaRatio(previewLaoImg);
                const correctedLaoW = finalLaoH * laoRatio;

                // --- TÂM AN FX: Đổ bóng tiếp xúc (Ambient Occlusion) ---
                if (enableAutoHarmonization) {
                    drawContactShadow(ctx, finalLaoX, finalLaoY, correctedLaoW, finalLaoH, laoShadow);
                }

                ctx.save();
                const isHoveredLao = hoveredElement?.type === 'lao';
                
                // --- TÂM AN FX: Color Match (Cân bằng tông màu) ---
                let baseFilter = enableAutoHarmonization ? getHarmonizeFilter(harmonizeSettings) : 'none';

                if (isHoveredLao) {
                    ctx.filter = `${baseFilter !== 'none' ? baseFilter : ''} brightness(1.2)`;
                    ctx.shadowColor = 'rgba(249, 115, 22, 1)'; // Orange glow
                    ctx.shadowBlur = 25;
                } else if (hoveredElement) {
                    ctx.filter = `${baseFilter !== 'none' ? baseFilter : ''} brightness(0.5)`;
                } else if (enableAutoHarmonization) {
                    ctx.filter = baseFilter;
                }
                
                // Ép GPU dùng Float Matrix để khử mờ viền
                ctx.translate(finalLaoX, finalLaoY);
                if (charOffsets.lao.flip) {
                    ctx.scale(-1, 1);
                }
                ctx.drawImage(previewLaoImg, -correctedLaoW/2, 0, correctedLaoW, finalLaoH);
                ctx.restore();
            }
            
            if (previewUserImg) {
                // --- TÂM AN FIX: Giữ nguyên tỉ lệ gốc, chống bóp méo (User) ---
                const userRatio = getMediaRatio(previewUserImg);
                const correctedUserW = finalUserH * userRatio;

                // --- TÂM AN FX: Đổ bóng tiếp xúc (Ambient Occlusion) ---
                if (enableAutoHarmonization) {
                    drawContactShadow(ctx, finalUserX, finalUserY, correctedUserW, finalUserH, userShadow);
                }

                ctx.save();
                const isHoveredUser = hoveredElement?.type === 'user';
                
                // --- TÂM AN FX: Color Match (Cân bằng tông màu) ---
                let baseFilter = enableAutoHarmonization ? getHarmonizeFilter(harmonizeSettings) : 'none';

                if (isHoveredUser) {
                    ctx.filter = `${baseFilter !== 'none' ? baseFilter : ''} brightness(1.2)`;
                    ctx.shadowColor = 'rgba(99, 102, 241, 1)'; // Indigo glow
                    ctx.shadowBlur = 25;
                } else if (hoveredElement) {
                    ctx.filter = `${baseFilter !== 'none' ? baseFilter : ''} brightness(0.5)`;
                } else if (enableAutoHarmonization) {
                    ctx.filter = baseFilter;
                }

                // Ép GPU dùng Float Matrix để khử mờ viền
                ctx.translate(finalUserX, finalUserY);
                if (charOffsets.user.flip) {
                    ctx.scale(-1, 1);
                }
                ctx.drawImage(previewUserImg, -correctedUserW/2, 0, correctedUserW, finalUserH);
                ctx.restore();
            }
        } // Đóng khối else của isFullFrameMode

        // --- KẾT THÚC KHÔNG GIAN CAMERA 3D ---
        ctx.restore();

        if (processedLogoRef.current && logoSettings?.visible !== false) {
            const logoImg = processedLogoRef.current;
            const { logoX, logoY, logoW, logoH } = getLogoBounds(width, height, logoImg, logoSettings);
            
            ctx.save();
            ctx.globalAlpha = logoSettings.opacity !== undefined ? logoSettings.opacity : 0.8;
            if (logoSettings.isCircular) {
                ctx.beginPath();
                ctx.arc(logoX + logoW/2, logoY + logoH/2, Math.min(logoW, logoH)/2, 0, Math.PI*2);
                ctx.closePath();
                ctx.clip();
            }
            ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
            
            if (hoveredElement?.type === 'logo') {
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 3;
                ctx.strokeRect(logoX - 4, logoY - 4, logoW + 8, logoH + 8);
            }
            ctx.restore();
        }

        const activeText = "Đây là phụ đề mẫu. Dấu câu được ngắt tự động, rõ ràng.";
        ctx.fillStyle = subtitleColor;
        const fontSizeText = Math.min(width, height) * 0.055 * subtitleScale;
        ctx.font = `bold ${fontSizeText}px 'Segoe UI', Arial, sans-serif`;
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.textAlign = "center";

        const lines = wrapTextToLines(ctx, activeText, width * 0.85);
        const startY = height * (subtitleYPos / 100);
        let textY = startY - (lines.length * fontSizeText * 1.3) / 2;
        
        const isSubHovered = hoveredElement?.type === 'sub';
        if (isSubHovered) {
             ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
             const hitBoxH = (lines.length * fontSizeText * 1.3) + 40;
             ctx.fillRect(0, startY - hitBoxH/2, width, hitBoxH);
             ctx.shadowColor = 'rgba(255,255,255,0.9)';
             ctx.shadowBlur = 15;
        }

        lines.forEach(line => {
           ctx.strokeStyle = 'rgba(0,0,0,0.85)';
           ctx.lineWidth = fontSizeText * 0.15;
           ctx.strokeText(line, width/2, textY);
           ctx.fillText(line, width/2, textY);
           textY += fontSizeText * 1.3;
        });
        ctx.shadowColor = 'transparent';

        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        const hintSize = Math.max(12, Math.min(width, height) * 0.02);
        ctx.font = `bold ${hintSize}px sans-serif`;
        ctx.fillText("✨ Kéo thả chữ hoặc cuộn để zoom", width/2, height * 0.05);
    };
    drawStaticPreview();
    return () => { isMounted = false; };
  }, [showVideoExportModal, isExportingVideo, renderedVideoUrl, videoAspectRatio, videoResolution, subtitleYPos, subtitleScale, subtitleColor, subtitleSentenceCount, userGender, userAge, charOffsets, customBgs, bgUpdateTrigger, logoData, logoSettings, hoveredElement, laoAppearance, userAppearance, processedLaoImages, laoVisualType, processedUserImages, userVisualType, showLaoAura, enableAutoHarmonization, harmonizeSettings, laoShadow, userShadow, isFullFrameMode]);



  const {
    startVideoExport,
    cancelVideoExport,
    resetVideoExport,
    handleClearCache
  } = useVideoExporterEngine({
    showToastMsg,
    messages,
    currentSessionId,
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
    isExportingVideo,
    setIsExportingVideo,
    setIsPreparingVideoData,
    setRenderedVideoBlob,
    setRenderedVideoUrl,
    setIsPreviewFullscreen,
    setShowVideoExportModal,
    setShowAiManager,
    setExportTab,
    saveRenderHistoryItem,
    videoExportSource,
    bgUpdateTrigger,
    setBgUpdateTrigger,
    globalAudioUrlRef,
    globalMessageCountRef,
    globalAudioMetadataRef,
    setDiagnosticReport,
    setShowDiagnostics,
    renderDiagnosticsRef,
    ffScenesRef,
    setFfScenes
  });


  const {
    showAutoPilotModal,
    setShowAutoPilotModal,
    apTopics,
    setApTopics,
    apSettings,
    setApSettings,
    apState,
    setApState,
    handleFetchTrendingTopics,
    startAutoPilot,
    stopAutoPilot,
    isGeneratingAITopic,
    setIsGeneratingAITopic
  } = useAutopilot({
    user,
    currentUser,
    userName,
    userGender,
    userAge,
    appLanguage,
    selectedAiConfigIdRef,
    generateVoice,
    showToastMsg,
    startVideoExportRef,
    cancelVideoExport,
    handleClearCache,
    allCharacters,
    applyCharacterPreset,
    setCharOffsets,
    setChatLaoVideos,
    poemDatabase,
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    messages,
    updateCurrentMessages,
    audioQueueRef,
    isPlayingQueueRef,
    activeAudioRef,
    globalAudioRef,
    latestAutoPlayaiMsgIdRef,
    renderPromiseRef,
    presetBackgrounds,
    currentUserPresetId,
    FULLFRAME_PACKS,
    ffScenesRef,
    ffVidRefs
  });

  // BIẾN TOÀN CỤC MỚI: Xác định xem Lão có đang trong một "Phiên nói" (Kể cả khi bị ngắt quãng giữa các câu do mạng)
  const playingMsg = messages.find((m: any) => m.id === currentlyPlayingId) || messages.find((m: any) => m.id === latestAutoPlayaiMsgIdRef.current);
  
  let isLaoSpeakingSession = false;
  if (isGlobalPlaying && globalAudioRef.current) {
      const ct = globalAudioRef.current.currentTime;
      // Dò tìm trên trục thời gian tổng xem phân đoạn hiện tại là của Lão hay Con
      // Mở rộng viền thời gian +- 0.3s để tránh Lão bị khựng giữa các đoạn nối âm thanh
      const segment = globalAudioMetadataRef.current.find((m: any) => ct >= (m.start - 0.3) && ct <= (m.end + 0.3));
      isLaoSpeakingSession = segment ? segment.role === 'ai' : false;
  } else {
      isLaoSpeakingSession = playingMsg?.role === 'ai' && (currentlyPlayingId !== null || isPlayingQueueRef.current);
  }

  function toggleFullscreen() {
    setIsVideoFullscreen(!isVideoFullscreen);
  }

  function handleDownloadVideo() {
    if (!renderedVideoUrl) return;
    const a = document.createElement('a');
    a.href = renderedVideoUrl;
    
    let slug = '';
    if (videoSlug && videoSlug.trim()) {
        slug = videoSlug.trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    } else {
        const currentSession = sessions?.find((s: any) => s.id === currentSessionId);
        if (currentSession && currentSession.title && !currentSession.title.includes('mới')) {
            slug = currentSession.title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-");
        }
    }
    
    if (slug) {
        a.download = `OngLao_${slug}_${Date.now()}.${videoExt || 'webm'}`;
    } else {
        a.download = `OngLao_Video_${Date.now()}.${videoExt || 'webm'}`;
    }
    
    a.click();
  }



  return {
    showVideoExportModal, setShowVideoExportModal,
    videoSlug, setVideoSlug,
    videoAspectRatio, setVideoAspectRatio,
    videoTransition, setVideoTransition,
    videoTransitionDuration, setVideoTransitionDuration,
    chatLaoTransform, setChatLaoTransform,
    showChatLaoControls, setShowChatLaoControls,
    videoResolution, setVideoResolution,
    subtitleSentenceCount, setSubtitleSentenceCount,
    subtitleColor, setSubtitleColor,
    subtitleYPos, setSubtitleYPos,
    subtitleScale, setSubtitleScale,
    isExportingVideo, setIsExportingVideo,
    isPreparingVideoData, setIsPreparingVideoData,
    renderedVideoBlob, setRenderedVideoBlob,
    renderedVideoUrl, setRenderedVideoUrl,
    isVideoFullscreen, setIsVideoFullscreen,
    isPreviewFullscreen, setIsPreviewFullscreen,
    videoExt, setVideoExt,
    exportTab, setExportTab,
    hoveredElement, setHoveredElement,
    enableIntro, setEnableIntro,
    introTitle, setIntroTitle,
    introSubtitle, setIntroSubtitle,
    enableOutroText, setEnableOutroText,
    outroText, setOutroText,
    isFullFrameMode, setIsFullFrameMode,
    EMOTIONS,
    FULLFRAME_PACKS,
    ffScenes, setFfScenes,
    ffSaveData, setFfSaveData,
    showFfSaveModal, setShowFfSaveModal,
    logoData, setLogoData,
    logoSettings, setLogoSettings,
    bgmAudioData, setBgmAudioData,
    bgmVolume, setBgmVolume,
    aiBgmPrompt, setAiBgmPrompt,
    isGeneratingBgm, setIsGeneratingBgm,
    tempAiBgmData, setTempAiBgmData,
    showPresetModal, setShowPresetModal,
    presetFormData, setPresetFormData,
    showDownloadMenu, setShowDownloadMenu,
    showShareMenu, setShowShareMenu,
    localFfPacks, setLocalFfPacks,
    localFfClips, setLocalFfClips,
    showFfSaveModal, setShowFfSaveModal,
    ffSaveData, setFfSaveData,
    showSavePackModal, setShowSavePackModal,
    savePackData, setSavePackData,
    showPresetModal, setShowPresetModal,
    presetFormData, setPresetFormData,
    diagnosticReport, setShowDiagnostics,
    
    // Refs
    ffScenesRef,
    exportCanvasRef,
    logoFileInputRef,
    bgmFileInputRef,
    exportMediaRecorderRef,
    exportAudioCtxRef,
    laoExportVidRefs,
    userExportVidRefs,
    chatLaoDragInfo,
    
    // Functions
    handleChatLaoPointerDown,
    handleChatLaoPointerMove,
    handleChatLaoPointerUp,
    handleChatLaoWheel,
    handleLoadPack,
    handleDeleteFfPack,
    showUploadGuide,
    handleUploadFolder,
    handleCopyFfScenesCode,
    executeSaveFfPack,
    moveFfScene,
    handleSelectFfClipV2,
    handleDeleteFfClipV2,
    handleUploadLogo,
    removeLogo,
    handleGenerateAiBgm,
    removeBgm,
    handleUploadBgm,
    handleClearCache,
    startVideoExport,
    cancelVideoExport,
    resetVideoExport,
    toggleFullscreen,
    handleDownloadVideo,
    handleShareVideoSocial,
    handleSaveVideoConfig,
    renderHistory,
    setRenderHistory,
    saveRenderHistoryItem,
    deleteRenderHistoryItem,
    showDiagnostics,
    handleDeletePreset,
    isGlobalPlaying,
    setIsGlobalPlaying,
    globalProgress,
    setGlobalProgress,
    globalCurrentTime,
    setGlobalCurrentTime,
    globalDuration,
    setGlobalDuration,
    isPreparingGlobal,
    setIsPreparingGlobal,
    toggleGlobalPlay,
    handleGlobalSeek,
    formatTime,
    activeAudioRef,
    isPlayingQueueRef,
    audioQueueRef,
    globalAudioRef,
    stopLipSync,
    emotion,
    setEmotion,
    spellCheckControllersRef,
    spellCheckTimeoutsRef,
    latestAutoPlayaiMsgIdRef,
    showAutoPilotModal,
    setShowAutoPilotModal,
    apTopics,
    setApTopics,
    apSettings,
    setApSettings,
    apState,
    setApState,
    handleFetchTrendingTopics,
    handleGenerateAITopic,
    handleSaveGeneratedScript,
    saveNewSessionWithMessages,
    handleImportScript,
    startAutoPilot,
    stopAutoPilot,
    isGeneratingAITopic,
    setIsGeneratingAITopic,
    videoExportSource,
    setVideoExportSource,
    customBgs,
    setCustomBgs,
    presetBackgrounds,
    activeBgId,
    setActiveBgId,
    DEFAULT_BGM_LIST,
    playingMsg,
    isLaoSpeakingSession,
    globalAudioUrlRef,
    
    // Character saving & offsets
    pastOffsets,
    futureOffsets,
    showSaveCharModal,
    setShowSaveCharModal,
    saveCharData,
    setSaveCharData,
    handleSaveCharacterToLocal,
    executeSaveCharacter,
    characterPresets,
    setCharacterPresets
  };
};

