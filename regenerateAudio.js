/**
 * regenerateAudio.js
 * Tái tạo tất cả file audio bị thiếu cho OpeningPhrase (mào đầu)
 * bằng cách gọi Gemini TTS API, lưu file WAV vào public/uploads/audio/ và cập nhật DB
 */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const https = require('https');

const DB_URL  = 'postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao';
const pool    = new Pool({ connectionString: DB_URL });
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads', 'audio');

// ── Lấy API key từ DB ────────────────────────────────────────────────────────
async function getApiKey() {
  const res = await pool.query("SELECT value FROM \"SystemSetting\" WHERE key = 'apiKey' LIMIT 1");
  if (res.rows.length === 0) throw new Error('Không tìm thấy apiKey trong SystemSetting');
  return res.rows[0].value;
}

// ── Convert PCM L16 → WAV ────────────────────────────────────────────────────
function pcmToWav(pcmBuffer, sampleRate = 24000) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);   // PCM
  header.writeUInt16LE(1, 22);   // Mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmBuffer.length, 40);
  return Buffer.concat([header, pcmBuffer]);
}

// ── Gọi Gemini TTS ───────────────────────────────────────────────────────────
async function callTTS(text, apiKey, voiceName = 'Algieba') {
  const model = 'gemini-2.5-flash-preview-tts';
  const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = JSON.stringify({
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName } }
      }
    }
  });

  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json  = JSON.parse(data);
          const part  = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
          if (!part?.data) return reject(new Error('TTS trả về rỗng: ' + data.substring(0, 200)));
          resolve({ base64: part.data, mimeType: part.mimeType || 'audio/wav' });
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Xử lý 1 phrase ──────────────────────────────────────────────────────────
async function processPhrase(row, apiKey) {
  const url      = row.audioUrl;           // e.g. /uploads/audio/phrase_xxx.wav
  const filePath = path.join(__dirname, 'public', url);

  if (fs.existsSync(filePath)) {
    console.log(`  ✓ OK   [${row.category}] ${row.text.substring(0,40)}`);
    return 'ok';
  }

  const promptPrefix = 'Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đánh chính tả, ngắt nhẹ rõ ràng giữa các câu: ';
  const ttsText      = `${promptPrefix}${row.text}`;

  try {
    const { base64, mimeType } = await callTTS(ttsText, apiKey);

    let wavBuf;
    if (mimeType.includes('L16') || mimeType.includes('pcm')) {
      wavBuf = pcmToWav(Buffer.from(base64, 'base64'));
    } else {
      wavBuf = Buffer.from(base64, 'base64');
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, wavBuf);
    console.log(`  ✔ GEN  [${row.category}] ${row.text.substring(0,40)} → ${url} (${(wavBuf.length/1024).toFixed(0)} KB)`);
    return 'generated';
  } catch(e) {
    console.error(`  ✗ FAIL [${row.category}] ${row.text.substring(0,40)} → ${e.message}`);
    return 'failed';
  }
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Đang lấy API key từ DB...');
  const apiKey = await getApiKey();
  console.log('API key: ' + apiKey.substring(0, 10) + '...');

  // Lấy tất cả OpeningPhrase có audioUrl
  const { rows } = await pool.query(
    'SELECT id, text, "audioUrl", category FROM "OpeningPhrase" WHERE "audioUrl" IS NOT NULL AND "audioUrl" != \'\' ORDER BY category, "createdAt"'
  );
  console.log(`\nTổng cộng ${rows.length} mào đầu có audioUrl. Bắt đầu kiểm tra và tái tạo...\n`);

  let ok = 0, generated = 0, failed = 0;
  for (const row of rows) {
    const result = await processPhrase(row, apiKey);
    if (result === 'ok')        ok++;
    if (result === 'generated') generated++;
    if (result === 'failed')    failed++;
    // Delay nhỏ để không spam API
    if (result !== 'ok') await new Promise(r => setTimeout(r, 800));
  }

  console.log(`\n=== HOÀN THÀNH ===`);
  console.log(`  ✓ Đã có sẵn : ${ok}`);
  console.log(`  ✔ Đã tạo mới: ${generated}`);
  console.log(`  ✗ Thất bại  : ${failed}`);

  await pool.end();
}

main().catch(err => { console.error('LỖI:', err); pool.end(); });
