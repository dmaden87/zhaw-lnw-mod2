// PATCH: Dokument aktivieren/inaktivieren (bleibt gespeichert, wird aber nicht mehr durchsucht).
// PUT:   Dokument ersetzen – neue Datei, gleiche ID; Abschnitte werden neu erzeugt (alles oder nichts).
import { db, toVector } from '../../../../lib/db';
import { checkFile, processFile, errorResponse, UserError } from '../../../../lib/ingestFile';
import { requireRole } from '../../../../lib/users';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function PATCH(request, { params }) {
  try {
    const me = await requireRole(request, 'superuser');
    const { id } = await params;
    const { active } = await request.json().catch(() => ({}));
    if (typeof active !== 'boolean') throw new UserError('Ungültige Anfrage: Status fehlt.');
    const rows = await db().query('UPDATE documents SET active = $2, updated_at = now(), updated_by = $3 WHERE id = $1 RETURNING id, active', [decodeURIComponent(id), active, me.username]);
    if (!rows.length) throw new UserError('Dieses Dokument gibt es nicht mehr. Lade die Seite neu.', 404);
    return Response.json(rows[0]);
  } catch (e) {
    return errorResponse(e, 'toggle');
  }
}

export async function PUT(request, { params }) {
  try {
    const me = await requireRole(request, 'superuser');
    const id = decodeURIComponent((await params).id);
    const form = await request.formData().catch(() => { throw new UserError('Die Anfrage konnte nicht gelesen werden. Lade die Seite neu und versuche es nochmals.'); });
    const file = form.get('file');
    checkFile(file);
    const version = String(form.get('version') || '').trim();
    const owner = String(form.get('owner') || '').trim();

    const sql = db();
    const [doc] = await sql.query('SELECT id, title, owner, version, path FROM documents WHERE id = $1', [id]);
    if (!doc) throw new UserError('Dieses Dokument gibt es nicht mehr. Lade die Seite neu.', 404);

    const { markdown, chunks } = await processFile(file, doc.title);
    const [{ next }] = await sql.query('SELECT GREATEST(COALESCE(MAX(id), 0), 99999) + 1 AS next FROM chunks');
    // source = 'upload': ein späterer Import aus dem Repository überschreibt die ersetzte Fassung nicht
    await sql.transaction([
      sql.query('DELETE FROM chunks WHERE doc_id = $1', [id]),
      sql.query(
        `UPDATE documents SET markdown = $2, version = $3, owner = $4, path = $5, source = 'upload', updated_at = now(), updated_by = $6 WHERE id = $1`,
        [id, markdown, version || doc.version, owner || doc.owner, `Ersetzt: ${file.name}`, me.username]),
      ...chunks.map((c, i) => sql.query(
        'INSERT INTO chunks (id, doc_id, section, part, content, embed_text, hash, embedding) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::vector)',
        [next + i, id, c.section, c.part, c.content, c.embed_text, c.hash, toVector(c.vector)])),
    ]);
    return Response.json({ ok: true, id, title: doc.title, chunks: chunks.length });
  } catch (e) {
    return errorResponse(e, 'replace');
  }
}
