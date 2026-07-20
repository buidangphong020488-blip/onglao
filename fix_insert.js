const fs = require('fs');
let content = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

const oldHandle = `    const handleInsertRole = (roleName: string) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const text = ta.value;
        // N?u ? d?u van b?n ho?c dòng tru?c dã là xu?ng hàng thì không c?n \\n
        const actualPrefix = (start === 0 || text[start - 1] === '\\n') ? \`\${roleName}: \` : \`\\n\${roleName}: \`;
        
        const newText = text.substring(0, start) + actualPrefix + text.substring(end);
        setEditingRawText(newText);
        
        setTimeout(() => {
            ta.focus();
            ta.selectionStart = ta.selectionEnd = start + actualPrefix.length;
        }, 10);
    };`;

const newHandle = `    const handleInsertRole = (roleName: string) => {
        const text = editingRawText;
        const actualPrefix = text.length === 0 || text.endsWith('\\n') ? \`\${roleName}: \` : \`\\n\\n\${roleName}: \`;
        setEditingRawText(text + actualPrefix);
    };`;

// wait, the oldHandle has weird unicode characters in the comment in the file!
// Let's use regex to replace it!
content = content.replace(/const handleInsertRole = \(roleName: string\) => \{[\s\S]*?\}, 10\);\n    \};/g, newHandle);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', content, 'utf8');
console.log('Done fix_insert');
