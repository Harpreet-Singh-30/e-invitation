import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyEmailVerificationToken,
  verifyPasswordResetToken,
} from '../lib/jwt';

const router = Router();

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate request body against a Zod schema
 */
function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Format user data for API response (exclude sensitive fields)
 */
function formatUserResponse(user: any) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    subscriptionTier: user.subscriptionTier,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

// ============================================================================
// ROUTE: POST /api/auth/signup
// Register a new user account
// ============================================================================

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { email, password, name } = validateRequest(signupSchema, req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'An account with this email already exists.',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user (email verification disabled in dev mode)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        role: 'host', // Default role
        subscriptionTier: 'free', // Default tier
        emailVerified: process.env.NODE_ENV === 'development' ? true : false, // Auto-verify in dev
      },
    });

    // TODO: Send verification email (implement email service)
    // await sendVerificationEmail(user.email, verificationToken);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token to database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.status(201).json({
      message: process.env.NODE_ENV === 'development' 
        ? 'Account created successfully (email auto-verified in dev mode)'
        : 'Account created successfully. Please verify your email.',
      user: formatUserResponse(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    next(error);
  }
});

// ============================================================================
// ROUTE: POST /api/auth/login
// Authenticate user and return tokens
// ============================================================================

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { email, password } = validateRequest(loginSchema, req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password.',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password.',
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        lastLoginAt: new Date(),
      },
    });

    res.json({
      message: 'Login successful',
      user: formatUserResponse(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    next(error);
  }
});

// ============================================================================
// ROUTE: POST /api/auth/refresh
// Refresh access token using refresh token
// ============================================================================

router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { refreshToken } = validateRequest(refreshSchema, req.body);

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Refresh token is invalid or expired.',
      });
    }

    // Find user and verify stored refresh token
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Refresh token is invalid or has been revoked.',
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    });

    res.json({
      message: 'Token refreshed successfully',
      accessToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    next(error);
  }
});

// ============================================================================
// ROUTE: POST /api/auth/logout
// Logout user by invalidating refresh token
// ============================================================================

router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get user ID from access token (if available)
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No access token provided.',
      });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (!payload) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Access token is invalid or expired.',
      });
    }

    // Invalidate refresh token
    await prisma.user.update({
      where: { id: payload.userId },
      data: { refreshToken: null },
    });

    res.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// ROUTE: POST /api/auth/verify-email
// Verify user email address
// ============================================================================

router.post('/verify-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { token } = validateRequest(verifyEmailSchema, req.body);

    // Verify token
    const payload = verifyEmailVerificationToken(token);

    if (!payload) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'Verification token is invalid or expired.',
      });
    }

    // Find user by email from token
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'User not found.',
      });
    }

    // Mark email as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
      },
    });

    res.json({
      message: 'Email verified successfully',
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    next(error);
  }
});

// ============================================================================
// ROUTE: POST /api/auth/forgot-password
// Send password reset email
// ============================================================================

router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { email } = validateRequest(forgotPasswordSchema, req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken(user.email);

    // TODO: Save reset token to separate table or cache (Redis)
    // For now, just generate it - in production you'd store the hash

    // TODO: Send password reset email
    // await sendPasswordResetEmail(user.email, resetToken);

    res.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
      // Include reset token in dev mode for testing
      ...(process.env.NODE_ENV === 'development' && {
        _dev_resetToken: resetToken,
        _dev_userId: user.id,
      }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    next(error);
  }
});

// ============================================================================
// ROUTE: POST /api/auth/reset-password
// Reset password using reset token
// ============================================================================

router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { token, password } = validateRequest(resetPasswordSchema, req.body);

    // Verify token
    const payload = verifyPasswordResetToken(token);

    if (!payload) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'Password reset token is invalid or expired.',
      });
    }

    // Find user by email from token
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'User not found.',
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update password and clear refresh token (invalidate all sessions)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        refreshToken: null, // Invalidate all sessions
      },
    });

    res.json({
      message: 'Password reset successfully. Please log in with your new password.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    next(error);
  }
});

// ============================================================================
// EXPORT
// ============================================================================

export default router;