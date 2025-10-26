import {desc} from 'drizzle-orm';

import type {Contact} from '@core/domain/contact';
import type {ContactRepository} from '@core/interfaces/repositories';

import type {DrizzleDb} from '@/app/lib/db';
import {getDb} from '@/app/lib/db';
import * as schema from '@/drizzle/schema';

const {contacts} = schema;

type ContactRecord = typeof contacts.$inferSelect;
type TransactionClient = Parameters<DrizzleDb['transaction']>[0] extends (
        tx: infer Tx,
        ...args: any[]
    ) => any
    ? Tx
    : DrizzleDb;
type ContactClient = DrizzleDb | TransactionClient;

const mapContact = (record: ContactRecord): Contact => ({
    id: record.id,
    name: record.name,
    email: record.email ?? null,
    whatsapp: record.whatsapp ?? null,
    requirements: record.requirements,
    createdAt: new Date(record.createdAt),
});

export const createDrizzleContactRepository = (
    client?: ContactClient,
): ContactRepository => {
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
        async create(input) {
            const dbClient = await resolveClient();
            const [created] = await dbClient
                .insert(contacts)
                .values({
                    name: input.name,
                    email: input.email ?? null,
                    whatsapp: input.whatsapp ?? null,
                    requirements: input.requirements,
                })
                .returning();

            if (!created) {
                throw new Error('Failed to persist contact');
            }

            return mapContact(created);
        },
        async list() {
            const dbClient = await resolveClient();
            const records = await dbClient
                .select()
                .from(contacts)
                .orderBy(desc(contacts.createdAt));

            return records.map(mapContact);
        },
    };
};

export const drizzleContactRepository = createDrizzleContactRepository();
