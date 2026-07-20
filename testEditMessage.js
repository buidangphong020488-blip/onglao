/**
 * testEditMessage.js - v4
 * Chuyển sang session có tin nhắn, hover bubble, click edit pencil, verify F5
 */
const puppeteer = require('puppeteer-core');
const SCREENSHOT_DIR = 'C:\\Users\\Lenovo-03\\.gemini\\antigravity\\brain\\20e4c6b3-5a0b-4c5f-8a97-daaf5dc066b2\\scratch';

async function sc(page, name) {
  await page.screenshot({ path: `${SCREENSHOT_DIR}\\${name}.png`, fullPage: false });
  console.log(`  📸 ${name}.png`);
}
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  try {
    const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
    const pages = await browser.pages();
    let page = pages.find(p => p.url().includes('localhost:3013'));
    if (!page) { page = await browser.newPage(); await page.goto('http://localhost:3013', { waitUntil: 'networkidle2' }); }
    else await page.bringToFront();
    await page.setViewport({ width: 1440, height: 900 });
    await wait(1500);

    // Đóng panel phải nếu mở
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        const rect = b.getBoundingClientRect();
        if (rect.x > 740 && rect.y < 80 && rect.width < 50) b.click();
      });
    });
    await wait(500);

    // ── Bước 1: Mở sidebar trái, chuyển sang session có tin nhắn ─────────────
    console.log('📂 Mở sidebar và chọn session có tin nhắn (724ed499)...');
    // Click nút hamburger để mở sidebar
    const hamburger = await page.$('button[aria-label], button:has(svg)');
    await page.evaluate(() => {
      // Tìm button menu/hamburger
      const btns = Array.from(document.querySelectorAll('button'));
      const menu = btns.find(b => {
        const rect = b.getBoundingClientRect();
        return rect.x < 80 && rect.y < 80 && rect.width > 0;
      });
      if (menu) menu.click();
    });
    await wait(700);
    await sc(page, 'v4_01_sidebar_open');

    // Tìm session trong sidebar có nhiều tin nhắn (theo localStorage)
    const targetSessionId = await page.evaluate(() => localStorage.getItem('onglao_last_session_id'));
    console.log('  Last session:', targetSessionId?.substring(0, 8));

    // Tìm và click vào session trong sidebar (session button)
    const sessionClicked = await page.evaluate((sessionId) => {
      const btns = Array.from(document.querySelectorAll('div[class]'));
      // Tìm div session item
      const sessionItems = btns.filter(d => {
        const rect = d.getBoundingClientRect();
        return rect.x < 280 && rect.y > 550 && rect.width > 100 && rect.height > 30 && rect.height < 100;
      });
      // Click session thứ 4 (có 12 tin nhắn - 724ed499)
      if (sessionItems.length >= 4) {
        const item = sessionItems[3];
        const rect = item.getBoundingClientRect();
        // Tìm clickable element bên trong
        const clickable = item.querySelector('button') || item;
        clickable.click();
        return { x: Math.round(rect.x), y: Math.round(rect.y), text: item.textContent?.substring(0, 40) };
      }
      return null;
    }, targetSessionId);
    console.log('  Clicked session:', JSON.stringify(sessionClicked));
    await wait(1500);

    // Đóng sidebar
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        const rect = b.getBoundingClientRect();
        if (rect.x > 240 && rect.x < 320 && rect.y < 80 && rect.width < 50) b.click();
      });
    });
    await wait(600);
    await sc(page, 'v4_02_session_selected');

    // ── Bước 2: Tìm bubble tin nhắn ──────────────────────────────────────────
    console.log('\n💬 Phân tích DOM để tìm bubble...');
    const allDom = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*'))
        .filter(el => {
          const rect = el.getBoundingClientRect();
          const text = el.textContent?.trim() || '';
          return rect.width > 50 && rect.width < 900 && rect.height > 10 &&
                 rect.height < 250 && rect.y > 0 && rect.y < 900 &&
                 text.length > 8 && text.length < 400 &&
                 el.children.length === 0 && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE';
        })
        .map(el => {
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            text: el.textContent?.trim()?.substring(0, 80),
            cls: el.className?.toString()?.substring(0, 80),
            x: Math.round(rect.x), y: Math.round(rect.y),
          };
        })
        .filter(e => {
          const t = e.text || '';
          const blacklist = ['Tạo cuộc', 'Kịch bản', 'Livestream', 'Kệ Pháp', 'tĩnh tâm',
            'Hướng dẫn', 'Phát toàn', 'Tải MP3', 'Lão Hoa', 'Giác Ngộ', 'Đối hình',
            'Đăng xuất', 'Cuoc dam', 'Auto-Pilot', 'Sửa Profile', 'EDITED_', 'TEST_EDIT'];
          return !blacklist.some(b => t.includes(b));
        })
        .slice(0, 20);
    });
    console.log('  All text elements:');
    allDom.forEach(d => console.log(`    [${d.tag}] (${d.x},${d.y}) "${d.text?.substring(0, 70)}"`));

    // Lọc tìm bubble thực sự (trong vùng chat giữa)
    const chatBubbles = allDom.filter(d => d.y > 50 && d.y < 800);
    if (chatBubbles.length === 0) {
      console.log('  ⚠ Không tìm thấy bubble. Xem screenshot và thử lại.');
      await sc(page, 'v4_debug');
      browser.disconnect(); return;
    }

    const target = chatBubbles[chatBubbles.length - 1];
    console.log(`\n  → Target: "${target.text?.substring(0, 60)}" tại (${target.x}, ${target.y})`);

    // ── Bước 3: Hover để hiện nút edit ───────────────────────────────────────
    await page.mouse.move(target.x + 20, target.y + 5);
    await wait(800);
    await sc(page, 'v4_03_hovered');

    // Tìm nút có Pencil SVG (Lucide pencil path bắt đầu bằng "M 17 3 a")
    const pencilBtns = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button'))
        .filter(b => {
          if (b.getBoundingClientRect().width === 0) return false;
          const svgHtml = b.querySelector('svg')?.outerHTML || '';
          return svgHtml.includes('17 3') || svgHtml.includes('pencil') ||
                 svgHtml.includes('2 22') || b.title?.includes('ửa') || b.title?.includes('dit');
        })
        .map(b => {
          const rect = b.getBoundingClientRect();
          return { x: Math.round(rect.x + rect.width/2), y: Math.round(rect.y + rect.height/2), title: b.title };
        });
    });
    console.log('  Pencil buttons:', JSON.stringify(pencilBtns));

    if (pencilBtns.length === 0) {
      console.log('  ✗ Không có pencil button sau hover - thử click trực tiếp vào bubble');
      await page.mouse.click(target.x + 20, target.y + 5);
      await wait(600);
      await sc(page, 'v4_03b_clicked');
      browser.disconnect(); return;
    }

    const pencil = pencilBtns[0];
    console.log(`  → Click pencil (${pencil.x}, ${pencil.y})`);
    await page.mouse.click(pencil.x, pencil.y);
    await wait(600);
    await sc(page, 'v4_04_edit_mode');

    // Chọn all + gõ mới
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');
    const editedText = `EDIT_TEST_${Date.now().toString().slice(-5)}`;
    await page.keyboard.type(editedText);
    await wait(300);
    await sc(page, 'v4_05_typed');
    console.log(`  ✔ Typed: "${editedText}"`);

    await page.keyboard.press('Enter');
    await wait(1000);
    await sc(page, 'v4_06_saved');

    // ── F5 ────────────────────────────────────────────────────────────────────
    console.log('\n🔄 F5...');
    await page.reload({ waitUntil: 'networkidle2' });
    await wait(5000);
    await sc(page, 'v4_07_after_f5');

    const found = await page.evaluate(txt => document.body.innerText.includes(txt), editedText);
    console.log('\n═══════════════════════════════════════');
    console.log(`  "${editedText}" sau F5: ${found ? '✅ CÒN - DB OK!' : '❌ MẤT!'}`);
    console.log('═══════════════════════════════════════');

    browser.disconnect();
  } catch(err) { console.error('❌', err.message); }
})();
