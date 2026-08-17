import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSystemSettingsAsync } from '@/lib/settings';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DEFAULT_MODEL = 'gemini-2.5-flash-preview-tts';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

async function synthesizeTextToWav(text: string, voiceName: string, apiKey: string, ttsModel: string) {
  const geminiUrl = `${GEMINI_BASE}/${ttsModel}:generateContent?key=${apiKey}`;
  const geminiBody = {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName }
        }
      }
    }
  };

  const geminiRes = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(geminiBody)
  });

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    let parsed: any = null;
    try { parsed = JSON.parse(errText); } catch {}
    const msg = parsed?.error?.message || errText;
    throw new Error(`[HTTP ${geminiRes.status}] ${msg}`);
  }

  const geminiData: any = await geminiRes.json();
  const rawAudioBase64 = geminiData?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  const originalMimeType = geminiData?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/wav';

  if (!rawAudioBase64) {
    throw new Error('Gemini TTS không trả về dữ liệu âm thanh');
  }

  if (originalMimeType.includes('L16') || originalMimeType.includes('pcm')) {
    const pcmBuffer = Buffer.from(rawAudioBase64, 'base64');
    const sampleRate = 24000;
    const wavHeader = Buffer.alloc(44);
    wavHeader.write('RIFF', 0);
    wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
    wavHeader.write('WAVE', 8);
    wavHeader.write('fmt ', 12);
    wavHeader.writeUInt32LE(16, 16);
    wavHeader.writeUInt16LE(1, 20);
    wavHeader.writeUInt16LE(1, 22);
    wavHeader.writeUInt32LE(sampleRate, 24);
    wavHeader.writeUInt32LE(sampleRate * 2, 28);
    wavHeader.writeUInt16LE(2, 32);
    wavHeader.writeUInt16LE(16, 34);
    wavHeader.write('data', 36);
    wavHeader.writeUInt32LE(pcmBuffer.length, 40);
    return Buffer.concat([wavHeader, pcmBuffer]);
  } else {
    return Buffer.from(rawAudioBase64, 'base64');
  }
}

async function runServerBackgroundAudioGeneration(sessionId: string, forceAll: boolean, laoVoice?: string, userVoice?: string) {
  try {
    const settings = await getSystemSettingsAsync();
    const apiKey = settings.apiKey || process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      const missingKeyErr = 'ERROR: Chưa cấu hình API Key Gemini trong Admin Panel!';
      console.error(`[ServerAudioGen] ${missingKeyErr}`);
      const firstMsg = await prisma.chatMessage.findFirst({ where: { sessionId } });
      if (firstMsg) {
        await prisma.chatMessage.update({ where: { id: firstMsg.id }, data: { emotion: missingKeyErr } });
      }
      return;
    }

    const ttsModel = settings.ttsModel || DEFAULT_MODEL;
    const sessionDB = await prisma.chatSession.findUnique({ where: { id: sessionId } }).catch(() => null);
    const activeLaoVoice = laoVoice || sessionDB?.laoVoice || settings.laoVoiceName || 'Algieba';
    const activeUserVoice = userVoice || sessionDB?.userVoice || settings.userVoiceName || 'Kore';

    if (!activeLaoVoice || !activeLaoVoice.trim()) {
      const missingErr = 'ERROR: Chưa chọn/cấu hình Giọng đọc của Lão! Vui lòng mở Cấu Hình Kịch Bản để chọn giọng.';
      console.error(`[ServerAudioGen] ${missingErr}`);
      const firstMsg = await prisma.chatMessage.findFirst({ where: { sessionId } });
      if (firstMsg) {
        await prisma.chatMessage.update({ where: { id: firstMsg.id }, data: { emotion: missingErr } });
      }
      return;
    }

    if (!activeUserVoice || !activeUserVoice.trim()) {
      const missingErr = 'ERROR: Chưa chọn/cấu hình Giọng đọc của Con! Vui lòng mở Cấu Hình Kịch Bản để chọn giọng.';
      console.error(`[ServerAudioGen] ${missingErr}`);
      const firstMsg = await prisma.chatMessage.findFirst({ where: { sessionId } });
      if (firstMsg) {
        await prisma.chatMessage.update({ where: { id: firstMsg.id }, data: { emotion: missingErr } });
      }
      return;
    }

    console.log(`[ServerAudioGen] Session ${sessionId}: activeLaoVoice=${activeLaoVoice}, activeUserVoice=${activeUserVoice}`);

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId, role: { not: 'SYSTEM' } },
      orderBy: { createdAt: 'asc' }
    });

    const toGenerate = forceAll
      ? messages.filter(m => m.content && m.content.trim().length > 0)
      : messages.filter(m => (!m.audioUrl || m.audioUrl.trim().length === 0) && m.content && m.content.trim().length > 0);

    console.log(`[ServerAudioGen] Session ${sessionId}: Generating audio for ${toGenerate.length} messages in background.`);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (let i = 0; i < toGenerate.length; i++) {
      const msg = toGenerate[i];
      const roleUpper = String(msg.role || '').toUpperCase();
      const isLaoRole = roleUpper === 'ASSISTANT' || roleUpper === 'AI' || roleUpper === 'LAO';
      const targetVoice = isLaoRole ? activeLaoVoice : activeUserVoice;

      try {
        const wavBuffer = await synthesizeTextToWav(msg.content, targetVoice, apiKey, ttsModel);
        const fileName = `server_audio_${msg.id}_${Date.now()}.wav`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, wavBuffer);

        const publicAudioUrl = `/uploads/audio/${fileName}`;

        await prisma.chatMessage.update({
          where: { id: msg.id },
          data: { audioUrl: publicAudioUrl, emotion: 'calm' }
        });

        console.log(`[ServerAudioGen] Saved (${i + 1}/${toGenerate.length}) msg ${msg.id} => ${publicAudioUrl}`);
      } catch (err: any) {
        const errStr = String(err?.message || err);
        console.error(`[ServerAudioGen] Error processing msg ${msg.id}:`, errStr);

        let userFriendlyError = `ERROR: Lỗi tạo âm thanh thoại ${i + 1}: ${errStr}`;
        if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.toLowerCase().includes('quota')) {
          userFriendlyError = `ERROR: Hết Quota API Gemini (HTTP 429 - Resource Exhausted)! Vui lòng đổi API Key hoặc thử lại sau.`;
        } else if (errStr.includes('400') || errStr.includes('API_KEY_INVALID') || errStr.toLowerCase().includes('key')) {
          userFriendlyError = `ERROR: Gemini API Key không hợp lệ (HTTP 400)! Vui lòng kiểm tra lại cấu hình Key.`;
        }

        // Save error to message so polling client can notify user
        await prisma.chatMessage.update({
          where: { id: msg.id },
          data: { emotion: userFriendlyError }
        });

        // Stop remaining loop on fatal API errors (quota/key)
        break;
      }
    }
    console.log(`[ServerAudioGen] Finished background audio generation attempt for session ${sessionId}`);
  } catch (err: any) {
    console.error('[ServerAudioGen] Fatal background error:', err);
  }
}

import { authenticateUser, isResourceOwner } from '@/lib/authz';

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated || !auth.user) {
      return auth.errorResponse!;
    }

    const { sessionId, forceAll, laoVoice, userVoice } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Missing sessionId' }, { status: 400 });
    }

    const session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (session && !isResourceOwner(auth.user, session.userId)) {
      return NextResponse.json(
        { success: false, message: 'Bạn không có quyền tạo âm thanh cho kịch bản này (403 Forbidden).' },
        { status: 403 }
      );
    }

    // Trigger async background process on server
    runServerBackgroundAudioGeneration(sessionId, Boolean(forceAll), laoVoice, userVoice).catch(console.error);

    // Immediate 50ms response to client
    return NextResponse.json({
      success: true,
      status: 'processing',
      message: 'Đã kích hoạt tạo audio ngầm trên server thành công!',
      sessionId
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated || !auth.user) {
      return auth.errorResponse!;
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Missing sessionId' }, { status: 400 });
    }

    const session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (session && !isResourceOwner(auth.user, session.userId)) {
      return NextResponse.json(
        { success: false, message: 'Bạn không có quyền xem trạng thái kịch bản này (403 Forbidden).' },
        { status: 403 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId, role: { not: 'SYSTEM' } },
      select: { id: true, audioUrl: true, emotion: true, content: true }
    });

    const total = messages.filter(m => m.content && m.content.trim().length > 0).length;
    const done = messages.filter(m => m.audioUrl && m.content && m.content.trim().length > 0).length;
    const errMessage = messages.find(m => m.emotion && m.emotion.startsWith('ERROR:'))?.emotion || null;

    return NextResponse.json({
      success: true,
      total,
      done,
      hasError: Boolean(errMessage),
      errorMessage: errMessage ? errMessage.replace(/^ERROR:\s*/, '') : null
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
