import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * GET /api/public/invitations/:slug
 * Public endpoint to fetch invitation by unique slug for guests
 */
router.get('/invitations/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: {
        events: {
          orderBy: { orderIndex: 'asc' },
        },
        mediaAssets: {
          orderBy: { orderIndex: 'asc' },
        },
        theme: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      return res.status(404).json({
        error: 'Not found',
        message: 'The requested invitation website could not be found.',
      });
    }

    // Check if invitation is published and live
    if (!invitation.isPublished || !invitation.isLive) {
      return res.status(403).json({
        error: 'Unpublished',
        message: 'This celebration website is currently in draft mode and has not yet been published by the host.',
        isPublished: false,
        title: invitation.title,
        eventType: invitation.eventType,
        occasionType: invitation.eventType,
        themeComponent: invitation.theme?.templateComponent || 'royal-maroon',
      });
    }

    // Return published invitation data
    return res.json({
      success: true,
      invitation: {
        id: invitation.id,
        title: invitation.title,
        slug: invitation.slug,
        eventType: invitation.eventType,
        occasionType: invitation.eventType,
        tagline: invitation.tagline,
        welcomeMessage: invitation.welcomeMessage,
        storyContent: invitation.storyContent,
        familyInfo: invitation.familyInfo,
        musicUrl: invitation.musicUrl,
        heroImageUrl: invitation.heroImageUrl,
        language: invitation.language,
        allowLanguageToggle: invitation.allowLanguageToggle,
        allowGuestRsvpEdit: invitation.allowGuestRsvpEdit,
        isPublished: invitation.isPublished,
        isLive: invitation.isLive,
        publishedAt: invitation.publishedAt,
        events: invitation.events,
        mediaAssets: invitation.mediaAssets,
        theme: invitation.theme ? {
          id: invitation.theme.id,
          name: invitation.theme.name,
          slug: invitation.theme.slug,
          category: invitation.theme.category,
          templateComponent: invitation.theme.templateComponent,
          defaultColors: invitation.theme.defaultColors,
          defaultFonts: invitation.theme.defaultFonts,
        } : null,
        host: {
          name: invitation.user.name,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching public invitation:', error);
    next(error);
  }
});

/**
 * POST /api/public/invitations/:slug/rsvp
 * Submit a public guest RSVP
 */
router.post('/invitations/:slug/rsvp', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const {
      guestName,
      name,
      email,
      phone,
      attending,
      isAttending,
      attendeeCount,
      partySize,
      dietaryRestrictions,
      wishes,
      message,
    } = req.body;

    const effectiveName = (guestName || name || 'Honored Guest').trim();
    const effectiveAttending = attending === 'attending' || attending === true || isAttending === true || isAttending === 'true';
    const effectiveCount = Number(attendeeCount || partySize || 1);

    const invitation = await prisma.invitation.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found or not published' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const guest = await tx.guest.create({
        data: {
          invitationId: invitation.id,
          householdName: effectiveName,
          token: crypto.randomUUID(),
          email: email || null,
          phone: phone || null,
          maxGuests: effectiveCount,
          allowedEvents: ['main-celebration'],
        },
      });

      const rsvp = await tx.rsvp.create({
        data: {
          guestId: guest.id,
          isAttending: effectiveAttending,
          attendingCount: effectiveAttending ? effectiveCount : 0,
          eventsAttending: ['main-celebration'],
          dietaryRestrictions: dietaryRestrictions || null,
          message: wishes || message || null,
          respondedAt: new Date(),
        },
      });

      return { guest, rsvp };
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your RSVP has been received.',
      rsvp: {
        guestId: result.guest.id,
        guestName: result.guest.householdName,
        isAttending: result.rsvp.isAttending,
        attendingCount: result.rsvp.attendingCount,
      },
    });
  } catch (error) {
    console.error('Error submitting public RSVP:', error);
    next(error);
  }
});

/**
 * GET /api/public/themes
 * Returns all active themes for host gallery and templates selector
 */
router.get('/themes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;

    const where: any = { isActive: true };
    if (category && category !== 'all') {
      where.category = category as string;
    }

    const themes = await prisma.theme.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        description: true,
        tags: true,
        templateComponent: true,
        previewImageUrl: true,
        previewUrl: true,
        priceTier: true,
        priceAmount: true,
        isFeatured: true,
        defaultColors: true,
        defaultFonts: true,
        features: true,
      },
    });

    const mappedThemes = themes.map((t) => {
      const defaultColors: any = t.defaultColors || {};
      const sampleData = defaultColors?.sampleData || null;
      return {
        ...t,
        sampleData,
      };
    });

    res.json({
      success: true,
      themes: mappedThemes,
      total: mappedThemes.length,
    });
  } catch (error) {
    console.error('Error fetching public themes:', error);
    next(error);
  }
});

/**
 * GET /api/public/themes/:slug
 * Returns a specific public theme by slug or id
 */
router.get('/themes/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const theme = await prisma.theme.findFirst({
      where: {
        OR: [
          { slug },
          { id: slug },
        ],
        isActive: true,
      },
    });

    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }

    const defaultColors: any = theme.defaultColors || {};
    const sampleData = defaultColors?.sampleData || null;

    res.json({
      success: true,
      theme: {
        ...theme,
        sampleData,
      },
    });
  } catch (error) {
    console.error('Error fetching theme by slug:', error);
    next(error);
  }
});

export default router;

