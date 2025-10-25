// app/api/db/health/route.ts
import {getDb} from '@/app/lib/db';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const db = await getDb();
        const rows = await db.execute(/* sql */ `SELECT 1 AS ok`);
        return Response.json({ok: true, rows});
    } catch (err) {
        const message =
            err instanceof Error ? err.message : JSON.stringify(err);
        return new Response(
            JSON.stringify({ok: false, error: message}),
            {
                status: 500,
                headers: {'content-type': 'application/json'},
            },
        );
    }
}
