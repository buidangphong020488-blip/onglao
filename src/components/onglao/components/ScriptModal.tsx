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

    const aiRe   = new RegExp(`^(?:${escRe(laoName)}|l[aã]o|đáp|ai|assistant)(?:\\s*\\[([^\]]*)\\]|\\s*\\(([^)]*?)\\))?\\s*:`, 'i');
    const userRe = new RegExp(`^(?:${escRe(userName)}|con|hỏi|user|question)(?:\\s*\\[([^\]]*)\\]|\\s*\\(([^)]*?)\\))?\\s*:`, 'i');

    const matchDbStateId = (tagStr: string) => {
        const raw = (tagStr || '').toLowerCase().trim();
        if (!raw) return 'calm';
        if (Array.isArray(characterStatesArr) && characterStatesArr.length > 0) {
            const found = characterStatesArr.find((s: any) => 
                (s.id && s.id.toLowerCase() === raw) || 
                (s.emotion && s.emotion.toLowerCase() === raw) ||
                (s.name && s.name.toLowerCase().includes(raw))
            );
            if (found) return found.id;
        }
        return raw;
    };

    const blocks: ScriptBlockFull[] = [];
    let idx = 0;

    for (const raw of lines) {
        const line = raw.trim();
        const aMatch = line.match(aiRe);
        const uMatch = !aMatch && line.match(userRe);

        if (aMatch) {
            const rawEmo = (aMatch[1] ?? aMatch[2] ?? 'calm').toLowerCase().trim();
            const content = line.slice(aMatch[0].length).trim();
            blocks.push({
                id: String(idx++), role: 'ai',
                emotion: matchDbStateId(rawEmo),
                text: content,
            });
        } else if (uMatch) {
            const rawEmo = (uMatch[1] ?? uMatch[2] ?? 'calm').toLowerCase().trim();
            const content = line.slice(uMatch[0].length).trim();
            blocks.push({
                id: String(idx++), role: 'user',
                emotion: matchDbStateId(rawEmo),
                text: content,
            });
        } else if (blocks.length) {
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
    block,
    initialText,
    idx,
    laoName,
    userName,
    EMOTIONS,
    onRoleChange,
    onEmotionChange,
    onDelete,
    registerRef,
}: {
    block: ScriptBlock;
    initialText: string;
    idx: number;
    laoName: string;
    userName: string;
    EMOTIONS: Record<string, string>;
    onRoleChange: (id: string, role: 'ai' | 'user') => void;
    onEmotionChange: (id: string, emotion: string) => void;
    onDelete: (id: string) => void;
    registerRef: (id: string, el: HTMLTextAreaElement | null) => void;
}) => {
    const isAi = block.role === 'ai';

    return (
        <div className={`p-3 rounded-lg border ${isAi ? 'bg-amber-950/20 border-amber-500/20' : 'bg-blue-950/20 border-blue-500/20'} flex flex-col gap-2 relative group`}>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                    <button
                        type="button"
                        onClick={() => onRoleChange(block.id, isAi ? 'user' : 'ai')}
                        className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${isAi ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'}`}
                    >
                        {isAi ? laoName : userName}
                    </button>
                    <select
                        value={block.emotion}
                        onChange={e => onEmotionChange(block.id, e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded px-2 py-0.5 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                    >
                        {Object.entries(EMOTIONS).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="button"
                    onClick={() => onDelete(block.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Xóa câu thoại"
                >
                    <Trash2 size={13} />
                </button>
            </div>
            <textarea
                ref={el => registerRef(block.id, el)}
                defaultValue={initialText}
                rows={2}
                placeholder="Nhập nội dung thoại..."
                className="w-full bg-slate-950/60 border border-white/10 rounded-md p-2 text-xs text-white placeholder-slate-600 outline-none focus:border-white/20 resize-y"
            />
        </div>
    );
}, (prev, next) =>
    prev.block.id      === next.block.id    &&
    prev.block.role    === next.block.role  &&
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
                const arr = typeof publicSettings.characterStates === 'string' 
                    ? JSON.parse(publicSettings.characterStates) 
                    : publicSettings.characterStates;
                if (Array.isArray(arr) && arr.length)
                    return arr.reduce((a: any, s: any) => ({ ...a, [s.id]: s.name }), {});
            }
        } catch {}
        return {};
    }, [publicSettings?.characterStates]);

    const [blocks, setBlocks] = useState<ScriptBlock[]>([]);
    const initialTextsRef = useRef<Record<string, string>>({});
    const taRefs = useRef<Record<string, React.RefObject<HTMLTextAreaElement | null>>>({});
    const lastParsedRef = useRef('');

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

        const newTexts: Record<string, string> = {};
        const newRefs: Record<string, React.RefObject<HTMLTextAreaElement | null>> = {};
        parsed.forEach(b => {
            newTexts[b.id] = b.text;
            newRefs[b.id]  = { current: null };
        });
        initialTextsRef.current = newTexts;
        taRefs.current = newRefs;
        setBlocks(parsed.map(({ id, role, emotion }) => ({ id, role, emotion })));
    }, [show, scriptText, laoName, userName, publicSettings?.characterStates]);

    const buildFullText = useCallback(() => {
        return blocks.map(b => {
            const text = taRefs.current[b.id]?.current?.value ?? initialTextsRef.current[b.id] ?? '';
            const name = b.role === 'ai' ? laoName : userName;
            return `${name} [${b.emotion}]: ${text}`;
        }).join('\n');
    }, [blocks, laoName, userName]);

    useImperativeHandle(ref, () => ({
        getLatestText: () => buildFullText()
    }), [buildFullText]);

    const onRoleChange = useCallback((id: string, role: 'ai' | 'user') => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, role } : b));
    }, []);

    const onEmotionChange = useCallback((id: string, emotion: string) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, emotion } : b));
    }, []);

    const onDelete = useCallback((id: string) => {
        delete initialTextsRef.current[id];
        delete taRefs.current[id];
        setBlocks(prev => prev.filter(b => b.id !== id));
    }, []);

    const onAdd = useCallback(() => {
        const newId = String(Date.now());
        initialTextsRef.current[newId] = '';
        taRefs.current[newId] = { current: null };
        const last = blocks[blocks.length - 1];
        const newRole = last ? (last.role === 'ai' ? 'user' : 'ai') : 'user';
        setBlocks(prev => [...prev, { id: newId, role: newRole, emotion: 'calm' }]);
    }, [blocks]);

    const registerRef = useCallback((id: string, el: HTMLTextAreaElement | null) => {
        if (!taRefs.current[id]) {
            taRefs.current[id] = { current: el };
        } else {
            (taRefs.current[id] as any).current = el;
        }
    }, []);

    const handleSave = () => {
        const full = buildFullText();
        lastParsedRef.current = full;
        setScriptText(full);
        onImport();
        onClose();
    };

    if (!show && !asTab) return null;

    const contentNode = (
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="flex flex-col gap-2">
                <textarea
                    value={scriptText}
                    onChange={e => setScriptText(e.target.value)}
                    rows={6}
                    placeholder="Gõ dạng Lão: [vui] ... hoặc Con: [buon] ..."
                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/50 resize-y font-mono"
                />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Danh Sách Block Thoại Đã Phân Tách ({blocks.length} câu)
                </span>
                <button
                    type="button"
                    onClick={onAdd}
                    className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded text-xs font-bold transition-colors flex items-center gap-1"
                >
                    <Plus size={13} /> Thêm câu
                </button>
            </div>

            <div className="flex flex-col gap-2">
                {blocks.map((b, i) => (
                    <ScriptBlockRow
                        key={b.id}
                        block={b}
                        initialText={initialTextsRef.current[b.id] ?? ''}
                        idx={i}
                        laoName={laoName}
                        userName={userName}
                        EMOTIONS={EMOTIONS}
                        onRoleChange={onRoleChange}
                        onEmotionChange={onEmotionChange}
                        onDelete={onDelete}
                        registerRef={registerRef}
                    />
                ))}
            </div>
        </div>
    );

    if (asTab) return contentNode;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-white/10 rounded-2xl w-full max-w-3xl p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
                        <FileText size={20} /> Chỉnh Sửa Kịch Bản Thoại
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {contentNode}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5"
                    >
                        <Check size={14} /> Lưu & Áp Dụng
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ScriptModal = forwardRef(ScriptModalInner);
export default ScriptModal;
