import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { prisma } from './lib/prisma';

// Import routes
import authRoutes from './routes/auth';
import invitationRoutes from './routes/invitations';
import adminRoutes from './routes/admin';
import publicInvitationRoutes from './routes/publicInvitations';
// TODO: Import other routes as we build them
// import guestRoutes from './routes/guests';
// import themeRoutes from './routes/themes';

const app = express();
// Enable trust proxy for Vercel / reverse proxies to support rate limiting
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Parse configured origins or default to localhost + vercel
const envOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true; // Server-to-server or non-browser requests
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) return true;
  if (origin.endsWith('.vercel.app') || origin === 'https://vercel.app') return true;
  if (envOrigins.includes(origin)) return true;
  return false;
};

// ============================================================================
// DATABASE CONNECTION TEST
// ============================================================================

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error: any) {
    console.warn('⚠️ Initial database connection check note:', error?.message || error);
    // Do not crash server, allow Prisma to connect on first request
  }
}

if (!process.env.VERCEL && NODE_ENV !== 'production') {
  testDatabaseConnection();
}

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
  })
);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ============================================================================
// BODY PARSING
// ============================================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ============================================================================
// RATE LIMITING
// ============================================================================

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// ============================================================================
// FILE UPLOADS
// ============================================================================

const UPLOADS_PATH = process.env.UPLOAD_DIR || (process.env.VERCEL ? '/tmp/uploads' : path.join(process.cwd(), 'uploads'));

// Create uploads directory if it doesn't exist
try {
  if (!fs.existsSync(UPLOADS_PATH)) {
    fs.mkdirSync(UPLOADS_PATH, { recursive: true });
    console.log('✅ Uploads directory created');
  }
} catch {
  // Read-only serverless environment
}

// Serve uploads
app.use(
  '/uploads',
  express.static(UPLOADS_PATH, {
    maxAge: NODE_ENV === 'production' ? '365d' : 0,
    immutable: NODE_ENV === 'production',
  })
);

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/healthz', async (req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: 'disconnected',
    });
  }
});

// ============================================================================
// API ROUTES
// ============================================================================

// Authentication routes (with strict rate limiting)
app.use('/api/auth', authLimiter, authRoutes);

// Host invitation routes (with general rate limiting)
app.use('/api/host/invitations', apiLimiter, invitationRoutes);

// Admin routes (requires auth and admin role)
app.use('/api/admin', apiLimiter, adminRoutes);

// Public invitation routes (accessible to guests without auth)
app.use('/api/public', apiLimiter, publicInvitationRoutes);

// TODO: Add other routes as we build them
// app.use('/api/guests', apiLimiter, guestRoutes);
// app.use('/api/themes', apiLimiter, themeRoutes);

// Catch-all for undefined API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `API endpoint ${req.method} ${req.path} not found`,
  });
});

// ============================================================================
// FRONTEND SERVING (SPA)
// ============================================================================

const WEB_BUILD_PATH = path.join(__dirname, '../../web/dist');

// Serve static assets
if (fs.existsSync(WEB_BUILD_PATH)) {
  app.use(
    '/assets',
    express.static(path.join(WEB_BUILD_PATH, 'assets'), {
      maxAge: NODE_ENV === 'production' ? '365d' : 0,
      immutable: NODE_ENV === 'production',
    })
  );

  // Serve index.html for all non-API routes (SPA)
  app.get('*', (req: Request, res: Response) => {
    const htmlPath = path.join(WEB_BUILD_PATH, 'index.html');
    
    if (!fs.existsSync(htmlPath)) {
      return res.status(503).send('Service unavailable - frontend not built');
    }
    
    res.sendFile(htmlPath);
  });
} else {
  // Frontend not built - show development message
  app.get('*', (req: Request, res: Response) => {
    res.status(503).send(`
      <html>
        <head><title>Development Mode</title></head>
        <body style="font-family: system-ui; padding: 2rem; max-width: 600px; margin: 0 auto;">
          <h1>🚧 Development Mode</h1>
          <p>The frontend has not been built yet.</p>
          <p>The backend API is running at <code>http://localhost:${PORT}</code></p>
          <h2>Available Endpoints:</h2>
          <ul>
            <li><code>GET /healthz</code> - Health check</li>
            <li><code>POST /api/auth/signup</code> - Create account</li>
            <li><code>POST /api/auth/login</code> - Login</li>
            <li><code>POST /api/auth/refresh</code> - Refresh token</li>
            <li><code>POST /api/auth/logout</code> - Logout</li>
            <li><code>POST /api/auth/verify-email</code> - Verify email</li>
            <li><code>POST /api/auth/forgot-password</code> - Request password reset</li>
            <li><code>POST /api/auth/reset-password</code> - Reset password</li>
          </ul>
          <p>Start the frontend dev server:</p>
          <pre>cd web && npm run dev</pre>
        </body>
      </html>
    `);
  });
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource was not found',
    path: req.path,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Unhandled error:', err);

  // Ensure CORS headers are sent on error responses so client receives actual error details
  const origin = req.headers.origin;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Prisma errors
  if (err.constructor.name.includes('Prisma')) {
    return res.status(500).json({
      error: 'Database error',
      message: NODE_ENV === 'development' ? err.message : 'A database error occurred',
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
  });
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 Wedding Invitation SaaS Platform');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Server:      http://localhost:${PORT}`);
  console.log(`✅ Environment: ${NODE_ENV}`);
  console.log(`✅ CORS:        ${envOrigins.join(', ') || 'localhost + *.vercel.app'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 API Endpoints:');
  console.log('   POST /api/auth/signup          - Create account');
  console.log('   POST /api/auth/login           - Login');
  console.log('   POST /api/auth/refresh         - Refresh token');
  console.log('   POST /api/auth/logout          - Logout');
  console.log('   POST /api/auth/verify-email    - Verify email');
  console.log('   POST /api/auth/forgot-password - Request password reset');
  console.log('   POST /api/auth/reset-password  - Reset password');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});

export default app;