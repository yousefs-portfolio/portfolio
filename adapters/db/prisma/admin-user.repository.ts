import type { Prisma, PrismaClient } from '@prisma/client';

import type { AdminUser } from '@core/domain/user';
import type { AdminUserRepository } from '@core/interfaces/repositories';

import { prisma } from './client';

type UserClient = PrismaClient | Prisma.TransactionClient;

const mapAdminUser = (record: Prisma.User): AdminUser => ({
  id: record.id,
  username: record.username,
  name: record.name,
  email: record.email,
  passwordHash: record.passwordHash,
  passwordSalt: record.passwordSalt,
  mustChangePassword: record.mustChangePassword,
  isAdmin: record.isAdmin,
});

export const createPrismaAdminUserRepository = (
  client: UserClient = prisma,
): AdminUserRepository => ({
  async findByUsername(username) {
    const user = await client.user.findUnique({
      where: { username },
    });
    return user ? mapAdminUser(user) : null;
  },
  async findById(id) {
    const user = await client.user.findUnique({ where: { id } });
    return user ? mapAdminUser(user) : null;
  },
  async updatePassword(id, input) {
    await client.user.update({
      where: { id },
      data: {
        passwordHash: input.hash,
        passwordSalt: input.salt,
        mustChangePassword: input.mustChangePassword,
      },
    });
  },
});

export const prismaAdminUserRepository = createPrismaAdminUserRepository();
