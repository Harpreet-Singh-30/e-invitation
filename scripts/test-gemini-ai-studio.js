const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const SHOT_DIR = path.join(__dirname, '../docs/audit/screenshots/gemini_ai_studio');

if (!fs.existsSync(SHOT_DIR)) {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
}

async function testGeminiAiStudio() {
  console.log('🤖 Testing Gemini AI Template Studio in Admin Panel...');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    headless: 'new'
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // 1. Login as Admin using 1-click button
  console.log('1️⃣  Logging into Master Admin Panel...');
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const fillBtn = btns.find(b => b.textContent && b.textContent.includes('Fill Admin'));
    if (fillBtn) fillBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));
  console.log('   Landed on:', page.url());

  // 2. Switch to Themes tab
  console.log('2️⃣  Navigating to Themes Catalog...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const themeTab = tabs.find(t => t.textContent && t.textContent.includes('Theme Catalog'));
    if (themeTab) themeTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SHOT_DIR, '01_admin_themes_tab.png') });

  // 3. Open Import Modal
  console.log('3️⃣  Opening Template Import & Creation Studio...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const importBtn = btns.find(b => b.textContent && b.textContent.includes('Import Template'));
    if (importBtn) importBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SHOT_DIR, '02_modal_ai_studio_initial.png') });

  // 4. Click a 1-Click Starter Suggestion (e.g. Royal Udaipur)
  console.log('4️⃣  Selecting Royal Udaipur Palace suggestion...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const suggestion = btns.find(b => b.textContent && b.textContent.includes('Royal Udaipur'));
    if (suggestion) suggestion.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SHOT_DIR, '03_prompt_filled.png') });

  // 5. Trigger AI Generation with Gemini
  console.log('5️⃣  Generating Template via Gemini AI (Refine + Synthesize)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const genBtn = btns.find(b => b.textContent && b.textContent.includes('Refine Prompt & Synthesize'));
    if (genBtn) genBtn.click();
  });

  // Wait for AI generation (up to 30s)
  await page.waitForFunction(() => {
    return document.body.innerText.includes('AI Generated') || document.body.innerText.includes('Start Over');
  }, { timeout: 35000 });

  console.log('   ✅ AI Generation returned successfully!');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SHOT_DIR, '04_ai_review_design_palette.png') });

  // 6. Switch to Sample Itinerary Tab
  console.log('6️⃣  Inspecting Generated Sample Itinerary Events...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const itinBtn = btns.find(b => b.textContent && b.textContent.includes('Sample Itinerary'));
    if (itinBtn) itinBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SHOT_DIR, '05_ai_sample_itinerary.png') });

  // 7. Switch to JSON Manifest Tab
  console.log('7️⃣  Inspecting Generated JSON Manifest...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const jsonBtn = btns.find(b => b.textContent && b.textContent.includes('JSON Manifest'));
    if (jsonBtn) jsonBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SHOT_DIR, '06_ai_json_manifest.png') });

  await browser.close();
  console.log('🎉 Gemini AI Template Studio test passed completely!');
}

testGeminiAiStudio().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
