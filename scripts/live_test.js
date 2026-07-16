const puppeteer = require('puppeteer');

(async () => {
  console.log('=== KHỞI CHẠY LIVE BROWSER TEST (END-TO-END) ===\n');

  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized'],
      slowMo: 80
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', msg => {
      console.log(`[CONSOLE]: ${msg.text()}`);
    });

    page.on('pageerror', err => {
      console.error('[JAVASCRIPT ERROR]:', err.message);
    });

    // ── 1. Trang chủ ──
    console.log('1. Đang truy cập Trang chủ tại http://localhost:3013 ...');
    await page.goto('http://localhost:3013');
    await new Promise(r => setTimeout(r, 2000));

    // Bypass tutorial + subscribed
    await page.evaluate(() => {
      localStorage.setItem('taman_has_seen_tutorial', 'true');
      localStorage.setItem('onglao_subscribed', 'true');
    });

    // ── 2. Click nút Đăng nhập trên màn hình chào (KHÔNG phải nút Submit form) ──
    console.log('2. Click nút "Đăng nhập" trên màn hình chào...');
    await page.waitForSelector('button');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.trim().includes('Đăng nhập') && b.type !== 'submit'
      );
      if (btn) btn.click();
    });

    // ── 3. AuthModal ──
    console.log('3. Chờ AuthModal hiện ra...');
    await page.waitForSelector('input[type="email"]', { timeout: 8000 });

    console.log('4. Nhập tài khoản demo@giac.ngo / password...');
    const emailEl = await page.$('input[type="email"]');
    await emailEl.click({ clickCount: 3 });
    await emailEl.type('demo@giac.ngo');

    const passEl = await page.$('input[type="password"]');
    await passEl.click({ clickCount: 3 });
    await passEl.type('password');

    console.log('5. Click nút Submit Đăng nhập...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) btn.click();
    });

    // Chờ login xong
    await new Promise(r => setTimeout(r, 4000));

    // ── 4. Nhập profile nếu cần (lần đầu chưa có profile) ──
    const needsProfile = await page.evaluate(() => {
      return !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Vào thiền đường'));
    });

    if (needsProfile) {
      await page.evaluate(() => {
        const nameInput = document.querySelector('input[placeholder="Tên, Pháp danh..."]');
        if (nameInput && !nameInput.value) {
          nameInput.value = 'Demo';
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await new Promise(r => setTimeout(r, 500));

      console.log('6. Click "Vào thiền đường"...');
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Vào thiền đường'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 3000));
    } else {
      console.log('6. Đã có profile, vào thẳng thiền đường...');
    }

    // Dismiss Tutorial Tour nếu hiện ra
    const hasTutorial = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Bỏ qua tất cả'));
      return !!btn;
    });
    if (hasTutorial) {
      console.log('Bỏ qua Tutorial Tour...');
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Bỏ qua tất cả'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 1000));
    }

    // ── 5. Kiểm thử các nút menu trái (Sidebar) ──
    console.log('\n=== KIỂM THỬ CLICK SIDEBAR MENU ===\n');

    // 5.1. Click "Kho Kệ Pháp & Mào Đầu"
    console.log('5.1. Click "Kho Kệ Pháp & Mào Đầu"...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Kho Kệ Pháp & Mào Đầu'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'scripts/test_sidebar_poem_modal.png' });
    console.log('Đã mở Kho Kệ Pháp & Mào Đầu. Ảnh chụp: scripts/test_sidebar_poem_modal.png');
    // Đóng modal bằng click overlay
    await page.evaluate(() => {
      const modal = document.querySelector('div.fixed.inset-0.z-\\[160\\]');
      if (modal) modal.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // 5.2. Click "Đạo Diễn AI (Tạo kịch bản)"
    console.log('5.2. Click "Đạo Diễn AI (Tạo kịch bản)"...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Đạo Diễn AI'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'scripts/test_sidebar_ai_director.png' });
    console.log('Đã mở Đạo Diễn AI modal. Ảnh chụp: scripts/test_sidebar_ai_director.png');
    // Đóng modal
    await page.evaluate(() => {
      const modal = document.querySelector('div.fixed.inset-0.z-\\[150\\]');
      if (modal) modal.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // 5.3. Click "Nhập kịch bản thủ công"
    console.log('5.3. Click "Nhập kịch bản thủ công"...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Nhập kịch bản thủ công'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'scripts/test_sidebar_manual_script.png' });
    console.log('Đã mở Nhập kịch bản thủ công modal. Ảnh chụp: scripts/test_sidebar_manual_script.png');
    // Đóng modal
    await page.evaluate(() => {
      const modal = document.querySelector('div.fixed.inset-0.z-\\[150\\]');
      if (modal) modal.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // 5.4. Click "Xưởng Phim Tự Động (Auto-Pilot)"
    console.log('5.4. Click "Xưởng Phim Tự Động (Auto-Pilot)"...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Xưởng Phim Tự Động'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'scripts/test_sidebar_autopilot.png' });
    console.log('Đã mở Xưởng Phim Tự Động modal. Ảnh chụp: scripts/test_sidebar_autopilot.png');
    // Đóng modal
    await page.evaluate(() => {
      const modal = document.querySelector('div.fixed.inset-0.z-\\[150\\]');
      if (modal) modal.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // 5.5. Click "Bật chế độ Livestream Obs"
    console.log('5.5. Click "Bật chế độ Livestream Obs"...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Bật chế độ Livestream'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'scripts/test_sidebar_live_mode.png' });
    console.log('Đã kích hoạt chế độ Live Stream. Ảnh chụp: scripts/test_sidebar_live_mode.png');

    console.log('\n=== KẾT THÚC KIỂM THỬ SIDEBAR THÀNH CÔNG ===');
    await browser.close();

  } catch (err) {
    console.error('Lỗi chạy kiểm thử sidebar:', err.message);
  }
})();
