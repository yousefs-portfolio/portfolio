import fs from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';
import {drizzle} from 'drizzle-orm/better-sqlite3';

import {env} from '@config/env';

import * as schema from './schema';

type BetterSqliteDatabase = ReturnType<typeof drizzle>;
type GlobalDrizzle = typeof globalThis & {
    __drizzleDb?: BetterSqliteDatabase;
    __drizzleSqlite?: Database.Database;
};

const globalForDrizzle = globalThis as GlobalDrizzle;

const resolveSqliteFilename = (databaseUrl: string): string => {
    if (databaseUrl === ':memory:' || databaseUrl === 'file::memory:') {
        return ':memory:';
    }

    if (databaseUrl.startsWith('file:')) {
        const withoutProtocol = databaseUrl.slice('file:'.length);
        const [rawPath] = withoutProtocol.split('?');
        if (!rawPath) {
            return path.join(process.cwd(), 'drizzle', 'dev.db');
        }
        const normalized = path.normalize(rawPath);
        return path.isAbsolute(normalized)
            ? normalized
            : path.join(process.cwd(), normalized);
    }

    return databaseUrl;
};

const databaseFilename = resolveSqliteFilename(env.DATABASE_URL);

if (databaseFilename !== ':memory:') {
    const directory = path.dirname(databaseFilename);
    fs.mkdirSync(directory, {recursive: true});
}

const sqlite =
    globalForDrizzle.__drizzleSqlite ??
    new Database(databaseFilename, {fileMustExist: false});

const db =
    globalForDrizzle.__drizzleDb ??
    drizzle(sqlite, {
        schema,
    });

if (env.NODE_ENV !== 'production') {
    globalForDrizzle.__drizzleSqlite = sqlite;
    globalForDrizzle.__drizzleDb = db;
}

export {db, sqlite};
export type DrizzleDb = typeof db;
