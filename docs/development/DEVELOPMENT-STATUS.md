# InviteHub — Current Development & Architectural Status

**Report Timestamp:** 2026-11-17  
**Branch:** `main`  
**TypeScript Status:**  
- `server`: ✅ 0 Errors (`npx tsc --noEmit` PASS)  
- `web`: ✅ 0 Errors (`npx tsc --noEmit` PASS)  

---

## 1. Architectural Overview

```
                      ┌───────────────────────────────────────────────┐
                      │              InviteHub Frontend               │
                      │  React 18 + Vite + Tailwind CSS + Lucide UI   │
                      └──────────────────────┬────────────────────────┘
                                             │ REST API (Bearer JWT)
                                             ▼
                      ┌───────────────────────────────────────────────┐
                      │              InviteHub Backend                │
                      │        Node.js + Express + TypeScript         │
                      └──────────────┬────────────────┬───────────────┘
                                     │                │
                        Prisma Client│                │Google Generative Language API
                                     ▼                ▼
                      ┌──────────────────┐    ┌─────────────────────────┐
                      │    PostgreSQL    │    │ Gemini 2.0 / Procedural │
                      │  Invitations,    │    │ Synthesis Design Engine │
                      │  Themes, RSVPs   │    └─────────────────────────┘
                      └──────────────────┘
```

---

## 2. Component Health Matrix

| Layer / Module | Component | Health | Notes |
| :--- | :--- | :---: | :--- |
| **Admin** | Template Studio (`/admin/studio`) | 🟢 Healthy | Product interface, prompt generation, conversational adjustments, live mobile/desktop frames, catalog save |
| **Admin** | Dashboard (`/admin/dashboard`) | 🟢 Healthy | Metrics, quick navigation, theme management |
| **Host** | Invitation Creation Wizard (`/invitations/new`) | 🟢 Healthy | Occasion-based selection, title validation, theme preselection |
| **Host** | Invitation Editor (`/invitations/:id/edit`) | 🟢 Healthy | Dynamic labels per occasion type, live preview, event itinerary manager |
| **Host** | Payment & Publish Modal | 🟢 Healthy | Simulated gateway (`POST /api/host/invitations/:id/pay`), instant publication |
| **Public / Guest** | Template Gallery (`/templates`) | 🟢 Healthy | Category filtering, live bespoke previews |
| **Public / Guest** | Live Invitation View (`/i/:slug`) | 🟢 Healthy | Animated gate, countdown, music player, responsive hero, interactive RSVP |
| **Backend** | Auth Service (`/api/auth/*`) | 🟢 Healthy | JWT access/refresh rotation, role-based authorization |
| **Backend** | Generative Service (`/api/admin/ai/*`) | 🟢 Healthy | Fail-fast validation, prompt parsing, archetype matching, procedural fallback |
| **Backend** | Public Invitations API | 🟢 Healthy | Unpacks sample data, returns `occasionType`, handles guest RSVPs |

---

## 3. Template Archetypes Inventory

The system maintains 16 distinct archetype implementations registered in `web/src/templates/catalog.tsx`:

1. `ImperialBurgundyTemplate` — Grand Palace, Royal Heritage (Wedding)
2. `BotanicalRomanceTemplate` — Floral, Garden, Rustic (Wedding)
3. `ArtDecoNoirTemplate` — 1920s Gatsby, Dark Obsidian Gold (Wedding/Gala)
4. `PhulkariCelebrationTemplate` — Vibrant Cross-stitch Embroidery (Punjabi / Festive)
5. `CoastalPearlTemplate` — Ocean Waves, Pearl, Island Vibe (Goan Beach / Coastal)
6. `GoldenMilestoneTemplate` — Velvet Obsidian, Champagne Gold (Milestone Birthday)
7. `RetroSynthArcadeTemplate` — 80s Cyber Neon, Pixel Art (Birthday / Retro)
8. `SilverJubileeTemplate` — Polished Sterling, Heritage Elegance (Anniversary)
9. `CelestialLullabyTemplate` — Pastel Clouds, Moon & Starlight (Baby Shower)
10. `HearthHeritageTemplate` — Terracotta, Brass Diya (Housewarming)
11. `MidnightSoireeTemplate` — Ultraviolet Neon, VIP Pass (Rooftop Party)
12. `TropicalSunsetLuauTemplate` — Beach Party, Tiki Sundowner (Party)
13. `PoolsideSunDrenchedBashTemplate` — Palm Springs, Poolside & Sun Lounge (Party)
14. `DivyaMandapTemplate` — Vedic Saffron, Glowing Diyas (Religious Ceremony)
15. `HeritageReunionTemplate` — Royal Emerald, Banyan Crest (Family Celebration)
16. `AuraGrandGalaTemplate` — Sapphire Black-Tie, Honors Night (Awards / Gala)

