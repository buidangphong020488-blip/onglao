const fs = require('fs');
let content = fs.readFileSync('src/components/tam-an-platform.tsx', 'utf8');
content = content.replace(/let app, auth, db, appId;/g, "let app: any, auth: any, db: any, appId: any;");
fs.writeFileSync('src/components/tam-an-platform.tsx', content, 'utf8');
console.log('Fixed type error 6');
