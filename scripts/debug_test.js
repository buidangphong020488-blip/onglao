const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('=== DEBUG TEST ===\n');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
    slowMo: 50
  });

  const page = await browser.newPage();

  // ── Bước 1: Admin ──
  console.log('1. Vào Admin...');
  await page.goto('http://localhost:3013/admin');
  await page.waitForSelector('input[placeholder="Tài khoản"]');
  await page.type('input[placeholder="Tài khoản"]', 'admin');
  await page.type('input[placeholder="Mật khẩu"]', 'admin@123');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Vào cấu hình'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'scripts/shot_01_admin.png', fullPage: true });
  console.log('  Screenshot: shot_01_admin.png');

  // ── Bước 2: Trang chủ + bypass tutorial ──
  console.log('2. Về trang chủ...');
  await page.goto('http://localhost:3013');
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    localStorage.setItem('onglao_subscribed', 'true');
  });
  await page.screenshot({ path: 'scripts/shot_02_home.png', fullPage: false });
  console.log('  Screenshot: shot_02_home.png');

  // ── Bước 3: Click Đăng nhập ──
  console.log('3. Click Đăng nhập...');
  const clicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().includes('Đăng nhập'));
    if (btn) { btn.click(); return true; }
    return false;
  });
  console.log('  Nút Đăng nhập tìm thấy:', clicked);
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'scripts/shot_03_auth_modal.png', fullPage: false });
  console.log('  Screenshot: shot_03_auth_modal.png');

  // ── Bước 4: Nhập email/pass ──
  console.log('4. Nhập email/pass...');
  const emailInput = await page.$('input[type="email"]');
  if (emailInput) {
    await emailInput.click({ clickCount: 3 });
    await emailInput.type('demo@giac.ngo');
  }
  const passInput = await page.$('input[type="password"]');
  if (passInput) {
    await passInput.click({ clickCount: 3 });
    await passInput.type('password');
  }
  // Submit
  await page.evaluate(() => {
    const btn = document.querySelector('button[type="submit"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 5000)); // Chờ login
  await page.screenshot({ path: 'scripts/shot_04_after_login.png', fullPage: false });
  console.log('  Screenshot: shot_04_after_login.png');

  // ── Bước 5: Kiểm tra trạng thái sau login ──
  console.log('5. Kiểm tra DOM sau login...');
  const domInfo = await page.evaluate(() => {
    const allBtns = Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim().slice(0, 30));
    const allInputs = Array.from(document.querySelectorAll('input')).map(i => ({
      type: i.type,
      placeholder: i.placeholder?.slice(0, 40),
      dataTut: i.closest('[data-tutorial]')?.getAttribute('data-tutorial')
    }));
    const tutInput = document.querySelector('[data-tutorial="tut-input"]');
    const hasEntered = !!tutInput;
    return { buttons: allBtns.filter(t => t.length > 0).slice(0, 15), inputs: allInputs, hasMainScreen: hasEntered };
  });
  console.log('  Buttons:', JSON.stringify(domInfo.buttons));
  console.log('  Inputs:', JSON.stringify(domInfo.inputs));
  console.log('  Màn hình chính hiển thị (tut-input):', domInfo.hasMainScreen);

  // ── Bước 6: Nếu cần "Vào thiền đường" ──
  if (!domInfo.hasMainScreen) {
    console.log('6. Tìm nút Vào thiền đường...');
    const entered = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Vào thiền đường'));
      if (btn) { btn.click(); return true; }
      return false;
    });
    console.log('  Nút Vào thiền đường:', entered);
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: 'scripts/shot_06_entered.png', fullPage: false });
    console.log('  Screenshot: shot_06_entered.png');

    // Kiểm tra lại DOM
    const domInfo2 = await page.evaluate(() => {
      const tutInput = document.querySelector('[data-tutorial="tut-input"]');
      const allInputs = Array.from(document.querySelectorAll('input')).map(i => ({
        placeholder: i.placeholder?.slice(0, 40),
        dataTut: i.closest('[data-tutorial]')?.getAttribute('data-tutorial')
      }));
      const allBtns = Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim().slice(0, 30)).filter(t => t.length > 0);
      return { hasMainScreen: !!tutInput, inputs: allInputs, buttons: allBtns.slice(0, 15) };
    });
    console.log('  Sau Vào thiền đường - hasMainScreen:', domInfo2.hasMainScreen);
    console.log('  Buttons:', JSON.stringify(domInfo2.buttons));
    console.log('  Inputs:', JSON.stringify(domInfo2.inputs));
  }

  // ── Bước 7: Gõ và gửi tin nhắn ──
  console.log('7. Gõ tin nhắn...');
  const inputHandle = await page.$('[data-tutorial="tut-input"] input');
  if (inputHandle) {
    await inputHandle.click();
    await page.keyboard.type('Con chao Lao, hom nay Lao the nao?');
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(() => {
      const wrapper = document.querySelector('[data-tutorial="tut-input"]');
      if (wrapper) {
        const btns = Array.from(wrapper.querySelectorAll('button'));
        const last = btns[btns.length - 1];
        if (last) last.click();
      }
    });
    console.log('  Đã gửi tin nhắn!');
    await page.screenshot({ path: 'scripts/shot_07_sent.png', fullPage: false });
  } else {
    console.log('  KHÔNG TÌM THẤY input trong tut-input!');
  }

  console.log('\n8. Đợi 25 giây để Lão trả lời và TTS phát...');
  await new Promise(r => setTimeout(r, 25000));
  await page.screenshot({ path: 'scripts/shot_08_response.png', fullPage: false });
  console.log('  Screenshot: shot_08_response.png');

  console.log('\n=== DEBUG XONG — Giữ Chrome mở ===');
})();
