"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Pencil, Trash2, Plus, Play, Pause, Music, Loader2, Save, RefreshCw, ChevronLeft, ChevronRight, ArrowRight, Volume2, Film, Mic, Info, Video, Layers } from 'lucide-react';
import AiDirectorModal from './AiDirectorModal';
import ScriptModal, { ScriptModalHandle } from './ScriptModal';
import {
    getChatMessagesAction,
    getScriptSessionsAction,
    deleteChatSessionAction,
    saveChatMessageAction,
    createChatSessionAction,
    updateChatSessionTitleAction,
    updateChatSessionVoicesAction,
    deleteChatMessageAction,
    batchSaveScriptAction
} from '@/actions/chat';

const VOICES_MALE = ['Algieba','Puck','Charon','Fenrir','Orus','Enceladus','Iapetus'];
const VOICES_FEMALE = ['Aoede','Kore','Leda','Zephyr','Callirrhoe','Autonoe'];

interface AiDirectorManagerModalProps {
    show: boolean;
    onClose: () => void;
    sessions: any[];
    setSessions: (v: any[] | ((prev: any[]) => any[])) => void;
    currentSessionId: any;
    setCurrentSessionId: (v: any) => void;
    // Auth props to pass to script creator
    appLanguage: string; setAppLanguage: (v: string) => void;
    customLaoName: string; setCustomLaoName: (v: string) => void;
    laoSelfCall: string;   setLaoSelfCall: (v: string) => void;
    laoCallUser: string;   setLaoCallUser: (v: string) => void;
    laoVoice: string;      setLaoVoice: (v: string) => void;
    laoVoiceStyle: string; setLaoVoiceStyle: (v: string) => void;
    customUserName: string; setCustomUserName: (v: string) => void;
    userSelfCall: string;   setUserSelfCall: (v: string) => void;
    userCallLao: string;    setUserCallLao: (v: string) => void;
    userVoice: string;      setUserVoice: (v: string) => void;
    userVoiceStyle: string; setUserVoiceStyle: (v: string) => void;
    aiTopicText: string;        setAiTopicText: (v: string) => void;
    aiScriptLength: string;     setAiScriptLength: (v: string) => void;
    publicSettings?: any;
    aiLaoStyle: string;         setAiLaoStyle: (v: string) => void;
    aiUserEmotionArc: string;   setAiUserEmotionArc: (v: string) => void;
    aiScriptTitle: string;      setAiScriptTitle: (v: string) => void;
    aiScriptDate: string;       setAiScriptDate: (v: string) => void;
    onGenerate: (overrides?: { topic?: string; laoName?: string; laoSelf?: string; laoCallU?: string; userName?: string; userSelf?: string; userCallL?: string; }) => void;
    isGenerating: boolean;
    generatedScriptText: string;
    setGeneratedScriptText: (v: string) => void;
    onSaveGeneratedScript?: (overrides?: { scriptText?: string; laoName?: string; userName?: string }) => void;
    generateVoice: (msgId: any, text: string, role: string, sessionId: any, forceRecreate?: boolean, prefixAudioUrls?: any, textToSynthesize?: any, appendOnly?: any, customVoiceName?: any, customVoiceStyle?: any) => Promise<boolean>;
    saveNewSessionWithMessages: (title: string, messages: any[]) => Promise<any>;
    poemDatabase: any[];
    selectedAiConfigId: any;
    showToastMsg: (msg: string, type?: string) => void;
    user: any;
    currentUser?: any;
    saveUserProfile: (userId?: string) => void;
    showScriptModal?: boolean;
    setShowScriptModal?: (v: boolean) => void;
    setShowVideoExportModal?: (v: boolean) => void;
    setVideoExportSource?: (v: string | null) => void;
    handleGenerateScriptVoices?: (sessionId?: string) => Promise<void>;
    allCharacters?: any[];
}

const AiDirectorManagerModal = (p: AiDirectorManagerModalProps) => {
    const [view, setView] = useState<'list' | 'edit'>(() => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            const modal = url.searchParams.get('modal');
            const action = url.searchParams.get('action');
            const id = url.searchParams.get('id');
            const type = url.searchParams.get('type');
            if (modal === 'ai-director' && (action || id)) {
                if (action === 'insert' && type === 'ai') return 'list';
                return 'edit';
            }
        }
        return 'list';
    });
    const [selectedScript, setSelectedScript] = useState<any>(null);
    const [editingMessages, setEditingMessages] = useState<any[]>([]);
    const [editingRawText, setEditingRawText] = useState<string>("");
    const scriptModalRef = useRef<ScriptModalHandle>(null); // Ref để gọi getLatestText() trước khi save
    const [saving, setSaving] = useState(false);
    const [downloadingAudio, setDownloadingAudio] = useState(false);
    const [generatingAudio, setGeneratingAudio] = useState(false);
    const [audioProgress, setAudioProgress] = useState<{ current: number; total: number; percent: number } | null>(null);
    // Multi-select state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [deleteConfirm, setDeleteConfirm] = useState<{ids: string[], count: number} | null>(null);
    // Per-script audio progress: scriptId -> { current, total, percent }
    const [scriptAudioProgress, setScriptAudioProgress] = useState<Record<string, { current: number; total: number; percent: number }>>({});
    const [showCreator, setShowCreator] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            const modal = url.searchParams.get('modal');
            const action = url.searchParams.get('action');
            const type = url.searchParams.get('type');
            if (modal === 'ai-director' && action === 'insert' && type === 'ai') return true;
        }
        return false;
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [editingTopic, setEditingTopic] = useState('');
    const [editingLength, setEditingLength] = useState('Khoảng 6-10 câu');
    const [editingLaoStyle, setEditingLaoStyle] = useState('Từ bi, ôn hòa, dắt dụ từng bước');
    const [editingUserEmotionArc, setEditingUserEmotionArc] = useState('Từ đau khổ/bế tắc chuyển dần sang an lạc/bừng sáng');
    const [editingLanguage, setEditingLanguage] = useState('vi');
    const [editingIncludePoem, setEditingIncludePoem] = useState<boolean>(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    // Đồng bộ hoá action (insert/update), type (manual/ai) và id lên URL slug khi tạo mới hoặc sửa kịch bản
    useEffect(() => {
        if (typeof window !== 'undefined' && p.show) {
            const url = new URL(window.location.href);
            let updated = false;

            if (showCreator || p.showScriptModal) {
                if (url.searchParams.get('action') !== 'insert' || url.searchParams.get('type') !== 'ai') {
                    url.searchParams.set('modal', 'ai-director');
                    url.searchParams.set('action', 'insert');
                    url.searchParams.set('type', 'ai');
                    url.searchParams.delete('id');
                    updated = true;
                }
            } else if (view === 'edit' && selectedScript) {
                const isNew = selectedScript.id?.startsWith('temp_');
                const targetAction = isNew ? 'insert' : 'update';
                const targetType = selectedScript.title?.toLowerCase().includes('[thủ công]') ? 'manual' : 'ai';

                if (url.searchParams.get('action') !== targetAction || url.searchParams.get('type') !== targetType || url.searchParams.get('id') !== selectedScript.id) {
                    url.searchParams.set('modal', 'ai-director');
                    url.searchParams.set('action', targetAction);
                    url.searchParams.set('type', targetType);
                    url.searchParams.set('id', selectedScript.id);
                    updated = true;
                }
            } else if (view === 'list' && !showCreator && !p.showScriptModal) {
                if (url.searchParams.has('action') || url.searchParams.has('id') || url.searchParams.has('type')) {
                    url.searchParams.set('modal', 'ai-director');
                    url.searchParams.delete('action');
                    url.searchParams.delete('id');
                    url.searchParams.delete('type');
                    updated = true;
                }
            }

            if (updated) {
                window.history.replaceState(null, '', url.toString());
            }
        }
    }, [view, selectedScript?.id, showCreator, p.showScriptModal, p.show]);

    // Mở VideoCreator từ script edit form: dùng childmodal URL routing (KHÔNG đóng AiDirectorManagerModal)
    const handleOpenVideoCreator = () => {
        if (!selectedScript) return;
        const scriptId = selectedScript.id;

        // Cập nhật URL: thêm childmodal + videoid
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('childmodal', 'create-video');
            url.searchParams.set('scriptid', scriptId);
            window.history.pushState(null, '', url.toString());
        }

        // Set session ID và mở VideoExport modal chồng lên
        p.setCurrentSessionId(scriptId);
        if (p.setSessions && selectedScript.messages) {
            p.setSessions((prev: any[]) => {
                const exists = prev?.some((x: any) => x.id === scriptId);
                if (exists) {
                    return prev.map((x: any) => x.id === scriptId ? { ...x, messages: selectedScript.messages, messagesLoaded: true } : x);
                } else {
                    return [{ ...selectedScript, messagesLoaded: true }, ...(prev || [])];
                }
            });
        }
        if (p.setVideoExportSource) p.setVideoExportSource('ai_director_childmodal');
        if (p.setShowVideoExportModal) p.setShowVideoExportModal(true);
    };


    // Tự động khôi phục đúng Form (Tạo mới thủ công / Tạo mới AI / Chỉnh sửa) khi mở modal hoặc ấn F5
    const restoredFromUrlRef = useRef(false);
    useEffect(() => {
        if (typeof window !== 'undefined' && p.show) {
            const url = new URL(window.location.href);
            const modalParam = url.searchParams.get('modal');
            const actionParam = url.searchParams.get('action');
            const typeParam = url.searchParams.get('type');
            const idParam = url.searchParams.get('id');

            if (modalParam === 'ai-director' && !restoredFromUrlRef.current) {
                if (actionParam === 'insert' && typeParam === 'ai') {
                    if (!showCreator) setShowCreator(true);
                    if (p.setShowScriptModal) p.setShowScriptModal(true);
                    restoredFromUrlRef.current = true;
                } else if (actionParam === 'insert' && typeParam === 'manual') {
                    if (!selectedScript) handleCreateManualScript();
                    restoredFromUrlRef.current = true;
                } else if (idParam) {
                    if (p.sessions.length > 0) {
                        const script = p.sessions.find(s => s.id === idParam);
                        if (script) {
                            if (selectedScript?.id !== idParam) handleStartEdit(script);
                            restoredFromUrlRef.current = true;
                        } else if (actionParam === 'insert') {
                            if (!selectedScript) handleCreateManualScript();
                            restoredFromUrlRef.current = true;
                        }
                    }
                }
            }
        }
        if (!p.show) {
            restoredFromUrlRef.current = false;
        }
    }, [p.show, p.sessions, view, showCreator, selectedScript?.id]);

    const preloadedRef = useRef(false);
    // Tự động tải tin nhắn cho tất cả kịch bản khi mở modal để tránh race condition khi nghe thử/tạo video
    useEffect(() => {
        if (!p.show) {
            preloadedRef.current = false;
            return;
        }
        if (preloadedRef.current) return;
        preloadedRef.current = true;

        const preloadScriptsMessages = async () => {
            try {
                const res = await getScriptSessionsAction(p.user?.id);
                if (res.success && res.data) {
                    const loadedScriptMap = new Map();
                    res.data.forEach((s: any) => {
                        const mappedMsgs = (s.messages || []).map((m: any) => ({
                            id: m.id || m.msgId || Date.now(),
                            role: m.role === 'ASSISTANT' ? 'ai' : (m.role === 'OUTRO' ? 'outro' : 'user'),
                            text: m.content,
                            timestamp: m.createdAt ? new Date(m.createdAt) : new Date(),
                            audioUrl: m.audioUrl || null,
                            emotion: m.emotion || 'calm'
                        }));
                        loadedScriptMap.set(s.id, mappedMsgs);
                    });
                    p.setSessions((prev: any[]) => prev.map((x: any) => {
                        if (loadedScriptMap.has(x.id)) {
                            return { ...x, messages: loadedScriptMap.get(x.id), messagesLoaded: true };
                        }
                        return x;
                    }));
                }
            } catch (e: any) {
                console.error("Failed to load script sessions:", e);
                if (e?.message?.includes('Server Action') || String(e).includes('Server Action')) {
                    if (p.showToastMsg) p.showToastMsg('Server đã được cập nhật phiên bản mới. Lão hãy nhấn Ctrl + F5 để nạp lại trang.', 'warning');
                }
            }
        };
        preloadScriptsMessages();
    }, [p.show]);

    // Watch sessions: tự load messages cho kịch bản script chưa được load (mới tạo hoặc chưa có messagesLoaded)
    const loadingSessionIdsRef = useRef<Set<string>>(new Set());
    useEffect(() => {
        if (!p.show) return;
        const unloaded = p.sessions.filter((s: any) =>
            (s.type === 'script' || s.type === 'chat|script') && !s.messagesLoaded
        );
        if (unloaded.length === 0) return;

        unloaded.forEach(async (session: any) => {
            if (loadingSessionIdsRef.current.has(session.id)) return;
            loadingSessionIdsRef.current.add(session.id);
            try {
                const res = await getChatMessagesAction(session.id);
                if (res.success && res.data) {
                    const mappedMsgs = res.data.map((m: any) => ({
                        id: m.id || m.msgId || Date.now(),
                        role: m.role === 'ASSISTANT' ? 'ai' : (m.role === 'OUTRO' ? 'outro' : 'user'),
                        text: m.content,
                        timestamp: m.createdAt ? new Date(m.createdAt) : new Date(),
                        audioUrl: m.audioUrl || null,
                        emotion: m.emotion || 'calm'
                    }));
                    p.setSessions((prev: any[]) => prev.map((x: any) =>
                        x.id === session.id ? { ...x, messages: mappedMsgs, messagesLoaded: true } : x
                    ));
                }
            } catch (e: any) {
                console.error('Failed to load messages for session', session.id, e);
                if (e?.message?.includes('Server Action') || String(e).includes('Server Action')) {
                    if (p.showToastMsg) p.showToastMsg('Server đã được cập nhật phiên bản mới. Lão hãy nhấn Ctrl + F5 để nạp lại trang.', 'warning');
                }
            } finally {
                loadingSessionIdsRef.current.delete(session.id);
            }
        });
    }, [p.show, p.sessions]);


    const handleInsertRole = (roleName: string, emotionTag?: string) => {
        const text = editingRawText;
        const tagStr = emotionTag ? `[${emotionTag}] ` : '';
        const prefixStr = `${roleName}: ${tagStr}`;
        const actualPrefix = text.length === 0 || text.endsWith('\n') ? prefixStr : `\n${prefixStr}`;
        setEditingRawText(text + actualPrefix);
    };

    // Audio Playlist Player State
    const [playingScriptId, setPlayingScriptId] = useState<any>(null);
    const [playlist, setPlaylist] = useState<any[]>([]);
    const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [durations, setDurations] = useState<number[]>([]);
    const [totalDuration, setTotalDuration] = useState(0);
    const [currentElapsedTime, setCurrentElapsedTime] = useState(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playIntervalRef = useRef<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [editingTitle, setEditingTitle] = useState('');
    const [editingDate, setEditingDate] = useState('');
    const [editingLaoVoice, setEditingLaoVoice] = useState('Algieba');
    const [editingLaoVoiceStyle, setEditingLaoVoiceStyle] = useState('');
    const [editingUserVoice, setEditingUserVoice] = useState('Aoede');
    const [editingUserVoiceStyle, setEditingUserVoiceStyle] = useState('');
    const [showVoiceSettings, setShowVoiceSettings] = useState(false);
    const [showAiParams, setShowAiParams] = useState(false);
    const [isHoveringScripts, setIsHoveringScripts] = useState(false);

    // Local state cho nhân vật - không gọi context setter mỗi keystroke
    const [localLaoName, setLocalLaoName] = useState(p.customLaoName || 'Lão');
    const [localLaoSelf, setLocalLaoSelf] = useState(p.laoSelfCall || 'Lão');
    const [localLaoCallU, setLocalLaoCallU] = useState(p.laoCallUser || 'Con');
    const [localUserName, setLocalUserName] = useState(p.customUserName || 'Con');
    const [localUserSelf, setLocalUserSelf] = useState(p.userSelfCall || 'Con');
    const [localUserCallL, setLocalUserCallL] = useState(p.userCallLao || 'Lão');

    // Sync local state khi props thay đổi (ví dụ: chọn nhân vật từ dropdown)
    useEffect(() => {
        setLocalLaoName(p.customLaoName || 'Lão');
        setLocalLaoSelf(p.laoSelfCall || 'Lão');
        setLocalLaoCallU(p.laoCallUser || 'Con');
        setLocalUserName(p.customUserName || 'Con');
        setLocalUserSelf(p.userSelfCall || 'Con');
        setLocalUserCallL(p.userCallLao || 'Lão');
    }, [p.customLaoName, p.laoSelfCall, p.laoCallUser, p.customUserName, p.userSelfCall, p.userCallLao]);


    // Reset pagination when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType]);

    // Filter sessions
    const scripts = p.sessions.filter((s: any) => {
        if (s.type !== 'script' && s.type !== 'chat|script') return false;
        if (filterType === 'ai' && s.title.includes('[Thủ công]')) return false;
        if (filterType === 'manual' && !s.title.includes('[Thủ công]')) return false;
        if (searchTerm && !s.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const totalPages = Math.ceil(scripts.length / itemsPerPage) || 1;
    const activePage = Math.min(currentPage, totalPages);
    const startIndex = (activePage - 1) * itemsPerPage;
    const paginatedScripts = scripts.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        if (!audioRef.current && typeof window !== 'undefined') {
            audioRef.current = new Audio();
        }
        return () => {
            stopPlaylist();
        };
    }, []);



    // Load messages when editing
    const handleStartEdit = async (script: any) => {
        setSelectedScript(script);
        setEditingTitle(script.title.replace(/^(\[AI\]|\[Thủ công\])?\s*/i, '').trim());
        setEditingLaoVoice(script.laoVoice || p.laoVoice || 'Algieba');
        setEditingLaoVoiceStyle(script.laoVoiceStyle || p.laoVoiceStyle || 'Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu');
        setEditingUserVoice(script.userVoice || p.userVoice || 'Aoede');
        setEditingUserVoiceStyle(script.userVoiceStyle || p.userVoiceStyle || 'giọng thanh niên, phong cách đọc tỏ vẻ rối rắm, thắc mắc, chuẩn giọng miền Nam Việt Nam, đúng chính tả');
        setShowVoiceSettings(false);

        // Reset/init AI regeneration parameters
        setEditingTopic(script.topic || script.title.replace(/^(\[AI\]|\[Thủ công\])?\s*/i, '').trim());
        setEditingLength(p.aiScriptLength || 'Khoảng 6-10 câu');
        setEditingLaoStyle(p.aiLaoStyle || 'Từ bi, ôn hòa, dắt dụ từng bước');
        setEditingUserEmotionArc(p.aiUserEmotionArc || 'Từ đau khổ/bế tắc chuyển dần sang an lạc/bừng sáng');
        setEditingLanguage(p.appLanguage === 'Tiếng Việt' || p.appLanguage === 'vi' ? 'vi' : 'en');
        
        // Convert script.updatedAt to local datetime string format for input value (with fallback for invalid/missing dates)
        const dateObj = script.updatedAt ? new Date(script.updatedAt) : new Date();
        const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
        const tzOffset = validDate.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(validDate.getTime() - tzOffset)).toISOString().slice(0, 16);
        setEditingDate(localISOTime);

        setSaving(true);
        try {
            const res = await getChatMessagesAction(script.id);
            if (res.success && res.data) {
                const mapped = res.data.map((m: any) => ({
                    id: m.id,
                    role: m.role === 'ASSISTANT' ? 'ai' : (m.role === 'OUTRO' ? 'outro' : 'user'),
                    text: m.content,
                    audioUrl: m.audioUrl,
                    emotion: m.emotion || 'calm'
                }));
                setEditingMessages(mapped);

                // Tạo raw text cho 1 textbox
                const raw = mapped.map((m: any) => {
                    const prefix = m.role === 'ai' ? (p.customLaoName || 'Lão') : (m.role === 'outro' ? 'Outro' : (p.customUserName || 'Con'));
                    const emoTag = m.emotion && m.emotion !== 'calm' ? `[${m.emotion === 'joy' ? 'vui' : (m.emotion === 'sad' ? 'buồn' : (m.emotion === 'hook' ? 'hook' : m.emotion))}] ` : '';
                    return `${prefix}: ${emoTag}${m.text}`;
                }).join('\n');
                setEditingRawText(raw);

                setView('edit');
            } else {
                p.showToastMsg('Không thể tải chi tiết kịch bản: ' + (res.error || 'Lỗi không xác định'), 'error');
            }
        } catch (err: any) {
            p.showToastMsg('Không thể tải chi tiết kịch bản.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleRegenerateAIScript = async () => {
        if (!editingTopic.trim()) {
            p.showToastMsg('Vui lòng nhập chủ đề đàm đạo.', 'error');
            return;
        }
        setIsRegenerating(true);
        p.showToastMsg('Đang nhờ AI soạn lại kịch bản...', 'loading');
        try {
            const quoteRule = editingIncludePoem ? (
                (editingLanguage === 'Tiếng Việt' || editingLanguage === 'vi') 
                    ? '- Tắt hoàn toàn chức năng tự làm thơ. Chọn đúng 4 câu kệ (không kèm ngày tháng) phù hợp nhất từ kho dữ liệu. Giữ nguyên văn. BẮT BUỘC: Mỗi câu kệ phải nằm trên một dòng riêng biệt (Enter xuống dòng). Trước khi trích dẫn, bắt buộc nói: "Sư Cha Tam Vô đã khai thị như sau:".'
                    : `- Tắt hoàn toàn chức năng tự làm thơ. Chọn đúng 4 câu kệ (không kèm ngày tháng) phù hợp nhất từ kho. BẮT BUỘC DỊCH 4 câu kệ đó sang ${editingLanguage}. MANDATORY: Each line of the poem MUST be separated by a new line (Enter). Trước khi trích dẫn, nói câu (bằng ${editingLanguage}) có nghĩa là: "Sư Cha Tam Vô đã khai thị như sau:".`
            ) : '- TUYỆT ĐỐI KHÔNG trích dẫn bất kỳ bài kệ hay thơ nào của Sư Cha Tam Vô. Chỉ hội thoại đàm đạo trực tiếp giữa Minh Sư và Người hỏi.';
    
            const prompt = `Viết một kịch bản đàm đạo tâm linh sâu sắc giữa hai nhân vật.
            
            NGÔN NGỮ KỊCH BẢN BẮT BUỘC: ${editingLanguage === 'vi' || editingLanguage === 'Tiếng Việt' ? 'Tiếng Việt' : 'English'}
    
            THÔNG TIN VÀ QUY TẮC XƯNG HÔ (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT 100%):
            
            1. Nhân vật Minh Sư (Người đáp):
            - Tên hiển thị kịch bản: ${p.customLaoName || 'Lão'}
            - Phong cách lời dạy: ${editingLaoStyle}
            - Khi nói chuyện, bắt buộc tự xưng mình là: "${p.laoSelfCall || 'Lão'}"
            - Khi gọi/nhắc đến đối phương, bắt buộc dùng từ: "${p.laoCallUser || 'Con'}"
    
            2. Nhân vật Phàm Trần (Người hỏi):
            - Tên hiển thị kịch bản: ${p.customUserName || 'Con'}
            - Khi nói chuyện, bắt buộc tự xưng mình là: "${p.userSelfCall || 'Con'}"
            - Khi gọi/nhắc đến Minh Sư, bắt buộc dùng từ: "${p.userCallLao || 'Lão'}"
    
            LƯU Ý XƯNG HÔ: Tuyệt đối không xưng hô lộn xộn.
    
            - Chủ đề vướng mắc của Người hỏi: "${editingTopic}"
            
            YÊU CẦU ÉP BUỘC VỀ SỐ LƯỢNG LƯỢT THOẠI (RẤT QUAN TRỌNG):
            - TỔNG SỐ DÒNG THOẠI CỦA CẢ 2 NHÂN VẬT CỘNG LẠI: BẮT BUỘC ĐÚNG ${editingLength}.
            - QUY ĐỊNH ĐẾM: Mỗi lần 1 nhân vật cất tiếng nói được tính là 1 dòng thoại.
            - NẾU CHỌN "Khoảng 6-10 câu": TỔNG SỐ LƯỢT THOẠI (CẢ LÃO + CON CỘNG LẠI) TỐI ĐA CHỈ TỪ 6 ĐẾN 10 DÒNG. TUYỆT ĐỐI KHÔNG ĐƯỢC VIẾT VƯỢT QUÁ 10 DÒNG THOẠI.
            - TUYỆT ĐỐI KHÔNG đếm riêng từng người (không được viết 6-10 câu cho Lão và 6-10 câu cho Con). Đếm tổng toàn bộ kịch bản!
            
            HÀNH TRÌNH BIẾN ĐỔI CẢM XÚC:
            - ${editingUserEmotionArc}
            
            Quy tắc định dạng văn bản:
            - Định dạng kịch bản trả về BẮT BUỘC phải bắt đầu bằng tiền tố "${p.customUserName || 'Con'}:" và "${p.customLaoName || 'Lão'}:" ở mỗi dòng.
            - CHÈN THẺ CẢM XÚC: Phân tích nội tâm nhân vật ở câu đó và chèn 1 trong 4 thẻ: [hook], [calm], [sad], [joy] ngay sau tên.
            ${quoteRule}
            
            ${editingIncludePoem ? `KHO TÀNG KỆ CỦA SƯ CHA TAM VÔ:
            ${(() => {
              const topicWords = editingTopic.toLowerCase().split(/\s+/).filter(w => w.length > 2);
              let filtered = p.poemDatabase;
              if (topicWords.length > 0) {
                filtered = p.poemDatabase.filter((po: any) => {
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
                filtered = p.poemDatabase.slice(0, 15);
              } else if (filtered.length > 20) {
                filtered = filtered.slice(0, 20);
              }
              return filtered.map((po: any) => `Tên bài: ${po.title}\n` + po.stanzas.map((s: any) => `Tags: ${s.tags.join(', ')}\nNội dung Kệ:\n${s.content}`).join('\n\n')).join('\n\n---\n\n');
            })()}` : ''}`;
    
            const res = await fetch('/api/giacngo/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    aiConfigId: p.selectedAiConfigId || 7,
                    message: prompt,
                    language: (editingLanguage === 'Tiếng Việt' || editingLanguage === 'vi') ? 'vi' : 'en'
                })
            });
            const data = await res.json();
            if (data.message) {
                setEditingRawText(data.message);
                p.showToastMsg('Đã tạo lại kịch bản AI thành công! Hãy kiểm tra và bấm "Lưu kịch bản".', 'success');
            } else {
                p.showToastMsg('AI không trả về kết quả hoặc lỗi API.', 'error');
            }
        } catch (e: any) {
            console.error("Failed to regenerate AI script:", e);
            p.showToastMsg('Không thể kết nối AI để tạo lại kịch bản.', 'error');
        } finally {
            setIsRegenerating(false);
        }
    };

    // Execute actual delete
    const executeDeleteScripts = async (ids: string[]) => {
        setSaving(true);
        try {
            for (const id of ids) {
                const res = await deleteChatSessionAction(id);
                if (res.success) {
                    p.setSessions((prev: any[]) => prev.filter(s => s.id !== id));
                    if (p.currentSessionId === id) {
                        p.setCurrentSessionId(null);
                    }
                } else {
                    p.showToastMsg('Lỗi khi xóa kịch bản: ' + (res.error || ''), 'error');
                }
            }
            p.showToastMsg('Đã xóa ' + ids.length + ' kịch bản.', 'success');
        } catch (err) {
            p.showToastMsg('Lỗi khi xóa kịch bản.', 'error');
        } finally {
            setSaving(false);
            setDeleteConfirm(null);
            setSelectedIds(new Set());
        }
    };

    const parseRawTextToBlocks = (textInput: string) => {
        if (!textInput || !textInput.trim()) return [];
        const lines = textInput.split('\n');
        const newMsgs: any[] = [];

        const laoNames = ['lão', 'đáp', 'ai', 'người khai thị', 'lao', 'assistant', 'reply', 'answer'];
        const userNames = ['con', 'người hỏi', 'hỏi', 'user', 'question', 'ask'];
        const outroNames = ['outro', 'kết', 'kết thúc', 'end', 'ending'];
        const customLao = p.customLaoName?.trim().toLowerCase();
        const customUser = p.customUserName?.trim().toLowerCase();
        if (customLao && !laoNames.includes(customLao)) laoNames.push(customLao);
        if (customUser && !userNames.includes(customUser)) userNames.push(customUser);

        const laoPattern = new RegExp(`^(${laoNames.map(n => n.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')).join('|')})(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:`, 'i');
        const userPattern = new RegExp(`^(${userNames.map(n => n.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')).join('|')})(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:`, 'i');
        const outroPattern = new RegExp(`^(${outroNames.map(n => n.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')).join('|')})(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:`, 'i');

        const normalizeEmotionTag = (tag?: string, text?: string): string => {
            if (tag) {
                const lower = tag.toLowerCase().trim();
                if (lower.includes('vui') || lower.includes('joy') || lower.includes('cuoi') || lower.includes('cười') || lower.includes('hạnh phúc')) return 'joy';
                if (lower.includes('buon') || lower.includes('buồn') || lower.includes('sad') || lower.includes('khoc') || lower.includes('khóc') || lower.includes('bế tắc')) return 'sad';
                if (lower.includes('hook') || lower.includes('mào đầu') || lower.includes('intro')) return 'hook';
                if (lower.includes('calm') || lower.includes('binhthuong') || lower.includes('bình thường')) return 'calm';
            }
            if (text) {
                const lowerTxt = text.toLowerCase();
                if (lowerTxt.match(/khổ|buồn|bế tắc|khóc|lo lắng|áp lực|thất bại|vỡ nợ/)) return 'sad';
                if (lowerTxt.match(/vui|hạnh phúc|an lạc|cười|biết ơn|tuyệt vời/)) return 'joy';
            }
            return 'calm';
        };

        lines.forEach((line, idx) => {
            const text = line.trim();
            if (!text) return;

            let role = null;
            let emotion = 'calm';
            let cleanText = text;

            const userMatch = text.match(userPattern);
            const laoMatch = text.match(laoPattern);
            const outroMatch = text.match(outroPattern);

            if (userMatch) {
                role = 'user';
                emotion = userMatch[2] || userMatch[3] || '';
                cleanText = text.replace(userMatch[0], '').trim();
            } else if (laoMatch) {
                role = 'ai';
                emotion = laoMatch[2] || laoMatch[3] || '';
                cleanText = text.replace(laoMatch[0], '').trim();
            } else if (outroMatch) {
                role = 'outro';
                emotion = outroMatch[2] || outroMatch[3] || '';
                cleanText = text.replace(outroMatch[0], '').trim();
            } else {
                if (newMsgs.length > 0) {
                    newMsgs[newMsgs.length - 1].text += '\n' + text;
                }
                return;
            }

            const afterColonMatch = cleanText.match(/^(?:\[(.*?)\]|\((.*?)\))\s*/);
            if (afterColonMatch) {
                if (!emotion) {
                    emotion = afterColonMatch[1] || afterColonMatch[2] || '';
                }
                cleanText = cleanText.replace(afterColonMatch[0], '').trim();
            }

            emotion = normalizeEmotionTag(emotion, cleanText);

            if (role && cleanText) {
                newMsgs.push({
                    id: `temp_msg_${idx}_${Date.now()}`,
                    role,
                    text: cleanText,
                    emotion
                });
            }
        });

        return newMsgs;
    };

    // Tự động phân tách realtime khi gõ/dán văn bản vào editingRawText
    useEffect(() => {
        if (view !== 'edit') return;
        if (!editingRawText || !editingRawText.trim()) return;
        const parsed = parseRawTextToBlocks(editingRawText);
        if (parsed.length > 0) {
            setEditingMessages(prev => {
                return parsed.map((pMsg, idx) => {
                    const prevMsg = prev[idx];
                    if (prevMsg && prevMsg.text === pMsg.text) {
                        return { ...pMsg, id: prevMsg.id || pMsg.id, audioUrl: prevMsg.audioUrl };
                    }
                    return pMsg;
                });
            });
        }
    }, [editingRawText, p.customLaoName, p.customUserName, view]);

    // Trigger single delete modal
    const handleDeleteScript = (id: any) => {
        setDeleteConfirm({ ids: [id], count: 1 });
    };

    // Save editing messages
    const handleBackToList = () => {
        setView('list');
        setShowCreator(false);
        if (p.setShowScriptModal) p.setShowScriptModal(false);
        setSelectedScript(null);
        setEditingMessages([]);
        setEditingRawText('');
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('modal', 'ai-director');
            url.searchParams.delete('action');
            url.searchParams.delete('id');
            url.searchParams.delete('type');
            window.history.replaceState(null, '', url.toString());
        }
    };

    const handleSaveScript = async (transitionToList: boolean | any = true) => {
        if (saving) return;
        const shouldTransition = transitionToList === true || typeof transitionToList !== 'boolean';

        const latestText = scriptModalRef.current?.getLatestText() ?? editingRawText;

        setSaving(true);
        try {
            const newMsgs = parseRawTextToBlocks(latestText);

            // So sánh với editingMessages cũ để giữ lại audioUrl nếu text không đổi
            const finalMsgs = newMsgs.map((newMsg, idx) => {
                const oldMsg = editingMessages[idx];
                if (oldMsg && oldMsg.role === newMsg.role && oldMsg.text === newMsg.text) {
                    return { ...newMsg, id: oldMsg.id, audioUrl: oldMsg.audioUrl };
                }
                return { ...newMsg, id: oldMsg ? oldMsg.id : Date.now().toString() + idx, audioUrl: null };
            });

            // Chuẩn bị payload cho batch save
            const messagesPayload = finalMsgs.map(msg => ({
                id: msg.id.toString(),
                role: (msg.role === 'ai' ? 'ASSISTANT' : (msg.role === 'outro' ? 'OUTRO' : 'USER')) as 'USER' | 'ASSISTANT' | 'SYSTEM' | 'OUTRO',
                content: msg.text,
                audioUrl: msg.audioUrl,
                voiceStyleId: null,
                emotion: msg.emotion
            }));

            const deleteMessageIds: string[] = [];
            if (finalMsgs.length < editingMessages.length) {
                for (let i = finalMsgs.length; i < editingMessages.length; i++) {
                    deleteMessageIds.push(editingMessages[i].id.toString());
                }
            }

            // Save title and date if provided
            let finalTitle = selectedScript.title;
            let finalDate: Date | undefined = undefined;
            let finalDateStr = selectedScript.updatedAt;
            if (editingTitle.trim() && editingDate) {
                const prefix = selectedScript.title.startsWith('[AI]') 
                    ? '[AI] ' 
                    : selectedScript.title.startsWith('[Thủ công]') 
                        ? '[Thủ công] ' 
                        : '';
                finalTitle = `${prefix}${editingTitle.trim()}`;
                finalDate = new Date(editingDate);
                finalDateStr = finalDate.toISOString();
            }

            // TÂM AN FIX: Nếu là kịch bản tạm thời, hãy tạo nó trong database trước!
            let realSessionId = selectedScript.id;
            let isNewSession = false;
            if (realSessionId.startsWith('temp_')) {
                const targetUserId = p.currentUser?.id || p.user?.uid;
                const prefix = selectedScript.title.startsWith('[AI]') 
                    ? '[AI] ' 
                    : selectedScript.title.startsWith('[Thủ công]') 
                        ? '[Thủ công] ' 
                        : '';
                const baseTitle = editingTitle.trim() || 'Kịch bản mới';
                const createdTitle = `${prefix}${baseTitle}`;
                const createdDate = editingDate ? new Date(editingDate) : new Date();

                const createRes = await createChatSessionAction(targetUserId, createdTitle, "script", createdDate);
                if (!createRes.success || !createRes.data) {
                    throw new Error(createRes.error || 'Lỗi tạo kịch bản mới trong database.');
                }
                realSessionId = createRes.data.id;
                selectedScript.id = realSessionId;
                isNewSession = true;
            }

            const voicesPayload = {
                laoVoice: editingLaoVoice,
                laoVoiceStyle: editingLaoVoiceStyle,
                userVoice: editingUserVoice,
                userVoiceStyle: editingUserVoiceStyle
            };

            // Gọi batch save action
            const res = await batchSaveScriptAction(
                realSessionId,
                messagesPayload,
                deleteMessageIds,
                finalTitle,
                finalDate,
                voicesPayload
            );

            if (!res.success) {
                throw new Error(res.error || 'Lỗi lưu kịch bản.');
            }

            // Synchronize the local sessions state
            if (isNewSession) {
                const newSession = {
                    id: realSessionId,
                    title: finalTitle,
                    type: 'script',
                    isPinned: false,
                    messages: finalMsgs,
                    messagesLoaded: true,
                    updatedAt: finalDateStr,
                    createdAt: finalDateStr,
                    laoVoice: editingLaoVoice,
                    laoVoiceStyle: editingLaoVoiceStyle,
                    userVoice: editingUserVoice,
                    userVoiceStyle: editingUserVoiceStyle,
                };
                p.setSessions([newSession, ...p.sessions]);
                setSelectedScript(newSession);
            } else {
                p.setSessions(p.sessions.map(s => s.id === selectedScript.id ? { 
                    ...s, 
                    title: finalTitle, 
                    updatedAt: finalDateStr,
                    laoVoice: editingLaoVoice,
                    laoVoiceStyle: editingLaoVoiceStyle,
                    userVoice: editingUserVoice,
                    userVoiceStyle: editingUserVoiceStyle,
                } : s));

                // Also update the selectedScript local reference
                setSelectedScript((prev: any) => ({
                    ...prev,
                    id: realSessionId,
                    title: finalTitle,
                    updatedAt: finalDateStr,
                    laoVoice: editingLaoVoice,
                    laoVoiceStyle: editingLaoVoiceStyle,
                    userVoice: editingUserVoice,
                    userVoiceStyle: editingUserVoiceStyle,
                }));
            }

            p.showToastMsg('Đã lưu kịch bản thành công!', 'success');
            if (shouldTransition) {
                handleBackToList();
            } else {
                if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    url.searchParams.set('modal', 'ai-director');
                    url.searchParams.set('action', 'update');
                    url.searchParams.set('type', finalTitle.toLowerCase().includes('[thủ công]') ? 'manual' : 'ai');
                    url.searchParams.set('id', realSessionId);
                    window.history.replaceState(null, '', url.toString());
                }
            }
        } catch (err: any) {
            console.error("Lỗi khi lưu kịch bản:", err);
            p.showToastMsg('Lỗi khi lưu kịch bản: ' + (err.message || ''), 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveScriptRef = useRef(handleSaveScript);
    useEffect(() => {
        handleSaveScriptRef.current = handleSaveScript;
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (view === 'edit' && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                handleSaveScriptRef.current();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [view]);

    const handleDownloadMultiSpeakerAudio = async () => {
        if (!editingRawText.trim()) {
            p.showToastMsg('Kịch bản đang trống!', 'error');
            return;
        }
        setDownloadingAudio(true);
        try {
            p.showToastMsg('Đang tạo Audio gộp từ Gemini 2.5 Flash, quá trình này có thể mất vài chục giây...', 'success');
            const res = await fetch('/api/tts/multispeaker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scriptText: editingRawText,
                    laoVoice: editingLaoVoice || p.laoVoice,
                    userVoice: editingUserVoice || p.userVoice,
                    laoName: p.customLaoName || 'Lão',
                    userName: p.customUserName || 'Con'
                })
            });

            if (!res.ok) {
                let err = '';
                try {
                    const data = await res.json();
                    err = data.message;
                } catch {
                    err = await res.text();
                }
                throw new Error(err || 'Lỗi tải audio');
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `KichBan_MultiSpeaker_${selectedScript.id.substring(0, 6)}.wav`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            p.showToastMsg('Tải file Audio hoàn tất!', 'success');
        } catch (err: any) {
            console.error(err);
            p.showToastMsg('Lỗi tạo Audio Gộp: ' + err.message, 'error');
        } finally {
            setDownloadingAudio(false);
        }
    };

    const handleCreateAIScript = () => {
        const tempId = 'temp_' + Date.now();
        const newSession = {
            id: tempId,
            title: "Kịch bản mới",
            type: 'script',
            isPinned: false,
            messages: [],
            messagesLoaded: true
        };
        setSelectedScript(newSession);
        setEditingMessages([]);
        setEditingRawText('');
        setEditingTitle('Kịch bản mới');
        setEditingLaoVoice(p.laoVoice || 'Algieba');
        setEditingLaoVoiceStyle('');
        setEditingUserVoice(p.userVoice || 'Aoede');
        setEditingUserVoiceStyle('');
        p.setCustomUserName?.('Con');
        p.setCustomLaoName?.('Lão');
        p.setUserSelfCall?.('Con');
        p.setUserCallLao?.('Lão');
        p.setLaoSelfCall?.('Lão');
        p.setLaoCallUser?.('Con');
        
        const validDate = new Date();
        const tzOffset = validDate.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(validDate.getTime() - tzOffset)).toISOString().slice(0, 16);
        setEditingDate(localISOTime);

        setView('edit');
        p.showToastMsg('Đã khởi tạo kịch bản AI mới. Vui lòng nhập chủ đề và bấm "Lưu kịch bản"!', 'info');
    };

    const handleCreateManualScript = () => {
        const tempId = 'temp_' + Date.now();
        const newSession = {
            id: tempId,
            title: "[Thủ công] Kịch bản mới",
            type: 'script',
            isPinned: false,
            messages: [],
            messagesLoaded: true
        };
        setSelectedScript(newSession);
        setEditingMessages([]);
        setEditingRawText('');
        setEditingTitle('Kịch bản mới');
        setEditingLaoVoice(p.laoVoice || 'Algieba');
        setEditingLaoVoiceStyle(p.laoVoiceStyle || 'Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu');
        setEditingUserVoice(p.userVoice || 'Aoede');
        setEditingUserVoiceStyle(p.userVoiceStyle || 'giọng thanh niên, phong cách đọc tỏ vẻ rối rắm, thắc mắc, chuẩn giọng miền Nam Việt Nam, đúng chính tả');
        p.setCustomUserName?.('Con');
        p.setCustomLaoName?.('L\u00e3o');
        p.setUserSelfCall?.('Con');
        p.setUserCallLao?.('L\u00e3o');
        p.setLaoSelfCall?.('L\u00e3o');
        p.setLaoCallUser?.('Con');
        
        const validDate = new Date();
        const tzOffset = validDate.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(validDate.getTime() - tzOffset)).toISOString().slice(0, 16);
        setEditingDate(localISOTime);

        setView('edit');
        p.showToastMsg('Đã khởi tạo kịch bản trống. Vui lòng soạn thảo và bấm "Lưu kịch bản"!', 'info');
    };

    // Tạo audio trực tiếp trong edit view, tự động lưu trước
    const handleGenerateAudioInEditView = async (forceAll: boolean = false) => {
        setGeneratingAudio(true);
        setAudioProgress({ current: 0, total: 0, percent: 0 });
        try {
            // 1. Tự động lưu kịch bản trước
            if (editingRawText.trim().length > 0) {
                await handleSaveScript(false);
            }

            // 2. Tải lại danh sách tin nhắn mới nhất
            const resFetch = await getChatMessagesAction(selectedScript.id);
            let currentMsgs = editingMessages;
            if (resFetch.success && resFetch.data) {
                const mapped = resFetch.data.map((m: any) => ({
                    id: m.id,
                    role: m.role.toLowerCase() === 'user' ? 'user' : 'ai',
                    text: m.content,
                    audioUrl: m.audioUrl,
                    emotion: m.emotion || 'calm'
                }));
                setEditingMessages(mapped);
                currentMsgs = mapped;
            }

            // 3. Lọc ra những thoại cần tạo (forceAll=true thì tạo toàn bộ, false thì chỉ tạo thoại chưa có audio)
            const toGenerate = forceAll
                ? currentMsgs.filter(m => m.text.trim().length > 0)
                : currentMsgs.filter(m => !m.audioUrl && m.text.trim().length > 0);
            const total = toGenerate.length;

            if (total === 0) {
                p.showToastMsg('Tất cả thoại đã có audio rồi!', 'success');
                return;
            }

            setAudioProgress({ current: 0, total, percent: 0 });
            let successCount = 0;

            // 4. Tạo từng audio
            for (let i = 0; i < toGenerate.length; i++) {
                const msg = toGenerate[i];
                setAudioProgress({ current: i + 1, total, percent: Math.round(((i) / total) * 100) });
                const targetRole = msg.role === 'ai' ? 'ai' : 'user';
                const targetVoice = targetRole === 'ai' ? (editingLaoVoice || p.laoVoice || 'Algieba') : (editingUserVoice || p.userVoice || 'Aoede');
                const targetStyle = targetRole === 'ai' ? (editingLaoVoiceStyle || p.laoVoiceStyle || '') : (editingUserVoiceStyle || p.userVoiceStyle || '');
                const success = await p.generateVoice(msg.id, msg.text, targetRole, selectedScript.id, forceAll, null, null, false, targetVoice, targetStyle);
                if (success) {
                    successCount++;
                    setAudioProgress({ current: i + 1, total, percent: Math.round(((i + 1) / total) * 100) });
                } else {
                    p.showToastMsg(`Lỗi tạo audio thoại số ${currentMsgs.indexOf(msg) + 1}. Dừng.`, 'error');
                    break;
                }
            }

            // 5. Tải lại messages với audioUrl mới
            if (successCount > 0) {
                const res = await getChatMessagesAction(selectedScript.id);
                if (res.success && res.data) {
                    const mapped = res.data.map((m: any) => ({
                        id: m.id,
                        role: m.role.toLowerCase() === 'user' ? 'user' : 'ai',
                        text: m.content,
                        audioUrl: m.audioUrl,
                        emotion: m.emotion || 'calm'
                    }));
                    setEditingMessages(mapped);
                    p.setSessions((prev: any[]) => prev.map((x: any) => x.id === selectedScript.id ? { ...x, messages: mapped, messagesLoaded: true } : x));
                }
                p.showToastMsg(`Hoàn tất! Đã tạo ${successCount}/${total} audio.`, 'success');
            }
        } catch (err) {
            p.showToastMsg('Lỗi tạo âm thanh.', 'error');
        } finally {
            setGeneratingAudio(false);
            setAudioProgress(null);
        }
    };

    // Tạo audio cho 1 script cụ thể từ list view, hiển thị progress inline
    const handleGenerateScriptAudio = async (script: any, forceAll: boolean = false) => {
        const sessionId = script.id;
        setScriptAudioProgress(prev => ({ ...prev, [sessionId]: { current: 0, total: 0, percent: 0 } }));
        try {
            // Tải messages của script
            const resFetch = await getChatMessagesAction(sessionId);
            if (!resFetch.success || !resFetch.data) {
                p.showToastMsg('Không thể tải tin nhắn kịch bản.', 'error');
                return;
            }
            const msgs = resFetch.data.map((m: any) => ({
                id: m.id,
                role: m.role.toLowerCase() === 'user' ? 'user' : 'ai',
                text: m.content,
                audioUrl: m.audioUrl,
            }));
            // Cập nhật session messages
            p.setSessions((prev: any[]) => prev.map((x: any) => x.id === sessionId ? { ...x, messages: msgs, messagesLoaded: true } : x));

            const toGenerate = forceAll
                ? msgs.filter((m: any) => m.text.trim().length > 0)
                : msgs.filter((m: any) => !m.audioUrl && m.text.trim().length > 0);
            const total = toGenerate.length;
            if (total === 0) {
                p.showToastMsg('Tất cả thoại đã có audio!', 'success');
                return;
            }
            setScriptAudioProgress(prev => ({ ...prev, [sessionId]: { current: 0, total, percent: 0 } }));

            let successCount = 0;
            for (let i = 0; i < toGenerate.length; i++) {
                const msg = toGenerate[i];
                const targetRole = msg.role === 'ai' ? 'ai' : 'user';
                const targetVoice = targetRole === 'ai' ? (editingLaoVoice || p.laoVoice || 'Algieba') : (editingUserVoice || p.userVoice || 'Aoede');
                const targetStyle = targetRole === 'ai' ? (editingLaoVoiceStyle || p.laoVoiceStyle || '') : (editingUserVoiceStyle || p.userVoiceStyle || '');
                const success = await p.generateVoice(msg.id, msg.text, targetRole, sessionId, forceAll, null, null, false, targetVoice, targetStyle);
                if (success) {
                    successCount++;
                    setScriptAudioProgress(prev => ({ ...prev, [sessionId]: { current: i + 1, total, percent: Math.round(((i + 1) / total) * 100) } }));
                } else {
                    p.showToastMsg(`Lỗi tạo audio thoại ${i + 1}/${total}. Dừng.`, 'error');
                    break;
                }
            }
            if (successCount > 0) {
                // Cập nhật lại messages mới
                const res = await getChatMessagesAction(sessionId);
                if (res.success && res.data) {
                    const updated = res.data.map((m: any) => ({
                        id: m.id, role: m.role.toLowerCase() === 'user' ? 'user' : 'ai',
                        text: m.content, audioUrl: m.audioUrl, emotion: m.emotion || 'calm'
                    }));
                    p.setSessions((prev: any[]) => prev.map((x: any) => x.id === sessionId ? { ...x, messages: updated, messagesLoaded: true } : x));
                }
                p.showToastMsg(`Hoàn tất! Đã tạo ${successCount}/${total} audio cho kịch bản.`, 'success');
            }
        } catch (err) {
            p.showToastMsg('Lỗi tạo âm thanh.', 'error');
        } finally {
            setScriptAudioProgress(prev => { const n = { ...prev }; delete n[sessionId]; return n; });
        }
    };

    // Tạo audio hàng loạt cho các script được chọn
    const handleBulkGenerateAudio = async () => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        for (const id of ids) {
            const script = p.sessions.find((s: any) => s.id === id);
            if (script) await handleGenerateScriptAudio(script);
        }
        setSelectedIds(new Set());
    };

    // Xóa nhiều kịch bản cùng lúc
    const handleBulkDelete = () => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        setDeleteConfirm({ ids, count: ids.length });
    };

    const handleGenerateAllAudio = async () => {
        setSaving(true);
        try {
            // Tự động lưu và đồng bộ kịch bản nháp từ textarea trước
            if (editingRawText.trim().length > 0) {
                await handleSaveScript(false);
            }

            // Tải lại danh sách tin nhắn mới nhất để đồng bộ các ID
            const resFetch = await getChatMessagesAction(selectedScript.id);
            let currentEditingMessages = editingMessages;
            if (resFetch.success && resFetch.data) {
                const mapped = resFetch.data.map((m: any) => ({
                    id: m.id,
                    role: m.role.toLowerCase() === 'user' ? 'user' : 'ai',
                    text: m.content,
                    audioUrl: m.audioUrl,
                    emotion: m.emotion || 'calm'
                }));
                setEditingMessages(mapped);
                currentEditingMessages = mapped;
            }

            let successCount = 0;
            let skipCount = 0;
            for (let i = 0; i < currentEditingMessages.length; i++) {
                const msg = currentEditingMessages[i];
                if (!msg.audioUrl && msg.text.trim().length > 0) {
                    p.showToastMsg(`Đang tạo audio cho thoại ${i + 1}/${currentEditingMessages.length}...`, 'loading');
                    const targetRole = msg.role === 'ai' ? 'ai' : 'user';
                    const targetVoice = targetRole === 'ai' ? (editingLaoVoice || p.laoVoice || 'Algieba') : (editingUserVoice || p.userVoice || 'Aoede');
                    const targetStyle = targetRole === 'ai' ? (editingLaoVoiceStyle || p.laoVoiceStyle || '') : (editingUserVoiceStyle || p.userVoiceStyle || '');
                    const success = await p.generateVoice(msg.id, msg.text, targetRole, selectedScript.id, false, null, null, false, targetVoice, targetStyle);
                    if (success) {
                        successCount++;
                    } else {
                        p.showToastMsg(`Lỗi tạo audio thoại số ${i + 1}. Đã dừng tiến trình.`, 'error');
                        break;
                    }
                } else {
                    skipCount++;
                }
            }
            if (successCount > 0) {
                p.showToastMsg(`Làm mới dữ liệu âm thanh...`, 'loading');
                const res = await getChatMessagesAction(selectedScript.id);
                if (res.success && res.data) {
                    const mapped = res.data.map((m: any) => ({
                        id: m.id,
                        role: m.role.toLowerCase() === 'user' ? 'user' : 'ai',
                        text: m.content,
                        audioUrl: m.audioUrl,
                        emotion: m.emotion || 'calm'
                    }));
                    setEditingMessages(mapped);
                }
                p.showToastMsg(`Hoàn tất tạo ${successCount} audio!`, 'success');
            } else if (skipCount === currentEditingMessages.length) {
                p.showToastMsg('Tất cả thoại đều đã có audio!', 'info');
            }
        } catch (err) {
            p.showToastMsg('Lỗi tạo âm thanh hàng loạt.', 'error');
        } finally {
            setSaving(false);
        }
    };

    // Play all messages sequentially in the script
    const handlePlayPlaylist = async (script: any) => {
        if (playingScriptId === script.id && isPlaying) {
            pausePlaylist();
            return;
        }

        if (playingScriptId === script.id) {
            resumePlaylist();
            return;
        }

        stopPlaylist();
        setPlayingScriptId(script.id);
        
        // Fetch messages for the playlist
        try {
            const res = await getChatMessagesAction(script.id);
            if (res.success && res.data) {
                const msgs = res.data.filter((m: any) => m.audioUrl);
                
                if (msgs.length === 0) {
                    p.showToastMsg('Kịch bản chưa có âm thanh để phát. Hãy vào Sửa kịch bản để tạo!', 'error');
                    setPlayingScriptId(null);
                    return;
                }

                if (msgs.length < res.data.length) {
                    p.showToastMsg(`Cảnh báo: Có ${res.data.length - msgs.length} câu thoại thiếu âm thanh đang bị bỏ qua.`, 'info');
                }

                setPlaylist(msgs);
                setCurrentPlayIndex(0);
                
                // Calculate actual durations using HTMLAudioElement
                const dList = await Promise.all(msgs.map((m: any) => new Promise<number>((resolve) => {
                    if (!m.audioUrl) return resolve(4.0);
                    const tempAudio = new Audio();
                    tempAudio.src = m.audioUrl;
                    tempAudio.onloadedmetadata = () => {
                        resolve(tempAudio.duration && !isNaN(tempAudio.duration) ? tempAudio.duration : 4.0);
                    };
                    tempAudio.onerror = () => resolve(4.0);
                    setTimeout(() => resolve(4.0), 1200);
                })));

                setDurations(dList);
                setTotalDuration(dList.reduce((a: number, b: number) => a + b, 0));
                setCurrentElapsedTime(0);

                playTrack(msgs, 0, dList);
            } else {
                p.showToastMsg('Lỗi tải tệp phát: ' + (res.error || ''), 'error');
                setPlayingScriptId(null);
            }
        } catch (err) {
            p.showToastMsg('Lỗi tải tệp phát.', 'error');
            setPlayingScriptId(null);
        }
    };

    const playTrack = (tracks: any[], index: number, dList: number[]) => {
        if (!audioRef.current || index >= tracks.length) {
            stopPlaylist();
            return;
        }

        setCurrentPlayIndex(index);
        setIsPlaying(true);
        audioRef.current.src = tracks[index].audioUrl;

        audioRef.current.onloadedmetadata = () => {
            if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
                dList[index] = audioRef.current.duration;
                setDurations([...dList]);
                setTotalDuration(dList.reduce((a: number, b: number) => a + b, 0));
            }
        };

        audioRef.current.play().catch(() => {
            // Auto skip if audio error
            playTrack(tracks, index + 1, dList);
        });

        audioRef.current.onended = () => {
            playTrack(tracks, index + 1, dList);
        };

        // Track progress slider
        if (playIntervalRef.current) clearInterval(playIntervalRef.current);
        playIntervalRef.current = setInterval(() => {
            if (!audioRef.current) return;
            const previousElapsed = dList.slice(0, index).reduce((a: number, b: number) => a + b, 0);
            setCurrentElapsedTime(previousElapsed + audioRef.current.currentTime);
        }, 100);
    };

    const pausePlaylist = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            if (playIntervalRef.current) clearInterval(playIntervalRef.current);
        }
    };

    const resumePlaylist = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(() => {});
            setIsPlaying(true);
            
            // Resume progress slider interval
            if (playIntervalRef.current) clearInterval(playIntervalRef.current);
            playIntervalRef.current = setInterval(() => {
                if (!audioRef.current) return;
                const previousElapsed = durations.slice(0, currentPlayIndex).reduce((a: number, b: number) => a + b, 0);
                setCurrentElapsedTime(previousElapsed + audioRef.current.currentTime);
            }, 100);
        }
    };

    const stopPlaylist = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        setIsPlaying(false);
        setPlayingScriptId(null);
        setPlaylist([]);
        setCurrentPlayIndex(0);
        setCurrentElapsedTime(0);
        if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };

    // Seek/Tua nhanh progress slider handler
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const targetTime = parseFloat(e.target.value);
        setCurrentElapsedTime(targetTime);

        // Find which track index this targetTime belongs to
        let sum = 0;
        let targetIndex = 0;
        for (let i = 0; i < durations.length; i++) {
            if (sum + durations[i] >= targetTime) {
                targetIndex = i;
                break;
            }
            sum += durations[i];
            targetIndex = i;
        }

        const offset = targetTime - sum;
        
        if (playingScriptId && playlist.length > 0) {
            setCurrentPlayIndex(targetIndex);
            if (audioRef.current) {
                audioRef.current.src = playlist[targetIndex].audioUrl;
                audioRef.current.currentTime = offset;
                if (isPlaying) {
                    audioRef.current.play().catch(() => {});
                }
            }
        }
    };

    // Switch/Regenerate Audio for a specific line
    const handleRegenerateAudioLine = async (msgIndex: number) => {
        const msg = editingMessages[msgIndex];
        setSaving(true);
        try {
            const targetRole = msg.role === 'ai' ? 'ai' : 'user';
            const targetVoice = targetRole === 'ai' ? (editingLaoVoice || p.laoVoice || 'Algieba') : (editingUserVoice || p.userVoice || 'Aoede');
            const targetStyle = targetRole === 'ai' ? (editingLaoVoiceStyle || p.laoVoiceStyle || '') : (editingUserVoiceStyle || p.userVoiceStyle || '');
            const success = await p.generateVoice(msg.id, msg.text, targetRole, selectedScript.id, true, null, null, false, targetVoice, targetStyle);
            if (success) {
                // Fetch fresh messages
                const res = await getChatMessagesAction(selectedScript.id);
                if (res.success && res.data) {
                    const mapped = res.data.map((m: any) => ({
                        id: m.id,
                        role: m.role === 'ASSISTANT' ? 'ai' : (m.role === 'OUTRO' ? 'outro' : 'user'),
                        text: m.content,
                        audioUrl: m.audioUrl,
                        emotion: m.emotion || 'calm'
                    }));
                    setEditingMessages(mapped);
                    p.showToastMsg('Đã tạo lại Audio thành công!', 'success');
                } else {
                    p.showToastMsg('Lỗi tải lại kịch bản.', 'error');
                }
            } else {
                p.showToastMsg('Không thể tạo âm thanh.', 'error');
            }
        } catch (err) {
            p.showToastMsg('Lỗi tạo âm thanh.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveGeneratedAIScript = async (overrides?: { scriptText?: string; laoName?: string; userName?: string }) => {
        if (p.onSaveGeneratedScript) {
            await p.onSaveGeneratedScript(overrides);
            setShowCreator(false);
        }
    };

    if (!p.show) return null;

    return (
        <div className="fixed inset-0 z-[140] bg-slate-950 flex flex-col w-full h-full min-h-screen overflow-hidden animate-in fade-in duration-300">
            {/* Header Trang Quản Lý Kịch Bản (Fullscreen Page) */}
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-slate-900/90 backdrop-blur-md shrink-0 shadow-lg z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                        <Sparkles size={22} />
                    </div>
                    <div>
                        <h1 className="font-black text-slate-100 tracking-wide text-base sm:text-lg">Quản Lý Kịch Bản Đạo Diễn</h1>
                        <p className="text-xs text-slate-400">Trang quản lý danh sách kịch bản AI & Thủ công, biên tập thoại và xuất video</p>
                    </div>
                </div>
                <button 
                    onClick={p.onClose} 
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                    title="Quay lại Thiền đường"
                >
                    <ChevronLeft size={16} /> Quay lại Thiền đường
                </button>
            </div>

            {/* Main Body Page - Danh Sách Kịch Bản */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col max-w-7xl w-full mx-auto">
                {/* VIEW 1: Scripts List - Được bao bọc trong Card Container cao cấp */}
                <div className="bg-slate-900/80 border border-indigo-500/20 rounded-3xl p-5 md:p-8 shadow-2xl backdrop-blur-xl flex-1 flex flex-col gap-5 min-h-[550px] justify-between">
                    <div className="flex-1 flex flex-col gap-5">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Danh sách kịch bản ({scripts.length})</span>
                                    {selectedIds.size > 0 && (
                                        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                                            Đã chọn {selectedIds.size}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2 items-center flex-wrap">
                                    {/* Bulk action buttons */}
                                    {selectedIds.size > 0 && (
                                        <>
                                            <button
                                                onClick={handleBulkGenerateAudio}
                                                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg"
                                            >
                                                <Mic size={13} /> Tạo Audio ({selectedIds.size})
                                            </button>
                                            <button
                                                onClick={handleBulkDelete}
                                                className="bg-rose-900/30 hover:bg-rose-800/50 text-rose-400 border border-rose-500/30 font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                                            >
                                                <Trash2 size={13} /> Xóa ({selectedIds.size})
                                            </button>
                                            <button
                                                onClick={() => setSelectedIds(new Set())}
                                                className="text-slate-400 hover:text-white text-xs px-3 py-2 rounded-xl transition-colors"
                                            >
                                                Bỏ chọn
                                            </button>
                                        </>
                                    )}
                                    <button onClick={handleCreateAIScript} disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg border border-indigo-500/50 hover:scale-105 disabled:opacity-50 cursor-pointer">
                                        <Plus size={14} /> Tạo kịch bản
                                    </button>
                                </div>
                            </div>

                            {/* BỘ LỌC VÀ TÌM KIẾM */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:items-center bg-slate-900/50 p-3 rounded-2xl border border-white/5">
                                <div className="flex gap-4 items-center text-sm shrink-0">
                                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
                                        <input type="radio" checked={filterType === 'all'} onChange={() => setFilterType('all')} className="accent-indigo-500" /> Tất cả
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
                                        <input type="radio" checked={filterType === 'ai'} onChange={() => setFilterType('ai')} className="accent-indigo-500" /> Kịch bản AI
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
                                        <input type="radio" checked={filterType === 'manual'} onChange={() => setFilterType('manual')} className="accent-indigo-500" /> Thủ công
                                    </label>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Tìm theo tiêu đề..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                                />
                            </div>

                            {scripts.length > 0 && (
                                <div className="flex items-center gap-3 px-4 py-1.5 select-none animate-in fade-in duration-200">
                                    <input
                                        type="checkbox"
                                        checked={scripts.length > 0 && selectedIds.size === scripts.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedIds(new Set(scripts.map(s => s.id)));
                                            } else {
                                                setSelectedIds(new Set());
                                            }
                                        }}
                                        className="w-4 h-4 accent-indigo-500 cursor-pointer shrink-0"
                                        id="selectAllScriptsCheckbox"
                                    />
                                    <label
                                        htmlFor="selectAllScriptsCheckbox"
                                        className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
                                    >
                                        Chọn tất cả ({scripts.length})
                                    </label>
                                </div>
                            )}

                            {scripts.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 border border-dashed border-white/5 rounded-2xl">
                                    <Music size={32} className="mb-2 text-slate-600" />
                                    <p className="text-sm">Chưa có kịch bản AI nào được tạo.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {paginatedScripts.map(script => {
                                        const isCurrentPlaying = playingScriptId === script.id;
                                        return (
                                            <div key={script.id} className={`bg-slate-950/50 border p-4 rounded-2xl flex flex-col gap-3 hover:border-slate-700 transition-colors ${selectedIds.has(script.id) ? 'border-indigo-500/40 bg-indigo-950/20' : 'border-white/5'}`}>
                                                {/* Inline audio progress bar */}
                                                {scriptAudioProgress[script.id] && (
                                                    <div className="w-full flex flex-col gap-1">
                                                        <div className="flex justify-between text-[10px] text-slate-400">
                                                            <span className="flex items-center gap-1"><Loader2 size={10} className="animate-spin text-emerald-400" /> Đang tạo audio thoại {scriptAudioProgress[script.id].current}/{scriptAudioProgress[script.id].total}...</span>
                                                            <span className="font-bold text-emerald-400">{scriptAudioProgress[script.id].percent}%</span>
                                                        </div>
                                                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300" style={{ width: `${scriptAudioProgress[script.id].percent}%` }} />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    {/* Checkbox */}
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(script.id)}
                                                        onChange={(e) => {
                                                            setSelectedIds(prev => {
                                                                const n = new Set(prev);
                                                                if (e.target.checked) n.add(script.id); else n.delete(script.id);
                                                                return n;
                                                            });
                                                        }}
                                                        className="w-4 h-4 accent-indigo-500 cursor-pointer shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                    <span className="font-bold text-sm text-slate-200 block truncate">{script.title}</span>
                                                    <span className="text-[10px] text-slate-500 block mt-0.5">
                                                        Cập nhật: {(() => {
                                                            const d = script.updatedAt ? new Date(script.updatedAt) : new Date();
                                                            return isNaN(d.getTime()) ? new Date().toLocaleString('vi-VN') : d.toLocaleString('vi-VN');
                                                        })()}
                                                    </span>
                                                    </div>
                                                </div>

                                                {/* Unified Audio Player */}
                                                {isCurrentPlaying && (
                                                    <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-white/5 w-full md:w-auto">
                                                        <button onClick={pausePlaylist} className="text-indigo-400 hover:text-indigo-300">
                                                            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                                        </button>
                                                        <input 
                                                            type="range" min="0" max={totalDuration} 
                                                            value={currentElapsedTime} onChange={handleSeek}
                                                            className="w-32 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                        />
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            {Math.floor(currentElapsedTime)}s / {Math.floor(totalDuration)}s
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Controls */}
                                                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end flex-wrap">
                                                    {(() => {
                                                        const totalDialogMessages = script.messages ? script.messages.filter((m: any) => m.role !== 'system').length : 0;
                                                        const hasAudioCount = script.messages ? script.messages.filter((m: any) => m.audioUrl && m.role !== 'system').length : 0;
                                                        const missingAudioCount = totalDialogMessages - hasAudioCount;
                                                        
                                                        const handleGenerate = () => {
                                                            handleGenerateScriptAudio(script);
                                                        };

                                                        return (
                                                            <>
                                                                {hasAudioCount > 0 ? (
                                                                    <>
                                                                        {!isCurrentPlaying ? (
                                                                            <button onClick={() => handlePlayPlaylist(script)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                                                                                <Play size={12} /> Nghe thử
                                                                            </button>
                                                                        ) : (
                                                                            <button onClick={stopPlaylist} className="bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                                                                Dừng
                                                                            </button>
                                                                        )}
                                                                        <button 
                                                                            onClick={() => handleGenerateScriptAudio(script, true)} 
                                                                            className="bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                                                            title="Tạo lại toàn bộ âm thanh cho kịch bản này"
                                                                        >
                                                                            <RefreshCw size={12} /> Tạo lại audio
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button onClick={handleGenerate} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors animate-pulse">
                                                                        <Mic size={12} /> Tạo MP3
                                                                    </button>
                                                                )}

                                                                {missingAudioCount > 0 && hasAudioCount > 0 && (
                                                                    <button onClick={handleGenerate} className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/40 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                                                                        <Mic size={12} /> Tạo tiếp ({missingAudioCount})
                                                                    </button>
                                                                )}
                                                            </>
                                                        );
                                                    })()}

                                                    <button 
                                                        onClick={() => handleStartEdit(script)} 
                                                        title="Sửa kịch bản"
                                                        className="bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                                    >
                                                        <Pencil size={12} /> Sửa
                                                    </button>

                                                    <button 
                                                        onClick={async () => {
                                                            // Tải tin nhắn của phiên này để tránh race condition
                                                            let msgs = script.messages;
                                                            const s = p.sessions.find(x => x.id === script.id);
                                                            if (s && !s.messagesLoaded) {
                                                                const res = await getChatMessagesAction(script.id);
                                                                if (res.success && res.data) {
                                                                    const mapped = res.data.map((m: any) => ({
                                                                        id: m.id || m.msgId || Date.now(),
                                                                        role: m.role === 'ASSISTANT' ? 'ai' : 'user',
                                                                        text: m.content,
                                                                        timestamp: m.createdAt ? new Date(m.createdAt) : new Date(),
                                                                        audioUrl: m.audioUrl || null
                                                                    }));
                                                                    msgs = mapped;
                                                                    p.setSessions((prev: any[]) => prev.map((x: any) => x.id === script.id ? { ...x, messages: mapped, messagesLoaded: true } : x));
                                                                }
                                                            } else if (s) {
                                                                msgs = s.messages;
                                                            }

                                                            if (!msgs || msgs.length === 0) {
                                                                if (p.showToastMsg) p.showToastMsg('Kịch bản này chưa có nội dung hội thoại.', 'error');
                                                                return;
                                                            }
                                                            const hasAudio = msgs.some((m: any) => m.audioUrl);
                                                            if (!hasAudio) {
                                                                if (p.showToastMsg) p.showToastMsg('Kịch bản chưa có âm thanh để tạo video. Vui lòng bấm "Tạo MP3" trước!', 'error');
                                                                return;
                                                            }

                                                            p.setCurrentSessionId(script.id);
                                                            // Dùng childmodal routing: KHÔNG đóng AiDirectorManagerModal
                                                                if (typeof window !== 'undefined') {
                                                                    const url = new URL(window.location.href);
                                                                    url.searchParams.set('childmodal', 'create-video');
                                                                    url.searchParams.set('scriptid', script.id);
                                                                    window.history.pushState(null, '', url.toString());
                                                                }
                                                            if (p.setVideoExportSource) p.setVideoExportSource('ai_director_childmodal');
                                                            if (p.setShowVideoExportModal) p.setShowVideoExportModal(true);
                                                        }}
                                                        title="Tạo video"
                                                        className="bg-orange-600/20 border border-orange-500/30 hover:bg-orange-600/40 text-orange-400 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                                    >
                                                        <Film size={12} /> Tạo video
                                                    </button>

                                                    <button 
                                                        onClick={() => handleDeleteScript(script.id)} 
                                                        title="Xóa kịch bản"
                                                        className="bg-slate-800 hover:bg-rose-900/40 text-rose-500 hover:text-rose-400 p-2 rounded-lg text-xs font-bold flex items-center justify-center transition-colors border border-transparent hover:border-rose-500/20"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        );
                                                    })}
                                                </div>
                            )}

                            {/* Phân trang */}
                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5 shrink-0">
                                {/* Combobox số dòng */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Hiển thị</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                        className="text-xs bg-slate-800 border border-white/10 text-slate-300 rounded-lg px-2 py-1.5 cursor-pointer hover:border-indigo-500/50 focus:outline-none focus:border-indigo-500 transition-colors"
                                    >
                                        {[5, 10, 50, 100].map(n => (
                                            <option key={n} value={n}>{n} dòng</option>
                                        ))}
                                    </select>
                                    <span className="text-xs text-slate-500">/ {scripts.length} kịch bản</span>
                                </div>
                                {/* Nút prev/next */}
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={activePage === 1}
                                            onClick={() => setCurrentPage(activePage - 1)}
                                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center border border-white/5 cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <span className="text-xs text-slate-400 font-medium px-4 select-none">
                                            Trang <span className="text-indigo-400 font-black">{activePage}</span> / {totalPages}
                                        </span>
                                        <button
                                            disabled={activePage === totalPages}
                                            onClick={() => setCurrentPage(activePage + 1)}
                                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center border border-white/5 cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                </div>
            </div>

            {/* MODAL BIÊN TẬP KỊCH BẢN (CHỈ MỞ POPUP KHI CHỈNH SỬA) */}
            {view === 'edit' && (() => {
                const isAiScript = selectedScript?.title ? !selectedScript.title.toLowerCase().includes('[thủ công]') : false;
                const scriptTitle = selectedScript?.title || 'Kịch bản mới';
                return (
                    <div className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm flex justify-center items-center p-3 md:p-6 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[90vh] animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                            {/* Header Modal Biên Tập */}
                            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-slate-950 shrink-0">
                                <div className="flex items-center gap-3">
                                    <button onClick={handleBackToList} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/5 cursor-pointer">
                                        <ChevronLeft size={16} /> Quay lại danh sách
                                    </button>
                                    <span className="text-xs sm:text-sm font-bold text-indigo-400 uppercase tracking-widest truncate max-w-md">
                                        Biên tập kịch bản {isAiScript ? 'AI' : 'Thủ công'}: {scriptTitle}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={handleGenerateAllAudio} disabled={saving || downloadingAudio} className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 font-bold py-1.5 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-amber-500/20 disabled:opacity-50 cursor-pointer">
                                        <Music size={14} /> Tạo tất cả Audio
                                    </button>
                                    <button onClick={handleBackToList} className="text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-slate-800 cursor-pointer" title="Đóng modal biên tập">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Body Content Modal Biên Tập - Thiết kế cột thao tác nổi dọc bên phải (Floating Toolbar) */}
                            <div className="flex-1 flex overflow-hidden relative">
                                {/* Cột Trái: Toàn bộ nội dung form cuộn trang (thêm pr-16 để không bị nút đè) */}
                                <div className="flex-1 overflow-y-auto p-5 md:p-6 pr-16 flex flex-col gap-4 scrollbar-thin">

                                {/* Tiêu đề & Ngày đăng Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-400">Tiêu đề kịch bản:</label>
                                        <input 
                                            type="text"
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            placeholder="Nhập tiêu đề kịch bản..."
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-400">Ngày đăng:</label>
                                        <input
                                            type="text"
                                            value={editingDate ? new Date(editingDate).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                            readOnly
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none cursor-default"
                                        />
                                    </div>
                                </div>

                                {/* XƯNG HÔ - luôn hiển thị */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                                    {/* Cài đặt Lão */}
                                    <div className="flex flex-col gap-2 p-3 bg-orange-950/10 border border-orange-500/20 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1.5">👳 Nhân vật Minh Sư (Lão):</span>
                                            {p.allCharacters && (
                                                <select 
                                                    className="hidden"
                                                    onChange={e => {
                                                        const c = p.allCharacters?.find(x => x.id === e.target.value);
                                                        if (c) {
                                                            p.setCustomLaoName?.(c.name);
                                                            p.setLaoSelfCall?.("Ta");
                                                            p.setLaoCallUser?.("Con");
                                                            if (c.gender === 'Nữ') setEditingLaoVoice('Aoede');
                                                            else setEditingLaoVoice('Algieba');
                                                        }
                                                    }}
                                                >
                                                    <option value="">-- Chọn từ Kho --</option>
                                                    {p.allCharacters.filter(x => x.role === 'lao').map(x => <option key={x.id} value={x.id}>{x.name} {x.age ? `(${x.age}t)` : ''}</option>)}
                                                </select>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-[1.5] flex flex-col gap-1">
                                                <span className="text-[9px] text-slate-500">Tên hiển thị:</span>
                                                <input type="text" value={localLaoName} onChange={e=>setLocalLaoName(e.target.value)} onBlur={()=>p.setCustomLaoName?.(localLaoName)} placeholder="Tên (VD: Lão, Sư Phụ...)" className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 outline-none"/>
                                            </div>
                                            <div className="flex-[1] flex flex-col gap-1">
                                                <span className="text-[9px] text-slate-500">Tự xưng là:</span>
                                                <input type="text" value={localLaoSelf} onChange={e=>setLocalLaoSelf(e.target.value)} onBlur={()=>p.setLaoSelfCall?.(localLaoSelf)} placeholder="Tự xưng (Lão, Ta...)" className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 outline-none"/>
                                            </div>
                                            <div className="flex-[1] flex flex-col gap-1">
                                                <span className="text-[9px] text-slate-500">Gọi đối phương:</span>
                                                <input type="text" value={localLaoCallU} onChange={e=>setLocalLaoCallU(e.target.value)} onBlur={()=>p.setLaoCallUser?.(localLaoCallU)} placeholder="Gọi kia (Con, Ngươi...)" className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 outline-none"/>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cài đặt Con */}
                                    <div className="flex flex-col gap-2 p-3 bg-indigo-950/10 border border-indigo-500/20 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5">🙏 Nhân vật Hỏi đạo (Bạn):</span>
                                            {p.allCharacters && (
                                                <select 
                                                    className="hidden"
                                                    onChange={e => {
                                                        const c = p.allCharacters?.find(x => x.id === e.target.value);
                                                        if (c) {
                                                            p.setCustomUserName?.(c.name);
                                                            p.setUserSelfCall?.("Con");
                                                            p.setUserCallLao?.("Lão");
                                                            if (c.gender === 'Nữ') setEditingUserVoice('Kore');
                                                            else setEditingUserVoice('Puck');
                                                        }
                                                    }}
                                                >
                                                    <option value="">-- Chọn từ Kho --</option>
                                                    {p.allCharacters.filter(x => x.role === 'user' || !x.role).map(x => <option key={x.id} value={x.id}>{x.name} {x.age ? `(${x.age}t)` : ''}</option>)}
                                                </select>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-[1.5] flex flex-col gap-1">
                                                <span className="text-[9px] text-slate-500">Tên hiển thị:</span>
                                                <input type="text" value={localUserName} onChange={e=>setLocalUserName(e.target.value)} onBlur={()=>p.setCustomUserName?.(localUserName)} placeholder="Tên (VD: Con, Anh Hào...)" className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"/>
                                            </div>
                                            <div className="flex-[1] flex flex-col gap-1">
                                                <span className="text-[9px] text-slate-500">Tự xưng là:</span>
                                                <input type="text" value={localUserSelf} onChange={e=>setLocalUserSelf(e.target.value)} onBlur={()=>p.setUserSelfCall?.(localUserSelf)} placeholder="Tự xưng (Con, Anh...)" className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"/>
                                            </div>
                                            <div className="flex-[1] flex flex-col gap-1">
                                                <span className="text-[9px] text-slate-500">Gọi đối phương:</span>
                                                <input type="text" value={localUserCallL} onChange={e=>setLocalUserCallL(e.target.value)} onBlur={()=>p.setUserCallLao?.(localUserCallL)} placeholder="Gọi kia (Lão, Em Đu...)" className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Nút Cấu hình Giọng đọc */}
                                <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-white/5">
                                    <button 
                                        onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 transition-colors"
                                    >
                                        <Volume2 size={14} /> 
                                        {showVoiceSettings ? "Ẩn Cấu hình Giọng đọc" : "Hiện Cấu hình Giọng đọc cho Kịch bản này"}
                                    </button>
                                    <span className="text-[10px] text-slate-500 hidden sm:inline">Giọng đọc riêng sẽ được áp dụng khi tạo âm thanh cho kịch bản này.</span>
                                </div>

                                {/* Panel Cấu hình Giọng đọc */}
                                {showVoiceSettings && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-white/5 animate-in slide-in-from-top-2 duration-200">
                                        {/* Giọng Lão */}
                                        <div className="flex flex-col gap-2 p-3 bg-orange-950/20 border border-orange-500/20 rounded-xl">
                                            <span className="text-xs font-bold text-orange-400">🎙️ Giọng đọc của Lão:</span>
                                            <select value={editingLaoVoice} onChange={e=>setEditingLaoVoice(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white outline-none">
                                               <optgroup label="🎙️ Giọng Nam">{VOICES_MALE.map(v=><option key={v} value={v}>{v}</option>)}</optgroup>
                                               <optgroup label="🎙️ Giọng Nữ">{VOICES_FEMALE.map(v=><option key={v} value={v}>{v}</option>)}</optgroup>
                                            </select>
                                            <textarea key={`lao-style-${selectedScript?.id}`} value={editingLaoVoiceStyle} onChange={e=>setEditingLaoVoiceStyle(e.target.value)} placeholder="Phong cách (VD: Giọng ấm áp...)" className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white outline-none h-12 resize-none" />
                                        </div>
 
                                        {/* Giọng Con */}
                                        <div className="flex flex-col gap-2 p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl">
                                            <span className="text-xs font-bold text-indigo-400">🎙️ Giọng đọc của Con:</span>
                                            <select value={editingUserVoice} onChange={e=>setEditingUserVoice(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white outline-none">
                                               <optgroup label="🎙️ Giọng Nữ">{VOICES_FEMALE.map(v=><option key={v} value={v}>{v}</option>)}</optgroup>
                                               <optgroup label="🎙️ Giọng Nam">{VOICES_MALE.map(v=><option key={v} value={v}>{v}</option>)}</optgroup>
                                            </select>
                                            <textarea key={`user-style-${selectedScript?.id}`} value={editingUserVoiceStyle} onChange={e=>setEditingUserVoiceStyle(e.target.value)} placeholder="Phong cách giọng..." className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white outline-none h-12 resize-none" />
                                        </div>
                                    </div>
                                )}
 
                                {/* AI SPECIFIC CONTROLS (Thu gọn mặc định để nhường toàn bộ không gian cho danh sách câu thoại) */}
                                {isAiScript && (
                                    <div className="flex flex-col gap-3 bg-slate-950/60 p-3 rounded-2xl border border-indigo-500/20">
                                        <div className="flex justify-between items-center">
                                            <button 
                                                type="button"
                                                onClick={() => setShowAiParams(!showAiParams)}
                                                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                            >
                                                <Sparkles size={14} /> 
                                                {showAiParams ? "Ẩn Thông số Đạo diễn AI" : "Hiện Thông số Đạo diễn AI & Tạo lại bằng AI"}
                                            </button>
                                            <span className="text-[10px] text-slate-500 hidden sm:inline">Mở nếu cần tự động tạo lại nội dung bằng AI</span>
                                        </div>
 
                                        {showAiParams && (
                                            <div className="flex flex-col gap-4 pt-3 border-t border-white/5 animate-in slide-in-from-top-2 duration-200">
                                                <div className="flex flex-col gap-1.5">
                                                   <label className="text-xs font-bold text-slate-400">Ngôn ngữ kịch bản:</label>
                                                   <select value={editingLanguage} onChange={e => setEditingLanguage(e.target.value)} disabled={isRegenerating} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500">
                                                      <option value="vi">Tiếng Việt</option>
                                                      <option value="en">Tiếng Anh (English)</option>
                                                   </select>
                                                </div>
 
                                                <div className="flex flex-col gap-1.5">
                                                   <label className="text-xs font-bold text-slate-400">Chủ đề vướng mắc / Nỗi khổ của {p.customUserName || 'Con'}:</label>
                                                   <textarea key={`topic-${selectedScript?.id}`} value={editingTopic} onChange={(e: any) => setEditingTopic(e.target.value)} placeholder="Ví dụ: Con đang gặp áp lực nợ nần, mất phương hướng, thất tình..." disabled={isRegenerating} className="w-full h-20 bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none resize-none font-mono"/>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                   <div className="flex flex-col gap-1.5">
                                                      <label className="text-xs font-bold text-slate-400">Độ dài kịch bản:</label>
                                                      <select value={editingLength} onChange={e => setEditingLength(e.target.value)} disabled={isRegenerating} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500">
                                                         <option value="Khoảng 4-6 câu">Khoảng 4-6 câu (Chớp nhoáng)</option>
                                                         <option value="Khoảng 6-10 câu">Khoảng 6-10 câu (Vừa phải)</option>
                                                         <option value="Khoảng 10-15 câu">Khoảng 10-15 câu (Phân tích sâu)</option>
                                                         <option value="Khoảng 15-21 câu">Khoảng 15-21 câu (Khai ngộ toàn diện)</option>
                                                      </select>
                                                   </div>
                                                   <div className="flex flex-col gap-1.5">
                                                      <label className="text-xs font-bold text-slate-400">Phong cách của Lão:</label>
                                                      <select value={editingLaoStyle} onChange={e => setEditingLaoStyle(e.target.value)} disabled={isRegenerating} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500">
                                                         <option value="Sắc bén, đốn giáo, thẳng thắn đánh thức mộng ảo">Sắc bén, đốn giáo</option>
                                                         <option value="Từ bi, ôn hòa, dắt dụ từng bước">Từ bi, ôn hòa</option>
                                                         <option value="Hài hước, châm biếm thâm thúy cõi trần">Hài hước, châm biếm thâm thúy</option>
                                                      </select>
                                                   </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-2 bg-slate-900/40 p-3 rounded-xl border border-white/5">
                                                     <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300 hover:text-white transition-colors select-none">
                                                         <input 
                                                             type="checkbox" 
                                                             checked={editingIncludePoem} 
                                                             onChange={e => setEditingIncludePoem(e.target.checked)} 
                                                             className="w-4 h-4 accent-indigo-500 rounded cursor-pointer" 
                                                         />
                                                         <span>📜 Tích hợp kệ Sư Cha Tam Vô</span>
                                                     </label>

                                                     <button 
                                                         onClick={handleRegenerateAIScript} 
                                                         disabled={isRegenerating || !editingTopic.trim()} 
                                                         className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                                                     >
                                                         {isRegenerating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                                                         {isRegenerating ? 'Đang viết kịch bản...' : 'Tạo lại bằng AI'}
                                                     </button>
                                                 </div>

                                                <div className="flex flex-col gap-1.5">
                                                   <label className="text-xs font-bold text-slate-400">Hành trình biến đổi cảm xúc của Con:</label>
                                                   <select value={editingUserEmotionArc} onChange={e => setEditingUserEmotionArc(e.target.value)} disabled={isRegenerating} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500">
                                                      <option value="Từ đau khổ/bế tắc chuyển dần sang an lạc/bừng sáng">Đau khổ, bế tắc ➡️ An lạc, bừng sáng</option>
                                                      <option value="Từ tức giận/đổ lỗi chuyển sang tự nhìn nhận lại chính mình">Tức giận, đổ lỗi ➡️ Tự phản tỉnh</option>
                                                      <option value="Từ kiêu ngạo/ngộ nhận chuyển sang khiêm nhường/thấy rõ mộng">Kiêu ngạo, ngộ nhận ➡️ Khiêm nhường, tỉnh mộng</option>
                                                      <option value="Chỉ thuần túy thắc mắc, tò mò đạo lý và được giải đáp thỏa đáng">Thuần túy thắc mắc ➡️ Thỏa mãn trí tuệ</option>
                                                   </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* KHU VỰC BIÊN TẬP CÂU THOẠI (RỘNG RÃI & RÕ RÀNG) */}
                                <div className="flex-1 flex flex-col gap-4 min-h-[360px] pb-4">
                                    <div className="bg-slate-900/40 p-4 rounded-2xl border border-indigo-500/20 flex-1 flex flex-col">
                                        <p className="text-xs text-indigo-300 mb-2 font-bold flex items-center gap-1.5">
                                            <Info size={14} /> 
                                            Chỉnh sửa nội dung Kịch bản:
                                        </p>
                                        
                                        {/* Nút chèn vai & cảm xúc nhanh */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 mt-1 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="text-[11px] text-slate-400 font-bold select-none">Chèn nhanh:</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleInsertRole(p.customLaoName || 'Lão', 'calm')} 
                                                    className="text-[10px] font-bold text-orange-300 hover:text-white bg-orange-950/30 border border-orange-500/30 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                                                >
                                                    🎙️ {p.customLaoName || 'Lão'}: [bình thường]
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleInsertRole(p.customLaoName || 'Lão', 'vui')} 
                                                    className="text-[10px] font-bold text-orange-400 hover:text-white bg-orange-950/40 border border-orange-500/40 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                                                >
                                                    😊 {p.customLaoName || 'Lão'}: [vui]
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleInsertRole(p.customLaoName || 'Lão', 'buồn')} 
                                                    className="text-[10px] font-bold text-amber-400 hover:text-white bg-amber-950/40 border border-amber-500/40 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                                                >
                                                    😢 {p.customLaoName || 'Lão'}: [buồn]
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleInsertRole(p.customUserName || 'Con', 'calm')} 
                                                    className="text-[10px] font-bold text-indigo-300 hover:text-white bg-indigo-950/30 border border-indigo-500/30 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                                                >
                                                    🎙️ {p.customUserName || 'Con'}: [bình thường]
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleInsertRole(p.customUserName || 'Con', 'buồn')} 
                                                    className="text-[10px] font-bold text-indigo-400 hover:text-white bg-indigo-950/40 border border-indigo-500/40 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                                                >
                                                    😢 {p.customUserName || 'Con'}: [buồn]
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleInsertRole('Outro', 'calm')} 
                                                    className="text-[10px] font-bold text-purple-400 hover:text-white bg-purple-950/40 border border-purple-500/40 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                                                >
                                                    🎬 Outro: [kết thúc]
                                                </button>
                                            </div>
                                            <span className="text-[10px] text-slate-500 hidden sm:inline">Click chèn nhanh cú pháp thoại kèm cờ cảm xúc.</span>
                                        </div>

                                        {/* Ô NHẬP / DÁN KỊCH BẢN THỦ CÔNG TRỰC TIẾP */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 select-none">
                                                    <Pencil size={14} className="text-indigo-400" />
                                                    Khung Nhập / Dán Kịch Bản Thủ Công (Textarea Đa Dòng):
                                                </label>
                                                <span className="text-[10px] text-slate-400">Gõ dạng Lão: [vui] ... hoặc Con: [buồn] ...</span>
                                            </div>
                                            <textarea
                                                value={editingRawText}
                                                onChange={(e) => setEditingRawText(e.target.value)}
                                                placeholder={`Dán hoặc gõ kịch bản thủ công tại đây...\nVí dụ:\n${p.customLaoName || 'Lão'}: [vui] Nghe ${p.customLaoName || 'Lão'} nói đây, mọi khổ đau đều từ chấp thủ mà ra...\n${p.customUserName || 'Con'}: [buồn] ${p.customUserName || 'Con'} cảm ơn ${p.customLaoName || 'Lão'} đã khai thị...\nOutro: [kết thúc] Sư Cha Tam Vô đã hướng dẫn...`}
                                                className="w-full h-44 bg-slate-950 border border-indigo-500/30 rounded-2xl p-3 text-[11px] sm:text-xs text-white focus:border-indigo-500 outline-none resize-y font-mono leading-relaxed placeholder:text-slate-600 shadow-inner"
                                            />
                                        </div>

                                        {/* GIAO DIỆN CÁC BLOCK THOẠI TRỰC QUAN ĐƯỢC BÓC TÁCH */}
                                        <div className="flex flex-col gap-2.5 mt-4 bg-slate-950/40 p-3 rounded-2xl border border-white/10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 select-none">
                                                    <Layers size={14} className="text-indigo-400" />
                                                    Danh Sách Block Thoại Đã Phân Tách ({editingMessages?.length || 0} câu)
                                                </span>
                                                <span className="text-[10px] text-slate-400">Đồng bộ 2 chiều tự động với Textarea</span>
                                            </div>

                                            <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                                                {editingMessages && editingMessages.map((b: any, idx: number) => {
                                                    const isLao = b.role === 'ai';
                                                    const isOutro = b.role === 'outro';
                                                    const roleName = isLao ? (p.customLaoName || 'Lão') : (isOutro ? 'Outro' : (p.customUserName || 'Con'));
                                                    return (
                                                        <div key={b.id || idx} className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${isLao ? 'bg-orange-950/20 border-orange-500/20' : (isOutro ? 'bg-purple-950/20 border-purple-500/20' : 'bg-indigo-950/20 border-indigo-500/20')}`}>
                                                            <div className="flex items-center justify-between gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isLao ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : (isOutro ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30')}`}>
                                                                        {roleName}
                                                                    </span>
                                                                    {/* Dropdown Trạng thái cảm xúc bóc tách */}
                                                                    <select 
                                                                        value={b.emotion || 'calm'} 
                                                                        onChange={(e) => {
                                                                            const newEmo = e.target.value;
                                                                            setEditingMessages((prev: any[]) => prev.map((msg, i) => i === idx ? { ...msg, emotion: newEmo } : msg));
                                                                        }}
                                                                        className="bg-slate-900 border border-white/10 text-slate-200 text-[11px] font-bold rounded-md px-2 py-1 outline-none cursor-pointer focus:border-indigo-500"
                                                                    >
                                                                        <option value="calm">😐 Bình thường (Calm)</option>
                                                                        <option value="joy">😊 Vui vẻ / Hạnh phúc (Joy)</option>
                                                                        <option value="sad">😢 Buồn / Bế tắc (Sad)</option>
                                                                        <option value="hook">🔥 Mào đầu (Hook/Intro)</option>
                                                                    </select>
                                                                </div>
                                                                {/* Nút Audio cho từng Block */}
                                                                <div className="flex items-center gap-1.5">
                                                                    {b.audioUrl ? (
                                                                        <button 
                                                                            type="button" 
                                                                            onClick={() => {
                                                                                if (b.audioUrl) {
                                                                                    const a = new Audio(b.audioUrl);
                                                                                    a.play().catch(err => console.warn('Lỗi phát audio:', err));
                                                                                }
                                                                            }}
                                                                            className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-1 rounded-md hover:bg-emerald-900/50 flex items-center gap-1 transition-colors cursor-pointer"
                                                                        >
                                                                            <Play size={11} /> Nghe
                                                                        </button>
                                                                    ) : null}
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={() => handleGenerateAudioInEditView(false)}
                                                                        disabled={generatingAudio || saving}
                                                                        className="text-[11px] font-bold text-slate-300 bg-slate-800 border border-white/10 px-2.5 py-1 rounded-md hover:bg-slate-700 disabled:opacity-50 flex items-center gap-1 transition-colors cursor-pointer"
                                                                    >
                                                                        <Mic size={11} /> {b.audioUrl ? 'Tạo lại' : 'Tạo Audio'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {/* Khung sửa câu thoại sạch */}
                                                            <textarea 
                                                                value={b.text}
                                                                onChange={(e) => {
                                                                    const newTxt = e.target.value;
                                                                    setEditingMessages((prev: any[]) => prev.map((msg, i) => i === idx ? { ...msg, text: newTxt } : msg));
                                                                }}
                                                                className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-indigo-500 resize-none h-14 font-sans"
                                                                placeholder="Nội dung câu thoại sạch..."
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                </div> {/* Kết thúc Cột Trái */}

                                {/* Cột Phải: Bảng thao tác dọc nổi (Floating Vertical Toolbar) bay theo scroll */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2.5 bg-slate-900/95 border border-white/10 p-2 rounded-2xl shadow-2xl backdrop-blur-md w-12 items-center justify-center shrink-0">
                                    {/* Progress bar audio nén gọn */}
                                    {audioProgress && (
                                        <div className="text-[9px] font-black text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-1 py-0.5 rounded text-center w-full shrink-0 animate-pulse" title={`Đang tạo audio thoại ${audioProgress.current}/${audioProgress.total}`}>
                                            {audioProgress.percent}%
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {(() => {
                                        const hasAudioCount = editingMessages ? editingMessages.filter((m: any) => m.audioUrl && m.text.trim().length > 0).length : 0;
                                        const totalCount = editingMessages ? editingMessages.filter((m: any) => m.text.trim().length > 0).length : 0;
                                        const missingAudioCount = totalCount - hasAudioCount;

                                        return (
                                            <div className="flex flex-col gap-2.5 items-center w-full">
                                                {/* Nút Lưu kịch bản */}
                                                <button 
                                                    onClick={() => handleSaveScript()} 
                                                    disabled={saving || isRegenerating || generatingAudio} 
                                                    title="Lưu kịch bản"
                                                    className="w-8 h-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center transition-all shadow-md disabled:opacity-40 cursor-pointer shrink-0"
                                                >
                                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                                </button>

                                                {/* Nút Tạo Video */}
                                                <button
                                                    onClick={handleOpenVideoCreator}
                                                    disabled={saving || isRegenerating || generatingAudio || hasAudioCount === 0}
                                                    title={hasAudioCount === 0 ? 'Cần tạo audio trước' : 'Tạo video từ kịch bản này'}
                                                    className="w-8 h-8 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0"
                                                >
                                                    <Video size={14} />
                                                </button>

                                                {/* Nút Audio / Tạo lại / Tạo tiếp */}
                                                {hasAudioCount > 0 ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleGenerateAudioInEditView(true)}
                                                            disabled={saving || isRegenerating || generatingAudio}
                                                            className="w-8 h-8 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-500/20 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 disabled:opacity-40"
                                                            title="Tạo lại toàn bộ audio"
                                                        >
                                                            {generatingAudio ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                                        </button>

                                                        {missingAudioCount > 0 && (
                                                            <button
                                                                onClick={() => handleGenerateAudioInEditView(false)}
                                                                disabled={saving || isRegenerating || generatingAudio}
                                                                className="w-8 h-8 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 disabled:opacity-40"
                                                                title={`Tạo tiếp ${missingAudioCount} thoại chưa có audio`}
                                                            >
                                                                {generatingAudio ? <Loader2 size={14} className="animate-spin" /> : <Mic size={14} />}
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleGenerateAudioInEditView(false)}
                                                        disabled={saving || isRegenerating || generatingAudio}
                                                        className="w-8 h-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-40"
                                                        title="Tạo Audio"
                                                    >
                                                        {generatingAudio ? <Loader2 size={14} className="animate-spin" /> : <Mic size={14} />}
                                                    </button>
                                                )}

                                                {/* Nút Nghe thử */}
                                                {hasAudioCount > 0 && (
                                                    playingScriptId === selectedScript?.id && isPlaying ? (
                                                        <button 
                                                            onClick={stopPlaylist} 
                                                            className="w-8 h-8 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/20 rounded-lg flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0"
                                                            title="Dừng phát"
                                                        >
                                                            <Pause size={14} />
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handlePlayPlaylist(selectedScript)} 
                                                            className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0"
                                                            title="Nghe thử kịch bản"
                                                        >
                                                            <Play size={14} />
                                                        </button>
                                                    )
                                                )}

                                                {/* Seekbar phát audio nén gọn */}
                                                {playingScriptId === selectedScript?.id && (
                                                    <div className="flex flex-col items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-white/5 w-8 shrink-0">
                                                        <button onClick={isPlaying ? pausePlaylist : resumePlaylist} className="text-indigo-400 hover:text-indigo-300">
                                                            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                                                        </button>
                                                        <span className="text-[7px] text-slate-500 font-mono scale-90">{Math.floor(currentElapsedTime)}s</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Nút Hủy / Quay lại */}
                                    <button 
                                        onClick={handleBackToList} 
                                        disabled={saving || isRegenerating || generatingAudio} 
                                        className="w-8 h-8 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-white/5 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 mt-2"
                                        title="Quay lại danh sách"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Render Prompt script generator inside manager modal */}
            <AiDirectorModal
                publicSettings={p.publicSettings}
                show={showCreator}
                onClose={() => setShowCreator(false)}
                isGenerating={p.isGenerating}
                appLanguage={p.appLanguage}
                setAppLanguage={p.setAppLanguage}
                customLaoName={p.customLaoName}
                setCustomLaoName={p.setCustomLaoName}
                laoSelfCall={p.laoSelfCall}
                setLaoSelfCall={p.setLaoSelfCall}
                laoCallUser={p.laoCallUser}
                setLaoCallUser={p.setLaoCallUser}
                laoVoice={p.laoVoice}
                setLaoVoice={p.setLaoVoice}
                laoVoiceStyle={p.laoVoiceStyle}
                setLaoVoiceStyle={p.setLaoVoiceStyle}
                customUserName={p.customUserName}
                setCustomUserName={p.setCustomUserName}
                userSelfCall={p.userSelfCall}
                setUserSelfCall={p.setUserSelfCall}
                userCallLao={p.userCallLao}
                setUserCallLao={p.setUserCallLao}
                userVoice={p.userVoice}
                setUserVoice={p.setUserVoice}
                userVoiceStyle={p.userVoiceStyle}
                setUserVoiceStyle={p.setUserVoiceStyle}
                aiTopicText={p.aiTopicText}
                setAiTopicText={p.setAiTopicText}
                aiScriptLength={p.aiScriptLength}
                setAiScriptLength={p.setAiScriptLength}
                aiLaoStyle={p.aiLaoStyle}
                setAiLaoStyle={p.setAiLaoStyle}
                aiUserEmotionArc={p.aiUserEmotionArc}
                setAiUserEmotionArc={p.setAiUserEmotionArc}
                aiScriptTitle={p.aiScriptTitle}
                setAiScriptTitle={p.setAiScriptTitle}
                aiScriptDate={p.aiScriptDate}
                setAiScriptDate={p.setAiScriptDate}
                onGenerate={p.onGenerate}
                generatedScriptText={p.generatedScriptText}
                setGeneratedScriptText={p.setGeneratedScriptText}
                onSaveGeneratedScript={handleSaveGeneratedAIScript}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-rose-500/30 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center animate-in zoom-in-95">
                        <div className="mx-auto w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mb-4">
                            <Trash2 className="text-rose-400" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Xác nhận xóa</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Bạn có chắc chắn muốn xóa {deleteConfirm.count} kịch bản không? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={saving}
                                className="px-5 py-2 rounded-xl text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={() => executeDeleteScripts(deleteConfirm.ids)}
                                disabled={saving}
                                className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                                {saving ? 'Đang xóa...' : 'Xóa ngay'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiDirectorManagerModal;
