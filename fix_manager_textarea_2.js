const fs = require('fs');

let manager = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

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

// Replace textarea block using a more robust regex
manager = manager.replace(
    /<textarea[\s\S]*?ref=\{textareaRef\}[\s\S]*?placeholder=\{.*?\}[\s\S]*?\/>/,
    scriptModalReplacement
);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', manager, 'utf8');
console.log('Replaced textarea in manager!');
