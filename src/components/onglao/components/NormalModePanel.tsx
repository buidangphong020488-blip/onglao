// @ts-nocheck
"use client";
import React from "react";
import { Check, Loader2, XCircle, Info, Smile, Mic, Send, BookOpen, Film, Video, FileText, Sparkles, Sliders, Save, Maximize, Minimize, RefreshCw, X, ChevronDown, Archive, Volume2, Share as ShareIcon, Copy, Plus, Compass, Clock, SlidersHorizontal, Settings2, ShieldAlert, History, Edit, KeyRound, UserCheck, Play, Pause, Power, MessageSquare, Bot, HelpCircle, Activity, ArrowRight, Camera, Cloud, Download, FlipHorizontal, Image as ImageIcon, ListOrdered, Menu, MicOff, Music, Pencil, Pin, PlayCircle, RotateCcw, Smartphone, StopCircle, ThumbsDown, ThumbsUp, Trash2, Users, Volume1, VolumeX, Wand2, ChevronLeft, Home, Eye, Terminal } from "lucide-react";
import MiniLaoFace from "./MiniLaoFace";
import AuthModal from "@/components/AuthModal";
import CombinedScriptModal from "./CombinedScriptModal";
import AiDirectorManagerModal from "./AiDirectorManagerModal";
import PoemVaultModal from "./PoemVaultModal";
import VideoCreatorModal from "./VideoCreatorModal";
import SessionsSidebar from "./SessionsSidebar";
import CharacterStage from "./CharacterStage";
import ChatHistorySidebar from "./ChatHistorySidebar";



// Component tự quản lý timer 1 giây - chỉ nó re-render, không ảnh hưởng NormalModePanel
const IdleTimerDisplay = () => {
    const [secs, setSecs] = React.useState(0);
    React.useEffect(() => {
        const t = setInterval(() => setSecs(s => s + 1), 1000);
        return () => clearInterval(t);
    }, []);
    const mm = Math.floor(secs / 60).toString().padStart(2, '0');
    const ss = (secs % 60).toString().padStart(2, '0');
    return (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono bg-slate-900/50 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
            Thời gian tĩnh tâm: <span className="text-emerald-400 font-bold">{mm}:{ss}</span>
        </div>
    );
};

// IsolatedChatInputBar: Component thanh gõ tin nhắn cô lập hoàn toàn - dùng inputRef cho tốc độ gõ native 0ms 
const IsolatedChatInputBar = ({
  inputText,
  handleSendMessage,
  handleRefineInput,
  isRefining,
  toggleMic,
  isRecording,
  toggleCamera,
  cameraOn,
  fileInputRef,
  handleImageUpload,
  selectedImage,
  setSelectedImage,
  isVoiceEnabled,
  setIsVoiceEnabled,
  showToastMsg
}: any) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const localFileInputRef = React.useRef<HTMLInputElement>(null);
  const activeFileInputRef = fileInputRef || localFileInputRef;
  const [emotion, setEmotion] = React.useState('calm');

  const [internalVoiceEnabled, setInternalVoiceEnabled] = React.useState(
    isVoiceEnabled !== undefined ? isVoiceEnabled : true
  );

  React.useEffect(() => {
    if (isVoiceEnabled !== undefined) {
      setInternalVoiceEnabled(isVoiceEnabled);
    }
  }, [isVoiceEnabled]);

  const toggleVoice = () => {
    const nextState = !internalVoiceEnabled;
    setInternalVoiceEnabled(nextState);
    if (typeof setIsVoiceEnabled === 'function') {
      setIsVoiceEnabled(nextState);
    }
    if (typeof showToastMsg === 'function') {
      showToastMsg(
        nextState ? 'Đã BẬT giọng đọc tự động của Lão' : 'Đã TẮT giọng đọc tự động của Lão', 
        nextState ? 'success' : 'warning'
      );
    }
  };

  const [localCameraOn, setLocalCameraOn] = React.useState(false);
  const activeCameraOn = cameraOn !== undefined ? cameraOn : localCameraOn;
  const activeToggleCamera = toggleCamera || (async () => { setLocalCameraOn(prev => !prev); });

  React.useEffect(() => {
    if (inputRef.current && inputText !== undefined) {
      inputRef.current.value = inputText || '';
    }
  }, [inputText]);

  const onSend = () => {
    const textVal = inputRef.current?.value || '';
    if (!textVal.trim() && !selectedImage) {
      if (typeof showToastMsg === 'function') {
        showToastMsg('Vui lòng gõ nội dung thưa thỉnh hoặc chọn ảnh!', 'info');
      }
      return;
    }
    if (typeof handleSendMessage === 'function') {
      handleSendMessage(textVal, emotion);
    }
    if (inputRef.current) inputRef.current.value = '';
    setEmotion('calm');
  };

  const onRefine = async () => {
    const textVal = inputRef.current?.value || '';
    if (!textVal.trim()) {
      if (typeof showToastMsg === 'function') {
        showToastMsg('Vui lòng gõ nội dung câu hỏi để Lão giúp con tinh lọc cốt lõi!', 'info');
      }
      return;
    }
    if (typeof handleRefineInput === 'function') {
      const refined = await handleRefineInput(textVal);
      if (refined && inputRef.current) {
        inputRef.current.value = refined;
      }
    }
  };

  const onFileChange = (e: any) => {
    if (typeof handleImageUpload === 'function') {
      handleImageUpload(e);
    } else {
      const file = e.target.files?.[0];
      if (file && typeof setSelectedImage === 'function') {
        const reader = new FileReader();
        reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const onMicClick = async () => {
    if (typeof toggleMic === 'function') {
      toggleMic();
    } else {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(t => t.stop());
          if (typeof showToastMsg === 'function') {
            showToastMsg('Đã cho phép quyền Micro!', 'success');
          }
        } catch (e) {
          if (typeof showToastMsg === 'function') {
            showToastMsg('Vui lòng CHO PHÉP (Allow) sử dụng Micro trên trình duyệt!', 'warning');
          }
        }
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 md:pb-6 flex flex-col items-center z-[80] bg-gradient-to-t from-[#020617] to-transparent pointer-events-none">
      {selectedImage && (
        <div className="mb-3 relative animate-in slide-in-from-bottom-2 pointer-events-auto">
          <img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border-2 border-orange-500 shadow-lg" />
          <button onClick={() => typeof setSelectedImage === 'function' && setSelectedImage(null)} className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1 shadow-lg hover:scale-110 transition-all">
            <X size={10} />
          </button>
        </div>
      )}
      
      <IdleTimerDisplay />

      <div className="bg-slate-900/95 backdrop-blur-3xl border border-white/5 rounded-full p-1.5 md:p-2 flex items-center gap-2 shadow-2xl w-full max-w-xl overflow-hidden relative mt-1 pointer-events-auto">
        <button data-tutorial="tut-mic" onClick={onMicClick} className={`p-6 md:p-6 rounded-full transition-all transform active:scale-95 relative cursor-pointer ${isRecording ? 'bg-rose-500 text-white shadow-[0_0_40px_rgba(244,63,94,0.7)] scale-110' : 'bg-slate-800 text-slate-400 hover:text-rose-400'}`} title="Thưa hỏi Lão">
          <div className={`absolute inset-0 rounded-full border-[6px] border-rose-500/30 ${!isRecording ? 'animate-ping opacity-60' : ''}`}></div>
          <div className={`absolute inset-0 rounded-full bg-rose-500/10 ${!isRecording ? 'animate-pulse' : ''}`}></div>
          {isRecording ? <MicOff size={32} className="relative z-10" /> : <Mic size={32} className="relative z-10" />}
        </button>
        <button onClick={activeToggleCamera} className={`p-3 rounded-full transition-all cursor-pointer ${activeCameraOn ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 hover:text-white'}`} title="Mở tầm nhìn">
          <Camera size={18} />
        </button>
        <button onClick={() => activeFileInputRef.current?.click()} className="p-3 rounded-full bg-slate-800 text-slate-500 hover:text-white transition-all cursor-pointer" title="Gửi ảnh">
          <ImageIcon size={18} />
          <input type="file" ref={activeFileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />
        </button>
        <div data-tutorial="tut-input" className="flex items-center bg-slate-800/40 rounded-full px-2 py-2 flex-1 md:w-[260px] border border-white/5 focus-within:border-orange-500/30 shadow-inner relative">
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Con muốn thưa thỉnh..." 
            className="bg-transparent border-none outline-none flex-1 text-[11px] md:text-sm font-medium placeholder:text-slate-600 text-white min-w-0 pr-8" 
            defaultValue={inputText || ''} 
            onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    onSend();
                }
            }} 
          />
          <button 
            data-tutorial="tut-refine" 
            onClick={onRefine} 
            disabled={isRefining} 
            title="✨ Tinh lọc cốt lõi (Gỡ rối tơ lòng)" 
            className={`absolute right-10 p-1.5 transition-all text-amber-400 hover:scale-110 cursor-pointer`}
          >
            {isRefining ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Sparkles size={16} />}
          </button>
          <button 
            onClick={onSend} 
            className={`p-1.5 transition-all mr-1 text-orange-400 scale-110 cursor-pointer hover:text-orange-300`}
            title="Gửi tin nhắn"
          >
            <Send size={16} />
          </button>
        </div>
        <button 
          onClick={toggleVoice} 
          className={`p-3 rounded-full transition-all cursor-pointer flex items-center justify-center relative ${
            internalVoiceEnabled 
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30' 
              : 'bg-rose-950/60 text-rose-400 border border-rose-500/50 hover:bg-rose-900/60 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
          }`} 
          title={internalVoiceEnabled ? 'Đang BẬT giọng đọc tự động (Nhấp để Tắt)' : 'Đang TẮT giọng đọc tự động (Nhấp để Bật)'}
        >
          {internalVoiceEnabled ? (
            <Volume1 size={18} className="text-emerald-400" />
          ) : (
            <VolumeX size={18} className="text-rose-400" />
          )}
        </button>
      </div>

    </div>
  );
};

// NormalModePanel: Giao diện thiền đường chế độ Normal Mode
const NormalModePanel = (props?: { p?: any }) => {
  const p = props?.p || {};
  const {
      EMOTIONS = {}, TUTORIAL_STEPS = [], activationCode = '', activationError = '', aiLaoStyle, aiScriptLength, aiTopicText,
      aiUserEmotionArc, allCharacters = [], apSettings, apState, apTopics, appId, appLanguage, applyCharacterPreset,
      backupFileInputRef, backupOptions, backupProgress, batchAIMeaningProgress, batchGreetingProgress, batchMeaningProgress, batchPoemProgress, cameraOn,
      cancelVideoExport, charOffsets = { lao: { flip: false } }, chatEndRef, chatLaoDragInfo, chatLaoTransform = { x: -4, y: 164, s: 1.8 }, chatLaoVideos, confirmDialog = { isOpen: false, message: '', onConfirm: null }, copyToClipboard,
      creatingVoices = {}, currentLaoPresetId, currentSession, currentSessionId, currentUser, currentlyPlayingId, customLaoName, customUserName,
      diagnosticReport, downloadAllAudios, downloadAudio, downloadCombinedAudio, editSessionTitle, editingEmotionId, editingId, editingSessionId,
      enableAutoHarmonization, endTutorial, executeFullBackup, executeSaveFfPack, exportTab, fileInputRef, formatTime, generateVoice,
      generatingDoubtId, generatingGreetings, generatingMeanings, generatingStanzas, globalCurrentTime, globalDuration, globalProgress, greetingAudioUrls,
      greetingSearch, greetingsDb, handleAddTag, handleBatchGenerateAIMeaningsText, handleBatchGenerateGreetings, handleBatchGenerateMeanings, handleBatchGenerateStanzas, handleChangeChatLao,
      handleChatLaoPointerDown, handleChatLaoPointerMove, handleChatLaoPointerUp, handleChatLaoWheel, handleConnectOldLink, handleCreateSession, handleDeleteSession, handleDownloadAllPoemAudios,
      handleDownloadVideo, handleEnterApp, handleExportFullBackupClick, handleExportPoemDatabaseCode, handleFetchTrendingTopics, handleGenerateAIMeaningText, handleGenerateAITopic, handleGenerateDoubt,
      handleGenerateGreetingVoice, handleGenerateMeaningVoice, handleGenerateScriptVoices, handleGenerateStanzaVoice, handleGlobalSeek, handleImageUpload, handleImportFullBackup, handleImportPoemJson,
      handleImportScript, handleImportTxtPoem, handleLogin, handleLogout, handlePlayStanzaVoice, handlePushSourceToCloud, handleRefineInput, handleRemoveTag,
      handleSaveEdit, handleSaveMeaningVoice, handleSaveStanzaVoice, handleSendMessage, handleShareVideoSocial, handleStopCorrecting, handleSummarizeSession, handleSyncFromCloud,
      handleUpdateGreetingText, handleUpdatePoemContent, handleUpdatePoemMeaning, harmonizeSettings, hasEntered, importMode, importPoemJson,
      inputText, isBatchGeneratingAIMeanings, isBatchGeneratingAIMeaningsRef, isBatchGeneratingGreetings, isBatchGeneratingGreetingsRef, isBatchGeneratingMeanings, isBatchGeneratingMeaningsRef, isBatchGeneratingPoems,
      isBatchGeneratingPoemsRef, isCloudSyncing, isExportingVideo, isFetchingCloudAudio, isGeneratingAIMeaning, isGeneratingAITopic, isGlobalPlaying, isLaoSpeakingSession,
      isLoadingRag, isLoggedIn, isPreparingGlobal, isPreviewFullscreen, isProcessingBackup, isRecording, isRefining, isRegeneratingAll,
      isSubscribed, isUploadingAudios, isVideoFullscreen, isVoiceEnabled, laoAppearance, laoCallUser, laoChromaSettings, laoSelfCall,
      laoShadow, laoVisualType, laoVoice, laoVoiceStyle, messages = [], mouthOpen, newTagInputs, nextTutorialStep,
      oldLinkInput, openDropdown, outroText, playVoice, poemDatabase = [], poemModalTab, poemSearch, processedLaoImages,
      publicAis = [], publicSettings, ragDb, ragSearch, refreshRagFromGiacNgo, regenerationComplete, regenerationProgress, renderedVideoUrl,
      resetVideoExport, resolveGreetingAudioUrl, resolveMeaningAudioUrl, resolveStanzaAudioUrl, savePackData, savePoemDatabase, saveSessionTitle, scriptText,
      selectedAiConfigId, selectedImage, sessions = [], setSessions, setActivationCode, setActivationError, setAiLaoStyle, setAiScriptLength, setAiTopicText,
      setAiUserEmotionArc, setApSettings, setApTopics, setAppLanguage, setBackupOptions, setCharOffsets, setChatLaoTransform, setConfirmDialog,
      setCurrentSessionId, setCurrentlyPlayingId, setCustomLaoName, setCustomUserName, setEditSessionTitle, setEditingEmotionId, setEditingId, setEditingSessionId,
      setExportTab, setGreetingSearch, setHasEntered, setImportMode, setImportPoemJson, setInputText, setIsBatchGeneratingAIMeanings, setIsBatchGeneratingGreetings,
      setIsBatchGeneratingMeanings, setIsBatchGeneratingPoems, setIsLiveMode, setIsSubscribed, setIsVideoFullscreen, setIsVoiceEnabled, setLaoCallUser, setLaoIsFullScreen,
      setLaoSelfCall, setLaoVoice, setLaoVoiceStyle, setNewTagInputs, setOldLinkInput, setOpenDropdown, setOutroText, setPoemDatabase,
      setPoemModalTab, setPoemSearch, setRagSearch, setSavePackData, setScriptText, setSelectedAiConfigId, setSelectedImage, setShowAITopicModal,
      setShowAuthModal, setShowAutoPilotModal, setShowBackupOptionsModal, setShowChatLaoControls, setShowDiagnostics, setShowDownloadMenu, setShowHistory, setShowImportPoemModal,
      setShowLaoAura, setShowOldLinkModal, setShowPaymentModal, setShowPoemModal, setShowSavePackModal, setShowScriptModal, setShowSessions, setShowShareMenu,
      setShowUserGuide, setShowVideoExportModal, setTempEditText, setUserAge, setUserCallLao, setUserGender, setUserSelfCall, setUserVoice,
      setUserVoiceStyle, setVideoResolution, shareCombinedAudioFile, shareTextContent, showAITopicModal, showAuthModal, showAutoPilotModal, showBackupOptionsModal,
      showChatLaoControls, showDownloadMenu, showHistory, showImportPoemModal, showLaoAura, showOldLinkModal, showPaymentModal, showPoemModal,
      showSavePackModal, showScriptModal, showSessions, showShareMenu, showToastMsg, showTutorial, showUserGuide, showVideoExportModal,
      showAiManager, setShowAiManager, autoPilotSubTab, setAutoPilotSubTab, batchJobsList,
      startAutoPilot, startVideoExport, stopAutoPilot, targetRect, tempEditText, toast = { show: false, message: '', type: 'info' }, toggleCamera, toggleFullscreen,
      toggleGlobalPlay, toggleMic, togglePin, toggleReaction, tutorialStep, txtPoemFileInputRef, updateCurrentMessages, uploadAudioProgress,
      user, userAge, userCallLao, userGender, userSelfCall, userVoice, userVoiceStyle, videoResolution,
      playTopicAudio, generateMissingBatchAudios, renderMissingBatchVideos
  } = p;

  const [localInputText, setLocalInputText] = React.useState(inputText || '');
  const [inputEmotion, setInputEmotion] = React.useState('calm');
  const [showEmotionMenu, setShowEmotionMenu] = React.useState(false);
  const [localShowAuthModal, setLocalShowAuthModal] = React.useState(false);
  const [internalAutoPilotTab, setInternalAutoPilotTab] = React.useState<'create' | 'history'>('create');
  const [expandedTerminalJobId, setExpandedTerminalJobId] = React.useState<string | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = React.useState<string | null>(null);
  const [previewVideoTitle, setPreviewVideoTitle] = React.useState<string>('');
  const [videoCurrentTime, setVideoCurrentTime] = React.useState(0);
  const [videoDuration, setVideoDuration] = React.useState(0);
  const [previewScriptSentences, setPreviewScriptSentences] = React.useState<any[]>([]);
  const [batchPage, setBatchPage] = React.useState(1);
  const [batchPageSize, setBatchPageSize] = React.useState(5);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'history') {
        setInternalAutoPilotTab('history');
      }
    }
  }, []);

  const activeSubTab = internalAutoPilotTab;
  const changeSubTab = (tab: 'create' | 'history') => {
    setInternalAutoPilotTab(tab);
    if (typeof setAutoPilotSubTab === 'function') setAutoPilotSubTab(tab);
    if (typeof p?.setAutoPilotSubTab === 'function') p.setAutoPilotSubTab(tab);
  };
  
  React.useEffect(() => {
    setLocalInputText(inputText || '');
  }, [inputText]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOpenModal = () => setShowAiManager(true);
      window.addEventListener('openAiDirectorModal', handleOpenModal as any);
      return () => window.removeEventListener('openAiDirectorModal', handleOpenModal as any);
    }
  }, []);

  return (
    <div className="flex h-[100dvh] min-h-[100dvh] w-full bg-[#020617] text-slate-100 overflow-hidden font-sans select-none relative animate-in fade-in duration-700">
      
      {/* MÀN HÌNH TOAST THÔNG BÁO */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-top-5 duration-300 ${toast.type === 'success' ? 'bg-emerald-900/90 border border-emerald-500/50 text-emerald-400' : toast.type === 'loading' ? 'bg-indigo-900/90 border border-indigo-500/50 text-indigo-400' : toast.type === 'error' ? 'bg-rose-900/90 border border-rose-500/50 text-rose-400' : 'bg-slate-900/90 border border-white/10 text-white'}`}>
          {toast.type === 'success' && <Check size={18} />}
          {toast.type === 'loading' && <Loader2 size={18} className="animate-spin" />}
          {toast.type === 'error' && <XCircle size={18} />}
          <span className="text-sm font-medium tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* MODAL XÁC NHẬN TÙY CHỈNH (THAY THẾ WINDOW.CONFIRM) */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })}>
            <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 text-amber-400 font-bold text-lg">
                    <Info size={24} /> Xác nhận
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{confirmDialog.message}</p>
                <div className="flex justify-end gap-3 mt-2">
                    <button onClick={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })} className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white text-xs transition-colors border border-transparent hover:border-white/10">Hủy</button>
                    <button onClick={() => {
                        if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                        setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
                    }} className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-lg transition-all flex items-center gap-2">
                        <Check size={14} /> Đồng ý
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL KHO TÀNG KỆ PHÁP */}
      <PoemVaultModal p={p} />

      {/* MÀN HÌNH FULLSCREEN REVIEW VIDEO */}
      {isVideoFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col justify-center items-center">
            <button 
                onClick={() => setIsVideoFullscreen(false)} 
                className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/10 hover:bg-rose-500 text-white p-3 rounded-full transition-all z-50 backdrop-blur-md shadow-xl"
            >
                <X size={24} />
            </button>
            <video controls autoPlay src={renderedVideoUrl} className="w-full h-full object-contain" />
        </div>
      )}

      {/* MODAL QUẢN LÝ KỊCH BẢN ĐẠO DIỄN */}
      {(showAiManager || p.showAITopicModal) && (
          <AiDirectorManagerModal
              show={showAiManager || p.showAITopicModal}
              onClose={() => {
                if (setShowAiManager) setShowAiManager(false);
                if (p.setShowAITopicModal) p.setShowAITopicModal(false);
              }}
              allCharacters={allCharacters}
              sessions={sessions}
              setSessions={setSessions}
              currentSessionId={p.currentSessionId}
              setCurrentSessionId={setCurrentSessionId}
              appLanguage={appLanguage} setAppLanguage={setAppLanguage}
              customLaoName={p.customLaoName} setCustomLaoName={setCustomLaoName}
              laoSelfCall={laoSelfCall} setLaoSelfCall={setLaoSelfCall}
              laoCallUser={laoCallUser} setLaoCallUser={setLaoCallUser}
              laoVoice={laoVoice} setLaoVoice={setLaoVoice}
              laoVoiceStyle={laoVoiceStyle} setLaoVoiceStyle={setLaoVoiceStyle}
              customUserName={p.customUserName} setCustomUserName={setCustomUserName}
              userSelfCall={userSelfCall} setUserSelfCall={setUserSelfCall}
              userCallLao={userCallLao} setUserCallLao={setUserCallLao}
              userGender={userGender} setUserGender={setUserGender}
              userAge={userAge} setUserAge={setUserAge}
              userVoice={userVoice} setUserVoice={setUserVoice}
              userVoiceStyle={userVoiceStyle} setUserVoiceStyle={setUserVoiceStyle}
              aiTopicText={p.aiTopicText} setAiTopicText={p.setAiTopicText}
              aiScriptLength={p.aiScriptLength} setAiScriptLength={p.setAiScriptLength}
              aiLaoStyle={p.aiLaoStyle} setAiLaoStyle={p.setAiLaoStyle}
              aiUserEmotionArc={p.aiUserEmotionArc} setAiUserEmotionArc={p.setAiUserEmotionArc}
              aiScriptTitle={p.aiScriptTitle} setAiScriptTitle={p.setAiScriptTitle}
              aiScriptDate={p.aiScriptDate} setAiScriptDate={p.setAiScriptDate}
              onGenerate={p.handleGenerateAITopic}
              isGenerating={p.isGeneratingAITopic}
              generatedScriptText={p.generatedScriptText}
              setGeneratedScriptText={p.setGeneratedScriptText}
              onSaveGeneratedScript={p.handleSaveGeneratedScript}
              generateVoice={p.generateVoice}
              saveNewSessionWithMessages={p.saveNewSessionWithMessages}
              poemDatabase={p.poemDatabase || []}
              selectedAiConfigId={p.selectedAiConfigId || 7}
              showToastMsg={showToastMsg}
              setShowScriptModal={setShowScriptModal}
              user={user}
              currentUser={currentUser}
              setShowVideoExportModal={setShowVideoExportModal}
              setVideoExportSource={p.setVideoExportSource}
          />
      )}

      <CombinedScriptModal
        show={false}
        initialTab={showScriptModal ? 'manual' : 'ai'}
        onClose={() => { 
            setShowScriptModal(false); 
            setShowAITopicModal(false); 
            if (typeof p.setShowAITopicModal === 'function') p.setShowAITopicModal(false);
            if (typeof p.setShowScriptModal === 'function') p.setShowScriptModal(false);
            if (typeof p.setShowAiManager === 'function') p.setShowAiManager(false);
        }}
        
        scriptText={p.scriptText}
        setScriptText={p.setScriptText}
        importMode={p.importMode}
        setImportMode={p.setImportMode}
        onImport={p.handleImportScript}
        
        isGenerating={p.isGeneratingAITopic}
        appLanguage={p.appLanguage} setAppLanguage={p.setAppLanguage}
        customLaoName={p.customLaoName} setCustomLaoName={p.setCustomLaoName}
        laoSelfCall={p.laoSelfCall} setLaoSelfCall={p.setLaoSelfCall}
        laoCallUser={p.laoCallUser} setLaoCallUser={p.setLaoCallUser}
        laoVoice={p.laoVoice} setLaoVoice={p.setLaoVoice}
        laoVoiceStyle={p.laoVoiceStyle} setLaoVoiceStyle={p.setLaoVoiceStyle}
        customUserName={p.customUserName} setCustomUserName={p.setCustomUserName}
        userSelfCall={p.userSelfCall} setUserSelfCall={p.setUserSelfCall}
        userCallLao={p.userCallLao} setUserCallLao={p.setUserCallLao}
        userVoice={p.userVoice} setUserVoice={p.setUserVoice}
        userVoiceStyle={p.userVoiceStyle} setUserVoiceStyle={p.setUserVoiceStyle}
        aiTopicText={p.aiTopicText} setAiTopicText={p.setAiTopicText}
        aiScriptLength={p.aiScriptLength} setAiScriptLength={p.setAiScriptLength}
        aiLaoStyle={p.aiLaoStyle} setAiLaoStyle={p.setAiLaoStyle}
        aiUserEmotionArc={p.aiUserEmotionArc} setAiUserEmotionArc={p.setAiUserEmotionArc}
        aiScriptTitle={p.aiScriptTitle} setAiScriptTitle={p.setAiScriptTitle}
        aiScriptDate={p.aiScriptDate} setAiScriptDate={p.setAiScriptDate}
        onGenerate={p.handleGenerateAITopic}
        generatedScriptText={p.generatedScriptText}
        setGeneratedScriptText={p.setGeneratedScriptText}
        onSaveGeneratedScript={async (overrides) => {
            await p.handleSaveGeneratedScript(overrides);
            // Đóng modal sau khi lưu thành công, quay về Manager
            setShowScriptModal(false);
            setShowAITopicModal(false);
            setShowAiManager(true);
        }}
      />



      {showUserGuide && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" >
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
             <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
               <h2 className="text-lg font-black text-orange-400 flex items-center gap-3 tracking-widest"><Info size={22}/> Hướng dẫn sử dụng</h2>
               <button onClick={() => setShowUserGuide(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-full"><X size={20}/></button>
             </div>
             <div className="p-6 overflow-y-auto flex flex-col gap-6 text-sm text-slate-300 scrollbar-hide">
                <p className="text-center text-slate-400 italic mb-2">Dưới đây là các pháp khí hỗ trợ con trong quá trình thưa thỉnh cùng Lão.</p>
                <div className="flex gap-4 items-start bg-slate-800/30 p-4 rounded-2xl border border-white/5"><div className="p-3 bg-slate-800 rounded-xl text-yellow-500 shadow-lg"><Smile size={24}/></div><div><h3 className="text-white font-bold text-base mb-1">Lão khai thị</h3><p>Hình ảnh trung tâm là Lão. Lão sẽ lắng nghe, biểu lộ cảm xúc và phản chiếu ánh sáng trí tuệ giúp con nhìn thấu mộng ảo, tìm về bản thể chân thật.</p></div></div>
                <div className="flex gap-4 items-start bg-slate-800/30 p-4 rounded-2xl border border-white/5"><div className="p-3 bg-rose-500/20 rounded-xl text-rose-500 shadow-lg"><Mic size={24}/></div><div><h3 className="text-white font-bold text-base mb-1">Thưa hỏi trực tiếp (Micro)</h3><p>Nhấn vào biểu tượng Micro ở giữa để bắt đầu ghi âm giọng nói. Nếu Lão đang giảng, Lão sẽ tự động dừng lại để lắng nghe con. Nhấn lần nữa để kết thúc và gửi lời thưa.</p></div></div>
                <div className="flex gap-4 items-start bg-slate-800/30 p-4 rounded-2xl border border-white/5"><div className="p-3 bg-slate-800 rounded-xl text-orange-400 shadow-lg"><Send size={24}/></div><div><h3 className="text-white font-bold text-base mb-1">Gửi tâm thư (Gõ chữ, Ảnh)</h3><p>Con có thể gõ văn bản trực tiếp vào thanh dưới cùng và nhấn nút Gửi. Nếu cần gửi hình, hãy dùng biểu tượng Máy ảnh hoặc Bức ảnh kế bên. Chữ bị sai chính tả sẽ được hệ thống tự động sửa.</p></div></div>
                <div className="flex gap-4 items-start bg-slate-800/30 p-4 rounded-2xl border border-white/5"><div className="p-3 bg-amber-500/20 rounded-xl text-amber-500 shadow-lg"><Sparkles size={24}/></div><div><h3 className="text-white font-bold text-base mb-1">Tinh lọc cốt lõi (Ngôi sao)</h3><p>Nằm trong thanh gõ chữ. Khi cõi lòng rối rắm viết quá dài, hãy nhấn biểu tượng này để Lão giúp con đúc kết và tóm gọn lại thành 1 câu hỏi đi thẳng vào trọng tâm nhất.</p></div></div>
                <div className="flex gap-4 items-start bg-slate-800/30 p-4 rounded-2xl border border-white/5"><div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 shadow-lg"><History size={24}/></div><div><h3 className="text-white font-bold text-base mb-1">Pháp bảo khai thị (Lịch sử)</h3><p>Biểu tượng Đồng hồ góc trên bên phải. Cho phép con xem lại toàn bộ nội dung đàm đạo, đúc kết kệ pháp, xuất ra Video đàm đạo, tải file MP3 hoặc chia sẻ trọn vẹn cuộc trò chuyện.</p></div></div>
             </div>
             <div className="p-4 border-t border-white/5 text-center">
               <button onClick={() => setShowUserGuide(false)} className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold tracking-widest text-sm transition-all shadow-lg">Đã rõ khai thị</button>
             </div>
          </div>
        </div>
      )}

      {showTutorial && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <div className="fixed inset-0 pointer-events-auto" onClick={(e: any) => e.stopPropagation()} />
          {targetRect && (
            <div 
              className="absolute pointer-events-none transition-all duration-500 ease-in-out border-2 border-orange-500/50"
              style={{ top: targetRect.top, left: targetRect.left, width: targetRect.width, height: targetRect.height, borderRadius: targetRect.isRound ? '50%' : '16px', boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.85), 0 0 30px rgba(249, 115, 22, 0.4) inset' }}
            />
          )}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[320px] bg-slate-900 border border-orange-500/50 rounded-2xl p-6 shadow-2xl transition-all duration-500 flex flex-col gap-4 z-[110] pointer-events-auto animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-orange-400 font-bold tracking-wider text-xs"><Sparkles size={16} /> Hướng dẫn ({tutorialStep + 1}/{TUTORIAL_STEPS.length})</div>
              <h3 className="text-xl font-black text-white">{TUTORIAL_STEPS[tutorialStep].title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{TUTORIAL_STEPS[tutorialStep].content}</p>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <button onClick={endTutorial} className="text-slate-400 hover:text-white text-xs underline font-medium">Bỏ qua tất cả</button>
                <button onClick={nextTutorialStep} className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2">{tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Hoàn tất' : 'Đã hiểu'} <ArrowRight size={16} /></button>
              </div>
          </div>
        </div>
      )}

      <SessionsSidebar p={p} />

      <div className="flex-1 flex flex-col relative w-full h-[100dvh] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
        </div>

        <header className="p-3 md:p-6 flex justify-between items-center z-30 shrink-0 w-full">
          <div className="flex items-center gap-3">
            <button data-tutorial="tut-menu" onClick={() => setShowSessions(true)} className="p-2 md:p-3 bg-slate-900/50 border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all mr-2"><Menu size={20} /></button>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-b from-slate-800 to-slate-950 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/20 border border-white/10 animate-pulse overflow-hidden">
              {/* TÂM AN FIX: Cập nhật đầy đủ thông số FX cho Ảnh Đại Diện Góc Trái */}
              <div className="w-full h-full flex items-center justify-center" style={{ transform: `scale(${(allCharacters || []).find(c => c.id === currentLaoPresetId)?.recommendedScale || 1})` }}>
                 <MiniLaoFace className="w-full h-full" appearance={laoAppearance} visualType={laoVisualType} customImages={processedLaoImages} customVideos={chatLaoVideos} chromaSettings={laoChromaSettings} flipped={charOffsets.lao.flip} isSpeakingSession={isLaoSpeakingSession} enableFX={enableAutoHarmonization} shadowConfig={laoShadow} harmonizeSettings={harmonizeSettings} />
              </div>
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black tracking-tighter text-white leading-none flex items-center gap-2">
                Lão
                {isFetchingCloudAudio && <span title="Đang tải âm thanh từ đám mây..."><Cloud size={14} className="text-emerald-400 animate-pulse" /></span>}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[7px] md:text-[9px] text-emerald-400 font-bold tracking-widest leading-none text-nowrap whitespace-nowrap">{currentSession?.title || "Hội thoại mới"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button data-tutorial="tut-history" onClick={() => setShowHistory(!showHistory)} className={`p-2.5 rounded-xl border transition-all relative ${showHistory ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-xl' : 'bg-slate-900/50 border-white/5 text-slate-400'}`}>
                <History size={18}/>
                {messages.filter((m: any) => !m.audioUrl).length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#020617] animate-pulse"></span>}
            </button>
            {isLoggedIn && currentUser ? (
              <div className="relative group">
                <button
                  title={currentUser.name}
                  className="w-9 h-9 rounded-xl border border-indigo-500/40 bg-indigo-900/30 hover:border-indigo-500/80 transition-all flex items-center justify-center overflow-hidden"
                >
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-black text-indigo-300">{currentUser.name?.charAt(0)?.toUpperCase()}</span>
                  )}
                </button>
                {/* Dropdown Menu on Hover with Invisible Bridge */}
                <div className="absolute right-0 top-full pt-1.5 hidden group-hover:flex flex-col z-[200]">
                  <div className="bg-slate-900/95 border border-white/10 rounded-xl p-1.5 shadow-2xl min-w-[140px] backdrop-blur-md flex flex-col">
                    <div className="px-2.5 py-1 text-[9px] text-slate-400 font-bold border-b border-white/5 pb-1.5 mb-1 truncate max-w-[150px]">
                      {currentUser.name}
                    </div>
                    <button
                      onClick={() => setHasEntered(false)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Sửa Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setLocalShowAuthModal(true);
                  if (typeof setShowAuthModal === 'function') setShowAuthModal(true);
                }}
                title="Đăng nhập"
                className="p-2.5 rounded-xl border border-white/5 bg-slate-900/50 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40 hover:bg-indigo-900/20 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                <span className="hidden sm:inline">Đăng nhập</span>
              </button>
            )}
          </div>
        </header>

        <CharacterStage p={p} />

        <IsolatedChatInputBar
          inputText={p.inputText}
          handleSendMessage={handleSendMessage}
          handleRefineInput={handleRefineInput}
          isRefining={isRefining}
          toggleMic={toggleMic}
          isRecording={isRecording}
          toggleCamera={toggleCamera}
          cameraOn={cameraOn}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          isVoiceEnabled={isVoiceEnabled}
          setIsVoiceEnabled={setIsVoiceEnabled}
          showToastMsg={showToastMsg}
        />
      </div>

      <ChatHistorySidebar p={p} />

      {(showAuthModal || localShowAuthModal) && (
        <AuthModal
          onClose={() => {
            setLocalShowAuthModal(false);
            if (typeof setShowAuthModal === 'function') setShowAuthModal(false);
          }}
          onLogin={(user, token) => {
            if (typeof handleLogin === 'function') handleLogin(user, token);
            setLocalShowAuthModal(false);
            if (typeof setShowAuthModal === 'function') setShowAuthModal(false);
          }}
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; } 
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; } 
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } 
        .animate-spin-slow { animation: spin-slow 50s linear infinite; }
      `}</style>
      
      {/* TRANG XƯỞNG PHIM TỰ ĐỘNG (FULL-SCREEN PAGE LAYOUT - KHÔNG DÙNG MODAL BOX) */}
      {showAutoPilotModal && (
         <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col w-full h-full min-h-screen overflow-hidden animate-in fade-in duration-300">
            {/* Header Trang Quản Lý Xưởng Phim (Fullscreen Page Header) */}
            <div className="px-6 py-4 border-b border-white/10 flex flex-wrap justify-between items-center bg-slate-900/90 backdrop-blur-md shrink-0 shadow-lg z-20 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
                        <Bot size={22} />
                    </div>
                    <div>
                        <h1 className="font-black text-rose-400 tracking-wide text-base sm:text-lg flex items-center gap-2">
                            Xưởng Phim Tự Động (Auto-Pilot Batch Studio)
                        </h1>
                        <p className="text-xs text-slate-400">Sản xuất video đàm đạo hàng loạt tự động từ danh sách chủ đề qua AI Giác Ngộ</p>
                    </div>
                </div>

                {/* THANH 2 TAB ĐIỀU HƯỚNG GLASSMORPHIC KHÔNG NÚT THỪA */}
                <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
                    <button
                        onClick={() => changeSubTab('create')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            activeSubTab === 'create'
                                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg border border-rose-400/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-850'
                        }`}
                    >
                        <Sparkles size={14} /> 🚀 Tạo Tiến Trình Mới
                    </button>
                    <button
                        onClick={() => changeSubTab('history')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            activeSubTab === 'history'
                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg border border-indigo-400/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-850'
                        }`}
                    >
                        <History size={14} /> 📜 Lịch Sử Batch Jobs ({p.batchJobsList?.length || batchJobsList?.length || 0})
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {!apState.isRunning && (
                        <button
                            onClick={() => { window.location.href = '/?modal=ai-director'; }}
                            className="px-3.5 py-2 bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-500/30 text-indigo-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                            title="Quay lại Quản lý kịch bản"
                        >
                            <ChevronLeft size={16} /> Quay lại Danh Sách Kịch Bản
                        </button>
                    )}
                    {!apState.isRunning && (
                        <button 
                            onClick={() => {
                                setShowAutoPilotModal(false);
                                window.location.href = '/';
                            }} 
                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                            title="Quay lại Thiền đường (Trang chủ)"
                        >
                            <Home size={15} /> Quay lại Thiền đường
                        </button>
                    )}
                </div>
            </div>

            {/* Main Body Page Workspace */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col max-w-7xl w-full mx-auto">
                {/* TAB 1: FORM CẤU HÌNH XUẤT BẢN CÂN ĐỐI (1 CỘT GỌN GÀNG) */}
                {activeSubTab === 'create' && (
                    <div className="bg-slate-900/80 border border-rose-500/20 rounded-3xl p-5 md:p-8 shadow-2xl backdrop-blur-xl max-w-4xl w-full mx-auto flex flex-col gap-6">
                        
                        <div className={`w-full flex flex-col gap-4 overflow-y-auto ${(p.apState || apState)?.isRunning ? 'opacity-50 pointer-events-none grayscale-[50%]' : ''}`}>
                            
                            <div className="bg-rose-900/20 border border-rose-500/30 p-4 rounded-xl flex flex-col gap-2">
                                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5"><ListOrdered size={16}/> Danh sách chủ đề cần sản xuất:</span>
                                <textarea 
                                    value={p.apTopics !== undefined ? p.apTopics : apTopics}
                                    onChange={e => (p.setApTopics || setApTopics)(e.target.value)}
                                    placeholder="Nhập mỗi chủ đề 1 dòng..."
                                    className="w-full h-56 bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-rose-500 outline-none font-mono leading-relaxed"
                                />
                            </div>

                            <div className="flex flex-col gap-3 mt-1">
                                <span className="text-sm font-bold text-slate-200 border-b border-white/10 pb-1.5">Cấu hình xuất bản:</span>
                                
                                {/* KHỐI CẤU HÌNH GIỌNG ĐỌC & XƯNG HÔ CHO AUTO-PILOT */}
                                <div className="flex flex-col gap-3 bg-slate-800/50 p-4 rounded-xl border border-white/5 mt-1">
                                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5"><Users size={14}/> Thiết lập nhân vật:</span>
                                    
                                    <div className="flex flex-col gap-2 mt-1 border-b border-white/5 pb-3">
                                       <div className="flex gap-2">
                                          <input type="text" value={customLaoName} onChange={e=>setCustomLaoName(e.target.value)} placeholder="Tên Lão" className="flex-[1.5] bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500" title="Tên Lão" />
                                          <input type="text" value={laoSelfCall} onChange={e=>setLaoSelfCall(e.target.value)} placeholder="Lão tự xưng" className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500" title="Lão tự xưng là gì" />
                                          <input type="text" value={laoCallUser} onChange={e=>setLaoCallUser(e.target.value)} placeholder="Lão gọi kia" className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500" title="Lão gọi người hỏi là gì" />
                                       </div>
                                       <div className="flex gap-2">
                                          <select value={laoVoice} onChange={e=>setLaoVoice(e.target.value)} className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500">
                                              <optgroup label="🎙️ Nam"><option value="Algieba">Algieba</option><option value="Puck">Puck</option><option value="Charon">Charon</option></optgroup>
                                              <optgroup label="🎙️ Nữ"><option value="Aoede">Aoede</option><option value="Kore">Kore</option></optgroup>
                                          </select>
                                          <input type="text" value={laoVoiceStyle} onChange={e=>setLaoVoiceStyle(e.target.value)} placeholder="Phong cách Lão..." className="flex-[2] bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500" />
                                       </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 mt-1">
                                       <div className="flex gap-2">
                                          <input type="text" value={customUserName} onChange={e=>setCustomUserName(e.target.value)} placeholder="Tên Con" className="flex-[1.5] bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500" title="Tên Người Hỏi" />
                                          <input type="text" value={userSelfCall} onChange={e=>setUserSelfCall(e.target.value)} placeholder="Con tự xưng" className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500" title="Người hỏi tự xưng là gì" />
                                          <input type="text" value={userCallLao} onChange={e=>setUserCallLao(e.target.value)} placeholder="Con gọi kia" className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500" title="Người hỏi gọi Lão là gì" />
                                       </div>
                                       <div className="flex gap-2">
                                          <div className="flex-1 flex flex-col gap-1">
                                              <span className="text-[11px] text-slate-300 font-bold">Giới tính:</span>
                                              <select value={userGender || 'Khác'} onChange={e=>setUserGender?.(e.target.value)} className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer focus:border-amber-500">
                                                  <option value="Nam">Nam</option>
                                                  <option value="Nữ">Nữ</option>
                                                  <option value="Khác">Khác</option>
                                              </select>
                                          </div>
                                          <div className="flex-1 flex flex-col gap-1">
                                              <span className="text-[11px] text-slate-300 font-bold">Độ tuổi:</span>
                                              <input type="number" min={1} max={120} value={userAge || 25} onChange={e=>setUserAge?.(Number(e.target.value))} placeholder="Độ tuổi" className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500" title="Độ tuổi của người hỏi" />
                                          </div>
                                       </div>
                                       <div className="flex gap-2">
                                          <select value={userVoice} onChange={e=>setUserVoice(e.target.value)} disabled={(p.apSettings || apSettings)?.charMode === 'random'} className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none disabled:opacity-50 focus:border-amber-500">
                                              <optgroup label="🎙️ Nữ"><option value="Aoede">Aoede</option><option value="Kore">Kore</option></optgroup>
                                              <optgroup label="🎙️ Nam"><option value="Puck">Puck</option><option value="Charon">Charon</option></optgroup>
                                          </select>
                                          <input type="text" value={userVoiceStyle} onChange={e=>setUserVoiceStyle(e.target.value)} disabled={(p.apSettings || apSettings)?.charMode === 'random'} placeholder="Phong cách Con..." className="flex-[2] bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none disabled:opacity-50 focus:border-amber-500" />
                                       </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
                                    {/* BLOCK 1: TỈ LỆ KHUNG HÌNH */}
                                    <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5 justify-between">
                                        <label className="text-xs font-bold text-slate-300">Tỉ lệ Khung Hình Video:</label>
                                        <div className="flex gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updateFn = p.setApSettings || setApSettings;
                                                    if (updateFn) updateFn((st: any) => ({ ...st, orientation: '16x9' }));
                                                }}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl cursor-pointer transition-all border text-xs font-bold ${
                                                    (p.apSettings || apSettings)?.orientation === '16x9'
                                                        ? 'bg-rose-600/30 border-rose-500 text-rose-300 shadow-md ring-1 ring-rose-500'
                                                        : 'bg-slate-950/60 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                                                }`}
                                            >
                                                <Video size={14}/> Ngang (16:9)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updateFn = p.setApSettings || setApSettings;
                                                    if (updateFn) updateFn((st: any) => ({ ...st, orientation: '9x16' }));
                                                }}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl cursor-pointer transition-all border text-xs font-bold ${
                                                    (p.apSettings || apSettings)?.orientation === '9x16'
                                                        ? 'bg-rose-600/30 border-rose-500 text-rose-300 shadow-md ring-1 ring-rose-500'
                                                        : 'bg-slate-950/60 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                                                }`}
                                            >
                                                <Smartphone size={14}/> Dọc (9:16)
                                            </button>
                                        </div>
                                    </div>

                                    {/* BLOCK 2: ĐỘ DÀI KỊCH BẢN */}
                                    <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5 justify-between">
                                        <label className="text-xs font-bold text-slate-300">Độ dài kịch bản:</label>
                                        <select 
                                            value={(p.apSettings || apSettings)?.scriptLength || 'Chính xác 4 câu (2 Lão, 2 Con)'} 
                                            onChange={e => (p.setApSettings || setApSettings)(st => ({...st, scriptLength: e.target.value}))} 
                                            className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-lg outline-none text-xs focus:border-rose-500"
                                        >
                                            <option value="Chính xác 4 câu (2 Lão, 2 Con)">Ngắn 4 câu (2 Lão, 2 Con)</option>
                                            <option value="Khoảng 4-6 câu">Ngắn (Khoảng 4-6 câu)</option>
                                            <option value="Khoảng 6-10 câu">Vừa (Khoảng 6-10 câu)</option>
                                            <option value="Khoảng 10-15 câu">Dài (Khoảng 10-15 câu)</option>
                                            <option value="Khoảng 15-21 câu">Rất dài (Khoảng 15-21 câu)</option>
                                        </select>
                                    </div>

                                    {/* BLOCK 3: HIỆU ỨNG CHUYỂN CẢNH */}
                                    <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5 justify-between">
                                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5"><Sparkles size={14}/> Chuyển cảnh (Transitions):</label>
                                        <select 
                                            value={(p.apSettings || apSettings)?.transition || 'none'} 
                                            onChange={e => (p.setApSettings || setApSettings)(st => ({...st, transition: e.target.value}))} 
                                            className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-lg outline-none text-xs focus:border-rose-500"
                                        >
                                            <option value="none">Cắt cứng (Tắt hiệu ứng)</option>
                                            <option value="fade_black">Mờ đen (Dip to black)</option>
                                            <option value="fade_white">Chớp trắng (Flash)</option>
                                            <option value="blur">Lóa sáng tâm linh</option>
                                            <option value="random">Ngẫu nhiên tự động</option>
                                        </select>
                                        {(p.apSettings || apSettings)?.transition !== 'none' && (
                                            <div className="flex flex-col gap-1 mt-1 animate-in fade-in bg-slate-900 p-2 rounded-lg border border-white/5">
                                                <span className="text-[11px] text-slate-300 flex justify-between font-bold">Thời gian kéo dài: <span className="text-white">{(p.apSettings || apSettings)?.transitionDuration || 0.5}s</span></span>
                                                <input type="range" min="0.1" max="2.0" step="0.1" value={(p.apSettings || apSettings)?.transitionDuration || 0.5} onChange={e => (p.setApSettings || setApSettings)(st => ({...st, transitionDuration: Number(e.target.value)}))} className="accent-rose-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-4">
                                {!(p.apState || apState)?.isRunning ? (
                                    <button onClick={p.startAutoPilot || startAutoPilot} className="w-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black py-4 rounded-xl shadow-[0_0_25px_rgba(225,29,72,0.4)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer">
                                        <PlayCircle size={20}/> Bắt Đầu Sản Xuất Hàng Loạt
                                    </button>
                                ) : (
                                    <button onClick={p.stopAutoPilot || stopAutoPilot} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer">
                                        <StopCircle size={20} className="text-rose-400"/> Dừng Khẩn Cấp
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: BẢNG LỊCH SỬ TIẾN TRÌNH BATCH JOBS */}
                {activeSubTab === 'history' && (
                    <div className="bg-slate-900/80 border border-indigo-500/20 rounded-3xl p-5 md:p-8 shadow-2xl backdrop-blur-xl w-full flex flex-col gap-5 mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                            <div>
                                <h2 className="text-lg font-black text-white flex items-center gap-2">
                                    <History className="text-indigo-400" size={20} /> Danh Sách Các Đợt Sản Xuất Batch Jobs
                                </h2>
                                <p className="text-xs text-slate-400">Theo dõi tiến độ % realtime, tải video MP4 và điều khiển dừng/chạy đợt cũ & mới</p>
                            </div>
                            <button
                                onClick={() => changeSubTab('create')}
                                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
                            >
                                <Plus size={15} /> Tạo Đợt Mới
                            </button>
                        </div>

                        {(!p.batchJobsList || p.batchJobsList.length === 0) ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                <div className="p-4 bg-slate-800/50 rounded-full text-slate-500 mb-3">
                                    <Bot size={36} />
                                </div>
                                <h3 className="text-base font-bold text-slate-300 mb-1">Chưa có lịch sử đợt tiến trình nào</h3>
                                <p className="text-xs text-slate-500 max-w-sm mb-4">Nhập danh sách chủ đề ở Tab Tạo Tiến Trình Mới để khởi chạy đợt sản xuất video tự động hàng loạt.</p>
                                <button
                                    onClick={() => changeSubTab('create')}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
                                >
                                    Khởi Tạo Ngay
                                </button>
                            </div>
                        ) : (() => {
                            const totalBatchJobs = p.batchJobsList?.length || 0;
                            const totalPages = Math.max(1, Math.ceil(totalBatchJobs / batchPageSize));
                            const safeBatchPage = Math.min(batchPage, totalPages);
                            const startIndex = (safeBatchPage - 1) * batchPageSize;
                            const paginatedJobs = (p.batchJobsList || []).slice(startIndex, startIndex + batchPageSize);

                            return (
                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[600px] pr-1">
                                        {paginatedJobs.map((job: any) => {
                                            const isRunning = job.status === 'running';
                                            const isPaused = job.status === 'paused';
                                            const isCompleted = job.status === 'completed';
                                            const hasFailed = job.topics?.some((t: any) => t.status === 'failed');

                                            return (
                                                <div key={job.id} className="bg-slate-950/80 border border-white/10 hover:border-indigo-500/40 p-5 rounded-2xl transition-all shadow-lg flex flex-col gap-4">
                                                    {/* Header THẺ BATCH */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-xl text-xs font-black ${isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : isRunning ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                                                                {job.settings?.orientation === '9x16' ? '📱 Dọc (9:16)' : '💻 Ngang (16:9)'}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                                                    {job.title}
                                                                    <span className="text-[10px] font-mono font-bold text-slate-500">({job.id})</span>
                                                                </h3>
                                                                <span className="text-[11px] text-slate-400 font-mono">Tạo lúc: {new Date(job.createdAt).toLocaleString('vi-VN')}</span>
                                                            </div>
                                                        </div>

                                                        {/* Badge Status */}
                                                        <div className="flex items-center gap-2">
                                                            {isCompleted && <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold">🟢 Hoàn Thành 100%</span>}
                                                            {isRunning && <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full text-xs font-bold animate-pulse">🔵 Đang Sản Xuất ({job.progressPercent || 0}%)</span>}
                                                            {isPaused && <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold">⏸️ Tạm Dừng</span>}
                                                            {hasFailed && <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full text-xs font-bold">🔴 Có Lỗi</span>}
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-white/5">
                                                        <div 
                                                            className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-500'}`}
                                                            style={{ width: `${job.progressPercent || 0}%` }}
                                                        ></div>
                                                    </div>

                                                    {/* Danh sách các chủ đề trong Batch */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                                        {job.topics?.map((topic: any, tIdx: number) => (
                                                            <div key={topic.id || tIdx} className="bg-slate-900/60 p-3 rounded-xl border border-white/5 flex flex-col justify-between gap-2">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <span className="text-xs text-slate-200 font-semibold line-clamp-2">
                                                                        #{tIdx + 1}. {topic.title}
                                                                    </span>
                                                                    {topic.status === 'completed' && <span className="text-[10px] font-bold text-emerald-400 shrink-0">🟢</span>}
                                                                    {topic.status === 'running' && <span className="text-[10px] font-bold text-indigo-400 shrink-0 animate-pulse">🔵</span>}
                                                                    {topic.status === 'failed' && <span className="text-[10px] font-bold text-rose-400 shrink-0">🔴</span>}
                                                                    {topic.status === 'pending' && <span className="text-[10px] text-slate-500 shrink-0">⚪</span>}
                                                                </div>

                                                                {topic.status === 'failed' && (
                                                                    <div className="text-[10px] text-rose-400 font-medium bg-rose-950/40 border border-rose-500/20 p-2 rounded-lg mt-1 break-words leading-relaxed max-h-24 overflow-y-auto">
                                                                        🔴 Lỗi: {String(topic.error || topic.errorMsg || topic.message || "Lỗi khởi tạo kịch bản / audio").replace(/<[^>]*>/g, '').trim()}
                                                                    </div>
                                                                )}

                                                                 <div className="flex items-center gap-1.5 mt-1 pt-2 border-t border-white/5 flex-wrap">
                                                                     {topic.scriptId && (
                                                                         <>
                                                                             <button
                                                                                 onClick={() => {
                                                                                     if (topic.scriptId) {
                                                                                         window.location.href = `/?modal=ai-director?action=update&id=${encodeURIComponent(topic.scriptId)}`;
                                                                                     } else {
                                                                                         window.location.href = '/?modal=ai-director';
                                                                                     }
                                                                                 }}
                                                                                 className="px-2 py-1 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                                                             >
                                                                                 📝 Kịch Bản
                                                                             </button>
                                                                             <button
                                                                                 onClick={() => {
                                                                                     if (p.playTopicAudio) p.playTopicAudio(topic.scriptId);
                                                                                     else if (playTopicAudio) playTopicAudio(topic.scriptId);
                                                                                 }}
                                                                                 className="px-2 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                                                                 title="Nghe audio kịch bản bài này"
                                                                             >
                                                                                 <Volume2 size={11} /> Nghe Audio
                                                                             </button>
                                                                         </>
                                                                     )}
                                                                     {topic.videoUrl ? (
                                                                         <button
                                                                             onClick={() => {
                                                                                 setPreviewVideoUrl((topic.videoUrl && !topic.videoUrl.includes('batch_')) ? topic.videoUrl : '/exports/default_video.mp4');
                                                                                 setPreviewVideoTitle(topic.title || 'Video MP4 Xưởng Phim');
                                                                                 
                                                                             }}
                                                                             className="px-2 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                                                         >
                                                                             <Play size={10} /> Xem Video
                                                                         </button>
                                                                     ) : (
                                                                         <button
                                                                             onClick={() => {
                                                                                 if (p.renderMissingBatchVideos) p.renderMissingBatchVideos(job.id, topic.id);
                                                                                 else if (renderMissingBatchVideos) renderMissingBatchVideos(job.id, topic.id);
                                                                             }}
                                                                             className="px-2 py-1 bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                                                             title="Tạo video MP4 riêng cho bài này"
                                                                         >
                                                                             <Film size={11} /> Tạo Video
                                                                         </button>
                                                                     )}
                                                                 </div>
                                                             </div>
                                                        ))}
                                                    </div>

                                                    {/* BỘ NÚT ĐIỀU KHIỂN ĐỢT BATCH */}
                                                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <button
                                                                onClick={() => {
                                                                    if (p.setActiveBatchJobId) p.setActiveBatchJobId(job.id);
                                                                    setExpandedTerminalJobId(prev => prev === job.id ? null : job.id);
                                                                }}
                                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${expandedTerminalJobId === job.id ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 border-indigo-500/30'}`}
                                                            >
                                                                <Terminal size={14} /> {expandedTerminalJobId === job.id ? 'Thu Gọn Terminal Log' : 'Xem Terminal Log'}
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    if (p.generateMissingBatchAudios) p.generateMissingBatchAudios(job.id);
                                                                    else if (generateMissingBatchAudios) generateMissingBatchAudios(job.id);
                                                                }}
                                                                className="px-3 py-1.5 bg-amber-900/40 hover:bg-amber-800/60 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                                                title="Tạo các tệp audio giọng đọc còn thiếu cho toàn bộ bài trong đợt"
                                                            >
                                                                <Mic size={14} /> Tạo Audio Còn Thiếu
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    if (p.renderMissingBatchVideos) p.renderMissingBatchVideos(job.id);
                                                                    else if (renderMissingBatchVideos) renderMissingBatchVideos(job.id);
                                                                }}
                                                                className="px-3 py-1.5 bg-gradient-to-r from-purple-900/60 to-rose-900/60 hover:from-purple-800/80 hover:to-rose-800/80 text-purple-200 border border-purple-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                                                                title="Tạo tất cả video MP4 còn thiếu cho toàn bộ bài trong đợt batch"
                                                            >
                                                                <Film size={14} /> Tạo Video Còn Thiếu
                                                            </button>

                                                            {hasFailed && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (p.retryFailedTopics) p.retryFailedTopics(job.id);
                                                                        else if (retryFailedTopics) retryFailedTopics(job.id);
                                                                    }}
                                                                    className="px-3 py-1.5 bg-amber-900/40 hover:bg-amber-800/60 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                                                >
                                                                    <RefreshCw size={14} /> Chạy Lại Bài Lỗi
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => {
                                                                    if (p.restartAutoPilot) p.restartAutoPilot(job.id);
                                                                    else if (restartAutoPilot) restartAutoPilot(job.id);
                                                                }}
                                                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                                            >
                                                                <RotateCcw size={14} /> Chạy Lại Từ Đầu
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => {
                                                                if (p.deleteBatchJob) p.deleteBatchJob(job.id);
                                                                else if (deleteBatchJob) deleteBatchJob(job.id);
                                                            }}
                                                            className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                                            title="Xóa đợt batch này"
                                                        >
                                                            <Trash2 size={13} /> Xóa Batch
                                                        </button>
                                                    </div>

                                                    {/* KHUNG TERMINAL LOG MỞ RỘNG TRỰC TIẾP NGAY DƯỚI THẺ BATCH */}
                                                    {expandedTerminalJobId === job.id && (
                                                        <div className="mt-3 p-4 bg-black rounded-xl border border-indigo-500/30 flex flex-col gap-2 font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 shadow-2xl">
                                                            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-slate-400 font-bold sticky top-0 bg-black/90 backdrop-blur-md z-10">
                                                                <span className="flex items-center gap-1.5 text-indigo-400">
                                                                    <Terminal size={14} /> Terminal Log Realtime - {job.title}
                                                                </span>
                                                                <button
                                                                    onClick={() => setExpandedTerminalJobId(null)}
                                                                    className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer flex items-center gap-1 border border-white/10"
                                                                >
                                                                    <X size={12} /> Thu Gọn
                                                                </button>
                                                            </div>
                                                            {(() => {
                                                                const activeLogs = (job.logs && job.logs.length > 0) ? job.logs : ((p.apState || apState)?.logs || []);
                                                                if (!activeLogs || activeLogs.length === 0) {
                                                                    return <div className="text-slate-500 italic py-3 text-center">Đang lắng nghe log tiến trình realtime...</div>;
                                                                }
                                                                return activeLogs.map((log: any, idx: number) => {
                                                                    let textColor = "text-slate-300";
                                                                    if (log.includes("--- BẮT ĐẦU")) textColor = "text-rose-400 font-bold";
                                                                    if (log.includes("✅")) textColor = "text-emerald-400 font-bold";
                                                                    if (log.includes("❌")) textColor = "text-red-400 font-bold";
                                                                    if (log.includes("Render") || log.includes("🎬")) textColor = "text-amber-300 font-semibold";
                                                                    return (
                                                                        <div key={idx} className={`border-b border-white/5 pb-1 ${textColor}`}>
                                                                            {log}
                                                                        </div>
                                                                    );
                                                                });
                                                            })()}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* THANH PHÂN TRANG (PAGINATION CONTROL BAR) */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 font-medium">Số hàng / trang:</span>
                                            <select
                                                value={batchPageSize}
                                                onChange={(e) => {
                                                    setBatchPageSize(Number(e.target.value));
                                                    setBatchPage(1);
                                                }}
                                                className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold outline-none focus:border-indigo-500 cursor-pointer"
                                            >
                                                <option value={5}>5 đợt / trang</option>
                                                <option value={10}>10 đợt / trang</option>
                                                <option value={50}>50 đợt / trang</option>
                                                <option value={100}>100 đợt / trang</option>
                                            </select>
                                        </div>

                                        <div className="font-mono text-slate-400">
                                            Trang <span className="font-bold text-white">{safeBatchPage}</span> / <span className="font-bold text-white">{totalPages}</span> (Tổng số: <span className="font-bold text-indigo-400">{totalBatchJobs}</span> đợt)
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => setBatchPage(1)}
                                                disabled={safeBatchPage <= 1}
                                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 border border-white/10 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                                title="Trang đầu"
                                            >
                                                ⏮️
                                            </button>
                                            <button
                                                onClick={() => setBatchPage(prev => Math.max(1, prev - 1))}
                                                disabled={safeBatchPage <= 1}
                                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 border border-white/10 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                            >
                                                Trang Trước
                                            </button>
                                            <button
                                                onClick={() => setBatchPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={safeBatchPage >= totalPages}
                                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 border border-white/10 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                            >
                                                Trang Sau
                                            </button>
                                            <button
                                                onClick={() => setBatchPage(totalPages)}
                                                disabled={safeBatchPage >= totalPages}
                                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 border border-white/10 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                                title="Trang cuối"
                                            >
                                                ⏭️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
         </div>
      )}




      {/* PREMIUM PAYWALL MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex justify-center items-center p-4">
          <div className="bg-slate-900 border border-yellow-500/30 rounded-3xl p-6 w-full max-w-md shadow-[0_0_50px_rgba(245,158,11,0.2)] flex flex-col gap-5 animate-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
            
            <button 
              onClick={() => setShowPaymentModal(false)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center gap-2 mt-2">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center border border-amber-500/20 animate-bounce">
                <Sparkles size={24} />
              </div>
              <h2 className="text-xl font-black text-amber-300 tracking-wider">Khai Mở Tri Thức Hữu Hạn</h2>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Con đã thưa thỉnh hết <span className="text-amber-400 font-bold">{publicSettings?.freeLimit || 20} câu hỏi miễn phí</span>. Để tiếp tục đồng hành và học đạo cùng Lão, con hãy ủng hộ phát triển ứng dụng và kích hoạt tài khoản.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
              <p className="text-[10px] text-amber-500/80 tracking-widest font-black uppercase text-center border-b border-white/5 pb-2">Thông tin ủng hộ</p>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                {publicSettings?.bankName && (
                  <div className="flex flex-col gap-0.5 bg-slate-900/60 p-2 rounded-xl border border-white/5 relative group">
                    <span className="text-[9px] text-slate-500 font-bold">🏦 Ngân hàng</span>
                    <span className="font-bold text-slate-200">{publicSettings.bankName}</span>
                    <span className="font-mono text-[10px] text-slate-300 flex items-center gap-1 mt-1 font-bold">
                      {publicSettings.bankAccount}
                      <button 
                        onClick={() => { navigator.clipboard.writeText(publicSettings.bankAccount); showToastMsg('Đã sao chép số tài khoản!', 'success', 2000); }} 
                        className="text-slate-500 hover:text-white ml-auto"
                        title="Sao chép số tài khoản"
                      >
                        <Copy size={11} />
                      </button>
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5">{publicSettings.bankName && publicSettings.momoName}</span>
                  </div>
                )}

                {publicSettings?.momoPhone && (
                  <div className="flex flex-col gap-0.5 bg-slate-900/60 p-2 rounded-xl border border-white/5 relative group">
                    <span className="text-[9px] text-slate-500 font-bold">💜 Ví MoMo</span>
                    <span className="font-bold text-slate-200">{publicSettings.momoName || "MoMo"}</span>
                    <span className="font-mono text-[10px] text-slate-300 flex items-center gap-1 mt-1 font-bold">
                      {publicSettings.momoPhone}
                      <button 
                        onClick={() => { navigator.clipboard.writeText(publicSettings.momoPhone); showToastMsg('Đã sao chép số MoMo!', 'success', 2000); }} 
                        className="text-slate-500 hover:text-white ml-auto"
                        title="Sao chép số MoMo"
                      >
                        <Copy size={11} />
                      </button>
                    </span>
                  </div>
                )}
              </div>

              {publicSettings?.qrImageUrl && (
                <div className="flex justify-center items-center p-2 bg-white rounded-xl w-32 h-32 mx-auto shadow-inner border border-white/10 mt-1">
                  <img src={publicSettings.qrImageUrl} alt="QR Thanh toán" className="max-w-full max-h-full object-contain" />
                </div>
              )}

              <div className="text-[10px] text-slate-500 text-center leading-relaxed mt-1">
                Nội dung chuyển khoản: <span className="text-amber-400 font-mono font-bold select-all">KICHHOAT {currentUser?.email || 'GUEST'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <label className="text-[10px] text-slate-400 font-bold">Nhập mã kích hoạt nhận được:</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={activationCode} 
                  onChange={e => { setActivationCode(e.target.value); setActivationError(''); }} 
                  placeholder="Mã kích hoạt..." 
                  className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-amber-500/50 uppercase font-mono font-bold"
                />
                <button 
                  onClick={async () => {
                    if (!activationCode.trim()) return;
                    try {
                      const res = await fetch('/api/admin/verify-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code: activationCode })
                      });
                      const data = await res.json();
                      if (res.ok && data.success) {
                        setIsSubscribed(true);
                        localStorage.setItem('onglao_subscribed', 'true');
                        setShowPaymentModal(false);
                        setActivationCode('');
                        showToastMsg('Kích hoạt bản quyền thành công! Con đã có thể thưa thỉnh không giới hạn.', 'success', 5000);
                      } else {
                        setActivationError(data.message || 'Mã kích hoạt không đúng.');
                      }
                    } catch (err) {
                      setActivationError('Lỗi xác thực: ' + (err as any).message);
                    }
                  }} 
                  className="px-5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Kích hoạt
                </button>
              </div>
              {activationError && <p className="text-rose-400 text-[10px] text-center font-bold">{activationError}</p>}
            </div>
          </div>
        </div>
      )}
      {/* MODAL POPUP XEM VIDEO MP4 TRỰC TIẾP */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 max-w-3xl w-full flex flex-col gap-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-emerald-400 text-sm flex items-center gap-2">
                <Film size={18} /> {previewVideoTitle || 'Video Xưởng Phim'}
              </h3>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-inner border border-white/5 group">
              <video
                src={previewVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                onTimeUpdate={(e) => {
                  setVideoCurrentTime((e.target as HTMLVideoElement).currentTime);
                }}
                onLoadedMetadata={(e) => {
                  setVideoDuration((e.target as HTMLVideoElement).duration);
                }}
                onError={(e) => {
                  (e.target as HTMLVideoElement).src = '/exports/default_video.mp4';
                }}
              />

              {/* LỚP PHỦ PHỤ ĐỀ KARAOKE NGẮT CÂU & CHẠY CHỮ REALTIME */}
              {previewVideoUrl && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[88%] max-w-xl text-center flex flex-col items-center gap-1">
                  {(() => {
                    const dur = videoDuration || 41;
                    const progress = Math.min(1, Math.max(0, videoCurrentTime / dur));
                    const sentences = previewScriptSentences.length > 0 ? previewScriptSentences : [
                      { speaker: 'Lão', text: 'Con an lạc trong tâm trí, buông bỏ sự dính mắc thì phiền não tự tan.' },
                      { speaker: 'Con', text: 'Thưa Lão, làm sao để buông bỏ khi lòng vẫn còn nhiều vướng bận?' },
                      { speaker: 'Lão', text: 'Hãy quay về với hơi thở, nhìn sâu vào thực tại, mọi sự rồi cũng sẽ trôi qua.' },
                      { speaker: 'Con', text: 'Con đã hiểu, cảm tạ Lão đã khai mở tâm trí cho con.' }
                    ];
                    const totalSentences = sentences.length;
                    const currentSentenceIndex = Math.min(totalSentences - 1, Math.floor(progress * totalSentences));
                    const activeSentence = sentences[currentSentenceIndex];
                    if (!activeSentence) return null;

                    const sentenceProgress = (progress * totalSentences) - currentSentenceIndex;
                    const words = activeSentence.text.split(' ');
                    const activeWordIndex = Math.floor(sentenceProgress * words.length);

                    const isLao = activeSentence.speaker === 'Lão';

                    return (
                      <div className="bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-amber-500/40 shadow-2xl flex flex-col items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${isLao ? 'bg-amber-950/90 text-amber-300 border-amber-500/60 shadow-amber-950/50' : 'bg-cyan-950/90 text-cyan-300 border-cyan-500/60 shadow-cyan-950/50'}`}>
                          {isLao ? '👴 Lão Minh Sư' : '👧 Con Thưa Thỉnh'}
                        </span>
                        <div className="text-xs md:text-sm font-bold leading-relaxed flex flex-wrap justify-center gap-x-1.5 text-center max-w-full break-words">
                          {words.map((word: string, wIdx: number) => {
                            const isPassed = wIdx <= activeWordIndex;
                            return (
                              <span
                                key={wIdx}
                                className={`transition-all duration-150 ${isPassed ? 'text-amber-300 font-extrabold scale-110 drop-shadow-[0_0_10px_rgba(245,158,11,0.9)]' : 'text-slate-100 opacity-90'}`}
                              >
                                {word}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
              <span>Trình phát MP4 Xưởng Phim Tự Động</span>
              <div className="flex gap-2">
                <a
                  href={previewVideoUrl}
                  download
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Download size={14} /> Tải Video MP4
                </a>
                <button
                  onClick={() => setPreviewVideoUrl(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default React.memo(NormalModePanel, (prevProps, nextProps) => {
  const p1 = prevProps?.p || {};
  const p2 = nextProps?.p || {};
  const s1Key = (p1.sessions || []).map((s: any) => `${s.id}:${s.isPinned}:${s.title}`).join('|');
  const s2Key = (p2.sessions || []).map((s: any) => `${s.id}:${s.isPinned}:${s.title}`).join('|');

  return (
    s1Key === s2Key &&
    p1.currentSessionId === p2.currentSessionId &&
    p1.messages?.length === p2.messages?.length &&
    p1.currentlyPlayingId === p2.currentlyPlayingId &&
    p1.isRecording === p2.isRecording &&
    p1.isRefining === p2.isRefining &&
    p1.isLaoSpeakingSession === p2.isLaoSpeakingSession &&
    p1.mouthOpen === p2.mouthOpen &&
    p1.showSessions === p2.showSessions &&
    p1.showHistory === p2.showHistory &&
    p1.showPoemModal === p2.showPoemModal &&
    p1.showVideoExportModal === p2.showVideoExportModal &&
    p1.showAutoPilotModal === p2.showAutoPilotModal &&
    p1.showAuthModal === p2.showAuthModal &&
    p1.selectedAiConfigId === p2.selectedAiConfigId &&
    p1.currentLaoPresetId === p2.currentLaoPresetId
  );
});
