import { memo } from 'react';
import { resolveTemplate } from '../templates/registry';
import { DEMO_DATA } from '../pages/TemplatePreview';

interface TemplateThumbnailProps {
  slug: string;
  name: string;
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

const TemplateThumbnail = memo(({ slug, name }: TemplateThumbnailProps) => {
  const templateDef = resolveTemplate(slug);
  const TemplateComponent = templateDef?.component;
  const data = THUMBNAIL_DATA[slug] || DEMO_DATA[slug] || (templateDef ? THUMBNAIL_DATA[templateDef.slug] || DEMO_DATA[templateDef.slug] : null);

  if (!TemplateComponent || !data) {
    // Fallback to gradient placeholder
    return (
      <div className="relative h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 to-purple-400/20"></div>
        <div className="relative z-10 text-center p-8">
          <div className="text-6xl mb-4">💒</div>
          <h3 className="text-2xl font-serif font-bold text-gray-800">{name}</h3>
        </div>
      </div>
    );
  }

  const thumbnailData = {
    ...data,
    _isThumbnail: true,
    music: { enabled: false },
    options: { ...(data.options || {}), intro: false },
  };

  return (
    <div 
      className="relative h-full overflow-hidden pointer-events-none ih-thumbnail-wrapper"
      style={{
        transform: 'scale(0.3)',
        transformOrigin: 'top left',
        width: '333%',
        height: '333%',
        isolation: 'isolate',
      }}
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
      {/* Overlay to prevent interaction */}
      <div className="absolute inset-0 bg-transparent" style={{ pointerEvents: 'none' }} />
    </div>
  );
});

TemplateThumbnail.displayName = 'TemplateThumbnail';

export default TemplateThumbnail;
