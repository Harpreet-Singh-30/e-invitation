export interface TemplateCouple {
  groom: string;
  bride: string;
  tagline?: string;
  nameOrder?: 'groom-first' | 'bride-first';
  story?: string | string[];
}

export interface TemplateEvent {
  key: string;
  title: string;
  name?: string;
  date: string;
  eventDate?: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  venue: string;
  venueName?: string;
  address?: string;
  venueAddress?: string;
  mapUrl?: string;
  mapLink?: string;
  description?: string;
  dressCode?: string;
}

export interface TemplateData {
  couple: TemplateCouple;
  events: TemplateEvent[];
  gallery?: any[];
  music?: {
    enabled: boolean;
    trackId?: string;
    url?: string;
  };
  message?: string;
  family?: string;
  familyInfo?: string;
  heroImage?: string;
  heroImageUrl?: string;
  story?: any;
}

export interface AdaptInvitationInput {
  title?: string | null;
  groomName?: string | null;
  brideName?: string | null;
  tagline?: string | null;
  welcomeMessage?: string | null;
  storyContent?: string | null;
  familyInfo?: string | null;
  events?: any[] | null;
  occasionType?: string | null;
  musicUrl?: string | null;
  heroImageUrl?: string | null;
}

/**
 * Helper to clean trailing words like 'Wedding', 'Marriage', 'Shaadi' from bride's extracted name
 */
function cleanExtractedName(raw: string): string {
  return raw
    .replace(/\s+(wedding|marriage|ceremony|shaadi|invitation|party)$/i, '')
    .trim();
}

/**
 * Extracts couple names from title or explicit inputs
 */
export function extractCoupleNames(
  title?: string | null,
  explicitGroom?: string | null,
  explicitBride?: string | null
): { groom: string; bride: string } {
  // If explicitly provided, use them
  if (explicitGroom?.trim() && explicitBride?.trim()) {
    return {
      groom: explicitGroom.trim(),
      bride: explicitBride.trim(),
    };
  }

  if (explicitGroom?.trim()) {
    return {
      groom: explicitGroom.trim(),
      bride: explicitBride?.trim() || 'Bride',
    };
  }

  if (explicitBride?.trim()) {
    return {
      groom: explicitGroom?.trim() || 'Groom',
      bride: explicitBride.trim(),
    };
  }

  // Attempt extraction from title
  if (title?.trim()) {
    const trimmedTitle = title.trim();

    // Check for " & "
    if (trimmedTitle.includes('&')) {
      const parts = trimmedTitle.split('&');
      const groom = parts[0]?.trim();
      const bride = parts[1] ? cleanExtractedName(parts[1].trim()) : '';
      if (groom && bride) {
        return { groom, bride };
      }
    }

    // Check for " and "
    const andMatch = trimmedTitle.match(/\s+and\s+/i);
    if (andMatch && andMatch.index !== undefined) {
      const groom = trimmedTitle.substring(0, andMatch.index).trim();
      const bride = cleanExtractedName(trimmedTitle.substring(andMatch.index + andMatch[0].length).trim());
      if (groom && bride) {
        return { groom, bride };
      }
    }

    // Single name in title
    return {
      groom: cleanExtractedName(trimmedTitle),
      bride: 'Bride',
    };
  }

  return {
    groom: 'Groom Name',
    bride: 'Bride Name',
  };
}

/**
 * Adapts raw invitation / editor form state to the exact contract expected by wedding templates
 */
export function adaptInvitationToTemplateData(input: AdaptInvitationInput): TemplateData {
  const { groom, bride } = extractCoupleNames(input.title, input.groomName, input.brideName);

  // Combine message fields so that welcome message, story, and family info are all represented
  const messageParts: string[] = [];
  if (input.welcomeMessage?.trim()) {
    messageParts.push(input.welcomeMessage.trim());
  }
  if (input.storyContent?.trim()) {
    messageParts.push(input.storyContent.trim());
  }
  if (input.familyInfo?.trim()) {
    messageParts.push(`With love and blessings from: ${input.familyInfo.trim()}`);
  }

  const message = messageParts.length > 0
    ? messageParts.join('\n\n')
    : 'Join us in celebrating our special day! Your presence will make our celebration complete.';

  // Format events
  let events: TemplateEvent[] = [];
  if (input.events && Array.isArray(input.events) && input.events.length > 0) {
    events = input.events.map((e, idx) => {
      const rawDate = e.eventDate || e.date;
      let isoDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      if (rawDate) {
        try {
          const parsed = new Date(rawDate);
          if (!isNaN(parsed.getTime())) {
            isoDate = parsed.toISOString();
          }
        } catch {
          // keep fallback
        }
      }

      let timeStr = e.time;
      if (!timeStr && e.startTime) {
        if (typeof e.startTime === 'string') {
          // If startTime is a time string like "18:00:00" or ISO
          if (e.startTime.includes('T')) {
            try {
              timeStr = new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } catch {
              timeStr = e.startTime;
            }
          } else {
            timeStr = e.startTime;
          }
        }
      }

      const rawName = e.name || e.title || `Celebration ${idx + 1}`;
      const slugKey = rawName.toLowerCase().replace(/[^a-z0-9]/g, '-');

      const venueStr = e.venueName || e.venue || 'Celebration Venue';
      const addressStr = e.venueAddress || e.address || undefined;
      const mapStr = e.mapLink || e.mapUrl || '#';

      return {
        key: slugKey || (idx === 0 ? 'wedding' : `event-${idx}`),
        title: rawName,
        name: rawName,
        date: isoDate,
        eventDate: isoDate.slice(0, 10),
        time: timeStr || undefined,
        startTime: timeStr || undefined,
        endTime: e.endTime || undefined,
        venue: venueStr,
        venueName: venueStr,
        address: addressStr,
        venueAddress: addressStr,
        mapUrl: mapStr,
        mapLink: mapStr,
        description: e.description || undefined,
        dressCode: e.dressCode || undefined,
      };
    });

    // For wedding templates, ensure at least one event has key 'wedding'
    const hasWeddingKey = events.some(e => e.key === 'wedding' || e.key.includes('wedding'));
    if (!hasWeddingKey && events.length > 0) {
      events[0].key = 'wedding';
    }
  } else {
    // Default fallback event with future date
    const fallbackIso = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    events = [
      {
        key: 'wedding',
        title: 'Wedding Ceremony',
        name: 'Wedding Ceremony',
        date: fallbackIso,
        eventDate: fallbackIso.slice(0, 10),
        time: '6:00 PM',
        startTime: '6:00 PM',
        venue: 'The Grand Palace',
        venueName: 'The Grand Palace',
        address: '456 Royal Avenue',
        venueAddress: '456 Royal Avenue',
        mapUrl: '#',
        mapLink: '#',
      },
    ];
  }

  const storyStr = input.storyContent?.trim() || undefined;
  const storyObj = storyStr
    ? {
        title: 'Our Story',
        body: storyStr,
        text: storyStr,
        paragraphs: storyStr.split(/\n+/).map(p => p.trim()).filter(Boolean),
        chapters: [
          {
            title: 'Our Story',
            date: '',
            text: storyStr,
          },
        ],
      }
    : undefined;

  return {
    couple: {
      groom,
      bride,
      tagline: input.tagline?.trim() || 'Two hearts, one love',
      story: storyStr,
    },
    events,
    gallery: [],
    music: input.musicUrl
      ? { enabled: true, trackId: input.musicUrl, url: input.musicUrl }
      : { enabled: false },
    message,
    family: input.familyInfo?.trim() || undefined,
    familyInfo: input.familyInfo?.trim() || undefined,
    heroImage: input.heroImageUrl?.trim() || undefined,
    heroImageUrl: input.heroImageUrl?.trim() || undefined,
    story: storyObj,
  };
}

