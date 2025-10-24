import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

import { prismaAdminUserRepository } from '@adapters/db/prisma/admin-user.repository';
import { prismaTx } from '@adapters/db/prisma/transaction';
import { passwordHasher } from '@adapters/crypto/node/password-hasher';
import { authOptions } from '@adapters/auth/nextauth';
import { changeAdminPassword } from '@core/use-cases/change-admin-password';
import { UseCaseError } from '@core/lib/errors';

export const runtime = 'nodejs'

const BodySchema = z.object({
  newPassword: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await changeAdminPassword(
      {
        userId,
        newPassword: parsed.data.newPassword,
      },
      {
        adminUserRepository: prismaAdminUserRepository,
        passwordHasher,
        tx: prismaTx,
      },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof UseCaseError) {
      const status = error.code === 'BAD_REQUEST' ? 400 : 401;
      return NextResponse.json({ error: error.message }, { status });
    }
    console.error('Failed to change password:', error);
    return NextResponse.json({ error: 'Unable to change password' }, { status: 500 });
  }
}
