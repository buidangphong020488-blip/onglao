import re

path = r'C:\APP\OngLao\src\components\onglao\components\VideoCreatorModal.tsx'

with open(path, 'r', encoding='utf-8') as f:
    src = f.read()

# Replace ALL <DebouncedInput ... /> with <input ... />
# Pattern: DebouncedInput with value= -> defaultValue=, onChange= -> onBlur=
def replace_debounced_input(m):
    s = m.group(0)
    s = s.replace('<DebouncedInput', '<input')
    # value={xxx} -> defaultValue={xxx}  (but NOT if already defaultValue)
    s = re.sub(r'\bvalue=\{', 'defaultValue={', s)
    # onChange={(e: any) => setXxx(e.target.value)} -> onBlur={(e: any) => setXxx(e.target.value)}
    s = s.replace('onChange={', 'onBlur={')
    return s

# Replace ALL <DebouncedTextarea ... /> with <textarea ... />
def replace_debounced_textarea(m):
    s = m.group(0)
    s = s.replace('<DebouncedTextarea', '<textarea')
    s = re.sub(r'\bvalue=\{', 'defaultValue={', s)
    s = s.replace('onChange={', 'onBlur={')
    return s

# Match self-closing JSX elements (works for multiline)
src = re.sub(r'<DebouncedInput\b[^>]*/>', replace_debounced_input, src, flags=re.DOTALL)
src = re.sub(r'<DebouncedTextarea\b[^>]*/>', replace_debounced_textarea, src, flags=re.DOTALL)

# Also compact big buttons in the main panel (py-4 -> py-2, py-2.5 -> py-1.5, size={18} -> size={14})
# Only in main panel buttons (not modals)
# Logo/BGM buttons  
src = src.replace(
    'text-xs text-slate-300 font-bold py-2.5 px-3 rounded-lg border border-white/10 flex justify-center items-center gap-1.5 transition-all">\r\n                                     <Upload size={14} /> Chọn Logo',
    'text-[11px] text-slate-300 font-bold py-1.5 px-3 rounded-lg border border-white/10 flex justify-center items-center gap-1 transition-all">\r\n                                     <Upload size={12} /> Chọn Logo'
)
src = src.replace(
    'text-rose-400 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center transition-all">\r\n                                        <X size={14} /> Gỡ bỏ',
    'text-rose-400 font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 text-[11px] transition-all">\r\n                                        <X size={12} /> Gỡ bỏ'
)
src = src.replace(
    'text-xs text-slate-300 font-bold py-2.5 px-3 rounded-lg border border-white/10 flex justify-center items-center gap-1.5 transition-all">\r\n                                       <Upload size={14} /> Tải MP3',
    'text-[11px] text-slate-300 font-bold py-1.5 px-3 rounded-lg border border-white/10 flex justify-center items-center gap-1 transition-all">\r\n                                       <Upload size={12} /> Tải MP3'
)
src = src.replace(
    'className="flex-1 bg-slate-800 border border-white/10 text-xs px-3 py-2.5 rounded-lg outline-none text-white focus:border-emerald-500 cursor-pointer"',
    'className="flex-1 bg-slate-800 border border-white/10 text-[11px] px-2 py-1.5 rounded-lg outline-none text-white focus:border-emerald-500 cursor-pointer"'
)
# Tạo AI button
src = src.replace(
    'text-white text-xs font-bold py-2.5 px-4 rounded-r-lg disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all whitespace-nowrap">\r\n                                        {isGeneratingBgm ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Tạo AI',
    'text-white text-[11px] font-bold py-1.5 px-3 rounded-r-lg disabled:opacity-50 flex items-center justify-center gap-1 transition-all whitespace-nowrap">\r\n                                        {isGeneratingBgm ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Tạo AI'
)
# Footer save/render buttons tab "basic"
src = src.replace(
    'text-emerald-400 font-bold py-4 rounded-xl border border-emerald-500/30 flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] text-sm"',
    'text-emerald-400 font-bold py-2 rounded-lg border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all shadow-md text-xs"'
)
src = src.replace('<Save size={18} /> Lưu Cài Đặt', '<Save size={14} /> Lưu Cài Đặt')
src = src.replace(
    'text-white font-bold py-4 rounded-xl tracking-wider flex justify-center items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-wait transition-all hover:scale-[1.02] text-sm"',
    'text-white font-bold py-2 rounded-lg flex justify-center items-center gap-1.5 shadow-lg disabled:opacity-50 disabled:cursor-wait transition-all text-xs"'
)
src = src.replace(
    '{isPreparingVideoData ? <><Loader2 size={18} className="animate-spin"/> Đang render video...</> : <><Video size={18}/> Bắt Đầu Render</>}',
    '{isPreparingVideoData ? <><Loader2 size={14} className="animate-spin"/> Đang render...</> : <><Video size={14}/> Bắt Đầu Render</>}'
)
# Cancel render button (basic tab)
src = src.replace(
    'text-white font-bold py-4 rounded-xl tracking-wider shadow-lg flex items-center justify-center gap-2 animate-pulse">\r\n                                      <XCircle size={18}/> Dừng & Hủy Bỏ Render',
    'text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 animate-pulse text-xs">\r\n                                      <XCircle size={14}/> Dừng & Hủy Bỏ Render'
)
# Text tab render button
src = src.replace(
    'text-white font-bold py-4 rounded-xl tracking-wider flex justify-center items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-wait transition-all hover:scale-[1.02]">',
    'text-white font-bold py-2 rounded-lg flex justify-center items-center gap-1.5 shadow-lg disabled:opacity-50 disabled:cursor-wait transition-all text-xs">'
)
src = src.replace(
    '{isPreparingVideoData ? <><Loader2 size={18} className="animate-spin"/> Đang render Video...</> : <><Video size={18}/> Bắt Đầu Render Video</>}',
    '{isPreparingVideoData ? <><Loader2 size={14} className="animate-spin"/> Đang render...</> : <><Video size={14}/> Bắt Đầu Render Video</>}'
)
src = src.replace(
    'text-white font-bold py-3.5 rounded-xl tracking-wider shadow-lg flex items-center justify-center gap-2 animate-pulse text-xs">',
    'text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 animate-pulse text-xs">'
)
src = src.replace('<XCircle size={16}/> Dừng & Hủy Bỏ', '<XCircle size={14}/> Dừng & Hủy Bỏ')

# aiBgmPrompt input - replace old size  
src = src.replace(
    'text-xs px-3 py-2.5 rounded-l-lg outline-none text-white placeholder:text-slate-500 focus:border-emerald-500" />\r\n                                      <button onClick={handleGenerateAiBgm}',
    'text-[11px] px-3 py-1.5 rounded-l-lg outline-none text-white placeholder:text-slate-500 focus:border-emerald-500" />\r\n                                      <button onClick={handleGenerateAiBgm}'
)

# Add updateChatMessageContentAction import if not already there
if 'updateChatMessageContentAction' not in src:
    src = src.replace(
        'import { idb } from "../constants";',
        'import { idb } from "../constants";\nimport { updateChatMessageContentAction } from "@/chat";'
    )

# Replace old static textSnippet block with inline editable textarea
old_snippet = '''                                                {(() => {
                                                    const targetRole = scene.role === 'lao' ? 'ai' : (scene.role === 'user' ? 'user' : 'outro');
                                                    if (scene.textSnippet) return (
                                                        <div className="w-full text-[10px] text-slate-300 italic truncate mb-0.5 bg-slate-900 px-1.5 py-0.5 rounded border border-white/5" title={scene.textSnippet}>
                                                            "{scene.textSnippet}"
                                                        </div>
                                                    );
                                                    if (targetRole === 'outro') return null;
                                                    
                                                    // Nếu scene có msgId thì chỉ lấy đúng câu thoại đó
                                                    const matchedMsgs = scene.msgId 
                                                        ? messages.filter((m: any) => m.id === scene.msgId || `scene_msg_${m.id}` === scene.id || scene.id.includes(`_${m.id}`))
                                                        : messages.filter((m: any) => {
                                                            const mRole = m.role === 'ASSISTANT' || m.role === 'ai' ? 'ai' : 'user';
                                                            return mRole === targetRole;
                                                        });

                                                    if (matchedMsgs.length === 0) return (
                                                        <div className="w-full text-[8px] text-amber-400 bg-amber-900/20 px-1.5 py-1 rounded border border-amber-500/20 mb-0.5">
                                                            ⚠️ Chưa có thoại khớp vai này
                                                        </div>
                                                    );

                                                    // Nếu cảnh này được gán riêng cho 1 câu thoại cụ thể
                                                    if (scene.msgId || matchedMsgs.length === 1) {
                                                        const m = matchedMsgs[0];
                                                        return (
                                                            <div className="w-full text-[10px] text-slate-300 italic mb-0.5 bg-slate-900 px-1.5 py-1 rounded border border-white/5" title={m.text}>
                                                                <span className="text-indigo-400 font-bold not-italic mr-1">Thoại:</span>
                                                                "{m.text}"
                                                            </div>
                                                        );
                                                    }

                                                    // Nếu cảnh này là cảnh chung (fallback) cho nhiều câu, không hiển thị danh sách thoại gộp
                                                    return null;
                                                })()}'''

new_snippet = '''                                                {/* Editable text snippet – blur to save to DB */}
                                                {scene.msgId && (() => {
                                                    const msgText = scene.textSnippet ||
                                                        messages.find((m: any) => m.id === scene.msgId)?.text || '';
                                                    return (
                                                        <textarea
                                                            key={scene.id}
                                                            defaultValue={msgText}
                                                            rows={2}
                                                            placeholder="Nội dung thoại..."
                                                            className="w-full text-[10px] text-slate-200 bg-slate-900/80 border border-white/10 focus:border-indigo-400 rounded px-1.5 py-1 mb-0.5 resize-none outline-none leading-relaxed"
                                                            onBlur={async (e) => {
                                                                const newText = e.target.value.trim();
                                                                if (!newText || newText === msgText) return;
                                                                setFfScenes((prev: any) => prev.map((s: any) =>
                                                                    s.id === scene.id ? { ...s, textSnippet: newText } : s
                                                                ));
                                                                try {
                                                                    await updateChatMessageContentAction(scene.msgId, newText);
                                                                    p.setMessages((prev: any) => prev.map((m: any) =>
                                                                        m.id === scene.msgId ? { ...m, text: newText } : m
                                                                    ));
                                                                } catch(err) {
                                                                    console.warn('Lỗi cập nhật thoại:', err);
                                                                }
                                                            }}
                                                        />
                                                    );
                                                })()}'''

if old_snippet in src:
    src = src.replace(old_snippet, new_snippet)
    print("Replaced static snippet block")
else:
    print("WARNING: old snippet block not found - may already be replaced or different whitespace")

with open(path, 'w', encoding='utf-8') as f:
    f.write(src)

# Verify
remaining_di = src.count('<DebouncedInput')
remaining_dt = src.count('<DebouncedTextarea')
print(f"Remaining <DebouncedInput: {remaining_di}")
print(f"Remaining <DebouncedTextarea: {remaining_dt}")
print(f"Has updateChatMessageContentAction: {'updateChatMessageContentAction' in src}")
print(f"Has inline scene textarea: {'updateChatMessageContentAction(scene.msgId' in src}")
print("DONE")
