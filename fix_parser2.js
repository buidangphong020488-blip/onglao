const fs = require('fs');
let content = fs.readFileSync('src/components/onglao/components/ScriptModal.tsx', 'utf8');
const lines = content.split('\n');

// Find the index of "let emotion = 'calm';"
const startIndex = lines.findIndex(l => l.includes("let emotion = 'calm';")) + 2;
const endIndex = lines.findIndex(l => l.includes("// Append to previous if same role and emotion")) - 1;

if (startIndex > 2 && endIndex > startIndex) {
    const newCode = `            const escapeRegex = (s) => s ? s.toLowerCase().replace(/[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|]/g, "\\\\$&") : '';
            const userNamePattern = [escapeRegex(customUserName), 'con', 'ngu?i h?i', 'h?i'].filter(Boolean).join('|');
            const aiNamePattern = [escapeRegex(customLaoName), 'lão', 'dáp', 'ai'].filter(Boolean).join('|');

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
    lines.splice(startIndex, endIndex - startIndex + 1, newCode);
}

// Find serializeAndSave
const serStart = lines.findIndex(l => l.includes("const serializeAndSave = (currentBlocks: ScriptBlock[]) => {"));
if (serStart !== -1) {
    const oldLineIndex = serStart + 2;
    if (lines[oldLineIndex].includes("const roleStr = b.role === 'ai'")) {
        lines[oldLineIndex] = `            const roleStr = b.role === 'ai' ? (customLaoName || 'Lão') : (customUserName || 'Con');`;
    }
}

fs.writeFileSync('src/components/onglao/components/ScriptModal.tsx', lines.join('\n'), 'utf8');
console.log('Done fix_parser2');
