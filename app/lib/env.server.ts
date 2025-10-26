import 'server-only';

export type DbConfig = {
    instanceConnectionName: string;
    user: string;
    password: string;
    database: string;
};

const isProvided = (value: string | undefined | null): value is string =>
    typeof value === 'string' && value.length > 0;

export const loadDbEnv = (): DbConfig => {
    const {
        INSTANCE_CONNECTION_NAME,
        PGUSER,
        PGPASSWORD,
        PGDATABASE,
    } = process.env;

    const missing = [
        ['INSTANCE_CONNECTION_NAME', INSTANCE_CONNECTION_NAME],
        ['PGUSER', PGUSER],
        ['PGPASSWORD', PGPASSWORD],
        ['PGDATABASE', PGDATABASE],
    ]
        .filter(([, value]) => !isProvided(value))
        .map(([key]) => key);

    if (missing.length > 0) {
        throw new Error(
            `DB envs missing at runtime: ${missing.join(', ')}`,
        );
    }

    return {
        instanceConnectionName: INSTANCE_CONNECTION_NAME!,
        user: PGUSER!,
        password: PGPASSWORD!,
        database: PGDATABASE!,
    };
};
