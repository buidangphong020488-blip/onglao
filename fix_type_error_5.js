const fs = require('fs');
let content = fs.readFileSync('src/components/tam-an-platform.tsx', 'utf8');
content = content.replace(/tx.oncomplete = \(\) => resolve\(\);/g, "tx.oncomplete = () => resolve(undefined as any);");
fs.writeFileSync('src/components/tam-an-platform.tsx', content, 'utf8');
console.log('Fixed type error 5');
