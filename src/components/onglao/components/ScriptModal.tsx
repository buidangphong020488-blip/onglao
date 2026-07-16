"use client";
import React from 'react';
import { FileText, X, Info, Check } from 'lucide-react';

interface ScriptModalProps {
    show: boolean;
    onClose: () => void;
    scriptText: string;
    setScriptText: (v: string) => void;
    importMode: string;
    setImportMode: (v: string) => void;
    onImport: () => void;
    asTab?: boolean;
}

const ScriptModal = ({ show, onClose, scriptText, setScriptText, importMode, setImportMode, onImport, asTab }: ScriptModalProps) => {
    if (!show) return null;

    if (asTab) {
        return (
            <div className="p-5 flex flex-col gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 items-start relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText size={64}/>
                    </div>
                    <div className="shrink-0 p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                        <Info size={24}/>
                    </div>
                    <div className="flex-1 space-y-2 relative z-10">
                        <h3 className="font-bold text-emerald-400">Cách viết kịch bản</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                           Con hãy dán đoạn kịch bản hội thoại vào ô bên dưới. <br/>
                           - Bắt đầu mỗi dòng bằng <span className="font-bold text-orange-400 bg-orange-400/20 px-2 py-0.5 rounded">Lão:</span> hoặc <span className="font-bold text-sky-400 bg-sky-400/20 px-2 py-0.5 rounded">Con:</span><br/>
                           - Kịch bản sẽ tự động được phân tích và tạo âm thanh tương ứng.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 flex-1 min-h-[300px]">
                     <div className="flex justify-between items-end">
                         <label className="text-xs font-bold text-slate-400">Tùy chọn nhập kịch bản:</label>
                         <div className="flex gap-2">
                             <button onClick={() => setImportMode('append')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${importMode === 'append' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                                 Nối tiếp kịch bản cũ
                             </button>
                             <button onClick={() => setImportMode('overwrite')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${importMode === 'overwrite' ? 'bg-red-600/80 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                                 Xóa cũ, thay bằng mới
                             </button>
                         </div>
                     </div>
                    <textarea 
                        value={scriptText}
                        onChange={e => setScriptText(e.target.value)}
                        placeholder="Lão: Chào con, hôm nay con thấy thế nào?&#10;Con: Dạ, con hơi mệt mỏi thưa Lão..."
                        className="w-full flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none font-medium leading-relaxed custom-scrollbar"
                    />
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-white/5 mt-auto">
                    <button onClick={onImport} disabled={!scriptText.trim()} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Check size={16}/> Nhập kịch bản
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800">
                    <h2 className="font-black text-emerald-400 tracking-widest flex items-center gap-2"><FileText size={18}/> Nhập kịch bản (Text-to-Video)</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-6 flex flex-col gap-4">
                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl">
                       <p className="text-[12px] text-emerald-300 flex items-start gap-2 leading-relaxed">
                         <Info size={16} className="shrink-0 mt-0.5"/> 
                         <span>
                           Con hãy dán đoạn kịch bản hội thoại vào ô bên dưới. <br/>
                           Để hệ thống nhận diện đúng hình tướng, mỗi câu thoại cần bắt đầu bằng <b>Con:</b> (hoặc Người hỏi:) và <b>Lão:</b> (hoặc Đáp:).
                         </span>
                       </p>
                    </div>
                    <div className="flex flex-col gap-2">
                         <label className="text-xs font-bold text-slate-400">Tùy chọn nhập kịch bản:</label>
                         <div className="flex gap-4">
                             <label className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-emerald-300 transition-colors">
                                 <input type="radio" name="importMode" value="new" checked={importMode === 'new'} onChange={() => setImportMode('new')} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                                 Tạo cuộc đàm đạo mới
                             </label>
                             <label className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-emerald-300 transition-colors">
                                 <input type="radio" name="importMode" value="append" checked={importMode === 'append'} onChange={() => setImportMode('append')} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                                 Thêm vào đàm đạo hiện tại
                             </label>
                         </div>
                    </div>
                    <textarea 
                       value={scriptText}
                       onChange={(e: any) => setScriptText(e.target.value)}
                       placeholder={"Con: Lão ơi, sao cõi đời này nhiều phiền não đến thế?\nLão: Phiền não vốn do tâm bám víu mà sinh ra, buông được vọng tưởng thì tự nhiên thanh tịnh."}
                       className="w-full h-[40vh] bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-emerald-500 outline-none resize-none font-mono scrollbar-hide leading-relaxed"
                    />
                    <div className="flex justify-end gap-3 mt-2 border-t border-white/5 pt-4">
                        <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">Hủy</button>
                        <button onClick={onImport} disabled={!scriptText.trim()} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                           <Check size={16}/> Xác nhận &amp; Nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScriptModal;
