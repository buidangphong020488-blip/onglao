const fs = require('fs');
let content = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

content = content.replace(
  /import AiDirectorModal from '\.\/AiDirectorModal';/,
  "import AiDirectorModal from './AiDirectorModal';\nimport ScriptModal from './ScriptModal';"
);

content = content.replace(
  /<button onClick=\{handleDownloadMultiSpeakerAudio\}[\s\S]*?<\/button>/,
  "{/* Removed Multi-speaker button */}"
);

content = content.replace(
  /const handleInsertRole = \(roleName: string\) => \{[\s\S]*?\}, 10\);\n    \};/,
  `const handleInsertRole = (roleName: string) => {
        const text = editingRawText;
        const actualPrefix = text.length === 0 || text.endsWith('\\n') ? \`\${roleName}: \` : \`\\n\\n\${roleName}: \`;
        setEditingRawText(text + actualPrefix);
    };`
);

content = content.replace(
  /<textarea\s+ref=\{textareaRef\}[\s\S]*?placeholder=\{.*?\}\s*\/>/,
  `<ScriptModal
                                            hideOptions={true}
                                            show={true}
                                            scriptText={editingRawText}
                                            setScriptText={setEditingRawText}
                                            publicSettings={p.publicSettings}
                                            importMode="new"
                                            setImportMode={() => {}}
                                            onImport={() => {}}
                                        />`
);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', content, 'utf8');
console.log('Done');
