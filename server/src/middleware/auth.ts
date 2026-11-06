import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JWTPayload } from '../lib/jwt';

/**
 * Authentication Middleware
 * 
 * Protects routes by verifying JWT access tokens
 */

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware: Require valid JWT access token
 * 
 * Usage:
 *   router.get('/protected', requireAuth, handler);
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'No authorization token provided',
      });
    }
    
    // Check format: "Bearer <token>"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'INVALID_TOKEN_FORMAT',
        message: 'Authorization header must be in format: Bearer <token>',
      });
    }
    
    const token = parts[1];
    
    // Verify token
    try {
      const payload = verifyAccessToken(token);
      
      // Attach user info to request
      req.user = payload;
      
      next();
    } catch (error: any) {
      if (error.message === 'ACCESS_TOKEN_EXPIRED') {
        return res.status(401).json({
          error: 'TOKEN_EXPIRED',
          message: 'Access token has expired. Please refresh your token.',
        });
      }
      
      if (error.message === 'INVALID_ACCESS_TOKEN') {
        return res.status(401).json({
          error: 'INVALID_TOKEN',
          message: 'Invalid access token',
        });
      }
      
      return res.status(401).json({
        error: 'AUTHENTICATION_FAILED',
        message: 'Token verification failed',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Authentication error',
    });
  }
}

/**
 * Middleware: Require specific role(s)
 * 
 * Usage:
 *   router.get('/admin', requireAuth, requireRole(['admin']), handler);
 *   router.get('/pro', requireAuth, requireRole(['admin', 'pro']), handler);
 */
export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'User not authenticated',
      });
    }
    
    const userRole = req.user.role;
    
    // Admin bypasses all role checks
    if (userRole === 'admin') {
      return next();
    }
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
    }
    
    next();
  };
}

/**
 * Middleware: Require specific subscription tier
 * 
 * Usage:
 *   router.post('/premium-feature', requireAuth, requireSubscription(['pro', 'business']), handler);
 */
export function requireSubscription(allowedTiers: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'User not authenticated',
      });
    }
    
    // Admin bypasses subscription checks
    if (req.user.role === 'admin') {
      return next();
    }
    
    const userTier = req.user.subscriptionTier || 'free';
    
    if (!allowedTiers.includes(userTier)) {
      return res.status(403).json({
        error: 'SUBSCRIPTION_REQUIRED',
        message: `This feature requires ${allowedTiers.join(' or ')} subscription`,
        upgradeTo: allowedTiers[0],
      });
    }
    
    next();
  };
}

/**
 * Middleware: Optional authentication
 * Attaches user if token is valid, but doesn't require it
 * 
 * Usage:
 *   router.get('/public-but-personalized', optionalAuth, handler);
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next();
  }
  
  const parts = authHeader.split(' ');
  
  if (parts.length === 2 && parts[0] === 'Bearer') {
    try {
      const payload = verifyAccessToken(parts[1]);
      req.user = payload;
    } catch {
      // Invalid/expired token - just continue without user
    }
  }
  
  next();
}

export default {
  requireAuth,
  requireRole,
  requireSubscription,
  optionalAuth,
};
