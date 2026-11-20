# InviteHub — Continuous Development & Engineering Hub

Welcome to the active engineering and development documentation for **InviteHub** (E-Invitation SaaS platform).

---

## 📌 Directory Structure & Navigation

| Document | Purpose | Status |
| :--- | :--- | :--- |
| [**BUG-TRACKER.md**](./BUG-TRACKER.md) | Full tracking of discovered bugs, severity, root-cause analysis, fixes, and regression verification | **Active / Updated** |
| [**DEVELOPMENT-STATUS.md**](./DEVELOPMENT-STATUS.md) | Architectural status, code health, compilation metrics, and component inventory | **Active / Updated** |
| [**WORKFLOW-STATUS.md**](./WORKFLOW-STATUS.md) | End-to-end user journeys (Guest, Host, Admin) workflow status and validation notes | **Active / Updated** |
| [**QA-TEST-RESULTS.md**](./QA-TEST-RESULTS.md) | Automated regression test results, coverage matrix, and test run evidence | **Verified 100%** |
| [**BLOCKERS.md**](./BLOCKERS.md) | Active technical and external blockers, workarounds, and unblocking roadmaps | **Tracked** |
| [**CHANGELOG.md**](./CHANGELOG.md) | Chronological log of code changes, refactors, and feature hardening | **Maintained** |
| [**TASK-BACKLOG.md**](./TASK-BACKLOG.md) | Prioritized engineering task backlog ordered by severity and milestone | **Prioritized** |
| [**PRODUCTION-READINESS.md**](./PRODUCTION-READINESS.md) | Production readiness criteria, security audit, deployment checklist, and go-live scorecard | **In Progress** |

---

## 🏗️ Architecture & Technology Stack

- **Frontend Client:** React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons, Canvas Confetti.
  - Port: `http://localhost:5173`
- **Backend API:** Node.js, Express, TypeScript, Prisma ORM, JWT Authentication.
  - Port: `http://localhost:3000`
- **Database:** PostgreSQL (via Prisma).
- **AI Integration:** Google Gemini API (`gemini-2.0-flash`, `gemini-1.5-flash`) with dynamic procedural synthesis fallback engine.

---

## 🔑 Operational Credentials & Test Accounts

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@wedding-saas.com` | `admin123` | Full Admin Dashboard, Template Studio, Themes, Users, System Metrics |
| **Host (Pro Tier)** | `test@example.com` | `test123` | Host Dashboard, Invitation Creation, Theme Selection, RSVP Management |
| **Host (Free Tier)** | `free@example.com` | `free123` | Free Tier Invitation Creation & Basic Templates |

---

## 🚀 Quick Commands

```bash
# Verify TypeScript Compilation across both tiers
cd server && npx tsc --noEmit
cd web && npx tsc --noEmit

# Run Backend Server
cd server && npm run dev

# Run Frontend Server
cd web && npm run dev
```

