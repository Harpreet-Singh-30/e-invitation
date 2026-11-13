import type { TemplateData } from './types';
import hero from './assets/hero.svg';
import g1 from './assets/gallery-1.svg';
import g2 from './assets/gallery-2.svg';
import g3 from './assets/gallery-3.svg';
import g4 from './assets/gallery-4.svg';

const venue = 'Amber Court Palace';
const address = 'Moti Doongri Road, Jaipur, Rajasthan 302004, India';
const map = 'https://www.google.com/maps/search/?api=1&query=Amber+Court+Palace+Jaipur';

export const demoData: TemplateData = {
  couple: { groom: 'Aarav', bride: 'Diya', tagline: 'Two families. One celebration.' },
  message:
    'Together with their families\n\nMr. & Mrs. Mehra and Mr. & Mrs. Kapoor\n\nrequest the honour of your presence as Aarav and Diya begin their life together, amid blessings, music and the warmth of those we hold dear.',
  story:
    'They met over a delayed flight and a shared cup of chai. Four years, two cities and one very patient families later, Aarav asked Diya a question on a rooftop in Udaipur. She said yes before he finished.',
  music: { enabled: true, trackId: 'royal-evening' },
  heroImageUrl: hero,
  gallery: [
    { url: g1, alt: 'Palace arch at dusk' },
    { url: g2, alt: 'Marigold garlands' },
    { url: g3, alt: 'Lotus engraving' },
    { url: g4, alt: 'Candlelit courtyard' },
  ],
  events: [
    { key: 'kirtan', name: 'Kirtan', title: 'An evening of devotion', eventDate: '2027-02-11', startTime: '6:00 PM', venueName: venue, venueAddress: address, mapLink: map, description: 'Hymns and blessings with family.' },
    { key: 'mehendi', name: 'Mehendi', title: 'Henna & high tea', eventDate: '2027-02-12', startTime: '11:00 AM', venueName: venue, venueAddress: address, mapLink: map, description: 'Garden lawn. Dress in greens and golds.' },
    { key: 'sangeet', name: 'Sangeet', title: 'A night of song and dance', eventDate: '2027-02-12', startTime: '7:30 PM', venueName: venue, venueAddress: address, mapLink: map, description: 'Performances, dinner and dancing.' },
    { key: 'haldi', name: 'Haldi', title: 'Turmeric blessings', eventDate: '2027-02-13', startTime: '9:00 AM', venueName: venue, venueAddress: address, mapLink: map, description: 'Wear something you will not mind staining.' },
    { key: 'wedding', name: 'Wedding Ceremony', title: 'The Pheras', eventDate: '2027-02-13', startTime: '7:00 PM', venueName: venue, venueAddress: address, mapLink: map, description: 'Baraat arrives at 6:30 PM. Dinner follows the ceremony.' },
    { key: 'reception', name: 'Reception', title: 'An evening of celebration', eventDate: '2027-02-14', startTime: '7:30 PM', venueName: venue, venueAddress: address, mapLink: map, description: 'Cocktail attire, champagne gold encouraged.' },
  ],
};
