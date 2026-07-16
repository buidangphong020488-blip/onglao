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
  const count = await prisma.chatMessage.count({
    where: { sessionId: 'b44a5949-f065-4204-9193-279d3e0b682e' }
  });
  console.log("Current messages count for session:", count);

  const msgs = await prisma.chatMessage.findMany({
    where: { sessionId: 'b44a5949-f065-4204-9193-279d3e0b682e' },
    orderBy: { id: 'asc' }
  });
  console.log(msgs.map(m => m.id + ": " + m.content.substring(0, 30)));
}

main().catch(console.error).finally(() => prisma.$disconnect());
