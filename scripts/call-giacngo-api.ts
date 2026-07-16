import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load các biến môi trường từ .env
dotenv.config()

const GIACNGO_API_URL = process.env.GIACNGO_API_URL || 'https://giac.ngo'
const GIACNGO_SERVICE_TOKEN = process.env.GIACNGO_SERVICE_TOKEN || ''

async function callExternalGiacNgoChat(message: string, aiConfigId: number | string = 1) {
  console.log(`\n=== 💬 Gọi API Chat trực tiếp tới GiacNgo (${GIACNGO_API_URL}/api/v1/chat) ===`)
  try {
    const res = await fetch(`${GIACNGO_API_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GIACNGO_SERVICE_TOKEN}`
      },
      body: JSON.stringify({
        aiConfigId,
        message,
        language: 'vi',
        stream: false,
        spaceId: Number(process.env.GIACNGO_SPACE_ID || '1')
      })
    })

    const text = await res.text()
    let data: any = {}
    try {
      data = JSON.parse(text)
    } catch (e) {}

    if (!res.ok) {
      console.error('Response Error Body:', text)
      throw new Error(data.message || `Lỗi HTTP ${res.status}: ${text}`)
    }

    console.log('Phản hồi từ AI Giác Ngộ:')
    console.log(data.message)
    if (data.thought) {
      console.log('\nThought (Suy nghĩ ngầm):')
      console.log(data.thought)
    }

    return data.message
  } catch (err: any) {
    console.error('Lỗi khi gọi API Chat ngoài:', err.message)
    return null
  }
}

async function callExternalGiacNgoTts(text: string, aiConfigId: number | string = 1) {
  console.log(`\n=== 🔊 Gọi API TTS trực tiếp tới GiacNgo (${GIACNGO_API_URL}/api/v1/tts) ===`)
  try {
    const res = await fetch(`${GIACNGO_API_URL}/api/v1/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GIACNGO_SERVICE_TOKEN}`
      },
      body: JSON.stringify({
        text,
        aiConfigId,
        spaceId: Number(process.env.GIACNGO_SPACE_ID || '1')
      })
    })

    const textResponse = await res.text()
    let data: any = {}
    try {
      data = JSON.parse(textResponse)
    } catch (e) {}

    if (!res.ok) {
      console.error('Response Error Body:', textResponse)
      throw new Error(data.message || `Lỗi HTTP ${res.status}: ${textResponse}`)
    }

    console.log(`Đã tạo TTS từ GiacNgo. Provider: ${data.provider}, Voice: ${data.voice}`)
    
    if (data.audioContent) {
      const buffer = Buffer.from(data.audioContent, 'base64')
      const outputPath = path.join(process.cwd(), 'giacngo_external_tts.wav')
      fs.writeFileSync(outputPath, buffer)
      console.log(`🎉 Đã lưu âm thanh thực tế từ API Giác Ngộ: ${outputPath}`)
    }

  } catch (err: any) {
    console.error('Lỗi khi gọi API TTS ngoài:', err.message)
  }
}

async function run() {
  console.log('Bắt đầu thử nghiệm gọi API Giác Ngộ bên ngoài trực tiếp...')
  console.log(`Target URL: ${GIACNGO_API_URL}`)
  console.log(`Token: ${GIACNGO_SERVICE_TOKEN ? 'Đã tìm thấy (độ dài ' + GIACNGO_SERVICE_TOKEN.length + ' ký tự)' : 'Chưa thiết lập!'}`)
  
  if (!GIACNGO_SERVICE_TOKEN) {
    console.error('Vui lòng cấu hình GIACNGO_SERVICE_TOKEN trong file .env trước!')
    return
  }

  // 1. Gửi tin nhắn đến API chat ngoài để lấy nội dung
  const scriptPrompt = 'Viết một câu thoại ngắn của Lão khuyên người trẻ bớt dính mắc trần gian'
  const reply = await callExternalGiacNgoChat(scriptPrompt, 1)

  // 2. Chuyển câu thoại nhận được thành âm thanh qua API TTS ngoài
  if (reply) {
    await callExternalGiacNgoTts(reply, 1)
  }
}

run()
