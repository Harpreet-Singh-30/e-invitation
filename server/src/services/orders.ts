import db from '../db';
import { generateToken, hashToken } from '../lib/token';

export type OrderState = 'DRAFT' | 'PREBOOKED' | 'PURCHASED' | 'PUBLISHED' | 'EXPIRED' | 'REFUNDED';
export type TemplateStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';

interface CreateOrderParams {
  customerId: number;
  templateId: string;
  orderType: 'PREBOOK' | 'FULL';
}

interface OrderWithTemplate {
  id: number;
  customerId: number;
  templateId: string;
  state: OrderState;
  totalAmountPaise: number;
  paidAmountPaise: number;
  editToken?: string;
  reservationExpiresAt?: string;
  templateName: string;
  templatePrice: number;
}

const RESERVATION_DAYS = 7;

export class OrderService {
  /**
   * Create a new order (DRAFT state)
   */
  static createOrder(params: CreateOrderParams): { orderId: number; paymentInstructions: any } {
    const { customerId, templateId, orderType } = params;
    
    return db.transaction(() => {
      // Check template availability
      const template = db.prepare(`
        SELECT id, name, price_paise, prebook_price_paise, status, owner_order_id
        FROM templates WHERE id = ?
      `).get(templateId) as any;
      
      if (!template) {
        throw new Error('Template not found');
      }
      
      if (template.status !== 'AVAILABLE') {
        throw new Error('Template is not available');
      }
      
      // Check for existing active order for this template
      const existingOrder = db.prepare(`
        SELECT id FROM orders 
        WHERE template_id = ? 
        AND state IN ('DRAFT', 'PREBOOKED', 'PURCHASED', 'PUBLISHED')
      `).get(templateId);
      
      if (existingOrder) {
        throw new Error('Template is already reserved or sold');
      }
      
      const amount = orderType === 'PREBOOK' ? template.prebook_price_paise : template.price_paise;
      
      // Create order
      const result = db.prepare(`
        INSERT INTO orders (customer_id, template_id, state, total_amount_paise, paid_amount_paise)
        VALUES (?, ?, 'DRAFT', ?, 0)
      `).run(customerId, templateId, amount);
      
      const orderId = result.lastInsertRowid as number;
      
      // Payment instructions
      const paymentInstructions = {
        orderId,
        amount: amount / 100, // Convert paise to rupees
        amountPaise: amount,
        type: orderType,
        upiId: process.env.UPI_ID || 'placeholder@upi',
        qrCode: '/api/payment/qr', // TODO: Generate QR
        instructions: orderType === 'PREBOOK' 
          ? 'Pay Rs 2,000 to reserve this template for 7 days'
          : 'Pay Rs 3,000 to purchase this template'
      };
      
      return { orderId, paymentInstructions };
    })();
  }
  
  /**
   * Mark payment as verified and advance order state
   */
  static verifyPayment(paymentId: number, adminUserId: number): void {
    db.transaction(() => {
      // Get payment details
      const payment = db.prepare(`
        SELECT p.*, o.state, o.total_amount_paise, o.paid_amount_paise, o.template_id
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        WHERE p.id = ?
      `).get(paymentId) as any;
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      if (payment.status === 'VERIFIED') {
        throw new Error('Payment already verified');
      }
      
      const now = new Date().toISOString();
      
      // Update payment status
      db.prepare(`
        UPDATE payments 
        SET status = 'VERIFIED', verified_by = ?, verified_at = ?, updated_at = ?
        WHERE id = ?
      `).run(adminUserId, now, now, paymentId);
      
      // Calculate new paid amount
      const newPaidAmount = payment.paid_amount_paise + payment.amount_paise;
      
      // Determine new order state
      let newState: OrderState = payment.state;
      let reservationExpiry: string | null = null;
      let templateStatus: TemplateStatus = 'AVAILABLE';
      
      if (payment.payment_type === 'PREBOOK' || payment.payment_type === 'BALANCE') {
        if (newPaidAmount >= payment.total_amount_paise) {
          newState = 'PURCHASED';
          templateStatus = 'SOLD';
        } else {
          newState = 'PREBOOKED';
          templateStatus = 'RESERVED';
          // Set reservation expiry
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + RESERVATION_DAYS);
          reservationExpiry = expiryDate.toISOString();
        }
      } else if (payment.payment_type === 'FULL') {
        newState = 'PURCHASED';
        templateStatus = 'SOLD';
      }
      
      // Generate edit token if moving to PREBOOKED or PURCHASED
      let editToken: string | null = null;
      let editTokenHash: string | null = null;
      
      if ((newState === 'PREBOOKED' || newState === 'PURCHASED') && payment.state === 'DRAFT') {
        editToken = generateToken();
        editTokenHash = hashToken(editToken);
      }
      
      // Update order
      const updateFields: string[] = ['state = ?', 'paid_amount_paise = ?', 'updated_at = ?'];
      const updateValues: any[] = [newState, newPaidAmount, now];
      
      if (reservationExpiry) {
        updateFields.push('reservation_expires_at = ?');
        updateValues.push(reservationExpiry);
      }
      
      if (editTokenHash) {
        updateFields.push('edit_token_hash = ?');
        updateValues.push(editTokenHash);
      }
      
      updateValues.push(payment.order_id);
      
      db.prepare(`
        UPDATE orders SET ${updateFields.join(', ')}
        WHERE id = ?
      `).run(...updateValues);
      
      // Update template status
      db.prepare(`
        UPDATE templates 
        SET status = ?, owner_order_id = ?, updated_at = ?
        WHERE id = ?
      `).run(templateStatus, payment.order_id, now, payment.template_id);
      
      // Log action
      db.prepare(`
        INSERT INTO audit_log (admin_user_id, action, entity_type, entity_id, details)
        VALUES (?, 'VERIFY_PAYMENT', 'payment', ?, ?)
      `).run(adminUserId, paymentId, JSON.stringify({ 
        orderId: payment.order_id,
        newState,
        editToken 
      }));
      
      // TODO: Send email with edit token if generated
      if (editToken) {
        console.log(`Edit token for order ${payment.order_id}: ${editToken}`);
        console.log(`Edit URL: ${process.env.BASE_URL}/edit/${editToken}`);
      }
    })();
  }
  
  /**
   * Get order by ID with template details
   */
  static getOrderById(orderId: number): OrderWithTemplate | null {
    const order = db.prepare(`
      SELECT 
        o.id, o.customer_id as customerId, o.template_id as templateId,
        o.state, o.total_amount_paise as totalAmountPaise, 
        o.paid_amount_paise as paidAmountPaise,
        o.reservation_expires_at as reservationExpiresAt,
        t.name as templateName, t.price_paise as templatePrice
      FROM orders o
      JOIN templates t ON o.template_id = t.id
      WHERE o.id = ?
    `).get(orderId) as OrderWithTemplate | undefined;
    
    return order || null;
  }
  
  /**
   * Check and expire reservations
   */
  static expireReservations(): number {
    const now = new Date().toISOString();
    
    return db.transaction(() => {
      // Find expired reservations
      const expiredOrders = db.prepare(`
        SELECT id, template_id FROM orders
        WHERE state = 'PREBOOKED'
        AND reservation_expires_at < ?
      `).all(now) as any[];
      
      if (expiredOrders.length === 0) {
        return 0;
      }
      
      // Update order states
      const orderIds = expiredOrders.map(o => o.id);
      const placeholders = orderIds.map(() => '?').join(',');
      
      db.prepare(`
        UPDATE orders
        SET state = 'EXPIRED', updated_at = ?
        WHERE id IN (${placeholders})
      `).run(now, ...orderIds);
      
      // Release templates
      const templateIds = expiredOrders.map(o => o.template_id);
      const templatePlaceholders = templateIds.map(() => '?').join(',');
      
      db.prepare(`
        UPDATE templates
        SET status = 'AVAILABLE', owner_order_id = NULL, updated_at = ?
        WHERE id IN (${templatePlaceholders})
      `).run(now, ...templateIds);
      
      return expiredOrders.length;
    })();
  }
}

export default OrderService;
