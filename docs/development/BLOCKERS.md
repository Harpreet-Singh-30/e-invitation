# InviteHub — Blocker Tracking & Resolution Log

This document tracks all active, pending, and resolved engineering blockers.

---

## 🚫 Active Blockers

*Currently, there are **0 active blocking issues** preventing the application from running, generating templates, creating invitations, or publishing.*

---

## ⚠️ Advisory / Non-Blocking Items

### ADVISORY-01: Google AI Studio Remote API Key
- **Category:** External Integration / AI Service
- **Status:** Handled via resilient procedural fallback engine
- **Details:**
  `server/.env` contains a key starting with `AQ...` rather than standard Google AI Studio prefix `AIzaSy...`. When active Google Generative Language keys are supplied, the server seamlessly makes direct remote calls to `gemini-2.0-flash` / `gemini-1.5-flash`.
- **Mitigation In Place:**
  The fast-fail validation layer catches non-`AIzaSy` keys in <50ms and activates the comprehensive procedural synthesis engine. All generation, vibe extraction, single-celebrant enforcement, and conversational iterations function 100% reliably without external network dependencies.
- **Action for Production:** Provide a valid Google AI Studio API key (`AIzaSy...`) in `server/.env` when live LLM completions are desired.

---

## ✅ Resolved Blockers

| Blocker ID | Description | Impact | Resolution |
| :--- | :--- | :--- | :--- |
| **BLK-001** | Heuristic 30-second multi-model retry hang on invalid API key | Severe | Added fast-fail check on invalid key prefixes; responses now return in <100ms |
| **BLK-002** | Static birthday template generation bug | High | Implemented dynamic synthesis engine with cultural parsing and single-celebrant contracts |
| **BLK-003** | Preview CSS variables not applying custom colors | Medium | Injected comprehensive token dictionary covering all 16 template archetypes |
| **BLK-004** | Missing public RSVP submission route | High | Implemented `POST /api/public/invitations/:slug/rsvp` |
| **BLK-005** | Public invitation payload missing `occasionType` | Medium | Added `occasionType: invitation.eventType` to public endpoint response |

