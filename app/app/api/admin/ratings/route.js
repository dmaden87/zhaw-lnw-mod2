// Export aller Bewertungen aus dem Testing-Modus (für die Testauswertung): ?format=csv für Excel
import { db } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const rows = await db().query(
    `SELECT id, created_at, question, level, model, verdict, confidence, light, comment, correction_doc_id,
            (SELECT string_agg(s->>'doc_id', ', ') FROM jsonb_array_elements(sources) s) AS sources
       FROM ratings ORDER BY id`);
  if (request.nextUrl.searchParams.get('format') !== 'csv') return Response.json(rows);
  const cols = ['id', 'created_at', 'question', 'level', 'model', 'verdict', 'confidence', 'light', 'sources', 'comment', 'correction_doc_id'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.join(';'), ...rows.map((r) => cols.map((c) => esc(r[c])).join(';'))].join('\n');
  return new Response('﻿' + csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="bewertungen.csv"' } });
}
