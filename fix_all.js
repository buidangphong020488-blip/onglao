const fs = require('fs');

let manager = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');
const lines = manager.split('\n');

// 1. Fix handleInsertRole
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const handleInsertRole = (roleName: string) => {') && lines[i+1].includes('const ta = textareaRef.current;')) {
        let endIndex = i;
        while (!lines[endIndex].includes('}, 10);')) endIndex++;
        endIndex++; // to include };
        
        const newHandle = `    const handleInsertRole = (roleName: string) => {
        const text = editingRawText;
        const actualPrefix = text.length === 0 || text.endsWith('\\n') ? \\\`\${roleName}: \\\` : \\\`\\n\\n\${roleName}: \\\`;
        setEditingRawText(text + actualPrefix);
    };`;
        lines.splice(i, endIndex - i + 1, newHandle);
        break;
    }
}

// 2. Add publicSettings to props
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('aiScriptLength: string;')) {
        lines[i] = lines[i].replace('aiScriptLength: string;     setAiScriptLength: (v: string) => void;', 'aiScriptLength: string;     setAiScriptLength: (v: string) => void;\n    publicSettings?: any;');
        // try another format if first fails
        lines[i] = lines[i].replace('aiScriptLength: string; setAiScriptLength: (v: string) => void;', 'aiScriptLength: string; setAiScriptLength: (v: string) => void;\n    publicSettings?: any;');
        break;
    }
}

// 3. Replace textarea with ScriptModal
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<textarea') && lines[i+1]?.includes('ref={textareaRef}') && lines[i+2]?.includes('value={editingRawText}')) {
        let endIndex = i;
        while (!lines[endIndex].includes('/>') && !lines[endIndex].includes('</textarea>')) endIndex++;
        
        const scriptModalReplacement = `                                        <ScriptModal
                                            hideOptions={true}
                                            show={true}
                                            scriptText={editingRawText}
                                            setScriptText={setEditingRawText}
                                            publicSettings={p.publicSettings}
                                            customLaoName={p.customLaoName}
                                            customUserName={p.customUserName}
                                            importMode="new"
                                            setImportMode={() => {}}
                                            onImport={() => {}}
                                            onClose={() => {}}
                                        />`;
        lines.splice(i, endIndex - i + 1, scriptModalReplacement);
        break;
    }
}

// 4. Add publicSettings to AiDirectorModal instantiation
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<AiDirectorModal') && lines[i+1]?.includes('show={showCreator}')) {
        lines.splice(i + 1, 0, '                publicSettings={p.publicSettings}');
        break;
    }
}

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', lines.join('\n'), 'utf8');
console.log('Done fix_all');
