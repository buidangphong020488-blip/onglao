/**
 * POST /api/tts
 * Ông Lão tự gọi Gemini TTS trực tiếp (KHÔNG qua GiacNgo TTS).
 *
 * Body: {
 *   text      : string   — văn bản cần đọc
 *   voiceName?: string   — tên giọng Gemini (mặc định: 'Algieba')
 *   model?    : string   — TTS model (mặc định: 'gemini-2.5-flash-preview-tts')
 *   apiKey?   : string   — Gemini API key (nếu không truyền qua header)
 * }
 * Headers:
 *   Authorization: Bearer <GEMINI_API_KEY>   (ưu tiên hơn body.apiKey)
 *
 * Response: { audioContent: string (base64), mimeType: string }
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSystemSettingsAsync } from '@/lib/settings';

export const dynamic = 'force-dynamic';

const DEFAULT_VOICE = 'Algieba';

const DEFAULT_MODEL = 'gemini-2.5-flash-preview-tts';
const GEMINI_BASE   = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voiceName, model } = body;

    // Luôn lấy API Key từ cấu hình hệ thống lưu trong DB (PostgreSQL)
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
    const voice    = voiceName || DEFAULT_VOICE;

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

      // Trả chi tiết lỗi từ Google về client
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

    // Convert raw PCM (L16) sang WAV 44-bytes header
    let finalAudioBase64 = rawAudioBase64;
    let finalMimeType = originalMimeType;

    if (originalMimeType.includes('L16') || originalMimeType.includes('pcm')) {
      const pcmBuffer = Buffer.from(rawAudioBase64, 'base64');
      const sampleRate = 24000;
      
      const wavHeader = Buffer.alloc(44);
      // RIFF identifier
      wavHeader.write('RIFF', 0);
      // File length (PCM length + 36 bytes for headers)
      wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
      // WAVE identifier
      wavHeader.write('WAVE', 8);
      // format chunk identifier
      wavHeader.write('fmt ', 12);
      // format chunk length (16)
      wavHeader.writeUInt32LE(16, 16);
      // sample format (1 = PCM)
      wavHeader.writeUInt16LE(1, 20);
      // channel count (1 = Mono)
      wavHeader.writeUInt16LE(1, 22);
      // sample rate (24000)
      wavHeader.writeUInt32LE(sampleRate, 24);
      // byte rate (sampleRate * blockAlign = 24000 * 2)
      wavHeader.writeUInt32LE(sampleRate * 2, 28);
      // block align (channelCount * bytesPerSample = 1 * 2)
      wavHeader.writeUInt16LE(2, 32);
      // bits per sample (16)
      wavHeader.writeUInt16LE(16, 34);
      // data chunk identifier
      wavHeader.write('data', 36);
      // data chunk length
      wavHeader.writeUInt32LE(pcmBuffer.length, 40);

      // Ghép header với data PCM
      const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
      finalAudioBase64 = wavBuffer.toString('base64');
      finalMimeType = 'audio/wav';
    }

    // Trả về cùng định dạng với /api/giacngo/tts để không cần sửa call sites
    return NextResponse.json({ audioContent: finalAudioBase64, mimeType: finalMimeType });
  } catch (err: any) {
    console.error('[/api/tts]', err);
    return NextResponse.json({ message: `Lỗi TTS: ${err.message}` }, { status: 500 });
  }
}
