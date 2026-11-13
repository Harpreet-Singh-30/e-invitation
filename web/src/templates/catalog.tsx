import { createThemedTemplate, type ThemedTemplateConfig } from './common/OccasionTemplateFactory';

/* ==========================================================================
   1. BIRTHDAY TEMPLATES (4 New)
   ========================================================================== */

export const retroSynthArcadeConfig: ThemedTemplateConfig = {
  slug: 'retro-synth-arcade',
  gateTheme: 'arcade',
  category: 'birthday',
  themeName: 'Retro Synthwave Arcade',
  badgeText: '80s Arcade & Level Up Party',
  badgeEmoji: '🕹️',
  colors: {
    bg: '#0c071e',
    bgGradient: 'bg-gradient-to-b from-[#180a3a] via-[#0d0426] to-[#060212]',
    cardBg: '#13092e',
    cardBorder: '#f72585',
    primaryText: '#f8f9fa',
    accentText: '#4cc9f0',
    mutedText: '#b5179e',
    highlightBg: '#7209b7',
    buttonGradient: 'linear-gradient(135deg, #f72585 0%, #7209b7 50%, #4cc9f0 100%)',
    buttonText: '#ffffff',
    sealBorder: '#f72585',
    sealGlow: 'rgba(247, 37, 133, 0.65)',
    sealBg: '#080114',
  },
  fonts: {
    heading: "'Press Start 2P', 'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Insert Coin • Press Start',
    title: 'Level Up Celebration',
    subtitle: 'High Scores, Pixel Beats & Retro Cocktails',
    actionText: 'Start Game',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h4m-2-2v4m10-2h.01m-3-1h.01" />
      </svg>
    ),
  },
  ambientStyle: 'lounge',
  audioLabel: 'Synthwave Beats',
  countdownLabel: 'Game Launch Countdown',
  messageHeading: 'Player 1 Ready',
  rsvpType: 'standard',
  closingQuote: '🕹️ Game On! See you at the high score table 🕹️',
  closingSub: 'Powered by 80s nostalgia & endless pixel fun',
  defaultData: {
    groom: 'Rohan',
    bride: 'Level 25',
    tagline: 'Leveling up to quarter-century greatness with 80s arcade vibes',
    message: 'Grab your joystick and get ready for a night of retro arcade classics, vaporwave cocktails, and neon nostalgia!',
    events: [
      {
        key: 'arcade-tournament',
        title: 'Retro Arcade Tournament & Mixology',
        date: '2027-04-18',
        time: '7:00 PM',
        venue: 'Pixel Bar & Arcade',
        address: '88 Cyberpunk Avenue, Indiranagar, Bangalore',
        description: 'Free-play classic arcade cabinets, high-score prizes, and craft neon cocktail tasting.',
      },
      {
        key: 'cake-cutting',
        title: 'Pixel Cake Cutting & Synthwave DJ Set',
        date: '2027-04-18',
        time: '9:30 PM',
        venue: 'The Neon Rooftop',
        address: '88 Cyberpunk Avenue, Indiranagar, Bangalore',
        description: 'Level-up cake ceremony followed by live electronic synthwave dance party.',
      },
    ],
  },
};

export const enchantedStorybookBirthdayConfig: ThemedTemplateConfig = {
  slug: 'enchanted-storybook-birthday',
  gateTheme: 'storybook',
  category: 'birthday',
  themeName: 'Enchanted Storybook Garden',
  badgeText: 'Fairy Tale Garden Celebration',
  badgeEmoji: '🦋',
  colors: {
    bg: '#1b0d2a',
    bgGradient: 'bg-gradient-to-b from-[#2a1342] via-[#1b0d2a] to-[#10061a]',
    cardBg: '#231138',
    cardBorder: '#e879f9',
    primaryText: '#fdf4ff',
    accentText: '#f472b6',
    mutedText: '#d8b4fe',
    highlightBg: '#a855f7',
    buttonGradient: 'linear-gradient(135deg, #f472b6 0%, #c084fc 100%)',
    buttonText: '#1b0d2a',
    sealBorder: '#f472b6',
    sealGlow: 'rgba(244, 114, 182, 0.6)',
    sealBg: '#130720',
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Cormorant Garamond', serif",
  },
  seal: {
    eyebrow: 'Once Upon A Time • Chapter 16',
    title: 'An Enchanted Soirée',
    subtitle: 'Where Magic Meets Childhood Dreams',
    actionText: 'Open Story',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 3c-1.5 2-4 3.5-7 3.5v12c3 0 5.5-1.5 7-3.5 1.5 2 4 3.5 7 3.5v-12c-3 0-5.5-1.5-7-3.5z" />
        <path d="M12 3v13.5" />
      </svg>
    ),
  },
  ambientStyle: 'lullaby',
  audioLabel: 'Fairy Tale Harp',
  countdownLabel: 'Magic Portal Opens In',
  messageHeading: 'A Royal Birthday Proclamation',
  rsvpType: 'dietary',
  closingQuote: '✨ And they celebrated happily ever after ✨',
  closingSub: 'Wrapped in stardust and endless garden blooms',
  defaultData: {
    groom: 'Ananya',
    bride: 'Sweet 16',
    tagline: 'Stepping into a magical chapter filled with fairy lights and butterflies',
    message: 'You are cordially summoned to an enchanted evening beneath weeping willows, glowing lanterns, and floral high tea.',
    events: [
      {
        key: 'high-tea',
        title: 'Enchanted Garden High Tea',
        date: '2027-05-12',
        time: '4:00 PM',
        venue: 'The Botanical Glasshouse',
        address: 'Willow Glen Estate, Lonavala',
        description: 'Artisanal macarons, fairy dust cupcakes, and floral infused blossom teas.',
      },
      {
        key: 'twilight-ball',
        title: 'Twilight Lantern Waltz & Toast',
        date: '2027-05-12',
        time: '7:00 PM',
        venue: 'Starlight Pavilion',
        address: 'Willow Glen Estate, Lonavala',
        description: 'Acoustic violin serenades, floating wish lanterns, and birthday waltz.',
      },
    ],
  },
};

export const safariWildOneConfig: ThemedTemplateConfig = {
  slug: 'safari-wild-one',
  gateTheme: 'safari',
  category: 'birthday',
  themeName: 'Safari Little Explorer',
  badgeText: 'Wild Explorer 1st Birthday',
  badgeEmoji: '🦁',
  colors: {
    bg: '#182416',
    bgGradient: 'bg-gradient-to-b from-[#253822] via-[#182416] to-[#0e160d]',
    cardBg: '#1f2f1d',
    cardBorder: '#eab308',
    primaryText: '#fefce8',
    accentText: '#facc15',
    mutedText: '#a3e635',
    highlightBg: '#ca8a04',
    buttonGradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    buttonText: '#182416',
    sealBorder: '#eab308',
    sealGlow: 'rgba(234, 179, 8, 0.55)',
    sealBg: '#10190f',
  },
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Expedition Passport • Turning 1',
    title: 'Our Little Cub Is One!',
    subtitle: 'Wild Adventures & Golden Sunsets',
    actionText: 'Begin Safari',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 000 20M2 12a14.5 14.5 0 0020 0" />
      </svg>
    ),
  },
  ambientStyle: 'festive',
  audioLabel: 'Acoustic Safari',
  countdownLabel: 'Expedition Departure',
  messageHeading: 'From The Safari Camp',
  rsvpType: 'standard',
  closingQuote: '🐾 Born to be wild, loved beyond measure 🐾',
  closingSub: 'Hosted with wild joy by the family',
  defaultData: {
    groom: 'Kabir',
    bride: 'Wild One',
    tagline: 'Our little cub is turning one! Join our wild safari celebration.',
    message: 'Time flies when you are having wild fun! Join us as we celebrate one year of laughter, muddy paws, and sweet giggles.',
    events: [
      {
        key: 'safari-camp',
        title: 'Jungle Safari Games & Animal Petting',
        date: '2027-06-05',
        time: '3:30 PM',
        venue: 'The Savanna Lawn',
        address: 'Green Meadows Country Club, Pune',
        description: 'Explorer scavenger hunt, animal face painting, and jungle safari photo booth.',
      },
      {
        key: 'cake-smash',
        title: 'Wild Cake Smash & Feast',
        date: '2027-06-05',
        time: '5:30 PM',
        venue: 'The Oasis Pavilion',
        address: 'Green Meadows Country Club, Pune',
        description: 'First birthday smash cake ceremony followed by family safari feast.',
      },
    ],
  },
};

export const vintageDistilleryMilestoneConfig: ThemedTemplateConfig = {
  slug: 'vintage-distillery-milestone',
  gateTheme: 'whiskey_distillery',
  category: 'birthday',
  themeName: 'Aged to Perfection',
  badgeText: 'Distillery Oak & Amber Milestone',
  badgeEmoji: '🥃',
  colors: {
    bg: '#160c07',
    bgGradient: 'bg-gradient-to-b from-[#24140b] via-[#160c07] to-[#0b0503]',
    cardBg: '#1f1009',
    cardBorder: '#d97706',
    primaryText: '#fef3c7',
    accentText: '#fbbf24',
    mutedText: '#b45309',
    highlightBg: '#92400e',
    buttonGradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    buttonText: '#160c07',
    sealBorder: '#d97706',
    sealGlow: 'rgba(217, 119, 6, 0.55)',
    sealBg: '#0f0704',
  },
  fonts: {
    heading: "'Cinzel', 'Playfair Display', serif",
    body: "'Cormorant Garamond', serif",
  },
  seal: {
    eyebrow: 'Vintage Reserve • Aged 50 Years',
    title: 'Aged to Absolute Perfection',
    subtitle: 'Celebrating Half a Century of Character',
    actionText: 'Uncork',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M8 2h8m-5 0v3m2 0v-3M9 5h6l2 5v11a1 1 0 01-1 1H8a1 1 0 01-1-1V10l2-5z" />
      </svg>
    ),
  },
  ambientStyle: 'jazz',
  audioLabel: 'Vintage Jazz',
  countdownLabel: 'Tasting Countdown',
  messageHeading: 'The Reserve Tasting',
  rsvpType: 'vip',
  closingQuote: '🥃 Like fine whiskey, life gets better with time 🥃',
  closingSub: 'Cheers to 50 extraordinary years',
  defaultData: {
    groom: 'Vikramaditya',
    bride: '50th Vintage',
    tagline: 'Distilled with passion, aged with wisdom, poured with gratitude',
    message: 'Fifty years in the making. Join us for a private evening of single-malt tastings, curated cigar pairings, and vintage jazz.',
    events: [
      {
        key: 'whiskey-tasting',
        title: 'Master Sommelier Reserve Tasting',
        date: '2027-07-10',
        time: '7:30 PM',
        venue: 'The Copper Still Lounge',
        address: 'The Oberoi, Nariman Point, Mumbai',
        description: 'Curated 5-flight flight tasting of rare single malts paired with artisanal charcuterie.',
      },
      {
        key: 'cigar-toast',
        title: 'Midnight Toast & Live Jazz Quartet',
        date: '2027-07-10',
        time: '9:30 PM',
        venue: 'The Rooftop Speakeasy',
        address: 'The Oberoi, Nariman Point, Mumbai',
        description: 'Private cigar terrace, birthday toast, and soulful live jazz ensemble.',
      },
    ],
  },
};

/* ==========================================================================
   2. ANNIVERSARY TEMPLATES (4 New)
   ========================================================================== */

export const goldenJubilee50thConfig: ThemedTemplateConfig = {
  slug: 'golden-jubilee-50th',
  gateTheme: 'metallic_gold',
  category: 'anniversary',
  themeName: '50th Golden Jubilee',
  badgeText: '50 Blessed Years of Devotion',
  badgeEmoji: '👑',
  colors: {
    bg: '#081c14',
    bgGradient: 'bg-gradient-to-b from-[#0f3224] via-[#081c14] to-[#040e0a]',
    cardBg: '#0c271c',
    cardBorder: '#f59e0b',
    primaryText: '#fefce8',
    accentText: '#fbbf24',
    mutedText: '#a7f3d0',
    highlightBg: '#d97706',
    buttonGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    buttonText: '#081c14',
    sealBorder: '#f59e0b',
    sealGlow: 'rgba(245, 158, 11, 0.6)',
    sealBg: '#05120c',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Playfair Display', serif",
  },
  seal: {
    eyebrow: 'Golden Jubilee • 1977 - 2027',
    title: 'Fifty Years of Sacred Love',
    subtitle: 'Golden Memories, Timeless Devotion',
    actionText: 'Enter Gala',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  ambientStyle: 'orchestral',
  audioLabel: 'Royal Jubilee Strings',
  countdownLabel: 'Celebration Countdown',
  messageHeading: 'Half a Century of Grace',
  rsvpType: 'branch',
  closingQuote: '✨ Two hearts, one golden journey of fifty years ✨',
  closingSub: 'Blessed by three generations of family',
  defaultData: {
    groom: 'Ramesh',
    bride: 'Kavita',
    tagline: 'Half a century of shared dreams, boundless laughter, and steadfast love',
    message: 'Fifty years ago, we began a walk together that blossomed into a garden of family and memories. Please join us to celebrate our Golden Jubilee.',
    events: [
      {
        key: 'vow-renewal',
        title: 'Golden Vow Renewal Ceremony',
        date: '2027-08-14',
        time: '11:00 AM',
        venue: 'The Grand Ballroom',
        address: 'Taj Mahal Palace, Colaba, Mumbai',
        description: 'Exchanging golden garlands surrounded by children, grandchildren, and lifelong friends.',
      },
      {
        key: 'jubilee-banquet',
        title: 'Royal Jubilee Banquet & Sangeet',
        date: '2027-08-14',
        time: '7:30 PM',
        venue: 'Crystal Palace Hall',
        address: 'Taj Mahal Palace, Colaba, Mumbai',
        description: 'Multi-course royal banquet, retro musical tribute, and family dance celebration.',
      },
    ],
  },
};

export const rubyRomance40thConfig: ThemedTemplateConfig = {
  slug: 'ruby-romance-40th',
  gateTheme: 'ruby_gem',
  category: 'anniversary',
  themeName: 'Ruby Romance 40th',
  badgeText: '40 Years of Passion & Devotion',
  badgeEmoji: '💎',
  colors: {
    bg: '#25060e',
    bgGradient: 'bg-gradient-to-b from-[#3b0b18] via-[#25060e] to-[#120206]',
    cardBg: '#310914',
    cardBorder: '#e11d48',
    primaryText: '#fff1f2',
    accentText: '#fb7185',
    mutedText: '#fda4af',
    highlightBg: '#be123c',
    buttonGradient: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)',
    buttonText: '#ffffff',
    sealBorder: '#e11d48',
    sealGlow: 'rgba(225, 29, 72, 0.6)',
    sealBg: '#180309',
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Cormorant Garamond', serif",
  },
  seal: {
    eyebrow: 'Ruby Anniversary • 40 Blessed Years',
    title: 'The Ruby Celebration',
    subtitle: 'A Love That Burns Brighter Each Year',
    actionText: 'Unveil Love',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
      </svg>
    ),
  },
  ambientStyle: 'orchestral',
  audioLabel: 'Ruby Romance Strings',
  countdownLabel: 'Celebration In',
  messageHeading: 'From Our Hearts',
  rsvpType: 'standard',
  closingQuote: '🌹 Forty years of true love and timeless romance 🌹',
  closingSub: 'With love and warmth from the anniversary couple',
  defaultData: {
    groom: 'Sanjay',
    bride: 'Radhika',
    tagline: 'Four decades of shared triumphs, deep companionship, and endless love',
    message: 'Ruby represents passion, endurance, and deep devotion. We invite our nearest and dearest to toast to 40 wonderful years together.',
    events: [
      {
        key: 'toast-banquet',
        title: 'Ruby Toast & Gala Dinner',
        date: '2027-09-18',
        time: '7:00 PM',
        venue: 'The Red Velvet Pavilion',
        address: 'ITC Grand Chola, Guindy, Chennai',
        description: 'Champagne toast, vintage slideshow, and multi-course culinary experience.',
      },
    ],
  },
};

export const bohoSunsetVowsConfig: ThemedTemplateConfig = {
  slug: 'boho-sunset-vows',
  gateTheme: 'boho_sun',
  category: 'anniversary',
  themeName: 'Bohemian Sunset Vows',
  badgeText: 'Pampas Grass & Sunset Vow Renewal',
  badgeEmoji: '🌾',
  colors: {
    bg: '#1e110d',
    bgGradient: 'bg-gradient-to-b from-[#2e1a14] via-[#1e110d] to-[#110907]',
    cardBg: '#271510',
    cardBorder: '#ea580c',
    primaryText: '#fff7ed',
    accentText: '#fdba74',
    mutedText: '#fed7aa',
    highlightBg: '#c2410c',
    buttonGradient: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
    buttonText: '#1e110d',
    sealBorder: '#ea580c',
    sealGlow: 'rgba(234, 88, 12, 0.55)',
    sealBg: '#140a08',
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Vow Renewal • Sunset Serenade',
    title: 'Still Falling For You',
    subtitle: 'Under The Golden Desert Sunset',
    actionText: 'View Vows',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42" />
      </svg>
    ),
  },
  ambientStyle: 'celestial',
  audioLabel: 'Twilight Acoustics',
  countdownLabel: 'Sunset Arrival',
  messageHeading: 'A Decade Later',
  rsvpType: 'standard',
  closingQuote: '🌅 I would choose you in every lifetime 🌅',
  closingSub: 'Under the golden sky with love',
  defaultData: {
    groom: 'Neil',
    bride: 'Tara',
    tagline: 'Ten years of adventures, still choosing each other every single day',
    message: 'Surrounded by pampas grass, warm lanterns, and the golden hour glow, join us as we renew our vows and celebrate 10 years of marriage.',
    events: [
      {
        key: 'sunset-vows',
        title: 'Sunset Vows & Barefoot Cocktails',
        date: '2027-10-08',
        time: '5:00 PM',
        venue: 'The Dunes Amphitheatre',
        address: 'Suryagarh Estate, Jaisalmer',
        description: 'Vow renewal ceremony as the sun dips into the dunes, followed by folk acoustics.',
      },
    ],
  },
};

export const monochromeFilmNoirAnniversaryConfig: ThemedTemplateConfig = {
  slug: 'monochrome-film-noir-anniversary',
  gateTheme: 'film_noir',
  category: 'anniversary',
  themeName: 'Cinematic Noir Anniversary',
  badgeText: 'Classic Cinema Love Story',
  badgeEmoji: '🎬',
  colors: {
    bg: '#0a0a0c',
    bgGradient: 'bg-gradient-to-b from-[#18181b] via-[#0a0a0c] to-[#040405]',
    cardBg: '#121215',
    cardBorder: '#e4e4e7',
    primaryText: '#fafafa',
    accentText: '#fef08a',
    mutedText: '#a1a1aa',
    highlightBg: '#3f3f46',
    buttonGradient: 'linear-gradient(135deg, #fef08a 0%, #e4e4e7 100%)',
    buttonText: '#0a0a0c',
    sealBorder: '#e4e4e7',
    sealGlow: 'rgba(254, 240, 138, 0.45)',
    sealBg: '#09090b',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Cormorant Garamond', serif",
  },
  seal: {
    eyebrow: 'Scene 25 • Take Forever',
    title: 'A Cinematic Love Story',
    subtitle: 'Captured in Timeless Black & White',
    actionText: 'Roll Film',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <rect x="2" y="2" width="20" height="20" rx="2.18" />
        <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
      </svg>
    ),
  },
  ambientStyle: 'jazz',
  audioLabel: 'Noir Ballad',
  countdownLabel: 'Premiere Countdown',
  messageHeading: 'The Director\'s Cut',
  rsvpType: 'vip',
  closingQuote: '🎬 In all the world, there is no heart for me like yours 🎬',
  closingSub: 'An eternal cinematic journey',
  defaultData: {
    groom: 'Arjun',
    bride: 'Zoya',
    tagline: '25 years of romance, laughter, and timeless cinema moments',
    message: 'Grab your champagne flute and walk the black carpet as we celebrate a quarter-century of our favorite love story.',
    events: [
      {
        key: 'screening-dinner',
        title: 'Premiere Gala & Candlelight Banquet',
        date: '2027-11-05',
        time: '7:30 PM',
        venue: 'The Art House Cinema & Terrace',
        address: 'Bandra West, Mumbai',
        description: 'Private screening of our 25-year memory montage, followed by black-tie supper.',
      },
    ],
  },
};

/* ==========================================================================
   3. BABY SHOWER TEMPLATES (4 New)
   ========================================================================== */

export const woodlandFableShowerConfig: ThemedTemplateConfig = {
  slug: 'woodland-fable-shower',
  gateTheme: 'woodland_fable',
  category: 'baby_shower',
  themeName: 'Woodland Fable Shower',
  badgeText: 'Whimsical Forest Baby Shower',
  badgeEmoji: '🦌',
  colors: {
    bg: '#0f1f17',
    bgGradient: 'bg-gradient-to-b from-[#1b3427] via-[#0f1f17] to-[#08120d]',
    cardBg: '#15291f',
    cardBorder: '#86efac',
    primaryText: '#f0fdf4',
    accentText: '#bbf7d0',
    mutedText: '#86efac',
    highlightBg: '#166534',
    buttonGradient: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
    buttonText: '#0f1f17',
    sealBorder: '#86efac',
    sealGlow: 'rgba(134, 239, 172, 0.55)',
    sealBg: '#0a1610',
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Forest Gathering • Welcoming Baby',
    title: 'A Little Fawn Is On The Way',
    subtitle: 'Under The Ancient Canopy Of Love',
    actionText: 'Enter Forest',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 2L3 9h3v11h12V9h3L12 2z" />
      </svg>
    ),
  },
  ambientStyle: 'lullaby',
  audioLabel: 'Woodland Chimes',
  countdownLabel: 'Baby Arrival In',
  messageHeading: 'From The Forest Nest',
  rsvpType: 'dietary',
  closingQuote: '🌿 Little hands, gentle heart, welcome to the world 🌿',
  closingSub: 'Eagerly awaited by parents & forest friends',
  defaultData: {
    groom: 'Karan',
    bride: 'Megha',
    tagline: 'Welcoming our little woodland fawn with acorns, moss, and infinite love',
    message: 'The forest whispers sweet tidings of a baby on the way! Join us for an enchanting afternoon of woodland treats and gentle blessings.',
    events: [
      {
        key: 'woodland-tea',
        title: 'Forest High Tea & Baby Games',
        date: '2027-04-24',
        time: '3:00 PM',
        venue: 'The Pine Glade Pavilion',
        address: 'Coorg Valley Greens, Karnataka',
        description: 'Berry tarts, acorn cookies, guessing games, and nursery book registry.',
      },
    ],
  },
};

export const royalLittlePrincePrincessConfig: ThemedTemplateConfig = {
  slug: 'royal-little-prince-princess',
  gateTheme: 'royal_nursery',
  category: 'baby_shower',
  themeName: 'Royal Nursery Crown',
  badgeText: 'Regal Crown Baby Shower',
  badgeEmoji: '👑',
  colors: {
    bg: '#0c1527',
    bgGradient: 'bg-gradient-to-b from-[#162544] via-[#0c1527] to-[#060b14]',
    cardBg: '#121f38',
    cardBorder: '#fbbf24',
    primaryText: '#f8fafc',
    accentText: '#fde68a',
    mutedText: '#93c5fd',
    highlightBg: '#1e3a8a',
    buttonGradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    buttonText: '#0c1527',
    sealBorder: '#fbbf24',
    sealGlow: 'rgba(251, 191, 36, 0.6)',
    sealBg: '#090f1d',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Cormorant Garamond', serif",
  },
  seal: {
    eyebrow: 'Royal Proclamation • Baby Shower',
    title: 'A Royal Blessing Awaits',
    subtitle: 'Welcoming Our Precious Little Highness',
    actionText: 'View Court',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      </svg>
    ),
  },
  ambientStyle: 'orchestral',
  audioLabel: 'Royal Lullaby',
  countdownLabel: 'Arrival Proclamation',
  messageHeading: 'From The Parents-To-Be',
  rsvpType: 'standard',
  closingQuote: '👑 May your little life be crowned with boundless joy 👑',
  closingSub: 'Held in royal love and adoration',
  defaultData: {
    groom: 'Vikram',
    bride: 'Ananya',
    tagline: 'Our little royal miracle is about to make their grand entrance',
    message: 'Hear ye, hear ye! We request the honor of your gracious presence as we celebrate the approaching arrival of our baby prince/princess.',
    events: [
      {
        key: 'royal-shower',
        title: 'Grand Royal Shower & High Tea',
        date: '2027-05-30',
        time: '4:00 PM',
        venue: 'The Amber Ballroom',
        address: 'Rambagh Palace, Jaipur',
        description: 'Pastel macarons, royal blessing rituals, and celebration of the mom-to-be.',
      },
    ],
  },
};

export const sunshineMeadowShowerConfig: ThemedTemplateConfig = {
  slug: 'sunshine-meadow-shower',
  gateTheme: 'sunshine',
  category: 'baby_shower',
  themeName: 'Here Comes The Sun',
  badgeText: 'Sunshine & Daisy Meadow Bloom',
  badgeEmoji: '🌻',
  colors: {
    bg: '#211709',
    bgGradient: 'bg-gradient-to-b from-[#33250e] via-[#211709] to-[#120d04]',
    cardBg: '#2a1f0d',
    cardBorder: '#facc15',
    primaryText: '#fefce8',
    accentText: '#fef08a',
    mutedText: '#fde047',
    highlightBg: '#ca8a04',
    buttonGradient: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
    buttonText: '#211709',
    sealBorder: '#facc15',
    sealGlow: 'rgba(250, 204, 21, 0.55)',
    sealBg: '#171006',
  },
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Here Comes The Sun • Baby Shower',
    title: 'Our Sunshine Is Coming!',
    subtitle: 'Golden Rays & Pure Morning Joy',
    actionText: 'Bask In Sun',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42" />
      </svg>
    ),
  },
  ambientStyle: 'festive',
  audioLabel: 'Sunshine Chords',
  countdownLabel: 'Sunrise Countdown',
  messageHeading: 'A Ray Of Light',
  rsvpType: 'standard',
  closingQuote: '☀️ You are our sunshine, our only sunshine ☀️',
  closingSub: 'Shining bright with love and gratitude',
  defaultData: {
    groom: 'Sameer',
    bride: 'Pooja',
    tagline: 'Here comes the sun, and we say it is more than all right',
    message: 'Join us for a bright and sunny celebration filled with sunflowers, lemonade, and sweet blessings for our baby on the way.',
    events: [
      {
        key: 'sunflower-brunch',
        title: 'Sunflower Meadow Brunch',
        date: '2027-06-20',
        time: '11:00 AM',
        venue: 'The Sunny Meadow Lawn',
        address: 'Alibaug Farmstay, Maharashtra',
        description: 'Farm-to-table brunch, fresh citrus mocktails, and sunny wishes tree.',
      },
    ],
  },
};

export const bohoRainbowMiracleConfig: ThemedTemplateConfig = {
  slug: 'boho-rainbow-miracle',
  gateTheme: 'boho_rainbow',
  category: 'baby_shower',
  themeName: 'Boho Rainbow Miracle',
  badgeText: 'Muted Earth & Rainbow Shower',
  badgeEmoji: '🌈',
  colors: {
    bg: '#1c1314',
    bgGradient: 'bg-gradient-to-b from-[#2c1e20] via-[#1c1314] to-[#100b0c]',
    cardBg: '#251a1c',
    cardBorder: '#f87171',
    primaryText: '#fff1f2',
    accentText: '#fca5a5',
    mutedText: '#fecaca',
    highlightBg: '#b91c1c',
    buttonGradient: 'linear-gradient(135deg, #f87171 0%, #fb923c 100%)',
    buttonText: '#1c1314',
    sealBorder: '#f87171',
    sealGlow: 'rgba(248, 113, 113, 0.55)',
    sealBg: '#130d0e',
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Our Miracle • Rainbow Baby',
    title: 'Worth Every Storm',
    subtitle: 'Our Beautiful Rainbow Is On The Horizon',
    actionText: 'View Miracle',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M4 15a8 8 0 0116 0M7 15a5 5 0 0110 0M10 15a2 2 0 014 0" />
      </svg>
    ),
  },
  ambientStyle: 'celestial',
  audioLabel: 'Rainbow Lullaby',
  countdownLabel: 'Miracle Due In',
  messageHeading: 'With Full Hearts',
  rsvpType: 'dietary',
  closingQuote: '🌈 After every storm comes a miraculous rainbow 🌈',
  closingSub: 'Eternally grateful for this sweet blessing',
  defaultData: {
    groom: 'Aditya',
    bride: 'Ishita',
    tagline: 'Our greatest adventure and brightest miracle is almost here',
    message: 'We invite our closest family and friends to celebrate our rainbow baby and shower our little miracle with love and warmth.',
    events: [
      {
        key: 'rainbow-brunch',
        title: 'Boho Rainbow Brunch & Blessing Circle',
        date: '2027-07-15',
        time: '12:00 PM',
        venue: 'The Terracotta Garden',
        address: 'Whitefield Green Estate, Bangalore',
        description: 'Artisanal sourdough bites, flower crown station, and communal blessing circle.',
      },
    ],
  },
};

/* ==========================================================================
   4. HOUSEWARMING TEMPLATES (4 New)
   ========================================================================== */

export const scandiMinimalHavenConfig: ThemedTemplateConfig = {
  slug: 'scandi-minimal-haven',
  gateTheme: 'scandi_haven',
  category: 'housewarming',
  themeName: 'Scandi Minimalist Sanctuary',
  badgeText: 'Nordic Warmth & Housewarming',
  badgeEmoji: '🌿',
  colors: {
    bg: '#141814',
    bgGradient: 'bg-gradient-to-b from-[#1e241e] via-[#141814] to-[#0c0e0c]',
    cardBg: '#192019',
    cardBorder: '#a3b18a',
    primaryText: '#f8fafc',
    accentText: '#dad7cd',
    mutedText: '#a3b18a',
    highlightBg: '#588157',
    buttonGradient: 'linear-gradient(135deg, #a3b18a 0%, #588157 100%)',
    buttonText: '#141814',
    sealBorder: '#a3b18a',
    sealGlow: 'rgba(163, 177, 138, 0.5)',
    sealBg: '#0e120e',
  },
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'New Chapter • Open House',
    title: 'Welcome To Our Sanctuary',
    subtitle: 'Linen, Warm Wood & Open Doors',
    actionText: 'Step Inside',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  ambientStyle: 'lounge',
  audioLabel: 'Nordic Calm',
  countdownLabel: 'Doors Open In',
  messageHeading: 'Making A Home',
  rsvpType: 'standard',
  closingQuote: '🏡 May our home be filled with laughter, love, and coffee 🏡',
  closingSub: 'The door is always open for you',
  defaultData: {
    groom: 'Dhruv & Alisha',
    bride: 'Haven Abode',
    tagline: 'A warm sanctuary of peace, coffee, and quiet joy',
    message: 'We have unpacked the boxes and turned keys in the door. Come celebrate our new home with great food, drinks, and warm conversation.',
    events: [
      {
        key: 'open-house',
        title: 'Open House & Terrace Barbecue',
        date: '2027-05-16',
        time: '5:00 PM',
        venue: 'Our New Home — The Haven',
        address: 'Villa 14, Palm Grove, Sector 54, Gurgaon',
        description: 'House tour, artisanal cocktails on the terrace, and wood-fired flatbreads.',
      },
    ],
  },
};

export const rajasthaniJharokhaGrihaConfig: ThemedTemplateConfig = {
  slug: 'rajasthani-jharokha-griha',
  gateTheme: 'rajasthani_jharokha',
  category: 'housewarming',
  themeName: 'Rajasthani Jharokha Griha',
  badgeText: 'Traditional Royal Griha Pravesh',
  badgeEmoji: '🪔',
  colors: {
    bg: '#081726',
    bgGradient: 'bg-gradient-to-b from-[#10273d] via-[#081726] to-[#040c14]',
    cardBg: '#0d2238',
    cardBorder: '#f59e0b',
    primaryText: '#f8fafc',
    accentText: '#fbbf24',
    mutedText: '#93c5fd',
    highlightBg: '#d97706',
    buttonGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    buttonText: '#081726',
    sealBorder: '#f59e0b',
    sealGlow: 'rgba(245, 158, 11, 0.6)',
    sealBg: '#05101a',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Playfair Display', serif",
  },
  seal: {
    eyebrow: 'Shubh Griha Pravesh • Vastu Havan',
    title: 'Auspicious New Beginning',
    subtitle: 'With The Divine Blessings Of Our Elders',
    actionText: 'Enter Haveli',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
      </svg>
    ),
  },
  ambientStyle: 'shehnai',
  audioLabel: 'Mangalya Shehnai',
  countdownLabel: 'Muhurtham Countdown',
  messageHeading: 'Vedic Griha Pravesh Invocation',
  rsvpType: 'branch',
  closingQuote: '🪔 गृहं तु सुखदं भूयात् सर्वसम्पत्समन्वितम् 🪔',
  closingSub: 'Shubh Pravesh with prayers & sweets',
  defaultData: {
    groom: 'The Rathore Family',
    bride: '',
    tagline: 'May this abode resonate with peace, prosperity, and auspicious footsteps',
    message: 'With the divine grace of the Almighty and blessings of our ancestors, we step into our new residence. Your presence will multiply our happiness.',
    events: [
      {
        key: 'vastu-puja',
        title: 'Vastu Havan & Navagraha Puja',
        date: '2027-06-21',
        time: '8:30 AM',
        venue: 'Aashirwad Niwas',
        address: 'Plot 42, Civil Lines, Jaipur',
        description: 'Vedic purification fire ritual, threshold milk boiling ceremony, and lamp lighting.',
      },
      {
        key: 'maha-prasad',
        title: 'Mahaprasad & Housewarming Banquet',
        date: '2027-06-21',
        time: '12:30 PM',
        venue: 'Aashirwad Courtyard',
        address: 'Plot 42, Civil Lines, Jaipur',
        description: 'Traditional Marwari lunch feast and welcoming guests through the carved jharokhas.',
      },
    ],
  },
};

export const urbanTerraceSoireeConfig: ThemedTemplateConfig = {
  slug: 'urban-terrace-soiree',
  gateTheme: 'urban_loft',
  category: 'housewarming',
  themeName: 'Urban Terrace Loft',
  badgeText: 'City View Loft Housewarming',
  badgeEmoji: '🏙️',
  colors: {
    bg: '#0f172a',
    bgGradient: 'bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#080d18]',
    cardBg: '#1a233a',
    cardBorder: '#38bdf8',
    primaryText: '#f8fafc',
    accentText: '#7dd3fc',
    mutedText: '#94a3b8',
    highlightBg: '#0284c7',
    buttonGradient: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
    buttonText: '#0f172a',
    sealBorder: '#38bdf8',
    sealGlow: 'rgba(56, 189, 248, 0.55)',
    sealBg: '#0a101d',
  },
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Penthouse Warming • Skyline Views',
    title: 'Top Floor Toast',
    subtitle: 'City Lights, Open Skies & New Memories',
    actionText: 'Take Elevator',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 2l9 5v13a2 2 0 01-2 2H5a2 2 0 01-2-2V7l9-5z" />
        <path d="M9 14h6" />
      </svg>
    ),
  },
  ambientStyle: 'lounge',
  audioLabel: 'Skyline Lounge',
  countdownLabel: 'Sundowner Starts In',
  messageHeading: 'The Skyline Welcome',
  rsvpType: 'standard',
  closingQuote: '🏙️ New views, new horizons, same great friends 🏙️',
  closingSub: 'Level 24 Penthouse Living',
  defaultData: {
    groom: 'Kunal & Maya',
    bride: 'Skyline Penthouse',
    tagline: 'High above the bustling city, we have found our quiet perch',
    message: 'Come check out the skyline views, sip some sundowners on the terrace, and help us christen our new urban loft with lots of laughter.',
    events: [
      {
        key: 'terrace-sundowner',
        title: 'Skyline Sundowner & House Tour',
        date: '2027-07-24',
        time: '6:00 PM',
        venue: 'Penthouse 24B, Tower One',
        address: 'Bandra-Kurla Complex, Mumbai',
        description: 'Cocktail tasting as the city lights up, followed by pizza on the deck.',
      },
    ],
  },
};

export const coastalBreezeHomeConfig: ThemedTemplateConfig = {
  slug: 'coastal-breeze-home',
  gateTheme: 'coastal_cottage',
  category: 'housewarming',
  themeName: 'Coastal Sea Breeze Haven',
  badgeText: 'Sea Glass & Beach Housewarming',
  badgeEmoji: '🌊',
  colors: {
    bg: '#081c24',
    bgGradient: 'bg-gradient-to-b from-[#102d38] via-[#081c24] to-[#040e12]',
    cardBg: '#0e2630',
    cardBorder: '#2dd4bf',
    primaryText: '#f0fdfa',
    accentText: '#5eead4',
    mutedText: '#99f6e4',
    highlightBg: '#0f766e',
    buttonGradient: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
    buttonText: '#081c24',
    sealBorder: '#2dd4bf',
    sealGlow: 'rgba(45, 212, 191, 0.55)',
    sealBg: '#051218',
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Seaside Abode • Anchoring Here',
    title: 'Where The Waves Greet Us',
    subtitle: 'Sea Salt, Sunlit Decks & Coastal Joy',
    actionText: 'Cast Anchor',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <circle cx="12" cy="5" r="3" />
        <path d="M12 22V8m0 14a8 8 0 01-8-8h2m14 0h2a8 8 0 01-8 8z" />
      </svg>
    ),
  },
  ambientStyle: 'celestial',
  audioLabel: 'Ocean Acoustics',
  countdownLabel: 'Anchor Drops In',
  messageHeading: 'From The Coastal Deck',
  rsvpType: 'standard',
  closingQuote: '🌊 Salt in the air, sand on our feet, home at last 🌊',
  closingSub: 'Our coastal refuge is complete with you',
  defaultData: {
    groom: 'Vivek & Priya',
    bride: 'The Seaside Villa',
    tagline: 'Listening to the ocean tide from our front porch every morning',
    message: 'We have traded city traffic for crashing waves! Come join us for a beachside housewarming feast with fresh grilled seafood and cool sea breezes.',
    events: [
      {
        key: 'beach-brunch',
        title: 'Coastal Deck Lunch & Sunset Stroll',
        date: '2027-08-22',
        time: '1:00 PM',
        venue: 'The Sea Breeze Villa',
        address: 'Baga Creek Road, North Goa',
        description: 'Seafood grill feast, beachside cocktails, and sunset music on the sand.',
      },
    ],
  },
};

/* ==========================================================================
   5. PARTY TEMPLATES (4 New)
   ========================================================================== */

export const tropicalSunsetLuauConfig: ThemedTemplateConfig = {
  slug: 'tropical-sunset-luau',
  gateTheme: 'tropical_luau',
  category: 'party',
  themeName: 'Tropical Sunset Luau',
  badgeText: 'Tiki Sunset & Neon Luau',
  badgeEmoji: '🌺',
  colors: {
    bg: '#1b0918',
    bgGradient: 'bg-gradient-to-b from-[#2e0e29] via-[#1b0918] to-[#0f040d]',
    cardBg: '#270e23',
    cardBorder: '#f43f5e',
    primaryText: '#fff1f2',
    accentText: '#fda4af',
    mutedText: '#f472b6',
    highlightBg: '#be123c',
    buttonGradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    buttonText: '#1b0918',
    sealBorder: '#f43f5e',
    sealGlow: 'rgba(244, 63, 94, 0.6)',
    sealBg: '#120510',
  },
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Sunset Island Bash • Tiki Luau',
    title: 'Aloha Sunset Soirée',
    subtitle: 'Fire Dancers, Coconut Cocktails & Good Vibes',
    actionText: 'Enter Luau',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 2a5 5 0 00-5 5v3a5 5 0 0010 0V7a5 5 0 00-5-5z" />
        <path d="M12 18v4m-4 0h8" />
      </svg>
    ),
  },
  ambientStyle: 'festive',
  audioLabel: 'Tropical Beats',
  countdownLabel: 'Luau Torch Lighting',
  messageHeading: 'Island Greeting',
  rsvpType: 'standard',
  closingQuote: '🌺 Aloha! Leave your worries by the shore 🌺',
  closingSub: 'Hosted with tropical warmth',
  defaultData: {
    groom: 'Summer Sundowner',
    bride: 'Tiki Island',
    tagline: 'When the sun dips low, the tiki torches blaze and the party begins',
    message: 'Slip into your favorite Hawaiian shirt or floral dress! We are bringing the tropical islands to life with fresh rum cocktails and island percussion.',
    events: [
      {
        key: 'tiki-cocktails',
        title: 'Tiki Bar Opens & Sunset DJ',
        date: '2027-05-22',
        time: '5:30 PM',
        venue: 'The Palm Cove Beach Club',
        address: 'Palolem Coastline, South Goa',
        description: 'Coconut shell punch, fire dancing showcase, and sunset tropical house grooves.',
      },
    ],
  },
};

export const studio54DiscoGlamConfig: ThemedTemplateConfig = {
  slug: 'studio54-disco-glam',
  gateTheme: 'studio54_disco',
  category: 'party',
  themeName: 'Studio 54 Disco Glam',
  badgeText: 'Mirror Ball & Iridescent Disco',
  badgeEmoji: '🪩',
  colors: {
    bg: '#07070a',
    bgGradient: 'bg-gradient-to-b from-[#181824] via-[#07070a] to-[#020204]',
    cardBg: '#101018',
    cardBorder: '#a855f7',
    primaryText: '#f8fafc',
    accentText: '#c084fc',
    mutedText: '#e2e8f0',
    highlightBg: '#7e22ce',
    buttonGradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    buttonText: '#07070a',
    sealBorder: '#a855f7',
    sealGlow: 'rgba(168, 85, 247, 0.65)',
    sealBg: '#050508',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'VIP Velvet Rope • Studio 54',
    title: 'The Mirror Ball Soirée',
    subtitle: 'Sequins, Strobe Lights & Non-stop Boogie',
    actionText: 'Drop In',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
      </svg>
    ),
  },
  ambientStyle: 'lounge',
  audioLabel: 'Nu-Disco Groove',
  countdownLabel: 'Dancefloor Opens In',
  messageHeading: 'The Guestlist VIP Access',
  rsvpType: 'vip',
  closingQuote: '🪩 Keep dancing till the morning lights come up 🪩',
  closingSub: 'Studio 54 VIP Pass Guaranteed',
  defaultData: {
    groom: 'The Disco Soirée',
    bride: 'VIP Night',
    tagline: 'Dust off your sequins and platform shoes for an unforgettable night beneath the mirror ball',
    message: 'The velvet rope is down for you. Join us under 1,000 mirrored facets for vintage disco classics and champagne towers.',
    events: [
      {
        key: 'disco-dancefloor',
        title: 'Mirror Ball Drops & Champagne Towers',
        date: '2027-06-19',
        time: '9:00 PM',
        venue: 'Studio Noir Club',
        address: 'Lower Parel Arts District, Mumbai',
        description: 'Live 70s disco tribute, vintage vinyl turntable sets, and midnight confetti blast.',
      },
    ],
  },
};

export const speakeasyRoaringTwentiesConfig: ThemedTemplateConfig = {
  slug: 'speakeasy-roaring-twenties',
  gateTheme: 'speakeasy_20s',
  category: 'party',
  themeName: 'Roaring 20s Speakeasy',
  badgeText: 'Prohibition Secret Lounge',
  badgeEmoji: '🎷',
  colors: {
    bg: '#140c06',
    bgGradient: 'bg-gradient-to-b from-[#24150b] via-[#140c06] to-[#0a0502]',
    cardBg: '#1b1008',
    cardBorder: '#eab308',
    primaryText: '#fef3c7',
    accentText: '#fbbf24',
    mutedText: '#d97706',
    highlightBg: '#92400e',
    buttonGradient: 'linear-gradient(135deg, #eab308 0%, #b45309 100%)',
    buttonText: '#140c06',
    sealBorder: '#eab308',
    sealGlow: 'rgba(234, 179, 8, 0.55)',
    sealBg: '#0e0703',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Cormorant Garamond', serif",
  },
  seal: {
    eyebrow: 'Top Secret • Knock Three Times',
    title: 'The Blind Tiger Speakeasy',
    subtitle: 'Behind The Bookcase • Est. 1927',
    actionText: 'Whisper Pass',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    ),
  },
  ambientStyle: 'jazz',
  audioLabel: 'Speakeasy Jazz',
  countdownLabel: 'Password Valid In',
  messageHeading: 'Secret Instructions',
  rsvpType: 'vip',
  closingQuote: '🎷 A little party never killed nobody 🎷',
  closingSub: 'Password revealed upon RSVP confirmation',
  defaultData: {
    groom: 'The Midnight Syndicate',
    bride: '',
    tagline: 'Slip through the hidden door into a world of craft prohibition cocktails',
    message: 'Knock three times and tell them Joe sent you. An evening of secret mixology, velvet banquettes, and sultry saxophone melodies.',
    events: [
      {
        key: 'secret-tasting',
        title: 'Hidden Door Opens & Jazz Quintet',
        date: '2027-07-31',
        time: '8:30 PM',
        venue: 'Behind The Tailor Shop',
        address: 'Connaught Place, New Delhi',
        description: 'Prohibition style Old Fashioneds, smoked bourbon infusions, and roaring twenties live band.',
      },
    ],
  },
};

export const poolsideSunDrenchedBashConfig: ThemedTemplateConfig = {
  slug: 'poolside-sun-drenched-bash',
  gateTheme: 'palm_springs_pool',
  category: 'party',
  themeName: 'Palm Springs Poolside Bash',
  badgeText: 'Sun-Drenched Pool Soirée',
  badgeEmoji: '☀️',
  colors: {
    bg: '#082633',
    bgGradient: 'bg-gradient-to-b from-[#0e3b50] via-[#082633] to-[#04141c]',
    cardBg: '#0c3040',
    cardBorder: '#06b6d4',
    primaryText: '#ecfeff',
    accentText: '#67e8f9',
    mutedText: '#a5f3fc',
    highlightBg: '#0891b2',
    buttonGradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
    buttonText: '#082633',
    sealBorder: '#06b6d4',
    sealGlow: 'rgba(6, 182, 212, 0.6)',
    sealBg: '#051820',
  },
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Poolside Splash • Day to Night',
    title: 'The Turquoise Splash',
    subtitle: 'Sunbeds, Spritzers & Deep House Waves',
    actionText: 'Dive In',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M2 12c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1 2.5 1 4 1M2 18c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1 2.5 1 4 1" />
      </svg>
    ),
  },
  ambientStyle: 'lounge',
  audioLabel: 'Deep House Waves',
  countdownLabel: 'Pool Gate Opens',
  messageHeading: 'What To Bring',
  rsvpType: 'standard',
  closingQuote: '☀️ Sun, splash, and endless summer memories ☀️',
  closingSub: 'Cabanas reserved for all guests',
  defaultData: {
    groom: 'Summer Splash',
    bride: 'Infinity Pool',
    tagline: 'Cool water, warm sun, chilled Aperol spritzers, and sunset beats',
    message: 'Bring your stylish swimwear and sunglasses! We are spending all afternoon lounging by the infinity pool with cold drinks and great tracks.',
    events: [
      {
        key: 'pool-party',
        title: 'Infinity Pool Lounge & Barbecue',
        date: '2027-08-14',
        time: '2:00 PM',
        venue: 'The Palm Springs Villa',
        address: 'Khandala Hilltop Estate, Maharashtra',
        description: 'Poolside mixologist bar, floaties galore, fresh sliders grill, and sunset DJ.',
      },
    ],
  },
};

/* ==========================================================================
   6. RELIGIOUS TEMPLATES (4 New)
   ========================================================================== */

export const shreeGaneshVandanaConfig: ThemedTemplateConfig = {
  slug: 'shree-ganesh-vandana',
  gateTheme: 'ganesh_mandap',
  category: 'religious',
  themeName: 'Shree Ganesh Sthapana',
  badgeText: 'Vighnaharta Divine Blessings',
  badgeEmoji: '🕉️',
  colors: {
    bg: '#250808',
    bgGradient: 'bg-gradient-to-b from-[#3d0f0f] via-[#250808] to-[#140404]',
    cardBg: '#300b0b',
    cardBorder: '#f59e0b',
    primaryText: '#fefce8',
    accentText: '#fbbf24',
    mutedText: '#fcd34d',
    highlightBg: '#b45309',
    buttonGradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
    buttonText: '#250808',
    sealBorder: '#f59e0b',
    sealGlow: 'rgba(245, 158, 11, 0.65)',
    sealBg: '#180505',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Playfair Display', serif",
  },
  seal: {
    eyebrow: 'ॐ श्री गणेशाय नमः • Shubh Sthapana',
    title: 'Ganpati Bappa Morya',
    subtitle: 'Vakratunda Mahakaya Suryakoti Samaprabha',
    actionText: 'Seek Blessings',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
  },
  ambientStyle: 'mantra',
  audioLabel: 'Vedic Om Mantra',
  countdownLabel: 'Sthapana Muhurtham',
  messageHeading: 'Auspicious Invitation',
  rsvpType: 'branch',
  closingQuote: '🕉️ निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा 🕉️',
  closingSub: 'Seeking Lord Ganesha\'s eternal grace',
  defaultData: {
    groom: 'The Sharma Family',
    bride: '',
    tagline: 'Inviting Lord Ganesha into our home to bestow wisdom, health, and prosperity',
    message: 'With folded hands and prayerful hearts, we invite you to join us for the auspicious Shree Ganesh Sthapana, Maha Aarti, and Mahaprasad.',
    events: [
      {
        key: 'ganesh-sthapana',
        title: 'Shree Ganesh Sthapana & Abhishek',
        date: '2027-09-04',
        time: '9:30 AM',
        venue: 'Ganesh Mandap Hall',
        address: 'Shivaji Park, Dadar West, Mumbai',
        description: 'Vedic mantras chanting, modak offering, and divine Shankh dhwani.',
      },
      {
        key: 'maha-aarti',
        title: 'Maha Aarti & Modak Mahaprasad',
        date: '2027-09-04',
        time: '12:30 PM',
        venue: 'Ganesh Mandap Hall',
        address: 'Shivaji Park, Dadar West, Mumbai',
        description: 'Grand communal aarti followed by traditional festive modak prasad.',
      },
    ],
  },
};

export const waheguruAnandBlessingsConfig: ThemedTemplateConfig = {
  slug: 'waheguru-anand-blessings',
  gateTheme: 'waheguru_darbar',
  category: 'religious',
  themeName: 'Akhand Path & Kirtan Darbar',
  badgeText: 'Ik Onkar Divine Grace',
  badgeEmoji: '☬',
  colors: {
    bg: '#08172c',
    bgGradient: 'bg-gradient-to-b from-[#0f294d] via-[#08172c] to-[#040c17]',
    cardBg: '#0c2242',
    cardBorder: '#f59e0b',
    primaryText: '#f8fafc',
    accentText: '#fbbf24',
    mutedText: '#93c5fd',
    highlightBg: '#d97706',
    buttonGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    buttonText: '#08172c',
    sealBorder: '#f59e0b',
    sealGlow: 'rgba(245, 158, 11, 0.6)',
    sealBg: '#05101f',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Playfair Display', serif",
  },
  seal: {
    eyebrow: 'ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ • Sri Akhand Path',
    title: 'Divine Kirtan Darbar',
    subtitle: 'Waheguru Ji Ka Khalsa • Waheguru Ji Ki Fateh',
    actionText: 'Enter Darbar',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 2v20m-7-7a7 7 0 0114 0m-14-6a7 7 0 0114 0" />
      </svg>
    ),
  },
  ambientStyle: 'temple',
  audioLabel: 'Sacred Gurbani Harmonics',
  countdownLabel: 'Bhog Sri Akhand Path',
  messageHeading: 'From The Family',
  rsvpType: 'branch',
  closingQuote: '☬ ਜੇ ਕੋ ਖਾਵੈ ਜੇ ਕੋ ਭੁੰਚੈ ਤਿਸ ਕਾ ਹੋਇ ਉਧਾਰੋ ☬',
  closingSub: 'With humble folds of hands and gratitude',
  defaultData: {
    groom: 'S. Gurmukh Singh & Family',
    bride: '',
    tagline: 'Bhog Sri Akhand Path Sahib followed by soulful Kirtan & Guru Ka Langar',
    message: 'By the supreme grace of Waheguru Ji, we cordially invite you and your family to partake in the holy congregation of Sri Akhand Path Sahib.',
    events: [
      {
        key: 'kirtan-darbar',
        title: 'Bhog Sri Akhand Path & Shabad Kirtan',
        date: '2027-10-15',
        time: '10:00 AM',
        venue: 'Gurdwara Sri Guru Singh Sabha',
        address: 'Mall Road, Amritsar',
        description: 'Soulful classical raga kirtan by Hazuri Ragi Jathas, followed by Anand Sahib.',
      },
      {
        key: 'guru-ka-langar',
        title: 'Guru Ka Langar & Ardas',
        date: '2027-10-15',
        time: '12:30 PM',
        venue: 'Langar Hall',
        address: 'Mall Road, Amritsar',
        description: 'Communal service and sacred Guru Ka Langar feast for all Sangat.',
      },
    ],
  },
};

export const cathedralGraceCommunionConfig: ThemedTemplateConfig = {
  slug: 'cathedral-grace-communion',
  gateTheme: 'cathedral_grace',
  category: 'religious',
  themeName: 'Sacred Holy Communion',
  badgeText: 'First Holy Communion & Grace',
  badgeEmoji: '🕊️',
  colors: {
    bg: '#0a101f',
    bgGradient: 'bg-gradient-to-b from-[#14213d] via-[#0a101f] to-[#050810]',
    cardBg: '#101c36',
    cardBorder: '#e2e8f0',
    primaryText: '#f8fafc',
    accentText: '#fde047',
    mutedText: '#cbd5e1',
    highlightBg: '#1e3a8a',
    buttonGradient: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
    buttonText: '#0a101f',
    sealBorder: '#e2e8f0',
    sealGlow: 'rgba(226, 232, 240, 0.55)',
    sealBg: '#070b16',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Cormorant Garamond', serif",
  },
  seal: {
    eyebrow: 'Sacrament of First Holy Communion',
    title: 'Blessed by His Grace',
    subtitle: 'This Day and Evermore',
    actionText: 'Receive Grace',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 2v20M6 8h12" />
      </svg>
    ),
  },
  ambientStyle: 'orchestral',
  audioLabel: 'Cathedral Organ',
  countdownLabel: 'Holy Mass In',
  messageHeading: 'A Blessed Milestone',
  rsvpType: 'standard',
  closingQuote: '🕊️ I am the bread of life. Whoever comes to me will never hunger 🕊️',
  closingSub: 'Guided by faith, hope, and love',
  defaultData: {
    groom: 'Ethan Michael',
    bride: 'First Communion',
    tagline: 'Receiving the Holy Sacrament of First Communion surrounded by loved ones',
    message: 'Please join our family as Ethan receives his First Holy Communion at the Cathedral, followed by a celebratory luncheon.',
    events: [
      {
        key: 'holy-mass',
        title: 'Holy Communion Mass',
        date: '2027-11-07',
        time: '10:00 AM',
        venue: 'St. Mary\'s Cathedral',
        address: 'Cathedral Road, Bangalore',
        description: 'Sacred mass and receiving the holy bread with family and godparents.',
      },
      {
        key: 'communion-luncheon',
        title: 'Celebratory Garden Luncheon',
        date: '2027-11-07',
        time: '12:30 PM',
        venue: 'The Grand Terrace Garden',
        address: 'Cathedral Road, Bangalore',
        description: 'Communion cake cutting, choir music, and multi-course luncheon.',
      },
    ],
  },
};

export const noorEMehfilNikahEidConfig: ThemedTemplateConfig = {
  slug: 'noor-e-mehfil-nikah-eid',
  gateTheme: 'islamic_mehfil',
  category: 'religious',
  themeName: 'Noor-e-Mehfil Islamic Gala',
  badgeText: 'Crescent Moon & Sacred Noor',
  badgeEmoji: '🌙',
  colors: {
    bg: '#041d17',
    bgGradient: 'bg-gradient-to-b from-[#0a362b] via-[#041d17] to-[#020e0b]',
    cardBg: '#07271f',
    cardBorder: '#f59e0b',
    primaryText: '#f8fafc',
    accentText: '#fbbf24',
    mutedText: '#6ee7b7',
    highlightBg: '#065f46',
    buttonGradient: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
    buttonText: '#041d17',
    sealBorder: '#f59e0b',
    sealGlow: 'rgba(245, 158, 11, 0.6)',
    sealBg: '#031410',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Playfair Display', serif",
  },
  seal: {
    eyebrow: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • Noor',
    title: 'A Sacred Gathering of Faith',
    subtitle: 'Under The Blessed Crescent Light',
    actionText: 'View Mehfil',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ),
  },
  ambientStyle: 'temple',
  audioLabel: 'Sufi Ambient Harmonics',
  countdownLabel: 'Mehfil Commences In',
  messageHeading: 'Barakah & Dua',
  rsvpType: 'branch',
  closingQuote: '🌙 May Allah bless our gathering with peace, joy, and barakah 🌙',
  closingSub: 'Shukran for your prayers and gracious presence',
  defaultData: {
    groom: 'The Al-Mansoor Family',
    bride: '',
    tagline: 'A joyful evening of heartfelt Duas, Naat recitation, and Dastarkhwan feast',
    message: 'We seek your gracious presence and heartfelt prayers as we gather to celebrate the blessings of faith, kinship, and family.',
    events: [
      {
        key: 'dua-mehfil',
        title: 'Naat Recitation & Dua Session',
        date: '2027-12-04',
        time: '6:30 PM',
        venue: 'The Grand Noor Hall',
        address: 'Banjara Hills, Hyderabad',
        description: 'Soulful recitation of Naat and collective prayers for peace and prosperity.',
      },
      {
        key: 'dastarkhwan',
        title: 'Traditional Royal Dastarkhwan Banquet',
        date: '2027-12-04',
        time: '8:30 PM',
        venue: 'The Courtyard Pavilion',
        address: 'Banjara Hills, Hyderabad',
        description: 'Authentic Hyderabadi Dum Biryani, royal kebabs, and Sheer Khurma dessert.',
      },
    ],
  },
};

/* ==========================================================================
   7. FAMILY CELEBRATION TEMPLATES (4 New)
   ========================================================================== */

export const vintageRootsFamilyArchiveConfig: ThemedTemplateConfig = {
  slug: 'vintage-roots-family-archive',
  gateTheme: 'vintage_archive',
  category: 'family_celebration',
  themeName: 'Vintage Roots Family Archive',
  badgeText: 'Heirloom Chronicles & Family Reunion',
  badgeEmoji: '📖',
  colors: {
    bg: '#18110b',
    bgGradient: 'bg-gradient-to-b from-[#291e14] via-[#18110b] to-[#0c0805]',
    cardBg: '#21170f',
    cardBorder: '#d97706',
    primaryText: '#fef3c7',
    accentText: '#fbbf24',
    mutedText: '#fed7aa',
    highlightBg: '#92400e',
    buttonGradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    buttonText: '#18110b',
    sealBorder: '#d97706',
    sealGlow: 'rgba(217, 119, 6, 0.55)',
    sealBg: '#100a06',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Cormorant Garamond', serif",
  },
  seal: {
    eyebrow: 'Family Archive • Four Generations',
    title: 'The Ancestral Chronicle',
    subtitle: 'Where Every Story Finds Its Home',
    actionText: 'Open Album',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />
      </svg>
    ),
  },
  ambientStyle: 'orchestral',
  audioLabel: 'Heirloom Symphony',
  countdownLabel: 'Homecoming In',
  messageHeading: 'From The Family Chronicles',
  rsvpType: 'branch',
  closingQuote: '📖 Other things may change us, but we start and end with family 📖',
  closingSub: 'Honoring our ancestors, loving our descendants',
  defaultData: {
    groom: 'The Deshmukh Ancestry',
    bride: 'Centennial Reunion',
    tagline: '100 years since our ancestral roots were planted, four generations united',
    message: 'Flip through the vintage pages of our shared heritage! We invite all family branches to reunite, share old photographs, and capture our grand centennial family portrait.',
    events: [
      {
        key: 'archives-exhibition',
        title: 'Family Tree Unveiling & Photo Archive',
        date: '2027-05-08',
        time: '3:00 PM',
        venue: 'The Heritage Manor',
        address: 'Mahabaleshwar Old Estate, Maharashtra',
        description: 'Exhibition of heirloom letters, archival portraits, and family tree mapping.',
      },
      {
        key: 'ancestral-banquet',
        title: 'Centennial Family Feast & Story Circle',
        date: '2027-05-08',
        time: '7:00 PM',
        venue: 'The Banyan Courtyard',
        address: 'Mahabaleshwar Old Estate, Maharashtra',
        description: 'Grand family potluck banquet, storytelling by the elders, and folk music.',
      },
    ],
  },
};

export const sunlitPicnicCarnivalConfig: ThemedTemplateConfig = {
  slug: 'sunlit-picnic-carnival',
  gateTheme: 'picnic_carnival',
  category: 'family_celebration',
  themeName: 'Sunlit Lawn Carnival',
  badgeText: 'Picnic Games & Barbecue Reunion',
  badgeEmoji: '🧺',
  colors: {
    bg: '#0f291a',
    bgGradient: 'bg-gradient-to-b from-[#19422b] via-[#0f291a] to-[#07140d]',
    cardBg: '#153623',
    cardBorder: '#4ade80',
    primaryText: '#f0fdf4',
    accentText: '#86efac',
    mutedText: '#bbf7d0',
    highlightBg: '#16a34a',
    buttonGradient: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
    buttonText: '#0f291a',
    sealBorder: '#4ade80',
    sealGlow: 'rgba(74, 222, 128, 0.55)',
    sealBg: '#0a1d13',
  },
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Family Fun Day • Lawn Carnival',
    title: 'The Great Family Picnic',
    subtitle: 'Tug of War, Ice Cream & Endless Laughs',
    actionText: 'Join Picnic',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 2l7 7-7 7-7-7 7-7z" />
      </svg>
    ),
  },
  ambientStyle: 'festive',
  audioLabel: 'Lawn Party Chords',
  countdownLabel: 'Picnic Starts In',
  messageHeading: 'Lawn Games & Merriment',
  rsvpType: 'branch',
  closingQuote: '🧺 Laughter is brightest where food and family meet 🧺',
  closingSub: 'Bring your lawn chairs and winning smiles',
  defaultData: {
    groom: 'The Sharma & Verma Clans',
    bride: 'Summer Carnival',
    tagline: 'Sunny meadows, barbecue smoke, lawn games, and cousins reunited',
    message: 'Dust off your picnic baskets! We are gathering all the aunties, uncles, cousins, and grandkids for an action-packed family picnic carnival.',
    events: [
      {
        key: 'lawn-games',
        title: 'Three-Legged Race & Tug of War',
        date: '2027-06-13',
        time: '11:00 AM',
        venue: 'The Meadow Greens',
        address: 'Sohna Road Nature Park, Gurgaon',
        description: 'Inter-branch tug-of-war championship, water balloon toss, and giant Jenga.',
      },
      {
        key: 'bbq-feast',
        title: 'Grand Family Barbecue & Ice Cream Cart',
        date: '2027-06-13',
        time: '1:30 PM',
        venue: 'The Picnic Pavilion',
        address: 'Sohna Road Nature Park, Gurgaon',
        description: 'Fresh grilled corn, barbecue delights, and unlimited ice cream cones.',
      },
    ],
  },
};

export const festiveDiwaliFamilyMilanConfig: ThemedTemplateConfig = {
  slug: 'festive-diwali-family-milan',
  gateTheme: 'diwali_milan',
  category: 'family_celebration',
  themeName: 'Diwali Sneh Milan',
  badgeText: 'Festive Lights & Sneh Milan',
  badgeEmoji: '✨',
  colors: {
    bg: '#230a2e',
    bgGradient: 'bg-gradient-to-b from-[#38114a] via-[#230a2e] to-[#120419]',
    cardBg: '#2c0c3b',
    cardBorder: '#f59e0b',
    primaryText: '#faf5ff',
    accentText: '#fbbf24',
    mutedText: '#e9d5ff',
    highlightBg: '#9333ea',
    buttonGradient: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
    buttonText: '#230a2e',
    sealBorder: '#f59e0b',
    sealGlow: 'rgba(245, 158, 11, 0.6)',
    sealBg: '#180620',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Playfair Display', serif",
  },
  seal: {
    eyebrow: 'Shubh Deepavali • Sneh Milan',
    title: 'Festival of Lights & Kinship',
    subtitle: 'Sweet Delicacies, Sparklers & Warm Hugs',
    actionText: 'Light Diya',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 2c1 3 3 5 3 8a6 6 0 11-12 0c0-3 2-5 3-8 1 2 2 3 3 3s2-1 3-3z" />
      </svg>
    ),
  },
  ambientStyle: 'temple',
  audioLabel: 'Festive Tanpura & Sitar',
  countdownLabel: 'Diya Lighting In',
  messageHeading: 'Diwali Warmth & Blessings',
  rsvpType: 'branch',
  closingQuote: '✨ May the festival of lights illuminate our family bond forever ✨',
  closingSub: 'Shubh Deepavali from our entire family',
  defaultData: {
    groom: 'The Aggarwal Parivaar',
    bride: 'Diwali Sneh Milan',
    tagline: 'Lighting a thousand lamps together, celebrating the triumph of love and light',
    message: 'Diwali is never complete without family! We warmly invite you to our annual Diwali Sneh Milan for Lakshmi Puja, sweets exchange, and festive dinner.',
    events: [
      {
        key: 'lakshmi-puja',
        title: 'Shree Lakshmi-Ganesh Puja & Diyas',
        date: '2027-11-01',
        time: '6:30 PM',
        venue: 'Aggarwal Haveli Lawn',
        address: 'Ring Road, Model Town, Delhi',
        description: 'Chanting auspicious prayers, lighting rows of golden ghee diyas, and sweets distribution.',
      },
      {
        key: 'festive-dinner',
        title: 'Diwali Milan Banquet & Sparklers',
        date: '2027-11-01',
        time: '8:30 PM',
        venue: 'The Grand Courtyard',
        address: 'Ring Road, Model Town, Delhi',
        description: 'Traditional festive dinner, mawa sweets spread, and eco-friendly sparklers celebration.',
      },
    ],
  },
};

export const generationsAnchoredReunionConfig: ThemedTemplateConfig = {
  slug: 'generations-anchored-reunion',
  gateTheme: 'nautical_anchorage',
  category: 'family_celebration',
  themeName: 'Nautical Generations Anchorage',
  badgeText: 'Lakeside Anchored Family Reunion',
  badgeEmoji: '⚓',
  colors: {
    bg: '#081728',
    bgGradient: 'bg-gradient-to-b from-[#0f2a47] via-[#081728] to-[#040c14]',
    cardBg: '#0d223a',
    cardBorder: '#38bdf8',
    primaryText: '#f8fafc',
    accentText: '#7dd3fc',
    mutedText: '#bae6fd',
    highlightBg: '#0284c7',
    buttonGradient: 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)',
    buttonText: '#081728',
    sealBorder: '#38bdf8',
    sealGlow: 'rgba(56, 189, 248, 0.55)',
    sealBg: '#05101c',
  },
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Anchored In Love • Family Voyage',
    title: 'The Great Lakehouse Gathering',
    subtitle: 'Three Generations Together On The Water',
    actionText: 'Step Aboard',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <circle cx="12" cy="5" r="3" />
        <path d="M12 22V8m0 14a8 8 0 01-8-8h2m14 0h2a8 8 0 01-8 8z" />
      </svg>
    ),
  },
  ambientStyle: 'celestial',
  audioLabel: 'Lakeside Acoustics',
  countdownLabel: 'Embarkation Countdown',
  messageHeading: 'From The Captain\'s Table',
  rsvpType: 'branch',
  closingQuote: '⚓ Anchored in love, steered by wisdom, bound forever ⚓',
  closingSub: 'The whole family crew together',
  defaultData: {
    groom: 'The Sen & Mukherjee Families',
    bride: 'Lakeside Retreat',
    tagline: 'Gathered by the shimmering waters for bonfires, boat rides, and stories',
    message: 'Drop your anchor with us! We have rented the lakeside cottages for the entire weekend. Join us for fishing, kayaking, stargazing, and timeless family bonding.',
    events: [
      {
        key: 'boat-ride',
        title: 'Sunset Boat Cruise & Lake Feast',
        date: '2027-12-05',
        time: '4:00 PM',
        venue: 'The Lakehouse Pier',
        address: 'Bhimtal Lake Front, Uttarakhand',
        description: 'Scenic sunset boat tour, followed by outdoor bonfire barbecue on the deck.',
      },
    ],
  },
};

/* ==========================================================================
   8. OTHER / SPECIAL OCCASION TEMPLATES (4 New)
   ========================================================================== */

export const commencementExcellenceConfig: ThemedTemplateConfig = {
  slug: 'commencement-excellence',
  gateTheme: 'commencement',
  category: 'other',
  themeName: 'Commencement Academic Honors',
  badgeText: 'Convocation & Academic Triumph',
  badgeEmoji: '🎓',
  colors: {
    bg: '#0c1322',
    bgGradient: 'bg-gradient-to-b from-[#16233d] via-[#0c1322] to-[#060a12]',
    cardBg: '#121d33',
    cardBorder: '#fbbf24',
    primaryText: '#f8fafc',
    accentText: '#fde68a',
    mutedText: '#cbd5e1',
    highlightBg: '#1e3a8a',
    buttonGradient: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    buttonText: '#0c1322',
    sealBorder: '#fbbf24',
    sealGlow: 'rgba(251, 191, 36, 0.6)',
    sealBg: '#080c17',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Playfair Display', serif",
  },
  seal: {
    eyebrow: 'Academic Honors • Class of 2027',
    title: 'The Commencement Celebration',
    subtitle: 'Honoring Years of Rigor, Vision & Excellence',
    actionText: 'View Honors',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
  },
  ambientStyle: 'orchestral',
  audioLabel: 'Graduation Fanfare',
  countdownLabel: 'Degree Conferral In',
  messageHeading: 'The Graduate\'s Reflection',
  rsvpType: 'standard',
  closingQuote: '🎓 Go confidently in the direction of your dreams 🎓',
  closingSub: 'Celebrated by mentors, family, and peers',
  defaultData: {
    groom: 'Dr. Siddharth Rao',
    bride: 'Doctor of Medicine',
    tagline: 'A decade of dedication culminated in the conferral of honors',
    message: 'With immense pride and gratitude to all who supported this journey, you are warmly invited to the graduation reception and toast.',
    events: [
      {
        key: 'commencement-reception',
        title: 'Academic Honors Reception & Dinner',
        date: '2027-06-26',
        time: '6:30 PM',
        venue: 'The University Senate Banquet Hall',
        address: 'Churchgate Campus, Mumbai',
        description: 'Cap toss ceremony, mentor toasts, and multi-course celebratory dinner.',
      },
    ],
  },
};

export const philanthropyCrystalBallConfig: ThemedTemplateConfig = {
  slug: 'philanthropy-crystal-ball',
  gateTheme: 'philanthropy_crystal',
  category: 'other',
  themeName: 'Crystal Philanthropy Ball',
  badgeText: 'Black Tie Charity Fundraiser',
  badgeEmoji: '💎',
  colors: {
    bg: '#051814',
    bgGradient: 'bg-gradient-to-b from-[#0a2e26] via-[#051814] to-[#020d0b]',
    cardBg: '#09241e',
    cardBorder: '#34d399',
    primaryText: '#f0fdf4',
    accentText: '#6ee7b7',
    mutedText: '#a7f3d0',
    highlightBg: '#047857',
    buttonGradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
    buttonText: '#051814',
    sealBorder: '#34d399',
    sealGlow: 'rgba(52, 211, 153, 0.6)',
    sealBg: '#03120f',
  },
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Playfair Display', serif",
  },
  seal: {
    eyebrow: 'Annual Charity Ball • Grand Benefactors',
    title: 'The Hope & Crystal Gala',
    subtitle: 'Lighting Pathways of Change Together',
    actionText: 'Support Cause',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  ambientStyle: 'orchestral',
  audioLabel: 'Crystal Symphony',
  countdownLabel: 'Gala Doors Open',
  messageHeading: 'The Foundation Mission',
  rsvpType: 'vip',
  closingQuote: '💎 Giving is not just about making a donation, it is about making a difference 💎',
  closingSub: 'Under the patronage of the Board of Trustees',
  defaultData: {
    groom: 'The Hope Foundation',
    bride: 'Annual Benefit',
    tagline: 'An evening of classical grace dedicated to funding children\'s education',
    message: 'Join corporate benefactors and civic leaders under crystal chandeliers for a night of live orchestral performances and a charity auction.',
    events: [
      {
        key: 'charity-auction',
        title: 'Grand Charity Gala & Live Auction',
        date: '2027-09-25',
        time: '7:00 PM',
        venue: 'The Grand Hyatt Crystal Ballroom',
        address: 'Santacruz East, Mumbai',
        description: 'Champagne reception, silent art auction, and 5-course benefactor dinner.',
      },
    ],
  },
};

export const techSummitFutureVisionConfig: ThemedTemplateConfig = {
  slug: 'tech-summit-future-vision',
  gateTheme: 'tech_summit',
  category: 'other',
  themeName: 'Executive Tech Vision Summit',
  badgeText: 'Executive Innovation Summit',
  badgeEmoji: '⚡',
  colors: {
    bg: '#080c16',
    bgGradient: 'bg-gradient-to-b from-[#10182b] via-[#080c16] to-[#04060b]',
    cardBg: '#0f1728',
    cardBorder: '#818cf8',
    primaryText: '#f8fafc',
    accentText: '#a5b4fc',
    mutedText: '#c7d2fe',
    highlightBg: '#4f46e5',
    buttonGradient: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
    buttonText: '#ffffff',
    sealBorder: '#818cf8',
    sealGlow: 'rgba(129, 140, 248, 0.65)',
    sealBg: '#060911',
  },
  fonts: {
    heading: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'Executive Pass • Horizon 2030',
    title: 'The Global Future Summit',
    subtitle: 'Where Artificial Intelligence Meets Human Vision',
    actionText: 'Access Key',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  ambientStyle: 'lounge',
  audioLabel: 'Ambient Pulse',
  countdownLabel: 'Keynote Starts In',
  messageHeading: 'The Executive Brief',
  rsvpType: 'vip',
  closingQuote: '⚡ Shaping the future through bold innovation and global collaboration ⚡',
  closingSub: 'The Horizon Executive Council',
  defaultData: {
    groom: 'Global Tech Visionaries',
    bride: 'Horizon 2030',
    tagline: 'Convening the world\'s most ambitious founders and technology leaders',
    message: 'You have been selected to attend an exclusive closed-door executive summit exploring the next decade of autonomous intelligence and robotics.',
    events: [
      {
        key: 'future-keynote',
        title: 'Opening Keynote & AI Roundtable',
        date: '2027-10-18',
        time: '9:00 AM',
        venue: 'The Innovation Dome',
        address: 'Electronic City, Bangalore',
        description: 'Keynotes by visionary founders, deep tech showcases, and private networking lounge.',
      },
    ],
  },
};

export const bonVoyageWanderlustConfig: ThemedTemplateConfig = {
  slug: 'bon-voyage-wanderlust',
  gateTheme: 'wanderlust_airmail',
  category: 'other',
  themeName: 'Bon Voyage & Wanderlust',
  badgeText: 'Retirement & World Sabbatical',
  badgeEmoji: '✈️',
  colors: {
    bg: '#16110b',
    bgGradient: 'bg-gradient-to-b from-[#251d14] via-[#16110b] to-[#0c0906]',
    cardBg: '#1e1710',
    cardBorder: '#f97316',
    primaryText: '#fff7ed',
    accentText: '#fdba74',
    mutedText: '#fed7aa',
    highlightBg: '#c2410c',
    buttonGradient: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
    buttonText: '#16110b',
    sealBorder: '#f97316',
    sealGlow: 'rgba(249, 115, 22, 0.55)',
    sealBg: '#100b07',
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Outfit', sans-serif",
  },
  seal: {
    eyebrow: 'New Journey • Bon Voyage',
    title: 'The Next Great Adventure',
    subtitle: 'Passport Stamped, Heart Ready',
    actionText: 'Bon Voyage',
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8">
        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
  },
  ambientStyle: 'celestial',
  audioLabel: 'Wanderlust Acoustics',
  countdownLabel: 'Takeoff In',
  messageHeading: 'The Traveler\'s Note',
  rsvpType: 'standard',
  closingQuote: '✈️ Not all those who wander are lost • Safe travels! ✈️',
  closingSub: 'Cheers to new horizons and uncharted paths',
  defaultData: {
    groom: 'Captain Rajesh Malhotra',
    bride: 'World Tour',
    tagline: 'Celebrating 35 years of dedicated career and embarking on a world cruise',
    message: 'After 35 years in the pilot seat and boardroom, it is time to set sail for the world! Join us for a farewell evening before we embark on our globetrotting journey.',
    events: [
      {
        key: 'farewell-toast',
        title: 'Bon Voyage Toast & Sundowner Supper',
        date: '2027-11-28',
        time: '5:30 PM',
        venue: 'The Yacht Club Deck',
        address: 'Apollo Bunder, Colaba, Mumbai',
        description: 'Champagne toast against the harbor sunset, compass gifts, and travel memories.',
      },
    ],
  },
};

/* ==========================================================================
   EXPORTED REACT COMPONENTS
   ========================================================================== */

// Birthday
export const RetroSynthArcade = createThemedTemplate(retroSynthArcadeConfig);
export const EnchantedStorybookBirthday = createThemedTemplate(enchantedStorybookBirthdayConfig);
export const SafariWildOne = createThemedTemplate(safariWildOneConfig);
export const VintageDistilleryMilestone = createThemedTemplate(vintageDistilleryMilestoneConfig);

// Anniversary
export const GoldenJubilee50th = createThemedTemplate(goldenJubilee50thConfig);
export const RubyRomance40th = createThemedTemplate(rubyRomance40thConfig);
export const BohoSunsetVows = createThemedTemplate(bohoSunsetVowsConfig);
export const MonochromeFilmNoirAnniversary = createThemedTemplate(monochromeFilmNoirAnniversaryConfig);

// Baby Shower
export const WoodlandFableShower = createThemedTemplate(woodlandFableShowerConfig);
export const RoyalLittlePrincePrincess = createThemedTemplate(royalLittlePrincePrincessConfig);
export const SunshineMeadowShower = createThemedTemplate(sunshineMeadowShowerConfig);
export const BohoRainbowMiracle = createThemedTemplate(bohoRainbowMiracleConfig);

// Housewarming
export const ScandiMinimalHaven = createThemedTemplate(scandiMinimalHavenConfig);
export const RajasthaniJharokhaGriha = createThemedTemplate(rajasthaniJharokhaGrihaConfig);
export const UrbanTerraceSoiree = createThemedTemplate(urbanTerraceSoireeConfig);
export const CoastalBreezeHome = createThemedTemplate(coastalBreezeHomeConfig);

// Party
export const TropicalSunsetLuau = createThemedTemplate(tropicalSunsetLuauConfig);
export const Studio54DiscoGlam = createThemedTemplate(studio54DiscoGlamConfig);
export const SpeakeasyRoaringTwenties = createThemedTemplate(speakeasyRoaringTwentiesConfig);
export const PoolsideSunDrenchedBash = createThemedTemplate(poolsideSunDrenchedBashConfig);

// Religious
export const ShreeGaneshVandana = createThemedTemplate(shreeGaneshVandanaConfig);
export const WaheguruAnandBlessings = createThemedTemplate(waheguruAnandBlessingsConfig);
export const CathedralGraceCommunion = createThemedTemplate(cathedralGraceCommunionConfig);
export const NoorEMehfilNikahEid = createThemedTemplate(noorEMehfilNikahEidConfig);

// Family Celebration
export const VintageRootsFamilyArchive = createThemedTemplate(vintageRootsFamilyArchiveConfig);
export const SunlitPicnicCarnival = createThemedTemplate(sunlitPicnicCarnivalConfig);
export const FestiveDiwaliFamilyMilan = createThemedTemplate(festiveDiwaliFamilyMilanConfig);
export const GenerationsAnchoredReunion = createThemedTemplate(generationsAnchoredReunionConfig);

// Other
export const CommencementExcellence = createThemedTemplate(commencementExcellenceConfig);
export const PhilanthropyCrystalBall = createThemedTemplate(philanthropyCrystalBallConfig);
export const TechSummitFutureVision = createThemedTemplate(techSummitFutureVisionConfig);
export const BonVoyageWanderlust = createThemedTemplate(bonVoyageWanderlustConfig);

