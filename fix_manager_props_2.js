const fs = require('fs');
let manager = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

manager = manager.replace(
  /aiScriptLength: string;\s*setAiScriptLength: \(v: string\) => void;/,
  "aiScriptLength: string;     setAiScriptLength: (v: string) => void;\n    publicSettings?: any;"
);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', manager, 'utf8');
console.log('Done manager props 2');
