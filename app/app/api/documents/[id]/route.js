// Dokument aktivieren/inaktivieren: inaktive Dokumente bleiben gespeichert, werden aber nicht mehr durchsucht.
import { db } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { active } = await request.json().catch(() => ({}));
  if (typeof active !== 'boolean') return Response.json({ error: 'Feld «active» fehlt.' }, { status: 400 });
  const rows = await db().query('UPDATE documents SET active = $2, updated_at = now() WHERE id = $1 RETURNING id, active', [decodeURIComponent(id), active]);
  if (!rows.length) return Response.json({ error: 'Dokument nicht gefunden.' }, { status: 404 });
  return Response.json(rows[0]);
}
