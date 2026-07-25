import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao';
  const pool = new Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}




declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma;
// Force client reload after schema update
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
