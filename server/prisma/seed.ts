import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // 1. Create Admin User
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wedding-saas.com' },
    update: {},
    create: {
      email: 'admin@wedding-saas.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'admin',
      emailVerified: true,
      subscriptionTier: 'business', // Admin gets highest tier
    },
  });
  console.log('  ✅ Admin:', admin.email);

  // 2. Create Test Host User
  console.log('\n👤 Creating test host user...');
  const hostPassword = await bcrypt.hash('test123', 12);
  
  const host = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash: hostPassword,
      name: 'Test Host',
      phone: '+91-9876543210',
      role: 'host',
      subscriptionTier: 'pro',
      emailVerified: true,
    },
  });
  console.log('  ✅ Host:', host.email, '(Pro tier)');

  // 3. Create Free Tier User
  console.log('\n👤 Creating free tier user...');
  const freePassword = await bcrypt.hash('free123', 12);
  
  const freeUser = await prisma.user.upsert({
    where: { email: 'free@example.com' },
    update: {},
    create: {
      email: 'free@example.com',
      passwordHash: freePassword,
      name: 'Free User',
      role: 'host',
      subscriptionTier: 'free',
      emailVerified: true,
    },
  });
  console.log('  ✅ Free User:', freeUser.email, '(Free tier)');

  // 4. Create Themes (from OLD templates)
  console.log('\n🎨 Creating themes...');
  
  const royalMaroon = await prisma.theme.upsert({
    where: { slug: 'royal-maroon' },
    update: {},
    create: {
      name: 'Royal Maroon',
      slug: 'royal-maroon',
      description: 'Elegant traditional Indian wedding theme with rich maroon and gold accents. Features animated door entrance, countdown timer, and premium effects.',
      category: 'wedding',
      tags: ['traditional', 'indian', 'luxury', 'premium', 'animated'],
      templateComponent: 'RoyalMaroonTemplate',
      previewImageUrl: '/themes/royal-maroon-preview.jpg',
      defaultColors: {
        primary: '#7f1d1d',
        secondary: '#f59e0b',
        background: '#fffbeb',
        accent: '#fbbf24',
      },
      defaultFonts: {
        heading: 'Cinzel',
        body: 'Cormorant Garamond',
        decorative: 'Great Vibes',
      },
      features: [
        'animated_door_entrance',
        'hero_banner',
        'sticky_navigation',
        'main_event_highlight',
        'countdown_timer',
        'rsvp_form',
        'photo_gallery',
        'premium_animations',
      ],
      priceTier: 'premium',
      priceAmount: 59900, // ₹599 (in paise)
      currency: 'INR',
      isActive: true,
      isFeatured: true,
    },
  });
  console.log('  ✅ Theme:', royalMaroon.name, `(${royalMaroon.priceTier})`);

  const modernFloral = await prisma.theme.upsert({
    where: { slug: 'modern-floral' },
    update: {},
    create: {
      name: 'Modern Floral',
      slug: 'modern-floral',
      description: 'Contemporary romantic theme with soft floral elements and pastel colors. Perfect for modern couples seeking a light, airy aesthetic.',
      category: 'wedding',
      tags: ['modern', 'romantic', 'floral', 'pastel', 'light'],
      templateComponent: 'ModernFloralTemplate',
      previewImageUrl: '/themes/modern-floral-preview.jpg',
      defaultColors: {
        primary: '#f43f5e',
        secondary: '#c084fc',
        background: '#fdf2f8',
        accent: '#fda4af',
      },
      defaultFonts: {
        heading: 'Playfair Display',
        body: 'Lora',
        decorative: 'Great Vibes',
      },
      features: [
        'floating_flowers',
        'gradient_effects',
        'event_cards',
        'photo_gallery',
        'responsive_design',
      ],
      priceTier: 'free',
      priceAmount: 0,
      currency: 'INR',
      isActive: true,
      isFeatured: false,
    },
  });
  console.log('  ✅ Theme:', modernFloral.name, `(${modernFloral.priceTier})`);

  const classicGold = await prisma.theme.upsert({
    where: { slug: 'classic-gold' },
    update: {},
    create: {
      name: 'Classic Gold',
      slug: 'classic-gold',
      description: 'Timeless elegance with champagne gold accents and ornate borders. Perfect for upscale, sophisticated celebrations.',
      category: 'wedding',
      tags: ['classic', 'elegant', 'gold', 'luxury', 'sophisticated'],
      templateComponent: 'ClassicGoldTemplate',
      previewImageUrl: '/themes/classic-gold-preview.jpg',
      defaultColors: {
        primary: '#d97706',
        secondary: '#eab308',
        background: '#fdfbf7',
        accent: '#f59e0b',
      },
      defaultFonts: {
        heading: 'Cinzel',
        body: 'Cormorant Garamond',
        decorative: 'Montserrat',
      },
      features: [
        'ornate_borders',
        'crown_icon',
        'gradient_text',
        'event_cards',
        'photo_gallery',
        'premium_styling',
      ],
      priceTier: 'premium',
      priceAmount: 49900, // ₹499 (in paise)
      currency: 'INR',
      isActive: true,
      isFeatured: false,
    },
  });
  console.log('  ✅ Theme:', classicGold.name, `(${classicGold.priceTier})`);

  // 5. Create Birthday Theme (Multi-occasion)
  console.log('\n🎨 Creating birthday theme...');
  
  const birthdayJoy = await prisma.theme.upsert({
    where: { slug: 'birthday-joy' },
    update: {},
    create: {
      name: 'Birthday Joy',
      slug: 'birthday-joy',
      description: 'Vibrant and fun birthday celebration theme with colorful balloons and festive elements.',
      category: 'birthday',
      tags: ['birthday', 'colorful', 'fun', 'celebration', 'party'],
      templateComponent: 'BirthdayJoyTemplate',
      previewImageUrl: '/themes/birthday-joy-preview.jpg',
      defaultColors: {
        primary: '#3b82f6',
        secondary: '#f59e0b',
        background: '#fef3c7',
        accent: '#ec4899',
      },
      defaultFonts: {
        heading: 'Poppins',
        body: 'Inter',
        decorative: 'Pacifico',
      },
      features: [
        'balloon_animation',
        'age_display',
        'party_details',
        'photo_gallery',
        'rsvp_form',
      ],
      priceTier: 'free',
      priceAmount: 0,
      currency: 'INR',
      isActive: true,
      isFeatured: false,
    },
  });
  console.log('  ✅ Theme:', birthdayJoy.name, `(${birthdayJoy.category})`);

  // 6. Create Sample Invitation (for test host)
  console.log('\n📨 Creating sample invitation...');
  
  const invitation = await prisma.invitation.create({
    data: {
      userId: host.id,
      themeId: royalMaroon.id,
      title: 'Rohan & Priya',
      slug: 'rohan-priya-wedding',
      eventType: 'wedding',
      tagline: 'Two hearts, one love',
      welcomeMessage: 'We are delighted to invite you to celebrate our special day with us!',
      storyContent: 'Our journey began 5 years ago when we met at a friend\'s party...',
      language: 'en',
      isLive: true,
      isPublished: true,
      publishedAt: new Date(),
    },
  });
  console.log('  ✅ Invitation:', invitation.title, `(${invitation.slug})`);

  // 7. Create Events for the invitation
  console.log('\n📅 Creating events...');
  
  const weddingDate = new Date('2027-02-15');
  
  const haldi = await prisma.event.create({
    data: {
      invitationId: invitation.id,
      name: 'Haldi Ceremony',
      description: 'Traditional turmeric ceremony with family and close friends',
      eventDate: new Date('2027-02-13'),
      startTime: new Date('2027-02-13T10:00:00'),
      endTime: new Date('2027-02-13T14:00:00'),
      venueName: 'Family Residence',
      venueAddress: '123 Garden Street, Mumbai',
      venueCity: 'Mumbai',
      venueState: 'Maharashtra',
      dressCode: 'Traditional Yellow',
      orderIndex: 0,
      isMainEvent: false,
      showCountdown: false,
    },
  });
  console.log('  ✅ Event:', haldi.name);

  const wedding = await prisma.event.create({
    data: {
      invitationId: invitation.id,
      name: 'Wedding Ceremony',
      description: 'Sacred wedding ceremony in the presence of family and friends',
      eventDate: weddingDate,
      startTime: new Date('2027-02-15T18:00:00'),
      endTime: new Date('2027-02-15T21:00:00'),
      venueName: 'The Grand Palace',
      venueAddress: '456 Royal Avenue, Mumbai',
      venueCity: 'Mumbai',
      venueState: 'Maharashtra',
      dressCode: 'Traditional Formal',
      orderIndex: 1,
      isMainEvent: true,
      showCountdown: true,
    },
  });
  console.log('  ✅ Event:', wedding.name, '(Main Event)');

  const reception = await prisma.event.create({
    data: {
      invitationId: invitation.id,
      name: 'Reception',
      description: 'Dinner and celebration with all loved ones',
      eventDate: new Date('2027-02-16'),
      startTime: new Date('2027-02-16T19:00:00'),
      endTime: new Date('2027-02-16T23:00:00'),
      venueName: 'The Grand Palace',
      venueAddress: '456 Royal Avenue, Mumbai',
      venueCity: 'Mumbai',
      venueState: 'Maharashtra',
      dressCode: 'Formal',
      orderIndex: 2,
      isMainEvent: false,
      showCountdown: false,
    },
  });
  console.log('  ✅ Event:', reception.name);

  // 8. Create Sample Guests
  console.log('\n👥 Creating sample guests...');
  
  const guest1 = await prisma.guest.create({
    data: {
      invitationId: invitation.id,
      householdName: 'Sharma Family',
      token: 'sample-token-sharma-' + Date.now(),
      maxGuests: 4,
      allowedEvents: [haldi.id, wedding.id, reception.id],
      email: 'sharma@example.com',
      phone: '+91-9876543210',
    },
  });
  console.log('  ✅ Guest:', guest1.householdName, `(${guest1.maxGuests} people)`);

  const guest2 = await prisma.guest.create({
    data: {
      invitationId: invitation.id,
      householdName: 'Kapoor Family',
      token: 'sample-token-kapoor-' + Date.now(),
      maxGuests: 5,
      allowedEvents: [wedding.id, reception.id], // Not invited to Haldi
      email: 'kapoor@example.com',
    },
  });
  console.log('  ✅ Guest:', guest2.householdName, `(${guest2.maxGuests} people)`);

  // 9. Create Sample RSVP
  console.log('\n✉️ Creating sample RSVP...');
  
  const rsvp = await prisma.rsvp.create({
    data: {
      guestId: guest1.id,
      isAttending: true,
      attendingCount: 4,
      eventsAttending: [haldi.id, wedding.id, reception.id],
      dietaryRestrictions: '2 vegetarian, 2 non-vegetarian',
      message: 'Looking forward to celebrating with you!',
    },
  });
  console.log('  ✅ RSVP:', guest1.householdName, '→ Attending all events');

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Database seeding complete!\n');
  console.log('📊 Summary:');
  console.log(`   Users:       ${await prisma.user.count()}`);
  console.log(`   Themes:      ${await prisma.theme.count()}`);
  console.log(`   Invitations: ${await prisma.invitation.count()}`);
  console.log(`   Events:      ${await prisma.event.count()}`);
  console.log(`   Guests:      ${await prisma.guest.count()}`);
  console.log(`   RSVPs:       ${await prisma.rsvp.count()}`);
  console.log('\n🔐 Test Credentials:');
  console.log('   Admin:     admin@wedding-saas.com / admin123');
  console.log('   Host:      test@example.com / test123');
  console.log('   Free User: free@example.com / free123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
