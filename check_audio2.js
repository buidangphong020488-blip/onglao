require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const msgs = await prisma.chatMessage.findMany({
    where: { sessionId: '5bbf40a4-1466-4024-bf8a-510bd262ed06' },
    select: { id: true, role: true, audioUrl: true, content: true },
    orderBy: { createdAt: 'asc' }
  });
  console.log('=== Script 5bbf40a4 Messages ===');
  console.log('Total messages:', msgs.length);
  console.log('With audioUrl:', msgs.filter(m => m.audioUrl).length);
  msgs.forEach((m, i) => {
    console.log(`  [${i+1}] role=${m.role} | audio=${m.audioUrl ? 'HAS_AUDIO' : 'NO_AUDIO'} | text="${m.content?.substring(0,50)}"`);
  });
  await prisma.$disconnect();
}
main().catch(e => { console.error('Error:', e.message); process.exit(1); });
