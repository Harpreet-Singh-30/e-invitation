const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '../docs/audit/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runAudit() {
  console.log('🚀 Starting Comprehensive Automated Audit & QA...');
  const results = {
    pages: [],
    consoleErrors: [],
    networkFailures: [],
    a11yIssues: [],
    responsiveChecks: [],
    flows: {}
  };

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    headless: 'new'
  });

  const page = await browser.newPage();

  // Listen for console events
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filter out favicon or known benign dev logs if any
      results.consoleErrors.push({ url: page.url(), error: text });
      console.log(`[Browser Console Error] ${text}`);
    }
  });

  // Listen for failed network requests
  page.on('requestfailed', request => {
    results.networkFailures.push({
      url: request.url(),
      method: request.method(),
      failure: request.failure()?.errorText
    });
    console.log(`[Browser Network Failed] ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
  });

  // Viewports to test
  const viewports = [
    { name: 'Desktop (1280x800)', width: 1280, height: 800 },
    { name: 'Tablet (768x1024)', width: 768, height: 1024 },
    { name: 'Mobile (375x667)', width: 375, height: 667 }
  ];

  // Helper to audit a public page
  async function auditPage(route, name) {
    console.log(`\n--- Auditing ${name} (${route}) ---`);
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      const resp = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle2' });
      const status = resp ? resp.status() : 'none';
      const title = await page.title();
      
      // Check horizontal overflow (horizontal scroll bug)
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      // Basic A11y checks
      const a11y = await page.evaluate(() => {
        const issues = [];
        // Images without alt
        const images = Array.from(document.querySelectorAll('img:not([alt])'));
        if (images.length > 0) issues.push(`${images.length} images missing alt text`);
        
        // Buttons without accessible text
        const emptyButtons = Array.from(document.querySelectorAll('button')).filter(b => !b.innerText.trim() && !b.getAttribute('aria-label'));
        if (emptyButtons.length > 0) issues.push(`${emptyButtons.length} buttons missing accessible labels`);

        // Form inputs without labels
        const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea'));
        const unlabeledInputs = inputs.filter(inp => {
          const id = inp.id;
          const hasLabel = id ? !!document.querySelector(`label[for="${id}"]`) : false;
          const hasAria = inp.getAttribute('aria-label') || inp.getAttribute('aria-labelledby');
          const hasTitle = inp.getAttribute('title');
          const hasPlaceholder = inp.getAttribute('placeholder');
          return !hasLabel && !hasAria && !hasTitle && !hasPlaceholder;
        });
        if (unlabeledInputs.length > 0) issues.push(`${unlabeledInputs.length} form controls missing labels`);

        // Check if page has h1
        const h1s = document.querySelectorAll('h1');
        if (h1s.length === 0) issues.push('No <h1> heading present on page');

        return issues;
      });

      const shotName = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_${vp.width}.png`;
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, shotName) });

      results.pages.push({
        name,
        route,
        viewport: vp.name,
        status,
        title,
        horizontalOverflow: hasHorizontalOverflow,
        a11yIssues: a11y,
        screenshot: shotName
      });
      console.log(`[${vp.name}] Status: ${status} | Title: "${title}" | H-Scroll: ${hasHorizontalOverflow ? '⚠️ YES' : '✅ NO'} | A11y Issues: ${a11y.length}`);
    }
  }

  // 1. Audit public pages
  await auditPage('/', 'Home');
  await auditPage('/templates', 'Template_Gallery');
  await auditPage('/login', 'Login');
  await auditPage('/signup', 'Signup');
  await auditPage('/admin/login', 'Admin_Login');
  await auditPage('/nonexistent-path-test-404', '404_Page');

  // 2. Audit public published invitation
  await auditPage('/i/new', 'Published_Invitation_Sample');

  // 3. User Journey: Registration, Dashboard, Create Invitation, Edit, Publish
  console.log('\n--- Testing User Journey: Host Signup & Invitation Lifecycle ---');
  await page.setViewport({ width: 1280, height: 800 });
  const uniqueId = Date.now();
  const testUser = {
    email: `audit.host.${uniqueId}@example.com`,
    password: 'Password@123',
    name: 'Audit Host'
  };

  await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle2' });
  await page.type('input[type="text"], input[name="name"]', testUser.name);
  await page.type('input[type="email"]', testUser.email);
  const passwordInputs = await page.$$('input[type="password"]');
  if (passwordInputs.length >= 2) {
    await passwordInputs[0].type(testUser.password);
    await passwordInputs[1].type(testUser.password);
  } else if (passwordInputs.length === 1) {
    await passwordInputs[0].type(testUser.password);
  }

  // Submit signup
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'journey_01_signup_filled.png') });
  const signupBtn = await page.$('button[type="submit"]');
  if (signupBtn) {
    await signupBtn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {});
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'journey_02_after_signup.png') });
  console.log('After signup URL:', page.url());

  // 4. Test Admin Journey
  console.log('\n--- Testing Admin Journey ---');
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' });
  const adminInputs = await page.$$('input');
  if (adminInputs.length >= 2) {
    await adminInputs[0].type('admin@wedding-saas.com');
    await adminInputs[1].type('admin123');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'admin_01_login_filled.png') });
    const adminSubmit = await page.$('button[type="submit"]');
    if (adminSubmit) {
      await adminSubmit.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {});
    }
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'admin_02_dashboard.png') });
  console.log('Admin URL after login:', page.url());

  await browser.close();

  // Save audit results
  fs.writeFileSync(path.join(__dirname, '../docs/audit/audit_raw_results.json'), JSON.stringify(results, null, 2));
  console.log('\n✅ Audit execution completed. Results saved to docs/audit/audit_raw_results.json');
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});

