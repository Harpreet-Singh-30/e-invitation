# InviteHub — Task Backlog & Execution Roadmap

This document outlines prioritized development tasks categorized by milestone and engineering discipline.

---

## 🎯 Active Milestone: Core Stability & Production Readiness

### Priority 1: High-Impact Stability & Hardening (Immediate)
- [x] **TSK-101:** Fix single-celebrant occasion structure in template adapter and studio preview.
- [x] **TSK-102:** Implement dynamic generative synthesis engine with cultural prompt parsing and fast-fail API key checks.
- [x] **TSK-103:** Inject universal CSS variable tokens across all template preview viewports.
- [x] **TSK-104:** Implement public guest RSVP submission route (`POST /api/public/invitations/:slug/rsvp`).
- [x] **TSK-105:** Unify `eventType` and `occasionType` across all public invitation endpoints.
- [x] **TSK-106:** Establish automated end-to-end regression test suite covering all 3 core journeys.

### Priority 2: Host Experience & Workflow Polish
- [ ] **TSK-201:** Add guest list export (CSV/Excel) in Host Dashboard for received RSVPs.
- [ ] **TSK-202:** Enhance RSVP notification emails/SMS triggers for hosts upon guest confirmation.
- [ ] **TSK-203:** Integrate image compression and WebP conversion for host photo uploads.
- [ ] **TSK-204:** Add QR code generator widget on Host Dashboard for direct invitation sharing.

### Priority 3: Security & Operational Readiness
- [ ] **TSK-301:** Implement rate limiting middleware on public RSVP and auth endpoints using Redis or memory store.
- [ ] **TSK-302:** Enable Content Security Policy (CSP) headers in Express backend.
- [ ] **TSK-303:** Implement automated database backup cron job script.
- [ ] **TSK-304:** Configure live Razorpay / Stripe gateway credentials for production payment processing.

### Priority 4: Performance & Optimization
- [ ] **TSK-401:** Lazy load non-active template archetype components to reduce initial bundle chunk size.
- [ ] **TSK-402:** Add service worker or PWA caching for offline invitation viewing.
- [ ] **TSK-403:** Optimize Google Fonts loading via `font-display: swap` across all template heads.

