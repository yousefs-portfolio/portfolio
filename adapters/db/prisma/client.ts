import { PrismaClient } from '@prisma/client';

import { env } from '@config/env';

type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalWithPrisma;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
