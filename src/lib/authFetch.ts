/**
 * src/lib/authFetch.ts
 * Trình gọi API dùng chung client-side tự động đính kèm Bearer token (Giai đoạn 1.1)
 */

export function getClientAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('onglao_token') || localStorage.getItem('giacngo_token') || null;
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const token = getClientAuthToken();
  const headers = new Headers(init.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    // Xóa token hết hạn và phát sự kiện thông báo yêu cầu đăng nhập lại
    localStorage.removeItem('onglao_token');
    localStorage.removeItem('giacngo_token');
    window.dispatchEvent(new CustomEvent('onglao_auth_unauthorized', {
      detail: { status: 401, url: typeof input === 'string' ? input : (input as any).url }
    }));
  }

  return response;
}

export async function authFetchJson<T = any>(input: RequestInfo | URL, init: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: string; message?: string; [key: string]: any }> {
  try {
    const res = await authFetch(input, init);
    const json = await res.json();
    return json;
  } catch (err: any) {
    console.error(`[authFetchJson Error] ${typeof input === 'string' ? input : 'API'}:`, err?.message || err);
    return { success: false, error: err?.message || 'Lỗi kết nối mạng.' };
  }
}
