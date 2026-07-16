import React, { useState } from 'react';
import { Settings2, X, Save, Sparkles, Heart, Music, Eye, EyeOff } from 'lucide-react';

const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [saved, setSaved] = useState(false);

    const [settings, setSettings] = useState({
        apiKey: '',
        modelName: 'gemini-2.5-flash-preview-09-2025',
        ttsModel: 'gemini-2.5-flash-preview-tts',
        momoPhone: '',
        momoName: '',
        bankName: '',
        bankAccount: '',
        qrImageUrl: '',
        subscribeCodes: 'TAMVO2025,UNGDUNG888,THIENSUGD2025',
        freeLimit: '20',
    });

    const handleLogin = async () => {
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loginUser, password: loginPass })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setIsLoggedIn(true);
                setLoginError('');
                
                // Fetch settings from server
                const settingsRes = await fetch('/api/admin/settings', {
                    headers: { 'x-admin-token': loginPass }
                });
                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json();
                    setSettings(settingsData);
                }
            } else {
                setLoginError(data.message || 'Sai tài khoản hoặc mật khẩu.');
            }
        } catch (err) {
            setLoginError('Lỗi kết nối server: ' + err.message);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': loginPass
                },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                alert('Lỗi lưu cấu hình: ' + (await res.text()));
            }
        } catch (err) {
            alert('Lỗi kết nối: ' + err.message);
        }
    };

    const set = (key, val) => setSettings(p => ({ ...p, [key]: val }));

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xs shadow-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/5 flex items-center gap-2">
                        <Settings2 size={18} className="text-slate-400" />
                        <h1 className="font-bold text-slate-200 text-sm">Đăng nhập Quản trị</h1>
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                        <input
                            type="text"
                            value={loginUser}
                            onChange={e => { setLoginUser(e.target.value); setLoginError(''); }}
                            onKeyPress={e => e.key === 'Enter' && document.getElementById('pass-input').focus()}
                            placeholder="Tài khoản"
                            autoFocus
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-500"
                        />
                        <div className="relative">
                            <input
                                id="pass-input"
                                type={showPass ? 'text' : 'password'}
                                value={loginPass}
                                onChange={e => { setLoginPass(e.target.value); setLoginError(''); }}
                                onKeyPress={e => e.key === 'Enter' && handleLogin()}
                                placeholder="Mật khẩu"
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-white outline-none focus:border-slate-500"
                            />
                            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {loginError && <p className="text-rose-400 text-xs text-center">{loginError}</p>}
                        <button onClick={handleLogin} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                            Vào cấu hình
                        </button>
                        <a href="/" className="text-[11px] text-slate-600 hover:text-slate-400 text-center transition-colors">← Quay về trang chủ</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] font-sans text-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-slate-900/95 border-b border-white/5 backdrop-blur-sm px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Settings2 size={20} className="text-amber-400" />
                    <h1 className="font-black text-slate-200 tracking-wide">Cấu hình hệ thống — Ông Lão AI</h1>
                </div>
                <div className="flex items-center gap-3">
                    {saved && <span className="text-emerald-400 text-sm font-bold animate-pulse">✅ Đã lưu!</span>}
                    <a href="/" className="text-xs text-slate-500 hover:text-white border border-white/10 px-3 py-2 rounded-lg transition-colors">← Trang chủ</a>
                    <button onClick={handleSave} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all shadow-lg">
                        <Save size={16} /> Lưu cấu hình
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-6 flex flex-col gap-8">

                {/* API & Models */}
                <section className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                    <h2 className="text-xs font-bold text-amber-400 tracking-widest uppercase flex items-center gap-2"><Sparkles size={14} /> API & Mô hình AI</h2>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">Gemini API Key</label>
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={settings.apiKey}
                                onChange={e => set('apiKey', e.target.value)}
                                placeholder="AIzaSy..."
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-white outline-none focus:border-amber-500 font-mono"
                            />
                            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">TTS Model (Giọng đọc)</label>
                        <select value={settings.ttsModel} onChange={e => set('ttsModel', e.target.value)}
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500 font-mono">
                            <option value="gemini-2.5-flash-preview-tts">Gemini 2.5 Flash TTS (Preview)</option>
                            <option value="gemini-3.1-flash-tts-preview">Gemini 3.1 Flash TTS (Preview)</option>
                        </select>
                        <span className="text-[10px] text-slate-600">Mặc định: gemini-2.5-flash-preview-tts</span>
                    </div>
                </section>

                {/* Freemium */}
                <section className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                    <h2 className="text-xs font-bold text-emerald-400 tracking-widest uppercase flex items-center gap-2"><Heart size={14} /> Freemium & Mã kích hoạt</h2>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">Số lượt nhắn tin miễn phí</label>
                        <input type="number" value={settings.freeLimit} onChange={e => set('freeLimit', e.target.value)}
                            className="w-40 bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">Danh sách mã kích hoạt <span className="text-slate-600">(phân cách bằng dấu phẩy)</span></label>
                        <input type="text" value={settings.subscribeCodes} onChange={e => set('subscribeCodes', e.target.value)}
                            placeholder="CODE1,CODE2,CODE3"
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500 font-mono" />
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <button onClick={() => { localStorage.removeItem('onglao_subscribed'); localStorage.removeItem('onglao_msg_count'); alert('Đã reset trạng thái freemium!'); }}
                            className="text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 px-4 py-2 rounded-lg transition-colors">
                            ⚠️ Reset freemium user hiện tại
                        </button>
                        <button onClick={() => { localStorage.setItem('onglao_subscribed', 'true'); alert('Đã kích hoạt user hiện tại!'); }}
                            className="text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-lg transition-colors">
                            ✅ Kích hoạt user hiện tại
                        </button>
                    </div>
                </section>

                {/* Payment */}
                <section className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                    <h2 className="text-xs font-bold text-pink-400 tracking-widest uppercase flex items-center gap-2"><Music size={14} /> Thanh toán</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] text-slate-400 font-bold">💜 Số ĐT MoMo</label>
                            <input type="text" value={settings.momoPhone} onChange={e => set('momoPhone', e.target.value)}
                                placeholder="09xx xxx xxx"
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500 font-mono" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] text-slate-400 font-bold">Tên tài khoản MoMo</label>
                            <input type="text" value={settings.momoName} onChange={e => set('momoName', e.target.value)}
                                placeholder="NGUYEN VAN A"
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] text-slate-400 font-bold">🏦 Ngân hàng</label>
                            <input type="text" value={settings.bankName} onChange={e => set('bankName', e.target.value)}
                                placeholder="Vietcombank"
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] text-slate-400 font-bold">Số tài khoản</label>
                            <input type="text" value={settings.bankAccount} onChange={e => set('bankAccount', e.target.value)}
                                placeholder="1234567890"
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500 font-mono" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">📷 URL ảnh QR thanh toán <span className="text-slate-600">(link ảnh từ web)</span></label>
                        <div className="flex gap-3 items-start">
                            <input type="text" value={settings.qrImageUrl} onChange={e => set('qrImageUrl', e.target.value)}
                                placeholder="https://i.imgur.com/..."
                                className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500" />
                            {settings.qrImageUrl && (
                                <img src={settings.qrImageUrl} alt="QR preview" className="w-16 h-16 rounded-xl object-contain bg-white p-1 border border-white/10" />
                            )}
                        </div>
                        <span className="text-[10px] text-slate-600">Upload ảnh QR lên imgur.com → lấy link direct, dán vào đây</span>
                    </div>
                </section>

                {/* Save button bottom */}
                <button onClick={handleSave} className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-2xl text-sm transition-all shadow-xl flex items-center justify-center gap-2">
                    <Save size={18} /> Lưu tất cả cấu hình
                </button>
                {saved && <p className="text-emerald-400 text-sm text-center font-bold">✅ Đã lưu thành công! Tải lại trang chủ để áp dụng.</p>}
            </div>
        </div>
    );
};

export default AdminPage;
