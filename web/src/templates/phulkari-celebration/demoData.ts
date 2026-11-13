import type { TemplateData } from './types';
import g1 from './assets/gallery-1.svg'; import g2 from './assets/gallery-2.svg'; import g3 from './assets/gallery-3.svg';
import g4 from './assets/gallery-4.svg'; import g5 from './assets/gallery-5.svg'; import g6 from './assets/gallery-6.svg';

export const demoData: TemplateData = {
  couple: {
    groom: 'Arman Singh Gill',
    bride: 'Gurleen Kaur Sandhu',
    tagline: 'Two families, one long table, and a lot of dancing.',
    story: [
      'We met in a crowded library in Chandigarh, arguing over the last copy of the same book. Gurleen won. Arman bought her chai to make up for it.',
      'Six years, two cities and one very patient set of parents later, we are getting married, and we want you there for all of it.',
    ],
  },
  family: 'Sardar Harbans Singh Gill and Sardarni Paramjit Kaur Gill, together with Sardar Kuldeep Singh Sandhu and Sardarni Manjit Kaur Sandhu',
  message: 'With joy in our hearts, we invite you to celebrate the wedding of our children. Come for one ceremony or all five days. Your presence is the blessing we are hoping for.',
  events: [
    { id: 'mehendi', name: 'Mehendi', eventDate: '2027-02-11', startTime: '15:00', venueName: 'Sandhu Haveli', venueAddress: 'Model Town Extension, Ludhiana, Punjab 141002', mapLink: 'https://www.google.com/maps/search/?api=1&query=Model+Town+Extension+Ludhiana', description: 'Henna, bangles and an afternoon of tea on the lawn.', dressCode: 'Bright greens and yellows' },
    { id: 'jaggo', name: 'Jaggo', eventDate: '2027-02-12', startTime: '19:30', venueName: 'Gill Residence', venueAddress: 'Sarabha Nagar, Ludhiana, Punjab 141001', mapLink: 'https://www.google.com/maps/search/?api=1&query=Sarabha+Nagar+Ludhiana', description: 'Lanterns, boliyan and a procession through the lane. Bring your voice.', dressCode: 'Pinks and phulkari' },
    { id: 'sangeet', name: 'Sangeet', eventDate: '2027-02-12', startTime: '21:00', venueName: 'The Heritage Lawns', venueAddress: 'Ferozepur Road, Ludhiana, Punjab 141012', mapLink: 'https://www.google.com/maps/search/?api=1&query=Ferozepur+Road+Ludhiana', description: 'Performances from both families, then a dance floor that stays open late.', dressCode: 'Indigo and jewel tones' },
    { id: 'karaj', name: 'Anand Karaj', eventDate: '2027-02-13', startTime: '10:30', venueName: 'Gurdwara Sri Guru Nanak Darbar', venueAddress: 'Civil Lines, Ludhiana, Punjab 141001', mapLink: 'https://www.google.com/maps/search/?api=1&query=Civil+Lines+Ludhiana', description: 'The wedding ceremony. Please cover your head and remove shoes at the entrance. Langar follows.', dressCode: 'Modest, traditional attire' },
    { id: 'reception', name: 'Reception', eventDate: '2027-02-13', startTime: '19:00', venueName: 'The Heritage Lawns', venueAddress: 'Ferozepur Road, Ludhiana, Punjab 141012', mapLink: 'https://www.google.com/maps/search/?api=1&query=Ferozepur+Road+Ludhiana', description: 'Dinner and an evening with the newlyweds.', dressCode: 'Formal' },
  ],
  gallery: [g1, g2, g3, g4, g5, g6].map((src, i) => ({ src, alt: `Phulkari artwork ${i + 1}` })),
};
