// Upload eines neuen Dokuments: prüfen, umwandeln, aufteilen, einbetten, speichern (alles oder nichts).
import { db, toVector } from '../../../lib/db';
import { checkFile, processFile, errorResponse, UserError } from '../../../lib/ingestFile';
import { requireRole } from '../../../lib/users';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request) {
  try {
    const me = await requireRole(request, 'superuser');
    const form = await request.formData().catch(() => { throw new UserError('Die Anfrage konnte nicht gelesen werden. Lade die Seite neu und versuche es nochmals.'); });
    const file = form.get('file');
    const id = String(form.get('id') || '').trim().toUpperCase();
    const title = String(form.get('title') || '').trim();
    const meta = Object.fromEntries(['category', 'owner', 'version', 'classification'].map((k) => [k, String(form.get(k) || '').trim()]));
    checkFile(file);
    if (!/^[A-Z]{2,6}-\d{1,3}$/.test(id)) throw new UserError('Die Dokument-ID muss aus 2–6 Buchstaben, Bindestrich und 1–3 Ziffern bestehen, z. B. «PAY-11».');
    if (!title) throw new UserError('Gib einen Titel ein.');

    const sql = db();
    const [exists] = await sql.query('SELECT id FROM documents WHERE id = $1', [id]);
    if (exists) throw new UserError(`Die ID ${id} ist bereits vergeben. Wähle eine andere ID oder ersetze das bestehende Dokument.`, 409);

    const fullTitle = `${id} ${title}`;
    const { markdown, chunks } = await processFile(file, fullTitle);
    const [{ next }] = await sql.query('SELECT GREATEST(COALESCE(MAX(id), 0), 99999) + 1 AS next FROM chunks');
    await sql.transaction([
      sql.query(
        `INSERT INTO documents (id, title, category, owner, version, classification, path, markdown, source, active, updated_at, updated_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'upload',true,now(),$9)`,
        [id, fullTitle, meta.category || 'Sonstiges', meta.owner, meta.version, meta.classification || 'Intern', `Upload: ${file.name}`, markdown, me.username]),
      ...chunks.map((c, i) => sql.query(
        'INSERT INTO chunks (id, doc_id, section, part, content, embed_text, hash, embedding) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::vector)',
        [next + i, id, c.section, c.part, c.content, c.embed_text, c.hash, toVector(c.vector)])),
    ]);
    return Response.json({ ok: true, id, title: fullTitle, chunks: chunks.length });
  } catch (e) {
    return errorResponse(e, 'upload');
  }
}
