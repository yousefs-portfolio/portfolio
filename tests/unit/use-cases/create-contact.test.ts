import { describe, expect, it, vi } from 'vitest';

import type { Contact } from '@core/domain/contact';
import { UseCaseError } from '@core/lib/errors';
import { createContact } from '@core/use-cases/create-contact';

describe('createContact use-case', () => {
  it('throws when neither email nor WhatsApp are provided', async () => {
    await expect(
      createContact(
        {
          name: 'John Doe',
          email: null,
          whatsapp: null,
          requirements: 'Need a new portfolio site',
        },
        {
          contactRepository: {
            create: vi.fn(),
            list: vi.fn(),
          },
        },
      ),
    ).rejects.toBeInstanceOf(UseCaseError);
  });

  it('trims and forwards data to the repository', async () => {
    const createMock = vi.fn<[], Promise<Contact>>().mockResolvedValue({
      id: 'contact-1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      whatsapp: null,
      requirements: 'Looking for product prototype',
      createdAt: new Date('2024-01-01T00:00:00Z'),
    });

    const result = await createContact(
      {
        name: '  Jane Doe ',
        email: ' jane@example.com ',
        whatsapp: ' ',
        requirements: ' Looking for product prototype ',
      },
      {
        contactRepository: {
          create: createMock,
          list: vi.fn(),
        },
      },
    );

    expect(createMock).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      whatsapp: null,
      requirements: 'Looking for product prototype',
    });
    expect(result.id).toBe('contact-1');
  });
});
