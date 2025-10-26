import {scryptSync, timingSafeEqual} from 'node:crypto';
import bcrypt from 'bcryptjs';

import type {PasswordHasher} from '@core/interfaces/crypto';

const LEGACY_SALT_BYTES = 16;
const LEGACY_KEY_LENGTH = 64;
const BCRYPT_ROUNDS = 12;

const isLegacySalt = (salt: string): boolean => /^[0-9a-f]{32}$/i.test(salt);
const isLegacyHash = (hash: string): boolean => /^[0-9a-f]{128}$/i.test(hash);

export class NodePasswordHasher implements PasswordHasher {
    async hash(
        password: string,
        salt?: string,
    ): Promise<{ hash: string; salt: string }> {
        if (salt && isLegacySalt(salt)) {
            const saltBuffer = Buffer.from(salt, 'hex');
            const derived = scryptSync(password, saltBuffer, LEGACY_KEY_LENGTH);
            return {
                hash: derived.toString('hex'),
                salt,
            };
        }

        const resolvedSalt = salt && !isLegacySalt(salt)
            ? salt
            : await bcrypt.genSalt(BCRYPT_ROUNDS);
        const hash = await bcrypt.hash(password, resolvedSalt);
        return {hash, salt: resolvedSalt};
    }

    async verify(password: string, hash: string, salt: string): Promise<boolean> {
        if (isLegacySalt(salt) && isLegacyHash(hash)) {
            const legacySaltBuffer = Buffer.from(salt, 'hex');
            const derived = scryptSync(password, legacySaltBuffer, LEGACY_KEY_LENGTH);
            const hashBuffer = Buffer.from(hash, 'hex');
            if (hashBuffer.length !== derived.length) {
                return false;
            }
            return timingSafeEqual(hashBuffer, derived);
        }

        return bcrypt.compare(password, hash);
    }
}

export const passwordHasher = new NodePasswordHasher();
