# InviteHub — Project Status, Flow Architecture & Master Guide

> **Current Production Status**: Live & Operational  
> **Frontend Web**: [https://e-invitation-rosy.vercel.app](https://e-invitation-rosy.vercel.app)  
> **Backend API**: [https://e-invitation-api-chi.vercel.app](https://e-invitation-api-chi.vercel.app)  
> **Admin Console**: [https://e-invitation-rosy.vercel.app/admin/dashboard](https://e-invitation-rosy.vercel.app/admin/dashboard)  
> **Default Admin Credentials**: `admin@wedding-saas.com` / `admin123`

---

## 1. What Has Been Achieved

### A. Multi-Occasion Digital Invitation SaaS Platform
- Transformed from a single-wedding prototype into a full-scale multi-occasion digital invitation platform.
- Full support for 9 distinct occasion categories:
  - 💒 **Weddings**: Royal palaces, cinematic nights, botanical garden weddings, South Indian heritage, and Phulkari celebrations.
  - 🎂 **Birthdays**: Retro synthwave arcades, enchanted storybook gardens, safari explorers, milestone golden soirées.
  - 🥂 **Anniversaries**: 50th Golden Jubilee, 40th Ruby Romance, vintage black & white film noir.
  - 👶 **Baby Showers**: Woodland fable, royal little prince/princess, sunshine meadows, boho rainbows.
  - 🏡 **Housewarmings**: Scandi minimalist sanctuaries, Rajasthani Jharokha Griha Pravesh, urban terrace lofts, coastal sea breeze havens.
  - 🎉 **Parties**: Tropical sunset luaus, Studio 54 disco glam, 1920s speakeasy soirees, poolside bashes.
  - 🕉️ **Religious & Sacred**: Shree Ganesh Vandana, Waheguru Anand blessings, Cathedral Grace, Noor-e-Mehfil Nikah/Eid.
  - 🌳 **Family Celebrations**: Heritage family reunions, vintage photo archives, sunlit lawn carnivals, Diwali Sneh Milan.
  - 🎓 **Galas & Honors**: Aura grand gala, academic commencement honors, crystal philanthropy balls, executive tech summits.

### B. 50+ Responsive Archetypes & Interactive Themes
- Dynamic gate/seal reveal system (wax seals, kalash tokens, neon arcade coins, silk ribbons).
- Responsive rendering: 100% responsive across desktop monitors, tablets, and native mobile viewports with simulated iPhone dynamic island frames.
- Interactive modules: Multi-event itineraries, countdown timers, Google Maps venue navigation, photo galleries, background ambient audio, and RSVP forms.

### C. Gemini AI Template Studio (Admin Feature)
- **Prompt Refinement & Synthesis**: Administrators can enter any plain-text theme concept. The system runs an AI pass to structure an architectural art brief, select harmonized color palettes, typography pairings, and wedding/event itinerary schedules.
- **Resilient AI Engine**: Configured with `gemini-3.5-flash-lite` as the primary engine (~1.1s response, immune to high-demand spikes) with automatic fallback to `gemini-3.8-flash` and procedural heuristic engines.
- **1-Click Catalog Publishing**: Review generated themes with live color swatches and immediately publish them to the active public catalog.

### D. Dynamic Template Resolution & Preview Engine (Recent Fix)
- **Dynamic Catalog Registration**: Resolved dynamic database-persisted themes (e.g. *Moonlit Jasmine & Peacock Palace*, *Noor-e-Fiza Royal Awadhi Nikah*) so they no longer fall back to static defaults (*Botanical Romance*).
- **Live Theme Customizer**: Injects the theme's custom colors (`--primary`, `--accent`, `--burg`, `--gold`) and typography into thumbnails and live preview mockups.
- **Desktop & Mobile Switcher**: Allows one-click toggle between full desktop preview and mobile device simulator.

### E. Monetization & Payment Gateway
- **Tiered Pricing**: Free (Community), Standard (₹299), and Premium (₹499).
- **Razorpay Integration**: Razorpay checkout modal with order creation, signature verification, and automated unlock of public live links (`/i/:slug`).

### F. Guest RSVP & Public Live Sites (`/i/:slug`)
- Sealed unrevealed gate screen prompting guest tap to open with ambient music.
- Live RSVP collection stored in database and accessible by host in real time.
- Direct Google Maps routing to event venues.

### G. Production Cloud Infrastructure
- **Frontend**: Deployed on Vercel Edge CDN with Vite SPA rewrites (`web/vercel.json`).
- **Backend API**: Serverless Express running on Vercel (`server/vercel.json`) with `maxDuration: 60`.
- **Database**: Cloud PostgreSQL with connection pooling, Prisma ORM, and SSL mode.

---

## 2. End-to-End System & User Flows

```mermaid
flowchart TD
    subgraph Public["Public Guest & Host Experience"]
        Landing["Landing Page /"] --> Gallery["Template Gallery /templates"]
        Gallery --> Preview["Template Preview /templates/:slug"]
        Preview -->|"Use Template"| Auth["Sign In / Sign Up"]
        Auth --> Wizard["Invitation Wizard /invitations/new"]
        Wizard --> Editor["Live Invitation Editor /editor/:id"]
        Editor --> Checkout["Razorpay Payment Modal"]
        Checkout -->|"Payment Success"| LiveSite["Public Invitation /i/:slug"]
        Guest["Invited Guest"] --> LiveSite
        LiveSite --> RSVP["Submit RSVP & View Itinerary"]
    end

    subgraph Admin["Admin Control Console"]
        AdminLogin["Admin Login /admin/login"] --> AdminDash["Admin Dashboard /admin/dashboard"]
        AdminDash --> ThemesTab["Themes & Catalog Management"]
        ThemesTab --> AIStudio["Gemini AI Studio"]
        AIStudio --> PromptRefine["Step 1: Refine Art Brief"]
        PromptRefine --> Synthesis["Step 2: Synthesize Palette & Archetype"]
        Synthesis --> ReviewModal["Review Generated Theme Manifest"]
        ReviewModal -->|"Approve & Add"| CatalogDB["Save Theme to Database"]
        CatalogDB -.->|"Live Instantly"| Gallery
    end

    subgraph Backend["Vercel Cloud Serverless API"]
        API["Express Serverless API /api/*"]
        Prisma["Prisma ORM"]
        DB[(Cloud PostgreSQL)]
        GeminiAPI["Google Gemini API (3.5 Flash Lite)"]
        RazorpayAPI["Razorpay Payment Service"]
        
        API --> Prisma --> DB
        AIStudio -.-> API --> GeminiAPI
        Checkout -.-> API --> RazorpayAPI
    end
```

### Detailed Flow Descriptions:

#### 1. Host Journey (Creation to Publishing)
1. **Discovery**: Host visits `/templates`, filters by occasion (Wedding, Birthday, etc.), and clicks **Preview**.
2. **Interactive Preview**: Host tests the template in Desktop or Mobile mode with real theme colors and audio.
3. **Draft Creation**: Clicking **Use Template** pre-selects the theme and navigates to `/invitations/new`.
4. **Editor Customization**: Host enters couple/host names, multiple event itinerary dates and venues, custom story, and photos.
5. **Monetization**: Host clicks **Publish Live**. For premium templates, the Razorpay payment modal opens. Once completed, the order is verified server-side.
6. **Live URL**: Host receives their public shareable link: `https://e-invitation-rosy.vercel.app/i/:slug`.

#### 2. Guest Journey (Accessing & Experiencing)
1. **Themed Gate Screen**: Guest opens `/i/:slug`. A customized sealed gate (e.g. Royal crest, arcade coin, wax seal) appears.
2. **Unseal & Music**: Tapping the seal animates the doors/curtains open and starts ambient background music.
3. **Celebration Details**: Guest reads the personalized couple message, views countdown clock, and checks venue dates and times.
4. **Navigation**: Guest clicks "View on Google Maps" for one-tap driving directions.
5. **RSVP Submission**: Guest fills out attendance status, guest count, and optional dietary preferences.

#### 3. Admin Journey (AI Template Studio)
1. **Authentication**: Admin logs into `/admin/login` (`admin@wedding-saas.com` / `admin123`).
2. **Accessing Studio**: Navigates to **Themes & Catalog** -> **Import Template** -> **Gemini AI Studio**.
3. **Idea Input**: Admin enters a brief (e.g. *"Royal Awadhi Nikah with emerald teal, pearl white, and champagne gold"*).
4. **AI Generation**: Gemini refines the concept, generates a 6-color harmonized palette, typography pairing, and sample multi-event schedule.
5. **Catalog Publication**: Admin reviews the preview cards and clicks **Approve & Add to Catalog**. The new theme is live on the marketplace within seconds.

---

## 3. What's Pending & Roadmap

### Priority 1: Operational Handoff
- [ ] **Git Remote Push**: All recent bug fixes, AI optimizations, and documentation are committed locally on `main`. Push to remote via:
  ```bash
  git push origin main
  ```
- [ ] **Live Razorpay Credentials**: Currently configured with test keys. Replace `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Vercel with production merchant keys when ready to process live INR currency.

### Priority 2: Email & Communication Integration
- [ ] **Automated RSVP Notifications**: Connect SendGrid or Resend API so hosts receive email notifications when a guest RSVPs.
- [ ] **WhatsApp Share Card Generator**: Add a 1-click "Share on WhatsApp" button with pre-formatted invitation text and direct link.

### Priority 3: Custom Domains & Advanced Features
- [ ] **Custom Domain Routing**: Point custom domain (e.g., `invitehub.com`) to Vercel DNS.
- [ ] **RSVP Export**: Add a "Export to Excel/CSV" button in Host Dashboard to download guest lists.
- [ ] **Photo Uploads via Cloudflare R2 / AWS S3**: Move from base64/local uploads to dedicated object storage for large photo albums.

---

## 4. Environment Variables Reference

### Backend API (`server/.env` and Vercel Environment)

| Variable | Description | Example / Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string with PgBouncer | `postgresql://user:pass@host:6543/postgres?sslmode=require` |
| `DIRECT_URL` | Direct PostgreSQL connection string for Prisma migrations | `postgresql://user:pass@host:5432/postgres?sslmode=require` |
| `JWT_SECRET` | Secret key for signing access tokens | Min 32 random characters |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens | Min 32 random characters |
| `CORS_ORIGIN` | Whitelisted frontend origins (comma-separated) | `http://localhost:5173,https://e-invitation-rosy.vercel.app` |
| `GEMINI_API_KEY` | Google AI Studio Gemini API Key | `AQ.Ab8RN6...` |
| `GEMINI_MODEL` | Primary AI model for template synthesis | `gemini-3.5-flash-lite` |
| `ENABLE_PAYMENTS` | Toggle payment requirements for live links | `true` |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID | `rzp_test_...` or `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret | Secret string |

### Frontend Web (`web/.env` and Vercel Environment)

| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_URL` | Backend server URL | `https://e-invitation-api-chi.vercel.app` (Prod) or `http://localhost:3000` (Dev) |
| `VITE_APP_NAME` | Display name of the platform | `InviteHub - Digital Invitation Platform` |
| `VITE_RAZORPAY_KEY_ID` | Public Razorpay key for checkout popup | `rzp_test_...` or `rzp_live_...` |

---

## 5. Quick Development & Deployment Commands

### Local Development
```bash
# Terminal 1 - Backend Server
cd server
npm run dev

# Terminal 2 - Frontend Web
cd web
npm run dev
```

### Production Deployment to Vercel
```bash
# Deploy Serverless Backend API
cd server
npx vercel --prod

# Deploy Frontend Web Application
cd web
npx vercel --prod
```

### Pushing Commits to GitHub
```bash
cd /home/harpreet/E-invetation
git push origin main
```
