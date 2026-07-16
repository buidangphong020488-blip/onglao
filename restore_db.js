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

async function restore() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Vui lòng cung cấp đường dẫn đến file backup JSON để khôi phục.');
    console.log('Ví dụ: node restore_db.js ./backups/db_onglao_backup_xxxxxxxx_xxxxxx.json');
    process.exit(1);
  }

  const backupFilePath = path.resolve(args[0]);
  if (!fs.existsSync(backupFilePath)) {
    console.error(`File không tồn tại tại đường dẫn: ${backupFilePath}`);
    process.exit(1);
  }

  console.log(`Đang đọc dữ liệu sao lưu từ file: ${backupFilePath}...`);
  
  try {
    const backupContent = fs.readFileSync(backupFilePath, 'utf-8');
    const backupData = JSON.parse(backupContent);

    if (!backupData.meta || !backupData.data) {
      throw new Error('Định dạng file backup không hợp lệ. Thiếu phần meta hoặc data.');
    }

    console.log('\nCảnh báo: Quá trình khôi phục sẽ xóa sạch dữ liệu hiện tại trong DB trước khi nạp dữ liệu cũ!');
    console.log('Bắt đầu khôi phục dữ liệu...');

    // Sử dụng transaction để đảm bảo tính nhất quán của dữ liệu
    await prisma.$transaction(async (tx) => {
      // 1. Xóa sạch dữ liệu cũ theo thứ tự ràng buộc khóa ngoại (từ con đến cha)
      console.log('Xóa dữ liệu bảng UserFavorite...');
      await tx.userFavorite.deleteMany();

      console.log('Xóa dữ liệu bảng ChatMessage...');
      await tx.chatMessage.deleteMany();

      console.log('Xóa dữ liệu bảng ChatSession...');
      await tx.chatSession.deleteMany();

      console.log('Xóa dữ liệu bảng User...');
      await tx.user.deleteMany();

      console.log('Xóa dữ liệu bảng Stanza...');
      await tx.stanza.deleteMany();

      console.log('Xóa dữ liệu bảng Poem...');
      await tx.poem.deleteMany();

      console.log('Xóa dữ liệu bảng KnowledgeBase...');
      await tx.knowledgeBase.deleteMany();

      console.log('Xóa dữ liệu bảng VoiceStyle...');
      await tx.voiceStyle.deleteMany();

      console.log('Xóa dữ liệu bảng BackgroundMusic...');
      await tx.backgroundMusic.deleteMany();

      console.log('Xóa dữ liệu bảng PromptTemplate...');
      await tx.promptTemplate.deleteMany();

      // 2. Nạp lại dữ liệu cũ từ file backup
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

      console.log(`Nạp lại ${users.length} User...`);
      if (users.length > 0) {
        await tx.user.createMany({ data: users });
      }

      console.log(`Nạp lại ${knowledgeBase.length} KnowledgeBase...`);
      if (knowledgeBase.length > 0) {
        await tx.knowledgeBase.createMany({ data: knowledgeBase });
      }

      console.log(`Nạp lại ${poems.length} Poem...`);
      if (poems.length > 0) {
        await tx.poem.createMany({ data: poems });
      }

      console.log(`Nạp lại ${stanzas.length} Stanza...`);
      if (stanzas.length > 0) {
        await tx.stanza.createMany({ data: stanzas });
      }

      console.log(`Nạp lại ${voiceStyles.length} VoiceStyle...`);
      if (voiceStyles.length > 0) {
        await tx.voiceStyle.createMany({ data: voiceStyles });
      }

      console.log(`Nạp lại ${backgroundMusics.length} BackgroundMusic...`);
      if (backgroundMusics.length > 0) {
        await tx.backgroundMusic.createMany({ data: backgroundMusics });
      }

      console.log(`Nạp lại ${chatSessions.length} ChatSession...`);
      if (chatSessions.length > 0) {
        await tx.chatSession.createMany({ data: chatSessions });
      }

      console.log(`Nạp lại ${chatMessages.length} ChatMessage...`);
      if (chatMessages.length > 0) {
        await tx.chatMessage.createMany({ data: chatMessages });
      }

      console.log(`Nạp lại ${favorites.length} UserFavorite...`);
      if (favorites.length > 0) {
        await tx.userFavorite.createMany({ data: favorites });
      }

      console.log(`Nạp lại ${promptTemplates.length} PromptTemplate...`);
      if (promptTemplates.length > 0) {
        await tx.promptTemplate.createMany({ data: promptTemplates });
      }
    });

    console.log('\n=========================================');
    console.log('🎉 KHÔI PHỤC DỮ LIỆU THÀNH CÔNG!');
    console.log('Tất cả bảng dữ liệu đã được ghi đè chính xác.');
    console.log('=========================================');

  } catch (error) {
    console.error('Lỗi nghiêm trọng trong quá trình khôi phục:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

restore();
