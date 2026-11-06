import { randomBytes, createHash, timingSafeEqual } from 'crypto';

const TOKEN_LENGTH = 32; // 32 bytes = 256 bits

/**
 * Generate a cryptographically secure random token
 * Returns a URL-safe base64 string
 */
export function generateToken(): string {
  return randomBytes(TOKEN_LENGTH)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Hash a token using SHA-256
 * Store this hash in the database, never the raw token
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Verify a token against its stored hash using constant-time comparison
 */
export function verifyToken(token: string, hash: string): boolean {
  const tokenHash = hashToken(token);
  
  try {
    const tokenBuffer = Buffer.from(tokenHash, 'hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    
    if (tokenBuffer.length !== hashBuffer.length) {
      return false;
    }
    
    return timingSafeEqual(tokenBuffer, hashBuffer);
  } catch {
    return false;
  }
}

/**
 * Generate a session ID for admin sessions
 */
export function generateSessionId(): string {
  return randomBytes(24).toString('hex');
}
