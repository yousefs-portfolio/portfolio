import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

import type { PasswordHasher } from '@core/interfaces/crypto';

const SALT_BYTES = 16;
const KEY_LENGTH = 64;

export class NodePasswordHasher implements PasswordHasher {
  async hash(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const resolvedSalt = salt ?? randomBytes(SALT_BYTES).toString('hex');
    const saltBuffer = Buffer.from(resolvedSalt, 'hex');
    const derived = scryptSync(password, saltBuffer, KEY_LENGTH);
    return {
      hash: derived.toString('hex'),
      salt: resolvedSalt,
    };
  }

  async verify(password: string, hash: string, salt: string): Promise<boolean> {
    const { hash: compareHash } = await this.hash(password, salt);
    const hashBuffer = Buffer.from(hash, 'hex');
    const compareBuffer = Buffer.from(compareHash, 'hex');
    if (hashBuffer.length !== compareBuffer.length) {
      return false;
    }
    return timingSafeEqual(hashBuffer, compareBuffer);
  }
}

export const passwordHasher = new NodePasswordHasher();
