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
  const sessionId = 'b44a5949-f065-4204-9193-279d3e0b682e';
  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: { messages: true }
  });
  console.log("SESSION:", JSON.stringify(session, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
