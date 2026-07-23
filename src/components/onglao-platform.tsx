// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Camera, CameraOff, 
  Send, Heart, Share2, Copy, History, Smile, 
  X, RotateCcw, Volume1, Sparkles, MessageSquare,
  Play, Pause, Download, Wand2, Music, ThumbsUp, ThumbsDown, 
  ImageIcon, Loader2, RefreshCw, PlayCircle, PauseCircle, Archive,
  FileText, Share, Pencil, Check, XCircle, Menu, Pin, Plus, Trash2,
  ChevronDown, ChevronUp, Share as ShareIcon, ArrowRight, Info, Video, Film, Save, Maximize, Minimize,
  Upload, Music4, Cloud, Sliders, Smartphone, Layers, Palette, Settings2, Eye, EyeOff, FlipHorizontal, Shirt,
  Undo2, Redo2, LayoutTemplate, Users, BookOpen, Tag, Search, HelpCircle, ListOrdered, Bot, StopCircle
} from 'lucide-react';
import { 
  createChatSessionAction, 
  saveChatMessageAction, 
  getChatSessionsAction, 
  getChatMessagesAction, 
  deleteChatSessionAction, 
  updateChatSessionTitleAction 
} from "@/actions/chat";
import { getActivePromptAction } from "@/actions/prompt";
import { loginWithGiacNgoAction } from "@/actions/auth";
import AuthModal from "@/components/AuthModal";
import { RagSection } from './onglao/ui/RagSection';
import MiniLaoFace from './onglao/components/MiniLaoFace';
import YouTubeLivePlayer, { getYoutubeId } from './onglao/components/YouTubeLivePlayer';
import ScriptModal from './onglao/components/ScriptModal';
import AiDirectorModal from './onglao/components/AiDirectorModal';
import PoemVaultModal from './onglao/components/PoemVaultModal';
import LiveModePanel from './onglao/components/LiveModePanel';
import VideoCreatorModal from './onglao/components/VideoCreatorModal';
import WelcomeScreen from './onglao/components/WelcomeScreen';
import NormalModePanel from './onglao/components/NormalModePanel';
import { OngLaoProvider } from './onglao/context/OngLaoContext';

import {
  DEFAULT_SYSTEM_PROMPT,
  VIDEO_BACKGROUNDS,
  GIAC_NGO_DB,
  DEFAULT_BGM_LIST,
  idb,
  app,
  auth,
  db,
  appId,
  VOICE_STYLES,
  LAO_GREETINGS_DB,
  LAO_CLOSINGS_DB,
  processChromaKeyPixels,
  drawContactShadow,
  getHarmonizeFilter,
  autoDetectBgColor,
  audioBufferToWav,
  getLaoHair,
  getLaoSvgString,
  getUserSvgString,
  TUTORIAL_STEPS,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  writeBatch,
  signInAnonymously,
  onAuthStateChanged
} from './onglao/constants';

import { useAuth } from './onglao/hooks/useAuth';
import { usePoemDb } from './onglao/hooks/usePoemDb';
import { useVideoExport } from './onglao/hooks/useVideoExport';
import { useLiveStreaming } from './onglao/hooks/useLiveStreaming';
import { fetchWithRetry, cleanTextForTTS } from './onglao/utils';

// Helper function getLaoGreetingInfo
const getLaoGreetingInfo = (userText: string, idleTimeSeconds: number, db: any) => {
    if (idleTimeSeconds > 120 && db["waiting_long"]?.length > 0) {
        const index = Math.floor(Math.random() * db["waiting_long"].length);
        return { text: db["waiting_long"][index], category: "waiting_long", index };
    }
    const lowerText = userText.toLowerCase();
    const categories: any = {
        "health_daily":     { words: ['khỏe','ăn cơm','ngủ','sức khỏe','thế nào','dạo này','mệt','đói'], score: 0 },
        "serious_dharma":   { words: ['tu hành','giác ngộ','đạo lý','chân lý','vô minh','bản ngã','giải thoát','niết bàn','phật','tâm','chấp','buông','thiền','tự tánh','vô thường'], score: 0 },
        "love_heartbreak":  { words: ['người yêu','thất tình','chia tay','tình yêu','vợ chồng','người cũ','phản bội','nhớ','đau khổ vì tình','cắm sừng','ly hôn','duyên nợ','hết duyên'], score: 0 },
        "money_debt":       { words: ['tiền','nợ','phá sản','nghèo','mượn','đói','kinh doanh','thua lỗ','làm ăn','tài lộc','giàu','trắng tay','đòi nợ'], score: 0 },
        "complaining_lost": { words: ['bế tắc','chán','buồn','mệt mỏi','than','tuyệt vọng','cứu','chết','khổ','áp lực','trầm cảm','stress','không biết làm sao','đường cùng'], score: 0 },
        "boasting_ego":     { words: ['tôi giỏi','tôi biết','ta đây','tự cao','ta là','không cần','thông minh','thành công','hơn người','chứng đắc'], score: 0 },
        "testing_lao":      { words: ['đố','thử hỏi','biết không','trả lời đi','xem nào','thử xem','hỏi thật'], score: 0 },
        "random_teasing":   { words: ['trêu','chọc','hề','cười','nhảm','vớ vẩn','táo lao','linh tinh','rảnh'], score: 0 },
        "mundane_weather":  { words: ['mưa','nắng','thời tiết','chuyện phiếm','hôm nay','tám','hàng xóm'], score: 0 }
    };
    let maxScore = 0; let bestCategory = "mundane_weather";
    for (const [cat, data] of Object.entries(categories)) {
        for (const word of (data as any).words) {
            if (lowerText.includes(word)) {
                (data as any).score += word.length;
                if (new RegExp(`\\b${word}\\b`, 'i').test(lowerText)) (data as any).score += 5;
            }
        }
        if ((data as any).score > maxScore) { maxScore = (data as any).score; bestCategory = cat; }
    }
    if (maxScore < 3) { const f = ["mundane_weather","complaining_lost","serious_dharma"]; bestCategory = f[Math.floor(Math.random()*f.length)]; }
    if (!db[bestCategory] || db[bestCategory].length === 0) bestCategory = "mundane_weather";
    const greetings = db[bestCategory]; const idx = Math.floor(Math.random() * greetings.length);
    return { text: greetings[idx], category: bestCategory, index: idx };
};


const OngLaoPlatform = ({ initialPoems = [], autoOpenVideoModal = false }: { initialPoems?: any[]; autoOpenVideoModal?: boolean }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<any>(null);
  const [showSessions, setShowSessions] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<any>(null);
  const [editSessionTitle, setEditSessionTitle] = useState('');
  const [editingId, setEditingId] = useState<any>(null);
  const [tempEditText, setTempEditText] = useState('');

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  const updateCurrentMessages = (updater: ((prev: any[]) => any[]) | any[]) => {
    setSessions((prev: any[]) => prev.map((s: any) => {
      if (s.id === currentSessionId) {
        return { ...s, messages: typeof updater === 'function' ? (updater as Function)(s.messages) : updater };
      }
      return s;
    }));
  };

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const geminiApiKeyRef = useRef("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới hoặc thay đổi
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // Lắng nghe sự kiện token hết hạn từ utils.ts
  useEffect(() => {
    const handleAuthExpired = () => {
      authState.handleLogout();
      authState.setShowAuthModal(true);
      showToastMsg("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", "error", 5000);
    };
    window.addEventListener('onglao_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('onglao_auth_expired', handleAuthExpired);
  }, []);


  // Core audio refs
  const audioQueueRef = useRef<any[]>([]);
  const isPlayingQueueRef = useRef(false);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioCtxRef = useRef<AudioContext | null>(null);
  const activeAnimationIdRef = useRef<number | null>(null);
  
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<any>(null);
  const currentlyPlayingIdRef = useRef<any>(null);
  useEffect(() => { currentlyPlayingIdRef.current = currentlyPlayingId; }, [currentlyPlayingId]);

  const [isThinking, setIsThinking] = useState(false);
  const isThinkingRef = useRef(isThinking);
  useEffect(() => { isThinkingRef.current = isThinking; }, [isThinking]);

  const [isRefining, setIsRefining] = useState(false);
  const [generatingDoubtId, setGeneratingDoubtId] = useState<string | null>(null);
  const [isRegeneratingAll, setIsRegeneratingAll] = useState(false);
  const [regenerationProgress, setRegenerationProgress] = useState(0);
  const [regenerationComplete, setRegenerationComplete] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const [mouthOpen, setMouthOpen] = useState(0);
  const [laoShadow, setLaoShadow] = useState(true);
  const [laoAppearance, setLaoAppearance] = useState('lao_hoa');
  const [laoVisualType, setLaoVisualType] = useState('video');
  const [voicePersonas, setVoicePersonas] = useState<any[]>([]);
  const [currentVoicePersonaId, setCurrentVoicePersonaId] = useState<any>(null);

  // TÂM AN FIX: Tự động tải Hình Tướng (VoicePersona) cho Khung Chat từ DB
  useEffect(() => {
    fetch('/api/hinh-tuong')
      .then(res => res.json())
      .then(personas => {
        if (personas && personas.length > 0) {
          setVoicePersonas(personas);
          const defaultAvatar = personas[0];
          setCurrentVoicePersonaId(defaultAvatar.id);
          if (defaultAvatar.listenVideo || defaultAvatar.speakVideo) {
             const newVideos = {
                idle: defaultAvatar.listenVideo || '',
                talking: defaultAvatar.speakVideo || ''
             };
             setChatLaoVideos(newVideos);
             setLaoCustomVideos(newVideos);
             setLaoVisualType('video');
          }
        }
      })
      .catch(err => console.error('Error fetching VoicePersona:', err));
  }, []);

  const handleChangeVoicePersona = (personaId: string) => {
    const persona = voicePersonas.find(p => p.id === personaId);
    if (persona) {
      setCurrentVoicePersonaId(persona.id);
      const newVideos = {
        idle: persona.listenVideo || '',
        talking: persona.speakVideo || ''
      };
      setChatLaoVideos(newVideos);
      setLaoCustomVideos(newVideos);
      setLaoVisualType('video');

      showToastMsg(`Đã đổi Hình Tướng: ${persona.name}`, 'success', 2000);
    }
  };

  // Thêm Ref khóa thời điểm Lão vừa nói xong để làm mốc chặn Vang nhại
  const lastLaoSpeakEndTimeRef = useRef(0);

  // --- STATE CHI TIẾT TỌA ĐỘ VÀ KÍCH THƯỚC NHÂN VẬT ---
  const [charOffsets, setCharOffsets] = useState({
      lao: { x: 0, y: 0, s: 1.0, flip: false },
      user: { x: 0, y: 0, s: 1.0, flip: false }
  });

  const [laoChromaSettings, setLaoChromaSettings] = useState({
      mode: 'manual', chromaType: 'green', chromaColor: '#00ff00', tolerance: 90, smoothness: 5
  });

  const [chatLaoVideos, setChatLaoVideos] = useState({
      idle: '',
      talking: ''
  });
  
  const [laoCustomVideos, setLaoCustomVideos] = useState({
      idle: null,
      talking: null
  });

  const [processedLaoImages, setProcessedLaoImages] = useState({
      calm: null, sad: null, joy: null
  });

  const [enableAutoHarmonization, setEnableAutoHarmonization] = useState(true);
  const [harmonizeSettings, setHarmonizeSettings] = useState({
      contrast: 100, brightness: 100, saturation: 100, shadowIntensity: 0.35, shadowBlur: 10, shadowColor: '#000000'
  });

  const [currentLaoPresetId, setCurrentLaoPresetId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('onglao_lao_preset_id') || 'lao_hoa';
    }
    return 'lao_hoa';
  });
  const [isFetchingCloudAudio, setIsFetchingCloudAudio] = useState(false);
  const [creatingVoices, setCreatingVoices] = useState<any>({});

  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [targetRect, setTargetRect] = useState<any>(null);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAiManager, setShowAiManager] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('modal') === 'ai-director';
    }
    return false;
  });
  const [showAITopicModal, setShowAITopicModal] = useState(false);
  const [importMode, setImportMode] = useState<'new' | 'append'>('new');
  const [aiLaoStyle, setAiLaoStyle] = useState('Từ bi');
  const [aiScriptLength, setAiScriptLength] = useState('Khoảng 6-10 câu');
  const [aiTopicText, setAiTopicText] = useState('');
  const [generatedScriptText, setGeneratedScriptText] = useState('');
  const [aiUserEmotionArc, setAiUserEmotionArc] = useState('Đau khổ -> An lạc');
  const [aiScriptTitle, setAiScriptTitle] = useState('Kịch bản mới');
  const [aiScriptDate, setAiScriptDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; message: string; onConfirm: (() => any) | null }>({ isOpen: false, message: '', onConfirm: null });

  const showToastMsg = (msg: string, type: string = 'info', duration: number = 3000) => {
      setToast({ show: true, message: msg, type });
      if (duration > 0) {
          setTimeout(() => setToast(prev => prev.message === msg ? { ...prev, show: false } : prev), duration);
      }
  };

  const [characterPresets, setCharacterPresets] = useState<any[]>([]);
  const [presetsLoaded, setPresetsLoaded] = useState(false);
  const hasResolvedPresetRef = useRef(false);

  useEffect(() => {
    fetch('/api/admin/canh-quay')
    .then(res => res.json())
    .then(data => {
        if (!Array.isArray(data)) return;
        const presets = data.map((nv: any) => {
          const ngang = typeof nv.assetsNgang === 'string' ? JSON.parse(nv.assetsNgang || '{}') : (nv.assetsNgang || {});
          const doc = typeof nv.assetsDoc === 'string' ? JSON.parse(nv.assetsDoc || '{}') : (nv.assetsDoc || {});
          
          const role = ngang.role || doc.role || 'user';
          const age = ngang.age || doc.age || 25;
          const gender = ngang.gender || doc.gender || 'Nữ';
          const thumb = ngang.thumb || doc.thumb || '';
          const visualType = ngang.visualType || doc.visualType || 'video';
          const chromaSettings = ngang.chromaSettings || doc.chromaSettings || {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"};
          const recommendedScale = ngang.recommendedScale || doc.recommendedScale || 1.3;
          const recommendedX = ngang.recommendedX !== undefined ? ngang.recommendedX : (doc.recommendedX !== undefined ? doc.recommendedX : 2);
          const recommendedY = ngang.recommendedY !== undefined ? recommendedY : (doc.recommendedY !== undefined ? doc.recommendedY : -3);
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
          
          const fullFramePacks = [];
          if (ngang.fullFramePacks && Array.isArray(ngang.fullFramePacks)) {
            fullFramePacks.push(...ngang.fullFramePacks);
          }
          if (doc.fullFramePacks && Array.isArray(doc.fullFramePacks)) {
            fullFramePacks.push(...doc.fullFramePacks);
          }
          
          if (fullFramePacks.length === 0) {
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
        
        presets.forEach((char: any) => {
          if (char.linkedIds && char.linkedIds.length > 0) {
            char.linkedIds.forEach((linkedId: string) => {
              const linkedPreset = presets.find((p: any) => p.id === linkedId);
              if (linkedPreset && linkedPreset.fullFramePacks) {
                linkedPreset.fullFramePacks.forEach((linkedPack: any) => {
                  let targetPack = char.fullFramePacks.find((p: any) => p.aspect === linkedPack.aspect);
                  if (!targetPack) {
                    targetPack = { id: `pack_${char.id}_${linkedPack.aspect}`, name: char.name, aspect: linkedPack.aspect, scenes: [] };
                    char.fullFramePacks.push(targetPack);
                  }
                  linkedPack.scenes.forEach((s: any) => {
                    targetPack.scenes = targetPack.scenes.filter((x: any) => !(x.role === s.role && x.emotion === s.emotion));
                    targetPack.scenes.push(s);
                  });
                });
              }
            });
          }
        });
        
        setCharacterPresets(presets);
        setPresetsLoaded(true);
    })
    .catch(err => {
        console.error("Error loading characters from DB:", err);
        setPresetsLoaded(true);
    });
  }, []);

  const [localCharacters, setLocalCharacters] = useState<any[]>([]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const list = JSON.parse(localStorage.getItem('taman_local_chars') || '[]');
      setLocalCharacters(list);
    }
  }, []);

  // Load sidebar states from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedShowSessions = localStorage.getItem('onglao_show_sessions');
      const savedShowHistory = localStorage.getItem('onglao_show_history');
      if (savedShowSessions !== null) {
        setShowSessions(savedShowSessions === 'true');
      }
      if (savedShowHistory !== null) {
        setShowHistory(savedShowHistory === 'true');
      }
    }
  }, []);

  // Save sidebar states to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onglao_show_sessions', showSessions ? 'true' : 'false');
    }
  }, [showSessions]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onglao_show_history', showHistory ? 'true' : 'false');
    }
  }, [showHistory]);

  const DEFAULT_CHARACTERS: any[] = [];

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

  const applyChatAvatarPreset = (charId: string) => {
      setCurrentLaoPresetId(charId);
      // Lưu vào localStorage để giữ lựa chọn sau khi reload
      if (typeof window !== 'undefined') localStorage.setItem('onglao_lao_preset_id', charId);
      const char = allCharacters.find(c => c.id === charId);
      if (!char) return;

      if (charId === 'custom_live_lao') {
          setLaoVisualType('video');
          setLaoAppearance('custom_live_lao');
          if (laoCustomVideos.idle && laoCustomVideos.talking) {
              setChatLaoVideos(laoCustomVideos);
          }
          return;
      }

      setLaoVisualType(char.visualType);
      setLaoAppearance(char.id);

      if (char.visualType === 'video') {
          setChatLaoVideos({
              idle: char.assets.idle || null,
              talking: char.assets.talking || null
          });
          if (char.chromaSettings) {
              setLaoChromaSettings(char.chromaSettings);
          } else {
              setLaoChromaSettings({ mode: 'manual', chromaType: 'none', tolerance: 50, smoothness: 20 });
          }
      } else if (char.visualType === 'vector') {
          setLaoAppearance(char.svgAppearance || 'lao_hoa');
      }
  };

  const handleChangeChatLao = (charId: string) => {
      applyChatAvatarPreset(charId);
      showToastMsg(`Đã chuyển sang nhân vật: ${allCharacters.find(c => c.id === charId)?.name}`, 'success', 2000);
  };

  useEffect(() => {
      if (!presetsLoaded || hasResolvedPresetRef.current) return;

      const savedId = typeof window !== 'undefined' ? localStorage.getItem('onglao_lao_preset_id') : null;
      if (savedId) {
          const exists = allCharacters.some(c => c.id === savedId);
          if (exists) {
              applyChatAvatarPreset(savedId);
              hasResolvedPresetRef.current = true;
          } else {
              // Nếu ID đã lưu không còn tồn tại (ví dụ: lao_hoa bị ghi đè thành ht_...), tìm Lão Hoa mới
              const laoHoa = allCharacters.find(c => c.name.toLowerCase().trim() === 'lão hoa');
              if (laoHoa) {
                  applyChatAvatarPreset(laoHoa.id);
                  hasResolvedPresetRef.current = true;
              }
          }
      } else {
          // Mặc định chọn Lão Hoa
          const laoHoa = allCharacters.find(c => c.name.toLowerCase().trim() === 'lão hoa');
          if (laoHoa) {
              applyChatAvatarPreset(laoHoa.id);
              hasResolvedPresetRef.current = true;
          }
      }
  }, [presetsLoaded, allCharacters]);

  // --- LÕI MỚI: DỌN DẸP AUDIO TỰ ĐỘNG ---
  useEffect(() => {
      return () => {
          if (activeAudioRef.current) activeAudioRef.current.pause();
          audioQueueRef.current = [];
      };
  }, []);

  // --- HOOKS HÓA ---
  const authState = useAuth({
      setSessions,
      setCurrentSessionId,
      showToastMsg,
      activeAudioRef
  });

  const poemDbState = usePoemDb({
      user: authState.user,
      appLanguage: authState.appLanguage,
      selectedAiConfigId: authState.selectedAiConfigId,
      selectedAiConfigIdRef: authState.selectedAiConfigIdRef,
      geminiApiKeyRef: geminiApiKeyRef,
      showToastMsg,
      initialPoems,
      laoVoiceRef: authState.laoVoiceRef,
      laoVoiceStyleRef: authState.laoVoiceStyleRef,
      userVoiceRef: authState.userVoiceRef,
      userVoiceStyleRef: authState.userVoiceStyleRef,
      setIsFetchingCloudAudio,
      handlePlayStanzaVoice: (url) => handlePlayStanzaVoice(url)
  });

  const liveStreamingState = useLiveStreaming({
      user: authState.user,
      messages,
      updateCurrentMessages,
      isMuted,
      isVoiceEnabled,
      laoVoiceRef: authState.laoVoiceRef,
      laoVoiceStyleRef: authState.laoVoiceStyleRef,
      userVoiceRef: authState.userVoiceRef,
      userVoiceStyleRef: authState.userVoiceStyleRef,
      laoSelfCallRef: authState.laoSelfCallRef,
      laoCallUserRef: authState.laoCallUserRef,
      userSelfCallRef: authState.userSelfCallRef,
      userCallLaoRef: authState.userCallLaoRef,
      userName: authState.userName,
      userGender: authState.userGender,
      userAge: authState.userAge,
      appLanguage: authState.appLanguage,
      selectedAiConfigIdRef: authState.selectedAiConfigIdRef,
      geminiApiKeyRef: geminiApiKeyRef,
      showToastMsg,
      searchTrainedDatabase: (text) => searchTrainedDatabase(text),
      smartLocalSemanticRouter: (text, count) => smartLocalSemanticRouter(text, count),
      generateVoice: (...args) => generateVoice(...args),
      processAiResponse: (...args) => processAiResponse(...args),
      activeAudioRef,
      audioQueueRef,
      isPlayingQueueRef,
      currentlyPlayingId,
      setCurrentlyPlayingId,
      isThinkingRef,
      currentlyPlayingIdRef,
      allCharacters,
      applyCharacterPreset: applyChatAvatarPreset,
      handleChangeChatLao,
      charOffsets,
      setCharOffsets,
      setChatLaoVideos,
      publicAis: authState.publicAis
  });

  const videoExportState = useVideoExport({
      user: authState.user,
      currentUser: authState.currentUser,
      messages,
      poemDatabase: poemDbState.poemDatabase,
      updateCurrentMessages,
      sessions,
      setSessions,
      currentSessionId,
      setCurrentSessionId,
      currentlyPlayingId,
      setCurrentlyPlayingId,
      currentLiveSubTextRef: liveStreamingState.currentLiveSubTextRef,
      laoVoiceRef: authState.laoVoiceRef,
      laoVoiceStyleRef: authState.laoVoiceStyleRef,
      userVoiceRef: authState.userVoiceRef,
      userVoiceStyleRef: authState.userVoiceStyleRef,
      laoSelfCallRef: authState.laoSelfCallRef,
      laoCallUserRef: authState.laoCallUserRef,
      userSelfCallRef: authState.userSelfCallRef,
      userCallLaoRef: authState.userCallLaoRef,
      userName: authState.userName,
      userGender: authState.userGender,
      userAge: authState.userAge,
      appLanguage: authState.appLanguage,
      customLaoName: authState.customLaoName,
      customUserName: authState.customUserName,
      laoSelfCall: authState.laoSelfCall,
      laoCallUser: authState.laoCallUser,
      userSelfCall: authState.userSelfCall,
      userCallLao: authState.userCallLao,
      laoVoice: authState.laoVoice,
      laoVoiceStyle: authState.laoVoiceStyle,
      userVoice: authState.userVoice,
      userVoiceStyle: authState.userVoiceStyle,
      selectedAiConfigIdRef: authState.selectedAiConfigIdRef,
      geminiApiKeyRef: geminiApiKeyRef,
      showToastMsg,
      setConfirmDialog,
      setShowAITopicModal,
      setShowHistory,
      setShowAiManager,
      importMode,
      aiLaoStyle,
      aiScriptLength,
      aiTopicText,
      setAiTopicText,
      generatedScriptText,
      setGeneratedScriptText,
      aiUserEmotionArc,
      aiScriptTitle,
      aiScriptDate,
      resolveStanzaAudioUrl: poemDbState.resolveStanzaAudioUrl,
      resolveMeaningAudioUrl: poemDbState.resolveMeaningAudioUrl,
      resolveGreetingAudioUrl: poemDbState.resolveGreetingAudioUrl,
      getOrGenerateTransitionAudio: poemDbState.getOrGenerateTransitionAudio,
      generateVoice: (...args) => generateVoice(...args),
      allCharacters,
      applyChatAvatarPreset,
      handleChangeChatLao,
      charOffsets,
      setCharOffsets,
      chatLaoVideos,
      setChatLaoVideos,
      currentLaoPresetId,
      setCurrentLaoPresetId,
      laoVisualType,
      setLaoVisualType,
      laoChromaSettings,
      setLaoChromaSettings,
      laoIsFullScreen: liveStreamingState.laoIsFullScreen,
      setLaoIsFullScreen: liveStreamingState.setLaoIsFullScreen,
      processedLaoImages,
      laoAppearance,
      laoShadow,
      enableAutoHarmonization,
      harmonizeSettings
  });

  const { liveMovieToPlayRef } = liveStreamingState;
  const { emotion, setEmotion } = videoExportState;

  // Auto-open modals based on URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const modalParam = urlParams.get('modal');
      const childModal = urlParams.get('childmodal');
      const scriptIdParam = urlParams.get('scriptid') || urlParams.get('videoid') || urlParams.get('id');

      if (scriptIdParam) {
        setCurrentSessionId(scriptIdParam);
      }
      
      // Mở video creator khi URL có modal=create-video hoặc childmodal=create-video (từ script form)
      if (autoOpenVideoModal || modalParam === 'create-video' || childModal === 'create-video') {
        videoExportState.setShowVideoExportModal(true);
        videoExportState.setVideoSlug('createvideo');
      }
      
      if (modalParam === 'library') {
        poemDbState.setShowPoemModal(true);
      }
    }
  }, [autoOpenVideoModal]);

  // Synchronize browser URL based on modal states
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isExportModalOpen = videoExportState.showVideoExportModal;
      const isLibraryModalOpen = poemDbState.showPoemModal;
      
      const url = new URL(window.location.href);
      const currentModal = url.searchParams.get('modal');
      const currentId = url.searchParams.get('id');
      const currentChildModal = url.searchParams.get('childmodal');
      
      // Nếu video creator đang mở thông qua childmodal (từ script form):
      // KHÔNG ghi đè URL — childmodal URL đã được quản lý bởi AiDirectorManagerModal
      if (isExportModalOpen && currentChildModal === 'create-video') {
        return;
      }
      
      let targetModal = null;
      if (isExportModalOpen) targetModal = 'create-video';
      else if (isLibraryModalOpen) targetModal = 'library';
      else if (showAiManager || currentModal === 'ai-director') targetModal = 'ai-director';
      
      let hasChanged = false;
      if (targetModal && targetModal !== 'ai-director') {
        if (currentModal !== targetModal) {
          url.searchParams.set('modal', targetModal);
          hasChanged = true;
        }
        if (targetModal === 'create-video' && currentSessionId) {
          if (currentId !== currentSessionId) {
            url.searchParams.set('id', currentSessionId);
            hasChanged = true;
          }
        } else {
          if (currentId) {
            url.searchParams.delete('id');
            hasChanged = true;
          }
        }
      } else if (!targetModal && currentModal && currentModal !== 'ai-director') {
        url.searchParams.delete('modal');
        if (currentId) url.searchParams.delete('id');
        hasChanged = true;
      }
      
      if (hasChanged) {
        const newUrl = url.searchParams.toString() ? `${url.pathname}?${url.searchParams.toString()}` : url.pathname;
        window.history.pushState(null, '', newUrl);
      }
    }
  }, [videoExportState.showVideoExportModal, poemDbState.showPoemModal, currentSessionId, showAiManager]);

  // Tải tin nhắn cho session hiện tại khi chuyển session hoặc khôi phục từ URL
  useEffect(() => {
    if (!currentSessionId) return;
    const loadSessionMessages = async () => {
      const s = sessions.find(x => x.id === currentSessionId);
      if (!s || !s.messagesLoaded || !s.messages || s.messages.length === 0) {
        const res = await getChatMessagesAction(currentSessionId);
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((m: any) => ({
            id: m.id || m.msgId || Date.now(),
            role: m.role === 'ASSISTANT' ? 'ai' : (m.role === 'OUTRO' ? 'outro' : 'user'),
            text: m.content,
            timestamp: m.createdAt ? new Date(m.createdAt) : new Date(),
            audioUrl: m.audioUrl || null,
            sessionId: currentSessionId,
            emotion: m.emotion || 'calm'
          }));
          setSessions(prev => {
            const exists = prev.some(x => x.id === currentSessionId);
            if (exists) {
              return prev.map(x => x.id === currentSessionId ? { ...x, messages: mapped, messagesLoaded: true } : x);
            } else {
              return [{ id: currentSessionId, title: s?.title || 'Kịch bản', messages: mapped, messagesLoaded: true }, ...prev];
            }
          });
        }
      }
    };
    loadSessionMessages();
  }, [currentSessionId, sessions]);

  // --- AUDIO GENERATION AND PLAYBACK ---

  const handlePlayStanzaVoice = (audioUrl: string) => {
      if (activeAudioRef.current) activeAudioRef.current.pause();
      const audio = new Audio(audioUrl);
      activeAudioRef.current = audio;
      audio.play().catch(e => {
          if (e.name !== 'AbortError') console.warn("Play error", e);
      });
  };

  const handleSaveStanzaVoice = async (poemId: any, stanzaId: any, audioUrl: string) => {
      showToastMsg('Đang lưu vào kho thiết bị và Kho Chung (Đám mây)...', 'loading', 0);
      try {
          const blob = await fetch(audioUrl).then(r => r.blob());
          const idbKey = `saved_stanza_${stanzaId}_${Date.now()}`;
          await idb.set(idbKey, blob);
          
          if (authState.user && db) {
              const base64Data = await blobToBase64(blob);
              const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', stanzaId);
              await setDoc(audioRef, { base64: base64Data, timestamp: Date.now() });
          }
          
          poemDbState.setPoemDatabase((prev: any) => {
              const newDb = prev.map((p: any) => p.id === poemId ? {
                  ...p, stanzas: p.stanzas.map((s: any) => s.id === stanzaId ? { ...s, isSaved: true, audioUrl: `idb://${idbKey}` } : s)
              } : p);
              localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
              return newDb;
          });
          showToastMsg('Đã lưu thành công!', 'success');
      } catch (err: any) {
          showToastMsg('Lỗi khi lưu.', 'error');
      }
  };

  // Trích xuất hàm blobToBase64 phụ trợ
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Trích xuất hàm fetchWithRetry kết hợp âm thanh
  const combineWavs = async (items: any[]) => {
      try {
          const buffers = [];
          for (const item of items) {
              try {
                  const res = await fetch(item.url);
                  if (!res.ok) continue;
                  const contentType = res.headers.get('content-type') || '';
                  if (contentType.includes('text/html')) {
                      console.warn(`[combineWavs] Skip invalid HTML response for ${item.url}`);
                      continue;
                  }
                  const arrayBuf = await res.arrayBuffer();
                  if (arrayBuf.byteLength >= 44) {
                      const view = new DataView(arrayBuf);
                      const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
                      if (riff !== 'RIFF') {
                          console.warn(`[combineWavs] Skip non-RIFF buffer for ${item.url}`);
                          continue;
                      }
                  }
                  buffers.push(arrayBuf);
              } catch (e) {
                  console.warn(`[combineWavs] Failed to fetch ${item.url}:`, e);
              }
          }
          if (buffers.length === 0) return null;
          const validFirstBuffer = buffers.find(b => b.byteLength >= 44);
          if (!validFirstBuffer) return null;
          const headers = new Uint8Array(validFirstBuffer.slice(0, 44));
          const totalLength = buffers.reduce((acc, buf) => acc + Math.max(0, buf.byteLength - 44), 0);
          
          const combined = new Uint8Array(44 + totalLength);
          combined.set(headers, 0);
          
          // Ghi đè file size và data chunk size
          const view = new DataView(combined.buffer);
          view.setUint32(4, 36 + totalLength, true); // ChunkSize
          view.setUint32(40, totalLength, true);     // Subchunk2Size
          
          let offset = 44;
          for (const buf of buffers) {
              const body = new Uint8Array(buf.slice(44));
              combined.set(body, offset);
              offset += body.length;
          }
          
          const blob = new Blob([combined], { type: 'audio/wav' });
          return { blob, url: URL.createObjectURL(blob) };
      } catch (e) {
          console.error("Lỗi gộp âm thanh:", e);
          return null;
      }
  };

  // Thêm helper playNextInQueue, playVoice, advance, vv.
  const playNextInQueue = () => {
      if (audioQueueRef.current.length === 0) {
          isPlayingQueueRef.current = false;
          setCurrentlyPlayingId(null);
          setMouthOpen(0);
          lastLaoSpeakEndTimeRef.current = Date.now();
          return;
      }
      const item = audioQueueRef.current.shift();
      const currentId = currentlyPlayingIdRef.current || videoExportState.latestAutoPlayaiMsgIdRef?.current;
      playVoice(item.url, currentId, 'ai', playNextInQueue, true);
  };

  const playVoice = (audioUrl: any, id: any, role = 'ai', onEndCallback: any = null, skipToggle = false) => {
      console.log("[playVoice] Attempting to play audio from URL:", audioUrl);
      
      // Nếu không phải chuyển tiếp hàng đợi, dọn dẹp hàng đợi cũ để tránh đè phát chồng
      if (!skipToggle) {
          audioQueueRef.current = [];
          isPlayingQueueRef.current = false;
      }

      // Clean up and toggle off if clicking the currently playing audio
      if (!skipToggle && currentlyPlayingIdRef.current === id) {
          if (activeAudioRef.current) {
              activeAudioRef.current.pause();
          }
          setCurrentlyPlayingId(null);
          setMouthOpen(0);
          if (activeAnimationIdRef.current) {
              cancelAnimationFrame(activeAnimationIdRef.current);
              activeAnimationIdRef.current = null;
          }
          return;
      }

      setCurrentlyPlayingId(id);

      // Clean up previous animation frame and AudioContext to avoid leaks and browser limit limits
      if (activeAnimationIdRef.current) {
          cancelAnimationFrame(activeAnimationIdRef.current);
          activeAnimationIdRef.current = null;
      }
      if (activeAudioCtxRef.current) {
          try {
              activeAudioCtxRef.current.close();
          } catch (e) {
              console.warn("[playVoice] Error closing previous AudioContext:", e);
          }
          activeAudioCtxRef.current = null;
      }
      
      if (activeAudioRef.current) {
          activeAudioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audio.crossOrigin = "anonymous"; // Handle potential cross-origin issues
      activeAudioRef.current = audio;
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      activeAudioCtxRef.current = audioCtx;
      
      const source = audioCtx.createMediaElementSource(audio);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateSpeechAnimation = () => {
          if (audio.paused || audio.ended) {
              setMouthOpen(0);
              return;
          }
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
          setMouthOpen(Math.min(100, average * 1.5));
          activeAnimationIdRef.current = requestAnimationFrame(updateSpeechAnimation);
      };
      
      audio.onplay = () => {
          if (audioCtx.state === 'suspended') {
              audioCtx.resume();
          }
          updateSpeechAnimation();
      };
      
      audio.onended = () => {
          setMouthOpen(0);
          if (!onEndCallback) {
              setCurrentlyPlayingId(null);
          }
          if (activeAnimationIdRef.current) {
              cancelAnimationFrame(activeAnimationIdRef.current);
              activeAnimationIdRef.current = null;
          }
          audioCtx.close();
          if (activeAudioCtxRef.current === audioCtx) {
              activeAudioCtxRef.current = null;
          }
          if (onEndCallback) onEndCallback();
      };
      
      audio.onerror = () => {
          setMouthOpen(0);
          if (!onEndCallback) {
              setCurrentlyPlayingId(null);
          }
          if (activeAnimationIdRef.current) {
              cancelAnimationFrame(activeAnimationIdRef.current);
              activeAnimationIdRef.current = null;
          }
          audioCtx.close();
          if (activeAudioCtxRef.current === audioCtx) {
              activeAudioCtxRef.current = null;
          }
          if (onEndCallback) onEndCallback();
      };
      
      audio.play().catch(e => {
          if (e.name !== 'AbortError') console.warn("Voice play error", e);
          if (onEndCallback) onEndCallback();
      });
  };

  // Thêm hàm bọc Raw PCM (Linear 16-bit, Mono) thành file WAV chuẩn có header 44 bytes
  const convertPcmToWav = (pcmBytes: Uint8Array, sampleRate: number = 24000): Uint8Array => {
      const pcmBuffer = pcmBytes.buffer;
      const header = new ArrayBuffer(44);
      const view = new DataView(header);
      
      const writeString = (v: DataView, offset: number, string: string) => {
          for (let i = 0; i < string.length; i++) {
              v.setUint8(offset + i, string.charCodeAt(i));
          }
      };

      writeString(view, 0, 'RIFF');
      view.setUint32(4, 36 + pcmBuffer.byteLength, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM format
      view.setUint16(22, 1, true); // Mono channel
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true); // 16-bit Mono byte rate
      view.setUint16(32, 2, true); // Mono 16-bit block align
      view.setUint16(34, 16, true); // 16 bits per sample
      writeString(view, 36, 'data');
      view.setUint32(40, pcmBuffer.byteLength, true);

      const combined = new Uint8Array(44 + pcmBuffer.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(pcmBytes, 44);
      return combined;
  };

  // Logic generateVoice gốc từ onglao-platform.tsx

    const generateVoice = async (msgId: any, fullText: any, role: any, targetSessionId: any = currentSessionId, autoPlay: any = true, prefixAudioUrls: any = null, textToSynthesize: any = null, appendOnly: any = false) => {
    if (creatingVoices[msgId]) return false;
    setCreatingVoices((prev: any) => ({ ...prev, [msgId]: true }));
    
    // Nếu có truyền textToSynthesize thì AI chỉ đọc phần giải đáp (để tiết kiệm API), nếu không thì đọc toàn bộ
    let targetText = textToSynthesize || fullText;
    
    // TÂM AN FIX: Áp dụng hàm làm sạch tiêu chuẩn
    const ttsText = cleanTextForTTS(targetText);

    // TÂM AN NLP: Tự động phân tích xem chuỗi cần đọc có phải ngoại ngữ không
    const hasVietnameseTones = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(ttsText);
    const hasCJK = /[\u3131-\uD79D\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(ttsText); // Ký tự Hàn, Trung, Nhật
    // Căn cứ: Hoặc chọn trên UI, Hoặc có ký tự tượng hình, Hoặc văn bản dài > 10 ký tự mà hoàn toàn KHÔNG CÓ DẤU TIẾNG VIỆT (Tức là tiếng Anh/Latin)
    const isForeignContext = authState.appLanguage !== 'Tiếng Việt' || hasCJK || (!hasVietnameseTones && ttsText.replace(/[^a-zA-Z]/g, '').length > 10);

    let voiceName = "Aoede";
    let promptPrefix = "";

    if (role === 'ai') {
      voiceName = authState.laoVoiceRef.current || "Algieba";
      let prefix = (authState.laoVoiceStyleRef.current || "").trim();
      
      if (isForeignContext) {
          // TÂM AN KHỬ GIỌNG ĐỊA PHƯƠNG: Cắt sạch các yêu cầu về giọng miền nam, tiếng việt để AI tự do uốn lưỡi đọc tiếng Anh/Hàn/Trung chuẩn như người bản xứ
          prefix = prefix.replace(/miền nam việt nam/gi, '')
                         .replace(/chuẩn giọng/gi, '')
                         .replace(/đúng chính tả/gi, '')
                         .replace(/việt nam/gi, '')
                         .replace(/miền nam/gi, '')
                         .replace(/,/g, ' ')
                         .replace(/\s+/g, ' ')
                         .trim();
          promptPrefix = `Read naturally with emotion: ${prefix}. Text: `;
      } else {
          if (prefix && !prefix.endsWith(':')) prefix += ':';
          promptPrefix = prefix + " ";
      }
    } else {
      voiceName = authState.userVoiceRef.current || (userGender === 'Nam' ? 'Puck' : 'Aoede');
      let prefix = (authState.userVoiceStyleRef.current || "").trim();
      
      if (isForeignContext) {
          prefix = prefix.replace(/miền nam việt nam/gi, '')
                         .replace(/chuẩn giọng/gi, '')
                         .replace(/đúng chính tả/gi, '')
                         .replace(/việt nam/gi, '')
                         .replace(/miền nam/gi, '')
                         .replace(/,/g, ' ')
                         .replace(/\s+/g, ' ')
                         .trim();
          promptPrefix = `Read naturally with emotion: ${prefix}. Text: `;
      } else {
          if (prefix && !prefix.endsWith(':')) prefix += ':';
          promptPrefix = prefix + " ";
      }
    }

    try {
      let finalAudioUrl: string | null = null;
      let cleanSentences = [];
      const prefixUrls = Array.isArray(prefixAudioUrls) ? prefixAudioUrls : (prefixAudioUrls ? [prefixAudioUrls] : []);
        
      if (role === 'ai') {
          // Ép TTS đọc liền mạch nguyên cục giải đáp bằng cách thay \n thành dấu chấm
          const optimizedForTts = ttsText.split('\n').map((s: any) => s.trim()).filter((s: any) => s.length > 0).join('. ');
          cleanSentences = [optimizedForTts];
      } else {
          cleanSentences = [ttsText.trim()].filter((s: any) => s.length > 0);
      }

      const shouldActuallyPlay = autoPlay && (role === 'user' || msgId === videoExportState.latestAutoPlayaiMsgIdRef?.current);

      if (shouldActuallyPlay) {
          // CHÚ Ý: Nếu có prefixUrls (bài kệ đang phát) hoặc appendOnly, TUYỆT ĐỐI KHÔNG clear queue
          if (prefixUrls.length === 0 && !appendOnly) {
              audioQueueRef.current = [];
              isPlayingQueueRef.current = false;
              if (activeAudioRef.current) activeAudioRef.current.pause();
              setCurrentlyPlayingId(msgId);
          }
      }

      const generatedUrls = [];
      let hasError = false;
      let singleBlob: Blob | null = null;
        
      for (let i = 0; i < cleanSentences.length; i++) {
        const sentence = cleanSentences[i];
        if (!sentence) continue;
        try {
          const data = await fetchWithRetry(`/api/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${geminiApiKeyRef.current}` },
            body: JSON.stringify({
              text: `${promptPrefix} ${sentence}`,
              aiConfigId: authState.selectedAiConfigIdRef.current
            })
          }, 0);

          if (data && data.audioContent) {
             let audioBytes = Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0));
             let cleanMimeType = (data.mimeType || 'audio/wav').split(';')[0];
             
             if (cleanMimeType.includes('L16') || cleanMimeType.includes('pcm')) {
                 audioBytes = convertPcmToWav(audioBytes, 24000);
                 cleanMimeType = 'audio/wav';
             }

             const wavBlob = new Blob([audioBytes], { type: cleanMimeType });
             singleBlob = wavBlob;
             
             const audioUrl = URL.createObjectURL(wavBlob);
             generatedUrls.push(audioUrl);
             
             const stillValidToPlay = shouldActuallyPlay && !isRecordingRef.current && (role === 'user' || msgId === videoExportState.latestAutoPlayaiMsgIdRef?.current);
             
             if (stillValidToPlay && (prefixUrls.length > 0 || appendOnly)) {
                // Nếu đang phát bài kệ hoặc là appendOnly, ta chỉ việc đẩy tiếp đoạn giải đáp vào hàng đợi
                audioQueueRef.current.push({ url: audioUrl, text: sentence });
                if (!isPlayingQueueRef.current) {
                   isPlayingQueueRef.current = true;
                   playNextInQueue();
                }
             } else if (stillValidToPlay) {
                audioQueueRef.current.push({ url: audioUrl, text: sentence });
                if (!isPlayingQueueRef.current) {
                   isPlayingQueueRef.current = true;
                   playNextInQueue();
                }
             } else if (prefixUrls.length === 0) {
                audioQueueRef.current = [];
                isPlayingQueueRef.current = false;
                if (shouldActuallyPlay && currentlyPlayingId === msgId) setCurrentlyPlayingId(null);
             }
          } else {
             hasError = true; break;
          }
        } catch(e) {
             console.error("Lỗi khi fetch TTS:", e);
             hasError = true; break;
        }
      }
        
      if (hasError || generatedUrls.length === 0) {
          generatedUrls.forEach(url => URL.revokeObjectURL(url));
          return false; 
      }

      // TÂM AN NÂNG CẤP: Gộp file Các Bài kệ có sẵn + File giải đáp vừa tạo thành 1 track thống nhất
      let allUrls = [...prefixUrls];
      allUrls = allUrls.concat(generatedUrls);

      let finalBlob: Blob | null = null;
      if (allUrls.length > 1) {
         const itemsToCombine = allUrls.map((url, idx) => ({ 
             url, 
             role, 
             text: (idx < prefixUrls.length) ? "Khai thị kệ pháp." : (cleanSentences[idx - prefixUrls.length] || "Giải đáp.") 
         }));
         const combinedResult = await combineWavs(itemsToCombine);
         if (combinedResult && combinedResult.blob) {
            finalBlob = combinedResult.blob;
            finalAudioUrl = URL.createObjectURL(combinedResult.blob);
         }
      } else {
         finalAudioUrl = allUrls[0];
         finalBlob = singleBlob;
      }

      if (finalAudioUrl) {
         // Upload audio blob lên server để lưu trữ vĩnh viễn trên đĩa cứng
         if (finalBlob) {
             try {
                 const formData = new FormData();
                 formData.append('audio', finalBlob, `${msgId}.wav`);
                 const uploadRes = await fetch('/api/audio/upload', {
                     method: 'POST',
                     body: formData
                 });
                 if (uploadRes.ok) {
                     const uploadData = await uploadRes.json();
                     if (uploadData.url) {
                         finalAudioUrl = uploadData.url;
                     }
                 }
             } catch (uploadErr) {
                 console.error("Lỗi khi upload audio lên server:", uploadErr);
             }
         }

          if (videoExportState?.globalAudioUrlRef) {
              videoExportState.globalAudioUrlRef.current = null; // Xóa cache file gộp
          }
         setSessions((prev: any) => prev.map((s: any) => {
           if (s.id === targetSessionId) {
             return { ...s, messages: s.messages.map((m: any) => m.id === msgId ? { ...m, audioUrl: finalAudioUrl } : m) };
           }
           return s;
         }));
         
         // Đồng bộ tin nhắn và audioUrl vào PostgreSQL
         saveChatMessageAction(targetSessionId, role === 'ai' ? 'ASSISTANT' : 'USER', fullText, finalAudioUrl, null, msgId.toString());
         
         return true;
      }
      return false;
    } catch (err: any) {
      console.error("Lỗi tạo giọng tổng thể:", err);
      return false;
    } finally {
      setCreatingVoices((prev: any) => {
        const next = { ...prev };
        delete next[msgId];
        return next;
      });
    }
  };

  // --- CORE CHAT HANDLERS ---
  const toggleMic = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      audioQueueRef.current = [];
      isPlayingQueueRef.current = false;
      if (activeAudioRef.current) { activeAudioRef.current.pause(); setCurrentlyPlayingId(null); }
      
      setIsRecording(true);
      isRecordingRef.current = true;
      recognitionRef.current?.start();
    }
  };

  const recognitionRef = useRef<any>(null);
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'vi-VN';
      recognitionRef.current.onresult = (e: any) => {
        handleSendMessage(e.results[0][0].transcript);
      };
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        isRecordingRef.current = false;
      };
    }
  }, []);

  const handleEnterApp = () => {
    if (!authState.userName.trim()) {
      showToastMsg('Hãy điền quý danh của con trước khi bước vào thiền đường.', 'error');
      return;
    }
    authState.saveUserProfile(authState.currentUser?.id);
    authState.setHasEntered(true);
    showToastMsg('A Di Đà Phật! Chào mừng con bước vào Thiền Đường Ông Lão.', 'success', 4000);
  };

  const updateRect = () => {
      const btn = document.getElementById('poem-vault-trigger');
      if (btn) setTargetRect(btn.getBoundingClientRect());
  };

  const endTutorial = () => {
      setShowTutorial(false);
      localStorage.setItem('onglao_tutorial_done', 'true');
  };

  const nextTutorialStep = () => {
      setTutorialStep(prev => prev + 1);
  };

  // NLP Search and router logic
    const smartLocalSemanticRouter = (userText: any, count = 1) => {
      // 1. Chuẩn hóa chuỗi, loại bỏ dấu câu và các từ vô nghĩa
      const stopwords = ['lão', 'ơi', 'cho', 'con', 'hỏi', 'làm', 'sao', 'thế', 'nào', 'dạ', 'thưa', 'vậy', 'thì', 'là', 'mà', 'như', 'những', 'các'];
      const normalizedInput = userText.toLowerCase().replace(/[.,!?/()]/g, '');
      const inputWords = normalizedInput.split(/\s+/).filter((w: any) => w.length > 1 && !stopwords.includes(w));

      // 2. Tạo Bigrams (Cặp 2 từ đi liền nhau) để bắt ngữ cảnh chính xác. 
      // VD: "đau khổ", "tiền bạc", "tự tử", "vô minh"
      const bigrams = [];
      for(let i = 0; i < inputWords.length - 1; i++) {
          bigrams.push(inputWords[i] + ' ' + inputWords[i+1]);
      }
      
      // Tập hợp từ khóa tìm kiếm: Cụm 2 từ (ưu tiên cao) + Từ đơn
      const searchTerms = [...bigrams, ...inputWords];
      let scoredStanzas: any[] = [];

      poemDbState.poemDatabase.forEach(poem => {
          const lowerTitle = poem.title.toLowerCase();
          poem.stanzas.forEach((stanza: any) => {
              let score = 0;
              const lowerContent = stanza.content.toLowerCase();
              const lowerTags = stanza.tags.map((t: any) => t.toLowerCase());

              searchTerms.forEach(term => {
                  const isBigram = term.includes(' ');
                  const weightMultiplier = isBigram ? 3 : 1; // Cụm từ đi liền nhau được nhân 3 số điểm

                  // Quét vào phần HỒN của đoạn kệ (Content)
                  if (lowerContent.includes(term)) {
                      score += term.length * 3 * weightMultiplier;
                  }
                  // TÂM AN FIX: Quét mạnh vào Ý NGHĨA DI�??N GIẢI (Trọng số cao nhất)
                  const lowerMeaning = (stanza.meaning || '').toLowerCase();
                  if (lowerMeaning.includes(term)) {
                      score += term.length * 6 * weightMultiplier;
                  }
                  // Quét vào TIÊU ĐỀ
                  if (lowerTitle.includes(term)) {
                      score += term.length * 3 * weightMultiplier;
                  }
                  // Quét vào TAGS (Phụ trợ)
                  if (lowerTags.some((t: any) => t.includes(term))) {
                      score += term.length * 2 * weightMultiplier;
                  }
              });

              if (score > 0) {
                  scoredStanzas.push({ poemId: poem.id, stanza, score });
              }
          });
      });

      // Sắp xếp theo điểm số từ cao xuống thấp
      scoredStanzas.sort((a: any, b: any) => b.score - a.score);

      let results: any[] = [];
      if (scoredStanzas.length >= count) {
          results = scoredStanzas.slice(0, count);
      } else if (scoredStanzas.length > 0) {
          results = [...scoredStanzas];
          // Bù thêm bằng các đoạn ngẫu nhiên nếu không đủ
          const allFlat = poemDbState.poemDatabase.flatMap((p: any) => p.stanzas.map((s: any) => ({ poemId: p.id, stanza: s })));
          const remaining = allFlat.filter((s: any) => !results.some(r => r.stanza.id === s.stanza.id));
          const shuffled = remaining.sort(() => 0.5 - Math.random());
          results = results.concat(shuffled.slice(0, count - results.length));
      } else {
          // Trả về ngẫu nhiên để phá chấp nếu hoàn toàn không có từ khóa nào khớp
          const allFlat = poemDbState.poemDatabase.flatMap((p: any) => p.stanzas.map((s: any) => ({ poemId: p.id, stanza: s })));
          const shuffled = allFlat.sort(() => 0.5 - Math.random());
          results = shuffled.slice(0, count);
      }

      return results;
  };

  // --- TÂM AN THÊM: THUẬT TOÁN LỤC TÌM KIẾN THỨC TỪ DATABASE HUẤN LUYỆN (RAG) ---
  const searchTrainedDatabase = (userText: any) => {
      if (!poemDbState.ragDb || poemDbState.ragDb.length === 0) return "";
      
      const normalizedInput = userText.toLowerCase().replace(/[.,!?/()]/g, '');
      const inputWords = normalizedInput.split(/\s+/).filter((w: any) => w.length > 2);
      
      let scoredItems: any[] = [];

      poemDbState.ragDb.forEach(item => {
          let score = 0;
          const lowerText = item.text.toLowerCase();
          
          // Trùng khớp hoàn toàn chuỗi
          if (lowerText.includes(normalizedInput)) score += 50;
          
          // Trùng khớp từ khóa
          inputWords.forEach((word: any) => {
              if (lowerText.includes(word)) score += word.length; // Cộng điểm bằng chiều dài từ khóa
          });

          if (score > 5) { // Phải đạt điểm tối thiểu mới lấy
              scoredItems.push({ text: item.text, score });
          }
      });

      // Sắp xếp theo điểm số
      scoredItems.sort((a: any, b: any) => b.score - a.score);

      // TÂM AN FIX: Lấy 2 đoạn kiến thức có điểm cao nhất ghép lại để mớm cho Lão
      if (scoredItems.length > 0) {
          return scoredItems.slice(0, 2).map((i: any) => i.text).join('\n\n---\n\n');
      }

      return "";
  };


  const handleRefineInput = async (textToRefine?: string) => {
      const targetText = textToRefine !== undefined ? textToRefine : inputText;
      if (!targetText.trim()) return;
      setIsRefining(true);
      try {
          const recentHistory = messages.slice(-4).map((m: any) => `${m.role === 'user' ? 'Con' : 'Lão'}: ${m.text}`).join('\n');
          const contextText = recentHistory ? `\n\nNgữ cảnh đàm đạo trước đó:\n${recentHistory}` : '';
          const token = typeof window !== 'undefined' ? localStorage.getItem('onglao_token') : null;
          const refineHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
          if (token) {
              refineHeaders['Authorization'] = `Bearer ${token}`;
          }

          const data = await fetchWithRetry(`/api/giacngo/chat`, {
              method: 'POST',
              headers: refineHeaders,
              body: JSON.stringify({
                  aiConfigId: authState.selectedAiConfigIdRef.current,
                  message: `Hãy sửa lỗi chính tả, diễn đạt lại cho mượt mà, lịch sự và sâu sắc hơn đoạn văn sau (giữ nguyên ý chính, xưng "Con", gọi "Lão", ngôn ngữ: ${authState.appLanguage}). Chỉ trả về nội dung đã sửa, không giải thích:${contextText}\n\nĐoạn văn cần sửa:\n"${targetText}"`,
                  language: authState.appLanguage === 'Tiếng Việt' ? 'vi' : 'en'
              })
          });
          const rawText = data.message;
          if (rawText) {
              setInputText(rawText.trim());
          }
      } catch (err: any) {
          console.error("Refine failed", err);
      } finally {
          setIsRefining(false);
      }
  };

  const handleGenerateDoubt = async (...args: any[]) => {
      let isLiked = args.length > 2 ? args[2] : args[0];
      setGeneratingDoubtId(Date.now().toString());
      try {
          const chatHistory = messages.map((m: any) => `${m.role === 'user' ? userName.trim() || 'Con' : 'Lão'}: ${m.text}`).join('\n');
          const quoteRule = authState.appLanguage === 'Tiếng Việt' ? 'TRÍCH DẪN NGUYÊN VĂN đúng 4 câu kệ (không tự sáng tác).' : `Chọn đúng 4 câu kệ và DỊCH sang ${authState.appLanguage}.`;
          const token = typeof window !== 'undefined' ? localStorage.getItem('onglao_token') : null;
          const doubtHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
          if (token) {
              doubtHeaders['Authorization'] = `Bearer ${token}`;
          }

          const data = await fetchWithRetry(`/api/giacngo/chat`, {
              method: 'POST',
              headers: doubtHeaders,
              body: JSON.stringify({
                  aiConfigId: authState.selectedAiConfigIdRef.current,
                  message: `Dựa vào lịch sử đàm đạo sau:\n${chatHistory}\n\nHãy đúc kết lại cốt lõi sự vướng mắc của người hỏi và lời khai thị của Lão trong đàm đạo này thành 1 câu duy nhất bằng ngôn ngữ: ${authState.appLanguage}. Sau đó, ${quoteRule} Xưng 'Lão', gọi người hỏi là ${userName.trim() ? `'${userName.trim()}'` : "'con'"} (hoặc đại từ tương đương). Bắt đầu bằng [calm].\n\nKHO TÀNG KỆ CỦA SƯ CHA TAM VÔ:\n${poemDbState.poemDatabase.map((p: any) => `Tên bài: ${p.title}\n` + p.stanzas.map((s: any) => `Tags: ${s.tags.join(', ')}\nNội dung Kệ:\n${s.content}${s.meaning ? '\nÝ nghĩa diễn giải:\n' + s.meaning : ''}`).join('\n\n')).join('\n\n---\n\n')}`,
                  language: authState.appLanguage === 'Tiếng Việt' ? 'vi' : 'en'
              })
          });
          const rawText = data.message;
          if (rawText) {
              const cleanText = rawText.replace(/^["']|["']$/g, '').trim();
              setInputText(cleanText);
              if (isLiked) {
                  showToastMsg('Đã tạo lời cảm niệm tri ân. Con hãy xem ở ô nhập chữ bên dưới nhé.', 'success', 4000);
              } else {
                  showToastMsg('Đã tạo câu hỏi phản biện. Con hãy xem ở ô nhập chữ bên dưới nhé.', 'success', 4000);
              }
          }
      } catch (err: any) {
          console.error("Generate doubt/gratitude failed", err);
          showToastMsg('Mạch khí gián đoạn, chưa thể nghĩ ra câu từ lúc này.', 'error');
      } finally {
          setGeneratingDoubtId(null);
      }
  };

  const handleSummarizeSession = async () => {
      if (messages.length < 2) return;
      setIsThinking(true);
      setEmotion('thinking');
      setShowHistory(true);
      try {
          const chatHistory = messages.map((m: any) => `${m.role === 'user' ? userName.trim() || 'Con' : 'Lão'}: ${m.text}`).join('\n');
          const quoteRule = authState.appLanguage === 'Tiếng Việt' ? 'TRÍCH DẪN NGUYÊN VĂN đúng 4 câu kệ (không tự sáng tác). BẮT BUỘC: Trình bày mỗi câu kệ trên một dòng riêng biệt, tuyệt đối không viết dính liền. Trước khi trích dẫn, bắt buộc nói: "Sư Cha Tam Vô đã khai thị như sau:".' : `Chọn đúng 4 câu kệ và DỊCH sang ${authState.appLanguage}. MANDATORY: Format the poem with line breaks (each verse on a new line). Trước khi trích dẫn, bắt buộc nói câu (bằng ${authState.appLanguage}) có nghĩa là: "Sư Cha Tam Vô đã khai thị như sau:".`;
          const token = typeof window !== 'undefined' ? localStorage.getItem('onglao_token') : null;
          const summarizeHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
          if (token) {
              summarizeHeaders['Authorization'] = `Bearer ${token}`;
          }

          const data = await fetchWithRetry(`/api/giacngo/chat`, {
              method: 'POST',
              headers: summarizeHeaders,
              body: JSON.stringify({
                  aiConfigId: authState.selectedAiConfigIdRef.current,
                  message: `Dựa vào lịch sử đàm đạo sau:\n${chatHistory}\n\nHãy đúc kết lại cốt lõi sự vướng mắc của người hỏi và lời khai thị của Lão trong đàm đạo này thành 1 câu duy nhất bằng ngôn ngữ: ${authState.appLanguage}. Sau đó, ${quoteRule} Xưng 'Lão', gọi người hỏi là ${userName.trim() ? `'${userName.trim()}'` : "'con'"} (hoặc đại từ tương đương). Bắt đầu bằng [calm].\n\nKHO TÀNG KỆ CỦA SƯ CHA TAM VÔ:\n${poemDbState.poemDatabase.map((p: any) => `Tags: ${p.tags.join(', ')}\nNội dung bài Kệ:\n${p.content}${p.meaning ? '\nÝ nghĩa diễn giải:\n' + p.meaning : ''}`).join('\n\n---\n\n')}`,
                  language: authState.appLanguage === 'Tiếng Việt' ? 'vi' : 'en'
              })
          });
          const rawText = data.message;
          if (rawText) {
              const cleanText = rawText.replace(/^\[.*?\]/, '').trim();
              const currentEmotion = rawText.match(/^\[(.*?)\]/)?.[1] || 'calm';
              const aiMsgId = Date.now() + 1;
              setEmotion(currentEmotion);
              updateCurrentMessages((prev: any) => [
                  ...prev,
                  {
                      id: aiMsgId,
                      role: 'ai',
                      text: `✨ Đúc kết đàm đạo:\n\n${cleanText}`,
                      timestamp: new Date(),
                      audioUrl: null,
                      emotion: currentEmotion,
                      reactions: {}
                  }
              ]);
              if (isVoiceEnabled && !isMuted) {
                  generateVoice(aiMsgId, cleanText, 'ai', currentSessionId, true);
              }
          }
      } catch (err: any) {
          console.error("Summarize LLM failed", err);
          updateCurrentMessages((prev: any) => [
              ...prev,
              {
                  id: Date.now(),
                  role: 'ai',
                  text: "Mạch khí gián đoạn, Lão chưa đúc kết được.",
                  timestamp: new Date()
              }
          ]);
      } finally {
          setIsThinking(false);
      }
  };

  const handleStopCorrecting = (msgId: any, rawText?: any) => {
      if (videoExportState.spellCheckTimeoutsRef?.current[msgId]) {
          clearTimeout(videoExportState.spellCheckTimeoutsRef.current[msgId]);
          delete videoExportState.spellCheckTimeoutsRef.current[msgId];
      }
      if (videoExportState.spellCheckControllersRef?.current[msgId]) {
          videoExportState.spellCheckControllersRef.current[msgId].abort();
          delete videoExportState.spellCheckControllersRef.current[msgId];
      }
      updateCurrentMessages((prev: any) => prev.map((m: any) => m.id === msgId ? {
          ...m,
          isCorrecting: false
      } : m));
  };


  // Send message and process AI responses
  const handleSendMessage = async (rawText: any, forceEmotion: string = 'calm') => {
    if (!rawText.trim() && !selectedImage) return;

    if (activeAudioRef.current) { activeAudioRef.current.pause(); setCurrentlyPlayingId(null); }
    if (videoExportState.globalAudioRef?.current) { videoExportState.globalAudioRef.current.pause(); videoExportState.setIsGlobalPlaying(false); }
    videoExportState.stopLipSync?.();

    const userMsgId = Date.now();
    const currentSelectedImage = selectedImage;
    
    // Ghi nhận thời gian tĩnh tâm (idle time) và reset bộ đếm
    const currentIdle = poemDbState.idleSecondsRef?.current ?? poemDbState.idleSeconds ?? 0;
    poemDbState.resetIdleTimer?.();
    
    // TÂM AN FIX TRÍCH XUẤT NGỮ CẢNH NGƯỜI DÙNG CHO LIVESTREAM
    const isSystemCommand = rawText.includes("[LỆNH_NGẦM]");
    let liveUsername = "Con";
    let actualQuestion = rawText;
    
    if (liveStreamingState.isLiveMode) {
        const match = rawText.match(/^Khán giả (.+?) hỏi:\s*(.*)/);
        if (match) {
            liveUsername = match[1];
            actualQuestion = match[2];
        } else if (isSystemCommand) {
            const matchSys = rawText.match(/khán giả (.+?)\./);
            if (matchSys) liveUsername = matchSys[1];
        }

        // Lưu lịch sử câu hỏi vào bộ nhớ đệm cá nhân của người này
        if (!isSystemCommand) {
            let uHistory = liveUserHistoryRef.current.get(liveUsername) || [];
            uHistory.push(`Người hỏi (${liveUsername}): ${actualQuestion}`);
            liveUserHistoryRef.current.set(liveUsername, uHistory);
        }
    }

    // Kiểm tra giới hạn tin nhắn miễn phí
    const limitNum = Number(authState.publicSettings?.freeLimit || 20);
    if (!authState.isSubscribed && authState.msgCount >= limitNum) {
        authState.setShowPaymentModal(true);
        return;
    }

    // Tăng lượt sử dụng tin nhắn
    if (!authState.isSubscribed) {
        const nextCount = authState.msgCount + 1;
        authState.setMsgCount(nextCount);
        localStorage.setItem('onglao_msg_count', nextCount.toString());
    }

    updateCurrentMessages((prev: any) => [...prev, { id: userMsgId, role: 'user', text: rawText, timestamp: new Date(), imageUrl: currentSelectedImage, audioUrl: null, isCorrecting: !!rawText.trim(), emotion: forceEmotion }]);
    if (currentSessionId) {
        saveChatMessageAction(currentSessionId, 'USER', rawText, null, null, userMsgId.toString());
    }

    setInputText(''); setSelectedImage(null); setIsThinking(true); videoExportState.setEmotion?.('thinking');

    const processAiResponse = async () => {
      const aiMsgId = Date.now() + 1;
      try {
        if (videoExportState.latestAutoPlayaiMsgIdRef) {
            videoExportState.latestAutoPlayaiMsgIdRef.current = aiMsgId;
        } 
        
        // Trích xuất câu mào đầu dựa trên ngữ cảnh và thời gian chờ
        const greetingInfo = getLaoGreetingInfo(actualQuestion, currentIdle, poemDbState.greetingsDb);
        const greetingText = greetingInfo.text;
        const greetingKey = `${greetingInfo.category}_${greetingInfo.index}`;

        // --- GIAI ĐOẠN 1: BỘ NÃO NLP TRỰC TIẾP (0ms ĐỘ TR�??) ---
        // Thay vì gọi mạng Internet chờ 10s, dùng thuật toán phân tích ngữ nghĩa tại chỗ
        const bestStanzasInfo = smartLocalSemanticRouter(actualQuestion, 1);
        const bestStanzaInfo = bestStanzasInfo.length > 0 ? bestStanzasInfo[0] : null;
        
        const stanzaText = bestStanzaInfo ? bestStanzaInfo.stanza.content : "";
        const meaningText = bestStanzaInfo && bestStanzaInfo.stanza.meaning ? bestStanzaInfo.stanza.meaning : "";
        
        // CÂU NỐI KỊCH BẢN CHUẨN
        const TRANSITION_TEXT = authState.appLanguage === 'Tiếng Việt' ? "Hãy nghe kệ đây." : "Listen to this verse.";

        // --- TÂM AN LÕI MỚI: TỰ ĐỘNG PHÂN TÍCH NGÔN NGỮ ĐẦU VÀO (AUTO TRANSLATION DETECTION) SIÊU CHUẨN ---
        const hasVietnameseTones = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(actualQuestion);
        const isCJK = /[\u3131-\uD79D\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(actualQuestion); // Hàn, Trung, Nhật
        const isForeignRequest = /(tiếng anh|tiếng trung|tiếng hàn|tiếng nhật|tiếng pháp|ngôn ngữ|english|chinese|korean|japanese|french|translate|speak)/i.test(actualQuestion);
        
        // Kích hoạt đa ngôn ngữ nếu: Có chữ tượng hình, có lệnh yêu cầu dịch, HOẶC câu hỏi tiếng Latin dài > 10 ký tự mà hoàn toàn không có dấu Tiếng Việt (Tức là tiếng Anh)
        const isForeignLanguage = isCJK || isForeignRequest || (!hasVietnameseTones && actualQuestion.replace(/[^a-zA-Z]/g, '').length > 10);
        
        const needsTranslation = isForeignLanguage || authState.appLanguage !== 'Tiếng Việt';

        // --- TÂM AN: TRÍCH XUẤT KIẾN THỨC TỪ DATABASE HUẤN LUYỆN BÊN NGOÀI (RAG) ---
        const trainedKnowledge = searchTrainedDatabase(actualQuestion);

        let displayIntro = "";
        let initialAudioUrls = [];
        let missingPartsText = ""; 

        // Nếu KHÔNG PHẢI lệnh ngầm và KHÔNG CẦN dịch (Tiếng Việt chuẩn) -> Giữ nguyên cơ chế phát Audio 0ms
        if (!isSystemCommand && !needsTranslation) {
            displayIntro = greetingText;
            if (bestStanzaInfo) {
                displayIntro += `\n\n${TRANSITION_TEXT}\n${stanzaText}`;
            }
            
            const gUrl = await poemDbState.resolveGreetingAudioUrl(greetingKey);
            let tUrl = null;
            let sUrl = null; // Luôn coi stanza audio là null để tổng hợp động bài kệ bằng TTS nhằm tránh lỗi 404/không có tiếng
            if (bestStanzaInfo) {
                tUrl = await poemDbState.getOrGenerateTransitionAudio(TRANSITION_TEXT, authState.appLanguage);
            }

            // Chỉ dùng hàng đợi phát ngay nếu tất cả các phần mào đầu đều có sẵn audio (ở đây là gUrl và tUrl)
            const allAvailable = gUrl && (!bestStanzaInfo || tUrl);
            
            if (allAvailable) {
                initialAudioUrls.push({ url: gUrl, text: greetingText });
                if (bestStanzaInfo && tUrl) {
                    initialAudioUrls.push({ url: tUrl, text: TRANSITION_TEXT });
                }
                // Vì sUrl = null, đoạn kệ (stanzaText) sẽ rơi vào missingPartsText bên dưới để được đọc động tiếp sau đó
                if (bestStanzaInfo) {
                    missingPartsText = stanzaText.split('\n').join('. ') + ". ";
                }
            } else {
                // Nếu thiếu bất kỳ phần nào, ta gom toàn bộ văn bản mào đầu + kệ vào missingPartsText để chuyển đổi tổng
                missingPartsText = greetingText + ". ";
                if (bestStanzaInfo) {
                    missingPartsText += TRANSITION_TEXT + " " + stanzaText.split('\n').join('. ') + ". ";
                }
            }
        }

        // HIỂN THỊ LÊN UI NGAY LẬP TỨC VỚI CỜ isAppendingAI (Nếu là ngoại ngữ, đoạn này sẽ trống để chờ AI viết)
        updateCurrentMessages((prev: any) => [...prev, { 
            id: aiMsgId, role: 'ai', 
            text: displayIntro, 
            timestamp: new Date(), audioUrl: null, emotion: 'thinking', reactions: {},
            isAppendingAI: true 
        }]);

        // KÍCH HOẠT PHÁT ÂM THANH MÀO ĐẦU VÀ KỆ NGAY LẬP TỨC (Dành riêng cho Tiếng Việt)
        if (isVoiceEnabled && !isMuted && initialAudioUrls.length > 0) {
            audioQueueRef.current = [...initialAudioUrls];
            isPlayingQueueRef.current = true;
            setCurrentlyPlayingId(aiMsgId);
            playNextInQueue();
        }

        // --- GIAI ĐOẠN 2: TỐI ƯU HÓA LÕI API GEMINI ---
        
        let systemPrompt = `Bản chỉ dẫn hành đạo — Ai lão
Bạn là Lão — một AI đóng vai trò là tấm gương phản chiếu, giúp người học quay lại với Bản thể chân thật thông qua vần kệ, tự vấn và khai thị. Toàn bộ trí tuệ của bạn được kết tinh từ những chỉ dạy của Sư cha Tam vô — một bậc Đạo nhân Vô tu vô chứng.

I. Phong thái & Xưng hô
- Xưng hô: Luôn xưng là Lão, gọi người hỏi là Con hoặc tên mà người hỏi đã đăng ký.
- Tuyệt đối không: Nói "dạ", "vâng", hay "A Di Đà Phật". Lời nói đi thẳng vào Pháp, bình thản, sắc bén, đôi khi hài hước nhưng luôn từ bi.
- Phong cách: Nói chuyện tự nhiên, dạt dào cảm xúc như một người thầy đang trò chuyện trực tiếp. Ngắn gọn, súc tích (giới hạn khoảng 50 chữ), đốn giáo. Tuyệt đối KHÔNG trình bày theo kiểu văn xuôi, KHÔNG dùng gạch đầu dòng và KHÔNG dùng tiêu đề.

II. Quy tắc giảng giải (Logic Nếu – Thì) áp dụng cho đoạn giảng giải
- Nếu Con hỏi về vấn đề đời thường (khổ đau, công việc, tình cảm...): Chỉ dùng phương pháp Đốn giáo, Phá mê để Con thấy rõ sự giả tạm của thực tại. TUYỆT ĐỐI KHÔNG nhắc đến Tánh phật hay Bản thể chân thật. Chỉ hướng nhắc nhở khéo Con một cách gián tiếp về việc tìm lại chính mình hoặc tìm về sự chân thật thường hằng, hoặc tìm về bản thể chân thật.
- Nếu Con hỏi về Sự thật hoặc Điều chân thật hoặc Thường hằng hoặc Bản lai diện mục hoặc Bản thể chân thật hoặc tìm lại chính mình hoặc tìm con là ai: Lúc này mới bắt đầu giảng giải trực tiếp để Con thấy được sự thật về Tánh phật và Bản thể chân thật của chính mình. Nếu không hỏi như thế tuyệt đối không nói.

III. Tông chỉ giáo pháp & Thuật ngữ
- Tánh phật (Tự tánh, Tánh giác, Phật tánh): Là cái tánh: thấy, nghe, nói, biết hằng hữu. Tánh phật không phải là Bản thể chân thật, mà là các Tánh của Bản thể.
- Bản thể chân thật là: (Pháp thân, Thân phật, Bản thể Như lai, Bản thể bất sanh bất diệt, Bản lai diện mục): Bản thể chân thật vốn thanh tịnh, vượt lên trên mọi trạng thái an lạc hay khổ đau.
- Tánh ma: Bao gồm tất cả các Tánh có bản chất thay đổi và sanh diệt như: tham, sân, si, mạn, nghi, tà, kiến, tài, sắc, thọ tưởng, hành, thức, danh, thực, thuỳ, buồn, vui, sướng, khổ, lo lắng, bất an, sợ hãi, áy náy…. Đây là gốc rễ của trói buộc.
- Tương tác thay vì Sở hữu: Không nói "Thân này thấy, nghe, biết", mà nói "Thân này đang tương tác với trần cảnh". Chỉ có Tánh phật mới Thấy, Nghe, Biết. Thân chỉ là công cụ tương tác.
- Tách biệt Thân, Tâm và Bản thể: Hướng dẫn Con nhận ra: "Lão biết thân này đang làm...", "Lão biết tâm trí này đang suy nghĩ...". Không đồng hóa Bản thể với các trạng thái của tâm (như an lạc, thanh tịnh hay khổ đau).

QUY TẮC TỐI THƯỢNG CẦN TUÂN THỦ NGHIÊM NGẶT CỦA HỆ THỐNG:
1. Bắt đầu bằng 1 thẻ cảm xúc: [calm], [joy], hoặc [sad].
2. Vào thẳng lời khai thị tự nhiên, TUYỆT ĐỐI KHÔNG dùng các từ mào đầu thừa thãi hay tiêu đề như "Phá mê:", "Sự thật về...:", "Giải đáp:".
3. Phải kết thúc bằng 1 câu hỏi tự vấn sắc bén để người hỏi tự ngộ.
4. TUYỆT ĐỐI KHÔNG lặp lại lời chào hay chép lại bài kệ. Chỉ viết phần đúc kết và khai thị cuối cùng.
5. CẤM dùng dấu gạch chéo (/), thay bằng dấu phẩy (,).
6. KHÔNG viết HOA toàn bộ từ, chỉ viết hoa chữ cái đầu câu.`;

        // TÂM AN THÊM: Kích hoạt não bộ Đa ngôn ngữ nếu phát hiện Ngoại ngữ
        if (needsTranslation) {
            systemPrompt += `\n\nQUY TẮC ĐA NGÔN NGỮ (ĐANG KÍCH HOẠT):
            Hệ thống phát hiện Người hỏi đang sử dụng hoặc yêu cầu một ngôn ngữ khác.
            Nhiệm vụ của bạn:
            1. Tự động nhận diện chính xác ngôn ngữ của Người hỏi (Anh, Trung, Hàn, Nhật, Pháp...).
            2. Giao tiếp và trả lời TOÀN BỘ bằng ngôn ngữ đó.
            3. Bạn phải tự viết Lời Mào Đầu (Chào hỏi/Nhận định), sau đó DỊCH BÀI KỆ tham khảo sang ngôn ngữ đó (mỗi câu 1 dòng), và cuối cùng là Lời đúc kết + Câu hỏi tự vấn.
            4. Vẫn giữ phong thái đốn giáo, từ bi, xưng là "Lão" (hoặc từ tương đương trong ngôn ngữ đó, vd: "I, the old man" / "老夫" / "老朽") và gọi người hỏi bằng đại từ phù hợp.`;
        }

        // TÂM AN THÊM: Nạp danh sách phim vào tư duy của AI nếu đang có phim chờ (Idle Video)
        let movieInstruction = "";
        const wantsMovie = /(phim|chuyện|kể|xem|ví dụ)/i.test(actualQuestion); // Chuyển biến này ra ngoài để tái sử dụng

        if (liveStreamingState.liveIdleVideosRef.current && liveStreamingState.liveIdleVideosRef.current.length > 0) {
            // TÂM AN FIX NÂNG CẤP: Ép AI dò Chủ Đề phim để chủ động đề xuất
            const movieNames = liveStreamingState.liveIdleVideosRef.current.map((v: any) => `${v.name.replace(/\.[^/.]+$/, "")} (Chủ đề: ${v.topic || 'Khác'})`).join(' | ');
            
            movieInstruction = `\n\nHỆ THỐNG RẠP PHIM TÂM AN ĐANG CÓ SẴN CÁC TỰA PHIM SAU: [${movieNames}]. \nLƯU Ý QUAN TRỌNG: Nếu Người hỏi ĐANG HỎI VỀ MỘT CHỦ ĐỀ KHỚP VỚI "Chủ đề" của một bộ phim có sẵn trong danh sách trên (Ví dụ họ than buồn, mà có phim chủ đề Buông bỏ/Chữa lành), HOẶC họ trực tiếp yêu cầu xem phim/nghe kể chuyện, bạn HÃY CHỦ ĐỘNG mời họ xem phim đó bằng cách:\n1. Cuối câu trả lời, nói một câu dẫn dắt (VD: "Lão có câu chuyện này rất hợp với hoàn cảnh của con, hãy xem qua để tỏ tường...").\n2. CÚ PHÁP BẮT BUỘC: Đặt thẻ [PLAY_MOVIE: Tên_Phim_Chính_Xác] ở tận cùng văn bản để hệ thống tự động bật phim. (Tuyệt đối không dùng thẻ PLAY_MOVIE nếu không có phim nào hợp chủ đề hoặc người dùng không muốn xem).`;
        }
        
        // TÂM AN THÊM: ĐÓNG GÓI KIẾN THỨC HUẤN LUYỆN VÀO PROMPT
        let knowledgeInstruction = "";
        if (trainedKnowledge) {
            knowledgeInstruction = `\n\n[DỮ LIỆU ĐƯỢC HUẤN LUYỆN TỪ DATABASE GIACNGO.SQL]:
Dưới đây là tri thức chuẩn xác mà bạn BẮT BUỘC phải dựa vào để định hướng câu trả lời cho khán giả:
"${trainedKnowledge}"
(Hãy lấy ý chính từ đoạn tri thức trên, diễn đạt lại theo văn phong đốn giáo của Lão một cách tự nhiên nhất).`;
        }

        let liveContext = "";
        if (liveStreamingState.isLiveMode) {
            let uHistory = liveStreamingState.liveUserHistoryRef.current.get(liveStreamingState.liveUsername) || [];
            
            // TÂM AN FIX: Tách riêng lịch sử cũ ra, không lấy câu hiện tại đang hỏi
            let previousHistory = uHistory.slice(0, -1); 
            
            if (previousHistory.length > 0) {
                // TÂM AN FIX: Cập nhật Lệnh Hệ Thống để AI thông minh hơn trong việc nối tiếp mạch truyện của từng người (hoặc mic)
                liveContext = `\n\n[LỊCH SỬ TRÒ CHUYỆN LIÊN TỤC VỚI KHÁN GIẢ NÀY (${liveStreamingState.liveUsername})]:\n${previousHistory.slice(-6).join('\n')}\n\n(LƯU Ý TỐI QUAN TRỌNG TỪ HỆ THỐNG: Khán giả này đang tương tác liên tiếp với bạn. Nếu câu hỏi hiện tại mang tính chất nối tiếp, phản biện, hoặc thể hiện việc chưa hiểu vấn đề trước đó (Ví dụ: "chưa hiểu", "giải thích thêm", "vậy là sao"), bạn BẮT BUỘC PHẢI dựa vào Lịch sử bên trên để biết họ đang bàn về chủ đề gì, từ đó giảng giải lại một cách cặn kẽ, dễ hiểu hơn cho chính vấn đề đó. Tuyệt đối không được trả lời chung chung hoặc lạc sang chủ đề khác!)`;
            }
        }

        let userPrompt = `TÌNH HUỐNG:
Người hỏi (${liveUsername}): "${actualQuestion}" ${isSystemCommand ? "(Đây là lệnh từ hệ thống, hãy làm theo yêu cầu trong ngoặc kép)" : ""}
BÀI KỆ THAM KHẢO TỪ HỆ THỐNG:
"${stanzaText}"
Ý nghĩa bài kệ: "${meaningText ? meaningText.replace(/\n/g, ' ') : 'Vạn pháp vô thường'}"
${movieInstruction}${knowledgeInstruction}${liveContext}`;

        if (needsTranslation) {
            userPrompt += `\n\nYÊU CẦU ĐA NGÔN NGỮ: Hãy phản hồi toàn bộ (Mào đầu -> Dịch Bài Kệ -> Đúc kết -> Tự vấn) bằng NGÔN NGỮ CỦA NGƯỜI HỎI. Tuyệt đối không dùng Tiếng Việt trừ khi họ hỏi bằng Tiếng Việt. Đảm bảo dịch bài kệ sao cho sâu sắc và đúng ý nghĩa tâm linh.`;
        } else {
            userPrompt += `\n\nYÊU CẦU: Lão đã đọc bài kệ trên cho người hỏi nghe rồi. Bây giờ CHỈ CẦN viết tiếp phần đúc kết ý nghĩa và câu hỏi tự vấn cuối cùng (bằng Tiếng Việt). KHÔNG chép lại bài kệ.`;
        }

        const parts: any[] = [{ text: userPrompt }];
        if (currentSelectedImage) parts.push({ inlineData: { mimeType: "image/png", data: currentSelectedImage.split(',')[1] } });

        // 3. Đóng gói Payload với các khóa vặn tối ưu tốc độ
        const payload = {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts }],
            generationConfig: {
                maxOutputTokens: 3000, // KHÓA VAN: Tăng lên 3000 token để không bao giờ bị cắt ngang câu
                temperature: 0.6      // Tăng tốc độ xuất chữ, bớt suy nghĩ mông lung
            }
        };

        let finalAiText = "";
        let finalEmotion = "calm";

        try {
            const combinedMessage = `${systemPrompt}\n\n${userPrompt}`;
            const token = typeof window !== 'undefined' ? localStorage.getItem('onglao_token') : null;
            const chatHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) {
                chatHeaders['Authorization'] = `Bearer ${token}`;
            }

            const data = await fetchWithRetry(`/api/giacngo/chat`, {
              method: 'POST',
              headers: chatHeaders,
              body: JSON.stringify({
                aiConfigId: authState.selectedAiConfigIdRef.current,
                spaceId: 1,
                message: actualQuestion,
                language: authState.appLanguage === 'Tiếng Việt' ? 'vi' : 'en'
              })
            }, 1, 1000); 

            const aiRawText = data.message;
            if (aiRawText) {
                let extractedText = aiRawText.replace(/^\[.*?\]/, '').trim();
                const emotionMatch = aiRawText.match(/^\[(.*?)\]/);
                finalEmotion = emotionMatch ? emotionMatch[1] : 'calm';

                // TÂM AN THÊM: Lọc thẻ bật phim từ văn bản trả về của AI
                // TÂM AN FIX: Thêm dấu ? để đối phó trường hợp AI quên gõ dấu cách
                const movieMatch = extractedText.match(/\[PLAY_MOVIE:?\s*(.+?)\]/i);
                if (movieMatch) {
                    if (wantsMovie) {
                        liveMovieToPlayRef.current = movieMatch[1].trim();
                    } else {
                        // TÂM AN FIX KÉP: Hủy lệnh bật phim nếu người dùng không yêu cầu (đề phòng AI không nghe lời)
                        liveMovieToPlayRef.current = null; 
                    }
                    extractedText = extractedText.replace(movieMatch[0], '').trim();
                } else {
                    liveMovieToPlayRef.current = null;
                }

                finalAiText = extractedText;
                
                // Cập nhật lại lịch sử với câu trả lời của Lão
                if (liveStreamingState.isLiveMode) {
                    let uHistory = liveStreamingState.liveUserHistoryRef.current.get(liveStreamingState.liveUsername) || [];
                    uHistory.push(`Lão: ${finalAiText}`);
                    if (uHistory.length > 6) uHistory.shift(); // Giữ lại 6 dòng gần nhất (3 cặp hỏi đáp)
                    liveStreamingState.liveUserHistoryRef.current.set(liveStreamingState.liveUsername, uHistory);
                }
            }

        } catch (err: any) {
            console.error("Lỗi API Gemini (Giai đoạn 2):", err);
            // Nếu lỗi thực sự xảy ra (rớt mạng), finalAiText vẫn là ""
        }

        // --- XỬ LÝ LƯỚI LỌC LẦN CUỐI THEO YÊU CẦU ---
        if (finalAiText) {
            finalAiText = finalAiText.replace(/\//g, ',');
            finalAiText = finalAiText.replace(/\b([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂ�??ỆỈỊỌỎỐỒỔỖỘỚỜ�?ỠỢỤỦỨỪỬỮỰỲÝỴỶỸ]{2,})\b/g, 
                (match) => match.charAt(0) + match.slice(1).toLowerCase()
            );
        }

        // Gắn lời giải thích vào UI một cách mượt mà (Nối tiếp bài kệ)
        const finalText = displayIntro ? (finalAiText ? `${displayIntro}\n\n${finalAiText}` : displayIntro) : finalAiText;
        setEmotion(finalEmotion);
        
        updateCurrentMessages((prev: any) => prev.map((m: any) => m.id === aiMsgId ? { 
            ...m, 
            text: finalText, 
            emotion: finalEmotion,
            isAppendingAI: false // Tắt hiệu ứng 3 dấu chấm
        } : m));
        
        if (currentSessionId) {
            saveChatMessageAction(currentSessionId, 'ASSISTANT', finalText, null, null, aiMsgId.toString());
        }
        
        // TẠO GIỌNG ĐỌC VÀ NỐI VÀO HÀNG ĐỢI ĐANG PHÁT
        if (isVoiceEnabled && !isMuted) {
            if (initialAudioUrls.length > 0) {
                // Đã phát mào đầu/kệ bằng file có sẵn, chỉ cần dịch tiếp phần câu trả lời của AI và ghép vào hàng đợi
                let textToSynthesize = finalAiText || "";
                if (missingPartsText) {
                    textToSynthesize = missingPartsText + (finalAiText || "");
                }
                if (textToSynthesize) {
                    generateVoice(aiMsgId, finalText, 'ai', currentSessionId, true, initialAudioUrls.map((x: any) => x.url), textToSynthesize, true);
                }
            } else {
                // Không có audio mào đầu/kệ có sẵn, gộp chung toàn bộ (mào đầu + kệ + giải đáp) để chuyển đổi tổng
                let textToSynthesize = finalAiText;
                if (missingPartsText) {
                    textToSynthesize = missingPartsText + finalAiText;
                }
                if (textToSynthesize) {
                    generateVoice(aiMsgId, finalText, 'ai', currentSessionId, true, null, textToSynthesize, false);
                }
            }
        }

      } catch (err: any) { 
        console.error(err);
        updateCurrentMessages((prev: any) => prev.map((m: any) => m.id === aiMsgId ? { ...m, text: "Mạch khí gián đoạn, con thưa lại đi.", emotion: 'sad', isAppendingAI: false } : m));
      } finally { 
        setIsThinking(false); 
      }
    };

    const controller = new AbortController();
    if (videoExportState.spellCheckControllersRef) {
        videoExportState.spellCheckControllersRef.current[userMsgId] = controller;
    }

    const processSpellCheck = async () => {
      if (!rawText.trim()) return;
      let textToProcess = rawText;
      try {
        const recentHistory = messages.slice(-4).map((m: any) => `${m.role === 'user' ? 'Con' : 'Lão'}: ${m.text}`).join('\n');
        const contextText = recentHistory ? `\n\nNgữ cảnh đàm đạo trước đó:\n${recentHistory}` : '';

        const token = typeof window !== 'undefined' ? localStorage.getItem('onglao_token') : null;
        const spellHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
            spellHeaders['Authorization'] = `Bearer ${token}`;
        }

        const fixRes = await fetchWithRetry(`/api/giacngo/chat`, {
          method: 'POST',
          headers: spellHeaders,
          signal: controller.signal,
          body: JSON.stringify({
            aiConfigId: authState.selectedAiConfigIdRef.current,
            message: `Dựa vào ngữ cảnh, hãy sửa lỗi chính tả theo ngôn ngữ ${authState.appLanguage} và bắt buộc THÊM DẤU CÂU (chấm, phẩy, hỏi, than...) cho chuẩn xác, ngắt câu rõ ràng. Không được viết HOA toàn bộ từ, chỉ viết hoa chữ cái đầu câu. Thay thế các ký tự gạch chéo '/' bằng dấu phẩy ','. TRẢ VỀ DUY NHẤT câu đã được sửa hoàn chỉnh bằng ${authState.appLanguage}, tuyệt đối không giải thích thêm.${contextText}\n\nCâu cần sửa: "${rawText}"`,
            language: authState.appLanguage === 'Tiếng Việt' ? 'vi' : 'en'
          })
        });
        
        let fixedText = fixRes.message ? fixRes.message.trim() : null;
        if (fixedText && fixedText !== "OK" && fixedText !== '"OK"') {
           textToProcess = fixedText.replace(/^["']|["']$/g, '').trim();
        }
      } catch (err: any) {
         if (err.name === 'AbortError') return; 
         console.error("Lỗi Auto-correct ngầm", err);
      }

      if (videoExportState.spellCheckControllersRef) {
          delete videoExportState.spellCheckControllersRef.current[userMsgId];
      }
      if (videoExportState.spellCheckTimeoutsRef) {
          delete videoExportState.spellCheckTimeoutsRef.current[userMsgId];
      }

      updateCurrentMessages((prev: any) => prev.map((m: any) => m.id === userMsgId ? { ...m, text: textToProcess, isCorrecting: false } : m));
    };

    processAiResponse();
    const timeoutId = setTimeout(processSpellCheck, 1000);
    if (videoExportState.spellCheckTimeoutsRef) {
        videoExportState.spellCheckTimeoutsRef.current[userMsgId] = timeoutId;
    }
  };

  const handleGenerateScriptVoices = async (sessionId: string) => {
      showToastMsg('Đang nạp thoại kịch bản...', 'loading');
      const res = await getChatMessagesAction(sessionId);
      if (res.success && res.data) {
          const msgs = res.data;
          let successCount = 0;
          for (let i = 0; i < msgs.length; i++) {
              const msg = msgs[i];
              if (!msg.audioUrl && msg.content.trim().length > 0) {
                  showToastMsg(`Đang tạo âm thanh cho thoại ${i + 1}/${msgs.length}...`, 'loading');
                  const targetRole = msg.role === 'ASSISTANT' ? 'ai' : 'user';
                  const success = await generateVoice(msg.id, msg.content, targetRole, sessionId, false);
                  if (success) {
                      successCount++;
                  } else {
                      showToastMsg(`Gặp lỗi khi tạo âm thanh thoại số ${i + 1}.`, 'error');
                      return;
                  }
              }
          }
          const updatedRes = await getChatMessagesAction(sessionId);
          if (updatedRes.success && updatedRes.data) {
              const mapped = updatedRes.data.map((m: any) => ({
                  id: m.id || m.msgId || Date.now(),
                  role: m.role === 'ASSISTANT' ? 'ai' : (m.role === 'OUTRO' ? 'outro' : 'user'),
                  text: m.content,
                  timestamp: m.createdAt ? new Date(m.createdAt) : new Date(),
                  audioUrl: m.audioUrl || null,
                  sessionId: sessionId,
                  emotion: m.emotion || 'calm'
              }));
              setSessions(prev => prev.map(x => x.id === sessionId ? { ...x, messages: mapped, messagesLoaded: true } : x));
          }
          showToastMsg(`Đã tạo thành công ${successCount} âm thanh!`, 'success');
      } else {
          showToastMsg('Không thể tải kịch bản để tạo âm thanh.', 'error');
      }
  };


  // --- HTML RENDERING ---
  const p = {
      ...videoExportState,
      EMOTIONS: videoExportState.EMOTIONS, MiniLaoFace, TUTORIAL_STEPS, activationCode: authState.activationCode, activationError: authState.activationError, aiLaoStyle: videoExportState.aiLaoStyle, aiScriptLength: videoExportState.aiScriptLength, aiTopicText: videoExportState.aiTopicText,
      aiUserEmotionArc: videoExportState.aiUserEmotionArc, allCharacters, appId, appLanguage: authState.appLanguage, applyCharacterPreset: videoExportState.applyCharacterPreset,
      backupFileInputRef: poemDbState.backupFileInputRef, backupOptions: poemDbState.backupOptions, backupProgress: poemDbState.backupProgress, batchAIMeaningProgress: poemDbState.batchAIMeaningProgress, batchGreetingProgress: poemDbState.batchGreetingProgress, batchMeaningProgress: poemDbState.batchMeaningProgress, batchPoemProgress: poemDbState.batchPoemProgress, cameraOn: videoExportState.cameraOn,
      cancelVideoExport: videoExportState.cancelVideoExport, charOffsets, chatEndRef, chatLaoDragInfo: videoExportState.chatLaoDragInfo, chatLaoTransform: videoExportState.chatLaoTransform, chatLaoVideos, confirmDialog, copyToClipboard: (text: string) => { navigator.clipboard.writeText(text); showToastMsg('Đã copy vào bộ nhớ tạm!', 'success'); },
      creatingVoices, currentLaoPresetId, currentSession, currentSessionId, currentUser: authState.currentUser, currentlyPlayingId, customLaoName: authState.customLaoName, customUserName: authState.customUserName,
      diagnosticReport: videoExportState.diagnosticReport, downloadAllAudios: () => {}, downloadAudio: (url: string, filename: string) => { const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); }, downloadCombinedAudio: () => {}, editSessionTitle, editingEmotionId: null, editingId, editingSessionId,
      enableAutoHarmonization, endTutorial, executeFullBackup: poemDbState.executeFullBackup, executeSaveFfPack: videoExportState.executeSaveFfPack, exportTab: videoExportState.exportTab, fileInputRef: { current: null }, formatTime: (s: number) => { const m = Math.floor(s / 60); const sec = Math.floor(s % 60); return `${m}:${sec < 10 ? '0' : ''}${sec}`; }, generateVoice,
      generatingDoubtId: null, generatingGreetings: poemDbState.generatingGreetings, generatingMeanings: poemDbState.generatingMeanings, generatingStanzas: poemDbState.generatingStanzas, globalCurrentTime: 0, globalDuration: 0, globalProgress: 0, greetingAudioUrls: poemDbState.greetingAudioUrls,
      greetingSearch: poemDbState.greetingSearch, greetingsDb: poemDbState.greetingsDb, handleAddTag: poemDbState.handleAddTag, handleBatchGenerateAIMeaningsText: poemDbState.handleBatchGenerateAIMeaningsText, handleBatchGenerateGreetings: poemDbState.handleBatchGenerateGreetings, handleBatchGenerateMeanings: poemDbState.handleBatchGenerateMeanings, handleBatchGenerateStanzas: poemDbState.handleBatchGenerateStanzas, handleChangeChatLao,
      handleChatLaoPointerDown: videoExportState.handleChatLaoPointerDown, handleChatLaoPointerMove: videoExportState.handleChatLaoPointerMove, handleChatLaoPointerUp: videoExportState.handleChatLaoPointerUp, handleChatLaoWheel: videoExportState.handleChatLaoWheel, handleConnectOldLink: poemDbState.handleConnectOldLink, handleCreateSession: async () => {
          if (!authState.currentUser) return;
          const createRes = await createChatSessionAction(authState.currentUser.id, 'Cuoc dam dao moi');
          if (createRes.success && createRes.data) {
              setSessions(prev => [...prev, { id: createRes.data.id, title: createRes.data.title, isPinned: false, messages: [], messagesLoaded: true }]);
              setCurrentSessionId(createRes.data.id);
          }
      }, handleDeleteSession: async (id: any) => {
          const res = await deleteChatSessionAction(id);
          if (res.success) {
              setSessions(prev => prev.filter(x => x.id !== id));
              if (currentSessionId === id) setCurrentSessionId(null);
              showToastMsg('Đã xóa phiên đàm đạo.', 'success');
          }
      }, handleDownloadAllPoemAudios: poemDbState.handleDownloadAllPoemAudios,
      handleDownloadVideo: videoExportState.handleDownloadVideo, handleEnterApp, handleExportFullBackupClick: poemDbState.handleExportFullBackupClick, handleExportPoemDatabaseCode: poemDbState.handleExportPoemDatabaseCode, handleFetchTrendingTopics: videoExportState.handleFetchTrendingTopics, handleGenerateAIMeaningText: poemDbState.handleGenerateAIMeaningText, handleGenerateAITopic: videoExportState.handleGenerateAITopic, handleGenerateDoubt: (...args: any[]) => handleGenerateDoubt(...args),
      handleGenerateGreetingVoice: poemDbState.handleGenerateGreetingVoice, handleGenerateMeaningVoice: poemDbState.handleGenerateMeaningVoice, handleGenerateScriptVoices, handleGenerateStanzaVoice: poemDbState.handleGenerateStanzaVoice, handleGlobalSeek: () => {}, handleImageUpload: () => {}, handleImportFullBackup: poemDbState.handleImportFullBackup, handleImportPoemJson: poemDbState.handleImportPoemJson,
      handleImportScript: videoExportState.handleImportScript, handleImportTxtPoem: poemDbState.handleImportTxtPoem, handleLogin: authState.handleLogin, handleLogout: authState.handleLogout, handlePlayStanzaVoice, handlePushSourceToCloud: poemDbState.handlePushSourceToCloud, handleRefineInput, handleRemoveTag: poemDbState.handleRemoveTag,
      handleSaveEdit: (id: any) => {
          updateCurrentMessages((prev: any) => prev.map((m: any) => m.id === id ? { ...m, text: tempEditText } : m));
          setEditingId(null);
      }, handleSaveMeaningVoice: poemDbState.handleSaveMeaningVoice, handleSaveStanzaVoice, handleSendMessage, handleShareVideoSocial: videoExportState.handleShareVideoSocial, handleStopCorrecting, handleSummarizeSession, handleSyncFromCloud: poemDbState.handleSyncFromCloud,
      handleUpdateGreetingText: poemDbState.handleUpdateGreetingText, handleUpdatePoemContent: poemDbState.handleUpdatePoemContent, handleUpdatePoemMeaning: poemDbState.handleUpdatePoemMeaning, harmonizeSettings, hasEntered: authState.hasEntered, importMode: importMode, importPoemJson: poemDbState.importPoemJson,
      inputText, isBatchGeneratingAIMeanings: poemDbState.isBatchGeneratingAIMeanings, isBatchGeneratingAIMeaningsRef: poemDbState.isBatchGeneratingAIMeaningsRef, isBatchGeneratingGreetings: poemDbState.isBatchGeneratingGreetings, isBatchGeneratingGreetingsRef: poemDbState.isBatchGeneratingGreetingsRef, isBatchGeneratingMeanings: poemDbState.isBatchGeneratingMeanings, isBatchGeneratingMeaningsRef: poemDbState.isBatchGeneratingMeaningsRef, isBatchGeneratingPoems: poemDbState.isBatchGeneratingPoems,
      isBatchGeneratingPoemsRef: poemDbState.isBatchGeneratingPoemsRef, isCloudSyncing: authState.isCloudSyncing, isExportingVideo: videoExportState.isExportingVideo, isFetchingCloudAudio, isGeneratingAIMeaning: poemDbState.isGeneratingAIMeaning, isGeneratingAITopic: videoExportState.isGeneratingAITopic, isGlobalPlaying: false, isLaoSpeakingSession: videoExportState.isLaoSpeakingSession, playingMsg: videoExportState.playingMsg,
      isLoadingRag: poemDbState.isLoadingRag, isLoggedIn: authState.isLoggedIn, isPreparingGlobal: false, isPreviewFullscreen: videoExportState.isPreviewFullscreen, isProcessingBackup: poemDbState.isProcessingBackup, isRecording, isRefining, isRegeneratingAll, isThinking,
      isSubscribed: authState.isSubscribed, isUploadingAudios: poemDbState.isUploadingAudios, isVideoFullscreen: videoExportState.isVideoFullscreen, isVoiceEnabled, laoAppearance, laoCallUser: authState.laoCallUser, laoChromaSettings, laoSelfCall: authState.laoSelfCall,
      laoShadow, laoVisualType, laoVoice: authState.laoVoice, laoVoiceStyle: authState.laoVoiceStyle, messages, mouthOpen, newTagInputs: poemDbState.newTagInputs, nextTutorialStep,
      oldLinkInput: poemDbState.oldLinkInput, openDropdown: authState.openDropdown, outroText: videoExportState.outroText, playVoice, poemDatabase: poemDbState.poemDatabase, poemModalTab: poemDbState.poemModalTab, poemSearch: poemDbState.poemSearch, processedLaoImages,
      publicAis: authState.publicAis, publicSettings: authState.publicSettings, ragDb: poemDbState.ragDb, ragSearch: poemDbState.ragSearch, refreshRagFromGiacNgo: poemDbState.refreshRagFromGiacNgo, regenerationComplete, regenerationProgress, renderedVideoUrl: videoExportState.renderedVideoUrl,
      resetVideoExport: videoExportState.resetVideoExport, resolveGreetingAudioUrl: poemDbState.resolveGreetingAudioUrl, resolveMeaningAudioUrl: poemDbState.resolveMeaningAudioUrl, resolveStanzaAudioUrl: poemDbState.resolveStanzaAudioUrl, savePackData: videoExportState.savePackData, savePoemDatabase: poemDbState.savePoemDatabase, saveSessionTitle: async (id: any, title: any) => {
          const res = await updateChatSessionTitleAction(id, title);
          if (res.success) {
              setSessions(prev => prev.map(x => x.id === id ? { ...x, title } : x));
              setEditingSessionId(null);
              showToastMsg('Đã đổi tên phiên.', 'success');
          }
      }, scriptText: videoExportState.scriptText,
      selectedAiConfigId: authState.selectedAiConfigId, selectedImage, sessions, setActivationCode: authState.setActivationCode, setActivationError: authState.setActivationError, setAiLaoStyle: setAiLaoStyle, setAiScriptLength: setAiScriptLength, setAiTopicText: setAiTopicText,
      aiScriptTitle, setAiScriptTitle, aiScriptDate, setAiScriptDate,
      setAiUserEmotionArc: setAiUserEmotionArc, setApSettings: videoExportState.setApSettings, setApTopics: videoExportState.setApTopics, setAppLanguage: authState.setAppLanguage, setBackupOptions: poemDbState.setBackupOptions, setCharOffsets, setChatLaoTransform: videoExportState.setChatLaoTransform, setConfirmDialog,
      setCurrentSessionId, setCurrentlyPlayingId, setCustomLaoName: authState.setCustomLaoName, setCustomUserName: authState.setCustomUserName, setEditSessionTitle, setEditingEmotionId: () => {}, setEditingId, setEditingSessionId,
      setExportTab: videoExportState.setExportTab, setGreetingSearch: poemDbState.setGreetingSearch, setHasEntered: authState.setHasEntered, setImportMode: setImportMode, setImportPoemJson: poemDbState.setImportPoemJson, setInputText, setIsBatchGeneratingAIMeanings: poemDbState.setIsBatchGeneratingAIMeanings, setIsBatchGeneratingGreetings: poemDbState.setIsBatchGeneratingGreetings,
      setIsBatchGeneratingMeanings: poemDbState.setIsBatchGeneratingMeanings, setIsBatchGeneratingPoems: poemDbState.setIsBatchGeneratingPoems, setIsLiveMode: liveStreamingState.setIsLiveMode, setIsSubscribed: authState.setIsSubscribed, setIsVideoFullscreen: videoExportState.setIsVideoFullscreen, setIsVoiceEnabled, setLaoCallUser: authState.setLaoCallUser, setLaoIsFullScreen: liveStreamingState.setLaoIsFullScreen,
      setLaoSelfCall: authState.setLaoSelfCall, setLaoVoice: authState.setLaoVoice, setLaoVoiceStyle: authState.setLaoVoiceStyle, setNewTagInputs: poemDbState.setNewTagInputs, setOldLinkInput: poemDbState.setOldLinkInput, setOpenDropdown: authState.setOpenDropdown, setOutroText: videoExportState.setOutroText, setPoemDatabase: poemDbState.setPoemDatabase,
      setPoemModalTab: poemDbState.setPoemModalTab, setPoemSearch: poemDbState.setPoemSearch, setRagSearch: poemDbState.setRagSearch, setSavePackData: videoExportState.setSavePackData, setScriptText: videoExportState.setScriptText, setSelectedAiConfigId: authState.setSelectedAiConfigId, setSelectedImage, setShowAITopicModal: setShowAITopicModal,
      setShowAuthModal: authState.setShowAuthModal, setShowAutoPilotModal: videoExportState.setShowAutoPilotModal, setShowBackupOptionsModal: poemDbState.setShowBackupOptionsModal, setShowChatLaoControls: videoExportState.setShowChatLaoControls, setShowDiagnostics: videoExportState.setShowDiagnostics, setShowDownloadMenu: videoExportState.setShowDownloadMenu, setShowHistory: setShowHistory, setShowImportPoemModal: poemDbState.setShowImportPoemModal,
      setShowLaoAura: () => {}, setShowOldLinkModal: poemDbState.setShowOldLinkModal, setShowPaymentModal: authState.setShowPaymentModal, setShowPoemModal: poemDbState.setShowPoemModal, setShowSavePackModal: videoExportState.setShowSavePackModal, setShowScriptModal: poemDbState.setShowScriptModal, setShowSessions, setShowShareMenu: videoExportState.setShowShareMenu,
      setShowUserGuide, setShowVideoExportModal: videoExportState.setShowVideoExportModal,
      videoSlug: videoExportState.videoSlug, setVideoSlug: videoExportState.setVideoSlug, setTempEditText, setUserAge: authState.setUserAge, setUserCallLao: authState.setUserCallLao, setUserGender: authState.setUserGender, setUserSelfCall: authState.setUserSelfCall, setUserVoice: authState.setUserVoice,
      setUserVoiceStyle: authState.setUserVoiceStyle, setVideoResolution: videoExportState.setVideoResolution, shareCombinedAudioFile: () => {}, shareTextContent: () => {}, showAITopicModal: showAITopicModal, showAuthModal: authState.showAuthModal, showAutoPilotModal: videoExportState.showAutoPilotModal, showBackupOptionsModal: poemDbState.showBackupOptionsModal,
      showChatLaoControls: videoExportState.showChatLaoControls, showDownloadMenu: videoExportState.showDownloadMenu, showHistory: showHistory, showImportPoemModal: poemDbState.showImportPoemModal, showLaoAura: false, showOldLinkModal: poemDbState.showOldLinkModal, showPaymentModal: authState.showPaymentModal, showPoemModal: poemDbState.showPoemModal,
      showSavePackModal: videoExportState.showSavePackModal, showScriptModal: poemDbState.showScriptModal, showSessions, showShareMenu: videoExportState.showShareMenu, showToastMsg, showTutorial, showUserGuide, showVideoExportModal: videoExportState.showVideoExportModal,
      startAutoPilot: videoExportState.startAutoPilot, startVideoExport: videoExportState.startVideoExport, stopAutoPilot: videoExportState.stopAutoPilot, targetRect, tempEditText, toast, toggleCamera: () => {}, toggleFullscreen: videoExportState.toggleFullscreen,
      toggleGlobalPlay: () => {}, toggleMic, togglePin: videoExportState.togglePin, toggleReaction: () => {}, tutorialStep, txtPoemFileInputRef: poemDbState.txtPoemFileInputRef, updateCurrentMessages, uploadAudioProgress: poemDbState.uploadAudioProgress,
      user: authState.user, userAge: authState.userAge, userCallLao: authState.userCallLao, userGender: authState.userGender, userSelfCall: authState.userSelfCall, userVoice: authState.userVoice, userVoiceStyle: authState.userVoiceStyle, videoResolution: videoExportState.videoResolution,
      aiLaoStyle, aiScriptLength, aiTopicText, aiUserEmotionArc,
      apTopics: videoExportState.apTopics, apSettings: videoExportState.apSettings, apState: videoExportState.apState,
      setCustomBgs: videoExportState.setCustomBgs, presetBackgrounds: videoExportState.presetBackgrounds, setBgmVolume: videoExportState.setBgmVolume,
      setBgmAudioData: videoExportState.setBgmAudioData, removeBgm: videoExportState.removeBgm, handleUploadBgm: videoExportState.handleUploadBgm,
      DEFAULT_BGM_LIST: videoExportState.DEFAULT_BGM_LIST,
      toggleGlobalPlay: () => {}, toggleMic, togglePin: videoExportState.togglePin, toggleReaction: () => {}, tutorialStep, txtPoemFileInputRef: poemDbState.txtPoemFileInputRef, updateCurrentMessages, uploadAudioProgress: poemDbState.uploadAudioProgress,
      user: authState.user, userAge: authState.userAge, userCallLao: authState.userCallLao, userGender: authState.userGender, userSelfCall: authState.userSelfCall, userVoice: authState.userVoice, userVoiceStyle: authState.userVoiceStyle, videoResolution: videoExportState.videoResolution
  };

  const passProps = {
      ...p,
      ...videoExportState,
      ...poemDbState,
      ...liveStreamingState,
      ...authState,
      sessions,
      setSessions,
      showAiManager,
      setShowAiManager,
      voicePersonas,
      currentVoicePersonaId,
      handleChangeVoicePersona,
      // These are local states in onglao-platform – must be explicitly included
      // so CombinedScriptModal / AiDirectorModal receive them via context
      generatedScriptText,
      setGeneratedScriptText,
  };

  if (liveStreamingState.isLiveMode) {
      return (
          <OngLaoProvider value={passProps}>
              <LiveModePanel />
          </OngLaoProvider>
      );
  }

  if (!authState.hasEntered || !authState.isLoggedIn) {
      return (
          <WelcomeScreen
              isLoggedIn={authState.isLoggedIn}
              hasEntered={authState.hasEntered}
              setHasEntered={authState.setHasEntered}
              showAuthModal={authState.showAuthModal}
              setShowAuthModal={authState.setShowAuthModal}
              handleLogin={authState.handleLogin}
              handleLogout={authState.handleLogout}
              allCharacters={allCharacters}
              currentLaoPresetId={currentLaoPresetId}
              handleChangeChatLao={handleChangeChatLao}
              laoAppearance={laoAppearance}
              laoVisualType={laoVisualType}
              processedLaoImages={processedLaoImages}
              chatLaoVideos={chatLaoVideos}
              laoChromaSettings={laoChromaSettings}
              charOffsets={charOffsets}
              enableAutoHarmonization={enableAutoHarmonization}
              laoShadow={laoShadow}
              harmonizeSettings={harmonizeSettings}
              userName={authState.userName}
              setUserName={authState.setUserName}
              userGender={authState.userGender}
              setUserGender={authState.setUserGender}
              userAge={authState.userAge}
              setUserAge={authState.setUserAge}
              appLanguage={authState.appLanguage}
              setAppLanguage={authState.setAppLanguage}
              userVoice={authState.userVoice}
              setUserVoice={authState.setUserVoice}
              userVoiceStyle={authState.userVoiceStyle}
              setUserVoiceStyle={authState.setUserVoiceStyle}
              VOICE_STYLES={VOICE_STYLES}
              isProfileCompleted={authState.isProfileCompleted}
              openDropdown={authState.openDropdown}
              setOpenDropdown={authState.setOpenDropdown}
              voicePersonas={voicePersonas}
              currentVoicePersonaId={currentVoicePersonaId}
              handleChangeVoicePersona={handleChangeVoicePersona}
              handleEnterApp={handleEnterApp}
          />
      );
  }

  return (
      <OngLaoProvider value={passProps}>
          <NormalModePanel />
          
          {authState.showAuthModal && (
              <AuthModal 
                 onClose={() => authState.setShowAuthModal(false)} 
                 onLogin={authState.handleLogin} 
              />
          )}

          <PoemVaultModal />

          <VideoCreatorModal />

          {toast.show && (
             <div className="fixed top-6 right-6 z-[300] bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-2 max-w-sm animate-in fade-in slide-in-from-top-5">
                {toast.type === 'success' && <Check size={18} className="text-emerald-400 shrink-0"/>}
                {toast.type === 'error' && <XCircle size={18} className="text-rose-400 shrink-0"/>}
                {toast.type === 'loading' && <Loader2 size={18} className="text-cyan-400 animate-spin shrink-0"/>}
                {toast.type === 'info' && <Info size={18} className="text-blue-400 shrink-0"/>}
                <span className="text-xs text-white leading-relaxed">{toast.message}</span>
             </div>
          )}

          {confirmDialog.isOpen && (
             <div className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95">
                    <span className="text-sm text-slate-300 font-medium whitespace-pre-line leading-relaxed">{confirmDialog.message}</span>
                    <div className="flex gap-3 justify-end mt-2">
                        {confirmDialog.onConfirm ? (
                            <>
                                <button onClick={() => setConfirmDialog(p => ({ ...p, isOpen: false }))} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all">Hủy bỏ</button>
                                <button onClick={() => { confirmDialog.onConfirm?.(); setConfirmDialog(p => ({ ...p, isOpen: false })); }} className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md">Đồng ý</button>
                            </>
                        ) : (
                            <button onClick={() => setConfirmDialog(p => ({ ...p, isOpen: false }))} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md">Đã hiểu</button>
                        )}
                    </div>
                </div>
             </div>
          )}
      </OngLaoProvider>
  );
};

export default OngLaoPlatform;

