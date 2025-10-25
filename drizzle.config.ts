import {defineConfig} from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL;
const isPostgres = typeof databaseUrl === 'string' && databaseUrl.startsWith('postgres');

export default defineConfig({
    schema: './drizzle/schema.ts',
    out: './drizzle/migrations',
    dialect: isPostgres ? 'postgresql' : 'sqlite',
    dbCredentials: isPostgres
        ? {url: databaseUrl ?? ''}
        : {url: 'file:./drizzle/dev.db'},
    strict: true,
});
