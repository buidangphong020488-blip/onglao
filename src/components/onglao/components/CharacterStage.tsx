"use client";

import React, { useRef, useEffect } from 'react';
import { useOngLaoContext } from '../context/OngLaoContext';
import MiniLaoFace from './MiniLaoFace';
import { Sparkles, FlipHorizontal, Sliders, RotateCcw, X } from 'lucide-react';

export const CharacterStage = () => {
  const p = useOngLaoContext();
  const {
    showLaoAura,
    setShowLaoAura,
    charOffsets,
    setCharOffsets,
    showChatLaoControls,
    setShowChatLaoControls,
    chatLaoTransform,
    setChatLaoTransform,
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
    mouthOpen,
    handleChatLaoPointerDown,
    handleChatLaoPointerMove,
    handleChatLaoPointerUp,
    handleChatLaoWheel
  } = p;

  // Fix passive event listener: gắn wheel listener native {passive: false} để preventDefault hoạt động
  const laoStageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = laoStageRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setChatLaoTransform((prev: any) => ({
        ...prev,
        s: Math.max(0.5, Math.min(4.0, prev.s + delta))
      }));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [setChatLaoTransform]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative px-4 overflow-hidden mb-32">
      <div className="relative scale-[0.6] sm:scale-80 md:scale-105 transition-transform duration-700">
         {showLaoAura && (
            <>
               <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-[50px] animate-pulse pointer-events-none"></div>
               <div className="absolute inset-0 rounded-full border-[8px] border-yellow-500/40 animate-radiate pointer-events-none"></div>
               <div className="absolute inset-0 rounded-full border-[8px] border-amber-500/30 animate-radiate-delayed pointer-events-none"></div>
               <div className="absolute inset-0 rounded-full border-[4px] border-orange-400/20 animate-radiate-slow pointer-events-none"></div>
            </>
         )}
         
         <div data-tutorial="tut-face" className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-b from-slate-800 to-slate-950 border-[4px] border-white/5 shadow-[0_0_60px_rgba(234,179,8,0.25)] flex items-center justify-center overflow-hidden z-10">
            {/* BỌC THÊM DIV ĐỂ XỬ LÝ KÉO THẢ VÀ ZOOM */}
            <div 
                className="w-full h-full cursor-move touch-none relative"
                onPointerDown={handleChatLaoPointerDown}
                onPointerMove={handleChatLaoPointerMove}
                onPointerUp={handleChatLaoPointerUp}
                onPointerLeave={handleChatLaoPointerUp}
                ref={laoStageRef}
                style={{
                    transform: `translate(${chatLaoTransform.x}px, ${chatLaoTransform.y}px) scale(${chatLaoTransform.s})`,
                    transition: p.chatLaoDragInfo.current?.isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
            >
                <MiniLaoFace className="w-full h-full drop-shadow-2xl pointer-events-none" mouthOpen={mouthOpen} appearance={laoAppearance} visualType={laoVisualType} customImages={processedLaoImages} customVideos={chatLaoVideos} chromaSettings={laoChromaSettings} flipped={charOffsets.lao.flip} isSpeakingSession={isLaoSpeakingSession} enableFX={enableAutoHarmonization} shadowConfig={laoShadow} harmonizeSettings={harmonizeSettings} />
            </div>
         </div>
         
         {/* BẢNG ĐIỀU KHIỂN NHANH CHO LÃO (Lật, Hào quang) */}
         <div className="absolute -right-6 md:-right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            <button onClick={() => setShowLaoAura(!showLaoAura)} className={`p-2.5 md:p-3 rounded-full shadow-lg transition-all border ${showLaoAura ? 'bg-yellow-500 text-white border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-500 hover:text-yellow-500 border-white/10'}`} title="Bật/Tắt Hào Quang">
               <Sparkles size={18} />
            </button>
            <button onClick={() => setCharOffsets((prev: any) => ({...prev, lao: {...prev.lao, flip: !prev.lao.flip}}))} className={`p-2.5 md:p-3 rounded-full shadow-lg transition-all border ${charOffsets.lao.flip ? 'bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-slate-800 text-slate-500 hover:text-orange-500 border-white/10'}`} title="Lật hướng nhìn">
               <FlipHorizontal size={18} />
            </button>
            <button onClick={() => setShowChatLaoControls(!showChatLaoControls)} className={`p-2.5 md:p-3 rounded-full shadow-lg transition-all border ${showChatLaoControls ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-500 hover:text-indigo-500 border-white/10'}`} title="Mở bảng điều chỉnh vị trí bằng thanh kéo">
               <Sliders size={18} />
            </button>
            <button 
                onClick={() => { 
                    const preset = allCharacters.find((c: any) => c.id === currentLaoPresetId);
                    setChatLaoTransform({ 
                        x: preset?.recommendedX !== undefined ? preset.recommendedX : -4, 
                        y: preset?.recommendedY !== undefined ? preset.recommendedY : 164, 
                        s: preset?.recommendedScale || 1.8 
                    }); 
                    setShowChatLaoControls(false); 
                }} 
                className="p-2.5 md:p-3 rounded-full shadow-lg transition-all border bg-slate-800 text-slate-500 hover:text-emerald-500 border-white/10" 
                title="Khôi phục vị trí (Đưa Lão về giữa)"
            >
               <RotateCcw size={18} />
            </button>
         </div>

         {/* BẢNG TRƯỢT ĐIỀU CHỈNH VỊ TRÍ CHO OBS */}
         {showChatLaoControls && (
             <div className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+3rem)] md:left-[calc(100%+5rem)] w-48 bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.3)] flex flex-col gap-4 z-30 animate-in fade-in slide-in-from-left-2">
                 <div className="flex justify-between items-center mb-1 border-b border-white/10 pb-2">
                     <span className="text-[11px] font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1.5"><Sliders size={12}/> Vị trí Lão</span>
                     <button onClick={() => setShowChatLaoControls(false)} className="text-slate-400 hover:text-rose-400 transition-colors"><X size={14}/></button>
                 </div>
                 <div className="flex flex-col gap-1.5">
                     <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Ngang (X)</span> <span className="text-indigo-300">{Math.round(chatLaoTransform.x)}</span></span>
                     <input type="range" min="-300" max="300" value={chatLaoTransform.x} onChange={e => setChatLaoTransform((prev: any) => ({...prev, x: Number(e.target.value)}))} className="accent-indigo-500" />
                 </div>
                 <div className="flex flex-col gap-1.5">
                     <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Dọc (Y)</span> <span className="text-indigo-300">{Math.round(chatLaoTransform.y)}</span></span>
                     <input type="range" min="-300" max="300" value={chatLaoTransform.y} onChange={e => setChatLaoTransform((prev: any) => ({...prev, y: Number(e.target.value)}))} className="accent-indigo-500" />
                 </div>
                 <div className="flex flex-col gap-1.5">
                     <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Thu phóng</span> <span className="text-indigo-300">x{chatLaoTransform.s.toFixed(2)}</span></span>
                     <input type="range" min="0.5" max="4.0" step="0.05" value={chatLaoTransform.s} onChange={e => setChatLaoTransform((prev: any) => ({...prev, s: Number(e.target.value)}))} className="accent-indigo-500" />
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};
export default CharacterStage;
