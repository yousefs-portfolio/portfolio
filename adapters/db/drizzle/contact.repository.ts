import {desc} from 'drizzle-orm';

import type {Contact} from '@core/domain/contact';
import type {ContactRepository} from '@core/interfaces/repositories';

import type {DrizzleDb} from '@/drizzle/db';
import {db} from '@/drizzle/db';
import {contacts} from '@/drizzle/schema';

type ContactRecord = typeof contacts.$inferSelect;
type ContactClient = DrizzleDb;

const mapContact = (record: ContactRecord): Contact => ({
    id: record.id,
    name: record.name,
    email: record.email ?? null,
    whatsapp: record.whatsapp ?? null,
    requirements: record.requirements,
    createdAt: new Date(record.createdAt),
});

export const createDrizzleContactRepository = (
    client: ContactClient = db,
): ContactRepository => ({
    async create(input) {
        const [created] = await client
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
        const records = await client
            .select()
            .from(contacts)
            .orderBy(desc(contacts.createdAt));

        return records.map(mapContact);
    },
});

export const drizzleContactRepository = createDrizzleContactRepository();
