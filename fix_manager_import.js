const fs = require('fs');
let manager = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

if (!manager.includes("import ScriptModal from './ScriptModal';")) {
    manager = manager.replace(
        "import AiDirectorModal from './AiDirectorModal';",
        "import AiDirectorModal from './AiDirectorModal';\nimport ScriptModal from './ScriptModal';"
    );
    fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', manager, 'utf8');
    console.log('Added import ScriptModal');
}
