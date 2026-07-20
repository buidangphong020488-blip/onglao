const fs = require('fs');

let manager = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

// 1. Add state
const statePattern = /const \[selectedIds, setSelectedIds\] = useState<Set<string>>\(new Set\(\)\);/;
manager = manager.replace(
    statePattern,
    "const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());\n    const [deleteConfirm, setDeleteConfirm] = useState<{ids: string[], count: number} | null>(null);"
);

// 2. Modify handleDeleteScript
const handleDeletePattern = /const handleDeleteScript = async \(id: any\) => \{\s+if \(!confirm\('.*?'\)\) return;\s+try \{/;
const newHandleDelete = `    const executeDeleteScripts = async (ids: string[]) => {
        setSaving(true);
        try {
            for (const id of ids) {
                const res = await deleteChatSessionAction(id);
                if (res.success) {
                    p.setSessions(prev => prev.filter(s => s.id !== id));
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

    const handleDeleteScript = async (id: any) => {
        setDeleteConfirm({ ids: [id], count: 1 });
    };

    const handleDeleteScriptBypass = async (id: any) => {
        // Obsolete logic for individual without confirm, replaced by executeDeleteScripts
    };

    // Prevent compile error for unused
    const _oldDelete = async () => {
        try {`;
manager = manager.replace(handleDeletePattern, newHandleDelete);
// Note: We need a better replacement strategy to not break existing handleDeleteScript block completely.
// Let's rewrite the script.
