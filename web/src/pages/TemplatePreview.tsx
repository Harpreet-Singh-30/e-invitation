import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { resolveTemplate } from '../templates/registry';
import { useAuth } from '../contexts/AuthContext';
import MobilePhoneMockup from '../components/MobilePhoneMockup';

export const DEMO_DATA: Record<string, any> = {
  'art-deco-noir': {
    couple: {
      groom: 'Alistair Sterling',
      bride: 'Genevieve Vance',
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
        mapLink: 'https://maps.google.com',
        description: 'Black-tie ceremony followed by midnight champagne and live jazz.',
      },
    ],
    gallery: [],
    message: 'We request the honour of your presence at an evening of celebration, jazz, and midnight champagne.',
  },
  'imperial-burgundy': {
    couple: {
      groom: 'Vikramaditya Rathore',
      bride: 'Devika Shekhawat',
      tagline: 'A royal alliance blessed by tradition and heritage',
    },
    events: [
      {
        key: 'mehendi',
        title: 'Mehendi & Sangeet Utsav',
        name: 'Mehendi & Sangeet Utsav',
        date: '2027-02-14',
        eventDate: '2027-02-14',
        time: '5:00 PM',
        startTime: '5:00 PM',
        venue: 'The Palace Courtyard',
        venueName: 'The Palace Courtyard',
        address: 'Palace Grounds, Jaipur',
        venueAddress: 'Palace Grounds, Jaipur',
      },
      {
        key: 'wedding',
        title: 'Shubh Vivaah (Royal Pheras)',
        name: 'Shubh Vivaah (Royal Pheras)',
        date: '2027-02-15',
        eventDate: '2027-02-15',
        time: '6:30 PM',
        startTime: '6:30 PM',
        venue: 'Umaid Mahal Ballroom',
        venueName: 'Umaid Mahal Ballroom',
        address: 'Palace Grounds, Jaipur',
        venueAddress: 'Palace Grounds, Jaipur',
      },
    ],
    gallery: [],
    message: 'With the divine blessings of our ancestors and family, we invite you to celebrate our union in royal splendour.',
  },
  'botanical-romance': {
    couple: {
      groom: 'Auguste Laurent',
      bride: 'Élodie Moreau',
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
        address: '12 Route des Vignes, Amboise, France',
        venueAddress: '12 Route des Vignes, Amboise, France',
        mapLink: 'https://maps.google.com',
      },
      {
        key: 'reception',
        title: 'Supper Beneath the Lime Trees',
        name: 'Supper Beneath the Lime Trees',
        date: '2027-06-12',
        eventDate: '2027-06-12',
        time: '7:30 PM',
        startTime: '7:30 PM',
        venue: 'The Orangery Terrace',
        venueName: 'The Orangery Terrace',
        address: '12 Route des Vignes, Amboise, France',
        venueAddress: '12 Route des Vignes, Amboise, France',
      },
    ],
    gallery: [],
    message: 'Come for the vows, stay for the long supper beneath the lime trees. Bring comfortable shoes for the gravel and something to dance in.',
  },
  'phulkari-celebration': {
    couple: {
      groom: 'Gurbaaz Singh',
      bride: 'Jasleen Kaur',
      tagline: 'Two souls united in eternal Anand Karaj',
    },
    events: [
      {
        key: 'jaggo',
        title: 'Sangeet & Jaggo Night',
        name: 'Sangeet & Jaggo Night',
        date: '2027-03-23',
        eventDate: '2027-03-23',
        time: '7:00 PM',
        startTime: '7:00 PM',
        venue: 'Sandhu Haveli',
        venueName: 'Sandhu Haveli',
        address: 'Model Town Extension, Ludhiana',
        venueAddress: 'Model Town Extension, Ludhiana',
      },
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
        address: 'GT Road, Ludhiana, Punjab',
        venueAddress: 'GT Road, Ludhiana, Punjab',
        dressCode: 'Traditional Punjabi Formal / Pastel Turbans',
      },
    ],
    family: 'S. Harpreet Singh & Family',
    gallery: [],
    message: 'Dhol beats, joyous laughter, and endless blessings await as we embark on this sacred journey together.',
  },
  'coastal-pearl': {
    couple: {
      groom: 'Arjun Deshmukh',
      bride: 'Meera Nambiar',
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
        address: 'Beach Road, Kovalam, Kerala',
        venueAddress: 'Beach Road, Kovalam, Kerala',
      },
    ],
    gallery: [],
    message: 'With the rhythmic waves as our witness, we invite you to join us as we begin our forever.',
  },
  'royal-maroon': {
    couple: {
      groom: 'Rohan Kumar',
      bride: 'Priya Sharma',
      tagline: 'Two hearts, one love'
    },
    events: [
      {
        key: 'haldi',
        title: 'Haldi Ceremony',
        date: '2027-02-13',
        time: '10:00 AM',
        venue: 'Family Residence',
        address: '123 Garden Street, Mumbai',
        mapUrl: '#'
      },
      {
        key: 'wedding',
        title: 'Wedding Ceremony',
        date: '2027-02-15',
        time: '6:00 PM',
        venue: 'The Grand Palace',
        address: '456 Royal Avenue, Mumbai',
        mapUrl: '#'
      },
      {
        key: 'reception',
        title: 'Reception',
        date: '2027-02-16',
        time: '7:00 PM',
        venue: 'The Grand Palace',
        address: '456 Royal Avenue, Mumbai',
        mapUrl: '#'
      }
    ],
    gallery: [],
    message: 'We are delighted to invite you to celebrate our special day with us. Your presence will make our celebration complete!'
  },
  'modern-floral': {
    couple: {
      groom: 'James Anderson',
      bride: 'Sarah Williams',
      tagline: 'Love is in the air'
    },
    events: [
      {
        key: 'ceremony',
        title: 'Wedding Ceremony',
        date: '2027-03-20',
        time: '4:00 PM',
        venue: 'Garden Estate',
        address: '789 Blossom Lane, Bangalore',
        mapUrl: '#'
      },
      {
        key: 'reception',
        title: 'Reception Party',
        date: '2027-03-20',
        time: '7:00 PM',
        venue: 'Garden Estate',
        address: '789 Blossom Lane, Bangalore',
        mapUrl: '#'
      }
    ],
    gallery: [],
    message: 'Join us as we begin our journey together. Your blessings mean the world to us!'
  },
  'classic-gold': {
    couple: {
      groom: 'Arjun Mehta',
      bride: 'Anjali Verma',
      tagline: 'Forever begins here'
    },
    events: [
      {
        key: 'wedding',
        title: 'Wedding Ceremony',
        date: '2027-04-10',
        time: '5:30 PM',
        venue: 'Royal Ballroom',
        address: '321 Palace Road, Delhi',
        mapUrl: '#'
      },
      {
        key: 'reception',
        title: 'Grand Reception',
        date: '2027-04-11',
        time: '7:00 PM',
        venue: 'Royal Ballroom',
        address: '321 Palace Road, Delhi',
        mapUrl: '#'
      }
    ],
    gallery: [],
    message: 'We request the honor of your presence as we exchange our wedding vows'
  },
  'ivory-kayal': {
    couple: {
      groom: 'Sabarish Kumar',
      bride: 'Akhila Nair',
      tagline: 'In the sacred presence of tradition, family & divine grace'
    },
    events: [
      {
        key: 'oonjal',
        title: 'Oonjal & Vrutham',
        date: '2027-05-17',
        time: '4:30 PM',
        venue: 'Sri Meenakshi Mandapam',
        address: 'Palace Road, Chennai, Tamil Nadu',
        mapUrl: '#'
      },
      {
        key: 'wedding',
        title: 'Auspicious Muhurtham',
        date: '2027-05-18',
        time: '9:30 AM - 10:45 AM',
        venue: 'Sri Meenakshi Mandapam',
        address: 'Palace Road, Chennai, Tamil Nadu',
        mapUrl: '#'
      },
      {
        key: 'reception',
        title: 'Wedding Reception',
        date: '2027-05-18',
        time: '6:30 PM',
        venue: 'The Grand Chola Ballroom',
        address: 'Guindy, Chennai, Tamil Nadu',
        mapUrl: '#'
      }
    ],
    gallery: [],
    message: 'With the blessings of our ancestors, parents, and elders, we joyfully invite you to celebrate our sacred marriage and bestow your heartfelt blessings upon our union.'
  },
  'marigold-courtyard': {
    couple: {
      groom: 'Kabir Singhania',
      bride: 'Tara Malhotra',
      tagline: 'Two families united in vibrant laughter & eternal celebration'
    },
    events: [
      {
        key: 'haldi',
        title: 'Haldi & Phoolon Ki Holi',
        date: '2027-06-11',
        time: '11:00 AM',
        venue: 'The Courtyard Lawns',
        address: 'Heritage Haveli, Jaipur, Rajasthan',
        mapUrl: '#'
      },
      {
        key: 'sangeet',
        title: 'Sangeet & Cocktail Night',
        date: '2027-06-11',
        time: '7:30 PM',
        venue: 'Royal Palace Ballroom',
        address: 'Heritage Haveli, Jaipur, Rajasthan',
        mapUrl: '#'
      },
      {
        key: 'wedding',
        title: 'Shubh Vivaah (The Pheras)',
        date: '2027-06-12',
        time: '6:00 PM',
        venue: 'The Mandap Pavilion',
        address: 'Heritage Haveli, Jaipur, Rajasthan',
        mapUrl: '#'
      },
      {
        key: 'reception',
        title: 'Grand Reception Dinner',
        date: '2027-06-13',
        time: '7:30 PM',
        venue: 'The Courtyard Lawns',
        address: 'Heritage Haveli, Jaipur, Rajasthan',
        mapUrl: '#'
      }
    ],
    gallery: [],
    message: 'Dhol beats, marigold blossoms, and endless celebrations await! We warmly invite you and your family to join us as we celebrate our new beginnings.'
  },
  'midnight-vows': {
    couple: {
      groom: 'Dev Rathore',
      bride: 'Rhea Kapoor',
      tagline: 'Under the midnight sky, our forever begins'
    },
    events: [
      {
        key: 'cocktail',
        title: 'Twilight Soirée',
        date: '2027-07-24',
        time: '6:30 PM',
        venue: 'Obsidian Terrace',
        address: '100 Starlight Promenade, Mumbai',
        mapUrl: '#'
      },
      {
        key: 'wedding',
        title: 'The Wedding Ceremony & Vows',
        date: '2027-07-25',
        time: '7:00 PM',
        venue: 'The Grand Starlight Pavilion',
        address: '100 Starlight Promenade, Mumbai',
        mapUrl: '#'
      },
      {
        key: 'reception',
        title: 'Midnight Gala & Dinner',
        date: '2027-07-25',
        time: '9:00 PM',
        venue: 'The Grand Starlight Pavilion',
        address: '100 Starlight Promenade, Mumbai',
        mapUrl: '#'
      }
    ],
    gallery: [],
    message: 'We request the honor of your presence as we exchange our wedding vows under the stars and celebrate the beginning of our forever journey together.'
  },
  'golden-milestone': {
    couple: {
      groom: 'Aryan Malhotra',
      bride: '',
      tagline: 'Celebrating 30 Years of Brilliance, Laughter & Adventure',
    },
    events: [
      {
        key: 'cocktails',
        title: 'Welcome Cocktails & Canapés',
        date: '2027-08-15',
        time: '7:30 PM',
        venue: 'The Skyview Lounge & Terrace',
        address: 'Floor 42, Starlight Tower, Marine Drive',
        mapUrl: 'https://maps.google.com',
        description: 'Chilled champagne, artisanal cocktails, and live saxophone as sunset warms the skyline.'
      },
      {
        key: 'cake-toast',
        title: 'Birthday Toast & Cake Cutting',
        date: '2027-08-15',
        time: '9:00 PM',
        venue: 'The Gold Ballroom',
        address: 'Starlight Tower, Marine Drive',
        mapUrl: 'https://maps.google.com',
        description: 'A special toast to memories past and adventures ahead, followed by dessert and sparklers.'
      }
    ],
    gallery: [],
    message: 'Another year of adventures, cherished friendships, and unforgettable memories! Raise a glass with us as we celebrate this milestone evening.'
  },
  'birthday-joy': {
    couple: {
      groom: 'Aryan Malhotra',
      bride: '',
      tagline: 'Celebrating 30 Years of Brilliance, Laughter & Adventure',
    },
    events: [
      {
        key: 'cocktails',
        title: 'Welcome Cocktails & Canapés',
        date: '2027-08-15',
        time: '7:30 PM',
        venue: 'The Skyview Lounge & Terrace',
        address: 'Floor 42, Starlight Tower, Marine Drive',
        mapUrl: 'https://maps.google.com',
      }
    ],
    gallery: [],
    message: 'Another year of adventures, cherished friendships, and unforgettable memories!'
  },
  'silver-jubilee': {
    couple: {
      groom: 'Rajesh Sharma',
      bride: 'Sunita Sharma',
      tagline: 'Celebrating 25 Years of Everlasting Love, Laughter & Devotion',
    },
    events: [
      {
        key: 'vow-renewal',
        title: 'Silver Jubilee Vow Renewal & Blessings',
        date: '2027-09-20',
        time: '5:30 PM',
        venue: 'The Silver Pavilion',
        address: 'The Grand Regency, MG Road, Bangalore',
        mapUrl: 'https://maps.google.com',
        description: 'Exchange of silver garlands and renewal of sacred vows in the presence of family and friends.'
      },
      {
        key: 'banquet',
        title: 'Gala Banquet & Celebratory Toasts',
        date: '2027-09-20',
        time: '7:30 PM',
        venue: 'The Crystal Ballroom',
        address: 'The Grand Regency, MG Road, Bangalore',
        mapUrl: 'https://maps.google.com',
        description: 'An evening of nostalgic family stories, toasts, acoustic melodies, and a gourmet banquet.'
      }
    ],
    gallery: [],
    message: 'Twenty-five years of shared dreams, laughter, and lifelong devotion. Join us as we celebrate our silver jubilee milestone.'
  },
  'celestial-lullaby': {
    couple: {
      groom: 'Aarav',
      bride: 'Priya',
      tagline: 'A Little Star is on the Way to Brighten Our World',
    },
    events: [
      {
        key: 'blessings',
        title: 'Baby Shower & Traditional Blessings',
        date: '2027-05-18',
        time: '3:30 PM',
        venue: 'The Garden Conservatory',
        address: 'Rosewood Estate, Whitefield, Bangalore',
        mapUrl: 'https://maps.google.com',
        description: 'Blessing ceremony with fragrant flowers, traditional sweets, and warm wishes.'
      },
      {
        key: 'hightea',
        title: 'Playful Shower Games & High Tea',
        date: '2027-05-18',
        time: '5:00 PM',
        venue: 'The Glass Pavilion Terrace',
        address: 'Rosewood Estate, Whitefield, Bangalore',
        mapUrl: 'https://maps.google.com',
        description: 'Baby trivia games, artisanal pastries, mocktails, and cake cutting.'
      }
    ],
    gallery: [],
    message: 'Ten little fingers, ten little toes, our hearts are overflowing as our family grows! Please join us for an afternoon of games, sweets, laughter, and blessings.'
  },
  'hearth-heritage': {
    couple: {
      groom: 'The Sharma Family',
      bride: '',
      tagline: 'New Home, New Memories, Boundless Love & Blessings',
    },
    events: [
      {
        key: 'puja',
        title: 'Griha Pravesh & Vastu Havan',
        date: '2027-04-10',
        time: '9:30 AM',
        venue: 'Our New Home — Aashiyana',
        address: 'Villa 42, Palm Meadows, Sarjapur Road, Bangalore',
        mapUrl: 'https://maps.google.com',
        description: 'Sacred Vastu Shanti puja, boiling of milk ritual, and divine blessings for health and harmony.'
      },
      {
        key: 'dinner',
        title: 'House Tour & Celebratory Dinner Feast',
        date: '2027-04-10',
        time: '6:30 PM',
        venue: 'Our New Home — Aashiyana',
        address: 'Villa 42, Palm Meadows, Sarjapur Road, Bangalore',
        mapUrl: 'https://maps.google.com',
        description: 'Explore our new abode followed by an authentic celebratory dinner feast.'
      }
    ],
    gallery: [],
    message: 'Bricks and mortar build a house, but love, laughter, and lifelong friends turn it into a home. Please grace our new threshold with your presence.'
  },
  'midnight-soiree': {
    couple: {
      groom: 'Karan Singhania',
      bride: '',
      tagline: 'An Exclusive Rooftop Evening of Artisanal Cocktails, Vinyl Beats & Starry Nights',
    },
    events: [
      {
        key: 'sundowner',
        title: 'Sundowner Cocktails & Tapas',
        date: '2027-06-25',
        time: '6:30 PM',
        venue: 'The Amber Sky Lounge',
        address: 'Level 28, Zenith Tower, Worli, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Signature mixology drinks, wood-fired bites, and deep house music against the skyline sunset.'
      },
      {
        key: 'dance',
        title: 'Midnight DJ Set & Dance Floor',
        date: '2027-06-25',
        time: '9:30 PM Till Late',
        venue: 'The Obsidian Room',
        address: 'Level 28, Zenith Tower, Worli, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Live percussionist, guest DJ, craft cocktail station, and non-stop celebration.'
      }
    ],
    gallery: [],
    message: 'Leave the routine behind and step into the high-altitude skyline for an electric night of signature cocktails, vinyl beats, and great company.'
  },
  'divya-mandap': {
    couple: {
      groom: 'The Gupta Family',
      bride: '',
      tagline: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ • निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा',
    },
    events: [
      {
        key: 'puja',
        title: 'Shree Ganesh Sthapana & Maha Havan',
        date: '2027-05-05',
        time: '9:30 AM',
        venue: 'Shree Krishna Mandir Hall',
        address: 'Temple Road, Malleshwaram, Bangalore',
        mapUrl: 'https://maps.google.com',
        description: 'Auspicious Vedic chants, sacred fire ritual (Havan), and divine blessings for peace and prosperity.'
      },
      {
        key: 'prasad',
        title: 'Bhajan Sandhya, Maha Aarti & Prasad',
        date: '2027-05-05',
        time: '12:00 PM',
        venue: 'Anand Mandap Dining Hall',
        address: 'Temple Road, Malleshwaram, Bangalore',
        mapUrl: 'https://maps.google.com',
        description: 'Soulful devotional bhajans, grand Maha Aarti, followed by traditional Mahaprasad feast.'
      }
    ],
    gallery: [],
    message: 'With divine grace and blessings of our elders, we cordially request you and your family to join us in prayers, seek blessings, and partake in Mahaprasad.'
  },
  'heritage-reunion': {
    couple: {
      groom: 'The Kapoor & Mehra Heritage',
      bride: '',
      tagline: 'Rooted in Love, Growing Together Across Generations',
    },
    events: [
      {
        key: 'arrival-blessings',
        title: 'Ancestor Gratitude & Lamp Lighting',
        date: '2027-11-20',
        time: '11:00 AM',
        venue: 'Heritage Courtyard',
        address: 'Virasat Haveli, Amer Road, Jaipur',
        mapUrl: 'https://maps.google.com',
        description: 'Lighting the sacred generational diya, honoring our elders, and sharing heirloom memories.'
      },
      {
        key: 'family-portrait',
        title: 'Generations Portrait & Story Circle',
        date: '2027-11-20',
        time: '4:30 PM',
        venue: 'The Grand Banyan Lawn',
        address: 'Virasat Haveli, Amer Road, Jaipur',
        mapUrl: 'https://maps.google.com',
        description: 'Formal family tree portraits across four generations, followed by open mic stories and old home videos.'
      },
      {
        key: 'reunion-banquet',
        title: 'Royal Feast & Folk Sangeet',
        date: '2027-11-20',
        time: '7:30 PM',
        venue: 'Maharaja Banquet Hall',
        address: 'Virasat Haveli, Amer Road, Jaipur',
        mapUrl: 'https://maps.google.com',
        description: 'Traditional Rajasthani thali dinner, acoustic folk performances, and celebratory dance until late.'
      }
    ],
    gallery: [],
    message: 'A tree is known by its roots, and a family by its values. As we gather from different corners of the world to celebrate our shared heritage, your presence will complete this sacred circle of joy.'
  },
  'retro-synth-arcade': {
    couple: {
      groom: 'Rohan',
      bride: 'Level 25',
      tagline: 'Leveling up to quarter-century greatness with 80s arcade vibes'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Retro Synthwave Arcade',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: '80s Cyber Neon & Synthwave Arcade Party with pixel beats and retro cocktails'
      }
    ],
    gallery: [],
    message: '80s Cyber Neon & Synthwave Arcade Party with pixel beats and retro cocktails'
  },
  'enchanted-storybook-birthday': {
    couple: {
      groom: 'Ananya',
      bride: 'Sweet 16',
      tagline: 'Stepping into a magical chapter filled with fairy lights and butterflies'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Enchanted Storybook Garden',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Whimsical fairy tale garden celebration with stardust lights, butterflies, and high tea'
      }
    ],
    gallery: [],
    message: 'Whimsical fairy tale garden celebration with stardust lights, butterflies, and high tea'
  },
  'safari-wild-one': {
    couple: {
      groom: 'Kabir',
      bride: 'Wild One',
      tagline: 'Our little cub is turning one! Join our wild safari celebration.'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Safari Little Explorer',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Wild safari explorer 1st birthday adventure with khaki textures, sunburst tones, and jungle games'
      }
    ],
    gallery: [],
    message: 'Wild safari explorer 1st birthday adventure with khaki textures, sunburst tones, and jungle games'
  },
  'vintage-distillery-milestone': {
    couple: {
      groom: 'Vikramaditya',
      bride: '50th Vintage',
      tagline: 'Distilled with passion, aged with wisdom, poured with gratitude'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Aged to Perfection',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Distillery oak, amber bourbon, and leather gentleman milestone celebration'
      }
    ],
    gallery: [],
    message: 'Distillery oak, amber bourbon, and leather gentleman milestone celebration'
  },
  'golden-jubilee-50th': {
    couple: {
      groom: 'Ramesh',
      bride: 'Kavita',
      tagline: 'Half a century of shared dreams, boundless laughter, and steadfast love'
    },
    events: [
      {
        key: 'celebration-event',
        title: '50th Golden Jubilee',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Half a century of devotion with 24K polished gold, royal emerald, and grand gala banquet'
      }
    ],
    gallery: [],
    message: 'Half a century of devotion with 24K polished gold, royal emerald, and grand gala banquet'
  },
  'ruby-romance-40th': {
    couple: {
      groom: 'Sanjay',
      bride: 'Radhika',
      tagline: 'Four decades of shared triumphs, deep companionship, and endless love'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Ruby Romance 40th',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: '40 years of passion and devotion with deep crimson velvet, faceted ruby seal, and romance strings'
      }
    ],
    gallery: [],
    message: '40 years of passion and devotion with deep crimson velvet, faceted ruby seal, and romance strings'
  },
  'boho-sunset-vows': {
    couple: {
      groom: 'Neil',
      bride: 'Tara',
      tagline: 'Ten years of adventures, still choosing each other every single day'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Bohemian Sunset Vows',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Pampas grass, warm desert terracotta, and acoustic twilight sunset vow renewal'
      }
    ],
    gallery: [],
    message: 'Pampas grass, warm desert terracotta, and acoustic twilight sunset vow renewal'
  },
  'monochrome-film-noir-anniversary': {
    couple: {
      groom: 'Arjun',
      bride: 'Zoya',
      tagline: '25 years of romance, laughter, and timeless cinema moments'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Cinematic Noir Anniversary',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Vintage Hollywood romance and classic black & white cinema anniversary celebration'
      }
    ],
    gallery: [],
    message: 'Vintage Hollywood romance and classic black & white cinema anniversary celebration'
  },
  'woodland-fable-shower': {
    couple: {
      groom: 'Karan',
      bride: 'Megha',
      tagline: 'Welcoming our little woodland fawn with acorns, moss, and infinite love'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Woodland Fable Shower',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Whimsical forest baby shower with moss green, baby deer wax seal, and woodland chimes'
      }
    ],
    gallery: [],
    message: 'Whimsical forest baby shower with moss green, baby deer wax seal, and woodland chimes'
  },
  'royal-little-prince-princess': {
    couple: {
      groom: 'Vikram',
      bride: 'Ananya',
      tagline: 'Our little royal miracle is about to make their grand entrance'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Royal Nursery Crown',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Regal crown baby shower with powder navy, tiara gold, and royal nursery lullaby'
      }
    ],
    gallery: [],
    message: 'Regal crown baby shower with powder navy, tiara gold, and royal nursery lullaby'
  },
  'sunshine-meadow-shower': {
    couple: {
      groom: 'Sameer',
      bride: 'Pooja',
      tagline: 'Here comes the sun, and we say it is more than all right'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Here Comes The Sun',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Sunshine, daisy wildflower bloom, and bright morning joy baby celebration'
      }
    ],
    gallery: [],
    message: 'Sunshine, daisy wildflower bloom, and bright morning joy baby celebration'
  },
  'boho-rainbow-miracle': {
    couple: {
      groom: 'Aditya',
      bride: 'Ishita',
      tagline: 'Our greatest adventure and brightest miracle is almost here'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Boho Rainbow Miracle',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Earth-toned boho rainbow miracle baby shower with clay warmth and pastel blessings'
      }
    ],
    gallery: [],
    message: 'Earth-toned boho rainbow miracle baby shower with clay warmth and pastel blessings'
  },
  'scandi-minimal-haven': {
    couple: {
      groom: 'Dhruv & Alisha',
      bride: '',
      tagline: 'A warm sanctuary of peace, coffee, and quiet joy'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Scandi Minimalist Sanctuary',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Nordic warm minimalism, olive linen, and brass house key sanctuary housewarming'
      }
    ],
    gallery: [],
    message: 'Nordic warm minimalism, olive linen, and brass house key sanctuary housewarming'
  },
  'rajasthani-jharokha-griha': {
    couple: {
      groom: 'The Rathore Family',
      bride: '',
      tagline: 'May this abode resonate with peace, prosperity, and auspicious footsteps'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Rajasthani Jharokha Griha',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Royal Jaipur Haveli Griha Pravesh with carved jharokha arches, kalash seal, and sacred shehnai'
      }
    ],
    gallery: [],
    message: 'Royal Jaipur Haveli Griha Pravesh with carved jharokha arches, kalash seal, and sacred shehnai'
  },
  'urban-terrace-soiree': {
    couple: {
      groom: 'Kunal & Maya',
      bride: '',
      tagline: 'High above the bustling city, we have found our quiet perch'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Urban Terrace Loft',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'City view loft and rooftop patio housewarming with copper lights and skyline sundowners'
      }
    ],
    gallery: [],
    message: 'City view loft and rooftop patio housewarming with copper lights and skyline sundowners'
  },
  'coastal-breeze-home': {
    couple: {
      groom: 'Vivek & Priya',
      bride: '',
      tagline: 'Listening to the ocean tide from our front porch every morning'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Coastal Sea Breeze Haven',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Sea glass, anchor token, and sunlit coastal deck villa housewarming'
      }
    ],
    gallery: [],
    message: 'Sea glass, anchor token, and sunlit coastal deck villa housewarming'
  },
  'tropical-sunset-luau': {
    couple: {
      groom: 'Summer Sundowner',
      bride: 'Tiki Island',
      tagline: 'When the sun dips low, the tiki torches blaze and the party begins'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Tropical Sunset Luau',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Tiki sunset, neon flamingo, fire dancers, and tropical beach party'
      }
    ],
    gallery: [],
    message: 'Tiki sunset, neon flamingo, fire dancers, and tropical beach party'
  },
  'studio54-disco-glam': {
    couple: {
      groom: 'The Disco Soirée',
      bride: 'VIP Night',
      tagline: 'Dust off your sequins and platform shoes for an unforgettable night beneath the mirror ball'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Studio 54 Disco Glam',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Spinning mirror ball, purple strobe, sequins, and non-stop disco groove'
      }
    ],
    gallery: [],
    message: 'Spinning mirror ball, purple strobe, sequins, and non-stop disco groove'
  },
  'speakeasy-roaring-twenties': {
    couple: {
      groom: 'The Midnight Syndicate',
      bride: '',
      tagline: 'Slip through the hidden door into a world of craft prohibition cocktails'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Roaring 20s Speakeasy',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Secret 1920s prohibition lounge, vintage jazz, and password entrance pass'
      }
    ],
    gallery: [],
    message: 'Secret 1920s prohibition lounge, vintage jazz, and password entrance pass'
  },
  'poolside-sun-drenched-bash': {
    couple: {
      groom: 'Summer Splash',
      bride: 'Infinity Pool',
      tagline: 'Cool water, warm sun, chilled Aperol spritzers, and sunset beats'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Palm Springs Poolside Bash',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Turquoise waters, cabana loungers, and deep house poolside party'
      }
    ],
    gallery: [],
    message: 'Turquoise waters, cabana loungers, and deep house poolside party'
  },
  'shree-ganesh-vandana': {
    couple: {
      groom: 'The Sharma Family',
      bride: '',
      tagline: 'Inviting Lord Ganesha into our home to bestow wisdom, health, and prosperity'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Shree Ganesh Sthapana',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Modak, marigold yellow, and sacred Shankh Ganesh Sthapana with Vedic Om mantra'
      }
    ],
    gallery: [],
    message: 'Modak, marigold yellow, and sacred Shankh Ganesh Sthapana with Vedic Om mantra'
  },
  'waheguru-anand-blessings': {
    couple: {
      groom: 'S. Gurmukh Singh & Family',
      bride: '',
      tagline: 'Bhog Sri Akhand Path Sahib followed by soulful Kirtan & Guru Ka Langar'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Akhand Path & Kirtan Darbar',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Sri Akhand Path Sahib, classical raga kirtan darbar, and Guru Ka Langar'
      }
    ],
    gallery: [],
    message: 'Sri Akhand Path Sahib, classical raga kirtan darbar, and Guru Ka Langar'
  },
  'cathedral-grace-communion': {
    couple: {
      groom: 'Ethan Michael',
      bride: 'First Communion',
      tagline: 'Receiving the Holy Sacrament of First Communion surrounded by loved ones'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Sacred Holy Communion',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Stained glass royal sapphire, holy dove seal, and cathedral communion mass'
      }
    ],
    gallery: [],
    message: 'Stained glass royal sapphire, holy dove seal, and cathedral communion mass'
  },
  'noor-e-mehfil-nikah-eid': {
    couple: {
      groom: 'The Al-Mansoor Family',
      bride: '',
      tagline: 'A joyful evening of heartfelt Duas, Naat recitation, and Dastarkhwan feast'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Noor-e-Mehfil Islamic Gala',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Crescent moon, Islamic geometric arabesque, Naat recitation, and Dastarkhwan banquet'
      }
    ],
    gallery: [],
    message: 'Crescent moon, Islamic geometric arabesque, Naat recitation, and Dastarkhwan banquet'
  },
  'vintage-roots-family-archive': {
    couple: {
      groom: 'The Deshmukh Ancestry',
      bride: 'Centennial Reunion',
      tagline: '100 years since our ancestral roots were planted, four generations united'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Vintage Roots Family Archive',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Antique leatherbound family album, sepia memories, and centennial clan reunion'
      }
    ],
    gallery: [],
    message: 'Antique leatherbound family album, sepia memories, and centennial clan reunion'
  },
  'sunlit-picnic-carnival': {
    couple: {
      groom: 'The Sharma & Verma Clans',
      bride: 'Summer Carnival',
      tagline: 'Sunny meadows, barbecue smoke, lawn games, and cousins reunited'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Sunlit Lawn Carnival',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Gingham lawn games, barbecue smoke, tug-of-war, and family carnival day'
      }
    ],
    gallery: [],
    message: 'Gingham lawn games, barbecue smoke, tug-of-war, and family carnival day'
  },
  'festive-diwali-family-milan': {
    couple: {
      groom: 'The Aggarwal Parivaar',
      bride: 'Diwali Sneh Milan',
      tagline: 'Lighting a thousand lamps together, celebrating the triumph of love and light'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Diwali Sneh Milan',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'A thousand golden diyas, sweets exchange, sparklers, and festive kinship banquet'
      }
    ],
    gallery: [],
    message: 'A thousand golden diyas, sweets exchange, sparklers, and festive kinship banquet'
  },
  'generations-anchored-reunion': {
    couple: {
      groom: 'The Sen & Mukherjee Families',
      bride: 'Lakeside Retreat',
      tagline: 'Gathered by the shimmering waters for bonfires, boat rides, and stories'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Nautical Generations Anchorage',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Lakeside cottages, brass anchor crest, sunset boat rides, and generational bonfire'
      }
    ],
    gallery: [],
    message: 'Lakeside cottages, brass anchor crest, sunset boat rides, and generational bonfire'
  },
  'commencement-excellence': {
    couple: {
      groom: 'Dr. Siddharth Rao',
      bride: 'Doctor of Medicine',
      tagline: 'A decade of dedication culminated in the conferral of honors'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Commencement Academic Honors',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Academic mortarboard, navy and gold foil, and graduation conferral gala'
      }
    ],
    gallery: [],
    message: 'Academic mortarboard, navy and gold foil, and graduation conferral gala'
  },
  'philanthropy-crystal-ball': {
    couple: {
      groom: 'The Hope Foundation',
      bride: 'Annual Benefit',
      tagline: 'An evening of classical grace dedicated to funding children\'s education'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Crystal Philanthropy Ball',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Emerald velvet, crystal chandelier gala, and benefactor charity auction'
      }
    ],
    gallery: [],
    message: 'Emerald velvet, crystal chandelier gala, and benefactor charity auction'
  },
  'tech-summit-future-vision': {
    couple: {
      groom: 'Global Tech Visionaries',
      bride: 'Horizon 2030',
      tagline: 'Convening the world\'s most ambitious founders and technology leaders'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Executive Tech Vision Summit',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Horizon 2030 closed-door executive summit on AI, robotics, and future technology'
      }
    ],
    gallery: [],
    message: 'Horizon 2030 closed-door executive summit on AI, robotics, and future technology'
  },
  'bon-voyage-wanderlust': {
    couple: {
      groom: 'Captain Rajesh Malhotra',
      bride: 'World Tour',
      tagline: 'Celebrating 35 years of dedicated career and embarking on a world cruise'
    },
    events: [
      {
        key: 'celebration-event',
        title: 'Bon Voyage & Wanderlust',
        date: '2027-08-15',
        time: '6:30 PM',
        venue: 'The Grand Celebration Pavilion',
        address: 'Palace Road, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Vintage atlas, compass medallion, and world sabbatical bon voyage toast'
      }
    ],
    gallery: [],
    message: 'Vintage atlas, compass medallion, and world sabbatical bon voyage toast'
  },
  'aura-grand-gala': {
    couple: {
      groom: 'The Grand Aura Gala & Honors',
      bride: 'Horizon Foundation & Global Guild',
      tagline: 'An Evening of Distinction, Global Leadership & Vision',
    },
    events: [
      {
        key: 'red-carpet',
        title: 'Red Carpet Arrivals & Champagne Reception',
        date: '2027-12-12',
        time: '6:30 PM',
        venue: 'The Grand Rotunda & Foyer',
        address: 'The St. Regis Hotel, Lower Parel, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Step into the spotlight with media photo-calls, craft cocktail aperitifs, and live string quartet.'
      },
      {
        key: 'keynote-awards',
        title: 'Keynote Address & Annual Honors Ceremony',
        date: '2027-12-12',
        time: '7:45 PM',
        venue: 'The Imperial Ballroom',
        address: 'The St. Regis Hotel, Lower Parel, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Inspiring keynote address followed by the presentation of the Global Visionary & Lifetime Excellence Awards.'
      },
      {
        key: 'gala-banquet',
        title: '5-Course Chef Tasting Dinner & Soirée',
        date: '2027-12-12',
        time: '9:15 PM',
        venue: 'The Astor Pavilion',
        address: 'The St. Regis Hotel, Lower Parel, Mumbai',
        mapUrl: 'https://maps.google.com',
        description: 'Artisan culinary experience paired with fine reserves, followed by live jazz ensemble and midnight lounge.'
      }
    ],
    gallery: [],
    message: 'You are cordially invited to celebrate excellence, visionary leadership, and milestone achievements alongside global leaders, innovators, and distinguished guests.'
  }
};

const TEMPLATE_INFO: Record<string, any> = {
  'art-deco-noir': {
    name: 'Art Deco Noir',
    description: '1920s Great Gatsby luxury with obsidian black, warm champagne gold, geometric ziggurats, and entrance gate',
    category: 'wedding',
    themeId: 'd52c90fe-2f7a-4de7-adc7-149f6c24a93e',
  },
  'imperial-burgundy': {
    name: 'Imperial Burgundy',
    description: 'Grand royal Indian palace celebration with velvet burgundy, antique gold filigree, and double palace doors',
    category: 'wedding',
    themeId: '5128f3b2-868d-41f4-b7e5-bd3893c33313',
  },
  'botanical-romance': {
    name: 'Botanical Romance',
    description: 'Contemporary romantic garden theme with soft sage green, blush rose, delicate botanicals, and ambient sound',
    category: 'wedding',
    themeId: 'e5a3820b-ab0c-4c13-9626-0c796d269ff9',
  },
  'phulkari-celebration': {
    name: 'Phulkari Celebration',
    description: 'Vibrant Punjabi wedding theme with authentic Phulkari cross-stitch embroidery and festive itinerary',
    category: 'wedding',
    themeId: 'c9643353-1765-440f-b1ac-0477df0f2525',
  },
  'coastal-pearl': {
    name: 'Coastal Pearl',
    description: 'Serene coastal destination theme with oceanic wave reveal, delicate shell fans, and pearl strands',
    category: 'wedding',
    themeId: '91049c3e-54cd-4a29-add1-972d4fce0a22',
  },
  'royal-maroon': {
    name: 'Royal Maroon',
    description: 'Elegant traditional Indian wedding theme with rich maroon and gold accents',
    category: 'wedding',
    themeId: 'b9be246b-3340-4fcb-b96f-2281f614e3de'
  },
  'modern-floral': {
    name: 'Modern Floral',
    description: 'Contemporary romantic theme with soft floral elements and pastel colors',
    category: 'wedding',
    themeId: 'f4f4d356-3b5f-469f-8bfe-75ca6b64866d'
  },
  'classic-gold': {
    name: 'Classic Gold',
    description: 'Timeless elegance with champagne gold accents and ornate borders',
    category: 'wedding',
    themeId: '6eafa011-98a1-4e43-b71b-c6880ff80fd1'
  },
  'ivory-kayal': {
    name: 'Ivory Kayal',
    description: 'South Indian heritage theme with warm ivory tones, muted sage green, and antique gold accents',
    category: 'wedding',
    themeId: '093b32a3-1925-4b85-9f6a-d729db2be9be'
  },
  'marigold-courtyard': {
    name: 'Marigold Courtyard',
    description: 'Festive Indian wedding theme with vibrant marigold orange, terracotta, and multi-event celebrations',
    category: 'wedding',
    themeId: '58b36b41-1ea3-4279-862e-5674a63a9d6a'
  },
  'midnight-vows': {
    name: 'Midnight Vows',
    description: 'Cinematic luxury theme with deep midnight navy, dark plum undertones, and starlight champagne gold',
    category: 'wedding',
    themeId: '1056bc70-959d-42e4-9a2f-058418ceba6e'
  },
  'golden-milestone': {
    name: 'Golden Milestone Soirée',
    description: 'Glamorous milestone birthday celebration with obsidian velvet, champagne gold foil, toast countdown, and party line-up',
    category: 'birthday',
    themeId: 'ba5fb147-fc1d-401d-a6a4-6728d0891651'
  },
  'birthday-joy': {
    name: 'Golden Milestone Soirée',
    description: 'Glamorous milestone birthday celebration with obsidian velvet, champagne gold foil, toast countdown, and party line-up',
    category: 'birthday',
    themeId: 'ba5fb147-fc1d-401d-a6a4-6728d0891651'
  },
  'silver-jubilee': {
    name: 'Silver Jubilee Elegance',
    description: 'Timeless milestone anniversary theme with polished sterling silver, love journey timeline, and vow renewal banquet',
    category: 'anniversary',
    themeId: 'a1140001-2525-4444-9999-511verjub101'
  },
  'celestial-lullaby': {
    name: 'Celestial Lullaby',
    description: 'Whimsical baby shower theme with pastel cloud mist, crescent moon starlight, storybook envelope, and high tea program',
    category: 'baby_shower',
    themeId: 'baba0001-3333-4444-9999-ce1e5t1a1001'
  },
  'hearth-heritage': {
    name: 'Hearth & Heritage',
    description: 'Warm Griha Pravesh theme with terracotta warmth, glowing brass diya, auspicious mango leaf toran, and house tour feast',
    category: 'housewarming',
    themeId: 'h005e001-4444-5555-9999-hearthher101'
  },
  'midnight-soiree': {
    name: 'Velvet Midnight Soirée',
    description: 'Ultra-modern rooftop cocktail soirée with ultraviolet neon glow, holographic VIP pass ticket reveal, and DJ line-up',
    category: 'party',
    themeId: 'part0001-5555-6666-9999-m1dn1ghts001'
  },
  'divya-mandap': {
    name: 'Divya Mandap',
    description: 'Auspicious Vedic puja and satsang theme with sacred saffron vermillion, glowing ghee diyas, and Mahaprasad details',
    category: 'religious',
    themeId: 're110001-6666-7777-9999-d1vyamand101'
  },
  'heritage-reunion': {
    name: 'Heritage Family Reunion',
    description: 'Timeless ancestral celebration with royal emerald velvet, warm antique brass banyan crest, generational family tree, and banquet feast',
    category: 'family_celebration',
    themeId: 'f4m10001-7777-8888-9999-fam1lyreun01'
  },
  'retro-synth-arcade': {
    name: 'Retro Synthwave Arcade',
    description: '80s Cyber Neon & Synthwave Arcade Party with pixel beats and retro cocktails',
    category: 'birthday',
    themeId: 'b1700002-1111-2222-3333-retrosynth01'
  },
  'enchanted-storybook-birthday': {
    name: 'Enchanted Storybook Garden',
    description: 'Whimsical fairy tale garden celebration with stardust lights, butterflies, and high tea',
    category: 'birthday',
    themeId: 'b1700003-1111-2222-3333-enchantbook1'
  },
  'safari-wild-one': {
    name: 'Safari Little Explorer',
    description: 'Wild safari explorer 1st birthday adventure with khaki textures, sunburst tones, and jungle games',
    category: 'birthday',
    themeId: 'b1700004-1111-2222-3333-safariwild01'
  },
  'vintage-distillery-milestone': {
    name: 'Aged to Perfection',
    description: 'Distillery oak, amber bourbon, and leather gentleman milestone celebration',
    category: 'birthday',
    themeId: 'b1700005-1111-2222-3333-distillery001'
  },
  'golden-jubilee-50th': {
    name: '50th Golden Jubilee',
    description: 'Half a century of devotion with 24K polished gold, royal emerald, and grand gala banquet',
    category: 'anniversary',
    themeId: 'a1140002-2525-4444-9999-goldenjub501'
  },
  'ruby-romance-40th': {
    name: 'Ruby Romance 40th',
    description: '40 years of passion and devotion with deep crimson velvet, faceted ruby seal, and romance strings',
    category: 'anniversary',
    themeId: 'a1140003-2525-4444-9999-rubyromanc40'
  },
  'boho-sunset-vows': {
    name: 'Bohemian Sunset Vows',
    description: 'Pampas grass, warm desert terracotta, and acoustic twilight sunset vow renewal',
    category: 'anniversary',
    themeId: 'a1140004-2525-4444-9999-bohosunset01'
  },
  'monochrome-film-noir-anniversary': {
    name: 'Cinematic Noir Anniversary',
    description: 'Vintage Hollywood romance and classic black & white cinema anniversary celebration',
    category: 'anniversary',
    themeId: 'a1140005-2525-4444-9999-cinenoir0001'
  },
  'woodland-fable-shower': {
    name: 'Woodland Fable Shower',
    description: 'Whimsical forest baby shower with moss green, baby deer wax seal, and woodland chimes',
    category: 'baby_shower',
    themeId: 'baba0002-3333-4444-9999-woodlandfa01'
  },
  'royal-little-prince-princess': {
    name: 'Royal Nursery Crown',
    description: 'Regal crown baby shower with powder navy, tiara gold, and royal nursery lullaby',
    category: 'baby_shower',
    themeId: 'baba0003-3333-4444-9999-royalprince01'
  },
  'sunshine-meadow-shower': {
    name: 'Here Comes The Sun',
    description: 'Sunshine, daisy wildflower bloom, and bright morning joy baby celebration',
    category: 'baby_shower',
    themeId: 'baba0004-3333-4444-9999-sunshinemead'
  },
  'boho-rainbow-miracle': {
    name: 'Boho Rainbow Miracle',
    description: 'Earth-toned boho rainbow miracle baby shower with clay warmth and pastel blessings',
    category: 'baby_shower',
    themeId: 'baba0005-3333-4444-9999-bohorainbow1'
  },
  'scandi-minimal-haven': {
    name: 'Scandi Minimalist Sanctuary',
    description: 'Nordic warm minimalism, olive linen, and brass house key sanctuary housewarming',
    category: 'housewarming',
    themeId: 'h005e002-4444-5555-9999-scandimin001'
  },
  'rajasthani-jharokha-griha': {
    name: 'Rajasthani Jharokha Griha',
    description: 'Royal Jaipur Haveli Griha Pravesh with carved jharokha arches, kalash seal, and sacred shehnai',
    category: 'housewarming',
    themeId: 'h005e003-4444-5555-9999-jharokhagr01'
  },
  'urban-terrace-soiree': {
    name: 'Urban Terrace Loft',
    description: 'City view loft and rooftop patio housewarming with copper lights and skyline sundowners',
    category: 'housewarming',
    themeId: 'h005e004-4444-5555-9999-urbanloft001'
  },
  'coastal-breeze-home': {
    name: 'Coastal Sea Breeze Haven',
    description: 'Sea glass, anchor token, and sunlit coastal deck villa housewarming',
    category: 'housewarming',
    themeId: 'h005e005-4444-5555-9999-coastalbreez'
  },
  'tropical-sunset-luau': {
    name: 'Tropical Sunset Luau',
    description: 'Tiki sunset, neon flamingo, fire dancers, and tropical beach party',
    category: 'party',
    themeId: 'part0002-5555-6666-9999-tropicalluau'
  },
  'studio54-disco-glam': {
    name: 'Studio 54 Disco Glam',
    description: 'Spinning mirror ball, purple strobe, sequins, and non-stop disco groove',
    category: 'party',
    themeId: 'part0003-5555-6666-9999-studio54disc'
  },
  'speakeasy-roaring-twenties': {
    name: 'Roaring 20s Speakeasy',
    description: 'Secret 1920s prohibition lounge, vintage jazz, and password entrance pass',
    category: 'party',
    themeId: 'part0004-5555-6666-9999-speakeasy001'
  },
  'poolside-sun-drenched-bash': {
    name: 'Palm Springs Poolside Bash',
    description: 'Turquoise waters, cabana loungers, and deep house poolside party',
    category: 'party',
    themeId: 'part0005-5555-6666-9999-poolsidebash'
  },
  'shree-ganesh-vandana': {
    name: 'Shree Ganesh Sthapana',
    description: 'Modak, marigold yellow, and sacred Shankh Ganesh Sthapana with Vedic Om mantra',
    category: 'religious',
    themeId: 're110002-6666-7777-9999-ganeshvand01'
  },
  'waheguru-anand-blessings': {
    name: 'Akhand Path & Kirtan Darbar',
    description: 'Sri Akhand Path Sahib, classical raga kirtan darbar, and Guru Ka Langar',
    category: 'religious',
    themeId: 're110003-6666-7777-9999-wahegurbles1'
  },
  'cathedral-grace-communion': {
    name: 'Sacred Holy Communion',
    description: 'Stained glass royal sapphire, holy dove seal, and cathedral communion mass',
    category: 'religious',
    themeId: 're110004-6666-7777-9999-communion001'
  },
  'noor-e-mehfil-nikah-eid': {
    name: 'Noor-e-Mehfil Islamic Gala',
    description: 'Crescent moon, Islamic geometric arabesque, Naat recitation, and Dastarkhwan banquet',
    category: 'religious',
    themeId: 're110005-6666-7777-9999-nooremehfil1'
  },
  'vintage-roots-family-archive': {
    name: 'Vintage Roots Family Archive',
    description: 'Antique leatherbound family album, sepia memories, and centennial clan reunion',
    category: 'family_celebration',
    themeId: 'f4m10002-7777-8888-9999-vintageroots'
  },
  'sunlit-picnic-carnival': {
    name: 'Sunlit Lawn Carnival',
    description: 'Gingham lawn games, barbecue smoke, tug-of-war, and family carnival day',
    category: 'family_celebration',
    themeId: 'f4m10003-7777-8888-9999-sunlitpicnic'
  },
  'festive-diwali-family-milan': {
    name: 'Diwali Sneh Milan',
    description: 'A thousand golden diyas, sweets exchange, sparklers, and festive kinship banquet',
    category: 'family_celebration',
    themeId: 'f4m10004-7777-8888-9999-diwalimilan1'
  },
  'generations-anchored-reunion': {
    name: 'Nautical Generations Anchorage',
    description: 'Lakeside cottages, brass anchor crest, sunset boat rides, and generational bonfire',
    category: 'family_celebration',
    themeId: 'f4m10005-7777-8888-9999-anchordreun1'
  },
  'commencement-excellence': {
    name: 'Commencement Academic Honors',
    description: 'Academic mortarboard, navy and gold foil, and graduation conferral gala',
    category: 'other',
    themeId: 'g41a0002-8888-9999-aaaa-gradcommence'
  },
  'philanthropy-crystal-ball': {
    name: 'Crystal Philanthropy Ball',
    description: 'Emerald velvet, crystal chandelier gala, and benefactor charity auction',
    category: 'other',
    themeId: 'g41a0003-8888-9999-aaaa-crystalball1'
  },
  'tech-summit-future-vision': {
    name: 'Executive Tech Vision Summit',
    description: 'Horizon 2030 closed-door executive summit on AI, robotics, and future technology',
    category: 'other',
    themeId: 'g41a0004-8888-9999-aaaa-techsummit01'
  },
  'bon-voyage-wanderlust': {
    name: 'Bon Voyage & Wanderlust',
    description: 'Vintage atlas, compass medallion, and world sabbatical bon voyage toast',
    category: 'other',
    themeId: 'g41a0005-8888-9999-aaaa-bonvoyage001'
  },
  'aura-grand-gala': {
    name: 'Aura Grand Gala',
    description: 'Opulent black-tie gala and honors night with sapphire starlight, champagne gold, VIP badge access, and red carpet reception',
    category: 'other',
    themeId: 'g41a0001-8888-9999-aaaa-auragala0001'
  }
};

export default function TemplatePreview() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const templateDef = resolveTemplate(slug);

  if (!slug || !templateDef) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
          <Link to="/templates" className="text-rose-600 hover:text-rose-700 font-medium">
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  const TemplateComponent = templateDef.component;
  const demoData = DEMO_DATA[templateDef.slug] || DEMO_DATA[slug] || {
    couple: { groom: templateDef.name, bride: '', tagline: templateDef.description },
    events: [{ key: 'event-1', title: templateDef.name, date: '2027-08-15', time: '6:30 PM', venue: 'Grand Celebration Hall', address: 'Main Avenue' }],
    message: templateDef.description
  };
  const templateInfo = TEMPLATE_INFO[templateDef.slug] || {
    name: templateDef.name,
    description: templateDef.description,
    category: templateDef.category,
    themeId: templateDef.themeId,
  };

  const handleUseTemplate = () => {
    // Store selected template in sessionStorage for use after auth / on create
    sessionStorage.setItem('selectedTemplate', slug);
    sessionStorage.setItem('selectedOccasion', templateInfo.category);
    sessionStorage.setItem('selectedThemeId', templateInfo.themeId);
    if (isAuthenticated) {
      navigate('/invitations/new');
    } else {
      navigate('/signup');
    }
  };

  // If accessed directly via /templates/:slug/use, trigger invitation flow
  useEffect(() => {
    if (window.location.pathname.endsWith('/use') && slug && templateDef) {
      handleUseTemplate();
    }
  }, [slug, templateDef, isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/templates"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Templates</span>
              </Link>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900">{templateInfo.name}</h1>
                <p className="text-sm text-gray-600">{templateInfo.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 text-xs sm:text-sm">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition ${
                    viewMode === 'desktop'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="hidden md:inline">Desktop</span>
                  <span className="md:hidden">💻</span>
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium transition ${
                    viewMode === 'mobile'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="hidden md:inline">Mobile</span>
                  <span className="md:hidden">📱</span>
                </button>
              </div>

              {/* Use Template Button */}
              <button
                onClick={handleUseTemplate}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg text-sm sm:text-base font-medium hover:from-rose-600 hover:to-rose-700 transition shadow-sm"
              >
                Use Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex justify-center">
          {viewMode === 'mobile' ? (
            <div className="w-full flex justify-center">
              <MobilePhoneMockup height={760} className="template-preview-container">
                <TemplateComponent data={demoData} />
              </MobilePhoneMockup>
            </div>
          ) : (
            <div className="w-full">
              <div 
                className="bg-white shadow-2xl overflow-hidden relative transform-gpu template-preview-container rounded-xl"
                style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
              >
                <TemplateComponent data={demoData} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <button
          onClick={handleUseTemplate}
          className="w-14 h-14 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full shadow-lg flex items-center justify-center hover:from-rose-600 hover:to-rose-700 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
