# InviteHub — QA Test Execution & Regression Results

**Execution Date:** 2026-11-20  
**Environment:** Local Development (`http://localhost:3000` / `http://localhost:5173`)  
**Overall Regression Pass Rate:** **100% Across Both API & Live Browser Test Suites**  

---

## 🌐 Full End-to-End Headless Chrome Browser Workflow Run (2026-11-20)

A comprehensive real-user browser test suite was automated using Google Chrome 155 (`puppeteer-core`) executing all user roles sequentially:

```text
=================================================
STARTING FULL END-TO-END BROWSER WORKFLOW TESTING
=================================================

--- [STEP 1] ADMIN WORKFLOW: TEMPLATE STUDIO ---
1.1 Logging in as Admin (admin@wedding-saas.com)... [PASS]
1.2 Navigating to /admin/studio... [PASS]
1.3 Prompt generation: "Create luxury velvet milestone birthday celebration"... [PASS]
1.4 Conversational AI iteration (Renaming honoree & shifting accents)... [PASS]
1.5 Interactive tabs inspection (Product, Design, Content, Events, Seals)... [PASS]
1.7 Publishing template to live catalog... [PASS]
    -> Screenshot: 01_admin_template_studio_published.png
1.8 Admin Dashboard Themes catalog verification... [PASS]
    -> Screenshot: 01b_admin_dashboard_themes.png

--- [STEP 2] HOST WORKFLOW: INVITATION CREATION & PUBLISH ---
2.1 Clean Host login (test@example.com)... [PASS]
2.2 Browsing /templates gallery with Birthday filter... [PASS]
    -> Screenshot: 02a_host_templates_gallery.png
2.3 Creating invitation: "Vikram 30th Milestone Gala"... [PASS]
2.4 Invitation Editor customization (dynamic honoree labels, tagline)... [PASS]
    -> Screenshot: 02b_host_invitation_editor.png
2.5 Payment Modal simulation & checkout authorization... [PASS]
    -> Screenshot: 02c_payment_modal_filled.png
    -> Screenshot: 02d_payment_success_live.png
    -> Published Live URL: http://localhost:5173/i/vikram-30th-milestone-gala-mwoz2pcj

--- [STEP 3] GUEST WORKFLOW: PUBLIC LIVE SITE & RSVP ---
3.1 Unauthenticated Guest landing on live URL... [PASS]
    -> Screenshot: 03a_guest_gate_screen.png
3.2 Envelope/Gate animated opening & Hero reveal... [PASS]
    -> Screenshot: 03b_guest_hero_and_events.png
3.3 Interactive RSVP form submission (headcount, wishes)... [PASS]
    -> Screenshot: 03c_guest_rsvp_filled.png
    -> Status: HTTP 201 Created

--- [STEP 4] HOST DASHBOARD RSVP VERIFICATION ---
4.1 Host Dashboard metrics verification & active event tracking... [PASS]
    -> Screenshot: 04_host_dashboard_verified.png

=================================================
FULL END-TO-END BROWSER WORKFLOW TESTING PASSED!
=================================================
```

---

## 📸 Browser Workflow Screenshot Evidence Matrix

| Step | User Role | Screen / Action | Screenshot File |
| :--- | :--- | :--- | :--- |
| **1.1** | Admin | Template Studio (Generation & Publish) | `01_admin_template_studio_published.png` |
| **1.2** | Admin | Dashboard Themes Table | `01b_admin_dashboard_themes.png` |
| **2.1** | Host | Catalog Filtering by Category | `02a_host_templates_gallery.png` |
| **2.2** | Host | Dynamic Invitation Editor | `02b_host_invitation_editor.png` |
| **2.3** | Host | Simulated Payment Modal (Checkout) | `02c_payment_modal_filled.png` |
| **2.4** | Host | Payment Verified & Live URL Activated | `02d_payment_success_live.png` |
| **3.1** | Guest | Luxury Opening Gate / Envelope | `03a_guest_gate_screen.png` |
| **3.2** | Guest | Celebrant Hero Banner & Event Schedule | `03b_guest_hero_and_events.png` |
| **3.3** | Guest | Interactive RSVP Submission | `03c_guest_rsvp_filled.png` |
| **4.1** | Host | Dashboard Metric & Guest Counter Update | `04_host_dashboard_verified.png` |

---

## 🧪 Automated API Regression Test Suite Run

```text
[PASS] Guest  -> List Public Themes (Count: 20)
[PASS] Guest  -> Get Theme By Slug (coastal-pearl)
[PASS] Host   -> Host Login (test@example.com)
[PASS] Host   -> Create Birthday Invitation (InvId: 936dd771-9c49-497d-983d-d7d4a93fb5c1)
[PASS] Host   -> Update Invitation Details & Itinerary
[PASS] Host   -> Pay & Publish Invitation (Live URL: /i/aryan-30th-birthday-bash-1)
[PASS] Guest  -> View Live Published Birthday Invitation (Occasion: birthday, Title: Aryan 30th Birthday Bash)
[PASS] Guest  -> Submit Public RSVP (Guest: Kabir Mehta, Attending: true, Count: 2)
[PASS] Admin  -> Admin Login (admin@wedding-saas.com)
[PASS] Admin  -> AI Generate Birthday Template (Archetype: PhulkariCelebrationTemplate, Bride: "")
[PASS] Admin  -> AI Conversational Adjustment (Groom: Balwinder Singh, Primary: #065F46)
[PASS] Admin  -> Publish New Template to Catalog (Theme ID: cdb06306-2bcc-46da-80f6-96d206b0ca01)

=======================================================
TOTAL TESTS RUN: 12 | PASSED: 12 | FAILED: 0 | SKIPPED: 0
SUCCESS RATE: 100%
=======================================================
```

---

## 🔍 Detailed Test Case Analysis

### TC-01: Public Themes Catalog Discovery
- **Action:** `GET /api/public/themes`
- **Expected:** Returns HTTP 200 with active themes array.
- **Observed:** Returned 20 active theme records including default and newly published templates.
- **Result:** **PASS**

### TC-02: Public Theme Details Lookup
- **Action:** `GET /api/public/themes/coastal-pearl`
- **Expected:** Returns theme metadata with unpacked sample data.
- **Observed:** Successfully retrieved `coastal-pearl` theme with full color tokens and category.
- **Result:** **PASS**

### TC-03: Host Authentication
- **Action:** `POST /api/auth/login` with `test@example.com`
- **Expected:** Returns HTTP 200 with signed JWT `accessToken`.
- **Observed:** Received valid JWT token with user object (`role: user`).
- **Result:** **PASS**

### TC-04: Non-Wedding Invitation Creation
- **Action:** `POST /api/host/invitations` with `occasionType: "birthday"`
- **Expected:** Creates invitation record with `eventType: "birthday"`.
- **Observed:** Created record `936dd771-9c49-497d-983d-d7d4a93fb5c1` with slug `aryan-30th-birthday-bash-1`.
- **Result:** **PASS**

### TC-05: Host Itinerary & Form Updates
- **Action:** `PUT /api/host/invitations/:id` with custom tagline, welcome message, and event details.
- **Expected:** Updates database record and returns updated payload.
- **Observed:** Tagline `"Turning 30 under the Goan sun and stars"` persisted.
- **Result:** **PASS**

### TC-06: Invitation Payment & Instant Publishing
- **Action:** `POST /api/host/invitations/:id/pay` with simulated card payment.
- **Expected:** Atomic transaction creates payment record and marks invitation as `isPublished: true`, `isLive: true`.
- **Observed:** Payment recorded with transaction ID, returned `publicUrl: "/i/aryan-30th-birthday-bash-1"`.
- **Result:** **PASS**

### TC-07: Public Live Invitation Access
- **Action:** `GET /api/public/invitations/aryan-30th-birthday-bash-1`
- **Expected:** Returns public invitation payload containing `occasionType: "birthday"`.
- **Observed:** Successfully loaded live invitation with single celebrant data.
- **Result:** **PASS**

### TC-08: Interactive Guest RSVP Submission
- **Action:** `POST /api/public/invitations/:slug/rsvp`
- **Expected:** Creates Guest and Rsvp record; returns 201 Created.
- **Observed:** Successfully recorded RSVP for guest `Kabir Mehta` with `isAttending: true`.
- **Result:** **PASS**

### TC-09: Admin Authentication
- **Action:** `POST /api/auth/login` with `admin@wedding-saas.com`
- **Expected:** Returns valid admin JWT.
- **Observed:** Authenticated as `role: admin`.
- **Result:** **PASS**

### TC-10: Occasion-Aware Dynamic AI Generation
- **Action:** `POST /api/admin/ai/generate-template` with `"Create punjabi style birthday invitation"`
- **Expected:** Generates template with archetype `PhulkariCelebrationTemplate`, single honoree, `bride: ""`.
- **Observed:** Generated name `Punjabi Style Birthday`, archetype `PhulkariCelebrationTemplate`, `groom: "Harpreet Singh"`, `bride: ""`.
- **Result:** **PASS**

### TC-11: Conversational AI Iteration
- **Action:** `POST /api/admin/ai/adjust-template` with feedback *"Change palette to emerald green and antique gold and rename honoree to Balwinder Singh"*
- **Expected:** Updates primary color to `#065F46` and groom to `Balwinder Singh`.
- **Observed:** Output reflected exact color tokens and celebrant name.
- **Result:** **PASS**

### TC-12: Publishing Template Product to Catalog
- **Action:** `POST /api/admin/themes`
- **Expected:** Persists theme record in database catalog with packed sample data.
- **Observed:** Theme created with ID `cdb06306-2bcc-46da-80f6-96d206b0ca01` and immediately available in catalog.
- **Result:** **PASS**


---

## 🚀 Headless Browser Workflow Step 5: Category Selection & Template Flow (2026-11-20)

```text
--- [STEP 5] HOST WORKFLOW: CATEGORY SELECTION & TEMPLATE MIGRATION ---
5.1 Clean Host login (test@example.com)... [PASS]
5.2 Navigating to /invitations/new (Occasion selection)... [PASS]
    -> Screenshot: 05a_create_invitation_category_selection.png
5.3 Selecting "Birthday" category -> redirects to /templates?category=birthday... [PASS]
    -> Screenshot: 05b_category_templates_page_birthday.png
5.4 Selecting Birthday template "Golden Milestone Soirée"... [PASS]
5.5 Step 3 confirmation with Selected Design card & custom title... [PASS]
    -> Screenshot: 05c_create_invitation_named_and_ready.png
5.6 Landing on Invitation Editor with Golden Milestone loaded... [PASS]
    -> Screenshot: 05d_invitation_editor_birthday_verified.png
```

---

## 🎯 Headless Browser Workflow Step 6: Event Live Preview Render & Auto-Scroll (2026-11-20)

```text
--- [STEP 6] HOST WORKFLOW: EVENT LIVE PREVIEW SYNC & VIEWPORT SCROLL ---
6.1 Host login (test@example.com)... [PASS]
6.2 Open Sunny & Kunti Editor (/invitations/6756dfe2-2a27-4f66-bda0-502cdc632345/edit)... [PASS]
6.3 Switch to "Events" tab -> Preview automatically scrolls to #itinerary... [PASS]
    -> Screenshot: 06a_editor_events_tab_active.png
    -> Event 1 ("The Wedding Ceremony & Reception") & Event 2 ("Celebration Event 2") visible in DOM with opacity: 1.
6.4 Click "+ Add Function" -> Event 3 ("Celebration Event 3") created... [PASS]
    -> Preview iframe smoothly auto-scrolls to events itinerary (scrollY: 1391px, itineraryTop: 0.42px).
    -> All 3 events computed style verified: opacity: 1, visibility: visible.
    -> Screenshot: 06b_editor_third_event_added_and_scrolled.png
6.5 Test Preview Toolbar Quick Jump pill "🗓️ Events (3)"... [PASS]
    -> Screenshot: 06c_quick_jump_preview_itinerary.png
```

| Step | User Role | Screen / Action | Screenshot File |
| :--- | :--- | :--- | :--- |
| **5.1** | Host | Category Selection Grid | `05a_create_invitation_category_selection.png` |
| **5.2** | Host | Filtered Category Templates | `05b_category_templates_page_birthday.png` |
| **5.3** | Host | Selected Design Confirmation | `05c_create_invitation_named_and_ready.png` |
| **5.4** | Host | Editor with Category Template | `05d_invitation_editor_birthday_verified.png` |
| **6.1** | Host | Events Tab Active & Auto-Scrolled | `06a_editor_events_tab_active.png` |
| **6.2** | Host | 3rd Event Added & Live Preview Scrolled | `06b_editor_third_event_added_and_scrolled.png` |
| **6.3** | Host | Quick Jump Toolbar Navigation | `06c_quick_jump_preview_itinerary.png` |
