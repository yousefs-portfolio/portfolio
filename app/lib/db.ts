import 'server-only';

import {Connector, IpAddressTypes} from '@google-cloud/cloud-sql-connector';
import type {NodePgDatabase} from 'drizzle-orm/node-postgres';
import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';

import {loadDbEnv} from './env.server';
import * as schema from '@/drizzle/schema';

type DrizzleInstance = NodePgDatabase<typeof schema>;

type GlobalForDb = typeof globalThis & {
    __pgPool?: Pool;
    __drizzleDb?: DrizzleInstance;
    __cloudSqlConnector?: Connector;
};

const globalForDb = globalThis as GlobalForDb;

const shouldCache = process.env.NODE_ENV !== 'production';
const skipDb =
    process.env.SKIP_DB === '1' || process.env.SKIP_DB === 'true';

const createPool = async (): Promise<Pool> => {
    if (skipDb) {
        const connectionString =
            process.env.DATABASE_URL ??
            'postgresql://placeholder:placeholder@localhost:5432/placeholder';

        let disableSsl = false;
        try {
            const url = new URL(connectionString);
            disableSsl = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
        } catch (error) {
            disableSsl = true;
        }

        return new Pool({
            connectionString,
            ssl: disableSsl ? false : {rejectUnauthorized: false},
        });
    }

    const {
        instanceConnectionName,
        user,
        password,
        database,
    } = loadDbEnv();

    const connector =
        globalForDb.__cloudSqlConnector ?? new Connector();

    if (shouldCache) {
        globalForDb.__cloudSqlConnector = connector;
    }

    const clientOpts = await connector.getOptions({
        instanceConnectionName,
        ipType: IpAddressTypes.PUBLIC,
    });

    const pool = new Pool({
        ...clientOpts,
        user,
        password,
        database,
        max: 5,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 10_000,
    });

    const originalEnd = pool.end.bind(pool);
    pool.end = async () => {
        await originalEnd();
        connector.close();
        return undefined;
    };

    return pool;
};

const getPool = async (): Promise<Pool> => {
    if (shouldCache && globalForDb.__pgPool) {
        return globalForDb.__pgPool;
    }

    const pool = await createPool();

    if (shouldCache) {
        globalForDb.__pgPool = pool;
    }

    return pool;
};

export type DrizzleDb = DrizzleInstance;

export const getDb = async (): Promise<DrizzleDb> => {
    if (shouldCache && globalForDb.__drizzleDb) {
        return globalForDb.__drizzleDb;
    }

    const pool = await getPool();
    const db = drizzle(pool, {
        schema,
    });

    if (shouldCache) {
        globalForDb.__drizzleDb = db;
    }

    return db;
};

export {getPool};
