const fs = require('fs');

let content = fs.readFileSync('src/components/tam-an-platform.tsx', 'utf8');

content = content.replace(/req.onerror = e => reject\(e\);/g, "req.onerror = (e: any) => reject(e);");
content = content.replace(/async remove\(key\)/g, "async remove(key: string)");
content = content.replace(/async get\(key\)/g, "async get(key: string)");
content = content.replace(/async set\(key, blob\)/g, "async set(key: string, blob: Blob)");

fs.writeFileSync('src/components/tam-an-platform.tsx', content, 'utf8');
console.log('Fixed type error 4');
