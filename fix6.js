const fs = require('fs');
let content = fs.readFileSync('src/components/tam-an-platform.tsx', 'utf8');

content = content.replace(
  /async set\(key, blob\) \{/,
  "async set(key: any, blob: any) {"
);

content = content.replace(
  /async get\(key\) \{/,
  "async get(key: any) {"
);

fs.writeFileSync('src/components/tam-an-platform.tsx', content, 'utf8');
console.log('Done fix6');
