import { memo } from 'react';
import { resolveTemplate } from '../templates/registry';
import { DEMO_DATA } from '../pages/TemplatePreview';

interface TemplateThumbnailProps {
  slug: string;
  name: string;
  templateComponent?: string;
  defaultColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
  };
  defaultFonts?: {
    heading?: string;
    body?: string;
    accent?: string;
  };
  category?: string;
  description?: string;
  previewImageUrl?: string;
}

// Sample data for thumbnail previews
const THUMBNAIL_DATA: Record<string, any> = {
  'art-deco-noir': {
    couple: {
      groom: 'Alistair',
      bride: 'Genevieve',
      tagline: 'Two lives, one golden evening',
    },
    events: [
      {
        key: 'gala',
        title: 'The Wedding Ceremony & Gala',
        name: 'The Wedding Ceremony & Gala',
        date: '2027-09-18',
        eventDate: '2027-09-18',
        time: '7:00 PM',
        startTime: '7:00 PM',
        venue: 'The Grand Ziggurat Ballroom',
        venueName: 'The Grand Ziggurat Ballroom',
        address: 'One Starlight Plaza, New York',
        venueAddress: 'One Starlight Plaza, New York',
      },
    ],
    gallery: [],
    message: 'We request the honour of your presence at an evening of celebration, jazz, and midnight champagne.',
  },
  'imperial-burgundy': {
    couple: {
      groom: 'Vikramaditya',
      bride: 'Devika',
      tagline: 'A royal alliance blessed by tradition',
    },
    events: [
      {
        key: 'wedding',
        title: 'Shubh Vivaah',
        name: 'Shubh Vivaah',
        date: '2027-02-15',
        eventDate: '2027-02-15',
        time: '6:30 PM',
        startTime: '6:30 PM',
        venue: 'Umaid Mahal Palace',
        venueName: 'Umaid Mahal Palace',
        address: 'Palace Grounds, Jaipur',
        venueAddress: 'Palace Grounds, Jaipur',
      },
    ],
    gallery: [],
    message: 'With the divine blessings of our ancestors, we invite you to celebrate our union in royal splendour.',
  },
  'botanical-romance': {
    couple: {
      groom: 'Auguste',
      bride: 'Élodie',
      tagline: 'A long weekend among the roses',
    },
    events: [
      {
        key: 'ceremony',
        title: 'Vows in the Walled Garden',
        name: 'Vows in the Walled Garden',
        date: '2027-06-12',
        eventDate: '2027-06-12',
        time: '4:30 PM',
        startTime: '4:30 PM',
        venue: 'Château de Valmorin',
        venueName: 'Château de Valmorin',
        address: '12 Route des Vignes, Amboise',
        venueAddress: '12 Route des Vignes, Amboise',
      },
    ],
    gallery: [],
    message: 'Come for the vows, stay for the long supper beneath the lime trees.',
  },
  'phulkari-celebration': {
    couple: {
      groom: 'Gurbaaz',
      bride: 'Jasleen',
      tagline: 'Two souls, one destiny in eternal joy',
    },
    events: [
      {
        key: 'wedding',
        title: 'Anand Karaj & Lavaan',
        name: 'Anand Karaj & Lavaan',
        date: '2027-03-24',
        eventDate: '2027-03-24',
        time: '10:00 AM',
        startTime: '10:00 AM',
        venue: 'Gurdwara Sahib',
        venueName: 'Gurdwara Sahib',
        address: 'GT Road, Ludhiana',
        venueAddress: 'GT Road, Ludhiana',
        dressCode: 'Traditional Punjabi Formal / Pastel Turbans',
      },
    ],
    family: 'S. Harpreet Singh & Family',
    gallery: [],
    message: 'Dhol, laughter, and endless blessing await as we begin our sacred journey together.',
  },
  'coastal-pearl': {
    couple: {
      groom: 'Arjun',
      bride: 'Meera',
      tagline: 'Where the ocean meets forever',
    },
    events: [
      {
        key: 'wedding',
        title: 'Sunset Beach Vows',
        name: 'Sunset Beach Vows',
        date: '2027-04-18',
        eventDate: '2027-04-18',
        time: '5:00 PM',
        startTime: '5:00 PM',
        venue: 'Pearl Cove Pavilion',
        venueName: 'Pearl Cove Pavilion',
        address: 'Beach Road, Kovalam',
        venueAddress: 'Beach Road, Kovalam',
      },
    ],
    gallery: [],
    message: 'Join us with the ocean breeze as our witness as we promise our hearts to one another.',
  },
  'royal-maroon': {
    couple: {
      groom: 'Rohan',
      bride: 'Priya',
      tagline: 'Together Forever'
    },
    events: [
      {
        key: 'wedding',
        title: 'Wedding',
        date: '2027-02-15',
        venue: 'Grand Palace',
      }
    ],
    gallery: [],
    message: 'Join us as we celebrate'
  },
  'modern-floral': {
    couple: {
      groom: 'James',
      bride: 'Sarah',
      tagline: 'Love in Bloom'
    },
    events: [
      {
        key: 'ceremony',
        title: 'Ceremony',
        date: '2027-03-20',
        venue: 'Garden Estate',
      }
    ],
    gallery: [],
    message: 'Celebrate with us'
  },
  'classic-gold': {
    couple: {
      groom: 'Arjun',
      bride: 'Anjali',
      tagline: 'Eternal Love'
    },
    events: [
      {
        key: 'wedding',
        title: 'Wedding',
        date: '2027-04-10',
        venue: 'Royal Ballroom',
      }
    ],
    gallery: [],
    message: 'Join our celebration'
  },
  'ivory-kayal': {
    couple: {
      groom: 'Sabarish',
      bride: 'Akhila',
      tagline: 'In the sacred presence of tradition & divine blessings'
    },
    events: [
      {
        key: 'wedding',
        title: 'Auspicious Muhurtham',
        date: '2027-05-18',
        time: '9:30 AM',
        venue: 'Sri Meenakshi Kalyana Mandapam',
        address: 'Palace Road, Chennai'
      }
    ],
    gallery: [],
    message: 'Join us as we unite our lives with the blessings of our elders and loved ones.'
  },
  'marigold-courtyard': {
    couple: {
      groom: 'Kabir',
      bride: 'Tara',
      tagline: 'Two families united in vibrant celebration'
    },
    events: [
      {
        key: 'haldi',
        title: 'Haldi & Phoolon Ki Holi',
        date: '2027-06-11',
        time: '11:00 AM',
        venue: 'Marigold Courtyard',
      },
      {
        key: 'wedding',
        title: 'Shubh Vivaah',
        date: '2027-06-12',
        time: '7:00 PM',
        venue: 'Royal Haveli',
      }
    ],
    gallery: [],
    message: 'Dhol, laughter, and endless memories await! We invite you to join our festive journey.'
  },
  'midnight-vows': {
    couple: {
      groom: 'Dev',
      bride: 'Rhea',
      tagline: 'Under the starlight, our forever begins'
    },
    events: [
      {
        key: 'wedding',
        title: 'The Wedding Ceremony & Vows',
        date: '2027-07-25',
        time: '7:30 PM',
        venue: 'Starlight Pavilion',
      }
    ],
    gallery: [],
    message: 'We request the honor of your presence as we exchange our vows under the midnight sky.'
  },
  'golden-milestone': {
    couple: {
      groom: 'Aryan',
      bride: 'Malhotra',
      tagline: 'Celebrating 30 Years of Brilliance & Adventure'
    },
    events: [
      {
        key: 'gala',
        title: 'VIP Birthday Soirée & Toast',
        date: '2027-08-15',
        time: '7:30 PM',
        venue: 'The Skyview Lounge',
      }
    ],
    gallery: [],
    message: 'Raise a glass with us as we celebrate three decades of laughter and cherished memories!'
  },
  'birthday-joy': {
    couple: {
      groom: 'Aryan',
      bride: 'Malhotra',
      tagline: 'Celebrating 30 Years of Brilliance & Adventure'
    },
    events: [
      {
        key: 'gala',
        title: 'VIP Birthday Soirée & Toast',
        date: '2027-08-15',
        time: '7:30 PM',
        venue: 'The Skyview Lounge',
      }
    ],
    gallery: [],
    message: 'Raise a glass with us as we celebrate three decades of laughter and cherished memories!'
  },
  'silver-jubilee': {
    couple: {
      groom: 'Rajesh',
      bride: 'Sunita',
      tagline: 'Celebrating 25 Years of Everlasting Love & Devotion'
    },
    events: [
      {
        key: 'gala',
        title: 'Silver Jubilee Vow Renewal & Banquet',
        date: '2027-09-20',
        time: '6:00 PM',
        venue: 'The Silver Pavilion',
      }
    ],
    gallery: [],
    message: 'Join us as we celebrate twenty-five wonderful years of togetherness.'
  },
  'celestial-lullaby': {
    couple: {
      groom: 'Aarav',
      bride: 'Priya',
      tagline: 'A Little Star is on the Way to Brighten Our World'
    },
    events: [
      {
        key: 'shower',
        title: 'Baby Shower & Blessings',
        date: '2027-05-18',
        time: '3:30 PM',
        venue: 'The Glass Conservatory',
      }
    ],
    gallery: [],
    message: 'Tiny hands, tiny feet, our world is about to become complete!'
  },
  'hearth-heritage': {
    couple: {
      groom: 'The Sharma Family',
      bride: '',
      tagline: 'New Home, New Memories, Boundless Blessings'
    },
    events: [
      {
        key: 'puja',
        title: 'Griha Pravesh & Housewarming Feast',
        date: '2027-04-10',
        time: '9:30 AM',
        venue: 'Our New Home — Aashiyana',
      }
    ],
    gallery: [],
    message: 'Bricks build a house, but love and laughter turn it into a home.'
  },
  'midnight-soiree': {
    couple: {
      groom: 'Karan Singhania',
      bride: '',
      tagline: 'An Exclusive Rooftop Evening of Mixology & Starry Nights'
    },
    events: [
      {
        key: 'party',
        title: 'Midnight Rooftop Soirée',
        date: '2027-06-25',
        time: '8:00 PM',
        venue: 'The Amber Sky Lounge',
      }
    ],
    gallery: [],
    message: 'Leave the routine behind and step into the high-altitude skyline.'
  },
  'divya-mandap': {
    couple: {
      groom: 'The Gupta Family',
      bride: '',
      tagline: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ'
    },
    events: [
      {
        key: 'puja',
        title: 'Shree Satyanarayan Puja & Mahaprasad',
        date: '2027-05-05',
        time: '9:30 AM',
        venue: 'Shree Mandir Hall',
      }
    ],
    gallery: [],
    message: 'With divine grace, we cordially invite you to join in prayers and Mahaprasad.'
  },
  'heritage-reunion': {
    couple: {
      groom: 'The Kapoor Family',
      bride: 'Virasat',
      tagline: 'Three Generations United Under One Roof'
    },
    events: [
      {
        key: 'reunion',
        title: 'Grand Family Homecoming & Banquet',
        date: '2027-11-20',
        time: '11:00 AM',
        venue: 'Virasat Haveli Courtyard',
      }
    ],
    gallery: [],
    message: 'Rooted in love, growing together across generations.'
  },
  'aura-grand-gala': {
    couple: {
      groom: 'The Horizon Gala',
      bride: 'VIP Honors',
      tagline: 'An Evening of Distinction, Global Leadership & Vision'
    },
    events: [
      {
        key: 'gala',
        title: 'Annual Grand Gala & Honors Ceremony',
        date: '2027-12-12',
        time: '6:30 PM',
        venue: 'The Imperial Ballroom, The St. Regis',
      }
    ],
    gallery: [],
    message: 'By Royal Invitation Only. Join distinguished patrons and global visionaries.'
  }
};

const TemplateThumbnail = memo(({
  slug,
  name,
  templateComponent,
  defaultColors,
  defaultFonts,
  category = 'wedding',
  description,
}: TemplateThumbnailProps) => {
  // 1. Resolve archetype: try slug, then templateComponent, then category match
  const templateDef =
    resolveTemplate(slug) ||
    (templateComponent ? resolveTemplate(templateComponent) : null) ||
    resolveTemplate('imperial-burgundy');

  const TemplateComponent = templateDef?.component;
  const baseData =
    THUMBNAIL_DATA[slug] ||
    (templateDef ? THUMBNAIL_DATA[templateDef.slug] : null) ||
    DEMO_DATA[slug];

  const isCustomTheme = !THUMBNAIL_DATA[slug] && !DEMO_DATA[slug];

  // Clean name for display: e.g. "Moonlit Jasmine & Peacock Palace" -> groom: "Moonlit Jasmine", bride: "Peacock Palace"
  const cleanName = name.replace(/\b(template|theme|suite)\b/gi, '').trim();
  const nameParts = cleanName.includes('&') ? cleanName.split('&') : [cleanName, ''];
  const groom = nameParts[0]?.trim() || cleanName;
  const bride = nameParts[1]?.trim() || (category === 'wedding' ? 'Royal Celebration' : '');

  const thumbnailData = {
    ...(baseData || {}),
    title: name,
    couple: {
      groom: isCustomTheme ? groom : (baseData?.couple?.groom || groom),
      bride: isCustomTheme ? bride : (baseData?.couple?.bride || bride),
      tagline: isCustomTheme
        ? (description || 'Two Souls, One Sacred Journey')
        : (baseData?.couple?.tagline || description || 'Two Souls, One Sacred Journey'),
    },
    events:
      baseData?.events && baseData.events.length > 0 && !isCustomTheme
        ? baseData.events
        : [
            {
              key: 'main-event',
              title: name,
              name: name,
              date: '2027-11-20',
              eventDate: '2027-11-20',
              time: '6:30 PM',
              startTime: '6:30 PM',
              venue: 'The Grand Heritage Pavilion',
              venueName: 'The Grand Heritage Pavilion',
              address: 'Palace Grounds, Jaipur',
              venueAddress: 'Palace Grounds, Jaipur',
              description: description || 'Ceremony & Grand Feast',
            },
          ],
    message: description || baseData?.message || 'Join us in celebrating this auspicious occasion.',
    defaultColors,
    defaultFonts,
    _isThumbnail: true,
    music: { enabled: false },
    options: { ...(baseData?.options || {}), intro: false },
  };

  if (!TemplateComponent) {
    const primary = defaultColors?.primary || '#7A1C30';
    const accent = defaultColors?.accent || '#D4AF37';
    const bg = defaultColors?.background || '#0B0F19';
    return (
      <div
        className="relative h-full flex flex-col items-center justify-center p-6 text-center select-none"
        style={{ backgroundColor: bg, color: defaultColors?.text || '#FFFFFF' }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-lg border"
          style={{ backgroundColor: primary, borderColor: accent }}
        >
          ✨
        </div>
        <h4 className="font-serif font-bold text-lg mb-1 leading-snug line-clamp-1" style={{ color: accent }}>
          {name}
        </h4>
        <p className="text-xs opacity-70 line-clamp-2">{description || 'Bespoke Celebration Suite'}</p>
        <div className="flex gap-1.5 mt-3">
          <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: primary }} />
          <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: accent }} />
          {defaultColors?.secondary && (
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/20"
              style={{ backgroundColor: defaultColors.secondary }}
            />
          )}
        </div>
      </div>
    );
  }

  // Dynamic CSS variables so custom palette is applied to the archetype
  const customStyles: React.CSSProperties = {
    transform: 'scale(0.3)',
    transformOrigin: 'top left',
    width: '333%',
    height: '333%',
    isolation: 'isolate',
    ...(defaultColors?.primary
      ? {
          '--burg': defaultColors.primary,
          '--primary': defaultColors.primary,
          '--wine': defaultColors.secondary || defaultColors.accent || defaultColors.primary,
          '--gold': defaultColors.accent || '#D4AF37',
          '--accent': defaultColors.accent || '#D4AF37',
          '--deep': defaultColors.background || '#060A17',
          '--background': defaultColors.background || '#060A17',
          '--ivory': defaultColors.text || '#FAF7F0',
          '--cream': defaultColors.surface || '#0F1A3A',
          '--serif': defaultFonts?.heading ? `'${defaultFonts.heading}', serif` : undefined,
          '--cinzel': defaultFonts?.heading ? `'${defaultFonts.heading}', serif` : undefined,
        }
      : {}),
  };

  return (
    <div
      className="relative h-full overflow-hidden pointer-events-none ih-thumbnail-wrapper"
      aria-hidden="true"
      tabIndex={-1}
      style={customStyles}
    >
      <div
        className="absolute inset-0"
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <TemplateComponent data={thumbnailData} />
      </div>
      <div className="absolute inset-0 bg-transparent" style={{ pointerEvents: 'none' }} />
    </div>
  );
});

TemplateThumbnail.displayName = 'TemplateThumbnail';

export default TemplateThumbnail;
