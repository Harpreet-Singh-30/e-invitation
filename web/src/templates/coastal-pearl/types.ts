/**
 * Coastal Pearl — data contract.
 * Every field except `couple.groom` and `couple.bride` is optional.
 * A section whose data is missing is hidden; the template never invents
 * dates, venues, addresses or story text.
 */

export interface TemplateEvent {
  /** Display title, e.g. "Wedding Ceremony". Falls back to venueName. */
  title?: string;
  /** ISO date, `YYYY-MM-DD`. */
  eventDate: string;
  /** 24h `HH:mm` (e.g. "16:30"). Free text is shown as-is. */
  startTime?: string;
  endTime?: string;
  venueName?: string;
  venueAddress?: string;
  /** Any maps URL. If omitted, directions fall back to a search on venueAddress. */
  mapLink?: string;
  description?: string;
  /** Optional photo for this event's venue. */
  venueImage?: string;
}

export interface GalleryImage {
  src: string;
  alt?: string;
}

export interface TemplateMusic {
  url: string;
  title?: string;
}

export interface TemplateStory {
  title?: string;
  body: string;
  image?: string;
}

export interface TemplateData {
  couple: {
    groom: string;
    bride: string;
    tagline?: string;
  };
  events?: TemplateEvent[];
  /** Welcome message. Blank lines / newlines start new paragraphs. */
  message?: string;
  story?: TemplateStory;
  /** Click-to-play only. Never auto-plays. A bare string is treated as the URL. */
  music?: string | TemplateMusic;
  heroImage?: string;
  gallery?: GalleryImage[];
  options?: {
    /** Set false to skip the animated opening. Default true. */
    intro?: boolean;
  };
}
