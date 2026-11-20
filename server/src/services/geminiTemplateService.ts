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

// Priority order: active, high-throughput Gemini models
const CANDIDATE_MODELS = Array.from(
  new Set([
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  ])
);

/**
 * Robust Gemini API caller with automatic model fallback, retry on 503/429 spikes, and timeout protection
 */
async function callGemini(promptText: string, jsonMode: boolean = true): Promise<any> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in server environment');
  }

  // Google AI Studio API keys always begin with "AIzaSy"
  if (!GEMINI_API_KEY.startsWith('AIzaSy')) {
    throw new Error('Configured GEMINI_API_KEY is not an active Google AI Studio key (expected AIzaSy... prefix). Using dynamic generative design engine.');
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
        const timeoutId = setTimeout(() => controller.abort(), 12000);

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

          // If invalid API key, fail fast immediately to avoid 30s timeout across candidate models
          if (response.status === 400 || errorText.includes('API_KEY_INVALID')) {
            throw new Error(`Gemini API key is invalid or unauthorized: ${errorText}`);
          }

          // If high demand spike (503), rate limit (429), or 404, move immediately to next model
          if (response.status === 503 || response.status === 429 || response.status === 404) {
            lastError = new Error(`Gemini model ${model} temporarily unavailable (${response.status})`);
            break; // Move to next model immediately
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
    const isSingleCelebrant = !['wedding', 'anniversary'].includes(category.toLowerCase());
    const prompt = `You are the lead architect of the InviteHub Digital Invitation platform.
Based on this design brief:
"${refinedPrompt}"
(Original User Idea: "${originalPrompt}", Category: "${category}")

STRICT THEMATIC & CULTURAL ADHERENCE:
- Your generated theme name, slug, color palette, tagline, and itinerary events MUST faithfully reflect the cultural, regional, aesthetic, and thematic specifics of the user's idea ("${originalPrompt}").
- If the prompt specifies "punjabi", "sikh", or "bhangra": Use PhulkariCelebrationTemplate, vibrant mustard yellow (#D97706), crimson red (#DC2626), golden amber (#FBBF24), deep royal purple (#1E1B4B), and authentic Punjabi events (e.g., Live Dhol Welcome, Bhangra & Sangeet Night, Royal Punjabi Feast) with authentic names (e.g. Harpreet Singh).
- If the prompt specifies "retro", "80s", or "arcade": Use RetroSynthArcadeTemplate with neon cyan, hot magenta, and retro synthwave themes.
- If the prompt specifies "coastal", "beach", or "goa": Use CoastalPearlTemplate with ocean blues, sand gold, and beachside sundowner themes.
- If the prompt specifies "milestone", "gold", or "glam": Use GoldenMilestoneTemplate with obsidian black and warm champagne gold.
- If the prompt specifies "royal", "palace", or "traditional": Use ImperialBurgundyTemplate or MarigoldCourtyardTemplate.

IMPORTANT RULES FOR CATEGORY "${category}":
- If Category is "birthday": The celebrant/honoree is a single person. Set "groom" to the Birthday Person's Name matching the culture/theme of the prompt. "bride" MUST BE an empty string "". Set "tagline" to an inspiring milestone birthday slogan matching the exact vibe. Events MUST BE authentic birthday celebration events customized to the requested theme.
- If Category is "baby_shower": Set "groom" to Parents-to-be or Mother-to-be. "bride" MUST BE an empty string "". Tagline must be baby celebration theme. Recommended archetype: CelestialLullabyTemplate.
- If Category is "housewarming": Set "groom" to the Family Name or Homeowners (e.g. "The Sharma Family"). "bride" MUST BE an empty string "". Tagline must be house blessing. Recommended archetype: HearthHeritageTemplate.
- If Category is "party": Set "groom" to Party Name or Host. "bride" MUST BE an empty string "". Tagline must be party vibe. Recommended archetypes: MidnightSoireeTemplate, CoastalPearlTemplate, ArtDecoNoirTemplate.
- If Category is "wedding" or "anniversary": Set "groom" to Partner 1 and "bride" to Partner 2.

Generate a complete, fully functional, production-ready InviteHub theme manifest JSON object conforming strictly to this format:

{
  "name": "Evocative Theme Name matching the user's exact theme and culture",
  "slug": "url-safe-kebab-case-slug",
  "category": "${category}",
  "description": "Engaging 1-2 sentence description highlighting the ambiance, aesthetic elements, and style of this invitation.",
  "templateComponent": "Must be one of the concrete React archetypes: ImperialBurgundyTemplate, MidnightVowsTemplate, BotanicalRomanceTemplate, MarigoldCourtyardTemplate, IvoryKayalTemplate, PhulkariCelebrationTemplate, CoastalPearlTemplate, ArtDecoNoirTemplate, GoldenMilestoneTemplate, SilverJubileeTemplate, CelestialLullabyTemplate, HearthHeritageTemplate, MidnightSoireeTemplate, DivyaMandapTemplate, HeritageReunionTemplate, AuraGrandGalaTemplate, RetroSynthArcadeTemplate",
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
    "audio_player"
  ],
  "sampleData": {
    "couple": {
      "groom": "${isSingleCelebrant ? 'Honoree / Host Name' : 'Groom / Partner 1'}",
      "bride": "${isSingleCelebrant ? '' : 'Bride / Partner 2'}",
      "tagline": "${isSingleCelebrant ? 'Inspiring celebration tagline' : 'Two souls, one sacred eternal journey'}"
    },
    "welcomeMessage": "Bespoke warm welcome message inviting guests to this special celebration.",
    "storyContent": "A memorable narrative paragraph celebrating their story or milestone.",
    "familyInfo": "With the gracious blessings of our loving family and elders.",
    "events": [
      {
        "name": "Event 1 Name",
        "date": "2027-03-12",
        "time": "05:30 PM",
        "venueName": "Venue Name",
        "venueAddress": "City, State, Country",
        "dressCode": "Festive Attire",
        "description": "Short note about the gathering."
      },
      {
        "name": "Event 2 Name (Main Celebration)",
        "date": "2027-03-12",
        "time": "08:00 PM",
        "venueName": "Main Celebration Hall",
        "venueAddress": "City, State, Country",
        "dressCode": "Evening Celebration",
        "description": "Celebration feast, music, and toasts."
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
    const updated: GeneratedTemplateSpec = JSON.parse(JSON.stringify(currentTemplate));
    const lower = feedback.toLowerCase();
    const changes: string[] = [];

    // 1. Archetype switching
    if (lower.includes('phulkari') || lower.includes('punjabi') || lower.includes('sikh') || lower.includes('bhangra')) {
      updated.templateComponent = 'PhulkariCelebrationTemplate';
      updated.defaultColors.primary = '#D97706';
      updated.defaultColors.secondary = '#DC2626';
      updated.defaultColors.accent = '#FBBF24';
      updated.defaultColors.background = '#1E1B4B';
      updated.defaultColors.surface = '#2E1065';
      updated.defaultColors.text = '#FFFFFF';
      changes.push('Switched archetype to Phulkari Celebration (Punjabi vibrant style)');
    } else if (lower.includes('coastal') || lower.includes('beach') || lower.includes('goa') || lower.includes('ocean') || lower.includes('pearl')) {
      updated.templateComponent = 'CoastalPearlTemplate';
      updated.defaultColors.primary = '#0284C7';
      updated.defaultColors.secondary = '#38BDF8';
      updated.defaultColors.accent = '#FDE047';
      updated.defaultColors.background = '#082F49';
      updated.defaultColors.surface = '#0C4A6E';
      updated.defaultColors.text = '#FFFFFF';
      changes.push('Switched archetype to Coastal Pearl (Goan Beach vibe)');
    } else if (lower.includes('golden') || lower.includes('milestone') || lower.includes('champagne')) {
      updated.templateComponent = 'GoldenMilestoneTemplate';
      updated.defaultColors.primary = '#D4AF37';
      updated.defaultColors.secondary = '#996515';
      updated.defaultColors.accent = '#FFD700';
      updated.defaultColors.background = '#0B0B0F';
      updated.defaultColors.surface = '#14141D';
      updated.defaultColors.text = '#E2E8F0';
      changes.push('Switched archetype to Golden Milestone (Luxury milestone celebration)');
    } else if (lower.includes('retro') || lower.includes('arcade') || lower.includes('neon') || lower.includes('synth') || lower.includes('80s')) {
      updated.templateComponent = 'RetroSynthArcadeTemplate';
      updated.defaultColors.primary = '#EC4899';
      updated.defaultColors.secondary = '#8B5CF6';
      updated.defaultColors.accent = '#06B6D4';
      updated.defaultColors.background = '#09090B';
      updated.defaultColors.surface = '#18181B';
      updated.defaultColors.text = '#F4F4F5';
      changes.push('Switched archetype to Retro Synth Arcade (80s Cyber Neon)');
    } else if (lower.includes('gatsby') || lower.includes('art deco') || lower.includes('speakeasy') || lower.includes('noir')) {
      updated.templateComponent = 'ArtDecoNoirTemplate';
      updated.defaultColors.primary = '#D4AF37';
      updated.defaultColors.secondary = '#C5A059';
      updated.defaultColors.accent = '#FFFFFF';
      updated.defaultColors.background = '#0A0A0A';
      updated.defaultColors.surface = '#171717';
      updated.defaultColors.text = '#FAFAFA';
      changes.push('Switched archetype to Art Deco Noir (1920s Gatsby Speakeasy)');
    } else if (lower.includes('imperial') || lower.includes('palace') || lower.includes('royal') || lower.includes('burgundy') || lower.includes('rajput')) {
      updated.templateComponent = 'ImperialBurgundyTemplate';
      updated.defaultColors.primary = '#7A1C30';
      updated.defaultColors.secondary = '#C2A649';
      updated.defaultColors.accent = '#D4AF37';
      updated.defaultColors.background = '#0B0F19';
      updated.defaultColors.surface = '#1A1118';
      updated.defaultColors.text = '#F8FAFC';
      changes.push('Switched archetype to Imperial Burgundy (Royal Palace heritage)');
    } else if (lower.includes('botanical') || lower.includes('floral') || lower.includes('garden') || lower.includes('rose')) {
      updated.templateComponent = 'BotanicalRomanceTemplate';
      updated.defaultColors.primary = '#2D6A4F';
      updated.defaultColors.secondary = '#52B788';
      updated.defaultColors.accent = '#E8A598';
      updated.defaultColors.background = '#0F1A15';
      updated.defaultColors.surface = '#1B2D24';
      updated.defaultColors.text = '#F1FAEE';
      changes.push('Switched archetype to Botanical Romance (Garden florals)');
    } else if (lower.includes('midnight') || lower.includes('starlight') || lower.includes('celestial vows')) {
      updated.templateComponent = 'MidnightVowsTemplate';
      updated.defaultColors.primary = '#4338CA';
      updated.defaultColors.secondary = '#818CF8';
      updated.defaultColors.accent = '#FCD34D';
      updated.defaultColors.background = '#030712';
      updated.defaultColors.surface = '#0F172A';
      updated.defaultColors.text = '#F8FAFC';
      changes.push('Switched archetype to Midnight Vows (Celestial Night)');
    }

    // 2. Color adjustments
    if (lower.includes('emerald') || lower.includes('forest green')) {
      updated.defaultColors.primary = '#065F46';
      updated.defaultColors.surface = '#022C22';
      if (lower.includes('gold')) {
        updated.defaultColors.accent = '#D4AF37';
        updated.defaultColors.secondary = '#F59E0B';
      }
      changes.push('Updated palette to Emerald Green & Gold');
    } else if (lower.includes('ruby') || lower.includes('maroon') || lower.includes('crimson')) {
      updated.defaultColors.primary = '#881337';
      updated.defaultColors.accent = '#D4AF37';
      changes.push('Updated palette to Ruby Crimson & Antique Gold');
    } else if (lower.includes('navy') || lower.includes('indigo') || lower.includes('royal blue')) {
      updated.defaultColors.primary = '#1E3A8A';
      updated.defaultColors.background = '#0B1120';
      updated.defaultColors.surface = '#172554';
      changes.push('Updated palette to Royal Navy & Indigo');
    } else if (lower.includes('pastel') || lower.includes('lavender') || lower.includes('blush')) {
      updated.defaultColors.primary = '#A855F7';
      updated.defaultColors.accent = '#F472B6';
      updated.defaultColors.background = '#FDF4FF';
      updated.defaultColors.surface = '#FFFFFF';
      updated.defaultColors.text = '#3B0764';
      changes.push('Updated palette to Soft Lavender & Pastel Blush');
    } else if (lower.includes('gold') && !lower.includes('emerald')) {
      updated.defaultColors.primary = '#D4AF37';
      updated.defaultColors.accent = '#FFD700';
      changes.push('Updated palette with Radiant Gold accents');
    }

    // 3. Name & Honoree updates
    const nameMatch = feedback.match(/(?:(?:rename|change|switch)\s+(?:the\s+)?(?:honoree|couple|groom|celebrant|names?)?(?:\s+to)?|honoree\s+(?:is|to)|named?\s+to?|names?\s+to|couple\s+to)\s+([A-Z][a-z]+(?:\s+(?:and|&)\s+[A-Z][a-z]+|\s+[A-Z][a-z]+)?)/i);
    if (nameMatch) {
      const rawNames = nameMatch[1];
      if (rawNames.includes('&') || rawNames.toLowerCase().includes(' and ')) {
        const parts = rawNames.split(/\s*(?:&|and)\s*/i);
        updated.sampleData.couple.groom = parts[0].trim();
        updated.sampleData.couple.bride = parts[1]?.trim() || '';
        changes.push(`Updated couple names to ${parts[0].trim()} & ${parts[1]?.trim() || ''}`);
      } else {
        updated.sampleData.couple.groom = rawNames.trim();
        if (updated.category !== 'wedding' && updated.category !== 'anniversary') {
          updated.sampleData.couple.bride = '';
        }
        changes.push(`Updated celebrant name to ${rawNames.trim()}`);
      }
    }

    // 4. Tagline updates
    const taglineMatch = feedback.match(/tagline\s+(?:to\s+)?["']?([^"'\n]+)["']?/i);
    if (taglineMatch && taglineMatch[1]) {
      updated.sampleData.couple.tagline = taglineMatch[1].trim();
      changes.push(`Updated tagline to: "${taglineMatch[1].trim()}"`);
    }

    // 5. Itinerary event addition
    if (lower.includes('add') && (lower.includes('event') || lower.includes('night') || lower.includes('party') || lower.includes('sangeet') || lower.includes('dinner'))) {
      let eventTitle = 'Celebration Gala';
      if (lower.includes('sangeet')) eventTitle = 'Sufi & Sangeet Night';
      else if (lower.includes('cocktail')) eventTitle = 'Sunset Cocktail Reception';
      else if (lower.includes('pool')) eventTitle = 'Poolside BBQ & Sun Lounge';
      else if (lower.includes('cake')) eventTitle = 'Midnight Cake Cutting & DJ Bash';

      updated.sampleData.events = updated.sampleData.events || [];
      updated.sampleData.events.push({
        name: eventTitle,
        date: updated.sampleData.events[0]?.date || '2027-04-15',
        time: '08:00 PM',
        venueName: 'The Grand Pavilion Terrace',
        venueAddress: 'Celebration Resort Grounds',
        dressCode: 'Evening Festive / Indo-Western',
        description: 'An unforgettable evening of live music, culinary delicacies, and dancing under the stars.',
      });
      changes.push(`Added new itinerary event: "${eventTitle}"`);
    }

    // 6. Pricing tier adjustments
    if (lower.includes('free tier') || lower.includes('make it free')) {
      updated.priceTier = 'free';
      updated.priceAmount = 0;
      changes.push('Updated price tier to Free Community');
    } else if (lower.includes('premium')) {
      updated.priceTier = 'premium';
      updated.priceAmount = 49900;
      changes.push('Updated price tier to Premium (₹499)');
    }

    const summary = changes.length > 0 ? changes.join('; ') : `Refined styling, typography, and layout for archetype ${updated.templateComponent}`;
    return {
      updatedTemplate: updated,
      changesSummary: summary,
    };
  }
}

/**
 * Heuristic design brief generator in case of total upstream Gemini API downtime
 */
function generateFallbackDesignBrief(prompt: string, category: string): RefinePromptResult {
  const cleanTitle = prompt
    .replace(/^(create|make|generate|design|build|add|draft)\s+(a|an|the)?\s*/i, '')
    .replace(/\b(template|invitation|suite|design|card)\b/gi, '')
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 4)
    .join(' ')
    .trim() || `${category.charAt(0).toUpperCase() + category.slice(1)} Grandeur`;

  return {
    refinedPrompt: `An exquisite, high-end digital invitation suite designed around "${cleanTitle}". Features bespoke cultural ornamentation, responsive interactive timeline schedules, rich color contrast typography, and cinematic ambient motion.`,
    creativeDirection: {
      mood: 'Prestigious, Emotional & Celebratory',
      colorPaletteRecommendation: ['#D4AF37 (Gold)', '#1E1B4B (Indigo)', '#F8FAFC (Ivory)'],
      typographyStyle: 'Cinzel / Cormorant Garamond / Great Vibes',
      ornamentationNotes: 'Flourished filigree dividers, interactive seals, and ambient gradients.',
      recommendedArchetype: 'PhulkariCelebrationTemplate',
    },
  };
}

/**
 * Comprehensive Dynamic Generative Design Engine
 * Creates rich, bespoke, cultural-aware template manifests tailored specifically to the prompt and category
 */
function generateFallbackTemplate(prompt: string, category: string = 'wedding'): GeneratedTemplateSpec {
  const lower = prompt.toLowerCase();
  const cat = category.toLowerCase();
  const isCoupleOccasion = ['wedding', 'anniversary'].includes(cat);

  // 1. Extract or determine clean evocative Title
  let rawTitle = prompt
    .replace(/^(create|make|generate|design|build|add|draft)\s+(a|an|the)?\s*/i, '')
    .replace(/\b(template|invitation|suite|design|card)\b/gi, '')
    .trim();

  // If title was stripped or empty, synthesize evocative title
  if (!rawTitle || rawTitle.length < 3) {
    if (lower.includes('goa') || lower.includes('beach')) rawTitle = 'Goan Coastal Sunset Soirée';
    else if (lower.includes('punjabi') || lower.includes('dhol')) rawTitle = 'Punjab Phulkari Royal Celebration';
    else if (lower.includes('retro') || lower.includes('arcade')) rawTitle = 'Retro Synthwave 80s Arcade Bash';
    else if (cat === 'birthday') rawTitle = 'Milestone Gold Birthday Gala';
    else if (cat === 'anniversary') rawTitle = 'Silver Jubilee Romance Gala';
    else if (cat === 'baby_shower') rawTitle = 'Celestial Starlight Baby Shower';
    else if (cat === 'housewarming') rawTitle = 'Auspicious Griha Pravesh Celebration';
    else if (cat === 'party') rawTitle = 'VIP Midnight Celebration Soirée';
    else rawTitle = 'Royal Heritage Wedding Suite';
  } else {
    // Capitalize properly
    rawTitle = rawTitle
      .split(' ')
      .filter(Boolean)
      .slice(0, 5)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  const slug = rawTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || `theme-${cat}`;

  // 2. Detect Honoree / Celebrant Name from prompt
  const nameMatch = prompt.match(/(?:for|honoring|celebrating|named?)\s+([A-Z][a-z]+(?:\s+(?:and|&)\s+[A-Z][a-z]+|\s+[A-Z][a-z]+)?)/i);
  let detectedGroom = '';
  let detectedBride = '';

  if (nameMatch) {
    const raw = nameMatch[1];
    if (raw.includes('&') || raw.toLowerCase().includes(' and ')) {
      const parts = raw.split(/\s*(?:&|and)\s*/i);
      detectedGroom = parts[0]?.trim() || '';
      detectedBride = parts[1]?.trim() || '';
    } else {
      detectedGroom = raw.trim();
    }
  }

  // 3. Archetype Selection, Palettes & Itinerary Generation
  let archetype = 'ImperialBurgundyTemplate';
  let primary = '#7A1C30';
  let secondary = '#C2A649';
  let accent = '#D4AF37';
  let background = '#0B0F19';
  let surface = '#1A1118';
  let text = '#F8FAFC';
  let headingFont = 'Cinzel';
  let bodyFont = 'Cormorant Garamond';
  let accentFont = 'Great Vibes';

  let sampleCouple = {
    groom: detectedGroom || (isCoupleOccasion ? 'Kabir Verma' : 'Celebrant Name'),
    bride: detectedBride || (isCoupleOccasion ? 'Ananya Sharma' : ''),
    tagline: 'Join us in celebrating this special occasion',
  };
  let welcomeMessage = 'We warmly invite you to share this joyous celebration with our families.';
  let storyContent = 'A beautiful journey of shared dreams, treasured moments, and joyous memories.';
  let familyInfo = 'With the gracious blessings of our loving family and elders.';
  let events: any[] = [];

  if (cat === 'birthday') {
    sampleCouple.bride = ''; // Single celebrant!

    if (lower.includes('punjabi') || lower.includes('bhangra') || lower.includes('dhol') || lower.includes('sikh')) {
      archetype = 'PhulkariCelebrationTemplate';
      primary = '#D97706';
      secondary = '#DC2626';
      accent = '#FBBF24';
      background = '#1E1B4B';
      surface = '#2E1065';
      text = '#FFFFFF';
      sampleCouple.groom = detectedGroom || 'Harpreet Singh';
      sampleCouple.tagline = 'Balle Balle! Celebrating 30 Years of Joy, Laughter & Spirit';
      welcomeMessage = 'Join us for a spirited Punjabi celebration filled with live Dhol, Bhangra beats, and royal Punjabi delicacies.';
      storyContent = 'Three decades of vibrant laughter, big dreams, and heartwarming family memories. Let us celebrate in true Punjabi style!';
      events = [
        {
          name: 'Live Dhol & Bhangra Welcome High Tea',
          date: '2027-04-10',
          time: '04:30 PM',
          venueName: 'The Royal Virasat Courtyard',
          venueAddress: 'G.T. Road, Jalandhar, Punjab',
          dressCode: 'Traditional Punjabi Kurta / Phulkari Dupattas',
          description: 'Kick off the celebrations with energetic folk beats, dhol beats, and authentic Punjabi appetizers.',
        },
        {
          name: 'Grand Birthday Gala & Dinner Buffet',
          date: '2027-04-10',
          time: '08:00 PM',
          venueName: 'The Grand Ballroom',
          venueAddress: 'G.T. Road, Jalandhar, Punjab',
          dressCode: 'Festive Indo-Western Glamour',
          description: 'Grand milestone cake cutting followed by authentic royal Punjabi banquet and DJ dance floor.',
        },
      ];
    } else if (lower.includes('coastal') || lower.includes('beach') || lower.includes('goa') || lower.includes('ocean') || lower.includes('sundowner')) {
      archetype = 'CoastalPearlTemplate';
      primary = '#0284C7';
      secondary = '#38BDF8';
      accent = '#FDE047';
      background = '#082F49';
      surface = '#0C4A6E';
      text = '#FFFFFF';
      sampleCouple.groom = detectedGroom || 'Kabir Mehta';
      sampleCouple.tagline = 'Turning 30 under the Goan sun, sea waves & stars';
      welcomeMessage = 'Get ready for an epic coastal birthday bash! Join us for a weekend of sun, sea, craft cocktails, and celebration.';
      storyContent = "Three decades of adventures, cherished friendships, and unforgettable memories. Let's make this milestone legendary!";
      events = [
        {
          name: 'Sunset Beach Shack Cocktails & BBQ',
          date: '2027-03-12',
          time: '05:30 PM',
          venueName: 'The Driftwood Beach Shack',
          venueAddress: 'Vagator Beach Road, Anjuna, Goa',
          dressCode: 'Tropical Beach Casual / Linen',
          description: 'Chilled craft beers, fresh seafood grills, and sunset acoustic beats by the sea.',
        },
        {
          name: 'The Big Birthday Toast & Moonlit DJ Party',
          date: '2027-03-12',
          time: '09:00 PM',
          venueName: 'Moonlight Palms Deck',
          venueAddress: 'Vagator Beach Road, Anjuna, Goa',
          dressCode: 'Coastal Chic / Party Attire',
          description: 'Cake cutting, champagne toasts, and dancing under the palms.',
        },
      ];
    } else if (lower.includes('retro') || lower.includes('arcade') || lower.includes('neon') || lower.includes('synth') || lower.includes('80s')) {
      archetype = 'RetroSynthArcadeTemplate';
      primary = '#EC4899';
      secondary = '#8B5CF6';
      accent = '#06B6D4';
      background = '#09090B';
      surface = '#18181B';
      text = '#F4F4F5';
      headingFont = 'Jost';
      bodyFont = 'Plus Jakarta Sans';
      sampleCouple.groom = detectedGroom || 'Vikram Ray';
      sampleCouple.tagline = 'Level 30 Unlocked: Insert Coin to Party!';
      welcomeMessage = 'Step into the neon grid! Retro arcade tournaments, 80s synth beats, and craft mixology await.';
      storyContent = '30 levels completed with maximum high scores. Ready for the ultimate co-op celebration!';
      events = [
        {
          name: 'Arcade Free-Play Tournament & Cocktails',
          date: '2027-03-20',
          time: '08:00 PM',
          venueName: 'CyberBar Arcade & Lounge',
          venueAddress: '101 Neon Grid Boulevard, Cyber City',
          dressCode: '80s Retro Neon Casual',
          description: 'Vintage pinball, classic arcade tournaments, and signature glow cocktails.',
        },
        {
          name: 'Level-Up Cake Cutting & Synthwave DJ Night',
          date: '2027-03-20',
          time: '10:00 PM',
          venueName: 'The Synth Stage',
          venueAddress: '101 Neon Grid Boulevard, Cyber City',
          dressCode: 'Retro Party Chic',
          description: 'Cake cutting ceremony followed by electronic synthwave sets and midnight dance.',
        },
      ];
    } else {
      archetype = 'GoldenMilestoneTemplate';
      primary = '#D4AF37';
      secondary = '#996515';
      accent = '#FFD700';
      background = '#0B0B0F';
      surface = '#14141D';
      text = '#E2E8F0';
      sampleCouple.groom = detectedGroom || 'Aryan Malhotra';
      sampleCouple.tagline = 'Celebrating 30 Years of Brilliance, Laughter & Adventure';
      welcomeMessage = 'Please join us for an evening of chilled champagne, celebratory toasts, and unforgettable memories.';
      storyContent = 'Three decades of cherished milestones, lifelong friendships, and dreams realized. Your presence will make this night truly unforgettable.';
      events = [
        {
          name: 'Welcome Cocktails & Canapés',
          date: '2027-03-12',
          time: '07:30 PM',
          venueName: 'The Skyview Lounge & Terrace',
          venueAddress: 'Floor 42, Starlight Tower, Marine Drive',
          dressCode: 'Cocktail Attire / Black-Tie Optional',
          description: 'Chilled champagne, artisanal cocktails, and live saxophone as sunset warms the skyline.',
        },
        {
          name: 'The Birthday Toast & Cake Cutting',
          date: '2027-03-12',
          time: '09:00 PM',
          venueName: 'The Gold Ballroom',
          venueAddress: 'Starlight Tower, Marine Drive',
          dressCode: 'Black Tie & A Touch of Gold',
          description: 'A special toast to memories past and adventures ahead, followed by dessert and sparklers.',
        },
      ];
    }
  } else if (cat === 'anniversary') {
    sampleCouple.groom = detectedGroom || 'Rajesh Malhotra';
    sampleCouple.bride = detectedBride || 'Sunita Malhotra';
    archetype = lower.includes('50') ? 'GoldenJubilee50thTemplate' : 'SilverJubileeTemplate';
    primary = lower.includes('50') ? '#D4AF37' : '#94A3B8';
    secondary = '#64748B';
    accent = lower.includes('50') ? '#FFD700' : '#E2E8F0';
    background = '#0F172A';
    surface = '#1E293B';
    sampleCouple.tagline = 'Celebrating 25 Beautiful Years of Love, Laughter & Devotion';
    welcomeMessage = 'Quarter of a century of shared dreams, laughter, and enduring love. Join us as we raise a toast to our journey.';
    events = [
      {
        name: 'Vow Renewal & Champagne Gala',
        date: '2027-06-20',
        time: '07:00 PM',
        venueName: 'The Regency Ballroom',
        venueAddress: 'The Leela Palace Grounds',
        dressCode: 'Silver & Black-Tie Formal',
        description: 'Champagne toast, nostalgic journey slideshow, and dinner dance.',
      },
    ];
  } else if (cat === 'baby_shower') {
    sampleCouple.groom = detectedGroom || 'Priya & Rohan';
    sampleCouple.bride = '';
    archetype = 'CelestialLullabyTemplate';
    primary = '#8B5CF6';
    secondary = '#A78BFA';
    accent = '#F472B6';
    background = '#0F172A';
    surface = '#1E293B';
    sampleCouple.tagline = 'A little star is on the way to light up our world';
    welcomeMessage = 'We are overflowing with joy and cannot wait to welcome our little blessing. Please join us for an afternoon of love, games, and celebration!';
    events = [
      {
        name: 'Baby Shower High Tea & Games',
        date: '2027-04-18',
        time: '03:30 PM',
        venueName: 'The Lavender Glasshouse',
        venueAddress: 'Green Valley Gardens',
        dressCode: 'Pastel Elegance',
        description: 'Delicate teas, guessing games, and welcoming blessings.',
      },
    ];
  } else if (cat === 'housewarming') {
    sampleCouple.groom = detectedGroom || 'The Sharma Family';
    sampleCouple.bride = '';
    archetype = 'HearthHeritageTemplate';
    primary = '#C2410C';
    secondary = '#EA580C';
    accent = '#FBBF24';
    background = '#1C1917';
    surface = '#292524';
    sampleCouple.tagline = 'New Home, New Memories, Auspicious Beginnings';
    welcomeMessage = 'With gratitude in our hearts, we invite you to bless our new home and celebrate our Griha Pravesh.';
    events = [
      {
        name: 'Griha Pravesh & Vastu Puja',
        date: '2027-05-09',
        time: '09:30 AM',
        venueName: 'Our New Residence',
        venueAddress: 'Villa 14, Whispering Palms Estate',
        dressCode: 'Traditional Festive Attire',
        description: 'Auspicious havan and puja followed by traditional prasadam and luncheon.',
      },
    ];
  } else if (cat === 'party') {
    sampleCouple.groom = detectedGroom || 'VIP Celebration Host';
    sampleCouple.bride = '';
    archetype = 'MidnightSoireeTemplate';
    primary = '#D946EF';
    secondary = '#8B5CF6';
    accent = '#06B6D4';
    background = '#09090B';
    surface = '#18181B';
    sampleCouple.tagline = 'An electric night of music, craft mixology & celebration';
    welcomeMessage = 'You are exclusively invited to the VIP party of the season. Bring your finest energy and dance the night away.';
    events = [
      {
        name: 'Cocktails & DJ Lineup',
        date: '2027-07-25',
        time: '09:00 PM',
        venueName: 'The Neon Penthouse',
        venueAddress: 'Rooftop 50, Central Avenue',
        dressCode: 'Glamour & Neon Edge',
        description: 'Signature mixology, guest DJ set, and late-night revelry.',
      },
    ];
  } else {
    // Wedding
    sampleCouple.groom = detectedGroom || 'Kabir Verma';
    sampleCouple.bride = detectedBride || 'Ananya Sharma';

    if (lower.includes('botanical') || lower.includes('flower') || lower.includes('garden') || lower.includes('floral')) {
      archetype = 'BotanicalRomanceTemplate';
      primary = '#2D6A4F';
      secondary = '#52B788';
      accent = '#E8A598';
      background = '#0F1A15';
      surface = '#1B2D24';
      sampleCouple.tagline = 'Under the blooming boughs, two hearts unite';
      events = [
        {
          name: 'Vows in the Walled Garden',
          date: '2027-06-12',
          time: '04:30 PM',
          venueName: 'Château Valmorin Garden',
          venueAddress: 'Loire Valley Pavilions',
          dressCode: 'Garden Formal / Soft Pastels',
          description: 'Vows exchanged beneath ancient rose trellises followed by lawn champagne.',
        },
        {
          name: 'Supper Beneath the Lime Trees',
          date: '2027-06-12',
          time: '07:30 PM',
          venueName: 'The Orangery & Terrace',
          venueAddress: 'Loire Valley Pavilions',
          dressCode: 'Black Tie Optional',
          description: 'Candlelit dining, speeches, and dancing under fairy lights.',
        },
      ];
    } else if (lower.includes('gatsby') || lower.includes('1920') || lower.includes('speakeasy') || lower.includes('noir') || lower.includes('deco')) {
      archetype = 'ArtDecoNoirTemplate';
      primary = '#D4AF37';
      secondary = '#C5A059';
      accent = '#FFFFFF';
      background = '#0A0A0A';
      surface = '#171717';
      sampleCouple.tagline = 'Two lives, one golden era';
      events = [
        {
          name: 'The Wedding Ceremony & Gala',
          date: '2027-09-18',
          time: '07:00 PM',
          venueName: 'The Grand Ziggurat Ballroom',
          venueAddress: 'One Starlight Plaza, New York',
          dressCode: 'Black-Tie & 1920s Glamour',
          description: 'Ceremony followed by midnight champagne, jazz orchestra, and dancing.',
        },
      ];
    } else {
      archetype = 'ImperialBurgundyTemplate';
      primary = '#7A1C30';
      secondary = '#C2A649';
      accent = '#D4AF37';
      background = '#0B0F19';
      surface = '#1A1118';
      sampleCouple.tagline = 'Two Souls, One Sacred Eternal Journey';
      events = [
        {
          name: 'Welcome Soirée & Royal Sangeet',
          date: '2027-02-14',
          time: '06:00 PM',
          venueName: 'The Royal Courtyard',
          venueAddress: 'Palace Road, Jaipur, Rajasthan',
          dressCode: 'Indo-Western Glitz',
          description: 'An evening of music, dance performances, and royal traditional feast.',
        },
        {
          name: 'The Sacred Auspicious Pheras',
          date: '2027-02-15',
          time: '11:00 AM',
          venueName: 'Grand Heritage Pavilion',
          venueAddress: 'Palace Road, Jaipur, Rajasthan',
          dressCode: 'Royal Traditional Formal',
          description: 'Auspicious wedding ceremony followed by celebratory royal luncheon banquet.',
        },
      ];
    }
  }

  return {
    name: rawTitle,
    slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
    category: cat,
    description: `A bespoke luxury ${cat} invitation suite with curated color palettes, elegant typography, and interactive guest experiences.`,
    templateComponent: archetype,
    tags: [cat, 'celebration', 'luxury', 'digital-invitation', 'interactive'],
    priceTier: 'premium',
    priceAmount: 49900,
    currency: 'INR',
    isActive: true,
    isFeatured: true,
    previewImageUrl: '/templates/preview-placeholder.jpg',
    defaultColors: {
      primary,
      secondary,
      accent,
      background,
      surface,
      text,
    },
    defaultFonts: {
      heading: headingFont,
      body: bodyFont,
      accent: accentFont,
    },
    features: [
      'countdown_timer',
      'interactive_rsvp',
      'multi_event_timeline',
      'google_maps_directions',
      'audio_player',
    ],
    sampleData: {
      couple: sampleCouple,
      welcomeMessage,
      storyContent,
      familyInfo,
      events,
    },
  };
}
