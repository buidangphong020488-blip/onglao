const dotenv = require('dotenv');
dotenv.config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const dbUrl = process.env.DATABASE_URL || '';
const parsed = new URL(dbUrl);
const poolOptions = {
  user: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  host: parsed.hostname,
  port: parsed.port ? Number(parsed.port) : 5432,
  database: parsed.pathname.substring(1),
};

const pool = new Pool(poolOptions);
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function saveChatMessageAction(sessionId, role, content, audioUrl, voiceStyleId, messageId) {
  try {
    let prismaRole;
    if (role === "USER") prismaRole = "USER";
    else if (role === "ASSISTANT") prismaRole = "ASSISTANT";
    else prismaRole = "SYSTEM";

    const message = await prisma.chatMessage.upsert({
      where: { id: messageId || "" },
      update: {
        audioUrl: audioUrl || null,
      },
      create: {
        id: messageId || undefined,
        sessionId: sessionId,
        role: prismaRole,
        content: content,
        audioUrl: audioUrl || null,
        voiceStyleId: voiceStyleId || null,
      },
    });

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return { success: true, data: message };
  } catch (error) {
    console.error("Error saving chat message:", error);
    return { success: false, error: error.message };
  }
}

async function main() {
  const sessionId = 'b44a5949-f065-4204-9193-279d3e0b682e';
  const finalMsgs = [
    { id: "17841919911460", role: "USER", text: "Con chào lão, dạo này lòng con trĩu nặng, gặp nhiều chuyện không như ý mà chẳng biết phải tỏ bày và vượt qua thế nào nên mới tìm đến lão.", audioUrl: null },
    { id: "17841919911461", role: "ASSISTANT", text: "Đời người như dòng sông, lúc phẳng lặng khi cuộn sóng; con buồn vì lòng con còn mong cầu mọi thứ phải theo ý mình, chứ bản chất vạn vật vốn vô thường, có tụ rồi có tan.", audioUrl: null },
    { id: "17841919911462", role: "USER", text: "Dạ, nhưng khi đối diện với những lời phán xét và tổn thương từ người khác, con vẫn thấy tâm mình dậy sóng, đau lòng và oán hận lắm lão ạ.", audioUrl: null },
    { id: "17841919911463", role: "ASSISTANT", text: "Người ta gieo lời ác là nghiệp của họ, con đón nhận và ôm giữ sự bực dọc đó vào lòng thì chẳng khác nào tự uống thuốc độc mà mong người khác tổn thương; hãy học cách buông xả và nhìn họ bằng lòng từ bi, bởi họ cũng đang đau khổ trong sự vô minh của chính mình.", audioUrl: null },
    { id: "17841919911464", role: "USER", text: "Con hiểu rồi, hóa ra bấy lâu nay con tự buộc dây trói mình; từ nay con sẽ quay về quay quán chiếu lại tâm mình, tập chấp nhận và yêu thương thay vì oán trách.", audioUrl: null }
  ];

  console.log("Starting save loop...");
  for (const msg of finalMsgs) {
    const start = Date.now();
    const res = await saveChatMessageAction(
      sessionId,
      msg.role,
      msg.text,
      msg.audioUrl,
      null,
      msg.id
    );
    console.log(`Saved ${msg.id} result:`, res.success, `Time taken: ${Date.now() - start}ms`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
