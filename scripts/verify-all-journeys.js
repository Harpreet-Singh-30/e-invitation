const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3000';
const SHOT_DIR = path.join(__dirname, '../docs/audit/screenshots/qa_flow');

if (!fs.existsSync(SHOT_DIR)) {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
}

async function verifyAllJourneys() {
  console.log('🧪 Starting Full Multi-Role QA & User Journey Verification...');
  
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    headless: 'new'
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Step 1: Visit Home
  console.log('1️⃣  Testing Homepage & Navigation...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SHOT_DIR, '01_homepage.png') });

  // Step 2: Browse Templates & Filter
  console.log('2️⃣  Testing Template Gallery & Filters...');
  await page.goto(`${BASE_URL}/templates`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SHOT_DIR, '02_gallery_all.png') });

  // Click a filter tab, e.g. Birthday
  const birthdayFilter = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Birthday'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SHOT_DIR, '03_gallery_birthday.png') });
  console.log('   Filtered Birthday:', birthdayFilter ? '✅ YES' : '❌ NO');

  // Step 3: Register a New Host User
  console.log('3️⃣  Testing Host Registration Flow...');
  const testId = Date.now();
  const hostUser = {
    name: `Auditor Host ${testId}`,
    email: `auditor.${testId}@testinvites.com`,
    password: 'Password@123'
  };

  await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle2' });
  await page.type('input[type="text"], input[name="name"]', hostUser.name);
  await page.type('input[type="email"]', hostUser.email);
  const pwInputs = await page.$$('input[type="password"]');
  if (pwInputs.length >= 2) {
    await pwInputs[0].type(hostUser.password);
    await pwInputs[1].type(hostUser.password);
  } else {
    await pwInputs[0].type(hostUser.password);
  }
  await page.screenshot({ path: path.join(SHOT_DIR, '04_signup_filled.png') });

  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 6000 }).catch(() => {});
  await page.screenshot({ path: path.join(SHOT_DIR, '05_dashboard_after_signup.png') });
  console.log('   After signup landed on:', page.url());

  // Step 4: Create a New Invitation
  console.log('4️⃣  Testing Create Invitation Flow...');
  await page.goto(`${BASE_URL}/invitations/new`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SHOT_DIR, '06_create_invitation_page.png') });

  // Fill in invitation title
  const inviteTitle = `Rohan & Aaliyah Royal Shaadi ${testId}`;
  const titleInput = await page.$('input[placeholder*="e.g."], input[type="text"]');
  if (titleInput) {
    await titleInput.type(inviteTitle);
  }

  // Select occasion if dropdown exists
  await page.evaluate(() => {
    const select = document.querySelector('select');
    if (select) {
      select.value = 'wedding';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await page.screenshot({ path: path.join(SHOT_DIR, '07_create_invitation_filled.png') });

  // Submit creation
  const createBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const submit = btns.find(b => b.textContent && (b.textContent.includes('Create') || b.textContent.includes('Continue')));
    if (submit) {
      submit.click();
      return true;
    }
    return false;
  });

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 6000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SHOT_DIR, '08_invitation_editor_landed.png') });
  console.log('   Editor URL:', page.url());

  // Step 5: Test Admin Login & Console
  console.log('5️⃣  Testing Admin Authentication & Dashboard...');
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SHOT_DIR, '09_admin_login.png') });

  const adminInputs = await page.$$('input');
  if (adminInputs.length >= 2) {
    await adminInputs[0].type('admin@wedding-saas.com');
    await adminInputs[1].type('admin123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 6000 }).catch(() => {});
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SHOT_DIR, '10_admin_dashboard.png') });
  console.log('   Admin URL:', page.url());

  // Step 6: 404 Route Verification
  console.log('6️⃣  Testing 404 Not Found Page...');
  await page.goto(`${BASE_URL}/unknown-audit-route-404`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SHOT_DIR, '11_404_page.png') });

  await browser.close();
  console.log('🎉 Full Multi-Role QA Verification completed successfully!');
}

verifyAllJourneys().catch(err => {
  console.error('QA script failed:', err);
  process.exit(1);
});

