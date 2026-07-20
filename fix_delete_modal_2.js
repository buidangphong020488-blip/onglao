const fs = require('fs');
let manager = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

// Add state
manager = manager.replace(
    /const \[selectedIds, setSelectedIds\] = useState<Set<string>>\(new Set\(\)\);/,
    "const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());\n    const [deleteConfirm, setDeleteConfirm] = useState<{ids: string[], count: number} | null>(null);"
);

// Replace handleDeleteScript
const handleDeleteRegex = /    \/\/ Delete script session[\s\S]*?    \/\/ Save editing messages/;
const newHandleDeleteStr = `    // Execute actual delete
    const executeDeleteScripts = async (ids: string[]) => {
        setSaving(true);
        try {
            for (const id of ids) {
                const res = await deleteChatSessionAction(id);
                if (res.success) {
                    p.setSessions((prev: any[]) => prev.filter(s => s.id !== id));
                    if (p.currentSessionId === id) {
                        p.setCurrentSessionId(null);
                    }
                } else {
                    p.showToastMsg('L?i khi xóa k?ch b?n: ' + (res.error || ''), 'error');
                }
            }
            p.showToastMsg('Ðã xóa ' + ids.length + ' k?ch b?n.', 'success');
        } catch (err) {
            p.showToastMsg('L?i khi xóa k?ch b?n.', 'error');
        } finally {
            setSaving(false);
            setDeleteConfirm(null);
            setSelectedIds(new Set());
        }
    };

    // Trigger single delete modal
    const handleDeleteScript = (id: any) => {
        setDeleteConfirm({ ids: [id], count: 1 });
    };

    // Save editing messages`;
manager = manager.replace(handleDeleteRegex, newHandleDeleteStr);

// Replace handleBulkDelete
const handleBulkRegex = /    \/\/ Xa nhi\?u k\?ch b\?n[\s\S]*?    const handleDownloadAudio =/;
const newHandleBulkStr = `    // Xóa nhi?u k?ch b?n cùng lúc
    const handleBulkDelete = () => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        setDeleteConfirm({ ids, count: ids.length });
    };

    const handleDownloadAudio =`;
manager = manager.replace(handleBulkRegex, newHandleBulkStr);
// Fallback if handleBulkRegex with unicode fails
manager = manager.replace(
    /    \/\/ X[\s\S]*?a nhi[\s\S]*?u k[\s\S]*?ch b[\s\S]*?n[\s\S]*?    const handleBulkDelete = async \(\) => \{[\s\S]*?setSelectedIds\(new Set\(\)\);\n    \};\n\n    const handleDownloadAudio =/,
    newHandleBulkStr
);


// Inject Modal JSX at the end of the return statement
const modalJsx = `
            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-rose-500/30 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center animate-in zoom-in-95">
                        <div className="mx-auto w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mb-4">
                            <Trash2 className="text-rose-400" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Xác nh?n xóa</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            B?n có ch?c ch?n mu?n xóa {deleteConfirm.count} k?ch b?n không? Hành d?ng này không th? hoàn tác.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={saving}
                                className="px-5 py-2 rounded-xl text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                H?y b?
                            </button>
                            <button
                                onClick={() => executeDeleteScripts(deleteConfirm.ids)}
                                disabled={saving}
                                className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                                {saving ? 'Ðang xóa...' : 'Xóa ngay'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};`;

manager = manager.replace(/        <\/div>\r?\n    \);\r?\n\};\r?\n\r?\nexport default AiDirectorManagerModal;/, modalJsx + "\n\nexport default AiDirectorManagerModal;");

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', manager, 'utf8');
console.log('Modified manager delete logic');
