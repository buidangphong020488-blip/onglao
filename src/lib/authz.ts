/**
 * src/lib/authz.ts
 * Module phân quyền & xác thực server-side tập trung cho AI Thiền Đường (Lựa chọn B - Bắt buộc Đăng nhập)
 */

import { NextRequest, NextResponse } from 'next/server';
import { giacNgoAuth, GiacNgoApiError } from '@/lib/giacngo';

export interface AuthenticatedUser {
  id: string | number;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export interface AuthResult {
  authenticated: boolean;
  user: AuthenticatedUser | null;
  errorResponse: NextResponse | null;
}

// In-memory token verification cache (TTL = 60 giây)
const tokenCache = new Map<string, { user: AuthenticatedUser; expiresAt: number }>();

function cleanExpiredCache() {
  const now = Date.now();
  for (const [token, data] of tokenCache.entries()) {
    if (data.expiresAt <= now) {
      tokenCache.delete(token);
    }
  }
}

/**
 * Trích xuất Bearer token từ request header
 */
export function extractBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }
  const customHeaderToken = req.headers.get('x-giacngo-token') || req.headers.get('x-admin-token');
  if (customHeaderToken && customHeaderToken.trim()) {
    return customHeaderToken.trim();
  }
  return null;
}

/**
 * Xác minh người dùng qua Bearer token (Bắt buộc Đăng nhập - Lựa chọn B)
 */
export async function authenticateUser(req: NextRequest): Promise<AuthResult> {
  const token = extractBearerToken(req);
  if (!token) {
    return {
      authenticated: false,
      user: null,
      errorResponse: NextResponse.json(
        { success: false, message: 'Cần đăng nhập tài khoản Giác Ngộ để sử dụng tính năng này.' },
        { status: 401 }
      )
    };
  }

  cleanExpiredCache();
  const now = Date.now();
  const cached = tokenCache.get(token);
  if (cached && cached.expiresAt > now) {
    return {
      authenticated: true,
      user: cached.user,
      errorResponse: null
    };
  }

  try {
    const userMe = await giacNgoAuth.me(token);
    if (!userMe || !userMe.id) {
      return {
        authenticated: false,
        user: null,
        errorResponse: NextResponse.json(
          { success: false, message: 'Phiên đăng nhập không hợp lệ hoặc không tồn tại.' },
          { status: 401 }
        )
      };
    }

    const authUser: AuthenticatedUser = {
      id: userMe.id,
      name: userMe.name || '',
      email: userMe.email || '',
      role: (userMe as any).role || 'user'
    };

    tokenCache.set(token, {
      user: authUser,
      expiresAt: now + 60 * 1000 // Cache trong 60s
    });

    return {
      authenticated: true,
      user: authUser,
      errorResponse: null
    };
  } catch (err: any) {
    if (err instanceof GiacNgoApiError && err.status === 401) {
      return {
        authenticated: false,
        user: null,
        errorResponse: NextResponse.json(
          { success: false, message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' },
          { status: 401 }
        )
      };
    }
    console.error('Lỗi xác thực Bearer token Giác Ngộ:', err?.message || err);
    return {
      authenticated: false,
      user: null,
      errorResponse: NextResponse.json(
        { success: false, message: 'Không thể xác minh tài khoản Giác Ngộ.' },
        { status: 401 }
      )
    };
  }
}

/**
 * Phân quyền Admin cho các API Route /api/admin/*
 */
export async function requireAdmin(req: NextRequest): Promise<AuthResult> {
  const adminSecret = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_TOKEN;
  const reqAdminHeader = req.headers.get('x-admin-token') || req.headers.get('authorization')?.replace('Bearer ', '');

  if (adminSecret && reqAdminHeader === adminSecret) {
    return {
      authenticated: true,
      user: { id: 'admin_sys', name: 'System Admin', role: 'admin' },
      errorResponse: null
    };
  }

  const auth = await authenticateUser(req);
  if (!auth.authenticated || !auth.user) {
    return auth;
  }

  const isRoleAdmin = auth.user.role === 'admin' || (auth.user as any).isAdmin === true;
  if (!isRoleAdmin) {
    return {
      authenticated: false,
      user: auth.user,
      errorResponse: NextResponse.json(
        { success: false, message: 'Tài khoản của bạn không có quyền quản trị viên (403 Forbidden).' },
        { status: 403 }
      )
    };
  }

  return auth;
}

/**
 * Kiểm tra quyền sở hữu resource của User (Resource Ownership Check)
 */
export function isResourceOwner(principalUserId: string | number, resourceUserId: string | number | null | undefined): boolean {
  if (!resourceUserId) return true;
  return String(principalUserId) === String(resourceUserId);
}
