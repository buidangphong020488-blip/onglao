/**
 * testChatPersist.js
 * Kiểm tra:
 * 1. Gửi tin nhắn → đợi AI trả lời
 * 2. Lấy sessionId hiện tại + số tin nhắn
 * 3. F5 (reload)
 * 4. Kiểm tra session cũ có được khôi phục không
 * 5. Kiểm tra số tin nhắn có giữ nguyên không
 */
const puppeteer = require('puppeteer-core');

const SCREENSHOT_DIR = 'C:\\Users\\Lenovo-03\\.gemini\\antigravity\\brain\\20e4c6b3-5a0b-4c5f-8a97-daaf5dc066b2\\scratch';

async function screenshot(page, name) {
  const p = `${SCREENSHOT_DIR}\\${name}.png`;
  await page.screenshot({ path: p, fullPage: false });
  console.log(`  📸 Screenshot: ${name}.png`);
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  try {
    console.log('🔌 Kết nối Chrome 9222...');
    const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
    const pages = await browser.pages();
    let page = pages.find(p => p.url().includes('localhost:3013'));

    if (!page) {
      console.log('  → Mở tab mới localhost:3013...');
      page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto('http://localhost:3013', { waitUntil: 'networkidle2' });
    } else {
      console.log('  → Tab đã mở, bring to front...');
      await page.bringToFront();
    }

    await wait(2000);

    // ── BƯỚC 1: Lấy trạng thái TRƯỚC KHI gửi tin ─────────────────────────────
    console.log('\n📋 BƯỚC 1: Lấy trạng thái trước...');
    const stateBefore = await page.evaluate(() => {
      const sessionId = localStorage.getItem('onglao_last_session_id');
      const lastMsg = document.querySelectorAll('[data-role="ai"], [class*="message"], [class*="bubble"]');
      // Lấy text từ tất cả tin nhắn hiển thị
      const msgTexts = Array.from(document.querySelectorAll('p, div'))
        .filter(el => el.getAttribute('data-msg') || el.closest('[data-msg]'))
        .map(el => el.textContent?.substring(0, 50))
        .filter(Boolean);
      return {
        sessionId,
        msgCount: lastMsg.length,
        url: window.location.href
      };
    });
    console.log('  Session ID trong localStorage:', stateBefore.sessionId?.substring(0, 8) + '...');

    // ── BƯỚC 2: Gửi 1 tin nhắn test ───────────────────────────────────────────
    console.log('\n📤 BƯỚC 2: Gửi tin nhắn test...');
    const inputSel = 'input[placeholder*="thỉnh"], textarea[placeholder*="thỉnh"], input[placeholder*="muốn"]';
    await page.waitForSelector(inputSel, { timeout: 5000 }).catch(() => {});
    const input = await page.$(inputSel);

    const testMsg = `test_${Date.now()}`;
    if (input) {
      await page.click(inputSel);
      await wait(300);
      await page.type(inputSel, testMsg);
      await screenshot(page, '01_before_send');
      await page.keyboard.press('Enter');
      console.log(`  ✔ Đã gửi: "${testMsg}"`);
    } else {
      console.log('  ✗ Không tìm thấy input box!');
      await screenshot(page, '01_no_input');
    }

    // ── BƯỚC 3: Đợi AI trả lời ────────────────────────────────────────────────
    console.log('\n⏳ BƯỚC 3: Đợi AI trả lời (15s)...');
    await wait(15000);
    await screenshot(page, '02_after_ai_reply');

    // ── BƯỚC 4: Đọc sessionId + số msg từ React state (qua localStorage) ──────
    console.log('\n📊 BƯỚC 4: Đọc trạng thái SAU KHI AI trả lời...');
    const stateAfter = await page.evaluate(() => {
      const sessionId = localStorage.getItem('onglao_last_session_id');
      // Đếm số bubble tin nhắn hiển thị trên màn hình
      const bubbles = document.querySelectorAll('[class*="message"], [class*="bubble"], [data-msg]');
      return { sessionId, bubbleCount: bubbles.length };
    });
    console.log('  Session ID:', stateAfter.sessionId?.substring(0, 8) + '...');
    console.log('  Bubble count trên màn hình:', stateAfter.bubbleCount);

    // ── BƯỚC 5: F5 (RELOAD) ───────────────────────────────────────────────────
    console.log('\n🔄 BƯỚC 5: F5 reload trang...');
    await page.reload({ waitUntil: 'networkidle2' });
    await wait(3000);
    await screenshot(page, '03_after_f5');

    // ── BƯỚC 6: Kiểm tra sau F5 ───────────────────────────────────────────────
    console.log('\n🔍 BƯỚC 6: Kiểm tra sau F5...');
    const stateAfterF5 = await page.evaluate(() => {
      const sessionId = localStorage.getItem('onglao_last_session_id');
      const bubbles = document.querySelectorAll('[class*="message"], [class*="bubble"], [data-msg]');
      return { sessionId, bubbleCount: bubbles.length };
    });
    console.log('  Session ID sau F5:', stateAfterF5.sessionId?.substring(0, 8) + '...');
    console.log('  Bubble count sau F5:', stateAfterF5.bubbleCount);

    // Đợi thêm để messages load từ DB
    console.log('\n⏳ Đợi 5s cho messages load từ DB...');
    await wait(5000);
    await screenshot(page, '04_after_f5_loaded');

    // Đọc lại sau khi load xong
    const stateLoaded = await page.evaluate((testMsg) => {
      const sessionId = localStorage.getItem('onglao_last_session_id');
      const bubbles = document.querySelectorAll('[class*="message"], [class*="bubble"], [data-msg]');
      // Tìm xem có tin nhắn test trên màn hình không
      const allText = document.body.innerText;
      const testFound = allText.includes(testMsg);
      return { sessionId, bubbleCount: bubbles.length, testMsgFound: testFound };
    }, testMsg);

    console.log('\n═══════════════════════════════════════');
    console.log('📊 KẾT QUẢ KIỂM TRA:');
    console.log('═══════════════════════════════════════');
    const sessionOk = stateAfter.sessionId === stateLoaded.sessionId;
    console.log(`  Session ID khớp:   ${sessionOk ? '✅' : '❌'} ${stateAfter.sessionId?.substring(0,8)} → ${stateLoaded.sessionId?.substring(0,8)}`);
    console.log(`  Tin nhắn test tìm thấy: ${stateLoaded.testMsgFound ? '✅' : '❌'}`);
    console.log(`  Bubble count: Trước F5=${stateAfter.bubbleCount}, Sau F5=${stateLoaded.bubbleCount}`);
    if (!sessionOk) {
      console.log('\n  ⚠ SESSION THAY ĐỔI SAU F5 → Nguyên nhân mất tin nhắn!');
    }
    if (!stateLoaded.testMsgFound) {
      console.log('\n  ⚠ TIN NHẮN KHÔNG HIỂN THỊ SAU F5 → Có thể chưa load từ DB hoặc session sai!');
    }
    console.log('═══════════════════════════════════════');

    browser.disconnect();
    console.log('\n✅ Test hoàn thành. Xem screenshots trong scratch/');
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  }
})();
