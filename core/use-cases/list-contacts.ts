import type { Contact } from '../domain/contact';
import type { ContactRepository } from '../interfaces/repositories';

export const listContacts = async (
  deps: { contactRepository: ContactRepository },
): Promise<Contact[]> => {
  const contacts = await deps.contactRepository.list();
  return [...contacts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
};
