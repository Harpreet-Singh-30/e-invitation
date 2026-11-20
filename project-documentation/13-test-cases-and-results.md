# 13. Test Cases, Execution Logs & Visual Evidence

> **Document Version:** 1.0.0  
> **Author:** Senior QA Engineer  
> **Test Harness:** Headless Chromium (Puppeteer-core)  
> **Execution Date:** November 17, 2026  
> **Overall Pass Rate:** 10/10 (100% Pass)

---

## 1. Test Execution Summary

A full end-to-end regression audit was executed against the running local environment (`http://localhost:5173` frontend, `http://localhost:3000` backend). All 10 mission-critical user journeys passed functional verification.

```
========================================================================================
Test Suite: InviteHub Full-System Automated Audit Suite
Run Date: 2026-11-17T07:06:17Z
Target Environment: Node.js 20 / Express / React 18 / PostgreSQL (Supabase)
Total Tests: 10 | Passed: 10 | Failed: 0 | Blocked: 0
========================================================================================
```

---

## 2. Test Case Specifications & Execution Logs

### TC-PUB-01: Public Landing Page Desktop Render
* **Role:** Public Guest / Visitor
* **Target URL:** `http://localhost:5173/`
* **Test Steps:**
  1. Launch Chromium with desktop viewport (1280x800).
  2. Navigate to root URL `/`.
  3. Wait for network idle and hero section rendering.
  4. Verify page title, hero headline, CTA buttons, and pricing tiers.
* **Expected Result:** Landing page renders with zero errors. Page title is `"InviteHub - Luxury Online Wedding & Celebration Websites"`. Hero text displays `"Beautiful Invitations for Every Celebration"`.
* **Actual Result:** **PASS**. All hero elements, feature pillars, pricing tiers (₹0, ₹299, ₹499), and CTA buttons rendered cleanly.
* **Visual Proof:**  
  ![Homepage Desktop](assets/screenshots/01_homepage_desktop.png)

---

### TC-PUB-02: Public Landing Page Mobile Viewport (375px)
* **Role:** Public Guest / Mobile Visitor
* **Target URL:** `http://localhost:5173/`
* **Test Steps:**
  1. Configure browser viewport to mobile dimensions (375x812, iPhone scale).
  2. Load `/` and evaluate hamburger navigation and stacked responsive cards.
  3. Verify horizontal scrolling does not overflow the 375px boundary.
* **Expected Result:** Seamless single-column responsive stacking with accessible touch targets.
* **Actual Result:** **PASS**. Layout adapts without horizontal overflow or overlapping text.
* **Visual Proof:**  
  ![Homepage Mobile](assets/screenshots/01_homepage_mobile.png)

---

### TC-PUB-03: Template Catalog Gallery & Filter Chips
* **Role:** Public Guest / Prospective Host
* **Target URL:** `http://localhost:5173/templates`
* **Test Steps:**
  1. Navigate to `/templates`.
  2. Inspect catalog container and count active template cards.
  3. Verify occasion filter pills (All, Wedding, Birthday, Anniversary, etc.).
* **Expected Result:** Catalog displays all active curated theme cards.
* **Actual Result:** **PASS**. Discovered 62 interactive theme cards with occasion badges, pricing tiers, and hover preview triggers.
* **Visual Proof:**  
  ![Template Gallery](assets/screenshots/02_template_gallery.png)

---

### TC-PUB-04: Full-Page Template Preview with Viewport Switcher
* **Role:** Public Guest / Prospective Host
* **Target URL:** `http://localhost:5173/templates/royal-maroon`
* **Test Steps:**
  1. Open preview page for `royal-maroon`.
  2. Test viewport toggle buttons (Mobile Frame vs. Expanded Desktop).
  3. Verify that the RoyalMaroon archetype renders with sample wedding data.
* **Expected Result:** Dynamic preview renders with decorative maroon borders, gold typography, and itinerary cards.
* **Actual Result:** **PASS**. RoyalMaroonTemplate renders inside mobile frame mockup with zero console errors.
* **Visual Proof:**  
  ![Template Preview](assets/screenshots/03_template_preview_royal_maroon.png)

---

### TC-GST-01: Public Live Invitation Gate & Wax Seal Unboxing
* **Role:** Smartphone Guest
* **Target URL:** `http://localhost:5173/i/rohan-priya-wedding`
* **Test Steps:**
  1. Open live vanity invitation URL `/i/rohan-priya-wedding`.
  2. Verify appearance of interactive wax seal gate with couple monogram.
  3. Trigger click on wax seal button.
  4. Verify envelope unsealing animation and disclosure of wedding details.
* **Expected Result:** Interactive gate displays "Rohan & Priya" and "Tap to Open". Clicking seal reveals the invitation website.
* **Actual Result:** **PASS**. Sealed gate unboxed successfully, revealing the full multi-event itinerary and RSVP button.
* **Visual Proof:**  
  ![Live Invitation](assets/screenshots/04_public_invitation_live.png)

---

### TC-HST-01: Host Authentication & Control Dashboard
* **Role:** Authenticated Host
* **Target URL:** `http://localhost:5173/login` -> `http://localhost:5173/dashboard`
* **Test Steps:**
  1. Submit credentials for `test@example.com`.
  2. Verify receipt of signed JWT token in localStorage.
  3. Verify automatic redirection to `/dashboard`.
  4. Inspect active invitation cards, RSVP counters, and "Create New Invitation" button.
* **Expected Result:** Dashboard loads with authenticated host profile and list of invitations.
* **Actual Result:** **PASS**. Dashboard renders invitations, publish badges, and RSVP statistics.
* **Visual Proof:**  
  ![Host Dashboard](assets/screenshots/05_host_dashboard.png)

---

### TC-HST-02: 4-Step Invitation Creation Wizard
* **Role:** Authenticated Host
* **Target URL:** `http://localhost:5173/invitations/new`
* **Test Steps:**
  1. Launch wizard from dashboard.
  2. Select occasion ("Birthday").
  3. Choose template archetype.
  4. Input event title, honoree name, date, and custom slug.
* **Expected Result:** Form validates input and progresses through all 4 wizard steps.
* **Actual Result:** **PASS**. Wizard successfully validates fields and provides a clean user progression.
* **Visual Proof:**  
  ![Creation Wizard](assets/screenshots/06_create_invitation_wizard.png)

---

### TC-HST-03: Live Customization Studio with Real-Time Phone Preview
* **Role:** Authenticated Host
* **Target URL:** `http://localhost:5173/invitations/df2857d6-e851-4083-a680-fff09b764dff/edit`
* **Test Steps:**
  1. Open customizer studio for an existing invitation.
  2. Verify split-screen layout (Form controls on left, iPhone frame on right).
  3. Verify that the assigned archetype (`ImperialBurgundyTemplate`) renders inside the phone frame without "missing template" errors.
* **Expected Result:** Template component renders seamlessly in phone frame with real-time editing capability.
* **Actual Result:** **PASS**. Template rendered with rich burgundy background, couple details, and event cards.
* **Visual Proof:**  
  ![Invitation Editor](assets/screenshots/07_invitation_editor_live_preview.png)

---

### TC-ADM-01: Admin Master Metrics & System Dashboard
* **Role:** System Administrator
* **Target URL:** `http://localhost:5173/admin/dashboard`
* **Test Steps:**
  1. Authenticate with admin account (`admin@wedding-saas.com`).
  2. Navigate to `/admin/dashboard`.
  3. Verify platform KPIs: total users (13), total themes (19), active invitations (14), and quick actions.
* **Expected Result:** Admin dashboard displays high-level platform health metrics.
* **Actual Result:** **PASS**. Metrics cards, navigation links, and theme tables rendered correctly.
* **Visual Proof:**  
  ![Admin Dashboard](assets/screenshots/08_admin_dashboard.png)

---

### TC-ADM-02: Admin AI Template Product Studio ("Lovable Mode")
* **Role:** System Administrator
* **Target URL:** `http://localhost:5173/admin/studio`
* **Test Steps:**
  1. Open `/admin/studio`.
  2. Enter natural language prompt: *"Create a Goan beach birthday party invitation"*.
  3. Click "Generate Template Product".
  4. Verify that Google Gemini 2.5 Flash returns a structured theme specification.
  5. Verify that the mobile phone mockup re-renders with the coastal archetype, sand/teal palette, and birthday copy.
  6. Test conversational prompt iteration in the chat box.
* **Expected Result:** Live phone preview instantly updates with AI-generated theme. Conversational adjustments apply without reload.
* **Actual Result:** **PASS**. Template Studio generated the theme, rendered CoastalPearlTemplate in the phone frame, and successfully updated live state.
* **Visual Proof:**  
  ![Admin AI Template Studio](assets/screenshots/09_admin_template_studio.png)

