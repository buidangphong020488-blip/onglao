/**
 * POST /api/admin/migrate-audio
 * Migration một lần: Chuyển toàn bộ audioUrl dạng base64 inline trong DB
 * sang file vật lý /uploads/audio/*.wav và cập nhật lại DB.
 * 
 * blob: URL đã mất (chỉ tồn tại trong browser session cũ) → không thể recover.
 */
import { NextRequest, NextResponse } from 'next/server';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    // Lấy tất cả tin nhắn có audioUrl dạng base64
    const { rows } = await client.query<{ id: string; audioUrl: string }>(
      `SELECT id, "audioUrl" FROM "ChatMessage" WHERE "audioUrl" LIKE 'data:%'`
    );

    if (rows.length === 0) {
      await client.end();
      return NextResponse.json({ message: 'Không có bản ghi nào cần migrate.', migrated: 0 });
    }

    // Tạo thư mục lưu audio nếu chưa có
    const audioDir = path.join(process.cwd(), 'public', 'uploads', 'audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    let migrated = 0;
    let failed = 0;
    const results: any[] = [];

    for (const row of rows) {
      try {
        const dataUrl = row.audioUrl;

        // Tách phần base64 từ data:audio/wav;base64,...
        const commaIdx = dataUrl.indexOf(',');
        if (commaIdx === -1) { failed++; continue; }
        const base64Data = dataUrl.slice(commaIdx + 1);

        const wavBuffer = Buffer.from(base64Data, 'base64');
        if (wavBuffer.length < 44) { failed++; continue; }

        // Lưu file WAV
        const filename = `migrated_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.wav`;
        const filePath = path.join(audioDir, filename);
        fs.writeFileSync(filePath, wavBuffer);

        const audioUrl = `/uploads/audio/${filename}`;

        // Cập nhật DB
        await client.query(
          `UPDATE "ChatMessage" SET "audioUrl" = $1 WHERE id = $2`,
          [audioUrl, row.id]
        );

        migrated++;
        results.push({ id: row.id, audioUrl });
      } catch (e: any) {
        failed++;
        console.error(`[migrate-audio] Error for ${row.id}:`, e.message);
      }
    }

    await client.end();

    return NextResponse.json({
      message: `Migration hoàn tất: ${migrated} bản ghi, ${failed} lỗi.`,
      migrated,
      failed,
      results
    });
  } catch (err: any) {
    try { await client.end(); } catch {}
    console.error('[migrate-audio] Fatal:', err);
    return NextResponse.json({ message: 'Lỗi: ' + err.message }, { status: 500 });
  }
}
