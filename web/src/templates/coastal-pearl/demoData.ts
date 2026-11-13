import type { TemplateData } from './types';
import hero from './assets/hero.svg';
import story from './assets/story.svg';
import g1 from './assets/gallery-1.svg';
import g2 from './assets/gallery-2.svg';
import g3 from './assets/gallery-3.svg';
import g4 from './assets/gallery-4.svg';
import g5 from './assets/gallery-5.svg';
import g6 from './assets/gallery-6.svg';
import soundtrack from './assets/soundtrack.wav';

/** Fictional demo content. Replace every field with the real couple's data. */
export const demoData: TemplateData = {
  couple: {
    bride: 'Meera',
    groom: 'Arjun',
    tagline: 'Two tides, one shore.',
  },
  message:
    'With full hearts, we invite you to the edge of the sea to celebrate the beginning of our forever.\n\nCome for the golden hours, the salt air and the people we love most. Your presence is the pearl of our day.',
  story: {
    title: 'How the tide brought us together',
    body: 'We met on a quiet monsoon evening, two strangers sharing one umbrella and a very long walk along the water.\n\nYears later, the sea is still where we go to talk, to laugh and to dream. It felt only right to promise ourselves to each other where it all began — with the horizon in front of us and everyone we cherish beside us.',
    image: story,
  },
  events: [
    {
      title: 'Sundowner Welcome',
      eventDate: '2027-02-12',
      startTime: '17:30',
      venueName: 'The Pearl Pavilion',
      venueAddress: 'Beachfront Road, South Goa, India',
      mapLink: 'https://www.google.com/maps/search/?api=1&query=South+Goa+India',
      description: 'Toes in the sand, chilled coconut water and live acoustic music as the sun goes down.',
    },
    {
      title: 'Wedding Ceremony',
      eventDate: '2027-02-13',
      startTime: '16:30',
      venueName: 'The Pearl Pavilion',
      venueAddress: 'Beachfront Road, South Goa, India',
      mapLink: 'https://www.google.com/maps/search/?api=1&query=South+Goa+India',
      description: 'Vows by the water, under an open sky. Soft, light colours are most welcome.',
    },
    {
      title: 'Reception & Dinner',
      eventDate: '2027-02-13',
      startTime: '19:30',
      venueName: 'The Pearl Pavilion',
      venueAddress: 'Beachfront Road, South Goa, India',
      mapLink: 'https://www.google.com/maps/search/?api=1&query=South+Goa+India',
      description: 'A candlelit seaside feast, then dancing until the tide turns.',
    },
  ],
  heroImage: hero,
  gallery: [
    { src: g1, alt: 'First light on a quiet shoreline' },
    { src: g2, alt: 'Coral dusk over the water' },
    { src: g3, alt: 'A single pearl resting on pale sand' },
    { src: g4, alt: 'Sunlight rippling through shallow water' },
    { src: g5, alt: 'Sea-glass shallows' },
    { src: g6, alt: 'Sunset framed by palm fronds' },
  ],
  music: { url: soundtrack, title: 'Tide Pad (demo)' },
};
