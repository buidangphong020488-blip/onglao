// Shared utilities for OngLao Platform hooks and components

export const fetchWithRetry = async (url: string, options?: any, retries: number = 5, delay: number = 1000): Promise<any> => {
  try {
    if (options?.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const response = await fetch(url, options);
    const text = await response.text();
    
    if (!response.ok) {
      // Lỗi 429 (Rate Limit) cần chờ lâu hơn để API phục hồi
      if (response.status === 429 && retries > 0) {
        const waitMs = 30000; // Chờ 30 giây
        console.warn(`[fetchWithRetry] 429 Too Many Requests, chờ ${waitMs/1000}s rồi thử lại (còn ${retries} lần)...`);
        await new Promise(res => setTimeout(res, waitMs));
        return fetchWithRetry(url, options, retries - 1, delay);
      }
      let cleanText = text;
      if (text.includes('<!DOCTYPE') || text.includes('<html') || text.includes('<head')) {
        cleanText = `Đường dẫn API (${url}) không tồn tại hoặc phản hồi trang lỗi HTML (Mã ${response.status}).`;
      }
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('onglao_auth_expired'));
        }
        throw new Error(`HTTP Error 401: ${cleanText}`);
      }
      throw new Error(`HTTP Error ${response.status}: ${cleanText}`);
    }
    
    try {
      return text ? JSON.parse(text) : {};
    } catch (e: any) {
      throw new Error(`JSON Parse Error: ${e.message}`);
    }
  } catch (err: any) {
    if (err.name === 'AbortError' || err.message.includes('aborted')) throw err;
    if (err.message.includes('HTTP Error 400') || 
        err.message.includes('HTTP Error 401') || 
        err.message.includes('HTTP Error 403') || 
        err.message.includes('HTTP Error 404')) {
        throw err; // Không retry cho các lỗi client (trừ 429)
    }
    if (retries > 0) {
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw err;
  }
};

export const cleanTextForTTS = (text: string): string => {
  if (!text) return "";
  let cleaned = text.replace(/\[.*?\]|\(.*?\)/g, '').trim();
  cleaned = cleaned.replace(/\//g, ',');
  return cleaned.replace(/\b([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂ??ỆỈỊỌỎỐỒỔỖỘỚỜ?ỠỢỤỦỨỪỬỮỰỲÝỴỶỸ]{2,})\b/g, 
      (match: string) => match.charAt(0) + match.slice(1).toLowerCase()
  );
};
