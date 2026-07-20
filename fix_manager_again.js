const fs = require('fs');

// Fix AiDirectorManagerModal
let manager = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

manager = manager.replace(
  /const handleInsertRole = \(roleName: string\) => \{[\s\S]*?\}, 10\);\n    \};/,
  `const handleInsertRole = (roleName: string) => {
        const text = editingRawText;
        const actualPrefix = text.length === 0 || text.endsWith('\\n') ? \\\`\${roleName}: \\\` : \\\`\\n\\n\${roleName}: \\\`;
        setEditingRawText(text + actualPrefix);
    };`
);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', manager, 'utf8');

// Fix AiDirectorModal
let aiModal = fs.readFileSync('src/components/onglao/components/AiDirectorModal.tsx', 'utf8');

// Add import ScriptModal
aiModal = aiModal.replace(
    /import React[\s\S]*?from 'react';/,
    "import React, { useState, useEffect, useRef } from 'react';\nimport ScriptModal from './ScriptModal';"
);

// Add publicSettings to props
aiModal = aiModal.replace(
    /aiTopicText: string;\s*setAiTopicText: \(v: string\) => void;/,
    "aiTopicText: string;        setAiTopicText: (v: string) => void;\n      publicSettings?: any;"
);

// Replace the textarea for generated script
const lines = aiModal.split('\n');
const textAreasToReplace = [];

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<textarea') && lines[i+1]?.includes('value={localGenScript}')) {
        textAreasToReplace.push(i);
    }
}

for (let i = textAreasToReplace.length - 1; i >= 0; i--) {
    const startIndex = textAreasToReplace[i];
    let endIndex = startIndex;
    while (!lines[endIndex].includes('/>') && !lines[endIndex].includes('</textarea>')) {
        endIndex++;
    }
    
    const scriptModalComponent = `                            <div className="bg-slate-950 border border-emerald-500/30 rounded-xl mt-2 overflow-hidden">
                                <ScriptModal
                                    hideOptions={true}
                                    show={true}
                                    scriptText={localGenScript}
                                    setScriptText={setLocalGenScript}
                                    publicSettings={p.publicSettings}
                                    customLaoName={p.customLaoName}
                                    customUserName={p.customUserName}
                                    importMode="new"
                                    setImportMode={() => {}}
                                    onImport={() => {}}
                                    onClose={() => {}}
                                />
                            </div>`;
    
    lines.splice(startIndex, endIndex - startIndex + 1, scriptModalComponent);
}

fs.writeFileSync('src/components/onglao/components/AiDirectorModal.tsx', lines.join('\n'), 'utf8');
console.log('Done fix scripts');
