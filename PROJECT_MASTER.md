PROJECT MASTER UNDERSTANDING DOCUMENT
Multi-Occasion Digital Invitation Platform
Revision: 2.0
Prepared: November 6, 2026
Based on: Kiro-generated PROJECT_MASTER.md (Version 1.0) and the previously agreed product direction
Purpose: Establish one accurate product and technical direction before further implementation
Status: Product direction revised; implementation claims require code-level verification
1. Executive summary
1.1 What we are building
We are building a multi-occasion digital invitation platform. Hosts can create attractive, interactive invitation websites, personalize them, publish them, share them through WhatsApp and other channels, and manage guest responses.

This is not a wedding-only product and not merely a marketplace for buying static invitation designs.

The core product journey is:
1. A host chooses an occasion.
2. The host selects a suitable invitation design.
3. The host adds event details, images, venue information and other content.
4. The host personalizes the invitation.
5. The host publishes it and receives a shareable URL.
6. The host shares the invitation with guests.
7. Guests open it on a mobile browser without installing an app or creating an account.
8. Guests submit or update their RSVP.
9. The host manages guest responses and attendance from a dashboard.
Product promise: Create. Personalize. Share. Manage. Celebrate. One platform for every celebration.
1.2 Occasions supported
The product architecture should support different occasions without creating a separate application for every occasion.

Initial occasion categories:
- Weddings and wedding functions: Haldi, Mehndi, Sangeet, wedding ceremony, reception and related functions.
- Birthdays: children's birthdays, adult birthdays and milestone celebrations.
- Anniversaries.
- Parties and get-togethers.
- Baby showers and naming ceremonies.
- Housewarming ceremonies.
- Religious and family celebrations.
Potential later expansion:
- Corporate events.
- Community events.
- Other public or private gatherings.
The initial launch can focus on weddings and family celebrations, including birthdays and parties. The underlying product model should not hard-code wedding assumptions into every invitation, event, guest or RSVP feature.
1.3 Core product differentiators
- Interactive invitation microsites rather than only static JPG or PDF files.
- Mobile-first experience suitable for WhatsApp sharing and in-app browsers.
- Guest access without app installation or guest account creation.
- Personalization through themes, fonts, colors, content, photographs and supported media.
- Optional animated covers, countdowns, galleries, music and maps, depending on the template and plan.
- Unique invitation links, including personalized guest or household links.
- Structured RSVP and guest management in the platform.
- Multiple functions/events under one invitation where the occasion requires them.
- Optional premium or custom-design assistance for customers who do not want to build everything themselves.
2. Business model and monetization
2.1 Business model direction
The intended model is a hybrid self-service platform with optional premium services.

Potential revenue streams:
1. Free entry tier to help users discover and try the platform.
2. One-time per-event packages.
3. Premium templates and advanced design features.
4. Optional custom invitation design or concierge service.
5. Add-ons such as additional media capacity, custom domains and advanced personalization.
6. Future planner, business or white-label plans.
The platform may later offer subscriptions for frequent users, event planners or businesses. However, an annual subscription should not be treated as the only or already-finalized business model.
2.2 Pricing status
Pricing must be validated with customer research and competitor checks before implementation.

Earlier illustrative ranges discussed:
Package concept	Indicative price	Status
Free	₹0	Hypothesis
Basic per-event	₹499–₹799	Hypothesis
Premium per-event	₹999–₹1,499	Hypothesis
Luxury/custom	₹2,499+	Hypothesis


These are planning estimates, not approved prices.

The current Kiro document lists Free, Pro and Business annual subscription tiers (including ₹999/year and ₹1,999/year). Those figures should be treated as an existing proposal in the project documentation, not as a validated commercial decision.

Implementation implication: Keep plan limits and entitlements configurable. Do not hard-code pricing or assume all customers must subscribe annually.
2.3 Product packaging considerations
Possible configurable limits include:
- Number of active invitations.
- Number of events/functions per invitation.
- Guest or household count.
- Available themes.
- Media storage and upload limits.
- Custom branding or watermark.
- Custom domain.
- RSVP and analytics features.
- Concierge design availability.
The exact packaging should be decided after validating willingness to pay and operating costs.
3. Product concepts and domain model
A key architectural principle is to separate common event capabilities from occasion-specific presentation and configuration.
3.1 Core concepts
Concept	Meaning
Host/User	Person or business creating and managing invitations
Invitation	The published or draft invitation experience owned by a host
Occasion type	Wedding, birthday, anniversary, party, baby shower, etc.
Event/Function	A dated activity within an invitation; optional multiplicity
Theme	Reusable visual design/template with supported configuration
Guest	A recipient or household invited to an invitation
Guest member	An individual represented within a household/group
Guest invitation link	Secure link allowing a recipient to view their invitation
RSVP	A structured response from a guest or household
Event attendance	Whether a guest plans to attend a particular event/function
Media asset	Uploaded image, audio or other supported media
Subscription/Entitlement	Optional plan or purchase that determines feature access
Payment	Financial transaction associated with a purchase or plan


3.2 Invitation and event structure
An invitation should have an occasion type, such as wedding, birthday, anniversary or party.

An invitation may contain:
- One primary event, for example a birthday party.
- Multiple related events/functions, for example Haldi, Mehndi, wedding and reception.
- Shared invitation-level details, such as host names, introductory message, design theme and gallery.
- Event-specific details, such as date, time, venue, map location and attendance response.
Do not require every invitation to have multiple events. A birthday invitation should remain simple to create.

Do not assume every occasion has wedding-style functions. Use optional event collections and occasion-specific configuration.
3.3 Occasion-specific features
Use reusable components and configuration rather than separate hard-coded application flows.

Examples:
- Wedding: multiple functions, family/household invitations, per-function attendance.
- Birthday: celebrant details, age or milestone wording, party date, venue and RSVP.
- Anniversary: couple details, milestone wording, event details and RSVP.
- Baby shower: parents-to-be details, event information and optional registry/link fields if later validated.
- Corporate event (future): organization branding, registration fields and attendance reporting.
These are product examples, not a requirement to build every specialized feature in the first release.
3.4 Guest and household model
The existing guests and guest_members concepts are directionally useful.

The product should support:
- Individual guests.
- Families or households.
- A household headcount.
- Optional individual names within a household.
- A unique, non-guessable guest access token or invitation URL.
- Guest-specific or household-specific greeting/personalization.
- RSVP updates through the same authorized link, subject to the chosen rules.
For example, a host may share a personalized link with a household rather than creating a separate public invitation for each family member.

Guest links should use cryptographically random tokens, not sequential database IDs or easily guessed values. Consider token rotation/revocation and the consequences of a link being forwarded.
4. Guest experience and RSVP requirements
4.1 Guest experience
The guest experience is a central part of the product, not an afterthought.

Requirements:
- Mobile-first rendering.
- Good performance on mobile networks.
- Compatibility with WhatsApp in-app browsers and common mobile browsers.
- No app installation required.
- No guest account required for ordinary invitation viewing and RSVP.
- Clear event details, date/time and venue.
- Map/directions link where configured.
- Accessible text, contrast, focus behavior and controls.
- Respect reduced-motion preferences for animations.
- Clear RSVP confirmation and, where supported, the ability to update a response.
4.2 RSVP data
WhatsApp is a sharing and communication channel; it should not be the only place where RSVP data exists.

RSVPs should be stored as structured application data so hosts can view and manage responses.

Common RSVP capabilities:
- Attending / not attending / maybe, if enabled.
- Number of attendees.
- Individual guest responses where appropriate.
- Optional dietary or other host-configured questions.
- Submission and update timestamps.
- Duplicate-submission handling.
- Host dashboard summaries and exports.
For multi-event invitations, support attendance per event/function. A guest may attend the wedding but not the reception, for example.

Schema verification required: The current Kiro document describes a guests to rsvps relationship but does not establish whether the schema can represent separate attendance responses for multiple events. Inspect schema.prisma and the migrations before deciding whether a schema change is required. A single RSVP record per guest may be insufficient if attendance must be recorded independently for each event.
5. Existing technical architecture
The current Kiro-generated document reports the following stack. Preserve it as the working baseline unless direct code inspection identifies a specific limitation.
Layer	Reported technology	Assessment
Frontend	React 18, Vite, TypeScript	Retain
UI	Tailwind CSS	Retain
Routing	React Router 6	Retain
State management	Zustand	Retain; integrate where useful
HTTP client	Axios	Retain
Backend	Node.js 20, Express	Retain
Database	PostgreSQL 16.15	Retain
ORM	Prisma 5.22	Retain
Authentication	JWT	Retain subject to security review
Validation	Zod	Retain
Password hashing	bcrypt	Retain
Security middleware	Helmet, CORS, rate limiting	Retain and verify configuration


This is a coherent TypeScript-based application stack. There is no product-driven reason in the supplied document to migrate to Next.js, replace Express, or replace PostgreSQL.

The actual repository, dependency versions, deployment target and runtime behavior have not been independently inspected as part of this document review.
5.1 Architecture boundaries
The reported architecture has three main user-facing experiences:
1. Host application: account, dashboard, invitation builder, guests, RSVP and billing.
2. Guest invitation experience: public-facing invitation page with secure guest-specific access where applicable.
3. Platform administration: internal tools for support, moderation, users, plans and platform operations.
Keep these experiences logically separated while reusing shared components and API services.
6. Current implementation status — based on Kiro's report
The following is a transcription and interpretation of the status reported in the supplied Version 1.0 document. It is not an independent code audit.
6.1 Reported completed foundation
- PostgreSQL database configured.
- Prisma ORM configured.
- Database schema reportedly contains 16 tables.
- Seed data reportedly exists for users, themes and a sample invitation.
- Express server configured.
- Seven authentication endpoints reported as implemented.
- JWT utilities and authentication middleware reported as implemented.
- Zod validation, Helmet, CORS and rate limiting reported as configured.
- React/Vite frontend exists.
- Existing template gallery, editor and published invitation page exist.
- Project documentation reportedly includes API specifications, setup guides and handoff documents.
6.2 Implementation status update (as of November 6, 2026)

**Completed since Version 2.0:**
- **Host Invitation API Foundation (3 endpoints):**
  - POST /api/host/invitations - Create invitation with occasion type
  - GET /api/host/invitations - List user's invitations with stats
  - GET /api/host/invitations/:id - Retrieve invitation with full details
  - Authentication: JWT-based with requireAuth middleware
  - Ownership enforcement: Database-level filtering by userId
  - Multi-occasion support: 9 occasion types (wedding, birthday, anniversary, baby_shower, housewarming, party, religious, family_celebration, other)
  - Validation: Zod schemas, UUID validation, theme verification
  - Slug generation: Automatic, unique, collision-safe
  - Default state: Unpublished (isPublished: false, isLive: false)
  - Test coverage: 13 scenarios, all passing
  - Files: server/src/routes/invitations.ts (334 lines), scripts/test-invitation-api.sh

**Still incomplete:**
- Frontend authentication integration.
- Host dashboard UI.
- Invitation update and delete endpoints (PUT, PATCH, DELETE).
- Invitation creation/editing UI.
- Event/function management APIs and UI.
- Guest and household management APIs and UI.
- RSVP submission and management APIs and UI.
- Media upload and management.
- Theme discovery, preview and application.
- Guest invitation viewing endpoint (public).
- Email delivery.
- Payment integration.
- Admin functionality for the new model.
- Analytics and production deployment hardening.
6.3 Important status corrections
The Version 1.0 document uses phrases such as “backend is ready,” “production-ready quality,” “security is solid,” and “API spec is production-ready.”

Those claims are stronger than the evidence in the document supports.

A more accurate status is:
- Backend foundation reported as implemented: yes.
- Core product workflows implemented end-to-end: no, according to the same document.
- Production readiness demonstrated: not established.
- Security review completed: not established.
- Database schema validated against all multi-occasion requirements: not established.
- Commercial model validated: not established.
A database table existing does not mean its feature is implemented. An endpoint specification does not mean the endpoint exists or has passed integration tests.

6.4 Technical notes (as of November 6, 2026)

**TypeScript Build Status:**
- `npm run build` fails with pre-existing TypeScript errors
- Errors include: TS4023 in db/index.ts (BetterSqlite3 export), JWT type signature issues
- These errors existed before the Host Invitation API implementation
- Development server runs successfully with `npm run dev` (tsx runtime)
- New invitation routes code follows existing TypeScript patterns and does not introduce new errors
- **Recommendation:** Fix TypeScript errors in a separate task; does not block MVP development

**Test Results:**
- Authentication endpoints: 7/7 passing
- Host Invitation API: 13/13 test scenarios passing
- Test script: scripts/test-invitation-api.sh (executable, 294 lines)
- Test coverage: authentication enforcement, ownership validation, input validation, multi-occasion support, slug uniqueness, regression testing
- Test environment: localhost:3000 with test@example.com account
- **Status:** All implemented endpoints verified and working

**Git Status:**
- Branch: feature/new-saas-model
- Modified: server/src/index.ts (2 lines added)
- Untracked: server/src/routes/invitations.ts, scripts/test-invitation-api.sh, documentation files
- No breaking changes to existing functionality

7. Database and API review items
7.1 Reported database tables
The original document lists these 13 tables as present in the Prisma schema:
1. users
2. invitations
3. events
4. guests
5. rsvps
6. guest_members
7. media_assets
8. themes
9. subscriptions
10. payments
11. theme_purchases
12. admin_users
13. audit_log
It separately mentions three token tables that are not in the Prisma schema:
- refresh_tokens
- email_verification_tokens
- password_reset_tokens
Therefore, the statement “16 tables created” needs clarification. The report itself says the three token tables are not in the schema. Confirm the actual database tables and Prisma models before stating that all 16 are implemented.
7.2 Schema checks required
Before adding new tables or changing relationships, inspect the current schema and migrations for:
- Whether invitation occasion type is represented explicitly and flexibly.
- Whether theme records can be associated with multiple occasion types.
- Whether a single-event invitation is supported cleanly.
- Whether a multi-event invitation supports per-event RSVP.
- Whether household headcount and individual guest responses are represented correctly.
- Whether guest access tokens are securely generated, stored and revocable.
- Whether media assets are linked to the correct invitation and owner.
- Whether ownership checks can prevent cross-user access.
- Whether subscription and one-time purchase entitlements can coexist.
- Whether invitation publication, expiry and deletion states are represented.
Do not alter the schema merely because this list exists. First compare it with the actual Prisma schema, migrations and product requirements.
7.3 API scope
The original document reports 49 planned endpoints: seven authentication endpoints and 42 remaining endpoints across host, events, guests, media, guest view, admin and payments.

The API inventory is a planning baseline, not proof that every endpoint is necessary for the first release.

Prioritize APIs by complete user journey. Avoid building a large set of disconnected endpoints before a host can create, publish and share one working invitation.
8. Security, privacy and operational requirements
The supplied report identifies several security gaps. These should be addressed before production, but not all need to block local development.
8.1 Authentication and session security
The report says access tokens expire after one hour and refresh tokens after seven days, using HS256.

It also says refresh tokens are stateless and there is no server-side blacklist. This means logout and revocation are limited if a refresh token has already been issued.

Before production:
- Decide how refresh-token revocation and rotation will work.
- Consider storing hashed refresh tokens or session records in a database or suitable store.
- Ensure logout invalidates the relevant session/token.
- Review token storage. The current document proposes localStorage; assess XSS exposure and consider secure, HttpOnly, SameSite cookies where appropriate for the architecture.
- Keep secrets out of source control and rotate any credentials that may have been exposed in documentation or shared logs.
- Ensure development-only token responses are impossible in production.
- Configure HTTPS/TLS in deployment.
- Apply authorization and ownership checks to every host resource.
2FA and account lockout may be considered according to the actual risk and launch requirements; they should not be treated as prerequisites for every local development step.
8.2 Invitation privacy
Invitation pages may contain personal names, dates, venues, family details and photographs.

Plan for:
- Unpredictable guest tokens.
- Ability to revoke or regenerate a guest link.
- No indexing of private invitation pages where appropriate.
- Minimal exposure of guest data in public API responses.
- Rate limiting on public invitation and RSVP endpoints.
- Clear data retention and deletion behavior.
- Consent and privacy notices appropriate to the markets served.
8.3 Email and payment security
- Email verification and password reset must use secure, expiring, single-use tokens.
- Do not return password-reset tokens to users in production.
- Payment status must be confirmed through verified gateway webhooks, not only frontend success redirects.
- Do not store raw card details.
- Keep gateway secrets server-side.
9. Product MVP and delivery priorities
The project should be delivered as a working vertical slice, not as a backend-only project followed by a complete frontend rebuild.
Phase 0 — Repository and foundation verification
Before implementing more features:
1. Confirm the active branch and current working tree.
2. Review the actual frontend and backend package files.
3. Review schema.prisma and migrations.
4. Run the existing application and current test scripts.
5. Verify the seven reported authentication endpoints.
6. Identify what can be reused from the old template gallery, editor and published invitation page.
7. Record actual status separately from planned status.
Deliverable: Verified technical baseline and a safe implementation plan.
Phase 1 — Host account and dashboard
- Signup and login UI.
- Logout and session handling.
- Password reset and email verification flow, with development and production behavior clearly separated.
- Protected host routes.
- Minimal host dashboard.
- Invitation list, including a useful empty state.
Acceptance outcome: A host can register, log in and reach a functioning dashboard.
Phase 2 — First complete invitation journey
- Choose an occasion type.
- Browse suitable templates.
- Create a draft invitation.
- Add basic invitation details.
- Support one event by default.
- Allow additional events/functions where needed.
- Preview the invitation.
- Save and edit the draft.
- Publish and generate a shareable URL.
Acceptance outcome: A host can create and publish a usable invitation without manual database work.
Phase 3 — Guest sharing and RSVP
- Add individual guests and households.
- Generate secure personalized guest links.
- Share links through WhatsApp using a share action/deep link.
- Render the invitation in mobile browsers.
- Submit and update structured RSVP responses.
- Support headcount.
- Support per-event attendance when an invitation has multiple events.
- Show RSVP status to the host.
Acceptance outcome: A guest can open a shared invitation and submit an RSVP that the host can see.
Phase 4 — Theme and media experience
- Theme listing and preview.
- Occasion-aware theme discovery.
- Apply a theme to an invitation.
- Configure supported colors, typography and content.
- Upload and manage images.
- Add optional gallery, countdown, map and other supported sections.
- Ensure mobile performance and accessibility.
Acceptance outcome: The host can produce a visually compelling invitation using the available builder and themes.
Phase 5 — Commercial features
Only after the core journey works:
- Finalize packaging and entitlements.
- Decide whether to launch with per-event payments, subscriptions or both.
- Integrate the appropriate payment gateway (Razorpay is a plausible India-first option; confirm business requirements before choosing).
- Implement verified payment webhooks.
- Add custom domain, advanced media and premium features as justified.
- Add optional concierge/custom-design workflow.
Acceptance outcome: A customer can purchase and receive the features promised by the selected package.
Phase 6 — Admin, analytics and launch readiness
- Admin user and invitation support tools.
- Platform analytics.
- Audit logging.
- Email templates and delivery monitoring.
- Automated tests and end-to-end tests.
- Security and privacy review.
- Backups, monitoring and deployment.
- Performance and accessibility checks.
Do not treat the original 16-week estimate as guaranteed. Re-estimate after Phase 0, based on actual code quality, available time and the verified scope.
10. Frontend strategy
The original report says the frontend still reflects the old one-time template-purchase model and needs migration.

That may be correct, but “complete rebuild” should not be the default assumption.
10.1 Reuse-first approach
Inspect and classify each existing page/component:
Existing area	Initial recommendation
Landing/template gallery	Rework messaging and navigation for multi-occasion discovery; reuse useful UI
Editor	Inspect reusable editor and template-rendering logic before replacing it
Published invitation page	Reuse and adapt if its rendering and data model support the new requirements
Admin login/dashboard	Rework against the new auth and admin requirements
Existing templates	Reuse compatible visual templates and make them occasion-aware


Keep working UI and template code wherever possible. Replace only what is incompatible with the new product flow.
10.2 Suggested host navigation
- Dashboard
- My Invitations
- Create Invitation
- Themes
- Account / Settings
- Plan or Purchases (when commercial features are enabled)
The guest invitation experience should remain separate from the authenticated host dashboard.
11. Important product and technical decisions still open
These decisions should be made deliberately rather than silently assumed by implementation agents.
1. Commercial packaging: per-event purchase, annual subscription, or a hybrid launch.
2. Free tier: which limits are useful for acquisition without making the free product unsustainable.
3. Guest identity: household-level RSVP, individual-level RSVP, or both depending on invitation settings.
4. RSVP model: whether guests can edit responses and until what deadline.
5. Privacy: whether a guest link alone grants access or whether optional PIN/access controls are needed.
6. Themes: how occasion categories, languages, layouts and feature capabilities are represented.
7. Media: file types, storage limits, compression and hosting.
8. Messaging: WhatsApp sharing first; decide later whether any official WhatsApp Business API integration is needed.
9. Email: provider and transactional email requirements.
10. Payments: gateway, refund policy, tax/invoice requirements and webhook handling.
11. Custom service: how custom design orders are requested, quoted and delivered.
12. Launch scope: exact occasions and templates included in the first public release.
12. Corrections to the original Version 1.0 conclusions
Original claim or direction	Revised interpretation
“Wedding Invitation SaaS Platform”	Multi-occasion digital invitation platform
Subscription-based model is decided	Hybrid model is the current direction; packaging remains to be validated
Backend is production-ready	Backend foundation is reported as implemented; production readiness is unverified
Database schema is comprehensive	Existing schema is promising; multi-occasion and per-event RSVP fit must be verified
API specification is production-ready	API inventory is a planning baseline; endpoint implementation and requirements need validation
Frontend needs complete rebuild	Perform a reuse-first audit; rebuild only incompatible areas
Build authentication UI immediately	First verify the repository, current branch, auth behavior and existing reusable UI
Payments are part of a fixed Week 13–14 phase	Defer payment implementation until core workflow and commercial packaging are validated
16-week timeline is realistic	Re-estimate after repository and feature-scope verification


13. Immediate next actions

**Phase 0 Verification: ✅ COMPLETE (November 6, 2026)**

The initial repository verification has been completed with the following findings:
1. ✅ Branch confirmed: feature/new-saas-model
2. ✅ Working tree: Clean with documented untracked files
3. ✅ Endpoints verified: 7 auth + 3 host invitation (all tested and passing)
4. ✅ Database: 13 Prisma models confirmed (not 16 as initially reported)
5. ✅ Schema validation: Supports multi-occasion, single/multi-event, per-event RSVP
6. ✅ Frontend audit: Reusable templates and components identified
7. ✅ Security: Authentication and ownership enforcement verified in implementation
8. ✅ Gap analysis: Documented in VERIFICATION_REPORT.md

**Host Invitation API Foundation: ✅ IMPLEMENTED**
- Three endpoints: POST, GET (list), GET (single)
- Test coverage: 13/13 scenarios passing
- Documentation: IMPLEMENTATION_REPORT_01.md

**Recommended Next Steps:**

1. **Update and Publish Endpoints (1-2 days)**
   - PUT /api/host/invitations/:id - Update invitation details
   - PATCH /api/host/invitations/:id/publish - Publish/unpublish
   - DELETE /api/host/invitations/:id - Delete invitation (with cascade)

2. **Frontend Authentication Integration (1-2 days)**
   - Auth context with token management
   - Protected routes
   - Signup/login UI
   - Connect to working backend auth

3. **Host Dashboard Shell (2-3 days)**
   - Dashboard layout
   - Invitation list component
   - Create invitation form (occasion selector)
   - Basic navigation

4. **Event Management APIs (2-3 days)**
   - POST /api/host/invitations/:id/events
   - GET /api/host/invitations/:id/events
   - PUT /api/host/invitations/:id/events/:eventId
   - DELETE /api/host/invitations/:id/events/:eventId

After these steps, the platform will have a working host experience for creating and managing invitations with events.

14. Instructions for future AI coding sessions
Treat this document as the product-direction baseline.
- Do not turn the product back into a wedding-only platform.
- Do not assume annual subscriptions are the only revenue model.
- Do not replace the existing stack without a concrete technical reason.
- Do not assume a feature is complete just because a table, API specification or placeholder page exists.
- Do not rebuild working frontend components before checking whether they can be reused.
- Do not modify unrelated working functionality.
- Do not make broad changes across multiple phases in one task.
- Inspect the relevant files before editing.
- State the intended files and scope before implementation.
- Implement one vertical slice at a time.
- Run relevant tests and report exact results.
- Keep documentation synchronized with verified code, not intended future behavior.
- Never expose real secrets, passwords, tokens or production credentials in documentation.
Definition of a successful MVP
A host can:
1. Create an account and log in.
2. Choose an occasion.
3. Select and personalize a suitable invitation.
4. Add one or more events as appropriate.
5. Add guests or households.
6. Publish the invitation.
7. Share personalized links through WhatsApp.
8. Receive structured RSVPs.
9. View and manage guest responses.
A guest can open the invitation on a mobile browser without installing an app or creating an account.

The first release does not need every advanced feature, every occasion-specific module, a full planner portal or complex subscription automation. It needs one polished, reliable end-to-end experience that proves the core value.

---

**Document version: 2.2**  
**Last updated: November 7, 2026**  
**Supersedes:** Version 2.1 as the product-direction and implementation status baseline

**Version 2.2 Updates (Task 05: Premium Digital Wedding Invitation Template Collection):**
- **Six Wedding Templates Fully Functional**: Expanded collection from 3 to 6 genuinely distinct digital wedding invitation templates:
  1. `royal-maroon` (Royal Maroon): Traditional Indian wedding theme with maroon & gold accents.
  2. `modern-floral` (Modern Floral): Contemporary romantic theme with pastel floral elements.
  3. `classic-gold` (Classic Gold): Timeless elegance with champagne gold and ornate borders.
  4. `ivory-kayal` (Ivory Kayal): South Indian heritage editorial with warm ivory, muted sage green, and antique gold.
  5. `marigold-courtyard` (Marigold Courtyard): Festive Indian wedding theme with marigold orange, terracotta, and multi-event itinerary.
  6. `midnight-vows` (Midnight Vows): Cinematic luxury theme with midnight navy, dark plum, and starlight champagne gold.
- **Unified Template Architecture**:
  - `web/src/templates/registry.ts`: Single source of truth resolving slug, componentName, legacy internal IDs, and verified database UUIDs.
  - `web/src/templates/adapter.ts`: Shared invitation data contract adapting backend models and live editor form state to template components.
  - `web/src/templates/common/audio.ts`: Web Audio ambient synthesizer providing tranquil music accompaniment without external network audio dependencies.
- **Database Theme Records**:
  - Idempotent seed (`server/prisma/seed.ts`) successfully updated and executed against development database.
  - 7 active themes in database (6 wedding + 1 birthday theme).
  - Verified Theme UUIDs:
    - Ivory Kayal: `093b32a3-1925-4b85-9f6a-d729db2be9be`
    - Marigold Courtyard: `58b36b41-1ea3-4279-862e-5674a63a9d6a`
    - Midnight Vows: `1056bc70-959d-42e4-9a2f-058418ceba6e`
- **Frontend Integration & Responsiveness**:
  - `TemplateGallery`: Displays all 6 wedding designs with real React thumbnails; category filtering functional.
  - `TemplatePreview`: Working desktop & mobile previews for all 6 templates with realistic demo content.
  - `InvitationEditor`: Live preview renders all 6 wedding templates, updating immediately upon field edits; draft save and reload verified.
- **Build & Test Verification**:
  - Frontend (`npm --prefix web run build`) and Backend (`npm --prefix server run build`) compile with 0 errors.
  - Comprehensive browser test suite executed via Puppeteer (11/11 phases passed across 1440px desktop, 768px tablet, 375px mobile).
