const fs = require('fs');
const path = require('path');

function escapeSqlString(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function escapeSqlDate(dateStr) {
  if (!dateStr) return 'NULL';
  return `'${new Date(dateStr).toISOString()}'`;
}

function formatSqlArray(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return 'ARRAY[]::text[]';
  const escapedItems = arr.map(item => `$$${item}$$`); // Sử dụng $$ để tránh bẻ ký tự nháy đơn trong chuỗi tiếng Việt phức tạp
  return `ARRAY[${escapedItems.join(', ')}]::text[]`;
}

function generateSqlBackup() {
  const latestBackupPath = path.join(__dirname, 'backups', 'db_onglao_latest_backup.json');
  if (!fs.existsSync(latestBackupPath)) {
    console.error('Không tìm thấy file db_onglao_latest_backup.json. Vui lòng chạy node backup_db.js trước.');
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
  const sqlBackupFile = path.join(__dirname, 'backups', `db_onglao_backup_${timestamp}.sql`);
  const sqlLatestFile = path.join(__dirname, 'backups', 'db_onglao_latest_backup.sql');

  console.log(`Đang sinh file SQL backup từ: ${latestBackupPath}...`);

  const backupData = JSON.parse(fs.readFileSync(latestBackupPath, 'utf-8'));
  const {
    users = [],
    knowledgeBase = [],
    poems = [],
    stanzas = [],
    voiceStyles = [],
    backgroundMusics = [],
    chatSessions = [],
    chatMessages = [],
    favorites = [],
    promptTemplates = []
  } = backupData.data;

  let sqlContent = `-- ========================================================\n`;
  sqlContent += `-- SAO LƯU CƠ SỞ DỮ LIỆU 'onglao' (PostgreSQL DUMP)\n`;
  sqlContent += `-- Thời gian tạo: ${new Date().toLocaleString('vi-VN')}\n`;
  sqlContent += `-- ========================================================\n\n`;

  sqlContent += `-- Tạm thời bỏ qua kiểm tra khóa ngoại để dọn dẹp và nạp dữ liệu sạch sẽ\n`;
  sqlContent += `SET session_replication_role = 'replica';\n\n`;

  sqlContent += `-- 1. DỌN DẸP DỮ LIỆU CŨ\n`;
  sqlContent += `TRUNCATE TABLE "UserFavorite", "ChatMessage", "ChatSession", "User", "Stanza", "Poem", "KnowledgeBase", "VoiceStyle", "BackgroundMusic", "PromptTemplate" RESTART IDENTITY CASCADE;\n\n`;

  // 2. NẠP DỮ LIỆU
  sqlContent += `-- ========================================================\n`;
  sqlContent += `-- 2. NẠP DỮ LIỆU CHO BẢNG User\n`;
  sqlContent += `-- ========================================================\n`;
  users.forEach(item => {
    sqlContent += `INSERT INTO "User" ("id", "email", "name", "image", "role", "createdAt", "updatedAt") VALUES (\n`;
    sqlContent += `  ${escapeSqlString(item.id)}, ${escapeSqlString(item.email)}, ${escapeSqlString(item.name)}, ${escapeSqlString(item.image)}, \n`;
    sqlContent += `  '${item.role}', ${escapeSqlDate(item.createdAt)}, ${escapeSqlDate(item.updatedAt)}\n);\n`;
  });
  sqlContent += `\n`;

  sqlContent += `-- ========================================================\n`;
  sqlContent += `-- 3. NẠP DỮ LIỆU CHO BẢNG KnowledgeBase\n`;
  sqlContent += `-- ========================================================\n`;
  knowledgeBase.forEach(item => {
    sqlContent += `INSERT INTO "KnowledgeBase" ("id", "category", "question", "answer", "createdAt", "updatedAt") VALUES (\n`;
    sqlContent += `  ${escapeSqlString(item.id)}, ${escapeSqlString(item.category)}, ${escapeSqlString(item.question)}, ${escapeSqlString(item.answer)}, \n`;
    sqlContent += `  ${escapeSqlDate(item.createdAt)}, ${escapeSqlDate(item.updatedAt)}\n);\n`;
  });
  sqlContent += `\n`;

  sqlContent += `-- ========================================================\n`;
  sqlContent += `-- 4. NẠP DỮ LIỆU CHO BẢNG Poem\n`;
  sqlContent += `-- ========================================================\n`;
  poems.forEach(item => {
    sqlContent += `INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES (\n`;
    sqlContent += `  ${escapeSqlString(item.id)}, ${escapeSqlString(item.title)}, ${escapeSqlDate(item.createdAt)}, ${escapeSqlDate(item.updatedAt)}\n);\n`;
  });
  sqlContent += `\n`;

  sqlContent += `-- ========================================================\n`;
  sqlContent += `-- 5. NẠP DỮ LIỆU CHO BẢNG Stanza\n`;
  sqlContent += `-- ========================================================\n`;
  stanzas.forEach(item => {
    sqlContent += `INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES (\n`;
    sqlContent += `  ${escapeSqlString(item.id)}, ${escapeSqlString(item.poemId)}, ${escapeSqlString(item.content)}, ${escapeSqlString(item.meaning)}, \n`;
    sqlContent += `  ${escapeSqlString(item.audioUrl)}, ${formatSqlArray(item.tags)}, ${escapeSqlDate(item.createdAt)}, ${escapeSqlDate(item.updatedAt)}\n);\n`;
  });
  sqlContent += `\n`;

  sqlContent += `-- ========================================================\n`;
  sqlContent += `-- 6. NẠP DỮ LIỆU CHO BẢNG VoiceStyle\n`;
  sqlContent += `-- ========================================================\n`;
  voiceStyles.forEach(item => {
    sqlContent += `INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (\n`;
    sqlContent += `  ${item.id}, ${escapeSqlString(item.label)}, ${escapeSqlString(item.promptText)}, ${escapeSqlDate(item.createdAt)}\n);\n`;
  });
  sqlContent += `\n`;

  sqlContent += `-- ========================================================\n`;
  sqlContent += `-- 7. NẠP DỮ LIỆU CHO BẢNG BackgroundMusic\n`;
  sqlContent += `-- ========================================================\n`;
  backgroundMusics.forEach(item => {
    sqlContent += `INSERT INTO "BackgroundMusic" ("id", "name", "url", "isActive", "createdAt") VALUES (\n`;
    sqlContent += `  ${escapeSqlString(item.id)}, ${escapeSqlString(item.name)}, ${escapeSqlString(item.url)}, ${item.isActive}, ${escapeSqlDate(item.createdAt)}\n);\n`;
  });
  sqlContent += `\n`;

  sqlContent += `-- ========================================================\n`;
  sqlContent += `-- 8. NẠP DỮ LIỆU CHO BẢNG ChatSession\n`;
  sqlContent += `-- ========================================================\n`;
  chatSessions.forEach(item => {
    sqlContent += `INSERT INTO "ChatSession" ("id", "userId", "title", "createdAt", "updatedAt") VALUES (\n`;
    sqlContent += `  ${escapeSqlString(item.id)}, ${escapeSqlString(item.userId)}, ${escapeSqlString(item.title)}, ${escapeSqlDate(item.createdAt)}, ${escapeSqlDate(item.updatedAt)}\n);\n`;
  });
  sqlContent += `\n`;

  sqlContent += `-- ========================================================\n`;
  sqlContent += `-- 9. NẠP DỮ LIỆU CHO BẢNG ChatMessage\n`;
  sqlContent += `-- ========================================================\n`;
  chatMessages.forEach(item => {
    sqlContent += `INSERT INTO "ChatMessage" ("id", "sessionId", "role", "content", "audioUrl", "voiceStyleId", "createdAt") VALUES (\n`;
    sqlContent += `  ${escapeSqlString(item.id)}, ${escapeSqlString(item.sessionId)}, '${item.role}', ${escapeSqlString(item.content)}, \n`;
    sqlContent += `  ${escapeSqlString(item.audioUrl)}, ${item.voiceStyleId || 'NULL'}, ${escapeSqlDate(item.createdAt)}\n);\n`;
  });
  sqlContent += `\n`;

  sqlContent += `-- ========================================================\n`;
  sqlContent += `-- 10. NẠP DỮ LIỆU CHO BẢNG UserFavorite\n`;
  sqlContent += `-- ========================================================\n`;
  favorites.forEach(item => {
    sqlContent += `INSERT INTO "UserFavorite" ("id", "userId", "itemType", "itemId", "createdAt") VALUES (\n`;
    sqlContent += `  ${escapeSqlString(item.id)}, ${escapeSqlString(item.userId)}, '${item.itemType}', ${escapeSqlString(item.itemId)}, ${escapeSqlDate(item.createdAt)}\n);\n`;
  });
  sqlContent += `\n`;

  sqlContent += `-- ========================================================\n`;
  sqlContent += `-- 11. NẠP DỮ LIỆU CHO BẢNG PromptTemplate\n`;
  sqlContent += `-- ========================================================\n`;
  promptTemplates.forEach(item => {
    sqlContent += `INSERT INTO "PromptTemplate" ("id", "name", "content", "createdAt", "updatedAt") VALUES (\n`;
    sqlContent += `  ${escapeSqlString(item.id)}, ${escapeSqlString(item.name)}, ${escapeSqlString(item.content)}, ${escapeSqlDate(item.createdAt)}, ${escapeSqlDate(item.updatedAt)}\n);\n`;
  });
  sqlContent += `\n`;

  sqlContent += `-- Kích hoạt lại kiểm tra khóa ngoại sau khi hoàn tất nạp dữ liệu\n`;
  sqlContent += `SET session_replication_role = 'origin';\n`;

  fs.writeFileSync(sqlBackupFile, sqlContent, 'utf-8');
  fs.writeFileSync(sqlLatestFile, sqlContent, 'utf-8');

  console.log(`\n=========================================`);
  console.log(`🎉 TẠO FILE SQL BACKUP THÀNH CÔNG!`);
  console.log(`Đường dẫn SQL: ${sqlBackupFile}`);
  console.log(`Đường dẫn SQL Latest: ${sqlLatestFile}`);
  console.log(`=========================================`);
}

generateSqlBackup();
