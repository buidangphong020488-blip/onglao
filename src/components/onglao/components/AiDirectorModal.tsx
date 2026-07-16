"use client";
import React from 'react';
import { Sparkles, X, Users, Info, Loader2, Wand2, Volume2 } from 'lucide-react';

interface AiDirectorModalProps {
    show: boolean;
    onClose: () => void;
    isGenerating: boolean;
    // Ngôn ngữ
    appLanguage: string;
    setAppLanguage: (v: string) => void;
    // Cài đặt Lão
    customLaoName: string; setCustomLaoName: (v: string) => void;
    laoSelfCall: string;   setLaoSelfCall: (v: string) => void;
    laoCallUser: string;   setLaoCallUser: (v: string) => void;
    laoVoice: string;      setLaoVoice: (v: string) => void;
    laoVoiceStyle: string; setLaoVoiceStyle: (v: string) => void;
    // Cài đặt Con
    customUserName: string; setCustomUserName: (v: string) => void;
    userSelfCall: string;   setUserSelfCall: (v: string) => void;
    userCallLao: string;    setUserCallLao: (v: string) => void;
    userVoice: string;      setUserVoice: (v: string) => void;
    userVoiceStyle: string; setUserVoiceStyle: (v: string) => void;
    // Chủ đề & style
    aiTopicText: string;        setAiTopicText: (v: string) => void;
    aiScriptLength: string;     setAiScriptLength: (v: string) => void;
    aiLaoStyle: string;         setAiLaoStyle: (v: string) => void;
    aiUserEmotionArc: string;   setAiUserEmotionArc: (v: string) => void;
    aiScriptTitle: string;      setAiScriptTitle: (v: string) => void;
    aiScriptDate: string;       setAiScriptDate: (v: string) => void;
    onGenerate: (overrides?: {
        topic?: string; laoName?: string; laoSelf?: string; laoCallU?: string;
        userName?: string; userSelf?: string; userCallL?: string;
    }) => void;
    asTab?: boolean;
    generatedScriptText?: string;
    setGeneratedScriptText?: (v: string) => void;
    onSaveGeneratedScript?: (overrides?: { scriptText?: string; laoName?: string; userName?: string }) => void;
}

const VOICES_MALE = ['Algieba','Puck','Charon','Fenrir','Orus','Enceladus','Iapetus'];
const VOICES_FEMALE = ['Aoede','Kore','Leda','Zephyr','Callirrhoe','Autonoe'];

const AiDirectorModal = (p: AiDirectorModalProps) => {
    const [showVoiceSettings, setShowVoiceSettings] = React.useState(true);
    const generatedSectionRef = React.useRef<HTMLDivElement>(null);

    // ── LOCAL STATE cho tất cả text inputs ──────────────────────────────────
    // onChange chỉ cập nhật local state (không re-render toàn bộ app)
    // onBlur mới sync lên parent context
    const [localLaoName,  setLocalLaoName]  = React.useState(p.customLaoName  || '');
    const [localLaoSelf,  setLocalLaoSelf]  = React.useState(p.laoSelfCall    || '');
    const [localLaoCallU, setLocalLaoCallU] = React.useState(p.laoCallUser    || '');
    const [localUserName, setLocalUserName] = React.useState(p.customUserName || '');
    const [localUserSelf, setLocalUserSelf] = React.useState(p.userSelfCall   || '');
    const [localUserCallL,setLocalUserCallL]= React.useState(p.userCallLao    || '');
    const [localTopic,    setLocalTopic]    = React.useState(p.aiTopicText    || '');
    const [localTitle,    setLocalTitle]    = React.useState(p.aiScriptTitle  || '');
    const [localGenScript,setLocalGenScript]= React.useState(p.generatedScriptText || '');

    // Sync khi generatedScriptText từ AI thay đổi (từ parent → local)
    React.useEffect(() => {
        setLocalGenScript(p.generatedScriptText || '');
        if (p.generatedScriptText && generatedSectionRef.current) {
            setTimeout(() => generatedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    }, [p.generatedScriptText]);

    // Sync khi props thay đổi từ bên ngoài (VD: load kịch bản cũ)
    React.useEffect(() => { setLocalLaoName(p.customLaoName   || ''); }, [p.customLaoName]);
    React.useEffect(() => { setLocalLaoSelf(p.laoSelfCall     || ''); }, [p.laoSelfCall]);
    React.useEffect(() => { setLocalLaoCallU(p.laoCallUser    || ''); }, [p.laoCallUser]);
    React.useEffect(() => { setLocalUserName(p.customUserName || ''); }, [p.customUserName]);
    React.useEffect(() => { setLocalUserSelf(p.userSelfCall   || ''); }, [p.userSelfCall]);
    React.useEffect(() => { setLocalUserCallL(p.userCallLao   || ''); }, [p.userCallLao]);
    React.useEffect(() => { setLocalTopic(p.aiTopicText       || ''); }, [p.aiTopicText]);
    React.useEffect(() => { setLocalTitle(p.aiScriptTitle     || ''); }, [p.aiScriptTitle]);

    // Ctrl+S để lưu
    const onSaveRef = React.useRef(p.onSaveGeneratedScript);
    React.useEffect(() => { onSaveRef.current = p.onSaveGeneratedScript; });
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                if (localGenScript && onSaveRef.current) {
                    e.preventDefault();
                    p.setGeneratedScriptText?.(localGenScript);
                    onSaveRef.current();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [localGenScript]);

    // Flush tất cả local state lên parent trước khi generate
    const handleGenerate = () => {
        p.setCustomLaoName(localLaoName);
        p.setLaoSelfCall(localLaoSelf);
        p.setLaoCallUser(localLaoCallU);
        p.setCustomUserName(localUserName);
        p.setUserSelfCall(localUserSelf);
        p.setUserCallLao(localUserCallL);
        p.setAiTopicText(localTopic);
        p.setAiScriptTitle(localTitle);
        // Truyền overrides trực tiếp để tránh stale closure
        p.onGenerate({
            topic:    localTopic,
            laoName:  localLaoName,
            laoSelf:  localLaoSelf,
            laoCallU: localLaoCallU,
            userName: localUserName,
            userSelf: localUserSelf,
            userCallL: localUserCallL,
        });
    };

    // Flush local values trực tiếp vào save function (tránh stale closure)
    const handleSave = () => {
        p.onSaveGeneratedScript?.({
            scriptText: localGenScript,
            laoName:    localLaoName,
            userName:   localUserName,
        });
    };

    if (!p.show && !p.asTab) return null;

    if (p.asTab) {
        return (
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-6">
                {/* Form fields here */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400">Tiêu đề kịch bản:</label>
                         <input
                             type="text"
                             value={localTitle}
                             onChange={e => setLocalTitle(e.target.value)}
                             onBlur={e => p.setAiScriptTitle(e.target.value)}
                             className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
                             placeholder="VD: Kịch bản mới"
                         />
                     </div>
                     <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400">Ngày tạo:</label>
                         <input
                             type="date"
                             value={p.aiScriptDate}
                             onChange={e => p.setAiScriptDate(e.target.value)}
                             className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
                         />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400">Ngôn ngữ kịch bản:</label>
                        <select value={p.appLanguage} onChange={e => p.setAppLanguage(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium">
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English (Voice only for En characters)</option>
                        </select>
                     </div>
                </div>

                {/* KHỐI CẤU HÌNH GIỌNG ĐỌC */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-white/5">
                        <button
                            type="button"
                            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <Volume2 size={14} />
                            {showVoiceSettings ? "Ẩn Cấu hình Giọng đọc" : "Hiện Cấu hình Giọng đọc cho Kịch bản này"}
                        </button>
                        <span className="text-[10px] text-slate-500 hidden sm:inline">Giọng đọc riêng sẽ được áp dụng khi tạo âm thanh cho kịch bản này.</span>
                    </div>

                    {showVoiceSettings && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-white/5 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex flex-col gap-2 p-3 bg-orange-950/20 border border-orange-500/20 rounded-xl">
                                <span className="text-xs font-bold text-orange-400">🎙️ Giọng đọc của Lão:</span>
                                <select value={p.laoVoice} onChange={e=>p.setLaoVoice(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white outline-none">
                                   <optgroup label="🎙️ Giọng Nam">{VOICES_MALE.map(v=><option key={v} value={v}>{v}</option>)}</optgroup>
                                   <optgroup label="🎙️ Giọng Nữ">{VOICES_FEMALE.map(v=><option key={v} value={v}>{v}</option>)}</optgroup>
                                </select>
                                <textarea value={p.laoVoiceStyle} onChange={e=>p.setLaoVoiceStyle(e.target.value)} placeholder="Phong cách (VD: Giọng ấm áp...)" className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white outline-none h-12 resize-none" />
                            </div>

                            <div className="flex flex-col gap-2 p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl">
                                <span className="text-xs font-bold text-indigo-400">🎙️ Giọng đọc của Con:</span>
                                <select value={p.userVoice} onChange={e=>p.setUserVoice(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white outline-none">
                                   <optgroup label="🎙️ Giọng Nữ">{VOICES_FEMALE.map(v=><option key={v} value={v}>{v}</option>)}</optgroup>
                                   <optgroup label="🎙️ Giọng Nam">{VOICES_MALE.map(v=><option key={v} value={v}>{v}</option>)}</optgroup>
                                </select>
                                <textarea value={p.userVoiceStyle} onChange={e=>p.setUserVoiceStyle(e.target.value)} placeholder="Phong cách giọng..." className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white outline-none h-12 resize-none" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Phân vai Lão */}
                <div className="border border-white/10 rounded-xl p-4 space-y-4 bg-black/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-amber-400"/>
                        <h4 className="font-bold text-amber-400 text-sm">Nhân vật Minh Sư (Lão)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                         <div className="space-y-1">
                             <label className="text-[11px] font-bold text-slate-400">Tên hiển thị:</label>
                             <input type="text" value={localLaoName}
                                 onChange={e => setLocalLaoName(e.target.value)}
                                 onBlur={e => p.setCustomLaoName(e.target.value)}
                                 className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" placeholder="VD: Lão"/>
                         </div>
                         <div className="space-y-1">
                             <label className="text-[11px] font-bold text-slate-400">Tự xưng là:</label>
                             <input type="text" value={localLaoSelf}
                                 onChange={e => setLocalLaoSelf(e.target.value)}
                                 onBlur={e => p.setLaoSelfCall(e.target.value)}
                                 className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" placeholder="VD: Lão, Thầy"/>
                         </div>
                         <div className="space-y-1">
                             <label className="text-[11px] font-bold text-slate-400">Gọi đối phương:</label>
                             <input type="text" value={localLaoCallU}
                                 onChange={e => setLocalLaoCallU(e.target.value)}
                                 onBlur={e => p.setLaoCallUser(e.target.value)}
                                 className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500" placeholder="VD: Con, Em"/>
                         </div>
                    </div>
                </div>

                {/* Phân vai Người hỏi */}
                <div className="border border-white/10 rounded-xl p-4 space-y-4 bg-black/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-sky-400"/>
                        <h4 className="font-bold text-sky-400 text-sm">Nhân vật Hỏi đạo (Bạn)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                         <div className="space-y-1">
                             <label className="text-[11px] font-bold text-slate-400">Tên hiển thị:</label>
                             <input type="text" value={localUserName}
                                 onChange={e => setLocalUserName(e.target.value)}
                                 onBlur={e => p.setCustomUserName(e.target.value)}
                                 className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-sky-500" placeholder="VD: Con, Học trò"/>
                         </div>
                         <div className="space-y-1">
                             <label className="text-[11px] font-bold text-slate-400">Tự xưng là:</label>
                             <input type="text" value={localUserSelf}
                                 onChange={e => setLocalUserSelf(e.target.value)}
                                 onBlur={e => p.setUserSelfCall(e.target.value)}
                                 className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-sky-500" placeholder="VD: Con, Em"/>
                         </div>
                         <div className="space-y-1">
                             <label className="text-[11px] font-bold text-slate-400">Gọi đối phương:</label>
                             <input type="text" value={localUserCallL}
                                 onChange={e => setLocalUserCallL(e.target.value)}
                                 onBlur={e => p.setUserCallLao(e.target.value)}
                                 className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-sky-500" placeholder="VD: Lão, Thầy"/>
                         </div>
                    </div>
                </div>

                {/* Tùy chỉnh chi tiết AI */}
                <div className="border border-white/10 rounded-xl p-4 space-y-4 bg-black/20">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-400">Độ dài kịch bản:</label>
                              <select value={p.aiScriptLength} onChange={e => p.setAiScriptLength(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                                  <option value="short">Ngắn gọn (3-5 câu)</option>
                                  <option value="medium">Vừa phải (6-9 câu)</option>
                                  <option value="long">Đào sâu chi tiết (10-21 câu)</option>
                              </select>
                          </div>
                          <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-400">Phong cách Minh Sư:</label>
                              <select value={p.aiLaoStyle} onChange={e => p.setAiLaoStyle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                                  <option value="funny">Hài hước, mỉa mai nhẹ</option>
                                  <option value="serious">Nghiêm túc, từ bi</option>
                                  <option value="zen">Thiền tông, sấm sét</option>
                                  <option value="street">Đời thường, dân dã</option>
                              </select>
                          </div>
                          <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-400">Tâm lý Người hỏi:</label>
                              <select value={p.aiUserEmotionArc} onChange={e => p.setAiUserEmotionArc(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                                  <option value="sad_to_happy">Bế tắc {'->'} Giải tỏa</option>
                                  <option value="angry_to_calm">Tức giận {'->'} Bình tĩnh</option>
                                  <option value="curious_to_enlightened">Tò mò {'->'} Sáng tỏ</option>
                                  <option value="skeptical_to_convinced">Nghi ngờ {'->'} Thuyết phục</option>
                              </select>
                          </div>
                     </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-indigo-400">Nhập Chủ đề đàm đạo:</label>
                    <textarea
                        value={localTopic}
                        onChange={e => setLocalTopic(e.target.value)}
                        onBlur={e => p.setAiTopicText(e.target.value)}
                        placeholder="VD: Làm sao để buông bỏ nỗi đau khi bị người yêu phản bội?"
                        className="w-full h-24 bg-black/40 border border-indigo-500/30 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-medium leading-relaxed custom-scrollbar"
                    />
                </div>

                {localGenScript && (
                    <div ref={generatedSectionRef} className="space-y-2 mt-2 scroll-mt-4">
                        <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse inline-block" />
                            Kịch bản đã tạo (Bạn có thể sửa trực tiếp):
                        </label>
                        <textarea
                            value={localGenScript}
                            onChange={e => setLocalGenScript(e.target.value)}
                            onBlur={e => p.setGeneratedScriptText?.(e.target.value)}
                            className="w-full h-64 bg-slate-950 border border-emerald-500/30 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                            placeholder="Kịch bản sẽ xuất hiện ở đây..."
                        />
                    </div>
                )}

                <div className="pt-2 flex justify-end gap-3 border-t border-white/5 mt-auto">
                    {localGenScript && (
                        <button onClick={handleSave} disabled={p.isGenerating} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-950/20 transition-all flex items-center gap-2 disabled:opacity-50">
                            Lưu kịch bản đàm đạo
                        </button>
                    )}
                    <button onClick={handleGenerate} disabled={!localTopic.trim() || p.isGenerating} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {p.isGenerating ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>}
                        {p.isGenerating ? 'Đang viết kịch bản...' : 'Tạo đàm đạo'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => !p.isGenerating && p.onClose()}>
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800">
                    <h2 className="font-black text-indigo-400 tracking-widest flex items-center gap-2"><Sparkles size={18}/> Đạo Diễn AI (Tối ưu đàm đạo)</h2>
                    {!p.isGenerating && <button onClick={p.onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>}
                </div>
                <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto scrollbar-hide">
                    {/* Ngôn ngữ */}
                    <div className="flex flex-col gap-1.5">
                       <label className="text-xs font-bold text-slate-400">Ngôn ngữ kịch bản:</label>
                       <select value={p.appLanguage} onChange={e => p.setAppLanguage(e.target.value)} disabled={p.isGenerating} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500">
                          <option value="Tiếng Việt">Tiếng Việt</option>
                          <option value="English">English</option>
                          <option value="中文 (Chinese)">中文 (Chinese)</option>
                          <option value="한국어 (Korean)">한국어 (Korean)</option>
                          <option value="日本語 (Japanese)">日本語 (Japanese)</option>
                       </select>
                    </div>
                    {/* Cài đặt Lão */}
                    <div className="flex flex-col gap-2 p-3 bg-orange-900/10 border border-orange-500/20 rounded-xl">
                        <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1.5"><Users size={14}/> Cài đặt Lão (Người khai thị):</span>
                        <div className="flex gap-2">
                            <input type="text" value={localLaoName}  onChange={e=>setLocalLaoName(e.target.value)}  onBlur={e=>p.setCustomLaoName(e.target.value)}  placeholder="Tên (VD: Lão, Em Đu...)" className="flex-[1.5] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none"/>
                            <input type="text" value={localLaoSelf}  onChange={e=>setLocalLaoSelf(e.target.value)}  onBlur={e=>p.setLaoSelfCall(e.target.value)}   placeholder="Tự xưng (Ta, Em...)"   className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none"/>
                            <input type="text" value={localLaoCallU} onChange={e=>setLocalLaoCallU(e.target.value)} onBlur={e=>p.setLaoCallUser(e.target.value)}   placeholder="Gọi kia (Ngươi, Anh...)" className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none"/>
                        </div>
                        <div className="flex gap-2">
                            <select value={p.laoVoice} onChange={e=>p.setLaoVoice(e.target.value)} className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none">
                               <optgroup label="🎙️ Giọng Nam">{VOICES_MALE.map(v=><option key={v} value={v}>{v}</option>)}</optgroup>
                               <optgroup label="🎙️ Giọng Nữ">{VOICES_FEMALE.map(v=><option key={v} value={v}>{v}</option>)}</optgroup>
                            </select>
                            <textarea value={p.laoVoiceStyle} onChange={e=>p.setLaoVoiceStyle(e.target.value)} placeholder="Phong cách (VD: Giọng ấm áp...)" className="flex-[2] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none resize-none h-8 scrollbar-hide"/>
                        </div>
                    </div>
                    {/* Cài đặt Con */}
                    <div className="flex flex-col gap-2 p-3 bg-indigo-900/10 border border-indigo-500/20 rounded-xl mt-2">
                        <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5"><Users size={14}/> Cài đặt Con (Người hỏi):</span>
                        <div className="flex gap-2">
                            <input type="text" value={localUserName}  onChange={e=>setLocalUserName(e.target.value)}  onBlur={e=>p.setCustomUserName(e.target.value)} placeholder="Tên (VD: Con, Anh Hào...)" className="flex-[1.5] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"/>
                            <input type="text" value={localUserSelf}  onChange={e=>setLocalUserSelf(e.target.value)}  onBlur={e=>p.setUserSelfCall(e.target.value)}  placeholder="Tự xưng (Con, Anh...)"   className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"/>
                            <input type="text" value={localUserCallL} onChange={e=>setLocalUserCallL(e.target.value)} onBlur={e=>p.setUserCallLao(e.target.value)}   placeholder="Gọi kia (Lão, Em Đu...)" className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"/>
                        </div>
                        <div className="flex gap-2">
                            <select value={p.userVoice} onChange={e=>p.setUserVoice(e.target.value)} className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 outline-none">
                               <optgroup label="🎙️ Giọng Nữ">{VOICES_FEMALE.map(v=><option key={v} value={v}>{v}</option>)}</optgroup>
                               <optgroup label="🎙️ Giọng Nam">{VOICES_MALE.map(v=><option key={v} value={v}>{v}</option>)}</optgroup>
                            </select>
                            <textarea value={p.userVoiceStyle} onChange={e=>p.setUserVoiceStyle(e.target.value)} placeholder="Phong cách giọng..." className="flex-[2] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 outline-none resize-none h-8 scrollbar-hide"/>
                        </div>
                    </div>
                    {/* Chủ đề */}
                    <div className="flex flex-col gap-1.5 mt-2">
                       <label className="text-xs font-bold text-slate-400">Chủ đề vướng mắc / Nỗi khổ của {localUserName || 'Con'}:</label>
                       <textarea value={localTopic}
                           onChange={e => setLocalTopic(e.target.value)}
                           onBlur={e => p.setAiTopicText(e.target.value)}
                           placeholder="Ví dụ: Con đang gặp áp lực nợ nần, mất phương hướng, thất tình..." disabled={p.isGenerating} className="w-full h-20 bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none resize-none font-mono"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400">Độ dài kịch bản:</label>
                          <select value={p.aiScriptLength} onChange={e => p.setAiScriptLength(e.target.value)} disabled={p.isGenerating} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500">
                             <option value="Khoảng 4-6 câu">Khoảng 4-6 câu (Chớp nhoáng)</option>
                             <option value="Khoảng 6-10 câu">Khoảng 6-10 câu (Vừa phải)</option>
                             <option value="Khoảng 10-15 câu">Khoảng 10-15 câu (Phân tích sâu)</option>
                             <option value="Khoảng 15-21 câu">Khoảng 15-21 câu (Khai ngộ toàn diện)</option>
                          </select>
                       </div>
                       <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400">Phong cách của Lão:</label>
                          <select value={p.aiLaoStyle} onChange={e => p.setAiLaoStyle(e.target.value)} disabled={p.isGenerating} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500">
                             <option value="Sắc bén, đốn giáo, thẳng thắn đánh thức mộng ảo">Sắc bén, đốn giáo</option>
                             <option value="Từ bi, ôn hòa, dắt dụ từng bước">Từ bi, ôn hòa</option>
                             <option value="Hài hước, châm biếm thâm thúy cõi trần">Hài hước, châm biếm thâm thúy</option>
                          </select>
                       </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                       <label className="text-xs font-bold text-slate-400">Hành trình biến đổi cảm xúc của Con:</label>
                       <select value={p.aiUserEmotionArc} onChange={e => p.setAiUserEmotionArc(e.target.value)} disabled={p.isGenerating} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500">
                          <option value="Từ đau khổ/bế tắc chuyển dần sang an lạc/bừng sáng">Đau khổ, bế tắc ➡️ An lạc, bừng sáng</option>
                          <option value="Từ tức giận/đổ lỗi chuyển sang tự nhìn nhận lại chính mình">Tức giận, đổ lỗi ➡️ Tự phản tỉnh</option>
                          <option value="Từ kiêu ngạo/ngộ nhận chuyển sang khiêm nhường/thấy rõ mộng">Kiêu ngạo, ngộ nhận ➡️ Khiêm nhường, tỉnh mộng</option>
                          <option value="Chỉ thuần túy thắc mắc, tò mò đạo lý và được giải đáp thỏa đáng">Thuần túy thắc mắc ➡️ Thỏa mãn trí tuệ</option>
                       </select>
                    </div>
                    <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-xl mt-2">
                       <p className="text-[11px] text-indigo-300 italic flex items-start gap-2">
                         <Info size={14} className="shrink-0 mt-0.5"/>
                         AI sẽ tự động tối ưu hóa kịch bản dựa trên các thông số này, đảm bảo lời thoại tự nhiên, đúng pháp và đúng quy tắc cá nhân hóa của bạn.
                       </p>
                    </div>
                    {localGenScript && (
                        <div ref={generatedSectionRef} className="space-y-2 mt-3 scroll-mt-4 ring-1 ring-emerald-500/30 bg-emerald-950/10 p-3 rounded-xl">
                            <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse inline-block" />
                                Kịch bản đã tạo — kiểm tra rồi nhấn Lưu!
                            </label>
                            <textarea
                                value={localGenScript}
                                onChange={e => setLocalGenScript(e.target.value)}
                                onBlur={e => p.setGeneratedScriptText?.(e.target.value)}
                                className="w-full h-48 bg-slate-950 border border-emerald-500/30 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                                placeholder="Kịch bản sẽ xuất hiện ở đây..."
                            />
                        </div>
                    )}
                    <div className="flex justify-end gap-3 mt-2 border-t border-white/5 pt-4">
                        <button disabled={p.isGenerating} onClick={p.onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white transition-colors disabled:opacity-50">Hủy</button>
                        {localGenScript && (
                            <button onClick={handleSave} disabled={p.isGenerating} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all">
                                Lưu kịch bản đàm đạo
                            </button>
                        )}
                        <button onClick={handleGenerate} disabled={!localTopic.trim() || p.isGenerating} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                           {p.isGenerating ? <Loader2 size={16} className="animate-spin"/> : <Wand2 size={16}/>}
                           {p.isGenerating ? 'Đang viết kịch bản...' : 'Tạo đàm đạo'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiDirectorModal;
