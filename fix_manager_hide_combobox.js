const fs = require('fs');

let manager = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

manager = manager.replace(
    /\{p\.allCharacters\?.length > 0 && \(/g,
    "{false && ("
);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', manager, 'utf8');
console.log('Modified combobox visibility');
