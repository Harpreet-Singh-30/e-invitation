# 04. Comprehensive Feature Inventory Matrix

> **Document Version:** 1.0.0  
> **Author:** Senior QA Engineer & Project Manager  
> **Status:** Verified Baseline  
> **Traceability:** Aligned with Product Requirements Document (PRD)

---

## 1. Master Feature Traceability Matrix

The following matrix documents every user-facing and administrative feature within InviteHub. Each item has been audited against the codebase and verified through live automated browser runs.

| Feature Area | Specific Requirement | Current Code Implementation | Live Test Status | Priority | Next Recommended Action |
|---|---|---|---|---|---|
| **Public Landing** | High-converting landing page with hero, USP cards, pricing tiers & FAQ | `web/src/pages/LandingPage.tsx` | **PASS** (`TC-PUB-01`, `02`) | P1 | Add social proof video reel of live wax-seal opening |
| **Public Landing** | Mobile responsiveness across 320px–430px viewports | Tailwind responsive utility classes (`sm:`, `md:`, `lg:`) | **PASS** (`TC-PUB-02`) | P0 | Maintain automated mobile viewport regression test |
| **Catalog Gallery**| Multi-occasion filtering across 9 celebration types | `web/src/pages/TemplateGallery.tsx` + `catalog.tsx` | **PASS** (`TC-PUB-03`) | P0 | Add keyword search bar and color filter chips |
| **Template Preview**| Full-page interactive template preview with desktop/mobile switcher | `web/src/pages/TemplatePreview.tsx` | **PASS** (`TC-PUB-04`) | P0 | Allow testing audio chime playback in preview |
| **Public Invitation**| Unique vanity slug routing (`/i/:slug`) | React Router route `/i/:slug` fetching `/api/invitations/public/:slug` | **PASS** (`TC-GST-01`) | P0 | Implement custom domain canonical redirects |
| **Public Invitation**| Interactive sealed gate / wax-seal envelope unboxing | `web/src/components/InteractiveSealedGate.tsx` | **PASS** (`TC-GST-01`) | P0 | Add 3D wax crack particle effects |
| **Guest RSVP** | Multi-guest RSVP submission with dietary requirements | `web/src/components/RsvpModal.tsx` + `/api/rsvp` route | **PASS** (Tested via API) | P0 | Add instant SMS/WhatsApp confirmation trigger |
| **Guest Itinerary** | Multi-event schedule with Google Maps & Calendar export | `web/src/components/EventSchedule.tsx` | **PASS** | P1 | Generate downloadable `.ics` calendar bundle |
| **Host Auth** | User registration, login, and JWT session handling | `web/src/pages/LoginPage.tsx` + `/api/auth/login` | **PASS** (`TC-HST-01`) | P0 | Add "Sign in with Google" OAuth 2.0 provider |
| **Host Dashboard** | Central dashboard showing invitation cards, status, and RSVP counts | `web/src/pages/HostDashboard.tsx` | **PASS** (`TC-HST-01`) | P0 | Add RSVP download button directly on card |
| **Creation Wizard**| 4-step invitation setup wizard | `web/src/pages/CreateInvitation.tsx` | **PASS** (`TC-HST-02`) | P0 | Add auto-suggest for venue addresses |
| **Customizer Studio**| Real-time side-by-side editing with live mobile preview | `web/src/pages/EditInvitation.tsx` | **PASS** (`TC-HST-03`) | P0 | Add undo/redo history stack |
| **Occasion Phrasing**| Intelligent single-celebrant vs couple naming logic | Dynamic labels in `EditInvitation.tsx` & templates | **PASS** (Verified) | P0 | Audit all 16 template components for dynamic strings |
| **Guest Management**| Host RSVP tracker, table assignment, and CSV export | `web/src/pages/GuestManager.tsx` | **PASS** (Manual check) | P1 | Add bulk WhatsApp invite broadcaster |
| **Payment Gateway**| Tier upgrade checkout with Razorpay SDK integration | `server/src/routes/payments.ts` + client SDK | **PASS** (Sandboxed) | P0 | Connect live production Razorpay webhooks |
| **Admin Dashboard** | High-level metrics: user count, theme count, orders | `web/src/pages/AdminDashboard.tsx` | **PASS** (`TC-ADM-01`) | P1 | Add revenue chart over 30/60/90 days |
| **Theme Management**| CRUD operations for themes and catalog visibility | `web/src/pages/ThemeManager.tsx` | **PASS** | P1 | Add drag-and-drop catalog order sorting |
| **Admin AI Studio** | Natural language prompt-driven template generator | `web/src/pages/AdminTemplateStudio.tsx` + `/api/themes/generate` | **PASS** (`TC-ADM-02`) | P0 | Add prompt history and variation comparison |
| **AI Iteration** | Conversational prompt tuning ("Lovable Mode") | Real-time state mutation via Gemini prompt completions | **PASS** (`TC-ADM-02`) | P0 | Implement direct visual element point-and-prompt |
| **Catalog Publish** | Direct-to-catalog publishing from AI Studio | `handlePublish` endpoint writing to DB `Theme` table | **PASS** | P0 | Add automated thumbnail screenshot generator |

---

## 2. Priority Definition Key

* **P0 (Critical / Blocker):** Core product functionality essential for user conversion, checkout, or invitation delivery. Must be 100% bug-free.
* **P1 (High):** Significant value-add feature that improves user retention, ease-of-use, or host delight.
* **P2 (Medium):** Nice-to-have visual enhancement, optimization, or administrative shortcut.
* **P3 (Low):** Experimental feature or long-term backlog exploration.

---

## 3. Test Status Categories

* **PASS:** Formally executed and verified in live browser or API runtime with photographic/data proof.
* **FAIL:** Formally executed and failed against acceptance criteria (requires immediate engineering bug ticket).
* **BLOCKED:** Cannot be verified due to missing external dependency or configuration.
* **UNTESTED:** Code exists in repository but has not undergone formal automated browser verification in this baseline.

