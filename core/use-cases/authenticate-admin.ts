import type { AdminUserRepository } from '../interfaces/repositories';
import type { PasswordHasher } from '../interfaces/crypto';

export interface AuthenticateAdminInput {
  username: string;
  password: string;
}

export interface AuthenticatedAdmin {
  id: string;
  username: string;
  name?: string | null;
  email?: string | null;
  isAdmin: boolean;
  mustChangePassword: boolean;
}

export const authenticateAdmin = async (
  input: AuthenticateAdminInput,
  deps: {
    adminUserRepository: AdminUserRepository;
    passwordHasher: PasswordHasher;
  },
): Promise<AuthenticatedAdmin | null> => {
  const username = input.username.trim();
  const password = input.password;

  if (!username || !password) {
    return null;
  }

  const user = await deps.adminUserRepository.findByUsername(username);
  if (!user || !user.isAdmin) {
    return null;
  }

  const isValid = await deps.passwordHasher.verify(
    password,
    user.passwordHash,
    user.passwordSalt,
  );

  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    name: user.name ?? null,
    email: user.email ?? null,
    isAdmin: user.isAdmin,
    mustChangePassword: user.mustChangePassword,
  };
};
