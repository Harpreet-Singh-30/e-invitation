# Theme-to-Template Mapping Documentation

**Date:** November 6, 2026  
**Purpose:** Document verified mappings between database Themes and React template components

---

## Database Schema Structure

### Theme Model
```prisma
model Theme {
  id                    String   @id @default(uuid())
  name                  String
  slug                  String   @unique
  category              String   // occasion type
  templateComponent     String   // component identifier
  // ... other fields
}
```

### Invitation Model
```prisma
model Invitation {
  id                    String   @id @default(uuid())
  userId                String
  themeId               String?  // Optional link to Theme
  title                 String
  slug                  String   @unique
  eventType             String   // occasion type (wedding, birthday, etc.)
  tagline               String?
  welcomeMessage        String?
  storyContent          String?
  familyInfo            String?
  musicUrl              String?
  heroImageUrl          String?
  // ... other fields
  events                Event[]  // Related events
}
```

### Event Model
```prisma
model Event {
  id                    String   @id @default(uuid())
  invitationId          String
  name                  String
  eventDate             DateTime @db.Date
  startTime             DateTime? @db.Time
  venueName             String?
  venueAddress          String?
  mapLink               String?
  orderIndex            Int
  // ... other fields
}
```

---

## React Template Component Structure

### Common Template Props Interface

All template components expect a `data` prop with this structure:

```typescript
interface TemplateProps {
  data: {
    couple: {
      groom: string;
      bride: string;
      tagline?: string;
    };
    events: Array<{
      key: string;      // event type identifier
      title: string;    // event name
      date: string;     // ISO date string
      time?: string;    // formatted time
      venue: string;    // venue name
      address?: string; // full address
      mapUrl?: string;  // map link
    }>;
    gallery?: string[];
    music?: {
      enabled: boolean;
      trackId?: string;
    };
    message?: string;  // welcome/story message
  };
}
```

---

## Verified Template Mappings

### 1. Royal Maroon Template

**Component Location:** `web/src/templates/royal-maroon-01/Template.tsx`

**Theme Slug:** `royal-maroon` (hardcoded in gallery, not verified in database)

**Template Component ID:** `royal-maroon-01`

**Occasion Type:** `wedding`

**Data Requirements:**
- `couple.groom` (required)
- `couple.bride` (required)
- `couple.tagline` (optional)
- `events` array (at least 1 event)
  - Looks for event with `key: 'wedding'` as main event
  - Supports multiple events (haldi, mehndi, sangeet, reception)
- `message` (optional welcome message)
- `gallery` (optional image array)
- `music` (optional)

**Visual Style:** Traditional Indian wedding, maroon/gold color scheme

---

### 2. Modern Floral Template

**Component Location:** `web/src/templates/modern-floral-02/Template.tsx`

**Theme Slug:** `modern-floral` (hardcoded in gallery, not verified in database)

**Template Component ID:** `modern-floral-02`

**Occasion Type:** `wedding`

**Data Requirements:**
- Same structure as Royal Maroon
- `couple` object with groom/bride
- `events` array
- `message` (optional)
- `gallery` (optional)

**Visual Style:** Contemporary romantic, floral/pastel colors

---

### 3. Classic Gold Template

**Component Location:** `web/src/templates/classic-gold-03/Template.tsx`

**Theme Slug:** `classic-gold` (hardcoded in gallery, not verified in database)

**Template Component ID:** `classic-gold-03`

**Occasion Type:** `wedding`

**Data Requirements:**
- Same structure as Royal Maroon
- `couple` object with groom/bride
- `events` array
- `message` (optional)
- `gallery` (optional)

**Visual Style:** Timeless elegance, gold/champagne colors

---

## Component Registry

**Current Implementation:** Hardcoded mappings in multiple files

**TemplateThumbnail.tsx:**
```typescript
const TEMPLATE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'royal-maroon': RoyalMaroon,
  'modern-floral': ModernFloral,
  'classic-gold': ClassicGold,
};
```

**TemplatePreview.tsx:** Same mapping

**PublishedSite.tsx:** Needs verification

---

## Data Transformation Requirements

### From Invitation Model → Template Props

**Couple Data:**
- For weddings: Need to derive groom/bride from title or custom fields
- Invitation.tagline → data.couple.tagline
- Not currently stored in database, needs editor implementation

**Events Data:**
- Event.name → data.events[].title
- Event.eventDate → data.events[].date
- Event.startTime → data.events[].time (format as string)
- Event.venueName → data.events[].venue
- Event.venueAddress → data.events[].address
- Event.mapLink → data.events[].mapUrl
- Event.orderIndex → array order
- Need to determine event.key from Event.name or add custom field

**Message Data:**
- Invitation.welcomeMessage → data.message
- Invitation.storyContent → alternative message field

**Media:**
- Invitation.musicUrl → data.music.trackId
- Gallery images from MediaAsset table (not yet implemented in transformation)

---

## Template Selection Flow

### Current Implementation (Task 03.1)

**TemplateGallery.tsx:**
```typescript
const AVAILABLE_TEMPLATES: Template[] = [
  {
    id: 'royal-maroon',
    slug: 'royal-maroon',
    category: 'wedding',
    templateComponent: 'royal-maroon-01',
    // ...
  },
  // ...
];
```

**TemplatePreview.tsx:**
When "Use This Template" clicked:
```typescript
sessionStorage.setItem('selectedTemplate', slug);
sessionStorage.setItem('selectedOccasion', templateInfo.category);
// Missing: themeId (no database lookup currently)
```

**CreateInvitation.tsx:**
Reads sessionStorage and shows banner, but doesn't send themeId to backend yet.

---

## Missing Database Integration

### ⚠️ Critical Gap: No Theme Database Records

**Current Status:**
- Hardcoded template data in frontend
- No verification that Theme records exist in database
- No API to fetch Themes
- Gallery doesn't query database Themes

**Required for Full Integration:**

1. **Seed or create Theme records** matching:
   - slug: 'royal-maroon', 'modern-floral', 'classic-gold'
   - templateComponent: 'royal-maroon-01', 'modern-floral-02', 'classic-gold-03'
   - category: 'wedding'

2. **Theme API endpoint:** GET /api/themes (public, read-only)

3. **Gallery integration:** Query themes instead of hardcoded array

4. **Theme ID preservation:** Store actual Theme.id in sessionStorage

---

## Recommended Session Storage Keys

**For Template Selection:**
```typescript
sessionStorage.setItem('selectedTemplateSlug', 'royal-maroon');
sessionStorage.setItem('selectedTemplateId', '<uuid>'); // from Theme.id
sessionStorage.setItem('selectedOccasion', 'wedding');
```

**For Invitation Creation:**
```typescript
POST /api/host/invitations
{
  title: "...",
  occasionType: "wedding",  // eventType in database
  themeId: "<uuid>"         // from sessionStorage
}
```

---

## Event Key Mapping

**Wedding Event Keys (common):**
- `haldi` - Haldi ceremony
- `mehndi` - Mehndi ceremony
- `sangeet` - Sangeet night
- `wedding` - Main wedding ceremony
- `reception` - Reception party

**Other Occasions:**
- `birthday` - Birthday party
- `ceremony` - Generic ceremony
- `party` - Generic party/celebration

**Database Storage:**
- Event.name stores display name
- Need custom field or convention for event.key
- Alternative: Derive key from name (lowercase, replace spaces)

---

## Content Field Mappings

### Invitation Fields → Template Data

| Prisma Field | Template Field | Type | Notes |
|--------------|----------------|------|-------|
| title | (derived) | string | Could split for couple names |
| tagline | couple.tagline | string? | Direct mapping |
| welcomeMessage | message | string? | Primary message field |
| storyContent | message | string? | Alternative message field |
| familyInfo | (not used) | string? | Could add to template |
| musicUrl | music.trackId | string? | Needs parsing |
| heroImageUrl | (not used) | string? | Could add as cover |
| events[] | events[] | array | Requires transformation |

### Event Fields → Template Event Data

| Prisma Field | Template Field | Type | Transformation |
|--------------|----------------|------|----------------|
| name | title | string | Direct |
| eventDate | date | string | Format as ISO string |
| startTime | time | string? | Format as "HH:MM AM/PM" |
| venueName | venue | string | Direct |
| venueAddress | address | string? | Direct |
| mapLink | mapUrl | string? | Direct |

---

## Security Considerations

### Theme Selection
- ✅ Theme slug is safe (user-facing identifier)
- ✅ Theme ID should be validated on backend
- ⚠️ Don't trust theme ID from client without verification

### Invitation Ownership
- ✅ Backend validates userId from JWT
- ✅ Can't edit other user's invitations
- ✅ Can't associate with other user's themes (if implemented)

---

## Implementation Priorities for Task 04

1. **Extend SessionStorage** (Phase 3)
   - Add themeId to session storage
   - Verify gallery data provides theme ID
   - Or use slug for now and lookup later

2. **Update CreateInvitation** (Phase 3)
   - Send themeId to POST /api/host/invitations
   - Redirect to /invitations/:id/edit after creation

3. **Implement PUT Endpoint** (Phase 4)
   - PUT /api/host/invitations/:id
   - Update invitation fields
   - Update related events (if included)
   - Validate ownership

4. **Build Editor UI** (Phase 4)
   - Load invitation with theme
   - Render correct template component
   - Transform data format correctly
   - Save updates via PUT endpoint

---

## Testing Checklist

### Data Transformation
- [ ] Invitation → Template props (all fields)
- [ ] Event → Template event (date/time formatting)
- [ ] Handle missing optional fields
- [ ] Handle empty events array

### Template Rendering
- [ ] Royal Maroon renders with editor data
- [ ] Modern Floral renders with editor data
- [ ] Classic Gold renders with editor data
- [ ] Preview updates on field changes

### Database Integration
- [ ] Theme lookup by ID
- [ ] Theme slug to component mapping
- [ ] Invitation creation with themeId
- [ ] Invitation update preserves themeId

---

**Status:** Mapping documented based on code inspection  
**Last Updated:** November 6, 2026  
**Next Step:** Implement sessionStorage extension and CreateInvitation integration
