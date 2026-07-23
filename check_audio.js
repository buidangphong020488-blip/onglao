const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const results = await prisma.$queryRaw`
    SELECT cs.id, cs.title, 
      COUNT(cm.id)::int as total_msgs, 
      COUNT(cm."audioUrl")::int as audio_msgs
    FROM "ChatSession" cs 
    LEFT JOIN "ChatMessage" cm ON cm."sessionId" = cs.id 
    WHERE cs.type IN ('script','chat|script') 
    GROUP BY cs.id, cs.title 
    ORDER BY MAX(cs."updatedAt") DESC LIMIT 10
  `;
  console.log('=== SCRIPT SESSIONS AUDIO COUNT ===');
  console.table(results);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
