import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * JWT Utility Library
 * 
 * Handles token generation, verification, and refresh for the NEW SaaS system
 */

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '1h';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

// Type definitions
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  subscriptionTier?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Generate access token (short-lived)
 */
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY as any,
    issuer: 'wedding-saas',
    audience: 'wedding-saas-api',
  });
}

/**
 * Generate refresh token (long-lived)
 */
export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(
    { userId: payload.userId, email: payload.email },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRY as any,
      issuer: 'wedding-saas',
      audience: 'wedding-saas-api',
    }
  );
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(payload: JWTPayload): TokenPair {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  // Parse expiry time (e.g., "1h" -> 3600 seconds)
  const expiryMatch = JWT_ACCESS_EXPIRY.match(/(\d+)([smhd])/);
  let expiresIn = 3600; // default 1 hour
  
  if (expiryMatch) {
    const value = parseInt(expiryMatch[1]);
    const unit = expiryMatch[2];
    
    switch (unit) {
      case 's': expiresIn = value; break;
      case 'm': expiresIn = value * 60; break;
      case 'h': expiresIn = value * 3600; break;
      case 'd': expiresIn = value * 86400; break;
    }
  }
  
  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: 'wedding-saas',
      audience: 'wedding-saas-api',
    }) as JWTPayload;
    
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('ACCESS_TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('INVALID_ACCESS_TOKEN');
    }
    throw new Error('TOKEN_VERIFICATION_FAILED');
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): { userId: string; email: string } {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'wedding-saas',
      audience: 'wedding-saas-api',
    }) as { userId: string; email: string };
    
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('REFRESH_TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }
    throw new Error('TOKEN_VERIFICATION_FAILED');
  }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): any {
  return jwt.decode(token);
}

/**
 * Generate secure random token (for guest invitation links)
 * Returns 32-byte hex string (64 characters)
 */
export function generateGuestToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash guest token for storage (SHA-256)
 */
export function hashGuestToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate email verification token
 */
export function generateEmailVerificationToken(userId: string, email: string): string {
  const payload = { userId, email, purpose: 'email_verification' };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: (process.env.EMAIL_VERIFICATION_EXPIRY || '24h') as any,
    issuer: 'wedding-saas',
  });
}

/**
 * Verify email verification token
 */
export function verifyEmailVerificationToken(token: string): { userId: string; email: string } {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: 'wedding-saas',
    }) as any;
    
    if (payload.purpose !== 'email_verification') {
      throw new Error('INVALID_TOKEN_PURPOSE');
    }
    
    return { userId: payload.userId, email: payload.email };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('EMAIL_VERIFICATION_TOKEN_EXPIRED');
    }
    throw new Error('INVALID_EMAIL_VERIFICATION_TOKEN');
  }
}

/**
 * Generate password reset token
 */
export function generatePasswordResetToken(userId: string, email: string): string {
  const payload = { userId, email, purpose: 'password_reset' };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: (process.env.PASSWORD_RESET_EXPIRY || '1h') as any,
    issuer: 'wedding-saas',
  });
}

/**
 * Verify password reset token
 */
export function verifyPasswordResetToken(token: string): { userId: string; email: string } {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: 'wedding-saas',
    }) as any;
    
    if (payload.purpose !== 'password_reset') {
      throw new Error('INVALID_TOKEN_PURPOSE');
    }
    
    return { userId: payload.userId, email: payload.email };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('PASSWORD_RESET_TOKEN_EXPIRED');
    }
    throw new Error('INVALID_PASSWORD_RESET_TOKEN');
  }
}

/**
 * Check if token is expired without throwing
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
}

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  generateGuestToken,
  hashGuestToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  isTokenExpired,
};
