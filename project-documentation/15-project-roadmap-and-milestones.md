# 15. Strategic Project Roadmap & Milestone Plan

> **Document Version:** 1.0.0  
> **Author:** Senior Project Manager & Technical Architect  
> **Status:** Approved Baseline  
> **Roadmap Horizon:** Q4 2026 – Q2 2027

---

## 1. Roadmap Architecture & Milestones Overview

InviteHub's delivery roadmap is structured into 5 cohesive phases, prioritizing stability, conversion, and commercial monetization before advanced enterprise features.

```mermaid
gantt
    title InviteHub Strategic Milestone Delivery Roadmap
    dateFormat  YYYY-MM-DD
    section Milestones
    M1: Core Foundation Stabilization (Completed)    :done, m1, 2026-10-01, 2026-11-14
    M2: AI Template Studio & Occasion Diversity    :active, m2, 2026-11-15, 2026-11-30
    M3: Commercial Engine & Razorpay Production    :m3, 2026-12-01, 2026-12-20
    M4: Guest Management & WhatsApp Integration    :m4, 2026-12-21, 2027-01-20
    M5: Global Scale, Edge Caching & Custom Domains :m5, 2027-01-21, 2027-02-28
```

---

## 2. Milestone Breakdown & Scope

### Milestone M1: Core Foundation Stabilization
* **Status:** **COMPLETED & VERIFIED**
* **Primary Objective:** Build a decoupled, high-performance monorepo foundation with full database persistence and verified mobile template rendering.
* **Key Deliverables:**
  * Decoupled Vite SPA (`web/`) and Express REST API (`server/`).
  * Supabase PostgreSQL database schema managed via Prisma ORM.
  * 16 concrete React archetype components in `web/src/templates/`.
  * Dynamic template resolution engine (`registry.ts`).
  * 10 core automated E2E browser test cases passing with visual proof.
* **Exit Criteria:** Zero compilation errors, 100% test pass rate in headless browser suite.

---

### Milestone M2: Admin AI Template Studio & Multi-Occasion Diversity
* **Status:** **CURRENT SPRINT (Active)**
* **Primary Objective:** Empower non-technical administrators to generate, tune, and publish multi-occasion templates using natural language via Google Gemini 2.5 Flash.
* **Key Deliverables:**
  * Implementation of `/admin/studio` with phone mockup frame and chat copilot.
  * Integration with Google Gemini 2.5 Flash with structured design system schema.
  * Conversational iteration ("Lovable Mode") for instant palette and font tuning.
  * Occasion phrasing logic ensuring single-celebrant events do not show wedding text.
  * One-click direct publishing from AI Studio to live database catalog.
* **Exit Criteria:** Admin can generate and publish a new birthday or anniversary template in under 60 seconds without code changes.

---

### Milestone M3: Commercial Engine & Razorpay Production Hardening
* **Status:** **NEXT SPRINT (Ready for Execution)**
* **Primary Objective:** Secure end-to-end monetization, allowing hosts to seamlessly purchase Standard (₹299) and Premium (₹499) tiers via UPI and cards.
* **Key Deliverables:**
  * Switch from Razorpay sandbox credentials to live production merchant keys.
  * Implement raw body parsing for HMAC-SHA256 webhook signature validation.
  * Automated watermark removal upon payment confirmation.
  * Automated GST-compliant PDF invoice generation and email receipt.
  * Failure and retry handling for dropped network connections during checkout.
* **Exit Criteria:** Real monetary transaction of ₹299 successfully processed via UPI, elevating an invitation to Standard tier with verified webhook receipt.

---

### Milestone M4: Guest Experience & WhatsApp Integration
* **Status:** **PLANNED**
* **Primary Objective:** Turn InviteHub into the viral growth engine for hosts by simplifying WhatsApp distribution and guest RSVP tracking.
* **Key Deliverables:**
  * 1-Click WhatsApp Broadcast Link Generator (pre-filled message with guest name and vanity link).
  * CSV/Excel guest list import with auto-generated personalized RSVP links.
  * Instant WhatsApp / SMS confirmation upon guest RSVP submission.
  * Dietary and attendance breakdown charts on host dashboard.
  * Guest seating and table management planner.
* **Exit Criteria:** Host can upload a 100-contact spreadsheet and generate individual personalized links in 5 seconds.

---

### Milestone M5: Global Scale, Edge Caching & Custom Domains
* **Status:** **FUTURE ENHANCEMENT**
* **Primary Objective:** Enable global performance and white-label branding for luxury destination weddings and corporate events.
* **Key Deliverables:**
  * Custom domain mapping (e.g., `rohanandpriya.com` mapped directly to an invitation).
  * Vercel Edge caching for static public invitation assets (<50ms response times worldwide).
  * Internationalization (i18n) support (Hindi, Punjabi, Gujarati, Spanish, French).
  * Multi-currency checkout (USD, GBP, AED, CAD, EUR) via Stripe / Razorpay International.
* **Exit Criteria:** Invitation rendered from edge cache under 100ms internationally with custom domain routing.

---

## 3. Work Classification & Priority Breakdown

| Milestone | Scope Item | Classification | Priority |
|---|---|---|:---:|
| **M2** | Dynamic Occasion Header Validation across all 16 Archetypes | Bugfix / Hardening | **P0** |
| **M2** | Admin Studio Prompt History & Saved Drafts | New Feature | **P1** |
| **M3** | Razorpay Production Merchant Configuration | Commercial Enablement | **P0** |
| **M3** | Webhook Raw Body HMAC Signature Verification | Security & Resilience | **P0** |
| **M3** | Automatic Watermark Removal Logic | Feature Completion | **P0** |
| **M4** | WhatsApp Share Sheet with Dynamic Preview Image | Viral Growth | **P1** |
| **M4** | Guest List CSV Bulk Importer | Host Productivity | **P1** |
| **M5** | Custom Domain White-Labeling Engine | Enterprise Upsell | **P2** |
| **M5** | Multi-Currency International Payment Gateway | Revenue Expansion | **P2** |

