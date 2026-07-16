const puppeteer = require('puppeteer');

(async () => {
  console.log('=== KHỞI CHẠY DEBUG LIVE (CAPTURE CONSOLE/ERRORS/NETWORK) ===\n');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Capture console messages
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[CONSOLE ${type.toUpperCase()}]: ${text}`);
    });

    // Capture uncaught exceptions
    page.on('pageerror', err => {
      console.error('[PAGE ERROR]:', err.message);
    });

    // Capture failed requests
    page.on('requestfailed', req => {
      console.error(`[REQUEST FAILED]: ${req.url()} - ${req.failure().errorText}`);
    });

    // Capture response status errors
    page.on('response', res => {
      const status = res.status();
      if (status >= 400) {
        console.error(`[HTTP ERROR ${status}]: ${res.url()}`);
      }
    });

    console.log('Navigating to https://onglao.giac.ngo/ ...');
    await page.goto('https://onglao.giac.ngo/', { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log('Waiting 5 seconds to capture any final logs...');
    await new Promise(r => setTimeout(r, 5000));

  } catch (err) {
    console.error('Puppeteer Script Error:', err);
  } finally {
    await browser.close();
    console.log('\n=== HOÀN THÀNH DEBUG LIVE ===');
  }
})();
