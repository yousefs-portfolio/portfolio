import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
});

type Env = z.infer<typeof EnvSchema>;

let cachedEnv: Env | undefined;

export const env: Env = (cachedEnv ??= EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL ?? 'file:./dev.db',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
}));
