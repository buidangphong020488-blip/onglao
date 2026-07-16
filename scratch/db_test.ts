import dotenv from 'dotenv';
dotenv.config();
import prisma from "../src/lib/prisma";

async function main() {
  console.log("Connecting with DATABASE_URL:", process.env.DATABASE_URL);
  const start = Date.now();
  try {
    const characters = await prisma.chatSession.findMany({ take: 3 });
    console.log("Success! Time taken:", Date.now() - start, "ms");
    console.log(characters);
  } catch (error) {
    console.error("Connection failed! Time taken:", Date.now() - start, "ms");
    console.error(error);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
