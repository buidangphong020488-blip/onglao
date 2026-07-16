"use client";

import React from "react";
import { useOngLaoContext } from "../context/OngLaoContext";
import {
  Menu,
  X,
  Plus,
  Bot,
  Video,
  FileText,
  Info,
  Pin,
  Pencil,
  Trash2,
  Sparkles,
  BookOpen,
  ChevronDown,
} from "lucide-react";

export const SessionsSidebar = () => {
  const p = useOngLaoContext();
  const {
    showSessions,
    setShowSessions,
    handleCreateSession,
    setShowAutoPilotModal,
    setIsLiveMode,
    allCharacters,
    applyCharacterPreset,
    handleChangeChatLao,
    setLaoIsFullScreen,
    setShowAiManager,
    setShowUserGuide,
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    editingSessionId,
    setEditingSessionId,
    editSessionTitle,
    setEditSessionTitle,
    saveSessionTitle,
    togglePin,
    handleDeleteSession,
    setShowScriptModal,
    setShowAITopicModal,
    setShowPoemModal,
    openDropdown,
    setOpenDropdown,
    publicAis,
    selectedAiConfigId,
    setSelectedAiConfigId,
    currentLaoPresetId,
    voicePersonas,
    currentVoicePersonaId,
    handleChangeVoicePersona,
  } = p;

  if (!showSessions) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-[70] w-full sm:w-80 bg-[#0a0f1e]/98 backdrop-blur-3xl border-r border-white/5 flex flex-col shadow-2xl transition-transform duration-500 md:relative md:translate-x-0">
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
        <div className="flex items-center gap-3 font-black text-[11px] tracking-widest text-emerald-400">
          <Menu size={16} /> Danh sách đàm đạo
        </div>
        <button
          onClick={() => setShowSessions(false)}
          className="p-1 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-2 border-b border-white/5">
        <button
          onClick={handleCreateSession}
          className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
        >
          <Plus size={18} /> Tạo cuộc trò chuyện mới
        </button>

        {/* NÚT MỞ TÍNH NĂNG AUTO-PILOT */}
        <button
          onClick={() => {
            setShowAutoPilotModal(true);
            setShowSessions(false);
          }}
          className="w-full py-3 rounded-xl bg-rose-700/90 hover:bg-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(225,29,72,0.4)] border border-rose-500/50 mt-1 animate-pulse"
        >
          <Bot size={18} /> Xưởng Phim Tự Động (Auto-Pilot)
        </button>

        {/* NÚT BẬT CHẾ ĐỘ LIVE OBS */}
        <button
          onClick={() => {
            setIsLiveMode(true);
            setShowSessions(false);
            const laoHoaChar = allCharacters.find(
              (c: any) => c.id === "char_lao_hoa",
            );
            if (laoHoaChar) {
              applyCharacterPreset(laoHoaChar, "lao", true);
              handleChangeChatLao(laoHoaChar.id);
              setLaoIsFullScreen(
                laoHoaChar.defaultLiveFullScreen !== undefined
                  ? laoHoaChar.defaultLiveFullScreen
                  : false,
              );
            }
          }}
          className="w-full py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-emerald-500/50 mt-1"
        >
          <Video size={16} /> Bật chế độ Livestream Obs
        </button>

        <button
          onClick={() => {
            setShowAiManager(true);
            setShowSessions(false);
          }}
          className="w-full py-2.5 rounded-xl bg-cyan-700/80 hover:bg-cyan-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-cyan-500/50 mt-1"
        >
          <FileText size={16} /> Quản lý Kịch bản Đạo diễn
        </button>

        {/* Nhập kịch bản thủ công and Đạo Diễn AI hidden per user request */}
        {/*
        <button onClick={() => { setShowScriptModal(true); setShowSessions(false); }} className="w-full py-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-all mt-1">
          <FileText size={16} /> Nhập kịch bản thủ công
        </button>

        <button onClick={() => { setShowAITopicModal(true); setShowSessions(false); }} className="w-full py-2.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-indigo-500/50 mt-1">
          <Sparkles size={16} /> Đạo Diễn AI (Tạo kịch bản)
        </button>
        */}

        {/* NÚT MỞ QUẢN LÝ KHO KỆ PHÁP */}
        <button
          onClick={() => {
            setShowPoemModal(true);
            setShowSessions(false);
          }}
          className="w-full py-2.5 rounded-xl bg-amber-700/80 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-amber-500/50 mt-1"
        >
          <BookOpen size={16} /> Kho Kệ Pháp
        </button>

        {/* NÚT CHỌN LÃO TRONG KHI CHAT — dùng bảng Hình Tướng (VoicePersona) */}
        <div className="w-full rounded-xl bg-slate-900 border border-amber-500/30 mt-1 flex flex-col relative z-20">
          <div className="bg-slate-800/80 px-3 py-2 text-[10px] font-bold text-amber-400 border-b border-white/5 rounded-t-xl">
            Đổi hình tướng Lão
          </div>
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "chat_lao" ? null : "chat_lao")
            }
            className="w-full bg-transparent p-2.5 outline-none text-white text-xs cursor-pointer hover:bg-slate-800 transition-colors flex justify-between items-center text-left rounded-b-xl"
          >
            <span className="truncate">
              {voicePersonas?.find((vp: any) => vp.id === currentVoicePersonaId)
                ?.name || "-- Bấm để chọn Lão --"}
            </span>
            <ChevronDown size={14} className="shrink-0 text-slate-500" />
          </button>

          {openDropdown === "chat_lao" && (
            <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-amber-500/30 rounded-lg shadow-2xl z-[100] max-h-48 overflow-y-auto overflow-x-hidden">
              {voicePersonas?.length === 0 && (
                <div className="p-3 text-xs text-slate-500 text-center">Chưa có hình tướng nào</div>
              )}
              {voicePersonas?.map((vp: any) => (
                  <div
                    key={vp.id}
                    onClick={() => {
                      handleChangeVoicePersona(vp.id);
                      setOpenDropdown(null);
                      setShowSessions(false);
                    }}
                    className="p-3 text-xs text-white hover:bg-amber-600/50 cursor-pointer border-b border-white/5 last:border-0 truncate"
                  >
                    {vp.name}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* NÚT CHỌN AI CONFIG */}
        <div className="w-full rounded-xl bg-slate-900 border border-emerald-500/30 mt-1 flex flex-col relative z-10">
          <div className="bg-slate-800/80 px-3 py-2 text-[10px] font-bold text-emerald-400 border-b border-white/5 rounded-t-xl">
            Chọn Trí tuệ AI (GiacNgo)
          </div>
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "ai_config" ? null : "ai_config")
            }
            className="w-full bg-transparent p-2.5 outline-none text-white text-xs cursor-pointer hover:bg-slate-800 transition-colors flex justify-between items-center text-left rounded-b-xl"
          >
            <span className="truncate">
              {publicAis.find((a: any) => a.id === selectedAiConfigId)?.name ||
                "Giác Ngộ (Mặc định)"}
            </span>
            <ChevronDown size={14} className="shrink-0 text-slate-500" />
          </button>

          {openDropdown === "ai_config" && (
            <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-emerald-500/30 rounded-lg shadow-2xl z-[100] max-h-48 overflow-y-auto overflow-x-hidden">
              {publicAis.map((ai: any) => (
                <div
                  key={ai.id}
                  onClick={() => {
                    setSelectedAiConfigId(ai.id);
                    localStorage.setItem(
                      "taman_selected_ai_config_id",
                      ai.id.toString(),
                    );
                    setOpenDropdown(null);
                  }}
                  className="p-3 text-xs text-white hover:bg-emerald-600/50 cursor-pointer border-b border-white/5 last:border-0 truncate"
                >
                  {ai.name} {ai.id === 7 && "(Mặc định)"}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            setShowUserGuide(true);
            setShowSessions(false);
          }}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-all border border-white/5 mt-1"
        >
          <Info size={16} /> Hướng dẫn sử dụng
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {sessions
          .filter(
            (s: any) =>
              s.type === "chat" || s.type === "chat|script" || !s.type,
          )
          .sort((a: any, b: any) =>
            b.isPinned === a.isPinned ? b.id - a.id : b.isPinned ? 1 : -1,
          )
          .map((session: any) => (
            <div
              key={session.id}
              className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${session.id === currentSessionId ? "bg-slate-800/80 border-orange-500/50" : "bg-slate-900/40 border-white/5 hover:bg-slate-800/60"}`}
            >
              <div className="flex justify-between items-center">
                <div
                  className="flex-1 cursor-pointer truncate mr-2"
                  onClick={() => {
                    setCurrentSessionId(session.id);
                  }}
                >
                  {editingSessionId === session.id ? (
                    <input
                      autoFocus
                      className="bg-slate-950 text-white text-xs p-1 rounded outline-none border border-orange-500 w-full"
                      value={editSessionTitle}
                      onChange={(e: any) => setEditSessionTitle(e.target.value)}
                      onClick={(e: any) => e.stopPropagation()}
                      onBlur={() =>
                        saveSessionTitle(session.id, editSessionTitle)
                      }
                      onKeyDown={(e: any) => {
                        e.stopPropagation();
                        if (e.key === "Enter") {
                          e.preventDefault();
                          saveSessionTitle(session.id, editSessionTitle);
                        } else if (e.key === "Escape") {
                          setEditingSessionId(null);
                        }
                      }}
                    />
                  ) : (
                    <p
                      className={`text-sm font-bold truncate ${session.id === currentSessionId ? "text-orange-400" : "text-slate-300"}`}
                    >
                      {session.isPinned && (
                        <Pin
                          size={12}
                          className="inline mr-1 text-emerald-400"
                        />
                      )}{" "}
                      {session.title}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e: any) => {
                      e.stopPropagation();
                      togglePin(session.id);
                    }}
                    className={`hover:text-emerald-400 ${session.isPinned ? "text-emerald-400" : "text-slate-400"}`}
                  >
                    <Pin size={14} />
                  </button>
                  <button
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setEditingSessionId(session.id);
                      setEditSessionTitle(session.title);
                    }}
                    className="hover:text-indigo-400 text-slate-400"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e: any) => handleDeleteSession(session.id, e)}
                    className="hover:text-rose-400 text-slate-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </aside>
  );
};
export default SessionsSidebar;
