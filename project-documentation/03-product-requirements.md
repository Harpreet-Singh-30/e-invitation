# 03. Product Requirements Document (PRD)

> **Document Version:** 2.0.0  
> **Author:** Senior Project Manager (PM)  
> **Status:** Approved Baseline  
> **Scope:** Multi-Occasion Event Website & Digital Invitation Platform

---

## 1. Problem Statement & Strategic Goals

### 1.1 The Problem
Traditional wedding and event invitations suffer from four fundamental flaws:
1. **Static and Emotionless:** Printed cards or static image files cannot convey the atmosphere of the celebration.
2. **Logistically Inefficient:** Hosts struggle to track RSVPs across WhatsApp chats, spreadsheets, and phone calls.
3. **Rigid Occasion Focus:** Existing luxury platforms are hardcoded for Western weddings and fail to support multi-day Indian functions, milestone birthdays, or single-celebrant events.
4. **Slow Template Creation:** Designing new digital templates traditionally requires engineering sprints to code custom HTML/CSS layouts.

### 1.2 Platform Goals
* **G1:** Enable any host to create, preview, and publish a luxury mobile invitation website in under 5 minutes.
* **G2:** Provide guests with an unforgettable unboxing experience featuring interactive wax seals, music, itineraries, and 1-click directions.
* **G3:** Support seamless switching between 9 occasion types with culturally authentic terminology and single vs. double honoree layouts.
* **G4:** Empower non-technical administrators to generate, tune, and publish new template products using natural language prompts via Google Gemini 2.5 Flash.

---

## 2. User Personas

### Persona 1: Host Harpreet (The Celebration Planner)
* **Demographics:** 31-year-old marketing manager, planning his 30th birthday sundowner in Goa and his sister's traditional wedding in Chandigarh.
* **Needs:** Wants a digital invitation that looks as upscale as a luxury fashion brand. Needs to collect dietary preferences and track headcounts effortlessly.
* **Key Tasks:** Browse templates, customize colors and itinerary, share link on WhatsApp, monitor incoming RSVPs on mobile.

### Persona 2: Guest Gaurav (The Smartphone Attendee)
* **Demographics:** 28-year-old consultant, receives the invitation link via WhatsApp message while in transit.
* **Needs:** Instant loading without app installation; clear event timings; direct navigation link to Google Maps; fast 2-tap RSVP submission.
* **Key Tasks:** Click link, tap the wax seal to open, view itinerary, tap "Directions", confirm attendance with dietary note.

### Persona 3: Admin Aisha (The Template Product Designer)
* **Demographics:** Platform administrator and creative director managing InviteHub's commercial catalog.
* **Needs:** Ability to respond rapidly to seasonal trends (e.g., Bollywood retro themes, Diwali parties) without requesting software engineering sprints.
* **Key Tasks:** Enter prompt into Gemini AI Studio ("Create a Punjabi Phulkari Anand Karaj theme"), preview phone mockup, tweak color swatches, click "Publish to Catalog".

---

## 3. Functional Requirements (FR)

### FR-01: Multi-Occasion Template Discovery & Gallery
* **Description:** Public catalog displaying all published themes with real-time filtering.
* **Acceptance Criteria:**
  1. Gallery MUST categorize templates across 9 occasions: Wedding, Birthday, Anniversary, Baby Shower, Housewarming, Engagement, Cocktail/Party, Religious, Festival.
  2. Each theme card MUST show thumbnail preview, occasion badge, pricing tier (Free, Standard, Premium), and live preview action button.
  3. Filter chips MUST filter catalog instantly without full page reloads.

### FR-02: Template Live Preview with Viewport Switcher
* **Description:** Dedicated preview experience for prospective hosts.
* **Acceptance Criteria:**
  1. The preview page MUST allow switching between "Mobile Frame" (iPhone mockup) and "Expanded Desktop" views.
  2. The preview MUST render the exact interactive template component with sample data appropriate to that theme's occasion.
  3. Clicking "Use This Template" MUST initiate the invitation creation wizard with that theme pre-selected.

### FR-03: Multi-Occasion Dynamic Phrasing & Honoree Logic
* **Description:** Intelligent handling of single-celebrant vs. couple-based occasions.
* **Acceptance Criteria:**
  1. For `wedding` and `anniversary`: The UI MUST prompt for two partners (`couple.groom` and `couple.bride` or `partner1` and `partner2`).
  2. For `birthday`, `baby_shower`, and `housewarming`: The UI MUST prompt for a single honoree/host. The template MUST NOT display "Wedding Invitation" or "Bride & Groom" headings.
  3. When an occasion is single-celebrant, template headers MUST dynamically output "Birthday Celebration", "Baby Shower", or "Housewarming Ceremony".

### FR-04: Host Invitation Creation Wizard
* **Description:** Streamlined 4-step wizard for building a new invitation.
* **Acceptance Criteria:**
  1. Step 1 (Occasion): Select occasion type from visual grid.
  2. Step 2 (Theme): Pick from filtered list of themes matching the chosen occasion.
  3. Step 3 (Details): Enter event title, honoree names, primary date, venue city, and custom URL slug.
  4. Step 4 (Review & Generate): Validate unique slug availability and create draft record in database.

### FR-05: Real-Time Invitation Customization Studio
* **Description:** Split-screen editor allowing hosts to modify content with instant visual feedback.
* **Acceptance Criteria:**
  1. Left panel tabs: Event Details, Theme & Colors, Multi-Event Itinerary, Story & Photos, Music & RSVP Settings.
  2. Right panel MUST display an interactive mobile phone iframe/frame rendering real-time edits without saving delays.
  3. Form inputs MUST support color picker overrides, font size adjustments, and custom photo uploads.

### FR-06: Multi-Event Itinerary Management
* **Description:** Structured sub-event scheduler supporting multi-day celebrations.
* **Acceptance Criteria:**
  1. Hosts can add, edit, reorder, and delete sub-events (e.g., Sangeet, Haldi, Reception).
  2. Each sub-event MUST contain: Event Name, Date, Start Time, End Time, Venue Name, Address, Google Maps URL, and Dress Code.
  3. Guests can click "Add to Calendar" (`.ics` generation) for individual events or the full itinerary.

### FR-07: Interactive Sealed Gate Experience
* **Description:** Guest unboxing micro-interaction prior to revealing the invitation content.
* **Acceptance Criteria:**
  1. First visit MUST present a luxury envelope or royal sealed gate with host monogram and wax seal.
  2. Tapping the seal MUST trigger a realistic break-and-unfold animation with optional soft audio chime.
  3. After opening, state MUST persist in browser `sessionStorage` so refreshing does not force guests to re-break the seal repeatedly.

### FR-08: Guest RSVP Collection & Dietary Management
* **Description:** Public guest response submission form embedded in the invitation.
* **Acceptance Criteria:**
  1. Form fields: Guest Full Name, Email/Phone, Attendance Status (Attending, Regretfully Decline), Number of Guests, Dietary Preference (Vegetarian, Non-Veg, Jain, Vegan, Gluten-Free), and Personal Message for Hosts.
  2. Submitting an RSVP MUST record an entry in the `Rsvp` table and update the host's headcount dashboard immediately.
  3. Host can export the RSVP list to CSV from the host dashboard.

### FR-09: Tier Upgrades & Razorpay Payment Integration
* **Description:** Checkout flow for activating Standard (₹299) or Premium (₹499) features.
* **Acceptance Criteria:**
  1. Host initiates upgrade from editor or dashboard; backend creates a Razorpay order via `/api/payments/create-order`.
  2. Client launches Razorpay Checkout modal supporting UPI, Credit/Debit cards, and Netbanking.
  3. On completion, webhook/signature verification `/api/payments/verify` validates the payment hash and elevates the invitation tier.

### FR-10: Admin Gemini AI Template Product Studio
* **Description:** Conversational prompt-driven template generation studio for administrators.
* **Acceptance Criteria:**
  1. Admin types natural language prompt (e.g., "Create a modern pastel baby shower theme with soft clouds").
  2. Backend calls Google Gemini 2.5 Flash with structured schema constraints.
  3. Gemini returns valid template configuration: archetype component, color tokens, font families, decorative borders, and occasion sample data.
  4. Live phone preview updates instantly. Admin can conversationally refine (e.g., "Make the gold warmer") and click "Publish to Catalog" to commit to database.

---

## 4. Non-Functional Requirements (NFR)

| Category | Requirement | Target Metric / Standard |
|---|---|---|
| **Performance** | Mobile Page Load (FCP) | First Contentful Paint < 1.2s on 4G networks |
| **Performance** | Template Render (LCP) | Largest Contentful Paint < 2.0s |
| **Responsiveness** | Mobile Viewport Fit | 100% bug-free rendering from 320px to 430px mobile viewports |
| **Security** | Authentication | JWT tokens signed with SHA-256; passwords hashed with bcrypt (salt 10) |
| **Security** | Authorization | Strict RBAC; hosts cannot read/edit invitations belonging to other hosts |
| **Availability** | Server Uptime | 99.9% uptime target via Vercel serverless / managed cloud |
| **Accessibility** | WCAG Compliance | Contrast ratios >= 4.5:1 for all primary body text and buttons |
| **SEO & Social** | OpenGraph Cards | Dynamic meta tags (`og:title`, `og:image`, `og:description`) for WhatsApp preview links |

