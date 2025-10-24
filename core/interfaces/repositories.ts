import type { Contact, NewContact } from '../domain/contact';
import type { AdminUser } from '../domain/user';

export interface ContactRepository {
  create(input: NewContact): Promise<Contact>;
  list(): Promise<Contact[]>;
}

export interface AdminUserRepository {
  findByUsername(username: string): Promise<AdminUser | null>;
  findById(id: string): Promise<AdminUser | null>;
  updatePassword(
    id: string,
    input: { hash: string; salt: string; mustChangePassword: boolean },
  ): Promise<void>;
}
