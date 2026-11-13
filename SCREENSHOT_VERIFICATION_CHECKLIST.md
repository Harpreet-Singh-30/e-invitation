# Screenshot Verification Checklist

**Purpose:** Manual browser verification of Task 03 implementation  
**Base URL:** http://localhost:5173

---

## Required Screenshots

### 1. Homepage (Desktop)
**URL:** http://localhost:5173/

**What to verify:**
- [ ] Hero section with "Beautiful Invitations for Every Celebration"
- [ ] Navigation bar with InviteHub logo
- [ ] "Create Invitation" button visible
- [ ] **9 occasion category cards** (count them!)
- [ ] Last two cards should be "Family Celebration" and "Other"
- [ ] How It Works section visible
- [ ] Footer present

**Screenshot filename:** `01-homepage-desktop.png`

---

### 2. Homepage (Mobile)
**URL:** http://localhost:5173/

**What to verify:**
- [ ] Responsive layout (resize browser to ~375px width)
- [ ] Hamburger menu visible
- [ ] Single column occasion cards
- [ ] All 9 occasions visible when scrolled
- [ ] Mobile-friendly spacing

**Screenshot filename:** `02-homepage-mobile.png`

---

### 3. Template Gallery - All Templates
**URL:** http://localhost:5173/templates

**What to verify:**
- [ ] Top navigation with InviteHub logo
- [ ] **10 filter tabs** (All + 9 occasions)
- [ ] "All", "Wedding", "Birthday", "Anniversary", "Baby Shower", "Housewarming", "Party", "Religious", "Family Celebration", "Other"
- [ ] 3 wedding template cards visible
- [ ] Each card has "Preview" and "Use This" buttons

**Screenshot filename:** `03-gallery-all-templates.png`

---

### 4. Template Gallery - Wedding Filter
**URL:** http://localhost:5173/templates?category=wedding

**What to verify:**
- [ ] "Wedding" tab is highlighted/active
- [ ] URL shows ?category=wedding
- [ ] 3 wedding templates shown
- [ ] Royal Maroon, Modern Floral, Classic Gold

**Screenshot filename:** `04-gallery-wedding-filter.png`

---

### 5. Template Gallery - Birthday Filter (Empty State)
**URL:** http://localhost:5173/templates?category=birthday

**What to verify:**
- [ ] "Birthday" tab is highlighted/active
- [ ] Empty state message: "More Designs Coming Soon"
- [ ] Button to "View All Templates"
- [ ] No template cards shown

**Screenshot filename:** `05-gallery-birthday-empty.png`

---

### 6. Template Gallery - Family Celebration Filter
**URL:** http://localhost:5173/templates?category=family_celebration

**What to verify:**
- [ ] "Family Celebration" tab exists and is clickable
- [ ] Tab is highlighted when selected
- [ ] Shows empty state (no family templates yet)
- [ ] This verifies the 'family_celebration' ID fix worked

**Screenshot filename:** `06-gallery-family-celebration.png`

---

### 7. Template Gallery - Other Filter
**URL:** http://localhost:5173/templates?category=other

**What to verify:**
- [ ] "Other" tab exists and is clickable
- [ ] Tab is highlighted when selected
- [ ] Shows empty state
- [ ] This verifies the 'other' category addition worked

**Screenshot filename:** `07-gallery-other.png`

---

### 8. Royal Maroon Template Preview (Desktop)
**URL:** http://localhost:5173/templates/royal-maroon/preview

**What to verify:**
- [ ] Template renders in full view
- [ ] "Desktop" view toggle is selected
- [ ] Back to Templates button visible
- [ ] "Use This Template" button prominent
- [ ] Template shows Rohan & Priya wedding with multiple events
- [ ] Maroon and gold color scheme visible

**Screenshot filename:** `08-preview-royal-maroon-desktop.png`

---

### 9. Royal Maroon Template Preview (Mobile View)
**URL:** http://localhost:5173/templates/royal-maroon/preview

**What to verify:**
- [ ] Click "Mobile" view toggle
- [ ] Preview width changes to ~375px
- [ ] Mobile device frame styling visible
- [ ] Template content still readable
- [ ] Toggle button shows "Mobile" as active

**Screenshot filename:** `09-preview-royal-maroon-mobile.png`

---

### 10. Modern Floral Template Preview
**URL:** http://localhost:5173/templates/modern-floral/preview

**What to verify:**
- [ ] Different template renders
- [ ] James & Sarah names visible
- [ ] Floral/pastel design visible
- [ ] Desktop/mobile toggle works
- [ ] "Use This Template" button works

**Screenshot filename:** `10-preview-modern-floral.png`

---

### 11. Classic Gold Template Preview
**URL:** http://localhost:5173/templates/classic-gold/preview

**What to verify:**
- [ ] Third template renders correctly
- [ ] Arjun & Anjali names visible
- [ ] Gold/elegant design visible
- [ ] All preview features work

**Screenshot filename:** `11-preview-classic-gold.png`

---

### 12. Login Page
**URL:** http://localhost:5173/login

**What to verify:**
- [ ] Login form visible
- [ ] Email and password fields
- [ ] "Sign In" button
- [ ] Link to signup page
- [ ] Gradient background
- [ ] No regressions from Task 03

**Screenshot filename:** `12-login-page.png`

---

### 13. Signup Page
**URL:** http://localhost:5173/signup

**What to verify:**
- [ ] Signup form visible
- [ ] Name, email, password, confirm password fields
- [ ] "Create Account" button
- [ ] Link to login page
- [ ] No regressions from Task 03

**Screenshot filename:** `13-signup-page.png`

---

### 14. Dashboard (After Login)
**URL:** http://localhost:5173/dashboard

**What to verify:**
- [ ] Requires authentication (redirect to login if not logged in)
- [ ] After login, dashboard shows
- [ ] Sidebar navigation visible
- [ ] "Create Invitation" button
- [ ] Invitation list (or empty state)
- [ ] No regressions from Task 03

**Screenshot filename:** `14-dashboard.png`

---

### 15. Create Invitation
**URL:** http://localhost:5173/invitations/new

**What to verify:**
- [ ] Requires authentication
- [ ] Title input field
- [ ] **9 occasion type buttons** (verify count!)
- [ ] Wedding, Birthday, Anniversary, Baby Shower, Housewarming, Party, Religious, Family Celebration, Other
- [ ] "Family Celebration" button exists (not just "Family")
- [ ] "Other" button exists
- [ ] Create button visible

**Screenshot filename:** `15-create-invitation.png`

---

## Verification Steps

### Before Taking Screenshots

1. Ensure both servers are running:
   - Backend: http://localhost:3000 (check with curl or browser)
   - Frontend: http://localhost:5173

2. Clear browser cache and cookies (optional, but recommended)

3. Use a modern browser (Chrome, Firefox, Safari, Edge)

4. For mobile views:
   - Use browser DevTools responsive mode
   - OR resize browser window to ~375px width

### Taking Screenshots

1. Use full browser window for desktop views
2. Use DevTools mobile view for mobile screenshots
3. Include browser address bar in screenshots (shows URL)
4. Ensure full page is captured (scroll if needed)

### What to Look For

**Critical Checks:**
- ✅ 9 occasion categories everywhere (not 8)
- ✅ "Family Celebration" label (not "Family")
- ✅ "Other" category exists
- ✅ All 3 template previews render
- ✅ Desktop/mobile toggle works
- ✅ No JavaScript errors in console

**If You Find Issues:**
- Take screenshot of the issue
- Check browser console for errors (F12)
- Note which URL shows the issue
- Compare with expected behavior in verification report

---

## Quick Browser Test (No Screenshots Required)

### Test Template Selection Flow

1. Go to http://localhost:5173/templates/royal-maroon/preview
2. Click "Use This Template" button
3. Verify redirect to http://localhost:5173/signup
4. Open browser DevTools → Application → Session Storage
5. Check for keys:
   - `selectedTemplate` = "royal-maroon"
   - `selectedOccasion` = "wedding"

**Expected:** ✅ Both keys present with correct values  
**Note:** CreateInvitation doesn't consume these yet (documented limitation)

---

## Console Errors to Ignore

These are expected/harmless:
- React DevTools warnings
- HMR (Hot Module Reload) messages
- Vite connection messages
- 404 for `/favicon.ico`

These indicate problems:
- JavaScript errors (red text)
- Failed API calls (except when testing auth)
- "Cannot read property of undefined"
- Component rendering errors

---

## After Verification

If all checks pass:
1. ✅ Task 03 is production-ready
2. Ready to commit changes
3. Safe to proceed with next development phase

If issues found:
1. Document the issue with screenshot
2. Check TASK_03_VERIFICATION_REPORT.md for known limitations
3. Determine if it's a bug or documented limitation

---

**Happy Testing!**

**Reminder:** Both servers should be running:
- Backend: http://localhost:3000 (PID 281366)
- Frontend: http://localhost:5173 (PID 281814)
