const fs = require('fs');
let modalContent = fs.readFileSync('src/components/onglao/components/AiDirectorModal.tsx', 'utf8');

// 1. Import ScriptModal
if (!modalContent.includes('import ScriptModal from ')) {
    modalContent = modalContent.replace(
        /import React[\s\S]*?from 'react';/,
        "import React, { useState, useEffect, useRef } from 'react';\nimport ScriptModal from './ScriptModal';"
    );
}

// 2. Add publicSettings to props
modalContent = modalContent.replace(
    /aiTopicText: string;\s*setAiTopicText: \(v: string\) => void;/,
    "aiTopicText: string;        setAiTopicText: (v: string) => void;\n      publicSettings?: any;"
);

// 3. Replace the textareas with ScriptModal
const scriptModalComponent = `<div className="bg-slate-950 border border-emerald-500/30 rounded-xl mt-2 overflow-hidden">
                                <ScriptModal
                                    hideOptions={true}
                                    show={true}
                                    scriptText={localGenScript}
                                    setScriptText={setLocalGenScript}
                                    publicSettings={p.publicSettings}
                                    customLaoName={localLaoName || p.customLaoName}
                                    customUserName={localUserName || p.customUserName}
                                    importMode="new"
                                    setImportMode={() => {}}
                                    onImport={() => {}}
                                    onClose={() => {}}
                                />
                            </div>`;

modalContent = modalContent.replace(
    /<textarea[\s\S]*?value=\{localGenScript\}[\s\S]*?placeholder="K?ch b?n s? xu?t hi?n ? dây\.\.\."[\s\S]*?\/>/g,
    scriptModalComponent
);

fs.writeFileSync('src/components/onglao/components/AiDirectorModal.tsx', modalContent, 'utf8');

// Now update AiDirectorManagerModal
let managerContent = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');
managerContent = managerContent.replace(
    /<AiDirectorModal\s*show=\{showCreator\}/,
    "<AiDirectorModal\n                publicSettings={p.publicSettings}\n                show={showCreator}"
);
fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', managerContent, 'utf8');

console.log('Done fix_ai_modal');
