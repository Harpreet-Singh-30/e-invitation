export interface EventItem {
  key: string;
  name: string;
  title: string;
  /** ISO date, e.g. 2027-06-12 */
  eventDate: string;
  /** 24h time, e.g. 16:30 */
  startTime?: string;
  venueName: string;
  venueAddress: string;
  mapLink?: string;
  description?: string;
}
export type GalleryItem = string | { url: string; alt?: string; caption?: string };
export interface StoryItem { year: string; title: string; text: string }
export interface TemplateData {
  couple: { groom: string; bride: string; tagline?: string };
  events?: EventItem[];
  message?: string;
  music?: { enabled: boolean; trackId?: string };
  gallery?: GalleryItem[];
  heroImageUrl?: string;
  /** Optional extension: powers the editorial timeline. Hidden when absent. */
  story?: StoryItem[];
  occasionType?: string;
}
