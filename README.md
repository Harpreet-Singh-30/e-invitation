# InviteHub — Premium Multi-Occasion Digital Invitation Platform

> 🚀 **Production Status**: Live on Vercel  
> 🌐 **Web App**: [https://e-invitation-rosy.vercel.app](https://e-invitation-rosy.vercel.app)  
> ⚡ **API**: [https://e-invitation-api-chi.vercel.app](https://e-invitation-api-chi.vercel.app)  
> 🛡️ **Admin Dashboard**: [https://e-invitation-rosy.vercel.app/admin/dashboard](https://e-invitation-rosy.vercel.app/admin/dashboard) (Credentials: `admin@wedding-saas.com` / `admin123`)  
> 📖 **Master Guide**: See [PROJECT_STATUS_AND_FLOW.md](./PROJECT_STATUS_AND_FLOW.md) for full flow diagrams and architecture

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React%2018-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite%205-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js%2020-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

InviteHub is a full-stack, enterprise-grade SaaS platform for authoring, customizing, monetizing, and publishing bespoke digital event invitation websites. The platform supports **9 occasion categories** with **50+ designer templates**, rich interactive entrance gates, ambient audio players, multi-device previews, simulated payment checkout, an executive administration console, and an autonomous **Gemini AI Template Studio**.

---

## 📑 Table of Contents
1. [Master Flow & Status Documentation (PROJECT_STATUS_AND_FLOW.md)](./PROJECT_STATUS_AND_FLOW.md)
2. [Tech Stack & Architecture](#-tech-stack--architecture)
3. [Step-by-Step Local Setup Guide](#-step-by-step-local-setup-guide)
4. [Default Credentials & Test Accounts](#-default-credentials--test-accounts)
5. [What We Have Achieved](#-what-we-have-achieved)
6. [Gemini AI Template Studio](#-gemini-ai-template-studio)
7. [Roadmap & What is Still Pending](#-roadmap--what-is-still-pending)
8. [Repository Structure](#-repository-structure)

---

## 🛠 Tech Stack & Architecture

### Backend (`/server`)
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js with Helmet, CORS, and Express Rate Limiter
- **Database**: PostgreSQL with Prisma ORM 5.22
- **Authentication**: JWT (Access Token + Refresh Token flow) with `bcryptjs` password hashing
- **Validation**: Zod schema validation across all API boundaries

### Frontend (`/web`)
- **Framework**: React 18 with TypeScript
- **Build Tooling**: Vite 5 (Hot Module Replacement)
- **Styling**: Tailwind CSS with custom typography, gradient glows, and mobile frames
- **Routing**: React Router v6 with Role-Based Route Guards (`ProtectedRoute`, `AdminProtectedRoute`)
- **State & Context**: React Context API (`AuthContext`) + Session Storage synchronization
- **Testing & E2E**: Playwright with Chromium for automated UI/UX and API verification

---

## 🚀 Step-by-Step Local Setup Guide

Follow these steps to clone, configure, and launch the application locally.

### 1. Prerequisites
- **Node.js**: v20.x or higher (`node -v`)
- **npm**: v10.x or higher (`npm -v`)
- **PostgreSQL**: v14+ running locally or in Docker (`psql --version`)

### 2. Clone the Repository
```bash
git clone https://github.com/Harpreet-Singh-30/e-invitation.git
cd e-invitation
```

### 3. Configure PostgreSQL Database
Ensure PostgreSQL is active and create the database user and database:
```sql
CREATE USER wedding_admin WITH PASSWORD 'admin123';
CREATE DATABASE wedding_saas OWNER wedding_admin;
GRANT ALL PRIVILEGES ON DATABASE wedding_saas TO wedding_admin;
```

### 4. Setup Backend Environment & Dependencies
```bash
cd server
npm install

# Copy environment template
cp .env.example .env

# Run Prisma database migrations
npx prisma migrate dev --name init

# Seed the database with 50+ templates, demo invitations, and test accounts
npm run seed
```

### 5. Setup Frontend Environment & Dependencies
```bash
cd ../web
npm install

# Copy environment template
cp .env.example .env

# Verify clean compilation
npm run build
```

### 6. Run the Application in Development Mode

Open two terminal tabs:

**Tab 1: Backend Server** (Port 3000)
```bash
cd server
npm run dev
```
*Health Check*: `http://localhost:3000/healthz`

**Tab 2: Frontend Web App** (Port 5173)
```bash
cd web
npm run dev
```
*Web App URL*: `http://localhost:5173`

---

## 🔐 Default Credentials & Test Accounts

The seed script (`npm run seed` in `/server`) provisions the following verified accounts:

| Role | Email Address | Password | Primary Dashboard URL |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@wedding-saas.com` | `Admin123!` | [http://localhost:5173/admin/login](http://localhost:5173/admin/login) |
| **Host (Verified)** | `qa_verified_user@example.com` | `Password123!` | [http://localhost:5173/dashboard](http://localhost:5173/dashboard) |
| **Host (Demo)** | `test@example.com` | `Password123!` | [http://localhost:5173/dashboard](http://localhost:5173/dashboard) |

---

## 🏆 What We Have Achieved

### 1. 50+ Designer Templates Across 9 Occasion Categories
- Full template library supporting:
  - 💒 **Weddings**: Art Deco Noir, Imperial Burgundy, Botanical Romance, Phulkari Celebration, Coastal Pearl, Ivory Kayal, Marigold Courtyard, Midnight Vows.
  - 🎂 **Birthdays**: Golden Milestone Soirée, Retro Synthwave Arcade, Enchanted Storybook Garden, Safari Little Explorer, Aged to Perfection Distillery.
  - 💝 **Anniversaries**: 50th Golden Jubilee, Silver Jubilee Elegance, Ruby Romance 40th, Bohemian Sunset Vows, Cinematic Noir Anniversary.
  - 👶 **Baby Showers**: Celestial Lullaby, Woodland Fable Shower, Royal Nursery Crown, Here Comes The Sun, Boho Rainbow Miracle.
  - 🏠 **Housewarmings**: Hearth & Heritage (Griha Pravesh), Scandi Minimalist Sanctuary, Rajasthani Jharokha Griha, Urban Terrace Loft, Coastal Sea Breeze Haven.
  - 🎉 **Parties**: Midnight Soirée, Speakeasy Roaring Twenties, Studio 54 Disco Glam, Tropical Sunset Luau, Palm Springs Poolside Bash.
  - 🙏 **Religious Celebrations**: Divya Mandap Pooja, Shree Ganesh Sthapana, Akhand Path & Kirtan Darbar, Sacred Holy Communion, Noor-e-Mehfil Islamic Gala.
  - 👨‍👩‍👧‍👦 **Family Celebrations**: Heritage Family Reunion, Vintage Roots Family Archive, Sunlit Picnic & Carnival, Diwali Sneh Milan, Nautical Generations Anchorage.
  - 🎊 **Other Milestones**: Aura Grand Gala, Commencement Academic Honors, Crystal Philanthropy Ball, Executive Tech Vision Summit, Bon Voyage Wanderlust.

### 2. Bespoke Entrance Gates & Interactive Reveals
- Each category features tailored entrance gate mechanics matching the theme:
  - Auspicious Brass Kalash & Diya glow for Indian ceremonies.
  - 1920s Gatsby geometric ziggurats and wax seals for luxury galas.
  - 80s arcade coin slots and neon pulses for milestone parties.
  - Whimsical pastel clouds and storybook seals for baby showers.
  - High-fidelity ambient audio player with custom soundtracks (`midnight-overture.mp3`, `royal-evening.wav`).

### 3. Category-Adaptive Invitation Editor
- **Dynamic Form Configuration**: Customizes form fields per occasion:
  - *Wedding*: Groom/Bride details, couple narrative, wedding party.
  - *Birthday*: Honoree name, age turning, milestone toast.
  - *Baby Shower*: Expecting parents, baby name / gender, nesting story.
  - *Housewarming*: New home address, family hosts, house blessing.
- **Multi-Device Live Preview**:
  - iPhone mobile mockup with interactive scrolling.
  - 1200px scaled desktop canvas preview with real-time CSS transform matrix scaling.

### 4. Simulated Payment Gateway & Public Invitation Links (`/i/:slug`)
- **Checkout Modal**:
  - Order review with ₹1,499 special launch discount.
  - Simulated payment options: Credit/Debit Card (with 1-click **"Fill Demo Card"**), UPI / VPA, and Net Banking.
  - Realistic 3-stage validation and authorization animation.
- **Instant Activation**:
  - Stores atomic `Payment` record in PostgreSQL (`TXN_DEMO_...`).
  - Sets `isPublished: true` and `isLive: true`.
  - Displays instant celebratory modal with copyable public URL.
- **Public Guest Access**:
  - Dedicated public viewer at `/i/:slug` accessible to any guest without logging in.
  - Safe draft protection showing a friendly host notice if accessed before payment.

### 5. Executive Dark-Luxury Admin Console (`/admin`)
- **Overview & KPIs**: Real-time platform metrics (Users, Invitations, Published/Live counts, Active Themes, and Category breakdown progress bars).
- **Users Management**: Full-text search, role filters, and in-place subscription tier upgrades (`free`, `pro`, `business`).
- **Invitations Moderation**: Global celebration index with live status toggles, direct preview links, and deletion.
- **Themes & Catalog Management**: Live theme usage counters, active/disabled toggles, JSON export, and delete protections.

### 6. Dual-Mode Template Ingestion Engine
- **Mode 1: JSON Manifest Import**:
  - Ingest single template or bulk arrays of templates via JSON.
  - File drag-and-drop or direct text editing with 1-click **"Load Sample Template"**.
  - Zod schema validation with precise field-level error reporting.
  - Automatic database upsert by slug.
- **Mode 2: Visual Form Builder**:
  - Graphical form for non-technical admins to create and publish new templates.
  - Auto-slugification, archetype component mapping, and color pickers.
- **Instant Synchronization**: Newly imported templates appear immediately in both the Admin Console and the Host Template Gallery (`/templates`).

---

## 📦 Template Import Specification

Administrators can import new themes using the following JSON schema:

```json
{
  "name": "Royal Tuscan Vineyard",
  "slug": "royal-tuscan-vineyard",
  "category": "wedding",
  "description": "Sun-drenched Chianti hills, olive branch wreaths, rustic stone villa entrance, and acoustic mandolin serenades",
  "templateComponent": "BotanicalRomanceTemplate",
  "tags": ["tuscan", "vineyard", "rustic", "italy", "outdoor", "luxury"],
  "priceTier": "premium",
  "priceAmount": 59900,
  "currency": "INR",
  "isActive": true,
  "isFeatured": true,
  "previewImageUrl": "/templates/botanical-romance-preview.jpg",
  "defaultColors": {
    "primary": "#556B2F",
    "secondary": "#C2A649",
    "accent": "#D4AF37",
    "background": "#FBF9F5",
    "surface": "#FFFFFF",
    "text": "#2C2C2A"
  },
  "defaultFonts": {
    "heading": "Cinzel",
    "body": "Cormorant Garamond",
    "accent": "Great Vibes"
  },
  "features": [
    "animated_gate",
    "audio_player",
    "interactive_rsvp",
    "countdown",
    "event_schedule",
    "photo_gallery"
  ]
}
```

### Supported Layout Archetypes (`templateComponent`):
- `BotanicalRomanceTemplate`: Soft Garden, Romantic, Floral, Rustic
- `ImperialBurgundyTemplate`: Grand Royal Palace, Traditional Heritage, Regalia
- `ArtDecoNoirTemplate`: 1920s Gatsby, Dark Obsidian, Champagne Gold Luxury
- `PhulkariCelebrationTemplate`: Festive Punjabi, Cross-Stitch Embroidery
- `CoastalPearlTemplate`: Oceanic Waves, Shell Fans, Minimalist Destination
- `CelestialLullabyTemplate`: Pastel Clouds, Crescent Moon, Whimsical Baby Shower
- `HearthHeritageTemplate`: Terracotta, Griha Pravesh, Auspicious Indian Warmth
- `MidnightSoireeTemplate`: Neon Cyber, Disco Glam, Cocktail Parties
- `AuraGrandGalaTemplate`: Black-Tie, Sapphire Starlight, Red Carpet Honors

---

## 🗺 Roadmap & What is Still Pending

The following high-value capabilities are recommended for subsequent phases:

1. **Live Production Payment Gateways**:
   - Integrate live Stripe Elements & Razorpay Checkout SDKs with webhook listeners for automated charge capture and refund processing.
2. **WhatsApp Business Cloud API Integration**:
   - Automated delivery of personalized guest invitations with interactive RSVP buttons directly inside WhatsApp.
3. **Cloud Media Storage (S3 / Cloudinary)**:
   - Offload user-uploaded photos and audio from local disk storage (`/uploads`) to AWS S3 or Cloudinary with automated thumbnail generation.
4. **Custom Domain / CNAME Routing**:
   - Allow premium users to bind custom root domains (e.g., `rahulandpriya.com`) using automated Cloudflare or Caddy SSL certificate provisioning.
5. **Guest Management & Export Suite**:
   - CSV / Excel import and export for guest lists and RSVP responses with dietary restriction aggregation.
6. **QR Code Check-In Scanner**:
   - Generate unique QR codes per guest for on-site venue check-in verification using the host's mobile camera.

---

## 📁 Repository Structure

```
├── server/                    # Node.js + Express + Prisma Backend
│   ├── prisma/
│   │   ├── schema.prisma      # PostgreSQL Database Schema
│   │   └── seed.ts            # Seed Script (50+ Themes, Users, Celebrations)
│   ├── src/
│   │   ├── index.ts           # Express Application Entrypoint
│   │   ├── middleware/        # Auth & Role-Based Access Control Middlewares
│   │   ├── routes/
│   │   │   ├── admin.ts       # Admin Console & Template Import Endpoints
│   │   │   ├── auth.ts        # Authentication & Profile Endpoints
│   │   │   ├── invitations.ts # Host Invitation & Payment Checkout Endpoints
│   │   │   └── publicInvitations.ts # Public Guest Viewer & Theme Catalog Endpoints
│   │   └── lib/               # Prisma Client & JWT Utilities
│   └── .env.example           # Backend Environment Template
│
├── web/                       # React 18 + Vite 5 + Tailwind Frontend
│   ├── src/
│   │   ├── components/        # Modals, Mockups, and Route Guards
│   │   │   ├── AdminProtectedRoute.tsx
│   │   │   ├── PaymentModal.tsx
│   │   │   ├── MobilePhoneMockup.tsx
│   │   │   └── admin/TemplateImportModal.tsx
│   │   ├── contexts/          # Auth Context Provider
│   │   ├── pages/             # App Pages (Dashboard, Editor, Admin, Gallery)
│   │   │   ├── admin/Dashboard.tsx
│   │   │   ├── admin/Login.tsx
│   │   │   ├── CreateInvitation.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── InvitationEditor.tsx
│   │   │   ├── PublicInvitationView.tsx
│   │   │   └── TemplateGallery.tsx
│   │   └── templates/         # Interactive Template Components & Registry
│   │       ├── registry.ts    # Component Resolver & Dynamic Archetype Engine
│   │       └── [theme-dirs]/  # Component Layouts, Audio Assets & Styles
│   └── .env.example           # Frontend Environment Template
│
└── README.md                  # Master System Documentation
```

---

## 📄 License
Proprietary & Confidential. All rights reserved by the development team.
