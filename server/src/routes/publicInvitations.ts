import { Router, Request, Response, NextFunction } from 'express';
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

    res.json({
      success: true,
      themes,
      total: themes.length,
    });
  } catch (error) {
    console.error('Error fetching public themes:', error);
    next(error);
  }
});

export default router;

