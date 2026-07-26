/**
 * POST /api/tts
 * Ông Lão tự gọi Gemini TTS trực tiếp (KHÔNG qua GiacNgo TTS).
 *
 * Body: {
 *   text      : string   — văn bản cần đọc
 *   voiceName?: string   — tên giọng Gemini (mặc định: 'Algieba')
 *   model?    : string   — TTS model (mặc định: 'gemini-2.5-flash-preview-tts')
 * }
 *
 * Response: { audioUrl: string (/uploads/audio/xxx.wav), mimeType: string }
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSystemSettingsAsync } from '@/lib/settings';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DEFAULT_MODEL = 'gemini-2.5-flash-preview-tts';
const GEMINI_BASE   = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voiceName, model, userId } = body;

    const systemSettings = await getSystemSettingsAsync();
    const apiKey = systemSettings.apiKey || '';

    if (!text) {
      return NextResponse.json({ message: 'Thiếu trường bắt buộc: text.' }, { status: 400 });
    }
    if (!apiKey) {
      return NextResponse.json(
        { message: 'Chưa cấu hình Gemini API Key. Vui lòng cấu hình trong trang Admin.' },
        { status: 401 }
      );
    }

    const ttsModel = model || systemSettings.ttsModel || DEFAULT_MODEL;
    const voice = (voiceName && String(voiceName).trim()) ? voiceName : (systemSettings.laoVoiceName || 'Algieba');

    const geminiUrl = `${GEMINI_BASE}/${ttsModel}:generateContent?key=${apiKey}`;

    const geminiBody = {
      contents: [{
        parts: [{ text }]
      }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice }
          }
        }
      }
    };

    const geminiRes = await fetch(geminiUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(geminiBody)
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[/api/tts] Gemini error:', errText);
      let parsedErr: any = null;
      try { parsedErr = JSON.parse(errText); } catch {}
      const googleMsg = parsedErr?.error?.message || errText;
      return NextResponse.json(
        { message: `Google Gemini lỗi: ${googleMsg}`, details: parsedErr },
        { status: geminiRes.status }
      );
    }

    const geminiData: any = await geminiRes.json();
    const rawAudioBase64 =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    const originalMimeType =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/wav';

    if (!rawAudioBase64) {
      return NextResponse.json({ message: 'Gemini TTS không trả về dữ liệu âm thanh.' }, { status: 500 });
    }

    // Convert raw PCM sang WAV với 44-byte header nếu chưa có header RIFF
    let wavBuffer: Buffer;
    const rawBuffer = Buffer.from(rawAudioBase64, 'base64');
    const isAlreadyRiffWav = rawBuffer.length >= 12 && rawBuffer.toString('utf8', 0, 4) === 'RIFF';

    if (!isAlreadyRiffWav) {
      const sampleRate = 24000;
      const wavHeader = Buffer.alloc(44);
      wavHeader.write('RIFF', 0);
      wavHeader.writeUInt32LE(36 + rawBuffer.length, 4);
      wavHeader.write('WAVE', 8);
      wavHeader.write('fmt ', 12);
      wavHeader.writeUInt32LE(16, 16);
      wavHeader.writeUInt16LE(1, 20);  // PCM
      wavHeader.writeUInt16LE(1, 22);  // Mono
      wavHeader.writeUInt32LE(sampleRate, 24);
      wavHeader.writeUInt32LE(sampleRate * 2, 28);
      wavHeader.writeUInt16LE(2, 32);
      wavHeader.writeUInt16LE(16, 34);
      wavHeader.write('data', 36);
      wavHeader.writeUInt32LE(rawBuffer.length, 40);
      wavBuffer = Buffer.concat([wavHeader, rawBuffer]);
    } else {
      wavBuffer = rawBuffer;
    }

    // ✅ Lưu file WAV theo từng user: /uploads/audio/{userId}/
    const userFolder = userId ? String(userId).replace(/[^a-zA-Z0-9_-]/g, '') : 'guest';
    const audioDir = path.join(process.cwd(), 'public', 'uploads', 'audio', userFolder);
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    const filename = `${Date.now()}${Math.random().toString(36).slice(2, 6)}.wav`;
    const filePath = path.join(audioDir, filename);
    fs.writeFileSync(filePath, wavBuffer);

    const audioUrl = `/uploads/audio/${userFolder}/${filename}`;
    const finalAudioBase64 = wavBuffer.toString('base64');

    // Trả audioUrl (đường dẫn file) + audioContent (base64 chuẩn RIFF WAV)
    return NextResponse.json({ audioUrl, audioContent: finalAudioBase64, mimeType: 'audio/wav' });
  } catch (err: any) {
    console.error('[/api/tts]', err);
    return NextResponse.json({ message: `Lỗi TTS: ${err.message}` }, { status: 500 });
  }
}
