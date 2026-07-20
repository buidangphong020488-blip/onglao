const fs = require('fs');

let content = fs.readFileSync('src/components/tam-an-platform.tsx', 'utf8');

content = content.replace(
    /tx.onerror = e => reject\(e\);/,
    "tx.onerror = (e: any) => reject(e);"
);

content = content.replace(
    /tx.onerror = e => reject\(e\);/g,
    "tx.onerror = (e: any) => reject(e);"
);

fs.writeFileSync('src/components/tam-an-platform.tsx', content, 'utf8');
console.log('Fixed type error');
