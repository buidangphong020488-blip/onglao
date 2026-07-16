import dotenv from "dotenv";
dotenv.config();

console.log("DATABASE_URL in script:", process.env.DATABASE_URL);

import prisma from "../src/lib/prisma";

async function main() {
  console.log("Checking database for Google Drive links...");
  
  // Check BackgroundMusic
  const bgMusics = await prisma.backgroundMusic.findMany();
  for (const bg of bgMusics) {
    if (bg.url.includes("drive.google.com")) {
      console.log(`Found in BackgroundMusic [${bg.name}]: ${bg.url}`);
    }
  }

  // Check Stanza
  const stanzas = await prisma.stanza.findMany();
  for (const s of stanzas) {
    if (s.audioUrl && s.audioUrl.includes("drive.google.com")) {
      console.log(`Found in Stanza [ID: ${s.id}]: ${s.audioUrl}`);
    }
  }

  // Check ChatMessage
  const messages = await prisma.chatMessage.findMany();
  for (const m of messages) {
    if (m.audioUrl && m.audioUrl.includes("drive.google.com")) {
      console.log(`Found in ChatMessage [ID: ${m.id}]: ${m.audioUrl}`);
    }
  }

  console.log("Check complete.");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
