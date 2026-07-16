// Tự động load biến môi trường từ file .env
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Khởi tạo connection pool và driver adapter tương thích với cấu hình Prisma trong dự án
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
  const escapedItems = arr.map(item => `$$${item}$$`);
  return `ARRAY[${escapedItems.join(', ')}]::text[]`;
}

async function backup() {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
  const backupFolder = path.join(__dirname, 'backups');
  
  if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder);
  }
  
  const backupJsonFile = path.join(backupFolder, `db_onglao_backup_${timestamp}.json`);
  const latestJsonFile = path.join(backupFolder, 'db_onglao_latest_backup.json');
  const backupSqlFile = path.join(backupFolder, `db_onglao_backup_${timestamp}.sql`);
  const latestSqlFile = path.join(backupFolder, 'db_onglao_latest_backup.sql');
  
  console.log(`Bắt đầu sao lưu cơ sở dữ liệu 'onglao'...`);
  
  try {
    // 1. TRUY VẤN DỮ LIỆU TỪ POSTGRESQL
    console.log('Đang đọc dữ liệu bảng User...');
    const users = await prisma.user.findMany();

    console.log('Đang đọc dữ liệu bảng KnowledgeBase...');
    const knowledgeBase = await prisma.knowledgeBase.findMany();

    console.log('Đang đọc dữ liệu bảng Poem...');
    const poems = await prisma.poem.findMany();

    console.log('Đang đọc dữ liệu bảng Stanza...');
    const stanzas = await prisma.stanza.findMany();

    console.log('Đang đọc dữ liệu bảng VoiceStyle...');
    const voiceStyles = await prisma.voiceStyle.findMany();

    console.log('Đang đọc dữ liệu bảng BackgroundMusic...');
    const backgroundMusics = await prisma.backgroundMusic.findMany();

    console.log('Đang đọc dữ liệu bảng ChatSession...');
    const chatSessions = await prisma.chatSession.findMany();

    console.log('Đang đọc dữ liệu bảng ChatMessage...');
    const chatMessages = await prisma.chatMessage.findMany();

    console.log('Đang đọc dữ liệu bảng UserFavorite...');
    const favorites = await prisma.userFavorite.findMany();

    console.log('Đang đọc dữ liệu bảng PromptTemplate...');
    const promptTemplates = await prisma.promptTemplate.findMany();

    const backupData = {
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        database: 'onglao',
        tables: {
          user: users.length,
          knowledgeBase: knowledgeBase.length,
          poem: poems.length,
          stanza: stanzas.length,
          voiceStyle: voiceStyles.length,
          backgroundMusic: backgroundMusics.length,
          chatSession: chatSessions.length,
          chatMessage: chatMessages.length,
          userFavorite: favorites.length,
          promptTemplate: promptTemplates.length
        }
      },
      data: {
        users,
        knowledgeBase,
        poems,
        stanzas,
        voiceStyles,
        backgroundMusics,
        chatSessions,
        chatMessages,
        favorites,
        promptTemplates
      }
    };

    // 2. GHI FILE JSON
    const jsonString = JSON.stringify(backupData, null, 2);
    fs.writeFileSync(backupJsonFile, jsonString, 'utf-8');
    fs.writeFileSync(latestJsonFile, jsonString, 'utf-8');
    console.log('✓ Ghi file JSON hoàn tất.');

    // 3. SINH FILE SQL DUMP SCRIPT
    console.log('Đang tạo script SQL...');
    let sqlContent = `-- ========================================================\n`;
    sqlContent += `-- SAO LƯU CƠ SỞ DỮ LIỆU 'onglao' (PostgreSQL DUMP)\n`;
    sqlContent += `-- Thời gian tạo: ${new Date().toLocaleString('vi-VN')}\n`;
    sqlContent += `-- ========================================================\n\n`;

    sqlContent += `-- Tạm thời bỏ qua kiểm tra khóa ngoại để dọn dẹp và nạp dữ liệu sạch sẽ\n`;
    sqlContent += `SET session_replication_role = 'replica';\n\n`;

    sqlContent += `-- DỌN DẸP DỮ LIỆU CŨ\n`;
    sqlContent += `TRUNCATE TABLE "UserFavorite", "ChatMessage", "ChatSession", "User", "Stanza", "Poem", "KnowledgeBase", "VoiceStyle", "BackgroundMusic", "PromptTemplate" RESTART IDENTITY CASCADE;\n\n`;

    sqlContent += `-- NẠP DỮ LIỆU BẢNG User\n`;
    users.forEach(item => {
      sqlContent += `INSERT INTO "User" ("id", "email", "name", "image", "role", "createdAt", "updatedAt") VALUES (${escapeSqlString(item.id)}, ${escapeSqlString(item.email)}, ${escapeSqlString(item.name)}, ${escapeSqlString(item.image)}, '${item.role}', ${escapeSqlDate(item.createdAt)}, ${escapeSqlDate(item.updatedAt)});\n`;
    });
    sqlContent += `\n`;

    sqlContent += `-- NẠP DỮ LIỆU BẢNG KnowledgeBase\n`;
    knowledgeBase.forEach(item => {
      sqlContent += `INSERT INTO "KnowledgeBase" ("id", "category", "question", "answer", "createdAt", "updatedAt") VALUES (${escapeSqlString(item.id)}, ${escapeSqlString(item.category)}, ${escapeSqlString(item.question)}, ${escapeSqlString(item.answer)}, ${escapeSqlDate(item.createdAt)}, ${escapeSqlDate(item.updatedAt)});\n`;
    });
    sqlContent += `\n`;

    sqlContent += `-- NẠP DỮ LIỆU BẢNG Poem\n`;
    poems.forEach(item => {
      sqlContent += `INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES (${escapeSqlString(item.id)}, ${escapeSqlString(item.title)}, ${escapeSqlDate(item.createdAt)}, ${escapeSqlDate(item.updatedAt)});\n`;
    });
    sqlContent += `\n`;

    sqlContent += `-- NẠP DỮ LIỆU BẢNG Stanza\n`;
    stanzas.forEach(item => {
      sqlContent += `INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES (${escapeSqlString(item.id)}, ${escapeSqlString(item.poemId)}, ${escapeSqlString(item.content)}, ${escapeSqlString(item.meaning)}, ${escapeSqlString(item.audioUrl)}, ${formatSqlArray(item.tags)}, ${escapeSqlDate(item.createdAt)}, ${escapeSqlDate(item.updatedAt)});\n`;
    });
    sqlContent += `\n`;

    sqlContent += `-- NẠP DỮ LIỆU BẢNG VoiceStyle\n`;
    voiceStyles.forEach(item => {
      sqlContent += `INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (${item.id}, ${escapeSqlString(item.label)}, ${escapeSqlString(item.promptText)}, ${escapeSqlDate(item.createdAt)});\n`;
    });
    sqlContent += `\n`;

    sqlContent += `-- NẠP DỮ LIỆU BẢNG BackgroundMusic\n`;
    backgroundMusics.forEach(item => {
      sqlContent += `INSERT INTO "BackgroundMusic" ("id", "name", "url", "isActive", "createdAt") VALUES (${escapeSqlString(item.id)}, ${escapeSqlString(item.name)}, ${escapeSqlString(item.url)}, ${item.isActive}, ${escapeSqlDate(item.createdAt)});\n`;
    });
    sqlContent += `\n`;

    sqlContent += `-- NẠP DỮ LIỆU BẢNG ChatSession\n`;
    chatSessions.forEach(item => {
      sqlContent += `INSERT INTO "ChatSession" ("id", "userId", "title", "createdAt", "updatedAt") VALUES (${escapeSqlString(item.id)}, ${escapeSqlString(item.userId)}, ${escapeSqlString(item.title)}, ${escapeSqlDate(item.createdAt)}, ${escapeSqlDate(item.updatedAt)});\n`;
    });
    sqlContent += `\n`;

    sqlContent += `-- NẠP DỮ LIỆU BẢNG ChatMessage\n`;
    chatMessages.forEach(item => {
      sqlContent += `INSERT INTO "ChatMessage" ("id", "sessionId", "role", "content", "audioUrl", "voiceStyleId", "createdAt") VALUES (${escapeSqlString(item.id)}, ${escapeSqlString(item.sessionId)}, '${item.role}', ${escapeSqlString(item.content)}, ${escapeSqlString(item.audioUrl)}, ${item.voiceStyleId || 'NULL'}, ${escapeSqlDate(item.createdAt)});\n`;
    });
    sqlContent += `\n`;

    sqlContent += `-- NẠP DỮ LIỆU BẢNG UserFavorite\n`;
    favorites.forEach(item => {
      sqlContent += `INSERT INTO "UserFavorite" ("id", "userId", "itemType", "itemId", "createdAt") VALUES (${escapeSqlString(item.id)}, ${escapeSqlString(item.userId)}, '${item.itemType}', ${escapeSqlString(item.itemId)}, ${escapeSqlDate(item.createdAt)});\n`;
    });
    sqlContent += `\n`;

    sqlContent += `-- NẠP DỮ LIỆU BẢNG PromptTemplate\n`;
    promptTemplates.forEach(item => {
      sqlContent += `INSERT INTO "PromptTemplate" ("id", "name", "content", "createdAt", "updatedAt") VALUES (${escapeSqlString(item.id)}, ${escapeSqlString(item.name)}, ${escapeSqlString(item.content)}, ${escapeSqlDate(item.createdAt)}, ${escapeSqlDate(item.updatedAt)});\n`;
    });
    sqlContent += `\n`;

    sqlContent += `-- Kích hoạt lại kiểm tra khóa ngoại sau khi hoàn tất nạp dữ liệu\n`;
    sqlContent += `SET session_replication_role = 'origin';\n`;

    fs.writeFileSync(backupSqlFile, sqlContent, 'utf-8');
    fs.writeFileSync(latestSqlFile, sqlContent, 'utf-8');
    console.log('✓ Ghi file SQL hoàn tất.');

    console.log('\n=========================================');
    console.log('🎉 SAO LƯU DỮ LIỆU THÀNH CÔNG!');
    console.log(`Đường dẫn JSON: ${backupJsonFile}`);
    console.log(`Đường dẫn SQL:  ${backupSqlFile}`);
    console.log('Thống kê số lượng bản ghi:');
    console.table(backupData.meta.tables);
    console.log('=========================================');

  } catch (error) {
    console.error('Lỗi trong quá trình sao lưu:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

backup();
