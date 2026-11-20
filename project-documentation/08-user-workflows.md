# 08. End-to-End User Workflows

> **Document Version:** 1.0.0  
> **Author:** Senior Project Manager & UX Architect  
> **Status:** Approved Baseline  
> **Audience:** Product Managers, UX Designers, Frontend & QA Engineers

---

## 1. Guest Journey: Unboxing, Itinerary & RSVP

The guest journey is designed for extreme emotional engagement, zero friction, and instant mobile readability. Over 90% of guests access the invitation directly from messaging apps (WhatsApp/iMessage).

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Smartphone Guest
    participant WhatsApp as WhatsApp / Chat App
    participant Gate as Sealed Envelope Gate
    participant MicroSite as Live Invitation Micro-App
    participant API as Backend API
    participant DB as PostgreSQL

    Guest->>WhatsApp: Tap invitation link (e.g., invitehub.in/i/rohan-priya)
    WhatsApp->>Gate: Open webview / mobile browser
    Note over Gate: Interactive wax seal gate displays<br/>Host names & "Tap to Open"
    Guest->>Gate: Tap wax seal
    Note over Gate: Wax cracks, envelope unfolds,<br/>celebration music begins!
    Gate->>MicroSite: Reveal luxury event microsite
    Guest->>MicroSite: Scroll multi-event itinerary
    Guest->>MicroSite: Tap "Directions" -> Launches Google Maps
    Guest->>MicroSite: Tap "RSVP Now" button
    MicroSite->>Guest: Display RSVP Modal
    Guest->>MicroSite: Fill attendance, headcount & diet
    Guest->>API: POST /api/rsvp
    API->>DB: INSERT into Rsvp table
    DB-->>API: Success confirmation
    API-->>MicroSite: Confirmed (201 Created)
    Note over MicroSite: Confetti burst & Thank You note displayed!
```

---

## 2. Host Journey: Invitation Creation Wizard

The 4-step wizard guides prospective hosts from template selection to a live draft website in under 2 minutes.

```mermaid
flowchart TD
    Start([Host Clicks 'Create Invitation']) --> Step1[Step 1: Select Occasion Type\nWedding, Birthday, Anniversary, etc.]
    Step1 --> Step2[Step 2: Choose Theme Design\nFilter by Occasion & Aesthetics]
    Step2 --> Step3[Step 3: Enter Event Basics\nTitle, Honorees, Date, City, Vanity Slug]
    Step3 --> ValidateSlug{Is Slug Available?}
    ValidateSlug -->|No| PromptSlug[Show error: 'Slug already taken'\nSuggest alternatives]
    PromptSlug --> Step3
    ValidateSlug -->|Yes| Step4[Step 4: Review & Generate]
    Step4 --> CreateRecord[POST /api/invitations\nCreate DRAFT record in DB]
    CreateRecord --> RedirectEditor([Redirect to Live Customizer Studio])
```

---

## 3. Host Journey: Live Customizer Studio Workflow

The Live Customizer Studio provides a split-screen interactive environment where changes immediately reflect in a real-time mobile frame.

```mermaid
stateDiagram-v2
    [*] --> LoadingStudio
    LoadingStudio --> InitializingState: Fetch Invitation by ID
    InitializingState --> EditingActive: Hydrate Form Controls & Phone Preview

    state EditingActive {
        [*] --> GeneralSettings
        GeneralSettings --> ThemeAndColors: Select Palette / Fonts
        ThemeAndColors --> EventItinerary: Add / Edit Sub-events
        EventItinerary --> HonoreeDetails: Adjust Single vs Couple Names
        HonoreeDetails --> MusicAndMedia: Upload Audio / Cover Photo
    }

    EditingActive --> LivePreviewUpdate: Keystroke / Color Change
    LivePreviewUpdate --> EditingActive: Instant React State Re-render

    EditingActive --> SaveDraft: Click "Save Draft"
    SaveDraft --> API_Save: PUT /api/invitations/:id
    API_Save --> EditingActive: Saved notification

    EditingActive --> PublishCheck: Click "Publish Invitation"
    PublishCheck --> TierEvaluation{Is Free Tier or Paid Theme?}
    TierEvaluation -->|Free Eligible| DirectPublish[POST /api/invitations/:id/publish]
    DirectPublish --> LivePublicSite[Site Live at /i/:slug]
    TierEvaluation -->|Requires Upgrade| LaunchCheckout[Open Razorpay Checkout Modal]
    LaunchCheckout --> DirectPublish: Payment Succeeded
```

---

## 4. Host Journey: RSVP Tracking & Guest List Export

```mermaid
flowchart LR
    A[Host Logs In] --> B[Host Dashboard]
    B --> C[Click 'Manage Guests']
    C --> D[View Headcount Analytics\nAttending vs Declined]
    D --> E[Filter by Dietary Preferences\nVeg, Non-Veg, Jain]
    D --> F[Click 'Export CSV']
    F --> G([Download Catering Spreadsheet])
```

---

## 5. Host Journey: Tier Upgrade & Razorpay Checkout

```mermaid
sequenceDiagram
    autonumber
    actor Host as Host User
    participant Customizer as Invitation Editor / Dashboard
    participant API as Backend Express Server
    participant Razorpay as Razorpay API & Checkout
    participant DB as Supabase PostgreSQL

    Host->>Customizer: Click "Upgrade to Premium (₹499)"
    Customizer->>API: POST /api/payments/create-order { invitationId, tier: "PREMIUM" }
    API->>Razorpay: orders.create({ amount: 49900, currency: "INR" })
    Razorpay-->>API: Order Object (order_id: "order_XYZ")
    API->>DB: INSERT into Payment (status: "PENDING")
    API-->>Customizer: { orderId, amount, keyId }
    Customizer->>Razorpay: Open Razorpay Checkout modal
    Host->>Razorpay: Complete payment (UPI / Google Pay / Card)
    Razorpay-->>Customizer: { payment_id, order_id, signature }
    Customizer->>API: POST /api/payments/verify (payload)
    API->>API: Verify HMAC SHA256 signature
    API->>DB: UPDATE Payment SET status='SUCCESS'
    API->>DB: UPDATE Invitation SET tier='PREMIUM'
    DB-->>API: Updated
    API-->>Customizer: HTTP 200 OK (Tier Elevated)
    Note over Customizer: Premium badge enabled, watermark removed!
```

