import {makeRouteHandler} from '@keystatic/next/route-handler';

import config from '@/keystatic/keystatic.config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const {GET, POST} = makeRouteHandler({config});

export {GET, POST};
