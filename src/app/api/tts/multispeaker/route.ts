import { NextRequest, NextResponse } from 'next/server';
import { getSystemSettingsAsync } from '@/lib/settings';
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';

export const dynamic = 'force-dynamic';

interface WavConversionOptions {
  numChannels: number,
  sampleRate: number,
  bitsPerSample: number
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
  const { numChannels, sampleRate, bitsPerSample } = options;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scriptText, laoVoice, userVoice, laoName, userName } = body;

    const systemSettings = await getSystemSettingsAsync();
    const apiKey = systemSettings.apiKey || '';

    if (!scriptText) {
      return NextResponse.json({ message: 'Thiếu trường bắt buộc: scriptText.' }, { status: 400 });
    }
    if (!apiKey) {
      return NextResponse.json(
        { message: 'Chưa cấu hình Gemini API Key. Vui lòng cấu hình trong trang Admin.' },
        { status: 401 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const config = {
      temperature: 1,
      responseModalities: ['audio'],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            { speaker: laoName || 'Lão', voiceConfig: { prebuiltVoiceConfig: { voiceName: laoVoice || 'Algieba' } } },
            { speaker: userName || 'Con', voiceConfig: { prebuiltVoiceConfig: { voiceName: userVoice || 'Aoede' } } },
          ]
        },
      },
    };
    
    const model = 'gemini-2.5-flash-preview-tts';
    const contents = [
      {
        role: 'user',
        parts: [{ text: scriptText }],
      },
    ];

    const responseStream = await ai.models.generateContentStream({
      model,
      config: config as any,
      contents: contents as any,
    });
    
    const pcmBuffers: Buffer[] = [];
    let sampleRate = 24000;
    
    for await (const chunk of responseStream) {
      if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
        continue;
      }
      
      const inlineData = chunk.candidates[0].content.parts[0].inlineData;
      if (inlineData && inlineData.data) {
        const chunkBuffer = Buffer.from(inlineData.data, 'base64');
        pcmBuffers.push(chunkBuffer);
        
        const mimeType = inlineData.mimeType || '';
        if (mimeType.includes('rate=')) {
           const match = mimeType.match(/rate=(\d+)/);
           if (match) sampleRate = parseInt(match[1]);
        }
      }
    }
    
    if (pcmBuffers.length === 0) {
        return NextResponse.json({ message: 'Gemini TTS không trả về âm thanh.' }, { status: 500 });
    }
    
    const finalPcmBuffer = Buffer.concat(pcmBuffers);
    const wavHeader = createWavHeader(finalPcmBuffer.length, {
        sampleRate, 
        numChannels: 1, 
        bitsPerSample: 16
    });
    
    const finalWavBuffer = Buffer.concat([wavHeader, finalPcmBuffer]);
    
    return new NextResponse(finalWavBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': 'attachment; filename="KichBan_Audio.wav"'
      }
    });

  } catch (err: any) {
    console.error('[/api/tts/multispeaker]', err);
    return NextResponse.json({ message: `Lỗi TTS Multi-speaker: ${err.message}` }, { status: 500 });
  }
}
