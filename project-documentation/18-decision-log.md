# 18. Architectural Decision Log (ADRs)

> **Document Version:** 1.0.0  
> **Author:** Senior Technical Architect  
> **Status:** Authoritative Architectural Record  
> **Format:** Michael Nygard ADR Standard

---

## ADR-001: Decoupled Monorepo (Vite SPA + Express REST API)

### Status: Accepted & Implemented
### Context
Earlier project blueprints debated between an all-in-one Next.js framework versus a decoupled React SPA + Express backend. The platform requires high-speed mobile client rendering, complex client-side state manipulation (split-screen customizer and phone iframe mockups), and rapid API iteration.
### Decision
Adopt a decoupled monorepo structure with `web/` (React 18, Vite, Tailwind) and `server/` (Node.js, Express, TypeScript, Prisma).
### Consequences
* **Positive:** Complete isolation of frontend UI rendering from backend business logic; blazing-fast Vite HMR during development; straightforward deployment on Vercel or independent container hosting.
* **Negative:** Requires managing two separate `package.json` dependency graphs.

---

## ADR-002: Prisma ORM with Managed PostgreSQL (Supabase)

### Status: Accepted & Implemented
### Context
The application manages relational data: Users, Invitations, Themes, Sub-Events, Guests, RSVPs, and Payments. Data integrity, type safety, and painless migrations were paramount.
### Decision
Use Prisma ORM 5.x connecting to a hosted PostgreSQL instance on Supabase.
### Consequences
* **Positive:** End-to-end TypeScript type generation directly from `schema.prisma`; declarative schema migrations; robust protection against SQL injection.
* **Negative:** Serverless environments require connection pooling (`pgbouncer`) to avoid connection saturation.

---

## ADR-003: Tailwind CSS & Lucide Icons for Luxury Design System

### Status: Accepted & Implemented
### Context
Event invitations demand bespoke visual styling, gradients, gold foil accents, and fluid mobile responsiveness. Heavy component libraries (MUI, Ant Design) introduce styling bloat and opinionated desktop patterns.
### Decision
Adopt Tailwind CSS 3.x with Lucide React icon primitives and CSS custom property tokens.
### Consequences
* **Positive:** Zero runtime CSS overhead; ultra-fast styling iteration; full control over mobile viewport constraints (`rounded-[40px]`, custom aspect ratios).
* **Negative:** Long class strings in JSX templates if not decomposed cleanly.

---

## ADR-004: Transition from Subscription SaaS to Hybrid Pay-Per-Event

### Status: Accepted & Implemented
### Context
The original product blueprint assumed a recurring SaaS model (e.g. ₹999/month). User testing and event industry economics revealed that events are episodic, high-intent transactions. Users refuse recurring subscriptions for a one-time wedding or birthday.
### Decision
Adopt a **Hybrid Pay-Per-Event Model**: Free basic tier (₹0 for 25 guests, 1 event), Standard tier (₹299 for 100 guests, 3 events), and Premium tier (₹499 for unlimited RSVPs, custom music, no watermark).
### Consequences
* **Positive:** Drastically reduced conversion friction; higher organic adoption; clear value propositions at point of purchase.
* **Negative:** Lower customer lifetime value per single event unless word-of-mouth creates repeat event bookings.

---

## ADR-005: Decoupled Archetype-Manifest Pattern for Dynamic Theme Registry

### Status: Accepted & Implemented
### Context
Creating and maintaining hundreds of unique React components for every visual template would lead to massive bundle sizes and endless maintenance overhead.
### Decision
Establish 16 foundational layout archetypes (`web/src/templates/components/`) and decouple them from theme manifests. A theme in the catalog is merely a JSON specification (palette tokens, font families, decorative borders, occasion copy) that hydrates one of the 16 core layout archetypes.
### Consequences
* **Positive:** Unlimited themes can be created in the database without adding new JavaScript files; bundle sizes remain minimal; the AI Template Studio can generate new themes instantly.
* **Negative:** Unique layout structures that do not fit into the 16 archetypes require adding a new archetype component.

---

## ADR-006: Google Gemini 2.5 Flash for Prompt-Driven Admin Template Studio

### Status: Accepted & Implemented
### Context
Platform administrators need to react swiftly to viral celebration trends (e.g. Bollywood retro, destination beach parties, cultural festivals) without waiting for engineering design sprints.
### Decision
Integrate Google Gemini 2.5 Flash via REST API in `/admin/studio` to generate structured JSON theme manifests from natural language prompts.
### Consequences
* **Positive:** Non-technical administrators can design and publish complete templates to the live catalog in under 60 seconds; conversational iteration ("Lovable Mode") allows instant tweaking.
* **Negative:** Requires an active `GEMINI_API_KEY` and disciplined system prompt engineering to enforce schema compliance.

