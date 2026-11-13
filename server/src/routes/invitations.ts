import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const createInvitationSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title too long'),
  occasionType: z.string().transform(val => val.toLowerCase()).pipe(z.enum([
    'wedding',
    'birthday',
    'anniversary',
    'baby_shower',
    'housewarming',
    'party',
    'religious',
    'family_celebration',
    'other',
  ], {
    errorMap: () => ({ message: 'Invalid occasion type' }),
  })),
  themeId: z.string().optional(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate request body against a Zod schema
 */
function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Generate URL-safe slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .substring(0, 100); // Limit length
}

/**
 * Ensure slug is unique by appending number if needed
 */
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.invitation.findUnique({
      where: { slug },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * Format invitation for API response
 */
function formatInvitationResponse(invitation: any) {
  return {
    id: invitation.id,
    title: invitation.title,
    slug: invitation.slug,
    occasionType: invitation.eventType,
    themeId: invitation.themeId,
    isPublished: invitation.isPublished,
    isLive: invitation.isLive,
    createdAt: invitation.createdAt,
    updatedAt: invitation.updatedAt,
  };
}

// ============================================================================
// ROUTE: POST /api/host/invitations
// Create a new invitation
// ============================================================================

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { title, occasionType, themeId } = validateRequest(createInvitationSchema, req.body);

    // Get user ID from authenticated context (never trust request body)
    const userId = req.user!.userId;

    // Verify theme exists if provided
    let resolvedThemeId: string | undefined = undefined;
    if (themeId) {
      let theme = await prisma.theme.findUnique({
        where: { id: themeId },
      }).catch(() => null);

      if (!theme) {
        // Try looking up by slug
        theme = await prisma.theme.findUnique({
          where: { slug: themeId },
        }).catch(() => null);
      }

      if (theme && theme.isActive) {
        resolvedThemeId = theme.id;
      } else {
        console.warn(`[Invitations] Theme '${themeId}' not found or inactive. Proceeding without theme.`);
      }
    }

    // Generate unique slug
    const baseSlug = generateSlug(title);
    const uniqueSlug = await ensureUniqueSlug(baseSlug);

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        userId,
        title,
        slug: uniqueSlug,
        eventType: occasionType, // Map occasionType to eventType field
        themeId: resolvedThemeId,
        isPublished: false, // Unpublished by default
        isLive: false,
      },
      include: {
        theme: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            templateComponent: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Invitation created successfully',
      invitation: {
        ...formatInvitationResponse(invitation),
        theme: invitation.theme,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    next(error);
  }
});

// ============================================================================
// ROUTE: GET /api/host/invitations
// List all invitations for authenticated host
// ============================================================================

router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    // Get invitations with event counts
    const invitations = await prisma.invitation.findMany({
      where: {
        userId,
      },
      include: {
        theme: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            templateComponent: true,
          },
        },
        events: {
          select: {
            id: true,
          },
        },
        guests: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            events: true,
            guests: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format response
    const formattedInvitations = invitations.map(inv => ({
      ...formatInvitationResponse(inv),
      theme: inv.theme,
      stats: {
        eventCount: inv._count.events,
        guestCount: inv._count.guests,
      },
    }));

    res.json({
      success: true,
      invitations: formattedInvitations,
      total: invitations.length,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// ROUTE: GET /api/host/invitations/:id
// Get a single invitation with details
// ============================================================================

router.get('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        error: 'INVALID_ID',
        message: 'Invalid invitation ID format',
      });
    }

    // Find invitation with ownership check
    const invitation = await prisma.invitation.findFirst({
      where: {
        id,
        userId, // Ownership check - only return if belongs to authenticated user
      },
      include: {
        theme: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            templateComponent: true,
            previewImageUrl: true,
          },
        },
        events: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        _count: {
          select: {
            events: true,
            guests: true,
            mediaAssets: true,
          },
        },
      },
    });

    if (!invitation) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Invitation not found or you do not have access to it',
      });
    }

    res.json({
      success: true,
      invitation: {
        id: invitation.id,
        title: invitation.title,
        slug: invitation.slug,
        occasionType: invitation.eventType,
        tagline: invitation.tagline,
        welcomeMessage: invitation.welcomeMessage,
        storyContent: invitation.storyContent,
        familyInfo: invitation.familyInfo,
        heroImageUrl: invitation.heroImageUrl,
        musicUrl: invitation.musicUrl,
        language: invitation.language,
        allowLanguageToggle: invitation.allowLanguageToggle,
        allowGuestRsvpEdit: invitation.allowGuestRsvpEdit,
        isPublished: invitation.isPublished,
        isLive: invitation.isLive,
        expiresAt: invitation.expiresAt,
        publishedAt: invitation.publishedAt,
        createdAt: invitation.createdAt,
        updatedAt: invitation.updatedAt,
        theme: invitation.theme,
        events: invitation.events,
        stats: {
          eventCount: invitation._count.events,
          guestCount: invitation._count.guests,
          mediaCount: invitation._count.mediaAssets,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// ROUTE: PUT /api/host/invitations/:id
// Update an existing invitation
// ============================================================================

const eventSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Event name is required'),
  description: z.string().optional().nullable(),
  eventDate: z.string(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  venueName: z.string().optional().nullable(),
  venueAddress: z.string().optional().nullable(),
  mapLink: z.string().optional().nullable(),
  dressCode: z.string().optional().nullable(),
  orderIndex: z.number().int().optional(),
});

const updateInvitationSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  tagline: z.string().max(255).optional().nullable(),
  welcomeMessage: z.string().optional().nullable(),
  storyContent: z.string().optional().nullable(),
  familyInfo: z.string().optional().nullable(),
  musicUrl: z.string().optional().nullable(),
  heroImageUrl: z.string().optional().nullable(),
  themeId: z.string().uuid().optional(),
  events: z.array(eventSchema).optional(),
});

function parseEventTime(dateStr: string, timeStr?: string | null): Date | null {
  if (!timeStr) return null;
  if (timeStr.includes('T')) {
    const d = new Date(timeStr);
    return isNaN(d.getTime()) ? null : d;
  }
  const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const timePart = timeStr.trim().length === 5 ? `${timeStr.trim()}:00` : timeStr.trim();
  const d = new Date(`${datePart}T${timePart}`);
  return isNaN(d.getTime()) ? null : d;
}

router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    // Validate UUID format
    if (!z.string().uuid().safeParse(id).success) {
      return res.status(400).json({
        error: 'INVALID_ID',
        message: 'Invalid invitation ID format',
      });
    }

    // Validate request body
    const updates = validateRequest(updateInvitationSchema, req.body);

    // Check invitation exists and user owns it
    const existing = await prisma.invitation.findFirst({
      where: {
        id,
        userId, // Ownership check
      },
    });

    if (!existing) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Invitation not found or you do not have permission to edit it',
      });
    }

    const { events: eventsData, ...invitationUpdates } = updates;

    // Atomic update transaction
    const updated = await prisma.$transaction(async (tx) => {
      if (eventsData !== undefined) {
        await tx.event.deleteMany({
          where: { invitationId: id },
        });

        if (eventsData.length > 0) {
          await tx.event.createMany({
            data: eventsData.map((e, idx) => ({
              invitationId: id,
              name: e.name,
              description: e.description || null,
              eventDate: new Date(e.eventDate.includes('T') ? e.eventDate.split('T')[0] : e.eventDate),
              startTime: parseEventTime(e.eventDate, e.startTime),
              endTime: parseEventTime(e.eventDate, e.endTime),
              venueName: e.venueName || null,
              venueAddress: e.venueAddress || null,
              mapLink: e.mapLink || null,
              dressCode: e.dressCode || null,
              orderIndex: e.orderIndex ?? idx,
              isMainEvent: idx === 0,
            })),
          });
        }
      }

      return tx.invitation.update({
        where: { id },
        data: {
          ...invitationUpdates,
          updatedAt: new Date(),
        },
        include: {
          theme: true,
          events: {
            orderBy: { orderIndex: 'asc' },
          },
          _count: {
            select: {
              events: true,
              guests: true,
              mediaAssets: true,
            },
          },
        },
      });
    });

    res.json({
      success: true,
      message: 'Invitation updated successfully',
      invitation: {
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        occasionType: updated.eventType,
        themeId: updated.themeId,
        tagline: updated.tagline,
        welcomeMessage: updated.welcomeMessage,
        storyContent: updated.storyContent,
        familyInfo: updated.familyInfo,
        musicUrl: updated.musicUrl,
        heroImageUrl: updated.heroImageUrl,
        isPublished: updated.isPublished,
        isLive: updated.isLive,
        updatedAt: updated.updatedAt,
        theme: updated.theme,
        events: updated.events,
        stats: {
          eventCount: updated._count.events,
          guestCount: updated._count.guests,
          mediaCount: updated._count.mediaAssets,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/host/invitations/:id/payment-status
 * Check payment and publish status for an invitation
 */
router.get('/:id/payment-status', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const invitation = await prisma.invitation.findFirst({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
        isLive: true,
        publishedAt: true,
      },
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const payment = await prisma.payment.findFirst({
      where: {
        referenceId: id,
        status: 'succeeded',
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        currency: true,
        paymentMethod: true,
        gatewayTransactionId: true,
        succeededAt: true,
      },
    });

    res.json({
      success: true,
      isPaid: Boolean(payment || invitation.isPublished),
      isPublished: invitation.isPublished,
      isLive: invitation.isLive,
      publishedAt: invitation.publishedAt,
      publicUrl: `/i/${invitation.slug}`,
      payment,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/host/invitations/:id/pay
 * Dummy payment gateway endpoint to pay and publish an invitation
 */
router.post('/:id/pay', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userEmail = req.user!.email;
    const { amount = 1499, paymentMethod = 'card', planName = 'Premium Celebration Plan' } = req.body;

    const invitation = await prisma.invitation.findFirst({
      where: { id, userId },
      include: { theme: true },
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const transactionId = `TXN_DEMO_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Execute atomic payment creation and invitation publication
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Payment record
      const payment = await tx.payment.create({
        data: {
          user: { connect: { id: userId } },
          amount: Number(amount),
          currency: 'INR',
          status: 'succeeded',
          paymentMethod,
          gateway: 'dummy_payment_gateway',
          gatewayTransactionId: transactionId,
          purpose: 'publish_invitation',
          referenceId: invitation.id,
          metadata: {
            invitationTitle: invitation.title,
            slug: invitation.slug,
            planName,
            paidByEmail: userEmail,
            simulated: true,
          },
          succeededAt: new Date(),
        },
      });

      // 2. Mark Invitation as published and live
      const updatedInvitation = await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          isPublished: true,
          isLive: true,
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return { payment, updatedInvitation };
    });

    res.json({
      success: true,
      message: 'Payment completed successfully! Invitation is now publicly accessible.',
      payment: {
        id: result.payment.id,
        transactionId: result.payment.gatewayTransactionId,
        amount: result.payment.amount,
        currency: result.payment.currency,
        status: result.payment.status,
        paymentMethod: result.payment.paymentMethod,
        paidAt: result.payment.succeededAt,
      },
      invitation: {
        id: result.updatedInvitation.id,
        title: result.updatedInvitation.title,
        slug: result.updatedInvitation.slug,
        isPublished: result.updatedInvitation.isPublished,
        isLive: result.updatedInvitation.isLive,
        publishedAt: result.updatedInvitation.publishedAt,
        publicUrl: `/i/${result.updatedInvitation.slug}`,
      },
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    next(error);
  }
});

export default router;
