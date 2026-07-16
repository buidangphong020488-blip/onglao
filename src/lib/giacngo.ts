/**
 * GiacNgo API Client
 * Module trung tâm gọi tới GiacNgo Backend (http://18.139.27.179:3002)
 * Dùng server-side trong Next.js API routes — không expose ra browser.
 */

const GIACNGO_BASE = process.env.GIACNGO_API_URL || 'https://giac.ngo';
/** Token service account của OngLao trên GiacNgo — dùng khi không có user JWT */
const GIACNGO_SERVICE_TOKEN = process.env.GIACNGO_SERVICE_TOKEN || '';

export type GiacNgoRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  token?: string; // JWT Bearer token từ user
  headers?: Record<string, string>;
  timeoutMs?: number;
};

/** Lỗi từ GiacNgo API */
export class GiacNgoApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'GiacNgoApiError';
  }
}

/**
 * Gọi GiacNgo API (JSON response)
 */
export async function callGiacNgo<T = unknown>(
  path: string,
  options: GiacNgoRequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, token, headers = {}, timeoutMs = 15000 } = options;

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  const effectiveToken = token || GIACNGO_SERVICE_TOKEN;
  if (effectiveToken) {
    reqHeaders['Authorization'] = `Bearer ${effectiveToken}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${GIACNGO_BASE}${path}`, {
      method,
      headers: reqHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      throw new GiacNgoApiError(
        res.status,
        (isJson && (data as any)?.message) || `GiacNgo API error ${res.status}`,
        data
      );
    }

    return data as T;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new GiacNgoApiError(504, `GiacNgo API timeout after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Forward stream response từ GiacNgo (SSE / text-event-stream)
 * Dùng cho /api/conversations/chat streaming
 */
export async function streamFromGiacNgo(
  path: string,
  options: GiacNgoRequestOptions = {}
): Promise<Response> {
  const { method = 'POST', body, token, headers = {} } = options;

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  const effectiveToken = token || GIACNGO_SERVICE_TOKEN;
  if (effectiveToken) {
    reqHeaders['Authorization'] = `Bearer ${effectiveToken}`;
  }

  const res = await fetch(`${GIACNGO_BASE}${path}`, {
    method,
    headers: reqHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return res; // Caller pipes the ReadableStream directly
}

// ─── Auth APIs ───────────────────────────────────────────────────────────────

export const giacNgoAuth = {
  /** Đăng nhập bằng email + password */
  login: (email: string, password: string, context?: string, spaceSlug?: string) =>
    callGiacNgo<{ id: number; name: string; email: string; apiToken: string; refreshToken: string; [k: string]: unknown }>(
      '/api/auth/login',
      { method: 'POST', body: { email, password, context, spaceSlug } }
    ),

  /** Đăng ký tài khoản mới */
  register: (name: string, email: string, password: string) =>
    callGiacNgo<{ id: number; name: string; email: string; apiToken: string }>('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),

  /** Lấy thông tin user hiện tại */
  me: (token: string) =>
    callGiacNgo<{ id: number; name: string; email: string; [k: string]: unknown }>('/api/auth/me', { token }),

  /** Đặt lại mật khẩu (quên mật khẩu) */
  forgotPassword: (email: string, language = 'vi') =>
    callGiacNgo('/api/auth/forgot-password', { method: 'POST', body: { email, language } }),

  /** Refresh access token */
  refreshToken: (refreshToken: string) =>
    callGiacNgo<{ accessToken: string }>('/api/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    }),
};

// ─── User APIs ────────────────────────────────────────────────────────────────

export const giacNgoUsers = {
  /** Lấy danh sách tất cả users (admin) */
  list: (token: string) =>
    callGiacNgo<unknown[]>('/api/users', { token }),

  /** Lấy profile của user hiện tại */
  profile: (token: string) =>
    callGiacNgo<Record<string, unknown>>('/api/users/profile', { token }),

  /** Cập nhật user */
  update: (id: number, data: Record<string, unknown>, token: string) =>
    callGiacNgo(`/api/users/${id}`, { method: 'PUT', body: data, token }),
};

// ─── Library APIs ─────────────────────────────────────────────────────────────

export const giacNgoLibrary = {
  /** Danh sách tài liệu thư viện */
  list: (token?: string) =>
    callGiacNgo<unknown[]>('/api/library', { token }),

  /** Sidebar navigation */
  sidebar: (token?: string) =>
    callGiacNgo('/api/library/sidebar', { token }),

  /** Bộ lọc */
  filters: (token?: string) =>
    callGiacNgo('/api/library/filters', { token }),

  /** Chi tiết tài liệu */
  detail: (id: string, token?: string) =>
    callGiacNgo(`/api/library/documents/${id}`, { token }),

  /** Tài liệu đề xuất */
  recommended: (token?: string) =>
    callGiacNgo<unknown[]>('/api/library/recommended', { token }),

  /** Danh sách topics */
  topics: (token?: string) =>
    callGiacNgo<unknown[]>('/api/library/topics', { token }),
};

// ─── AI Chat APIs ─────────────────────────────────────────────────────────────

export const giacNgoChat = {
  /**
   * Chat với AI (JSON response — không stream)
   * Dùng cho kịch bản đơn giản, ít delay
   */
  sendJson: (aiConfigId: number | string, message: string, token?: string, language = 'vi', userPersona?: any, spaceId?: number) =>
    callGiacNgo<{ message: string; thought?: string }>('/api/v1/chat', {
      method: 'POST',
      body: { 
        aiConfigId, 
        message, 
        language, 
        stream: false, 
        userPersona,
        spaceId: spaceId || Number(process.env.GIACNGO_SPACE_ID || '1')
      },
      token,
      timeoutMs: 60000, // AI có thể chậm
    }),

  /**
   * Chat stream — trả về Response object để pipe SSE tới client
   */
  sendStream: (
    payload: {
      aiConfigId?: number | string;
      aiConfig?: Record<string, unknown>;
      messages: Array<{ id: string; sender: string; text: string; timestamp: number }>;
      conversationId?: string;
      language?: string;
      guestTurnCount?: number;
      userPersona?: any;
      stream?: boolean;
      spaceId?: number;
    },
    token?: string
  ) => {
    payload.stream = true;
    if (!payload.spaceId) {
      payload.spaceId = Number(process.env.GIACNGO_SPACE_ID || '1');
    }
    return streamFromGiacNgo('/api/v1/chat', {
      method: 'POST',
      body: payload,
      token,
    });
  },

  /** Lịch sử hội thoại của user */
  listConversations: (token: string) =>
    callGiacNgo<unknown[]>('/api/conversations', { token }),
};

// ─── AI Config APIs ───────────────────────────────────────────────────────────

export const giacNgoAiConfig = {
  /** Lấy danh sách AI agents */
  list: (userId?: number | string, token?: string) =>
    callGiacNgo<unknown[]>('/api/ai-configs', { method: 'POST', body: { userId }, token }),

  /** Chi tiết một AI config theo ID */
  detail: (id: number | string, token?: string) =>
    callGiacNgo<Record<string, unknown>>(`/api/ai-configs/${id}`, { token }),

  /**
   * Lấy danh sách dữ liệu huấn luyện RAG (Q&A, tài liệu) của một AI config
   * Trả về mảng TrainingData { id, type, question, answer, summary, fileName, fileUrl, ... }
   */
  trainingData: (id: number | string, token?: string) =>
    callGiacNgo<any[]>(`/api/ai-configs/${id}/training-data`, { token }),
};

// ─── TTS APIs ─────────────────────────────────────────────────────────────────

export const giacNgoTts = {
  /**
   * Tạo audio từ text qua API v1 mới
   * Trả về { audioContent: string (base64), mimeType: string }
   */
  generate: (
    params: {
      text: string;
      aiConfigId?: number | string;
      aiId?: number | string;
      [key: string]: any;
    },
    token?: string
  ) => {
    const aiConfigId = params.aiConfigId || params.aiId;
    return callGiacNgo<{ audioContent: string; mimeType: string; provider: string; voice: string }>(
      '/api/v1/tts',
      {
        method: 'POST',
        body: { 
          aiConfigId, 
          text: params.text,
          spaceId: Number(process.env.GIACNGO_SPACE_ID || '1')
        },
        token,
        timeoutMs: 30000
      }
    );
  },
};

// ─── System APIs ──────────────────────────────────────────────────────────────

export const giacNgoSystem = {
  /** Public stats (không cần auth) */
  publicStats: () => callGiacNgo('/api/system/public/stats'),

  /** System config (không cần auth) */
  config: () => callGiacNgo('/api/system/config'),
};
