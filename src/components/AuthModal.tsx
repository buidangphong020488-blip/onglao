"use client";

import React, { useState } from "react";
import { LogIn, X, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { loginWithGiacNgoAction } from "@/actions/auth";

interface AuthModalProps {
  onClose?: () => void;
  showCloseButton?: boolean;
  onLogin: (user: { id: string; name: string; email: string; avatar: string | null }, token: string) => void;
}

export default function AuthModal({ onClose, showCloseButton = true, onLogin }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let res = await loginWithGiacNgoAction(email.trim(), password);
      let userData: any = res?.success ? res.data : null;

      // Nếu Server Action bị chặn do truy cập qua IP trên mobile, gọi API route trực tiếp
      if (!userData) {
        const apiRes = await fetch("/api/giacngo/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
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
        } else {
          setError(apiData.message || res?.error || "Email hoặc mật khẩu không chính xác.");
          return;
        }
      }

      if (userData) {
        // Lưu token + user vào localStorage
        localStorage.setItem("onglao_token", userData.token || "");
        localStorage.setItem("onglao_user", JSON.stringify(userData.user));
        if (userData.refreshToken) {
          localStorage.setItem("onglao_refresh_token", userData.refreshToken);
        }
        onLogin(userData.user as any, userData.token || "");
        onClose?.();
      }
    } catch (err: any) {
      setError("Không thể kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={() => {
        if (onClose && showCloseButton) onClose();
      }}
    >
      <div
        className="relative w-full max-w-sm bg-slate-900/95 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-900/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div>
            <h2 className="text-base font-black text-white tracking-wide flex items-center gap-2">
              <LogIn size={18} className="text-indigo-400" />
              Đăng nhập Ông Lão
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Dùng tài khoản{" "}
              <span className="text-indigo-300 font-semibold">GiacNgo</span> để đăng nhập
            </p>
          </div>
          {onClose && showCloseButton && (
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 flex flex-col gap-4 mt-2">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@giac.ngo"
              autoComplete="email"
              className="bg-slate-800 border border-slate-600/50 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-slate-800 border border-slate-600/50 focus:border-indigo-500 rounded-xl px-4 py-2.5 pr-10 text-sm text-white outline-none transition-colors placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-rose-900/30 border border-rose-500/30 rounded-xl px-3 py-2">
              <AlertCircle size={14} className="text-rose-400 shrink-0" />
              <p className="text-[12px] text-rose-300">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-wait text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 mt-1"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Đang xác thực...
              </>
            ) : (
              <>
                <LogIn size={15} /> Đăng nhập
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-600">
            Chưa có tài khoản?{" "}
            <a
              href="https://giac.ngo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Đăng ký tại GiacNgo
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
