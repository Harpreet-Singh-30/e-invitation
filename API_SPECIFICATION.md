# 🌐 API SPECIFICATION - SaaS Invitation Platform

**Version:** 1.0  
**Base URL:** `https://yourdomain.com/api`  
**Authentication:** JWT tokens + Session cookies  
**Date:** November 6, 2026

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Host APIs](#host-apis)
4. [Guest APIs](#guest-apis)
5. [Admin APIs](#admin-apis)
6. [Public APIs](#public-apis)
7. [Webhook APIs](#webhook-apis)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)
10. [Response Formats](#response-formats)

---

## 🎯 OVERVIEW

### API Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         API GATEWAY                          │
│                  (Rate Limiting, CORS, Auth)                 │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌─────────▼────────┐  ┌────────▼────────┐
│   PUBLIC API   │  │    HOST API      │  │   GUEST API     │
│   (No Auth)    │  │  (JWT Required)  │  │ (Token in URL)  │
│                │  │                  │  │                 │
│ • Themes       │  │ • Dashboard      │  │ • View invite   │
│ • Pricing      │  │ • Create invite  │  │ • Submit RSVP   │
│ • Demo         │  │ • Manage events  │  │ • Update RSVP   │
└────────────────┘  │ • Guests         │  └─────────────────┘
                    │ • Analytics      │
                    │ • Media upload   │
                    └──────────────────┘
                              │
                    ┌─────────▼────────┐
                    │    ADMIN API     │
                    │  (Admin Auth)    │
                    │                  │
                    │ • Platform stats │
                    │ • User mgmt      │
                    │ • Support        │
                    └──────────────────┘
```

### Base URLs

```
Production:   https://api.yourdomain.com
Staging:      https://api-staging.yourdomain.com
Development:  http://localhost:3000/api
```

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer <jwt_token>  (for authenticated routes)
X-API-Version: 1.0
X-Client-ID: web|mobile|admin
```

---

## 🔐 AUTHENTICATION

### Authentication Flow

```
┌─────────┐         ┌─────────┐         ┌──────────┐
│  User   │────────▶│  Auth   │────────▶│ Database │
│ (Host)  │  Login  │  API    │  Verify │          │
└─────────┘         └─────────┘         └──────────┘
     │                   │
     │              JWT Token
     │              (access + refresh)
     │                   │
     ▼                   ▼
┌─────────────────────────────────┐
│   Protected Routes              │
│   (Send JWT in Authorization)   │
└─────────────────────────────────┘
```

---

### 1. Sign Up (Host Registration)

**Endpoint:** `POST /api/auth/signup`  
**Auth:** None  
**Rate Limit:** 5 requests per minute per IP

**Request Body:**
```json
{
  "email": "rohan@example.com",
  "password": "SecurePass123!",
  "name": "Rohan Kumar",
  "phone": "+91-9876543210"
}
```

**Validation:**
- Email: Valid format, unique
- Password: Min 8 chars, 1 uppercase, 1 number, 1 special char
- Name: Min 2 chars
- Phone: Optional, valid format

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "rohan@example.com",
      "name": "Rohan Kumar",
      "role": "host",
      "subscriptionTier": "free",
      "emailVerified": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  },
  "message": "Account created successfully. Please verify your email."
}
```

**Errors:**
- `400`: Validation failed
- `409`: Email already exists
- `429`: Too many requests

---

### 2. Login

**Endpoint:** `POST /api/auth/login`  
**Auth:** None  
**Rate Limit:** 10 requests per minute per IP

**Request Body:**
```json
{
  "email": "rohan@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "rohan@example.com",
      "name": "Rohan Kumar",
      "role": "host",
      "subscriptionTier": "pro",
      "emailVerified": true,
      "lastLoginAt": "2026-11-06T13:46:44.363Z"
    },
    "tokens": {
      "accessToken": "jwt_token_here",
      "refreshToken": "refresh_token_here",
      "expiresIn": 3600
    }
  }
}
```

**Errors:**
- `401`: Invalid credentials
- `403`: Account disabled
- `429`: Too many login attempts

---

### 3. Refresh Token

**Endpoint:** `POST /api/auth/refresh`  
**Auth:** Refresh token in body  

**Request Body:**
```json
{
  "refreshToken": "current_refresh_token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token",
    "expiresIn": 3600
  }
}
```

---

### 4. Logout

**Endpoint:** `POST /api/auth/logout`  
**Auth:** Bearer token required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Verify Email

**Endpoint:** `POST /api/auth/verify-email`  
**Auth:** None

**Request Body:**
```json
{
  "token": "email_verification_token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### 6. Request Password Reset

**Endpoint:** `POST /api/auth/forgot-password`  
**Auth:** None  
**Rate Limit:** 3 requests per hour per email

**Request Body:**
```json
{
  "email": "rohan@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

### 7. Reset Password

**Endpoint:** `POST /api/auth/reset-password`  
**Auth:** None

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 👤 HOST APIs (Authenticated)

All host APIs require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

---

### DASHBOARD

#### 1. Get Dashboard Stats

**Endpoint:** `GET /api/host/dashboard`  
**Auth:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalInvitations": 3,
      "activeInvitations": 2,
      "totalGuests": 245,
      "totalRsvps": 180,
      "responseRate": 73.5,
      "attendingGuests": 156,
      "notAttendingGuests": 24,
      "pendingRsvps": 65
    },
    "recentActivity": [
      {
        "id": "uuid",
        "action": "rsvp_received",
        "guestName": "Kapoor Family",
        "invitationTitle": "Rohan weds Priya",
        "timestamp": "2026-11-06T12:30:00Z"
      }
    ],
    "upcomingEvents": [
      {
        "id": "uuid",
        "name": "Wedding Ceremony",
        "date": "2026-12-22",
        "daysUntil": 46,
        "invitationTitle": "Rohan weds Priya"
      }
    ]
  }
}
```

---

### INVITATIONS

#### 2. List All Invitations

**Endpoint:** `GET /api/host/invitations`  
**Auth:** Required  
**Query Params:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` (optional: "live", "draft", "expired")
- `eventType` (optional: "wedding", "birthday", etc.)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "invitations": [
      {
        "id": "uuid",
        "title": "Rohan weds Priya",
        "slug": "rohan-priya-wedding",
        "eventType": "wedding",
        "isLive": true,
        "isPublished": true,
        "theme": {
          "id": "uuid",
          "name": "Royal Maroon",
          "previewImageUrl": "/themes/royal-maroon.jpg"
        },
        "stats": {
          "totalGuests": 150,
          "rsvpCount": 120,
          "responseRate": 80,
          "eventCount": 3
        },
        "createdAt": "2026-10-15T10:00:00Z",
        "updatedAt": "2026-11-05T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

#### 3. Get Single Invitation

**Endpoint:** `GET /api/host/invitations/:id`  
**Auth:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "invitation": {
      "id": "uuid",
      "userId": "uuid",
      "title": "Rohan weds Priya",
      "slug": "rohan-priya-wedding",
      "eventType": "wedding",
      "tagline": "Two hearts, one love",
      "welcomeMessage": "We invite you to celebrate...",
      "storyContent": "Our story began in 2020...",
      "familyInfo": "Son of Mr. & Mrs. Kumar...",
      "musicUrl": "https://cdn.../music.mp3",
      "heroImageUrl": "https://cdn.../hero.jpg",
      "language": "en",
      "allowLanguageToggle": true,
      "allowGuestRsvpEdit": true,
      "isLive": true,
      "isPublished": true,
      "expiresAt": "2027-01-01T00:00:00Z",
      "theme": {
        "id": "uuid",
        "name": "Royal Maroon",
        "slug": "royal-maroon"
      },
      "createdAt": "2026-10-15T10:00:00Z",
      "updatedAt": "2026-11-05T14:30:00Z"
    }
  }
}
```

---

#### 4. Create Invitation

**Endpoint:** `POST /api/host/invitations`  
**Auth:** Required

**Request Body:**
```json
{
  "title": "Rohan weds Priya",
  "slug": "rohan-priya-wedding",
  "eventType": "wedding",
  "themeId": "uuid",
  "tagline": "Two hearts, one love",
  "language": "en"
}
```

**Validation:**
- `title`: Required, 3-255 chars
- `slug`: Required, unique, URL-safe (lowercase, hyphens only)
- `eventType`: Required, enum (wedding/birthday/anniversary/corporate/religious)
- `themeId`: Required, valid theme UUID

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "invitation": {
      "id": "uuid",
      "title": "Rohan weds Priya",
      "slug": "rohan-priya-wedding",
      "eventType": "wedding",
      "isLive": false,
      "isPublished": false,
      "createdAt": "2026-11-06T13:46:44Z"
    }
  },
  "message": "Invitation created successfully"
}
```

**Errors:**
- `400`: Validation failed
- `409`: Slug already exists
- `403`: Subscription limit reached (free tier: 1 invitation)

---

#### 5. Update Invitation

**Endpoint:** `PUT /api/host/invitations/:id`  
**Auth:** Required (must own invitation)

**Request Body (Partial):**
```json
{
  "title": "Rohan & Priya's Wedding",
  "tagline": "Forever starts now",
  "welcomeMessage": "Updated message...",
  "storyContent": "Updated story...",
  "familyInfo": "Updated family info...",
  "language": "hi",
  "allowLanguageToggle": true,
  "allowGuestRsvpEdit": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "invitation": {
      // Updated invitation object
    }
  },
  "message": "Invitation updated successfully"
}
```

**Errors:**
- `404`: Invitation not found
- `403`: Not authorized (not owner)

---

#### 6. Delete Invitation

**Endpoint:** `DELETE /api/host/invitations/:id`  
**Auth:** Required (must own invitation)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Invitation deleted successfully"
}
```

**Note:** Cascading delete removes all events, guests, RSVPs, and media.

---

#### 7. Publish/Unpublish Invitation

**Endpoint:** `PATCH /api/host/invitations/:id/publish`  
**Auth:** Required

**Request Body:**
```json
{
  "isLive": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "invitation": {
      "id": "uuid",
      "isLive": true,
      "isPublished": true,
      "publishedAt": "2026-11-06T13:46:44Z"
    }
  },
  "message": "Invitation is now live"
}
```

**Validation:**
- Must have at least 1 event
- Must have valid theme
- Recommended: Add guests before publishing

---

#### 8. Duplicate Invitation

**Endpoint:** `POST /api/host/invitations/:id/duplicate`  
**Auth:** Required

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "invitation": {
      "id": "new_uuid",
      "title": "Rohan weds Priya (Copy)",
      "slug": "rohan-priya-wedding-copy",
      // ... all other fields copied
      "isLive": false,
      "isPublished": false
    }
  },
  "message": "Invitation duplicated successfully"
}
```

**Note:** Duplicates invitation, events, and media. Does NOT duplicate guests/RSVPs.

---

### EVENTS

#### 9. List Events for Invitation

**Endpoint:** `GET /api/host/invitations/:invitationId/events`  
**Auth:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "invitationId": "uuid",
        "name": "Haldi Ceremony",
        "description": "Traditional turmeric ceremony",
        "eventDate": "2026-12-20",
        "startTime": "10:00:00",
        "endTime": "12:00:00",
        "timezone": "Asia/Kolkata",
        "venueName": "Kumar Residence",
        "venueAddress": "123 Main Street, Delhi",
        "venueCity": "Delhi",
        "mapLink": "https://maps.google.com/...",
        "dressCode": "Traditional",
        "dressCodeDescription": "Yellow or white attire",
        "orderIndex": 0,
        "isMainEvent": false,
        "showCountdown": false,
        "coverImageUrl": "https://cdn.../haldi.jpg",
        "createdAt": "2026-10-15T10:00:00Z"
      },
      {
        "id": "uuid",
        "name": "Wedding Ceremony",
        "eventDate": "2026-12-22",
        "startTime": "18:00:00",
        "endTime": "21:00:00",
        "venueName": "Grand Palace Hotel",
        "orderIndex": 1,
        "isMainEvent": true,
        "showCountdown": true
      }
    ]
  }
}
```

---

#### 10. Create Event

**Endpoint:** `POST /api/host/invitations/:invitationId/events`  
**Auth:** Required

**Request Body:**
```json
{
  "name": "Wedding Ceremony",
  "description": "Main wedding ceremony",
  "eventDate": "2026-12-22",
  "startTime": "18:00",
  "endTime": "21:00",
  "timezone": "Asia/Kolkata",
  "venueName": "Grand Palace Hotel",
  "venueAddress": "456 Palace Road, Delhi",
  "venueCity": "Delhi",
  "venueState": "Delhi",
  "venueCountry": "India",
  "mapLatitude": 28.6139,
  "mapLongitude": 77.2090,
  "mapLink": "https://maps.google.com/...",
  "dressCode": "Formal Traditional",
  "dressCodeDescription": "Traditional Indian formal attire",
  "orderIndex": 1,
  "isMainEvent": true,
  "showCountdown": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "uuid",
      // ... all event fields
    }
  },
  "message": "Event created successfully"
}
```

**Errors:**
- `403`: Event limit reached (free tier: 1 event)

---

#### 11. Update Event

**Endpoint:** `PUT /api/host/invitations/:invitationId/events/:eventId`  
**Auth:** Required

**Request Body (Partial):**
```json
{
  "eventDate": "2026-12-23",
  "startTime": "19:00",
  "venueName": "Updated Venue"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "event": {
      // Updated event object
    }
  }
}
```

---

#### 12. Delete Event

**Endpoint:** `DELETE /api/host/invitations/:invitationId/events/:eventId`  
**Auth:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

#### 13. Reorder Events

**Endpoint:** `PATCH /api/host/invitations/:invitationId/events/reorder`  
**Auth:** Required

**Request Body:**
```json
{
  "eventOrders": [
    { "id": "event1_uuid", "orderIndex": 0 },
    { "id": "event2_uuid", "orderIndex": 1 },
    { "id": "event3_uuid", "orderIndex": 2 }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Events reordered successfully"
}
```

---

### GUESTS

#### 14. List Guests

**Endpoint:** `GET /api/host/invitations/:invitationId/guests`  
**Auth:** Required  
**Query Params:**
- `page` (default: 1)
- `limit` (default: 50)
- `search` (optional: search by household name)
- `rsvpStatus` (optional: "pending", "accepted", "declined")

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "guests": [
      {
        "id": "uuid",
        "householdName": "Kapoor Family",
        "token": "secure_token_here",
        "maxGuests": 5,
        "allowedEvents": [], // empty = all events
        "email": "kapoor@example.com",
        "phone": "+91-9876543210",
        "inviteUrl": "https://yourdomain.com/invite/rohan-priya-wedding/secure_token_here",
        "linkOpenCount": 3,
        "linkOpenedAt": "2026-11-05T10:00:00Z",
        "rsvp": {
          "isAttending": true,
          "attendingCount": 4,
          "eventsAttending": ["event1_uuid", "event2_uuid"],
          "respondedAt": "2026-11-05T12:00:00Z"
        },
        "createdAt": "2026-10-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    },
    "stats": {
      "total": 150,
      "responded": 120,
      "attending": 95,
      "notAttending": 25,
      "pending": 30
    }
  }
}
```

---

#### 15. Create Guest (Single)

**Endpoint:** `POST /api/host/invitations/:invitationId/guests`  
**Auth:** Required

**Request Body:**
```json
{
  "householdName": "Sharma Family",
  "maxGuests": 4,
  "allowedEvents": [], // empty = all events, or ["event_uuid1", "event_uuid2"]
  "email": "sharma@example.com",
  "phone": "+91-9876543211"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "guest": {
      "id": "uuid",
      "householdName": "Sharma Family",
      "token": "generated_secure_token",
      "maxGuests": 4,
      "inviteUrl": "https://yourdomain.com/invite/rohan-priya-wedding/generated_secure_token"
    }
  },
  "message": "Guest added successfully"
}
```

**Errors:**
- `403`: Guest limit reached (free tier: 50 guests)

---

#### 16. Bulk Import Guests (CSV)

**Endpoint:** `POST /api/host/invitations/:invitationId/guests/import`  
**Auth:** Required  
**Content-Type:** `multipart/form-data`

**Request (Form Data):**
- `file`: CSV file with columns: `householdName`, `maxGuests`, `email`, `phone`, `allowedEvents`

**Example CSV:**
```csv
householdName,maxGuests,email,phone,allowedEvents
"Kapoor Family",5,kapoor@example.com,+91-9876543210,
"Sharma Family",4,sharma@example.com,+91-9876543211,"event1,event2"
"Gupta Family",3,gupta@example.com,+91-9876543212,
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "imported": 145,
    "failed": 5,
    "errors": [
      {
        "row": 23,
        "error": "Invalid email format"
      }
    ],
    "guests": [
      // Array of created guest objects
    ]
  },
  "message": "145 guests imported, 5 failed"
}
```

---

#### 17. Update Guest

**Endpoint:** `PUT /api/host/invitations/:invitationId/guests/:guestId`  
**Auth:** Required

**Request Body:**
```json
{
  "householdName": "Updated Name",
  "maxGuests": 6,
  "email": "updated@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "guest": {
      // Updated guest object
    }
  }
}
```

---

#### 18. Delete Guest

**Endpoint:** `DELETE /api/host/invitations/:invitationId/guests/:guestId`  
**Auth:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Guest removed successfully"
}
```

**Note:** Also deletes associated RSVP.

---

#### 19. Regenerate Guest Token

**Endpoint:** `POST /api/host/invitations/:invitationId/guests/:guestId/regenerate-token`  
**Auth:** Required

**Use Case:** If a guest link is compromised

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "guest": {
      "id": "uuid",
      "token": "new_secure_token",
      "inviteUrl": "https://yourdomain.com/invite/rohan-priya-wedding/new_secure_token"
    }
  },
  "message": "New invitation link generated"
}
```

---

#### 20. Export Guest List

**Endpoint:** `GET /api/host/invitations/:invitationId/guests/export`  
**Auth:** Required  
**Query Params:**
- `format` (csv or xlsx, default: csv)
- `includeRsvp` (boolean, default: true)

**Response:** CSV/Excel file download

**CSV Format:**
```csv
Household Name,Max Guests,Email,Phone,RSVP Status,Attending Count,Events Attending,Dietary Notes,Responded At
"Kapoor Family",5,kapoor@example.com,+91-9876543210,Accepted,4,"Haldi,Wedding,Reception","No restrictions","2026-11-05 12:00:00"
```

---

### RSVP MANAGEMENT

#### 21. Get RSVP Analytics

**Endpoint:** `GET /api/host/invitations/:invitationId/rsvps/analytics`  
**Auth:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overall": {
      "totalGuests": 150,
      "totalResponses": 120,
      "responseRate": 80,
      "totalAttending": 95,
      "totalNotAttending": 25,
      "totalPending": 30,
      "totalExpectedAttendees": 380 // sum of attending_count
    },
    "byEvent": [
      {
        "eventId": "uuid",
        "eventName": "Wedding Ceremony",
        "eventDate": "2026-12-22",
        "guestsInvited": 150,
        "guestsAttending": 142,
        "expectedAttendees": 565
      },
      {
        "eventId": "uuid",
        "eventName": "Haldi Ceremony",
        "guestsInvited": 100,
        "guestsAttending": 85,
        "expectedAttendees": 340
      }
    ],
    "timeline": [
      {
        "date": "2026-11-01",
        "cumulativeResponses": 45
      },
      {
        "date": "2026-11-05",
        "cumulativeResponses": 120
      }
    ],
    "dietary": {
      "vegetarian": 250,
      "vegan": 30,
      "glutenFree": 15,
      "other": 10
    }
  }
}
```

---

#### 22. View Individual RSVP

**Endpoint:** `GET /api/host/invitations/:invitationId/guests/:guestId/rsvp`  
**Auth:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rsvp": {
      "id": "uuid",
      "guestId": "uuid",
      "guest": {
        "householdName": "Kapoor Family",
        "maxGuests": 5
      },
      "isAttending": true,
      "attendingCount": 4,
      "eventsAttending": [
        {
          "id": "uuid",
          "name": "Haldi Ceremony"
        },
        {
          "id": "uuid",
          "name": "Wedding Ceremony"
        }
      ],
      "dietaryRestrictions": "2 vegetarian, 2 vegan",
      "specialRequests": "Need wheelchair access",
      "message": "So excited to celebrate with you!",
      "respondedAt": "2026-11-05T12:00:00Z",
      "updatedAt": "2026-11-05T14:30:00Z"
    }
  }
}
```

---

### MEDIA MANAGEMENT

#### 23. Upload Media

**Endpoint:** `POST /api/host/invitations/:invitationId/media`  
**Auth:** Required  
**Content-Type:** `multipart/form-data`

**Request (Form Data):**
- `file`: Image/audio file (max 10MB for images, 20MB for audio)
- `type`: "hero" | "gallery" | "invitation_card" | "music" | "event_cover"
- `eventId`: (optional) UUID if attached to specific event
- `caption`: (optional) String
- `altText`: (optional) String for accessibility

**Validation:**
- Images: JPG, PNG, WebP, GIF (max 10MB)
- Audio: MP3, WAV (max 20MB)
- Free tier: Max 10 images

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "media": {
      "id": "uuid",
      "invitationId": "uuid",
      "type": "gallery",
      "filename": "photo-1-optimized.webp",
      "originalFilename": "wedding-photo.jpg",
      "url": "https://cdn.yourdomain.com/uploads/uuid/photo-1.webp",
      "fileSize": 245678,
      "mimeType": "image/webp",
      "width": 1920,
      "height": 1080,
      "caption": "Getting ready",
      "altText": "Bride getting ready",
      "orderIndex": 0,
      "uploadedAt": "2026-11-06T13:46:44Z"
    }
  },
  "message": "Media uploaded successfully"
}
```

**Note:** Server processes image (resize, optimize, convert to WebP) and uploads to S3/CDN.

---

#### 24. List Media

**Endpoint:** `GET /api/host/invitations/:invitationId/media`  
**Auth:** Required  
**Query Params:**
- `type` (optional: filter by type)
- `eventId` (optional: filter by event)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "media": [
      {
        "id": "uuid",
        "type": "gallery",
        "url": "https://cdn.../photo-1.webp",
        "caption": "Getting ready",
        "orderIndex": 0
      }
    ]
  }
}
```

---

#### 25. Update Media

**Endpoint:** `PUT /api/host/invitations/:invitationId/media/:mediaId`  
**Auth:** Required

**Request Body:**
```json
{
  "caption": "Updated caption",
  "altText": "Updated alt text",
  "orderIndex": 5
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "media": {
      // Updated media object
    }
  }
}
```

---

#### 26. Delete Media

**Endpoint:** `DELETE /api/host/invitations/:invitationId/media/:mediaId`  
**Auth:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Media deleted successfully"
}
```

**Note:** Also deletes file from S3/CDN.

---

#### 27. Reorder Gallery

**Endpoint:** `PATCH /api/host/invitations/:invitationId/media/reorder`  
**Auth:** Required

**Request Body:**
```json
{
  "mediaOrders": [
    { "id": "media1_uuid", "orderIndex": 0 },
    { "id": "media2_uuid", "orderIndex": 1 },
    { "id": "media3_uuid", "orderIndex": 2 }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Gallery reordered successfully"
}
```

---

### THEMES

#### 28. List Available Themes

**Endpoint:** `GET /api/host/themes`  
**Auth:** Required  
**Query Params:**
- `category` (optional: wedding/birthday/etc.)
- `priceTier` (optional: free/premium)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "themes": [
      {
        "id": "uuid",
        "name": "Royal Maroon",
        "slug": "royal-maroon",
        "description": "Elegant maroon and gold theme",
        "category": "wedding",
        "tags": ["traditional", "elegant", "luxury"],
        "previewImageUrl": "/themes/royal-maroon.jpg",
        "previewUrl": "/demo/royal-maroon",
        "features": ["door_animation", "countdown", "multi_event", "gallery"],
        "priceTier": "premium",
        "priceAmount": 29900, // ₹299 in paise
        "currency": "INR",
        "isUnlocked": false, // based on user's purchases
        "isFeatured": true
      },
      {
        "id": "uuid",
        "name": "Classic White",
        "slug": "classic-white",
        "category": "wedding",
        "priceTier": "free",
        "priceAmount": 0,
        "isUnlocked": true
      }
    ]
  }
}
```

---

#### 29. Purchase Theme

**Endpoint:** `POST /api/host/themes/:themeId/purchase`  
**Auth:** Required

**Request Body:**
```json
{
  "paymentMethodId": "stripe_payment_method_id"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "purchase": {
      "id": "uuid",
      "themeId": "uuid",
      "pricePaid": 29900,
      "purchasedAt": "2026-11-06T13:46:44Z"
    },
    "payment": {
      "id": "uuid",
      "status": "succeeded",
      "receiptUrl": "https://..."
    }
  },
  "message": "Theme unlocked successfully"
}
```

---

### SUBSCRIPTION

#### 30. Get Subscription Details

**Endpoint:** `GET /api/host/subscription`  
**Auth:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "uuid",
      "plan": "pro",
      "status": "active",
      "billingCycle": "yearly",
      "amount": 99900, // ₹999 in paise
      "currency": "INR",
      "currentPeriodStart": "2026-11-01T00:00:00Z",
      "currentPeriodEnd": "2027-11-01T00:00:00Z",
      "cancelAtPeriodEnd": false
    },
    "usage": {
      "invitations": {
        "used": 3,
        "limit": "unlimited" // or number
      },
      "guests": {
        "used": 245,
        "limit": 200 // per invitation
      },
      "events": {
        "used": 9,
        "limit": "unlimited"
      },
      "media": {
        "used": 45,
        "limit": "unlimited"
      }
    },
    "features": [
      "unlimited_invitations",
      "unlimited_events",
      "all_premium_themes",
      "custom_colors",
      "remove_watermark",
      "advanced_analytics",
      "email_support"
    ]
  }
}
```

---

#### 31. Upgrade Subscription

**Endpoint:** `POST /api/host/subscription/upgrade`  
**Auth:** Required

**Request Body:**
```json
{
  "plan": "pro", // or "business"
  "billingCycle": "yearly", // or "monthly"
  "paymentMethodId": "stripe_payment_method_id"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "uuid",
      "plan": "pro",
      "status": "active",
      "currentPeriodEnd": "2027-11-06T13:46:44Z"
    }
  },
  "message": "Subscription upgraded to Pro"
}
```

---

#### 32. Cancel Subscription

**Endpoint:** `POST /api/host/subscription/cancel`  
**Auth:** Required

**Request Body:**
```json
{
  "reason": "Too expensive", // optional
  "cancelImmediately": false // if false, cancel at period end
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "status": "active",
      "cancelAtPeriodEnd": true,
      "currentPeriodEnd": "2027-11-01T00:00:00Z"
    }
  },
  "message": "Subscription will cancel on 2027-11-01"
}
```

---

### SHARING & NOTIFICATIONS

#### 33. Generate Share Links

**Endpoint:** `GET /api/host/invitations/:invitationId/share`  
**Auth:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "baseUrl": "https://yourdomain.com/invite/rohan-priya-wedding",
    "sampleGuestUrl": "https://yourdomain.com/invite/rohan-priya-wedding/sample_token",
    "whatsappMessage": "Rohan weds Priya – You're invited!\n\nDear [GUEST_NAME],\n\nView your personalized invitation: [INVITE_URL]",
    "socialPreview": {
      "title": "Rohan weds Priya",
      "description": "You're invited to our wedding celebration",
      "imageUrl": "https://cdn.../og-image.jpg"
    }
  }
}
```

---

#### 34. Send Reminders

**Endpoint:** `POST /api/host/invitations/:invitationId/reminders`  
**Auth:** Required

**Request Body:**
```json
{
  "targetGuests": "pending", // "pending" | "all" | ["guest_uuid1", "guest_uuid2"]
  "channel": "whatsapp", // "whatsapp" | "email" | "sms"
  "message": "Custom reminder message (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sent": 45,
    "failed": 2,
    "status": "queued" // Processed asynchronously
  },
  "message": "Reminders queued for 45 guests"
}
```

**Note:** Premium feature

---

## 👥 GUEST APIs (Token-based)

Guest APIs use the secure token from the URL (no JWT required).

---

### 35. View Invitation (Guest)

**Endpoint:** `GET /api/invite/:slug/:token`  
**Auth:** Token in URL (no JWT)  
**Rate Limit:** 100 requests per hour per token

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "guest": {
      "id": "uuid",
      "householdName": "Kapoor Family",
      "maxGuests": 5
    },
    "invitation": {
      "id": "uuid",
      "title": "Rohan weds Priya",
      "slug": "rohan-priya-wedding",
      "eventType": "wedding",
      "tagline": "Two hearts, one love",
      "welcomeMessage": "We are delighted to invite you...",
      "storyContent": "Our love story...",
      "familyInfo": "Son of Mr. & Mrs. Kumar...",
      "heroImageUrl": "https://cdn.../hero.jpg",
      "musicUrl": "https://cdn.../music.mp3",
      "language": "en",
      "allowLanguageToggle": true,
      "theme": {
        "name": "Royal Maroon",
        "slug": "royal-maroon"
      }
    },
    "events": [
      {
        "id": "uuid",
        "name": "Haldi Ceremony",
        "description": "Traditional turmeric ceremony",
        "eventDate": "2026-12-20",
        "startTime": "10:00",
        "endTime": "12:00",
        "venueName": "Kumar Residence",
        "venueAddress": "123 Main Street, Delhi",
        "mapLink": "https://maps.google.com/...",
        "dressCode": "Traditional",
        "dressCodeDescription": "Yellow or white attire",
        "coverImageUrl": "https://cdn.../haldi.jpg",
        "isMainEvent": false,
        "orderIndex": 0
      }
    ],
    "gallery": [
      {
        "id": "uuid",
        "url": "https://cdn.../photo-1.webp",
        "caption": "Engagement ceremony",
        "orderIndex": 0
      }
    ],
    "rsvp": {
      "id": "uuid",
      "isAttending": true,
      "attendingCount": 4,
      "eventsAttending": ["event_uuid1", "event_uuid2"],
      "dietaryRestrictions": "2 vegetarian",
      "message": "Excited to attend!",
      "respondedAt": "2026-11-05T12:00:00Z"
    }
  }
}
```

**Tracking:** Server increments `linkOpenCount` and updates `linkOpenedAt` on first view.

**Errors:**
- `404`: Invalid token or invitation not found
- `403`: Invitation not live

---

### 36. Submit RSVP (Guest)

**Endpoint:** `POST /api/invite/:slug/:token/rsvp`  
**Auth:** Token in URL  
**Rate Limit:** 10 requests per hour per token

**Request Body:**
```json
{
  "isAttending": true,
  "attendingCount": 4,
  "eventsAttending": ["event_uuid1", "event_uuid2"], // Array of event IDs
  "dietaryRestrictions": "2 vegetarian, 2 vegan",
  "specialRequests": "Need parking assistance",
  "message": "So happy to celebrate with you!"
}
```

**Validation:**
- `attendingCount` must be <= guest.maxGuests
- `eventsAttending` must be valid event UUIDs from this invitation
- If `isAttending` is false, `attendingCount` should be 0

**Response (201 Created or 200 OK if updating):**
```json
{
  "success": true,
  "data": {
    "rsvp": {
      "id": "uuid",
      "isAttending": true,
      "attendingCount": 4,
      "eventsAttending": [
        {
          "id": "uuid",
          "name": "Haldi Ceremony"
        },
        {
          "id": "uuid",
          "name": "Wedding Ceremony"
        }
      ],
      "dietaryRestrictions": "2 vegetarian, 2 vegan",
      "message": "So happy to celebrate with you!",
      "respondedAt": "2026-11-06T13:46:44Z"
    }
  },
  "message": "RSVP submitted successfully"
}
```

**Errors:**
- `400`: Validation failed (e.g., attendingCount exceeds maxGuests)
- `403`: Invitation does not allow RSVP edits (after deadline)

---

### 37. Update RSVP (Guest)

**Endpoint:** `PUT /api/invite/:slug/:token/rsvp`  
**Auth:** Token in URL  
**Rate Limit:** 10 requests per hour per token

**Request Body:** (same as submit)
```json
{
  "isAttending": false,
  "attendingCount": 0,
  "message": "Sorry, can't make it anymore"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rsvp": {
      // Updated RSVP
    }
  },
  "message": "RSVP updated successfully"
}
```

**Errors:**
- `403`: Host has disabled RSVP editing

---

### 38. Track Invitation View (Analytics)

**Endpoint:** `POST /api/invite/:slug/:token/track`  
**Auth:** Token in URL

**Request Body:**
```json
{
  "action": "view" | "music_play" | "gallery_open" | "map_click",
  "metadata": {
    "userAgent": "...",
    "referrer": "whatsapp"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event tracked"
}
```

**Note:** Used for analytics (optional, privacy-conscious)

---

## 🛡️ ADMIN APIs

Admin APIs require admin authentication (separate from host auth).

---

### 39. Admin Login

**Endpoint:** `POST /api/admin/login`  
**Auth:** None  
**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin_password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "uuid",
      "username": "admin",
      "role": "super_admin"
    },
    "token": "admin_jwt_token"
  }
}
```

---

### 40. Platform Dashboard

**Endpoint:** `GET /api/admin/dashboard`  
**Auth:** Admin JWT required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 1250,
      "activeUsers": 890,
      "totalInvitations": 3456,
      "liveInvitations": 2340,
      "totalGuests": 456789,
      "totalRsvps": 389234,
      "revenue": {
        "total": 234567800, // in paise
        "thisMonth": 45678900,
        "subscriptions": 178900000,
        "themePurchases": 55667800
      },
      "subscriptions": {
        "free": 890,
        "pro": 300,
        "business": 60
      }
    },
    "growth": {
      "usersGrowth": 15.3, // % increase
      "invitationsGrowth": 23.5,
      "revenueGrowth": 18.7
    },
    "recentUsers": [
      // Last 10 sign-ups
    ]
  }
}
```

---

### 41. List All Users

**Endpoint:** `GET /api/admin/users`  
**Auth:** Admin JWT  
**Query Params:**
- `page`, `limit`
- `search` (email/name)
- `subscriptionTier` (free/pro/business)
- `role` (host/admin)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "name": "User Name",
        "subscriptionTier": "pro",
        "invitationCount": 5,
        "createdAt": "2026-10-01T00:00:00Z",
        "lastLoginAt": "2026-11-06T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1250,
      "totalPages": 25
    }
  }
}
```

---

### 42. Manage User Subscription (Admin)

**Endpoint:** `PATCH /api/admin/users/:userId/subscription`  
**Auth:** Admin JWT

**Request Body:**
```json
{
  "plan": "pro",
  "status": "active",
  "extendsUntil": "2027-12-31T23:59:59Z"
}
```

**Use Case:** Grant free trial, extend subscription, resolve payment issues

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      // Updated subscription
    }
  }
}
```

---

### 43. Platform Analytics

**Endpoint:** `GET /api/admin/analytics`  
**Auth:** Admin JWT  
**Query Params:**
- `period` (7d, 30d, 90d, 1y)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "timeline": [
      {
        "date": "2026-11-01",
        "newUsers": 45,
        "newInvitations": 78,
        "revenue": 1234500
      }
    ],
    "topThemes": [
      {
        "themeId": "uuid",
        "name": "Royal Maroon",
        "usageCount": 456,
        "purchases": 123
      }
    ],
    "eventTypeDistribution": {
      "wedding": 2340,
      "birthday": 789,
      "anniversary": 234,
      "corporate": 93
    }
  }
}
```

---

### 44. Audit Log

**Endpoint:** `GET /api/admin/audit-log`  
**Auth:** Admin JWT  
**Query Params:**
- `page`, `limit`
- `userId` (optional)
- `action` (optional)
- `startDate`, `endDate`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "userId": "uuid",
        "userName": "User Name",
        "action": "invitation_created",
        "resourceType": "invitation",
        "resourceId": "uuid",
        "details": {
          "title": "Rohan weds Priya"
        },
        "ipAddress": "192.168.1.1",
        "createdAt": "2026-11-06T13:46:44Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 45678
    }
  }
}
```

---

## 🌍 PUBLIC APIs (No Auth)

### 45. List Public Themes

**Endpoint:** `GET /api/public/themes`  
**Auth:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "themes": [
      {
        "id": "uuid",
        "name": "Royal Maroon",
        "category": "wedding",
        "previewImageUrl": "/themes/royal-maroon.jpg",
        "previewUrl": "/demo/royal-maroon",
        "priceTier": "premium",
        "priceAmount": 29900,
        "isFeatured": true
      }
    ]
  }
}
```

---

### 46. Get Pricing Plans

**Endpoint:** `GET /api/public/pricing`  
**Auth:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "free",
        "name": "Free",
        "price": 0,
        "currency": "INR",
        "billingCycle": null,
        "features": [
          "1 active invitation",
          "1 event per invitation",
          "50 guests maximum",
          "3 basic themes",
          "Standard RSVP tracking",
          "Watermark included"
        ],
        "limits": {
          "invitations": 1,
          "events": 1,
          "guests": 50,
          "media": 10
        }
      },
      {
        "id": "pro",
        "name": "Pro",
        "price": 99900, // ₹999
        "currency": "INR",
        "billingCycle": "yearly",
        "monthlyPrice": 19900, // ₹199/month
        "features": [
          "Unlimited invitations",
          "Unlimited events",
          "200 guests per invitation",
          "All premium themes",
          "No watermark",
          "Advanced analytics",
          "Email support"
        ],
        "limits": {
          "invitations": "unlimited",
          "events": "unlimited",
          "guests": 200,
          "media": "unlimited"
        },
        "popular": true
      },
      {
        "id": "business",
        "name": "Business",
        "price": 199900, // ₹1999
        "currency": "INR",
        "billingCycle": "yearly",
        "features": [
          "Everything in Pro",
          "Unlimited guests",
          "Custom domain",
          "White-label",
          "Priority support",
          "Team collaboration",
          "API access"
        ],
        "limits": {
          "invitations": "unlimited",
          "events": "unlimited",
          "guests": "unlimited",
          "media": "unlimited"
        }
      }
    ]
  }
}
```

---

### 47. Contact/Support

**Endpoint:** `POST /api/public/contact`  
**Auth:** None  
**Rate Limit:** 3 requests per hour per IP

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about Pro plan",
  "message": "I have a question...",
  "type": "sales" | "support" | "feedback"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Message sent successfully. We'll respond within 24 hours."
}
```

---

## 🔗 WEBHOOK APIs

### 48. Stripe Webhook

**Endpoint:** `POST /api/webhooks/stripe`  
**Auth:** Stripe signature verification  
**Content-Type:** `application/json`

**Events Handled:**
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Response (200 OK):**
```json
{
  "received": true
}
```

**Actions:**
- Update subscription status
- Create payment record
- Send confirmation email
- Update user tier

---

### 49. Razorpay Webhook

**Endpoint:** `POST /api/webhooks/razorpay`  
**Auth:** Razorpay signature verification

**Events Handled:**
- `payment.captured`
- `payment.failed`
- `subscription.charged`
- `subscription.cancelled`

**Response (200 OK):**
```json
{
  "received": true
}
```

---

## ⚠️ ERROR HANDLING

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  },
  "statusCode": 400
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE with no response body |
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (duplicate) |
| 422 | Unprocessable Entity | Semantic error (e.g., invalid state) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Server maintenance |

### Error Codes

```typescript
enum ErrorCode {
  // Auth errors
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  
  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  
  // Resource errors
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  CONFLICT = "CONFLICT",
  
  // Business logic errors
  SUBSCRIPTION_LIMIT_REACHED = "SUBSCRIPTION_LIMIT_REACHED",
  FEATURE_NOT_AVAILABLE = "FEATURE_NOT_AVAILABLE",
  GUEST_LIMIT_EXCEEDED = "GUEST_LIMIT_EXCEEDED",
  
  // Payment errors
  PAYMENT_FAILED = "PAYMENT_FAILED",
  INVALID_PAYMENT_METHOD = "INVALID_PAYMENT_METHOD",
  
  // System errors
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
}
```

---

## 🚦 RATE LIMITING

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699362804
```

### Rate Limit Response (429)

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 3 minutes.",
    "retryAfter": 180
  },
  "statusCode": 429
}
```

### Rate Limits by Endpoint Type

| Endpoint Type | Rate Limit | Window |
|---------------|------------|--------|
| Public (unauthenticated) | 100 requests | per hour per IP |
| Auth (login/signup) | 10 requests | per minute per IP |
| Host APIs | 1000 requests | per hour per user |
| Guest APIs | 100 requests | per hour per token |
| Admin APIs | 10000 requests | per hour per admin |
| Media Upload | 20 uploads | per hour per user |
| Webhooks | unlimited | N/A |

---

## 📊 RESPONSE FORMATS

### Success Response (List)

```json
{
  "success": true,
  "data": {
    "items": [ /* array of items */ ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### Success Response (Single Item)

```json
{
  "success": true,
  "data": {
    "item": { /* single object */ }
  },
  "message": "Operation successful" // optional
}
```

### Success Response (Action)

```json
{
  "success": true,
  "message": "Action completed successfully"
}
```

---

## 🔧 API VERSIONING

### Version in URL (Current)

```
https://api.yourdomain.com/v1/host/invitations
```

### Version in Header (Future)

```http
GET /host/invitations HTTP/1.1
Host: api.yourdomain.com
X-API-Version: 1.0
```

### Deprecation Notice

```json
{
  "success": true,
  "data": { /* ... */ },
  "deprecation": {
    "version": "1.0",
    "sunset": "2027-12-31",
    "message": "This endpoint will be deprecated. Please migrate to v2.",
    "migrationUrl": "https://docs.yourdomain.com/migration-v2"
  }
}
```

---

## 📚 ADDITIONAL DOCUMENTATION

### Authentication Flow Diagram

```
┌──────────┐                                  ┌──────────┐
│  Client  │                                  │  Server  │
└────┬─────┘                                  └────┬─────┘
     │                                             │
     │  POST /api/auth/login                      │
     │  { email, password }                       │
     ├────────────────────────────────────────────>
     │                                             │
     │              Verify Credentials             │
     │              Generate JWT                   │
     │              (access + refresh)             │
     │                                             │
     │  200 OK                                     │
     │  { user, tokens }                           │
     <────────────────────────────────────────────┤
     │                                             │
     │  Store tokens in:                           │
     │  - localStorage (access)                    │
     │  - httpOnly cookie (refresh)                │
     │                                             │
     │  GET /api/host/invitations                  │
     │  Authorization: Bearer {accessToken}        │
     ├────────────────────────────────────────────>
     │                                             │
     │              Verify JWT                     │
     │              Load user data                 │
     │                                             │
     │  200 OK                                     │
     │  { invitations }                            │
     <────────────────────────────────────────────┤
     │                                             │
     │  [Token expires after 1 hour]               │
     │                                             │
     │  POST /api/auth/refresh                     │
     │  { refreshToken }                           │
     ├────────────────────────────────────────────>
     │                                             │
     │              Verify refresh token           │
     │              Generate new access token      │
     │                                             │
     │  200 OK                                     │
     │  { accessToken }                            │
     <────────────────────────────────────────────┤
```

---

## ✅ API CHECKLIST

### Security
- [x] JWT authentication for hosts
- [x] Token-based access for guests (no login)
- [x] Admin authentication separate
- [x] HTTPS only in production
- [x] Rate limiting on all endpoints
- [x] Input validation with Zod
- [x] SQL injection prevention (Prisma)
- [x] XSS protection
- [x] CORS configuration
- [x] Webhook signature verification

### Performance
- [x] Pagination on all list endpoints
- [x] Database indexes on frequently queried fields
- [x] CDN for media assets
- [x] Response caching where appropriate
- [x] Optimized image delivery (WebP)
- [x] Async processing for bulk operations
- [x] Database connection pooling

### Monitoring
- [ ] Request logging
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic/Datadog)
- [ ] API analytics
- [ ] Uptime monitoring

### Documentation
- [x] Complete API specification
- [ ] OpenAPI/Swagger spec
- [ ] Postman collection
- [ ] Code examples
- [ ] Integration guides

---

**Status:** ✅ API specification complete  
**Next:** Design frontend architecture  
**Total Endpoints:** 49  
**Document Version:** 1.0  
**Last Updated:** November 6, 2026, 1:46 PM IST
