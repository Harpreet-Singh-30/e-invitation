import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import {
  refineAdminPrompt,
  generateTemplateFromRefinedPrompt,
  adjustTemplateWithFeedback,
} from '../services/geminiTemplateService';

const router = Router();

// Protect all admin endpoints with authentication and admin role requirement
router.use(requireAuth, requireRole(['admin']));

/**
 * GET /api/admin/me
 * Returns current admin profile
 */
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionTier: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/stats
 * Platform KPI metrics, occasion distribution, recent users and invitations
 */
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalUsers,
      totalInvitations,
      publishedInvitations,
      liveInvitations,
      totalThemes,
      occasionsGroup,
      recentUsers,
      recentInvitations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.invitation.count(),
      prisma.invitation.count({ where: { isPublished: true } }),
      prisma.invitation.count({ where: { isLive: true } }),
      prisma.theme.count(),
      prisma.invitation.groupBy({
        by: ['eventType'],
        _count: { id: true },
      }),
      prisma.user.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          subscriptionTier: true,
          createdAt: true,
          _count: { select: { invitations: true } },
        },
      }),
      prisma.invitation.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          eventType: true,
          isPublished: true,
          isLive: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
          theme: { select: { name: true, category: true } },
        },
      }),
    ]);

    // Format category distribution
    const categoryDistribution = occasionsGroup.map((item) => ({
      category: item.eventType,
      count: item._count.id,
    }));

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalInvitations,
        publishedInvitations,
        liveInvitations,
        totalThemes,
        categoryDistribution,
        recentUsers,
        recentInvitations,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/users
 * Search and filter users list
 */
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = (req.query.search as string) || '';
    const role = (req.query.role as string) || '';
    const tier = (req.query.tier as string) || '';
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }
    if (role && role !== 'all') {
      where.role = role;
    }
    if (tier && tier !== 'all') {
      where.subscriptionTier = tier;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          subscriptionTier: true,
          subscriptionStatus: true,
          createdAt: true,
          lastLoginAt: true,
          _count: { select: { invitations: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/users/:id
 * Update user role or subscription tier
 */
router.put('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role, subscriptionTier, name } = req.body;

    const data: any = {};
    if (role) data.role = role;
    if (subscriptionTier) data.subscriptionTier = subscriptionTier;
    if (name) data.name = name;

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionTier: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/invitations
 * Search and filter all invitations across the platform
 */
router.get('/invitations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = (req.query.search as string) || '';
    const category = (req.query.category as string) || '';
    const status = (req.query.status as string) || '';
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { slug: { contains: search.trim(), mode: 'insensitive' } },
        { user: { email: { contains: search.trim(), mode: 'insensitive' } } },
        { user: { name: { contains: search.trim(), mode: 'insensitive' } } },
      ];
    }
    if (category && category !== 'all') {
      where.eventType = category;
    }
    if (status === 'published') {
      where.isPublished = true;
    } else if (status === 'draft') {
      where.isPublished = false;
    } else if (status === 'live') {
      where.isLive = true;
    }

    const [invitations, total] = await Promise.all([
      prisma.invitation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          eventType: true,
          isPublished: true,
          isLive: true,
          createdAt: true,
          updatedAt: true,
          user: { select: { id: true, name: true, email: true } },
          theme: { select: { id: true, name: true, slug: true, category: true } },
          _count: { select: { events: true, guests: true } },
        },
      }),
      prisma.invitation.count({ where }),
    ]);

    res.json({
      success: true,
      invitations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/invitations/:id/toggle-status
 * Toggle isPublished or isLive for any invitation
 */
router.put('/invitations/:id/toggle-status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;

    if (field !== 'isPublished' && field !== 'isLive') {
      return res.status(400).json({ error: 'Invalid field. Must be isPublished or isLive' });
    }

    const updated = await prisma.invitation.update({
      where: { id },
      data: {
        [field]: Boolean(value),
        ...(field === 'isPublished' && value ? { publishedAt: new Date() } : {}),
      },
      select: {
        id: true,
        title: true,
        isPublished: true,
        isLive: true,
      },
    });

    res.json({
      success: true,
      message: `Invitation ${field} updated`,
      invitation: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/invitations/:id
 * Delete invitation and cascading records
 */
router.delete('/invitations/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.invitation.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Invitation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/themes
 * List all themes with usage statistics
 */
router.get('/themes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = (req.query.category as string) || '';
    const search = (req.query.search as string) || '';

    const where: any = {};
    if (category && category !== 'all') {
      where.category = category;
    }
    if (search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { slug: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const themes = await prisma.theme.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        description: true,
        priceTier: true,
        priceAmount: true,
        isActive: true,
        isFeatured: true,
        createdAt: true,
        _count: { select: { invitations: true } },
      },
    });

    res.json({
      success: true,
      themes,
      total: themes.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/themes/:id/toggle-active
 * Toggle theme active state
 */
router.put('/themes/:id/toggle-active', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updated = await prisma.theme.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
      select: { id: true, name: true, isActive: true },
    });

    res.json({
      success: true,
      message: `Theme ${updated.isActive ? 'activated' : 'deactivated'}`,
      theme: updated,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// TEMPLATE IMPORT & EXPORT SPECIFICATION
// ============================================================================

const themeManifestSchema = z.object({
  name: z.string().min(2, 'Template name must be at least 2 characters').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  category: z.enum([
    'wedding',
    'birthday',
    'anniversary',
    'baby_shower',
    'housewarming',
    'party',
    'religious',
    'family_celebration',
    'other',
  ], { errorMap: () => ({ message: 'Invalid category. Must be one of: wedding, birthday, anniversary, baby_shower, housewarming, party, religious, family_celebration, other' }) }),
  description: z.string().max(500).optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  templateComponent: z.string().min(2, 'Template component archetype is required'),
  previewImageUrl: z.string().optional().default('/templates/default-preview.jpg'),
  previewUrl: z.string().optional(),
  defaultColors: z.record(z.any()).optional().default({}),
  defaultFonts: z.record(z.any()).optional().default({}),
  features: z.array(z.string()).optional().default(['animated_gate', 'audio_player', 'interactive_rsvp']),
  priceTier: z.enum(['free', 'premium']).optional().default('premium'),
  priceAmount: z.number().int().nonnegative().optional().default(49900),
  currency: z.string().optional().default('INR'),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

/**
 * POST /api/admin/themes/import
 * Import single or multiple templates via JSON manifest
 */
router.post('/themes/import', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let rawTemplates: any[] = [];

    if (Array.isArray(req.body)) {
      rawTemplates = req.body;
    } else if (req.body.templates && Array.isArray(req.body.templates)) {
      rawTemplates = req.body.templates;
    } else if (typeof req.body === 'object' && req.body !== null) {
      rawTemplates = [req.body];
    } else {
      return res.status(400).json({
        error: 'Invalid format',
        message: 'Request body must be a template object or an array of template objects',
      });
    }

    if (rawTemplates.length === 0) {
      return res.status(400).json({ error: 'No templates provided in payload' });
    }

    const importedResults: any[] = [];
    const validationErrors: { index: number; name?: string; errors: string[] }[] = [];

    for (let i = 0; i < rawTemplates.length; i++) {
      const item = rawTemplates[i];
      const parseResult = themeManifestSchema.safeParse(item);

      if (!parseResult.success) {
        validationErrors.push({
          index: i + 1,
          name: item.name || `Template #${i + 1}`,
          errors: parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        });
        continue;
      }

      const valid = parseResult.data;

      // Upsert into PostgreSQL database
      const theme = await prisma.theme.upsert({
        where: { slug: valid.slug },
        update: {
          name: valid.name,
          category: valid.category,
          description: valid.description,
          tags: valid.tags,
          templateComponent: valid.templateComponent,
          previewImageUrl: valid.previewImageUrl,
          previewUrl: valid.previewUrl || `/templates/${valid.slug}/preview`,
          defaultColors: valid.defaultColors,
          defaultFonts: valid.defaultFonts,
          features: valid.features,
          priceTier: valid.priceTier,
          priceAmount: valid.priceAmount,
          currency: valid.currency,
          isActive: valid.isActive,
          isFeatured: valid.isFeatured,
          updatedAt: new Date(),
        },
        create: {
          name: valid.name,
          slug: valid.slug,
          category: valid.category,
          description: valid.description,
          tags: valid.tags,
          templateComponent: valid.templateComponent,
          previewImageUrl: valid.previewImageUrl,
          previewUrl: valid.previewUrl || `/templates/${valid.slug}/preview`,
          defaultColors: valid.defaultColors,
          defaultFonts: valid.defaultFonts,
          features: valid.features,
          priceTier: valid.priceTier,
          priceAmount: valid.priceAmount,
          currency: valid.currency,
          isActive: valid.isActive,
          isFeatured: valid.isFeatured,
        },
      });

      importedResults.push(theme);
    }

    if (validationErrors.length > 0 && importedResults.length === 0) {
      return res.status(422).json({
        error: 'Validation failed',
        message: 'Failed to import templates due to validation errors',
        validationErrors,
      });
    }

    res.json({
      success: true,
      message: `Successfully imported ${importedResults.length} template(s)${
        validationErrors.length > 0 ? ` (${validationErrors.length} skipped due to errors)` : ''
      }`,
      importedCount: importedResults.length,
      themes: importedResults,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/themes
 * Create a single new template manually from admin form
 */
router.post('/themes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = themeManifestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        errors: parseResult.error.errors.map((e) => e.message),
      });
    }

    const valid = parseResult.data;

    // Check slug collision
    const existing = await prisma.theme.findUnique({
      where: { slug: valid.slug },
    });

    if (existing) {
      return res.status(409).json({
        error: 'Conflict',
        message: `A template with slug "${valid.slug}" already exists. Please choose a different slug.`,
      });
    }

    const created = await prisma.theme.create({
      data: {
        name: valid.name,
        slug: valid.slug,
        category: valid.category,
        description: valid.description,
        tags: valid.tags,
        templateComponent: valid.templateComponent,
        previewImageUrl: valid.previewImageUrl,
        previewUrl: valid.previewUrl || `/templates/${valid.slug}/preview`,
        defaultColors: valid.defaultColors,
        defaultFonts: valid.defaultFonts,
        features: valid.features,
        priceTier: valid.priceTier,
        priceAmount: valid.priceAmount,
        currency: valid.currency,
        isActive: valid.isActive,
        isFeatured: valid.isFeatured,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      theme: created,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/themes/:id/export
 * Export theme specification as standardized JSON manifest
 */
router.get('/themes/:id/export', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const theme = await prisma.theme.findUnique({
      where: { id },
    });

    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }

    const manifest = {
      name: theme.name,
      slug: theme.slug,
      category: theme.category,
      description: theme.description || '',
      tags: theme.tags || [],
      templateComponent: theme.templateComponent,
      previewImageUrl: theme.previewImageUrl,
      previewUrl: theme.previewUrl,
      defaultColors: theme.defaultColors || {},
      defaultFonts: theme.defaultFonts || {},
      features: theme.features || [],
      priceTier: theme.priceTier,
      priceAmount: theme.priceAmount,
      currency: theme.currency,
      isActive: theme.isActive,
      isFeatured: theme.isFeatured,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="template-${theme.slug}.json"`);
    res.json(manifest);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/themes/:id
 * Remove template if not actively used by host invitations
 */
router.delete('/themes/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const theme = await prisma.theme.findUnique({
      where: { id },
      include: {
        _count: {
          select: { invitations: true },
        },
      },
    });

    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }

    if (theme._count.invitations > 0) {
      return res.status(400).json({
        error: 'Cannot delete active theme',
        message: `This theme is currently used in ${theme._count.invitations} celebration invitation(s). Please deactivate it instead of deleting.`,
      });
    }

    await prisma.theme.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: `Theme "${theme.name}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// GEMINI AI TEMPLATE STUDIO ROUTES
// ============================================================================

/**
 * POST /api/admin/ai/refine-prompt
 * Takes raw admin prompt, enriches and refines it with Gemini AI
 */
router.post('/ai/refine-prompt', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, category = 'wedding' } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await refineAdminPrompt(prompt.trim(), category);
    res.json({
      success: true,
      refinedPrompt: result.refinedPrompt,
      creativeDirection: result.creativeDirection,
    });
  } catch (error: any) {
    console.error('[AI Refine Error]', error);
    res.status(500).json({
      error: 'AI Refine Failed',
      message: error.message || 'Failed to refine prompt with Gemini AI',
    });
  }
});

/**
 * POST /api/admin/ai/generate-template
 * Runs prompt refinement (if needed) and generates complete template manifest
 */
router.post('/ai/generate-template', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, refinedPrompt: existingRefined, category = 'wedding' } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let refinedPrompt = existingRefined;
    let creativeDirection: any = null;

    if (!refinedPrompt) {
      const refineRes = await refineAdminPrompt(prompt.trim(), category);
      refinedPrompt = refineRes.refinedPrompt;
      creativeDirection = refineRes.creativeDirection;
    }

    const result = await generateTemplateFromRefinedPrompt(
      refinedPrompt,
      category,
      prompt.trim()
    );

    res.json({
      success: true,
      template: result.template,
      refinedPrompt,
      creativeDirection,
    });
  } catch (error: any) {
    console.error('[AI Generate Error]', error);
    res.status(500).json({
      error: 'AI Generation Failed',
      message: error.message || 'Failed to generate template with Gemini AI',
    });
  }
});

/**
 * POST /api/admin/ai/adjust-template
 * Adjusts an existing template manifest according to admin feedback
 */
router.post('/ai/adjust-template', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentTemplate, feedback } = req.body;
    if (!currentTemplate || typeof currentTemplate !== 'object') {
      return res.status(400).json({ error: 'Current template manifest is required' });
    }
    if (!feedback || typeof feedback !== 'string' || !feedback.trim()) {
      return res.status(400).json({ error: 'Feedback / adjustment instructions are required' });
    }

    const result = await adjustTemplateWithFeedback(currentTemplate, feedback.trim());
    res.json({
      success: true,
      updatedTemplate: result.updatedTemplate,
      changesSummary: result.changesSummary,
    });
  } catch (error: any) {
    console.error('[AI Adjust Error]', error);
    res.status(500).json({
      error: 'AI Adjustment Failed',
      message: error.message || 'Failed to adjust template with Gemini AI',
    });
  }
});

export default router;
