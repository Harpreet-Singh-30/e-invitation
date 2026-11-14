# Issue Tracker & Defect Register: InviteHub Platform

**Platform:** InviteHub E-Invitation SaaS  
**Audit Period:** November 14, 2026  
**Classification Standards:**
- **P0 (Critical / Blocker):** System down, data corruption, severe security vulnerability, or broken core payment/login flow.
- **P1 (Major Issue):** Significant user-facing feature impairment, broken route/navigation, or missing critical functionality with no easy workaround.
- **P2 (Moderate Issue):** Minor functional bug, performance inefficiency, developer friction, or accessibility violation.
- **P3 (Minor Polish / Cosmetic):** Visual alignment, missing SEO tags, or non-blocking documentation/code cleanup.

---

## Summary Register

| ID | Severity | Category | Description | Status | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **P0** | Security / Infrastructure | CORS origin rejected requests from production domain `*.vercel.app` | **RESOLVED** | Verified via live sign-up & API test |
| **BLD-01** | **P0** | DevOps / Serverless | Native C++ modules (`better-sqlite3`, `bcrypt`) broke Vercel serverless builds | **RESOLVED** | Replaced with `bcryptjs`, clean Vercel deploy |
| **OPS-01** | **P0** | Backend / Runtime | Serverless filesystem crashed on `fs.mkdirSync('/var/task/uploads')` | **RESOLVED** | Updated storage path to `/tmp/uploads` fallback |
| **ROU-01** | **P1** | Frontend / DevOps | Deep links (`/i/:slug`, `/admin/login`) returned 404 on Vercel | **RESOLVED** | Applied standard Vite SPA rewrite rule |
| **API-01** | **P1** | Backend / API | `POST /api/host/invitations` returned 201 when invalid `themeId` passed | **RESOLVED** | Enforced 400 Bad Request on invalid theme |
| **DEV-01** | **P2** | Frontend / Admin UX | Quick Demo Admin fill button populated invalid password `Admin123!` | **RESOLVED** | Updated to match seeded password `admin123` |
| **NAV-01** | **P2** | Frontend / Auth | Expired admin token redirected user to `/login` instead of `/admin/login` | **RESOLVED** | Added path check in Axios response interceptor |
| **A11Y-01**| **P2** | Accessibility | Scaled template cards in gallery polluted DOM with 20 unlabeled inputs | **RESOLVED** | Added `aria-hidden="true"` & `tabIndex={-1}` |
| **A11Y-02**| **P2** | Accessibility | Mobile hamburger button missing `aria-label` on Home and Gallery | **RESOLVED** | Added `aria-label="Toggle navigation menu"` |
| **A11Y-03**| **P2** | Accessibility | Admin login page had `<h2>` without an `<h1>` heading | **RESOLVED** | Updated top heading to semantic `<h1>` |
| **PERF-01**| **P2** | Performance | Monolithic bundle size (>893 kB) without vendor chunking | **RESOLVED** | Added `manualChunks` in `vite.config.ts` |
| **DB-01**  | **P2** | Database / Performance | Missing indexes on `User(role, tier)` and `Invitation(isPublished)` | **RESOLVED** | Added indexes to Prisma schema and synced DB |
| **SEO-01** | **P3** | SEO / Branding | Missing Open Graph, Twitter cards, sitemap.xml, robots.txt, and favicon | **RESOLVED** | Injected complete meta, created robots & sitemap |

---

## Detailed Defect Reports

### Issue SEC-01: Cross-Origin Resource Sharing (CORS) Rejection on Production Domains
- **Severity:** P0 (Critical Blocker)
- **Category:** Application Security / API Gateway
- **Steps to Reproduce:**
  1. Open live frontend at `https://e-invitation-rosy.vercel.app/signup`.
  2. Fill out user registration form and click "Create Account".
  3. Browser blocks request with `Access-Control-Allow-Origin` missing error.
- **Root Cause:** `server/src/index.ts` had hardcoded `CORS_ORIGIN=http://localhost:5173`.
- **Remediation:** Configured dynamic origin check in Express CORS middleware allowing `localhost:*`, `*.vercel.app`, and explicit custom domains.
- **Verification:** Verified live host sign-up on production domain succeeds with HTTP 201 and valid tokens.

---

### Issue BLD-01: Native C++ Build Failure in Vercel Serverless Functions
- **Severity:** P0 (Critical Blocker)
- **Category:** DevOps / Build Infrastructure
- **Steps to Reproduce:**
  1. Trigger Vercel deployment of `server/`.
  2. Build fails with `make: *** [better_sqlite3.target.mk:122] Error 1`.
- **Root Cause:** Dependencies `better-sqlite3` and `bcrypt` require native node-gyp compilation against Linux headers, which fails in lightweight AWS Lambda / Vercel build containers.
- **Remediation:** Removed legacy `better-sqlite3` driver; stubbed legacy DB file; replaced `bcrypt` with pure JavaScript `bcryptjs` and `@types/bcryptjs`.
- **Verification:** Executed `npm run build` cleanly; deployed backend successfully to Vercel production.

---

### Issue OPS-01: Serverless Runtime Crash on Local Uploads Directory Creation
- **Severity:** P0 (Critical Blocker)
- **Category:** Backend Runtime Stability
- **Steps to Reproduce:**
  1. Send request to `GET https://e-invitation-api-chi.vercel.app/healthz`.
  2. Server responds with 500 `FUNCTION_INVOCATION_FAILED`.
  3. Logs reveal `EROFS: read-only file system, mkdir '/var/task/uploads'`.
- **Root Cause:** Serverless environments run on an immutable read-only filesystem where only `/tmp` is writable.
- **Remediation:** Pointed storage fallback to `/tmp/uploads` when `process.env.VERCEL` is detected, wrapped directory creation in try/catch.
- **Verification:** `GET /healthz` returns HTTP 200 OK with `{"status":"ok","database":"connected"}`.

---

### Issue ROU-01: Single Page Application (SPA) Deep Link 404s on Vercel
- **Severity:** P1 (Major)
- **Category:** Frontend Routing
- **Steps to Reproduce:**
  1. Navigate directly to `https://e-invitation-rosy.vercel.app/i/new` or `/admin/login`.
  2. Vercel returns `404 NOT_FOUND: The page could not be found`.
- **Root Cause:** `web/vercel.json` configured `"destination": "/index.html"` with `"cleanUrls": true`, causing Vercel edge router to search for static disk files instead of routing through SPA index.
- **Remediation:** Changed rewrite rule to standard Vite SPA format: `{"source": "/(.*)", "destination": "/"}`.
- **Verification:** Direct deep links to `/i/new`, `/admin/login`, and `/templates` return HTTP 200 OK.

---

### Issue API-01: Unvalidated Theme ID on Invitation Creation
- **Severity:** P1 (Major)
- **Category:** Backend API Contract
- **Steps to Reproduce:**
  1. Send `POST /api/host/invitations` with `{ "title": "My Party", "occasionType": "party", "themeId": "non-existent-theme-xyz" }`.
  2. API logged a warning and responded with HTTP 201 Created instead of rejecting invalid input.
- **Root Cause:** The fallback handler in `server/src/routes/invitations.ts` did not reject missing themes if `themeId` was explicitly provided.
- **Remediation:** Added explicit validation returning `400 Bad Request` with `{ error: 'Invalid theme' }` when an invalid `themeId` is supplied.
- **Verification:** Automated test `scripts/test-invitation-api.sh` test 7 confirmed passing with HTTP 400.

---

### Issue DEV-01: Demo Admin Quick-Fill Password Mismatch
- **Severity:** P2 (Moderate UX / Dev Bug)
- **Category:** Admin Frontend Experience
- **Steps to Reproduce:**
  1. Open `/admin/login`.
  2. Click "Fill Admin: admin@wedding-saas.com".
  3. Click "Authenticate Admin".
  4. Authentication fails with invalid credentials.
- **Root Cause:** The quick fill button filled `Admin123!` while database seed script configured `admin123`.
- **Remediation:** Updated `handleFillDemoAdmin` in `web/src/pages/admin/Login.tsx` to fill `admin123`.
- **Verification:** Clicking 1-click fill and authenticating immediately logs in to `/admin/dashboard`.

---

### Issue NAV-01: Token Expiration Admin Redirection Mismatch
- **Severity:** P2 (Moderate UX)
- **Category:** Authentication Navigation
- **Steps to Reproduce:**
  1. While logged in as Admin on `/admin/dashboard`, let access/refresh tokens expire.
  2. Axios interceptor triggers failed refresh and navigates to `/login`.
  3. Administrator is directed to public host login instead of admin login.
- **Root Cause:** `web/src/lib/api.ts` hardcoded `window.location.href = '/login'`.
- **Remediation:** Added path check: `window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login'`.
- **Verification:** Verified path-aware redirection.

---

### Issue A11Y-01: Gallery Cards Polluting Accessibility Tree with Unlabeled Inputs
- **Severity:** P2 (Moderate Accessibility)
- **Category:** Accessibility (WCAG 2.1 AA)
- **Steps to Reproduce:**
  1. Run automated accessibility audit on `/templates`.
  2. Audit flags "20 form controls missing labels".
- **Root Cause:** Scaled thumbnail cards rendered live template components containing RSVP forms without labels.
- **Remediation:** Added `aria-hidden="true"` and `tabIndex={-1}` to the decorative scaled thumbnail container in `TemplateThumbnail.tsx`.
- **Verification:** Automated audit confirmed zero unlabeled input warnings on `/templates`.

---

### Issue PERF-01: Monolithic Unsplit JavaScript Bundle
- **Severity:** P2 (Performance)
- **Category:** Build & Bundle Size
- **Steps to Reproduce:**
  1. Run `npm run build` in `web/`.
  2. Vite outputs warning: `Some chunks are larger than 500 kB after minification (index.js: 893 kB)`.
- **Root Cause:** Lack of `manualChunks` configuration in `web/vite.config.ts`.
- **Remediation:** Configured `rollupOptions.output.manualChunks` grouping React, Framer Motion, and utility libraries into separate cached bundles.
- **Verification:** Main `index.js` bundle dropped from 893 kB to 651 kB (~27% reduction).

