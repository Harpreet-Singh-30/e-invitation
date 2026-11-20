# 02. Current State Technical Audit

> **Document Version:** 1.0.0  
> **Author:** Senior QA Engineer & Technical Architect  
> **Audit Date:** November 17, 2026  
> **Verification Status:** Fully Verified via Headless Browser & Prisma Inspection

---

## 1. Executive Codebase & Environment Summary

A forensic technical inspection of the repository (`/home/harpreet/E-invetation`) and its active runtime environments was conducted. The application is organized as a decoupled monorepo containing a modern Vite single-page application (`web/`), an Express REST backend (`server/`), and a PostgreSQL database managed via Prisma ORM (`server/prisma/`).

```
E-invetation/
├── web/                     # React 18 + Vite + Tailwind CSS Single Page Application
│   ├── src/
│   │   ├── components/      # UI components (Navbar, Footer, Modals, Forms)
│   │   ├── pages/           # Route views (Home, Gallery, Wizard, Editor, Admin)
│   │   ├── templates/       # 16 Concrete Template Components & Theme Registry
│   │   └── services/        # API client bindings (api.ts, gemini.ts, razorpay.ts)
├── server/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── routes/          # Express route controllers (auth, invitations, themes, rsvp)
│   │   ├── middleware/      # JWT auth, role validation, rate limiting
│   │   └── index.ts         # Server bootstrap, CORS configuration, error handlers
│   └── prisma/
│       ├── schema.prisma    # Authoritative relational database schema
│       └── migrations/      # Historical SQL migrations
└── project-documentation/   # Authoritative project documentation & audit artifacts
```

---

## 2. Technology Stack & Runtime Dependencies

### 2.1 Frontend (`web/package.json`)
* **Framework:** React 18.2.0 with React DOM 18.2.0
* **Build Tool:** Vite 5.0.0 (`@vitejs/plugin-react` 4.2.0)
* **Language:** TypeScript 5.2.2
* **Styling & Design:** Tailwind CSS 3.3.5, PostCSS 8.4.31, Autoprefixer 10.4.16
* **Icons & Animation:** Lucide React (`lucide-react` 0.292.0), Canvas Confetti (`canvas-confetti` 1.9.0)
* **Routing:** React Router DOM 6.20.0
* **Date & Utilities:** date-fns 2.30.0, clsx 2.0.0, tailwind-merge 2.0.0

### 2.2 Backend (`server/package.json`)
* **Runtime:** Node.js v20.x
* **HTTP Framework:** Express 4.18.2
* **Language & Execution:** TypeScript 5.2.2, ts-node-dev 2.0.0
* **Database Client:** Prisma Client 5.6.0 (`@prisma/client`)
* **Security & Auth:** JSON Web Token (`jsonwebtoken` 9.0.2), bcryptjs 2.4.3, CORS 2.8.5, dotenv 16.3.1
* **AI Engine:** Google Generative AI SDK (`@google/genai` / `@google/generative-ai` 0.1.1)
* **Payments:** Razorpay Node SDK (`razorpay` 2.9.2)

---

## 3. Database State Inspection (Prisma & PostgreSQL)

Direct database inspection executed against the live Supabase PostgreSQL database verified the following live entity counts:

| Table / Entity | Record Count | Notable Live Samples / Identifiers | Status |
|---|---|---|---|
| **User** | 13 | `admin@wedding-saas.com` (ADMIN), `test@example.com` (HOST), `free@example.com` (HOST) | Healthy |
| **Theme** | 19 | `RoyalMaroonTemplate`, `ModernFloralTemplate`, `CoastalPearlTemplate`, `PhulkariCelebrationTemplate` | Healthy |
| **Invitation** | 14 | `rohan-priya-wedding` (PUBLISHED), `aaravs-5th-birthday-party` (DRAFT), `df2857d6-e851-4083-a680-fff09b764dff` | Healthy |
| **Event** | 6 | Sangeet, Wedding Ceremony, Grand Reception, Sundowner BBQ | Healthy |
| **Guest** | 2 | Test Guests associated with sample invitations | Healthy |
| **Rsvp** | 1 | Confirmed attending RSVP with dietary preference | Healthy |
| **Payment** | 3 | Razorpay transaction records (Created, Paid) | Healthy |
| **Story** | 0 | Optional relationship milestone timeline entries | Empty (Optional) |
| **Notification** | 0 | Automated email/SMS trigger log | Inactive |

---

## 4. Frontend Route & View Inventory

The Vite application handles client-side routing via React Router DOM. All routes were crawled and verified:

| Path | Component | Auth Role | Description | Test Result |
|---|---|---|---|---|
| `/` | `LandingPage.tsx` | Public | High-converting landing page with hero, testimonials, pricing, and FAQ | **PASS** |
| `/templates` | `TemplateGallery.tsx` | Public | Filterable catalog showing 62 curated theme presets across 9 occasions | **PASS** |
| `/templates/:slug` | `TemplatePreview.tsx` | Public | Interactive full-page preview with viewport switcher (Desktop / Mobile) | **PASS** |
| `/i/:slug` | `PublicInvitation.tsx` | Public | Live guest-facing micro-app with interactive wax seal gate & RSVP form | **PASS** |
| `/login` | `LoginPage.tsx` | Public | Email and password login form with JWT token storage | **PASS** |
| `/register` | `RegisterPage.tsx` | Public | New host account creation | **PASS** |
| `/dashboard` | `HostDashboard.tsx` | Authenticated | Host control panel showing active invitations, RSVP stats, and quick links | **PASS** |
| `/invitations/new` | `CreateInvitation.tsx` | Authenticated | 4-step wizard: Occasion selection, theme picking, event details, review | **PASS** |
| `/invitations/:id/edit` | `EditInvitation.tsx` | Authenticated | Live side-by-side customization studio with phone mockup preview | **PASS** |
| `/invitations/:id/guests`| `GuestManager.tsx` | Authenticated | RSVP tracking, guest list CSV import/export, dietary tally | **PASS** |
| `/admin/dashboard` | `AdminDashboard.tsx` | Administrator | System overview: total users, active themes, revenue, platform settings | **PASS** |
| `/admin/themes` | `ThemeManager.tsx` | Administrator | CRUD manager for theme records and active catalog states | **PASS** |
| `/admin/studio` | `AdminTemplateStudio.tsx`| Administrator | AI Copilot "Lovable-Mode" prompt-driven template generation and tuning | **PASS** |

---

## 5. Backend REST API Route Inventory

The Express backend routes all requests through modular controllers mounted under `/api`:

| Method | Endpoint | Auth | Purpose | Verified |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create new host account | Yes |
| `POST` | `/api/auth/login` | Public | Issue signed JWT bearer token | Yes |
| `GET` | `/api/auth/me` | Bearer | Retrieve authenticated user profile | Yes |
| `POST` | `/api/admin/template-studio/generate` | Admin | Execute Gemini 2.5 Flash prompt to generate theme JSON | Yes |
| `POST` | `/api/admin/template-studio/publish` | Admin | Direct-publish generated template into live catalog | Yes |
| `GET` | `/api/admin/dashboard` | Admin | System KPIs, user counts, and revenue stats | Yes |
| `GET` | `/api/host/invitations` | Bearer | List current host's invitations | Yes |
| `POST` | `/api/host/invitations` | Bearer | Create new invitation record | Yes |
| `GET` | `/api/host/invitations/:id` | Bearer | Get full invitation details (events, couple, theme) | Yes |
| `PUT` | `/api/host/invitations/:id` | Bearer | Update invitation content, cover photo, itinerary | Yes |
| `POST` | `/api/host/invitations/:id/publish`| Bearer | Toggle published status and validate slug | Yes |
| `GET` | `/api/public/invitations/:slug`| Public | Fetch public invitation data for guest rendering | Yes |
| `POST` | `/api/public/rsvp` | Public | Submit guest RSVP response | Yes |
| `POST` | `/api/payments/create-order` | Bearer | Initialize Razorpay order with tier pricing | Yes |
| `POST` | `/api/payments/verify` | Bearer | Validate Razorpay signature and activate tier | Yes |

---

## 6. Template Registry & Component Archetypes

Template rendering uses `web/src/templates/registry.ts` which decouples database records from React components:

```
Database Theme Record (e.g. templateComponent: "RoyalMaroonTemplate")
                           │
                           ▼
          registry.ts (getTemplateComponent(id))
                           │
                           ▼
         React Template Component (16 Archetypes)
```

### Verified Concrete Template Components
1. `RoyalMaroonTemplate.tsx` — Traditional North Indian royal palace aesthetic (Maroon, Gold, Regal borders)
2. `ModernFloralTemplate.tsx` — Romantic pastel aesthetic with botanical illustrations
3. `ClassicGoldTemplate.tsx` — Formal typography-driven gold on cream layout
4. `BotanicalRomanceTemplate.tsx` — Lush eucalyptus and sage watercolor motif
5. `ImperialBurgundyTemplate.tsx` — Deep burgundy and champagne velvet aesthetic
6. `CoastalPearlTemplate.tsx` — Breezy oceanic palette designed for beach parties and Goa celebrations
7. `PhulkariCelebrationTemplate.tsx` — Vibrant Punjabi folk geometric motifs and festive colors
8. `IvoryKayalTemplate.tsx` — Serene South Indian backwaters and brass lamp aesthetic
9. `MarigoldCourtyardTemplate.tsx` — Auspicious yellow and orange marigold garland design
10. `MidnightVowsTemplate.tsx` — Moody celestial navy and starlight aesthetic
11. `ArtDecoGlamourTemplate.tsx` — 1920s Great Gatsby metallic gold geometric luxury
12. `GoldenMilestoneTemplate.tsx` — Tailored for milestone birthdays (30th, 50th) and anniversaries
13. `PastelWhimsyTemplate.tsx` — Soft pastel clouds for baby showers and young celebrations
14. `ModernMinimalistTemplate.tsx` — Clean Scandinavian typography and monochromatic whitespace
15. `TraditionalVedicTemplate.tsx` — Auspicious Sanskrit shlokas and ceremonial sacred motifs
16. `UrbanChicTemplate.tsx` — Contemporary rooftop cocktail and modern reception styling

---

## 7. Headless Browser Verification Evidence

Automated headless Chrome testing was executed across all key user journeys. All tests generated visual artifacts stored in `project-documentation/assets/screenshots/`:

| Test ID | Role | Workflow Step | Status | Evidence Screenshot |
|---|---|---|---|---|
| `TC-PUB-01` | Public Guest | Landing Page Hero & Value Proposition | **PASS** | `assets/screenshots/01_homepage_desktop.png` |
| `TC-PUB-02` | Public Guest | Mobile Responsive Layout (375px) | **PASS** | `assets/screenshots/01_homepage_mobile.png` |
| `TC-PUB-03` | Public Guest | Filterable Template Gallery (62 Cards) | **PASS** | `assets/screenshots/02_template_gallery.png` |
| `TC-PUB-04` | Public Guest | Royal Maroon Template Preview Viewport | **PASS** | `assets/screenshots/03_template_preview_royal_maroon.png` |
| `TC-GST-01` | Guest | Live Invitation Gate & Sealed Envelope | **PASS** | `assets/screenshots/04_public_invitation_live.png` |
| `TC-HST-01` | Host | Host Login & Dashboard Redirect | **PASS** | `assets/screenshots/05_host_dashboard.png` |
| `TC-HST-02` | Host | 4-Step Invitation Creation Wizard | **PASS** | `assets/screenshots/06_create_invitation_wizard.png` |
| `TC-HST-03` | Host | Live Customization Studio & Phone Preview | **PASS** | `assets/screenshots/07_invitation_editor_live_preview.png` |
| `TC-ADM-01` | Admin | Admin Master Metrics Dashboard | **PASS** | `assets/screenshots/08_admin_dashboard.png` |
| `TC-ADM-02` | Admin | Gemini AI Template Product Studio | **PASS** | `assets/screenshots/09_admin_template_studio.png` |
