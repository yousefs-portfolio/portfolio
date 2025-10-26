import {eq} from 'drizzle-orm';

import type {AdminUser} from '@core/domain/user';
import type {AdminUserRepository} from '@core/interfaces/repositories';

import type {DrizzleDb} from '@/app/lib/db';
import {getDb} from '@/app/lib/db';
import * as schema from '@/drizzle/schema';

const {users} = schema;

type UserRecord = typeof users.$inferSelect;
type TransactionClient = Parameters<DrizzleDb['transaction']>[0] extends (
        tx: infer Tx,
        ...args: any[]
    ) => any
    ? Tx
    : DrizzleDb;
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
    client?: UserClient,
): AdminUserRepository => {
    let cachedClient: DrizzleDb | undefined;
    const resolveClient = async () => {
        if (client) {
            return client;
        }
        if (!cachedClient) {
            cachedClient = await getDb();
        }
        return cachedClient;
    };

    return {
        async findByUsername(username) {
            const dbClient = await resolveClient();
            const [user] = await dbClient
                .select()
                .from(users)
                .where(eq(users.username, username))
                .limit(1);

            return user ? mapAdminUser(user) : null;
        },
        async findById(id) {
            const dbClient = await resolveClient();
            const [user] = await dbClient
                .select()
                .from(users)
                .where(eq(users.id, id))
                .limit(1);
            return user ? mapAdminUser(user) : null;
        },
        async updatePassword(id, input) {
            const dbClient = await resolveClient();
            await dbClient
                .update(users)
                .set({
                    passwordHash: input.hash,
                    passwordSalt: input.salt,
                    mustChangePassword: input.mustChangePassword,
                })
                .where(eq(users.id, id));
        },
    };
};

export const drizzleAdminUserRepository = createDrizzleAdminUserRepository();
