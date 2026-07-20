const fs = require('fs');
let content = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

content = content.replace(
  /hideOptions=\{true\}/,
  "hideOptions={true}\n                                            onClose={() => {}}"
);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', content, 'utf8');
console.log('Done onClose');
