import * as Catalog from './catalog';
import React from 'react';
import IvoryKayal from './ivory-kayal/Template';
import MarigoldCourtyard from './marigold-courtyard/Template';
import MidnightVows from './midnight-vows/Template';
import ArtDecoNoir from './art-deco-noir/Template';
import BotanicalRomance from './botanical-romance/Template';
import ImperialBurgundy from './imperial-burgundy/Template';
import PhulkariCelebration from './phulkari-celebration/Template';
import CoastalPearl from './coastal-pearl/Template';
import GoldenMilestone from './golden-milestone/Template';
import SilverJubilee from './silver-jubilee/Template';
import CelestialLullaby from './celestial-lullaby/Template';
import HearthHeritage from './hearth-heritage/Template';
import MidnightSoiree from './midnight-soiree/Template';
import DivyaMandap from './divya-mandap/Template';
import HeritageReunion from './heritage-reunion/Template';
import AuraGrandGala from './aura-grand-gala/Template';

export interface TemplateDefinition {
  id: string; // Internal template ID, e.g. 'art-deco-noir-01', 'imperial-burgundy-01'
  slug: string; // Theme slug, e.g. 'art-deco-noir', 'imperial-burgundy'
  componentName: string; // Database templateComponent
  themeId: string; // Database theme UUID
  name: string; // Human readable name
  category: string; // Occasion category, e.g. 'wedding'
  description: string;
  component: React.ComponentType<{ data: any }>;
}

export const TEMPLATE_DEFINITIONS: Record<string, TemplateDefinition> = {
  'art-deco-noir': {
    id: 'art-deco-noir-01',
    slug: 'art-deco-noir',
    componentName: 'ArtDecoNoirTemplate',
    themeId: '6eafa011-98a1-4e43-b71b-c6880ff80fd1',
    name: 'Art Deco Noir',
    category: 'wedding',
    description: '1920s Great Gatsby luxury with obsidian black, warm champagne gold, geometric ziggurats, and entrance gate',
    component: ArtDecoNoir,
  },
  'imperial-burgundy': {
    id: 'imperial-burgundy-01',
    slug: 'imperial-burgundy',
    componentName: 'ImperialBurgundyTemplate',
    themeId: 'b9be246b-3340-4fcb-b96f-2281f614e3de',
    name: 'Imperial Burgundy',
    category: 'wedding',
    description: 'Royal palace grandeur with velvet burgundy, antique gold filigree, and double palace doors',
    component: ImperialBurgundy,
  },
  'botanical-romance': {
    id: 'botanical-romance-01',
    slug: 'botanical-romance',
    componentName: 'BotanicalRomanceTemplate',
    themeId: 'f4f4d356-3b5f-469f-8bfe-75ca6b64866d',
    name: 'Botanical Romance',
    category: 'wedding',
    description: 'Contemporary romantic garden theme with soft sage green, blush rose, delicate botanicals, and ambient sound',
    component: BotanicalRomance,
  },
  'phulkari-celebration': {
    id: 'phulkari-celebration-01',
    slug: 'phulkari-celebration',
    componentName: 'PhulkariCelebrationTemplate',
    themeId: '7f001ca2-5e1e-4b67-8899-phu1kar10001',
    name: 'Phulkari Celebration',
    category: 'wedding',
    description: 'Vibrant Punjabi wedding theme with authentic Phulkari cross-stitch embroidery and festive itinerary',
    component: PhulkariCelebration,
  },
  'coastal-pearl': {
    id: 'coastal-pearl-01',
    slug: 'coastal-pearl',
    componentName: 'CoastalPearlTemplate',
    themeId: 'c0a57a11-9ea2-4ea7-9001-c0a57a100001',
    name: 'Coastal Pearl',
    category: 'wedding',
    description: 'Serene coastal destination theme with oceanic wave reveal, delicate shell fans, and pearl strands',
    component: CoastalPearl,
  },
  'ivory-kayal': {
    id: 'ivory-kayal-01',
    slug: 'ivory-kayal',
    componentName: 'IvoryKayalTemplate',
    themeId: '093b32a3-1925-4b85-9f6a-d729db2be9be',
    name: 'Ivory Kayal',
    category: 'wedding',
    description: 'South Indian heritage theme with warm ivory, muted sage green, and antique gold',
    component: IvoryKayal,
  },
  'marigold-courtyard': {
    id: 'marigold-courtyard-01',
    slug: 'marigold-courtyard',
    componentName: 'MarigoldCourtyardTemplate',
    themeId: '58b36b41-1ea3-4279-862e-5674a63a9d6a',
    name: 'Marigold Courtyard',
    category: 'wedding',
    description: 'Festive Indian wedding theme with vibrant marigold orange, terracotta, and multi-event itinerary',
    component: MarigoldCourtyard,
  },
  'midnight-vows': {
    id: 'midnight-vows-01',
    slug: 'midnight-vows',
    componentName: 'MidnightVowsTemplate',
    themeId: '1056bc70-959d-42e4-9a2f-058418ceba6e',
    name: 'Midnight Vows',
    category: 'wedding',
    description: 'Cinematic luxury theme with midnight navy, dark plum, and starlight champagne gold',
    component: MidnightVows,
  },

  // Multi-Occasion Premium Templates
  'golden-milestone': {
    id: 'golden-milestone-01',
    slug: 'golden-milestone',
    componentName: 'GoldenMilestoneTemplate',
    themeId: 'ba5fb147-fc1d-401d-a6a4-6728d0891651',
    name: 'Golden Milestone Soirée',
    category: 'birthday',
    description: 'Glamorous milestone birthday celebration with obsidian velvet, champagne gold foil, toast countdown, and party line-up',
    component: GoldenMilestone,
  },
  'birthday-joy': {
    id: 'birthday-joy-01',
    slug: 'birthday-joy',
    componentName: 'GoldenMilestoneTemplate',
    themeId: 'ba5fb147-fc1d-401d-a6a4-6728d0891651',
    name: 'Golden Milestone Soirée',
    category: 'birthday',
    description: 'Glamorous milestone birthday celebration with obsidian velvet, champagne gold foil, toast countdown, and party line-up',
    component: GoldenMilestone,
  },
  'silver-jubilee': {
    id: 'silver-jubilee-01',
    slug: 'silver-jubilee',
    componentName: 'SilverJubileeTemplate',
    themeId: 'a1140001-2525-4444-9999-511verjub101',
    name: 'Silver Jubilee Elegance',
    category: 'anniversary',
    description: 'Timeless milestone anniversary theme with polished sterling silver, love journey timeline, and vow renewal banquet',
    component: SilverJubilee,
  },
  'celestial-lullaby': {
    id: 'celestial-lullaby-01',
    slug: 'celestial-lullaby',
    componentName: 'CelestialLullabyTemplate',
    themeId: 'baba0001-3333-4444-9999-ce1e5t1a1001',
    name: 'Celestial Lullaby',
    category: 'baby_shower',
    description: 'Whimsical baby shower theme with pastel cloud mist, crescent moon starlight, storybook envelope, and high tea program',
    component: CelestialLullaby,
  },
  'hearth-heritage': {
    id: 'hearth-heritage-01',
    slug: 'hearth-heritage',
    componentName: 'HearthHeritageTemplate',
    themeId: 'h005e001-4444-5555-9999-hearthher101',
    name: 'Hearth & Heritage',
    category: 'housewarming',
    description: 'Warm Griha Pravesh theme with terracotta warmth, glowing brass diya, auspicious mango leaf toran, and house tour feast',
    component: HearthHeritage,
  },
  'midnight-soiree': {
    id: 'midnight-soiree-01',
    slug: 'midnight-soiree',
    componentName: 'MidnightSoireeTemplate',
    themeId: 'part0001-5555-6666-9999-m1dn1ghts001',
    name: 'Velvet Midnight Soirée',
    category: 'party',
    description: 'Ultra-modern rooftop cocktail soirée with ultraviolet neon glow, holographic VIP pass ticket reveal, and DJ line-up',
    component: MidnightSoiree,
  },
  'divya-mandap': {
    id: 'divya-mandap-01',
    slug: 'divya-mandap',
    componentName: 'DivyaMandapTemplate',
    themeId: 're110001-6666-7777-9999-d1vyamand101',
    name: 'Divya Mandap',
    category: 'religious',
    description: 'Auspicious Vedic puja and satsang theme with sacred saffron vermillion, glowing ghee diyas, and Mahaprasad details',
    component: DivyaMandap,
  },
  'heritage-reunion': {
    id: 'heritage-reunion-01',
    slug: 'heritage-reunion',
    componentName: 'HeritageReunionTemplate',
    themeId: 'f4m10001-7777-8888-9999-fam1lyreun01',
    name: 'Heritage Family Reunion',
    category: 'family_celebration',
    description: 'Timeless ancestral celebration with royal emerald velvet, warm antique brass banyan crest, generational family tree, and banquet feast',
    component: HeritageReunion,
  },
  'aura-grand-gala': {
    id: 'aura-grand-gala-01',
    slug: 'aura-grand-gala',
    componentName: 'AuraGrandGalaTemplate',
    themeId: 'g41a0001-8888-9999-aaaa-auragala0001',
    name: 'Aura Grand Gala',
    category: 'other',
    description: 'Opulent black-tie gala and honors night with sapphire starlight, champagne gold, VIP badge access, and red carpet reception',
    component: AuraGrandGala,
  },

  'retro-synth-arcade': {
    id: 'retro-synth-arcade-01',
    slug: 'retro-synth-arcade',
    componentName: 'RetroSynthArcadeTemplate',
    themeId: 'b1700002-1111-2222-3333-retrosynth01',
    name: 'Retro Synthwave Arcade',
    category: 'birthday',
    description: '80s Cyber Neon & Synthwave Arcade Party with pixel beats and retro cocktails',
    component: Catalog.RetroSynthArcade,
  },
  'enchanted-storybook-birthday': {
    id: 'enchanted-storybook-birthday-01',
    slug: 'enchanted-storybook-birthday',
    componentName: 'EnchantedStorybookBirthdayTemplate',
    themeId: 'b1700003-1111-2222-3333-enchantbook1',
    name: 'Enchanted Storybook Garden',
    category: 'birthday',
    description: 'Whimsical fairy tale garden celebration with stardust lights, butterflies, and high tea',
    component: Catalog.EnchantedStorybookBirthday,
  },
  'safari-wild-one': {
    id: 'safari-wild-one-01',
    slug: 'safari-wild-one',
    componentName: 'SafariWildOneTemplate',
    themeId: 'b1700004-1111-2222-3333-safariwild01',
    name: 'Safari Little Explorer',
    category: 'birthday',
    description: 'Wild safari explorer 1st birthday adventure with khaki textures, sunburst tones, and jungle games',
    component: Catalog.SafariWildOne,
  },
  'vintage-distillery-milestone': {
    id: 'vintage-distillery-milestone-01',
    slug: 'vintage-distillery-milestone',
    componentName: 'VintageDistilleryMilestoneTemplate',
    themeId: 'b1700005-1111-2222-3333-distillery001',
    name: 'Aged to Perfection',
    category: 'birthday',
    description: 'Distillery oak, amber bourbon, and leather gentleman milestone celebration',
    component: Catalog.VintageDistilleryMilestone,
  },
  'golden-jubilee-50th': {
    id: 'golden-jubilee-50th-01',
    slug: 'golden-jubilee-50th',
    componentName: 'GoldenJubilee50thTemplate',
    themeId: 'a1140002-2525-4444-9999-goldenjub501',
    name: '50th Golden Jubilee',
    category: 'anniversary',
    description: 'Half a century of devotion with 24K polished gold, royal emerald, and grand gala banquet',
    component: Catalog.GoldenJubilee50th,
  },
  'ruby-romance-40th': {
    id: 'ruby-romance-40th-01',
    slug: 'ruby-romance-40th',
    componentName: 'RubyRomance40thTemplate',
    themeId: 'a1140003-2525-4444-9999-rubyromanc40',
    name: 'Ruby Romance 40th',
    category: 'anniversary',
    description: '40 years of passion and devotion with deep crimson velvet, faceted ruby seal, and romance strings',
    component: Catalog.RubyRomance40th,
  },
  'boho-sunset-vows': {
    id: 'boho-sunset-vows-01',
    slug: 'boho-sunset-vows',
    componentName: 'BohoSunsetVowsTemplate',
    themeId: 'a1140004-2525-4444-9999-bohosunset01',
    name: 'Bohemian Sunset Vows',
    category: 'anniversary',
    description: 'Pampas grass, warm desert terracotta, and acoustic twilight sunset vow renewal',
    component: Catalog.BohoSunsetVows,
  },
  'monochrome-film-noir-anniversary': {
    id: 'monochrome-film-noir-anniversary-01',
    slug: 'monochrome-film-noir-anniversary',
    componentName: 'MonochromeFilmNoirAnniversaryTemplate',
    themeId: 'a1140005-2525-4444-9999-cinenoir0001',
    name: 'Cinematic Noir Anniversary',
    category: 'anniversary',
    description: 'Vintage Hollywood romance and classic black & white cinema anniversary celebration',
    component: Catalog.MonochromeFilmNoirAnniversary,
  },
  'woodland-fable-shower': {
    id: 'woodland-fable-shower-01',
    slug: 'woodland-fable-shower',
    componentName: 'WoodlandFableShowerTemplate',
    themeId: 'baba0002-3333-4444-9999-woodlandfa01',
    name: 'Woodland Fable Shower',
    category: 'baby_shower',
    description: 'Whimsical forest baby shower with moss green, baby deer wax seal, and woodland chimes',
    component: Catalog.WoodlandFableShower,
  },
  'royal-little-prince-princess': {
    id: 'royal-little-prince-princess-01',
    slug: 'royal-little-prince-princess',
    componentName: 'RoyalLittlePrincePrincessTemplate',
    themeId: 'baba0003-3333-4444-9999-royalprince01',
    name: 'Royal Nursery Crown',
    category: 'baby_shower',
    description: 'Regal crown baby shower with powder navy, tiara gold, and royal nursery lullaby',
    component: Catalog.RoyalLittlePrincePrincess,
  },
  'sunshine-meadow-shower': {
    id: 'sunshine-meadow-shower-01',
    slug: 'sunshine-meadow-shower',
    componentName: 'SunshineMeadowShowerTemplate',
    themeId: 'baba0004-3333-4444-9999-sunshinemead',
    name: 'Here Comes The Sun',
    category: 'baby_shower',
    description: 'Sunshine, daisy wildflower bloom, and bright morning joy baby celebration',
    component: Catalog.SunshineMeadowShower,
  },
  'boho-rainbow-miracle': {
    id: 'boho-rainbow-miracle-01',
    slug: 'boho-rainbow-miracle',
    componentName: 'BohoRainbowMiracleTemplate',
    themeId: 'baba0005-3333-4444-9999-bohorainbow1',
    name: 'Boho Rainbow Miracle',
    category: 'baby_shower',
    description: 'Earth-toned boho rainbow miracle baby shower with clay warmth and pastel blessings',
    component: Catalog.BohoRainbowMiracle,
  },
  'scandi-minimal-haven': {
    id: 'scandi-minimal-haven-01',
    slug: 'scandi-minimal-haven',
    componentName: 'ScandiMinimalHavenTemplate',
    themeId: 'h005e002-4444-5555-9999-scandimin001',
    name: 'Scandi Minimalist Sanctuary',
    category: 'housewarming',
    description: 'Nordic warm minimalism, olive linen, and brass house key sanctuary housewarming',
    component: Catalog.ScandiMinimalHaven,
  },
  'rajasthani-jharokha-griha': {
    id: 'rajasthani-jharokha-griha-01',
    slug: 'rajasthani-jharokha-griha',
    componentName: 'RajasthaniJharokhaGrihaTemplate',
    themeId: 'h005e003-4444-5555-9999-jharokhagr01',
    name: 'Rajasthani Jharokha Griha',
    category: 'housewarming',
    description: 'Royal Jaipur Haveli Griha Pravesh with carved jharokha arches, kalash seal, and sacred shehnai',
    component: Catalog.RajasthaniJharokhaGriha,
  },
  'urban-terrace-soiree': {
    id: 'urban-terrace-soiree-01',
    slug: 'urban-terrace-soiree',
    componentName: 'UrbanTerraceSoireeTemplate',
    themeId: 'h005e004-4444-5555-9999-urbanloft001',
    name: 'Urban Terrace Loft',
    category: 'housewarming',
    description: 'City view loft and rooftop patio housewarming with copper lights and skyline sundowners',
    component: Catalog.UrbanTerraceSoiree,
  },
  'coastal-breeze-home': {
    id: 'coastal-breeze-home-01',
    slug: 'coastal-breeze-home',
    componentName: 'CoastalBreezeHomeTemplate',
    themeId: 'h005e005-4444-5555-9999-coastalbreez',
    name: 'Coastal Sea Breeze Haven',
    category: 'housewarming',
    description: 'Sea glass, anchor token, and sunlit coastal deck villa housewarming',
    component: Catalog.CoastalBreezeHome,
  },
  'tropical-sunset-luau': {
    id: 'tropical-sunset-luau-01',
    slug: 'tropical-sunset-luau',
    componentName: 'TropicalSunsetLuauTemplate',
    themeId: 'part0002-5555-6666-9999-tropicalluau',
    name: 'Tropical Sunset Luau',
    category: 'party',
    description: 'Tiki sunset, neon flamingo, fire dancers, and tropical beach party',
    component: Catalog.TropicalSunsetLuau,
  },
  'studio54-disco-glam': {
    id: 'studio54-disco-glam-01',
    slug: 'studio54-disco-glam',
    componentName: 'Studio54DiscoGlamTemplate',
    themeId: 'part0003-5555-6666-9999-studio54disc',
    name: 'Studio 54 Disco Glam',
    category: 'party',
    description: 'Spinning mirror ball, purple strobe, sequins, and non-stop disco groove',
    component: Catalog.Studio54DiscoGlam,
  },
  'speakeasy-roaring-twenties': {
    id: 'speakeasy-roaring-twenties-01',
    slug: 'speakeasy-roaring-twenties',
    componentName: 'SpeakeasyRoaringTwentiesTemplate',
    themeId: 'part0004-5555-6666-9999-speakeasy001',
    name: 'Roaring 20s Speakeasy',
    category: 'party',
    description: 'Secret 1920s prohibition lounge, vintage jazz, and password entrance pass',
    component: Catalog.SpeakeasyRoaringTwenties,
  },
  'poolside-sun-drenched-bash': {
    id: 'poolside-sun-drenched-bash-01',
    slug: 'poolside-sun-drenched-bash',
    componentName: 'PoolsideSunDrenchedBashTemplate',
    themeId: 'part0005-5555-6666-9999-poolsidebash',
    name: 'Palm Springs Poolside Bash',
    category: 'party',
    description: 'Turquoise waters, cabana loungers, and deep house poolside party',
    component: Catalog.PoolsideSunDrenchedBash,
  },
  'shree-ganesh-vandana': {
    id: 'shree-ganesh-vandana-01',
    slug: 'shree-ganesh-vandana',
    componentName: 'ShreeGaneshVandanaTemplate',
    themeId: 're110002-6666-7777-9999-ganeshvand01',
    name: 'Shree Ganesh Sthapana',
    category: 'religious',
    description: 'Modak, marigold yellow, and sacred Shankh Ganesh Sthapana with Vedic Om mantra',
    component: Catalog.ShreeGaneshVandana,
  },
  'waheguru-anand-blessings': {
    id: 'waheguru-anand-blessings-01',
    slug: 'waheguru-anand-blessings',
    componentName: 'WaheguruAnandBlessingsTemplate',
    themeId: 're110003-6666-7777-9999-wahegurbles1',
    name: 'Akhand Path & Kirtan Darbar',
    category: 'religious',
    description: 'Sri Akhand Path Sahib, classical raga kirtan darbar, and Guru Ka Langar',
    component: Catalog.WaheguruAnandBlessings,
  },
  'cathedral-grace-communion': {
    id: 'cathedral-grace-communion-01',
    slug: 'cathedral-grace-communion',
    componentName: 'CathedralGraceCommunionTemplate',
    themeId: 're110004-6666-7777-9999-communion001',
    name: 'Sacred Holy Communion',
    category: 'religious',
    description: 'Stained glass royal sapphire, holy dove seal, and cathedral communion mass',
    component: Catalog.CathedralGraceCommunion,
  },
  'noor-e-mehfil-nikah-eid': {
    id: 'noor-e-mehfil-nikah-eid-01',
    slug: 'noor-e-mehfil-nikah-eid',
    componentName: 'NoorEMehfilNikahEidTemplate',
    themeId: 're110005-6666-7777-9999-nooremehfil1',
    name: 'Noor-e-Mehfil Islamic Gala',
    category: 'religious',
    description: 'Crescent moon, Islamic geometric arabesque, Naat recitation, and Dastarkhwan banquet',
    component: Catalog.NoorEMehfilNikahEid,
  },
  'vintage-roots-family-archive': {
    id: 'vintage-roots-family-archive-01',
    slug: 'vintage-roots-family-archive',
    componentName: 'VintageRootsFamilyArchiveTemplate',
    themeId: 'f4m10002-7777-8888-9999-vintageroots',
    name: 'Vintage Roots Family Archive',
    category: 'family_celebration',
    description: 'Antique leatherbound family album, sepia memories, and centennial clan reunion',
    component: Catalog.VintageRootsFamilyArchive,
  },
  'sunlit-picnic-carnival': {
    id: 'sunlit-picnic-carnival-01',
    slug: 'sunlit-picnic-carnival',
    componentName: 'SunlitPicnicCarnivalTemplate',
    themeId: 'f4m10003-7777-8888-9999-sunlitpicnic',
    name: 'Sunlit Lawn Carnival',
    category: 'family_celebration',
    description: 'Gingham lawn games, barbecue smoke, tug-of-war, and family carnival day',
    component: Catalog.SunlitPicnicCarnival,
  },
  'festive-diwali-family-milan': {
    id: 'festive-diwali-family-milan-01',
    slug: 'festive-diwali-family-milan',
    componentName: 'FestiveDiwaliFamilyMilanTemplate',
    themeId: 'f4m10004-7777-8888-9999-diwalimilan1',
    name: 'Diwali Sneh Milan',
    category: 'family_celebration',
    description: 'A thousand golden diyas, sweets exchange, sparklers, and festive kinship banquet',
    component: Catalog.FestiveDiwaliFamilyMilan,
  },
  'generations-anchored-reunion': {
    id: 'generations-anchored-reunion-01',
    slug: 'generations-anchored-reunion',
    componentName: 'GenerationsAnchoredReunionTemplate',
    themeId: 'f4m10005-7777-8888-9999-anchordreun1',
    name: 'Nautical Generations Anchorage',
    category: 'family_celebration',
    description: 'Lakeside cottages, brass anchor crest, sunset boat rides, and generational bonfire',
    component: Catalog.GenerationsAnchoredReunion,
  },
  'commencement-excellence': {
    id: 'commencement-excellence-01',
    slug: 'commencement-excellence',
    componentName: 'CommencementExcellenceTemplate',
    themeId: 'g41a0002-8888-9999-aaaa-gradcommence',
    name: 'Commencement Academic Honors',
    category: 'other',
    description: 'Academic mortarboard, navy and gold foil, and graduation conferral gala',
    component: Catalog.CommencementExcellence,
  },
  'philanthropy-crystal-ball': {
    id: 'philanthropy-crystal-ball-01',
    slug: 'philanthropy-crystal-ball',
    componentName: 'PhilanthropyCrystalBallTemplate',
    themeId: 'g41a0003-8888-9999-aaaa-crystalball1',
    name: 'Crystal Philanthropy Ball',
    category: 'other',
    description: 'Emerald velvet, crystal chandelier gala, and benefactor charity auction',
    component: Catalog.PhilanthropyCrystalBall,
  },
  'tech-summit-future-vision': {
    id: 'tech-summit-future-vision-01',
    slug: 'tech-summit-future-vision',
    componentName: 'TechSummitFutureVisionTemplate',
    themeId: 'g41a0004-8888-9999-aaaa-techsummit01',
    name: 'Executive Tech Vision Summit',
    category: 'other',
    description: 'Horizon 2030 closed-door executive summit on AI, robotics, and future technology',
    component: Catalog.TechSummitFutureVision,
  },
  'bon-voyage-wanderlust': {
    id: 'bon-voyage-wanderlust-01',
    slug: 'bon-voyage-wanderlust',
    componentName: 'BonVoyageWanderlustTemplate',
    themeId: 'g41a0005-8888-9999-aaaa-bonvoyage001',
    name: 'Bon Voyage & Wanderlust',
    category: 'other',
    description: 'Vintage atlas, compass medallion, and world sabbatical bon voyage toast',
    component: Catalog.BonVoyageWanderlust,
  },

  // Legacy mappings upgraded to Claude designs
  'royal-maroon': {
    id: 'royal-maroon-01',
    slug: 'royal-maroon',
    componentName: 'ImperialBurgundyTemplate',
    themeId: 'b9be246b-3340-4fcb-b96f-2281f614e3de',
    name: 'Imperial Burgundy (formerly Royal Maroon)',
    category: 'wedding',
    description: 'Royal palace grandeur with velvet burgundy, antique gold filigree, and double palace doors',
    component: ImperialBurgundy,
  },
  'modern-floral': {
    id: 'modern-floral-02',
    slug: 'modern-floral',
    componentName: 'BotanicalRomanceTemplate',
    themeId: 'f4f4d356-3b5f-469f-8bfe-75ca6b64866d',
    name: 'Botanical Romance (formerly Modern Floral)',
    category: 'wedding',
    description: 'Contemporary romantic garden theme with soft sage green, blush rose, and delicate botanicals',
    component: BotanicalRomance,
  },
  'classic-gold': {
    id: 'classic-gold-03',
    slug: 'classic-gold',
    componentName: 'ArtDecoNoirTemplate',
    themeId: '6eafa011-98a1-4e43-b71b-c6880ff80fd1',
    name: 'Art Deco Noir (formerly Classic Gold)',
    category: 'wedding',
    description: '1920s Great Gatsby luxury with obsidian black, warm champagne gold, geometric ziggurats, and entrance gate',
    component: ArtDecoNoir,
  },
};

/**
 * Normalizes any template identifier (slug, componentName, id, or theme UUID)
 * to a standardized lookup key.
 */
function normalizeIdentifier(raw?: string | null): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .trim()
    .toLowerCase()
    .replace(/template$/i, '')
    .replace(/-0[1-9]$/, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Resolves a template definition given any recognized identifier:
 * - Database Theme.templateComponent ('ArtDecoNoirTemplate', 'ImperialBurgundyTemplate', etc.)
 * - Database Theme.slug ('art-deco-noir', 'royal-maroon', etc.)
 * - Database Theme.id (UUID)
 * - Legacy Template.id ('art-deco-noir-01', 'royal-maroon-01', etc.)
 * - Case-insensitive or normalized variants
 */
export function resolveTemplate(identifier?: string | null): TemplateDefinition | null {
  if (!identifier) return null;

  const trimmed = identifier.trim();

  // 1. Direct match on slug
  if (TEMPLATE_DEFINITIONS[trimmed]) {
    return TEMPLATE_DEFINITIONS[trimmed];
  }

  // 2. Exact match against known properties
  for (const def of Object.values(TEMPLATE_DEFINITIONS)) {
    if (
      def.slug === trimmed ||
      def.componentName === trimmed ||
      def.id === trimmed ||
      def.themeId === trimmed ||
      def.name.toLowerCase() === trimmed.toLowerCase()
    ) {
      return def;
    }
  }

  // 3. Normalized fallback match
  const norm = normalizeIdentifier(trimmed);
  if (norm) {
    for (const def of Object.values(TEMPLATE_DEFINITIONS)) {
      if (
        normalizeIdentifier(def.slug) === norm ||
        normalizeIdentifier(def.componentName) === norm ||
        normalizeIdentifier(def.id) === norm ||
        normalizeIdentifier(def.name) === norm
      ) {
        return def;
      }
    }
  }

  // 4. Mapped archetype fallback
  if (TEMPLATE_COMPONENTS[trimmed]) {
    return {
      id: trimmed,
      slug: trimmed,
      componentName: trimmed,
      themeId: trimmed,
      name: trimmed,
      category: 'wedding',
      description: 'Imported interactive template archetype',
      component: TEMPLATE_COMPONENTS[trimmed],
    };
  }

  // Normalized search across TEMPLATE_COMPONENTS
  if (norm) {
    for (const [k, comp] of Object.entries(TEMPLATE_COMPONENTS)) {
      if (normalizeIdentifier(k) === norm) {
        return {
          id: k,
          slug: k,
          componentName: k,
          themeId: k,
          name: k,
          category: 'wedding',
          description: 'Imported interactive template archetype',
          component: comp,
        };
      }
    }
  }

  // 5. Default safe fallback
  return TEMPLATE_DEFINITIONS['imperial-burgundy'] || TEMPLATE_DEFINITIONS['botanical-romance'] || null;
}

/**
 * Register dynamic themes fetched from database so resolveTemplate() can find them immediately
 */
export function registerThemeInCatalog(theme: {
  slug: string;
  name: string;
  templateComponent?: string;
  category?: string;
  description?: string;
  defaultColors?: any;
  defaultFonts?: any;
  themeId?: string;
}) {
  if (!theme || !theme.slug) return;
  const comp =
    (theme.templateComponent && TEMPLATE_COMPONENTS[theme.templateComponent]) ||
    (theme.templateComponent && TEMPLATE_DEFINITIONS[theme.templateComponent]?.component) ||
    ImperialBurgundy;

  TEMPLATE_DEFINITIONS[theme.slug] = {
    id: theme.slug,
    slug: theme.slug,
    componentName: theme.templateComponent || 'ImperialBurgundyTemplate',
    themeId: theme.themeId || theme.slug,
    name: theme.name,
    category: theme.category || 'wedding',
    description: theme.description || '',
    component: comp,
  };
}

/**
 * Resolves the React component directly, or returns null if not found.
 */
export function getTemplateComponent(identifier?: string | null): React.ComponentType<{ data: any }> | null {
  const def = resolveTemplate(identifier);
  return def ? def.component : null;
}

/**
 * Common template component dictionary for backward compatibility
 */
export const TEMPLATE_COMPONENTS: Record<string, React.ComponentType<{ data: any }>> = {
  'art-deco-noir': ArtDecoNoir,
  'imperial-burgundy': ImperialBurgundy,
  'botanical-romance': BotanicalRomance,
  'phulkari-celebration': PhulkariCelebration,
  'coastal-pearl': CoastalPearl,
  'ivory-kayal': IvoryKayal,
  'marigold-courtyard': MarigoldCourtyard,
  'midnight-vows': MidnightVows,
  'golden-milestone': GoldenMilestone,
  'silver-jubilee': SilverJubilee,
  'celestial-lullaby': CelestialLullaby,
  'hearth-heritage': HearthHeritage,
  'midnight-soiree': MidnightSoiree,
  'divya-mandap': DivyaMandap,
  'heritage-reunion': HeritageReunion,
  'aura-grand-gala': AuraGrandGala,

  // Legacy mappings upgraded to modern components
  'royal-maroon': ImperialBurgundy,
  'modern-floral': BotanicalRomance,
  'classic-gold': ArtDecoNoir,
  'birthday-joy': GoldenMilestone,
  'RoyalMaroonTemplate': ImperialBurgundy,
  'ModernFloralTemplate': BotanicalRomance,
  'ClassicGoldTemplate': ArtDecoNoir,
  'BirthdayJoyTemplate': GoldenMilestone,
  'royal-maroon-01': ImperialBurgundy,
  'modern-floral-02': BotanicalRomance,
  'classic-gold-03': ArtDecoNoir,

  // Named components
  'ArtDecoNoirTemplate': ArtDecoNoir,
  'ImperialBurgundyTemplate': ImperialBurgundy,
  'BotanicalRomanceTemplate': BotanicalRomance,
  'PhulkariCelebrationTemplate': PhulkariCelebration,
  'CoastalPearlTemplate': CoastalPearl,
  'IvoryKayalTemplate': IvoryKayal,
  'MarigoldCourtyardTemplate': MarigoldCourtyard,
  'MidnightVowsTemplate': MidnightVows,
  'GoldenMilestoneTemplate': GoldenMilestone,
  'SilverJubileeTemplate': SilverJubilee,
  'CelestialLullabyTemplate': CelestialLullaby,
  'HearthHeritageTemplate': HearthHeritage,
  'MidnightSoireeTemplate': MidnightSoiree,
  'DivyaMandapTemplate': DivyaMandap,
  'HeritageReunionTemplate': HeritageReunion,
  'AuraGrandGalaTemplate': AuraGrandGala,
  'RetroSynthArcadeTemplate': Catalog.RetroSynthArcade,
  'EnchantedStorybookBirthdayTemplate': Catalog.EnchantedStorybookBirthday,
  'SafariWildOneTemplate': Catalog.SafariWildOne,
  'VintageDistilleryMilestoneTemplate': Catalog.VintageDistilleryMilestone,
  'GoldenJubilee50thTemplate': Catalog.GoldenJubilee50th,
  'RubyRomance40thTemplate': Catalog.RubyRomance40th,
  'BohoSunsetVowsTemplate': Catalog.BohoSunsetVows,
  'MonochromeFilmNoirAnniversaryTemplate': Catalog.MonochromeFilmNoirAnniversary,
  'WoodlandFableShowerTemplate': Catalog.WoodlandFableShower,
  'RoyalLittlePrincePrincessTemplate': Catalog.RoyalLittlePrincePrincess,
  'SunshineMeadowShowerTemplate': Catalog.SunshineMeadowShower,
  'BohoRainbowMiracleTemplate': Catalog.BohoRainbowMiracle,
  'ScandiMinimalHavenTemplate': Catalog.ScandiMinimalHaven,
  'RajasthaniJharokhaGrihaTemplate': Catalog.RajasthaniJharokhaGriha,
  'UrbanTerraceSoireeTemplate': Catalog.UrbanTerraceSoiree,
  'CoastalBreezeHomeTemplate': Catalog.CoastalBreezeHome,
  'TropicalSunsetLuauTemplate': Catalog.TropicalSunsetLuau,
  'Studio54DiscoGlamTemplate': Catalog.Studio54DiscoGlam,
  'SpeakeasyRoaringTwentiesTemplate': Catalog.SpeakeasyRoaringTwenties,
  'PoolsideSunDrenchedBashTemplate': Catalog.PoolsideSunDrenchedBash,
  'ShreeGaneshVandanaTemplate': Catalog.ShreeGaneshVandana,
  'WaheguruAnandBlessingsTemplate': Catalog.WaheguruAnandBlessings,
  'CathedralGraceCommunionTemplate': Catalog.CathedralGraceCommunion,
  'NoorEMehfilNikahEidTemplate': Catalog.NoorEMehfilNikahEid,
  'VintageRootsFamilyArchiveTemplate': Catalog.VintageRootsFamilyArchive,
  'SunlitPicnicCarnivalTemplate': Catalog.SunlitPicnicCarnival,
  'FestiveDiwaliFamilyMilanTemplate': Catalog.FestiveDiwaliFamilyMilan,
  'GenerationsAnchoredReunionTemplate': Catalog.GenerationsAnchoredReunion,
  'CommencementExcellenceTemplate': Catalog.CommencementExcellence,
  'PhilanthropyCrystalBallTemplate': Catalog.PhilanthropyCrystalBall,
  'TechSummitFutureVisionTemplate': Catalog.TechSummitFutureVision,
  'BonVoyageWanderlustTemplate': Catalog.BonVoyageWanderlust,
};
