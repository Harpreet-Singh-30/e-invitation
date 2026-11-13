export type EventKey = 'kirtan' | 'mehendi' | 'sangeet' | 'haldi' | 'wedding' | 'reception' | (string & {});

export interface TemplateEvent {
  key: EventKey;
  name: string;
  title?: string;
  /** ISO date, e.g. "2027-02-13" */
  eventDate?: string;
  /** "17:30" or "5:30 PM" */
  startTime?: string;
  venueName?: string;
  venueAddress?: string;
  mapLink?: string;
  description?: string;
}

export interface TemplateData {
  couple: { groom: string; bride: string; tagline?: string };
  events: TemplateEvent[];
  /** Family invitation message. Blank lines separate paragraphs. */
  message?: string;
  /** Optional short story shown in the couple introduction. */
  story?: string;
  music: { enabled: boolean; trackId?: string };
  gallery?: { url: string; alt?: string }[];
  heroImageUrl?: string;
}
