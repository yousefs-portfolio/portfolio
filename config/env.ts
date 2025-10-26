import {z} from 'zod';

const EnvSchema = z
    .object({
        NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
        DATABASE_URL: z.string().min(1).optional(),
        INSTANCE_CONNECTION_NAME: z.string().min(1).optional(),
        PGHOST: z.string().optional(),
        PGPORT: z.coerce.number().optional(),
        PGUSER: z.string().min(1, 'PGUSER is required when DATABASE_URL is not set').optional(),
        PGPASSWORD: z
            .string()
            .min(1, 'PGPASSWORD is required when DATABASE_URL is not set')
            .optional(),
        PGDATABASE: z
            .string()
            .min(1, 'PGDATABASE is required when DATABASE_URL is not set')
            .optional(),
        AUTH_SECRET: z.string().min(1).optional(),
        NEXTAUTH_SECRET: z.string().min(1).optional(),
        AUTH_URL: z.string().url().optional(),
        NEXTAUTH_URL: z.string().url().optional(),
    })
    .superRefine((value, ctx) => {
        if (!value.DATABASE_URL) {
            if (!value.INSTANCE_CONNECTION_NAME) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'INSTANCE_CONNECTION_NAME is required when DATABASE_URL is not provided',
                    path: ['INSTANCE_CONNECTION_NAME'],
                });
            }

            if (!value.PGUSER) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'PGUSER is required when DATABASE_URL is not provided',
                    path: ['PGUSER'],
                });
            }

            if (!value.PGPASSWORD) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'PGPASSWORD is required when DATABASE_URL is not provided',
                    path: ['PGPASSWORD'],
                });
            }

            if (!value.PGDATABASE) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'PGDATABASE is required when DATABASE_URL is not provided',
                    path: ['PGDATABASE'],
                });
            }
        }
    });

type Env = z.infer<typeof EnvSchema>;

let cachedEnv: Env | undefined;

export const env: Env = (cachedEnv ??=
    EnvSchema.parse({
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        INSTANCE_CONNECTION_NAME: process.env.INSTANCE_CONNECTION_NAME,
        PGHOST: process.env.PGHOST,
        PGPORT: process.env.PGPORT,
        PGUSER: process.env.PGUSER,
        PGPASSWORD: process.env.PGPASSWORD,
        PGDATABASE: process.env.PGDATABASE,
        AUTH_SECRET: process.env.AUTH_SECRET,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        AUTH_URL: process.env.AUTH_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    }));
