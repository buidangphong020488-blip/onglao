const fs = require('fs');
let content = fs.readFileSync('src/components/onglao/components/ScriptModal.tsx', 'utf8');

// 1. Add customLaoName and customUserName to props interface
content = content.replace(
  /hideOptions\?: boolean;\n\}/,
  "hideOptions?: boolean;\n    customLaoName?: string;\n    customUserName?: string;\n}"
);

// 2. Destructure them
content = content.replace(
  /const ScriptModal = \(\{ show, onClose, scriptText, setScriptText, importMode, setImportMode, onImport, asTab, publicSettings, hideOptions \}: ScriptModalProps\) => \{/,
  "const ScriptModal = ({ show, onClose, scriptText, setScriptText, importMode, setImportMode, onImport, asTab, publicSettings, hideOptions, customLaoName, customUserName }: ScriptModalProps) => {"
);

// 3. Fix the regex in useEffect
const oldRegexCode = `            const userMatch = text.match(/^(con|ngu?i h?i|h?i)(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:/i);
            const aiMatch = text.match(/^(lão|dáp|ai)(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:/i);

            if (userMatch) {
                role = 'user';
                emotion = userMatch[2] || userMatch[3] || 'calm';
                text = text.replace(/^(con|ngu?i h?i|h?i)(?:\\s*\\[.*?\\]|\\s*\\(.*?\\))?\\s*:\\s*/i, '').trim();
                currentRole = 'user';
            } else if (aiMatch) {
                role = 'ai';
                emotion = aiMatch[2] || aiMatch[3] || 'calm';
                text = text.replace(/^(lão|dáp|ai)(?:\\s*\\[.*?\\]|\\s*\\(.*?\\))?\\s*:\\s*/i, '').trim();
                currentRole = 'ai';
            }`;

const newRegexCode = `            const userNamePattern = [customUserName, 'con', 'ngu?i h?i', 'h?i'].filter(Boolean).map(s => s.toLowerCase().replace(/[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|]/g, "\\\\$&")).join('|');
            const aiNamePattern = [customLaoName, 'lão', 'dáp', 'ai'].filter(Boolean).map(s => s.toLowerCase().replace(/[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|]/g, "\\\\$&")).join('|');

            const userRegex = new RegExp(\`^(\${userNamePattern})(?:\\\\s*\\\\[(.*?)\\\\]|\\\\s*\\\\((.*?)\\\\))?\\\\s*:\`, 'i');
            const aiRegex = new RegExp(\`^(\${aiNamePattern})(?:\\\\s*\\\\[(.*?)\\\\]|\\\\s*\\\\((.*?)\\\\))?\\\\s*:\`, 'i');

            const userMatch = text.match(userRegex);
            const aiMatch = text.match(aiRegex);

            if (userMatch) {
                role = 'user';
                emotion = userMatch[2] || userMatch[3] || 'calm';
                text = text.replace(new RegExp(\`^(\${userNamePattern})(?:\\\\s*\\\\[.*?\\\\]|\\\\s*\\\\(.*?\\\\))?\\\\s*:\\\\s*\`, 'i'), '').trim();
                currentRole = 'user';
            } else if (aiMatch) {
                role = 'ai';
                emotion = aiMatch[2] || aiMatch[3] || 'calm';
                text = text.replace(new RegExp(\`^(\${aiNamePattern})(?:\\\\s*\\\\[.*?\\\\]|\\\\s*\\\\(.*?\\\\))?\\\\s*:\\\\s*\`, 'i'), '').trim();
                currentRole = 'ai';
            }`;

content = content.replace(oldRegexCode, newRegexCode);

// 4. Also fix serializeAndSave to use the custom names
const oldSerialize = `        const text = currentBlocks.map(b => {
            const roleStr = b.role === 'ai' ? 'Lão' : 'Con';
            return \`\${roleStr} [\${b.emotion}]: \${b.text}\`;
        }).join('\\n');`;

const newSerialize = `        const text = currentBlocks.map(b => {
            const roleStr = b.role === 'ai' ? (customLaoName || 'Lão') : (customUserName || 'Con');
            return \`\${roleStr} [\${b.emotion}]: \${b.text}\`;
        }).join('\\n');`;

content = content.replace(oldSerialize, newSerialize);

fs.writeFileSync('src/components/onglao/components/ScriptModal.tsx', content, 'utf8');
console.log('Done scriptmodal');
