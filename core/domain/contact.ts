export type ContactId = string;

export interface Contact {
  id: ContactId;
  name: string;
  email?: string | null;
  whatsapp?: string | null;
  requirements: string;
  createdAt: Date;
}

export interface NewContact {
  name: string;
  email?: string | null;
  whatsapp?: string | null;
  requirements: string;
}
