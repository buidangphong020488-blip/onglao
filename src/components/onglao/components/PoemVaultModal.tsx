"use client";
import React from "react";
import { X, BookOpen, FileText, Tag, Search, Loader2, Download, XCircle, Check, Info, Plus, Trash2, Play, Pause, Upload, RefreshCw, Wand2, Music4, Bot, Cloud, Copy, Archive, Save, Mic, VolumeX, Sparkles, Edit3, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { RagSection } from "../ui/RagSection";
import { useOngLaoContext } from "../context/OngLaoContext";

// PoemVaultModal: Nhận toàn bộ state/handlers qua context
// Để thêm/sửa tính năng trong modal này, chỉ cần mở file này - không cần đụng vào onglao-platform.tsx
const CATEGORY_MAP: Record<string, string> = {
  health_daily: "🍵 Hỏi thăm sức khỏe, ăn ngủ",
  serious_dharma: "🧘‍♂️ Hỏi đạo lý, tu hành nghiêm túc",
  love_heartbreak: "💔 Thất tình, đau khổ vì tình",
  money_debt: "💰 Tiền bạc, nợ nần, nghèo khó",
  complaining_lost: "🌧️ Than vãn, bế tắc chung chung",
  boasting_ego: "🦚 Khoe khoang, tự cao tự đại",
  random_teasing: "🎭 Hỏi vu vơ, chọc ghẹo Lão",
  testing_lao: "⚔️ Thử thách, đánh đố đạo lý",
  mundane_weather: "🍃 Chuyện linh tinh, bao đồng",
  waiting_long: "⏳ Chờ đợi quá lâu (> 60s)"
};

const PoemVaultModal = ({ isAdminMode = false, inline = false }: { isAdminMode?: boolean; inline?: boolean }) => {
  const p = useOngLaoContext();
  const {
    showPoemModal, setShowPoemModal, poemModalTab, setPoemModalTab,
    poemDatabase, poemSearch, setPoemSearch, savePoemDatabase,
    handleUpdatePoemContent, handleUpdatePoemMeaning,
    handleAddTag, handleRemoveTag,
    handleBatchGenerateStanzas, handleBatchGenerateMeanings, handleBatchGenerateGreetings,
    handleBatchGenerateAIMeaningsText, handleGenerateAIMeaningText,
    isBatchGeneratingPoems, isBatchGeneratingMeanings, isBatchGeneratingGreetings, isBatchGeneratingAIMeanings,
    isBatchGeneratingPoemsRef, isBatchGeneratingMeaningsRef, isBatchGeneratingGreetingsRef,
    setIsBatchGeneratingPoems, setIsBatchGeneratingMeanings, setIsBatchGeneratingGreetings,
    batchMeaningProgress, batchGreetingProgress, batchPoemProgress, batchAIMeaningProgress,
    currentlyPlayingId, setCurrentlyPlayingId,
    greetingsDb,
    handleUpdateGreetingText, handleGenerateGreetingVoice, handleDownloadAllPoemAudios,
    handleGenerateStanzaVoice, handlePlayStanzaVoice, handleSaveStanzaVoice,
    handleGenerateMeaningVoice, handleSaveMeaningVoice,
    handleExportFullBackupClick, handleImportFullBackup,
    handleSyncFromCloud, handlePushSourceToCloud, handleConnectOldLink,
    handleImportPoemJson, handleImportTxtPoem, handleExportPoemDatabaseCode,
    // Cloud/backup state
    user, appId, copyToClipboard, showToastMsg,
    isCloudSyncing, isProcessingBackup, isUploadingAudios,
    backupProgress, uploadAudioProgress,
    txtPoemFileInputRef, backupFileInputRef,
    showBackupOptionsModal, setShowBackupOptionsModal,
    backupOptions, setBackupOptions, executeFullBackup,
    showImportPoemModal, setShowImportPoemModal,
    importPoemJson, setImportPoemJson,
    showOldLinkModal, setShowOldLinkModal,
    oldLinkInput, setOldLinkInput,
    // Greeting state
    greetingAudioUrls, greetingSearch, setGreetingSearch,
    resolveGreetingAudioUrl,
    // Tag state
    newTagInputs, setNewTagInputs,
    // Generating states
    generatingStanzas, generatingMeanings, generatingGreetings,
    isGeneratingAIMeaning, isBatchGeneratingAIMeaningsRef, setIsBatchGeneratingAIMeanings,
    // RAG state
    isLoadingRag, selectedAiConfigId, ragSearch, setRagSearch, ragDb, refreshRagFromGiacNgo,
    // Pagination states & handlers
    isLoadingMorePoems, hasMorePoems, handleLoadMorePoemsFromGiacNgo,
    // Utility functions
    resolveStanzaAudioUrl, resolveMeaningAudioUrl, downloadAudio,
  } = p;

  const [displayLimit, setDisplayLimit] = React.useState(10);
  const [poemPage, setPoemPage] = React.useState(1);
  const [poemPerPage, setPoemPerPage] = React.useState(10);

  React.useEffect(() => {
    setDisplayLimit(10);
    setPoemPage(1);
  }, [poemSearch]);

  // ─── COLLAPSIBLE STANZAS STATE & HANDLER ──────────────────────────────
  const [expandedStanzas, setExpandedStanzas] = React.useState<Record<string, boolean>>({});
  const toggleStanza = (poemId: any, stanzaId: any) => {
    const key = `${poemId}_${stanzaId}`;
    setExpandedStanzas(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ─── SQLITE/POSTGRES OPENING PHRASES MANAGEMENT (ADMIN ONLY) ─────────
  const [phrases, setPhrases] = React.useState<any[]>([]);
  const [phrasesTotal, setPhrasesTotal] = React.useState(0);
  const [phrasesPage, setPhrasesPage] = React.useState(1);
  const [phrasesSearch, setPhrasesSearch] = React.useState('');
  const [audioFilter, setAudioFilter] = React.useState('all');
  const [phrasesPerPage, setPhrasesPerPage] = React.useState(20);
  const [editingPhrase, setEditingPhrase] = React.useState<any>(null);
  const [phraseForm, setPhraseForm] = React.useState({ text: '', category: '', isActive: true });
  const [generatingPhraseId, setGeneratingPhraseId] = React.useState<string|null>(null);
  const [loadingPhrases, setLoadingPhrases] = React.useState(false);
  const [playingId, setPlayingId] = React.useState<string|null>(null);
  const [selectedPhrases, setSelectedPhrases] = React.useState<string[]>([]);
  const [errorModalMsg, setErrorModalMsg] = React.useState<string | null>(null);
  const [batchGenProgress, setBatchGenProgress] = React.useState<{current: number, total: number}|null>(null);
  const phraseAudioRef = React.useRef<HTMLAudioElement|null>(null);
  const playingPhraseId = React.useRef<string|null>(null);

  const loadPhrases = React.useCallback(async (page = 1, search = '', filter = audioFilter, limit = phrasesPerPage) => {
    setLoadingPhrases(true);
    try {
      const params = new URLSearchParams({ 
        page: String(page), 
        limit: String(limit), 
        search,
        audioFilter: filter
      });
      const token = localStorage.getItem('onglao_admin_token') || '';
      const res = await fetch(`/api/admin/opening-phrases?${params}`, { headers: { 'x-admin-token': token } });
      if (res.ok) {
        const d = await res.json();
        setPhrases(d.items || []);
        setPhrasesTotal(d.total || 0);
        setPhrasesPage(page);
      }
    } finally {
      setLoadingPhrases(false);
    }
  }, [audioFilter, phrasesPerPage]);

  const handleLimitChange = (newLimit: number) => {
    setPhrasesPerPage(newLimit);
    loadPhrases(1, phrasesSearch, audioFilter, newLimit);
  };

  React.useEffect(() => {
    if (poemModalTab === 'greetings') {
      loadPhrases(1, phrasesSearch, audioFilter, phrasesPerPage);
    }
  }, [poemModalTab, phrasesSearch, audioFilter, phrasesPerPage]);

  const handleSavePhrase = async () => {
    if (!phraseForm.text.trim()) { setErrorModalMsg('Nội dung câu không được trống.'); return; }
    const token = localStorage.getItem('onglao_admin_token') || '';
    if (editingPhrase?.id) {
      await fetch(`/api/admin/opening-phrases/${editingPhrase.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify(phraseForm),
      });
    } else {
      await fetch('/api/admin/opening-phrases', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify(phraseForm),
      });
    }
    setEditingPhrase(null); setPhraseForm({ text: '', category: '', isActive: true });
    loadPhrases(phrasesPage, phrasesSearch);
  };

  const handleTogglePhraseActive = async (phrase: any) => {
    const token = localStorage.getItem('onglao_admin_token') || '';
    const newActiveState = !phrase.isActive;
    try {
      const res = await fetch(`/api/admin/opening-phrases/${phrase.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ isActive: newActiveState }),
      });
      if (res.ok) {
        setPhrases(prev => prev.map(p => p.id === phrase.id ? { ...p, isActive: newActiveState } : p));
      }
    } catch (err: any) {
      setErrorModalMsg('Lỗi cập nhật trạng thái: ' + err.message);
    }
  };

  const handleDeletePhrase = async (id: string) => {
    if (!confirm('Xóa câu mào đầu này?')) return;
    const token = localStorage.getItem('onglao_admin_token') || '';
    await fetch(`/api/admin/opening-phrases/${id}`, { method: 'DELETE', headers: { 'x-admin-token': token } });
    loadPhrases(phrasesPage, phrasesSearch);
  };

  const handleBatchDelete = async () => {
    if (!confirm(`Xóa ${selectedPhrases.length} câu mào đầu đã chọn?`)) return;
    const token = localStorage.getItem('onglao_admin_token') || '';
    for (const id of selectedPhrases) {
      await fetch(`/api/admin/opening-phrases/${id}`, { method: 'DELETE', headers: { 'x-admin-token': token } });
    }
    setSelectedPhrases([]);
    loadPhrases(phrasesPage, phrasesSearch);
  };

  const handleBatchGenerateAudio = async () => {
    const toGenerate = phrases.filter((p: any) => selectedPhrases.includes(p.id) && !p.audioUrl);
    if (toGenerate.length === 0) {
      setErrorModalMsg('Các câu đã chọn đều đã có audio hoặc không hợp lệ.');
      return;
    }
    if (!confirm(`Tạo audio cho ${toGenerate.length} câu? (Sẽ mất thời gian do phải gọi API tuần tự)`)) return;
    
    setBatchGenProgress({ current: 0, total: toGenerate.length });
    let successCount = 0;
    const token = localStorage.getItem('onglao_admin_token') || '';
    
    for (let i = 0; i < toGenerate.length; i++) {
      const phrase = toGenerate[i];
      setBatchGenProgress({ current: i + 1, total: toGenerate.length });
      setGeneratingPhraseId(phrase.id);
      try {
        const res = await fetch('/api/tts', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: phrase.text, voice: 'Algieba', voiceStyle: 'Giọng trầm ấm, từ bi' }),
        });
        if (res.ok) {
          const data = await res.json();
          const audioContent = data.audioContent;
          if (audioContent) {
            const wavBlob = new Blob([Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))], { type: data.mimeType || 'audio/wav' });
            const formData = new FormData();
            formData.append('audio', wavBlob, `phrase_${phrase.id}.wav`);
            const uploadRes = await fetch('/api/audio/upload', {
              method: 'POST',
              body: formData
            });
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              const finalAudioUrl = uploadData.url;
              await fetch(`/api/admin/opening-phrases/${phrase.id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
                body: JSON.stringify({ audioUrl: finalAudioUrl }),
              });
              successCount++;
            }
          }
        } else {
          const err = await res.json();
          setErrorModalMsg(`Lỗi tạo câu "${phrase.text}": ${err.message || res.statusText}`);
          break; 
        }
      } catch (err: any) { 
        setErrorModalMsg(`Lỗi kết nối khi tạo câu "${phrase.text}": ` + err.message);
        break;
      }
    }
    
    setGeneratingPhraseId(null);
    setBatchGenProgress(null);
    setSelectedPhrases([]);
    loadPhrases(phrasesPage, phrasesSearch);
  };

  const handleGeneratePhraseAudio = async (phrase: any) => {
    setGeneratingPhraseId(phrase.id);
    const token = localStorage.getItem('onglao_admin_token') || '';
    try {
      const res = await fetch('/api/tts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: phrase.text, voice: 'Algieba', voiceStyle: 'Giọng trầm ấm, từ bi' }),
      });
      if (res.ok) {
        const data = await res.json();
        const audioContent = data.audioContent;
        if (audioContent) {
          const wavBlob = new Blob([Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))], { type: data.mimeType || 'audio/wav' });
          const formData = new FormData();
          formData.append('audio', wavBlob, `phrase_${phrase.id}.wav`);
          const uploadRes = await fetch('/api/audio/upload', {
            method: 'POST',
            body: formData
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            const finalAudioUrl = uploadData.url;
            await fetch(`/api/admin/opening-phrases/${phrase.id}`, {
              method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
              body: JSON.stringify({ audioUrl: finalAudioUrl }),
            });
            loadPhrases(phrasesPage, phrasesSearch);
          }
        }
      }
    } catch (err: any) { setErrorModalMsg('Lỗi tạo audio: ' + err.message); }
    finally { setGeneratingPhraseId(null); }
  };

  const handleUploadPhraseAudio = async (e: any, phraseId: string) => {
    const file = e.target.files?.[0]; if (!file) return;
    const token = localStorage.getItem('onglao_admin_token') || '';
    const formData = new FormData();
    formData.append('file', file);
    try {
      const uploadRes = await fetch(`/api/admin/upload`, {
        method: 'POST', headers: { 'x-admin-token': token }, body: formData,
      });
      if (uploadRes.ok) {
        const d = await uploadRes.json();
        const url = d.success ? d.url : null;
        if (url) {
          await fetch(`/api/admin/opening-phrases/${phraseId}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
            body: JSON.stringify({ audioUrl: url }),
          });
          loadPhrases(phrasesPage, phrasesSearch);
        }
      }
    } catch (err: any) {
      setErrorModalMsg('Lỗi tải file: ' + err.message);
    }
    e.target.value = '';
  };

  const handlePlayPhraseAudio = (phrase: any) => {
    if (playingPhraseId.current === phrase.id) {
      phraseAudioRef.current?.pause(); playingPhraseId.current = null; setPlayingId(null); return;
    }
    phraseAudioRef.current?.pause();
    phraseAudioRef.current = new Audio(phrase.audioUrl);
    phraseAudioRef.current.onended = () => { playingPhraseId.current = null; setPlayingId(null); };
    phraseAudioRef.current.play(); playingPhraseId.current = phrase.id; setPlayingId(phrase.id);
  };

  const handleSeedPhrases = async () => {
    if (!confirm('Seed câu mào đầu từ dữ liệu mặc định? (skip câu đã tồn tại)')) return;
    const token = localStorage.getItem('onglao_admin_token') || '';
    const res = await fetch('/api/admin/opening-phrases/seed', { method: 'POST', headers: { 'x-admin-token': token } });
    if (res.ok) { 
      loadPhrases(1, ''); 
    }
  };

  const handleFillMissingGreetingsAudio = async () => {
    const token = localStorage.getItem('onglao_admin_token') || '';
    setLoadingPhrases(true);
    let totalCount = 0;
    let hasAudioCount = 0;
    let toGenerate: any[] = [];
    
    try {
      // 1. Lấy tổng số lượng câu mào đầu
      const resTotal = await fetch(`/api/admin/opening-phrases?page=1&limit=1`, { headers: { 'x-admin-token': token } });
      if (resTotal.ok) {
        const d = await resTotal.json();
        totalCount = d.total || 0;
      }
      
      // 2. Lấy số lượng đã có audio
      const resHasAudio = await fetch(`/api/admin/opening-phrases?page=1&limit=1&audioFilter=has_audio`, { headers: { 'x-admin-token': token } });
      if (resHasAudio.ok) {
        const d = await resHasAudio.json();
        hasAudioCount = d.total || 0;
      }
      
      // 3. Lấy danh sách câu chưa có audio để tạo
      const resNoAudio = await fetch(`/api/admin/opening-phrases?page=1&limit=999999&audioFilter=no_audio`, { headers: { 'x-admin-token': token } });
      if (resNoAudio.ok) {
        const d = await resNoAudio.json();
        toGenerate = d.items || [];
      }
    } catch (err: any) {
      setErrorModalMsg('Lỗi khởi tạo tiến trình: ' + err.message);
      setLoadingPhrases(false);
      return;
    } finally {
      setLoadingPhrases(false);
    }

    if (toGenerate.length === 0) {
      setErrorModalMsg('Tất cả câu mào đầu đều đã có audio!');
      return;
    }

    if (!confirm(`Hệ thống tìm thấy ${toGenerate.length} câu mào đầu chưa có audio.\nXác nhận chạy bù âm cho các câu này?\nTiến trình hiển thị: ${hasAudioCount}/${totalCount} -> ${totalCount}/${totalCount}.`)) return;

    setBatchGenProgress({ current: hasAudioCount, total: totalCount });
    let successCount = 0;

    for (let i = 0; i < toGenerate.length; i++) {
      const phrase = toGenerate[i];
      setGeneratingPhraseId(phrase.id);
      try {
        const res = await fetch('/api/tts', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: phrase.text, voice: 'Algieba', voiceStyle: 'Giọng trầm ấm, từ bi' }),
        });
        if (res.ok) {
          const data = await res.json();
          const audioContent = data.audioContent;
          if (audioContent) {
            const wavBlob = new Blob([Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))], { type: data.mimeType || 'audio/wav' });
            const formData = new FormData();
            formData.append('audio', wavBlob, `phrase_${phrase.id}.wav`);
            const uploadRes = await fetch('/api/audio/upload', {
              method: 'POST',
              body: formData
            });
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              const finalAudioUrl = uploadData.url;
              await fetch(`/api/admin/opening-phrases/${phrase.id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
                body: JSON.stringify({ audioUrl: finalAudioUrl }),
              });
              successCount++;
              setBatchGenProgress({ current: hasAudioCount + successCount, total: totalCount });
            }
          }
        } else {
          const err = await res.json();
          setErrorModalMsg(`Lỗi tạo câu "${phrase.text}": ${err.message || res.statusText}`);
          break; 
        }
      } catch (err: any) { 
        setErrorModalMsg(`Lỗi kết nối khi tạo câu "${phrase.text}": ` + err.message);
        break;
      }
    }

    setGeneratingPhraseId(null);
    setBatchGenProgress(null);
    setErrorModalMsg(`Hoàn thành bù âm cho ${successCount}/${toGenerate.length} câu mào đầu.`);
    loadPhrases(1, phrasesSearch);
  };

  const totalPhrasePages = Math.ceil(phrasesTotal / phrasesPerPage) || 1;

  const filteredPoems = React.useMemo(() => {
    return poemDatabase.filter((p: any) => 
      p.title.toLowerCase().includes(poemSearch.toLowerCase()) || 
      p.stanzas.some((s: any) => 
        s.content.toLowerCase().includes(poemSearch.toLowerCase()) || 
        s.tags.some((t: any) => t.toLowerCase().includes(poemSearch.toLowerCase()))
      )
    );
  }, [poemDatabase, poemSearch]);

  const totalPoemPages = Math.ceil(filteredPoems.length / poemPerPage) || 1;
  const currentPoemPage = Math.min(poemPage, totalPoemPages);
  const paginatedPoems = React.useMemo(() => {
    return filteredPoems.slice((currentPoemPage - 1) * poemPerPage, currentPoemPage * poemPerPage);
  }, [filteredPoems, currentPoemPage, poemPerPage]);

  const handleScroll = (e: any) => {
    const target = e.target;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 150) {
      setDisplayLimit(prev => prev + 10);
    }
  };

  if (!showPoemModal && !inline) return null;

  const innerContent = (
    <>
      <div className={`bg-slate-900 border border-emerald-500/30 rounded-2xl w-full ${inline ? 'h-full flex-1' : 'h-[85vh]'} shadow-2xl flex flex-col overflow-hidden`} onClick={e => e.stopPropagation()}>
          {!inline && (
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl shrink-0">
                  <h2 className="font-black text-emerald-400 tracking-widest flex items-center gap-2"><BookOpen size={18}/> Kho Tàng Pháp Bảo</h2>
                  <button  className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
          )}

          {/* THANH TAB CHUYỂN ĐỔI (Chỉ hiện trong Admin khi KHÔNG chạy inline) */}
          {isAdminMode && !inline && (
              <div className="flex border-b border-white/10 bg-slate-900 shrink-0">
                  <button onClick={() => setPoemModalTab('poems')} className={`flex-1 py-3 text-[10px] md:text-sm font-bold tracking-wider transition-all border-b-2 ${poemModalTab === 'poems' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Kho Kệ Pháp</button>
                  <button onClick={() => setPoemModalTab('greetings')} className={`flex-1 py-3 text-[10px] md:text-sm font-bold tracking-wider transition-all border-b-2 ${poemModalTab === 'greetings' ? 'border-orange-500 text-orange-400 bg-orange-500/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Mào Đầu (Tiếp đón)</button>
                  <button onClick={() => setPoemModalTab('rag')} className={`flex-1 py-3 text-[10px] md:text-sm font-bold tracking-wider transition-all border-b-2 ${poemModalTab === 'rag' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Kho Trí Tuệ (Huấn luyện)</button>
              </div>
          )}
                
                {/* NỘI DUNG TAB KHO KỆ PHÁP */}
                {poemModalTab === 'poems' && (
                  <div className="flex flex-col h-full overflow-hidden">
                    {/* PHẦN BẢNG ĐIỀU KHIỂN (Cố định ở trên) */}
                    <div className="p-4 border-b border-white/5 bg-slate-900/50 shrink-0 max-h-[45vh] overflow-y-auto scrollbar-hide">
                        

                    {/* THANH TIẾN TRÌNH BƠM AUDIO LÊN MÂY */}
                    {isAdminMode && isUploadingAudios && (
                        <div className="flex flex-col gap-1.5 bg-slate-950 p-4 rounded-xl border border-white/10 mb-4 animate-in fade-in shrink-0">
                            <div className="flex justify-between text-[11px] text-white font-bold tracking-wider">
                                <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin text-cyan-400"/> Đang bơm MP3 lên Mây...</span>
                                <span>{uploadAudioProgress.total > 0 ? Math.round((uploadAudioProgress.current / uploadAudioProgress.total) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-gradient-to-r from-cyan-600 to-blue-500 h-full transition-all duration-300 relative" style={{ width: `${uploadAudioProgress.total > 0 ? (uploadAudioProgress.current / uploadAudioProgress.total) * 100 : 0}%` }}>
                                    <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* THANH TIẾN TRÌNH BACKUP OFFLINE */}
                    {isAdminMode && isProcessingBackup && (
                        <div className="flex flex-col gap-1.5 bg-slate-950 p-4 rounded-xl border border-white/10 mb-4 animate-in fade-in shrink-0">
                            <div className="flex justify-between text-[11px] text-white font-bold tracking-wider">
                                <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin text-rose-500"/> {backupProgress.status}</span>
                                <span>{backupProgress.total > 0 ? Math.round((backupProgress.current / backupProgress.total) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-gradient-to-r from-rose-500 to-orange-500 h-full transition-all duration-300 relative" style={{ width: `${backupProgress.total > 0 ? (backupProgress.current / backupProgress.total) * 100 : 0}%` }}>
                                    <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BẢNG HƯỚNG DẪN DÙNG MÃ KHO (Thu nhỏ lại vì đã có tính năng File) */}
                                        <div className="flex gap-2 shrink-0">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm bài kệ hoặc tags..." 
                                value={poemSearch}
                                onChange={(e: any) => setPoemSearch(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
                            />
                        </div>
                        {isAdminMode && (
                            <button onClick={handleExportFullBackupClick} disabled={isProcessingBackup || isUploadingAudios} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0" title="Tải toàn bộ Kệ pháp VÀ File Âm Thanh về máy để dự phòng">
                                {isProcessingBackup && backupProgress.status.includes('đóng gói') ? <Loader2 size={12} className="animate-spin"/> : <Archive size={12}/>} Xuất File Sao Lưu
                            </button>
                        )}
                        <button onClick={handleExportPoemDatabaseCode} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 hidden md:flex">
                            <Copy size={16} /> Xuất mã nguồn Kệ
                        </button>
                    </div>

                    {/* BẢNG ĐIỀU KHIỂN TẠO ÂM THANH & BỘ ĐẾM THỐNG KÊ */}
                    {isAdminMode && (
                        <div className="flex flex-col gap-2 mt-3 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-xl shrink-0">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            {(() => {
                                // Tính toán số lượng Audio
                                const totalStanzasCount = poemDatabase.reduce((acc: any, p: any) => acc + p.stanzas.length, 0);
                                const savedStanzasCount = poemDatabase.reduce((acc: any, p: any) => acc + p.stanzas.filter((s: any) => s.isSaved || s.audioUrl).length, 0);
                                const missingStanzasCount = totalStanzasCount - savedStanzasCount;
                                
                                const totalMeaningsCount = poemDatabase.reduce((acc: any, p: any) => acc + p.stanzas.filter((s: any) => s.meaning && s.meaning.trim() !== '').length, 0);
                                const savedMeaningsCount = poemDatabase.reduce((acc: any, p: any) => acc + p.stanzas.filter((s: any) => (s.meaning && s.meaning.trim() !== '') && (s.isMeaningSaved || s.meaningAudioUrl)).length, 0);
                                const missingMeaningsCount = totalMeaningsCount - savedMeaningsCount;
                                
                                const totalGreetingsCount = (Object.values(greetingsDb) as any[]).reduce((acc: number, list: any) => acc + (list?.length || 0), 0);
                                const savedGreetingsCount = Object.keys(greetingAudioUrls).length;
                                const missingGreetingsCount = totalGreetingsCount - savedGreetingsCount;

                                return (
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5"><Mic size={14}/> Trạng thái Pháp âm:</span>
                                        <span className="text-[10px] text-slate-300 mt-1 flex flex-col gap-0.5">
                                            <span className="flex items-center gap-2">
                                               <span>Đoạn kệ ({totalStanzasCount}):</span>
                                               <span className="text-amber-400">{savedStanzasCount} đã có</span>|
                                               <span className="text-rose-400">{missingStanzasCount} thiếu</span>
                                            </span>
                                            <span className="flex items-center gap-2">
                                               <span>Diễn giải ({totalMeaningsCount}):</span>
                                               <span className="text-amber-400">{savedMeaningsCount} đã có</span>|
                                               <span className="text-rose-400">{missingMeaningsCount} thiếu</span>
                                            </span>
                                            <span className="flex items-center gap-2">
                                               <span>Mào đầu ({totalGreetingsCount}):</span>
                                               <span className="text-amber-400">{savedGreetingsCount} đã có</span>|
                                               <span className="text-rose-400">{missingGreetingsCount} thiếu</span>
                                            </span>
                                        </span>
                                    </div>
                                );
                            })()}
                            
                            <div className="flex gap-2 flex-wrap justify-end">
                                <button onClick={handleDownloadAllPoemAudios} className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-2 rounded-lg text-[10px] font-bold transition-all border border-emerald-500/30 shadow-md flex items-center gap-1.5" title="Tải tất cả các đoạn đã có âm thanh về máy">
                                    <Download size={12}/> <span className="hidden sm:inline">Tải tất cả Audio</span>
                                </button>
                                {!isBatchGeneratingPoems ? (
                                    <button onClick={handleBatchGenerateStanzas} disabled={isBatchGeneratingMeanings || isBatchGeneratingAIMeanings || isBatchGeneratingGreetings} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md whitespace-nowrap disabled:opacity-50">
                                        Bù âm Kệ
                                    </button>
                                ) : (
                                    <button onClick={() => { isBatchGeneratingPoemsRef.current = false; setIsBatchGeneratingPoems(false); }} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center gap-1.5 animate-pulse whitespace-nowrap">
                                        <XCircle size={12}/> Dừng Kệ
                                    </button>
                                )}
                                {!isBatchGeneratingMeanings ? (
                                    <button onClick={handleBatchGenerateMeanings} disabled={isBatchGeneratingPoems || isBatchGeneratingAIMeanings || isBatchGeneratingGreetings} className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md whitespace-nowrap disabled:opacity-50">
                                        Bù âm Diễn giải
                                    </button>
                                ) : (
                                    <button onClick={() => { isBatchGeneratingMeaningsRef.current = false; setIsBatchGeneratingMeanings(false); }} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center gap-1.5 animate-pulse whitespace-nowrap">
                                        <XCircle size={12}/> Dừng Giải
                                    </button>
                                )}
                                /* Hidden Bù âm Mào đầu */
                                {!isBatchGeneratingAIMeanings ? (
                                    <button onClick={handleBatchGenerateAIMeaningsText} disabled={isBatchGeneratingPoems || isBatchGeneratingMeanings || isBatchGeneratingGreetings} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50" title="Tự động nhờ AI viết phần diễn giải cho các đoạn còn trống">
                                        <Wand2 size={12}/> Viết Diễn giải (AI)
                                    </button>
                                ) : (
                                    <button onClick={() => { isBatchGeneratingAIMeaningsRef.current = false; setIsBatchGeneratingAIMeanings(false); }} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center gap-1.5 animate-pulse whitespace-nowrap">
                                        <XCircle size={12}/> Dừng AI viết
                                    </button>
                                )}
                            </div>
                        </div>
                        {isBatchGeneratingPoems && (
                            <div className="flex flex-col gap-1 mt-2 animate-in fade-in">
                                <div className="flex justify-between text-[9px] text-emerald-300 font-bold tracking-wider">
                                    <span>Đang tạo âm kệ: {batchPoemProgress.current} / {batchPoemProgress.total} đoạn</span>
                                    <span>{batchPoemProgress.total > 0 ? Math.round((batchPoemProgress.current / batchPoemProgress.total) * 100) : 0}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-emerald-500 h-full transition-all duration-500 relative" style={{ width: `${batchPoemProgress.total > 0 ? (batchPoemProgress.current / batchPoemProgress.total) * 100 : 0}%` }}>
                                        <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isBatchGeneratingMeanings && (
                            <div className="flex flex-col gap-1 mt-2 animate-in fade-in">
                                <div className="flex justify-between text-[9px] text-amber-300 font-bold tracking-wider">
                                    <span>Đang tạo âm diễn giải: {batchMeaningProgress.current} / {batchMeaningProgress.total} đoạn</span>
                                    <span>{batchMeaningProgress.total > 0 ? Math.round((batchMeaningProgress.current / batchMeaningProgress.total) * 100) : 0}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-amber-500 h-full transition-all duration-500 relative" style={{ width: `${batchMeaningProgress.total > 0 ? (batchMeaningProgress.current / batchMeaningProgress.total) * 100 : 0}%` }}>
                                        <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isBatchGeneratingGreetings && (
                            <div className="flex flex-col gap-1 mt-2 animate-in fade-in">
                                <div className="flex justify-between text-[9px] text-orange-300 font-bold tracking-wider">
                                    <span>Đang tạo âm mào đầu: {batchGreetingProgress.current} / {batchGreetingProgress.total} đoạn</span>
                                    <span>{batchGreetingProgress.total > 0 ? Math.round((batchGreetingProgress.current / batchGreetingProgress.total) * 100) : 0}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-orange-500 h-full transition-all duration-500 relative" style={{ width: `${batchGreetingProgress.total > 0 ? (batchGreetingProgress.current / batchGreetingProgress.total) * 100 : 0}%` }}>
                                        <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isBatchGeneratingAIMeanings && (
                            <div className="flex flex-col gap-1 mt-2 animate-in fade-in">
                                <div className="flex justify-between text-[9px] text-indigo-300 font-bold tracking-wider">
                                    <span>AI đang tự viết ý nghĩa: {batchAIMeaningProgress.current} / {batchAIMeaningProgress.total} đoạn</span>
                                    <span>{batchAIMeaningProgress.total > 0 ? Math.round((batchAIMeaningProgress.current / batchAIMeaningProgress.total) * 100) : 0}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-indigo-500 h-full transition-all duration-500 relative" style={{ width: (batchAIMeaningProgress.total > 0 ? Math.round((batchAIMeaningProgress.current / batchAIMeaningProgress.total) * 100) : 0) + '%' }}>
                                        <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    )}
                </div>

                {/* NỘI DUNG TAB KHO TRÍ TUỆ (RAG) — Chỉ đọc từ GiacNgo */}

                {/* PHẦN DANH SÁCH KỆ PHÁP (Tự do lướt mượt mà trên Mobile) */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 md:gap-8 scrollbar-hide min-h-0 touch-pan-y relative z-10 pb-10">
                    {paginatedPoems.map((poem: any, idx: any) => (
                        <div key={poem.id || idx} className="bg-slate-800/20 border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-2">
                               <BookOpen size={16} className="text-emerald-500"/>
                               <span className="text-sm font-black text-emerald-400 tracking-widest">{poem.title}</span>
                            </div>

                            <div className="flex flex-col gap-6 mt-2 pl-2 md:pl-4 border-l-2 border-slate-700/50">
                                                                {poem.stanzas.map((stanza: any, sIdx: any) => {
                                    const stanzaKey = `${poem.id}_${stanza.id || sIdx}`;
                                    const isExpanded = !!expandedStanzas[stanzaKey];
                                    
                                    return (
                                        <div key={stanza.id || sIdx} className="bg-slate-900/60 rounded-xl border border-white/5 flex flex-col hover:border-emerald-500/30 transition-all relative group overflow-hidden">
                                            {/* Clickable circle (timeline indicator) */}
                                            <span 
                                                onClick={() => toggleStanza(poem.id, stanza.id || sIdx)}
                                                className={`absolute -left-7 md:-left-9 top-3 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all z-20 ${
                                                    isExpanded 
                                                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-105' 
                                                        : 'bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-500'
                                                }`}
                                            >
                                                {sIdx + 1}
                                            </span>

                                            {/* Clickable Header Row to toggle expand/collapse */}
                                            <div 
                                                onClick={() => toggleStanza(poem.id, stanza.id || sIdx)}
                                                className="w-full flex items-center justify-between p-3 md:px-4 cursor-pointer select-none bg-slate-950/20 hover:bg-slate-950/40 transition-colors gap-3"
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded transition-all ${
                                                        isExpanded ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                                    }`}>
                                                        {sIdx + 1}
                                                    </span>
                                                    <span className="text-[11.5px] font-mono text-slate-300 truncate leading-relaxed">
                                                        {stanza.content ? stanza.content.split('\n')[0] : '...'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {stanza.tags && stanza.tags.length > 0 && (
                                                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">
                                                            {stanza.tags.length} tags
                                                        </span>
                                                    )}
                                                    {stanza.audioUrl && (
                                                        <span className="text-[9px] bg-emerald-950/40 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5" title="Có âm thanh Kệ">
                                                            🔊 Kệ
                                                        </span>
                                                    )}
                                                    {stanza.meaningAudioUrl && (
                                                        <span className="text-[9px] bg-amber-950/40 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-0.5" title="Có âm thanh Diễn giải">
                                                            🔊 Giảng
                                                        </span>
                                                    )}
                                                    {isExpanded ? (
                                                        <ChevronUp size={14} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                                    ) : (
                                                        <ChevronDown size={14} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Full Content (shown when expanded) */}
                                            {isExpanded && (
                                                <div className="p-3 md:p-4 pt-4 border-t border-white/5 flex flex-col xl:flex-row gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                                    {/* Khối Nội dung đoạn kệ & Ý nghĩa */}
                                                    <div className="flex-[2] grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        
                                                        {/* CỘT 1: ĐOẠN KỆ */}
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5"><FileText size={12}/> Đoạn kệ</span>
                                                            {isAdminMode ? (
                                                                <textarea 
                                                                    value={stanza.content}
                                                                    onChange={(e: any) => handleUpdatePoemContent(poem.id, stanza.id, e.target.value)}
                                                                    placeholder="Nội dung đoạn kệ..."
                                                                    className="w-full h-28 bg-slate-950 border border-transparent hover:border-white/10 focus:border-emerald-500 rounded-lg p-2.5 text-[11px] md:text-xs text-slate-300 outline-none resize-none font-mono leading-relaxed transition-all scrollbar-hide"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-28 bg-slate-950/40 border border-white/5 rounded-lg p-2.5 text-[11px] md:text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto scrollbar-hide select-text">
                                                                    {stanza.content}
                                                                </div>
                                                            )}
                                                            {/* Trình phát Audio của Lão (Đoạn Kệ) */}
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {isAdminMode ? (
                                                                    stanza.audioUrl ? (
                                                                        <div className="flex items-center gap-1.5 w-full">
                                                                            <button 
                                                                               onClick={async () => {
                                                                                  const playUrl = await resolveStanzaAudioUrl(poem.id, stanza);
                                                                                  if (playUrl) handlePlayStanzaVoice(playUrl);
                                                                               }} 
                                                                               className="flex-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold border border-emerald-500/30 transition-all flex justify-center items-center gap-1"
                                                                            >
                                                                               <Play size={10}/> Nghe
                                                                            </button>
                                                                            <button 
                                                                               onClick={async () => {
                                                                                  const actUrl = await resolveStanzaAudioUrl(poem.id, stanza);
                                                                                  if (actUrl) {
                                                                                      const cleanTitle = poem.title.replace(/[^a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂ??ỆỈỊỌỎỐỒỔỖỘỚỜ?ỠỢỤỦỨỪỬỮỰỲÝỴỶỸàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳýỵỷỹ\s]/g, '').trim().replace(/\s+/g, '_');
                                                                                      downloadAudio(actUrl, `Ke_${cleanTitle}_Doan_${sIdx + 1}`);
                                                                                  }
                                                                               }}
                                                                               className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg border border-white/10 transition-all" title="Tải file Audio Kệ"
                                                                            >
                                                                               <Download size={10}/>
                                                                            </button>
                                                                            <button onClick={() => handleGenerateStanzaVoice(poem.id, stanza.id, stanza.content)} disabled={generatingStanzas[stanza.id]} className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white p-1.5 rounded-lg border border-white/10 transition-all disabled:opacity-50" title="Tạo lại giọng đọc">
                                                                               <RefreshCw size={10} className={generatingStanzas[stanza.id] ? "animate-spin" : ""}/>
                                                                            </button>
                                                                            {!stanza.isSaved && (
                                                                                <button 
                                                                                   onClick={async () => {
                                                                                      const actUrl = await resolveStanzaAudioUrl(poem.id, stanza);
                                                                                      if (actUrl) handleSaveStanzaVoice(poem.id, stanza.id, actUrl);
                                                                                   }} 
                                                                                   className="bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold border border-amber-500/30 transition-all flex items-center gap-1"
                                                                                >
                                                                                   <Save size={10}/> Lưu
                                                                                </button>
                                                                            )}
                                                                            {stanza.isSaved && (
                                                                                <span className="text-[9px] text-amber-400 flex items-center gap-1 bg-amber-900/30 px-1.5 py-1 rounded-lg border border-amber-500/20" title="Đã lưu Kho Lão">
                                                                                    <Archive size={10}/>
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <button onClick={() => handleGenerateStanzaVoice(poem.id, stanza.id, stanza.content)} disabled={generatingStanzas[stanza.id]} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1.5 rounded-lg text-[9px] font-bold border border-white/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                                                                           {generatingStanzas[stanza.id] ? <Loader2 size={10} className="animate-spin text-emerald-500"/> : <Mic size={10} className="text-emerald-500"/>} 
                                                                           {generatingStanzas[stanza.id] ? "Đang truyền tâm thanh..." : "Tạo âm Kệ"}
                                                                        </button>
                                                                    )
                                                                ) : (
                                                                    stanza.audioUrl ? (
                                                                        <button 
                                                                           onClick={async () => {
                                                                              const playUrl = await resolveStanzaAudioUrl(poem.id, stanza);
                                                                              if (playUrl) handlePlayStanzaVoice(playUrl);
                                                                           }} 
                                                                           className="w-full bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold border border-emerald-500/30 transition-all flex justify-center items-center gap-1"
                                                                        >
                                                                           <Play size={10}/> Nghe Kệ
                                                                        </button>
                                                                    ) : (
                                                                        <button disabled className="w-full bg-slate-950 text-slate-600 px-2 py-1.5 rounded-lg text-[9px] font-bold border border-white/5 cursor-not-allowed flex justify-center items-center gap-1">
                                                                           <VolumeX size={10}/> Chưa có Audio Kệ
                                                                        </button>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* CỘT 2: Ý NGHĨA DIỄN GIẢI */}
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5"><Info size={12}/> Ý nghĩa / Diễn giải</span>
                                                                {isAdminMode && (
                                                                <button 
                                                                    onClick={() => handleGenerateAIMeaningText(poem.id, stanza.id)} 
                                                                    disabled={isGeneratingAIMeaning[stanza.id]}
                                                                    className="text-[9px] bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-white px-2 py-1 rounded transition-all flex items-center gap-1 disabled:opacity-50"
                                                                    title="Nhờ AI tự động đọc hiểu và diễn giải đoạn kệ này"
                                                                >
                                                                    {isGeneratingAIMeaning[stanza.id] ? <Loader2 size={10} className="animate-spin"/> : <Wand2 size={10}/>} 
                                                                    {isGeneratingAIMeaning[stanza.id] ? "Đang viết..." : "AI Diễn giải"}
                                                                </button>
                                                                )}
                                                            </div>
                                                            {isAdminMode ? (
                                                                <textarea 
                                                                    value={stanza.meaning || ''}
                                                                    onChange={(e: any) => handleUpdatePoemMeaning(poem.id, stanza.id, e.target.value)}
                                                                    placeholder="Bạn có thể tự ghi chú ý nghĩa đoạn kệ tại đây. AI sẽ đọc được và giảng giải cực hay theo ý bạn..."
                                                                    className="w-full h-28 bg-slate-950 border border-transparent hover:border-white/10 focus:border-amber-500 rounded-lg p-2.5 text-[11px] md:text-xs text-amber-100/80 outline-none resize-none font-sans leading-relaxed transition-all scrollbar-hide"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-28 bg-slate-950/40 border border-white/5 rounded-lg p-2.5 text-[11px] md:text-xs text-amber-100/70 font-sans whitespace-pre-wrap leading-relaxed overflow-y-auto scrollbar-hide select-text">
                                                                    {stanza.meaning || 'Chưa có diễn giải'}
                                                                </div>
                                                            )}
                                                            {/* Trình phát Audio của Lão (Ý nghĩa) */}
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {isAdminMode ? (
                                                                    stanza.meaningAudioUrl ? (
                                                                        <div className="flex items-center gap-1.5 w-full">
                                                                            <button 
                                                                               onClick={async () => {
                                                                                  const playUrl = await resolveMeaningAudioUrl(poem.id, stanza);
                                                                                  if (playUrl) handlePlayStanzaVoice(playUrl);
                                                                               }} 
                                                                               className="flex-1 bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold border border-amber-500/30 transition-all flex justify-center items-center gap-1"
                                                                            >
                                                                               <Play size={10}/> Nghe
                                                                            </button>
                                                                            <button 
                                                                               onClick={async () => {
                                                                                  const actUrl = await resolveMeaningAudioUrl(poem.id, stanza);
                                                                                  if (actUrl) {
                                                                                      const cleanTitle = poem.title.replace(/[^a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂ??ỆỈỊỌỎỐỒỔỖỘỚỜ?ỠỢỤỦỨỪỬỮỰỲÝỴỶỸàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳýỵỷỹ\s]/g, '').trim().replace(/\s+/g, '_');
                                                                                      downloadAudio(actUrl, `Giai_${cleanTitle}_Doan_${sIdx + 1}`);
                                                                                  }
                                                                               }}
                                                                               className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 p-1.5 rounded-lg border border-white/10 transition-all" title="Tải file Audio Giảng giải"
                                                                            >
                                                                               <Download size={10}/>
                                                                            </button>
                                                                            <button onClick={() => handleGenerateMeaningVoice(poem.id, stanza.id, stanza.meaning)} disabled={generatingMeanings[stanza.id]} className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white p-1.5 rounded-lg border border-white/10 transition-all disabled:opacity-50" title="Tạo lại giọng đọc">
                                                                               <RefreshCw size={10} className={generatingMeanings[stanza.id] ? "animate-spin" : ""}/>
                                                                            </button>
                                                                            {!stanza.isMeaningSaved && (
                                                                                <button 
                                                                                   onClick={async () => {
                                                                                      const actUrl = await resolveMeaningAudioUrl(poem.id, stanza);
                                                                                      if (actUrl) handleSaveMeaningVoice(poem.id, stanza.id, actUrl);
                                                                                   }} 
                                                                                   className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold border border-emerald-500/30 transition-all flex items-center gap-1"
                                                                                >
                                                                                   <Save size={10}/> Lưu
                                                                                </button>
                                                                            )}
                                                                            {stanza.isMeaningSaved && (
                                                                                <span className="text-[9px] text-emerald-400 flex items-center gap-1 bg-emerald-900/30 px-1.5 py-1 rounded-lg border border-emerald-500/20" title="Đã lưu Kho Lão">
                                                                                    <Archive size={10}/>
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <button onClick={() => handleGenerateMeaningVoice(poem.id, stanza.id, stanza.meaning)} disabled={!stanza.meaning || generatingMeanings[stanza.id]} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1.5 rounded-lg text-[9px] font-bold border border-white/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                                                                           {generatingMeanings[stanza.id] ? <Loader2 size={10} className="animate-spin text-amber-500"/> : <Mic size={10} className="text-amber-500"/>} 
                                                                           {generatingMeanings[stanza.id] ? "Đang truyền tâm thanh..." : "Tạo âm Giảng giải"}
                                                                        </button>
                                                                    )
                                                                ) : (
                                                                    stanza.meaningAudioUrl ? (
                                                                        <button 
                                                                           onClick={async () => {
                                                                              const playUrl = await resolveMeaningAudioUrl(poem.id, stanza);
                                                                              if (playUrl) handlePlayStanzaVoice(playUrl);
                                                                           }} 
                                                                           className="w-full bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold border border-emerald-500/30 transition-all flex justify-center items-center gap-1"
                                                                        >
                                                                           <Play size={10}/> Nghe Giảng giải
                                                                        </button>
                                                                    ) : (
                                                                        <button disabled className="w-full bg-slate-950 text-slate-600 px-2 py-1.5 rounded-lg text-[9px] font-bold border border-white/5 cursor-not-allowed flex justify-center items-center gap-1">
                                                                           <VolumeX size={10}/> Chưa có Audio Giảng
                                                                        </button>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Khối Tags */}
                                                    <div className="flex-1 flex flex-col gap-2 border-t xl:border-t-0 xl:border-l border-white/5 pt-3 xl:pt-0 xl:pl-4">
                                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5"><Tag size={12}/> Tags đoạn ${sIdx + 1}</span>
                                                        <div className="flex flex-wrap gap-1.5 min-h-[40px] items-start">
                                                            {stanza.tags.map((tag: any) => (
                                                                <span key={tag} className="bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-md text-[10px] flex items-center gap-1.5">
                                                                    {tag} 
                                                                    {isAdminMode && (
                                                                        <button onClick={() => handleRemoveTag(poem.id, stanza.id, tag)} className="hover:text-rose-400 opacity-60 hover:opacity-100 transition-opacity"><X size={10}/></button>
                                                                    )}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        {isAdminMode && (
                                                            <div className="flex mt-auto pt-2">
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Thêm tag cho đoạn này..."
                                                                    value={newTagInputs[stanza.id] || ''}
                                                                    onChange={(e: any) => setNewTagInputs((prev: any) => ({...prev, [stanza.id]: e.target.value}))}
                                                                    onKeyPress={(e: any) => e.key === 'Enter' && handleAddTag(poem.id, stanza.id)}
                                                                    className="bg-slate-950 border border-white/10 rounded-l-lg px-2.5 py-1.5 text-[11px] text-white focus:border-emerald-500 outline-none flex-1 min-w-0"
                                                                />
                                                                <button onClick={() => handleAddTag(poem.id, stanza.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-r-lg text-[10px] font-bold transition-colors">
                                                                    Thêm
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    {hasMorePoems && !poemSearch && (
                        <div className="flex justify-center mt-4 mb-2 shrink-0">
                            <button
                                onClick={handleLoadMorePoemsFromGiacNgo}
                                disabled={isLoadingMorePoems}
                                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/20 shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isLoadingMorePoems ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Đang tải thêm kệ pháp...
                                    </>
                                ) : (
                                    <>
                                        <Download size={14} />
                                        Tải thêm Kệ Pháp từ GiacNgo (Xem thêm)
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                    {filteredPoems.length === 0 && (
                        <div className="text-center p-8 text-slate-500 italic text-sm">Không tìm thấy bài kệ hoặc tag nào khớp với từ khóa.</div>
                    )}
                </div>
                
                {/* Phân trang & Số dòng cho Kệ pháp */}
                {filteredPoems.length > 0 && (
                  <div className="p-4 bg-slate-950 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Hiện số dòng:</span>
                      <select 
                        value={poemPerPage} 
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setPoemPerPage(val);
                          setPoemPage(1);
                        }}
                        className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-slate-200 outline-none cursor-pointer hover:border-emerald-500/50 transition-colors"
                      >
                        <option value={5}>5 dòng</option>
                        <option value={10}>10 dòng</option>
                        <option value={50}>50 dòng</option>
                        <option value={100}>100 dòng</option>
                      </select>
                    </div>
                    
                    {totalPoemPages > 1 && (
                      <div className="flex justify-center items-center gap-1.5">
                        <button disabled={currentPoemPage === 1} onClick={() => setPoemPage(prev => Math.max(prev - 1, 1))}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 rounded-lg border border-white/5 transition-all mr-1">
                          <ChevronLeft size={14} />
                        </button>
                        {(() => {
                          const maxVisiblePages = 5;
                          let startPage = Math.max(1, currentPoemPage - Math.floor(maxVisiblePages / 2));
                          let endPage = Math.min(totalPoemPages, startPage + maxVisiblePages - 1);
                          if (endPage - startPage + 1 < maxVisiblePages) {
                              startPage = Math.max(1, endPage - maxVisiblePages + 1);
                          }
                          const pageButtons = [];
                          for (let i = startPage; i <= endPage; i++) {
                              pageButtons.push(i);
                          }
                          return (
                            <>
                              {startPage > 1 && (
                                <>
                                  <button onClick={() => setPoemPage(1)} className="w-7 h-7 rounded-lg text-xs font-bold transition-all bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5">1</button>
                                  {startPage > 2 && <span className="text-[10px] text-slate-600 px-0.5">...</span>}
                                </>
                              )}
                              {pageButtons.map(p => (
                                <button 
                                  key={p} 
                                  onClick={() => setPoemPage(p)}
                                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                    currentPoemPage === p 
                                      ? 'bg-emerald-600 text-white' 
                                      : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
                                  }`}
                                >
                                  {p}
                                </button>
                              ))}
                              {endPage < totalPoemPages && (
                                <>
                                  {endPage < totalPoemPages - 1 && <span className="text-[10px] text-slate-600 px-0.5">...</span>}
                                  <button onClick={() => setPoemPage(totalPoemPages)} className="w-7 h-7 rounded-lg text-xs font-bold transition-all bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5">{totalPoemPages}</button>
                                </>
                              )}
                            </>
                          );
                        })()}
                        <button disabled={currentPoemPage === totalPoemPages} onClick={() => setPoemPage(prev => Math.min(prev + 1, totalPoemPages))}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 rounded-lg border border-white/5 transition-all ml-1">
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* NỘI DUNG TAB MÀO ĐẦU (TIẾP ĐÓN) */}
            {poemModalTab === 'greetings' && (
              <div className="flex flex-col h-full overflow-hidden p-4 gap-4 bg-slate-900/50">
                  {/* FORM THÊM MỚI / CHỈNH SỬA */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5 shrink-0">
                      <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
                          {editingPhrase ? '✍️ CHỈNH SỬA CÂU MÀO ĐẦU' : '➕ THÊM CÂU MÀO ĐẦU MỚI'}
                      </h3>
                      <div className="flex flex-col gap-3">
                          <div>
                              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Nội dung câu mào đầu</label>
                              <textarea 
                                  value={phraseForm.text}
                                  onChange={e => setPhraseForm(prev => ({ ...prev, text: e.target.value }))}
                                  placeholder="Nhập câu chào mừng hoặc phản hồi đầu tiên của Lão..."
                                  className="w-full h-20 bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-orange-500 resize-none leading-relaxed"
                              />
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex gap-4 items-center">
                                  <div>
                                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Nhóm / Danh mục</label>
                                      <select 
                                          value={phraseForm.category}
                                          onChange={e => setPhraseForm(prev => ({ ...prev, category: e.target.value }))}
                                          className="bg-slate-900 border border-white/10 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none focus:border-orange-500 cursor-pointer"
                                      >
                                          <option value="">-- Chọn danh mục --</option>
                                          {Object.entries(CATEGORY_MAP).map(([key, val]) => (
                                              <option key={key} value={key}>{val}</option>
                                          ))}
                                      </select>
                                  </div>
                                  <label className="flex items-center gap-2 mt-4 cursor-pointer select-none">
                                      <input 
                                          type="checkbox"
                                          checked={phraseForm.isActive}
                                          onChange={e => setPhraseForm(prev => ({ ...prev, isActive: e.target.checked }))}
                                          className="w-4 h-4 accent-orange-500 rounded"
                                      />
                                      <span className="text-xs text-slate-300 font-bold">Kích hoạt sử dụng</span>
                                  </label>
                              </div>
                              <div className="flex gap-2">
                                  {editingPhrase && (
                                      <button 
                                          onClick={() => { setEditingPhrase(null); setPhraseForm({ text: '', category: '', isActive: true }); }} 
                                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all"
                                      >
                                          Hủy
                                      </button>
                                  )}
                                  <button 
                                      onClick={handleFillMissingGreetingsAudio} 
                                      disabled={batchGenProgress !== null || loadingPhrases} 
                                      className="px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1" 
                                      title="Chạy bù âm cho các câu mào đầu chưa có audio trong CSDL"
                                  >
                                      <Sparkles size={13}/> Bù âm mào đầu
                                  </button>
                                  <button 
                                      onClick={handleSavePhrase} 
                                      className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                  >
                                      <Save size={13}/> Lưu lại
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* TOOLBAR TÌM KIẾM, LỌC VÀ CHẠY HÀNG LOẠT (Chỉ cho Admin) */}
                  <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-950 p-4 rounded-xl border border-white/5 shrink-0">
                      <div className="flex items-center gap-2 w-full md:w-auto">
                          <input 
                              type="checkbox" 
                              checked={phrases.length > 0 && selectedPhrases.length === phrases.length}
                              onChange={(e) => {
                                  if (e.target.checked) setSelectedPhrases(phrases.map((p: any) => p.id));
                                  else setSelectedPhrases([]);
                              }}
                              className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                          />
                          <span className="text-xs text-slate-400 font-bold">Chọn tất cả</span>
                          {selectedPhrases.length > 0 && (
                              <div className="flex gap-1.5 ml-2">
                                  <button 
                                      onClick={handleBatchDelete} 
                                      className="px-2.5 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg text-[10px] font-bold border border-rose-500/20 transition-all flex items-center gap-1"
                                  >
                                      <Trash2 size={11}/> Xóa đã chọn ({selectedPhrases.length})
                                  </button>
                                  {/* Hidden as requested:
                                  <button onClick={handleBatchGenerateAudio} className="px-2.5 py-1.5 bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white rounded-lg text-[10px] font-bold border border-amber-500/20 transition-all">
                                      <Sparkles size={11}/> Tạo âm hàng loạt ({selectedPhrases.length})
                                  </button>
                                  */}
                              </div>
                          )}
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                          <div className="relative w-full md:w-56">
                              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                              <input 
                                  type="text" 
                                  placeholder="Tìm câu mào đầu..." 
                                  value={phrasesSearch}
                                  onChange={e => setPhrasesSearch(e.target.value)}
                                  className="w-full bg-slate-900 border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-orange-500 outline-none"
                              />
                          </div>

                          <select 
                              value={audioFilter}
                              onChange={e => setAudioFilter(e.target.value)}
                              className="bg-slate-900 border border-white/5 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none focus:border-orange-500 cursor-pointer w-full md:w-32"
                          >
                              <option value="all">Tất cả Audio</option>
                              <option value="has_audio">Có Audio</option>
                              <option value="no_audio">Chưa có Audio</option>
                          </select>

                          {/* Hidden as requested:
                          <button onClick={handleSeedPhrases} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5" title="Seed 160 câu mào đầu mặc định từ Server">
                              <RefreshCw size={12}/> Seed 160 câu
                          </button>
                          */}
                      </div>
                  </div>

                  {/* DANH SÁCH CÂU HỎI MÀO ĐẦU */}
                  {loadingPhrases ? (
                      <div className="flex-1 flex justify-center items-center py-20">
                          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                      </div>
                  ) : phrases.length === 0 ? (
                      <div className="flex-1 text-center py-20 text-slate-500 italic text-xs border border-dashed border-white/10 rounded-xl">
                          Không tìm thấy câu mào đầu nào.
                      </div>
                  ) : (
                      <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-none">
                          {phrases.map((ph: any, phIdx: number) => (
                              <div key={ph.id} className="group flex gap-3 p-3 bg-slate-900/40 hover:bg-slate-950/60 border border-white/5 rounded-xl transition-all items-start">
                                  <input 
                                      type="checkbox" 
                                      checked={selectedPhrases.includes(ph.id)}
                                      onChange={(e) => {
                                          if (e.target.checked) setSelectedPhrases(prev => [...prev, ph.id]);
                                          else setSelectedPhrases(prev => prev.filter(id => id !== ph.id));
                                      }}
                                      className="mt-1 w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"
                                  />
                                  <span className="text-[10px] text-slate-600 font-mono pt-1 w-7 shrink-0 text-right">{(phrasesPage - 1) * phrasesPerPage + phIdx + 1}.</span>
                                  <div className="flex-1 min-w-0">
                                      <p className="text-xs text-slate-300 leading-relaxed font-sans select-text">{ph.text}</p>
                                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                                          {ph.category && (
                                              <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                                                  {CATEGORY_MAP[ph.category] || ph.category}
                                              </span>
                                          )}
                                          {ph.audioUrl ? (
                                              <span className="text-[9px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                                  🔊 Có Audio
                                              </span>
                                          ) : (
                                              <span className="text-[9px] bg-rose-950/40 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                                  🔇 Chưa có Audio
                                              </span>
                                          )}
                                          
                                          <button 
                                              onClick={() => handleTogglePhraseActive(ph)}
                                              title={ph.isActive ? "Click để tạm tắt" : "Click để kích hoạt"}
                                              className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border transition-all ${
                                                  ph.isActive 
                                                      ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/20' 
                                                      : 'bg-rose-950/10 text-rose-400 border-rose-500/20 hover:bg-emerald-600/20 hover:text-emerald-400 hover:border-emerald-500/20'
                                              }`}
                                          >
                                              {ph.isActive ? "✔️ Hoạt động" : "❌ Đang tắt"}
                                          </button>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {ph.audioUrl && (
                                          <button onClick={() => handlePlayPhraseAudio(ph)} title="Nghe audio"
                                              className="p-1.5 bg-slate-800 hover:bg-orange-700/30 text-orange-400 rounded-lg transition-colors border border-white/5">
                                              {playingId === ph.id ? <Pause size={13} /> : <Play size={13} />}
                                          </button>
                                      )}
                                      <label title="Tải audio thủ công" className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg cursor-pointer border border-white/5 flex items-center justify-center">
                                          <input type="file" accept="audio/*" className="hidden" onChange={e => handleUploadPhraseAudio(e, ph.id)} />
                                          <Upload size={13} />
                                      </label>
                                      <button onClick={() => handleGeneratePhraseAudio(ph)} disabled={generatingPhraseId === ph.id} title="Tạo giọng đọc AI"
                                          className="p-1.5 bg-slate-800 hover:bg-amber-700/30 text-amber-400 rounded-lg border border-white/5 transition-colors disabled:opacity-50 flex items-center justify-center">
                                          {generatingPhraseId === ph.id ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                                      </button>
                                      <button 
                                           onClick={() => handleTogglePhraseActive(ph)}
                                           title={ph.isActive ? "Click để tạm tắt câu mào đầu" : "Click để kích hoạt câu mào đầu"}
                                           className={`p-1.5 rounded-lg border transition-colors flex items-center justify-center ${
                                               ph.isActive 
                                                   ? 'bg-slate-800 border-white/5 text-emerald-400 hover:bg-rose-700/20 hover:text-rose-400' 
                                                   : 'bg-slate-800 border-white/5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-700/20'
                                           }`}
                                       >
                                           {ph.isActive ? <Check size={13} /> : <XCircle size={13} />}
                                       </button>
                                       <button onClick={() => { setEditingPhrase(ph); setPhraseForm({ text: ph.text, category: ph.category || '', isActive: ph.isActive }); }}
                                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-colors flex items-center justify-center"><Edit3 size={13} /></button>
                                      <button onClick={() => handleDeletePhrase(ph.id)}
                                          className="p-1.5 bg-slate-800 hover:bg-rose-700/20 text-slate-400 hover:text-rose-400 rounded-lg border border-white/5 transition-colors flex items-center justify-center"><Trash2 size={13} /></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}

                  {/* PHÂN TRANG */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-white/5 shrink-0">
                      <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Số dòng hiển thị:</span>
                          <select value={phrasesPerPage} 
                              onChange={e => handleLimitChange(Number(e.target.value))}
                              className="bg-slate-800 border border-white/10 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none focus:border-orange-500 cursor-pointer hover:border-orange-500/50 transition-colors"
                          >
                              <option value={5}>5 dòng</option>
                              <option value={10}>10 dòng</option>
                              <option value={20}>20 dòng</option>
                              <option value={50}>50 dòng</option>
                              <option value={100}>100 dòng</option>
                          </select>
                      </div>
                      {totalPhrasePages > 1 && (
                          <div className="flex items-center gap-1.5">
                              <button disabled={phrasesPage === 1} onClick={() => loadPhrases(phrasesPage - 1, phrasesSearch)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 rounded-lg border border-white/5 transition-all mr-1">
                                  <ChevronLeft size={14} />
                              </button>
                              {(() => {
                                  const maxVisiblePages = 5;
                                  let startPage = Math.max(1, phrasesPage - Math.floor(maxVisiblePages / 2));
                                  let endPage = Math.min(totalPhrasePages, startPage + maxVisiblePages - 1);
                                  if (endPage - startPage + 1 < maxVisiblePages) {
                                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                  }
                                  const pageButtons = [];
                                  for (let i = startPage; i <= endPage; i++) {
                                      pageButtons.push(i);
                                  }
                                  return (
                                    <>
                                      {startPage > 1 && (
                                        <>
                                          <button onClick={() => loadPhrases(1, phrasesSearch)} className="w-7 h-7 rounded-lg text-xs font-bold transition-all bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5">1</button>
                                          {startPage > 2 && <span className="text-[10px] text-slate-600 px-0.5">...</span>}
                                        </>
                                      )}
                                      {pageButtons.map(p => (
                                        <button 
                                          key={p} 
                                          onClick={() => loadPhrases(p, phrasesSearch)}
                                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                            phrasesPage === p 
                                              ? 'bg-orange-600 text-white' 
                                              : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
                                          }`}
                                        >
                                          {p}
                                        </button>
                                      ))}
                                      {endPage < totalPhrasePages && (
                                        <>
                                          {endPage < totalPhrasePages - 1 && <span className="text-[10px] text-slate-600 px-0.5">...</span>}
                                          <button onClick={() => loadPhrases(totalPhrasePages, phrasesSearch)} className="w-7 h-7 rounded-lg text-xs font-bold transition-all bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5">{totalPhrasePages}</button>
                                        </>
                                      )}
                                    </>
                                  );
                              })()}
                              <button disabled={phrasesPage === totalPhrasePages} onClick={() => loadPhrases(phrasesPage + 1, phrasesSearch)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 rounded-lg border border-white/5 transition-all ml-1">
                                  <ChevronRight size={14} />
                              </button>
                          </div>
                      )}
                  </div>
              </div>
            )}

            {/* NỘI DUNG TAB KHO TRÍ TUỆ (RAG) — Chỉ đọc từ GiacNgo */}
            {poemModalTab === 'rag' && (
              <RagSection
                isLoadingRag={isLoadingRag}
                selectedAiConfigId={selectedAiConfigId}
                ragSearch={ragSearch}
                setRagSearch={setRagSearch}
                ragDb={ragDb}
                refreshRagFromGiacNgo={refreshRagFromGiacNgo}
              />
            )}


      {/* MODAL TÙY CHỌN XUẤT FILE SAO LƯU */}
      {showBackupOptionsModal && (
         <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" >
            <div className="bg-slate-900 border border-rose-500/30 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                    <h2 className="font-black text-rose-400 tracking-widest flex items-center gap-2"><Archive size={18}/> Tùy chọn nén âm thanh</h2>
                    <button  className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-5 flex flex-col gap-4">
                    <p className="text-xs text-slate-300 leading-relaxed mb-1">Hãy chọn các nhóm âm thanh con muốn đóng gói vào File dự phòng. (Chọn ít sẽ giúp dung lượng nhẹ và tải nhanh hơn).</p>
                    
                    <div className="flex flex-col gap-3 bg-slate-950 p-4 rounded-xl border border-white/5">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                               type="checkbox" 
                               checked={backupOptions.stanzas} 
                               onChange={(e: any) => setBackupOptions({...backupOptions, stanzas: e.target.checked})}
                               className="w-5 h-5 accent-emerald-500 rounded cursor-pointer" 
                            />
                            <div className="flex flex-col">
                               <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Âm thanh Đoạn Kệ</span>
                               <span className="text-[10px] text-slate-500">Lời khai thị chính của Lão</span>
                            </div>
                        </label>
                        
                        <div className="w-full h-px bg-white/5"></div>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                               type="checkbox" 
                               checked={backupOptions.greetings} 
                               onChange={(e: any) => setBackupOptions({...backupOptions, greetings: e.target.checked})}
                               className="w-5 h-5 accent-orange-500 rounded cursor-pointer" 
                            />
                            <div className="flex flex-col">
                               <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">Âm thanh Mào Đầu</span>
                               <span className="text-[10px] text-slate-500">60+ Câu tiếp đón ứng biến của Lão</span>
                            </div>
                        </label>

                        <div className="w-full h-px bg-white/5"></div>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                               type="checkbox" 
                               checked={backupOptions.meanings} 
                               onChange={(e: any) => setBackupOptions({...backupOptions, meanings: e.target.checked})}
                               className="w-5 h-5 accent-amber-500 rounded cursor-pointer" 
                            />
                            <div className="flex flex-col">
                               <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Âm thanh Diễn Giải</span>
                               <span className="text-[10px] text-slate-500">Ý nghĩa từng đoạn do AI/Người dùng viết</span>
                            </div>
                        </label>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-2">
                        <button  className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy</button>
                        <button 
                            onClick={executeFullBackup} 
                            disabled={!backupOptions.stanzas && !backupOptions.meanings && !backupOptions.greetings}
                            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            <Download size={14}/> Bắt đầu nén file
                        </button>
                    </div>
                </div>
            </div>
         </div>
      )}

        </div>

      {/* MODAL DÁN MÃ JSON (CON TRONG KHO KỆ PHÁP) */}

  {/* MODAL DÁN MÃ JSON (CON TRONG KHO KỆ PHÁP) */}
      {showImportPoemModal && (
               <div className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={(e: any) => { e.stopPropagation(); setShowImportPoemModal(false); }}>
                  <div className="bg-slate-900 border border-pink-500/30 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                          <h2 className="font-black text-pink-400 tracking-widest flex items-center gap-2"><FileText size={18}/> Nhập Mã Nguồn JSON</h2>
                          <button onClick={() => setShowImportPoemModal(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                          <div className="bg-pink-900/20 border border-pink-500/30 p-4 rounded-xl flex flex-col gap-2">
                             <p className="text-[12px] text-pink-300 flex items-start gap-2 leading-relaxed font-bold">
                               <Info size={16} className="shrink-0 mt-0.5"/> 
                               Dùng để chuyển Kệ từ Link cũ sang Link mới:
                             </p>
                             <ul className="text-[11px] text-pink-200/80 list-disc pl-5 space-y-1.5 leading-relaxed">
                                <li>Dán toàn bộ mã JSON (bắt đầu bằng <b>[</b> và kết thúc bằng <b>]</b>) vào đây.</li>
                                <li><b>LƯU Ý QUAN TRỌNG:</b> Mã JSON chỉ có thể copy được PHẦN CHỮ. Các file âm thanh MP3 không thể chuyển qua bằng cách này.</li>
                                <li>Sau khi nhập mã xong để lấy lại phần chữ, con hãy đóng bảng này lại và dùng tính năng <b>"Tạo và Lưu pháp âm đồng loạt"</b> (Nút Bắt đầu chạy tự động) ở màn hình chính để hệ thống tự động tạo lại toàn bộ file âm thanh mới cho con nhé!</li>
                             </ul>
                          </div>
                          
                          <textarea 
                             value={importPoemJson}
                             onChange={(e: any) => setImportPoemJson(e.target.value)}
                             placeholder="[\n  {\n    &#34;id&#34;: &#34;poem_1&#34;,\n    &#34;title&#34;: &#34;Bài 1: Tam vô&#34;,\n    &#34;stanzas&#34;: [...]\n  }\n]"
                             className="w-full h-[35vh] bg-slate-950 border border-white/10 rounded-xl p-4 text-xs text-emerald-400 focus:border-pink-500 outline-none resize-none font-mono scrollbar-hide"
                             spellCheck="false"
                          />
                          
                          <div className="flex justify-end gap-3 mt-2 border-t border-white/5 pt-4">
                              <button onClick={() => setShowImportPoemModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy bỏ</button>
                              <button onClick={handleImportPoemJson} disabled={!importPoemJson.trim() || isCloudSyncing} className="px-6 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                                 {isCloudSyncing ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>} Xác nhận Nâng cấp Kho
                              </button>
                          </div>
                      </div>
                  </div>
               </div>
            )}

            {/* MODAL KHÔI PHỤC TỪ LINK CŨ */}
            {showOldLinkModal && (
               <div className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={(e: any) => { e.stopPropagation(); setShowOldLinkModal(false); }}>
                  <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                          <h2 className="font-black text-indigo-400 tracking-widest flex items-center gap-2"><Cloud size={18}/> Khôi phục từ Link cũ</h2>
                          <button onClick={() => setShowOldLinkModal(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                          <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-xl flex flex-col gap-2">
                             <p className="text-[12px] text-indigo-300 font-bold flex items-center gap-1.5">
                               <Info size={16}/> Hướng dẫn dọn nhà:
                             </p>
                             <ul className="text-[11px] text-indigo-200/80 list-disc pl-5 space-y-2 leading-relaxed">
                                <li><b>Trường hợp lý tưởng:</b> �? Link (ứng dụng) cũ, con vào Kho Tàng Kệ Pháp, bấm biểu tượng Copy cạnh <b>Mã Kho</b> rồi dán mã đó vào đây.</li>
                                <li><b>Nếu Link cũ chưa có nút Copy Mã Kho:</b> Con hãy mở Link cũ lên, <b>bấm chuột phải vào hình Lão (hoặc khoảng trống), chọn "Mở khung trong tab mới" (Open frame in new tab)</b>. Sau đó Copy toàn bộ đường link ở thẻ mới đó dán vào đây là thành công 100%.</li>
                             </ul>
                          </div>
                          
                          <input 
                             type="text"
                             value={oldLinkInput}
                             onChange={(e: any) => setOldLinkInput(e.target.value)}
                             placeholder="Dán Link thẻ mới HOẶC Mã Kho cũ vào đây..."
                             className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-indigo-400 focus:border-indigo-500 outline-none font-mono"
                          />
                          
                          <div className="flex justify-end gap-3 mt-2 border-t border-white/5 pt-4">
                              <button onClick={() => setShowOldLinkModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy bỏ</button>
                              <button onClick={handleConnectOldLink} disabled={!oldLinkInput.trim() || isCloudSyncing} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                                 {isCloudSyncing ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>} Bắt đầu dọn nhà
                              </button>
                          </div>
                      </div>
                  </div>
               </div>
            )}
            {/* MODAL THÔNG BÁO / BÁO LỖI THAY CHO ALERT */}
            {errorModalMsg && (
               <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex justify-center items-center p-4" onClick={(e: any) => { e.stopPropagation(); setErrorModalMsg(null); }}>
                  <div className="bg-slate-900 border border-rose-500/30 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-850 rounded-t-2xl">
                          <h2 className="font-black text-rose-400 tracking-widest flex items-center gap-2"><Info size={18}/> Thông báo hệ thống</h2>
                          <button onClick={() => setErrorModalMsg(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                          <div className="bg-rose-950/20 border border-rose-500/20 p-4 rounded-xl text-xs text-rose-200/90 leading-relaxed whitespace-pre-wrap select-text font-mono max-h-[60vh] overflow-y-auto scrollbar-hide">
                              {errorModalMsg}
                          </div>
                          <div className="flex justify-end pt-2">
                              <button onClick={() => setErrorModalMsg(null)} className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5">
                                  Đồng ý
                              </button>
                          </div>
                      </div>
                  </div>
               </div>
            )}
    </>
  );

  if (inline) return innerContent;

  return (
      <div className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" >
         <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
             {innerContent}
         </div>
      </div>
  );
};

export default PoemVaultModal;
