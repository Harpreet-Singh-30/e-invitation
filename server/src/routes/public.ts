import { Router, Request, Response } from 'express';
import db from '../db';
import { OrderService } from '../services/orders';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createOrderSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  groomName: z.string().optional(),
  brideName: z.string().optional(),
  templateId: z.string(),
  orderType: z.enum(['PREBOOK', 'FULL'])
});

const paymentProofSchema = z.object({
  referenceId: z.string().min(5).max(100),
  amount: z.number().positive(),
  method: z.literal('UPI_MANUAL')
});

const customRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  description: z.string().min(10).max(1000)
});

/**
 * GET /api/templates
 * List all available templates
 */
router.get('/templates', (req: Request, res: Response) => {
  try {
    const templates = db.prepare(`
      SELECT 
        id, name, description, category, 
        price_paise as pricePaise, 
        prebook_price_paise as prebookPricePaise,
        demo_slug as demoSlug,
        poster_image as posterImage,
        preview_data as previewData,
        schema_json as schemaJson
      FROM templates
      WHERE status = 'AVAILABLE'
      ORDER BY sort_order ASC
    `).all();
    
    const templatesWithParsedData = templates.map((t: any) => ({
      ...t,
      previewData: JSON.parse(t.previewData),
      schemaJson: JSON.parse(t.schemaJson),
      priceRupees: t.pricePaise / 100,
      prebookPriceRupees: t.prebookPricePaise / 100
    }));
    
    res.json({ templates: templatesWithParsedData });
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

/**
 * POST /api/orders
 * Create a new order and get payment instructions
 */
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const data = createOrderSchema.parse(req.body);
    
    // Create or get customer
    let customer = db.prepare(`
      SELECT id FROM customers WHERE email = ? OR phone = ?
    `).get(data.email, data.phone) as any;
    
    if (!customer) {
      const result = db.prepare(`
        INSERT INTO customers (email, phone, groom_name, bride_name)
        VALUES (?, ?, ?, ?)
      `).run(data.email, data.phone, data.groomName || null, data.brideName || null);
      
      customer = { id: result.lastInsertRowid };
    }
    
    // Create order
    const { orderId, paymentInstructions } = OrderService.createOrder({
      customerId: customer.id as number,
      templateId: data.templateId,
      orderType: data.orderType
    });
    
    res.status(201).json({
      success: true,
      orderId,
      paymentInstructions
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    res.status(400).json({ error: error.message || 'Failed to create order' });
  }
});

/**
 * POST /api/orders/:id/payment-proof
 * Submit payment proof for verification
 */
router.post('/orders/:id/payment-proof', async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const data = paymentProofSchema.parse(req.body);
    
    // Verify order exists and is in correct state
    const order = db.prepare(`
      SELECT id, state, total_amount_paise, paid_amount_paise
      FROM orders WHERE id = ?
    `).get(orderId) as any;
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.state !== 'DRAFT' && order.state !== 'PREBOOKED') {
      return res.status(400).json({ error: 'Order is not awaiting payment' });
    }
    
    // Determine payment type
    const remainingAmount = order.total_amount_paise - order.paid_amount_paise;
    const amountPaise = Math.round(data.amount * 100);
    
    let paymentType: 'PREBOOK' | 'BALANCE' | 'FULL';
    
    if (order.paid_amount_paise === 0 && amountPaise >= order.total_amount_paise) {
      paymentType = 'FULL';
    } else if (order.paid_amount_paise === 0) {
      paymentType = 'PREBOOK';
    } else {
      paymentType = 'BALANCE';
    }
    
    // Create payment record
    const result = db.prepare(`
      INSERT INTO payments (
        order_id, payment_type, amount_paise, method, 
        reference_id, status
      )
      VALUES (?, ?, ?, ?, ?, 'PENDING')
    `).run(orderId, paymentType, amountPaise, data.method, data.referenceId);
    
    res.status(201).json({
      success: true,
      paymentId: result.lastInsertRowid,
      message: 'Payment proof submitted. We will verify and activate your order within 24 hours.',
      status: 'PENDING'
    });
  } catch (error: any) {
    console.error('Error submitting payment proof:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'This payment reference has already been submitted' });
    }
    
    res.status(400).json({ error: error.message || 'Failed to submit payment proof' });
  }
});

/**
 * POST /api/custom-request
 * Submit a custom design request
 */
router.post('/custom-request', async (req: Request, res: Response) => {
  try {
    const data = customRequestSchema.parse(req.body);
    
    const result = db.prepare(`
      INSERT INTO custom_requests (name, email, phone, description, status)
      VALUES (?, ?, ?, ?, 'NEW')
    `).run(data.name, data.email, data.phone, data.description);
    
    res.status(201).json({
      success: true,
      requestId: result.lastInsertRowid,
      message: 'Thank you! We will contact you within 2 business days with a custom quote.'
    });
  } catch (error: any) {
    console.error('Error creating custom request:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

export default router;
