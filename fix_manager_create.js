const fs = require('fs');

let manager = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

manager = manager.replace(
    /setEditingUserVoiceStyle\(''\);/,
    "setEditingUserVoiceStyle('');\n                p.setCustomUserName?.('Con');\n                p.setCustomLaoName?.('Lão');\n                p.setUserSelfCall?.('Con');\n                p.setUserCallLao?.('Lão');\n                p.setLaoSelfCall?.('Lão');\n                p.setLaoCallUser?.('Con');"
);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', manager, 'utf8');
console.log('Modified manual create');
