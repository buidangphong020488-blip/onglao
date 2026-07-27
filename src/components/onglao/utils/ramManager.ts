/**
 * src/components/onglao/utils/ramManager.ts
 * Trình Quản Lý RAM & Thu Hồi Bộ Nhớ Blob URL Tự Động (Tuân thủ Quy tắc Kỷ luật 5)
 */

const activeBlobUrls = new Set<string>();

export function createManagedBlobUrl(blobOrFile: Blob | File): string {
  if (typeof window === 'undefined' || !URL || !URL.createObjectURL) return '';
  const url = URL.createObjectURL(blobOrFile);
  activeBlobUrls.add(url);

  // Tự động thu hồi RAM khi số lượng Blob URL đệm vượt quá 5 tệp
  if (activeBlobUrls.size > 5) {
    const urlsToRevoke = Array.from(activeBlobUrls).slice(0, activeBlobUrls.size - 5);
    urlsToRevoke.forEach(oldUrl => {
      try { URL.revokeObjectURL(oldUrl); } catch (e) {}
      activeBlobUrls.delete(oldUrl);
    });
  }

  return url;
}

export function revokeManagedBlobUrl(url: string | null | undefined) {
  if (!url || typeof window === 'undefined' || !URL || !URL.revokeObjectURL) return;
  if (url.startsWith('blob:')) {
    try { URL.revokeObjectURL(url); } catch (e) {}
    activeBlobUrls.delete(url);
  }
}

export function autoReleaseRamMemory() {
  if (typeof window === 'undefined') return;
  if (activeBlobUrls.size > 5) {
    const urlsToRevoke = Array.from(activeBlobUrls).slice(0, activeBlobUrls.size - 5);
    urlsToRevoke.forEach(url => {
      try { URL.revokeObjectURL(url); } catch (e) {}
      activeBlobUrls.delete(url);
    });
  }
  if ((window as any).gc) {
    try { (window as any).gc(); } catch (e) {}
  }
}
