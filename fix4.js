const fs = require('fs');
let content = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

content = content.replace(
  /aiScriptLength: string;     setAiScriptLength: \(v: string\) => void;/,
  "aiScriptLength: string;     setAiScriptLength: (v: string) => void;\n    publicSettings?: any;"
);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', content, 'utf8');
console.log('Done props');
