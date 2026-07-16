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

async function main() {
  const sessions = await prisma.chatSession.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5
  });
  console.log("LAST 5 SESSIONS:");
  console.log(JSON.stringify(sessions, null, 2));

  for (const s of sessions) {
    const count = await prisma.chatMessage.count({
      where: { sessionId: s.id }
    });
    console.log(`Session ${s.id} ("${s.title}") has ${count} messages`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
