import 'server-only';

import {Connector} from '@google-cloud/cloud-sql-connector';
import type {NodePgDatabase} from 'drizzle-orm/node-postgres';
import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';

import {env} from '@config/env';
import * as schema from '@/drizzle/schema';

type GlobalDrizzle = typeof globalThis & {
    __drizzleDb?: NodePgDatabase<typeof schema>;
    __pgPool?: Pool;
    __pgPoolPromise?: Promise<Pool>;
    __cloudSqlConnector?: Connector;
};

const globalForDb = globalThis as GlobalDrizzle;

const shouldCache = env.NODE_ENV !== 'production';
const skipDb = process.env.SKIP_DB === '1' || process.env.SKIP_DB === 'true';

const createPool = async (): Promise<Pool> => {
    if (skipDb) {
        return new Pool({
            connectionString:
                env.DATABASE_URL ??
                'postgresql://placeholder:placeholder@localhost:5432/placeholder',
            max: 0,
        });
    }

    if (env.DATABASE_URL) {
        const requiresSsl =
            env.DATABASE_URL.startsWith('postgres://') ||
            env.DATABASE_URL.startsWith('postgresql://');

        return new Pool({
            connectionString: env.DATABASE_URL,
            ssl: requiresSsl
                ? {
                    rejectUnauthorized: false,
                }
                : undefined,
        });
    }

    if (!env.INSTANCE_CONNECTION_NAME) {
        throw new Error(
            'INSTANCE_CONNECTION_NAME must be set when DATABASE_URL is not provided',
        );
    }

    const connector =
        globalForDb.__cloudSqlConnector ?? new Connector({
            userAgent: 'portfolio-app',
        });

    if (shouldCache) {
        globalForDb.__cloudSqlConnector = connector;
    }

    const connectionOptions = await connector.getOptions({
        instanceConnectionName: env.INSTANCE_CONNECTION_NAME,
    });

    const pool = new Pool({
        ...connectionOptions,
        user: env.PGUSER!,
        password: env.PGPASSWORD!,
        database: env.PGDATABASE!,
        port: env.PGPORT,
    });

    const originalEnd = pool.end.bind(pool);
    pool.end = async () => {
        await originalEnd();
        connector.close();
        return undefined;
    };

    return pool;
};

let pool: Pool | undefined = globalForDb.__pgPool;
let db: NodePgDatabase<typeof schema> | undefined = globalForDb.__drizzleDb;

const getPool = async (): Promise<Pool> => {
    if (pool) {
        return pool;
    }

    const poolPromise =
        globalForDb.__pgPoolPromise ??
        createPool().then((createdPool) => {
            if (shouldCache) {
                globalForDb.__pgPool = createdPool;
                pool = createdPool;
            }
            return createdPool;
        });

    if (shouldCache) {
        globalForDb.__pgPoolPromise = poolPromise;
    }

    pool = await poolPromise;
    return pool;
};

const getDb = async (): Promise<NodePgDatabase<typeof schema>> => {
    if (db) {
        return db;
    }

    const resolvedPool = await getPool();
    db =
        globalForDb.__drizzleDb ??
        drizzle(resolvedPool, {
            schema,
        });

    if (shouldCache) {
        globalForDb.__drizzleDb = db;
    }

    return db;
};

export {getDb, getPool};
export type DrizzleDb = NodePgDatabase<typeof schema>;
