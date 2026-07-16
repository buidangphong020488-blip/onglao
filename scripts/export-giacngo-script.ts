import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load các biến môi trường từ .env
dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Đang kết nối database và lấy dữ liệu tri thức Giác Ngộ...')
  const list = await prisma.knowledgeBase.findMany({
    orderBy: { createdAt: 'desc' }
  })

  if (list.length === 0) {
    console.log('Không tìm thấy dữ liệu tri thức nào trong database.')
    return
  }

  console.log(`Tìm thấy ${list.length} bản ghi tri thức. Đang chuyển đổi sang định dạng kịch bản...`)

  let scriptContent = ''
  list.forEach((item, index) => {
    scriptContent += `Con: ${item.question}\n`
    scriptContent += `Lão: ${item.answer}\n`
    if (index < list.length - 1) {
      scriptContent += `\n` // Thêm dòng trống ngăn cách các đoạn hội thoại
    }
  })

  const outputPath = path.join(process.cwd(), 'giacngo_kich_ban.txt')
  fs.writeFileSync(outputPath, scriptContent, 'utf8')
  console.log(`Đã xuất kịch bản thành công ra file: ${outputPath}`)
  console.log('Bạn có thể mở file này, sao chép toàn bộ nội dung và dán vào nút "Nhập kịch bản thủ công" trên giao diện.')
}

main()
  .catch((e) => {
    console.error('Lỗi khi xuất kịch bản:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
