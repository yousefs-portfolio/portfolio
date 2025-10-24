export interface PasswordHasher {
  hash(password: string, salt?: string): Promise<{ hash: string; salt: string }>;
  verify(password: string, hash: string, salt: string): Promise<boolean>;
}
