const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'src/components/onglao/components/AiDirectorManagerModal.tsx');
let c = fs.readFileSync(p, 'utf8');
const lines = c.split(/\r?\n/);
lines[1721] = '                        <h3 className="text-lg font-bold text-white mb-2">Xác nhận xóa</h3>';
lines[1723] = '                            Bạn có chắc chắn muốn xóa {deleteConfirm.count} kịch bản không? Hành động này không thể hoàn tác.';
fs.writeFileSync(p, lines.join('\n'));
console.log('Done!');
