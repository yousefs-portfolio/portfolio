import type { AdminUserRepository, ContactRepository } from './repositories';

export interface TransactionalRepositories {
  contactRepository: ContactRepository;
  adminUserRepository: AdminUserRepository;
}

export type Tx = <T>(operation: (repos: TransactionalRepositories) => Promise<T>) => Promise<T>;
