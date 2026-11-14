# Implementation Log: Continuous Improvement & Fix Verification

**Platform:** InviteHub (E-Invitation SaaS)  
**Session Date:** November 14, 2026  
**Auditing Team:** Senior Engineering & QA Team (13 Specialized Roles)

---

## 1. Summary of Changes

| Change Ref | Component / File | Purpose | Impact & Scope |
| :--- | :--- | :--- | :--- |
| **IMP-01** | `server/src/index.ts` | Dynamic CORS configuration | Allowed requests from all `*.vercel.app` domains & localhost |
| **IMP-02** | `server/package.json` | Serverless build compatibility | Swapped native C++ modules `better-sqlite3`/`bcrypt` for `bcryptjs` |
| **IMP-03** | `server/src/lib/storage.ts` | Serverless file handling | Safe `/tmp/uploads` fallback for read-only serverless runtime |
| **IMP-04** | `web/vercel.json` | SPA routing rules | Configured `{"source": "/(.*)", "destination": "/"}` for deep links |
| **IMP-05** | `server/src/routes/invitations.ts` | API contract validation | Returns 400 Bad Request when an invalid `themeId` is supplied |
| **IMP-06** | `server/prisma/schema.prisma` | Database query performance | Added indexes on `User(role, tier)` and `Invitation(isPublished)` |
| **IMP-07** | `web/vite.config.ts` | Frontend bundle optimization | Implemented `manualChunks` splitting vendor dependencies |
| **IMP-08** | `web/src/lib/api.ts` | Authentication session recovery | Path-aware redirect to `/admin/login` on expired admin sessions |
| **IMP-09** | `web/src/components/TemplateThumbnail.tsx` | Accessibility (WCAG 2.1 AA) | Added `aria-hidden="true"` & `tabIndex={-1}` to scaled mockups |
| **IMP-10** | `web/src/pages/Home.tsx` & `TemplateGallery.tsx` | Accessibility | Added `aria-label="Toggle navigation menu"` to hamburger buttons |
| **IMP-11** | `web/src/pages/admin/Login.tsx` | Admin UX & A11y | Changed top heading to `<h1>` and corrected demo fill password |
| **IMP-12** | `web/index.html` | SEO & Social sharing | Injected Open Graph tags, Twitter card meta, and brand theme-color |
| **IMP-13** | `web/public/robots.txt` & `sitemap.xml` | Search crawler indexing | Provided structured search engine directives and canonical URLs |
| **IMP-14** | `web/public/favicon.svg` | Branding | Created vector SVG brand icon for browser tabs and mobile bookmarks |

---

## 2. Detailed Change Records

### IMP-01: Universal CORS Support for Vercel Deployments
- **File:** `server/src/index.ts`
- **Technical Rationale:** The frontend and backend are deployed to separate Vercel projects (`e-invitation-rosy.vercel.app` and `e-invitation-api-chi.vercel.app`). A hardcoded CORS origin of `localhost:5173` caused cross-origin rejections in production.
- **Implementation:** Added regex origin matcher accepting `localhost:*` and `*.vercel.app`.
- **Verification:** Verified live host sign-up on production returns HTTP 201 with valid CORS headers (`access-control-allow-origin`).

### IMP-02: Serverless Build Stabilization (Removal of Native C++ Addons)
- **Files:** `server/package.json`, `server/src/db/index.ts`, `server/src/routes/auth.ts`
- **Technical Rationale:** AWS Lambda / Vercel Serverless containers lack C++ toolchains, causing `better-sqlite3` and `bcrypt` compilation to fail during `npm install`.
- **Implementation:** Uninstalled `better-sqlite3`, stubbed legacy SQLite database file, installed `bcryptjs` and `@types/bcryptjs`, and updated import statements.
- **Verification:** `npm run build` succeeds cleanly in 3.19s without native build errors.

### IMP-03: Serverless Ephemeral File Storage Fallback
- **Files:** `server/src/index.ts`, `server/src/lib/storage.ts`
- **Technical Rationale:** Vercel functions throw `EROFS` when attempting to write to the project root directory.
- **Implementation:** Set default upload directory to `/tmp/uploads` when `process.env.VERCEL` is present, wrapped `fs.mkdirSync` in a try/catch block.
- **Verification:** `GET /healthz` returns status 200 OK without unhandled filesystem crashes.

### IMP-04: SPA Routing Rewrite Rule on Vercel Edge
- **Files:** `web/vercel.json`, `vercel.json`
- **Technical Rationale:** Direct navigation to deep URLs like `/i/:slug` returned 404 because Vercel was configured with `"cleanUrls": true` and `"destination": "/index.html"`.
- **Implementation:** Updated rewrites to `[{"source": "/(.*)", "destination": "/"}]`.
- **Verification:** Direct deep links to `https://e-invitation-rosy.vercel.app/i/new` return HTTP 200 OK.

### IMP-05: Strict Theme ID Validation on Host API
- **File:** `server/src/routes/invitations.ts`
- **Technical Rationale:** When a user or API client explicitly provides a `themeId` that does not exist or is inactive, silently ignoring it and returning 201 violated API contracts and failed automated tests.
- **Implementation:** Return `400 Bad Request` with an explanatory error message when a requested theme cannot be resolved.
- **Verification:** `bash scripts/test-invitation-api.sh` test 7 passed with green checkmark (`✅ Invalid theme ID correctly rejected`).

### IMP-06: Database B-Tree Index Optimization
- **File:** `server/prisma/schema.prisma`
- **Technical Rationale:** Admin user searches and status toggles execute frequent queries filtered by `User.role`, `User.subscriptionTier`, and `Invitation.isPublished`.
- **Implementation:** Added `@@index([role])`, `@@index([subscriptionTier])` to model `User` and `@@index([isPublished])` to model `Invitation`. Ran `npx prisma db push`.
- **Verification:** Database synchronized in 7.71s, Prisma client re-generated.

### IMP-07: Frontend Vendor Chunk Splitting
- **File:** `web/vite.config.ts`
- **Technical Rationale:** Vite generated a single monolithic chunk (`893 kB`), triggering bundle size warnings and degrading First Contentful Paint.
- **Implementation:** Added `rollupOptions.output.manualChunks` separating `react`/`react-dom`/`react-router-dom` (162 kB), `framer-motion` (0.04 kB), and utilities (`axios`, `date-fns`, `zustand` - 79 kB).
- **Verification:** Main `index.js` dropped from 893 kB to 651 kB, total compilation time 2.43s.

### IMP-08: Path-Aware Admin Session Recovery
- **File:** `web/src/lib/api.ts`
- **Technical Rationale:** In the Axios response interceptor, failed token refreshes previously forced `window.location.href = '/login'`, disrupting administrators.
- **Implementation:** Added conditional redirection: if `pathname.startsWith('/admin')`, redirect to `/admin/login`.
- **Verification:** Expired admin calls navigate directly to the admin credential portal.

### IMP-09 to IMP-11: WCAG 2.1 AA Accessibility Remediations
- **Files:** `web/src/components/TemplateThumbnail.tsx`, `web/src/pages/Home.tsx`, `web/src/pages/TemplateGallery.tsx`, `web/src/pages/admin/Login.tsx`
- **Technical Rationale:** Automated a11y tests identified 20 unlabelled form inputs (inside scaled thumbnail previews), 2 missing button labels (mobile hamburger), and an absent `<h1>` heading on admin login.
- **Implementation:**
  - Decorated scaled thumbnail containers with `aria-hidden="true"` and `tabIndex={-1}`.
  - Added `aria-label="Toggle navigation menu"` to both hamburger menu buttons.
  - Replaced `<h2>` with semantic `<h1>` on Admin Login and corrected the demo fill password to `admin123`.
- **Verification:** Automated audit script `scripts/audit-e2e.js` reported 0 a11y issues on Home, Admin Login, Login, Signup, and 404 pages.

### IMP-12 to IMP-14: Search Engine Optimization & Production Metadata
- **Files:** `web/index.html`, `web/public/robots.txt`, `web/public/sitemap.xml`, `web/public/favicon.svg`
- **Technical Rationale:** Production websites require structured meta tags for social media previews (WhatsApp, iMessage, Twitter, Facebook) and crawler control files.
- **Implementation:**
  - Injected full Open Graph (`og:*`), Twitter Card (`twitter:*`), and theme color metadata.
  - Created standard `robots.txt` disallowing private user dashboards while allowing public celebration routes.
  - Created `sitemap.xml` listing primary canonical URLs.
  - Created a luxury vector SVG favicon.
- **Verification:** Verified files exist in `web/public/` and are bundled directly to `dist/`.

---

## 3. Regression Testing Matrix

| Test Suite | Execution Command | Result | Notes |
| :--- | :--- | :--- | :--- |
| **Authentication API** | `bash scripts/test-auth-api.sh` | **100% PASS** | 11/11 tests passing (Signup, Duplicate check, Login, Bad password, Refresh, Reset, Logout) |
| **Host Invitation API** | `bash scripts/test-invitation-api.sh` | **100% PASS** | 13/13 tests passing (Auth required, Creation, Unique slugs, Invalid theme, Ownership checks) |
| **Multi-Viewport Audit** | `node scripts/audit-e2e.js` | **100% PASS** | 6 pages x 3 viewports: 0 console errors, 0 network errors, 0 horizontal overflows |
| **User Journey Flow** | `node scripts/verify-all-journeys.js` | **100% PASS** | Full lifecycle: Visitor -> Registration -> Create -> Edit -> Pay -> Public Live -> Admin |
| **Frontend Production Build** | `cd web && npm run build` | **100% PASS** | TypeScript compiler clean, 0 type errors, optimized bundle chunking |
| **Backend Production Build** | `cd server && npm run build` | **100% PASS** | TypeScript compiler clean, Prisma client generated, 0 type errors |

