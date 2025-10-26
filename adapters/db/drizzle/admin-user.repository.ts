import {eq} from 'drizzle-orm';

import type {AdminUser} from '@core/domain/user';
import type {AdminUserRepository} from '@core/interfaces/repositories';

import type {DrizzleDb} from '@/app/lib/db';
import {db} from '@/app/lib/db';
import * as schema from '@/drizzle/schema';

const {users} = schema;

type UserRecord = typeof users.$inferSelect;
type TransactionClient = Parameters<Parameters<DrizzleDb['transaction']>[0]>[0];
type UserClient = DrizzleDb | TransactionClient;

const mapAdminUser = (record: UserRecord): AdminUser => ({
    id: record.id,
    username: record.username,
    name: record.name ?? null,
    email: record.email ?? null,
    passwordHash: record.passwordHash,
    passwordSalt: record.passwordSalt,
    mustChangePassword: Boolean(record.mustChangePassword),
    isAdmin: Boolean(record.isAdmin),
});

export const createDrizzleAdminUserRepository = (
    client: UserClient = db,
): AdminUserRepository => ({
    async findByUsername(username) {
        const [user] = await client
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

        return user ? mapAdminUser(user) : null;
    },
    async findById(id) {
        const [user] = await client.select().from(users).where(eq(users.id, id)).limit(1);
        return user ? mapAdminUser(user) : null;
    },
    async updatePassword(id, input) {
        await client
            .update(users)
            .set({
                passwordHash: input.hash,
                passwordSalt: input.salt,
                mustChangePassword: input.mustChangePassword,
            })
            .where(eq(users.id, id));
    },
});

export const drizzleAdminUserRepository = createDrizzleAdminUserRepository();
