const fs = require('fs');
let content = fs.readFileSync('src/components/tam-an-platform.tsx', 'utf8');

content = content.replace(
  /const tx = db\.transaction/g,
  "const tx = (db as any).transaction"
);

fs.writeFileSync('src/components/tam-an-platform.tsx', content, 'utf8');
console.log('Done fix7');
