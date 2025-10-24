export type UserId = string;

export interface AdminUser {
  id: UserId;
  username: string;
  name?: string | null;
  email?: string | null;
  passwordHash: string;
  passwordSalt: string;
  mustChangePassword: boolean;
  isAdmin: boolean;
}
