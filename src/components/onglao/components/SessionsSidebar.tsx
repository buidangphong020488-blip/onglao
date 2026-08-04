"use client";

import React from "react";
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
  BookOpen,
  Film,
  ChevronDown,
} from "lucide-react";

import { deleteChatSessionAction } from "@/lib/clientActions";

export const SessionsSidebar = (props?: { p?: any }) => {
  const p = props?.p || {};

  const [internalEditingId, setInternalEditingId] = React.useState<string | null>(null);
  const [internalEditTitle, setInternalEditTitle] = React.useState<string>('');
  const [internalDropdown, setInternalDropdown] = React.useState<string | null>(null);

  const {
    showSessions,
    setShowSessions,
    handleCreateSession,
    setShowAutoPilotModal,
    setIsLiveMode,
    allCharacters = [],
    applyCharacterPreset,
    handleChangeChatLao,
    setLaoIsFullScreen,
    sessions = [],
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    setShowPoemModal,
    publicAis = [],
    selectedAiConfigId,
    setSelectedAiConfigId,
    voicePersonas = [],
    currentVoicePersonaId,
    handleChangeVoicePersona,
    setShowUserGuide,
  } = p;

  const editingSessionId = p.editingSessionId !== undefined ? p.editingSessionId : internalEditingId;
  const setEditingSessionId = p.setEditingSessionId || setInternalEditingId;

  const editSessionTitle = p.editSessionTitle !== undefined ? p.editSessionTitle : internalEditTitle;
  const setEditSessionTitle = p.setEditSessionTitle || setInternalEditTitle;

  const openDropdown = p.openDropdown !== undefined ? p.openDropdown : internalDropdown;
  const setOpenDropdown = p.setOpenDropdown || setInternalDropdown;

  const togglePin = p.togglePin || ((id: string) => {
    if (setSessions) {
      setSessions((prev: any[]) => prev.map((s: any) => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
    }
  });

  const saveSessionTitle = p.saveSessionTitle || ((id: string, newTitle: string) => {
    if (setSessions) {
      setSessions((prev: any[]) => prev.map((s: any) => s.id === id ? { ...s, title: newTitle } : s));
    }
    setEditingSessionId(null);
  });

  const handleDeleteSession = (id: string, e?: any) => {
    if (e) e.stopPropagation();
    if (typeof p.handleDeleteSession === 'function') {
      p.handleDeleteSession(id, e);
    } else {
      if (setSessions) {
        setSessions((prev: any[]) => prev.filter((s: any) => s.id !== id));
      }
      deleteChatSessionAction(id).catch(err => console.warn('Lỗi xóa session DB:', err));
    }
  };

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

        {/* NÚT ĐIỀU HƯỚNG SANG CÁC TRANG ĐỘC LẬP */}
        <button
          onClick={() => {
            if (typeof setShowSessions === 'function') setShowSessions(false);
            window.location.href = '/?mode=live';
          }}
          className="w-full py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-emerald-500/50 mt-1 cursor-pointer"
        >
          <Video size={16} /> Bật chế độ Livestream Obs
        </button>

        <button
          onClick={() => {
            if (typeof setShowSessions === 'function') setShowSessions(false);
            window.location.href = '/?modal=auto-pilot';
          }}
          className="w-full py-2.5 rounded-xl bg-purple-700/80 hover:bg-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-purple-500/50 mt-1 cursor-pointer"
        >
          <Film size={16} /> Xưởng Phim Tự Động
        </button>

        <button
          onClick={() => {
            if (typeof setShowSessions === 'function') setShowSessions(false);
            window.location.href = '/?modal=ai-director';
          }}
          className="w-full py-2.5 rounded-xl bg-cyan-700/80 hover:bg-cyan-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-cyan-500/50 mt-1 cursor-pointer"
        >
          <FileText size={16} /> Quản lý Kịch bản Đạo diễn
        </button>

        <button
          onClick={() => {
            if (typeof setShowSessions === 'function') setShowSessions(false);
            window.location.href = '/?modal=poem-vault';
          }}
          className="w-full py-2.5 rounded-xl bg-amber-700/80 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-amber-500/50 mt-1 cursor-pointer"
        >
          <BookOpen size={16} /> Kho Kệ Pháp
        </button>

        {/* NÚT CHỌN LÃO TRONG KHI CHAT */}
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
                    if (typeof handleChangeVoicePersona === 'function') handleChangeVoicePersona(vp.id);
                    setOpenDropdown(null);
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
                    if (typeof setSelectedAiConfigId === 'function') setSelectedAiConfigId(ai.id);
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
            if (typeof setShowUserGuide === 'function') setShowUserGuide(true);
          }}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-all border border-white/5 mt-1"
        >
          <Info size={16} /> Hướng dẫn sử dụng
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {(!sessions || sessions.length === 0) && (
          <div className="p-4 text-center text-xs text-slate-500 bg-slate-900/60 rounded-xl border border-white/5 space-y-2">
            <p className="font-bold text-slate-300">Chưa có cuộc đàm đạo nào</p>
            <p className="text-[11px] text-slate-500">Bấm nút bên dưới để tạo cuộc trò chuyện mới với Lão</p>
            <button
              onClick={handleCreateSession}
              className="mt-2 w-full py-2 px-3 bg-orange-600/80 hover:bg-orange-500 text-white font-bold rounded-lg text-xs transition-colors"
            >
              + Khởi tạo Cuộc đàm đạo 1
            </button>
          </div>
        )}
        {(sessions || [])
          .filter(
            (s: any) =>
              s.type === "chat" || s.type === "chat|script" || !s.type,
          )
          .sort((a: any, b: any) => {
            if (b.isPinned !== a.isPinned) return b.isPinned ? 1 : -1;
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
          .map((session: any) => (
            <div
              key={session.id}
              className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${session.id === currentSessionId ? "bg-slate-800/80 border-orange-500/50" : "bg-slate-900/40 border-white/5 hover:bg-slate-800/60"}`}
            >
              <div className="flex justify-between items-center">
                <div
                  className="flex-1 cursor-pointer truncate mr-2"
                  onClick={() => {
                    if (typeof setCurrentSessionId === 'function') setCurrentSessionId(session.id);
                    if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                      const url = new URL(window.location.href);
                      url.searchParams.set('id', session.id);
                      window.history.pushState({}, '', url.toString());
                    }
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
                    <div>
                      <p
                        className={`text-sm font-bold truncate ${session.id === currentSessionId ? "text-orange-400" : "text-slate-300"}`}
                      >
                        {session.isPinned && (
                          <Pin
                            size={12}
                            className="inline mr-1 text-amber-400 fill-amber-400 -rotate-45"
                          />
                        )}{" "}
                        {session.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {session.createdAt && (
                          <p className="text-[10px] text-slate-500">
                            {new Date(session.createdAt).toLocaleString('vi-VN', {
                              day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        )}
                        {((session.messagesLoaded && session.messages && session.messages.length > 0) || (!session.messagesLoaded && session.messageCount > 0)) && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${session.id === currentSessionId ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-700 text-slate-400'}`}>
                            {session.messagesLoaded ? session.messages.length : session.messageCount} tin
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      togglePin(session.id);
                    }}
                    className={`p-1.5 rounded-lg transition-all ${session.isPinned ? "text-amber-400 bg-amber-400/10" : "text-slate-400 hover:text-amber-300 hover:bg-white/5"}`}
                    title={session.isPinned ? "Bỏ ghim cuộc đàm đạo" : "Ghim cuộc đàm đạo lên đầu"}
                  >
                    <Pin size={14} className={session.isPinned ? "text-amber-400 fill-amber-400 -rotate-45" : ""} />
                  </button>
                  <button
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditingSessionId(session.id);
                      setEditSessionTitle(session.title);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-white/5 transition-all"
                    title="Đổi tên cuộc đàm đạo"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteSession(session.id, e);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-all"
                    title="Xóa cuộc đàm đạo"
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
