const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('=== KHỞI CHẠY BỘ KIỂM THỬ TỰ ĐỘNG TOÀN DIỆN: https://onglao.giac.ngo/ ===\n');

  const browser = await puppeteer.launch({
    headless: false, // Chạy thực tế (không ẩn danh) để hiển thị Chrome GUI
    defaultViewport: null,
    args: ['--start-maximized'],
    slowMo: 50
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Lắng nghe log của browser
    page.on('console', msg => {
      console.log(`[CONSOLE]: ${msg.text()}`);
    });

    page.on('pageerror', err => {
      console.error('[JAVASCRIPT ERROR]:', err.message);
    });

    // ── 1. Truy cập trang chủ ──
    console.log('1. Đang truy cập trang chủ...');
    await page.goto('https://onglao.giac.ngo/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: 'scripts/test_step1_loaded.png' });
    console.log('Đã lưu ảnh màn hình tải trang: scripts/test_step1_loaded.png');

    // Bypass tutorial và lưu trạng thái đăng ký nếu cần
    await page.evaluate(() => {
      localStorage.setItem('taman_has_seen_tutorial', 'true');
      localStorage.setItem('onglao_subscribed', 'true');
    });

    // ── 2. Đăng nhập nếu đang ở màn hình Đăng Nhập (AuthModal) ──
    const isLoginScreen = await page.evaluate(() => {
      // Nếu có input email, chứng tỏ chưa đăng nhập
      return !!document.querySelector('input[type="email"]');
    });

    if (isLoginScreen) {
      console.log('Phát hiện màn hình đăng nhập. Đang tiến hành đăng nhập bằng tài khoản SSO...');
      
      const emailInput = await page.$('input[type="email"]');
      await emailInput.click({ clickCount: 3 });
      await emailInput.type('demo@giac.ngo');

      const passInput = await page.$('input[type="password"]');
      await passInput.click({ clickCount: 3 });
      await passInput.type('password');

      await page.screenshot({ path: 'scripts/test_login_filled.png' });
      console.log('Đã lưu ảnh điền form đăng nhập: scripts/test_login_filled.png');

      console.log('Đang click nút Đăng nhập...');
      await page.evaluate(() => {
        const btn = document.querySelector('button[type="submit"]');
        if (btn) btn.click();
      });

      // Chờ 5 giây xem có đăng nhập thành công và chuyển trang hay không
      await new Promise(r => setTimeout(r, 5000));
      await page.screenshot({ path: 'scripts/test_login_submitted.png' });
    } else {
      console.log('Tài khoản đã đăng nhập trước đó hoặc đã bỏ qua màn hình Đăng nhập.');
    }

    // ── 3. Điền thông tin cá nhân trên màn hình chào (WelcomeScreen) ──
    console.log('2. Đang kiểm tra màn hình Welcome...');
    const isWelcomeScreen = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Vào thiền đường'));
      return !!btn;
    });

    if (isWelcomeScreen) {
      console.log('Đang điền thông tin cá nhân...');

      // Nhập danh xưng
      const nameInput = await page.$('input[placeholder="Tên, Pháp danh..."]');
      if (nameInput) {
        await nameInput.click({ clickCount: 3 });
        await nameInput.type('Phong');
      }

      // Chọn giới tính Nam
      await page.evaluate(() => {
        const btnNam = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Nam');
        if (btnNam) btnNam.click();
      });

      // Nhập tuổi
      const ageInput = await page.$('input[type="number"]');
      if (ageInput) {
        await ageInput.click({ clickCount: 3 });
        await ageInput.type('30');
      }

      await page.screenshot({ path: 'scripts/test_step2_filled_profile.png' });
      console.log('Đã lưu ảnh điền thông tin: scripts/test_step2_filled_profile.png');

      // Click "Vào thiền đường"
      console.log('Đang click "Vào thiền đường"...');
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Vào thiền đường'));
        if (btn) btn.click();
      });

      // Chờ 3 giây để React chuyển sang giao diện chính
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: 'scripts/test_step3_entered_thienduang.png' });
      console.log('Đã lưu ảnh giao diện chính: scripts/test_step3_entered_thienduang.png');
    } else {
      console.log('Không phát hiện thấy màn hình chào hoặc đã trực tiếp vào giao diện chính.');
    }

    // ── 4. Gửi câu hỏi cho Lão trên giao diện chính (NormalModePanel) ──
    console.log('3. Đang kiểm tra giao diện chính...');
    const mainInputSelector = 'input[placeholder="Con muốn thưa thỉnh..."]';
    const mainInputExists = await page.$(mainInputSelector);

    if (mainInputExists) {
      console.log('Tìm thấy thanh gõ lời thưa. Đang tiến hành hỏi đạo...');
      
      const chatInput = await page.$(mainInputSelector);
      await chatInput.type('Lão ơi, thế nào là vô minh?');

      await page.screenshot({ path: 'scripts/test_step4_sent_question.png' });
      console.log('Đã lưu ảnh gõ câu hỏi: scripts/test_step4_sent_question.png');

      console.log('Đang gửi câu hỏi...');
      await page.keyboard.press('Enter');

      // Chờ 8 giây để Lão trả lời (TTS và RAG kết nối)
      console.log('Đang chờ Lão khai thị (8 giây)...');
      await new Promise(r => setTimeout(r, 8000));

      await page.screenshot({ path: 'scripts/test_step5_lao_responded.png' });
      console.log('Đã lưu ảnh kết quả đàm đạo: scripts/test_step5_lao_responded.png');
    } else {
      console.log('Không tìm thấy thanh gõ lời thưa. Giao diện chính chưa được load hoặc bị crash.');
    }

  } catch (err) {
    console.error('Lỗi trong quá trình chạy test flow:', err);
  } finally {
    await browser.close();
    console.log('\n=== KẾT THÚC BỘ KIỂM THỬ ===');
  }
})();
