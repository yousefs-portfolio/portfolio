import 'server-only';

import {Connector, IpAddressTypes} from '@google-cloud/cloud-sql-connector';
import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';

declare global {
    // eslint-disable-next-line no-var
    var __pgPool: Pool | undefined;
}

async function makePool() {
    const instanceConnectionName = process.env.INSTANCE_CONNECTION_NAME;
    const user = process.env.PGUSER;
    const password = process.env.PGPASSWORD;
    const database = process.env.PGDATABASE;

    if (!instanceConnectionName || !user || !password || !database) {
        throw new Error(
            'Missing DB envs: INSTANCE_CONNECTION_NAME, PGUSER, PGPASSWORD, PGDATABASE',
        );
    }

    const connector = new Connector();
    const clientOpts = await connector.getOptions({
        instanceConnectionName,
        ipType: IpAddressTypes.PUBLIC,
    });

    return new Pool({
        ...clientOpts,
        user,
        password,
        database,
        max: 5,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 10_000,
    });
}

export async function getDb() {
    if (!global.__pgPool) {
        global.__pgPool = await makePool();
    }
    return drizzle(global.__pgPool);
}
