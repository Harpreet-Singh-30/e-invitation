/**
 * Public data contract for the Art Deco Noir template.
 * Every field except `couple.groom` and `couple.bride` is optional; sections
 * whose data is missing are hidden rather than rendered empty.
 */

export interface Couple {
  /** Groom's name as it should appear in the hero (first name recommended). */
  groom: string;
  /** Bride's name as it should appear in the hero (first name recommended). */
  bride: string;
  /** Short line under the names, e.g. "Two families. One evening." */
  tagline?: string;
  /** Which name is set first. Defaults to "groom-first". */
  nameOrder?: 'groom-first' | 'bride-first';
}

export interface WeddingEvent {
  /** ISO calendar date, `YYYY-MM-DD`. */
  eventDate: string;
  /** 24h `HH:mm` or 12h `h:mm AM/PM`. */
  startTime: string;
  venueName: string;
  venueAddress: string;
  /** Link to a map (Google Maps, Apple Maps, …). Generated from the address when omitted. */
  mapLink?: string;
  /** One or two sentences shown in the itinerary. */
  description?: string;
  /** Short event name, e.g. "Ceremony". Falls back to the venue name. */
  title?: string;
  /** IANA time zone of the venue, e.g. "America/Chicago". Falls back to the viewer's zone. */
  timeZone?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface StoryChapter {
  /** Year or short date label, e.g. "2019". */
  label: string;
  title: string;
  text: string;
}

export interface CoupleStory {
  title?: string;
  chapters: StoryChapter[];
}

export interface MusicSettings {
  /** The soundtrack control is only rendered when this is true. Never autoplays. */
  enabled: boolean;
  /**
   * Id of a registered track (see `src/lib/tracks.ts`), or a direct URL / path
   * to an audio file.
   */
  trackId?: string;
}

export interface TemplateData {
  couple: Couple;
  events?: WeddingEvent[];
  /** Invitation wording shown after the hero. Blank lines separate paragraphs. */
  message?: string;
  story?: CoupleStory;
  music?: MusicSettings;
  /** Optional photo shown inside the hero arch. */
  heroImage?: string;
  gallery?: GalleryImage[];
}

export interface TemplateProps {
  data: TemplateData;
}
