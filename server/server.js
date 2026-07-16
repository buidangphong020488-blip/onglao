const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3456;
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'onglao-admin-2025';

app.use(cors());
app.use(express.json());

// ─── Middleware xác thực Admin ─────────────────────────────────────────────
const requireAdmin = (req, res, next) => {
    const auth = req.headers['x-admin-secret'];
    if (auth !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
    next();
};

// ─── PUBLIC API ───────────────────────────────────────────────────────────

/**
 * POST /api/activate
 * Body: { code, deviceId }
 * - Kiểm tra code có tồn tại và còn lượt dùng không
 * - Kiểm tra thiết bị này đã dùng code chưa
 * - Nếu hợp lệ → tăng used_count, ghi activation
 */
app.post('/api/activate', (req, res) => {
    const { code, deviceId } = req.body;

    if (!code || !deviceId) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin.' });
    }

    const codeUpper = code.trim().toUpperCase();

    // Tìm code trong DB
    const row = db.prepare('SELECT * FROM codes WHERE UPPER(code) = ?').get(codeUpper);
    if (!row) {
        return res.json({ success: false, message: 'Mã kích hoạt không hợp lệ.' });
    }

    // Kiểm tra còn lượt dùng không
    if (row.used_count >= row.max_uses) {
        return res.json({ success: false, message: 'Mã này đã được sử dụng hết lượt.' });
    }

    // Kiểm tra thiết bị này đã dùng code này chưa
    const existing = db.prepare(
        'SELECT id FROM activations WHERE UPPER(code) = ? AND device_id = ?'
    ).get(codeUpper, deviceId);
    if (existing) {
        return res.json({ success: false, message: 'Thiết bị này đã dùng mã này rồi.' });
    }

    // Ghi nhận kích hoạt
    db.prepare('UPDATE codes SET used_count = used_count + 1 WHERE UPPER(code) = ?').run(codeUpper);
    db.prepare('INSERT INTO activations (code, device_id) VALUES (?, ?)').run(codeUpper, deviceId);

    return res.json({ success: true, message: 'Kích hoạt thành công! Chào mừng đến với Thiền Đường.' });
});

/**
 * GET /api/check-device
 * Query: ?deviceId=xxx
 * Kiểm tra thiết bị đã kích hoạt chưa (dùng khi reload trang)
 */
app.get('/api/check-device', (req, res) => {
    const { deviceId } = req.query;
    if (!deviceId) return res.json({ subscribed: false });
    const row = db.prepare('SELECT id FROM activations WHERE device_id = ?').get(deviceId);
    res.json({ subscribed: !!row });
});

// ─── ADMIN API ────────────────────────────────────────────────────────────

/** GET /api/admin/codes — Danh sách tất cả codes */
app.get('/api/admin/codes', requireAdmin, (req, res) => {
    const codes = db.prepare('SELECT * FROM codes ORDER BY created_at DESC').all();
    res.json(codes);
});

/** POST /api/admin/codes — Thêm code mới */
app.post('/api/admin/codes', requireAdmin, (req, res) => {
    const { code, max_uses = 1, note = '' } = req.body;
    if (!code) return res.status(400).json({ error: 'Thiếu code' });
    try {
        db.prepare('INSERT INTO codes (code, max_uses, note) VALUES (?, ?, ?)')
            .run(code.trim().toUpperCase(), max_uses, note);
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ error: 'Code đã tồn tại.' });
    }
});

/** DELETE /api/admin/codes/:code — Xoá code */
app.delete('/api/admin/codes/:code', requireAdmin, (req, res) => {
    db.prepare('DELETE FROM codes WHERE UPPER(code) = ?').run(req.params.code.toUpperCase());
    res.json({ success: true });
});

/** POST /api/admin/codes/reset/:code — Reset lượt dùng của code */
app.post('/api/admin/codes/reset/:code', requireAdmin, (req, res) => {
    const codeUpper = req.params.code.toUpperCase();
    db.prepare('UPDATE codes SET used_count = 0 WHERE UPPER(code) = ?').run(codeUpper);
    db.prepare('DELETE FROM activations WHERE UPPER(code) = ?').run(codeUpper);
    res.json({ success: true });
});

/** GET /api/admin/stats — Thống kê tổng quan */
app.get('/api/admin/stats', requireAdmin, (req, res) => {
    const totalCodes = db.prepare('SELECT COUNT(*) as n FROM codes').get().n;
    const totalUsed = db.prepare('SELECT COUNT(*) as n FROM activations').get().n;
    const totalDevices = db.prepare('SELECT COUNT(DISTINCT device_id) as n FROM activations').get().n;
    const recentCodes = db.prepare('SELECT * FROM codes ORDER BY created_at DESC LIMIT 5').all();
    res.json({ totalCodes, totalUsed, totalDevices, recentCodes });
});

/** GET /api/admin/activations — Lịch sử kích hoạt */
app.get('/api/admin/activations', requireAdmin, (req, res) => {
    const rows = db.prepare('SELECT * FROM activations ORDER BY activated_at DESC LIMIT 100').all();
    res.json(rows);
});

// ─── Start ────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🏮 Ông Lão Backend running on http://localhost:${PORT}`);
    console.log(`   Admin Secret: ${ADMIN_SECRET}`);
    console.log(`   Database: ${require('path').join(__dirname, 'onglao.sqlite')}\n`);
});
