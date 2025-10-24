import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { makeRouteHandler } from '@keystatic/next/route-handler';

import config from '@/keystatic/keystatic.config';
import { authOptions } from '@adapters/auth/nextauth';

// Ensure API uses Node.js runtime and is fully dynamic
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const keystaticHandlers = makeRouteHandler({
  config,
});

function withAuthentication<T extends (request: Request, context: any) => Promise<Response>>(handler?: T) {
  if (!handler) return undefined;
  return async (request: Request, context: any) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin || session.user.mustChangePassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(request, context);
  };
}

export const GET = withAuthentication(keystaticHandlers.GET);
export const POST = withAuthentication(keystaticHandlers.POST);
