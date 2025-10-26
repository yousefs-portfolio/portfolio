import {getDb} from '@/app/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = await getDb();
        const result = await db.execute(/* sql */ `select 1 as ok`);
        return Response.json({ok: true, rows: result.rows});
    } catch (error) {
        console.error('db/health error:', error);
        const message =
            error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ok: false, error: message}),
            {
                status: 500,
                headers: {'content-type': 'application/json'},
            },
        );
    }
}
