import { describe, expect, it, vi } from 'vitest';

import type { AdminUser } from '@core/domain/user';
import { UseCaseError } from '@core/lib/errors';
import { changeAdminPassword } from '@core/use-cases/change-admin-password';

const adminUser: AdminUser = {
  id: 'admin-1',
  username: 'admin',
  name: 'Admin',
  email: 'admin@example.com',
  passwordHash: 'hash',
  passwordSalt: 'salt',
  mustChangePassword: true,
  isAdmin: true,
};

describe('changeAdminPassword use-case', () => {
  it('rejects weak passwords', async () => {
    await expect(
      changeAdminPassword(
        {
          userId: adminUser.id,
          newPassword: 'short',
        },
        {
          adminUserRepository: {
            findById: vi.fn(),
            findByUsername: vi.fn(),
            updatePassword: vi.fn(),
          },
          passwordHasher: {
            hash: vi.fn(),
            verify: vi.fn(),
          },
        },
      ),
    ).rejects.toBeInstanceOf(UseCaseError);
  });

  it('hashes password and updates repository', async () => {
    const hashMock = vi.fn().mockResolvedValue({ hash: 'new-hash', salt: 'new-salt' });
    const updateMock = vi.fn().mockResolvedValue(undefined);
    const findByIdMock = vi.fn().mockResolvedValue(adminUser);

    await changeAdminPassword(
      {
        userId: adminUser.id,
        newPassword: 'new-password',
      },
      {
        adminUserRepository: {
          findById: findByIdMock,
          findByUsername: vi.fn(),
          updatePassword: updateMock,
        },
        passwordHasher: {
          hash: hashMock,
          verify: vi.fn(),
        },
      },
    );

    expect(findByIdMock).toHaveBeenCalledWith(adminUser.id);
    expect(hashMock).toHaveBeenCalledWith('new-password');
    expect(updateMock).toHaveBeenCalledWith(adminUser.id, {
      hash: 'new-hash',
      salt: 'new-salt',
      mustChangePassword: false,
    });
  });
});
