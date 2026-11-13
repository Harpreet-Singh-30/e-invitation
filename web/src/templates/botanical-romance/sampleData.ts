import type { TemplateData } from './types';
const A = (f: string) => `${import.meta.env.BASE_URL}assets/${f}`;

/** Demo data lives only in the preview harness — the template itself ships no sample copy. */
export const sampleData: TemplateData = {
  couple: { bride: 'Élodie', groom: 'Auguste', tagline: 'A long weekend among the roses' },
  heroImageUrl: A('g1.svg'),
  message:
    'Dear friends and family,\n\nThere is a walled garden in the Loire where the roses climb the old stone and the light arrives late and gold. It is where we have chosen to begin the next chapter, and we cannot imagine it without you there.\n\nCome for the vows, stay for the long supper beneath the lime trees. Bring comfortable shoes for the gravel and something to dance in.',
  story: [
    { year: '2016', title: 'A borrowed umbrella', text: 'A rainy morning at the Marché des Enfants Rouges, one umbrella between two strangers, and a coffee that lasted until noon.' },
    { year: '2019', title: 'Two suitcases, one flat', text: 'We left Paris for Lyon with more books than furniture and a balcony just big enough for a lemon tree.' },
    { year: '2024', title: 'The question in the orchard', text: 'Under the plum trees at his grandmother’s house, with the whole family pretending not to watch.' },
  ],
  events: [
    { key: 'supper', name: 'Welcome supper', title: 'Supper beneath the limes', eventDate: '2027-06-11', startTime: '19:30', venueName: 'Château de Valmorin', venueAddress: '12 Route des Vignes, 37400 Amboise, France', mapLink: 'https://www.google.com/maps/search/?api=1&query=Amboise+France', description: 'A relaxed long table in the courtyard to greet everyone who has travelled. Dress is light and unfussy.' },
    { key: 'ceremony', name: 'The ceremony', title: 'Vows in the walled garden', eventDate: '2027-06-12', startTime: '16:30', venueName: 'Château de Valmorin', venueAddress: '12 Route des Vignes, 37400 Amboise, France', mapLink: 'https://www.google.com/maps/search/?api=1&query=Amboise+France', description: 'Please take your seats by 16:15. Champagne and canapés follow on the terrace, then dinner and dancing in the Grand Barn.' },
    { key: 'brunch', name: 'Farewell brunch', title: 'Slow Sunday in the orangery', eventDate: '2027-06-13', startTime: '11:00', venueName: 'L’Orangerie de Valmorin', venueAddress: 'Parc du Château de Valmorin, 37400 Amboise, France', description: 'Coffee, pastries and goodbyes, with no schedule at all.' },
  ],
  music: { enabled: true, trackId: 'garden-pad' },
  gallery: [
    { url: A('g1.svg'), alt: 'A floral arch in the garden', caption: 'The arch, early June' },
    { url: A('g2.svg'), alt: 'The château at golden hour', caption: 'Château de Valmorin' },
    { url: A('g3.svg'), alt: 'Candlelit long table', caption: 'The long table' },
    { url: A('g4.svg'), alt: 'Peonies and garden roses', caption: 'Blush and champagne' },
    { url: A('g5.svg'), alt: 'Lavender rows at dusk', caption: 'Lavender, beyond the gate' },
    { url: A('g6.svg'), alt: 'Stone steps lined with roses', caption: 'The garden steps' },
  ],
};
