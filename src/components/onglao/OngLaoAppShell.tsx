// @ts-nocheck
"use client";
import React from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import NormalModePanel from "./components/NormalModePanel";
import LiveModePanel from "./components/LiveModePanel";
import VideoCreatorModal from "./components/VideoCreatorModal";
import AiDirectorManagerModal from "./components/AiDirectorManagerModal";
import PoemVaultModal from "./components/PoemVaultModal";
import AuthModal from "@/components/AuthModal";
import LoginPage from "@/components/LoginPage";
import { useAuth } from "./hooks/useAuth";
import { usePoemDb } from "./hooks/usePoemDb";
import { useVideoExport } from "./hooks/useVideoExport";
import { useLiveStreaming } from "./hooks/useLiveStreaming";
import { createChatSessionAction, saveChatMessageAction, getChatMessagesAction, deleteChatSessionAction, togglePinChatSessionAction } from "@/actions/chat";
import { idb } from "./constants";
import { createManagedBlobUrl, autoReleaseRamMemory as autoReleaseRamMemoryUtil } from "./utils/ramManager";
import { CheckCircle2, AlertTriangle, Sparkles, Loader2, X } from "lucide-react";
const normalizeAudioUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('/') || trimmed.startsWith('idb://') || trimmed.startsWith('blob:')) {
    return trimmed;
  }
  return '/' + trimmed;
};

export default function OngLaoAppShell({
  initialPoems = [],
  pageRoute
}: {
  initialPoems?: any[];
  pageRoute?: 'home' | 'livestream' | 'ke-phap' | 'xuong-phim' | 'kich-ban' | 'tao-video';
}) {
  // Global Sessions & Sidebar UI States
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = React.useState<string | null>(null);
  const [showSessions, setShowSessions] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('sidebar') === 'true' || urlParams.get('menu') === 'open') return true;
      const saved = localStorage.getItem('onglao_show_sessions');
      return saved === 'true';
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onglao_show_sessions', showSessions ? 'true' : 'false');
    }
  }, [showSessions]);

  const [showHistory, setShowHistory] = React.useState(true);

  const [currentPath, setCurrentPath] = React.useState<string>(() => {
    if (typeof window !== 'undefined') return window.location.pathname;
    return '/';
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // Global Modals State
  const [showAiManager, setShowAiManager] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('modal') === 'ai-director' || urlParams.get('showAITopicModal') === 'true';
    }
    return false;
  });
  const [showAutoPilotModal, setShowAutoPilotModal] = React.useState(false);
  const [showPoemModal, setShowPoemModal] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('modal') === 'poem-vault' || urlParams.get('poem') === 'vault';
    }
    return false;
  });

  const [showUserGuide, setShowUserGuide] = React.useState(false);
  const [aiScriptDate, setAiScriptDate] = React.useState(() => {
    const validDate = new Date();
    const tzOffset = validDate.getTimezoneOffset() * 60000;
    return (new Date(validDate.getTime() - tzOffset)).toISOString().slice(0, 16);
  });

  // Global Voice Personas (Hình tướng Lão từ PostgreSQL DB)
  const [voicePersonas, setVoicePersonas] = React.useState<any[]>([]);
  const [currentVoicePersonaId, setCurrentVoicePersonaId] = React.useState<string | null>(null);

  // Fetch Hình tướng từ /api/hinh-tuong khi mở App
  React.useEffect(() => {
    fetch('/api/hinh-tuong')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVoicePersonas(data);
          if (data.length > 0) {
            setCurrentVoicePersonaId(data[0].id);
          }
        }
      })
      .catch(err => console.warn('Lỗi tải hình tướng:', err));
  }, []);

  // Đọc querystring id từ URL khi vừa mở trang (nếu có ?id=xxx hoặc ?session_id=xxx)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSessionId = params.get('id') || params.get('session_id');
      if (urlSessionId) {
        setCurrentSessionId(urlSessionId);
      }
    }
  }, [setCurrentSessionId]);

  // Tự động tải danh sách tin nhắn từ PostgreSQL DB khi currentSessionId thay đổi
  React.useEffect(() => {
    if (!currentSessionId) return;

    getChatMessagesAction(currentSessionId).then(res => {
      if (res.success && Array.isArray(res.data)) {
        const loadedMsgs: any[] = [];
        const seenIds = new Set<string>();

        for (const m of res.data) {
          const msgId = m.id || `msg_${Date.now()}_${Math.random()}`;
          if (!seenIds.has(msgId)) {
            seenIds.add(msgId);
            loadedMsgs.push({
              id: msgId,
              role: m.role === 'ASSISTANT' ? 'ai' : (m.role === 'OUTRO' ? 'outro' : 'user'),
              text: m.content,
              emotion: m.emotion || 'calm',
              audioUrl: m.audioUrl,
              sessionId: m.sessionId,
              timestamp: m.createdAt
            });
          }
        }

        setSessions((prev: any[]) => {
          const exists = prev?.some((s: any) => s.id === currentSessionId);
          if (exists) {
            return (prev || []).map((s: any) => 
              s.id === currentSessionId ? { ...s, messages: loadedMsgs, messagesLoaded: true } : s
            );
          } else {
            return [
              ...(prev || []),
              { id: currentSessionId, title: "Cuộc đàm đạo", type: "chat", messages: loadedMsgs, messagesLoaded: true }
            ];
          }
        });

        if (poemDbState?.updateCurrentMessages) {
          poemDbState.updateCurrentMessages(loadedMsgs);
        }
      }
    }).catch(err => console.warn('Lỗi tải tin nhắn từ DB:', err));
  }, [currentSessionId]);

  // Global Toast Notifications State
  const [toastNotification, setToastNotification] = React.useState<{ msg: string; type?: string; duration?: number } | null>(null);

  const showToastMsg = React.useCallback((msg: string, type: string = 'info', duration: number = 3500) => {
    setToastNotification({ msg, type, duration });
    if (duration > 0) {
      setTimeout(() => {
        setToastNotification((prev) => (prev?.msg === msg ? null : prev));
      }, duration);
    }
  }, []);



  const [isVoiceEnabled, setIsVoiceEnabled] = React.useState(true);
  const isVoiceEnabledRef = React.useRef(isVoiceEnabled);

  // Auth state & global user settings (truyền setSessions & setCurrentSessionId để sync DB)
  const authState = useAuth({
    setSessions,
    setCurrentSessionId,
    showToastMsg,
  });

  // Poem DB state & chat messages
  const poemDbState = usePoemDb({
    user: authState.user,
    initialPoems,
    showToastMsg,
    geminiApiKeyRef: { current: '' },
    appLanguage: authState.appLanguage,
    selectedAiConfigIdRef: { current: authState.selectedAiConfigId },
    laoVoiceRef: { current: authState.laoVoice },
    laoVoiceStyleRef: { current: authState.laoVoiceStyle },
    userVoiceRef: { current: authState.userVoice },
    userVoiceStyleRef: { current: authState.userVoiceStyle },
    laoSelfCallRef: { current: authState.laoSelfCall },
    laoCallUserRef: { current: authState.laoCallUser },
    userSelfCallRef: { current: authState.userSelfCall },
    userCallLaoRef: { current: authState.userCallLao },
    userName: authState.customUserName || 'Con',
    userGender: authState.userGender,
    userAge: authState.userAge,
  });

  // No-op fallback for backwards compatibility / cached HMR chunks
  const setIsSendingOrSpeaking = React.useCallback((_val?: boolean) => {}, []);

  // Voice & TTS State & Handlers
  const [creatingVoices, setCreatingVoices] = React.useState<Record<string, boolean>>({});
  const [currentlyPlayingId, setCurrentlyPlayingId] = React.useState<string | null>(null);
  const activeAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const unlockedAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const createdBlobUrlsRef = React.useRef<Set<string>>(new Set());

  // RAM Memory Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (activeAudioRef.current) {
        try {
          activeAudioRef.current.pause();
          activeAudioRef.current.removeAttribute('src');
          activeAudioRef.current.load();
        } catch (e) {}
        activeAudioRef.current = null;
      }
      createdBlobUrlsRef.current.forEach(url => {
        try { URL.revokeObjectURL(url); } catch (e) {}
      });
      createdBlobUrlsRef.current.clear();
    };
  }, []);

  // Tối ưu RAM tự động: Giải phóng RAM và VRAM mỗi khi chạy bất kỳ tác vụ nào
  const autoReleaseRamMemory = React.useCallback(() => {
    try {
      if (createdBlobUrlsRef.current.size > 5) {
        const urlsToRevoke = Array.from(createdBlobUrlsRef.current).slice(0, createdBlobUrlsRef.current.size - 5);
        urlsToRevoke.forEach(url => {
          try { URL.revokeObjectURL(url); } catch (e) {}
          createdBlobUrlsRef.current.delete(url);
        });
      }
      if (audioTextCacheRef.current.size > 15) {
        const keysToEvict = Array.from(audioTextCacheRef.current.keys()).slice(0, audioTextCacheRef.current.size - 15);
        keysToEvict.forEach(k => audioTextCacheRef.current.delete(k));
      }
      if (typeof window !== 'undefined' && (window as any).gc) {
        (window as any).gc();
      }
    } catch (e) {}
  }, []);

  // Tự động Unlock Audio khi người dùng nhấp hoặc tương tác bất kỳ trên trang
  React.useEffect(() => {
    const handleGlobalUnlock = () => {
      try {
        if (!unlockedAudioRef.current) {
          const a = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
          a.play().then(() => a.pause()).catch(() => {});
          unlockedAudioRef.current = a;
        } else {
          unlockedAudioRef.current.play().then(() => unlockedAudioRef.current?.pause()).catch(() => {});
        }
      } catch (e) {}
    };

    window.addEventListener('click', handleGlobalUnlock, { capture: true });
    window.addEventListener('touchstart', handleGlobalUnlock, { capture: true });
    window.addEventListener('keydown', handleGlobalUnlock, { capture: true });

    return () => {
      window.removeEventListener('click', handleGlobalUnlock, { capture: true });
      window.removeEventListener('touchstart', handleGlobalUnlock, { capture: true });
      window.removeEventListener('keydown', handleGlobalUnlock, { capture: true });
    };
  }, []);

  const audioCtxRef = React.useRef<AudioContext | null>(null);

  // Audio Queue System: Đảm bảo thứ tự phát chuẩn 100%: Mào đầu + Kệ pháp PHÁT TRƯỚC -> AI đúc kết PHÁT SAU
  const audioQueueRef = React.useRef<Array<{ audioUrl: string; msgId: string }>>([]);
  const isPlayingQueueRef = React.useRef(false);

  const playAudioWithWebAudioFallback = React.useCallback(async (audioUrl: string, msgId: string, onFinish: () => void) => {
    if (!audioUrl || typeof audioUrl !== 'string' || !audioUrl.trim()) {
      onFinish();
      return;
    }
    setCurrentlyPlayingId(msgId);
    let hasFinished = false;

    const finishOnce = () => {
      if (hasFinished) return;
      hasFinished = true;
      setCurrentlyPlayingId(null);
      activeAudioRef.current = null;
      onFinish();
    };

    try {
      let playSrc = audioUrl;
      if (audioUrl.startsWith('idb://')) {
        try {
          const key = audioUrl.replace('idb://', '');
          const blob = await idb.get(key);
          if (blob) {
            playSrc = createManagedBlobUrl(blob);
          }
        } catch (e) {
          console.warn('Lỗi đọc audio idb:', e);
        }
      } else if (audioUrl.startsWith('data:')) {
        try {
          const parts = audioUrl.split(',');
          const mime = parts[0].match(/:(.*?);/)?.[1] || 'audio/wav';
          const bstr = atob(parts[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], { type: mime });
          playSrc = createManagedBlobUrl(blob);
        } catch (e) {
          console.warn('Lỗi convert dataUrl sang Blob:', e);
        }
      }

      let audio = unlockedAudioRef.current;
      if (!audio) {
        audio = new Audio();
        unlockedAudioRef.current = audio;
      }
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {}

      audio.onended = null;
      audio.onerror = null;
      audio.src = playSrc;
      audio.load();
      activeAudioRef.current = audio;

      audio.onended = finishOnce;
      audio.onerror = (e) => {
        console.warn('Lỗi phát audio:', playSrc, e);
        finishOnce();
      };

      const p = audio.play();
      if (p !== undefined) {
        await p.catch((err) => {
          console.warn('Autoplay catch error:', err);
          const retryOnClick = () => {
            audio.play().catch(() => {});
            window.removeEventListener('click', retryOnClick);
          };
        });
      }
    } catch (err) {
      console.warn('Lỗi playAudioWithWebAudioFallback:', err);
      finishOnce();
    }
  }, []);

  const clearAudioQueue = React.useCallback(() => {
    audioQueueRef.current = [];
    isPlayingQueueRef.current = false;
    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.pause();
        activeAudioRef.current.removeAttribute('src');
        activeAudioRef.current.load();
      } catch (e) {}
      activeAudioRef.current = null;
    }
    setCurrentlyPlayingId(null);
  }, []);

  React.useEffect(() => {
    isVoiceEnabledRef.current = isVoiceEnabled;
    if (!isVoiceEnabled) {
      clearAudioQueue();
    }
  }, [isVoiceEnabled, clearAudioQueue]);

  const processAudioQueue = React.useCallback(async () => {
    if (!isVoiceEnabledRef.current) {
      audioQueueRef.current = [];
      isPlayingQueueRef.current = false;
      return;
    }
    if (isPlayingQueueRef.current || audioQueueRef.current.length === 0) return;
    
    isPlayingQueueRef.current = true;
    const nextItem = audioQueueRef.current.shift();
    if (!nextItem) {
      isPlayingQueueRef.current = false;
      return;
    }

    playAudioWithWebAudioFallback(nextItem.audioUrl, nextItem.msgId, () => {
      isPlayingQueueRef.current = false;
      setTimeout(() => processAudioQueue(), 200);
    });
  }, [playAudioWithWebAudioFallback]);

  const enqueueAudio = React.useCallback((audioUrl: string, msgId: string) => {
    if (!isVoiceEnabledRef.current) return;
    audioQueueRef.current.push({ audioUrl, msgId });
    processAudioQueue();
  }, [processAudioQueue]);



  const parseMessageParts = React.useCallback((fullText: string) => {
    if (!fullText) return { greetingText: '', stanzaText: '', aiReply: '' };

    const transitionIndex = fullText.indexOf('Hãy nghe kệ đây:');
    if (transitionIndex !== -1) {
      const greetingText = fullText.substring(0, transitionIndex).trim();
      const rest = fullText.substring(transitionIndex + 'Hãy nghe kệ đây:'.length).trim();

      const parts = rest.split(/\n\s*\n/);
      if (parts.length >= 2) {
        const stanzaText = parts[0].trim();
        const aiReply = parts.slice(1).join('\n\n').trim();
        return { greetingText, stanzaText, aiReply };
      } else {
        return { greetingText, stanzaText: rest, aiReply: '' };
      }
    }

    return { greetingText: '', stanzaText: '', aiReply: fullText.trim() };
  }, []);

  const audioTextCacheRef = React.useRef<Map<string, string>>(new Map());

  // Restore cached audio URLs on mount
  React.useEffect(() => {
    try {
      const savedCache = typeof window !== 'undefined' ? localStorage.getItem('onglao_audio_text_cache') : null;
      if (savedCache) {
        const parsed = JSON.parse(savedCache);
        Object.entries(parsed).forEach(([k, v]) => {
          if (typeof v === 'string') audioTextCacheRef.current.set(k, v);
        });
      }
    } catch (e) {}
  }, []);

  const generateVoice = React.useCallback(async (
    msgId: string,
    text: string,
    role: string = 'ai',
    sessionId?: string | null,
    forceRegenerate: boolean = false,
    _arg5?: any,
    _arg6?: any,
    autoPlay: boolean = true,
    customVoiceName?: string,
    customVoiceStyle?: string
  ) => {
    if (!text || !text.trim()) return false;
    const cleanText = text.replace(/\[.*?\]|\(.*?\)/g, '').trim();
    if (!cleanText) return false;

    const cacheKey = `${cleanText}_${customVoiceName || role}`.toLowerCase().trim();
    if (!forceRegenerate && audioTextCacheRef.current.has(cacheKey)) {
      const cachedUrl = audioTextCacheRef.current.get(cacheKey)!;
      if (autoPlay) enqueueAudio(cachedUrl, msgId);
      return true;
    }

    setCreatingVoices(prev => ({ ...prev, [msgId]: true }));

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('onglao_token') : null;
      const currentAiId = authState.selectedAiConfigId || 7;

      let voiceStylePrefix = customVoiceStyle || (role === 'user' 
        ? (authState.userVoiceStyle || '').trim() 
        : (authState.laoVoiceStyle || '').trim());
        
      if (authState.appLanguage === 'Tiếng Việt' && voiceStylePrefix && !voiceStylePrefix.endsWith(':')) {
        voiceStylePrefix += ':';
      }

      const effectiveVoiceName = customVoiceName || (role === 'user' ? (authState.userVoice || publicSettings?.userVoiceName || 'Kore') : (authState.laoVoice || publicSettings?.laoVoiceName || 'Algieba'));

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          text: voiceStylePrefix ? `${voiceStylePrefix} ${cleanText}` : cleanText,
          voiceName: effectiveVoiceName,
          aiConfigId: currentAiId,
          userId: authState?.currentUser?.id || authState?.user?.uid || null
        })
      });

      const data = await res.json();
      const audioBase64 = data?.audioContent || data?.audio;
      const fileAudioUrl: string | null = data?.audioUrl || null;

      if (audioBase64) {
        const mimeType = data.mimeType || 'audio/wav';
        const dataUrl = `data:${mimeType};base64,${audioBase64}`; 

        const targetSessionId = sessionId || currentSessionId;
        setSessions((prev: any[]) => prev.map((s: any) => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              messages: (s.messages || []).map((m: any) => 
                m.id === msgId ? { ...m, audioUrl: fileAudioUrl || dataUrl } : m
              )
            };
          }
          return s;
        }));

        saveChatMessageAction(
          targetSessionId,
          role === 'user' ? 'USER' : 'ASSISTANT',
          text.trim(),
          fileAudioUrl || dataUrl,
          null,
          msgId,
          'calm'
        ).catch(() => {});

        const playUrl = dataUrl;
        audioTextCacheRef.current.set(cacheKey, fileAudioUrl || playUrl);
        if (autoPlay) enqueueAudio(playUrl, msgId);
        return true;
      } else {
        console.warn('TTS response:', data);
        const errMsg = data?.message || 'Gemini TTS không trả về dữ liệu âm thanh.';
        if (typeof window !== 'undefined') (window as any).__lastTtsError = errMsg;
        showToastMsg(`Lỗi tạo giọng đọc: ${errMsg}`, 'error');
        return false;
      }
    } catch (err: any) {
      console.error('Lỗi generateVoice:', err);
      const errMsg = err?.message || 'Lỗi kết nối máy chủ TTS.';
      if (typeof window !== 'undefined') (window as any).__lastTtsError = errMsg;
      showToastMsg(`Lỗi kết nối TTS: ${errMsg}`, 'error');
      return false;
    } finally {
      setCreatingVoices(prev => ({ ...prev, [msgId]: false }));
    }
  }, [authState, currentSessionId, showToastMsg, enqueueAudio]);

  const playVoice = React.useCallback((audioUrl: string | null, msgId: string, role?: string, isForcePlay: boolean = false, msgObj?: any) => {
    if (!isForcePlay && currentlyPlayingId === msgId) {
      clearAudioQueue();
      return;
    }

    clearAudioQueue();

    if (role === 'ai' || role === 'ASSISTANT') {
      const targetMsg = msgObj;
      if (targetMsg && targetMsg.text) {
        const { greetingText, stanzaText, aiReply } = parseMessageParts(targetMsg.text);

        // 1. Mào Đầu (Tệp thu sẵn hoặc TTS)
        const normGreeting = normalizeAudioUrl(targetMsg.greetingAudioUrl || audioUrl);
        if (normGreeting) {
          audioQueueRef.current.push({ audioUrl: normGreeting, msgId });
        } else if (greetingText) {
          generateVoice(msgId + '_greeting', greetingText, 'ai', currentSessionId, true);
        }

        // 2 & 3. "Hãy nghe kệ đây:" và Bài Kệ Thiền (Nối tiếp 0ms)
        if (stanzaText) {
          audioQueueRef.current.push({ audioUrl: '/uploads/audio/transition_hay_nghe_ke_day.wav', msgId });

          const poemDb = poemDbState.poemDatabase || [];
          const allStanzas = poemDb.flatMap((p: any) => p.stanzas || []);
          const matchedStanza = allStanzas.find((st: any) => st.content && stanzaText.includes(st.content.trim()));

          const normStanzaAudio = normalizeAudioUrl(targetMsg.stanzaAudioUrl || matchedStanza?.audioUrl);
          if (normStanzaAudio) {
            audioQueueRef.current.push({ audioUrl: normStanzaAudio, msgId });
          } else {
            generateVoice(msgId + '_stanza', stanzaText, 'ai', currentSessionId, true);
          }
        }

        // 4. AI Đúc Kết
        if (aiReply) {
          generateVoice(msgId, aiReply, 'ai', currentSessionId, true);
        }

        processAudioQueue();
        return;
      }
    }

    if (audioUrl) {
      enqueueAudio(audioUrl, msgId);
    } else if (msgObj && (msgObj.text || msgObj.content)) {
      generateVoice(msgId, msgObj.text || msgObj.content, role || 'ai', currentSessionId, true);
    }
  }, [currentlyPlayingId, clearAudioQueue, enqueueAudio, poemDbState, currentSessionId, generateVoice, parseMessageParts, processAudioQueue]);

  // Video Export state
  const videoExportState = useVideoExport({
    user: authState.user,
    currentUser: authState.user,
    messages: poemDbState.messages,
    poemDatabase: poemDbState.poemDatabase,
    updateCurrentMessages: poemDbState.updateCurrentMessages,
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    laoVoiceRef: { current: authState.laoVoice },
    laoVoiceStyleRef: { current: authState.laoVoiceStyle },
    userVoiceRef: { current: authState.userVoice },
    userVoiceStyleRef: { current: authState.userVoiceStyle },
    laoSelfCallRef: { current: authState.laoSelfCall },
    laoCallUserRef: { current: authState.laoCallUser },
    userSelfCallRef: { current: authState.userSelfCall },
    userCallLaoRef: { current: authState.userCallLao },
    userName: authState.customUserName || 'Con',
    userGender: authState.userGender,
    userAge: authState.userAge,
    appLanguage: authState.appLanguage,
    selectedAiConfigIdRef: { current: authState.selectedAiConfigId },
    geminiApiKeyRef: { current: '' },
    showToastMsg,
    generateVoice,
    setShowHistory,
    voicePersonas,
  });

  // Đọc query parameter modal=auto-pilot / modal=ai-director từ URL để tự động mở Xưởng Phim Tự Động (F5 Persistence)
  const setShowAutoPilotModalFn = videoExportState?.setShowAutoPilotModal;
  const setHasEnteredFn = poemDbState?.setHasEntered;
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modal = params.get('modal');
      if (modal === 'auto-pilot' || modal === 'ai-director') {
        if (setShowAutoPilotModalFn) setShowAutoPilotModalFn(true);
        if (setHasEnteredFn) setHasEnteredFn(true);
      }
    }
  }, [setShowAutoPilotModalFn, setHasEnteredFn]);

  // Live Streaming state
  const liveStreamingState = useLiveStreaming({
    user: authState.user,
    messages: poemDbState.messages,
    updateCurrentMessages: poemDbState.updateCurrentMessages,
    isMuted: false,
    isVoiceEnabled: true,
    laoVoiceRef: { current: authState.laoVoice },
    laoVoiceStyleRef: { current: authState.laoVoiceStyle },
    userVoiceRef: { current: authState.userVoice },
    userVoiceStyleRef: { current: authState.userVoiceStyle },
    laoSelfCallRef: { current: authState.laoSelfCall },
    laoCallUserRef: { current: authState.laoCallUser },
    userSelfCallRef: { current: authState.userSelfCall },
    userCallLaoRef: { current: authState.userCallLao },
    userName: authState.customUserName || 'Con',
    userGender: authState.userGender,
    userAge: authState.userAge,
    appLanguage: authState.appLanguage,
    selectedAiConfigIdRef: { current: authState.selectedAiConfigId },
    geminiApiKeyRef: { current: '' },
    showToastMsg: (msg: string, type?: string) => console.log(`[Toast] ${type || 'info'}: ${msg}`),
    searchTrainedDatabase: () => '',
    smartLocalSemanticRouter: () => [],
    generateVoice,
    processAiResponse: () => {},
    activeAudioRef: { current: null },
    audioQueueRef: { current: [] },
    isPlayingQueueRef: { current: false },
    currentlyPlayingId,
    setCurrentlyPlayingId,
    isThinkingRef: { current: false },
    currentlyPlayingIdRef: { current: null },
    allCharacters: videoExportState.allCharacters || [],
    applyCharacterPreset: videoExportState.applyCharacterPreset,
    handleChangeChatLao: videoExportState.handleChangeChatLao,
    charOffsets: { lao: { x: 0, y: 0, s: 1, flip: false } },
    setCharOffsets: () => {},
    setChatLaoVideos: videoExportState.setChatLaoVideos,
    publicAis: authState.publicAis,
  });

  // Tự động đồng bộ các Modal & Live Mode khi người dùng ấn nút Back/Forward của trình duyệt (Popstate)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncModalsFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const modalParam = urlParams.get('modal');
      const modeParam = urlParams.get('mode');
      const isAutoPilot = modalParam === 'auto-pilot';
      const isAiDirector = modalParam === 'ai-director' || urlParams.get('showAITopicModal') === 'true';
      setShowAiManager(!isAutoPilot && isAiDirector);
      setShowPoemModal(modalParam === 'poem-vault' || urlParams.get('poem') === 'vault');
      setShowAutoPilotModal(isAutoPilot);
      if (typeof liveStreamingState?.setIsLiveMode === 'function') {
        if (isAutoPilot || isAiDirector) {
          liveStreamingState.setIsLiveMode(false);
        } else if (modeParam === 'live' || urlParams.get('live') === 'true') {
          liveStreamingState.setIsLiveMode(true);
        }
      }
    };
    syncModalsFromUrl();
    window.addEventListener('popstate', syncModalsFromUrl);
    return () => window.removeEventListener('popstate', syncModalsFromUrl);
  }, [liveStreamingState?.setIsLiveMode]);

  // Tự động thỉnh Lão Hóa làm hình tướng mặc định khi nạp dữ liệu từ DB
  React.useEffect(() => {
    if (voicePersonas.length > 0 && videoExportState.handleChangeChatLao) {
      const selected = voicePersonas.find((vp: any) => vp.name === 'Lão Hóa') || voicePersonas[0];
      setCurrentVoicePersonaId(selected.id);
      videoExportState.handleChangeChatLao(selected.id);
    }
  }, [voicePersonas]);

  const handleChangeVoicePersona = (idOrName: string) => {
    const selected = voicePersonas.find((vp: any) => 
      vp.id === idOrName || vp.name?.toLowerCase().trim() === String(idOrName).toLowerCase().trim()
    );
    if (selected) {
      setCurrentVoicePersonaId(selected.id);
      if (videoExportState.handleChangeChatLao) {
        videoExportState.handleChangeChatLao(selected.id);
      }
    } else if (videoExportState.handleChangeChatLao) {
      videoExportState.handleChangeChatLao(idOrName);
    }
  };

  // --- HÀM GỬI TIN NHẮN CHAT (CHUẨN 3 BƯỚC: MÀO ĐẦU + KỆ PHÁP + AI GIẢI ĐÁP TTS) ---
  const handleSendMessage = async (text: string, emotion: string = 'calm') => {
    if (!text.trim()) return;
    autoReleaseRamMemory();
    try {
      if (unlockedAudioRef.current) {
        unlockedAudioRef.current.play().then(() => unlockedAudioRef.current?.pause()).catch(() => {});
      }
    } catch (e) {}

    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      const userId = authState.user?.id || null;
      const createRes = await createChatSessionAction(userId, text.slice(0, 30));
      if (createRes.success && createRes.data) {
        activeSessionId = createRes.data.id;
        const newSession = {
          id: activeSessionId,
          title: createRes.data.title,
          isPinned: false,
          messages: [],
          messagesLoaded: true,
          type: 'chat',
          createdAt: createRes.data.createdAt
        };
        setSessions((prev: any[]) => [newSession, ...prev]);
        setCurrentSessionId(activeSessionId);
      } else {
        return;
      }
    }

    const randStr = Math.random().toString(36).substring(2, 9);
    const userMsgId = `user_${Date.now()}_${randStr}`;
    const userMsg = {
      id: userMsgId,
      role: 'user',
      text: text.trim(),
      emotion: emotion,
      timestamp: new Date(),
      audioUrl: null,
      sessionId: activeSessionId
    };

    // Cập nhật tin nhắn vào session hiện tại
    updateCurrentMessages((prev: any[]) => [...prev, userMsg], activeSessionId);

    saveChatMessageAction(
      activeSessionId,
      'USER',
      text.trim(),
      null,
      null,
      userMsgId,
      emotion
    ).catch(err => console.warn('Lỗi lưu tin nhắn con:', err));

    // BƯỚC 1: TRÍCH XUẤT MÀO ĐẦU CÓ ÂM THANH THU ÂM SẴN TỪ CSDL (/api/opening-phrases/random?category=...)
    const lower = text.toLowerCase();
    let cat = 'mundane_weather';
    if (/(mệt|đau|bệnh|sức khỏe|ốm|thân)/.test(lower)) cat = 'health_daily';
    else if (/(buồn|khổ|chán|bế tắc|khóc|suy sụp)/.test(lower)) cat = 'complaining_lost';
    else if (/(yêu|thương|chia tay|tình|chia ly|người yêu)/.test(lower)) cat = 'love_heartbreak';
    else if (/(tiền|nợ|giàu|nghèo|công danh|sự nghiệp|làm ăn)/.test(lower)) cat = 'money_debt';
    else if (/(đạo|ngộ|tâm|thiền|giác ngộ|tam vô|bản thể)/.test(lower)) cat = 'serious_dharma';

    let greetingText = "A Di Đà Phật, Lão lắng nghe con...";
    let greetingAudioUrl: string | null = null;

    try {
      const phraseRes = await fetch(`/api/opening-phrases/random?category=${cat}`);
      if (phraseRes.ok) {
        const phraseJson = await phraseRes.json();
        if (phraseJson?.data) {
          greetingText = phraseJson.data.text || phraseJson.data.content || greetingText;
          greetingAudioUrl = phraseJson.data.audioUrl || null;
        }
      }
    } catch (e) {}

    // BƯỚC 2: TRÍCH XUẤT KỆ PHÁP KHỚP NỘI DUNG TỪ DB (ƯU TIÊN BÀI KỆ CÓ THU ÂM SẴN CÓ 0MS LATENCY)
    const poemDatabase = poemDbState.poemDatabase || [];
    let matchedStanza: any = null;
    if (poemDatabase.length > 0) {
      const allStanzas = poemDatabase.flatMap((p: any) => p.stanzas || []);
      if (allStanzas.length > 0) {
        // Ưu tiên tập hợp bài kệ ĐÃ CÓ tệp âm thanh thu âm sẵn trên ổ cứng (/uploads/audio/stanza_poem_...wav)
        const stanzasWithAudio = allStanzas.filter((st: any) => st.audioUrl && String(st.audioUrl).trim().length > 0);
        const pool = stanzasWithAudio.length > 0 ? stanzasWithAudio : allStanzas;

        matchedStanza = pool.find((st: any) => 
          st.tags && Array.isArray(st.tags) && st.tags.some((t: string) => lower.includes(String(t).toLowerCase()))
        );
        if (!matchedStanza) {
          matchedStanza = pool[Math.floor(Math.random() * pool.length)];
        }
      }
    }

    const stanzaText = matchedStanza ? matchedStanza.content : "";
    const transitionText = "Hãy nghe kệ đây:";

    let initialText = greetingText;
    if (stanzaText) {
      initialText += `\n\n${transitionText}\n${stanzaText}`;
    }

    const aiMsgId = `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const aiThinkingMsg = {
      id: aiMsgId,
      role: 'ai',
      text: `${initialText}\n\n...`,
      emotion: 'calm',
      timestamp: new Date(),
      audioUrl: normalizeAudioUrl(greetingAudioUrl) || normalizeAudioUrl(matchedStanza?.audioUrl) || null,
      sessionId: activeSessionId
    };

    updateCurrentMessages((prev: any[]) => [...prev, aiThinkingMsg], activeSessionId);

    // ⚡ BƯỚC 1: PHÁT ÂM THANH MÀO ĐẦU (Ưu tiên tệp thu âm sẵn -> Nếu chưa có gọi Gemini TTS)
    const normGreetingAudio = normalizeAudioUrl(greetingAudioUrl);
    if (normGreetingAudio) {
      enqueueAudio(normGreetingAudio, aiMsgId);
    } else {
      generateVoice(aiMsgId + '_greeting', greetingText, 'ai', activeSessionId, true);
    }

    // ⚡ BƯỚC 2 & 3: PHÁT ÂM THANH "HÃY NGHE KỆ ĐÂY:" VÀ BÀI KỆ THIỀN (NỐI TIẾP)
    if (stanzaText) {
      // 2. Phát câu chuyển "Hãy nghe kệ đây:" từ tệp thu sẵn trên ổ cứng (/uploads/audio/transition_hay_nghe_ke_day.wav)
      enqueueAudio('/uploads/audio/transition_hay_nghe_ke_day.wav', aiMsgId);

      // 3. Phát Bài Kệ (Ưu tiên tệp thu âm sẵn trên đĩa -> Nếu chưa có gọi Gemini TTS)
      const normStanzaAudio = normalizeAudioUrl(matchedStanza?.audioUrl);
      if (normStanzaAudio) {
        enqueueAudio(normStanzaAudio, aiMsgId);
      } else {
        generateVoice(aiMsgId + '_stanza', stanzaText, 'ai', activeSessionId, true);
      }
    }

    // BƯỚC 3: AI GIẢI ĐÁP & SINH GIỌNG ĐỌC TTS NỐI TIẾP
    try {
      let token = typeof window !== 'undefined' ? localStorage.getItem('onglao_token') : null;
      const currentAiId = authState.selectedAiConfigId || 7;

      const promptToAI = `TÌNH HUỐNG:
Người hỏi (Con): "${text.trim()}"
BÀI KỆ THAM KHẢO TỪ HỆ THỐNG:
"${stanzaText}"

YÊU CẦU: Lão đã cất lời mào đầu và đọc bài kệ trên cho người hỏi nghe rồi. Bây giờ CHỈ CẦN viết phần đúc kết giải đáp và 1 câu hỏi tự vấn cuối cùng (bằng Tiếng Việt). KHÔNG chép lại bài kệ.`;

      let res = await fetch('/api/giacngo/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: promptToAI,
          aiConfigId: currentAiId
        })
      });

      if (res.status === 401 && token) {
        localStorage.removeItem('onglao_token');
        res = await fetch('/api/giacngo/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: promptToAI,
            aiConfigId: currentAiId
          })
        });
      }

      const data = await res.json();
      const aiReply = (data?.message || data?.reply || data?.content || 'An lạc vốn dĩ ở trong tâm con...').replace(/^\[.*?\]/, '').trim();

      // GHÉP TOÀN BỘ VĂN BẢN TRÊN MÀN HÌNH (1. MÀO ĐẦU -> 2. KỆ PHÁP -> 3. AI GIẢI ĐÁP)
      let fullMessageText = greetingText;
      if (stanzaText) {
        fullMessageText += `\n\n${transitionText}\n${stanzaText}`;
      }
      fullMessageText += `\n\n${aiReply}`;

      updateCurrentMessages((prev: any[]) => prev.map((m: any) => m.id === aiMsgId ? { ...m, text: fullMessageText } : m), activeSessionId);

      saveChatMessageAction(
        activeSessionId,
        'ASSISTANT',
        fullMessageText,
        null,
        null,
        aiMsgId,
        'calm'
      ).catch(err => console.warn('Lỗi lưu tin nhắn Lão:', err));

      // NẠP THÊM GIỌNG ĐỌC PHẦN ĐÚC KẾT CỦA AI VÀO HÀNG CHỜ PHÁT NỐI TIẾP
      generateVoice(aiMsgId, aiReply, 'ai', activeSessionId, true);

    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn chat:', err);
      const errText = 'Lỗi kết nối máy chủ đàm đạo.';
      updateCurrentMessages((prev: any[]) => prev.map((m: any) => m.id === aiMsgId ? { ...m, text: errText } : m), activeSessionId);
    }
  };

  const handleRefineInput = async (text: string) => {
    if (!text.trim()) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('onglao_token') : null;
      const res = await fetch('/api/giacngo/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: `Hãy gọt giũa và tinh chỉnh lại câu thưa thỉnh sau đây cho ngắn gọn, súc tích, lễ phép: "${text}"`,
          aiConfigId: authState.selectedAiConfigId || 7
        })
      });
      const data = await res.json();
      return data?.message || data?.reply || data?.content || text;
    } catch (err) {
      console.warn('Lỗi refine input:', err);
      return text;
    }
  };

  const currentSession = (sessions || []).find((s: any) => s.id === currentSessionId) || null;
  const messages = currentSession?.messages || [];

  const updateCurrentMessages = (updater: any, targetSessionId?: string | null) => {
    const activeId = targetSessionId || currentSessionId;
    
    setSessions((prev: any[]) => (prev || []).map((s: any) => {
      if (s.id === activeId) {
        const current = s.messages || [];
        const nextMsgs = typeof updater === 'function' ? updater(current) : updater;
        return { ...s, messages: nextMsgs };
      }
      return s;
    }));
  };

  const handleCreateSession = React.useCallback(async () => {
    try {
      const targetUserId = authState.user?.id || authState.currentUser?.id || null;
      const title = `Cuộc đàm đạo ${sessions.length + 1}`;
      const res = await createChatSessionAction(targetUserId, title, "chat");
      let newSession: any;
      if (res.success && res.data) {
        newSession = {
          id: res.data.id,
          title: res.data.title,
          type: res.data.type || "chat",
          isPinned: false,
          messages: [],
          messagesLoaded: true,
          createdAt: res.data.createdAt
        };
      } else {
        newSession = {
          id: `session_${Date.now()}`,
          title: title,
          type: "chat",
          isPinned: false,
          messages: [],
          messagesLoaded: true,
          createdAt: new Date()
        };
      }
      setSessions((prev: any[]) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      if (poemDbState?.updateCurrentMessages) {
        poemDbState.updateCurrentMessages([]);
      }
      showToastMsg('Đã tạo cuộc đàm đạo mới thành công!', 'success');
    } catch (err: any) {
      console.error('Lỗi handleCreateSession:', err);
      showToastMsg(`Lỗi khởi tạo phiên đàm đạo CSDL: ${err.message || 'Thất bại'}`, 'warning');
    }
  }, [authState.user, authState.currentUser, showToastMsg]);

  const handleDeleteSession = React.useCallback(async (sessionId: string, e?: any) => {
    if (e) e.stopPropagation();
    setSessions((prev: any[]) => {
      const updated = prev.filter((s: any) => s.id !== sessionId);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
    deleteChatSessionAction(sessionId).catch(err => console.warn("Lỗi xóa session DB:", err));
    showToastMsg("Đã xóa cuộc đàm đạo!", "info");
  }, [currentSessionId, showToastMsg]);

  const togglePin = React.useCallback((sessionId: string) => {
    setSessions((prev: any[]) => {
      const updated = prev.map((s: any) => {
        if (s.id === sessionId) {
          return { ...s, isPinned: !s.isPinned };
        }
        return s;
      });
      try {
        const pinnedIds = updated.filter((s: any) => s.isPinned).map((s: any) => s.id);
        localStorage.setItem('onglao_pinned_sessions', JSON.stringify(pinnedIds));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Dynamic Lip Sync & Speaking State for Avatar (Chỉ mở khẩu hình KHI âm thanh đang phát thực tế)
  const isLaoSpeakingSession = Boolean(currentlyPlayingId);
  const [mouthOpen, setMouthOpen] = React.useState<number>(0);

  React.useEffect(() => {
    if (!isLaoSpeakingSession) {
      setMouthOpen(0);
      return;
    }
    const interval = setInterval(() => {
      setMouthOpen(Math.floor(Math.random() * 15) + 5);
    }, 150);
    return () => {
      clearInterval(interval);
      setMouthOpen(0);
    };
  }, [isLaoSpeakingSession]);

  const [showAuthModalLocal, setShowAuthModalLocal] = React.useState(false);
  const showAuthModal = authState.showAuthModal || showAuthModalLocal;
  const setShowAuthModal = React.useCallback((val: boolean) => {
    setShowAuthModalLocal(val);
    if (typeof authState.setShowAuthModal === 'function') {
      authState.setShowAuthModal(val);
    }
  }, [authState]);

  const [isRecording, setIsRecording] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  const toggleMic = React.useCallback(async () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToastMsg('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói WebSpeech API', 'warning');
      return;
    }

    if (isRecording && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsRecording(false);
      showToastMsg('Đã dừng ghi âm mic', 'info');
      return;
    }

    try {
      // 1. Kích hoạt Popup xin quyền Micro (Allow Microphone) của trình duyệt
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(t => t.stop());
        } catch (permErr: any) {
          showToastMsg('📌 Bấm icon Ổ khóa/Cài đặt góc trái thanh địa chỉ URL -> Chọn Cho phép (Allow) Micro -> Tải lại trang (F5)', 'warning', 6000);
          return;
        }
      }

      const rec = new SpeechRecognition();
      rec.lang = 'vi-VN';
      rec.continuous = true;
      rec.interimResults = true;

      rec.onstart = () => {
        setIsRecording(true);
        showToastMsg('🎙️ Đang lắng nghe... Hãy thưa thỉnh cùng Lão!', 'success');
      };

      rec.onresult = (e: any) => {
        const transcript = Array.from(e.results)
          .map((r: any) => (r as any)[0].transcript)
          .join('');
        
        // Điền văn bản giọng nói trực tiếp vào ô thưa thỉnh DOM
        const chatInput = document.querySelector('[data-tutorial="tut-input"] input') as HTMLInputElement;
        if (chatInput) {
          chatInput.value = transcript;
          chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      };

      rec.onerror = (e: any) => {
        console.warn('SpeechRecognition error:', e);
        setIsRecording(false);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          showToastMsg('📌 Bấm icon Ổ khóa/Cài đặt góc trái thanh địa chỉ URL -> Chọn Cho phép (Allow) Micro -> Tải lại trang (F5)', 'warning', 6000);
        } else {
          showToastMsg(`Lỗi mic: ${e.error || 'không thể ghi âm'}`, 'warning');
        }
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err: any) {
      console.error('toggleMic error:', err);
      setIsRecording(false);
      showToastMsg('Lỗi khởi động Mic: ' + err.message, 'warning');
    }
  }, [isRecording, showToastMsg]);

  // Gộp state chung để truyền vào các component mô-đun
  const passProps = {
    ...authState,
    ...poemDbState,
    ...videoExportState,
    ...liveStreamingState,
    showAuthModal,
    setShowAuthModal,
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    currentSession,
    messages,
    updateCurrentMessages,
    handleCreateSession,
    handleDeleteSession,
    togglePin,
    showSessions,
    setShowSessions,
    showHistory,
    setShowHistory,
    showAiManager,
    setShowAiManager,
    showAITopicModal: showAiManager,
    setShowAITopicModal: setShowAiManager,
    showAutoPilotModal: showAutoPilotModal || videoExportState?.showAutoPilotModal,
    setShowAutoPilotModal: (val: boolean) => {
      setShowAutoPilotModal(val);
      if (videoExportState?.setShowAutoPilotModal) videoExportState.setShowAutoPilotModal(val);
    },
    showPoemModal,
    setShowPoemModal,
    showUserGuide,
    setShowUserGuide,
    aiScriptDate,
    setAiScriptDate,
    voicePersonas,
    setVoicePersonas,
    currentVoicePersonaId,
    setCurrentVoicePersonaId,
    handleSendMessage,
    handleRefineInput,
    showToastMsg,
    generateVoice,
    playVoice,
    creatingVoices,
    currentlyPlayingId,
    setCurrentlyPlayingId,
    isLaoSpeakingSession,
    mouthOpen,
    isVoiceEnabled,
    setIsVoiceEnabled,
    isRecording,
    toggleMic,
  };

  return (
    <main className="w-full h-screen relative overflow-hidden bg-slate-950">
      {/* GLOBAL TOAST NOTIFICATION MODAL */}
      {toastNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
          <div className={`px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-3 min-w-[320px] max-w-lg ${
            toastNotification.type === 'success' ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-100 shadow-emerald-950/60' :
            toastNotification.type === 'error' ? 'bg-rose-950/95 border-rose-500/50 text-rose-100 shadow-rose-950/60' :
            toastNotification.type === 'warning' ? 'bg-amber-950/95 border-amber-500/50 text-amber-100 shadow-amber-950/60' :
            toastNotification.type === 'loading' ? 'bg-indigo-950/95 border-indigo-500/50 text-indigo-100 shadow-indigo-950/60' :
            'bg-slate-900/95 border-white/20 text-slate-100 shadow-slate-950/60'
          }`}>
            <div className="shrink-0">
              {toastNotification.type === 'success' && <div className="p-1.5 bg-emerald-500/20 rounded-xl text-emerald-400"><CheckCircle2 size={20} /></div>}
              {toastNotification.type === 'error' && <div className="p-1.5 bg-rose-500/20 rounded-xl text-rose-400"><AlertTriangle size={20} /></div>}
              {toastNotification.type === 'warning' && <div className="p-1.5 bg-amber-500/20 rounded-xl text-amber-400"><AlertTriangle size={20} /></div>}
              {toastNotification.type === 'loading' && <div className="p-1.5 bg-indigo-500/20 rounded-xl text-indigo-400"><Loader2 size={20} className="animate-spin" /></div>}
              {(!toastNotification.type || toastNotification.type === 'info') && <div className="p-1.5 bg-sky-500/20 rounded-xl text-sky-400"><Sparkles size={20} /></div>}
            </div>
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toastNotification.msg}
            </div>
            <button onClick={() => setToastNotification(null)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 0. BẮT BUỘC HIỂN THỊ TRANG ĐĂNG NHẬP FULL PAGE KHI CHƯA ĐĂNG NHẬP */}
      {!passProps.isLoggedIn ? (
        <LoginPage onLogin={passProps.handleLogin} />
      ) : (
        <>
          {pageRoute === 'livestream' ? (
            <LiveModePanel p={{ ...passProps, isLiveMode: true }} />
          ) : pageRoute === 'ke-phap' ? (
            <PoemVaultModal p={{ ...passProps, showPoemModal: true }} inline={true} />
          ) : pageRoute === 'xuong-phim' ? (
            <NormalModePanel p={{ ...passProps, showAutoPilotModal: true }} />
          ) : pageRoute === 'kich-ban' ? (
            <AiDirectorManagerModal p={{ ...passProps, show: true, onClose: () => { window.location.href = '/'; } }} />
          ) : pageRoute === 'tao-video' ? (
            <VideoCreatorModal p={{ ...passProps, showVideoExportModal: true }} />
          ) : (
            <>
              {(showAiManager || passProps.showAITopicModal) && (
                <AiDirectorManagerModal p={{ ...passProps, show: true, onClose: () => { setShowAiManager(false); if (passProps.setShowAITopicModal) passProps.setShowAITopicModal(false); } }} />
              )}

              {!passProps.hasEntered && !passProps.showAutoPilotModal && !showAiManager && !passProps.showAITopicModal ? (
                <WelcomeScreen p={passProps} />
              ) : passProps.showVideoExportModal ? (
                <VideoCreatorModal p={passProps} />
              ) : passProps.showAutoPilotModal ? (
                <NormalModePanel p={passProps} />
              ) : passProps.showPoemModal ? (
                <PoemVaultModal p={passProps} />
              ) : !passProps.isLiveMode ? (
                <NormalModePanel p={passProps} />
              ) : (
                <LiveModePanel p={passProps} />
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
