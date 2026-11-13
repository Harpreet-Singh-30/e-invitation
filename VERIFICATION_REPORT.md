# VERIFICATION REPORT: PROJECT_MASTER.md vs Actual Codebase

**Date:** November 6, 2026, 4:50 PM IST  
**Branch:** feature/new-saas-model  
**Status:** READ-ONLY VERIFICATION COMPLETE

---

## A. EXECUTIVE SUMMARY

### Critical Finding
**The PROJECT_MASTER.md v2.0 accurately describes the INTENDED product direction but does NOT reflect the actual implementation status.**

### Actual Status
- ✅ **Database:** 13 Prisma models exist (NOT 16 as claimed)
- ✅ **Backend:** 7 auth endpoints working + 4 OLD routes still present
- ⚠️ **Frontend:** Still uses OLD template-purchase model
- ❌ **Multi-occasion:** Database supports it, but NO implementation
- ❌ **Host Dashboard:** Does not exist
- ❌ **Guest RSVP:** No public endpoint implemented

### Key Discrepancy
Documentation claims "16 tables" but only 13 Prisma models exist. The 3 token tables (refresh_tokens, email_verification_tokens, password_reset_tokens) were mentioned as "not in schema" but still counted.

**Actual database tables:** 14 (13 from Prisma + _prisma_migrations)

---

## B. REPOSITORY VERIFICATION

### Git Status
- **Active Branch:** feature/new-saas-model ✅
- **Working Tree:** Clean (4 untracked doc files: ACTION_PLAN.md, DOCS_INDEX.md, PROJECT_MASTER.md, UI_ACCESS_GUIDE.md)
- **Recent Commits:** 5 commits focused on auth implementation

### Technology Stack - VERIFIED ✅
| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | React 18.2, Vite 5.0, TypeScript 5.3 | ✅ VERIFIED |
| UI | Tailwind CSS 3.4 | ✅ VERIFIED |
| State | Zustand 4.4.7 (not used yet) | ✅ INSTALLED |
| Backend | Node 20.20.2, Express 4.18 | ✅ VERIFIED |
| Database | PostgreSQL 16.15 | ✅ VERIFIED |
| ORM | Prisma 5.7.1 | ✅ VERIFIED |
| Auth | JWT (jsonwebtoken 9.0.2) | ✅ VERIFIED |
| Validation | Zod 3.25.76 | ✅ VERIFIED |

---

## C. DATABASE AUDIT

### Schema Models: 13 (NOT 16)
1. User ✅
2. Invitation ✅
3. Event ✅
4. Guest ✅
5. GuestMember ✅
6. Rsvp ✅
7. MediaAsset ✅
8. Theme ✅
9. Subscription ✅
10. Payment ✅
11. ThemePurchase ✅
12. AdminUser ✅
13. AuditLog ✅

**Missing from Prisma schema:**
- refresh_tokens (mentioned in docs but NOT implemented)
- email_verification_tokens (mentioned in docs but NOT implemented)
- password_reset_tokens (mentioned in docs but NOT implemented)

**Current implementation:** Uses stateless JWT (no DB storage for tokens)

### Multi-Occasion Support - PARTIALLY VERIFIED ✅

**Invitation Model:**
- ✅ Has `eventType` field (String)
- ✅ Can store: wedding, birthday, anniversary, etc.
- ✅ Flexible text field (no enum restriction)

**Theme Model:**
- ✅ Has `category` field (String)
- ✅ Seed data shows: wedding (3), birthday (1)
- ✅ Tags array for additional categorization

**Event Model:**
- ✅ Multiple events per invitation supported
- ✅ No hard-coded wedding assumptions
- ✅ orderIndex for sorting

### Per-Event RSVP - VERIFIED ✅

**Rsvp Model:**
- ✅ `eventsAttending` is String[] (PostgreSQL array)
- ✅ Can store multiple event IDs
- ✅ Supports selective event attendance

**VERDICT:** Schema DOES support multi-occasion and per-event RSVP as required by PROJECT_MASTER.md v2.0

### Seed Data Status
```
Users: 6 (3 hosts + 3 test accounts based on previous docs)
Invitations: 1 (wedding type)
Events: 3 (Haldi, Wedding, Reception)
Guests: 2 (households)
Themes: 4 (3 wedding, 1 birthday)
```

---

## D. BACKEND API AUDIT

### Implemented Endpoints: 7 Auth + 9 OLD Routes = 16 total

**Authentication Routes (NEW) - 7 endpoints ✅**
1. POST /api/auth/signup ✅ TESTED
2. POST /api/auth/login ✅ TESTED
3. POST /api/auth/refresh ✅ TESTED
4. POST /api/auth/logout ✅ TESTED
5. POST /api/auth/verify-email ✅ TESTED (dev mode)
6. POST /api/auth/forgot-password ✅ TESTED (dev mode)
7. POST /api/auth/reset-password ✅ TESTED (dev mode)

**OLD Business Model Routes (Still Present) - 9 endpoints ⚠️**

From `routes/public.ts`:
1. GET /api/templates ⚠️
2. POST /api/orders ⚠️
3. POST /api/orders/:id/payment-proof ⚠️
4. POST /api/custom-request ⚠️

From `routes/admin.ts`:
5. POST /admin/login ⚠️ (separate from /api/auth)
6. POST /admin/logout ⚠️
7. GET /admin/me ⚠️
8. GET /admin/orders ⚠️
9. GET /admin/payments ⚠️

From `routes/edit.ts`:
(Token-based editing from OLD model - 5 endpoints not counted above)

**Critical Gap: ZERO Host Dashboard Endpoints**
- ❌ No GET /api/host/invitations
- ❌ No POST /api/host/invitations
- ❌ No GET /api/host/dashboard
- ❌ No guest management endpoints
- ❌ No RSVP retrieval endpoints
- ❌ No theme browsing endpoint for hosts

**Critical Gap: ZERO Guest Experience Endpoints**
- ❌ No GET /invite/:slug/:token
- ❌ No POST /invite/:slug/:token/rsvp
- ❌ No public invitation viewing

### Middleware - VERIFIED ✅
- `requireAuth()` - JWT verification ✅
- `requireRole()` - Role-based access ✅
- `requireSubscription()` - Tier-based access ✅
- `optionalAuth()` - Optional authentication ✅

---

## E. FRONTEND AUDIT

### Existing Pages: 5
1. **Landing.tsx** - Template gallery (OLD purchase model) ⚠️
2. **Editor.tsx** - Token-based editor (OLD model) ⚠️
3. **PublishedSite.tsx** - Guest invitation view ✅ (reusable)
4. **admin/Login.tsx** - Admin login (calls OLD /admin/login) ⚠️
5. **admin/Dashboard.tsx** - Admin dashboard (OLD model) ⚠️

### Existing Templates: 3 ✅
1. royal-maroon-01 (wedding)
2. modern-floral-02 (wedding)
3. classic-gold-03 (wedding)

**All templates are reusable** - Just need data structure updates

### Routing - NEEDS MIGRATION
Current routes (OLD model):
```
/ - Landing
/edit/:token - Editor
/admin/login - Admin
/admin/* - Admin Dashboard
```

Missing routes (NEW model):
```
❌ /signup - Host signup
❌ /login - Host login
❌ /dashboard - Host dashboard
❌ /invitations - Invitation list
❌ /invitations/new - Create invitation
❌ /invitations/:id/edit - Edit invitation
❌ /invite/:slug/:token - Guest view (needs backend endpoint)
```

### Frontend-Backend Integration - NOT CONNECTED ❌
- No auth context/hooks
- No API client configuration
- No protected routes
- No token storage/refresh
- Landing page calls `/api/templates` (OLD endpoint)

---

## F. PRODUCT REQUIREMENTS GAP ANALYSIS

### Documented vs Implemented

| Requirement | PROJECT_MASTER v2.0 | Actual Status |
|-------------|---------------------|---------------|
| Multi-occasion support | ✅ Required | ✅ Schema ready, ❌ No implementation |
| Occasion types | wedding, birthday, anniversary, etc. | Only wedding implemented |
| Host account creation | ✅ Required | ✅ Backend works, ❌ No UI |
| Host dashboard | ✅ Required | ❌ Not implemented |
| Create invitation | ✅ Core feature | ❌ No endpoint, ❌ No UI |
| Choose occasion | ✅ Required | ❌ Not implemented |
| Select theme | ✅ Required | ❌ No host endpoint |
| Add events | ✅ Required | ❌ No endpoint |
| Add guests | ✅ Required | ❌ No endpoint |
| Personalized guest links | ✅ Required | ✅ Schema ready, ❌ No generation |
| Guest RSVP submission | ✅ Core feature | ❌ No endpoint |
| Per-event RSVP | ✅ Required | ✅ Schema ready, ❌ No implementation |
| Mobile-first guest view | ✅ Required | ⚠️ Template exists but no endpoint |
| WhatsApp sharing | ✅ Required | ❌ Not implemented |
| RSVP dashboard | ✅ Required | ❌ Not implemented |

### Critical Blockers for MVP
1. ❌ No host invitation creation workflow
2. ❌ No guest invitation viewing endpoint
3. ❌ No RSVP submission endpoint
4. ❌ Frontend not connected to backend auth

---

## G. SECURITY & TECHNICAL RISKS

### HIGH RISK ⚠️
1. **Token Management:** Stateless JWT with no server-side revocation
   - Logout doesn't actually invalidate tokens
   - Compromised refresh tokens valid for 7 days
   - **Mitigation needed:** Add token blacklist or session store

2. **OLD Routes Still Active:** 9 endpoints from previous model accessible
   - May conflict with NEW model
   - Potential security holes
   - **Action:** Remove or clearly separate

### MEDIUM RISK ⚠️
3. **Email Tokens in Development Response:** Password reset tokens exposed in API response
   - Only in development but still bad practice
   - **Mitigation:** Already noted with `_dev_` prefix

4. **No Rate Limiting on OLD Routes:** Only auth routes have strict limiting
   - **Action:** Apply to all routes

5. **CORS:** Configured for localhost:5173 only
   - **Action:** Update for production domains

### LOW RISK ✓
6. **Passwords:** bcrypt with cost 12 ✅
7. **Input Validation:** Zod schemas on auth ✅
8. **SQL Injection:** Prisma ORM prevents ✅

---

## H. RECOMMENDED IMPLEMENTATION ROADMAP

### Phase 0: Foundation Fixes (1-2 days)
**Priority: CRITICAL**

1. **Remove or Isolate OLD Routes**
   - Decision needed: Delete or keep for reference?
   - Prevents confusion during development
   
2. **Create Frontend Auth Context**
   - Connect to working backend auth
   - Token storage and refresh logic
   - Protected route wrapper

### Phase 1: Minimal Viable Invitation Flow (1 week)
**Priority: HIGH - Delivers end-to-end value**

**Backend (3-4 days):**
1. POST /api/host/invitations (create with occasion type)
2. GET /api/host/invitations (list user's invitations)
3. GET /api/host/invitations/:id (get single)
4. PUT /api/host/invitations/:id (update)
5. PATCH /api/host/invitations/:id/publish (publish/unpublish)

**Frontend (3-4 days):**
1. Host signup/login pages
2. Dashboard shell
3. Create invitation form (occasion + basic details)
4. Invitation list view
5. Publish button

**Acceptance:** Host can signup, create invitation, and see it in dashboard

### Phase 2: Guest Experience (1 week)
**Priority: HIGH - Core value proposition**

**Backend (2-3 days):**
1. GET /api/invite/:slug/:token (view invitation)
2. POST /api/invite/:slug/:token/rsvp (submit RSVP)
3. Guest token generation on invitation creation

**Frontend (2-3 days):**
1. Adapt PublishedSite.tsx for new data structure
2. RSVP form with per-event selection
3. Mobile-responsive layout

**Acceptance:** Guest can open invitation link and submit RSVP

### Phase 3: Event & Guest Management (1 week)
**Priority: MEDIUM**

**Backend:**
1. Event CRUD under invitation
2. Guest CRUD under invitation
3. Guest token regeneration

**Frontend:**
1. Event management UI
2. Guest list and CSV import
3. Copy/share invitation links

### Phase 4: Theme & Media (1 week)
**Priority: MEDIUM**

**Backend:**
1. GET /api/themes (with occasion filtering)
2. POST /api/host/invitations/:id/media (upload)
3. Theme application logic

**Frontend:**
1. Theme selector with preview
2. Image upload and gallery
3. Invitation preview

### Phase 5: Analytics & Polish (1 week)
**Priority: LOW**

1. RSVP analytics dashboard
2. Guest view tracking
3. Export features
4. Email notifications

### Phase 6: Payments (when commercial model finalized)
**Priority: DEFERRED**

- Integrate payment gateway
- Implement chosen pricing model
- Subscription or per-event billing

---

## I. RECOMMENDED NEXT TASK

### Task: Create Host Invitation Creation Flow (Backend)

**Objective:** Enable hosts to create invitations through API

**Files to Create:**
- `server/src/routes/invitations.ts`

**Files to Modify:**
- `server/src/index.ts` (register new routes)

**Implementation:**
```typescript
POST /api/host/invitations
- Auth required
- Body: { title, occasionType, themeId? }
- Generates unique slug
- Returns created invitation

GET /api/host/invitations
- Auth required
- Returns user's invitations with event counts

GET /api/host/invitations/:id
- Auth required
- Ownership check
- Returns invitation with events
```

**Database Impact:** None (tables exist)

**Dependencies:** 
- requireAuth middleware ✅ exists
- Prisma client ✅ configured

**Acceptance Criteria:**
1. Can create invitation with occasion type
2. Slug auto-generated and unique
3. Ownership properly enforced
4. Returns invitation with relationships
5. Proper error handling

**Risk Level:** LOW (straightforward CRUD)

**Estimated Effort:** 4-6 hours

**Why This Task?**
- Unblocks frontend development
- Core to MVP
- No dependencies on incomplete work
- Testable independently
- Demonstrates multi-occasion capability

---

## J. REQUIRED CORRECTIONS TO PROJECT_MASTER.md

### Inaccuracies Found:

1. **"Database schema reportedly contains 16 tables"**
   - **CORRECTION:** 13 Prisma models, 14 actual database tables (including _prisma_migrations)
   - Token tables mentioned but NOT implemented

2. **"Seven authentication endpoints reported as implemented"**
   - **CORRECTION:** Accurate. All 7 work and tested.

3. **"Frontend authentication integration" marked as incomplete**
   - **CORRECTION:** Accurate. No auth integration exists.

4. **"Backend is ready"**
   - **CORRECTION:** Too strong. Auth is ready, but 0 host/guest endpoints exist

5. **"Frontend still reflects OLD model"**
   - **CORRECTION:** Accurate. Landing page expects /api/templates endpoint

6. **Claim about production-ready status**
   - **CORRECTION:** Foundation is solid but not production-ready without core features

### Additions Needed:

1. Clarify that OLD business model routes still exist and need removal decision
2. Note that templates are reusable (not frontend "rebuild" needed)
3. Specify that Zustand is installed but not integrated
4. Acknowledge test script exists and passes (11 auth tests)

---

## FINAL SUMMARY

### What is Genuinely Complete ✅
1. PostgreSQL database with 13-model Prisma schema
2. JWT authentication system (7 endpoints, all tested)
3. Authentication middleware (4 functions)
4. Security infrastructure (Helmet, CORS, rate limiting, Zod)
5. 3 reusable wedding templates
6. Published invitation rendering component

### What is Partially Complete ⚠️
1. Database schema (supports multi-occasion but only wedding data seeded)
2. Backend (auth works, but 9 OLD endpoints remain, 0 NEW host endpoints)
3. Frontend structure (exists but not connected to NEW backend)

### What Has Not Been Implemented ❌
1. Host dashboard (0% - no routes, no UI)
2. Invitation creation workflow (0%)
3. Guest invitation viewing endpoint (0%)
4. RSVP submission endpoint (0%)
5. Event management (0%)
6. Guest management (0%)
7. Theme browsing for hosts (0%)
8. Media upload for invitations (0%)
9. Frontend-backend auth integration (0%)
10. Multi-occasion UI/UX (0%)

### What PROJECT_MASTER.md Describes Inaccurately
1. **Table count:** Says 16, actual is 13 Prisma models
2. **Implementation completeness:** "Backend ready" overstates - only auth is ready
3. **Token storage:** Docs suggest token tables exist; they don't
4. **Frontend rebuild:** Templates are reusable, not everything needs rebuild

### What Should Be Developed Next
**IMMEDIATE:** Host invitation creation endpoint (POST /api/host/invitations)
- Prerequisite for all other features
- Testable independently  
- 4-6 hour effort
- Low risk

**THEN:** Frontend auth integration (1-2 days)
**THEN:** Guest invitation viewing (1 week)

### Decisions Requiring Approval

1. **OLD Routes:** Delete or keep routes in public.ts, edit.ts, admin.ts?
2. **Frontend Strategy:** Adapt existing or start fresh on auth pages?
3. **Commercial Model:** Which pricing to implement first (affects development priority)?
4. **Theme Expansion:** Add more occasion-specific themes or focus on functionality?
5. **Token Storage:** Keep stateless JWT or add database/Redis session store?
6. **Email Service:** Which provider (SendGrid, AWS SES, Resend)?
7. **Development Sequence:** Build all backend first or interleave with frontend?

---

**END OF VERIFICATION REPORT**

**Status:** Ready for implementation approval  
**Next Action:** Await decision on recommended next task  
**Contact:** Pending owner review