import { Router, Request, Response } from 'express';
import db from '../db';
import { verifyToken } from '../lib/token';
import { validateSlug, normalizeSlug } from '../lib/slug';
import { z } from 'zod';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { nanoid } from 'nanoid';

const router = Router();

const UPLOADS_PATH = process.env.UPLOADS_PATH || path.join(__dirname, '../../data/uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH, { recursive: true });
}

// Multer config for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  }
});

// Middleware to verify edit token
function verifyEditToken(req: Request, res: Response, next: Function) {
  const token = req.params.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Edit token required' });
  }
  
  try {
    const order = db.prepare(`
      SELECT o.*, t.schema_json as templateSchema
      FROM orders o
      JOIN templates t ON o.template_id = t.id
      WHERE o.edit_token_hash IS NOT NULL
    `).all() as any[];
    
    let matchedOrder = null;
    
    for (const ord of order) {
      if (verifyToken(token, ord.edit_token_hash)) {
        matchedOrder = ord;
        break;
      }
    }
    
    if (!matchedOrder) {
      return res.status(401).json({ error: 'Invalid or expired edit token' });
    }
    
    // Attach order to request
    (req as any).order = matchedOrder;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Failed to verify token' });
  }
}

/**
 * GET /api/edit/:token/site
 * Load site data and schema for editor
 */
router.get('/:token/site', verifyEditToken, (req: Request, res: Response) => {
  try {
    const order = (req as any).order;
    
    // Get or create site record
    let site = db.prepare(`
      SELECT id, slug, template_id, data_json, is_online, published_at, last_edited_at
      FROM sites WHERE order_id = ?
    `).get(order.id) as any;
    
    if (!site) {
      // Create default site with template preview data
      const template = db.prepare(`
        SELECT preview_data FROM templates WHERE id = ?
      `).get(order.template_id) as any;
      
      const result = db.prepare(`
        INSERT INTO sites (order_id, slug, template_id, data_json, is_online)
        VALUES (?, '', ?, ?, 0)
      `).run(order.id, order.template_id, template.preview_data);
      
      site = {
        id: result.lastInsertRowid,
        slug: '',
        template_id: order.template_id,
        data_json: template.preview_data,
        is_online: 0,
        published_at: null,
        last_edited_at: new Date().toISOString()
      };
    }
    
    const siteData = JSON.parse(site.data_json);
    const schema = JSON.parse(order.templateSchema);
    
    res.json({
      site: {
        id: site.id,
        slug: site.slug,
        templateId: site.template_id,
        data: siteData,
        isOnline: !!site.is_online,
        publishedAt: site.published_at,
        lastEditedAt: site.last_edited_at
      },
      schema,
      order: {
        id: order.id,
        state: order.state,
        canPublish: order.state === 'PURCHASED'
      }
    });
  } catch (error: any) {
    console.error('Error loading site:', error);
    res.status(500).json({ error: 'Failed to load site data' });
  }
});

/**
 * PUT /api/edit/:token/site
 * Save site data
 */
router.put('/:token/site', verifyEditToken, async (req: Request, res: Response) => {
  try {
    const order = (req as any).order;
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Site data required' });
    }
    
    // TODO: Validate data against schema
    
    const dataJson = JSON.stringify(data);
    const now = new Date().toISOString();
    
    // Update or create site
    const existing = db.prepare(`
      SELECT id FROM sites WHERE order_id = ?
    `).get(order.id) as any;
    
    if (existing) {
      db.prepare(`
        UPDATE sites 
        SET data_json = ?, last_edited_at = ?
        WHERE order_id = ?
      `).run(dataJson, now, order.id);
    } else {
      db.prepare(`
        INSERT INTO sites (order_id, slug, template_id, data_json)
        VALUES (?, '', ?, ?)
      `).run(order.id, order.template_id, dataJson);
    }
    
    res.json({ success: true, message: 'Site saved successfully' });
  } catch (error: any) {
    console.error('Error saving site:', error);
    res.status(500).json({ error: 'Failed to save site data' });
  }
});

/**
 * POST /api/edit/:token/assets
 * Upload an image
 */
router.post('/:token/assets', verifyEditToken, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const order = (req as any).order;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'Image file required' });
    }
    
    // Generate unique filename
    const filename = `${nanoid()}.webp`;
    const filepath = path.join(UPLOADS_PATH, filename);
    
    // Process image: resize and convert to WebP
    const metadata = await sharp(file.buffer)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(filepath);
    
    // Save asset record
    const result = db.prepare(`
      INSERT INTO assets (order_id, filename, original_filename, mime_type, size_bytes, width, height)
      VALUES (?, ?, ?, 'image/webp', ?, ?, ?)
    `).run(
      order.id,
      filename,
      file.originalname,
      metadata.size,
      metadata.width,
      metadata.height
    );
    
    res.status(201).json({
      success: true,
      asset: {
        id: result.lastInsertRowid,
        filename,
        url: `/uploads/${filename}`,
        width: metadata.width,
        height: metadata.height
      }
    });
  } catch (error: any) {
    console.error('Error uploading asset:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

/**
 * POST /api/edit/:token/slug
 * Check or claim a subdomain slug
 */
router.post('/:token/slug', verifyEditToken, async (req: Request, res: Response) => {
  try {
    const order = (req as any).order;
    const { slug, action } = req.body; // action: 'check' or 'claim'
    
    if (!slug) {
      return res.status(400).json({ error: 'Slug required' });
    }
    
    const normalized = normalizeSlug(slug);
    const validation = validateSlug(normalized);
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error, valid: false });
    }
    
    // Check availability
    const existing = db.prepare(`
      SELECT id FROM sites WHERE slug = ? AND order_id != ?
    `).get(normalized, order.id);
    
    if (existing) {
      return res.json({ 
        valid: false, 
        available: false, 
        error: 'This slug is already taken' 
      });
    }
    
    if (action === 'claim') {
      // Update site with claimed slug
      db.prepare(`
        UPDATE sites SET slug = ? WHERE order_id = ?
      `).run(normalized, order.id);
      
      return res.json({ 
        success: true, 
        slug: normalized, 
        url: `https://${normalized}.${process.env.BASE_DOMAIN || 'example.com'}` 
      });
    }
    
    // Just checking
    res.json({ valid: true, available: true, slug: normalized });
  } catch (error: any) {
    console.error('Error with slug:', error);
    res.status(500).json({ error: 'Failed to process slug' });
  }
});

/**
 * POST /api/edit/:token/publish
 * Publish the site (requires PURCHASED state)
 */
router.post('/:token/publish', verifyEditToken, async (req: Request, res: Response) => {
  try {
    const order = (req as any).order;
    
    if (order.state !== 'PURCHASED') {
      return res.status(403).json({ 
        error: 'Full payment required before publishing',
        state: order.state
      });
    }
    
    // Get site
    const site = db.prepare(`
      SELECT id, slug FROM sites WHERE order_id = ?
    `).get(order.id) as any;
    
    if (!site || !site.slug) {
      return res.status(400).json({ error: 'Please claim a subdomain first' });
    }
    
    const now = new Date().toISOString();
    
    db.transaction(() => {
      // Publish site
      db.prepare(`
        UPDATE sites 
        SET is_online = 1, published_at = ?
        WHERE id = ?
      `).run(now, site.id);
      
      // Update order state
      db.prepare(`
        UPDATE orders 
        SET state = 'PUBLISHED', updated_at = ?
        WHERE id = ?
      `).run(now, order.id);
    })();
    
    res.json({
      success: true,
      message: 'Site published successfully!',
      url: `https://${site.slug}.${process.env.BASE_DOMAIN || 'example.com'}`
    });
  } catch (error: any) {
    console.error('Error publishing site:', error);
    res.status(500).json({ error: 'Failed to publish site' });
  }
});

export default router;
