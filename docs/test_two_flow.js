/**
 * TEST 2 LUỒNG ONGLAO — Phiên bản đã fix đúng selector
 * Dựa trên DOM inspect thực tế:
 * - Trang chính = /createvideo (đã có sẵn VideoCreatorModal)
 * - Mở AI Director = click nút "Quản lý Kịch bản Đạo diễn"
 * - Render = click "Bắt Đầu Render Video"
 * - BGM = select "Đường Hằng An (Tone Nam)"
 * - Logo = upload qua "Chọn Logo" → file input
 * - Format = select "MP4 (.mp4 - Phổ thông)"
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3013';
const REPORT_PATH = path.join(__dirname, 'test_report.md');
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

const TOPIC = 'bé béo nói bé không được vui';
const LOGO_PATH = 'C:\\APP\\OngLao\\public\\logo.jpg';

const MANUAL_SCRIPT = `Lão [hook]: Ủa, nghe nói có đứa béo mà còn không chịu vui, ngồi đây Lão coi thử cái bệnh gì vậy ta?
Con [sad]: Dạ Lão ơi, bé bị người ta chê là béo hoài, bé buồn lắm, bé không thấy mình xứng đáng được vui.
Lão [calm]: Con à, cái "béo" đó là do mắt người ta nhìn hay do tâm con chấp nhận?
Con [sad]: Dạ... bé cũng không biết nữa. Nhưng nghe hoài rồi bé tin thiệt.
Lão [calm]: Nghe nhiều thì tin. Đó là bệnh của cái tâm chấp nhận lời người khác làm thật. Cái thân này là mượn dùng, không phải bản thể của con.
Con [joy]: Dạ, vậy bé không cần buồn vì cái thân nữa sao Lão?
Lão [joy]: Lành thay! Bé béo hay bé ốm đều là tướng tạm. Cái vui thật không nằm ở số ký, mà nằm ở chỗ con biết mình là ai.`;

function log(msg) {
  const now = new Date().toLocaleTimeString('vi-VN');
  console.log(`[${now}] ${msg}`);
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForText(page, text, timeout = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const found = await page.evaluate(t => document.body.innerText.includes(t), text);
    if (found) return true;
    await sleep(1500);
  }
  return false;
}

async function waitForToast(page, textMatch, timeout = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const toastText = await page.evaluate(() => {
      const el = document.querySelector('.fixed.top-6.right-6') || document.body;
      return el ? el.textContent : '';
    });
    if (toastText && toastText.includes(textMatch)) {
      return true;
    }
    await sleep(1000);
  }
  return false;
}

async function clickBtn(page, textMatch, timeout = 15000) {
  const start = Date.now();
  let lastState = null;
  while (Date.now() - start < timeout) {
    const clicked = await page.evaluate((txt) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => {
         const t = b.textContent.replace(/\s+/g, ' ').trim();
         return t.includes(txt) && !b.disabled && b.offsetHeight > 0;
      });
      if (btn) { btn.click(); return { success: btn.textContent.trim() }; }
      
      const fallback = btns.find(b => b.innerHTML.includes(txt) && !b.disabled && b.offsetHeight > 0);
      if (fallback) { fallback.click(); return { success: 'fallback' }; }
      
      const disabledBtn = btns.find(b => b.textContent.includes(txt));
      if (disabledBtn) return { found: true, disabled: disabledBtn.disabled, hidden: disabledBtn.offsetHeight === 0 };
      
      return null;
    }, textMatch);
    if (clicked && clicked.success) return clicked.success;
    if (clicked) lastState = clicked;
    await sleep(500);
  }
  console.log(`[clickBtn] Timeout cho nút "${textMatch}". Trạng thái cuối:`, lastState);
  return null;
}

// ─── SETUP: Mở trang createvideo ───
async function gotoCreateVideo(page) {
  await page.goto(`${BASE_URL}/createvideo`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(4000);
  await handleLoginIfRequired(page);
}

// ─── Mở VideoCreatorModal bằng cách set localStorage rồi về trang chủ ───
async function openVideoCreatorModal(page) {
  // Set localStorage để modal tự mở khi trang load
  await page.evaluate(() => {
    localStorage.setItem('onglao_show_video_export_modal', 'true');
  });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(3000);
  await handleLoginIfRequired(page);
  // Chờ modal xuất hiện
  const appeared = await waitForText(page, 'Bắt Đầu Render', 25000);
  if (!appeared) {
    // Fallback: click Tạo video trên script cuối cùng nếu có audio
    log('[openVideoCreatorModal] Modal chưa xuất hiện qua localStorage, thử click sidebar...');
    await openSidebar(page);
    await clickBtn(page, 'Quản lý Kịch bản Đạo diễn').catch(() => {});
    await sleep(2000);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.trim().includes('Tạo video'));
      if (btns.length > 0) btns[btns.length - 1].click();
    });
    await sleep(3000);
  }
  return appeared;
}

// ─── Cài BGM: Đường Hằng An ───
async function setBgm(page) {
  const ok = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const bgmSelect = selects.find(s =>
      Array.from(s.options).some(o => o.text.includes('Đường Hằng An') || o.text.includes('Suối Chảy'))
    );
    if (!bgmSelect) return false;
    const opt = Array.from(bgmSelect.options).find(o => o.text.includes('Đường Hằng An'));
    if (!opt) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    setter.call(bgmSelect, opt.value);
    bgmSelect.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  });
  return ok;
}

// ─── Cài format MP4 ───
async function setFormatMp4(page) {
  return page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const fmtSelect = selects.find(s =>
      Array.from(s.options).some(o => o.text.includes('MP4') || o.text.includes('.mp4'))
    );
    if (!fmtSelect) return false;
    const mp4Opt = Array.from(fmtSelect.options).find(o => o.text.includes('MP4'));
    if (!mp4Opt) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    setter.call(fmtSelect, mp4Opt.value);
    fmtSelect.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  });
}

// ─── Chọn nhân vật ───
async function selectCharacter(page) {
  return page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const charSelect = selects.find(s => 
      Array.from(s.options).some(o => o.text.includes('-- Chọn Bộ Cảnh --')) ||
      (s.previousElementSibling && s.previousElementSibling.textContent.includes('Kho cảnh quay'))
    );
    if (!charSelect) return false;
    const validOpts = Array.from(charSelect.options).filter(o => o.value !== '');
    if (validOpts.length === 0) return false;
    let targetOpt = validOpts.find(o => o.value.includes('|ngang')) || validOpts[0];
    const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    setter.call(charSelect, targetOpt.value);
    charSelect.dispatchEvent(new Event('change', { bubbles: true }));
    return targetOpt.text;
  });
}

// ─── Upload logo ───
async function uploadLogo(page) {
  if (!fs.existsSync(LOGO_PATH)) { log('⚠️ logo.jpg không tồn tại'); return false; }
  try {
    // Click "Chọn Logo" để trigger file input
    await clickBtn(page, 'Chọn Logo');
    await sleep(500);
    const fileInputs = await page.$$('input[type="file"]');
    // Thử từng file input (logo thường là input đầu tiên hoặc có accept image)
    for (const inp of fileInputs) {
      try {
        const accept = await inp.evaluate(el => el.accept || '');
        if (!accept || accept.includes('image') || accept.includes('*')) {
          await inp.uploadFile(LOGO_PATH);
          await sleep(1000);
          log('✅ Uploaded logo.jpg');
          return true;
        }
      } catch {}
    }
    return false;
  } catch (e) {
    log(`⚠️ Upload logo lỗi: ${e.message}`);
    return false;
  }
}

// ─── Đảm bảo sidebar đã mở ───
async function openSidebar(page) {
  log('Đang kiểm tra và mở sidebar...');
  const opened = await page.evaluate(() => {
    const sidebar = Array.from(document.querySelectorAll('aside')).find(a => a.textContent.includes('Danh sách đàm đạo'));
    if (sidebar) return true;
    const menuBtn = document.querySelector('button[data-tutorial="tut-menu"]') || 
                    Array.from(document.querySelectorAll('button')).find(b => b.querySelector('svg') && (b.innerHTML.includes('Menu') || b.innerHTML.includes('lucide-menu')));
    if (menuBtn) {
      menuBtn.click();
      return true;
    }
    return false;
  });
  await sleep(2000);
  return opened;
}

// ─── Mở AI Director Manager Modal ───
async function openAiDirectorManager(page) {
  await openSidebar(page);

  log('Click "Quản lý Kịch bản Đạo diễn"...');
  const clicked = await clickBtn(page, 'Quản lý Kịch bản Đạo diễn');
  if (!clicked) return false;
  await sleep(3000);

  // Kiểm tra modal đã mở chưa (có nút mới xuất hiện trong modal)
  const modalOpen = await page.evaluate(() => {
    // Để chính xác, kiểm tra xem div chứa modal có hiển thị không
    return document.body.innerText.includes('Quản Lý Kịch Bản Đạo Diễn') || 
           document.body.innerText.includes('Danh sách kịch bản');
  });
  return modalOpen;
}

// ─── Tìm nút mở creator trong manager ───
async function openCreatorInManager(page) {
  // Debug: in ra tất cả buttons hiện tại trong modal
  const allBtns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button'))
      .map(b => b.textContent.trim().substring(0, 50))
      .filter(t => t.length > 0);
  });
  log('Buttons hiện tại: ' + allBtns.slice(0, 20).join(' | '));

  // Tìm nút mở form tạo kịch bản mới
  const keywords = ['Tạo kịch bản mới', '+ Tạo', 'Tạo mới', 'Thêm kịch bản', 'Kịch bản AI mới'];
  for (const kw of keywords) {
    const clicked = await clickBtn(page, kw);
    if (clicked) {
      log(`Opened creator via: "${clicked}"`);
      await sleep(2000);
      return true;
    }
  }

  // Thử click nút Plus icon (nếu button chỉ có icon)
  const plusClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    // Tìm nút có SVG Plus hoặc text ngắn (+)
    const btn = btns.find(b => {
      const t = b.textContent.trim();
      return t === '+' || t === '' || (b.querySelector('svg') && t.length < 5);
    });
    if (btn) { btn.click(); return true; }
    return false;
  });

  if (plusClicked) { await sleep(2000); return true; }
  return false;
}

// ─── Tìm nút mở form nhập thủ công trong manager ───
async function openManualCreatorInManager(page) {
  const keywords = ['Nhập thủ công', 'Nhập kịch bản', 'Nhập tay'];
  for (const kw of keywords) {
    const clicked = await clickBtn(page, kw);
    if (clicked) {
      log(`Opened manual creator via: "${clicked}"`);
      await sleep(2000);
      return true;
    }
  }
  return false;
}

// ─── Render video ───
async function renderVideo(page, label) {
  log(`[${label}] Đang đưa trang lên phía trước để kích hoạt render mượt mà...`);
  await page.bringToFront();
  await sleep(1000);

  log(`[${label}] Click "Bắt Đầu Render Video"...`);
  const clicked = await clickBtn(page, 'Bắt Đầu Render Video');
  if (!clicked) return { ok: false, msg: 'Không click được Bắt Đầu Render Video' };

  log(`[${label}] Đang render... (tối đa 10 phút)`);
  const t0 = Date.now();
  let lastProgress = null;
  while (Date.now() - t0 < 600000) {
    await sleep(3000);
    // Đảm bảo trang luôn được kích hoạt, tránh Chrome đưa vào background sleep
    await page.bringToFront();
    
    // In thông tin debug của bộ render trong trình duyệt
    const debugState = await page.evaluate(() => {
      const exp = window._testExporter;
      if (!exp) return "Không tìm thấy window._testExporter";
      return {
        ctxState: exp.exportAudioCtx?.state,
        currentTime: exp.exportAudioCtx?.currentTime,
        recorderState: exp.mediaRecorder?.state,
        documentHidden: document.hidden,
        htmlStatus: document.getElementById('ai-moderator-status')?.innerText?.replace(/\n/g, ' | ')
      };
    });
    log(`[${label} Debug Exporter]: ${typeof debugState === 'string' ? debugState : JSON.stringify(debugState)}`);

    const state = await page.evaluate(() => {
      const txt = document.body.innerText;
      const pct = txt.match(/(\d+)\s*%/);
      return {
        progress: pct ? parseInt(pct[1]) : null,
        done: txt.includes('Tải xuống') || txt.includes('Hoàn tất') || txt.includes('Render xong'),
        error: txt.includes('thất bại') || txt.includes('Lỗi xuất') || txt.includes('render lỗi')
      };
    });
    if (state.progress !== null) {
      if (state.progress !== lastProgress) {
        log(`[${label}] Render: ${state.progress}%`);
        lastProgress = state.progress;
      }
    }
    if (state.done) return { ok: true, msg: `Render hoàn tất ✅` };
    if (state.error) return { ok: false, msg: 'Render thất bại ❌' };
  }
  return { ok: false, msg: 'Render timeout 10 phút' };
}

async function handleLoginIfRequired(page) {
  log('Kiểm tra nếu cần đăng nhập...');
  const needsLogin = await page.evaluate(() => {
    return document.body.innerText.includes('Đăng nhập Ông Lão');
  });
  if (needsLogin) {
    log('Phát hiện màn hình đăng nhập. Tiến hành đăng nhập...');
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const pwdInput = document.querySelector('input[type="password"]');
      if (emailInput && pwdInput) {
        emailInput.value = 'demo@giac.ngo';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        pwdInput.value = 'password';
        pwdInput.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      }
      return false;
    });
    await sleep(500);
    // Click submit button
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.type === 'submit' || b.textContent.includes('Đăng nhập'));
      if (btn) btn.click();
    });
    await sleep(4000);
    log('Đăng nhập hoàn tất.');
  } else {
    log('Đã đăng nhập hoặc không hiển thị modal.');
  }
}

// ─── ĐẢM BẢO MODAL ĐANG ĐÓNG TRÊN TRANG CHỦ ───
async function ensureModalClosedOnMainPage(page) {
  log('Đang kiểm tra và đóng VideoCreatorModal trên trang chủ...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(3000);
  await handleLoginIfRequired(page);
  const needReload = await page.evaluate(() => {
    if (localStorage.getItem('onglao_show_video_export_modal') === 'true') {
      localStorage.setItem('onglao_show_video_export_modal', 'false');
      return true;
    }
    return false;
  });
  if (needReload) {
    log('Đã cập nhật localStorage. Đang reload...');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await sleep(4000);
  }
  log('✅ Trang chủ sạch (modal đã đóng)');
}

// ═══════════════════════════════════════════
// LUỒNG 1: THỦ CÔNG → VIDEO
// ═══════════════════════════════════════════
async function testFlow1(page) {
  log('\n╔══════════════════════════════════╗');
  log('║  LUỒNG 1: KỊC  BẢN THỦ CÔNG      ║');
  log('╚══════════════════════════════════╝');
  const result = { status: 'FAIL', steps: [], duration: null };
  const t0 = Date.now();

  try {
    // 1. Đóng modal trên trang chủ trước
    await ensureModalClosedOnMainPage(page);
    result.steps.push('✅ Đóng VideoCreatorModal trên trang chủ OK');

    // 2. Mở AI Director Manager trên trang chủ
    const managerOpen = await openAiDirectorManager(page);
    result.steps.push(managerOpen ? '✅ Mở Quản lý Kịch bản OK' : '⚠️ Modal mở nhưng không confirm');
    await sleep(2000);

    // 3. Tìm nút mở form nhập kịch bản thủ công
    const manualOpen = await openManualCreatorInManager(page);
    result.steps.push(manualOpen ? '✅ Mở Nhập thủ công OK' : '⚠️ Không click được Nhập thủ công');

    // Chờ cho textarea xuất hiện (để chắc chắn modal đã chuyển sang view='edit' sau DB call)
    try {
      await page.waitForSelector('textarea', { timeout: 15000 });
      await sleep(1000);
    } catch (e) {
      log('⚠️ Timeout chờ textarea xuất hiện, thử tiếp tục...');
    }

    // 4. Tìm textarea và điền kịch bản
    const debugInputs = await page.evaluate(() => {
      return {
        textareas: Array.from(document.querySelectorAll('textarea')).map(t => ({
          placeholder: t.placeholder,
          visible: t.offsetWidth > 0 && t.offsetHeight > 0
        })),
        inputs: Array.from(document.querySelectorAll('input')).map(i => ({
          type: i.type,
          placeholder: i.placeholder,
          visible: i.offsetWidth > 0 && i.offsetHeight > 0
        })),
        innerText: document.body.innerText.substring(0, 1000)
      };
    });
    log('[Flow1 Debug Inputs]: ' + JSON.stringify(debugInputs));

    // 4. Điền kịch bản — dùng element handle, fallback nativeSetter nếu execution context bị destroy
    let filled = null;
    try {
      const areaHandle = await page.evaluateHandle(() =>
        Array.from(document.querySelectorAll('textarea')).find(a => a.offsetWidth > 0 && a.offsetHeight > 0)
      );
      const areaEl = areaHandle.asElement();
      if (areaEl) {
        filled = await areaEl.evaluate(el => el.placeholder ? el.placeholder.substring(0, 50) : 'visible-textarea');
        await areaEl.click();
        await sleep(300);
        await page.keyboard.down('Control');
        await page.keyboard.press('a');
        await page.keyboard.up('Control');
        await sleep(100);
        await page.keyboard.type(MANUAL_SCRIPT, { delay: 0 });
        await sleep(300);
      }
    } catch (ctxErr) {
      log('[Flow1] Element handle error (navigation?): ' + ctxErr.message + ' — fallback nativeSetter');
      await sleep(1500);
      filled = await page.evaluate((script) => {
        const area = Array.from(document.querySelectorAll('textarea')).find(a => a.offsetWidth > 0 && a.offsetHeight > 0);
        if (!area) return null;
        area.focus();
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeSetter.call(area, script);
        area.dispatchEvent(new InputEvent('input', { bubbles: true, data: script, inputType: 'insertText' }));
        area.dispatchEvent(new Event('change', { bubbles: true }));
        return area.placeholder ? area.placeholder.substring(0, 50) : 'visible-textarea';
      }, MANUAL_SCRIPT).catch(() => null);
    }
    result.steps.push(filled ? `✅ Điền kịch bản thủ công OK (placeholder: "${filled}")` : '❌ Không tìm thấy textarea script');
    if (!filled) throw new Error('Không tìm thấy textarea script');

    // 4.5. Bỏ qua Tạo tất cả Audio — lưu thẳng để tránh block save button
    result.steps.push('⚠️ Bỏ qua Tạo Audio (chạy nhanh để test luồng lưu)');

    // 5. Click Lưu/Import kịch bản — chờ nút enabled (có thể audio vẫn đang gen)
    await sleep(500);
    const importKeywords = ['Nhập kịch bản', 'Lưu kịch bản', 'Import', 'Xác nhận'];
    let saved = null;
    // Chờ tối đa 3 phút cho nút Lưu kịch bản được enable
    const saveStart = Date.now();
    while (!saved && Date.now() - saveStart < 180000) {
      for (const kw of importKeywords) {
        saved = await clickBtn(page, kw, 3000);
        if (saved) break;
      }
      if (!saved) {
        const elapsed = Math.round((Date.now() - saveStart) / 1000);
        if (elapsed % 20 === 0) log(`[Flow1] Chờ nút Lưu enabled... ${elapsed}s`);
        await sleep(2000);
      }
    }
    result.steps.push(saved ? `✅ Lưu kịch bản: "${saved}"` : '❌ Không tìm nút Lưu');
    if (!saved) throw new Error('Không tìm thấy nút Lưu kịch bản');
    await sleep(3000);

    // 6. Mở VideoCreatorModal bằng localStorage flag
    log('[Flow1] Mở VideoCreatorModal...');
    const modalOpened = await openVideoCreatorModal(page);
    result.steps.push(modalOpened ? '✅ Vào VideoCreatorModal OK' : '⚠️ Modal chưa hiện "Bắt Đầu Render"');

    // 8. Cài BGM (chờ panel render xuất hiện trước)
    await waitForText(page, 'Bắt Đầu Render', 20000).catch(() => {});
    const bgmOk = await setBgm(page);
    result.steps.push(bgmOk ? '✅ Chọn nhạc Đường Hằng An OK' : '⚠️ Không tìm select BGM');

    // 9. Upload logo
    const logoOk = await uploadLogo(page);
    result.steps.push(logoOk ? '✅ Upload logo.jpg OK' : '⚠️ Upload logo thất bại');

    // 10. Chọn format MP4
    const fmtOk = await setFormatMp4(page);
    result.steps.push(fmtOk ? '✅ Chọn format MP4 OK' : '⚠️ Không chọn được MP4');

    // 10.5. Chọn nhân vật
    const charOk = await selectCharacter(page);
    result.steps.push(charOk ? `✅ Chọn nhân vật OK (${charOk})` : '⚠️ Không chọn được nhân vật');
    await sleep(2000); // Chờ nhân vật load

    // 11. Render video
    const renderResult = await renderVideo(page, 'Flow1');
    result.steps.push(renderResult.ok ? `✅ ${renderResult.msg}` : `❌ ${renderResult.msg}`);

    result.status = renderResult.ok ? 'PASS' : 'PARTIAL';

  } catch (err) {
    log(`[Flow1] LỖI: ${err.message}`);
    result.steps.push(`❌ Lỗi: ${err.message}`);
    result.status = 'ERROR';
  }

  result.duration = `${((Date.now() - t0) / 1000).toFixed(1)}s`;
  log(`[Flow1] Kết thúc: ${result.status} — ${result.duration}`);
  return result;
}

// ═══════════════════════════════════════════
// LUỒNG 2: AI → VIDEO
// ═══════════════════════════════════════════
async function testFlow2(page) {
  log('\n╔══════════════════════════════════╗');
  log('║     LUỒNG 2: KỊC  BẢN AI          ║');
  log('╚══════════════════════════════════╝');
  const result = { status: 'FAIL', steps: [], duration: null };
  const t0 = Date.now();

  try {
    // 1. Đóng modal trên trang chủ trước
    await ensureModalClosedOnMainPage(page);
    result.steps.push('✅ Đóng VideoCreatorModal trên trang chủ OK');

    // 2. Mở AI Director Manager trên trang chủ
    const managerOpen = await openAiDirectorManager(page);
    result.steps.push(managerOpen ? '✅ Mở Quản lý Kịch bản OK' : '⚠️ Modal mở nhưng không confirm');
    await sleep(2000);

    // 3. Mở form tạo kịch bản AI
    const creatorOpen = await openCreatorInManager(page);
    result.steps.push(creatorOpen ? '✅ Mở form tạo kịch bản AI OK' : '⚠️ Không tìm thấy nút Tạo mới');
    await sleep(1000);

    // 4. Debug: in buttons hiện tại sau khi click
    const btnsAfter = await page.evaluate(() =>
      Array.from(document.querySelectorAll('button'))
        .map(b => b.textContent.trim().substring(0, 40))
        .filter(t => t.length > 0)
    );
    log('[Flow2] Buttons sau khi click creator: ' + btnsAfter.slice(0, 15).join(' | '));

    const textareasAfter = await page.evaluate(() =>
      Array.from(document.querySelectorAll('textarea'))
        .map(t => t.placeholder?.substring(0, 60) || '(no placeholder)')
    );
    log('[Flow2] Textareas: ' + textareasAfter.join(' | '));

    // 5. Điền chủ đề bằng element handle (giống Flow1) để React nhận đúng state
    let topicFilled = null;
    try {
      const topicHandle = await page.evaluateHandle(() => {
        return Array.from(document.querySelectorAll('textarea')).find(a => {
          const ph = (a.placeholder || '').toLowerCase();
          if (ph.includes('phong cách') || ph.includes('giọng')) return false;
          return ph.includes('buông bỏ') || ph.includes('phản bội') || ph.includes('chủ đề') ||
                 ph.includes('vướng mắc') || ph.includes('nỗi khổ') || ph.includes('vd:');
        });
      });
      const topicEl = topicHandle.asElement();
      if (topicEl) {
        topicFilled = await topicEl.evaluate(el => el.placeholder ? el.placeholder.substring(0, 50) : 'visible-textarea');
        await topicEl.click();
        await sleep(200);
        await page.keyboard.down('Control');
        await page.keyboard.press('a');
        await page.keyboard.up('Control');
        await sleep(100);
        await page.keyboard.type(TOPIC, { delay: 0 });
        await sleep(300);
      }
    } catch (ctxErr) {
      log('[Flow2] Element handle error: ' + ctxErr.message + ' — fallback nativeSetter');
      await sleep(1000);
      topicFilled = await page.evaluate((topic) => {
        const areas = Array.from(document.querySelectorAll('textarea'));
        const area = areas.find(a => {
          const ph = (a.placeholder || '').toLowerCase();
          if (ph.includes('phong cách') || ph.includes('giọng')) return false;
          return ph.includes('buông bỏ') || ph.includes('phản bội') || ph.includes('chủ đề') ||
                 ph.includes('vướng mắc') || ph.includes('nỗi khổ') || ph.includes('vd:');
        });
        if (!area) return null;
        area.focus();
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeSetter.call(area, topic);
        area.dispatchEvent(new InputEvent('input', { bubbles: true, data: topic, inputType: 'insertText' }));
        area.dispatchEvent(new Event('change', { bubbles: true }));
        return area.placeholder ? area.placeholder.substring(0, 50) : 'visible-textarea';
      }, TOPIC).catch(() => null);
    }

    result.steps.push(topicFilled ? `✅ Điền chủ đề OK (${topicFilled})` : '❌ Không tìm textarea chủ đề');
    if (!topicFilled) throw new Error('Không tìm thấy textarea chủ đề — xem log buttons/textareas bên trên');
    log(`[Flow2] Chủ đề: "${TOPIC}"`);

    // 6. Click Tạo đàm đạo
    await sleep(500);
    const genClicked = await clickBtn(page, 'Tạo đàm đạo');
    if (!genClicked) throw new Error('Không click được "Tạo đàm đạo"');
    result.steps.push('✅ Click Tạo đàm đạo OK');
    log('[Flow2] Chờ AI tạo kịch bản (tối đa 5 phút)...');

    // 7. Chờ AI xong — đếm số nút "Tạo video" tăng lên (script mới xuất hiện trong list)
    const beforeTaoVideo = await page.evaluate(() =>
      Array.from(document.querySelectorAll('button')).filter(b => b.textContent.trim().includes('Tạo video')).length
    );
    log(`[Flow2] Số nút "Tạo video" trước khi AI chạy: ${beforeTaoVideo}`);
    const t1 = Date.now();
    let aiDone = false;
    while (Date.now() - t1 < 600000) { // tối đa 10 phút
      await sleep(3000);
      const elapsed = Math.round((Date.now() - t1) / 1000);
      const state = await page.evaluate((before) => ({
        hasSaveBtn:   document.body.innerText.includes('Lưu kịch bản'),
        hasRetryBtn:  document.body.innerText.includes('Tạo lại'),
        noLoading:    !document.body.innerText.includes('Đang viết'),
        newScript:    Array.from(document.querySelectorAll('button')).filter(b => b.textContent.trim().includes('Tạo video')).length > before,
      }), beforeTaoVideo);
      if (elapsed % 15 === 0) log(`[Flow2] Chờ AI... ${elapsed}s | state: ${JSON.stringify(state)}`);
      if ((state.hasSaveBtn || state.hasRetryBtn) && state.noLoading) { aiDone = true; break; }
      if (state.newScript && state.noLoading && elapsed > 10) { aiDone = true; break; }
    }
    if (!aiDone) throw new Error('AI tạo kịch bản timeout');
    result.steps.push('✅ AI tạo kịch bản thành công');

    // 8. Lưu kịch bản AI
    await sleep(1000);
    const savedAI = await clickBtn(page, 'Lưu kịch bản');
    result.steps.push(savedAI ? '✅ Lưu kịch bản AI OK' : '⚠️ Không tìm nút Lưu kịch bản');
    await sleep(3000);

    // 8.5. Mở sửa kịch bản mới nhất để tạo giọng đọc
    log('[Flow2] Mở chỉnh sửa kịch bản mới nhất...');
    const editOpened = await page.evaluate(() => {
      const editBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Sửa'));
      if (editBtns.length > 0) {
        editBtns[0].click();
        return true;
      }
      return false;
    });
    if (!editOpened) throw new Error('Không mở được chỉnh sửa kịch bản vừa tạo');
    await sleep(2000);

    log('[Flow2] Click "Tạo tất cả Audio"...');
    const audioClicked = await clickBtn(page, 'Tạo tất cả Audio');
    if (audioClicked) {
      log('[Flow2] Đang chờ tạo tất cả audio (tối đa 5 phút)...');
      const audioGenerated = await waitForToast(page, 'Hoàn tất tạo');
      result.steps.push(audioGenerated ? '✅ Tạo tất cả Audio OK' : '⚠️ Tạo tất cả Audio bị quá thời gian');
    } else {
      result.steps.push('⚠️ Không click được Tạo tất cả Audio');
    }

    await sleep(500);
    const scriptSaved = await clickBtn(page, 'Lưu kịch bản');
    result.steps.push(scriptSaved ? '✅ Lưu kịch bản sau khi tạo audio OK' : '⚠️ Không click được Lưu kịch bản');
    await sleep(2000);

    // 9. Mở VideoCreatorModal bằng localStorage flag
    await sleep(500);
    await page.keyboard.press('Escape').catch(() => {});
    await sleep(500);
    log('[Flow2] Mở VideoCreatorModal...');
    const modalOpened = await openVideoCreatorModal(page);
    result.steps.push(modalOpened ? '✅ Vào VideoCreatorModal OK' : '⚠️ Modal chưa hiện "Bắt Đầu Render"');

    // 11. Cài BGM (chờ panel render xuất hiện trước)
    await waitForText(page, 'Bắt Đầu Render', 20000).catch(() => {});
    const bgmOk = await setBgm(page);
    result.steps.push(bgmOk ? '✅ Chọn nhạc Đường Hằng An OK' : '⚠️ Không tìm select BGM');

    // 12. Upload logo
    const logoOk = await uploadLogo(page);
    result.steps.push(logoOk ? '✅ Upload logo.jpg OK' : '⚠️ Upload logo thất bại');

    // 13. Chọn format MP4
    const fmtOk = await setFormatMp4(page);
    result.steps.push(fmtOk ? '✅ Chọn format MP4 OK' : '⚠️ Không chọn được MP4');

    // 13.5. Chọn nhân vật
    const charOk = await selectCharacter(page);
    result.steps.push(charOk ? `✅ Chọn nhân vật OK (${charOk})` : '⚠️ Không chọn được nhân vật');
    await sleep(2000); // Chờ nhân vật load

    // 14. Render
    const renderResult = await renderVideo(page, 'Flow2');
    result.steps.push(renderResult.ok ? `✅ ${renderResult.msg}` : `❌ ${renderResult.msg}`);
    result.status = renderResult.ok ? 'PASS' : 'PARTIAL';

  } catch (err) {
    log(`[Flow2] LỖI: ${err.message}`);
    result.steps.push(`❌ Lỗi: ${err.message}`);
    result.status = 'ERROR';
  }

  result.duration = `${((Date.now() - t0) / 1000).toFixed(1)}s`;
  log(`[Flow2] Kết thúc: ${result.status} — ${result.duration}`);
  return result;
}

// ─── BÁO CÁO MARKDOWN ───
function generateReport(flow1, flow2) {
  const now = new Date().toLocaleString('vi-VN');
  const icon = s => s === 'PASS' ? '🟢 PASS' : s === 'ERROR' ? '🔴 ERROR' : s === 'PARTIAL' ? '🟡 PARTIAL' : '⚪ FAIL';
  let md = `# 📋 Báo cáo kiểm thử 2 luồng OngLao\n\n`;
  md += `> **Ngày giờ:** ${now}  \n> **Chủ đề:** "${TOPIC}"  \n> **Logo:** /logo.jpg  \n> **Nhạc:** Đường Hằng An  \n\n---\n\n`;
  md += `## ✏️ Luồng 1: Thủ công → Video\n| Kết quả | Thời gian |\n|---|---|\n| ${icon(flow1.status)} | ${flow1.duration} |\n\n`;
  flow1.steps.forEach((s, i) => { md += `${i + 1}. ${s}\n`; });
  md += `\n---\n\n## 🤖 Luồng 2: AI → Video\n| Kết quả | Thời gian |\n|---|---|\n| ${icon(flow2.status)} | ${flow2.duration} |\n\n`;
  flow2.steps.forEach((s, i) => { md += `${i + 1}. ${s}\n`; });
  md += `\n---\n\n## 📊 Tổng kết\n| Luồng | Kết quả | Thời gian |\n|---|---|---|\n| Thủ công | ${icon(flow1.status)} | ${flow1.duration} |\n| AI | ${icon(flow2.status)} | ${flow2.duration} |\n`;
  return md;
}

// ─── MAIN ───
async function main() {
  let browser;
  try {
    log('Kết nối Chrome debug 9222...');
    browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
    const pages = await browser.pages();
    let page = pages.find(p => p.url().includes('localhost:3013')) || await browser.newPage();

    const client = await page.createCDPSession();
    await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: DOWNLOAD_DIR });
    page.on('console', msg => {
      const t = msg.text();
      const type = msg.type();
      if (type === 'error' || type === 'warning' || t.includes('Lỗi') || t.includes('Error')) {
        log(`BROWSER [${type.toUpperCase()}]: ${t.substring(0, 200)}`);
      }
    });

    page.on('pageerror', err => {
      log(`BROWSER CRASH EXCEPTION 🔴: ${err.message}\nStack: ${err.stack}`);
    });

    page.on('requestfailed', req => {
      const fail = req.failure();
      log(`BROWSER REQUEST FAILED ❌: ${req.url()} - ${fail ? fail.errorText : 'unknown error'}`);
    });

    // Set window size
    try {
      const { windowId } = await client.send('Browser.getWindowForTarget');
      await client.send('Browser.setWindowBounds', { windowId, bounds: { left: 0, top: 0, width: 1366, height: 768, windowState: 'normal' } });
      await page.setViewport({ width: 1366, height: 768 });
      log('✅ Chrome 1366x768');
    } catch (e) {
      try { await page.setViewport({ width: 1366, height: 768 }); } catch {}
    }
    await sleep(1000);

    const flow1 = await testFlow1(page);
    await sleep(5000);
    const flow2 = await testFlow2(page);

    const report = generateReport(flow1, flow2);
    fs.writeFileSync(REPORT_PATH, report, 'utf8');

    // Cũng lưu vào docs/
    const docsReport = path.join(process.cwd(), 'docs', 'test_report.md');
    fs.writeFileSync(docsReport, report, 'utf8');

    log('\n' + '═'.repeat(50));
    log('📄 Báo cáo: ' + REPORT_PATH);
    log('📄 Docs:    ' + docsReport);
    log('═'.repeat(50));
    console.log('\n' + report);

  } catch (err) {
    log(`LỖI CHÍNH: ${err.message}`);
    console.error(err);
  } finally {
    if (browser) await browser.disconnect();
  }
}

main();
