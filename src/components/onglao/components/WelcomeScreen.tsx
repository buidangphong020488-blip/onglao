// @ts-nocheck
"use client";
import React from "react";
import { ChevronDown, Play, X } from "lucide-react";
import MiniLaoFace from "./MiniLaoFace";
import AuthModal from "@/components/AuthModal";

// WelcomeScreen: Màn hình chào khi chưa vào Thiền Đường
const WelcomeScreen = (p: any) => {
  const {
    isLoggedIn, hasEntered, setHasEntered,
    showAuthModal, setShowAuthModal, handleLogin, handleLogout,
    allCharacters, currentLaoPresetId, handleChangeChatLao,
    laoAppearance, laoVisualType, processedLaoImages, chatLaoVideos,
    laoChromaSettings, charOffsets, enableAutoHarmonization,
    laoShadow, harmonizeSettings,
    userName, setUserName, userGender, setUserGender, userAge, setUserAge,
    appLanguage, setAppLanguage, userVoice, setUserVoice,
    userVoiceStyle, setUserVoiceStyle, VOICE_STYLES,
    isProfileCompleted, handleEnterApp,
    openDropdown, setOpenDropdown,
  } = p;

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen w-full bg-slate-950 text-white items-center justify-center flex-col relative overflow-hidden select-none">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-yellow-500/20 rounded-full blur-[80px] animate-radiate"></div>
          <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-amber-500/20 rounded-full blur-[100px] animate-radiate-delayed"></div>
          <div className="absolute w-full h-full bg-gradient-to-b from-transparent via-yellow-900/10 to-transparent"></div>
        </div>
        <AuthModal
          showCloseButton={false}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 text-white items-center justify-center flex-col relative overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-yellow-500/20 rounded-full blur-[80px] animate-radiate"></div>
        <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-amber-500/20 rounded-full blur-[100px] animate-radiate-delayed"></div>
        <div className="absolute w-full h-full bg-gradient-to-b from-transparent via-yellow-900/10 to-transparent"></div>
      </div>

      {/* Nút Đăng xuất góc trên bên phải màn hình chào */}
      {isLoggedIn && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="p-2.5 px-4 rounded-xl border border-white/10 bg-slate-900/80 text-slate-300 hover:text-rose-300 hover:border-rose-500/40 hover:bg-rose-900/30 transition-all flex items-center gap-1.5 text-xs font-bold shadow-lg backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Đăng xuất
          </button>
        </div>
      )}
      
      <div className="z-10 flex flex-col items-center gap-4 md:gap-5 p-5 sm:p-6 md:p-8 rounded-[2.5rem] bg-gradient-to-b from-yellow-500/5 to-amber-900/10 backdrop-blur-3xl border border-yellow-500/20 shadow-[0_0_60px_rgba(245,158,11,0.15)] relative overflow-y-auto scrollbar-hide animate-in fade-in zoom-in duration-1000 w-[90%] max-w-md max-h-[95vh]">
        <div className="absolute top-0 inset-x-16 h-[2px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>

        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full shrink-0 bg-gradient-to-b from-slate-800 to-slate-950 border-4 border-yellow-500/30 shadow-[0_0_40px_rgba(245,158,11,0.3)] flex items-center justify-center overflow-hidden relative group">
           <div className="absolute inset-0 rounded-full border-[1.5px] border-yellow-400/40 animate-[spin_8s_linear_infinite]"></div>
           <div className="w-full h-full relative z-10 flex items-center justify-center" style={{ transform: `scale(${allCharacters.find(c => c.id === currentLaoPresetId)?.recommendedScale || 1})` }}>
              <MiniLaoFace className="w-full h-full drop-shadow-2xl" appearance={laoAppearance} visualType={laoVisualType} customImages={processedLaoImages} customVideos={chatLaoVideos} chromaSettings={laoChromaSettings} flipped={charOffsets.lao.flip} enableFX={enableAutoHarmonization} shadowConfig={laoShadow} harmonizeSettings={harmonizeSettings} />
           </div>
        </div>
        
        <div className="text-center space-y-1 md:space-y-1.5 shrink-0">
          <h1 className="text-4xl md:text-5xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 drop-shadow-md">Lão</h1>
          <p className="text-yellow-500/80 text-[10px] md:text-xs tracking-[0.4em] font-bold">Khai mở chân như</p>
        </div>

        {/* CHỌN HÌNH TƯỚNG LÃO */}
        <div className="flex flex-col items-center gap-2 w-full max-w-[320px] bg-slate-900/60 p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] border border-white/5 shadow-2xl backdrop-blur-sm z-30 shrink-0 mb-3 relative">
          <p className="text-[9px] text-amber-400/80 tracking-[0.2em] font-black mb-1">Hình tướng Lão khai thị</p>
          <div className="flex w-full items-center bg-slate-950 p-1 md:p-1.5 rounded-xl border border-white/5 focus-within:border-amber-500/30 transition-all relative">
            <span className="pl-2 pr-2 text-slate-500 text-[9px] md:text-[10px] font-bold tracking-wider whitespace-nowrap">Chọn Lão:</span>
            <button 
               onClick={() => setOpenDropdown(openDropdown === 'welcome_lao' ? null : 'welcome_lao')}
               className="w-full bg-transparent py-0.5 pr-2 outline-none text-white font-bold text-[11px] md:text-xs cursor-pointer flex justify-between items-center text-left"
            >
               <span className="truncate">{allCharacters.find(c => c.id === currentLaoPresetId)?.name || 'Lão Chat'}</span>
               <ChevronDown size={14} className="shrink-0 text-slate-500" />
            </button>
            {openDropdown === 'welcome_lao' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-amber-500/30 rounded-xl shadow-2xl z-[100] max-h-48 overflow-y-auto overflow-x-hidden">
                   {allCharacters.filter((c: any) => c.role === 'lao' || c.name.toLowerCase().includes('lão') || c.name.toLowerCase().includes('lao') || (c.isLocal && c.role === 'lao')).map((char: any) => (
                       <div 
                           key={char.id} 
                           onClick={() => { handleChangeChatLao(char.id); setOpenDropdown(null); }}
                           className="p-3 text-[11px] md:text-xs text-white hover:bg-amber-600/50 cursor-pointer border-b border-white/5 last:border-0 truncate"
                       >
                           {char.name}
                       </div>
                   ))}
                </div>
             )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2.5 w-full max-w-[320px] bg-slate-900/60 p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] border border-white/5 shadow-2xl backdrop-blur-sm z-20 shrink-0">
          <p className="text-[9px] text-orange-400/80 tracking-[0.2em] font-black">Thông tin người hỏi</p>
          
          <div className="flex w-full items-center bg-slate-950 p-1 md:p-1.5 rounded-xl border border-white/5 focus-within:border-orange-500/30 transition-all">
            <span className="pl-2 pr-2 text-slate-500 text-[9px] md:text-[10px] font-bold tracking-wider whitespace-nowrap">Danh xưng:</span>
            <input type="text" placeholder="Tên, Pháp danh..." value={userName} onChange={(e: any) => setUserName(e.target.value)} className="w-full bg-transparent py-0.5 pr-2 outline-none text-white font-bold text-[11px] md:text-xs placeholder:text-slate-700/50" />
          </div>

          <div className="flex w-full gap-1.5">
             <div className="flex flex-[3] gap-1.5 bg-slate-950 p-1 md:p-1.5 rounded-xl border border-white/5">
               <button onClick={() => setUserGender('Nam')} className={`flex-1 py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold tracking-wider transition-all ${userGender === 'Nam' ? 'bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>Nam</button>
               <button onClick={() => setUserGender('Nữ')} className={`flex-1 py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold tracking-wider transition-all ${userGender === 'Nữ' ? 'bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>Nữ</button>
             </div>
             <div className="flex flex-[2] items-center bg-slate-950 p-1 md:p-1.5 rounded-xl border border-white/5">
               <span className="pl-2 text-slate-500 text-[9px] md:text-[10px] font-bold tracking-wider">Tuổi:</span>
               <input type="number" min="5" max="100" value={userAge} onChange={(e: any) => setUserAge(Number(e.target.value))} className="w-full bg-transparent py-0.5 pr-1 outline-none text-white font-bold text-center text-[11px] md:text-xs" />
             </div>
          </div>

          <div className="flex w-full items-center bg-slate-950 p-1 md:p-1.5 rounded-xl border border-white/5 focus-within:border-orange-500/30 transition-all mt-0.5">
            <span className="pl-2 pr-2 text-slate-500 text-[9px] md:text-[10px] font-bold tracking-wider whitespace-nowrap">Ngôn ngữ:</span>
            <select value={appLanguage} onChange={e => setAppLanguage(e.target.value)} className="w-full bg-transparent py-0.5 pr-2 outline-none text-white font-bold text-[11px] md:text-xs cursor-pointer">
               <option value="Tiếng Việt" className="bg-slate-900 text-white">Tiếng Việt</option>
               <option value="English" className="bg-slate-900 text-white">English</option>
               <option value="中文 (Chinese)" className="bg-slate-900 text-white">中文 (Chinese)</option>
               <option value="한국어 (Korean)" className="bg-slate-900 text-white">한국어 (Korean)</option>
               <option value="日本语 (Japanese)" className="bg-slate-900 text-white">日本语 (Japanese)</option>
            </select>
          </div>

          {/* BẢNG ĐIỀU CHỈNH GIỌNG ĐỌC */}
          <div className="flex flex-col gap-1.5 w-full mt-2 pt-2 border-t border-white/5">
              <p className="text-[9px] text-emerald-400/80 tracking-[0.2em] font-black text-center mb-1">Tùy chỉnh Giọng đọc & Cảm xúc</p>
              
              <div className="flex w-full items-center bg-slate-950 p-1 md:p-1.5 rounded-xl border border-white/5 focus-within:border-emerald-500/30 transition-all">
                 <span className="pl-2 pr-2 text-slate-500 text-[9px] md:text-[10px] font-bold tracking-wider">Diễn viên:</span>
                 <select value={userVoice} onChange={e => setUserVoice(e.target.value)} className="w-full bg-transparent py-0.5 pr-2 outline-none text-white font-bold text-[10px] md:text-xs">
                    <optgroup label="🎙️ Giọng Nữ" className="bg-slate-900 text-emerald-400">
                       <option value="Aoede" className="bg-slate-900 text-white">Aoede (Chuẩn Nữ)</option>
                       <option value="Kore" className="bg-slate-900 text-white">Kore (Nữ thanh / Trẻ em)</option>
                       <option value="Leda" className="bg-slate-900 text-white">Leda (Nữ nhẹ nhàng)</option>
                       <option value="Zephyr" className="bg-slate-900 text-white">Zephyr (Nữ trầm)</option>
                       <option value="Callirrhoe" className="bg-slate-900 text-white">Callirrhoe (Nữ ấm áp)</option>
                       <option value="Autonoe" className="bg-slate-900 text-white">Autonoe (Nữ kể chuyện)</option>
                    </optgroup>
                    <optgroup label="🎙️ Giọng Nam" className="bg-slate-900 text-emerald-400">
                       <option value="Puck" className="bg-slate-900 text-white">Puck (Chuẩn Nam)</option>
                       <option value="Charon" className="bg-slate-900 text-white">Charon (Nam đầm thấm)</option>
                       <option value="Fenrir" className="bg-slate-900 text-white">Fenrir (Nam mạnh mẽ)</option>
                       <option value="Orus" className="bg-slate-900 text-white">Orus (Nam điềm đạm)</option>
                       <option value="Enceladus" className="bg-slate-900 text-white">Enceladus (Nam trung niên)</option>
                       <option value="Iapetus" className="bg-slate-900 text-white">Iapetus (Nam thanh niên)</option>
                    </optgroup>
                 </select>
              </div>

              <div className="flex flex-col w-full bg-slate-950 p-1.5 rounded-xl border border-white/5 gap-1.5 focus-within:border-emerald-500/30 transition-all">
                  <select
                     onChange={(e: any) => { if(e.target.value) setUserVoiceStyle(e.target.value) }}
                     className="w-full bg-slate-900 py-1.5 px-2 rounded-lg outline-none text-emerald-400 font-bold text-[9px] md:text-[10px] border border-white/5 cursor-pointer"
                  >
                     <option value="" className="bg-slate-900 text-slate-400">-- Chọn 21+ Phong cách có sẵn --</option>
                     {VOICE_STYLES.map((s: any) => <option key={s.id} value={s.text} className="bg-slate-900 text-white">{s.label}</option>)}
                  </select>
                  <textarea
                      value={userVoiceStyle}
                      onChange={e => setUserVoiceStyle(e.target.value)}
                      placeholder="Có thể gõ phong cách tự do (VD: giọng nam, khóc nghẹn, thiết tha...)"
                      className="w-full bg-transparent py-1 px-1 outline-none text-white font-medium text-[10px] md:text-[11px] placeholder:text-slate-700/50 resize-none h-14 scrollbar-hide"
                  />
              </div>
          </div>
          {/* END BẢNG ĐIỀU CHỈNH GIỌNG ĐỌC */}

        </div>
        
        <div className="flex gap-3 shrink-0 w-full max-w-[320px] justify-center mt-1">
          {isProfileCompleted && (
            <button 
              type="button"
              onClick={() => setHasEntered(true)} 
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full font-black tracking-widest text-xs md:text-sm transition-all hover:scale-105 border border-white/10"
            >
              Hủy
            </button>
          )}
          <button 
            type="button"
            onClick={handleEnterApp} 
            className={`py-3 shrink-0 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-slate-950 rounded-full font-black tracking-widest text-xs md:text-sm transition-all hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 border border-yellow-300/50 ${isProfileCompleted ? 'flex-1' : 'w-full px-6 md:px-8'}`}
          >
            {isProfileCompleted ? 'Lưu thay đổi' : 'Vào thiền đường'}
            <Play size={14} fill="currentColor" className="text-slate-900 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Modal Đăng nhập hiển thị trên màn hình chào */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default WelcomeScreen;
