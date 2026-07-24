"use client";

import React from 'react';
import { useOngLaoContext } from '../context/OngLaoContext';
import { updateChatSessionTypeAction } from '@/actions/chat';
import MiniLaoFace from './MiniLaoFace';
import { 
  X, MessageSquare, Loader2, Mic, Wand2, Video, Play, Pause, Square,
  Archive, ChevronDown, Sparkles, Share2 as ShareIcon, FileText, 
  Volume2, Copy, Pencil, Trash2, Check, XCircle, Download, Music, 
  Volume1, VolumeX, RefreshCw, ThumbsUp, ThumbsDown, HelpCircle, Upload 
} from 'lucide-react';

export const ChatHistorySidebar = () => {
  const p = useOngLaoContext();
  const {
    showHistory,
    setShowHistory,
    isRegeneratingAll,
    isExportingVideo,
    regenerationProgress,
    regenerationComplete,
    messages,
    allCharacters,
    currentLaoPresetId,
    laoAppearance,
    laoVisualType,
    processedLaoImages,
    chatLaoVideos,
    laoChromaSettings,
    isLaoSpeakingSession,
    enableAutoHarmonization,
    laoShadow,
    harmonizeSettings,
    charOffsets,
    currentlyPlayingId,
    EMOTIONS,
    editingEmotionId,
    setEditingEmotionId,
    updateCurrentMessages,
    editingId,
    setEditingId,
    tempEditText,
    setTempEditText,
    handleSaveEdit,
    handleStopCorrecting,
    copyToClipboard,
    playVoice,
    downloadAudio,
    creatingVoices,
    generateVoice,
    currentSessionId,
    currentSession,
    handleGenerateScriptVoices,
    handleSummarizeSession,
    setShowVideoExportModal,
    setVideoSlug,
    toggleGlobalPlay,
    isGlobalPlaying,
    isPreparingGlobal,
    globalProgress,
    handleGlobalSeek,
    formatTime,
    globalCurrentTime,
    globalDuration,
    showDownloadMenu,
    setShowDownloadMenu,
    showShareMenu,
    setShowShareMenu,
    downloadAllAudios,
    downloadCombinedAudio,
    shareTextContent,
    shareCombinedAudioFile,
    isLoggedIn,
    currentUser,
    handleLogout,
    setShowAuthModal,
    isThinking,
    chatEndRef
  } = p;

  const [copiedId, setCopiedId] = React.useState<any>(null);
  const [isDownloadingAllLocal, setIsDownloadingAllLocal] = React.useState(false);
  const [isSharingTextLocal, setIsSharingTextLocal] = React.useState(false);

  const messagesJson = JSON.stringify(messages.map((m: any) => ({ id: m.id, text: m.text })));
  React.useEffect(() => {
    if (chatEndRef?.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesJson, chatEndRef]);

  const [showSaveScriptModal, setShowSaveScriptModal] = React.useState(false);
  const [scriptTitle, setScriptTitle] = React.useState('');
  const [isSavingScript, setIsSavingScript] = React.useState(false);

  const handleSaveAsManualScript = async () => {
    if (!scriptTitle.trim()) return;
    setIsSavingScript(true);
    try {
       const title = scriptTitle.trim();
       const res = await updateChatSessionTypeAction(currentSessionId, 'chat|script', title);
       
       if (res.success) {
          // Update the local session state so it reflects the new title and script status
          if (p.setSessions) {
             p.setSessions((prev: any[]) => prev.map((s: any) => s.id === currentSessionId ? { ...s, title, type: 'chat|script' } : s));
          }
          if (p.showToastMsg) p.showToastMsg('Đã lưu cuộc trò chuyện này thành kịch bản!', 'success');
       } else {
          if (p.showToastMsg) p.showToastMsg('Lỗi: ' + res.error, 'error');
       }
       
       setShowSaveScriptModal(false);
       setScriptTitle('');
    } catch (err) {
       if (p.showToastMsg) p.showToastMsg('Lỗi khi lưu kịch bản.', 'error');
    } finally {
       setIsSavingScript(false);
    }
  };

  const handleCopy = (e: any, msg: any) => {
    e.stopPropagation();
    copyToClipboard(msg.text);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!showHistory) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-[60] w-full sm:w-80 md:w-[350px] bg-[#0a0f1e]/98 backdrop-blur-3xl border-l border-white/5 flex flex-col shadow-2xl transition-transform duration-500 md:relative md:translate-x-0">
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-3 font-black text-[11px] tracking-widest text-orange-400">
            <MessageSquare size={16} /> Pháp bảo khai thị
          </div>
          {currentSession?.title && (
            <span className="text-[10px] text-emerald-400 font-bold truncate max-w-[220px]" title={currentSession.title}>
              📖 {currentSession.title.replace(/^(\[AI\]|\[Thủ công\])?\s*/i, '').trim()}
            </span>
          )}
        </div>
        <button onClick={() => setShowHistory(false)} className="p-1 text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="px-5 py-3 border-b border-white/5 bg-slate-900/20 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <button 
             onClick={() => handleGenerateScriptVoices(currentSessionId)} 
             disabled={isRegeneratingAll || messages.filter((m: any) => !m.audioUrl).length === 0} 
             className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black border transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${regenerationComplete ? 'border-emerald-700 bg-emerald-900/40 text-emerald-400' : messages.filter((m: any) => !m.audioUrl).length > 0 ? 'border-emerald-500/50 bg-emerald-600 text-white hover:bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-indigo-700 bg-indigo-900/40 text-indigo-400 hover:text-indigo-300'}`}
          >
             {isRegeneratingAll ? (
                 <><Loader2 size={12} className="animate-spin" /> Tạo... {regenerationProgress}%</>
             ) : regenerationComplete ? (
                 <><Check size={12} /> Đã xong</>
             ) : (
                 <><Mic size={12} /> Tạo MP3 thiếu</>
             )}
          </button>
          {currentSession?.type?.includes('script') ? (
            <div className="w-full flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-xl text-[10px] font-black border border-emerald-800/80 bg-emerald-950/80 text-emerald-400 cursor-default select-none shadow-sm">
               <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Check size={12} className="text-emerald-400 shrink-0" /> Đã lưu kịch bản
               </div>
               {currentSession?.title && (
                  <span className="text-[9px] font-bold text-amber-300 truncate max-w-full italic px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md" title={currentSession.title}>
                     📖 {currentSession.title.replace(/^(\[AI\]|\[Thủ công\])?\s*/i, '').trim()}
                  </span>
               )}
            </div>
          ) : (
            <button onClick={() => setShowSaveScriptModal(true)} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black border border-emerald-700 bg-emerald-900/40 text-emerald-400 hover:text-emerald-300 transition-all shadow-lg">
               <Archive size={12} /> Lưu kịch bản
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
           <button onClick={handleSummarizeSession} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black border border-amber-700 bg-amber-900/40 text-amber-400 hover:text-amber-300 hover:bg-amber-900/60 transition-all shadow-lg">
              <Wand2 size={14} /> ✨ Đúc kết kệ pháp
           </button>
            <button onClick={() => {
               if (messages.length === 0) {
                  if (p.showToastMsg) p.showToastMsg('Vui lòng trò chuyện để tạo kịch bản trước khi tạo video.', 'error');
                  return;
               }
               const hasAudio = messages.some((m: any) => m.audioUrl);
               if (!hasAudio) {
                  if (p.showToastMsg) p.showToastMsg('Kịch bản chưa có âm thanh để tạo video. Vui lòng bấm "Tạo MP3 thiếu" trước!', 'error');
                  return;
               }
               if (setVideoSlug) setVideoSlug('createvideo');
               setShowVideoExportModal(true);
            }} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black border border-pink-700 bg-pink-900/40 text-pink-400 hover:text-pink-300 hover:bg-pink-900/60 transition-all shadow-lg">
               <Video size={14} /> Tạo video
            </button>
        </div>

        <div className="w-full bg-slate-900/60 rounded-xl p-3 border border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[9px] font-bold text-emerald-400 tracking-widest">
            <span>Phát toàn bộ đàm đạo</span>
            {isPreparingGlobal && <Loader2 size={10} className="animate-spin" />}
          </div>
          <div className="flex items-center gap-3">
             <button onClick={toggleGlobalPlay} className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white transition-all shadow-md shrink-0">
               {isGlobalPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
             </button>
             <div className="flex-1 flex flex-col gap-1">
               <input type="range" min="0" max="100" value={globalProgress} onChange={handleGlobalSeek} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
               <div className="flex justify-between text-[8px] text-slate-400 font-mono font-medium tracking-wider">
                 <span>{formatTime(globalCurrentTime)}</span>
                 <span>{formatTime(globalDuration)}</span>
               </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="relative w-full">
            <button onClick={(e: any) => { e.stopPropagation(); setShowDownloadMenu(!showDownloadMenu); setShowShareMenu(false); }} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[9px] font-black border border-slate-700 bg-slate-800 text-slate-400 hover:text-orange-400 transition-all">
              <Archive size={14} /> Tải MP3 <ChevronDown size={12} />
            </button>
            {showDownloadMenu && (
              <div className="absolute top-full left-0 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-1 z-50 shadow-xl flex flex-col gap-1">
                 <button onClick={(e: any) => { 
                    e.stopPropagation(); 
                    setIsDownloadingAllLocal(true);
                    if (typeof downloadAllAudios === 'function') downloadAllAudios();
                    else if (p.downloadAllAudios) p.downloadAllAudios();
                    setTimeout(() => setIsDownloadingAllLocal(false), messages.length * 400 + 1000);
                 }} disabled={isDownloadingAllLocal} className="text-[10px] p-2 hover:bg-slate-700 rounded text-left text-white font-medium flex items-center gap-1.5 disabled:opacity-50">
                    {isDownloadingAllLocal ? <Loader2 size={10} className="animate-spin" /> : <FileText size={10} />}
                    {isDownloadingAllLocal ? 'Đang chuẩn bị...' : 'Từng đoạn rời rạc'}
                 </button>
                 <button onClick={(e: any) => { 
                    e.stopPropagation(); 
                    if (typeof downloadCombinedAudio === 'function') downloadCombinedAudio();
                    else if (p.downloadCombinedAudio) p.downloadCombinedAudio();
                 }} disabled={isPreparingGlobal} className="text-[10px] p-2 hover:bg-slate-700 rounded text-left text-emerald-400 font-medium flex items-center gap-1.5 disabled:opacity-50">
                    {isPreparingGlobal ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10}/>}
                    {isPreparingGlobal ? 'Đang xử lý...' : 'Gộp 1 file chung'}
                 </button>
              </div>
            )}
          </div>

          <div className="relative w-full">
            <button onClick={(e: any) => { 
                e.stopPropagation(); 
                let content = `Lời khai thị từ Lão - ${p.currentSession?.title || "Hội thoại"}:\n\n`;
                messages.forEach((msg: any) => { content += `${msg.role === 'user' ? "Con" : "Lão"}: ${msg.text}\n\n`; });
                copyToClipboard(content);
            }} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[9px] font-black border border-slate-700 bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all">
              <Copy size={14} /> Copy toàn bộ văn bản
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-10 scrollbar-hide">
        {(isRegeneratingAll || isExportingVideo) && (
           <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-300 flex items-center justify-between gap-3 animate-pulse shadow-md shrink-0">
              <div className="flex items-center gap-2">
                 <Loader2 size={14} className="animate-spin text-amber-400 shrink-0" />
                 <span>
                    {isExportingVideo 
                       ? "🎬 Hệ thống đang render clip đọc... Vui lòng không đóng trang." 
                       : `🎙️ Đang tạo toàn bộ pháp âm còn thiếu... (${regenerationProgress}%)`}
                 </span>
              </div>
           </div>
        )}
        
        {messages.length === 0 && (
           <div className="flex flex-col items-center justify-center h-full text-slate-700 text-center opacity-30">
             <div className="w-16 h-16 mb-4 animate-pulse rounded-full overflow-hidden border border-white/5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full" style={{ transform: `scale(${allCharacters.find((c: any) => c.id === currentLaoPresetId)?.recommendedScale || 1})` }}>
                   <MiniLaoFace className="w-full h-full opacity-60" appearance={laoAppearance} visualType={laoVisualType} customImages={processedLaoImages} customVideos={chatLaoVideos} chromaSettings={laoChromaSettings} flipped={charOffsets.lao.flip} isSpeakingSession={isLaoSpeakingSession} enableFX={enableAutoHarmonization} shadowConfig={laoShadow} harmonizeSettings={harmonizeSettings} />
                </div>
             </div>
             <p className="text-[10px] font-bold tracking-widest leading-loose">Quay về nhận ra<br/>Bản thể chân thật</p>
           </div>
        )}
        {messages.map((msg: any) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group animate-in fade-in`}>
            {msg.role === 'user' ? (
              <div className="flex flex-col items-end gap-2 w-full">
                <div className={`relative flex items-center gap-1.5 mb-[-4px] mr-2 ${editingEmotionId === msg.id ? 'z-[100]' : 'z-20'}`}>
                    <span className="text-[10px] text-slate-500 font-medium">Con</span>
                    <select
                        value={msg.emotion || 'calm'}
                        onChange={(e: any) => updateCurrentMessages((prev: any) => prev.map((m: any) => m.id === msg.id ? { ...m, emotion: e.target.value } : m))}
                        className="bg-slate-800/80 border border-white/10 hover:border-white/20 rounded-lg px-2 py-1 text-[10px] text-slate-300 transition-colors outline-none cursor-pointer"
                        title="Thay đổi cảm xúc"
                    >
                        {Object.entries(EMOTIONS).map(([key, val]: any) => (
                            <option key={key} value={key} className="bg-slate-800 text-white text-xs">
                                {val}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="max-w-[90%] p-4 rounded-[1.8rem] text-[13px] bg-orange-600 text-white rounded-tr-none shadow-lg relative group/msg transition-all">
                  {msg.imageUrl && <img src={msg.imageUrl} className="w-full h-32 object-cover rounded-xl mb-2" alt="Sent" />}
                  {msg.isCorrecting ? (
                         <>
                           <span className="whitespace-pre-line text-white/70">{msg.text}</span>
                           <div className="flex items-center gap-3 mt-2.5 bg-orange-700/50 p-1.5 rounded-full pr-3 border border-orange-500/30">
                             <span className="text-[10px] text-orange-200 italic animate-pulse pl-2 font-medium">✨ Đang gọt giũa câu từ...</span>
                             <button onClick={(e: any) => { e.stopPropagation(); handleStopCorrecting(msg.id, msg.text); }} className="text-[9px] bg-rose-500 text-white hover:bg-rose-400 px-3 py-1 rounded-full shadow-md font-bold transition-all transform hover:scale-105 flex items-center gap-1 tracking-wider"><X size={10} strokeWidth={3} /> Dừng</button>
                           </div>
                         </>
                      ) : (
                         <div className="flex flex-col w-full">
                           <span className="whitespace-pre-line">{msg.text}</span>
                           <div className="flex items-center justify-start gap-5 mt-4 pt-4 border-t border-white/20">
                             <button onClick={(e: any) => handleCopy(e, msg)} className={`transition-colors ${copiedId === msg.id ? 'text-emerald-400' : 'text-orange-200 hover:text-white'}`} title="Copy văn bản">
                                {copiedId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                             </button>
                             <button onClick={(e: any) => { e.stopPropagation(); setEditingId(msg.id); setTempEditText(msg.text); }} className="text-orange-200 hover:text-white transition-colors" title="Sửa nội dung"><Pencil size={14} /></button>
                           </div>
                         </div>
                      )}
                </div>
                <div className="flex flex-wrap justify-end items-center gap-3 mt-1 px-3">
                  {(msg.audioUrl || currentlyPlayingId === msg.id) ? (
                    <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-1">
                      <button onClick={() => playVoice(msg.audioUrl, msg.id, 'user')} className={`flex items-center gap-1.5 text-[9px] font-bold text-slate-400 hover:text-orange-400 ${currentlyPlayingId === msg.id ? 'text-orange-400' : ''}`}>
                        {currentlyPlayingId === msg.id ? (
                          <>
                            <Square size={12} fill="currentColor" /> Dừng
                          </>
                        ) : (
                          <>
                            <Play size={12} fill="currentColor" /> Nghe lại
                          </>
                        )}
                      </button>
                      {msg.audioUrl && <button onClick={() => downloadAudio(msg.audioUrl, `ConThua_${msg.id}`)} className="text-slate-400 hover:text-emerald-400"><Download size={12} /></button>}
                    </div>
                  ) : (
                    <button onClick={() => generateVoice(msg.id, msg.text, 'user', currentSessionId, false)} disabled={creatingVoices[msg.id]} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 hover:text-orange-400 disabled:opacity-30">
                      {creatingVoices[msg.id] ? <Loader2 size={10} className="animate-spin" /> : <Music size={10} />}Tạo tiếng lòng
                    </button>
                  )}
                  <button onClick={() => generateVoice(msg.id, msg.text, 'user', currentSessionId, true)} disabled={creatingVoices[msg.id]} className="text-[9px] font-bold text-slate-600 hover:text-indigo-400 flex items-center gap-1">
                    <RefreshCw size={10} /> Tạo lại
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start w-full gap-3">
                 <div className={`relative flex items-center gap-1.5 mb-[-8px] ml-4 ${editingEmotionId === msg.id ? 'z-[100]' : 'z-20'}`}>
                    <select
                        value={msg.emotion || 'calm'}
                        onChange={(e: any) => updateCurrentMessages((prev: any) => prev.map((m: any) => m.id === msg.id ? { ...m, emotion: e.target.value } : m))}
                        className="bg-slate-800/80 border border-white/10 hover:border-white/20 rounded-lg px-2 py-1 text-[10px] text-slate-300 transition-colors outline-none cursor-pointer"
                        title="Thay đổi cảm xúc"
                    >
                        {Object.entries(EMOTIONS).map(([key, val]: any) => (
                            <option key={key} value={key} className="bg-slate-800 text-white text-xs">
                                {val}
                            </option>
                        ))}
                    </select>
                 </div>

                 <div className="max-w-[95%] p-5 rounded-[2rem] text-[13.5px] bg-slate-800/80 text-slate-200 border border-white/5 rounded-tl-none relative overflow-hidden group/ai transition-all hover:bg-slate-800">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50"></div>
                    
                    <div className="flex flex-col w-full">
                       <span className="whitespace-pre-line leading-relaxed">{msg.text}</span>
                       <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10 text-slate-400 relative z-50">
                         <button type="button" className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-all cursor-pointer" title="Tuyệt vời"><ThumbsUp size={14} /></button>
                         <button type="button" className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-all cursor-pointer" title="Chưa tốt"><ThumbsDown size={14} /></button>
                         <button type="button" className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-all cursor-pointer" title="Giải thích thêm"><HelpCircle size={14} /></button>
                         <button type="button" className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-all cursor-pointer" title="Chia sẻ"><Upload size={14} /></button>
                         <button type="button" onClick={(e: any) => handleCopy(e, msg)} className={`p-1.5 rounded transition-all cursor-pointer flex items-center justify-center ${copiedId === msg.id ? 'text-emerald-400 bg-emerald-400/10' : 'hover:bg-white/10 hover:text-white'}`} title="Copy văn bản">
                           {copiedId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                         </button>
                         <button type="button" onClick={(e: any) => { e.preventDefault(); e.stopPropagation(); setEditingId(msg.id); setTempEditText(msg.text); }} className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-all cursor-pointer flex items-center justify-center" title="Sửa nội dung"><Pencil size={14} /></button>
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-wrap items-center gap-3 px-3">
                    {(msg.audioUrl || currentlyPlayingId === msg.id) ? (
                      <div className="flex items-center gap-3 bg-slate-900/50 rounded-full px-3 py-1">
                         <button onClick={() => playVoice(msg.audioUrl, msg.id, 'ai')} className={`flex items-center gap-1.5 text-[9px] font-bold text-slate-400 hover:text-emerald-400 ${currentlyPlayingId === msg.id ? 'text-emerald-400' : ''}`}>
                           {currentlyPlayingId === msg.id ? (
                             <>
                               <Square size={12} fill="currentColor" /> Dừng
                             </>
                           ) : (
                             <>
                               <Play size={12} fill="currentColor" /> Nghe lại
                             </>
                           )}
                         </button>
                         {msg.audioUrl && <button onClick={() => downloadAudio(msg.audioUrl, `LaoDay_${msg.id}`)} className="text-slate-400 hover:text-emerald-400"><Download size={12} /></button>}
                      </div>
                    ) : (
                      <button onClick={() => generateVoice(msg.id, msg.text, 'ai', currentSessionId, false)} disabled={creatingVoices[msg.id]} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 hover:text-emerald-400 disabled:opacity-30">
                        {creatingVoices[msg.id] ? <Loader2 size={10} className="animate-spin" /> : <Music size={10} />}Tạo pháp âm
                      </button>
                    )}
                    <button onClick={() => generateVoice(msg.id, msg.text, 'ai', currentSessionId, true)} disabled={creatingVoices[msg.id]} className="text-[9px] font-bold text-slate-600 hover:text-indigo-400 flex items-center gap-1">
                      <RefreshCw size={10} /> Tạo lại
                    </button>
                 </div>
              </div>
            )}
          </div>
        ))}
        {isThinking && (
          <div className="flex flex-col items-start w-full gap-2 group animate-in fade-in slide-in-from-bottom-2">
            <span className="text-[10px] text-slate-500 font-medium ml-4">Lão đang suy nghĩ...</span>
            <div className="max-w-[70%] p-4 bg-slate-800/60 text-slate-400 border border-white/5 rounded-[2rem] rounded-tl-none relative overflow-hidden flex items-center gap-1.5 pl-5">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50 animate-pulse"></div>
              <div className="w-2.5 h-2.5 bg-orange-400/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2.5 h-2.5 bg-orange-400/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2.5 h-2.5 bg-orange-400/80 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {showSaveScriptModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
           <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-sm p-5 shadow-2xl">
              <h3 className="text-white font-bold mb-4">Lưu thành kịch bản thủ công</h3>
              <input 
                 type="text" 
                 autoFocus
                 placeholder="Nhập tên kịch bản..." 
                 value={scriptTitle}
                 onChange={e => setScriptTitle(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 mb-4"
              />
              <div className="flex justify-end gap-3">
                 <button onClick={() => setShowSaveScriptModal(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">Hủy</button>
                 <button onClick={handleSaveAsManualScript} disabled={!scriptTitle.trim() || isSavingScript} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-white font-bold shadow-md transition-all flex items-center gap-2">
                    {isSavingScript ? <Loader2 size={16} className="animate-spin" /> : <Archive size={16} />} Lưu
                 </button>
              </div>
           </div>
        </div>
      )}
      {editingId && (
        <div className="fixed inset-0 z-[400] bg-black/75 backdrop-blur-md flex justify-center items-center p-4">
           <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                 <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Pencil size={16} className="text-orange-500" />
                    Hiệu chỉnh nội dung thưa thỉnh & khai thị
                 </h3>
                 <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white transition-colors">
                    <X size={18} />
                 </button>
              </div>
              
              <textarea
                 className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-xs md:text-sm text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 min-h-[300px] shadow-inner font-medium leading-relaxed resize-y"
                 value={tempEditText}
                 onChange={(e: any) => setTempEditText(e.target.value)}
                 autoFocus
              />
              
              <div className="flex gap-3 justify-end mt-2">
                 <button 
                    onClick={() => setEditingId(null)} 
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                 >
                    Hủy bỏ
                 </button>
                 <button 
                    onClick={() => handleSaveEdit(editingId)} 
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                 >
                    <Check size={14} />
                    Lưu thay đổi
                 </button>
              </div>
           </div>
        </div>
      )}
    </aside>
  );
};
export default ChatHistorySidebar;
