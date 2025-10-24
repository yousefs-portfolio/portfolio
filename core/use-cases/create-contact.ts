import type { Contact } from '../domain/contact';
import type { ContactRepository } from '../interfaces/repositories';
import type { Tx } from '../interfaces/tx';
import { UseCaseError } from '../lib/errors';

export interface CreateContactInput {
  name: string;
  email?: string | null;
  whatsapp?: string | null;
  requirements: string;
}

export const createContact = async (
  input: CreateContactInput,
  deps: {
    contactRepository: ContactRepository;
    tx?: Tx;
  },
): Promise<Contact> => {
  const name = input.name.trim();
  const email = input.email?.trim() ?? null;
  const whatsapp = input.whatsapp?.trim() ?? null;
  const requirements = input.requirements.trim();

  if (!name) {
    throw new UseCaseError('BAD_REQUEST', 'Name is required');
  }

  if (!email && !whatsapp) {
    throw new UseCaseError('BAD_REQUEST', 'Either email or WhatsApp is required');
  }

  if (!requirements) {
    throw new UseCaseError('BAD_REQUEST', 'Requirements are required');
  }

  const execute = (repo: ContactRepository) =>
    repo.create({
      name,
      email,
      whatsapp,
      requirements,
    });

  if (deps.tx) {
    return deps.tx(({ contactRepository }) => execute(contactRepository));
  }

  return execute(deps.contactRepository);
};
