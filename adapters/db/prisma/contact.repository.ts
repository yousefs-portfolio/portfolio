import type { Prisma, PrismaClient } from '@prisma/client';

import type { Contact } from '@core/domain/contact';
import type { ContactRepository } from '@core/interfaces/repositories';

import { prisma } from './client';

type ContactClient = PrismaClient | Prisma.TransactionClient;

const mapContact = (record: Prisma.Contact): Contact => ({
  id: record.id,
  name: record.name,
  email: record.email ?? null,
  whatsapp: record.whatsapp ?? null,
  requirements: record.requirements,
  createdAt: record.createdAt,
});

export const createPrismaContactRepository = (
  client: ContactClient = prisma,
): ContactRepository => ({
  async create(input) {
    const created = await client.contact.create({
      data: {
        name: input.name,
        email: input.email,
        whatsapp: input.whatsapp,
        requirements: input.requirements,
      },
    });
    return mapContact(created);
  },
  async list() {
    const contacts = await client.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return contacts.map(mapContact);
  },
});

export const prismaContactRepository = createPrismaContactRepository();
