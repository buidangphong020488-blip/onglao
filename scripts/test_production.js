const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('=== KHỞI CHẠY KIỂM THỬ TRÊN PRODUCTION: https://onglao.giac.ngo/ ===\n');

  const browser = await puppeteer.launch({
    headless: true, // Chạy ở chế độ ẩn danh trên server/terminal
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Lắng nghe console log từ trang web
    page.on('console', msg => {
      console.log(`[BROWSER LOG - ${msg.type().toUpperCase()}]: ${msg.text()}`);
    });

    // Lắng nghe lỗi JavaScript chưa được catch
    page.on('pageerror', err => {
      console.error('[BROWSER ERROR]:', err.message);
    });

    // Lắng nghe phản hồi mạng để debug lỗi Server Action hoặc API
    page.on('response', async response => {
      const status = response.status();
      const url = response.url();
      if (status >= 400) {
        console.error(`[MẠNG LỖI ${status}]: ${url}`);
        try {
          const text = await response.text();
          console.error(`[PHẢN HỒI LỖI]: ${text.slice(0, 500)}`);
        } catch (e) {}
      } else if (url.includes('onglao.giac.ngo') && response.request().method() === 'POST') {
        // Log các request POST thành công để theo dõi
        console.log(`[MẠNG POST ${status}]: ${url}`);
        try {
          const text = await response.text();
          console.log(`[PHẢN HỒI POST]: ${text.slice(0, 300)}`);
        } catch (e) {}
      }
    });

    // ── 1. Điều hướng đến trang chủ ──
    console.log('1. Đang truy cập trang chủ...');
    await page.goto('https://onglao.giac.ngo/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Chụp ảnh màn hình ngay lập tức để kiểm tra giao diện ban đầu
    await page.screenshot({ path: 'scripts/prod_initial_load.png' });
    console.log('Đã chụp ảnh màn hình ban đầu tại scripts/prod_initial_load.png');

    // Chờ màn hình chào vẽ xong và React mount hiển thị form đăng nhập
    console.log('Đang chờ React mount và hiển thị form đăng nhập...');
    await page.waitForSelector('input[type="email"]', { timeout: 20000 });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.screenshot({ path: 'scripts/prod_step1_welcome.png' });
    console.log('Đã chụp ảnh màn hình chào tại scripts/prod_step1_welcome.png');

    // Bypass tutorial nếu có
    await page.evaluate(() => {
      localStorage.setItem('taman_has_seen_tutorial', 'true');
      localStorage.setItem('onglao_subscribed', 'true');
    });

    // ── 3. Nhập tài khoản ──
    console.log('4. Nhập tài khoản demo@giac.ngo / password...');
    const emailEl = await page.$('input[type="email"]');
    await emailEl.click({ clickCount: 3 });
    await emailEl.type('demo@giac.ngo');

    const passEl = await page.$('input[type="password"]');
    await passEl.click({ clickCount: 3 });
    await passEl.type('password');

    await page.screenshot({ path: 'scripts/prod_step2_filled_form.png' });
    console.log('Đã chụp ảnh điền form tại scripts/prod_step2_filled_form.png');

    // ── 4. Click nút Đăng nhập trong form ──
    console.log('5. Click nút Submit Đăng nhập...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) btn.click();
    });

    // Chờ 5 giây xem phản hồi mạng hoặc lỗi hiển thị trên màn hình
    console.log('6. Đang chờ phản hồi đăng nhập từ server...');
    await new Promise(r => setTimeout(r, 5000));

    await page.screenshot({ path: 'scripts/prod_step3_after_submit.png' });
    console.log('Đã chụp ảnh kết quả sau khi đăng nhập tại scripts/prod_step3_after_submit.png');

    // Kiểm tra xem đã đăng nhập thành công hay chưa bằng cách kiểm tra nút "Vào thiền đường"
    const loggedIn = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Vào thiền đường'));
      return !!btn;
    });

    if (loggedIn) {
      console.log('Đăng nhập thành công! Đang bấm "Vào thiền đường"...');
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Vào thiền đường'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: 'scripts/prod_step4_thienduang.png' });
      console.log('Đã vào thiền đường thành công! Chụp ảnh tại scripts/prod_step4_thienduang.png');
    } else {
      console.log('Đăng nhập thất bại hoặc không xuất hiện nút "Vào thiền đường".');
    }

  } catch (err) {
    console.error('Lỗi chạy kiểm thử:', err);
  } finally {
    await browser.close();
    console.log('\n=== KẾT THÚC KIỂM THỬ ===');
  }
})();
