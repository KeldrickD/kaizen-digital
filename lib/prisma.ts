import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
  });

// Handle connection errors
prisma.$connect()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;