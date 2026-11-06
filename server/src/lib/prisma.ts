import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * 
 * Ensures single instance of PrismaClient across the application
 * In development, prevents hot-reload from creating multiple instances
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown - disconnect on process termination
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
