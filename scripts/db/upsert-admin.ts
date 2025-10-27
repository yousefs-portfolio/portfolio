import {Pool} from "pg";
import * as bcrypt from "bcryptjs";

async function main() {
    const url = process.env.DATABASE_URL;
    const user = process.env.ADMIN_USERNAME || "admin";
    const pass = process.env.ADMIN_PASSWORD || "supersecret";
    if (!url) throw new Error("Missing DATABASE_URL");

    const pool = new Pool({connectionString: url, ssl: false});
    try {
        await pool.query(`SET search_path TO app, public`);
        await pool.query(`CREATE SCHEMA IF NOT EXISTS app`);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS app.users
            (
                id
                BIGSERIAL
                PRIMARY
                KEY,
                username
                text
                UNIQUE
                NOT
                NULL,
                "passwordHash"
                text
                NOT
                NULL,
                "isAdmin"
                boolean
                NOT
                NULL
                DEFAULT
                false,
                "mustChangePassword"
                boolean
                NOT
                NULL
                DEFAULT
                false,
                "createdAt"
                timestamptz
                NOT
                NULL
                DEFAULT
                now
            (
            )
                )
        `);
        const hash = await bcrypt.hash(pass, 12);
        await pool.query(
      \`INSERT INTO app.users (username, "passwordHash", "isAdmin", "mustChangePassword")
         VALUES ($1,$2,true,false)
         ON CONFLICT (username) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash"\`,
      [user, hash]
    );
    const { rows } = await pool.query(
      \`SELECT id, username, length("passwordHash") AS hash_len, "isAdmin"
         FROM app.users WHERE username=$1\`,
      [user]
    );
    console.log("Upserted:", rows);
  } finally {
    await pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
