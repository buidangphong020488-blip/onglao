// @ts-nocheck
"use client";
import React from "react";
import { Check, Loader2, XCircle, Info, Smile, Mic, Send, BookOpen, Film, Video, FileText, Sparkles, Sliders, Save, Maximize, Minimize, RefreshCw, X, ChevronDown, Archive, Volume2, Share as ShareIcon, Copy, Plus, Compass, Clock, SlidersHorizontal, Settings2, ShieldAlert, History, Edit, KeyRound, UserCheck, Play, Pause, Power, MessageSquare, Bot, HelpCircle, Activity, ArrowRight, Camera, Cloud, Download, FlipHorizontal, Image as ImageIcon, ListOrdered, Menu, MicOff, Music, Pencil, Pin, PlayCircle, RotateCcw, Smartphone, StopCircle, ThumbsDown, ThumbsUp, Trash2, Users, Volume1, VolumeX, Wand2 } from "lucide-react";
import MiniLaoFace from "./MiniLaoFace";
import AuthModal from "@/components/AuthModal";
import CombinedScriptModal from "./CombinedScriptModal";
import AiDirectorManagerModal from "./AiDirectorManagerModal";
import PoemVaultModal from "./PoemVaultModal";
import VideoCreatorModal from "./VideoCreatorModal";
import SessionsSidebar from "./SessionsSidebar";
import CharacterStage from "./CharacterStage";
import ChatHistorySidebar from "./ChatHistorySidebar";

import { useOngLaoContext } from "../context/OngLaoContext";


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

// NormalModePanel: Giao diện thiền đường chế độ Normal Mode
const NormalModePanel = () => {
  const p = useOngLaoContext();
  const {
      EMOTIONS, MiniLaoFace, TUTORIAL_STEPS, activationCode, activationError, aiLaoStyle, aiScriptLength, aiTopicText,
      aiUserEmotionArc, allCharacters, apSettings, apState, apTopics, appId, appLanguage, applyCharacterPreset,
      backupFileInputRef, backupOptions, backupProgress, batchAIMeaningProgress, batchGreetingProgress, batchMeaningProgress, batchPoemProgress, cameraOn,
      cancelVideoExport, charOffsets, chatEndRef, chatLaoDragInfo, chatLaoTransform, chatLaoVideos, confirmDialog, copyToClipboard,
      creatingVoices, currentLaoPresetId, currentSession, currentSessionId, currentUser, currentlyPlayingId, customLaoName, customUserName,
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
      laoShadow, laoVisualType, laoVoice, laoVoiceStyle, messages, mouthOpen, newTagInputs, nextTutorialStep,
      oldLinkInput, openDropdown, outroText, playVoice, poemDatabase, poemModalTab, poemSearch, processedLaoImages,
      publicAis, publicSettings, ragDb, ragSearch, refreshRagFromGiacNgo, regenerationComplete, regenerationProgress, renderedVideoUrl,
      resetVideoExport, resolveGreetingAudioUrl, resolveMeaningAudioUrl, resolveStanzaAudioUrl, savePackData, savePoemDatabase, saveSessionTitle, scriptText,
      selectedAiConfigId, selectedImage, sessions, setSessions, setActivationCode, setActivationError, setAiLaoStyle, setAiScriptLength, setAiTopicText,
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
      showAiManager, setShowAiManager,
      startAutoPilot, startVideoExport, stopAutoPilot, targetRect, tempEditText, toast, toggleCamera, toggleFullscreen,
      toggleGlobalPlay, toggleMic, togglePin, toggleReaction, tutorialStep, txtPoemFileInputRef, updateCurrentMessages, uploadAudioProgress,
      user, userAge, userCallLao, userGender, userSelfCall, userVoice, userVoiceStyle, videoResolution,
  } = p;

  const [localInputText, setLocalInputText] = React.useState(inputText || '');
  const [inputEmotion, setInputEmotion] = React.useState('calm');
  const [showEmotionMenu, setShowEmotionMenu] = React.useState(false);
  
  React.useEffect(() => {
    setLocalInputText(inputText || '');
  }, [inputText]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('modal') === 'ai-director') {
        setShowAiManager(true);
      }
      
      const handleOpenModal = () => setShowAiManager(true);
      window.addEventListener('openAiDirectorModal', handleOpenModal as any);
      return () => window.removeEventListener('openAiDirectorModal', handleOpenModal as any);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const currentModal = params.get('modal');
      let changed = false;
      
      if (showAiManager && currentModal !== 'ai-director') {
        params.set('modal', 'ai-director');
        changed = true;
      } else if (!showAiManager && currentModal === 'ai-director') {
        params.delete('modal');
        changed = true;
      }
      
      if (changed) {
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, [showAiManager]);

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-100 overflow-hidden font-sans select-none relative animate-in fade-in duration-700">
      
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
      <PoemVaultModal />

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
      {showAiManager && (
          <AiDirectorManagerModal
              show={showAiManager}
              onClose={() => setShowAiManager(false)}
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
        show={showScriptModal || showAITopicModal}
        onClose={() => { 
            setShowScriptModal(false); 
            setShowAITopicModal(false); 
            setShowAiManager(true); 
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

      <VideoCreatorModal
        {...p}
        showVideoExportModal={p.showVideoExportModal}
        handleShareVideoSocial={handleShareVideoSocial}
        diagnosticReport={diagnosticReport}
        setShowDiagnostics={setShowDiagnostics}
        toggleFullscreen={toggleFullscreen}
        resetVideoExport={resetVideoExport}
        isPreviewFullscreen={isPreviewFullscreen}
        exportTab={exportTab}
        setExportTab={setExportTab}
        videoResolution={videoResolution}
        setVideoResolution={setVideoResolution}
        outroText={outroText}
        setOutroText={setOutroText}
        startVideoExport={startVideoExport}
        showSavePackModal={showSavePackModal}
        setShowSavePackModal={setShowSavePackModal}
        savePackData={savePackData}
        setSavePackData={setSavePackData}
        executeSaveFfPack={executeSaveFfPack}
        showToastMsg={showToastMsg}
      />

      {showUserGuide && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setShowUserGuide(false)}>
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

      <SessionsSidebar />

      <div className="flex-1 flex flex-col relative w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
        </div>

        <header className="p-4 md:p-6 flex justify-between items-center z-30">
          <div className="flex items-center gap-3">
            <button data-tutorial="tut-menu" onClick={() => setShowSessions(true)} className="p-2 md:p-3 bg-slate-900/50 border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all mr-2"><Menu size={20} /></button>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-b from-slate-800 to-slate-950 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/20 border border-white/10 animate-pulse overflow-hidden">
              {/* TÂM AN FIX: Cập nhật đầy đủ thông số FX cho Ảnh Đại Diện Góc Trái */}
              <div className="w-full h-full flex items-center justify-center" style={{ transform: `scale(${allCharacters.find(c => c.id === currentLaoPresetId)?.recommendedScale || 1})` }}>
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
                {/* Dropdown Menu on Hover */}
                <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col bg-slate-900/95 border border-white/10 rounded-xl p-1.5 shadow-2xl z-[200] min-w-[130px] backdrop-blur-md">
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
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                title="Dang nhap"
                className="p-2.5 rounded-xl border border-white/5 bg-slate-900/50 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40 hover:bg-indigo-900/20 transition-all flex items-center gap-1.5 text-xs font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                <span className="hidden sm:inline">Dang nhap</span>
              </button>
            )}
          </div>
        </header>

        <CharacterStage />

        <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 md:pb-6 flex flex-col items-center z-50 bg-gradient-to-t from-[#020617] to-transparent">
          {selectedImage && <div className="mb-3 relative animate-in slide-in-from-bottom-2"><img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border-2 border-orange-500 shadow-lg" /><button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1 shadow-lg hover:scale-110 transition-all"><X size={10} /></button></div>}
          
          {/* BỘ ĐẾM THỜI GIAN TĨNH TÂM - component riêng để tránh re-render NormalModePanel */}
          <IdleTimerDisplay />

          <div className="bg-slate-900/95 backdrop-blur-3xl border border-white/5 rounded-full p-1.5 md:p-2 flex items-center gap-2 shadow-2xl w-full max-w-xl overflow-hidden relative mt-1">
            <button data-tutorial="tut-mic" onClick={toggleMic} className={`p-6 md:p-6 rounded-full transition-all transform active:scale-95 relative ${isRecording ? 'bg-rose-500 text-white shadow-[0_0_40px_rgba(244,63,94,0.7)] scale-110' : 'bg-slate-800 text-slate-400 hover:text-rose-400'}`} title="Thưa hỏi Lão">
              <div className={`absolute inset-0 rounded-full border-[6px] border-rose-500/30 ${!isRecording ? 'animate-ping opacity-60' : ''}`}></div>
              <div className={`absolute inset-0 rounded-full bg-rose-500/10 ${!isRecording ? 'animate-pulse' : ''}`}></div>
              {isRecording ? <MicOff size={32} className="relative z-10" /> : <Mic size={32} className="relative z-10" />}
            </button>
            <button onClick={toggleCamera} className={`p-3 rounded-full transition-all ${cameraOn ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`} title="Mở tầm nhìn"><Camera size={18} /></button>
            <button onClick={() => fileInputRef.current?.click()} className="p-3 rounded-full bg-slate-800 text-slate-500 hover:text-white transition-all" title="Gửi ảnh"><ImageIcon size={18} /><input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} /></button>
            <div data-tutorial="tut-input" className="flex items-center bg-slate-800/40 rounded-full px-2 py-2 flex-1 md:w-[260px] border border-white/5 focus-within:border-orange-500/30 shadow-inner relative">
              <div className="relative">
              </div>
              <input 
                type="text" 
                placeholder="Con muốn thưa thỉnh..." 
                className="bg-transparent border-none outline-none flex-1 text-[11px] md:text-sm font-medium placeholder:text-slate-600 text-white min-w-0 pr-8" 
                value={localInputText} 
                onChange={(e: any) => setLocalInputText(e.target.value)} 
                onKeyDown={(e: any) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage(localInputText, inputEmotion);
                        setLocalInputText('');
                        setInputEmotion('calm');
                        setShowEmotionMenu(false);
                    }
                }} 
              />
              <button 
                data-tutorial="tut-refine" 
                onClick={() => handleRefineInput(localInputText)} 
                disabled={isRefining || !localInputText} 
                title="✨ Tinh lọc cốt lõi (Gỡ rối tơ lòng)" 
                className={`absolute right-10 p-1.5 transition-all ${localInputText && !isRefining ? 'text-amber-400 hover:scale-110' : 'text-slate-700 opacity-30 cursor-not-allowed'}`}
              >
                {isRefining ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Sparkles size={16} />}
              </button>
              <button 
                onClick={() => {
                    handleSendMessage(localInputText, inputEmotion);
                    setLocalInputText('');
                    setInputEmotion('calm');
                    setShowEmotionMenu(false);
                }} 
                className={`p-1.5 transition-all mr-1 ${localInputText || selectedImage ? 'text-orange-400 scale-110' : 'text-slate-700 opacity-20'}`}
              >
                <Send size={16} />
              </button>
            </div>
            <button onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} className={`p-3 rounded-full transition-all ${isVoiceEnabled ? 'bg-emerald-600/20 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>{isVoiceEnabled ? <Volume1 size={18} /> : <VolumeX size={18} />}</button>
          </div>
        </div>
      </div>

      <ChatHistorySidebar />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; } 
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; } 
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } 
        .animate-spin-slow { animation: spin-slow 50s linear infinite; }
        @keyframes radiate { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.6); opacity: 0; } }
        .animate-radiate { animation: radiate 3.5s ease-out infinite; }
        .animate-radiate-delayed { animation: radiate 3.5s ease-out infinite 1.75s; }
        .animate-radiate-slow { animation: radiate 5s ease-out infinite 1s; }
        @keyframes blink { 0%, 46%, 54%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.1); } }
        .animate-blink { animation: blink 4s infinite; transform-origin: 100px 92px; }
      `}</style>
      
      {/* MODAL AUTO-PILOT (XƯ�?NG PHIM TỰ ĐỘNG) */}
      {showAutoPilotModal && (
         <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex justify-center items-center p-4" onClick={() => !apState.isRunning && setShowAutoPilotModal(false)}>
            <div className="bg-slate-900 border border-rose-500/50 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-800 shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-transparent pointer-events-none"></div>
                    <h2 className="font-black text-rose-400 tracking-widest flex items-center gap-2 relative z-10 text-lg">
                        <Bot size={22}/> Xưởng Phim Tự Động (Auto-Pilot)
                    </h2>
                    {!apState.isRunning && <button onClick={() => setShowAutoPilotModal(false)} className="text-slate-400 hover:text-white relative z-10"><X size={24}/></button>}
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
                    
                    {/* BÊN TRÁI: CẤU HÌNH & NHẬP LIỆU */}
                    <div className={`w-full md:w-1/2 p-5 flex flex-col gap-4 overflow-y-auto border-r border-white/5 ${apState.isRunning ? 'opacity-50 pointer-events-none grayscale-[50%]' : ''}`}>
                        
                        <div className="bg-rose-900/20 border border-rose-500/30 p-4 rounded-xl flex flex-col gap-2">
                            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5"><ListOrdered size={16}/> Danh sách chủ đề cần sản xuất:</span>
                            <textarea 
                                value={apTopics}
                                onChange={e => setApTopics(e.target.value)}
                                placeholder="Nhập mỗi chủ đề 1 dòng...&#10;Hoặc bấm nút bên dưới để nhờ AI tìm trend."
                                className="w-full h-32 bg-slate-950 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-rose-500 outline-none resize-none font-mono"
                            />
                            <button 
                                onClick={handleFetchTrendingTopics}
                                disabled={apState.step === 'fetching_trends'}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 mt-1"
                            >
                                {apState.step === 'fetching_trends' ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                                {apState.step === 'fetching_trends' ? 'Đang phân tích dữ liệu MXH...' : 'Giao phó AI tự tìm chủ đề Hot/Viral'}
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 mt-1">
                            <span className="text-xs font-bold text-slate-300 border-b border-white/10 pb-1">Cấu hình xuất bản:</span>
                            
                            {/* KHỐI CẤU HÌNH GIỌNG ĐỌC & XƯNG HÔ CHO AUTO-PILOT */}
                            <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5 mt-1">
                                <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1"><Users size={12}/> Thiết lập nhân vật:</span>
                                
                                <div className="flex flex-col gap-1.5 mt-1 border-b border-white/5 pb-2">
                                   <div className="flex gap-2">
                                      <input type="text" value={customLaoName} onChange={e=>setCustomLaoName(e.target.value)} placeholder="Tên Lão" className="flex-[1.5] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" title="Tên Lão" />
                                      <input type="text" value={laoSelfCall} onChange={e=>setLaoSelfCall(e.target.value)} placeholder="Lão tự xưng" className="flex-[1] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" title="Lão tự xưng là gì" />
                                      <input type="text" value={laoCallUser} onChange={e=>setLaoCallUser(e.target.value)} placeholder="Lão gọi kia" className="flex-[1] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" title="Lão gọi người hỏi là gì" />
                                   </div>
                                   <div className="flex gap-2">
                                      <select value={laoVoice} onChange={e=>setLaoVoice(e.target.value)} className="flex-[1] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none">
                                          <optgroup label="🎙️ Nam"><option value="Algieba">Algieba</option><option value="Puck">Puck</option><option value="Charon">Charon</option></optgroup>
                                          <optgroup label="🎙️ Nữ"><option value="Aoede">Aoede</option><option value="Kore">Kore</option></optgroup>
                                      </select>
                                      <input type="text" value={laoVoiceStyle} onChange={e=>setLaoVoiceStyle(e.target.value)} placeholder="Phong cách Lão..." className="flex-[2] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" />
                                   </div>
                                </div>
                                
                                <div className="flex flex-col gap-1.5 mt-1">
                                   <div className="flex gap-2">
                                      <input type="text" value={customUserName} onChange={e=>setCustomUserName(e.target.value)} placeholder="Tên Con" className="flex-[1.5] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" title="Tên Người Hỏi" />
                                      <input type="text" value={userSelfCall} onChange={e=>setUserSelfCall(e.target.value)} placeholder="Con tự xưng" className="flex-[1] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" title="Người hỏi tự xưng là gì" />
                                      <input type="text" value={userCallLao} onChange={e=>setUserCallLao(e.target.value)} placeholder="Con gọi kia" className="flex-[1] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" title="Người hỏi gọi Lão là gì" />
                                   </div>
                                   <div className="flex gap-2">
                                      <select value={userVoice} onChange={e=>setUserVoice(e.target.value)} disabled={apSettings.charMode === 'random'} className="flex-[1] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none disabled:opacity-50">
                                          <optgroup label="🎙️ Nữ"><option value="Aoede">Aoede</option><option value="Kore">Kore</option></optgroup>
                                          <optgroup label="🎙️ Nam"><option value="Puck">Puck</option><option value="Charon">Charon</option></optgroup>
                                      </select>
                                      <input type="text" value={userVoiceStyle} onChange={e=>setUserVoiceStyle(e.target.value)} disabled={apSettings.charMode === 'random'} placeholder="Phong cách Con..." className="flex-[2] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none disabled:opacity-50" />
                                   </div>
                                </div>
                            </div>


                            <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5 mt-1">
                                <label className="text-[11px] font-bold text-slate-400">Độ dài kịch bản:</label>
                                <select 
                                    value={apSettings.scriptLength} 
                                    onChange={e => setApSettings(p => ({...p, scriptLength: e.target.value}))} 
                                    className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-lg outline-none text-xs focus:border-rose-500"
                                >
                                    <option value="Khoảng 4-6 câu">Ngắn (Khoảng 4-6 câu)</option>
                                    <option value="Khoảng 6-10 câu">Vừa (Khoảng 6-10 câu)</option>
                                    <option value="Khoảng 10-15 câu">Dài (Khoảng 10-15 câu)</option>
                                    <option value="Khoảng 15-21 câu">Rất dài (Khoảng 15-21 câu)</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                                <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5"><Sparkles size={14}/> Hiệu ứng chuyển cảnh (Transitions):</label>
                                <select 
                                    value={apSettings.transition} 
                                    onChange={e => setApSettings(p => ({...p, transition: e.target.value}))} 
                                    className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-lg outline-none text-xs focus:border-rose-500"
                                >
                                    <option value="none">Cắt cứng (Mặc định, Tắt hiệu ứng)</option>
                                    <option value="fade_black">Mờ đen (Dip to black)</option>
                                    <option value="fade_white">Chớp trắng (Flash)</option>
                                    <option value="blur">Lóa sáng tâm linh</option>
                                    <option value="random">Ngẫu nhiên tự động</option>
                                </select>
                                {apSettings.transition !== 'none' && (
                                    <div className="flex flex-col gap-1 mt-1 animate-in fade-in bg-slate-900 p-2.5 rounded-lg border border-white/5">
                                        <span className="text-[10px] text-slate-300 flex justify-between font-bold">Thời gian kéo dài: <span className="text-white">{apSettings.transitionDuration}s</span></span>
                                        <input type="range" min="0.1" max="2.0" step="0.1" value={apSettings.transitionDuration} onChange={e => setApSettings(p => ({...p, transitionDuration: Number(e.target.value)}))} className="accent-rose-500" />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                                <label className="text-[11px] font-bold text-slate-400">Chế độ sản xuất Video:</label>
                                <div className="flex gap-2">
                                    <label className={`flex-1 flex items-center justify-center text-center gap-1.5 p-2 rounded-lg cursor-pointer transition-all border ${apSettings.renderMode === 'fullframe' ? 'bg-rose-600/20 border-rose-500 text-rose-300' : 'border-white/10 text-slate-400 hover:bg-slate-700'}`}>
                                        <input type="radio" className="hidden" checked={apSettings.renderMode === 'fullframe'} onChange={() => setApSettings(p => ({...p, renderMode: 'fullframe'}))} />
                                        <span className="text-[10px] font-bold">Dựng Sẵn<br/><span className="font-normal text-[9px]">(Video Toàn Cảnh)</span></span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center text-center gap-1.5 p-2 rounded-lg cursor-pointer transition-all border ${apSettings.renderMode === '3d' ? 'bg-rose-600/20 border-rose-500 text-rose-300' : 'border-white/10 text-slate-400 hover:bg-slate-700'}`}>
                                        <input type="radio" className="hidden" checked={apSettings.renderMode === '3d'} onChange={() => setApSettings(p => ({...p, renderMode: '3d'}))} />
                                        <span className="text-[10px] font-bold">Cách Cũ<br/><span className="font-normal text-[9px]">(Phông Xanh 3D)</span></span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                                <label className="text-[11px] font-bold text-slate-400">Tỉ lệ Video:</label>
                                <div className="flex gap-2">
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${apSettings.orientation === '9x16' ? 'bg-rose-600/20 border-rose-500 text-rose-300' : 'border-white/10 text-slate-400 hover:bg-slate-700'}`}>
                                        <input type="radio" className="hidden" checked={apSettings.orientation === '9x16'} onChange={() => setApSettings(p => ({...p, orientation: '9x16'}))} />
                                        <Smartphone size={14}/> Dọc (9:16)
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${apSettings.orientation === '16x9' ? 'bg-rose-600/20 border-rose-500 text-rose-300' : 'border-white/10 text-slate-400 hover:bg-slate-700'}`}>
                                        <input type="radio" className="hidden" checked={apSettings.orientation === '16x9'} onChange={() => setApSettings(p => ({...p, orientation: '16x9'}))} />
                                        <Video size={14}/> Ngang (16:9)
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                                <label className="text-[11px] font-bold text-slate-400">Thiết lập nhân vật Người Hỏi:</label>
                                <div className="flex gap-2">
                                    <label className={`flex-1 flex items-center justify-center text-center gap-1.5 p-2 rounded-lg cursor-pointer transition-all border ${apSettings.charMode === 'match' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'border-white/10 text-slate-400 hover:bg-slate-700'}`}>
                                        <input type="radio" className="hidden" checked={apSettings.charMode === 'match'} onChange={() => setApSettings(p => ({...p, charMode: 'match'}))} />
                                        <span className="text-[10px]">Giữ cố định<br/>(Theo Hồ sơ)</span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center text-center gap-1.5 p-2 rounded-lg cursor-pointer transition-all border ${apSettings.charMode === 'random' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'border-white/10 text-slate-400 hover:bg-slate-700'}`}>
                                        <input type="radio" className="hidden" checked={apSettings.charMode === 'random'} onChange={() => setApSettings(p => ({...p, charMode: 'random'}))} />
                                        <span className="text-[10px]">Đổi ngẫu nhiên<br/>(Ẩn danh)</span>
                                    </label>
                                </div>
                                <p className="text-[9px] text-slate-500 mt-1 italic leading-relaxed">
                                    * Lão và Bối cảnh sẽ luôn được tự động xoay tua ngẫu nhiên để video không bị nhàm chán.
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto pt-4">
                            {!apState.isRunning ? (
                                <button onClick={startAutoPilot} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                                    <PlayCircle size={20}/> Khởi Động Xưởng Phim
                                </button>
                            ) : (
                                <button onClick={stopAutoPilot} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                                    <StopCircle size={20} className="text-rose-400"/> Dừng Khẩn Cấp
                                </button>
                            )}
                        </div>
                    </div>

                    {/* BÊN PHẢI: LOGS & STATUS */}
                    <div className="w-full md:w-1/2 bg-black flex flex-col">
                        <div className="p-3 bg-slate-900 border-b border-white/5 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tiến trình hoạt động</span>
                            {apState.isRunning && (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Đang chạy
                                </span>
                            )}
                        </div>
                        
                        <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col gap-2 scrollbar-hide">
                            {apState.logs.length === 0 ? (
                                <div className="text-slate-600 italic text-center mt-10">Hệ thống đang chờ lệnh...</div>
                            ) : (
                                apState.logs.map((log: any, idx: any) => {
                                    // Highlight màu tùy theo keyword để dễ đọc log
                                    let textColor = "text-slate-300";
                                    if (log.includes("--- BẮT ĐẦU")) textColor = "text-rose-400 font-bold";
                                    if (log.includes("✅")) textColor = "text-emerald-400 font-bold";
                                    if (log.includes("❌")) textColor = "text-red-400 font-bold";
                                    if (log.includes("Render")) textColor = "text-orange-300";
                                    
                                    return (
                                        <div key={idx} className={`border-b border-white/5 pb-1 ${textColor}`}>
                                            {log}
                                        </div>
                                    );
                                })
                            )}
                            {/* Auto scroll anchor */}
                            <div ref={(el) => { if(el) el.scrollIntoView({ behavior: "smooth" }) }}></div>
                        </div>

                        {apState.isRunning && (
                            <div className="p-4 bg-slate-900/80 border-t border-white/5 shrink-0 flex items-center gap-3">
                                <Loader2 size={18} className="text-rose-500 animate-spin shrink-0"/>
                                <div className="flex flex-col w-full">
                                    <span className="text-[10px] text-slate-400 font-bold">Chủ đề {apState.currentIndex + 1} / {apTopics.split('\n').filter((t: any) =>t.trim()).length}</span>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                                        <div 
                                            className="bg-rose-500 h-full transition-all duration-500" 
                                            style={{ width: `${(apState.currentIndex / Math.max(1, apTopics.split('\n').filter((t: any) =>t.trim()).length)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
         </div>
      )}


      {/* AUTH MODAL */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
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

    </div>
  );
};

export default NormalModePanel;
