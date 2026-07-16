import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL || '';
  let poolOptions: any = { connectionString: dbUrl };

  try {
    const parsed = new URL(dbUrl);
    poolOptions = {
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 5432,
      database: parsed.pathname.substring(1),
    };
  } catch (e: any) {
    const match = dbUrl.match(/postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (match) {
      poolOptions = {
        user: match[1],
        password: match[2],
        host: match[3],
        port: Number(match[4]),
        database: match[5],
      };
    }
  }

  const pool = new Pool(poolOptions)
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}




declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma;
// Force client reload after schema update
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
