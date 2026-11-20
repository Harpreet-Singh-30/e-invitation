# 16. Actionable Task Backlog & Sprint Cards

> **Document Version:** 1.0.0  
> **Author:** Senior Project Manager  
> **Status:** Sprint Ready  
> **Traceability:** Mapped to Milestones M2, M3, and M4

---

## 1. Definition of Done (DoD) Standard

A backlog card is only marked **DONE** when all of the following conditions are met:
1. **Code Complete:** Code is written, peer-reviewed, and follows TypeScript and ESLint standards.
2. **Schema & Migration:** Any database changes are captured in Prisma migrations and deployed.
3. **Automated Verification:** The change is covered by unit tests or an automated browser test run.
4. **No Visual Regressions:** Verified on 375px mobile viewport with photographic proof.
5. **Documentation Updated:** Documented in `project-documentation/` if architecture, API, or requirements are affected.

---

## 2. Sprint Backlog: Immediate Milestone Deliverables

### Card TSK-M2-01: Audit All 16 Archetype Components for Dynamic Phrasing
* **Milestone:** M2 (AI Studio & Occasion Diversity)
* **Priority:** **P0** (Blocker) | **Story Points:** 3 | **Estimate:** 1 Day
* **User Story:** *As a host creating a birthday or anniversary invitation, I want all template headings to reflect my celebration type so that my guests never see "Wedding Invitation" on my birthday site.*
* **Acceptance Criteria:**
  1. Inspect all 16 files in `web/src/templates/components/`.
  2. Replace static `"Wedding Invitation"` strings with dynamic helper `getOccasionHeading(invitation.occasion)`.
  3. Ensure that if `couple.bride` is empty or missing, single-celebrant phrasing is used.
* **Definition of Done:** Browser audit of birthday and baby shower previews proves 0 wedding wording leaks.

---

### Card TSK-M3-01: Mount Raw Body Parser for Razorpay Webhook Signatures
* **Milestone:** M3 (Commercial Engine)
* **Priority:** **P0** (Critical) | **Story Points:** 2 | **Estimate:** 0.5 Day
* **User Story:** *As a paying host, I want my payment to immediately unlock premium features without failing signature verification so that my invitation is instantly upgraded.*
* **Acceptance Criteria:**
  1. Modify `server/src/index.ts` to mount `express.raw({ type: 'application/json' })` exclusively on the `/api/payments/webhook` route before `express.json()`.
  2. Verify HMAC SHA-256 signature using `crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)`.
  3. Update invitation tier to `STANDARD` or `PREMIUM` upon `payment.captured` event.
* **Definition of Done:** Simulated Razorpay webhook event successfully passes signature check and updates DB status to `PAID`.

---

### Card TSK-M3-02: Enforce Watermark & Feature Gating Based on Active Tier
* **Milestone:** M3 (Commercial Engine)
* **Priority:** **P0** (Critical) | **Story Points:** 3 | **Estimate:** 1 Day
* **User Story:** *As a platform owner, I want free invitations to display an elegant "Powered by InviteHub" badge and premium invitations to be completely unbranded so that hosts have a strong incentive to upgrade.*
* **Acceptance Criteria:**
  1. If `invitation.tier === 'FREE'`, render subtle InviteHub watermark in the fixed bottom sheet.
  2. If `invitation.tier === 'STANDARD' | 'PREMIUM' | 'PLATINUM'`, completely suppress watermark.
  3. Enforce guest RSVP limits: Free tier capped at 25 submissions; attempts beyond 25 prompt the host to upgrade.
* **Definition of Done:** Verified in browser that upgrading an invitation immediately removes the watermark badge.

---

### Card TSK-M4-01: WhatsApp 1-Click Share Link Generator
* **Milestone:** M4 (Guest Management)
* **Priority:** **P1** (High) | **Story Points:** 2 | **Estimate:** 0.5 Day
* **User Story:** *As a host on mobile, I want a "Share to WhatsApp" button with pre-formatted message text so that I can dispatch invitations to my contacts with a single tap.*
* **Acceptance Criteria:**
  1. Add "Share via WhatsApp" button on Host Dashboard and Invitation Editor.
  2. Clicking opens `https://wa.me/?text=[ENCODED_MESSAGE]`.
  3. Message text dynamically formats: *"You're warmly invited to celebrate with [Honorees]! Open your personalized digital invitation here: [URL]"*.
* **Definition of Done:** Tapping button launches WhatsApp client with pre-filled message and valid URL.

---

### Card TSK-M4-02: Guest List CSV Import & RSVP Data Exporter
* **Milestone:** M4 (Guest Management)
* **Priority:** **P1** (High) | **Story Points:** 3 | **Estimate:** 1.5 Days
* **User Story:** *As a host coordinating catering, I want to export all RSVP responses into an Excel/CSV spreadsheet so that I can hand exact dietary counts to my caterer.*
* **Acceptance Criteria:**
  1. Add "Export to CSV" button on `GuestManager.tsx`.
  2. Generate clean CSV file containing: Guest Name, Email, Phone, Status (Attending/Declined), Headcount, Dietary Preference, Message, Submission Date.
  3. Support drag-and-drop CSV upload to pre-populate guest lists.
* **Definition of Done:** Host clicks export and receives valid CSV file that opens in Microsoft Excel / Google Sheets without formatting corruption.

