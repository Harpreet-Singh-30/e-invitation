import type { TemplateData } from '../types';
import heroImage from '../assets/images/hero.jpg';
import fanWindow from '../assets/images/gallery-fan-window.jpg';
import champagne from '../assets/images/gallery-champagne.jpg';
import ziggurat from '../assets/images/gallery-ziggurat.jpg';
import colonnade from '../assets/images/gallery-colonnade.jpg';
import skyline from '../assets/images/gallery-skyline.jpg';

const hotel = {
  venueName: 'The Aurelian Hotel',
  venueAddress: '218 North Meridian Street, Chicago, Illinois',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=The+Aurelian+Hotel+218+North+Meridian+Street+Chicago',
  timeZone: 'America/Chicago',
};

/** Full demo: every section is populated. */
export const fullData: TemplateData = {
  couple: {
    groom: 'Theodore',
    bride: 'Margaux',
    tagline: 'An evening in black and gold.',
    nameOrder: 'bride-first',
  },
  message:
    'Together with their families, Margaux Delacroix and Theodore Whitlock invite you to celebrate their marriage.\n\nBlack tie. The evening begins at four o’clock and carries on well past midnight. Dress for another era; the orchestra will take care of the rest.',
  story: {
    title: 'Our story',
    chapters: [
      {
        label: '2018',
        title: 'After hours at the Aurelian',
        text: 'A mutual friend’s party, a late elevator, and an argument about the best cocktail in the city. Neither of them remembers who was right.',
      },
      {
        label: '2021',
        title: 'The long way home',
        text: 'Two apartments, one train line, and a standing Sunday dinner that slowly stopped being a plan and became a habit.',
      },
      {
        label: '2025',
        title: 'A question on the staircase',
        text: 'Theodore asked on the grand staircase of the very hotel where they met, with the lobby empty and the chandeliers still on.',
      },
      {
        label: '2027',
        title: 'Black tie, finally',
        text: 'Family and friends in one room, a full orchestra, and the same elevator on the way up.',
      },
    ],
  },
  events: [
    {
      ...hotel,
      eventDate: '2027-06-19',
      startTime: '16:00',
      title: 'Ceremony',
      description: 'Vows beneath the Grand Arch. Please be seated by 3:45 PM.',
    },
    {
      ...hotel,
      eventDate: '2027-06-19',
      startTime: '17:00',
      title: 'Cocktail hour',
      description: 'Champagne and small plates in the Palm Court.',
    },
    {
      ...hotel,
      eventDate: '2027-06-19',
      startTime: '18:30',
      title: 'Dinner',
      description: 'A seated dinner in the Ballroom, with toasts between courses.',
    },
    {
      ...hotel,
      eventDate: '2027-06-19',
      startTime: '21:00',
      title: 'Dancing',
      description: 'The orchestra takes the floor. Last song at midnight.',
    },
    {
      eventDate: '2027-06-20',
      startTime: '11:00',
      title: 'Farewell brunch',
      description: 'A slower morning among the palms. Linen and sunshine welcome.',
      venueName: 'Lakeshore Conservatory',
      venueAddress: '1450 East Shoreline Drive, Chicago, Illinois',
      timeZone: 'America/Chicago',
    },
  ],
  music: { enabled: true, trackId: 'midnight-overture' },
  heroImage,
  gallery: [
    { src: fanWindow, alt: 'A fan-shaped window glowing above a stepped dais', caption: 'The Grand Arch' },
    { src: champagne, alt: 'Two champagne coupes against golden bokeh', caption: 'Cocktail hour' },
    { src: ziggurat, alt: 'A stepped staircase rising toward a lit tower', caption: 'The staircase' },
    { src: colonnade, alt: 'A colonnade receding toward warm light', caption: 'The colonnade' },
    { src: skyline, alt: 'A stepped skyline at dusk', caption: 'Chicago, at dusk' },
  ],
};

/** Only the required fields: every optional section should disappear cleanly. */
export const minimalData: TemplateData = {
  couple: { groom: 'Theodore', bride: 'Margaux' },
};

/** Events and message but no imagery, story or music. */
export const textOnlyData: TemplateData = {
  couple: { groom: 'Theodore', bride: 'Margaux', tagline: fullData.couple.tagline },
  message: fullData.message,
  events: fullData.events?.slice(0, 1),
};

export const variants: Record<string, TemplateData> = {
  full: fullData,
  minimal: minimalData,
  text: textOnlyData,
};
