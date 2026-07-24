"use client";
import React, {
    useEffect, useState, useRef, useCallback, useMemo,
    useImperativeHandle, forwardRef,
} from 'react';
import { FileText, X, Check, Plus, Trash2 } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface ScriptBlock {
    id: string;
    role: 'ai' | 'user';
    emotion: string;
}

interface ScriptBlockFull extends ScriptBlock {
    text: string; // chỉ dùng để khởi tạo defaultValue
}

export interface ScriptModalHandle {
    getLatestText: () => string;
}

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

// ── Helpers ────────────────────────────────────────────────────────────────
const normalizeEmotionCode = (emoStr: string) => {
    const e = (emoStr || '').toLowerCase().trim();
    if (['buon', 'sad'].includes(e)) return 'sad';
    if (['vui', 'joy'].includes(e)) return 'joy';
    if (['binhthuong', 'calm'].includes(e)) return 'calm';
    if (['hook', 'intro', 'mao_dau'].includes(e)) return 'hook';
    if (['tuc_gian', 'angry'].includes(e)) return 'angry';
    if (['ngac_nhien', 'surprise'].includes(e)) return 'surprise';
    if (['thiet_tha', 'earnest'].includes(e)) return 'earnest';
    if (['nghiem_tuc', 'serious'].includes(e)) return 'serious';
    if (['tinh_thuc', 'awakened'].includes(e)) return 'awakened';
    return e || 'calm';
};
function parseToBlocks(
    text: string,
    laoName: string,
    userName: string,
    characterStatesArr: any[] = []
): ScriptBlockFull[] {
    const lines = text.split('\n').filter(l => l.trim());
    if (!lines.length) return [{ id: '0', role: 'user', emotion: 'calm', text: '' }];

    const escRe = (s: string) =>
        s.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

    const aiRe   = new RegExp(`^(?:${escRe(laoName)}|l[aã]o|đáp|ai|assistant)(?:\\s*\\[([^\\]]*)]|\\s*\\(([^)]*?)\\))?\\s*:`, 'i');
    const userRe = new RegExp(`^(?:${escRe(userName)}|con|hỏi|user|question)(?:\\s*\\[([^\\]]*)]|\\s*\\(([^)]*?)\\))?\\s*:`, 'i');

    const blocks: ScriptBlockFull[] = [];
    let idx = 0;

    for (const raw of lines) {
        const line = raw.trim();
        const aMatch = line.match(aiRe);
        const uMatch = !aMatch && line.match(userRe);

        if (aMatch) {
            const emotion = (aMatch[1] ?? aMatch[2] ?? 'calm').toLowerCase().trim();
            const content = line.slice(aMatch[0].length).trim();
            blocks.push({
                id: String(idx++), role: 'ai',
                emotion: normalizeEmotionCode(emotion),
                text: content,
            });
        } else if (uMatch) {
            const emotion = (uMatch[1] ?? uMatch[2] ?? 'calm').toLowerCase().trim();
            const content = line.slice(uMatch[0].length).trim();
            blocks.push({
                id: String(idx++), role: 'user',
                emotion: normalizeEmotionCode(emotion),
                text: content,
            });
        } else if (blocks.length) {
            // Không có prefix → nối vào block trước
            blocks[blocks.length - 1].text += '\n' + line;
        } else {
            blocks.push({ id: String(idx++), role: 'user', emotion: 'calm', text: line });
        }
    }
    return blocks;
}

// ── ScriptBlockRow ─────────────────────────────────────────────────────────
// role/emotion là controlled (thay đổi ít + ảnh hưởng giao diện)
// text là UNCONTROLLED defaultValue → không setState khi gõ → zero lag
const ScriptBlockRow = React.memo(({
    block, initialText, taRef,
    onRoleChange, onEmotionChange, onRemove,
    EMOTIONS,
}: {
    block: ScriptBlock;
    initialText: string;
    taRef: React.RefObject<HTMLTextAreaElement | null>;
    onRoleChange:    (id: string, role: 'ai' | 'user') => void;
    onEmotionChange: (id: string, emotion: string)     => void;
    onRemove:        (id: string) => void;
    EMOTIONS: Record<string, string>;
}) => {
    const isAi = block.role === 'ai';

    const autoResize = (el: HTMLTextAreaElement) => {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    };

    // Resize khi mount
    useEffect(() => {
        const el = taRef.current;
        if (el) autoResize(el);
    }, []);

    return (
        <div className={`flex gap-3 items-start p-3 rounded-xl border transition-colors ${
            isAi ? 'bg-orange-500/5 border-orange-500/20' : 'bg-sky-500/5 border-sky-500/20'
        }`}>
            {/* Selects — controlled vì thay đổi màu border/bg */}
            <div className="flex flex-col gap-2 w-32 shrink-0">
                <select
                    value={block.role}
                    onChange={e => onRoleChange(block.id, e.target.value as 'ai' | 'user')}
                    className="bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white font-bold outline-none focus:border-emerald-500 cursor-pointer"
                >
                    <option value="user">Con (Hỏi)</option>
                    <option value="ai">Lão (Đáp)</option>
                </select>
                <select
                    value={block.emotion}
                    onChange={e => onEmotionChange(block.id, e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white font-bold outline-none focus:border-emerald-500 cursor-pointer"
                >
                    {Object.entries(EMOTIONS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
            </div>

            {/* Textarea — UNCONTROLLED, không setState khi gõ */}
            <textarea
                ref={taRef}
                defaultValue={initialText}
                rows={2}
                onInput={e => autoResize(e.currentTarget)}
                placeholder="Nội dung câu thoại..."
                className="flex-1 bg-slate-950/80 border border-white/15 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/70 resize-y font-medium leading-relaxed min-h-[60px]"
            />

            <button
                onClick={() => onRemove(block.id)}
                className="text-slate-500 hover:text-red-400 p-2 shrink-0 transition-colors"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
// Chỉ re-render khi role/emotion/id thay đổi — KHÔNG re-render khi gõ text
}, (prev, next) =>
    prev.block.id      === next.block.id &&
    prev.block.role    === next.block.role &&
    prev.block.emotion === next.block.emotion &&
    prev.EMOTIONS      === next.EMOTIONS
);
ScriptBlockRow.displayName = 'ScriptBlockRow';

// ── ScriptModal ────────────────────────────────────────────────────────────
const ScriptModalInner = (
    { show, onClose, scriptText, setScriptText,
      importMode, setImportMode, onImport,
      asTab, publicSettings, hideOptions,
      customLaoName, customUserName }: ScriptModalProps,
    ref: React.Ref<ScriptModalHandle>,
) => {
    const laoName  = customLaoName  || 'Lão';
    const userName = customUserName || 'Con';

    const EMOTIONS: Record<string, string> = useMemo(() => {
        try {
            if (publicSettings?.characterStates) {
                const arr = JSON.parse(publicSettings.characterStates);
                if (Array.isArray(arr) && arr.length)
                    return arr.reduce((a: any, s: any) => ({ ...a, [s.id]: s.name }), {});
            }
        } catch {}
        return { calm: 'Bình thường', sad: 'Buồn bã', joy: 'Vui vẻ', hook: 'Nhấn mạnh' };
    }, [publicSettings?.characterStates]);

    // State: chỉ lưu { id, role, emotion } — KHÔNG lưu text
    const [blocks, setBlocks] = useState<ScriptBlock[]>([]);

    // initialTexts: text ban đầu của mỗi block (chỉ dùng để set defaultValue)
    // Lưu bằng ref để không trigger re-render
    const initialTextsRef = useRef<Record<string, string>>({});

    // Refs tới DOM textarea của mỗi block → đọc khi save
    const taRefs = useRef<Record<string, React.RefObject<HTMLTextAreaElement | null>>>({});

    const lastParsedRef = useRef('');

    // Parse scriptText → blocks khi text thay đổi từ bên ngoài
    useEffect(() => {
        if (!show) return;
        if (scriptText === lastParsedRef.current) return;
        lastParsedRef.current = scriptText;

        let statesArr: any[] = [];
        try {
            if (publicSettings?.characterStates) {
                statesArr = typeof publicSettings.characterStates === 'string' ? JSON.parse(publicSettings.characterStates) : publicSettings.characterStates;
            }
        } catch {}
        const parsed = parseToBlocks(scriptText, laoName, userName, statesArr);

        // Khởi tạo initialTexts và tạo refs mới
        const newTexts: Record<string, string> = {};
        const newRefs: Record<string, React.RefObject<HTMLTextAreaElement | null>> = {};
        parsed.forEach(b => {
            newTexts[b.id] = b.text;
            newRefs[b.id]  = { current: null };
        });
        initialTextsRef.current = newTexts;
        taRefs.current = newRefs;

        setBlocks(parsed.map(({ id, role, emotion }) => ({ id, role, emotion })));
    }, [scriptText, show, laoName, userName]);

    // Đọc text từ DOM refs → serialize
    const getLatestText = useCallback((): string => {
        return blocks.map(b => {
            const text = taRefs.current[b.id]?.current?.value
                      ?? initialTextsRef.current[b.id]
                      ?? '';
            const name = b.role === 'ai' ? laoName : userName;
            return `${name} [${b.emotion}]: ${text}`;
        }).join('\n');
    }, [blocks, laoName, userName]);

    useImperativeHandle(ref, () => ({ getLatestText }), [getLatestText]);

    // ── Callbacks ──────────────────────────────────────────────────────────
    const onRoleChange = useCallback((id: string, role: 'ai' | 'user') => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, role } : b));
    }, []);

    const onEmotionChange = useCallback((id: string, emotion: string) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, emotion } : b));
    }, []);

    const onRemove = useCallback((id: string) => {
        setBlocks(prev => {
            if (prev.length <= 1) return prev;
            const next = prev.filter(b => b.id !== id);
            delete taRefs.current[id];
            delete initialTextsRef.current[id];
            return next;
        });
    }, []);

    const onAdd = useCallback(() => {
        const newId = Date.now().toString();
        const lastRole = blocks.length ? blocks[blocks.length - 1].role : 'ai';
        const newRole: 'ai' | 'user' = lastRole === 'ai' ? 'user' : 'ai';
        initialTextsRef.current[newId] = '';
        taRefs.current[newId] = { current: null };
        setBlocks(prev => [...prev, { id: newId, role: newRole, emotion: 'calm' }]);
    }, [blocks]);

    const handleImport = useCallback(() => {
        const text = getLatestText();
        lastParsedRef.current = text;
        setScriptText(text);
        onImport();
    }, [getLatestText, setScriptText, onImport]);

    if (!show) return null;

    const editor = (
        <div className="flex flex-col gap-3 flex-1 min-h-0">
            <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
                {blocks.map(block => {
                    // Đảm bảo ref tồn tại
                    if (!taRefs.current[block.id])
                        taRefs.current[block.id] = { current: null };
                    return (
                        <ScriptBlockRow
                            key={block.id}
                            block={block}
                            initialText={initialTextsRef.current[block.id] ?? ''}
                            taRef={taRefs.current[block.id]}
                            onRoleChange={onRoleChange}
                            onEmotionChange={onEmotionChange}
                            onRemove={onRemove}
                            EMOTIONS={EMOTIONS}
                        />
                    );
                })}
            </div>
            <button
                onClick={onAdd}
                className="w-full py-3 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-500/5 flex justify-center items-center gap-2 transition-all text-sm font-bold shrink-0"
            >
                <Plus size={18} /> Thêm câu thoại mới
            </button>
        </div>
    );

    if (hideOptions) return editor;

    if (asTab) return (
        <div className="p-5 flex flex-col gap-4 flex-1 min-h-0">
            <div className="flex justify-between items-center shrink-0">
                <label className="text-xs font-bold text-slate-400">Tùy chọn nhập kịch bản:</label>
                <div className="flex gap-2">
                    <button onClick={() => setImportMode('append')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${importMode === 'append' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        Nối tiếp kịch bản cũ
                    </button>
                    <button onClick={() => setImportMode('overwrite')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${importMode === 'overwrite' ? 'bg-red-600/80 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        Xóa cũ, thay bằng mới
                    </button>
                </div>
            </div>
            {editor}
            <div className="pt-2 flex justify-end border-t border-white/5 shrink-0">
                <button onClick={handleImport}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2">
                    <Check size={16} /> Nhập kịch bản
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col animate-in zoom-in-95 max-h-[90vh]"
                onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 shrink-0">
                    <h2 className="font-black text-emerald-400 tracking-widest flex items-center gap-2">
                        <FileText size={18} /> Soạn Kịch Bản
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1 overflow-hidden min-h-0">
                    <div className="flex flex-col gap-2 shrink-0">
                        <label className="text-xs font-bold text-slate-400">Tùy chọn nhập kịch bản:</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-emerald-300 transition-colors">
                                <input type="radio" name="importMode" value="new"
                                    checked={importMode === 'new'} onChange={() => setImportMode('new')}
                                    className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                                Tạo cuộc đàm đạo mới
                            </label>
                            <label className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-emerald-300 transition-colors">
                                <input type="radio" name="importMode" value="append"
                                    checked={importMode === 'append'} onChange={() => setImportMode('append')}
                                    className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                                Thêm vào đàm đạo hiện tại
                            </label>
                        </div>
                    </div>
                    {editor}
                    <div className="flex justify-end gap-3 border-t border-white/5 pt-4 shrink-0">
                        <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">Hủy</button>
                        <button onClick={handleImport}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2">
                            <Check size={16} /> Xác nhận &amp; Nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ScriptModal = forwardRef(ScriptModalInner);
ScriptModal.displayName = 'ScriptModal';
export default ScriptModal;
