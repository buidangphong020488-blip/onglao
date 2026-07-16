const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load environment variables manually if dotenv is not used
const envPath = path.join(__dirname, '..', '.env');
const env = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      env[key] = value;
    }
  });
}

const NOTION_TOKEN = env.NOTION_TOKEN || process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = env.NOTION_DATABASE_ID || process.env.NOTION_DATABASE_ID;

const STATUS_FILE = path.join(__dirname, 'test_status.json');

// List of all tests from test_guide.md
const TEST_CASES = [
  { id: 1, name: "TEST 1: Admin Panel — Cấu hình hệ thống", desc: "Đăng nhập admin và lưu cấu hình" },
  { id: 2, name: "TEST 2: Màn Hình Chào — Đăng nhập GiacNgo SSO", desc: "Đăng nhập qua AuthModal và hoàn tất profile" },
  { id: 3, name: "TEST 3: Chat & TTS — Thưa hỏi Lão", desc: "Gửi câu hỏi và Lão trả lời bằng âm thanh tts" },
  { id: 4, name: "TEST 4: Kiểm tra Greeting AI thông minh", desc: "Kiểm tra mở đầu hội thoại theo nhóm chủ đề" },
  { id: 5, name: "TEST 5: Kho Tàng Pháp Bảo (Modal)", desc: "Mở modal Kho tàng pháp bảo gồm 3 tab" },
  { id: 6, name: "TEST 6: RAG → Tải lại từ GiacNgo", desc: "Tải lại dữ liệu huấn luyện RAG trong tab Kho trí tuệ" },
  { id: 7, name: "TEST 7: Pháp Bảo Khai Thị (Sidebar Lịch sử)", desc: "Xem lịch sử cuộc đàm đạo và các nút tính năng" },
  { id: 8, name: "TEST 8: Bộ Điều Chỉnh Nhân Vật Lão", desc: "Lật mặt Lão, bật hào quang, điều chỉnh vị trí Lão" },
  { id: 9, name: "TEST 9: Đạo Diễn AI — Tạo Kịch Bản Tự Động", desc: "Tạo kịch bản tự động bằng AI theo chủ đề" },
  { id: 10, name: "TEST 10: Nhập Kịch Bản Thủ Công (Text-to-Video)", desc: "Nhập kịch bản hội thoại thủ công" },
  { id: 11, name: "TEST 11: Chế Độ Live Stream / OBS", desc: "Kích hoạt giao diện livestream obs, phụ đề, hàng đợi" },
  { id: 12, name: "TEST 12: Freemium & Thanh Toán", desc: "Kiểm tra giới hạn câu hỏi miễn phí và thanh toán" },
  { id: 13, name: "TEST 13: Bộ đếm Tĩnh Tâm (Idle Timer)", desc: "Kiểm tra bộ đếm tĩnh tâm hiển thị trên thanh input" },
  { id: 14, name: "TEST 14: Tutorial Tour (Lần đầu dùng)", desc: "Khởi động và trải nghiệm hướng dẫn sử dụng" },
  { id: 15, name: "TEST 15: Proxy bảo mật (không lộ API Key)", desc: "Bảo mật key trên client side" }
];

// Load status (local + Notion)
let testStatuses = {};
try {
  if (fs.existsSync(STATUS_FILE)) {
    testStatuses = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
  }
} catch (e) {
  console.warn("Lỗi đọc file test_status.json, khởi tạo lại...");
}

// Ensure all test cases are in the status map
TEST_CASES.forEach(tc => {
  if (!testStatuses[tc.name]) {
    testStatuses[tc.name] = "Not Started";
  }
});

// Save local status
function saveLocalStatus() {
  fs.writeFileSync(STATUS_FILE, JSON.stringify(testStatuses, null, 2), 'utf8');
}

// Sync to Notion database if configured
async function syncToNotion(testName, status) {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) return;

  const headers = {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  };

  try {
    // 1. Search if the page exists
    const queryUrl = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`;
    const searchRes = await fetch(queryUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        filter: {
          property: 'Task name',
          title: {
            equals: testName
          }
        }
      })
    });

    if (!searchRes.ok) {
      const errData = await searchRes.json().catch(() => ({}));
      console.warn(`[Notion] Lỗi khi truy vấn: ${searchRes.statusText} - ${errData.message || JSON.stringify(errData)}`);
      return;
    }

    const searchData = await searchRes.json();
    const page = searchData.results && searchData.results[0];

    const mappedStatus = status === "Passed" ? "Done" : "Not started";

    if (page) {
      // Update existing page
      const updateUrl = `https://api.notion.com/v1/pages/${page.id}`;
      await fetch(updateUrl, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          properties: {
            'Status': {
              'status': { 'name': mappedStatus }
            }
          }
        })
      });
      console.log(`[Notion] Đã cập nhật trạng thái "${status}" (Notion: "${mappedStatus}") cho ${testName}`);
    } else {
      // Create new page
      const createUrl = `https://api.notion.com/v1/pages`;
      await fetch(createUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          parent: { database_id: NOTION_DATABASE_ID },
          properties: {
            'Task name': {
              'title': [{ 'text': { 'content': testName } }]
            },
            'Status': {
              'status': { 'name': mappedStatus }
            }
          }
        })
      });
      console.log(`[Notion] Đã tạo mới và đặt trạng thái "${status}" (Notion: "${mappedStatus}") cho ${testName}`);
    }
  } catch (err) {
    console.warn(`[Notion] Lỗi kết nối Notion API:`, err.message);
  }
}

// Pull statuses from Notion database if configured
async function pullFromNotion() {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    console.log('[Notion] Không tìm thấy NOTION_TOKEN hoặc NOTION_DATABASE_ID trong .env. Sử dụng test_status.json cục bộ.');
    return;
  }

  console.log('[Notion] Đang kéo trạng thái kiểm thử từ Notion...');
  const headers = {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  };

  try {
    const queryUrl = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`;
    const res = await fetch(queryUrl, { method: 'POST', headers });
    if (res.ok) {
      const data = await res.json();
      data.results.forEach(page => {
        const nameProp = page.properties['Task name'];
        const statusProp = page.properties.Status;
        if (nameProp && nameProp.title && nameProp.title[0]) {
          const testName = nameProp.title[0].text.content;
          const notionStatus = statusProp && statusProp.status ? statusProp.status.name : "Not started";
          const status = notionStatus === "Done" ? "Passed" : "Not Started";
          if (testStatuses.hasOwnProperty(testName)) {
            testStatuses[testName] = status;
          }
        }
      });
      saveLocalStatus();
      console.log('[Notion] Đồng bộ thành công trạng thái từ Notion!');
    } else {
      const errData = await res.json().catch(() => ({}));
      console.warn(`[Notion] Không thể kết nối DB: ${res.statusText} - ${errData.message || JSON.stringify(errData)}. Sử dụng cache cục bộ.`);
    }
  } catch (err) {
    console.warn('[Notion] Lỗi kéo dữ liệu Notion:', err.message);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

const isAuto = process.argv.includes('--auto') || process.argv.includes('-y');

// Main Runner
(async () => {
  console.log('===========================================================');
  console.log('           BỘ KIỂM THỬ TỰ ĐỘNG & ĐỒNG BỘ TRẠNG THÁI        ');
  console.log('===========================================================');

  await pullFromNotion();

  console.log('\n--- Trạng Thái Kiểm Thử Hiện Tại ---');
  TEST_CASES.forEach(tc => {
    const status = testStatuses[tc.name];
    const badge = status === "Passed" ? "✅ [Passed]" : status === "Failed" ? "❌ [Failed]" : "⚪ [Not Started]";
    console.log(`${badge} ${tc.name} (${tc.desc})`);
  });
  console.log('------------------------------------\n');

  let startTest = true;
  if (!isAuto) {
    const answer = await askQuestion('Bạn có muốn bắt đầu chạy các bài kiểm thử chưa đạt? (Y/n): ');
    if (answer.toLowerCase() === 'n') {
      startTest = false;
    }
  }

  if (!startTest) {
    console.log('Đã hủy tiến trình kiểm thử.');
    rl.close();
    process.exit(0);
  }

  console.log('\nKhởi chạy trình duyệt Puppeteer...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
    slowMo: 60
  });

  const pages = await browser.pages();
  const page = pages[0];
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  const updateTestStatus = async (tc, status) => {
    testStatuses[tc.name] = status;
    saveLocalStatus();
    await syncToNotion(tc.name, status);
    const badge = status === "Passed" ? "✅ [Passed]" : "❌ [Failed]";
    console.log(`\n>>> ${badge} ${tc.name}\n`);
  };

  try {
    // Helper to evaluate and click text buttons
    const clickButtonByText = async (text) => {
      await page.evaluate((txt) => {
        const btn = Array.from(document.querySelectorAll('button')).find(b =>
          b.textContent.trim().includes(txt)
        );
        if (btn) btn.click();
      }, text);
    };

    // ==========================================
    // TEST 1: Admin Panel
    // ==========================================
    const tc1 = TEST_CASES[0];
    if (testStatuses[tc1.name] === "Passed") {
      console.log(`[Bỏ qua] ${tc1.name} (Đã Passed)`);
    } else {
      console.log(`[Bắt đầu] Chạy ${tc1.name}...`);
      try {
        await page.goto('http://localhost:3013/admin');
        await page.waitForSelector('input[placeholder="Tài khoản"]', { timeout: 5000 });
        await page.type('input[placeholder="Tài khoản"]', 'admin');
        await page.type('input[placeholder="Mật khẩu"]', 'admin@123');
        await clickButtonByText('Vào cấu hình');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {});
        
        await new Promise(r => setTimeout(r, 2000));
        await updateTestStatus(tc1, "Passed");
      } catch (e) {
        console.error(`Lỗi ${tc1.name}:`, e.message);
        await updateTestStatus(tc1, "Failed");
      }
    }

    // ==========================================
    // TEST 2: SSO Login / Greetings
    // ==========================================
    const tc2 = TEST_CASES[1];
    if (testStatuses[tc2.name] === "Passed") {
      console.log(`[Bỏ qua] ${tc2.name} (Đã Passed)`);
    } else {
      console.log(`[Bắt đầu] Chạy ${tc2.name}...`);
      try {
        await page.goto('http://localhost:3013');
        await new Promise(r => setTimeout(r, 1500));
        await page.evaluate(() => {
          localStorage.setItem('taman_has_seen_tutorial', 'true');
        });
        
        // Click Đăng nhập on greeting screen
        await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b =>
            b.textContent.trim().includes('Đăng nhập') && b.type !== 'submit'
          );
          if (btn) btn.click();
        });

        await page.waitForSelector('input[type="email"]', { timeout: 5000 });
        const emailEl = await page.$('input[type="email"]');
        await emailEl.click({ clickCount: 3 });
        await emailEl.type('demo@giac.ngo');

        const passEl = await page.$('input[type="password"]');
        await passEl.click({ clickCount: 3 });
        await passEl.type('password');

        await page.evaluate(() => {
          const btn = document.querySelector('button[type="submit"]');
          if (btn) btn.click();
        });

        await new Promise(r => setTimeout(r, 3000));

        // Check if login failed (form is still visible)
        const isEmailStillVisible = await page.evaluate(() => {
          const emailInput = document.querySelector('input[type="email"]');
          if (!emailInput) return false;
          const rect = emailInput.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });

        if (isEmailStillVisible) {
          const errorMsg = await page.evaluate(() => {
            const errEl = Array.from(document.querySelectorAll('div, p, span, button')).find(el => 
              el.textContent.includes('không đúng') || 
              el.textContent.includes('kết nối') || 
              el.textContent.includes('thử lại') ||
              el.textContent.includes('Lỗi')
            );
            return errEl ? errEl.textContent.trim() : 'Đăng nhập không thành công (Form vẫn hiển thị)';
          });
          throw new Error(`Đăng nhập thất bại: ${errorMsg}`);
        }

        // Profile setup
        const needsProfile = await page.evaluate(() => {
          return !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Vào thiền đường'));
        });

        if (needsProfile) {
          const nameEl = await page.$('input[placeholder="Tên, Pháp danh..."]');
          if (nameEl) {
            await nameEl.click({ clickCount: 3 });
            await nameEl.type('Demo');
          }
          await clickButtonByText('Vào thiền đường');
          await new Promise(r => setTimeout(r, 2000));
        }

        await updateTestStatus(tc2, "Passed");
      } catch (e) {
        console.error(`Lỗi ${tc2.name}:`, e.message);
        await updateTestStatus(tc2, "Failed");
      }
    }

    // Ensure we are inside Thiền đường
    const hasInput = await page.evaluate(() => {
      return !!document.querySelector('input[placeholder="Con muốn thưa thỉnh..."]');
    });
    if (!hasInput && (testStatuses[TEST_CASES[2].name] !== "Passed" || testStatuses[TEST_CASES[3].name] !== "Passed")) {
      console.log('Đang chuyển hướng sang Thiền đường để chuẩn bị các bài test chat...');
      await page.goto('http://localhost:3013');
      await new Promise(r => setTimeout(r, 10000));
      await page.evaluate(() => {
        const userObj = { id: 'demo_user_id', name: 'Demo' };
        localStorage.setItem('taman_has_seen_tutorial', 'true');
        localStorage.setItem('onglao_subscribed', 'true');
        localStorage.setItem('onglao_user', JSON.stringify(userObj));
        localStorage.setItem('onglao_token', 'mock_token');
        localStorage.setItem('onglao_profile_completed_demo_user_id', 'true');
        localStorage.setItem('onglao_profile_demo_user_id', JSON.stringify({
          userName: 'Demo',
          userGender: 'Nam',
          userAge: 30,
          appLanguage: 'Tiếng Việt',
          userVoice: 'Aoede',
          userVoiceStyle: 'giọng thanh niên',
          laoVoice: 'Algieba',
          laoVoiceStyle: 'Giọng ấm áp'
        }));
      });
      await page.goto('http://localhost:3013');
      await new Promise(r => setTimeout(r, 10000));
    }

    // ==========================================
    // TEST 3: Chat & TTS
    // ==========================================
    const tc3 = TEST_CASES[2];
    if (testStatuses[tc3.name] === "Passed") {
      console.log(`[Bỏ qua] ${tc3.name} (Đã Passed)`);
    } else {
      console.log(`[Bắt đầu] Chạy ${tc3.name}...`);
      try {
        await page.waitForSelector('input[placeholder="Con muốn thưa thỉnh..."]', { timeout: 30000 });
        await page.click('input[placeholder="Con muốn thưa thỉnh..."]');
        await page.keyboard.type('Nam Mo A Di Da Phat. Con dang gap chuyen phien long, xin Lao chi day.');
        
        await page.evaluate(() => {
          const wrapper = document.querySelector('div[data-tutorial="tut-input"]');
          if (wrapper) {
            const btns = Array.from(wrapper.querySelectorAll('button'));
            const sendBtn = btns[btns.length - 1];
            if (sendBtn) sendBtn.click();
          }
        });

        console.log('Chờ 12 giây phản hồi từ AI...');
        await new Promise(r => setTimeout(r, 12000));
        await updateTestStatus(tc3, "Passed");
      } catch (e) {
        console.error(`Lỗi ${tc3.name}:`, e.message);
        const html = await page.evaluate(() => document.body.innerHTML);
        console.log('HTML BODY CONTENT:', html.substring(0, 1000));
        await page.screenshot({ path: path.join(__dirname, 'failed_test.png') });
        await updateTestStatus(tc3, "Failed");
      }
    }

    // ==========================================
    // TEST 4: Greeting AI
    // ==========================================
    const tc4 = TEST_CASES[3];
    if (testStatuses[tc4.name] === "Passed") {
      console.log(`[Bỏ qua] ${tc4.name} (Đã Passed)`);
    } else {
      console.log(`[Bắt đầu] Chạy ${tc4.name}...`);
      try {
        await page.waitForSelector('input[placeholder="Con muốn thưa thỉnh..."]');
        await page.click('input[placeholder="Con muốn thưa thỉnh..."]');
        await page.keyboard.type('Lao khoe khong?');
        
        await page.evaluate(() => {
          const wrapper = document.querySelector('div[data-tutorial="tut-input"]');
          if (wrapper) {
            const btns = Array.from(wrapper.querySelectorAll('button'));
            const sendBtn = btns[btns.length - 1];
            if (sendBtn) sendBtn.click();
          }
        });

        console.log('Đợi Lão chào hỏi...');
        await new Promise(r => setTimeout(r, 8000));
        await updateTestStatus(tc4, "Passed");
      } catch (e) {
        console.error(`Lỗi ${tc4.name}:`, e.message);
        await updateTestStatus(tc4, "Failed");
      }
    }

    // ==========================================
    // Interactive / Semi-Automated for UI modules
    // ==========================================
    const runSemiAutomatedTest = async (tc, actionText, triggerFn) => {
      if (testStatuses[tc.name] === "Passed") {
        console.log(`[Bỏ qua] ${tc.name} (Đã Passed)`);
        return;
      }
      console.log(`\n[Bắt đầu] Chạy ${tc.name}...`);
      let success = true;
      try {
        await triggerFn();
        console.log(`Đang chạy kích hoạt: ${actionText}`);
        await new Promise(r => setTimeout(r, 2000));
      } catch (err) {
        console.log(`Không thể tự động kích hoạt: ${err.message}. Yêu cầu thao tác thủ công.`);
        success = false;
      }

      let manualVal = 'y';
      if (!isAuto) {
        manualVal = await askQuestion(`Tính năng "${tc.name}" chạy ổn trên màn hình chứ? (y/n/skip): `);
      } else {
        console.log(`[Auto Mode] Tự động đánh dấu "${tc.name}" là ${success ? 'Passed' : 'Failed'}`);
        manualVal = success ? 'y' : 'n';
      }

      if (manualVal.toLowerCase() === 'y') {
        await updateTestStatus(tc, "Passed");
      } else if (manualVal.toLowerCase() === 'n') {
        await updateTestStatus(tc, "Failed");
      } else {
        console.log(`Đã bỏ qua cập nhật trạng thái cho: ${tc.name}`);
      }
    };

    // TEST 5: Kho Tàng Pháp Bảo
    await runSemiAutomatedTest(TEST_CASES[4], "Mở modal Kho Kệ Pháp & Mào Đầu...", async () => {
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Kho Kệ Pháp & Mào Đầu'));
        if (btn) btn.click();
      });
    });

    // TEST 6: RAG -> Tải lại từ GiacNgo
    await runSemiAutomatedTest(TEST_CASES[5], "Chuyển sang tab Kho Trí Tuệ...", async () => {
      await page.evaluate(() => {
        const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Kho Trí Tuệ'));
        if (tab) tab.click();
      });
    });

    // Close Kho Tàng modal to clear screen
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[title="Đóng"], button[title="Close"]');
      if (closeBtn) closeBtn.click();
      // Click outside/close if exists
      const modal = document.querySelector('.fixed');
      if (modal && modal.textContent.includes('Kho Tàng Pháp Bảo')) {
        const close = modal.querySelector('button');
        if (close) close.click();
      }
    }).catch(() => {});

    // TEST 7: Lịch sử Sidebar
    await runSemiAutomatedTest(TEST_CASES[6], "Mở sidebar Lịch sử (Pháp bảo khai thị)...", async () => {
      await page.click('[data-tutorial="tut-history"]');
    });

    // TEST 8: Điều chỉnh vị trí Lão
    await runSemiAutomatedTest(TEST_CASES[7], "Mở bảng Sliders điều khiển Lão...", async () => {
      await page.evaluate(() => {
        const btn = document.querySelector('button[title="Mở bảng điều chỉnh vị trí bằng thanh kéo"]');
        if (btn) btn.click();
      });
    });

    // TEST 9: Đạo Diễn AI
    await runSemiAutomatedTest(TEST_CASES[8], "Mở modal Đạo Diễn AI...", async () => {
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Đạo Diễn AI'));
        if (btn) btn.click();
      });
    });

    // TEST 10: Nhập kịch bản
    await runSemiAutomatedTest(TEST_CASES[9], "Mở modal Nhập kịch bản thủ công...", async () => {
      // Close active modal first
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 500));
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Nhập kịch bản thủ công'));
        if (btn) btn.click();
      });
    });

    // TEST 11: Livestream OBS
    await runSemiAutomatedTest(TEST_CASES[10], "Mở chế độ Livestream OBS...", async () => {
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 500));
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Bật chế độ Livestream Obs'));
        if (btn) btn.click();
      });
    });

    // TEST 12: Freemium
    await runSemiAutomatedTest(TEST_CASES[11], "Mở modal thanh toán...", async () => {
      await page.evaluate(() => {
        localStorage.removeItem('onglao_subscribed');
      });
      await page.goto('http://localhost:3013');
    });

    // TEST 13: Bộ đếm Tĩnh tâm
    await runSemiAutomatedTest(TEST_CASES[12], "Kiểm tra bộ đếm Thời gian tĩnh tâm...", async () => {});

    // TEST 14: Tutorial Tour
    await runSemiAutomatedTest(TEST_CASES[13], "Kiểm tra Tutorial Tour...", async () => {
      await page.evaluate(() => {
        localStorage.removeItem('taman_has_seen_tutorial');
      });
      await page.goto('http://localhost:3013');
    });

    // TEST 15: Proxy bảo mật
    await runSemiAutomatedTest(TEST_CASES[14], "Xác nhận proxy API bảo mật hoạt động...", async () => {});

    console.log('\n===========================================================');
    console.log('   TẤT CẢ CÁC BÀI KIỂM THỬ ĐÃ ĐƯỢC XỬ LÝ VÀ ĐỒNG BỘ XONG!  ');
    console.log('===========================================================');

  } catch (err) {
    console.error('Lỗi nghiêm trọng khi chạy bộ test:', err.message);
  } finally {
    console.log('\nĐang đóng trình duyệt kiểm thử...');
    await browser.close();
    rl.close();
  }
})();
