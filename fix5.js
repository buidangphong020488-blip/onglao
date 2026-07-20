const fs = require('fs');
let content = fs.readFileSync('src/components/tam-an-platform.tsx', 'utf8');

content = content.replace(
  /req.onupgradeneeded = e => e.target.result.createObjectStore\('assets'\);/,
  "req.onupgradeneeded = (e: any) => e.target.result.createObjectStore('assets');"
);

content = content.replace(
  /req.onsuccess = e => \{ this.db = e.target.result; resolve\(this.db\); \};/,
  "req.onsuccess = (e: any) => { this.db = e.target.result; resolve(this.db); };"
);

fs.writeFileSync('src/components/tam-an-platform.tsx', content, 'utf8');
console.log('Done cast');
