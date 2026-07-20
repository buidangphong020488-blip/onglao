const fs = require('fs');

let content = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

// Replace the malformed ones with Lão
content = content.replace(/p\.setCustomLaoName\?\.\('[^']*'\);/g, "p.setCustomLaoName?.('L\\u00e3o');");
content = content.replace(/p\.setUserCallLao\?\.\('[^']*'\);/g, "p.setUserCallLao?.('L\\u00e3o');");
content = content.replace(/p\.setLaoSelfCall\?\.\('[^']*'\);/g, "p.setLaoSelfCall?.('L\\u00e3o');");

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', content, 'utf8');
console.log('Fixed encoding error');
