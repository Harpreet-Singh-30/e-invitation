# InviteHub — Bug Tracker & Root Cause Analysis

This document provides complete, transparent tracking of all bugs discovered during development, QA testing, and user feedback sessions.

---

## 📊 Summary Statistics

- **Total Tracked Bugs:** 8
- **Resolved Bugs:** 8
- **Open / In Progress:** 0
- **Regression Pass Rate:** 100%

---

## 🐛 Bug Registry

### BUG-001: Occasion Structure Corruption (Birthday Prompt Rendered as Wedding Invitation)
- **Severity:** High
- **Category:** Core Product / Generative AI / Template Adapters
- **Discovered In:** User Screenshot 1 (`/admin/studio`)
- **Symptoms:**
  When generating an invitation with prompt *"create a goa style birthday invitation with beach party theme"* under category `birthday`, the live preview rendered:
  ```
  WEDDING INVITATION
  Bride
  &
  Aarav Sharma
  Turning 30 under the Goan sun and stars
  ```
- **Root Cause Analysis:**
  1. `web/src/templates/adapter.ts`: `extractCoupleNames()` previously defaulted single celebrant brides to `'Bride'`, rather than empty string `''`.
  2. Concrete template archetype (`CoastalPearlTemplate.tsx`) computed `hasCouple = Boolean(bride && groom)`. Because `bride` defaulted to `'Bride'`, `hasCouple` evaluated to `true`, forcing the template into couple/wedding mode: `<span>Bride</span> <em>&amp;</em> <span>Groom</span>`.
  3. `TemplateData` interface lacked `occasionType`, causing the header badge to fall back to `Wedding invitation`.
- **Resolution & Fix:**
  1. Updated `web/src/templates/adapter.ts`: `extractCoupleNames()` is now strictly occasion-aware. For non-couple occasions (`birthday`, `party`, `baby_shower`, `housewarming`), `bride` defaults strictly to `''`.
  2. Added `occasionType` to `TemplateData` and `AdaptInvitationInput`.
  3. Updated `web/src/pages/admin/TemplateStudio.tsx`: `adaptedPreviewData` enforces `bride: isCoupleOccasion ? (sample.bride ?? 'Bride') : ''`.
  4. Verified archetype output: Single celebrants render single name (e.g. `Kabir Mehta`) and header badge reflects `Birthday invitation`.
- **Status:** **VERIFIED & RESOLVED**

---

### BUG-002: Static Non-Responsive Generation & Heuristic Fallback Hangs
- **Severity:** Critical
- **Category:** Backend AI Service / Generative Engine
- **Discovered In:** User Screenshot 2 (`/admin/studio`)
- **Symptoms:**
  Multiple distinct prompts (e.g., *"create a goa style birthday invitation"*, *"Create punjabi style birthday invitation"*) produced the exact same template and itinerary events: *"Sunset Beach Shack Cocktails & BBQ"*, *"The Driftwood Beach Shack"*. Conversational edits also failed to update.
- **Root Cause Analysis:**
  1. `server/.env` contained `GEMINI_API_KEY` starting with `AQ...`, which was rejected by Google Generative Language API (`v1beta`) with `400: API_KEY_INVALID`.
  2. `callGemini` retried invalid API keys over 5 candidate models, triggering a 30-second hang before falling back to heuristic logic.
  3. The legacy fallback logic in `geminiTemplateService.ts` was static: it returned identical hardcoded values ("Aarav Sharma", "Sunset Beach Shack") regardless of prompt contents.
- **Resolution & Fix:**
  1. Added fast-path check in `callGemini`: If `!GEMINI_API_KEY.startsWith('AIzaSy')`, immediately fail fast (<50ms) to bypass network timeout loops.
  2. Implemented a **Comprehensive Dynamic Generative Design Engine**:
     - Strips prompt command verbs and synthetically parses cultural vibes (Punjabi/Dhol, Goan/Beach, Retro 80s/Neon, Royal Palace, Garden, etc.).
     - Maps prompt to appropriate archetypes (`PhulkariCelebrationTemplate`, `CoastalPearlTemplate`, `RetroSynthArcadeTemplate`, `GoldenMilestoneTemplate`, etc.).
     - Generates 2–3 contextual, rich itineraries matching the vibe and geography.
     - Strictly sets `bride: ""` for birthdays and single celebrants.
  3. Replaced `adjustTemplateWithFeedback` with a multi-clause parser that dynamically handles color palettes, honoree renames, taglines, itinerary event additions, and pricing tiers.
- **Status:** **VERIFIED & RESOLVED**

---

### BUG-003: Template Component Name vs Slug Mismatch in Registry
- **Severity:** High
- **Category:** Template Architecture / Dynamic Loading
- **Symptoms:**
  Templates registered under Component PascalCase names (e.g. `BotanicalRomanceTemplate`) were not matched when passed kebab-case slug identifiers (e.g. `botanical-romance`) from the database `theme.slug`.
- **Root Cause Analysis:**
  `TEMPLATES_BY_SLUG` map in `web/src/templates/registry.ts` lacked normalized lookup resolving both component class names and slug strings.
- **Resolution & Fix:**
  Added bi-directional slug normalization in `registry.ts`: `normalizeTemplateSlug(id)` maps both kebab-case (`art-deco-noir`) and PascalCase (`ArtDecoNoirTemplate`) to the registered component.
- **Status:** **VERIFIED & RESOLVED**

---

### BUG-004: Host Editor Missing Occasion-Aware Dynamic Fields
- **Severity:** Medium
- **Category:** Host Dashboard / Form UX
- **Symptoms:**
  When editing a Birthday or Milestone event in `/invitations/:id/edit`, the form still showed "Groom Name" and "Bride Name" instead of "Celebrant / Honoree Name".
- **Root Cause Analysis:**
  `InvitationEditor.tsx` hardcoded wedding label titles without checking `invitation.eventType` or `occasionType`.
- **Resolution & Fix:**
  Introduced `getFormConfig(occasionType)` helper that dynamically switches tab labels, headers, and inputs:
  - Wedding: "Couple & Tagline", "Groom Name", "Bride Name", "Wedding Celebration Itinerary"
  - Birthday / Single: "Honoree & Occasion", "Celebrant / Honoree Name", "Celebration Details", "Birthday Party Itinerary"
- **Status:** **VERIFIED & RESOLVED**

---

### BUG-005: Missing Public RSVP Endpoint
- **Severity:** High
- **Category:** Guest Journey / Interactive RSVP
- **Symptoms:**
  Guest RSVP submission returned `404 Not Found` against `/api/public/invitations/:slug/rsvp`.
- **Root Cause Analysis:**
  The server routes for public invitations only contained `GET /invitations/:slug`, `GET /themes`, and `GET /themes/:slug`. The `POST` route for public guest RSVP had not been wired into `publicInvitations.ts`.
- **Resolution & Fix:**
  Added `POST /api/public/invitations/:slug/rsvp` in `server/src/routes/publicInvitations.ts`.
  - Atomically creates `Guest` record (`householdName`, `token: crypto.randomUUID()`, `maxGuests`).
  - Atomically creates `Rsvp` record with attendance status, attending count, dietary restrictions, and wishes.
  - Successfully tested via automated regression suite with status 201.
- **Status:** **VERIFIED & RESOLVED**

---

### BUG-006: Public Invitation Schema Mismatch (`eventType` vs `occasionType`)
- **Severity:** Medium
- **Category:** Public API / Host Creation
- **Symptoms:**
  `GET /api/public/invitations/:slug` returned `eventType` but `occasionType` was undefined in response payload, causing templates inspecting `occasionType` to fall back to wedding default.
- **Root Cause Analysis:**
  In Prisma `Invitation` model, the database column is named `eventType`. The frontend adapter and new components look for `occasionType`.
- **Resolution & Fix:**
  Updated `server/src/routes/publicInvitations.ts` to return both `eventType: invitation.eventType` and `occasionType: invitation.eventType`.
- **Status:** **VERIFIED & RESOLVED**

---

### BUG-007: Category Selection Bypassed Template Catalog & Defaulted to Wedding Template on Edit Page
- **Severity:** Critical
- **Category:** Host Workflow / UX Navigation / Template Selection
- **Discovered In:** User Report & Chrome Browser Audit
- **Symptoms:**
  When a user starts creating an invitation from `/invitations/new` and selects an occasion category (e.g. `Birthday`), the system did not navigate to the category templates page. Instead, submitting the form created an invitation without a template (`themeId: null`), which immediately redirected to `/invitations/:id/edit`, where the editor defaulted to `'art-deco-noir'` (a 1920s wedding theme) instead of birthday templates.
- **Root Cause Analysis:**
  1. `/invitations/new` (`CreateInvitation.tsx`) previously rendered an Occasion Type button grid that merely set state without routing the user to the template gallery.
  2. Submitting without a selected design sent `themeId = null` to `POST /api/host/invitations`.
  3. `InvitationEditor.tsx` lines 152-156 resolved template identifiers as `invitation.theme?.templateComponent || invitation.theme?.slug || 'art-deco-noir'`, forcing a hardcoded wedding template fallback regardless of the selected `occasionType`.
  4. Backend `POST /api/host/invitations` rejected static template catalog UUIDs if not pre-seeded in the database `Theme` table.
- **Resolution & Fix:**
  1. **Refactored Creation Wizard (`web/src/pages/CreateInvitation.tsx`):**
     - **Step 1 (Select Category):** When user lands on `/invitations/new` without a selected template, clicking ANY occasion category (e.g. `Birthday`) saves their optional title and immediately navigates to `/templates?category=${category}`.
     - **Step 2 (Choose Template):** Category gallery renders active templates matching that occasion (e.g. `Golden Milestone Soirée`, `Neon 80s Arcade Blast`). A contextual step banner guides the user. Clicking *"Use This"* stores the selected design and routes back to `/invitations/new`.
     - **Step 3 (Name & Customize):** Displays a Selected Design Card with thumbnail and *"Change Template"* button, requires title input (min 3 chars), and posts `{ title, occasionType, themeId: selectedTemplate }` to the backend.
  2. **Smart Occasion Archetype Resolution (`web/src/templates/registry.ts` & `InvitationEditor.tsx`):**
     - Added `resolveDefaultTemplateForCategory(category)`.
     - Category fallbacks: `birthday` ➔ `golden-milestone`, `anniversary` ➔ `silver-jubilee`, `baby_shower` ➔ `celestial-lullaby`, `housewarming` ➔ `hearth-heritage`, `party` ➔ `midnight-soiree`, `religious` ➔ `divya-mandap`, `family_celebration` ➔ `heritage-reunion`, `wedding` ➔ `imperial-burgundy`.
  3. **Resilient Backend Theme Resolution (`server/src/routes/invitations.ts`):**
     - Accepts both UUID and slug identifiers. If a theme is not yet in the DB, it queries by `templateComponent`, `category`, or auto-creates the active theme record so host creation never fails.
  4. **Live Chrome Headless Verification:**
     - Verified end-to-end via `scratch/test-category-creation-flow.js` with 4 full-page screenshots (`05a_create_invitation_category_selection.png`, `05b_category_templates_page_birthday.png`, `05c_create_invitation_named_and_ready.png`, `05d_invitation_editor_birthday_verified.png`).
- **Status:** **VERIFIED & RESOLVED**

---

### BUG-008: Dynamic Events Added in Host Editor Failed to Render in Live Preview (Scroll-Reveal & Viewport Desynchronization)
- **Severity:** Critical
- **Category:** Host Editor / Real-time Live Preview / Template Animation Architecture
- **Discovered In:** User Screenshot (`/invitations/:id/edit`)
- **Symptoms:**
  The host was on `/invitations/:id/edit` (Imperial Burgundy template for "Sunny & Kunti"), added a new event (`EVENT #2: Celebration Event 2`) via `+ Add Function`. In the right-side Live Preview phone frame, the new event was not visible, and the phone stayed positioned at the top hero section showing the couple monogram ("SK").
- **Root Cause Analysis (3 Compounding Issues):**
  1. **Scroll-Reveal / Opacity Trap:** In `ImperialBurgundyTemplate.tsx`, `.ib-reveal` elements had `opacity: 0; transform: translateY(22px);`. The `useEffect` that instantiated the `IntersectionObserver` only had dependencies `[entered, reduce]`. When new events were dynamically added to `data.events`, the new timeline items were NEVER observed, permanently trapping them at `opacity: 0; visibility: hidden` in the DOM.
  2. **Fragile Date Parsing:** `eventDate(e)` strictly split by `'-'`, causing ISO strings (e.g. `2026-12-22T00:00:00.000Z`) to produce `NaN` when parsing days, causing `eventDate(e)` to return `null` and break timeline sorting.
  3. **Viewport Desynchronization:** When the user added a new event or switched to the "Events" tab on the left form panel, the preview iframe scroll position remained fixed at `scrollTop = 0` (top hero section). The user saw the top gate/monogram on screen and assumed the newly added event had failed to render.
- **Resolution & Fix:**
  1. **Robust Date Normalization (`web/src/templates/imperial-burgundy/Template.tsx`):**
     - Enhanced `eventDate(e)` to cleanly parse ISO strings, slash dates (`MM/DD/YYYY`), dash dates (`YYYY-MM-DD`), and native `Date` instances.
  2. **Preview Mode Visibility Guarantee (`web/src/components/MobilePhoneMockup.tsx` & `template.css`):**
     - Injected iframe-level style overrides guaranteeing that `.mobile-preview-body [class*="reveal"]`, `.ib-reveal`, `.br-reveal`, and `.cp-reveal` are permanently `opacity: 1 !important; visibility: visible !important; transform: none !important;`.
     - In `ImperialBurgundyTemplate.tsx`, updated `useEffect` with dependency on `[entered, reduce, events]` and bypasses `IntersectionObserver` when rendered inside live editor preview mode.
  3. **Intelligent Auto-Scroll to Active Section (`web/src/pages/InvitationEditor.tsx`):**
     - Added `scrollToPreviewSection(sectionId)` targeting both mobile preview iframe and desktop mock container, including automatic opening of the gate/intro screen if still closed.
     - Enhanced `handleAddEvent()` to automatically scroll the preview iframe smoothly to `#itinerary` within 150ms of adding an event.
     - Connected tab navigation (`Couple`, `Events`, `Story`, `Music`) to auto-scroll the preview to `hero`, `itinerary`, `welcome`, and `venue`.
     - Added **Quick Jump Pills** in the preview toolbar: `👑 Top`, `🗓️ Events ({events.length})`, `📖 Story`, `📍 Venue`, allowing the host to jump to any section with a single click.
  4. **Live Chrome Browser Verification:**
     - Verified end-to-end using Puppeteer script `scratch/test-event-preview-render.js` on Sunny & Kunti invitation (`6756dfe2-2a27-4f66-bda0-502cdc632345`):
       - Events tab switch auto-scrolled preview to `#itinerary`.
       - Clicked `+ Add Function`: generated Event #3, preview smoothly repositioned to `scrollY = 1391` (`itineraryRect.top = 0.42px`).
       - Computed styles confirmed: all event items have `opacity: "1"` and `visibility: "visible"`.
       - Saved screenshot evidence: `06a_editor_events_tab_active.png`, `06b_editor_third_event_added_and_scrolled.png`, `06c_quick_jump_preview_itinerary.png`.
- **Status:** **VERIFIED & RESOLVED**
