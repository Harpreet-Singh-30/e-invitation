# InviteHub — Workflow Verification & Journey Status

This document defines the verified operational status of all critical user journeys across Guest, Host, and Admin roles.

---

## 1. Journey 1: Guest / Public Experience

```
[Guest Visits Site] ──► [Browses /templates] ──► [Selects Template Preview] ──► [Clicks Use Template]
                                                                                        │
                                                                                        ▼
[Guest Receives Invite Link] ──► [Unlocks Envelope Gate] ──► [Views Hero & Events] ──► [Submits RSVP]
```

- **Workflow Steps:**
  1. **Template Browsing (`/templates`):** Filters by occasion category (`Wedding`, `Birthday`, `Anniversary`, etc.).
  2. **Bespoke Preview (`/templates/:slug/preview`):** Loads template in responsive frame, showing occasion-specific sample content.
  3. **Live Invitation Access (`/i/:slug`):**
     - Opening animation (wax seal / ribbon / wave click).
     - Hero banner with single honoree or couple names.
     - Event schedule cards with time, venue address, and map links.
     - Interactive RSVP form.
  4. **RSVP Submission (`POST /api/public/invitations/:slug/rsvp`):**
     - Submits name, attending headcount, dietary preference, and custom message.
     - Returns 201 Created and persists RSVP to database.
- **Verification Status:** **PASS (100%)**

---

## 2. Journey 2: Host Invitation Creation & Publishing

```
[Host Signs In] ──► [Dashboard] ──► [Create Invitation] ──► [Invitation Editor] ──► [Pay & Publish] ──► [Live URL]
```

- **Workflow Steps:**
  1. **Host Login (`/login`):** Authenticates with email & password, receives JWT token.
  2. **Create Wizard (`/invitations/new`):**
     - Selects occasion category (e.g. Birthday).
     - Enters invitation title.
     - Links pre-selected template from sessionStorage if arriving from catalog.
  3. **Invitation Editor (`/invitations/:id/edit`):**
     - Form dynamically adapts labels (e.g. "Birthday Person / Celebrant's Name" instead of "Groom's Name", hides "Bride's Name").
     - Edits itinerary events (title, date, time, venue, dress code).
     - Live preview frame updates in real time.
     - Saves changes (`PUT /api/host/invitations/:id`).
  4. **Payment & Publish (`POST /api/host/invitations/:id/pay`):**
     - Simulated checkout transaction.
     - Marks invitation as `isPublished: true` and `isLive: true`.
     - Assigns public URL (`/i/:slug`).
- **Verification Status:** **PASS (100%)**

---

## 3. Journey 3: Admin Template Product Studio

```
[Admin Signs In] ──► [/admin/studio] ──► [Describe Vision in AI Copilot] ──► [Dynamic Generation]
                                                                                    │
                                                                                    ▼
[Catalog Live Link] ◄── [Publish to Catalog] ◄── [Manual Tabs & Conversational Tweaks]
```

- **Workflow Steps:**
  1. **Studio Access (`/admin/studio`):** Restricted to `role: admin`.
  2. **AI Copilot Prompt Generation:**
     - User enters prompt (e.g., *"Create punjabi style birthday invitation"*).
     - Backend evaluates prompt, extracts cultural themes, routes to appropriate archetype (`PhulkariCelebrationTemplate`), and dynamically generates rich itineraries.
  3. **Conversational Iteration (Lovable Mode):**
     - Admin asks to modify colors (*"Change palette to emerald green and antique gold"*).
     - Admin asks to change honoree (*"Rename honoree to Balwinder Singh"*).
     - Admin asks to add events (*"Add a Sufi Sangeet night event"*).
     - Studio immediately recalculates design tokens and updates the live preview frame.
  4. **Direct Manual Property Tabs:**
     - Product Info (name, slug, category, pricing tier).
     - Design & Colors (color picker tokens, typography).
     - Showcase Content (honoree name, tagline, welcome message).
     - Itinerary Events (add/edit/delete events).
     - Features & Seals (toggle music player, interactive RSVP, gate animation).
  5. **Publish to Catalog (`POST /api/admin/themes` or `PUT /api/admin/themes/:id`):**
     - Saves theme record with packed `sampleData`.
     - Theme instantly appears in public catalog and is ready for hosts to select.
- **Verification Status:** **PASS (100%)**

