/**
 * src/lib/diskCleanup.ts
 * Tác vụ tự động dọn dẹp các tệp video xuất cũ quá 30 ngày để bảo vệ ổ đĩa SSD
 */

import fs from 'fs';
import path from 'path';

export function cleanupOldExportedFiles(maxAgeDays = 30): { deletedCount: number; freedBytes: number } {
  let deletedCount = 0;
  let freedBytes = 0;

  try {
    const exportsDir = path.join(process.cwd(), 'public', 'exports');
    if (!fs.existsSync(exportsDir)) {
      return { deletedCount: 0, freedBytes: 0 };
    }

    const now = Date.now();
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;

    const scanDirectory = (dir: string) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            scanDirectory(fullPath);
          } else if (stat.isFile() && (item.endsWith('.mp4') || item.endsWith('.webm'))) {
            const ageMs = now - stat.mtimeMs;
            if (ageMs > maxAgeMs) {
              freedBytes += stat.size;
              fs.unlinkSync(fullPath);
              deletedCount++;
              console.log(`[Disk Cleanup] Deleted old export file: ${fullPath} (${Math.round(stat.size / 1024 / 1024)}MB)`);
            }
          }
        } catch (e) {
          console.warn(`[Disk Cleanup] Warning reading ${fullPath}:`, e);
        }
      }
    };

    scanDirectory(exportsDir);
  } catch (err) {
    console.error('[Disk Cleanup] Error during export cleanup:', err);
  }

  return { deletedCount, freedBytes };
}
