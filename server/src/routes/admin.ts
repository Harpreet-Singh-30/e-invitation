import { Router, Request, Response } from 'express';
import db from '../db';
import bcrypt from 'bcrypt';
import { OrderService } from '../services/orders';
import { generateSessionId } from '../lib/token';

const router = Router();

// Session middleware
function requireAuth(req: Request, res: Response, next: Function) {
  const sessionId = req.cookies?.admin_session;
  
  if (!sessionId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const session = db.prepare(`
      SELECT s.*, u.id as userId, u.username, u.email
      FROM admin_sessions s
      JOIN admin_users u ON s.admin_user_id = u.id
      WHERE s.id = ? AND s.expires_at > datetime('now')
    `).get(sessionId) as any;
    
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
    
    (req as any).admin = {
      id: session.userId,
      username: session.username,
      email: session.email
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * POST /admin/login
 * Admin login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    const user = db.prepare(`
      SELECT id, username, password_hash, email
      FROM admin_users
      WHERE username = ?
    `).get(username) as any;
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password_hash);
    
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create session
    const sessionId = generateSessionId();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session
    
    db.prepare(`
      INSERT INTO admin_sessions (id, admin_user_id, expires_at)
      VALUES (?, ?, ?)
    `).run(sessionId, user.id, expiresAt.toISOString());
    
    // Set cookie
    res.cookie('admin_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /admin/logout
 */
router.post('/logout', requireAuth, (req: Request, res: Response) => {
  const sessionId = req.cookies?.admin_session;
  
  if (sessionId) {
    db.prepare(`DELETE FROM admin_sessions WHERE id = ?`).run(sessionId);
  }
  
  res.clearCookie('admin_session');
  res.json({ success: true });
});

/**
 * GET /admin/me
 * Get current admin user
 */
router.get('/me', requireAuth, (req: Request, res: Response) => {
  res.json({ user: (req as any).admin });
});

/**
 * GET /admin/orders
 * List all orders with filters
 */
router.get('/orders', requireAuth, (req: Request, res: Response) => {
  try {
    const { state, search } = req.query;
    
    let query = `
      SELECT 
        o.id, o.state, o.total_amount_paise as totalAmountPaise,
        o.paid_amount_paise as paidAmountPaise,
        o.reservation_expires_at as reservationExpiresAt,
        o.created_at as createdAt,
        c.email, c.phone, c.groom_name as groomName, c.bride_name as brideName,
        t.id as templateId, t.name as templateName
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN templates t ON o.template_id = t.id
    `;
    
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (state) {
      conditions.push('o.state = ?');
      params.push(state);
    }
    
    if (search) {
      conditions.push(`(
        c.email LIKE ? OR 
        c.phone LIKE ? OR 
        c.groom_name LIKE ? OR 
        c.bride_name LIKE ?
      )`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY o.created_at DESC';
    
    const orders = db.prepare(query).all(...params) as any[];
    
    const ordersWithCalculations = orders.map(order => ({
      ...order,
      totalAmountRupees: order.totalAmountPaise / 100,
      paidAmountRupees: order.paidAmountPaise / 100,
      balanceRupees: (order.totalAmountPaise - order.paidAmountPaise) / 100
    }));
    
    res.json({ orders: ordersWithCalculations });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/**
 * GET /admin/payments
 * List pending payments for verification
 */
router.get('/payments', requireAuth, (req: Request, res: Response) => {
  try {
    const { status = 'PENDING' } = req.query;
    
    const payments = db.prepare(`
      SELECT 
        p.id, p.payment_type as paymentType, p.amount_paise as amountPaise,
        p.method, p.reference_id as referenceId, p.status,
        p.screenshot_path as screenshotPath, p.created_at as createdAt,
        o.id as orderId, o.state as orderState,
        c.email, c.phone, c.groom_name as groomName, c.bride_name as brideName,
        t.name as templateName
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      JOIN customers c ON o.customer_id = c.id
      JOIN templates t ON o.template_id = t.id
      WHERE p.status = ?
      ORDER BY p.created_at ASC
    `).all(status) as any[];
    
    const paymentsWithCalculations = payments.map(payment => ({
      ...payment,
      amountRupees: payment.amountPaise / 100
    }));
    
    res.json({ payments: paymentsWithCalculations });
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

/**
 * POST /admin/payments/:id/verify
 * Verify a payment and advance order state
 */
router.post('/payments/:id/verify', requireAuth, (req: Request, res: Response) => {
  try {
    const paymentId = parseInt(req.params.id);
    const admin = (req as any).admin;
    
    OrderService.verifyPayment(paymentId, admin.id);
    
    // Log audit
    db.prepare(`
      INSERT INTO audit_log (admin_user_id, action, entity_type, entity_id, details, ip_address)
      VALUES (?, 'VERIFY_PAYMENT', 'payment', ?, ?, ?)
    `).run(admin.id, paymentId, JSON.stringify({ verifiedBy: admin.username }), req.ip);
    
    res.json({ 
      success: true, 
      message: 'Payment verified successfully' 
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(400).json({ error: error.message || 'Failed to verify payment' });
  }
});

/**
 * GET /admin/sites
 * List all published sites
 */
router.get('/sites', requireAuth, (req: Request, res: Response) => {
  try {
    const sites = db.prepare(`
      SELECT 
        s.id, s.slug, s.is_online as isOnline, s.published_at as publishedAt,
        o.id as orderId,
        c.email, c.groom_name as groomName, c.bride_name as brideName,
        t.name as templateName
      FROM sites s
      JOIN orders o ON s.order_id = o.id
      JOIN customers c ON o.customer_id = c.id
      JOIN templates t ON s.template_id = t.id
      WHERE s.published_at IS NOT NULL
      ORDER BY s.published_at DESC
    `).all();
    
    res.json({ sites });
  } catch (error: any) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
});

/**
 * POST /admin/sites/:id/toggle-online
 * Take a site offline or bring it back online
 */
router.post('/sites/:id/toggle-online', requireAuth, (req: Request, res: Response) => {
  try {
    const siteId = parseInt(req.params.id);
    const admin = (req as any).admin;
    
    const site = db.prepare(`
      SELECT id, is_online FROM sites WHERE id = ?
    `).get(siteId) as any;
    
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }
    
    const newStatus = !site.is_online;
    
    db.prepare(`
      UPDATE sites SET is_online = ? WHERE id = ?
    `).run(newStatus ? 1 : 0, siteId);
    
    // Log audit
    db.prepare(`
      INSERT INTO audit_log (admin_user_id, action, entity_type, entity_id, details, ip_address)
      VALUES (?, ?, 'site', ?, ?, ?)
    `).run(
      admin.id,
      newStatus ? 'SITE_ONLINE' : 'SITE_OFFLINE',
      siteId,
      JSON.stringify({ newStatus }),
      req.ip
    );
    
    res.json({ 
      success: true, 
      isOnline: newStatus,
      message: newStatus ? 'Site is now online' : 'Site taken offline'
    });
  } catch (error: any) {
    console.error('Error toggling site status:', error);
    res.status(500).json({ error: 'Failed to update site status' });
  }
});

/**
 * GET /admin/stats
 * Dashboard statistics
 */
router.get('/stats', requireAuth, (req: Request, res: Response) => {
  try {
    const stats = {
      orders: db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN state = 'DRAFT' THEN 1 ELSE 0 END) as draft,
          SUM(CASE WHEN state = 'PREBOOKED' THEN 1 ELSE 0 END) as prebooked,
          SUM(CASE WHEN state = 'PURCHASED' THEN 1 ELSE 0 END) as purchased,
          SUM(CASE WHEN state = 'PUBLISHED' THEN 1 ELSE 0 END) as published
        FROM orders
      `).get(),
      payments: db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'VERIFIED' THEN 1 ELSE 0 END) as verified
        FROM payments
      `).get(),
      revenue: db.prepare(`
        SELECT 
          SUM(amount_paise) as totalPaise
        FROM payments
        WHERE status = 'VERIFIED'
      `).get(),
      templates: db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) as available,
          SUM(CASE WHEN status = 'RESERVED' THEN 1 ELSE 0 END) as reserved,
          SUM(CASE WHEN status = 'SOLD' THEN 1 ELSE 0 END) as sold
        FROM templates
      `).get()
    };
    
    const revenue = stats.revenue as any;
    const totalRevenue = revenue?.totalPaise ? revenue.totalPaise / 100 : 0;
    
    res.json({
      ...stats,
      revenue: {
        totalRupees: totalRevenue
      }
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
