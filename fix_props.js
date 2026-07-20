const fs = require('fs');
let content = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

content = content.replace(
  /publicSettings=\{p.publicSettings\}/,
  "publicSettings={p.publicSettings}\n                                            customLaoName={p.customLaoName}\n                                            customUserName={p.customUserName}"
);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', content, 'utf8');
console.log('Done props');
