export interface EventItem {
  id?: string;
  /** Display name, e.g. "Mehendi", "Jaggo", "Sangeet", "Anand Karaj", "Reception". */
  name: string;
  /** ISO date, YYYY-MM-DD */
  eventDate?: string;
  /** "16:30" or "4:30 PM" */
  startTime?: string;
  endTime?: string;
  venueName?: string;
  venueAddress?: string;
  /** Google Maps share/directions link */
  mapLink?: string;
  description?: string;
  dressCode?: string;
}

export interface TemplateData {
  couple: {
    groom: string;
    bride: string;
    tagline?: string;
    /** One string or an array of paragraphs */
    story?: string | string[];
  };
  events: EventItem[];
  /** Welcome message */
  message?: string;
  /** Host line, e.g. "Mr. and Mrs. Gill together with Mr. and Mrs. Sandhu" */
  family?: string;
  /** Optional instrumental track. Never autoplays. */
  music?: { src: string; title?: string };
  gallery?: { src: string; alt?: string }[];
  heroImage?: string;
}
