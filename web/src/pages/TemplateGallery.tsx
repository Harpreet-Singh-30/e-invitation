import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import TemplateThumbnail from '../components/TemplateThumbnail';
import { useAuth } from '../contexts/AuthContext';
import { registerThemeInCatalog } from '../templates/registry';
import api from '../lib/api';

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  previewImageUrl: string;
  priceTier: string;
  priceAmount: number;
  isFeatured: boolean;
  templateComponent: string;
  themeId?: string; // Database Theme ID
  defaultColors?: any;
  defaultFonts?: any;
}

const OCCASION_FILTERS = [
  { id: 'all', name: 'All', icon: '✨' },
  { id: 'wedding', name: 'Wedding', icon: '💒' },
  { id: 'birthday', name: 'Birthday', icon: '🎂' },
  { id: 'anniversary', name: 'Anniversary', icon: '💝' },
  { id: 'baby_shower', name: 'Baby Shower', icon: '👶' },
  { id: 'housewarming', name: 'Housewarming', icon: '🏠' },
  { id: 'party', name: 'Party', icon: '🎉' },
  { id: 'religious', name: 'Religious', icon: '🙏' },
  { id: 'family_celebration', name: 'Family Celebration', icon: '👨‍👩‍👧‍👦' },
  { id: 'other', name: 'Other', icon: '🎊' },
];

// Hardcoded templates matching our 3 existing frontend components
// NOTE: Theme IDs are from actual database records (see seed.ts)
const AVAILABLE_TEMPLATES: Template[] = [
  {
    id: 'art-deco-noir',
    name: 'Art Deco Noir',
    slug: 'art-deco-noir',
    description: '1920s Great Gatsby luxury with obsidian black, warm champagne gold, geometric ziggurats, and entrance gate',
    category: 'wedding',
    previewImageUrl: '/templates/art-deco-noir-preview.jpg',
    priceTier: 'premium',
    priceAmount: 69900,
    isFeatured: true,
    templateComponent: 'ArtDecoNoirTemplate',
    themeId: 'd52c90fe-2f7a-4de7-adc7-149f6c24a93e',
  },
  {
    id: 'imperial-burgundy',
    name: 'Imperial Burgundy',
    slug: 'imperial-burgundy',
    description: 'Grand royal Indian palace celebration with velvet burgundy, antique gold filigree, and double palace doors',
    category: 'wedding',
    previewImageUrl: '/templates/imperial-burgundy-preview.jpg',
    priceTier: 'premium',
    priceAmount: 59900,
    isFeatured: true,
    templateComponent: 'ImperialBurgundyTemplate',
    themeId: '5128f3b2-868d-41f4-b7e5-bd3893c33313',
  },
  {
    id: 'botanical-romance',
    name: 'Botanical Romance',
    slug: 'botanical-romance',
    description: 'Contemporary romantic garden theme with soft sage green, blush rose, delicate botanicals, and ambient sound',
    category: 'wedding',
    previewImageUrl: '/templates/botanical-romance-preview.jpg',
    priceTier: 'free',
    priceAmount: 0,
    isFeatured: false,
    templateComponent: 'BotanicalRomanceTemplate',
    themeId: 'e5a3820b-ab0c-4c13-9626-0c796d269ff9',
  },
  {
    id: 'phulkari-celebration',
    name: 'Phulkari Celebration',
    slug: 'phulkari-celebration',
    description: 'Vibrant Punjabi wedding theme with authentic Phulkari cross-stitch embroidery and festive itinerary',
    category: 'wedding',
    previewImageUrl: '/templates/phulkari-celebration-preview.jpg',
    priceTier: 'premium',
    priceAmount: 59900,
    isFeatured: true,
    templateComponent: 'PhulkariCelebrationTemplate',
    themeId: 'c9643353-1765-440f-b1ac-0477df0f2525',
  },
  {
    id: 'coastal-pearl',
    name: 'Coastal Pearl',
    slug: 'coastal-pearl',
    description: 'Serene coastal destination theme with oceanic wave reveal, delicate shell fans, and pearl strands',
    category: 'wedding',
    previewImageUrl: '/templates/coastal-pearl-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: false,
    templateComponent: 'CoastalPearlTemplate',
    themeId: '91049c3e-54cd-4a29-add1-972d4fce0a22',
  },
  {
    id: 'ivory-kayal',
    name: 'Ivory Kayal',
    slug: 'ivory-kayal',
    description: 'South Indian heritage theme with warm ivory tones, muted sage green, and antique gold accents',
    category: 'wedding',
    previewImageUrl: '/templates/ivory-kayal-preview.jpg',
    priceTier: 'premium',
    priceAmount: 59900,
    isFeatured: false,
    templateComponent: 'ivory-kayal-01',
    themeId: '093b32a3-1925-4b85-9f6a-d729db2be9be',
  },
  {
    id: 'marigold-courtyard',
    name: 'Marigold Courtyard',
    slug: 'marigold-courtyard',
    description: 'Festive Indian wedding theme with vibrant marigold orange, terracotta, and multi-event celebrations',
    category: 'wedding',
    previewImageUrl: '/templates/marigold-courtyard-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: false,
    templateComponent: 'marigold-courtyard-01',
    themeId: '58b36b41-1ea3-4279-862e-5674a63a9d6a',
  },
  {
    id: 'midnight-vows',
    name: 'Midnight Vows',
    slug: 'midnight-vows',
    description: 'Cinematic luxury theme with deep midnight navy, dark plum undertones, and starlight champagne gold',
    category: 'wedding',
    previewImageUrl: '/templates/midnight-vows-preview.jpg',
    priceTier: 'premium',
    priceAmount: 69900,
    isFeatured: false,
    templateComponent: 'midnight-vows-01',
    themeId: '1056bc70-959d-42e4-9a2f-058418ceba6e',
  },
  {
    id: 'golden-milestone',
    name: 'Golden Milestone Soirée',
    slug: 'golden-milestone',
    description: 'Glamorous milestone birthday celebration with obsidian velvet, champagne gold foil, toast countdown, and party line-up',
    category: 'birthday',
    previewImageUrl: '/templates/golden-milestone-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'GoldenMilestoneTemplate',
    themeId: 'ba5fb147-fc1d-401d-a6a4-6728d0891651',
  },
  {
    id: 'silver-jubilee',
    name: 'Silver Jubilee Elegance',
    slug: 'silver-jubilee',
    description: 'Timeless milestone anniversary theme with polished sterling silver, love journey timeline, and vow renewal banquet',
    category: 'anniversary',
    previewImageUrl: '/templates/silver-jubilee-preview.jpg',
    priceTier: 'premium',
    priceAmount: 59900,
    isFeatured: true,
    templateComponent: 'SilverJubileeTemplate',
    themeId: 'a1140001-2525-4444-9999-511verjub101',
  },
  {
    id: 'celestial-lullaby',
    name: 'Celestial Lullaby',
    slug: 'celestial-lullaby',
    description: 'Whimsical baby shower theme with pastel cloud mist, crescent moon starlight, storybook envelope, and high tea program',
    category: 'baby_shower',
    previewImageUrl: '/templates/celestial-lullaby-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'CelestialLullabyTemplate',
    themeId: 'baba0001-3333-4444-9999-ce1e5t1a1001',
  },
  {
    id: 'hearth-heritage',
    name: 'Hearth & Heritage',
    slug: 'hearth-heritage',
    description: 'Warm Griha Pravesh theme with terracotta warmth, glowing brass diya, auspicious mango leaf toran, and house tour feast',
    category: 'housewarming',
    previewImageUrl: '/templates/hearth-heritage-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'HearthHeritageTemplate',
    themeId: 'h005e001-4444-5555-9999-hearthher101',
  },
  {
    id: 'midnight-soiree',
    name: 'Velvet Midnight Soirée',
    slug: 'midnight-soiree',
    description: 'Ultra-modern rooftop cocktail soirée with ultraviolet neon glow, holographic VIP pass ticket reveal, and DJ line-up',
    category: 'party',
    previewImageUrl: '/templates/midnight-soiree-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'MidnightSoireeTemplate',
    themeId: 'part0001-5555-6666-9999-m1dn1ghts001',
  },
  {
    id: 'divya-mandap',
    name: 'Divya Mandap',
    slug: 'divya-mandap',
    description: 'Auspicious Vedic puja and satsang theme with sacred saffron vermillion, glowing ghee diyas, and Mahaprasad details',
    category: 'religious',
    previewImageUrl: '/templates/divya-mandap-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'DivyaMandapTemplate',
    themeId: 're110001-6666-7777-9999-d1vyamand101',
  },
  {
    id: 'heritage-reunion',
    name: 'Heritage Family Reunion',
    slug: 'heritage-reunion',
    description: 'Timeless ancestral celebration with royal emerald velvet, warm antique brass banyan crest, generational family tree, and banquet feast',
    category: 'family_celebration',
    previewImageUrl: '/templates/heritage-reunion-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'HeritageReunionTemplate',
    themeId: 'f4m10001-7777-8888-9999-fam1lyreun01',
  },
  {
    id: 'retro-synth-arcade',
    name: 'Retro Synthwave Arcade',
    slug: 'retro-synth-arcade',
    description: '80s Cyber Neon & Synthwave Arcade Party with pixel beats and retro cocktails',
    category: 'birthday',
    previewImageUrl: '/templates/retro-synth-arcade-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'RetroSynthArcadeTemplate',
    themeId: 'b1700002-1111-2222-3333-retrosynth01',
  },
  {
    id: 'enchanted-storybook-birthday',
    name: 'Enchanted Storybook Garden',
    slug: 'enchanted-storybook-birthday',
    description: 'Whimsical fairy tale garden celebration with stardust lights, butterflies, and high tea',
    category: 'birthday',
    previewImageUrl: '/templates/enchanted-storybook-birthday-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'EnchantedStorybookBirthdayTemplate',
    themeId: 'b1700003-1111-2222-3333-enchantbook1',
  },
  {
    id: 'safari-wild-one',
    name: 'Safari Little Explorer',
    slug: 'safari-wild-one',
    description: 'Wild safari explorer 1st birthday adventure with khaki textures, sunburst tones, and jungle games',
    category: 'birthday',
    previewImageUrl: '/templates/safari-wild-one-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'SafariWildOneTemplate',
    themeId: 'b1700004-1111-2222-3333-safariwild01',
  },
  {
    id: 'vintage-distillery-milestone',
    name: 'Aged to Perfection',
    slug: 'vintage-distillery-milestone',
    description: 'Distillery oak, amber bourbon, and leather gentleman milestone celebration',
    category: 'birthday',
    previewImageUrl: '/templates/vintage-distillery-milestone-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'VintageDistilleryMilestoneTemplate',
    themeId: 'b1700005-1111-2222-3333-distillery001',
  },
  {
    id: 'golden-jubilee-50th',
    name: '50th Golden Jubilee',
    slug: 'golden-jubilee-50th',
    description: 'Half a century of devotion with 24K polished gold, royal emerald, and grand gala banquet',
    category: 'anniversary',
    previewImageUrl: '/templates/golden-jubilee-50th-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'GoldenJubilee50thTemplate',
    themeId: 'a1140002-2525-4444-9999-goldenjub501',
  },
  {
    id: 'ruby-romance-40th',
    name: 'Ruby Romance 40th',
    slug: 'ruby-romance-40th',
    description: '40 years of passion and devotion with deep crimson velvet, faceted ruby seal, and romance strings',
    category: 'anniversary',
    previewImageUrl: '/templates/ruby-romance-40th-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'RubyRomance40thTemplate',
    themeId: 'a1140003-2525-4444-9999-rubyromanc40',
  },
  {
    id: 'boho-sunset-vows',
    name: 'Bohemian Sunset Vows',
    slug: 'boho-sunset-vows',
    description: 'Pampas grass, warm desert terracotta, and acoustic twilight sunset vow renewal',
    category: 'anniversary',
    previewImageUrl: '/templates/boho-sunset-vows-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'BohoSunsetVowsTemplate',
    themeId: 'a1140004-2525-4444-9999-bohosunset01',
  },
  {
    id: 'monochrome-film-noir-anniversary',
    name: 'Cinematic Noir Anniversary',
    slug: 'monochrome-film-noir-anniversary',
    description: 'Vintage Hollywood romance and classic black & white cinema anniversary celebration',
    category: 'anniversary',
    previewImageUrl: '/templates/monochrome-film-noir-anniversary-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'MonochromeFilmNoirAnniversaryTemplate',
    themeId: 'a1140005-2525-4444-9999-cinenoir0001',
  },
  {
    id: 'woodland-fable-shower',
    name: 'Woodland Fable Shower',
    slug: 'woodland-fable-shower',
    description: 'Whimsical forest baby shower with moss green, baby deer wax seal, and woodland chimes',
    category: 'baby_shower',
    previewImageUrl: '/templates/woodland-fable-shower-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'WoodlandFableShowerTemplate',
    themeId: 'baba0002-3333-4444-9999-woodlandfa01',
  },
  {
    id: 'royal-little-prince-princess',
    name: 'Royal Nursery Crown',
    slug: 'royal-little-prince-princess',
    description: 'Regal crown baby shower with powder navy, tiara gold, and royal nursery lullaby',
    category: 'baby_shower',
    previewImageUrl: '/templates/royal-little-prince-princess-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'RoyalLittlePrincePrincessTemplate',
    themeId: 'baba0003-3333-4444-9999-royalprince01',
  },
  {
    id: 'sunshine-meadow-shower',
    name: 'Here Comes The Sun',
    slug: 'sunshine-meadow-shower',
    description: 'Sunshine, daisy wildflower bloom, and bright morning joy baby celebration',
    category: 'baby_shower',
    previewImageUrl: '/templates/sunshine-meadow-shower-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'SunshineMeadowShowerTemplate',
    themeId: 'baba0004-3333-4444-9999-sunshinemead',
  },
  {
    id: 'boho-rainbow-miracle',
    name: 'Boho Rainbow Miracle',
    slug: 'boho-rainbow-miracle',
    description: 'Earth-toned boho rainbow miracle baby shower with clay warmth and pastel blessings',
    category: 'baby_shower',
    previewImageUrl: '/templates/boho-rainbow-miracle-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'BohoRainbowMiracleTemplate',
    themeId: 'baba0005-3333-4444-9999-bohorainbow1',
  },
  {
    id: 'scandi-minimal-haven',
    name: 'Scandi Minimalist Sanctuary',
    slug: 'scandi-minimal-haven',
    description: 'Nordic warm minimalism, olive linen, and brass house key sanctuary housewarming',
    category: 'housewarming',
    previewImageUrl: '/templates/scandi-minimal-haven-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'ScandiMinimalHavenTemplate',
    themeId: 'h005e002-4444-5555-9999-scandimin001',
  },
  {
    id: 'rajasthani-jharokha-griha',
    name: 'Rajasthani Jharokha Griha',
    slug: 'rajasthani-jharokha-griha',
    description: 'Royal Jaipur Haveli Griha Pravesh with carved jharokha arches, kalash seal, and sacred shehnai',
    category: 'housewarming',
    previewImageUrl: '/templates/rajasthani-jharokha-griha-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'RajasthaniJharokhaGrihaTemplate',
    themeId: 'h005e003-4444-5555-9999-jharokhagr01',
  },
  {
    id: 'urban-terrace-soiree',
    name: 'Urban Terrace Loft',
    slug: 'urban-terrace-soiree',
    description: 'City view loft and rooftop patio housewarming with copper lights and skyline sundowners',
    category: 'housewarming',
    previewImageUrl: '/templates/urban-terrace-soiree-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'UrbanTerraceSoireeTemplate',
    themeId: 'h005e004-4444-5555-9999-urbanloft001',
  },
  {
    id: 'coastal-breeze-home',
    name: 'Coastal Sea Breeze Haven',
    slug: 'coastal-breeze-home',
    description: 'Sea glass, anchor token, and sunlit coastal deck villa housewarming',
    category: 'housewarming',
    previewImageUrl: '/templates/coastal-breeze-home-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'CoastalBreezeHomeTemplate',
    themeId: 'h005e005-4444-5555-9999-coastalbreez',
  },
  {
    id: 'tropical-sunset-luau',
    name: 'Tropical Sunset Luau',
    slug: 'tropical-sunset-luau',
    description: 'Tiki sunset, neon flamingo, fire dancers, and tropical beach party',
    category: 'party',
    previewImageUrl: '/templates/tropical-sunset-luau-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'TropicalSunsetLuauTemplate',
    themeId: 'part0002-5555-6666-9999-tropicalluau',
  },
  {
    id: 'studio54-disco-glam',
    name: 'Studio 54 Disco Glam',
    slug: 'studio54-disco-glam',
    description: 'Spinning mirror ball, purple strobe, sequins, and non-stop disco groove',
    category: 'party',
    previewImageUrl: '/templates/studio54-disco-glam-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'Studio54DiscoGlamTemplate',
    themeId: 'part0003-5555-6666-9999-studio54disc',
  },
  {
    id: 'speakeasy-roaring-twenties',
    name: 'Roaring 20s Speakeasy',
    slug: 'speakeasy-roaring-twenties',
    description: 'Secret 1920s prohibition lounge, vintage jazz, and password entrance pass',
    category: 'party',
    previewImageUrl: '/templates/speakeasy-roaring-twenties-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'SpeakeasyRoaringTwentiesTemplate',
    themeId: 'part0004-5555-6666-9999-speakeasy001',
  },
  {
    id: 'poolside-sun-drenched-bash',
    name: 'Palm Springs Poolside Bash',
    slug: 'poolside-sun-drenched-bash',
    description: 'Turquoise waters, cabana loungers, and deep house poolside party',
    category: 'party',
    previewImageUrl: '/templates/poolside-sun-drenched-bash-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'PoolsideSunDrenchedBashTemplate',
    themeId: 'part0005-5555-6666-9999-poolsidebash',
  },
  {
    id: 'shree-ganesh-vandana',
    name: 'Shree Ganesh Sthapana',
    slug: 'shree-ganesh-vandana',
    description: 'Modak, marigold yellow, and sacred Shankh Ganesh Sthapana with Vedic Om mantra',
    category: 'religious',
    previewImageUrl: '/templates/shree-ganesh-vandana-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'ShreeGaneshVandanaTemplate',
    themeId: 're110002-6666-7777-9999-ganeshvand01',
  },
  {
    id: 'waheguru-anand-blessings',
    name: 'Akhand Path & Kirtan Darbar',
    slug: 'waheguru-anand-blessings',
    description: 'Sri Akhand Path Sahib, classical raga kirtan darbar, and Guru Ka Langar',
    category: 'religious',
    previewImageUrl: '/templates/waheguru-anand-blessings-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'WaheguruAnandBlessingsTemplate',
    themeId: 're110003-6666-7777-9999-wahegurbles1',
  },
  {
    id: 'cathedral-grace-communion',
    name: 'Sacred Holy Communion',
    slug: 'cathedral-grace-communion',
    description: 'Stained glass royal sapphire, holy dove seal, and cathedral communion mass',
    category: 'religious',
    previewImageUrl: '/templates/cathedral-grace-communion-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'CathedralGraceCommunionTemplate',
    themeId: 're110004-6666-7777-9999-communion001',
  },
  {
    id: 'noor-e-mehfil-nikah-eid',
    name: 'Noor-e-Mehfil Islamic Gala',
    slug: 'noor-e-mehfil-nikah-eid',
    description: 'Crescent moon, Islamic geometric arabesque, Naat recitation, and Dastarkhwan banquet',
    category: 'religious',
    previewImageUrl: '/templates/noor-e-mehfil-nikah-eid-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'NoorEMehfilNikahEidTemplate',
    themeId: 're110005-6666-7777-9999-nooremehfil1',
  },
  {
    id: 'vintage-roots-family-archive',
    name: 'Vintage Roots Family Archive',
    slug: 'vintage-roots-family-archive',
    description: 'Antique leatherbound family album, sepia memories, and centennial clan reunion',
    category: 'family_celebration',
    previewImageUrl: '/templates/vintage-roots-family-archive-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'VintageRootsFamilyArchiveTemplate',
    themeId: 'f4m10002-7777-8888-9999-vintageroots',
  },
  {
    id: 'sunlit-picnic-carnival',
    name: 'Sunlit Lawn Carnival',
    slug: 'sunlit-picnic-carnival',
    description: 'Gingham lawn games, barbecue smoke, tug-of-war, and family carnival day',
    category: 'family_celebration',
    previewImageUrl: '/templates/sunlit-picnic-carnival-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'SunlitPicnicCarnivalTemplate',
    themeId: 'f4m10003-7777-8888-9999-sunlitpicnic',
  },
  {
    id: 'festive-diwali-family-milan',
    name: 'Diwali Sneh Milan',
    slug: 'festive-diwali-family-milan',
    description: 'A thousand golden diyas, sweets exchange, sparklers, and festive kinship banquet',
    category: 'family_celebration',
    previewImageUrl: '/templates/festive-diwali-family-milan-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'FestiveDiwaliFamilyMilanTemplate',
    themeId: 'f4m10004-7777-8888-9999-diwalimilan1',
  },
  {
    id: 'generations-anchored-reunion',
    name: 'Nautical Generations Anchorage',
    slug: 'generations-anchored-reunion',
    description: 'Lakeside cottages, brass anchor crest, sunset boat rides, and generational bonfire',
    category: 'family_celebration',
    previewImageUrl: '/templates/generations-anchored-reunion-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'GenerationsAnchoredReunionTemplate',
    themeId: 'f4m10005-7777-8888-9999-anchordreun1',
  },
  {
    id: 'commencement-excellence',
    name: 'Commencement Academic Honors',
    slug: 'commencement-excellence',
    description: 'Academic mortarboard, navy and gold foil, and graduation conferral gala',
    category: 'other',
    previewImageUrl: '/templates/commencement-excellence-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'CommencementExcellenceTemplate',
    themeId: 'g41a0002-8888-9999-aaaa-gradcommence',
  },
  {
    id: 'philanthropy-crystal-ball',
    name: 'Crystal Philanthropy Ball',
    slug: 'philanthropy-crystal-ball',
    description: 'Emerald velvet, crystal chandelier gala, and benefactor charity auction',
    category: 'other',
    previewImageUrl: '/templates/philanthropy-crystal-ball-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'PhilanthropyCrystalBallTemplate',
    themeId: 'g41a0003-8888-9999-aaaa-crystalball1',
  },
  {
    id: 'tech-summit-future-vision',
    name: 'Executive Tech Vision Summit',
    slug: 'tech-summit-future-vision',
    description: 'Horizon 2030 closed-door executive summit on AI, robotics, and future technology',
    category: 'other',
    previewImageUrl: '/templates/tech-summit-future-vision-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'TechSummitFutureVisionTemplate',
    themeId: 'g41a0004-8888-9999-aaaa-techsummit01',
  },
  {
    id: 'bon-voyage-wanderlust',
    name: 'Bon Voyage & Wanderlust',
    slug: 'bon-voyage-wanderlust',
    description: 'Vintage atlas, compass medallion, and world sabbatical bon voyage toast',
    category: 'other',
    previewImageUrl: '/templates/bon-voyage-wanderlust-preview.jpg',
    priceTier: 'premium',
    priceAmount: 49900,
    isFeatured: true,
    templateComponent: 'BonVoyageWanderlustTemplate',
    themeId: 'g41a0005-8888-9999-aaaa-bonvoyage001',
  },
  {
    id: 'aura-grand-gala',
    name: 'Aura Grand Gala',
    slug: 'aura-grand-gala',
    description: 'Opulent black-tie gala and honors night with sapphire starlight, champagne gold, VIP badge access, and red carpet reception',
    category: 'other',
    previewImageUrl: '/templates/aura-grand-gala-preview.jpg',
    priceTier: 'premium',
    priceAmount: 59900,
    isFeatured: true,
    templateComponent: 'AuraGrandGalaTemplate',
    themeId: 'g41a0001-8888-9999-aaaa-auragala0001',
  },
];

export default function TemplateGallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbTemplates, setDbTemplates] = useState<Template[]>([]);
  const [pendingTitle] = useState(sessionStorage.getItem('invitationTitle') || '');

  useEffect(() => {
    // Dynamically fetch all active themes from the backend database
    api.get('/api/public/themes')
      .then((res) => {
        if (res.data?.themes && Array.isArray(res.data.themes)) {
          // Register dynamic database themes into the template catalog registry
          res.data.themes.forEach((t: any) => registerThemeInCatalog(t));

          const mapped: Template[] = res.data.themes.map((t: any) => ({
            id: t.slug,
            name: t.name,
            slug: t.slug,
            description: t.description || '',
            category: t.category,
            previewImageUrl: t.previewImageUrl || '/templates/default-preview.jpg',
            priceTier: t.priceTier || 'premium',
            priceAmount: t.priceAmount || 49900,
            isFeatured: Boolean(t.isFeatured),
            templateComponent: t.templateComponent || 'ImperialBurgundyTemplate',
            themeId: t.id,
            defaultColors: t.defaultColors,
            defaultFonts: t.defaultFonts,
          }));
          setDbTemplates(mapped);
        }
      })
      .catch((err) => {
        console.warn('Using local fallback templates:', err.message);
      });
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Combine static catalog with any newly imported dynamic database templates
  const allTemplates = (() => {
    const map = new Map<string, Template>();
    AVAILABLE_TEMPLATES.forEach((t) => map.set(t.slug, t));
    dbTemplates.forEach((t) => {
      const existing = map.get(t.slug);
      map.set(t.slug, existing ? { ...existing, ...t } : t);
    });
    return Array.from(map.values());
  })();

  const handleUseTemplate = (template: Template) => {
    sessionStorage.setItem('selectedTemplate', template.slug);
    sessionStorage.setItem('selectedOccasion', template.category);
    if (template.themeId) {
      sessionStorage.setItem('selectedThemeId', template.themeId);
    }
    if (isAuthenticated) {
      navigate('/invitations/new');
    } else {
      navigate('/signup');
    }
  };

  const filteredTemplates =
    selectedCategory === 'all'
      ? allTemplates
      : allTemplates.filter((t) => t.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const getTemplateCount = (category: string) => {
    if (category === 'all') return allTemplates.length;
    return allTemplates.filter((t) => t.category === category).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
                InviteHub
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/#occasions" className="text-gray-700 hover:text-rose-600 transition font-medium">
                Occasions
              </Link>
              <Link to="/templates" className="text-rose-600 font-medium">
                Templates
              </Link>
              <Link to="/#how-it-works" className="text-gray-700 hover:text-rose-600 transition font-medium">
                How It Works
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-rose-600 transition font-medium">
                    Dashboard
                  </Link>
                  <Link
                    to="/invitations/new"
                    className="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full font-medium hover:from-rose-600 hover:to-rose-700 transition"
                  >
                    Create Invitation
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-rose-600 transition font-medium">
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full font-medium hover:from-rose-600 hover:to-rose-700 transition"
                  >
                    Create Invitation
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-gray-100">
              <Link to="/#occasions" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                Occasions
              </Link>
              <Link to="/templates" className="block px-4 py-2 text-rose-600 bg-rose-50 rounded-lg font-medium">
                Templates
              </Link>
              <Link to="/#how-it-works" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                How It Works
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Dashboard
                  </Link>
                  <Link
                    to="/invitations/new"
                    className="block px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg text-center font-medium"
                  >
                    Create Invitation
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg text-center font-medium"
                  >
                    Create Invitation
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Creation Step 2 Context Banner */}
      {selectedCategory !== 'all' && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 text-amber-900 font-medium">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                2
              </span>
              <span>
                Step 2 of 3: Choose a design for your{' '}
                <strong className="capitalize text-amber-950">{selectedCategory.replace('_', ' ')}</strong> invitation
                {pendingTitle && (
                  <span className="text-amber-800"> (Title: "{pendingTitle}")</span>
                )}
              </span>
            </div>
            <Link
              to="/invitations/new"
              onClick={() => {
                sessionStorage.removeItem('selectedTemplate');
              }}
              className="text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-2 flex items-center gap-1"
            >
              <span>← Change Category</span>
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-b from-rose-50 to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Browse Invitation Templates
          </h1>
          <p className="text-xl text-gray-600">
            Choose from our collection of professionally designed invitation templates
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-3 scroll-smooth no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {OCCASION_FILTERS.map((filter) => {
              const count = getTemplateCount(filter.id);
              return (
                <button
                  key={filter.id}
                  onClick={() => handleCategoryChange(filter.id)}
                  className={`flex items-center space-x-2 px-4 md:px-5 py-2 rounded-full whitespace-nowrap transition flex-shrink-0 ${
                    selectedCategory === filter.id
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-base">{filter.icon}</span>
                  <span className="font-medium text-sm">{filter.name}</span>
                  <span
                    className={`text-xs ${
                      selectedCategory === filter.id ? 'text-rose-200' : 'text-gray-500'
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {filteredTemplates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                {/* Real Template Thumbnail */}
                <div className="relative h-64 overflow-hidden bg-white">
                  <TemplateThumbnail
                    slug={template.slug}
                    name={template.name}
                    templateComponent={template.templateComponent}
                    defaultColors={template.defaultColors}
                    defaultFonts={template.defaultFonts}
                    category={template.category}
                    description={template.description}
                    previewImageUrl={template.previewImageUrl}
                  />
                  {template.isFeatured && (
                    <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                      Featured
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 capitalize">{template.category}</span>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/templates/${template.slug}`}
                      className="flex-1 py-3 px-4 bg-gray-100 text-gray-900 text-center rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                      Preview
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-center rounded-lg font-medium hover:from-rose-600 hover:to-rose-700 transition shadow-sm"
                    >
                      Use This
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">More Designs Coming Soon</h3>
            <p className="text-gray-600 mb-8">
              We're working on beautiful templates for this occasion. Check back soon!
            </p>
            <button
              onClick={() => handleCategoryChange('all')}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full font-medium hover:from-rose-600 hover:to-rose-700 transition"
            >
              View All Templates
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
