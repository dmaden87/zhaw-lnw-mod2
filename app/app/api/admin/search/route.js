// Testsuche: findet die ähnlichsten Abschnitte zu einer Frage (?q=...&k=8).
import { db, toVector } from '../../../../lib/db';
import { embed } from '../../../../lib/gemini';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const q = request.nextUrl.searchParams.get('q');
  const k = Math.min(Number(request.nextUrl.searchParams.get('k') || 8), 20);
  if (!q) return Response.json({ error: 'Parameter q fehlt' }, { status: 400 });
  const t0 = Date.now();
  const [vector] = await embed([q], 'RETRIEVAL_QUERY');
  const t1 = Date.now();
  const rows = await db().query(
    `SELECT c.id, c.doc_id, d.title, c.section, round((1 - (c.embedding <=> $1::vector))::numeric, 3) AS score,
            left(c.content, 240) AS preview
       FROM chunks c JOIN documents d ON d.id = c.doc_id
      ORDER BY c.embedding <=> $1::vector LIMIT $2`, [toVector(vector), k]);
  return Response.json({ q, ms: { embed: t1 - t0, search: Date.now() - t1 }, results: rows });
}
