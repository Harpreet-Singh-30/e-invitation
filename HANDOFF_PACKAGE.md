# 🎯 COMPLETE HANDOFF PACKAGE - Wedding Invitation SaaS

**Date:** November 6, 2026, 1:53 PM IST  
**Status:** Ready for Next Session  
**Progress:** Planning Phase Complete (3/8 core docs done)

---

## 📋 QUICK START FOR NEXT SESSION

### What We've Built (Current State)
- ✅ Wedding invitation platform with template purchase model
- ✅ 3 premium templates (Royal Maroon, Modern Floral, Classic Gold)
- ✅ All 7 premium features in Royal Maroon (animations, countdown, RSVP, etc.)
- ✅ Backend: Node.js + Express + TypeScript + SQLite
- ✅ Frontend: React + Vite + Tailwind
- ✅ Running locally on ports 3000 (backend) and 5174 (frontend)

### What's Changing (New Model)
- ❌ OLD: Couples buy templates for subdomain sites
- ✅ NEW: SaaS platform where hosts create invites with personalized guest links
- Key shift: From "one URL per couple" to "one URL per guest household"

---

## 📚 COMPLETE DOCUMENTATION (Already Created)

### 1. **BUSINESS_MODEL_TRANSITION.md** (837 lines)
**What's Inside:**
- Side-by-side comparison: Old vs New architecture
- What to keep/transform/remove from existing code
- Database comparison (10 tables → 16 tables)
- URL structure change (subdomains → path-based with tokens)
- Payment flow transformation (manual UPI → automated Stripe/Razorpay)
- Template → Theme conversion strategy
- Feature comparison matrix
- Migration checklist (8 phases)
- Implementation timeline (3-4 months)

**Key Decisions Documented:**
- Fresh database (no migration from old)
- Path-based URLs: `/invite/{slug}/{token}`
- PostgreSQL instead of SQLite
- Freemium pricing model
- Reusable themes (no exclusivity)
- Multi-event support for Indian weddings
- WhatsApp-first distribution

### 2. **DATABASE_SCHEMA_NEW.md** (1,264 lines)
**What's Inside:**
- Complete PostgreSQL schema with 16 tables
- Full Prisma schema (copy-paste ready)
- Entity relationship diagrams
- All table definitions with columns, types, constraints
- Indexes for performance
- Security considerations
- Seed data examples
- Scaling strategies

**Core Tables:**
- `users` - Host accounts with subscriptions
- `invitations` - Event microsites (wedding/birthday/etc.)
- `events` - Multiple events per invitation (Haldi, Wedding, Reception)
- `guests` - Households with secure tokens for personalized URLs
- `rsvps` - Per-event attendance tracking
- `media_assets` - Photos, music, invitation cards
- `themes` - Reusable design templates
- `subscriptions` - User plans (free/pro/business)
- `payments` - Transaction history
- `theme_purchases` - Premium theme unlocks

### 3. **API_SPECIFICATION.md** (2,436 lines)
**What's Inside:**
- 49 complete API endpoints with request/response examples
- Authentication flow (JWT for hosts, tokens for guests)
- Error handling (standard formats, status codes)
- Rate limiting rules
- Validation schemas
- Security patterns

**API Categories:**
- **Auth APIs (7):** signup, login, refresh, logout, verify email, reset password
- **Host APIs (28):** dashboard, invitations CRUD, events, guests, RSVPs, media, themes, subscriptions
- **Guest APIs (4):** view invitation, submit/update RSVP, tracking
- **Admin APIs (6):** platform stats, user management, analytics, audit log
- **Public APIs (3):** themes list, pricing, contact
- **Webhooks (2):** Stripe, Razorpay payment events

---

## 🚀 IMMEDIATE NEXT STEPS

### For Your Next Kiro Session:

**COPY THIS PROMPT:**
```
I'm continuing the wedding invitation SaaS transformation project. 

Current status:
- Old system: Template purchase model (working prototype)
- New system: SaaS with personalized guest links (planning phase)
- Completed docs: BUSINESS_MODEL_TRANSITION.md, DATABASE_SCHEMA_NEW.md, API_SPECIFICATION.md

What I need now:
1. Frontend architecture design (component hierarchy, routing, state management)
2. Business model documentation (pricing tiers, revenue projections, feature matrix)
3. Guest link system design (token generation, WhatsApp sharing, OG tags)
4. Multi-event RSVP system design (per-function tracking, analytics)
5. Then start Phase 2: Core Infrastructure implementation

Please review the existing docs in /home/harpreet/E-invetation/ and continue from there.
```

---

## 🏗️ IMPLEMENTATION ROADMAP (4 Months)

### **Month 1: Foundation**
**Weeks 1-2: Database & Auth**
- Set up PostgreSQL database
- Create Prisma schema (use DATABASE_SCHEMA_NEW.md)
- Implement authentication (JWT + sessions)
- Build user signup/login/refresh endpoints

**Weeks 3-4: Core Backend**
- Theme system (convert existing 3 templates)
- Invitation CRUD APIs
- Event management APIs
- Basic admin panel

### **Month 2: Host Tools**
**Weeks 5-6: Invitation Builder**
- Host dashboard UI
- Create invitation wizard (multi-step form)
- Event management interface
- Theme selector with preview

**Weeks 7-8: Guest Management**
- CSV upload for guest lists
- Token generation system (crypto.randomBytes(32))
- Guest list UI (table with search/filter)
- Share link generator (WhatsApp integration)

### **Month 3: Guest Experience**
**Weeks 9-10: Guest Pages**
- Personalized invitation pages (use existing templates)
- URL routing: `/invite/:slug/:token`
- Guest token validation
- Multi-event display

**Weeks 11-12: RSVP System**
- Per-event RSVP form
- Dietary preferences, guest count
- WhatsApp RSVP option (wa.me links)
- RSVP analytics dashboard for hosts

### **Month 4: Launch Prep**
**Weeks 13-14: Payments & Themes**
- Stripe/Razorpay integration
- Subscription management
- Theme library (premium unlocks)
- Media upload (S3 + optimization)

**Weeks 15-16: Polish & Deploy**
- Testing (unit + integration)
- Performance optimization
- Mobile responsive testing
- Production deployment
- Soft launch

---

## 💰 BUSINESS MODEL SUMMARY

### Pricing Tiers

**FREE Tier:**
- 1 active invitation
- 1 event per invitation
- 50 guests max
- 3 basic themes
- Watermark included
- Standard RSVP

**PRO Tier (₹999/year or ₹199/month):**
- Unlimited invitations
- Unlimited events
- 200 guests per invitation
- All premium themes
- No watermark
- Advanced analytics
- Email support

**BUSINESS Tier (₹1999/year):**
- Everything in Pro
- Unlimited guests
- Custom domain
- White-label
- Priority support
- API access

### Revenue Projections

**Year 1 (Conservative):**
- 50,000 free users
- 2,500 Pro (₹24.98 lakh)
- 500 Business (₹9.99 lakh)
- 5,000 theme purchases (₹14.95 lakh)
- **Total: ₹49.92 lakh**

**Year 3 (Growth):**
- 200,000 free users
- 10,000 Pro (₹99.9 lakh)
- 2,000 Business (₹39.98 lakh)
- 20,000 themes (₹59.8 lakh)
- **Total: ₹1.99 crore**

---

## 🔑 CRITICAL TECHNICAL DECISIONS

### 1. Database
- **Choice:** PostgreSQL (not SQLite)
- **Reason:** Better concurrency, production-ready, JSON support
- **Setup:** Use Prisma ORM (schema ready in docs)

### 2. Authentication
- **Hosts:** JWT tokens (access + refresh)
- **Guests:** Secure random tokens in URL (no login needed)
- **Admin:** Separate authentication system
- **Implementation:** NextAuth or custom JWT

### 3. URL Structure
```
Host creates invitation with slug: "rohan-priya-wedding"
System generates tokens for each guest household

Guest URLs:
https://yourdomain.com/invite/rohan-priya-wedding/abc123token456def
                              └─ slug ─┘  └─── token ────┘
                              (readable)    (32-byte hex)
```

### 4. Guest Token Security
```typescript
// Generate token
const token = crypto.randomBytes(32).toString('hex'); // 64 chars

// Store in database
await prisma.guest.create({
  data: {
    householdName: "Kapoor Family",
    token: token, // or hash it like passwords
    maxGuests: 5
  }
});

// Validate on access
const guest = await prisma.guest.findUnique({
  where: { token: urlToken }
});
```

### 5. WhatsApp Integration
```typescript
// Share invitation via WhatsApp
const shareUrl = `https://wa.me/?text=${encodeURIComponent(
  `${invitation.title} – You're invited!\n\n` +
  `Dear ${guest.householdName},\n` +
  `View your invitation: ${inviteUrl}`
)}`;

// RSVP via WhatsApp (optional)
const rsvpUrl = `https://wa.me/${host.phone}?text=${encodeURIComponent(
  `RSVP for ${invitation.title}\n` +
  `Name: ${guest.householdName}\n` +
  `Attending: Yes\n` +
  `Guests: 4`
)}`;
```

### 6. Multi-Event RSVP
```typescript
// Guest can select which events to attend
interface RSVP {
  isAttending: boolean;
  attendingCount: number; // Must be <= guest.maxGuests
  eventsAttending: string[]; // Array of event UUIDs
  dietaryRestrictions: string;
  message: string;
}

// Example
{
  isAttending: true,
  attendingCount: 4,
  eventsAttending: [
    "haldi-event-uuid",
    "wedding-event-uuid",
    "reception-event-uuid"
  ], // Not attending Mehndi
  dietaryRestrictions: "2 vegetarian, 2 vegan"
}
```

---

## 📦 TECH STACK (Recommended)

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Next.js 14 API routes (or Express)
- **Language:** TypeScript
- **Database:** PostgreSQL 14+
- **ORM:** Prisma
- **Auth:** NextAuth or custom JWT
- **File Storage:** AWS S3 or Supabase Storage
- **Image Processing:** Sharp
- **Payments:** Stripe or Razorpay
- **Email:** SendGrid or Mailgun (optional)

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **State:** React Context or Zustand
- **HTTP:** Axios or Fetch

### DevOps
- **Hosting:** Vercel (frontend + serverless API)
- **Database:** Supabase or Railway (PostgreSQL)
- **CDN:** Cloudflare
- **Monitoring:** Sentry (errors), Vercel Analytics
- **CI/CD:** GitHub Actions

---

## 🎨 FRONTEND ARCHITECTURE (Quick Overview)

### Page Structure
```
/                          → Landing page (theme gallery)
/signup                    → Host registration
/login                     → Host login
/dashboard                 → Host dashboard (stats, invitations list)
/dashboard/create          → Create invitation wizard
/dashboard/invitations/:id → Edit invitation
  /events                  → Manage events
  /guests                  → Guest list (CSV upload, generate links)
  /media                   → Photo gallery upload
  /analytics               → RSVP stats
/invite/:slug/:token       → Guest-facing invitation (personalized)
/admin/login               → Admin portal
/admin/dashboard           → Platform stats
```

### Component Hierarchy
```
App
├── PublicLayout
│   ├── Landing (theme cards with preview)
│   ├── Signup
│   └── Login
├── HostLayout (with sidebar)
│   ├── Dashboard
│   ├── InvitationWizard
│   ├── InvitationEditor
│   │   ├── EventManager
│   │   ├── GuestManager (CSV upload)
│   │   ├── MediaGallery
│   │   └── Analytics (charts)
│   └── Settings
├── GuestLayout (full-screen)
│   └── InvitationPage
│       ├── OpeningAnimation (from existing templates)
│       ├── HeroBanner
│       ├── StickyNav
│       ├── EventsSection (multi-event)
│       ├── Gallery
│       └── RSVPForm (per-event checkboxes)
└── AdminLayout
    └── AdminDashboard
```

### State Management
- **User Auth:** React Context (currentUser, tokens)
- **Invitation Data:** React Query (cache API responses)
- **Form State:** React Hook Form
- **UI State:** Local state (modals, dropdowns)

---

## 🔐 SECURITY CHECKLIST

- [ ] HTTPS only in production
- [ ] JWT with short expiry (1 hour access, 7 days refresh)
- [ ] Guest tokens: 32-byte random, indexed in DB
- [ ] Rate limiting on all endpoints
- [ ] Input validation with Zod schemas
- [ ] SQL injection prevention (Prisma automatic)
- [ ] XSS protection (React escapes by default)
- [ ] CSRF tokens for state-changing requests
- [ ] Secure password hashing (bcrypt, cost 12)
- [ ] Environment variables for secrets
- [ ] CORS whitelist
- [ ] Webhook signature verification (Stripe/Razorpay)
- [ ] File upload validation (type, size)
- [ ] Image processing (strip EXIF data)
- [ ] Guest token not guessable (random, not sequential)
- [ ] Invitations noindex meta tag (privacy)
- [ ] Admin separate authentication

---

## 📝 MISSING DOCS (Complete in Next Session)

### 4. Frontend Architecture (Detailed)
- Component library specs
- Routing configuration
- State management patterns
- Form validation schemas
- API integration patterns
- Mobile responsiveness strategy

### 5. Business Model Documentation
- Feature comparison matrix (free vs pro vs business)
- User journey maps (host onboarding, guest RSVP)
- Marketing strategy (SEO, social, partnerships)
- Support strategy (help docs, chat, email)

### 6. Guest Link System (Detailed)
- Token generation algorithm
- URL structure validation
- WhatsApp preview optimization (OG tags)
- Link tracking (analytics)
- Security considerations (rate limiting, token expiry)

### 7. Multi-Event RSVP System (Detailed)
- Per-function attendance UI mockups
- Analytics dashboard design
- Dietary preferences aggregation
- Export formats (CSV for caterers)
- Reminder system design

### 8. Complete Handoff Package
- Setup instructions (step-by-step)
- Environment variables list
- Deployment guide (Vercel + Supabase)
- Testing strategy (unit, integration, E2E)
- Troubleshooting guide

---

## 🎯 SUCCESS CRITERIA

### MVP Launch Checklist (End of Month 4)

**Backend:**
- [ ] PostgreSQL database deployed
- [ ] All 49 API endpoints implemented
- [ ] Authentication working (JWT + guest tokens)
- [ ] Payment integration complete (Stripe or Razorpay)
- [ ] Webhook handlers working
- [ ] Media upload to S3 working
- [ ] Email service integrated (optional)

**Frontend:**
- [ ] Host signup/login/dashboard working
- [ ] Create invitation wizard complete
- [ ] Multi-event management working
- [ ] CSV guest upload working
- [ ] Guest link generation working
- [ ] Guest invitation page rendering (with personalization)
- [ ] RSVP form working (per-event selection)
- [ ] Host analytics dashboard showing data
- [ ] Mobile responsive (test on real devices)

**Themes:**
- [ ] 3 existing templates converted to reusable themes
- [ ] Theme selector working
- [ ] Color customization working (optional for MVP)
- [ ] 3 basic themes free, 3 premium themes (₹299 each)

**Testing:**
- [ ] All API endpoints tested (Postman/Jest)
- [ ] Critical user flows tested (signup → create → share → RSVP)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Payment flow tested (test mode)

**Deployment:**
- [ ] Production environment set up (Vercel + Supabase)
- [ ] Domain configured (yourdomain.com)
- [ ] SSL certificate active
- [ ] Database backups configured
- [ ] Error monitoring active (Sentry)
- [ ] Analytics tracking (Google Analytics or similar)

**Launch:**
- [ ] 10 beta users onboarded
- [ ] Feedback collected and critical bugs fixed
- [ ] Landing page live with pricing
- [ ] Payment gateway live (real transactions)
- [ ] Support channel set up (email/chat)
- [ ] Social media accounts created
- [ ] Press kit prepared (if targeting media)

---

## 📞 SUPPORT & RESOURCES

### Documentation Files Created
1. `BUSINESS_MODEL_TRANSITION.md` - Complete architecture comparison
2. `DATABASE_SCHEMA_NEW.md` - Full PostgreSQL schema with Prisma
3. `API_SPECIFICATION.md` - 49 endpoints with examples
4. `HANDOFF_PACKAGE.md` - This file (complete summary)

### Existing Codebase
- **Location:** `/home/harpreet/E-invetation/`
- **Backend:** `/home/harpreet/E-invetation/server/`
- **Frontend:** `/home/harpreet/E-invetation/web/`
- **Templates:** `/home/harpreet/E-invetation/web/src/templates/`
  - `royal-maroon-01/` - Fully enhanced (use as reference)
  - `modern-floral-02/` - Basic premium
  - `classic-gold-03/` - Basic premium

### Running Servers (Current)
```bash
# Backend (port 3000)
cd /home/harpreet/E-invetation/server
npm run dev

# Frontend (port 5174)
cd /home/harpreet/E-invetation/web
npm run dev

# Access
http://localhost:5174/          # Landing page
http://localhost:5174/admin/login  # Admin panel (admin/admin123)
```

### Key Files to Review
- `server/src/db/schema.sql` - Current SQLite schema (OLD)
- `server/src/routes/public.ts` - Current public APIs
- `web/src/templates/royal-maroon-01/Template.tsx` - Premium template example
- `web/src/pages/Landing.tsx` - Template gallery with preview modal

---

## ⚡ QUICK COMMANDS FOR NEXT SESSION

### Database Setup
```bash
# Install PostgreSQL (if not installed)
# On Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE wedding_saas;
CREATE USER wedding_admin WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE wedding_saas TO wedding_admin;
\q

# Set up Prisma
cd /home/harpreet/E-invetation/server
npm install prisma @prisma/client
npx prisma init

# Copy schema from DATABASE_SCHEMA_NEW.md to prisma/schema.prisma
# Update .env with DATABASE_URL
# DATABASE_URL="postgresql://wedding_admin:secure_password@localhost:5432/wedding_saas"

# Migrate
npx prisma migrate dev --name init
npx prisma generate

# Seed database
npx prisma db seed
```

### Start Development
```bash
# Terminal 1: Backend
cd /home/harpreet/E-invetation/server
npm run dev

# Terminal 2: Frontend
cd /home/harpreet/E-invetation/web
npm run dev

# Terminal 3: Prisma Studio (database GUI)
cd /home/harpreet/E-invetation/server
npx prisma studio
```

---

## 🎉 FINAL NOTES

### What's Ready
✅ **Planning complete** (3 massive docs totaling 4,537 lines)
✅ **Architecture designed** (database, APIs, flows)
✅ **Business model defined** (pricing, revenue, features)
✅ **Existing templates** (can be converted to themes)
✅ **Current prototype** (working reference implementation)

### What to Build Next
🚧 Finish remaining planning docs (4 more docs)
🚧 Set up PostgreSQL + Prisma
🚧 Implement authentication (JWT system)
🚧 Build host dashboard
🚧 Build invitation creation wizard
🚧 Implement guest token system
🚧 Build guest invitation pages
🚧 Implement RSVP system
🚧 Integrate payments (Stripe/Razorpay)
🚧 Deploy to production

### Estimated Timeline
- **Remaining planning:** 1-2 hours
- **Core infrastructure:** 2-3 weeks
- **Full MVP:** 3-4 months (with 1 developer)
- **Launch-ready:** 4 months

### Key Success Factors
1. **Follow the docs** - Everything is specified in detail
2. **Start with database** - Schema is complete, just implement
3. **Use existing templates** - Don't redesign, just convert
4. **Test with real users** - Get beta testers early
5. **WhatsApp is key** - Optimize for mobile + WhatsApp sharing
6. **Focus on MVP** - Don't add features, complete core first

---

## 🚀 HANDOFF COMPLETE

**All critical planning documentation is ready.**  
**Next session can start implementation immediately.**  

**Good luck! 🎊**

---

**Document Status:** ✅ COMPLETE  
**Ready for:** Next Kiro session / New developer  
**Total Documentation:** 4 files, ~4,700 lines  
**Time to Review:** 2-3 hours  
**Time to Implement:** 3-4 months  

---

**Created:** November 6, 2026, 1:53 PM IST  
**Last Updated:** November 6, 2026, 1:53 PM IST
