const puppeteer = require('../node_modules/puppeteer-core');

(async () => {
    try {
        const browserURL = 'http://127.0.0.1:9952';
        console.log(`[TEST] Đang kết nối tới Chrome ở port 9952...`);
        const browser = await puppeteer.connect({ browserURL });
        const pages = await browser.pages();
        
        let targetPage = pages.find(p => p.url().includes('localhost:3013') || p.url().includes('127.0.0.1:3013') || p.url().includes('onglao.giac.ngo'));
        
        if (!targetPage) {
            console.log("[TEST] Không tìm thấy tab đang chạy trang Ông Lão. Đang mở tab mới...");
            targetPage = await browser.newPage();
            await targetPage.goto('http://localhost:3013', { waitUntil: 'domcontentloaded' });
        } else if (targetPage.url().includes('/admin')) {
            console.log("[TEST] Đang ở trang Admin. Chuyển hướng sang trang đàm thoại...");
            const baseUrl = targetPage.url().split('/admin')[0] || 'http://localhost:3013';
            await targetPage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        }
        console.log(`[TEST] Đang kết nối tab: ${targetPage.url()}`);
        
        console.log("[TEST] Phóng to cửa sổ Chrome...");
        try {
            const session = await targetPage.target().createCDPSession();
            const { windowId } = await session.send('Browser.getWindowForTarget');
            await session.send('Browser.setWindowBounds', {
                windowId,
                bounds: { windowState: 'maximized' }
            });
            await targetPage.setViewport({ width: 1920, height: 1080 });
        } catch (err) {
            console.log("⚠️ Không thể phóng to cửa sổ trình duyệt (có thể do phiên kết nối giới hạn):", err.message);
        }

        console.log("[TEST] Làm mới trang để đảm bảo không bị cache trang lỗi...");
        await targetPage.reload({ waitUntil: 'domcontentloaded' });
        
        console.log("[TEST] Chờ 2.5 giây để trạng thái đăng nhập/giao diện ổn định...");
        await new Promise(r => setTimeout(r, 2500));
        
        // Lắng nghe console log từ trình duyệt để bắt các lỗi phát Audio/TTS
        targetPage.on('console', msg => {
            const text = msg.text();
            if (msg.type() === 'error') {
                console.log('🔴 [BROWSER ERROR]:', text);
            } else if (text.includes('[playVoice]') || text.includes('Audio') || text.includes('tts') || text.includes('chat')) {
                console.log('🔵 [BROWSER LOG]:', text);
            }
        });
        targetPage.on('pageerror', err => console.log('🔴 [BROWSER PAGE ERROR]:', err));
        
        console.log("\n[TEST] 0. Kiểm tra màn hình đăng nhập...");
        const loginVisible = await targetPage.evaluate(() => {
            const emailInput = document.querySelector('input[type="email"]');
            const pwdInput = document.querySelector('input[type="password"]');
            return !!(emailInput && pwdInput);
        });
        
        if (loginVisible) {
            console.log("[TEST] Màn hình đăng nhập đang hiển thị. Tiến hành đăng nhập tự động...");
            
            // Điền email
            await targetPage.waitForSelector('input[type="email"]', { visible: true });
            await targetPage.type('input[type="email"]', 'demo@giac.ngo');
            
            // Điền mật khẩu
            const passwordSelector = 'input[type="password"], input[placeholder*="••••"], input[autocomplete="current-password"]';
            await targetPage.waitForSelector(passwordSelector, { visible: true });
            await targetPage.type(passwordSelector, 'password');
            
            // Click Đăng nhập
            await targetPage.click('button[type="submit"]');
            console.log("[TEST] Đã gửi thông tin đăng nhập, đang chờ xác thực...");
            
            // Đợi cho đến khi form đăng nhập biến mất
            await targetPage.waitForFunction(() => !document.querySelector('input[type="email"]'), { timeout: 30000 });
            console.log("✅ Đăng nhập tự động thành công!");
            // Đợi thêm 1.5 giây để giao diện chuyển đổi ổn định
            await new Promise(r => setTimeout(r, 1500));
        }

        console.log("\n[TEST] 0b. Kiểm tra màn hình chào...");
        await targetPage.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const enterBtn = buttons.find(btn => btn.textContent && btn.textContent.includes('Vào thiền đường'));
            if (enterBtn) {
                console.log("[TEST CLIENT] Tìm thấy nút 'Vào thiền đường', đang click để vào...");
                enterBtn.click();
            }
        });
        await new Promise(r => setTimeout(r, 1500));

        console.log("\n[TEST] 1. Tìm ô nhập liệu đàm thoại...");
        const textareaSelector = 'input[placeholder*="thưa thỉnh"], textarea[placeholder*="thưa thỉnh"]';
        await targetPage.waitForSelector(textareaSelector, { timeout: 10000 });
        
        console.log("[TEST] 2. Nhập câu hỏi...");
        const textToType = "Con đang cảm thấy mệt mỏi quá Lão ơi";
        // Focus vào ô nhập liệu
        await targetPage.evaluate((selector) => {
            const el = document.querySelector(selector);
            if (el) el.focus();
        }, textareaSelector);
        
        // Sử dụng native input/textarea setter để cập nhật React state chuẩn xác
        await targetPage.evaluate((selector, text) => {
            const el = document.querySelector(selector);
            if (el) {
                const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(proto, "value").set;
                nativeInputValueSetter.call(el, text);
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }, textareaSelector, textToType);
        
        await new Promise(r => setTimeout(r, 500));
        
        console.log("[TEST] 3. Nhấn gửi tin nhắn...");
        // Tìm nút gửi (SVG lucide-send hoặc button có send icon)
        await targetPage.evaluate(() => {
            const sendButton = document.querySelector('button svg.lucide-send')?.closest('button') || 
                               document.querySelector('button[className*="orange"]');
            if (sendButton) {
                sendButton.click();
            } else {
                // Nhấn Enter trên input/textarea
                const el = document.querySelector('input[placeholder*="thưa thỉnh"], textarea[placeholder*="thưa thỉnh"]');
                if (el) {
                    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
                }
            }
        });
        
        console.log("[TEST] Đang đợi 8 giây để nhận phản hồi và phát âm thanh đầu tiên...");
        await new Promise(r => setTimeout(r, 8000));
        
        console.log("\n[TEST] 4. Tìm nút 'Nghe lại' cuối cùng để test nghe lại...");
        const clickSuccess = await targetPage.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const replayButtons = buttons.filter(btn => btn.textContent && btn.textContent.includes('Nghe lại'));
            if (replayButtons.length > 0) {
                const lastReplayButton = replayButtons[replayButtons.length - 1];
                console.log(`[TEST CLIENT] Đã tìm thấy nút Nghe lại. Thực hiện click...`);
                lastReplayButton.click();
                return true;
            }
            return false;
        });
        
        if (clickSuccess) {
            console.log("[TEST] Đã nhấn nút 'Nghe lại' thành công!");
        } else {
            console.log("⚠️ Không tìm thấy nút 'Nghe lại' trên giao diện.");
        }
        
        console.log("Đang giữ kết nối 5 giây để nghe thử âm thanh...");
        await new Promise(r => setTimeout(r, 5000));
        
        await browser.disconnect();
        console.log("[TEST] Kết thúc kiểm thử.");
    } catch (e) {
        console.error("Lỗi kịch bản test:", e);
    }
})();
