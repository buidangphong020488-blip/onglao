// @ts-nocheck
"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePoemDb } from '../../components/onglao/hooks/usePoemDb';
import PoemVaultModal from '../../components/onglao/components/PoemVaultModal';
import { OngLaoProvider } from '../../components/onglao/context/OngLaoContext';
import { appId, idb } from '../../components/onglao/constants';
import {
  Settings2, X, Save, Sparkles, Heart, Music, Eye, EyeOff, Film, Trash2, Plus,
  Edit3, Image as ImageIcon, Upload, Loader2, ArrowLeft, ChevronRight,
  Mic, Volume2, VolumeX, MessageSquare, Database, Home, LogOut,
  Search, ChevronLeft, ChevronDown, Check, Play, Pause, Users, Smile
} from 'lucide-react';

const CharacterThumbnail = ({ previewUrl }: { previewUrl: string }) => {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof previewUrl !== 'string' || !previewUrl) {
      setResolvedUrl(null);
      return;
    }
    
    if (previewUrl.startsWith('idb://')) {
      let active = true;
      const key = previewUrl.replace('idb://', '');
      idb.get(key).then((blob) => {
        if (active && blob) {
          const url = URL.createObjectURL(blob);
          setResolvedUrl(url);
        }
      }).catch((err) => {
        console.error("Failed to load thumbnail from indexedDB", err);
      });
      return () => {
        active = false;
        if (resolvedUrl && resolvedUrl.startsWith('blob:')) {
          URL.revokeObjectURL(resolvedUrl);
        }
      };
    } else {
      setResolvedUrl(previewUrl);
    }
  }, [previewUrl]);

  if (!resolvedUrl) {
    return <Film size={16} className="text-slate-800" />;
  }

  return (
    <video src={resolvedUrl} muted playsInline loop autoPlay className="w-full h-full object-cover opacity-80" />
  );
};

// ─── Sidebar Menu ─────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { id: 'settings',        icon: Settings2,    label: 'Cấu hình hệ thống', color: 'text-amber-400' },
  { id: 'hinh_tuong',      icon: Volume2,      label: 'Hình tướng',        color: 'text-emerald-400' },
  { id: 'kho_canh_quay',    icon: Users,        label: 'Kho cảnh quay',      color: 'text-indigo-400'  },
  { id: 'kho_ke_phap',     icon: Database,     label: 'Kho Kệ Pháp',       color: 'text-violet-400'  },
  { id: 'trang_thai',      icon: Smile,        label: 'Trạng thái nhân vật', color: 'text-pink-400'  },
];



export default function AdminPage() {
  // ─── Auth ────────────────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [loginUser, setLoginUser]     = useState('');
  const [loginPass, setLoginPass]     = useState('');
  const [loginError, setLoginError]   = useState('');
  const [showPass, setShowPass]       = useState(false);
  const [savedMsg, setSavedMsg]       = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab]     = useState('settings');
  const [kePhapSubTab, setKePhapSubTab] = useState<'poems' | 'opening_phrases' | 'greetings' | 'rag'>('poems');
  const adminToken = useRef('');

  // ─── Settings ───────────────────────────────────────────────────────────────
  const [settings, setSettings] = useState<any>({
    apiKey: '', modelName: 'gemini-2.5-flash-preview-09-2025',
    ttsModel: 'gemini-2.5-flash-preview-tts',
    momoPhone: '', momoName: '', bankName: '', bankAccount: '', qrImageUrl: '',
    subscribeCodes: 'TAMVO2025,UNGDUNG888,THIENSUGD2025', freeLimit: '20',
  });

  // ─── MODULE 1: Hình Tướng (audio nghe / nói) ────────────────────────────────
  const [hinhTuongs, setHinhTuongs]           = useState<any[]>([]);
  const [editingHT, setEditingHT]             = useState<any>(null);
  const [uploadingHTField, setUploadingHTField] = useState('');
  const [htPage, setHtPage]                   = useState(1);
  const [htPerPage, setHtPerPage]             = useState(10);
  const htFileRef = useRef<any>(null);

  // ─── MODULE 2: Kho Cảnh Quay (video states, dọc/ngang) ────────────────────────
  const [canhQuays, setCanhQuays]               = useState<any[]>([]);
  const [editingNV, setEditingNV]             = useState<any>(null);
  const [videoOrientTab, setVideoOrientTab]   = useState<'ngang'|'doc'>('ngang');
  const [uploadingNVField, setUploadingNVField] = useState('');
  const [nvPage, setNvPage]                   = useState(1);
  const [nvPerPage, setNvPerPage]             = useState(10);
  const [selectedNvIds, setSelectedNvIds]     = useState<string[]>([]);

  const handleToggleSelectNv = (id: string) => {
    setSelectedNvIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllNv = (paginatedIds: string[]) => {
    const allSelected = paginatedIds.every(id => selectedNvIds.includes(id));
    if (allSelected) {
      setSelectedNvIds(prev => prev.filter(id => !paginatedIds.includes(id)));
    } else {
      setSelectedNvIds(prev => {
        const newSelected = [...prev];
        paginatedIds.forEach(id => {
          if (!newSelected.includes(id)) newSelected.push(id);
        });
        return newSelected;
      });
    }
  };

  const handleBatchDeleteNv = async () => {
    if (selectedNvIds.length === 0) return;
    if (confirm(`Xác nhận xóa ${selectedNvIds.length} cảnh quay đã chọn?`)) {
      const newList = canhQuays.filter((v: any) => !selectedNvIds.includes(v.id));
      await saveCanhQuays(newList);
      setSelectedNvIds([]);
    }
  };

  // --- Poem DB hook for admin mode inline rendering ---
  const mockRef = useRef(null);
  const voiceStyleRef = useRef(null);
  const selectedConfigIdRef = useRef(null);
  const apiKeyRef = useRef(settings?.apiKey || '');
  useEffect(() => {
    apiKeyRef.current = settings?.apiKey || '';
  }, [settings?.apiKey]);

  const [poemPlayingId, setPoemPlayingId] = useState<string|null>(null);
  const poemAudioRef = useRef<HTMLAudioElement|null>(null);

  const poemDbState = usePoemDb({
    user: { uid: 'admin' },
    appLanguage: 'Tiếng Việt',
    selectedAiConfigId: 7,
    selectedAiConfigIdRef: selectedConfigIdRef,
    geminiApiKeyRef: apiKeyRef,
    showToastMsg: (msg: any, type: any) => {
      setSavedMsg(msg);
      setTimeout(() => setSavedMsg(''), 4000);
    },
    initialPoems: [],
    laoVoiceRef: mockRef,
    laoVoiceStyleRef: voiceStyleRef,
    userVoiceRef: mockRef,
    userVoiceStyleRef: mockRef,
    setIsFetchingCloudAudio: () => {},
    handlePlayStanzaVoice: (url: string, id: any) => {
      if (poemPlayingId === id) {
        poemAudioRef.current?.pause();
        setPoemPlayingId(null);
        return;
      }
      poemAudioRef.current?.pause();
      poemAudioRef.current = new Audio(url);
      poemAudioRef.current.onended = () => setPoemPlayingId(null);
      poemAudioRef.current.play();
      setPoemPlayingId(id);
    }
  });

  const poemContextValue = {
    ...poemDbState,
    user: { uid: 'admin' },
    appId,
    copyToClipboard: (text: string) => {
      navigator.clipboard.writeText(text);
      setSavedMsg('Đã sao chép!');
      setTimeout(() => setSavedMsg(''), 2000);
    },
    showToastMsg: (msg: any, type: any) => {
      setSavedMsg(msg);
      setTimeout(() => setSavedMsg(''), 4000);
    },
    showPoemModal: true,
    setShowPoemModal: () => {},
    currentlyPlayingId: poemPlayingId,
    setCurrentlyPlayingId: setPoemPlayingId,
    downloadAudio: (url: string, filename: string) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    isCloudSyncing: false,
    adminToken: adminToken.current
  };

  useEffect(() => {
    if (kePhapSubTab === 'poems' || kePhapSubTab === 'greetings' || kePhapSubTab === 'rag') {
      poemDbState.setPoemModalTab(kePhapSubTab);
    }
  }, [kePhapSubTab, poemDbState.setPoemModalTab]);


  // ─── MODULE 4: Trạng thái nhân vật ──────────────────────────────────────────
  const [editingStateId, setEditingStateId] = useState('');
  const [editingStateName, setEditingStateName] = useState('');
  const [isAddingState, setIsAddingState] = useState(false);

  const characterStatesMap = React.useMemo(() => {
    try {
      if (!settings.characterStates) return [];
      if (typeof settings.characterStates === 'string') return JSON.parse(settings.characterStates);
      return settings.characterStates;
    } catch {
      return [];
    }
  }, [settings.characterStates]);

  const saveCharacterStates = async (newStates: any[]) => {
    const updatedSettings = { ...settings, characterStates: JSON.stringify(newStates) };
    setSettings(updatedSettings);
    const res = await fetch('/api/admin/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken.current },
      body: JSON.stringify(updatedSettings),
    });
    if (res.ok) { showSaved(); } else { alert('Lỗi lưu cấu hình.'); }
  };

  const handleAddState = () => {
    if (!editingStateId || !editingStateName) return alert('Vui lòng nhập Mã và Tên');
    const exist = characterStatesMap.find((s: any) => s.id === editingStateId);
    if (exist) return alert('Mã trạng thái đã tồn tại');
    const newStates = [...characterStatesMap, { id: editingStateId, name: editingStateName }];
    saveCharacterStates(newStates);
    setIsAddingState(false); setEditingStateId(''); setEditingStateName('');
  };

  const handleDeleteState = (id: string) => {
    if (!confirm('Xóa trạng thái này?')) return;
    const newStates = characterStatesMap.filter((s: any) => s.id !== id);
    saveCharacterStates(newStates);
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const showSaved = (msg = 'Đã lưu!') => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  // Upload 1 file → trả về URL
  const doUpload = async (file: File): Promise<string|null> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST', headers: { 'x-admin-token': adminToken.current }, body: formData,
      });
      if (res.ok) { const d = await res.json(); return d.success ? d.url : null; }
      else { alert('Lỗi tải lên file ' + file.name + ' (Kích thước quá lớn hoặc sai định dạng).'); return null; }
    } catch(e) {
      alert('Lỗi kết nối tải file ' + file.name); return null;
    }
  };

  // ─── Init / Restore session ──────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (MENU_ITEMS.some(m => m.id === tabParam)) setActiveTab(tabParam!);
    const savedToken = localStorage.getItem('onglao_admin_token');
    if (savedToken) {
      adminToken.current = savedToken;
      setIsLoggedIn(true);
      loadAll(savedToken);
    }
  }, []);

  const loadAll = async (token: string) => {
    try {
      const [sRes, htRes, nvRes] = await Promise.all([
        fetch('/api/admin/settings', { headers: { 'x-admin-token': token } }),
        fetch('/api/admin/voice-personas', { headers: { 'x-admin-token': token } }).catch(() => ({ ok: false })),
        fetch('/api/admin/canh-quay', { headers: { 'x-admin-token': token } }).catch(() => ({ ok: false })),
      ]);
      if (sRes.ok) setSettings(await sRes.json());
      if ((htRes as any).ok) { const d = await (htRes as any).json(); if (Array.isArray(d)) setHinhTuongs(d); }
      if ((nvRes as any).ok) { const d = await (nvRes as any).json(); if (Array.isArray(d)) setCanhQuays(d); }
    } catch {}
  };

  // ─── Login ───────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        adminToken.current = loginPass;
        localStorage.setItem('onglao_admin_token', loginPass);
        setIsLoggedIn(true); setLoginError('');
        loadAll(loginPass);
      } else setLoginError(data.message || 'Sai tài khoản hoặc mật khẩu.');
    } catch (err: any) { setLoginError('Lỗi kết nối: ' + err.message); }
  };

  const handleLogout = () => {
    localStorage.removeItem('onglao_admin_token');
    adminToken.current = ''; setIsLoggedIn(false); setLoginPass('');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState(null, '', url.toString());
    }
  };

  // ─── Settings ────────────────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    const res = await fetch('/api/admin/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken.current },
      body: JSON.stringify(settings),
    });
    if (res.ok) { setSettings(await res.json()); showSaved(); }
    else alert('Lỗi lưu cấu hình.');
  };

  // ─── MODULE 1: Hình Tướng (audio) ────────────────────────────────────────────
  const saveHinhTuongs = async (list: any[]) => {
    await fetch('/api/admin/voice-personas', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken.current },
      body: JSON.stringify(list),
    });
    setHinhTuongs(list); showSaved();
  };

  const handleUploadHTAudio = async (e: any, field: string) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingHTField(field);
    const url = await doUpload(file);
    if (url) setEditingHT((p: any) => ({ ...p, [field]: url }));
    setUploadingHTField(''); e.target.value = '';
  };

  const handleSaveHT = () => {
    if (!editingHT?.name?.trim()) { alert('Tên nhân vật không được trống.'); return; }
    const exists = hinhTuongs.some((v: any) => v.id === editingHT.id);
    const newList = exists ? hinhTuongs.map((v: any) => v.id === editingHT.id ? editingHT : v) : [...hinhTuongs, editingHT];
    saveHinhTuongs(newList); setEditingHT(null);
  };

  // ─── MODULE 2: Kho Cảnh Quay (video) ───────────────────────────────────────────
  const saveCanhQuays = async (list: any[]) => {
    await fetch('/api/admin/canh-quay', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken.current },
      body: JSON.stringify(list),
    });
    setCanhQuays(list); showSaved();
  };

  // Nhận trạng thái từ tên file: con_binhthuong.mp4 → con_binhthuong
  const parseStateName = (filename: string): string => {
    return filename.replace(/\.(mp4|webm|mov|avi|mkv|m4v)$/i, '').toLowerCase().trim();
  };

  const handleUploadNVVideos = async (e: any, orientation: 'ngang' | 'doc') => {
    const files: File[] = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingNVField(`${orientation}_batch`);
    for (const file of files) {
      const state = parseStateName(file.name);
      const url = await doUpload(file);
      if (url) {
        setEditingNV((prev: any) => {
          const currentAssets = prev.assets?.[orientation] || {};
          let finalState = state;
          let suffix = 1;
          while (currentAssets[finalState]) {
            finalState = `${state}_${suffix}`;
            suffix++;
          }
          return {
            ...prev,
            assets: {
              ...prev.assets,
              [orientation]: { ...currentAssets, [finalState]: url },
            },
          };
        });
      }
    }
    setUploadingNVField(''); e.target.value = '';
  };

  const handleSaveNV = () => {
    if (!editingNV?.name?.trim()) { alert('Tên nhân vật không được trống.'); return; }
    
    let tempCanhQuays = [...canhQuays];
    const finalLinkedIds: string[] = [];

    // Process linked characters from linkedCharsList
    if (editingNV.linkedCharsList && Array.isArray(editingNV.linkedCharsList)) {
      editingNV.linkedCharsList.forEach((item: any) => {
        const charName = item.name?.trim();
        if (!charName) return; // skip unnamed linked characters
        
        let linkedChar = tempCanhQuays.find(nv => nv.id === item.id || nv.name.toLowerCase().trim() === charName.toLowerCase().trim());
        
        const updatedNgang = item.assets?.ngang || {};
        const updatedDoc = item.assets?.doc || {};

        if (linkedChar) {
          // Merge assets with existing ones in DB
          const parsedNgang = typeof linkedChar.assetsNgang === 'string' ? JSON.parse(linkedChar.assetsNgang || '{}') : (linkedChar.assetsNgang || {});
          const parsedDoc = typeof linkedChar.assetsDoc === 'string' ? JSON.parse(linkedChar.assetsDoc || '{}') : (linkedChar.assetsDoc || {});

          linkedChar.name = charName;
          linkedChar.assetsNgang = { ...parsedNgang, ...updatedNgang };
          linkedChar.assetsDoc = { ...parsedDoc, ...updatedDoc };
          linkedChar.updatedAt = new Date().toISOString();
          finalLinkedIds.push(linkedChar.id);
        } else {
          let idToUse = item.id;
          if (idToUse.startsWith('nv_linked_temp_')) {
            idToUse = 'nv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
          }
          const newChar = {
            id: idToUse,
            name: charName,
            assetsNgang: updatedNgang,
            assetsDoc: updatedDoc,
            linkedIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          tempCanhQuays.push(newChar);
          finalLinkedIds.push(idToUse);
        }
      });
    }

    const dataToSave = {
      id: editingNV.id,
      name: editingNV.name.trim(),
      assetsNgang: editingNV.assets?.ngang || {},
      assetsDoc: editingNV.assets?.doc || {},
      linkedIds: finalLinkedIds,
      createdAt: editingNV.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const exists = tempCanhQuays.some((v: any) => v.id === editingNV.id);
    const newList = exists ? tempCanhQuays.map((v: any) => v.id === editingNV.id ? dataToSave : v) : [...tempCanhQuays, dataToSave];
    
    saveCanhQuays(newList);
    setEditingNV(null);
  };

  const deleteVideoState = (orientation: string, state: string) => {
    setEditingNV((prev: any) => {
      const orient = { ...(prev.assets?.[orientation] || {}) };
      delete orient[state];
      return { ...prev, assets: { ...prev.assets, [orientation]: orient } };
    });
  };

  const startEditCanhQuay = (nv: any) => {
    const ngangAssets = typeof nv.assetsNgang === 'string' ? JSON.parse(nv.assetsNgang || '{}') : (nv.assetsNgang || {});
    const docAssets = typeof nv.assetsDoc === 'string' ? JSON.parse(nv.assetsDoc || '{}') : (nv.assetsDoc || {});
    const parsedLinkedIds = typeof nv.linkedIds === 'string' ? JSON.parse(nv.linkedIds || '[]') : (nv.linkedIds || []);
    
    const linkedCharsList = parsedLinkedIds.map((id: string) => {
      const linkedChar = canhQuays.find(x => x.id === id);
      if (linkedChar) {
        const lNgang = typeof linkedChar.assetsNgang === 'string' ? JSON.parse(linkedChar.assetsNgang || '{}') : (linkedChar.assetsNgang || {});
        const lDoc = typeof linkedChar.assetsDoc === 'string' ? JSON.parse(linkedChar.assetsDoc || '{}') : (linkedChar.assetsDoc || {});
        return {
          id: linkedChar.id,
          name: linkedChar.name,
          assets: { ngang: lNgang, doc: lDoc }
        };
      }
      return null;
    }).filter(Boolean);

    setEditingNV({
      ...nv,
      assets: { ngang: ngangAssets, doc: docAssets },
      linkedIds: parsedLinkedIds,
      linkedCharsList
    });
    setVideoOrientTab('ngang');
  };


  // ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xs shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Settings2 size={20} className="text-amber-400" />
            </div>
            <div>
              <h1 className="font-black text-slate-200 text-sm">Quản trị Ông Lão AI</h1>
              <p className="text-[10px] text-slate-500">Admin Panel</p>
            </div>
          </div>
          <div className="p-5 flex flex-col gap-3">
            <input type="text" value={loginUser} onChange={e => { setLoginUser(e.target.value); setLoginError(''); }}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('pass-input')?.focus()}
              placeholder="Tài khoản" autoFocus
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" />
            <div className="relative">
              <input id="pass-input" type={showPass ? 'text' : 'password'} value={loginPass}
                onChange={e => { setLoginPass(e.target.value); setLoginError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Mật khẩu"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-white outline-none focus:border-amber-500/50" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {loginError && <p className="text-rose-400 text-xs text-center">{loginError}</p>}
            <button onClick={handleLogin} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg">Vào cấu hình</button>
            <a href="/" className="text-[11px] text-slate-600 hover:text-slate-400 text-center transition-colors">← Quay về trang chủ</a>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN LAYOUT ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020617] font-sans text-white flex overflow-hidden">

      {/* ══ SIDEBAR ══ */}
      <aside className={`${sidebarOpen ? 'w-52' : 'w-16'} transition-all duration-300 shrink-0 bg-[#0a0f1e] border-r border-white/5 flex flex-col h-screen sticky top-0`}>
        <div className={`p-4 border-b border-white/5 flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
          <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
            <Settings2 size={16} className="text-amber-400" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-xs font-black text-amber-400 leading-tight">Ông Lão AI</p>
              <p className="text-[9px] text-slate-500">Admin Panel</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2 flex flex-col gap-1 overflow-y-auto">
          {MENU_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => handleTabChange(item.id)} title={!sidebarOpen ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group relative
                  ${isActive ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <Icon size={17} className={`shrink-0 ${isActive ? item.color : ''}`} />
                {sidebarOpen && <span className="text-xs font-semibold truncate">{item.label}</span>}
                {isActive && sidebarOpen && <ChevronRight size={12} className="ml-auto shrink-0 text-slate-500" />}
              </button>
            );
          })}
        </nav>

        <div className="p-2 border-t border-white/5 flex flex-col gap-1">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            {sidebarOpen ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
            {sidebarOpen && <span className="text-xs font-semibold">Thu gọn</span>}
          </button>
          <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            <Home size={17} className="shrink-0" />
            {sidebarOpen && <span className="text-xs font-semibold">Trang chủ</span>}
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all">
            <LogOut size={17} className="shrink-0" />
            {sidebarOpen && <span className="text-xs font-semibold">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">

        {/* Topbar */}
        <div className="sticky top-0 z-50 bg-[#020617]/95 border-b border-white/5 backdrop-blur-sm px-6 py-4 flex justify-between items-center shrink-0">
          <div>
            <h1 className="font-black text-slate-200 text-sm">{MENU_ITEMS.find(m => m.id === activeTab)?.label}</h1>
            <p className="text-[10px] text-slate-500">OngLao Admin</p>
          </div>
          <div className="flex items-center gap-3">
            {savedMsg && <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold"><Check size={14} /> {savedMsg}</span>}
            {activeTab === 'settings' && (
              <button onClick={handleSaveSettings}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg">
                <Save size={14} /> Lưu cấu hình
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 p-6">

          {/* ══════════════════════════════════════════
              TAB: CẤU HÌNH HỆ THỐNG
          ══════════════════════════════════════════ */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
              {/* API */}
              <section className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <h2 className="text-xs font-bold text-amber-400 tracking-widest uppercase flex items-center gap-2"><Sparkles size={14} /> API & Mô hình AI</h2>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] text-slate-400 font-bold">Gemini API Key</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={settings.apiKey} onChange={e => setSettings((p:any) => ({...p, apiKey: e.target.value}))}
                      placeholder="AIzaSy..."
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-white outline-none focus:border-amber-500 font-mono" />
                    <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] text-slate-400 font-bold">TTS Model</label>
                  <select value={settings.ttsModel} onChange={e => setSettings((p:any) => ({...p, ttsModel: e.target.value}))}
                    className="bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500 font-mono">
                    <option value="gemini-2.5-flash-preview-tts">Gemini 2.5 Flash TTS (Preview)</option>
                    <option value="gemini-3.1-flash-tts-preview">Gemini 3.1 Flash TTS (Preview)</option>
                  </select>
                </div>
              </section>
              {/* Freemium */}
              <section className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <h2 className="text-xs font-bold text-emerald-400 tracking-widest uppercase flex items-center gap-2"><Heart size={14} /> Freemium & Mã kích hoạt</h2>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] text-slate-400 font-bold">Số lượt nhắn tin miễn phí</label>
                  <input type="number" value={settings.freeLimit} onChange={e => setSettings((p:any) => ({...p, freeLimit: e.target.value}))}
                    className="w-40 bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] text-slate-400 font-bold">Mã kích hoạt <span className="text-slate-600">(phân cách bằng dấu phẩy)</span></label>
                  <input type="text" value={settings.subscribeCodes} onChange={e => setSettings((p:any) => ({...p, subscribeCodes: e.target.value}))}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500 font-mono" />
                </div>
              </section>
              {/* Payment */}
              <section className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <h2 className="text-xs font-bold text-pink-400 tracking-widest uppercase flex items-center gap-2"><Music size={14} /> Thanh toán</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[['momoPhone','💜 Số ĐT MoMo','09xx'],['momoName','Tên MoMo','NGUYEN VAN A'],['bankName','🏦 Ngân hàng','Vietcombank'],['bankAccount','Số tài khoản','1234567890']].map(([k,label,ph]) => (
                    <div key={k} className="flex flex-col gap-2">
                      <label className="text-[11px] text-slate-400 font-bold">{label}</label>
                      <input type="text" value={settings[k]} onChange={e => setSettings((p:any) => ({...p, [k]: e.target.value}))} placeholder={ph}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500 font-mono" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] text-slate-400 font-bold">📷 URL ảnh QR thanh toán</label>
                  <div className="flex gap-3 items-start">
                    <input type="text" value={settings.qrImageUrl} onChange={e => setSettings((p:any) => ({...p, qrImageUrl: e.target.value}))}
                      placeholder="https://..." className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500" />
                    {settings.qrImageUrl && <img src={settings.qrImageUrl} alt="QR" className="w-16 h-16 rounded-xl object-contain bg-white p-1" />}
                  </div>
                </div>
              </section>
              <button onClick={handleSaveSettings} className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-2xl text-sm transition-all shadow-xl flex items-center justify-center gap-2">
                <Save size={18} /> Lưu tất cả cấu hình
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════
              MODULE 1: HÌNH TƯỚNG (video nghe / nói)
          ══════════════════════════════════════════ */}
          {activeTab === 'hinh_tuong' && (
            <div className="max-w-3xl mx-auto flex flex-col gap-5">
              {editingHT ? (
                /* ─── Editor Hình Tướng ─── */
                <div className="bg-slate-900 border border-emerald-500/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 animate-in fade-in">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <button onClick={() => setEditingHT(null)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
                      <ArrowLeft size={16} /> Quay lại
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] text-slate-400 font-bold uppercase">Tên nhân vật</label>
                    <input type="text" value={editingHT.name} onChange={e => setEditingHT((p: any) => ({ ...p, name: e.target.value }))}
                      placeholder="VD: Lão Hoa, Minh..." autoFocus
                      className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 text-white" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {([
                      ['listenVideo', '🎧 Video Nghe', 'Hiển thị khi đang im lặng / chờ'],
                      ['speakVideo',  '🗣️ Video Nói',  'Hiển thị khi đang trả lời'],
                    ] as [string, string, string][]).map(([field, label, desc]) => (
                      <div key={field} className="p-5 bg-slate-950 border border-white/5 rounded-2xl flex flex-col gap-3">
                        <div>
                          <span className="text-sm font-bold text-slate-200 block">{label}</span>
                          <span className="text-[10px] text-slate-500">{desc}</span>
                        </div>
                        {editingHT[field] ? (
                          <video src={editingHT[field]} controls muted playsInline className="w-full aspect-video rounded-xl object-cover bg-black" />
                        ) : (
                          <div className="aspect-video bg-slate-900/60 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-[10px] text-slate-600">
                            Chưa có video
                          </div>
                        )}
                        <label className="bg-emerald-700/40 hover:bg-emerald-700/70 border border-emerald-600/30 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
                          <input type="file" accept="video/*" className="hidden" onChange={e => handleUploadHTAudio(e, field)} />
                          {uploadingHTField === field ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                          {editingHT[field] ? 'Thay thế video' : 'Upload video'}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                    {hinhTuongs.some((v: any) => v.id === editingHT.id) ? (
                      <button onClick={() => { const nl = hinhTuongs.filter((v: any) => v.id !== editingHT.id); saveHinhTuongs(nl); setEditingHT(null); }}
                        className="px-4 py-2 text-rose-500 hover:bg-rose-500/10 rounded-xl font-bold text-xs flex items-center gap-1.5">
                        <Trash2 size={14} /> Xóa
                      </button>
                    ) : <div />}
                    <div className="flex gap-3">
                      <button onClick={() => setEditingHT(null)} className="px-5 py-2 rounded-xl text-slate-400 hover:text-white font-bold">Hủy</button>
                      <button onClick={handleSaveHT} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-1.5">
                        <Save size={16} /> Lưu hình tướng
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ─── Danh sách Hình Tướng ─── */
                <div className="flex flex-col gap-5 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Danh sách ({hinhTuongs.length})</span>
                    <button onClick={() => setEditingHT({ id: 'ht_' + Date.now(), name: '', listenVideo: '', speakVideo: '' })}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg">
                      <Plus size={14} /> Thêm hình tướng
                    </button>
                  </div>

                  {hinhTuongs.length === 0 ? (
                    <div className="text-center py-24 text-slate-500 border border-dashed border-white/5 rounded-2xl">
                      <Film size={36} className="mx-auto mb-3 text-slate-700" />
                      <p className="text-sm font-semibold">Chưa có hình tướng nào</p>
                      <p className="text-xs text-slate-600 mt-1">Mỗi hình tướng gồm: tên + video nghe + video nói</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {(() => {
                        const HT_PER_PAGE = htPerPage;
                        const totalHtPages = Math.ceil(hinhTuongs.length / HT_PER_PAGE);
                        const currentPage = Math.min(htPage, totalHtPages || 1);
                        const paginatedHinhTuongs = hinhTuongs.slice((currentPage - 1) * HT_PER_PAGE, currentPage * HT_PER_PAGE);
                        return (
                          <>
                            {paginatedHinhTuongs.map((v: any, idx: number) => (
                              <div key={v.id} className="bg-slate-900/60 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between hover:border-emerald-500/30 transition-all group">
                                <div className="flex items-center gap-3.5 min-w-0">
                                  {/* Số thứ tự */}
                                  <span className="text-xs text-slate-500 font-mono w-6 text-right shrink-0 pr-1.5">
                                    {(currentPage - 1) * HT_PER_PAGE + idx + 1}.
                                  </span>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                      <p className="font-bold text-slate-100 text-sm leading-none">{v.name}</p>
                                      <div className="flex gap-1.5">
                                        <span className={`text-[9px] px-2 py-0.5 rounded-lg font-bold ${v.listenVideo ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-700/20' : 'bg-slate-800 text-slate-500'}`}>
                                          🎧 Nghe {v.listenVideo ? '✓' : '—'}
                                        </span>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-lg font-bold ${v.speakVideo ? 'bg-blue-950/40 text-blue-400 border border-blue-700/20' : 'bg-slate-800 text-slate-500'}`}>
                                          🗣️ Nói {v.speakVideo ? '✓' : '—'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button onClick={() => setEditingHT(v)} title="Chỉnh sửa hình tướng"
                                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-white/5 transition-all">
                                    <Edit3 size={12} />
                                  </button>
                                  <button onClick={() => { if(confirm(`Xác nhận xóa hình tướng ${v.name}?`)) { const nl = hinhTuongs.filter((x: any) => x.id !== v.id); saveHinhTuongs(nl); } }} title="Xóa hình tướng"
                                    className="p-2 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-xl border border-white/5 transition-all">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Phân trang & Số dòng */}
                            {hinhTuongs.length > 0 && (
                              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5 mt-4">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <span>Hiện số dòng:</span>
                                  <select 
                                    value={htPerPage} 
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      setHtPerPage(val);
                                      setHtPage(1);
                                    }}
                                    className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-slate-200 outline-none cursor-pointer hover:border-emerald-500/50 transition-colors"
                                  >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                  </select>
                                </div>
                                
                                {totalHtPages > 1 && (
                                  <div className="flex justify-center items-center gap-1.5">
                                    <button disabled={currentPage === 1} onClick={() => setHtPage(prev => Math.max(prev - 1, 1))}
                                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 rounded-lg border border-white/5 transition-all mr-1">
                                      <ChevronLeft size={14} />
                                    </button>
                                    {Array.from({ length: totalHtPages }, (_, i) => i + 1).map(p => (
                                      <button 
                                        key={p} 
                                        onClick={() => setHtPage(p)}
                                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                          currentPage === p 
                                            ? 'bg-emerald-600 text-white' 
                                            : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
                                        }`}
                                      >
                                        {p}
                                      </button>
                                    ))}
                                    <button disabled={currentPage === totalHtPages} onClick={() => setHtPage(prev => Math.min(prev + 1, totalHtPages))}
                                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 rounded-lg border border-white/5 transition-all ml-1">
                                      <ChevronRight size={14} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════
              MODULE 2: KHO CẢNH QUAY (video states)
          ══════════════════════════════════════════ */}
          {activeTab === 'kho_canh_quay' && (
            <div className="max-w-4xl mx-auto flex flex-col gap-5">
              {editingNV ? (
                /* ─── Editor Nhân Vật ─── */
                <div className="bg-slate-900 border border-indigo-500/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 animate-in fade-in">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <button onClick={() => setEditingNV(null)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
                      <ArrowLeft size={16} /> Quay lại
                    </button>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Film size={14} /> Kho cảnh quay</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] text-slate-400 font-bold uppercase">Tên nhân vật</label>
                    <input type="text" value={editingNV.name} onChange={e => setEditingNV((p: any) => ({ ...p, name: e.target.value }))}
                      placeholder="VD: Lão Hoa, Bé Minh..." autoFocus
                      className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white" />
                  </div>



                  {/* Tab Ngang / Dọc */}
                  <div className="flex flex-col gap-3">
                    <div className="flex border-b border-white/10">
                      {([['ngang', '📺 Ngang (16:9)', 'YouTube / OBS'], ['doc', '📱 Dọc (9:16)', 'TikTok / Reels']] as [string,string,string][]).map(([tab, label, sub]) => (
                        <button key={tab} onClick={() => setVideoOrientTab(tab as any)}
                          className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all flex flex-col items-center gap-0.5
                            ${videoOrientTab === tab
                              ? (tab === 'ngang' ? 'border-indigo-500 text-indigo-400 bg-white/5' : 'border-violet-500 text-violet-400 bg-white/5')
                              : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                          {label}
                          <span className="text-[9px] font-normal opacity-60">{sub}</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-5 bg-slate-950/50 border border-white/5 rounded-2xl flex flex-col gap-4 animate-in fade-in duration-150">
                      {/* Upload area */}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <p className="text-xs font-bold text-slate-300">Upload video {videoOrientTab === 'ngang' ? 'Ngang' : 'Dọc'}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Tên file = trạng thái: <code className="text-slate-400">binhthuong.mp4</code>, <code className="text-slate-400">vui.mp4</code>, <code className="text-slate-400">con_buon.mp4</code>
                          </p>
                        </div>
                        <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm text-white
                          ${videoOrientTab === 'ngang' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-violet-600 hover:bg-violet-500'}`}>
                          <input type="file" accept="video/*" multiple className="hidden" onChange={e => handleUploadNVVideos(e, videoOrientTab)} />
                          {uploadingNVField === `${videoOrientTab}_batch` ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                          Upload nhiều video
                        </label>
                      </div>

                      {/* Preview grid */}
                      {Object.entries(editingNV?.assets?.[videoOrientTab] || {}).length > 0 ? (
                        <div className={`grid gap-3 ${videoOrientTab === 'ngang' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-3 md:grid-cols-4'}`}>
                          {Object.entries(editingNV.assets[videoOrientTab]).map(([state, url]: [string, any]) => (
                            <div key={state} className="bg-slate-900 rounded-xl overflow-hidden border border-white/5 group relative">
                              <div className={`${videoOrientTab === 'ngang' ? 'aspect-video' : 'aspect-[9/16]'} bg-slate-950 overflow-hidden`}>
                                <video src={url} muted playsInline className="w-full h-full object-cover"
                                  onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                                  onMouseLeave={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }} />
                              </div>
                              <div className="px-2.5 py-2 flex items-center justify-between border-t border-white/5">
                                <span className="text-[11px] font-bold text-slate-200">
                                  {(() => {
                                    const baseState = state.replace(/_\d+$/, '');
                                    const dict = characterStatesMap.find((d: any) => d.id === baseState);
                                    return dict ? <>{dict.name} <span className="text-slate-500 font-normal ml-1">({state})</span></> : state;
                                  })()}
                                </span>
                                <button onClick={() => deleteVideoState(videoOrientTab, state)}
                                  className="text-rose-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-slate-600 text-xs border border-dashed border-white/5 rounded-xl">
                          <Film size={28} className="mx-auto mb-2 text-slate-800" />
                          Chưa có video {videoOrientTab}. Upload nhiều file cùng lúc.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cấu hình Nhân vật liên kết */}
                  <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Users size={14} /> Nhân vật liên kết
                        </h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">Thêm các nhân vật liên kết đi kèm với nhân vật này</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingNV((prev: any) => ({
                            ...prev,
                            linkedCharsList: [
                              ...(prev.linkedCharsList || []),
                              { id: 'nv_linked_temp_' + Date.now(), name: '', assets: { ngang: {}, doc: {} } }
                            ]
                          }));
                        }}
                        className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-xl text-xs font-bold border border-indigo-500/30 flex items-center gap-1 transition-all"
                      >
                        <Plus size={12} /> Thêm nhân vật liên kết
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {(editingNV.linkedCharsList || []).map((item: any, idx: number) => (
                        <div key={item.id} className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl flex flex-col gap-4 relative group">
                          {/* Remove button */}
                          <button 
                            type="button"
                            onClick={() => {
                              setEditingNV((prev: any) => ({
                                ...prev,
                                linkedCharsList: prev.linkedCharsList.filter((x: any) => x.id !== item.id)
                              }));
                            }}
                            className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors"
                            title="Xóa liên kết này"
                          >
                            <Trash2 size={14} />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tên nhân vật liên kết */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-slate-400 font-bold uppercase">Tên nhân vật liên kết #{idx + 1}</label>
                              <input 
                                type="text" 
                                value={item.name} 
                                onChange={e => {
                                  const val = e.target.value;
                                  setEditingNV((prev: any) => {
                                    const list = prev.linkedCharsList.map((x: any) => {
                                      if (x.id === item.id) return { ...x, name: val };
                                      return x;
                                    });
                                    return { ...prev, linkedCharsList: list };
                                  });
                                }}
                                placeholder="VD: Lão Vui, Lão Sỏi..." 
                                className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 text-white" 
                              />
                            </div>

                            {/* Upload area */}
                            <div className="flex flex-col gap-1.5 justify-end">
                              <label className="text-[10px] text-slate-400 font-bold uppercase">Upload video {videoOrientTab === 'ngang' ? 'Ngang' : 'Dọc'} liên kết</label>
                              <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl text-xs font-bold cursor-pointer text-white transition-colors h-[38px]">
                                <input 
                                  type="file" 
                                  accept="video/*" 
                                  multiple 
                                  className="hidden" 
                                  onChange={async (e) => {
                                    const files = Array.from(e.target.files || []);
                                    if (!files.length) return;
                                    setUploadingNVField(`linked_${item.id}_${videoOrientTab}`);
                                    const uploadedAssets: any = {};
                                    for (const file of files) {
                                      const state = parseStateName(file.name);
                                      const url = await doUpload(file);
                                      if (url) {
                                        uploadedAssets[state] = url;
                                      }
                                    }
                                    setEditingNV((prev: any) => {
                                      const list = prev.linkedCharsList.map((x: any) => {
                                        if (x.id === item.id) {
                                          const currentOrientAssets = x.assets?.[videoOrientTab] || {};
                                          return {
                                            ...x,
                                            assets: {
                                              ...x.assets,
                                              [videoOrientTab]: { ...currentOrientAssets, ...uploadedAssets }
                                            }
                                          };
                                        }
                                        return x;
                                      });
                                      return { ...prev, linkedCharsList: list };
                                    });
                                    setUploadingNVField('');
                                    e.target.value = '';
                                  }} 
                                />
                                {uploadingNVField === `linked_${item.id}_${videoOrientTab}` ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                Tải video lên cho {item.name || `nhân vật #${idx + 1}`}
                              </label>
                            </div>
                          </div>

                          {/* Preview Grid cho nhân vật liên kết này */}
                          {Object.entries(item.assets?.[videoOrientTab] || {}).length > 0 ? (
                            <div className={`grid gap-2 mt-2 ${videoOrientTab === 'ngang' ? 'grid-cols-3 md:grid-cols-4' : 'grid-cols-4 md:grid-cols-5'}`}>
                              {Object.entries(item.assets[videoOrientTab]).map(([state, url]: [string, any]) => (
                                <div key={state} className="bg-slate-900 rounded-lg overflow-hidden border border-white/5 relative group/card">
                                  <div className={`${videoOrientTab === 'ngang' ? 'aspect-video' : 'aspect-[9/16]'} bg-slate-950 overflow-hidden`}>
                                    <video src={url} muted playsInline className="w-full h-full object-cover"
                                      onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                                      onMouseLeave={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }} />
                                  </div>
                                  <div className="px-2 py-1.5 flex items-center justify-between border-t border-white/5">
                                    <span className="text-[10px] font-bold text-slate-300">
                                      {(() => {
                                        const baseState = state.replace(/_\d+$/, '');
                                        const dict = characterStatesMap.find((d: any) => d.id === baseState);
                                        return dict ? dict.name : state;
                                      })()}
                                    </span>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        setEditingNV((prev: any) => {
                                          const list = prev.linkedCharsList.map((x: any) => {
                                            if (x.id === item.id) {
                                              const orient = { ...(x.assets?.[videoOrientTab] || {}) };
                                              delete orient[state];
                                              return { ...x, assets: { ...x.assets, [videoOrientTab]: orient } };
                                            }
                                            return x;
                                          });
                                          return { ...prev, linkedCharsList: list };
                                        });
                                      }}
                                      className="text-rose-500 hover:text-rose-400 opacity-0 group-hover/card:opacity-100 transition-opacity"
                                    >
                                      <X size={11} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-slate-600 text-[10px] border border-dashed border-white/5 rounded-xl">
                              Chưa có video {videoOrientTab} cho nhân vật liên kết này.
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer buttons */}
                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                    {canhQuays.some((v: any) => v.id === editingNV.id) ? (
                      <button onClick={() => { const nl = canhQuays.filter((v: any) => v.id !== editingNV.id); saveCanhQuays(nl); setEditingNV(null); }}
                        className="px-4 py-2 text-rose-500 hover:bg-rose-500/10 rounded-xl font-bold text-xs flex items-center gap-1.5">
                        <Trash2 size={14} /> Xóa nhân vật
                      </button>
                    ) : <div />}
                    <div className="flex gap-3">
                      <button onClick={() => setEditingNV(null)} className="px-5 py-2 rounded-xl text-slate-400 hover:text-white font-bold">Hủy</button>
                      <button onClick={handleSaveNV} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-1.5">
                        <Save size={16} /> Lưu nhân vật
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ─── Danh sách Nhân Vật ─── */
                <div className="flex flex-col gap-5 animate-in fade-in">
                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kho cảnh quay ({canhQuays.length})</span>
                      {canhQuays.length > 0 && (() => {
                        const NV_PER_PAGE = nvPerPage;
                        const totalNvPages = Math.ceil(canhQuays.length / NV_PER_PAGE);
                        const currentPage = Math.min(nvPage, totalNvPages || 1);
                        const paginatedCanhQuays = canhQuays.slice((currentPage - 1) * NV_PER_PAGE, currentPage * NV_PER_PAGE);
                        const paginatedIds = paginatedCanhQuays.map(v => v.id);
                        const allSelected = paginatedIds.length > 0 && paginatedIds.every(id => selectedNvIds.includes(id));
                        return (
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-500 cursor-pointer select-none mt-1">
                            <input 
                              type="checkbox" 
                              checked={allSelected} 
                              onChange={() => handleToggleSelectAllNv(paginatedIds)}
                              className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                            />
                            Chọn tất cả
                          </label>
                        );
                      })()}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedNvIds.length > 0 && (
                        <button onClick={handleBatchDeleteNv}
                          className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/20 font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md">
                          <Trash2 size={13} /> Xóa {selectedNvIds.length} đã chọn
                        </button>
                      )}
                      <button onClick={() => { setEditingNV({ id: 'nv_' + Date.now(), name: '', assets: { ngang: {}, doc: {} }, linkedCharsList: [], linkedIds: [] }); setVideoOrientTab('ngang'); }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg">
                        <Plus size={14} /> Thêm nhân vật
                      </button>
                    </div>
                  </div>

                  {canhQuays.length === 0 ? (
                    <div className="text-center py-24 text-slate-500 border border-dashed border-white/5 rounded-2xl">
                      <Users size={36} className="mx-auto mb-3 text-slate-700" />
                      <p className="text-sm font-semibold">Chưa có nhân vật nào</p>
                      <p className="text-xs text-slate-600 mt-1">Mỗi nhân vật có video theo trạng thái (bình thường, vui, buồn...)</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {(() => {
                        const NV_PER_PAGE = nvPerPage;
                        const totalNvPages = Math.ceil(canhQuays.length / NV_PER_PAGE);
                        // Make sure current page is in bounds
                        const currentPage = Math.min(nvPage, totalNvPages || 1);
                        const paginatedCanhQuays = canhQuays.slice((currentPage - 1) * NV_PER_PAGE, currentPage * NV_PER_PAGE);
                        return (
                          <>
                            {paginatedCanhQuays.map((nv: any, idx: number) => {
                              const ngangAssets = typeof nv.assetsNgang === 'string' ? JSON.parse(nv.assetsNgang || '{}') : (nv.assetsNgang || {});
                              const docAssets = typeof nv.assetsDoc === 'string' ? JSON.parse(nv.assetsDoc || '{}') : (nv.assetsDoc || {});
                              const ngangCount = Object.keys(ngangAssets).length;
                              const docCount   = Object.keys(docAssets).length;
                              const previewUrl = Object.values(ngangAssets)[0] || Object.values(docAssets)[0];
                              const allStates = [...Object.keys(ngangAssets), ...Object.keys(docAssets)].filter((v, i, a) => a.indexOf(v) === i);
                              const isSelected = selectedNvIds.includes(nv.id);
                              return (
                                <div key={nv.id} className={`bg-slate-900/60 border rounded-2xl p-3.5 flex items-center justify-between transition-all group ${isSelected ? 'border-indigo-500 bg-indigo-950/10' : 'border-white/5 hover:border-indigo-500/30'}`}>
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    {/* Checkbox chọn */}
                                    <input 
                                      type="checkbox" 
                                      checked={isSelected} 
                                      onChange={() => handleToggleSelectNv(nv.id)}
                                      className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-0 cursor-pointer w-4 h-4 shrink-0 mr-1"
                                    />
                                    {/* Số thứ tự */}
                                    <span className="text-xs text-slate-500 font-mono w-6 text-right shrink-0 pr-1.5">
                                      {(currentPage - 1) * NV_PER_PAGE + idx + 1}.
                                    </span>
                                    {/* Small thumbnail preview */}
                                    <div className="w-12 h-12 bg-slate-950 rounded-xl overflow-hidden border border-white/5 shrink-0 flex items-center justify-center relative">
                                      <CharacterThumbnail previewUrl={previewUrl} />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2.5 flex-wrap">
                                        <p className="font-bold text-slate-100 text-sm leading-none">{nv.name}</p>
                                        <div className="flex gap-1.5">
                                          {ngangCount > 0 && <span className="text-[9px] bg-indigo-950/50 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-lg font-bold">{ngangCount} ngang</span>}
                                          {docCount > 0   && <span className="text-[9px] bg-violet-950/50 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-lg font-bold">{docCount} dọc</span>}
                                        </div>
                                      </div>
                                      <div className="flex gap-1 mt-2 flex-wrap">
                                        {allStates.map(state => (
                                          <span key={state} className="text-[8px] bg-slate-950 border border-white/5 text-slate-400 px-2 py-0.5 rounded font-mono">{state}</span>
                                        ))}
                                        {allStates.length === 0 && <span className="text-[8px] text-slate-600">Chưa có video</span>}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={() => startEditCanhQuay(nv)} title="Chỉnh sửa nhân vật"
                                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-white/5 transition-all">
                                      <Edit3 size={12} />
                                    </button>
                                    <button onClick={() => { if(confirm(`Xác nhận xóa nhân vật ${nv.name}?`)) { const nl = canhQuays.filter((v: any) => v.id !== nv.id); saveCanhQuays(nl); } }} title="Xóa nhân vật"
                                      className="p-2 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-xl border border-white/5 transition-all">
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Phân trang & Số dòng */}
                            {canhQuays.length > 0 && (
                              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5 mt-4">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <span>Hiện số dòng:</span>
                                  <select 
                                    value={nvPerPage} 
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      setNvPerPage(val);
                                      setNvPage(1);
                                    }}
                                    className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-slate-200 outline-none cursor-pointer hover:border-indigo-500/50 transition-colors"
                                  >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                  </select>
                                </div>
                                
                                {totalNvPages > 1 && (
                                  <div className="flex justify-center items-center gap-1.5">
                                    <button disabled={currentPage === 1} onClick={() => setNvPage(prev => Math.max(prev - 1, 1))}
                                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 rounded-lg border border-white/5 transition-all mr-1">
                                      <ChevronLeft size={14} />
                                    </button>
                                    {Array.from({ length: totalNvPages }, (_, i) => i + 1).map(p => (
                                      <button 
                                        key={p} 
                                        onClick={() => setNvPage(p)}
                                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                          currentPage === p 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
                                        }`}
                                      >
                                        {p}
                                      </button>
                                    ))}
                                    <button disabled={currentPage === totalNvPages} onClick={() => setNvPage(prev => Math.min(prev + 1, totalNvPages))}
                                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 rounded-lg border border-white/5 transition-all ml-1">
                                      <ChevronRight size={14} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'kho_ke_phap' && (
            <div className="flex flex-col gap-5 h-[82vh]">
              {/* SUB-TABS */}
              <div className="flex bg-slate-950 shrink-0 rounded-xl overflow-hidden p-1 gap-1 border border-white/5 w-full">
                <button 
                  onClick={() => setKePhapSubTab('poems')} 
                  className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
                    kePhapSubTab === 'poems' 
                      ? 'bg-emerald-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  Kho Kệ Pháp
                </button>
                <button 
                  onClick={() => setKePhapSubTab('greetings')} 
                  className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
                    kePhapSubTab === 'greetings' 
                      ? 'bg-orange-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  Mào đầu (Tiếp đón)
                </button>
                <button 
                  onClick={() => setKePhapSubTab('rag')} 
                  className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
                    kePhapSubTab === 'rag' 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  Kho Trí Tuệ
                </button>
              </div>

              {/* CONTENTS */}
              <div className="flex-1 min-h-0 bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden p-2">
                <OngLaoProvider value={poemContextValue}>
                  <PoemVaultModal isAdminMode={true} inline={true} />
                </OngLaoProvider>
              </div>
            </div>
          )}
          {/* ─── TAB TRẠNG THÁI NHÂN VẬT ─── */}
          {activeTab === 'trang_thai' && (
            <div className="flex flex-col gap-5 animate-in fade-in">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Từ điển trạng thái ({characterStatesMap.length})</span>
                <button onClick={() => setIsAddingState(true)}
                  className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg">
                  <Plus size={14} /> Thêm trạng thái
                </button>
              </div>

              {isAddingState && (
                <div className="flex gap-2 p-3 bg-slate-900 border border-pink-500/30 rounded-xl mb-4">
                  <input type="text" value={editingStateId} onChange={e => setEditingStateId(e.target.value)} placeholder="Mã ID (vd: khoc, con_vui)" className="flex-1 bg-slate-950 border border-white/10 text-white p-2 rounded-lg text-xs outline-none" />
                  <input type="text" value={editingStateName} onChange={e => setEditingStateName(e.target.value)} placeholder="Tên tiếng Việt (vd: Khóc, Vui vẻ)" className="flex-1 bg-slate-950 border border-white/10 text-white p-2 rounded-lg text-xs outline-none" />
                  <button onClick={handleAddState} className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-lg text-xs">Lưu</button>
                  <button onClick={() => setIsAddingState(false)} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg text-xs">Hủy</button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {characterStatesMap.map((st: any) => (
                  <div key={st.id} className="bg-slate-900 border border-white/5 rounded-xl p-4 flex justify-between items-center hover:border-pink-500/30 transition-all">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-pink-100">{st.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-1">ID: {st.id}</span>
                    </div>
                    <button onClick={() => handleDeleteState(st.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {characterStatesMap.length === 0 && (
                  <div className="col-span-full text-center py-10 text-slate-500 border border-dashed border-white/5 rounded-xl">
                    Chưa có từ điển trạng thái nào. Hãy thêm mã trạng thái trùng khớp với tên file video.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}


