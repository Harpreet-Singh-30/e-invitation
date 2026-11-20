# 14. Known Issues, Technical Debt & Architectural Risk Analysis

> **Document Version:** 1.0.0  
> **Author:** Senior Technical Architect & QA Lead  
> **Status:** Active Tracking  
> **Triage Baseline:** November 17, 2026

---

## 1. Resolved Historical Defects (Regression Watchlist)

### 1.1 Bug FIX-01: Wedding Wording Leak on Birthday Occasions
* **Symptom:** In earlier iterations of the Admin AI Template Studio, when an administrator requested a "birthday party theme", the generated preview displayed "Wedding Invitation" and "Bride & Groom" text over birthday honoree names.
* **Root Cause Analysis:** Archetype React templates had hardcoded JSX headings (e.g., `<h2>Wedding Invitation</h2>`) rather than dynamically resolving headers from `invitation.occasion` or checking whether `couple.bride` was empty.
* **Resolution Implemented:** Dynamic phrasing helpers were added across `web/src/templates/` and `AdminTemplateStudio.tsx` that evaluate `occasion`:
  ```typescript
  const getOccasionHeading = (occasion: string) => {
    switch(occasion?.toLowerCase()) {
      case 'birthday': return 'Birthday Celebration';
      case 'baby_shower': return 'Baby Shower';
      case 'housewarming': return 'Housewarming Ceremony';
      case 'anniversary': return 'Anniversary Celebration';
      default: return 'Wedding Invitation';
    }
  };
  ```
* **Regression Test:** Verified in `TC-ADM-02` (Goan beach birthday rendered without "Wedding" text).

---

## 2. Active Technical Debt & Architectural Risks

### 2.1 Technical Debt Item 1: Template Registry Identifier Normalization
* **Impact:** Medium | **Priority:** P1
* **Description:** In the database, the `Theme` table historically stored identifiers using mixed conventions: some records store `templateComponent: "RoyalMaroonTemplate"`, while others store UUIDs or legacy slugs like `"royal-maroon"`.
* **Current Mitigation:** `web/src/templates/registry.ts` uses extensive normalization fallback logic (converting kebab-case to PascalCase and mapping legacy slugs).
* **Recommended Permanent Fix:** Run a database migration script to standardize all `templateComponent` values to strict PascalCase component archetype names (`RoyalMaroonTemplate`, `CoastalPearlTemplate`).

### 2.2 Technical Debt Item 2: Supabase PostgreSQL Connection Limits in Serverless
* **Impact:** High | **Priority:** P0 (Pre-Production Scale)
* **Description:** When deployed on Vercel or serverless environments, each incoming HTTP request can spin up an ephemeral Node.js instance. Without connection pooling, rapid bursts of traffic can exhaust Supabase PostgreSQL connection limits (often capped at 60–100 direct connections).
* **Current Mitigation:** Database URL uses Supabase's transaction connection pooler (`?pgbouncer=true`).
* **Recommended Permanent Fix:** Configure Prisma with `@prisma/extension-accelerate` or enforce strict connection pooling parameters (`connection_limit=5`) in the Prisma connection string to guarantee zero connection drops during traffic spikes.

### 2.3 Technical Debt Item 3: Browser Audio Autoplay Policy Restrictions
* **Impact:** Low | **Priority:** P2
* **Description:** Modern mobile browsers (iOS Safari, Chrome Mobile) block audio autoplay unless initiated by an explicit user gesture. If a host sets background music, browsers will reject automatic audio playback on initial page load.
* **Current Mitigation:** The audio play trigger is tied directly to the "Tap to Open" wax seal button on `InteractiveSealedGate.tsx`. When the guest taps the wax seal, that user gesture is used to play the celebration music.
* **Recommended Enhancement:** Add a persistent mute/unmute floating toggle button in the bottom navigation bar so guests can easily mute music in quiet public spaces.

### 2.4 Technical Debt Item 4: CI/CD Automated Test Pipeline
* **Impact:** Medium | **Priority:** P1
* **Description:** Automated testing currently relies on locally triggered Puppeteer scripts (`full_system_audit.js`). There is no GitHub Actions workflow executing these tests automatically on pull requests.
* **Recommended Fix:** Set up `.github/workflows/e2e.yml` to spin up PostgreSQL, run `npm test`, execute headless browser audits, and block PR merges if any test fails.

### 2.5 Technical Debt Item 5: Razorpay Webhook Signature Verification
* **Impact:** High | **Priority:** P0
* **Description:** While client-side checkout and order creation are functional, production webhooks require raw request body parsing (`express.raw()`) to compute HMAC SHA-256 signatures accurately. If the Express JSON body parser parses the body before signature verification, the hash check can fail.
* **Recommended Fix:** Ensure `/api/payments/webhook` mounts `express.raw({ type: 'application/json' })` prior to `express.json()` in `server/src/index.ts`.

