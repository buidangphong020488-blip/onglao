const fs = require('fs');

let manager = fs.readFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', 'utf8');

manager = manager.replace(
    /onClick=\{handleDownloadMultiSpeakerAudio\} disabled=\{saving \|\| downloadingAudio\} className="bg-green-600\/20 hover:bg-green-600\/40 text-green-500 font-bold py-1\.5 px-3 rounded-lg text-xs flex items-center gap-1 transition-colors border border-green-500\/20 disabled:opacity-50"/,
    'onClick={handleDownloadMultiSpeakerAudio} disabled={saving || downloadingAudio} className="hidden"'
);

fs.writeFileSync('src/components/onglao/components/AiDirectorManagerModal.tsx', manager, 'utf8');
console.log('Button hidden');
