"use client";
import React from 'react';
import { FileText, X, Info, Check, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScriptModalProps {
    show: boolean;
    onClose: () => void;
    scriptText: string;
    setScriptText: (v: string) => void;
    importMode: string;
    setImportMode: (v: string) => void;
    onImport: () => void;
    asTab?: boolean;
    publicSettings?: any;
    hideOptions?: boolean;
    customLaoName?: string;
    customUserName?: string;
}

interface ScriptBlock {
    id: string;
    role: string;
    emotion: string;
    text: string;
}

const ScriptModal = ({ show, onClose, scriptText, setScriptText, importMode, setImportMode, onImport, asTab, publicSettings, hideOptions, customLaoName, customUserName }: ScriptModalProps) => {
    const [blocks, setBlocks] = useState<ScriptBlock[]>([]);
    const lastSerializedTextRef = React.useRef('');

    const EMOTIONS: Record<string, string> = React.useMemo(() => {
        try {
            if (publicSettings?.characterStates) {
                const parsed = JSON.parse(publicSettings.characterStates);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.reduce((acc: any, s: any) => ({ ...acc, [s.id]: s.name }), {});
                }
            }
        } catch(e) {}
        return { calm: 'Bình thường', sad: 'Buồn bã', joy: 'Vui vẻ', hook: 'Nhấn mạnh' };
    }, [publicSettings?.characterStates]);

    useEffect(() => {
        if (!show) return;
        
        // Skip parsing if this update was triggered by our own serialization
        if (scriptText === lastSerializedTextRef.current) {
            return;
        }

        const lines = scriptText.split('\n').filter(l => l.trim());
        const newBlocks: ScriptBlock[] = [];
        let currentRole = 'ai';

        if (lines.length === 0) {
            setBlocks([{ id: Date.now().toString(), role: 'user', emotion: 'calm', text: '' }]);
            return;
        }

        lines.forEach((line, idx) => {
            let role = currentRole;
            let emotion = 'calm';
            let text = line.trim();
            const escapeRegex = (s: string | undefined) => s ? s.toLowerCase().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") : '';
            const userNamePattern = [escapeRegex(customUserName), 'con', 'ngu?i h?i', 'h?i'].filter(Boolean).join('|');
            const aiNamePattern = [escapeRegex(customLaoName), 'lo', 'dp', 'ai'].filter(Boolean).join('|');

            const userRegex = new RegExp(`^(${userNamePattern})(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:`, 'i');
            const aiRegex = new RegExp(`^(${aiNamePattern})(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:`, 'i');

            const userMatch = text.match(userRegex);
            const aiMatch = text.match(aiRegex);

            if (userMatch) {
                role = 'user';
                emotion = userMatch[2] || userMatch[3] || 'calm';
                text = text.replace(new RegExp(`^(${userNamePattern})(?:\\s*\\[.*?\\]|\\s*\\(.*?\\))?\\s*:\\s*`, 'i'), '').trim();
                currentRole = 'user';
            } else if (aiMatch) {
                role = 'ai';
                emotion = aiMatch[2] || aiMatch[3] || 'calm';
                text = text.replace(new RegExp(`^(${aiNamePattern})(?:\\s*\\[.*?\\]|\\s*\\(.*?\\))?\\s*:\\s*`, 'i'), '').trim();
                currentRole = 'ai';
            }
            if (!userMatch && !aiMatch && newBlocks.length > 0) {
                currentRole = currentRole === 'ai' ? 'user' : 'ai';
                role = currentRole;
            }
            newBlocks.push({ id: `${role}_${idx}_${Date.now().toString().substring(8)}`, role, emotion: ['calm', 'sad', 'joy', 'hook'].includes(emotion) ? emotion : 'calm', text });
        });
        setBlocks(newBlocks);
        lastSerializedTextRef.current = scriptText;
    }, [scriptText, show]);

    const serializeAndSave = (currentBlocks: ScriptBlock[]) => {
        const text = currentBlocks.map(b => {
            const roleStr = b.role === 'ai' ? (customLaoName || 'Lo') : (customUserName || 'Con');
            return `${roleStr} [${b.emotion}]: ${b.text}`;
        }).join('\n');
        lastSerializedTextRef.current = text;
        setScriptText(text);
    };

    const updateBlock = (id: string, field: keyof ScriptBlock, value: string) => {
        const newBlocks = blocks.map(b => b.id === id ? { ...b, [field]: value } : b);
        setBlocks(newBlocks);
        serializeAndSave(newBlocks);
    };

    const removeBlock = (id: string) => {
        const newBlocks = blocks.filter(b => b.id !== id);
        setBlocks(newBlocks);
        serializeAndSave(newBlocks);
    };

    const addBlock = () => {
        const lastRole = blocks.length > 0 ? blocks[blocks.length - 1].role : 'ai';
        const newRole = lastRole === 'ai' ? 'user' : 'ai';
        const newBlocks = [...blocks, { id: Date.now().toString(), role: newRole, emotion: 'calm', text: '' }];
        setBlocks(newBlocks);
        serializeAndSave(newBlocks);
    };

    if (!show) return null;

    const renderEditor = () => (
        <div className="flex flex-col gap-3 flex-1 min-h-[300px] max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
            {blocks.map((block, idx) => (
                <div key={block.id} className={`flex gap-3 items-start p-3 rounded-xl border ${block.role === 'ai' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-sky-500/5 border-sky-500/20'}`}>
                    <div className="flex flex-col gap-2 w-32 shrink-0">
                        <select 
                            value={block.role}
                            onChange={e => updateBlock(block.id, 'role', e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white font-bold outline-none focus:border-emerald-500"
                        >
                            <option value="user">Con (Hỏi)</option>
                            <option value="ai">Lão (Đáp)</option>
                        </select>
                        <select 
                            value={block.emotion}
                            onChange={e => updateBlock(block.id, 'emotion', e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white font-bold outline-none focus:border-emerald-500"
                        >
                            {Object.entries(EMOTIONS).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                            ))}
                        </select>
                    </div>
                    
                    <textarea 
                        value={block.text}
                        onChange={e => updateBlock(block.id, 'text', e.target.value)}
                        placeholder="Nhập nội dung thoại..."
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none font-medium leading-relaxed custom-scrollbar h-[72px]"
                    />
                    
                    <button onClick={() => removeBlock(block.id)} className="text-slate-500 hover:text-red-400 p-2 shrink-0">
                        <Trash2 size={16}/>
                    </button>
                </div>
            ))}
            
            <button onClick={addBlock} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-500/5 flex justify-center items-center gap-2 transition-all text-sm font-bold mt-2">
                <Plus size={18} /> Thêm câu thoại mới
            </button>
        </div>
    );

    if (hideOptions) {
        return renderEditor();
    }

    if (asTab) {
        return (
            <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-2 flex-1">
                     <div className="flex justify-between items-end mb-2">
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
                     {renderEditor()}
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
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800">
                    <h2 className="font-black text-emerald-400 tracking-widest flex items-center gap-2"><FileText size={18}/> Soạn Kịch Bản</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1 overflow-hidden">
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
                    
                    {renderEditor()}
                    
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
