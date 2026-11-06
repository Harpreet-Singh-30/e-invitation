import prisma from './lib/prisma';

/**
 * Database Connection Test Script
 * 
 * Run with: npx tsx src/test-db.ts
 */

async function testConnection() {
  console.log('🧪 Testing database connection...\n');
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!\n');
    
    // Count records in each table
    console.log('📊 Database Statistics:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const userCount = await prisma.user.count();
    const invitationCount = await prisma.invitation.count();
    const eventCount = await prisma.event.count();
    const guestCount = await prisma.guest.count();
    const rsvpCount = await prisma.rsvp.count();
    const themeCount = await prisma.theme.count();
    const mediaCount = await prisma.mediaAsset.count();
    const subscriptionCount = await prisma.subscription.count();
    const paymentCount = await prisma.payment.count();
    const themePurchaseCount = await prisma.themePurchase.count();
    
    console.log(`   Users:           ${userCount}`);
    console.log(`   Invitations:     ${invitationCount}`);
    console.log(`   Events:          ${eventCount}`);
    console.log(`   Guests:          ${guestCount}`);
    console.log(`   RSVPs:           ${rsvpCount}`);
    console.log(`   Themes:          ${themeCount}`);
    console.log(`   Media Assets:    ${mediaCount}`);
    console.log(`   Subscriptions:   ${subscriptionCount}`);
    console.log(`   Payments:        ${paymentCount}`);
    console.log(`   Theme Purchases: ${themePurchaseCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // List users
    if (userCount > 0) {
      console.log('👥 Users:');
      const users = await prisma.user.findMany({
        select: {
          email: true,
          name: true,
          role: true,
          subscriptionTier: true,
        },
      });
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.name}) - ${user.role} [${user.subscriptionTier}]`);
      });
      console.log('');
    }
    
    // List themes
    if (themeCount > 0) {
      console.log('🎨 Available Themes:');
      const themes = await prisma.theme.findMany({
        select: {
          name: true,
          category: true,
          priceTier: true,
          priceAmount: true,
          isActive: true,
          isFeatured: true,
        },
      });
      themes.forEach(theme => {
        const price = theme.priceAmount === 0 ? 'Free' : `₹${theme.priceAmount / 100}`;
        const status = theme.isActive ? '✓' : '✗';
        const featured = theme.isFeatured ? ' ⭐' : '';
        console.log(`   ${status} ${theme.name} (${theme.category}) - ${price}${featured}`);
      });
      console.log('');
    }
    
    // List invitations
    if (invitationCount > 0) {
      console.log('📨 Invitations:');
      const invitations = await prisma.invitation.findMany({
        select: {
          title: true,
          slug: true,
          eventType: true,
          isLive: true,
          isPublished: true,
          _count: {
            select: {
              events: true,
              guests: true,
            },
          },
        },
      });
      invitations.forEach(inv => {
        const status = inv.isPublished ? '✓' : '○';
        const live = inv.isLive ? 'LIVE' : 'DRAFT';
        console.log(`   ${status} ${inv.title} (${inv.slug})`);
        console.log(`      Type: ${inv.eventType} | Status: ${live}`);
        console.log(`      Events: ${inv._count.events} | Guests: ${inv._count.guests}`);
      });
      console.log('');
    }
    
    // Test a complex query (join)
    if (invitationCount > 0) {
      console.log('🔍 Testing Complex Query (Invitations with Events):');
      const invitationsWithEvents = await prisma.invitation.findMany({
        include: {
          events: {
            select: {
              name: true,
              eventDate: true,
              isMainEvent: true,
            },
            orderBy: {
              orderIndex: 'asc',
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        take: 1,
      });
      
      if (invitationsWithEvents.length > 0) {
        const inv = invitationsWithEvents[0];
        console.log(`   Invitation: ${inv.title}`);
        console.log(`   Host: ${inv.user.name} (${inv.user.email})`);
        console.log(`   Events:`);
        inv.events.forEach(event => {
          const main = event.isMainEvent ? ' (MAIN)' : '';
          console.log(`      - ${event.name}${main} on ${event.eventDate.toLocaleDateString()}`);
        });
        console.log('   ✅ Complex query successful!');
      }
      console.log('');
    }
    
    // Test Prisma introspection
    console.log('🔧 Testing Prisma Introspection:');
    const result = await prisma.$queryRaw`SELECT current_database(), current_user;`;
    console.log('   Database:', (result as any)[0].current_database);
    console.log('   User:', (result as any)[0].current_user);
    console.log('   ✅ Raw query successful!\n');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All database tests passed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Database connection test failed:\n');
    console.error(error);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check if PostgreSQL is running: sudo systemctl status postgresql');
    console.log('   2. Verify DATABASE_URL in .env file');
    console.log('   3. Test manual connection: psql -U wedding_admin -d wedding_saas -h localhost');
    console.log('   4. Check if migrations ran: npx prisma migrate status');
    console.log('');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testConnection();
