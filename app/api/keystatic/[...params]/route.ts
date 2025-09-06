import {makeRouteHandler} from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';

// Ensure API uses Node.js runtime and is fully dynamic
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { POST, GET } = makeRouteHandler({
  config,
});
