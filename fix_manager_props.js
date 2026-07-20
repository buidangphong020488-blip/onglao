const fs = require('fs');
let manager = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

manager = manager.replace(
  /<AiDirectorModal\s*\n\s*show=\{showCreator\}/,
  "<AiDirectorModal\n                publicSettings={p.publicSettings}\n                show={showCreator}"
);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', manager, 'utf8');
console.log('Done manager props');
