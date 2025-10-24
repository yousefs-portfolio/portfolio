import type { Tx } from '@core/interfaces/tx';

import { createPrismaAdminUserRepository } from './admin-user.repository';
import { createPrismaContactRepository } from './contact.repository';
import { prisma } from './client';

export const prismaTx: Tx = async (operation) =>
  prisma.$transaction((tx) =>
    operation({
      contactRepository: createPrismaContactRepository(tx),
      adminUserRepository: createPrismaAdminUserRepository(tx),
    }),
  );
