const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting Puppeteer check on https://onglao.giac.ngo/ ...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to https://onglao.giac.ngo/ ...');
    await page.goto('https://onglao.giac.ngo/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    console.log('Waiting 5 seconds for page rendering...');
    await new Promise(r => setTimeout(r, 5000));

    // Get all scripts
    const scriptContents = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.map(s => s.src || s.innerText.slice(0, 500));
    });
    console.log('--- SCRIPTS ON PAGE ---');
    scriptContents.forEach((s, i) => console.log(`Script ${i}:`, s));
    console.log('-----------------------');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
