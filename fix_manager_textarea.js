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

// Replace textarea block safely by finding the index
const textareaStr = '<textarea\n                                            ref={textareaRef}';
const startIdx = manager.indexOf(textareaStr);
if (startIdx !== -1) {
    const endIdx = manager.indexOf('/>', startIdx) + 2;
    manager = manager.substring(0, startIdx) + scriptModalReplacement + manager.substring(endIdx);
    fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', manager, 'utf8');
    console.log('Replaced textarea in manager!');
} else {
    console.log('Could not find textarea');
}
