# 12. Quality Assurance & Testing Strategy

> **Document Version:** 1.0.0  
> **Author:** Senior QA Engineer & Test Automation Lead  
> **Status:** Approved Baseline  
> **Testing Scope:** End-to-End, Visual Regression, Integration & Security

---

## 1. Quality Engineering Philosophy

The luxury event space demands absolute visual and functional excellence. A broken link, an overflowing text label, an off-center wax seal, or a failing RSVP form on a wedding day causes severe emotional distress for hosts and irreparable brand damage.

Our QA strategy adheres to a **Zero-Defect Public Surface** standard:
1. **Never Assume It Works:** Features cannot be declared complete simply because code compiles or runs locally. All user journeys must be verified in an automated live browser environment.
2. **Mobile Viewport Primacy:** Every visual component must be tested on small mobile viewports (375px/390px) where real guests interact with invitations.
3. **Data Integrity:** RSVPs and payment records must be recorded with 100% consistency and zero data loss.

---

## 2. The Test Pyramid & Execution Levels

```
                     ▲
                    / \
                   /   \
                  / E2E \       <-- Automated Headless Chrome
                 /───────\          (Puppeteer/Playwright, 10 Scenarios)
                / Integr. \     <-- Express API & Prisma DB Integration
               /───────────\        (Supertest, Route Validations)
              /  Unit Tests \   <-- Template Registry & Helper Utilities
             /───────────────\      (Vitest / Jest)
```

### Level 1: Unit & Component Tests
* **Scope:** Individual utility functions, date formatters, slug generators, and template registry lookups (`getTemplateComponent`).
* **Tooling:** Vitest / Jest.
* **Target:** Fast feedback (<5s run time), verifying edge cases (e.g., malformed template slugs, missing couple names, empty itinerary arrays).

### Level 2: API & Integration Tests
* **Scope:** Express route handlers interacting with Prisma and the PostgreSQL database.
* **Tooling:** Supertest against local Express instance.
* **Target:** Validate HTTP status codes, JSON response schemas, JWT authentication guards, and validation errors.

### Level 3: Automated Browser End-to-End (E2E) Tests
* **Scope:** Full-stack simulated user interactions in real Chromium instances.
* **Tooling:** Puppeteer / Playwright headless test harnesses.
* **Target:** Verify layout rendering, wax seal animations, modal interactions, form submissions, and screenshot captures.

---

## 3. Bug Classification & Triage Standards

When defects are discovered, they are triaged according to standard Severity and Priority definitions:

### 3.1 Severity Levels
* **S1 (Blocker):** Application crash, total inability to open an invitation, failing RSVP submissions, or payment processing failure.
* **S2 (Critical):** Core workflow blocked with no workaround (e.g., host cannot save invitation edits, template preview crashes).
* **S3 (Major):** Visual distortion on mobile, incorrect occasion phrasing (e.g., wedding text on birthday theme), or missing data in itinerary.
* **S4 (Minor):** Minor CSS misalignments, typo in non-critical label, or suboptimal animation timing.
* **S5 (Trivial):** Cosmetic cosmetic tweak that does not impact usability.

### 3.2 Priority Tiers
* **P0:** Must be resolved immediately before any release or marketing announcement.
* **P1:** Must be resolved within the current sprint cycle.
* **P2:** Scheduled for the subsequent development milestone.
* **P3:** Backlog item; nice to have.

---

## 4. Release Acceptance & Sign-off Criteria

Before any code branch is merged into `main` and promoted to production:

1. **Automated E2E Suite Passes:** All 10 core browser audit test cases (TC-PUB-01 to TC-ADM-02) must pass with zero failures.
2. **Visual Proof Attached:** Fresh screenshots of the homepage, gallery, public invitation, editor, and admin studio must be archived.
3. **No S1/S2 Defects:** Zero open Blocker or Critical bugs in the issue tracker.
4. **Prisma Schema Synchronized:** All database migrations applied and verified against the target environment.
5. **Console Cleanliness:** Browser console must be free of unhandled exceptions or React key warning errors during navigation.

