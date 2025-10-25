import type { PasswordHasher } from '../interfaces/crypto';
import type { AdminUserRepository } from '../interfaces/repositories';
import type { Tx } from '../interfaces/tx';
import { UseCaseError } from '../lib/errors';

export interface ChangeAdminPasswordInput {
  userId: string;
  newPassword: string;
}

export const changeAdminPassword = async (
  input: ChangeAdminPasswordInput,
  deps: {
    adminUserRepository: AdminUserRepository;
    passwordHasher: PasswordHasher;
    tx?: Tx;
  },
): Promise<void> => {
  const newPassword = input.newPassword.trim();

  if (newPassword.length < 8) {
    throw new UseCaseError(
      'BAD_REQUEST',
      'Password must be at least 8 characters long',
    );
  }

    const hashed = await deps.passwordHasher.hash(newPassword);

  const update = async (repo: AdminUserRepository) => {
    const user = await repo.findById(input.userId);
    if (!user || !user.isAdmin) {
      throw new UseCaseError('UNAUTHORIZED', 'Only admins may change password');
    }

    await repo.updatePassword(user.id, {
        hash: hashed.hash,
        salt: hashed.salt,
      mustChangePassword: false,
    });
  };

  if (deps.tx) {
    await deps.tx(({ adminUserRepository }) => update(adminUserRepository));
    return;
  }

  await update(deps.adminUserRepository);
};
