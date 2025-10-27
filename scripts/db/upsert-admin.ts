import bcrypt from 'bcryptjs';
import {Pool} from 'pg';

const resolveSsl = (connectionString: string) => {
  try {
    const {hostname} = new URL(connectionString);
    return hostname === 'localhost' || hostname === '127.0.0.1'
        ? false
        : {rejectUnauthorized: false};
  } catch {
    return false;
  }
};

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD ?? 'supersecret';

  const pool = new Pool({
    connectionString,
    ssl: resolveSsl(connectionString),
  });

    try {
      await pool.query('set search_path to app, public');
      await pool.query('create schema if not exists app');
        await pool.query(`
          create table if not exists app.users
          (
            id
            bigserial
            primary
            key,
            username
            text
            unique
            not
            null,
            "passwordHash"
            text
            not
            null,
            "isAdmin"
            boolean
            not
            null
            default
            false,
            "mustChangePassword"
            boolean
            not
            null
            default
            false,
            "createdAt"
            timestamptz
            not
            null
            default
            now
          (
          )
            )
        `);

      const hash = await bcrypt.hash(password, 12);

        await pool.query(
            `
              insert into app.users (username, "passwordHash", "isAdmin", "mustChangePassword")
              values ($1, $2, true, false) on conflict (username) do
              update set "passwordHash" = excluded."passwordHash"
            `,
            [username, hash],
        );

      const {rows} = await pool.query(
          `
                select id, username, length("passwordHash") as hash_len, "isAdmin"
                from app.users
                where username = $1
            `,
          [username],
      );

      console.log('Upserted admin user:', rows.at(0));
    } finally {
      await pool.end();
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
