const { Database } = require('node-sqlite3-wasm');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'onglao.sqlite');
const db = new Database(dbPath);

// Khởi tạo schema
db.exec(`
    CREATE TABLE IF NOT EXISTS codes (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        code        TEXT    UNIQUE NOT NULL,
        max_uses    INTEGER DEFAULT 1,
        used_count  INTEGER DEFAULT 0,
        note        TEXT    DEFAULT '',
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activations (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        code        TEXT    NOT NULL,
        device_id   TEXT    NOT NULL,
        activated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// Seed mặc định nếu chưa có code nào
const count = db.run('SELECT COUNT(*) as n FROM codes');
const n = db.all('SELECT COUNT(*) as n FROM codes')[0]['COUNT(*)'];
if (n === 0) {
    db.run("INSERT OR IGNORE INTO codes (code, max_uses, note) VALUES ('TAMVO2025', 1, 'Mã mặc định 1')");
    db.run("INSERT OR IGNORE INTO codes (code, max_uses, note) VALUES ('UNGDUNG888', 1, 'Mã mặc định 2')");
    db.run("INSERT OR IGNORE INTO codes (code, max_uses, note) VALUES ('THIENSUGD2025', 1, 'Mã mặc định 3')");
    console.log('✅ Đã tạo 3 mã kích hoạt mặc định');
}

module.exports = db;
