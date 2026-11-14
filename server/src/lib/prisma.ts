import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * 
 * Ensures single instance of PrismaClient across the application
 * In development, prevents hot-reload from creating multiple instances
 */

const globalForPrisma = (globalThis as any) as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });

// Retain singleton across serverless invocations to prevent connection pool exhaustion
globalForPrisma.prisma = prisma;

/**
 * Graceful shutdown - disconnect on process termination
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
