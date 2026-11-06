# 🔄 BUSINESS MODEL TRANSITION PLAN

**From:** Template Purchase + Subdomain Model  
**To:** SaaS Invitation Builder with Personalized Guest Links  
**Date:** November 6, 2026  
**Status:** Planning Phase

---

## 📊 EXECUTIVE SUMMARY

### Current Model (OLD)
- Couples **purchase** templates (₹2000 prebook, ₹3000 full)
- Each couple gets **one subdomain** (e.g., rahul-priya.yourdomain.com)
- Manual UPI payment verification by admin
- Templates sold **once only** (exclusivity)
- Token-based editing (no customer accounts)
- Static invitation site with basic RSVP

### New Model (TARGET)
- **SaaS platform** where hosts create invitation microsites
- Each **guest household** gets personalized URL with their name
- Multi-event support (Haldi, Sangeet, Reception, etc.)
- Per-function RSVP tracking with dashboard
- Freemium pricing with premium features/themes
- WhatsApp-first distribution
- Account-based (hosts have login/dashboard)
- Not wedding-only: birthdays, anniversaries, corporate events

---

## 🎯 KEY DIFFERENCES

| Aspect | OLD MODEL | NEW MODEL |
|--------|-----------|-----------|
| **Revenue Model** | One-time template sale | Freemium + Subscriptions + Add-ons |
| **Customer** | Couple buying a template | Host creating event (wedding/birthday/etc.) |
| **URL Structure** | `couple-slug.domain.com` | `domain.com/invite/{event-slug}/{guest-token}` |
| **Personalization** | One site per couple | Unique URL per guest household with names |
| **Templates** | Sold once (exclusive) | Reusable themes (unlimited usage) |
| **Events** | Single wedding | Multiple events per invitation |
| **RSVP** | Basic form on site | Per-event tracking, dietary, guest count |
| **Guest Management** | None | Full dashboard with CSV upload, tokens, analytics |
| **Authentication** | Token-only for editing | Host accounts + guest tokens |
| **Payment** | Manual UPI verification | Automated (Stripe/Razorpay) |
| **Distribution** | Share subdomain link | WhatsApp personalized links per guest |
| **Admin** | Verify payments, manage orders | Platform management, analytics, support |

---

## 📂 CURRENT ARCHITECTURE ANALYSIS

### ✅ What to KEEP

**1. Template System (Reusable)**
- Location: `/web/src/templates/*/Template.tsx`
- **Decision:** Convert to reusable themes (remove exclusivity)
- Royal Maroon, Modern Floral, Classic Gold become theme options
- Keep: Premium animations, mobile-first design, component structure
- Change: Remove "sold once" restriction, make configurable

**2. Premium Design Components**
- Opening animations (doors, cards)
- Sticky navigation
- Countdown timers
- RSVP forms
- Gallery sections
- **Decision:** Extract into shared component library
- Add: Per-event RSVP options, dietary fields, guest count

**3. Media Handling**
- Sharp image processing
- WebP conversion
- Upload endpoints
- **Decision:** Keep and enhance with S3/CDN integration
- Add: Gallery management, invitation artwork storage

**4. Admin Dashboard Foundation**
- Location: `/web/src/pages/admin/*`
- Basic stats, login system
- **Decision:** Keep authentication, expand dashboard significantly
- Add: Platform-wide analytics, theme management, support tools

### ⚠️ What to TRANSFORM

**1. Database Schema** → Complete redesign needed
- Current: customers, templates, orders, payments, sites, assets
- New: users (hosts), invitations, events, guests, rsvps, themes, media
- Migration: Not directly possible (different models)
- **Decision:** Build new schema, optional data export from old

**2. Order/Payment Flow** → Becomes subscription/freemium
- Current: Pre-book → Pay → Verify → Edit token
- New: Sign up → Create invite (free) → Upgrade (automated payment)
- **Decision:** Replace entire order state machine with subscription logic

**3. Editor System** → Multi-event builder
- Current: Token-protected form editing one site
- New: Host dashboard to manage invitation + multiple events
- **Decision:** Rebuild as authenticated host portal with event management

**4. Public Routes** → Guest-facing invitation pages
- Current: Serve subdomain sites with OG tags
- New: Serve personalized invitation URLs with guest names
- **Decision:** New routing system with token validation

### ❌ What to REMOVE/DEPRECATE

**1. Template Exclusivity System**
- `templates.sold` flag
- `templates.sold_to` tracking
- **Reason:** SaaS model allows unlimited theme usage

**2. Subdomain System**
- Wildcard DNS setup
- Per-couple subdomains
- **Reason:** Moving to path-based URLs `/invite/{slug}/{token}`
- **Note:** Could offer custom domains as premium feature later

**3. Manual Payment Verification**
- Admin payment approval workflow
- UPI transaction ID submission
- **Reason:** Automated payment gateways (Stripe/Razorpay)

**4. Order State Machine**
- DRAFT → PREBOOKED → PURCHASED → PUBLISHED
- Reservation expiry system
- **Reason:** No pre-booking in SaaS model (freemium instead)

**5. Customer Table**
- No customer accounts in old system (token-only)
- **Reason:** Replaced by Users (hosts with accounts)

**6. Custom Request System**
- Bespoke design requests via form
- **Reason:** Could move to premium service tier or remove

---

## 🏗️ NEW ARCHITECTURE OVERVIEW

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      WEDDING INVITATION SaaS                 │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   HOST PORTAL    │      │  GUEST EXPERIENCE│      │  ADMIN DASHBOARD │
│                  │      │                  │      │                  │
│ • Sign up/Login  │      │ • Open invite URL│      │ • Platform stats │
│ • Create event   │      │ • See their name │      │ • User management│
│ • Pick theme     │      │ • View events    │      │ • Theme library  │
│ • Add functions  │      │ • RSVP per event │      │ • Support tools  │
│ • Upload media   │      │ • Photo gallery  │      │ • Analytics      │
│ • Guest list CSV │      │ • WhatsApp share │      │ • Payments view  │
│ • Generate links │      │ • Music player   │      │                  │
│ • View analytics │      │                  │      │                  │
│ • Export RSVPs   │      │                  │      │                  │
└────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │      BACKEND API            │
                    │                             │
                    │ • Auth (JWT/Session)        │
                    │ • Invitation CRUD           │
                    │ • Event management          │
                    │ • Guest token generation    │
                    │ • RSVP capture              │
                    │ • Media upload (S3)         │
                    │ • WhatsApp integration      │
                    │ • Payment webhooks          │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   PostgreSQL DATABASE       │
                    │                             │
                    │ • users (hosts)             │
                    │ • invitations               │
                    │ • events (multi per invite) │
                    │ • guests (households)       │
                    │ • rsvps (per guest/event)   │
                    │ • media_assets              │
                    │ • themes                    │
                    │ • subscriptions             │
                    └─────────────────────────────┘

         ┌──────────────────────┬──────────────────────┐
         │                      │                      │
┌────────▼────────┐   ┌─────────▼────────┐   ┌───────▼──────┐
│  AWS S3/CDN     │   │ Stripe/Razorpay  │   │  WhatsApp    │
│                 │   │                  │   │              │
│ • Photos        │   │ • Payments       │   │ • wa.me links│
│ • Gallery       │   │ • Subscriptions  │   │ • Share API  │
│ • Music files   │   │ • Webhooks       │   │ • RSVP option│
└─────────────────┘   └──────────────────┘   └──────────────┘
```

### Data Flow

**Host Creates Invitation:**
```
1. Host signs up → User account created
2. Host clicks "Create Invitation" → New invitation record
3. Host selects theme → Theme applied
4. Host adds events (Haldi, Wedding, Reception) → Event records
5. Host uploads photos → S3 storage + media_assets records
6. Host uploads CSV guest list → Guest records with secure tokens
7. System generates personalized URLs for each guest
8. Host shares links via WhatsApp
```

**Guest Views Invitation:**
```
1. Guest clicks link: /invite/rohan-priya/abc123token
2. System validates token → Loads guest + invitation data
3. Page renders with guest's name personalized
4. Guest sees all events, gallery, details
5. Guest fills RSVP form (per-event attendance)
6. System saves RSVP → Updates dashboard
```

**Host Monitors:**
```
1. Host logs in → Dashboard shows invitation
2. View RSVP statistics (total, per-event, trends)
3. See guest list with status (Pending/Accepted/Declined)
4. Export CSV for planning
5. Send reminders via WhatsApp
```

---

## 🗄️ DATABASE SCHEMA COMPARISON

### OLD SCHEMA (Current)

```sql
-- 10 tables focused on template sales
customers (id, email, phone, name, created_at)
templates (id, name, slug, price, sold, sold_to)
orders (id, customer_id, template_id, state, total_amount)
payments (id, order_id, amount, status, upi_txn_id)
sites (id, order_id, slug, data_json, is_online)
assets (id, site_id, type, url)
admin_users (id, username, password_hash)
admin_sessions (id, admin_user_id, token_hash)
audit_log (id, action, details)
custom_requests (id, customer_id, request_text)
```

### NEW SCHEMA (Target)

```sql
-- Core user & invitation management
users (
  id, email, password_hash, name, phone,
  role (host/admin), subscription_tier,
  created_at, updated_at
)

invitations (
  id, user_id (FK), 
  title, slug (unique),
  theme_id (FK), event_type (wedding/birthday/etc),
  music_url, is_live, expires_at,
  created_at, updated_at
)

events (
  id, invitation_id (FK),
  name (e.g., "Haldi"), 
  date, start_time, end_time,
  venue_name, venue_address, map_link,
  dress_code, description, order_index,
  created_at
)

-- Guest management with personalization
guests (
  id, invitation_id (FK),
  household_name (e.g., "Kapoor Family"),
  token (secure random, indexed),
  max_guests (allowed headcount),
  allowed_events (JSON array of event IDs),
  created_at, updated_at
)

guest_members (
  id, guest_id (FK),
  name (individual person name),
  created_at
)

-- RSVP tracking
rsvps (
  id, guest_id (FK),
  responded_at, is_attending (boolean),
  attending_count (number of people),
  events_attending (JSON array of event IDs),
  dietary_notes, message, updated_at
)

-- Media management
media_assets (
  id, invitation_id (FK),
  type (hero/gallery/invitation_card/music),
  url (S3 path), filename, size,
  metadata (JSON), uploaded_at
)

-- Theme library (reusable)
themes (
  id, name, slug,
  category (wedding/birthday/corporate),
  preview_image_url, template_component,
  default_colors (JSON), price_tier,
  is_active, created_at
)

-- Payments & subscriptions
subscriptions (
  id, user_id (FK),
  plan (free/pro/business), status,
  stripe_subscription_id, current_period_end,
  created_at, updated_at
)

payments (
  id, user_id (FK),
  amount, currency, status,
  payment_method, gateway_transaction_id,
  purpose (subscription/theme_purchase/addon),
  created_at
)

-- Admin & audit
admin_users (id, username, password_hash, created_at)
admin_sessions (id, admin_user_id, token_hash, expires_at)
audit_log (id, user_id, action, details, created_at)
```

### Migration Strategy

**Option A: Fresh Start (Recommended)**
- Build new database from scratch
- Keep old database as reference
- No direct migration (models too different)
- Optionally export old template designs as new themes

**Option B: Data Export**
- Export existing template HTML/data
- Recreate as themes in new system
- Inform existing customers (if any) about platform change

---

## 🔗 URL STRUCTURE COMPARISON

### OLD System (Subdomains)

```
Main site:     yourdomain.com
Landing:       yourdomain.com/
Editor:        yourdomain.com/edit/[token]
Published:     rahul-priya.yourdomain.com/
Admin:         yourdomain.com/admin/login

• Each couple gets unique subdomain
• Requires wildcard DNS (*.yourdomain.com)
• One URL shared with all guests
```

### NEW System (Path-based with Tokens)

```
Main site:     yourdomain.com
Landing:       yourdomain.com/
Host signup:   yourdomain.com/signup
Host login:    yourdomain.com/login
Host dashboard: yourdomain.com/dashboard
Create invite: yourdomain.com/dashboard/create
Edit invite:   yourdomain.com/dashboard/invitations/[id]
Guest list:    yourdomain.com/dashboard/invitations/[id]/guests
Analytics:     yourdomain.com/dashboard/invitations/[id]/analytics

Guest invite:  yourdomain.com/invite/[slug]/[token]
               e.g., yourdomain.com/invite/rohan-priya/Kxj9mP2s

Admin:         yourdomain.com/admin/login

• Each guest gets unique token in URL
• Invitation slug is readable (couple names)
• Token is secure random (not guessable)
• No wildcard DNS needed
• Optional: Custom domain premium feature later
```

**Guest URL Breakdown:**
```
https://yourdomain.com/invite/rohan-priya-wedding/Kxj9mP2s
                              └─ slug ─┘  └─ token ─┘
                              (readable)   (secure)

When guest opens:
1. System looks up guest by token
2. Loads invitation by slug
3. Personalizes page: "Dear Kapoor Family, you're invited..."
4. Shows all events, gallery, RSVP form
5. RSVP submissions link back to this guest record
```

---

## 🎨 TEMPLATE → THEME TRANSFORMATION

### Current Templates (3)
1. **Royal Maroon** - Deep maroon, gold accents, door animation
2. **Modern Floral** - Pink/purple, floating flowers
3. **Classic Gold** - Champagne gold, ornate borders

### Transformation Plan

**Convert to Reusable Themes:**
- Remove exclusivity (can be used by multiple hosts)
- Make configurable (colors, fonts, images)
- Extract to theme library in database

**Database Record Example:**
```json
{
  "id": "theme-001",
  "name": "Royal Maroon",
  "slug": "royal-maroon",
  "category": "wedding",
  "template_component": "RoyalMaroonTemplate",
  "preview_image": "/themes/royal-maroon.jpg",
  "default_colors": {
    "primary": "#7f1d1d",
    "secondary": "#f59e0b",
    "background": "#fffbeb"
  },
  "price_tier": "premium",
  "features": [
    "door_animation",
    "countdown_timer",
    "multi_event",
    "gallery",
    "music_player"
  ]
}
```

**Pricing Tiers:**
- **Free themes** (3-5 basic designs)
- **Premium themes** (₹299-599 one-time unlock)
- **Custom themes** (₹1999+ design service)

**Template Component Structure:**
```typescript
// Theme receives props for customization
interface ThemeProps {
  invitation: Invitation;
  events: Event[];
  gallery: MediaAsset[];
  guest: Guest; // For personalization
  colors: ColorScheme;
  fonts: FontScheme;
}

function RoyalMaroonTemplate({ invitation, events, guest, ... }: ThemeProps) {
  return (
    <>
      <OpeningAnimation guestName={guest.household_name} />
      <HeroBanner couple={invitation.title} date={events[0].date} />
      <Navigation />
      <EventsSection events={events} />
      <Gallery images={gallery} />
      <RSVPSection guest={guest} events={events} />
    </>
  );
}
```

---

## 💳 PAYMENT FLOW COMPARISON

### OLD Flow (Manual)
```
1. Customer submits order (₹2000 prebook)
2. System generates order with DRAFT state
3. Customer receives UPI ID
4. Customer pays and submits transaction ID
5. Admin manually verifies in bank app
6. Admin clicks "Verify Payment" in dashboard
7. Order moves to PREBOOKED
8. Customer pays balance (₹1000)
9. Repeat verification
10. Order moves to PURCHASED
11. System sends edit token
```

### NEW Flow (Automated)

**Freemium Signup:**
```
1. Host signs up (free account)
2. Host creates invitation with free theme
3. Host can publish with limits (e.g., 50 guests max)
4. Host sees "Upgrade" prompts for premium features
```

**Premium Purchase:**
```
1. Host clicks "Upgrade to Pro" or "Unlock Theme"
2. Stripe/Razorpay checkout opens
3. Host enters card details
4. Payment processes automatically
5. Webhook confirms payment
6. System updates user subscription/unlocks theme
7. Host immediately accesses premium features
```

**Subscription Flow:**
```
1. Host chooses plan (Pro ₹999/year, Business ₹1999/year)
2. Stripe creates subscription
3. Recurring billing on anniversary
4. Webhooks handle renewals/failures
5. Downgrade/cancel anytime
```

---

## 📱 WHATSAPP INTEGRATION

### Link Sharing
```typescript
// Generate WhatsApp share link
const shareViaWhatsApp = (guest: Guest, invitation: Invitation) => {
  const inviteUrl = `https://yourdomain.com/invite/${invitation.slug}/${guest.token}`;
  const message = encodeURIComponent(
    `${invitation.title} – You're invited!\n\n` +
    `Dear ${guest.household_name},\n` +
    `View your personalized invitation: ${inviteUrl}`
  );
  window.open(`https://wa.me/?text=${message}`, '_blank');
};
```

### WhatsApp Preview (OG Tags)
```html
<!-- Personalized meta tags per guest -->
<meta property="og:title" content="Dear Kapoor Family – Rohan weds Priya" />
<meta property="og:description" content="You're invited to our wedding celebration..." />
<meta property="og:image" content="https://yourdomain.com/invite-preview.jpg" />
<meta property="og:url" content="https://yourdomain.com/invite/rohan-priya/Kxj9mP2s" />
```

### RSVP via WhatsApp (Optional)
```typescript
// Dual option: Form + WhatsApp button
const rsvpOptions = {
  form: true, // Submit via web form (preferred)
  whatsapp: true // Or click to send WhatsApp message
};

const whatsappRSVP = () => {
  const message = encodeURIComponent(
    `RSVP for ${invitation.title}\n` +
    `Name: ${guest.household_name}\n` +
    `Attending: Yes\n` +
    `Guests: 4\n` +
    `Events: Haldi, Wedding, Reception`
  );
  window.open(`https://wa.me/${host.phone}?text=${message}`, '_blank');
};
```

---

## 🎯 FEATURE COMPARISON MATRIX

| Feature | OLD System | NEW System |
|---------|------------|------------|
| **Host Management** | ❌ No accounts | ✅ Full signup/login |
| **Dashboard** | ❌ Admin only | ✅ Host dashboard |
| **Multi-Event** | ❌ Single wedding | ✅ Multiple events per invitation |
| **Guest Personalization** | ❌ One URL for all | ✅ Unique URL per guest |
| **Guest List Management** | ❌ None | ✅ CSV upload, token generation |
| **RSVP Tracking** | ⚠️ Basic form | ✅ Per-event, dietary, analytics |
| **Analytics** | ❌ None | ✅ Response rates, attendance charts |
| **Themes** | ⚠️ Sold once | ✅ Reusable library |
| **Customization** | ⚠️ Limited | ✅ Colors, fonts, images |
| **Payment** | ⚠️ Manual UPI | ✅ Automated gateway |
| **Subscription** | ❌ One-time sale | ✅ Freemium + tiers |
| **Event Types** | Wedding only | ✅ Wedding, birthday, corporate, etc. |
| **Language Support** | ❌ English only | ✅ Hindi, English, more |
| **Media Gallery** | ⚠️ Basic | ✅ Full gallery with uploads |
| **WhatsApp Integration** | ❌ None | ✅ Share + RSVP |
| **Mobile UX** | ✅ Good | ✅ Excellent (mobile-first) |
| **Animations** | ✅ Good | ✅ Enhanced |
| **Email Invites** | ❌ None | ✅ Optional |
| **Reminders** | ❌ None | ✅ Automated |
| **Export Data** | ❌ None | ✅ CSV export |

---

## 📋 MIGRATION CHECKLIST

### Phase 1: Documentation (Current)
- [x] Analyze existing architecture
- [x] Document what to keep/transform/remove
- [x] Design new database schema
- [ ] Create API specification
- [ ] Design frontend architecture
- [ ] Document business model & pricing

### Phase 2: Core Infrastructure
- [ ] Set up new database (PostgreSQL)
- [ ] Create Prisma schema
- [ ] Build authentication system (NextAuth)
- [ ] Set up S3/CDN for media
- [ ] Configure payment gateway (Stripe/Razorpay)

### Phase 3: Host Experience
- [ ] Build signup/login pages
- [ ] Create host dashboard
- [ ] Build invitation creation wizard
- [ ] Build event management interface
- [ ] Build guest list upload/management
- [ ] Build analytics dashboard
- [ ] Build RSVP tracking view

### Phase 4: Guest Experience
- [ ] Build personalized invitation page
- [ ] Implement URL routing with tokens
- [ ] Build RSVP form (per-event)
- [ ] Add WhatsApp integration
- [ ] Implement OG tags for previews
- [ ] Add language toggle (Hindi/English)

### Phase 5: Themes & Templates
- [ ] Convert existing templates to themes
- [ ] Build theme selector UI
- [ ] Implement color/font customization
- [ ] Create theme preview system
- [ ] Build theme pricing/unlock system

### Phase 6: Admin Tools
- [ ] Build admin dashboard
- [ ] Add platform analytics
- [ ] Create theme management interface
- [ ] Build support ticket system
- [ ] Add user management tools

### Phase 7: Testing & Polish
- [ ] Cross-browser testing
- [ ] Mobile responsive testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Accessibility check
- [ ] WhatsApp preview testing

### Phase 8: Deployment
- [ ] Set up production environment
- [ ] Configure domain/DNS
- [ ] Set up monitoring
- [ ] Create backup strategy
- [ ] Write deployment docs
- [ ] Plan launch strategy

---

## 🚀 IMPLEMENTATION TIMELINE

**Estimated: 3-4 months for MVP**

### Month 1: Foundation
- Week 1-2: Database design, API spec, architecture docs
- Week 3-4: Authentication, core backend APIs, theme system

### Month 2: Host Tools
- Week 5-6: Host dashboard, invitation builder, event management
- Week 7-8: Guest list management, token generation, analytics

### Month 3: Guest Experience
- Week 9-10: Guest invitation pages, RSVP forms, personalization
- Week 11-12: WhatsApp integration, media galleries, polish

### Month 4: Launch Prep
- Week 13-14: Theme library, payment integration, admin tools
- Week 15-16: Testing, optimization, documentation, soft launch

---

## 💰 BUSINESS MODEL SUMMARY

### Pricing Strategy (New)

**Free Tier:**
- 1 active invitation
- 1 event per invitation
- 50 guests maximum
- 3 basic themes
- Standard RSVP tracking
- Watermark on invitation

**Pro Tier (₹999/year or ₹199/month):**
- Unlimited invitations
- Unlimited events per invitation
- 200 guests per invitation
- All premium themes included
- No watermark
- Advanced analytics
- Email support
- Custom colors/fonts

**Business Tier (₹1999/year):**
- Everything in Pro
- Unlimited guests
- Priority support
- Custom domain option
- White-label capability
- API access
- Team collaboration

**Add-ons:**
- Premium theme unlock: ₹299-599 one-time
- Custom design service: ₹1999+
- Printed cards matching digital: ₹5000+
- Photography package referral: Commission-based

### Revenue Projections

**Year 1 (Conservative):**
- 50,000 free signups
- 2,500 Pro subscriptions (5% conversion) = ₹24.98 lakh
- 500 Business subscriptions (1% conversion) = ₹9.99 lakh
- 5,000 theme purchases = ₹14.95 lakh
- **Total: ₹49.92 lakh**

**Year 3 (Growth):**
- 200,000 free signups
- 10,000 Pro subscriptions = ₹99.9 lakh
- 2,000 Business subscriptions = ₹39.98 lakh
- 20,000 theme purchases = ₹59.8 lakh
- **Total: ₹1.99 crore**

---

## 🎓 HANDOFF REQUIREMENTS

For the next Kiro session to continue smoothly, we need:

### 1. Complete Technical Documentation
- [x] Architecture comparison (this document)
- [ ] New database schema with relationships
- [ ] Complete API specification
- [ ] Component architecture
- [ ] State management plan
- [ ] Authentication flow diagrams

### 2. Design Assets
- [ ] Theme design specifications
- [ ] Component library documentation
- [ ] Color palettes & typography
- [ ] Animation specifications
- [ ] Mobile/desktop mockups

### 3. Business Documentation
- [ ] Feature matrix by pricing tier
- [ ] Revenue model & projections
- [ ] User journey maps
- [ ] Marketing strategy
- [ ] Go-to-market plan

### 4. Implementation Guides
- [ ] Step-by-step build plan
- [ ] Testing strategy
- [ ] Deployment procedures
- [ ] Security checklist
- [ ] Performance benchmarks

### 5. Code Artifacts
- [ ] Database migration scripts
- [ ] Seed data for testing
- [ ] API endpoint stubs
- [ ] Component boilerplate
- [ ] Utility functions

---

## 📝 NEXT STEPS

**Immediate (This Session):**
1. ✅ Create transition plan (this document)
2. ⏳ Design new database schema
3. ⏳ Create API specification
4. ⏳ Design frontend architecture
5. ⏳ Document business model
6. ⏳ Create personalized URL system design
7. ⏳ Plan RSVP tracking system
8. ⏳ Compile handoff package

**For Next Session:**
1. Review all documentation
2. Start Phase 2 (Core Infrastructure)
3. Build new database schema
4. Implement authentication
5. Create host dashboard foundation

---

## 🔍 KEY DECISIONS LOG

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Fresh database (no migration) | Old and new models too different | Clean start, faster development |
| Path-based URLs not subdomains | Simpler infrastructure, easier scaling | No wildcard DNS needed |
| PostgreSQL over SQLite | Better concurrency, production-ready | Requires PostgreSQL setup |
| Automated payments | Reduces admin overhead, faster UX | Requires Stripe/Razorpay integration |
| Freemium model | Larger user base, viral potential | Need good free→paid conversion |
| Reusable themes | Unlimited scaling potential | No exclusivity selling point |
| Multi-event support | Competitive advantage for Indian market | More complex RSVP tracking |
| WhatsApp-first | Matches market behavior | Heavy WhatsApp integration needed |

---

**Status:** ✅ Transition plan documented  
**Next Task:** Design new database schema  
**Document Version:** 1.0  
**Last Updated:** November 6, 2026, 1:34 PM IST
