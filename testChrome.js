const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    console.log("Connecting to Chrome on port 9222...");
    const browser = await puppeteer.connect({
      browserURL: 'http://127.0.0.1:9222'
    });
    
    console.log("Connected! Getting active pages...");
    const pages = await browser.pages();
    let page = pages.find(p => p.url().includes('localhost:3013'));
    
    if (!page) {
      console.log("Page not found. Opening new tab...");
      page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 }); await page.goto('http://localhost:3013', { waitUntil: 'networkidle2' });
    } else {
      console.log("Page found. Bringing to front...");
      await page.bringToFront();
    }
    
    console.log("Wait a bit for the page to settle...");
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Sending a message...");
    const inputSelector = 'input[type="text"][placeholder*="thỉnh"]';
    await page.waitForSelector(inputSelector, { timeout: 5000 }).catch(() => {});
    
    const input = await page.$(inputSelector);
    if (input) {
      await page.type(inputSelector, "hãy giải thích về nhân quả");
      await page.keyboard.press('Enter');
      console.log("Message sent!");
    } else {
      console.log("Could not find input box.");
    }
    
    console.log("Waiting for response (7 seconds)...");
    await new Promise(r => setTimeout(r, 15000));
    
    console.log("Checking if audio is playing...");
    const isPlaying = await page.evaluate(() => {
       const audios = document.querySelectorAll('audio');
       let playing = false;
       for (let a of audios) {
           if (!a.paused && !a.muted) playing = true;
       }
       return playing;
    });
    console.log("Is any <audio> playing? " + isPlaying);
    
    console.log("Taking screenshot...");
    const screenshotPath = 'C:\\Users\\Lenovo-03\\.gemini\\antigravity\\brain\\20e4c6b3-5a0b-4c5f-8a97-daaf5dc066b2\\scratch\\screenshot.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log("Screenshot saved to " + screenshotPath);
    
    browser.disconnect();
    console.log("Done.");
  } catch (error) {
    console.error("Error:", error);
  }
})();
