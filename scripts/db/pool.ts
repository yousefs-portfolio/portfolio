import {Pool, type PoolConfig} from 'pg';

const isLocalHost = (host?: string | null) =>
    !host || host === '127.0.0.1' || host === 'localhost';

const createConfigFromUrl = (connectionString: string): PoolConfig => {
    try {
        const url = new URL(connectionString);
        const disableSsl = isLocalHost(url.hostname);

        return {
            connectionString,
            ssl: disableSsl ? false : {rejectUnauthorized: false},
        };
    } catch (error) {
        throw new Error(`Invalid DATABASE_URL: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const createCliPool = (): Pool => {
    if (process.env.DATABASE_URL) {
        return new Pool(createConfigFromUrl(process.env.DATABASE_URL));
    }

    const config: PoolConfig = {
        host: process.env.PGHOST,
        port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
    };

    const disableSsl = isLocalHost(config.host);
    config.ssl = disableSsl ? false : {rejectUnauthorized: false};

    return new Pool(config);
};
