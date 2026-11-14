interface RefinePromptResult {
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
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

/**
 * Helper to call Gemini REST API directly
 */
async function callGemini(promptText: string, jsonMode: boolean = true): Promise<any> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in server environment');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body: any = {
    contents: [
      {
        parts: [{ text: promptText }],
      },
    ],
  };

  if (jsonMode) {
    body.generationConfig = {
      responseMimeType: 'application/json',
      temperature: 0.7,
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Gemini API Error]', response.status, errorText);
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data: any = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('No content returned from Gemini model');
  }

  if (jsonMode) {
    try {
      return JSON.parse(rawText);
    } catch (e: any) {
      // Clean possible markdown code fences if model returned them
      const cleaned = rawText.replace(/```(?:json)?/g, '').trim();
      return JSON.parse(cleaned);
    }
  }

  return rawText;
}

/**
 * Step 1: Refine the raw admin prompt into an enriched design brief
 */
export async function refineAdminPrompt(
  rawPrompt: string,
  category: string = 'wedding'
): Promise<RefinePromptResult> {
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
    "recommendedArchetype": "One of: ImperialBurgundyTemplate, BotanicalRomanceTemplate, ArtDecoNoirTemplate, PhulkariCelebrationTemplate, CoastalPearlTemplate, CelestialLullabyTemplate, HearthHeritageTemplate, MidnightSoireeTemplate, AuraGrandGalaTemplate"
  }
}`;

  return await callGemini(prompt, true);
}

/**
 * Step 2: Generate complete template specification and sample data from the refined prompt
 */
export async function generateTemplateFromRefinedPrompt(
  refinedPrompt: string,
  category: string = 'wedding',
  originalPrompt: string = ''
): Promise<{ template: GeneratedTemplateSpec; refinedPrompt: string }> {
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
  "templateComponent": "One of: ImperialBurgundyTemplate, BotanicalRomanceTemplate, ArtDecoNoirTemplate, PhulkariCelebrationTemplate, CoastalPearlTemplate, CelestialLullabyTemplate, HearthHeritageTemplate, MidnightSoireeTemplate, AuraGrandGalaTemplate",
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
}

/**
 * Step 3: Adjust template based on admin feedback
 */
export async function adjustTemplateWithFeedback(
  currentTemplate: GeneratedTemplateSpec,
  feedback: string
): Promise<{ updatedTemplate: GeneratedTemplateSpec; changesSummary: string }> {
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
}
