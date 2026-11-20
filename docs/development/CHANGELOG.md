# InviteHub — Engineering Changelog

All notable changes and technical modifications made to InviteHub are documented in this file.

---

## [Unreleased] — 2026-11-17

### Added
- **Dynamic Generative Design Engine** in `server/src/services/geminiTemplateService.ts`:
  - Contextual prompt parsing for cultural and geographic aesthetics (Punjabi, Goan beach, Retro 80s arcade, Royal heritage, Floral garden).
  - Archetype matching for all 16 registered template components.
  - Contextual dynamic itinerary generation with realistic timings, locations, and descriptions.
  - Multi-clause conversational feedback handler for color palettes, honoree renames, taglines, event additions, and pricing tiers.
- **Public Guest RSVP API** in `server/src/routes/publicInvitations.ts`:
  - `POST /api/public/invitations/:slug/rsvp` supporting guest headcount, dietary preferences, attendance status, and congratulatory messages.
- **Occasion-Aware Public Payload**:
  - `GET /api/public/invitations/:slug` now returns both `eventType` and `occasionType`.
  - `GET /api/public/themes` and `GET /api/public/themes/:slug` now unpack `sampleData` from `defaultColors.sampleData`.
- **Comprehensive CSS Token Injections**:
  - `web/src/pages/admin/TemplateStudio.tsx`: Injected full token dictionary into `previewCustomStyle` (`--burg`, `--wine`, `--gold`, `--deep`, `--cream`, `--ih-teal`, `--ih-sand`, etc.).
  - `web/src/pages/TemplatePreview.tsx`: Injected matching token dictionary into `dynamicPreviewStyles`.

### Changed
- `web/src/templates/adapter.ts`:
  - `extractCoupleNames()` refactored to be occasion-aware. For non-couple occasions (`birthday`, `party`, `baby_shower`, `housewarming`), `bride` defaults strictly to `''` instead of `'Bride'`.
  - Added `occasionType` field to `TemplateData` interface.
  - Added occasion-aware fallback titles and taglines for single celebrants.
- `web/src/pages/admin/TemplateStudio.tsx`:
  - Fixed `adaptedPreviewData` to strictly enforce `bride: ''` for non-couple occasions.
  - Enabled dynamic `previewKey` updates on manual property edits (archetype selection, event addition/removal, celebrant renaming).
  - Improved `handleSaveToCatalog` to track saved `theme.id` to prevent duplicate slug conflict errors on sequential saves.
- `web/src/pages/TemplatePreview.tsx`:
  - Updated to read `dbTheme.sampleData` or `dbTheme.defaultColors.sampleData` for custom themes.
  - Passed `occasionType` to template renderers.

### Fixed
- **BUG-001:** Single celebrant templates rendering wedding titles and bride labels.
- **BUG-002:** Static generation and 30-second retry hangs on invalid API keys.
- **BUG-003:** Live preview mockups failing to reflect custom color tokens.
- **BUG-004:** Template catalog previews ignoring saved sample data.
- **BUG-005:** 404 error on public RSVP submission.
- **BUG-006:** Undefined `occasionType` in public invitation API response.

