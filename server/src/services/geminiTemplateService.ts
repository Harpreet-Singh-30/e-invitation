export interface RefinePromptResult {
  refinedPrompt: string;
  creativeDirection: {
    mood: string;
    colorPaletteRecommendation: string[];
    typographyStyle: string;
    ornamentationNotes: string;
    recommendedArchetype: string;
  };
}

export interface GeneratedTemplateSpec {
  name: string;
  slug: string;
  category: string;
  description: string;
  templateComponent: string;
  tags: string[];
  priceTier: 'free' | 'standard' | 'premium';
  priceAmount: number;
  currency: string;
  isActive: boolean;
  isFeatured: boolean;
  previewImageUrl: string;
  previewUrl?: string;
  defaultColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  defaultFonts: {
    heading: string;
    body: string;
    accent: string;
  };
  features: string[];
  sampleData: {
    couple: {
      groom: string;
      bride: string;
      tagline: string;
    };
    welcomeMessage?: string;
    storyContent?: string;
    familyInfo?: string;
    events: Array<{
      name: string;
      date: string;
      time: string;
      venueName: string;
      venueAddress: string;
      dressCode?: string;
      description?: string;
    }>;
  };
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

// Resilient priority chain: primary -> 3.5 flash -> 3.5 flash-lite -> 3.1 flash-lite
const CANDIDATE_MODELS = Array.from(
  new Set([PRIMARY_MODEL, 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'])
);

/**
 * Robust Gemini API caller with automatic model fallback, retry on 503/429 spikes, and timeout protection
 */
async function callGemini(promptText: string, jsonMode: boolean = true): Promise<any> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in server environment');
  }

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const body: any = {
          contents: [{ parts: [{ text: promptText }] }],
        };

        if (jsonMode) {
          body.generationConfig = {
            responseMimeType: 'application/json',
            temperature: 0.7,
          };
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`[Gemini API Warning] Model ${model} (attempt ${attempt}) returned ${response.status}: ${errorText}`);

          // If high demand spike (503) or rate limit (429), back off or try next model
          if (response.status === 503 || response.status === 429) {
            lastError = new Error(`Gemini model ${model} temporarily unavailable (${response.status})`);
            if (attempt === 1) {
              await new Promise((r) => setTimeout(r, 1000));
              continue;
            }
            break; // Move to next model in fallback chain
          }

          // If 404 or unsupported, move immediately to next model
          if (response.status === 404 || response.status === 400) {
            lastError = new Error(`Gemini model ${model} returned ${response.status}: ${errorText}`);
            break;
          }

          throw new Error(`Gemini API error (${response.status}): ${errorText}`);
        }

        const data: any = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
          throw new Error(`No content returned from Gemini model ${model}`);
        }

        if (jsonMode) {
          try {
            return JSON.parse(rawText);
          } catch (e: any) {
            const cleaned = rawText.replace(/```(?:json)?/g, '').trim();
            return JSON.parse(cleaned);
          }
        }

        return rawText;
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini Request Exception] Model: ${model}, Attempt: ${attempt}, Reason: ${err.message}`);
        if (err.name === 'AbortError') {
          console.warn(`[Gemini Timeout] Model ${model} timed out after 20s, advancing to next candidate model`);
          break;
        }
      }
    }
  }

  throw lastError || new Error('All Gemini candidate models are momentarily busy. Please try again.');
}

/**
 * Step 1: Refine the raw admin prompt into an enriched design brief
 */
export async function refineAdminPrompt(
  rawPrompt: string,
  category: string = 'wedding'
): Promise<RefinePromptResult> {
  try {
    const prompt = `You are a world-class luxury digital invitation art director and UI/UX design expert for InviteHub.
The administrator wants to create a new invitation template with this raw idea:
"${rawPrompt}"
(Event Category: "${category}")

Step 1: Refine, expand, and structure this prompt into a rich, professional design brief tailored for high-end digital invitation websites.

Return a JSON object matching this schema:
{
  "refinedPrompt": "A comprehensive 2-3 paragraph detailed design brief explaining the mood, aesthetic heritage, visual ornaments, color rationale, typography pairings, and interaction rhythm for this template.",
  "creativeDirection": {
    "mood": "Short phrase describing the emotional vibe (e.g. 'Royal Rajputana Splendour, Opulent & Ceremonial')",
    "colorPaletteRecommendation": ["Hex codes and color names, e.g. '#600020 (Imperial Maroon)', '#D4AF37 (Antique Gold)'"],
    "typographyStyle": "Font pairing recommendation (e.g. 'Cinzel / Cormorant Garamond / Great Vibes')",
    "ornamentationNotes": "Specific motifs, divider styles, and borders (e.g. 'Jali archways, floral borders, gold foil hairlines')",
    "recommendedArchetype": "Select the best matching archetype from: ImperialBurgundyTemplate (Royal Indian Palace, Wax Seal, Mandalas, Velvet & Gold), MidnightVowsTemplate (Starlight, Moonlit Navy, Dark Plum, Celestial Elegance), BotanicalRomanceTemplate (Garden, Floral, Romantic Pastels), MarigoldCourtyardTemplate (Festive Haldi, Sangeet, Marigold, Terracotta), IvoryKayalTemplate (South Indian, Temple, Jasmine & Ivory Gold), PhulkariCelebrationTemplate (Punjabi, Vibrant Sangeet, Embroidery), CoastalPearlTemplate (Beach, Coastal, Waves), ArtDecoNoirTemplate (Gatsby, Black & Gold, Geometric), GoldenMilestoneTemplate (Birthday, Glamour), CelestialLullabyTemplate (Baby Shower), HearthHeritageTemplate (Housewarming), MidnightSoireeTemplate (Party, Neon), DivyaMandapTemplate (Puja, Sacred), HeritageReunionTemplate (Family Reunion), AuraGrandGalaTemplate (Black-Tie Gala Honors)"
  }
}`;

    return await callGemini(prompt, true);
  } catch (err: any) {
    console.warn('[Gemini Refine Fallback] Using heuristic design brief due to AI capacity spike:', err.message);
    return generateFallbackDesignBrief(rawPrompt, category);
  }
}

/**
 * Step 2: Generate complete template specification and sample data from the refined prompt
 */
export async function generateTemplateFromRefinedPrompt(
  refinedPrompt: string,
  category: string = 'wedding',
  originalPrompt: string = ''
): Promise<{ template: GeneratedTemplateSpec; refinedPrompt: string; isFallback?: boolean }> {
  try {
    const prompt = `You are the lead architect of the InviteHub Digital Invitation platform.
Based on this design brief:
"${refinedPrompt}"
(Original User Idea: "${originalPrompt}", Category: "${category}")

Generate a complete, fully functional, production-ready InviteHub theme manifest JSON object conforming strictly to this format:

{
  "name": "Evocative Theme Name (e.g. 'Royal Udaipur Lake Palace')",
  "slug": "url-safe-kebab-case-slug (e.g. 'royal-udaipur-lake-palace')",
  "category": "${category}",
  "description": "Engaging 1-2 sentence description highlighting the ambiance, aesthetic elements, and style of this invitation.",
  "templateComponent": "Must be one of the concrete React archetypes: ImperialBurgundyTemplate, MidnightVowsTemplate, BotanicalRomanceTemplate, MarigoldCourtyardTemplate, IvoryKayalTemplate, PhulkariCelebrationTemplate, CoastalPearlTemplate, ArtDecoNoirTemplate, GoldenMilestoneTemplate, SilverJubileeTemplate, CelestialLullabyTemplate, HearthHeritageTemplate, MidnightSoireeTemplate, DivyaMandapTemplate, HeritageReunionTemplate, AuraGrandGalaTemplate (For wedding themes, choose between ImperialBurgundyTemplate, MidnightVowsTemplate, BotanicalRomanceTemplate, MarigoldCourtyardTemplate, IvoryKayalTemplate, PhulkariCelebrationTemplate, CoastalPearlTemplate, or ArtDecoNoirTemplate)",
  "tags": ["relevant", "search", "tags", "maximum 6"],
  "priceTier": "premium",
  "priceAmount": 49900,
  "currency": "INR",
  "isActive": true,
  "isFeatured": true,
  "previewImageUrl": "/templates/preview-placeholder.jpg",
  "defaultColors": {
    "primary": "#HEX",
    "secondary": "#HEX",
    "accent": "#HEX",
    "background": "#HEX",
    "surface": "#HEX",
    "text": "#HEX"
  },
  "defaultFonts": {
    "heading": "Cinzel",
    "body": "Cormorant Garamond",
    "accent": "Great Vibes"
  },
  "features": [
    "countdown_timer",
    "interactive_rsvp",
    "multi_event_timeline",
    "google_maps_directions",
    "audio_player",
    "family_blessings"
  ],
  "sampleData": {
    "couple": {
      "groom": "Groom Name (or Honoree Name)",
      "bride": "Bride Name (or Partner/Co-host)",
      "tagline": "Two souls, one sacred eternal journey"
    },
    "welcomeMessage": "Bespoke warm welcome message inviting guests to this special celebration.",
    "storyContent": "A romantic or memorable narrative paragraph celebrating their story.",
    "familyInfo": "With the divine blessings of our ancestors and parents.",
    "events": [
      {
        "name": "Event 1 Name",
        "date": "2027-02-15",
        "time": "10:00 AM",
        "venueName": "Venue Name",
        "venueAddress": "City, State, Country",
        "dressCode": "Traditional Festive Formal",
        "description": "Short note about the ceremony rituals or entertainment."
      },
      {
        "name": "Event 2 Name (Main Ceremony)",
        "date": "2027-02-16",
        "time": "06:30 PM",
        "venueName": "Main Grand Palace Hall",
        "venueAddress": "City, State, Country",
        "dressCode": "Royal Evening Attire",
        "description": "Sacred vows and celebratory dinner feast."
      }
    ]
  }
}

Ensure all hex colors are harmonious, accessible with good contrast, and match the requested theme.`;

    const template = await callGemini(prompt, true);
    return { template, refinedPrompt };
  } catch (err: any) {
    console.warn('[Gemini Generate Fallback] Generating heuristic template due to AI capacity spike:', err.message);
    const fallbackTemplate = generateFallbackTemplate(originalPrompt || refinedPrompt, category);
    return { template: fallbackTemplate, refinedPrompt, isFallback: true };
  }
}

/**
 * Step 3: Adjust template based on admin feedback
 */
export async function adjustTemplateWithFeedback(
  currentTemplate: GeneratedTemplateSpec,
  feedback: string
): Promise<{ updatedTemplate: GeneratedTemplateSpec; changesSummary: string }> {
  try {
    const prompt = `You are a digital invitation design assistant for InviteHub.
The administrator wants adjustments made to this existing template manifest:

Current Template:
${JSON.stringify(currentTemplate, null, 2)}

Administrator's Requested Adjustments:
"${feedback}"

Apply the requested changes intelligently. Preserve all other fields and structure.
Return a JSON object with:
{
  "updatedTemplate": <the complete updated template manifest>,
  "changesSummary": "Concise bulleted summary of what was updated (e.g. 'Updated primary color to emerald green #0A5C36, switched heading font to Playfair Display, and revised event dates')."
}`;

    return await callGemini(prompt, true);
  } catch (err: any) {
    console.warn('[Gemini Adjust Fallback] Applying heuristic adjustments:', err.message);
    // Simple heuristic updater if Google AI is completely unavailable
    const updated = JSON.parse(JSON.stringify(currentTemplate));
    const lower = feedback.toLowerCase();
    if (lower.includes('free')) {
      updated.priceTier = 'free';
      updated.priceAmount = 0;
    } else if (lower.includes('gold')) {
      updated.defaultColors.primary = '#D4AF37';
      updated.defaultColors.accent = '#FFD700';
    } else if (lower.includes('blue') || lower.includes('navy')) {
      updated.defaultColors.primary = '#1E3A8A';
      updated.defaultColors.background = '#0B1120';
    } else if (lower.includes('green') || lower.includes('emerald')) {
      updated.defaultColors.primary = '#065F46';
      updated.defaultColors.accent = '#10B981';
    }
    return {
      updatedTemplate: updated,
      changesSummary: `Applied adjustments based on instructions: "${feedback.slice(0, 100)}"`,
    };
  }
}

/**
 * Heuristic fallback design brief generator in case of total upstream Gemini API downtime
 */
function generateFallbackDesignBrief(prompt: string, category: string): RefinePromptResult {
  const cleanTitle = prompt
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .slice(0, 5)
    .join(' ')
    .trim() || `${category.charAt(0).toUpperCase() + category.slice(1)} Elegance`;

  return {
    refinedPrompt: `An exquisite and opulent ${category} celebration design brief crafted around "${cleanTitle}". Features bespoke visual elements, deep rich color palettes with gold accents, balanced editorial serif typography, and an interactive itinerary suited for discerning hosts.`,
    creativeDirection: {
      mood: 'Regal, Celebratory & Harmonious',
      colorPaletteRecommendation: ['#800020 (Burgundy)', '#D4AF37 (Warm Gold)', '#0F172A (Midnight)', '#F8FAFC (Ivory)'],
      typographyStyle: 'Cinzel / Cormorant Garamond / Great Vibes',
      ornamentationNotes: 'Ornate corner flourishes, delicate gold border divider lines, and elegant royal archways.',
      recommendedArchetype: 'ImperialBurgundyTemplate',
    },
  };
}

/**
 * Heuristic fallback template manifest generator in case of total upstream Gemini API downtime
 */
function generateFallbackTemplate(prompt: string, category: string): GeneratedTemplateSpec {
  const words = prompt
    .replace(/[^\w\s-]/gi, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 4);

  const rawTitle = words.length > 0
    ? words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : `${category.charAt(0).toUpperCase() + category.slice(1)} Celebration`;

  const slug = rawTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'bespoke-celebration';

  // Smart archetype match
  let archetype = 'ImperialBurgundyTemplate';
  let primary = '#7A1C30';
  let accent = '#D4AF37';
  let background = '#0B0F19';

  const lower = prompt.toLowerCase();
  if (lower.includes('botanical') || lower.includes('flower') || lower.includes('garden') || lower.includes('floral')) {
    archetype = 'BotanicalRomanceTemplate';
    primary = '#2D6A4F';
    accent = '#D8B4E2';
    background = '#0F1A15';
  } else if (lower.includes('retro') || lower.includes('arcade') || lower.includes('neon') || lower.includes('80s')) {
    archetype = 'ArtDecoNoirTemplate';
    primary = '#EC4899';
    accent = '#06B6D4';
    background = '#09090B';
  } else if (lower.includes('coastal') || lower.includes('beach') || lower.includes('pearl')) {
    archetype = 'CoastalPearlTemplate';
    primary = '#0284C7';
    accent = '#FDE047';
    background = '#082F49';
  } else if (lower.includes('phulkari') || lower.includes('punjabi') || lower.includes('sangeet')) {
    archetype = 'PhulkariCelebrationTemplate';
    primary = '#DC2626';
    accent = '#F59E0B';
    background = '#18181B';
  }

  return {
    name: rawTitle,
    slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
    category,
    description: `A stunning, high-definition digital invitation suite with tailored visual aesthetics and interactive guest experience.`,
    templateComponent: archetype,
    tags: [category, 'celebration', 'luxury', 'digital-invitation', 'interactive'],
    priceTier: 'premium',
    priceAmount: 49900,
    currency: 'INR',
    isActive: true,
    isFeatured: true,
    previewImageUrl: '/templates/preview-placeholder.jpg',
    defaultColors: {
      primary,
      secondary: '#475569',
      accent,
      background,
      surface: '#1E293B',
      text: '#F8FAFC',
    },
    defaultFonts: {
      heading: 'Cinzel',
      body: 'Cormorant Garamond',
      accent: 'Great Vibes',
    },
    features: [
      'countdown_timer',
      'interactive_rsvp',
      'multi_event_timeline',
      'google_maps_directions',
      'audio_player',
      'family_blessings',
    ],
    sampleData: {
      couple: {
        groom: 'Kabir Verma',
        bride: 'Ananya Sharma',
        tagline: 'Two Souls, One Sacred Journey',
      },
      welcomeMessage: 'We warmly welcome you to celebrate love, laughter, and lifelong memories with our families.',
      storyContent: 'From a shared glance to a lifetime of adventures, we invite you to be part of our most treasured day.',
      familyInfo: 'With the gracious blessings of our loving parents and elders.',
      events: [
        {
          name: 'Welcome Soirée & Sangeet',
          date: '2027-02-14',
          time: '06:00 PM',
          venueName: 'The Royal Courtyard',
          venueAddress: 'Palace Road, Jaipur, Rajasthan',
          dressCode: 'Indo-Western Glitz',
          description: 'An evening of music, dance performances, and traditional feast.',
        },
        {
          name: 'The Sacred Auspicious Wedding',
          date: '2027-02-15',
          time: '11:00 AM',
          venueName: 'Grand Heritage Pavilion',
          venueAddress: 'Palace Road, Jaipur, Rajasthan',
          dressCode: 'Royal Traditional Formal',
          description: 'Auspicious wedding ceremony followed by a celebratory royal luncheon banquet.',
        },
      ],
    },
  };
}
