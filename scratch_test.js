const puppeteer = require('puppeteer');

(async () => {
    console.log('🚀 Starting Puppeteer Live Chrome Test (With Auth & Enter State)...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    let passed = 0;
    let failed = 0;

    try {
        // Set localStorage to bypass WelcomeScreen
        await page.goto('http://localhost:3013/', { waitUntil: 'networkidle2' });
        await page.evaluate(() => {
            localStorage.setItem('hasEntered', 'true');
            localStorage.setItem('onglao_has_entered', 'true');
        });

        // TEST 1: Manual Script Form URL & F5
        console.log('\n--- LIVE TEST 1: Manual Script Form F5 Persistence ---');
        await page.goto('http://localhost:3013/?modal=ai-director&action=insert&type=manual', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));

        let content1 = await page.content();
        let isManualFormOpen = content1.includes('BIÊN TẬP KỊCH BẢN THỦ CÔNG') || content1.includes('Tiêu đề kịch bản') || content1.includes('Chỉnh sửa nội dung Kịch bản');
        console.log('Initial page load (Manual Form):', isManualFormOpen ? 'PASSED ✅' : 'FAILED ❌');

        console.log('Reloading page (F5)...');
        await page.reload({ waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));

        let content2 = await page.content();
        let isManualFormStillOpen = content2.includes('BIÊN TẬP KỊCH BẢN THỦ CÔNG') || content2.includes('Tiêu đề kịch bản') || content2.includes('Chỉnh sửa nội dung Kịch bản');
        console.log('After F5 reload (Manual Form stays open):', isManualFormStillOpen ? 'PASSED ✅' : 'FAILED ❌');

        if (isManualFormOpen && isManualFormStillOpen) passed++; else failed++;

        // TEST 2: AI Script Form URL & F5
        console.log('\n--- LIVE TEST 2: AI Script Generator Form F5 Persistence ---');
        await page.goto('http://localhost:3013/?modal=ai-director&action=insert&type=ai', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));

        let content3 = await page.content();
        let isAiFormOpen = content3.includes('SOẠN KỊCH BẢN ĐẠO DIỄN BẰNG AI') || content3.includes('Chủ đề vướng mắc');
        console.log('Initial page load (AI Form):', isAiFormOpen ? 'PASSED ✅' : 'FAILED ❌');

        console.log('Reloading page (F5)...');
        await page.reload({ waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));

        let content4 = await page.content();
        let isAiFormStillOpen = content4.includes('SOẠN KỊCH BẢN ĐẠO DIỄN BẰNG AI') || content4.includes('Chủ đề vướng mắc');
        console.log('After F5 reload (AI Form stays open):', isAiFormStillOpen ? 'PASSED ✅' : 'FAILED ❌');

        if (isAiFormOpen && isAiFormStillOpen) passed++; else failed++;

        // TEST 3: Edit Existing Script Form URL & F5
        console.log('\n--- LIVE TEST 3: Update Script Form F5 Persistence ---');
        await page.goto('http://localhost:3013/?modal=ai-director&action=update&type=manual&id=5bbf40a4-1466-4024-bf8a-510bd262ed06', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));

        console.log('Reloading page (F5)...');
        await page.reload({ waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));

        let content5 = await page.content();
        let isEditFormStillOpen = content5.includes('BIÊN TẬP KỊCH BẢN THỦ CÔNG') || content5.includes('Chỉnh sửa nội dung Kịch bản');
        console.log('After F5 reload (Edit Form stays open):', isEditFormStillOpen ? 'PASSED ✅' : 'FAILED ❌');

        if (isEditFormStillOpen) passed++; else failed++;

    } catch (err) {
        console.error('Test execution error:', err.message);
        failed++;
    } finally {
        await browser.close();
        console.log(`\n================ FINAL TEST SUMMARY ================`);
        console.log(`TOTAL SCENARIOS: ${passed + failed}`);
        console.log(`PASSED: ${passed}`);
        console.log(`FAILED: ${failed}`);
        console.log(`STATUS: ${(passed > 0 && failed === 0) ? 'ALL TESTS PASSED ✅' : 'TESTS FAILED ❌'}`);
        console.log(`====================================================`);
    }
})();
