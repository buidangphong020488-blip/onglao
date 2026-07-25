"use client";

import React, { useState } from "react";
import { LogIn, Eye, EyeOff, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { loginWithGiacNgoAction } from "@/actions/auth";

interface LoginPageProps {
  onLogin?: (user: { id: string; name: string; email: string; avatar: string | null }, token: string) => void;
  onSuccess?: () => void;
}

export default function LoginPage({ onLogin, onSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password.trim()) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      let res: any = await loginWithGiacNgoAction(cleanEmail, password).catch((e) => ({ success: false, error: String(e) }));
      let userData: any = res?.success ? res.data : null;

      if (!userData) {
        const apiRes = await fetch("/api/giacngo/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password }),
        });
        const apiData = await apiRes.json().catch(() => ({}));
        if (apiRes.ok && apiData.apiToken) {
          const giacNgoBase = "https://giac.ngo";
          let avatarUrl = apiData.avatarUrl || null;
          if (avatarUrl && avatarUrl.startsWith("/")) avatarUrl = `${giacNgoBase}${avatarUrl}`;
          userData = {
            token: apiData.apiToken,
            refreshToken: apiData.refreshToken || null,
            user: {
              id: `gn_${apiData.id}`,
              giacNgoId: apiData.id,
              name: apiData.name || apiData.email,
              email: apiData.email,
              avatar: avatarUrl,
              space: apiData.space || null,
            },
          };
        }
      }

      if (userData) {
        localStorage.setItem("onglao_token", userData.token || "");
        localStorage.setItem("onglao_user", JSON.stringify(userData.user));
        if (userData.refreshToken) {
          localStorage.setItem("onglao_refresh_token", userData.refreshToken);
        }
        if (typeof onLogin === 'function') {
          onLogin(userData.user as any, userData.token || "");
        }
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        setError(res?.error || "Email hoặc mật khẩu không chính xác.");
      }
    } catch (err: any) {
      setError("Không thể kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: "guest_user",
      name: "Khách Thiền Đường",
      email: "khach@giac.ngo",
      avatar: null,
    };
    const guestToken = "guest_demo_token";
    localStorage.setItem("onglao_token", guestToken);
    localStorage.setItem("onglao_user", JSON.stringify(guestUser));
    if (typeof onLogin === 'function') {
      onLogin(guestUser, guestToken);
    }
    if (typeof onSuccess === 'function') {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-[#020617] text-slate-100 flex flex-col justify-center items-center p-4 overflow-y-auto select-none">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-slate-900/90 border border-indigo-500/30 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-300">
        {/* Gradient Header Indicator */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500 absolute top-0 left-0"></div>

        <div className="flex flex-col items-center text-center mb-8 pt-2">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
            <Sparkles size={32} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">AI Thiền Đường Ông Lão</h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Vui lòng đăng nhập tài khoản <span className="text-indigo-300 font-bold">GiacNgo</span> để sử dụng ứng dụng
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Email tài khoản
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nhap-email@giac.ngo"
              autoComplete="email"
              className="bg-slate-950 border border-slate-700/60 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 font-sans"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-slate-950 border border-slate-700/60 focus:border-indigo-500 rounded-xl px-4 py-3 pr-11 text-sm text-white outline-none transition-colors placeholder:text-slate-600 font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2.5 bg-rose-950/50 border border-rose-500/40 rounded-xl p-3.5 animate-in fade-in duration-200">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <p className="text-xs font-medium text-rose-300 leading-snug">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:via-purple-500 hover:to-rose-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/60 mt-1 uppercase tracking-wider cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Đang đăng nhập...
              </>
            ) : (
              <>
                <LogIn size={18} /> Đăng Nhập Ngay
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Chưa có tài khoản?{" "}
              <a
                href="https://giac.ngo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors"
              >
                Đăng ký tại GiacNgo.ngo
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
