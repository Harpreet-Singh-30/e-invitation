# 10. UI/UX Design System & Luxury Viewport Specification

> **Document Version:** 1.0.0  
> **Author:** Senior UX Architect & Lead Frontend Designer  
> **Status:** Approved Baseline  
> **Target Device Focus:** Mobile Viewports (375px to 430px)

---

## 1. Design Philosophy: The Digital Unboxing Experience

Traditional event websites mimic desktop brochures, leading to awkward zooming and navigation on smartphones. InviteHub operates under a **Mobile-First Luxury Viewport Philosophy**:

1. **The Invitation as a Digital Gift:** Guests should feel the tactile pleasure of opening a luxury physical card. Every template incorporates realistic materials (matte paper textures, gold foil stamping, metallic sheen, velvet depth, and wax seals).
2. **Single-Thumb Ergonomics:** Key interactive touch targets (Open Seal, RSVP, View Schedule, Get Directions) are positioned within comfortable reach of the user's thumb on modern smartphones.
3. **Typography as Art:** Celebration invitations rely on dramatic typographical hierarchy. High-contrast pairings between regal display serifs and clean modern sans-serifs create an unmistakable luxury feel.

---

## 2. Luxury Viewport & Mobile Frame Specifications

To ensure pixel-perfect fidelity across varied devices, previewers (Template Preview, Host Customizer, and Admin Studio) render templates inside a realistic mobile mockup frame:

```
┌───────────────────────────────────────────────┐
│              [Dynamic Island / Speaker]       │
│ ┌───────────────────────────────────────────┐ │
│ │                                           │ │
│ │             WAX SEAL GATE                 │ │
│ │                                           │ │
│ │                  ( ☬ )                    │ │
│ │           TAP TO UNSEAL INVITATION        │ │
│ │                                           │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│             [375px x 812px iPhone Frame]      │
└───────────────────────────────────────────────┘
```

* **Physical Simulation Dimensions:** 375px width by 812px height (CSS pixels), scaled smoothly on larger screens.
* **Aspect Ratio:** Fixed 9:19.5 with rounded corners (`rounded-[40px]`), inner border bevels, and subtle ambient drop shadows (`shadow-2xl`).

---

## 3. Typography Hierarchy & Pairings

InviteHub integrates Google Fonts loaded via high-performance webfont link headers:

| Pairing Aesthetic | Heading Display Font | Body Text Font | Use Case |
|---|---|---|---|
| **Royal Heritage** | *Cinzel Decorative* (Serif, 700) | *Montserrat* (Sans-serif, 400/500) | North Indian weddings, Rajput palace events, royal celebrations |
| **Romantic Elegance** | *Cormorant Garamond* (Serif, 600) | *Inter* (Sans-serif, 400) | Botanical weddings, destination beach soirees, anniversaries |
| **Gatsby Glamour** | *Playfair Display* (Serif, 700) | *Lato* (Sans-serif, 400) | Art deco cocktail parties, 30th/50th milestone birthdays |
| **Modern Chic** | *Syne* / *Outfit* (Geometric, 700) | *Plus Jakarta Sans* (Sans, 400) | Contemporary receptions, baby showers, rooftop galas |

---

## 4. Color Tokens & Aesthetic Themes

Every theme implements standardized CSS variable tokens:

```css
:root {
  --color-primary: #800000;    /* Deep Royal Maroon */
  --color-secondary: #D4AF37;  /* Metallic Antique Gold */
  --color-accent: #FFF8E7;     /* Warm Ivory Champagne */
  --color-background: #0A0A0A; /* Moody Midnight Velvet */
  --color-text: #F5F5F5;       /* Crisp High-Contrast White */
}
```

### Signature Palette Presets
1. **Royal Maroon & Gold:** `#800000` (Maroon), `#D4AF37` (Gold), `#FFF8E7` (Ivory).
2. **Imperial Burgundy:** `#4A0E17` (Deep Burgundy), `#E2C974` (Pale Gold), `#1A0508` (Dark Background).
3. **Coastal Pearl:** `#1B4965` (Oceanic Deep Teal), `#E8D8C8` (Warm Sand), `#BEE9E8` (Seafoam Accent).
4. **Phulkari Festive:** `#880E4F` (Magenta), `#F57F17` (Marigold Yellow), `#FFD54F` (Bright Gold).
5. **Midnight Starlight:** `#0B132B` (Rich Navy), `#C0C0C0` (Silver Foil), `#FFFFFF` (Starlight White).

---

## 5. Micro-Interactions & Animation Guidelines

* **The Wax Seal Unboxing (`InteractiveSealedGate.tsx`):**
  * Initial State: Pulsing golden glow around the wax seal with subtle haptic tap cue ("Tap to Open").
  * Tap Event: Seal splits with rotational scale transform, ribbon slides horizontally away, envelope flaps unfold vertically with ease-out cubic-bezier easing (`transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1)`).
  * Audio Sync: Optional 1.2-second soft chime plays synchronously with the visual unsealing.
* **RSVP Confirmation:**
  * Successful form submission triggers a localized confetti explosion powered by `canvas-confetti`, followed by a personalized gratitude card.
* **Smooth Navigation:**
  * Floating bottom pill bar with smooth scroll triggers for `#schedule`, `#venue`, `#rsvp`, and `#gallery`.

---

## 6. Accessibility & Responsive Constraints

* **Contrast Ratios:** All primary text content must maintain a minimum contrast ratio of 4.5:1 against the underlying background card, verified via automated WCAG audits.
* **Tap Target Sizing:** All interactive buttons (RSVP submit, map link, music toggle) have a minimum touch footprint of 48px by 48px to prevent accidental taps on small mobile viewports.
* **Motion Sensitivity:** All complex page animations respect `prefers-reduced-motion: reduce`, providing instantaneous reveals for users with vestibular sensitivities.

