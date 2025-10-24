import { getServerSession } from 'next-auth';

import { authOptions } from './nextauth';

export async function getAdminServerSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error('[auth] failed to resolve server session', error);
    return null;
  }
}
