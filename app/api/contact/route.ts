import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prismaContactRepository } from '@adapters/db/prisma/contact.repository';
import { prismaTx } from '@adapters/db/prisma/transaction';
import { createContact } from '@core/use-cases/create-contact';
import { listContacts } from '@core/use-cases/list-contacts';
import { UseCaseError } from '@core/lib/errors';

const BodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().nullable(),
  whatsapp: z.string().min(5).optional().nullable(),
  requirements: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const contact = await createContact(parsed.data, {
      contactRepository: prismaContactRepository,
      tx: prismaTx,
    });

    return NextResponse.json(
      {
        success: true,
        contact: {
          ...contact,
          email: contact.email ?? null,
          whatsapp: contact.whatsapp ?? null,
          createdAt: contact.createdAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof UseCaseError && error.code === 'BAD_REQUEST') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Failed to submit contact form', error);
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const contacts = await listContacts({
      contactRepository: prismaContactRepository,
    });

    return NextResponse.json(
      contacts.map((contact) => ({
        ...contact,
        email: contact.email ?? null,
        whatsapp: contact.whatsapp ?? null,
        createdAt: contact.createdAt.toISOString(),
      })),
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to fetch contacts', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}
