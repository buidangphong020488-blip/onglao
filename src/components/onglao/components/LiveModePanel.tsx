// @ts-nocheck
"use client";
import React from "react";
import { Users, X, Mic, MicOff, Play, Pause, SkipForward, Loader2, Volume2, VolumeX, Settings, RefreshCw, Maximize2, Minimize2, Music4, ArrowRight, PlayCircle, ChevronRight, ChevronLeft, Eye, EyeOff, MessageSquare, Bot, Sparkles, Zap, Clock, List, LayoutGrid, Settings2, StopCircle, RotateCcw, History, Info, Upload, Sliders, FlipHorizontal, FileText, Film, Plus } from "lucide-react";
import MiniLaoFace from "./MiniLaoFace";
import YouTubeLivePlayer, { getYoutubeId } from "./YouTubeLivePlayer";

import { useOngLaoContext } from "../context/OngLaoContext";

// LiveModePanel: Nhận toàn bộ state/handlers qua context
const LiveModePanel = () => {
  const p = useOngLaoContext();
  const { isLiveMode } = p;
  if (!isLiveMode) return null;

  // Destructure tất cả biến từ props bundle
  const {
    bgmAudioData, bgmVolume, liveBgmAudioRef, liveBgmResumeTimerRef,
    setIsLiveMode, setIsLiveActive, setIsLiveGuestMicActive, setIsLiveIdlePlaying,
    liveQueueRef, setLiveQueueLength, setLiveCurrentQuestion,
    showLiveSettings, setShowLiveSettings, isLiveActive, setIsLiveActive: _setActive,
    liveCurrentQuestion, liveCommentBox, setLiveCommentBox,
    liveShowSubtitles, setLiveShowSubtitles, liveSubPos, setLiveSubPos,
    liveMicBoxY, setLiveMicBoxY, isLiveGuestMicActive,
    currentLaoPresetId, allCharacters, applyCharacterPreset, handleChangeChatLao,
    setLaoIsFullScreen, laoIsFullScreen,
    charOffsets, setCharOffsets,
    liveIdleVideos, setLiveIdleVideos, currentLiveIdleVideoIndex, setCurrentLiveIdleVideoIndex,
    isLiveIdlePlaying, isIdleVideoPaused, liveIdlePlayerRef, liveIdleYtPlayerRef,
    liveIdleTimeout, setLiveIdleTimeout, showLaoPiP, setShowLaoPiP,
    idleVideoProgress, setIdleVideoProgress, idleVideoCurrentTime,
    showYtForm, setShowYtForm, ytFormData, setYtFormData,
    bgmVolume: _bgmVol, setBgmAudioData, DEFAULT_BGM_LIST, removeBgm,
    handleUploadBgm, handleUploadLiveLaoFolder, showLiveUploadGuide,
    handleSkipCurrentLive, skipShortcutModifier, setSkipShortcutModifier,
    skipShortcutKey, setSkipShortcutKey, showLiveHistory, setShowLiveHistory,
    liveQueueLength, isLiveActive: _isActive,
    showToastMsg, formatTime, getYoutubeId,
    // Live queue & response
    setBgmVolume,
    customBgs,
    laoAppearance,
    laoVisualType,
    processedLaoImages,
    laoChromaSettings,
    enableAutoHarmonization,
    laoShadow,
    harmonizeSettings,
    messages,
    isLaoSpeakingSession,
    playingMsg,
    mouthOpen,
    laoCustomVideos,
  } = p;

  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
          <div className="w-screen h-screen bg-[#00ff00] flex items-center justify-center relative overflow-hidden group">
              
              {/* TRÌNH PHÁT NHẠC NỀN (BGM) TRONG CHẾ ĐỘ LIVE */}
              {bgmAudioData && bgmAudioData.url && (
                  <audio 
                      src={bgmAudioData.url} 
                      autoPlay 
                      loop 
                      ref={el => { 
                          liveBgmAudioRef.current = el; // Bắt Ref để ra lệnh play/pause
                          if(el) el.volume = bgmVolume; 
                      }} 
                      className="hidden" 
                  />
              )}

              {/* Nút thoát chỉ hiện ra khi rê chuột vào, để không bị dính vào OBS */}
              <button 
                  onClick={() => { 
                      setIsLiveMode(false); 
                      setIsLiveActive(false); 
                      setIsLiveGuestMicActive(false); // TÂM AN FIX: Tắt Mic khách mời khi thoát
                      setIsLiveIdlePlaying(false); // Thoát khỏi phim nếu đang phát
                      liveQueueRef.current = []; 
                      setLiveQueueLength(0); // TÂM AN THÊM: Reset bộ đếm
                      setLiveCurrentQuestion(null); 
                      // Hủy hẹn giờ và tắt nhạc khi thoát Live
                      if (liveBgmResumeTimerRef.current) clearTimeout(liveBgmResumeTimerRef.current);
                      if (liveBgmAudioRef.current) liveBgmAudioRef.current.pause();
                  }} 
                  className="absolute top-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-lg border border-white/20"
              >
                  <ArrowRight size={16} className="inline mr-2 rotate-180"/> Thoát chế độ Live OBS
              </button>
              
              {/* TÂM AN THÊM: NÚT ẨN/HIỆN BẢNG CÀI ĐẶT DÀNH CHO MOBILE */}
              <button 
                  onClick={() => setShowLiveSettings(!showLiveSettings)}
                  className={`absolute top-4 right-4 z-[60] bg-slate-900/80 text-white p-2.5 md:p-3 rounded-full border border-white/20 shadow-xl backdrop-blur-md transition-all opacity-60 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100`}
                  title="Ẩn/Hiện Bảng Cài Đặt"
              >
                  {showLiveSettings ? <X size={20}/> : <Settings2 size={20}/>}
              </button>

              {/* BẢNG ĐIỀU KHIỂN ĐẠO DI�??N (Hiện khi chưa Live, hoặc khi di chuột vào lúc đang Live) */}
              <div className={`absolute top-16 md:top-4 right-4 bottom-4 z-50 transition-all duration-300 ease-in-out flex flex-col gap-3 w-[320px] max-w-[90vw] overflow-y-auto scrollbar-hide pb-6 
                  ${showLiveSettings ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-[120%] opacity-0 pointer-events-none'} 
                  ${isLiveActive && showLiveSettings ? 'md:opacity-0 md:group-hover:opacity-100' : ''}`}>
                  
                  {/* NÚT BẬT/TẮT LIVESTREAM (TÂM AN THÊM MỚI) */}
                  <div className={`bg-slate-900/95 border p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3 shrink-0 transition-all ${isLiveActive ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-rose-500/50 shadow-[0_0_20px_rgba(225,29,72,0.2)]'}`}>
                      <div className="flex flex-col gap-1 text-center">
                          <h3 className="text-xs font-black uppercase tracking-widest text-white">
                              {isLiveActive ? '🟢 Đang Phát Sóng' : '🔴 Chờ Thiết Lập'}
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                              {isLiveActive 
                                  ? 'Lão đang lắng nghe bình luận. Rê chuột ra ngoài khoảng đen để ẩn bảng này cho OBS thu hình.' 
                                  : 'Hãy căn chỉnh vị trí Lão, chọn bối cảnh, ánh sáng. Khi nào sẵn sàng thì bấm nút bên dưới.'}
                          </p>
                      </div>
                      <button
                          onClick={() => {
                              setIsLiveActive(!isLiveActive);
                              if (!isLiveActive) {
                                  // Khi vừa bấm bật, reset hàng đợi cũ nếu có
                                  liveQueueRef.current = [];
                                  setLiveCurrentQuestion(null);
                              }
                          }}
                          className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex justify-center items-center gap-2 transform active:scale-95 ${
                              isLiveActive
                              ? 'bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-rose-500/30 hover:border-transparent'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                          }`}
                      >
                          {isLiveActive ? <><StopCircle size={16} className="text-rose-500" /> Dừng Live</> : <><PlayCircle size={16}/> Bắt Đầu Livestream</>}
                      </button>

                      {/* TÂM AN THÊM: NÚT BỎ QUA VÀ CÀI ĐẶT PHÍM TẮT (CHỈ HIỆN KHI ĐANG LIVE) */}
                      {isLiveActive && (
                          <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-white/10 animate-in fade-in">
                              <button 
                                  onClick={handleSkipCurrentLive}
                                  className="w-full py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/50 text-rose-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                              >
                                  <RotateCcw size={14}/> Bỏ Qua Câu Hiện Tại
                              </button>
                              <div className="flex items-center justify-between mt-1">
                                  <span className="text-[9px] text-slate-400">Phím tắt bỏ qua:</span>
                                  <div className="flex gap-1">
                                      <select 
                                          value={skipShortcutModifier} 
                                          onChange={e => setSkipShortcutModifier(e.target.value)}
                                          className="bg-slate-800 border border-white/10 rounded px-1.5 py-1 text-[9px] text-white outline-none"
                                      >
                                          <option value="None">Không</option>
                                          <option value="Shift">Shift +</option>
                                          <option value="Ctrl">Ctrl +</option>
                                          <option value="Alt">Alt +</option>
                                      </select>
                                      <input 
                                          type="text" 
                                          value={skipShortcutKey}
                                          onChange={e => setSkipShortcutKey(e.target.value.toUpperCase())}
                                          maxLength={10}
                                          className="w-12 bg-slate-800 border border-white/10 rounded px-1.5 py-1 text-[9px] text-white text-center outline-none focus:border-rose-500"
                                      />
                                  </div>
                              </div>
                              <button 
                                  onClick={() => setShowLiveHistory(true)}
                                  className="w-full py-2 mt-1 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/50 text-indigo-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                              >
                                  <History size={14}/> Xem Lịch Sử Hỏi Đáp
                              </button>
                          </div>
                      )}
                  </div>

                  {/* 0. CHỌN HÌNH TƯỚNG LÃO */}
                  <div className="bg-slate-900/95 border border-pink-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3 shrink-0">
                      <h3 className="text-xs font-bold text-pink-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Users size={14}/> Hình tướng Lão khai thị</span>
                      </h3>
                      <select
                          className="w-full bg-slate-800 border border-white/10 text-xs px-2 py-2.5 rounded-lg outline-none text-white focus:border-pink-500 cursor-pointer"
                          value={currentLaoPresetId}
                          onChange={(e: any) => {
                              if (e.target.value !== 'custom_live_lao') {
                                  const char = allCharacters.find(c => c.id === e.target.value);
                                  if (char) {
                                      applyCharacterPreset(char, 'lao');
                                      handleChangeChatLao(char.id); // Đồng bộ cho cả khung chat
                                      if (char.defaultLiveFullScreen !== undefined) {
                                          setLaoIsFullScreen(char.defaultLiveFullScreen);
                                      } else {
                                          setLaoIsFullScreen(false);
                                      }
                                  }
                              }
                          }}
                      >
                          {currentLaoPresetId === 'custom_live_lao' && <option value="custom_live_lao">✨ Nhân vật tải lên từ máy</option>}
                          {allCharacters.filter((c: any) => c.role === 'lao' || (c.isLocal && c.role === 'lao')).map((char: any) => (
                              <option key={char.id} value={char.id}>{char.name}</option>
                          ))}
                      </select>

                      <div className="flex gap-1.5 flex-wrap justify-end border-t border-white/10 pt-3 mt-1">
                          <input 
                              type="file" 
                              multiple 
                              accept="video/*" 
                              className="hidden" 
                              id="upload-live-lao-input"
                              onChange={handleUploadLiveLaoFolder} 
                          />
                          <button 
                              onClick={showLiveUploadGuide}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1.5 rounded text-[9px] font-bold transition-all flex items-center gap-1 shadow-md shrink-0 border border-white/5"
                              title="Xem hướng dẫn đặt tên file"
                          >
                              <Info size={10}/> Cách đặt tên
                          </button>
                          <button 
                              onClick={() => document.getElementById('upload-live-lao-input')?.click()}
                              className="bg-pink-600 hover:bg-pink-500 text-white px-2 py-1.5 rounded text-[9px] font-bold transition-all flex items-center gap-1 shadow-md shrink-0"
                              title="Tải video Lão từ máy tính lên Livestream"
                          >
                              <Upload size={10}/> Tải Lão từ máy tính
                          </button>
                      </div>
                  </div>

                  {/* 1. KÍCH THƯỚC & VỊ TRÍ NHÂN VẬT */}
                  <div className="bg-slate-900/95 border border-indigo-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3 shrink-0">
                      <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5"><Sliders size={14}/> Vị trí & Kích thước Lão</h3>
                          <button onClick={() => setCharOffsets((prev: any) => ({...prev, lao: {...prev.lao, flip: !prev.lao.flip}}))} className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${charOffsets.lao.flip ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-white/10'}`}>
                             <FlipHorizontal size={10} className="inline mr-1" /> Lật
                          </button>
                      </div>
                      <div className="flex flex-col gap-2.5">
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Ngang (X)</span> <span className="text-indigo-300">{charOffsets.lao.x}</span></span>
                             <input type="range" min="-100" max="100" value={charOffsets.lao.x} onChange={e => setCharOffsets(p => ({...p, lao: {...p.lao, x: Number(e.target.value)}}))} className="accent-indigo-500" />
                         </div>
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Dọc (Y)</span> <span className="text-indigo-300">{charOffsets.lao.y}</span></span>
                             <input type="range" min="-100" max="100" value={charOffsets.lao.y} onChange={e => setCharOffsets(p => ({...p, lao: {...p.lao, y: Number(e.target.value)}}))} className="accent-indigo-500" />
                         </div>
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Thu phóng (Scale)</span> <span className="text-indigo-300">x{charOffsets.lao.s.toFixed(2)}</span></span>
                             <input type="range" min="0.5" max="5" step="0.05" value={charOffsets.lao.s} onChange={e => setCharOffsets(p => ({...p, lao: {...p.lao, s: Number(e.target.value)}}))} className="accent-indigo-500" />
                         </div>
                      </div>
                      <div className="flex flex-col mt-1 pt-2 border-t border-white/10 gap-1.5">
                          <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-indigo-400">Phủ kín toàn màn hình</span>
                              <button 
                                  onClick={() => setLaoIsFullScreen(!laoIsFullScreen)} 
                                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${laoIsFullScreen ? 'bg-indigo-500' : 'bg-slate-700'}`}
                              >
                                  <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${laoIsFullScreen ? 'translate-x-3' : 'translate-x-0'}`} />
                              </button>
                          </div>
                          <p className="text-[9px] text-slate-400 italic leading-relaxed">
                              * Dành cho Video Lão tải lên từ máy tính đã có sẵn cảnh nền. (Hãy nhớ tắt Bóng dưới chân và Tắt Xóa nền).
                          </p>
                      </div>
                  </div>

                  {/* VỊ TRÍ KHUNG BÌNH LUẬN KHÁN GIẢ */}
                  <div className="bg-slate-900/95 border border-purple-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3 shrink-0">
                      <h3 className="text-xs font-bold text-purple-400 flex items-center gap-1.5"><MessageSquare size={14}/> Khung Bình Luận Khán Giả</h3>
                      <div className="flex flex-col gap-2.5">
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Ngang (X)</span> <span className="text-purple-300">{liveCommentBox.x}</span></span>
                             <input type="range" min="-100" max="100" value={liveCommentBox.x} onChange={e => setLiveCommentBox(p => ({...p, x: Number(e.target.value)}))} className="accent-purple-500" />
                         </div>
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Dọc (Y)</span> <span className="text-purple-300">{liveCommentBox.y}</span></span>
                             <input type="range" min="-100" max="100" value={liveCommentBox.y} onChange={e => setLiveCommentBox(p => ({...p, y: Number(e.target.value)}))} className="accent-purple-500" />
                         </div>
                         <div className="grid grid-cols-2 gap-2">
                             <div className="flex flex-col gap-1">
                                 <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Độ rộng khung</span> <span className="text-purple-300">{liveCommentBox.w}px</span></span>
                                 <input type="range" min="300" max="1500" step="50" value={liveCommentBox.w} onChange={e => setLiveCommentBox(p => ({...p, w: Number(e.target.value)}))} className="accent-purple-500" />
                             </div>
                             <div className="flex flex-col gap-1">
                                 <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Thu phóng</span> <span className="text-purple-300">x{liveCommentBox.s.toFixed(2)}</span></span>
                                 <input type="range" min="0.5" max="2.5" step="0.05" value={liveCommentBox.s} onChange={e => setLiveCommentBox(p => ({...p, s: Number(e.target.value)}))} className="accent-purple-500" />
                             </div>
                         </div>
                      </div>

                      {/* TÂM AN THÊM: NÚT BẬT/TẮT VÀ ĐIỀU CHỈNH PHỤ ĐỀ */}
                      <div className="mt-1 pt-3 border-t border-purple-500/30 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1.5"><FileText size={12}/> Phụ đề khi Lão nói</span>
                              <button 
                                  onClick={() => setLiveShowSubtitles(!liveShowSubtitles)} 
                                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${liveShowSubtitles ? 'bg-purple-500' : 'bg-slate-700'}`}
                              >
                                  <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${liveShowSubtitles ? 'translate-x-3' : 'translate-x-0'}`} />
                              </button>
                          </div>
                          {liveShowSubtitles && (
                              <div className="grid grid-cols-2 gap-2 mt-1 animate-in fade-in bg-slate-950 p-2 rounded-lg border border-white/5">
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Ngang (X)</span> <span className="text-purple-300">{liveSubPos.x}vw</span></span>
                                      <input type="range" min="-50" max="50" value={liveSubPos.x} onChange={e => setLiveSubPos(p => ({...p, x: Number(e.target.value)}))} className="accent-purple-500" title="Kéo vị trí phụ đề Trái/Phải" />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Dọc (Y)</span> <span className="text-purple-300">{liveSubPos.y}vh</span></span>
                                      <input type="range" min="0" max="90" value={liveSubPos.y} onChange={e => setLiveSubPos(p => ({...p, y: Number(e.target.value)}))} className="accent-purple-500" title="Kéo vị trí phụ đề Lên/Xuống" />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Độ rộng</span> <span className="text-purple-300">{liveSubPos.w}%</span></span>
                                      <input type="range" min="30" max="100" value={liveSubPos.w} onChange={e => setLiveSubPos(p => ({...p, w: Number(e.target.value)}))} className="accent-purple-500" title="Điều chỉnh chiều ngang của khung phụ đề" />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Phóng to</span> <span className="text-purple-300">x{liveSubPos.s.toFixed(2)}</span></span>
                                      <input type="range" min="0.5" max="3" step="0.05" value={liveSubPos.s} onChange={e => setLiveSubPos(p => ({...p, s: Number(e.target.value)}))} className="accent-purple-500" title="Phóng to hoặc Thu nhỏ chữ và khung" />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Viền chữ (Outline)</span> <span className="text-purple-300">{liveSubPos.outline}px</span></span>
                                      <input type="range" min="0" max="5" step="0.1" value={liveSubPos.outline} onChange={e => setLiveSubPos(p => ({...p, outline: Number(e.target.value)}))} className="accent-purple-500" title="Điều chỉnh độ dày của viền đen bao quanh chữ" />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Tỏa bóng (Shadow)</span> <span className="text-purple-300">{liveSubPos.shadow}px</span></span>
                                      <input type="range" min="0" max="40" step="1" value={liveSubPos.shadow} onChange={e => setLiveSubPos(p => ({...p, shadow: Number(e.target.value)}))} className="accent-purple-500" title="Điều chỉnh độ đậm của vùng bóng đen sau chữ" />
                                  </div>
                              </div>
                          )}
                      </div>
                      
                      {/* NÚT BẬT/TẮT TƯƠNG TÁC GIỌNG NÓI KHÁCH MỜI */}
                      <div className="mt-1 pt-3 border-t border-purple-500/30 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1.5"><Mic size={12}/> Tương tác Khách mời (Voice)</span>
                              <button 
                                  onClick={() => setIsLiveGuestMicActive(!isLiveGuestMicActive)} 
                                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isLiveGuestMicActive ? 'bg-purple-500' : 'bg-slate-700'}`}
                              >
                                  <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isLiveGuestMicActive ? 'translate-x-3' : 'translate-x-0'}`} />
                              </button>
                          </div>
                          {isLiveGuestMicActive && (
                              <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-1.5 text-[9px] text-purple-300 bg-purple-900/30 px-2 py-1.5 rounded animate-pulse border border-purple-500/30">
                                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Đang chạy ngầm quét giọng khách mời...
                                  </div>
                                  <div className="flex flex-col gap-1 mt-1">
                                      <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Vị trí Dọc (Đèn Mic)</span> <span className="text-purple-300">{liveMicBoxY}vh</span></span>
                                      <input type="range" min="0" max="100" value={liveMicBoxY} onChange={e => setLiveMicBoxY(Number(e.target.value))} className="accent-purple-500" />
                                  </div>
                              </div>
                          )}
                          <p className="text-[8.5px] text-slate-400 italic leading-relaxed">
                              * Hướng dẫn: Trong lúc phát phim, Mic vẫn mở để đón khách. Để gọi Lão trả lời, khách chỉ cần nói 1 trong 6 lệnh: <b className="text-purple-300">"Ông Lão", "Ông Nội", "cho hỏi", "muốn hỏi", "con hỏi", "dừng phim"</b>. Lưu ý: BẮT BUỘC dùng tai nghe hoặc phần mềm tách luồng âm thanh (VB-Cable) để Mic không thu nhầm tiếng của phim nhé.
                          </p>
                      </div>

                      {!isLiveActive && (
                          <button 
                              onClick={() => {
                                  if (liveCurrentQuestion) {
                                      setLiveCurrentQuestion(null);
                                  } else {
                                      setLiveCurrentQuestion({username: 'Người Ẩn Danh', comment: 'Dạ Lão ơi, đây là câu hỏi thử nghiệm xem độ dài hiển thị trên màn hình như thế nào để Lão tiện bề sắp xếp góc máy và vị trí cho hợp lý ạ. Khi chữ quá dài thì khung này sẽ tự động ép xuống dòng gọn gàng.'});
                                  }
                              }} 
                              className="mt-1 bg-purple-600/20 hover:bg-purple-600 border border-purple-500/50 text-purple-300 hover:text-white text-[10px] py-2 rounded-lg transition-colors font-bold"
                          >
                              {liveCurrentQuestion ? 'Ẩn bình luận thử' : 'Thử hiển thị bình luận'}
                          </button>
                      )}
                  </div>

                  {/* KHO PHIM PHÁT CHỜ (IDLE VIDEOS) */}
                  <div className="bg-slate-900/95 border border-cyan-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3 shrink-0">
                      <h3 className="text-xs font-bold text-cyan-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Film size={14}/> Phim Phát Chờ</span>
                          <div className="flex items-center gap-1">
                              <button onClick={() => setShowYtForm(!showYtForm)} className={`border text-[9px] px-2 py-1 rounded transition-colors font-bold flex items-center gap-1 ${showYtForm ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-cyan-600/20 hover:bg-cyan-600 border-cyan-500/50 text-cyan-300 hover:text-white'}`}>
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                  YouTube
                              </button>
                              <button onClick={() => document.getElementById('upload-live-idle-input')?.click()} className="bg-cyan-600/20 hover:bg-cyan-600 border border-cyan-500/50 text-cyan-300 hover:text-white text-[9px] px-2 py-1 rounded transition-colors font-bold flex items-center gap-1">
                                  <Plus size={10}/> Tải máy
                              </button>
                          </div>
                      </h3>
                      
                      {/* FORM NHẬP YOUTUBE */}
                      {showYtForm && (
                          <div className="bg-slate-950 p-3 rounded-lg border border-cyan-500/30 flex flex-col gap-2 animate-in slide-in-from-top-2">
                              <input type="text" value={ytFormData.url} onChange={e => setYtFormData({...ytFormData, url: e.target.value})} placeholder="Dán Link hoặc Đoạn mã Nhúng <iframe> vào đây..." className="w-full bg-slate-900 border border-white/10 rounded p-2 text-[10px] text-white outline-none focus:border-cyan-500" />
                              <div className="flex gap-2">
                                  <input type="text" value={ytFormData.name} onChange={e => setYtFormData({...ytFormData, name: e.target.value})} placeholder="Tên Phim (VD: Chú Tiểu)" className="flex-1 bg-slate-900 border border-white/10 rounded p-2 text-[10px] text-white outline-none focus:border-cyan-500" />
                                  <input type="text" value={ytFormData.topic} onChange={e => setYtFormData({...ytFormData, topic: e.target.value})} placeholder="Chủ đề (VD: Nhân quả)" className="flex-1 bg-slate-900 border border-white/10 rounded p-2 text-[10px] text-white outline-none focus:border-cyan-500" />
                              </div>
                              <button 
                                  onClick={() => {
                                      const ytId = getYoutubeId(ytFormData.url);
                                      if (!ytId) { showToastMsg('Link hoặc Mã nhúng YouTube không hợp lệ.', 'error'); return; }
                                      if (!ytFormData.name) { showToastMsg('Vui lòng nhập Tên phim để AI gọi.', 'error'); return; }
                                      
                                      const newVid = { id: Date.now(), name: ytFormData.name, topic: ytFormData.topic || 'Khác', ytId: ytId, type: 'youtube' };
                                      setLiveIdleVideos((prev: any) => [...prev, newVid]);
                                      setYtFormData({ url: '', name: '', topic: '' });
                                      setShowYtForm(false);
                                      showToastMsg('Đã thêm phim YouTube thành công!', 'success');
                                  }}
                                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded py-1.5 text-[10px] font-bold transition-all"
                              >
                                  Xác nhận Thêm
                              </button>
                          </div>
                      )}

                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-white/5">
                          <span className="text-[10px] font-bold text-slate-300">Tự bật sau thời gian vắng lặng:</span>
                          <div className="flex items-center gap-1">
                              <input type="number" min="5" max="300" value={liveIdleTimeout} onChange={e => setLiveIdleTimeout(Number(e.target.value))} className="w-10 bg-slate-800 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-1 py-0.5 rounded outline-none text-center" />
                              <span className="text-[10px] text-slate-400">giây</span>
                          </div>
                      </div>
                      
                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-white/5 mt-1">
                          <span className="text-[10px] font-bold text-slate-300">Hiện Lão góc dưới khi chiếu phim:</span>
                          <button 
                              onClick={() => setShowLaoPiP(!showLaoPiP)} 
                              className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showLaoPiP ? 'bg-cyan-500' : 'bg-slate-700'}`}
                          >
                              <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showLaoPiP ? 'translate-x-3' : 'translate-x-0'}`} />
                          </button>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto scrollbar-hide mt-2">
                          {liveIdleVideos.map((vid, idx) => (
                              <div key={vid.id} 
                                   onClick={() => {
                                       setCurrentLiveIdleVideoIndex(idx);
                                       setIsLiveIdlePlaying(true);
                                       if (liveBgmAudioRef.current) liveBgmAudioRef.current.pause();
                                   }}
                                   className={`flex items-center justify-between bg-slate-800 p-2 rounded-lg border cursor-pointer hover:border-cyan-400/50 transition-colors ${idx === currentLiveIdleVideoIndex && isLiveIdlePlaying ? 'border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'border-white/5'}`}>
                                  <span className="text-[10px] text-slate-300 truncate w-3/4 flex flex-col gap-0.5">
                                      <span className="flex items-center gap-1.5 font-bold">
                                          {idx === currentLiveIdleVideoIndex && isLiveIdlePlaying && !isIdleVideoPaused ? <Play size={10} className="text-cyan-400 shrink-0"/> : null}
                                          {vid.type === 'youtube' && <span className="bg-red-600 text-white px-1 rounded-[3px] text-[7px] uppercase shrink-0">YT</span>}
                                          <span className="truncate">{vid.name}</span>
                                      </span>
                                      {vid.topic && <span className="text-[8px] text-cyan-400/80 italic truncate ml-[18px]">C.đề: {vid.topic}</span>}
                                  </span>
                                  <button onClick={(e: any) => {
                                      e.stopPropagation();
                                      if (vid.url) URL.revokeObjectURL(vid.url);
                                      setLiveIdleVideos((prev: any) => prev.filter((v: any) => v.id !== vid.id));
                                      if (idx === currentLiveIdleVideoIndex) setIsLiveIdlePlaying(false);
                                  }} className="text-rose-400 hover:text-rose-300 p-1"><X size={12}/></button>
                              </div>
                          ))}
                      </div>

                      {/* Bảng điều khiển phim */}
                      {liveIdleVideos.length > 0 && (
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-cyan-500/30 flex flex-col gap-2 mt-1">
                              <div className="flex items-center justify-between text-[9px] text-cyan-400 font-bold truncate">
                                  <span>{isLiveIdlePlaying ? 'Đang phát:' : 'Đã dừng:'} {liveIdleVideos[currentLiveIdleVideoIndex]?.name || '...'}</span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                  <button onClick={() => {
                                      const currentVid = liveIdleVideos[currentLiveIdleVideoIndex];
                                      const isYt = currentVid?.type === 'youtube';

                                      if (isYt) {
                                          if (liveIdleYtPlayerRef.current) {
                                              if (isLiveIdlePlaying && !isIdleVideoPaused) {
                                                  liveIdleYtPlayerRef.current.pause();
                                              } else {
                                                  const p = liveIdleYtPlayerRef.current.play(); if (p) p.catch(()=>{});
                                                  setIsLiveIdlePlaying(true);
                                                  if (liveBgmAudioRef.current) liveBgmAudioRef.current.pause();
                                              }
                                          } else {
                                              setIsLiveIdlePlaying(!isLiveIdlePlaying);
                                          }
                                      } else {
                                          if (liveIdlePlayerRef.current) {
                                              if (isLiveIdlePlaying && !liveIdlePlayerRef.current.paused) {
                                                  liveIdlePlayerRef.current.pause();
                                              } else {
                                                  const p = liveIdlePlayerRef.current.play(); if(p) p.catch(()=>{});
                                                  setIsLiveIdlePlaying(true);
                                                  if (liveBgmAudioRef.current) liveBgmAudioRef.current.pause();
                                              }
                                          } else {
                                              setIsLiveIdlePlaying(!isLiveIdlePlaying);
                                          }
                                      }
                                  }} className="text-white hover:text-cyan-400 bg-slate-800 p-1.5 rounded-full transition-colors">
                                      {isLiveIdlePlaying && !isIdleVideoPaused ? <Pause size={12} fill="currentColor"/> : <Play size={12} fill="currentColor"/>}
                                  </button>

                                  <button onClick={() => {
                                      setCurrentLiveIdleVideoIndex((prev) => (prev + 1) % liveIdleVideos.length);
                                      setIsLiveIdlePlaying(true);
                                  }} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors">
                                      <ArrowRight size={12}/>
                                  </button>
                                  
                                  <input
                                      type="range" min="0" max="100" value={idleVideoProgress || 0}
                                      onChange={(e: any) => {
                                          const pct = parseFloat(e.target.value);
                                          setIdleVideoProgress(pct);
                                          const currentVid = liveIdleVideos[currentLiveIdleVideoIndex];
                                          
                                          if (currentVid?.type === 'youtube') {
                                              if (liveIdleYtPlayerRef.current) {
                                                  const dur = liveIdleYtPlayerRef.current.getDuration();
                                                  if (dur > 0) {
                                                      liveIdleYtPlayerRef.current.seek((pct / 100) * dur);
                                                  }
                                              }
                                          } else {
                                              if (liveIdlePlayerRef.current && liveIdlePlayerRef.current.duration) {
                                                  liveIdlePlayerRef.current.currentTime = (pct / 100) * liveIdlePlayerRef.current.duration;
                                              }
                                          }
                                      }}
                                      className="flex-1 accent-cyan-500 h-1.5 bg-slate-800 rounded-full cursor-pointer appearance-none"
                                  />
                                  <span className="text-[9px] text-slate-400 font-mono shrink-0 w-8 text-right">
                                      {formatTime(idleVideoCurrentTime)}
                                  </span>
                              </div>
                          </div>
                      )}
                      
                      <input type="file" multiple accept="video/*" id="upload-live-idle-input" className="hidden" onChange={(e: any) => {
                          const files = Array.from(e.target.files);
                          if (files.length === 0) return;
                          const newVids = files.map((f: any) => ({ id: Date.now() + Math.random(), name: f.name, topic: 'Phim tải lên', url: URL.createObjectURL(f), type: 'local' }));
                          setLiveIdleVideos((prev: any) => [...prev, ...newVids]);
                          e.target.value = '';
                      }}/>
                  </div>

                  {/* NHẠC NỀN */}
                  <div className="bg-slate-900/95 border border-amber-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3 shrink-0">
                      <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5"><Music4 size={14}/> Nhạc Nền (BGM)</h3>
                          <button onClick={() => document.getElementById('live-bgm-upload-input')?.click()} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-white/10 text-[9px] font-bold flex items-center gap-1 transition-colors">
                              <Upload size={10}/> Tải File
                          </button>
                          <input type="file" id="live-bgm-upload-input" className="hidden" accept="audio/*" onChange={handleUploadBgm} />
                      </div>
                      <select
                          className="w-full bg-slate-800 border border-white/10 text-xs px-2 py-2.5 rounded-lg outline-none text-white focus:border-amber-500 cursor-pointer"
                          value={bgmAudioData?.isPreset ? DEFAULT_BGM_LIST.find(m => m.url === bgmAudioData.url)?.id || '' : ''}
                          onChange={(e: any) => {
                              if (!e.target.value) { removeBgm(); return; }
                              const selected = DEFAULT_BGM_LIST.find(m => m.id === e.target.value);
                              if (selected && selected.url && selected.url !== 'DÁN_LINK_NHẠC_CỦA_CON_VÀO_ĐÂY.mp3') {
                                  setBgmAudioData({ url: selected.url, name: selected.name, isPreset: true });
                              }
                          }}
                      >
                          <option value="">-- Tắt nhạc nền --</option>
                          {DEFAULT_BGM_LIST.filter((m: any) => m.url && m.url !== 'DÁN_LINK_NHẠC_CỦA_CON_VÀO_ĐÂY.mp3').map((bgm: any) => (
                              <option key={bgm.id} value={bgm.id}>{bgm.name}</option>
                          ))}
                      </select>
                      
                      {bgmAudioData && !bgmAudioData.isPreset && (
                         <div className="flex items-center justify-between w-full bg-amber-900/30 border border-amber-500/30 rounded-lg p-2 mt-1">
                           <span className="text-[10px] text-amber-400 font-bold truncate pr-2 max-w-[180px]">{bgmAudioData.name}</span>
                           <button onClick={removeBgm} className="text-rose-400 hover:text-rose-300 bg-rose-500/10 p-1 rounded"><X size={12}/></button>
                         </div>
                      )}

                      {bgmAudioData && (
                          <div className="flex flex-col gap-1 mt-1">
                             <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Âm lượng:</span> <span className="text-amber-300">{Math.round(bgmVolume * 100)}%</span></span>
                             <input type="range" min="0" max="1" step="0.05" value={bgmVolume} onChange={e => setBgmVolume(Number(e.target.value))} className="accent-amber-500" />
                          </div>
                      )}
                  </div>
              </div>

              {/* LỚP NỀN (BACKGROUNDS) ĐỒNG BỘ TỪ KHO RENDER */}
              {customBgs.length > 0 && (
                  <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-black">
                       {customBgs.filter((bg: any) => bg.visible !== false).map((bg: any) => (
                          <div key={bg.id} className="absolute inset-0 flex items-center justify-center"
                               style={{
                                   transform: `translate(${bg.x}%, ${bg.y}%) scale(${bg.s}) ${bg.flip ? 'scaleX(-1)' : ''}`,
                               }}>
                               {bg.type === 'video' ? (
                                    <video src={bg.url || null} autoPlay loop muted={bg.muted} playsInline className="w-full h-full object-cover" ref={el => { if (el) el.volume = bg.volume !== undefined ? bg.volume : 1; }} />
                               ) : (
                                   <img src={bg.url || null} className="w-full h-full object-cover" alt="bg" />
                               )}
                          </div>
                       ))}
                  </div>
              )}

              <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
                  
                  {/* Bảng hiển thị câu hỏi cho khán giả xem (TÂM AN FIX GIAO DIỆN TÙY CHỈNH) */}
                  <div 
                      className={`absolute z-40 transition-all duration-700 pointer-events-none ${liveCurrentQuestion && !isLiveIdlePlaying ? 'opacity-100' : 'opacity-0'}`}
                      style={{
                          left: '50%',
                          top: '50%',
                          width: `${liveCommentBox.w}px`,
                          transform: `translate(calc(-50% + ${liveCommentBox.x}vw), calc(-50% + ${liveCommentBox.y}vh)) scale(${liveCommentBox.s})`
                      }}
                  >
                      {liveCurrentQuestion && !isLiveIdlePlaying && (
                          <div className="bg-slate-900/90 border-2 border-orange-500 rounded-2xl p-5 shadow-[0_0_40px_rgba(249,115,22,0.3)] relative flex flex-col items-center text-center mx-auto w-full">
                              <div className="absolute -top-4 bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-black tracking-widest uppercase shadow-lg truncate max-w-[90%] flex items-center gap-2">
                                  <span className="truncate">{liveCurrentQuestion.username === 'Khách Mời' ? 'Câu Hỏi:' : `${liveCurrentQuestion.username} hỏi:`}</span>
                                  {liveQueueLength > 0 && (
                                      <span className="bg-white text-orange-600 px-1.5 py-0.5 rounded-full text-[10px] font-black shadow-inner shrink-0 animate-pulse">
                                          +{liveQueueLength} chờ
                                      </span>
                                  )}
                              </div>
                              <p className="text-white text-2xl font-bold leading-relaxed mt-2 break-words w-full">
                                  "{liveCurrentQuestion.comment}"
                              </p>
                          </div>
                      )}
                  </div>

                  {/* TÂM AN: BẢNG HIỂN THỊ TRẠNG THÁI MIC CHO KHÁCH MỜI */}
                  {isLiveGuestMicActive && (
                      <div className="absolute left-1/2 -translate-x-1/2 z-[80] transition-all duration-500 pointer-events-none" style={{ top: `${liveMicBoxY}vh` }}>
                          {guestMicStatus === 'listening' ? (
                              <div className="bg-emerald-900/80 border-2 border-emerald-500/50 rounded-full px-6 py-2.5 shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top-4">
                                  <div className="relative flex items-center justify-center w-4 h-4">
                                      <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></span>
                                      <Mic size={16} className="text-emerald-400 relative z-10" />
                                  </div>
                                  <span className="text-emerald-50 text-sm font-black tracking-widest uppercase">Mời Đặt Câu hỏi...</span>
                              </div>
                          ) : guestMicStatus === 'busy' ? (
                              <div className="bg-rose-900/80 border-2 border-rose-500/50 rounded-full px-6 py-2.5 shadow-[0_0_30px_rgba(225,29,72,0.4)] flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top-4">
                                  <MicOff size={16} className="text-rose-400" />
                                  <span className="text-rose-50 text-sm font-black tracking-widest uppercase opacity-80">Lão đang trả lời...</span>
                              </div>
                          ) : null}
                      </div>
                  )}

                  {/* TÂM AN THÊM: PHỤ ĐỀ KHI LÃO NÓI TRONG LIVESTREAM (SYNC TỪNG CÂU) */}
                  <div 
                      className={`absolute z-[85] transition-all duration-300 pointer-events-none flex flex-col items-center ${liveShowSubtitles && isLaoSpeakingSession && playingMsg && playingMsg.text && !isLiveIdlePlaying ? 'opacity-100' : 'opacity-0'}`}
                      style={{ 
                          bottom: `${liveSubPos.y}vh`,
                          left: `calc(50% + ${liveSubPos.x}vw)`,
                          width: `${liveSubPos.w}vw`,
                          transform: `translate(-50%, 0)`
                      }}
                  >
                      {isLaoSpeakingSession && playingMsg && (
                          <div className="w-full relative flex flex-col items-center text-center" style={{ transform: `scale(${liveSubPos.s})`, transformOrigin: 'bottom center' }}>
                              <p 
                                  id="live-subtitle-text" 
                                  className="text-amber-300 font-black text-2xl md:text-3xl leading-relaxed whitespace-pre-line min-h-[2rem] px-4"
                                  style={{
                                      textShadow: `0 2px 4px rgba(0,0,0,0.9), 0 0 ${liveSubPos.shadow}px rgba(0,0,0,1), 0 0 ${liveSubPos.shadow + 10}px rgba(0,0,0,0.9)`,
                                      WebkitTextStroke: `${liveSubPos.outline}px rgba(0,0,0,0.9)`
                                  }}
                              >
                                  {currentLiveSubTextRef.current || "Đang kết nối tâm thanh..."}
                              </p>
                          </div>
                      )}
                  </div>
                  
                  {/* CONTAINER NHÂN VẬT LÃO ĐỒNG BỘ TOẠ ĐỘ & QUANG ẢNH */}
                  <div
                      className={`flex items-center justify-center pointer-events-none transition-all duration-700 ease-in-out ${
                          isLiveIdlePlaying 
                              ? `absolute bottom-8 right-8 z-[70] bg-slate-900/60 backdrop-blur-md rounded-2xl border-2 border-orange-500/30 shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden ${!showLaoPiP ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100'}` 
                              : `z-20 opacity-100 ${laoIsFullScreen ? 'absolute inset-0 w-full h-full' : 'relative'}`
                      }`}
                      style={
                          isLiveIdlePlaying ? {
                              // TÂM AN FIX: Thu nhỏ Lão về góc phải dưới (PiP) khi đang phát phim
                              width: '320px',
                              height: '320px',
                              transform: 'translate(0, 0) scale(1)'
                          } : (laoIsFullScreen ? {
                              // Chế độ Fullscreen phủ kín OBS
                              transform: `translate(${charOffsets.lao.x}vw, ${charOffsets.lao.y}vh) scale(${charOffsets.lao.s})`
                          } : {
                              // Chế độ nhân vật tách nền mặc định
                              transform: `translate(${charOffsets.lao.x * 12}px, ${charOffsets.lao.y * 12}px) scale(${charOffsets.lao.s * 1.0})`,
                              width: '800px',
                              height: '1066px'
                          })
                      }
                  >
                      {/* Thẻ trạng thái báo hiệu Lão đang nghe (Chỉ hiện lúc thu nhỏ góc màn hình) */}
                      <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-black/60 px-3 py-1 rounded-full border border-white/10 text-white font-bold text-[10px] whitespace-nowrap transition-opacity duration-500 ${isLiveIdlePlaying ? 'opacity-100' : 'opacity-0'}`}>
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block mr-1.5 animate-pulse"></span> Lão đang lắng nghe...
                      </div>

                      {/* TÂM AN FIX: Thẻ trạng thái Lão đang nói màu hồng (Chỉ hiện khi tắt phụ đề và Lão đang nói) */}
                      <div className={`absolute top-10 md:top-12 left-1/2 -translate-x-1/2 z-50 bg-pink-600/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-pink-400/50 text-white font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-all duration-500 shadow-[0_0_20px_rgba(219,39,119,0.6)] flex items-center gap-2 ${isLaoSpeakingSession && !liveShowSubtitles && !isLiveIdlePlaying ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                          <Sparkles size={12} className="animate-pulse"/> 
                          Lão đang nói
                      </div>

                      <MiniLaoFace 
                          className="w-full h-full drop-shadow-2xl overflow-visible" 
                          mouthOpen={mouthOpen} 
                          appearance={laoAppearance} 
                          visualType={laoVisualType} 
                          customImages={processedLaoImages} 
                          customVideos={laoCustomVideos} // Dùng Video nét cao từ Render thay vì Video Chat
                          chromaSettings={laoChromaSettings} 
                          flipped={charOffsets.lao.flip} 
                          isSpeakingSession={isLaoSpeakingSession} 
                          enableFX={enableAutoHarmonization} // Đồng bộ bật/tắt FX
                          shadowConfig={laoShadow} // Đồng bộ bóng tiếp xúc
                          harmonizeSettings={harmonizeSettings} // Đồng bộ tông màu
                          isFullScreen={laoIsFullScreen && !isLiveIdlePlaying} // TÂM AN FIX: Hủy object-cover khi đang ở dạng PiP
                      />
                  </div>

                  {/* LỚP VIDEO PHIM PHÁT CHỜ (NẰM TRÊN CÙNG KHI KÍCH HOẠT) */}
                  {isLiveIdlePlaying && liveIdleVideos.length > 0 && (
                      <div className="absolute inset-0 z-[60] bg-black flex items-center justify-center animate-in fade-in duration-500 pointer-events-auto">
                      {liveIdleVideos[currentLiveIdleVideoIndex]?.type === 'youtube' ? (
                          <YouTubeLivePlayer 
                                  key={`yt_${liveIdleVideos[currentLiveIdleVideoIndex].id}`} // TÂM AN FIX TỐI THƯỢNG: Ép React tạo mới iframe khi chuyển bài Youtube
                                  ref={liveIdleYtPlayerRef}
                                  videoId={liveIdleVideos[currentLiveIdleVideoIndex].ytId} 
                                  onEnded={handleIdleVideoEnded} 
                                  onProgress={(ct: any, dur: any) => {
                                      setIdleVideoCurrentTime(ct);
                                      setIdleVideoProgress((ct / dur) * 100);
                                  }}
                                  onErrorMsg={(msg: any) => showToastMsg(msg, 'error', 8000)}
                                  onPlayStateChange={(isPaused: any) => setIsIdleVideoPaused(isPaused)}
                              />
                          ) : (
                              <video 
                                  ref={liveIdlePlayerRef}
                                  src={liveIdleVideos[currentLiveIdleVideoIndex]?.url || null} 
                                  autoPlay 
                                  className="w-full h-full object-contain bg-black"
                                  onLoadedMetadata={(e: any) => {
                                      setIdleVideoProgress(0);
                                      setIdleVideoCurrentTime(0);
                                  }}
                                  onTimeUpdate={(e: any) => {
                                      if (e.target.duration) {
                                          setIdleVideoCurrentTime(e.target.currentTime);
                                          setIdleVideoProgress((e.target.currentTime / e.target.duration) * 100);
                                      }
                                  }}
                                  onPlay={() => setIsIdleVideoPaused(false)}
                                  onPause={() => setIsIdleVideoPaused(true)}
                                  onEnded={handleIdleVideoEnded}
                              />
                          )}
                      </div>
                  )}

              </div>

              {/* TÂM AN THÊM MỚI: BẢNG LỊCH SỬ LIVESTREAM TRƯỢT TỪ BÊN PHẢI */}
              <aside className={`fixed inset-y-0 right-0 z-[100] w-full sm:w-80 md:w-[350px] bg-slate-900/95 backdrop-blur-3xl border-l border-indigo-500/30 flex flex-col shadow-2xl transition-transform duration-500 ${showLiveHistory ? 'translate-x-0' : 'translate-x-full'}`}>
                  <div className="p-4 border-b border-indigo-500/30 flex justify-between items-center bg-slate-800/80">
                      <h3 className="font-black text-indigo-400 tracking-widest text-sm flex items-center gap-2"><History size={16}/> Lịch sử Livestream</h3>
                      <button onClick={() => setShowLiveHistory(false)} className="text-slate-400 hover:text-rose-400 transition-colors p-1"><X size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide pb-20">
                      {messages.length === 0 ? (
                          <div className="text-center text-slate-500 italic text-xs mt-10">Chưa có dữ liệu hỏi đáp nào trong phiên này.</div>
                      ) : (
                          messages.map((msg: any) => (
                              <div key={`live_hist_${msg.id}`} className={`p-3 rounded-xl border flex flex-col gap-2 ${msg.role === 'ai' ? 'bg-slate-800/40 border-white/5' : 'bg-indigo-900/10 border-indigo-500/20'}`}>
                                  <div className="flex justify-between items-start">
                                      <span className={`text-[10px] font-black uppercase tracking-wider ${msg.role === 'ai' ? 'text-orange-400' : 'text-emerald-400'}`}>
                                          {msg.role === 'ai' ? 'Lão khai thị:' : 'Khán giả hỏi:'}
                                      </span>
                                      {msg.role === 'user' && (
                                          <button
                                              onClick={() => {
                                                  // TÂM AN NÂNG CẤP: Tái sử dụng Audio đã tạo (0ms)
                                                  const msgIndex = messages.findIndex((m: any) => m.id === msg.id);
                                                  let aiResponseMsg = null;
                                                  for (let i = msgIndex + 1; i < messages.length; i++) {
                                                      if (messages[i].role === 'ai') { aiResponseMsg = messages[i]; break; }
                                                      else if (messages[i].role === 'user') break;
                                                  }

                                                  if (aiResponseMsg && aiResponseMsg.cachedPrefetch) {
                                                      const cached = aiResponseMsg.cachedPrefetch;
                                                      livePrefetchQueueRef.current.push({
                                                          ...cached,
                                                          liveUsername: cached.liveUsername.includes('(Hỏi Lại)') ? cached.liveUsername : `${cached.liveUsername} (Hỏi Lại)`
                                                      });
                                                      setLiveQueueLength(liveQueueRef.current.length + livePrefetchQueueRef.current.length);
                                                      if (!isLiveProcessingRef.current && processLiveQueueRef.current) processLiveQueueRef.current();
                                                      showToastMsg('⚡ Đã phát lại thần tốc lời Lão từ bộ nhớ đệm!', 'success');
                                                  } else {
                                                      // Đẩy ngược câu hỏi này vào hàng đợi Live nếu không có cache
                                                      liveQueueRef.current.push({ username: 'Khán giả (Hỏi Lại)', comment: msg.text });
                                                      setLiveQueueLength(liveQueueRef.current.length + livePrefetchQueueRef.current.length);
                                                      startPrefetchWorker();
                                                      if (!isLiveProcessingRef.current && processLiveQueueRef.current) processLiveQueueRef.current();
                                                      showToastMsg('Đã đưa câu hỏi vào hàng đợi để Lão trả lời lại!', 'success');
                                                  }
                                              }}
                                              className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-[9px] font-bold transition-all shadow-md flex items-center gap-1 shrink-0"
                                          >
                                              <RefreshCw size={10}/> Hỏi lại
                                          </button>
                                      )}
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">{msg.text}</p>
                              </div>
                          ))
                      )}
                      <div ref={chatEndRef} />
                  </div>
              </aside>

          </div>
      );
};

export default LiveModePanel;
