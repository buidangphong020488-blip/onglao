/**
 * regenerateStanzaAudio.js
 * Tạo audio cho tất cả Stanza (kệ) chưa có audioUrl
 * Gọi Gemini TTS → lưu file WAV → cập nhật DB field audioUrl
 */
const { Pool } = require('pg');
const fs   = require('fs');
const path = require('path');
const https = require('https');

const DB_URL     = 'postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao';
const pool       = new Pool({ connectionString: DB_URL });
const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads', 'audio');

// ── Lấy API key từ DB ─────────────────────────────────────────────────────────
async function getApiKey() {
  const res = await pool.query("SELECT value FROM \"SystemSetting\" WHERE key = 'apiKey' LIMIT 1");
  if (res.rows.length === 0) throw new Error('Không tìm thấy apiKey');
  return res.rows[0].value;
}

// ── Convert PCM L16 → WAV ─────────────────────────────────────────────────────
function pcmToWav(pcmBuffer, sampleRate = 24000) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmBuffer.length, 40);
  return Buffer.concat([header, pcmBuffer]);
}

// ── Gọi Gemini TTS ────────────────────────────────────────────────────────────
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
          const json = JSON.parse(data);
          const part = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
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

// ── Xử lý 1 stanza ───────────────────────────────────────────────────────────
async function processStanza(row, apiKey, idx, total) {
  // Nếu đã có audioUrl VÀ file tồn tại → skip
  if (row.audioUrl && row.audioUrl.startsWith('/')) {
    const filePath = path.join(PUBLIC_DIR, row.audioUrl);
    if (fs.existsSync(filePath)) {
      console.log(`  [${idx}/${total}] ✓ OK    "${row.content.substring(0,40)}"`);
      return 'ok';
    }
    console.log(`  [${idx}/${total}] ⚠ URL có nhưng file thiếu → tái tạo`);
  }

  // Đọc kệ thẳng không cần prefix - giọng Algieba đủ phù hợp
  const ttsText = row.content;

  try {
    const { base64, mimeType } = await callTTS(ttsText, apiKey);

    let wavBuf;
    if (mimeType.includes('L16') || mimeType.includes('pcm')) {
      wavBuf = pcmToWav(Buffer.from(base64, 'base64'));
    } else {
      wavBuf = Buffer.from(base64, 'base64');
    }

    // Tạo tên file
    let fileName;
    if (row.audioUrl && row.audioUrl.startsWith('/uploads/audio/')) {
      fileName = path.basename(row.audioUrl);
    } else {
      fileName = `stanza_${row.id}.wav`;
    }

    const fileUrl  = `/uploads/audio/${fileName}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    fs.writeFileSync(filePath, wavBuf);

    // Cập nhật DB
    await pool.query('UPDATE "Stanza" SET "audioUrl" = $1 WHERE id = $2', [fileUrl, row.id]);

    console.log(`  [${idx}/${total}] ✔ GEN   "${row.content.substring(0,40)}" → ${fileUrl} (${(wavBuf.length/1024).toFixed(0)} KB)`);
    return 'generated';
  } catch(e) {
    console.error(`  [${idx}/${total}] ✗ FAIL  "${row.content.substring(0,40)}" → ${e.message}`);
    return 'failed';
  }
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Đang lấy API key từ DB...');
  const apiKey = await getApiKey();
  console.log('API key: ' + apiKey.substring(0, 10) + '...\n');

  // Lấy tất cả Stanza (bao gồm cả cái đã có audioUrl để kiểm tra file)
  const { rows } = await pool.query(
    `SELECT s.id, s.content, s."audioUrl", p.title 
     FROM "Stanza" s 
     LEFT JOIN "Poem" p ON p.id = s."poemId" 
     ORDER BY p.title, s."createdAt"`
  );

  const toProcess = rows.filter(r => !r.audioUrl || !fs.existsSync(path.join(PUBLIC_DIR, r.audioUrl)));
  const alreadyOk = rows.length - toProcess.length;

  console.log(`Tổng Stanza: ${rows.length}`);
  console.log(`Đã có sẵn : ${alreadyOk}`);
  console.log(`Cần tạo   : ${toProcess.length}\n`);

  if (toProcess.length === 0) {
    console.log('✅ Tất cả kệ đã có audio!');
    await pool.end();
    return;
  }

  let ok = 0, generated = 0, failed = 0;
  for (let i = 0; i < toProcess.length; i++) {
    const row = toProcess[i];
    const result = await processStanza(row, apiKey, i + 1, toProcess.length);
    if (result === 'ok')        ok++;
    if (result === 'generated') generated++;
    if (result === 'failed')    failed++;
    // Delay 800ms giữa các lần gọi API
    if (result !== 'ok') await new Promise(r => setTimeout(r, 800));
  }

  console.log('\n=== HOÀN THÀNH STANZA ===');
  console.log(`  ✓ Đã có sẵn : ${ok + alreadyOk}`);
  console.log(`  ✔ Đã tạo mới: ${generated}`);
  console.log(`  ✗ Thất bại  : ${failed}`);

  await pool.end();
}

main().catch(err => { console.error('LỖI:', err); pool.end(); });
