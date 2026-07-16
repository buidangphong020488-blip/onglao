import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as fs from 'fs'
import * as path from 'path'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seed process...')

  const dataDir = path.join(__dirname, 'data')

  // 1. Đọc dữ liệu từ các file JSON
  const giacNgoData = JSON.parse(fs.readFileSync(path.join(dataDir, 'giac_ngo_db.json'), 'utf8'))
  const bgmData = JSON.parse(fs.readFileSync(path.join(dataDir, 'default_bgm_list.json'), 'utf8'))
  const voiceData = JSON.parse(fs.readFileSync(path.join(dataDir, 'voice_styles.json'), 'utf8'))
  const poemData = JSON.parse(fs.readFileSync(path.join(dataDir, 'poem_database.json'), 'utf8'))

  // 2. Clear sạch dữ liệu cũ
  console.log('Cleaning up existing database records...')
  await prisma.userFavorite.deleteMany({})
  await prisma.chatMessage.deleteMany({})
  await prisma.chatSession.deleteMany({})
  await prisma.stanza.deleteMany({})
  await prisma.poem.deleteMany({})
  await prisma.knowledgeBase.deleteMany({})
  await prisma.voiceStyle.deleteMany({})
  await prisma.backgroundMusic.deleteMany({})
  await prisma.promptTemplate.deleteMany({})

  // 3. Seed Background Music
  console.log(`Seeding ${bgmData.length} background music tracks...`)
  for (const bgm of bgmData) {
    await prisma.backgroundMusic.create({
      data: {
        id: bgm.id,
        name: bgm.name,
        url: bgm.url,
        isActive: true,
      }
    })
  }

  // 4. Seed Voice Styles
  console.log(`Seeding ${voiceData.length} voice styles...`)
  for (const voice of voiceData) {
    await prisma.voiceStyle.create({
      data: {
        id: voice.id,
        label: voice.label,
        promptText: voice.text, // map "text" -> "promptText"
      }
    })
  }

  // 5. Seed Knowledge Base
  console.log(`Seeding ${giacNgoData.length} knowledge base items...`)
  for (const item of giacNgoData) {
    await prisma.knowledgeBase.create({
      data: {
        question: item.question,
        answer: item.answer,
        category: 'Triết lý sống', // Gán category mặc định
      }
    })
  }

  // 6. Seed Poems & Stanzas
  console.log(`Seeding ${poemData.length} poems and their stanzas...`)
  for (const poem of poemData) {
    // Để an toàn, lọc bỏ các stanza bị trùng lặp id và map tags
    const stanzasCreate = poem.stanzas.map((stanza: any) => ({
      id: stanza.id,
      content: stanza.content,
      meaning: stanza.meaning || '',
      audioUrl: stanza.audioUrl || null,
      tags: stanza.tags || [],
    }))

    await prisma.poem.create({
      data: {
        title: poem.title,
        stanzas: {
          create: stanzasCreate
        }
      }
    })
  }

  // 7. Seed Prompt Templates mặc định
  console.log('Seeding default Prompt Templates...')
  await prisma.promptTemplate.create({
    data: {
      name: 'LaoDefault',
      content: 'Con hãy đóng vai Ông Lão, một người thầy giác ngộ điềm đạm, từ bi, thông suốt Phật pháp Tam Vô. Hãy trả lời câu hỏi của người dùng bằng giọng văn mộc mạc, sâu sắc, hướng dẫn họ nhận ra bản tánh thanh tịnh.'
    }
  })

  console.log('Seed process completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed execution:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
