# InviteHub — Luxury Multi-Occasion Digital Invitation Platform

> 🚀 **Production Architecture**: Decoupled React 18 SPA + Node.js/Express API + Supabase PostgreSQL  
> 🌐 **Live Web Application**: [http://localhost:5173](http://localhost:5173) (Local) / Vercel Edge (Production)  
> ⚡ **REST API Server**: [http://localhost:3000/api](http://localhost:3000/api)  
> 🛡️ **Admin Console**: `/admin/dashboard` (Default: `admin@wedding-saas.com` / `admin123`)  
> 📖 **Authoritative Documentation**: See [project-documentation/README.md](project-documentation/README.md) (or `project document/`)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React%2018-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite%205-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js%2020-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 1. About InviteHub

InviteHub is an enterprise-grade digital invitation and event experience platform engineered for luxury celebrations across the Indian and global diaspora. It delivers:
- **Interactive Guest Micro-Apps:** Sealed wax envelope gates, music accompaniment, interactive multi-event itineraries, Google Maps links, and 2-tap RSVP submission with dietary preferences.
- **Host Self-Service Studio:** 4-step invitation wizard, split-screen live customizer with real-time iPhone preview, RSVP guest management, and Razorpay tier upgrades.
- **Admin AI Template Studio ("Lovable Mode"):** Autonomous prompt-driven template generation powered by **Google Gemini 2.5 Flash**, allowing non-technical admins to create and publish new celebration themes directly to the live catalog in under 60 seconds.

---

## 2. Centralized Project Documentation

All authoritative requirements, architectural diagrams, API references, test logs, and milestone plans are centralized in **[`project-documentation/`](project-documentation/README.md)** (aliased as `project document/`):

1. **[01. Project Overview & Vision](project-documentation/01-project-overview.md)** — Market positioning, hybrid pay-per-event business model, personas.
2. **[02. Current State Technical Audit](project-documentation/02-current-state-audit.md)** — Verified codebase, database records, route inventory, and health status.
3. **[03. Product Requirements Document (PRD)](project-documentation/03-product-requirements.md)** — Functional & non-functional requirements, acceptance criteria.
4. **[04. Feature Inventory Matrix](project-documentation/04-feature-inventory.md)** — Comprehensive requirement vs. implementation vs. test status tracker.
5. **[05. System Architecture & Technical Design](project-documentation/05-system-architecture.md)** — C4 models, monorepo design, Gemini AI engine, and data flows.
6. **[06. Database Schema & REST API](project-documentation/06-database-and-api.md)** — Prisma entity models, relations, endpoints, payloads, and response schemas.
7. **[07. Roles, Security & Permissions](project-documentation/07-user-roles-and-permissions.md)** — RBAC matrix, JWT tokens, middleware, OWASP compliance.
8. **[08. End-to-End User Workflows](project-documentation/08-user-workflows.md)** — Mermaid diagrams for guest unboxing, host wizard, and customizer studio.
9. **[09. Admin & AI Template Studio Workflows](project-documentation/09-admin-workflows.md)** — Gemini prompt flow, Lovable-mode iteration, catalog publishing.
10. **[10. UI/UX Design System](project-documentation/10-ui-ux-requirements.md)** — Mobile-first viewport standards, color tokens, typography, and animations.
11. **[11. Developer Onboarding & Guidelines](project-documentation/11-development-guidelines.md)** — Local setup, environment variables, commands, Git branching.
12. **[12. QA & Testing Strategy](project-documentation/12-qa-and-testing-strategy.md)** — Test pyramid, automated browser testing, bug severity definitions.
13. **[13. Test Cases & Execution Results](project-documentation/13-test-cases-and-results.md)** — Automated test logs and verified screenshots for 10 core scenarios.
14. **[14. Known Issues & Technical Debt](project-documentation/14-known-issues-and-technical-debt.md)** — Defect catalog, root-cause analyses, serverless risks.
15. **[15. Strategic Roadmap & Milestones](project-documentation/15-project-roadmap-and-milestones.md)** — Phased delivery plan (M1–M5), priorities (P0–P3).
16. **[16. Actionable Task Backlog](project-documentation/16-task-backlog.md)** — Sprint-ready user stories with story points and Definitions of Done.
17. **[17. Deployment & Environment](project-documentation/17-deployment-and-environment.md)** — Vercel configuration, serverless routing, Supabase pooling.
18. **[18. Architectural Decision Log (ADRs)](project-documentation/18-decision-log.md)** — Formal ADR-001 through ADR-006 records.
19. **[19. Open Questions & Assumptions](project-documentation/19-open-questions-and-assumptions.md)** — Business hypotheses, pricing experiments, scale unknowns.
20. **[20. Platform Change History](project-documentation/20-change-history.md)** — Full changelog from v0.1.0 prototype to v2.0.0 AI Studio.

---

## 3. Quick Start (Local Development)

```bash
# 1. Backend Setup
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev # Starts on port 3000

# 2. Frontend Setup (in separate terminal)
cd ../web
npm install
npm run dev # Starts on port 5173
```

Visit `http://localhost:5173` to explore the application.

---

## 4. Default Seed & Test Accounts

| Account Role | Email Address | Password | Purpose |
|---|---|---|---|
| **System Admin** | `admin@wedding-saas.com` | `admin123` | Full access to `/admin/dashboard` & `/admin/studio` |
| **Paid Host User** | `test@example.com` | `password123` | Access to active multi-event wedding invitation |
| **Free Tier Host** | `free@example.com` | `password123` | Access to draft free-tier celebration invitation |

---

© 2026 InviteHub. All rights reserved.
