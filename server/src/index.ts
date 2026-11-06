import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { initializeDatabase, seedDatabase } from './db';
import { getSiteBySlug, generateOGTags, renderHTMLWithOGTags, renderAppHTML } from './services/render';
import { OrderService } from './services/orders';

// Import routes
import publicRoutes from './routes/public';
import editRoutes from './routes/edit';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'localhost';
const UPLOADS_PATH = process.env.UPLOADS_PATH || path.join(__dirname, '../data/uploads');

// Initialize database
try {
  initializeDatabase();
  seedDatabase();
  console.log('✓ Database initialized');
} catch (error) {
  console.error('Database initialization failed:', error);
  process.exit(1);
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for now, configure properly in production
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 orders per hour
  message: 'Too many orders from this IP, please try again later.'
});

// Serve uploads
app.use('/uploads', express.static(UPLOADS_PATH, {
  maxAge: '365d',
  immutable: true
}));

// Health check
app.get('/healthz', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes with rate limiting
app.use('/api', apiLimiter, publicRoutes);
app.post('/api/orders', orderLimiter, publicRoutes);
app.use('/api/edit', editRoutes);
app.use('/admin', adminRoutes);

// Static assets from web build (will be created by React)
const WEB_BUILD_PATH = path.join(__dirname, '../../web/dist');

if (fs.existsSync(WEB_BUILD_PATH)) {
  app.use('/assets', express.static(path.join(WEB_BUILD_PATH, 'assets'), {
    maxAge: '365d',
    immutable: true
  }));
}

// Subdomain routing and site rendering
app.get('*', async (req: Request, res: Response) => {
  try {
    const host = req.hostname;
    const subdomain = extractSubdomain(host, BASE_DOMAIN);
    
    // Load HTML shell
    const htmlPath = path.join(WEB_BUILD_PATH, 'index.html');
    
    if (!fs.existsSync(htmlPath)) {
      return res.status(503).send('Service unavailable - frontend not built');
    }
    
    const htmlTemplate = fs.readFileSync(htmlPath, 'utf-8');
    
    // Check if this is a customer subdomain
    if (subdomain && subdomain !== 'www') {
      // Render published site
      const site = getSiteBySlug(subdomain);
      
      if (!site) {
        return res.status(404).send('Site not found');
      }
      
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const ogTags = generateOGTags(site, baseUrl);
      
      const html = renderHTMLWithOGTags(htmlTemplate, ogTags, {
        slug: site.slug,
        templateId: site.templateId,
        data: site.data
      });
      
      return res.send(html);
    }
    
    // Main domain - serve SPA (landing, editor, admin)
    const html = renderAppHTML(htmlTemplate);
    res.send(html);
    
  } catch (error) {
    console.error('Error rendering page:', error);
    res.status(500).send('Internal server error');
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Periodic tasks
setInterval(() => {
  try {
    const expired = OrderService.expireReservations();
    if (expired > 0) {
      console.log(`Expired ${expired} reservations`);
    }
  } catch (error) {
    console.error('Error expiring reservations:', error);
  }
}, 60 * 60 * 1000); // Every hour

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Base domain: ${BASE_DOMAIN}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n🚀 Wedding Invitation Platform is ready!`);
});

/**
 * Extract subdomain from hostname
 */
function extractSubdomain(hostname: string, baseDomain: string): string | null {
  // Remove port if present
  const host = hostname.split(':')[0];
  
  // localhost or IP address - no subdomain
  if (host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    return null;
  }
  
  // Remove base domain to get subdomain
  const parts = host.split('.');
  const baseParts = baseDomain.split('.');
  
  if (parts.length <= baseParts.length) {
    return null;
  }
  
  // Return first part as subdomain
  return parts[0];
}

export default app;
