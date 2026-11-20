# InviteHub — Centralized Project Documentation Repository

> **Document Status:** Active & Verified Baseline  
> **Last Updated:** November 17, 2026  
> **Project Leads:** Senior Project Manager (PM), Senior QA Engineer, Technical Architect  
> **Repository Root:** `/home/harpreet/E-invetation`  
> **Documentation Directory:** `project-documentation/` (Aliased as `project document/`)

---

## 1. Executive Introduction

**InviteHub** is an enterprise-grade digital invitation and event experience platform engineered specifically for luxury celebrations across the Indian and global diaspora. Originally conceived as a specialized luxury wedding website builder, InviteHub has evolved into a comprehensive **multi-occasion event operating system** supporting Weddings, Milestone Birthdays, Anniversaries, Baby Showers, Housewarmings, Corporate Galas, and Religious Ceremonies.

The platform combines a **guest-facing interactive micro-app** (complete with wax-sealed opening gates, live RSVP, interactive itineraries, Google Maps integration, and photo registries) with an **intuitive host self-service dashboard** and a state-of-the-art **Admin AI Template Studio** powered by Google Gemini 2.5 Flash for prompt-driven template generation and visual customization.

---

## 2. Documentation Architecture

This repository contains the complete, authoritative, and verified documentation for InviteHub. All legacy, redundant, or conflicting notes historically kept in root markdown files have been consolidated, cross-checked against actual source code and production database state, and replaced by this 20-volume documentation suite:

```
project-documentation/
├── README.md                              # This master index and navigational hub
├── 01-project-overview.md                 # Product vision, business model, and strategic positioning
├── 02-current-state-audit.md              # Deep forensic audit of code, routes, and live DB
├── 03-product-requirements.md             # Complete PRD: personas, functional & non-functional requirements
├── 04-feature-inventory.md                # Comprehensive feature traceability & test status matrix
├── 05-system-architecture.md              # Full-stack architectural blueprints, C4 models & data flows
├── 06-database-and-api.md                 # Prisma schema, relational entity models & complete REST API spec
├── 07-user-roles-and-permissions.md       # Role-Based Access Control (RBAC), JWT security & authorization
├── 08-user-workflows.md                   # Guest and Host end-to-end user journeys with Mermaid diagrams
├── 09-admin-workflows.md                  # Admin Template Studio, Lovable-mode AI iteration & publishing
├── 10-ui-ux-requirements.md               # Luxury design system, mobile-first phone frames, typography & tokens
├── 11-development-guidelines.md           # Developer setup, monorepo standards, git conventions & commands
├── 12-qa-and-testing-strategy.md          # Quality engineering methodology, test pyramid & coverage rules
├── 13-test-cases-and-results.md           # Automated browser test runs, execution logs & visual evidence
├── 14-known-issues-and-technical-debt.md  # Defect catalog, root-cause analyses & architectural debt items
├── 15-project-roadmap-and-milestones.md   # Phased release roadmap (M1 to M5) with P0–P3 priorities
├── 16-task-backlog.md                     # Actionable sprint-ready task inventory with Definitions of Done
├── 17-deployment-and-environment.md       # Vercel deployment, serverless routing, Supabase pooling & env audit
├── 18-decision-log.md                     # Architecture Decision Records (ADR-001 through ADR-006)
├── 19-open-questions-and-assumptions.md   # Open business hypotheses, pricing experiments & tech unknowns
├── 20-change-history.md                   # Chronological project changelog from wedding monolith to multi-occasion
└── assets/
    └── screenshots/                       # Verified browser audit screenshots (TC-PUB-01 to TC-ADM-02)
```

---

## 3. Quick Reference Matrix

| Document | Primary Audience | Core Focus |
|---|---|---|
| [01. Project Overview](01-project-overview.md) | Leadership, Stakeholders, PM | Platform vision, monetization models, market differentiation |
| [02. Current State Audit](02-current-state-audit.md) | All Engineering & Management | Actual verified state of frontend, backend, DB records, and server status |
| [03. Product Requirements](03-product-requirements.md) | PM, UX, QA, Full-Stack Devs | Personas, user stories, acceptance criteria, multi-occasion rules |
| [04. Feature Inventory](04-feature-inventory.md) | PM, QA Lead | Master feature matrix: requirement vs implementation vs test status |
| [05. System Architecture](05-system-architecture.md) | Technical Architects, DevOps | Monorepo structure, Express routers, Vite SPA, Gemini AI pipeline |
| [06. Database & API](06-database-and-api.md) | Backend Engineers, API Consumers | Prisma models, relational integrity, endpoints, payloads, HTTP responses |
| [07. Roles & Permissions](07-user-roles-and-permissions.md) | Security, Full-Stack Devs | RBAC rules, token validation, permission guards, route authentication |
| [08. User Workflows](08-user-workflows.md) | UX Designers, QA, Devs | Host onboarding, invitation creation wizard, guest interactive gate & RSVP |
| [09. Admin Workflows](09-admin-workflows.md) | Admin Operators, AI Engineers | Product template creation, AI prompt generation, conversational iteration |
| [10. UI/UX Design System](10-ui-ux-requirements.md) | Frontend Devs, Designers | Phone viewport frames, color palettes, typography pairs, micro-animations |
| [11. Development Guidelines](11-development-guidelines.md) | New Engineers, Contributors | Setup guide, commands, Prisma migration workflows, code style rules |
| [12. QA Testing Strategy](12-qa-and-testing-strategy.md) | QA Engineers, Automation Devs | Testing methodology, browser automation setup, test pyramid, criteria |
| [13. Test Cases & Results](13-test-cases-and-results.md) | QA, Release Managers | Test logs, pass/fail status, screenshot references for 10 core scenarios |
| [14. Known Issues & Tech Debt](14-known-issues-and-technical-debt.md) | Tech Leads, Devs | Documented quirks, template mapping edge cases, serverless pool limits |
| [15. Project Roadmap](15-project-roadmap-and-milestones.md) | PM, Engineering Managers | Milestones M1–M5, sprint targets, exit criteria, priority distribution |
| [16. Task Backlog](16-task-backlog.md) | Scrum Masters, Dev Teams | Jira-ready backlog cards, story points, acceptance criteria, DoD |
| [17. Deployment & Environment](17-deployment-and-environment.md) | DevOps, SRE | Vercel SPA + Express serverless functions, Supabase DB, env configs |
| [18. Architecture Decisions](18-decision-log.md) | Tech Leads, Architects | Formal ADRs detailing why specific architectural choices were adopted |
| [19. Open Questions](19-open-questions-and-assumptions.md) | Founders, Product Strategy | Pricing threshold experiments, internationalization, custom domains |
| [20. Change History](20-change-history.md) | All Team Members | Full evolutionary timeline of the InviteHub platform |

---

## 4. Current Platform Health Summary

- **Frontend Application:** React 18, TypeScript, Vite, Tailwind CSS running smoothly at `http://localhost:5173`.
- **Backend API Server:** Node.js, Express, Prisma ORM, JSON Web Tokens running at `http://localhost:3000`.
- **Database Engine:** Managed PostgreSQL instance (Supabase) via Prisma ORM with connection pooling.
- **AI Engine:** Google Gemini 2.5 Flash via REST integration for prompt-driven template generation and conversational iteration.
- **Automated Verification:** 10 core end-to-end browser workflows verified with zero rendering regressions.

