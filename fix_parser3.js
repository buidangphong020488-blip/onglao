const fs = require('fs');
let content = fs.readFileSync('src/components/onglao/components/ScriptModal.tsx', 'utf8');
content = content.replace(
  /const escapeRegex = \(s\) =>/,
  "const escapeRegex = (s: string | undefined) =>"
);
fs.writeFileSync('src/components/onglao/components/ScriptModal.tsx', content, 'utf8');
console.log('Done fix3');
