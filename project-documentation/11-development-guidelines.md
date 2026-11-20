# 11. Developer Onboarding & Engineering Guidelines

> **Document Version:** 1.0.0  
> **Author:** Senior Full-Stack Developer & Lead Architect  
> **Status:** Approved Baseline  
> **Repository:** `/home/harpreet/E-invetation`

---

## 1. Quick-Start Local Development Setup

### 1.1 Prerequisites
* **Node.js:** v18.x or v20.x LTS
* **Package Manager:** `npm` (v9+) or `yarn` / `pnpm`
* **Database:** PostgreSQL instance (local PostgreSQL or Supabase cloud connection URI)
* **Google Gemini API Key:** Required for Admin AI Template Studio functionality

### 1.2 Step-by-Step Installation

```bash
# 1. Clone repository and navigate to root
cd /home/harpreet/E-invetation

# 2. Configure Backend Environment
cd server
cp .env.example .env
# Ensure DATABASE_URL, JWT_SECRET, and GEMINI_API_KEY are configured in server/.env

# 3. Install Backend Dependencies & Run Database Migrations
npm install
npx prisma generate
npx prisma db push

# 4. Start Backend Development Server (Port 3000)
npm run dev

# 5. In a separate terminal, Configure Frontend Environment
cd ../web
cp .env.example .env
# Verify VITE_API_URL=http://localhost:3000/api

# 6. Install Frontend Dependencies & Start Vite Server (Port 5173)
npm install
npm run dev
```

The application is now accessible at `http://localhost:5173`.

---

## 2. Environment Variables Configuration

### 2.1 Backend (`server/.env`)
```bash
# PostgreSQL Database Connection String (Direct or Pooled)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres?pgbouncer=true"

# JSON Web Token Secret Key
JWT_SECRET="super-secret-jwt-signing-key-for-invitehub"

# Google Gemini API Key for AI Template Generation
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Razorpay Payment Gateway Credentials (Optional in sandbox)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."

# Application Server Port
PORT=3000
NODE_ENV="development"
```

### 2.2 Frontend (`web/.env`)
```bash
# Base URL pointing to the Express backend API
VITE_API_URL="http://localhost:3000/api"

# Razorpay Client Public Key
VITE_RAZORPAY_KEY_ID="rzp_test_..."
```

---

## 3. Monorepo Directory Organization

```
E-invetation/
├── web/                           # Client-side React 18 SPA
│   ├── src/
│   │   ├── components/            # Shared reusable UI primitives
│   │   ├── pages/                 # Route page components
│   │   ├── templates/             # 16 Archetype Components & Registry
│   │   │   ├── registry.ts        # getTemplateComponent lookup engine
│   │   │   ├── catalog.tsx        # Curated catalog theme manifests
│   │   │   └── components/        # Concrete React template implementations
│   │   ├── services/              # API clients & network bindings
│   │   └── types/                 # Shared TypeScript interfaces
├── server/                        # Node.js + Express REST API
│   ├── src/
│   │   ├── routes/                # Modular route controllers
│   │   │   ├── auth.ts            # User registration & login
│   │   │   ├── invitations.ts     # Invitation CRUD & publishing
│   │   │   ├── themes.ts          # Theme catalog & Gemini AI studio
│   │   │   ├── rsvp.ts            # Public RSVP submissions
│   │   │   └── payments.ts        # Razorpay checkout & webhooks
│   │   ├── middleware/            # JWT authentication & admin guards
│   │   └── index.ts               # Server entry point & CORS
│   └── prisma/
│       └── schema.prisma          # Authoritative PostgreSQL schema
└── project-documentation/         # Authoritative documentation repository
```

---

## 4. Coding Standards & Conventions

### 4.1 TypeScript & Type Safety
* All newly introduced components and API handlers must be fully typed. Use strict TypeScript interfaces; avoid `any` wherever possible.
* Store shared domain interfaces (e.g., `Invitation`, `Theme`, `Event`, `Rsvp`) in `web/src/types/` and reference them across pages.

### 4.2 React Component Architecture
* **Functional Components:** Always use functional components with hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
* **Tailwind Class Order:** Organize Tailwind utility classes logically: layout/positioning -> box model -> typography -> backgrounds/borders -> transitions/transforms.
* **Component Extraction:** If a template component exceeds 350 lines, decompose it into sub-components (e.g., `HeroSection`, `EventItinerary`, `RsvpSection`).

### 4.3 Backend Express & Prisma Practices
* **Async Error Handling:** Wrap all controller route handlers in try-catch blocks or use an `asyncHandler` middleware to prevent unhandled promise rejections.
* **Prisma Connection Lifecycle:** Never instantiate multiple `new PrismaClient()` instances. Export a single singleton instance from `server/src/db.ts`.

---

## 5. Git Workflow & Branching Strategy

* **Main Branch:** `main` — Production-ready code deployed to Vercel.
* **Feature Branches:** `feature/feature-name` (e.g., `feature/multi-occasion-templates`, `feature/razorpay-webhooks`).
* **Bugfix Branches:** `fix/bug-description` (e.g., `fix/template-slug-duplicate`).
* **Commit Message Format:** Follow Conventional Commits:
  * `feat: add conversational iteration in admin template studio`
  * `fix: correct single-celebrant birthday wording in coastal pearl template`
  * `docs: update feature matrix and database specification`
  * `test: add automated headless browser audit test suite`

