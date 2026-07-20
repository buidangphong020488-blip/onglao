const fs = require('fs');
let content = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

content = content.replace(
  /<select[\s\S]*?<option value="">-- Ch?n t? Kho --<\/option>[\s\S]*?<\/select>/g,
  "{/* Removed Kho dropdown */}"
);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', content, 'utf8');
console.log('Done dropdown');
