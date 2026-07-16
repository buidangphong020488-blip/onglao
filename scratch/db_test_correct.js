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
  console.log("Connecting with DATABASE_URL:", process.env.DATABASE_URL);
  const start = Date.now();
  try {
    const sessions = await prisma.chatSession.findMany({ take: 3 });
    console.log("Success! Time taken:", Date.now() - start, "ms");
    console.log(sessions);
  } catch (error) {
    console.error("Connection failed! Time taken:", Date.now() - start, "ms");
    console.error(error);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
