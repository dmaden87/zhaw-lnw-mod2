// Upload eines neuen Dokuments: umwandeln, in Abschnitte teilen, einbetten, speichern.
import { createHash } from 'node:crypto';
import { db, toVector } from '../../../lib/db';
import { embed } from '../../../lib/gemini';
import { config } from '../../../lib/config';
import { toMarkdown } from '../../../lib/convert';
import { chunkMarkdown } from '../../../lib/chunk';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const bad = (msg, status = 400) => Response.json({ error: msg }, { status });

export async function POST(request) {
  const form = await request.formData();
  const file = form.get('file');
  const id = String(form.get('id') || '').trim().toUpperCase();
  const title = String(form.get('title') || '').trim();
  const meta = Object.fromEntries(['category', 'owner', 'version', 'classification'].map((k) => [k, String(form.get(k) || '').trim()]));
  if (!file || typeof file === 'string' || !file.size) return bad('Wähle eine Datei aus.');
  if (file.size > 4 * 1024 * 1024) return bad('Die Datei ist grösser als 4 MB.');
  if (!/^[A-Z]{2,6}-\d{1,3}$/.test(id)) return bad('Die Dokument-ID muss dem Muster «PAY-11» entsprechen.');
  if (!title) return bad('Gib einen Titel ein.');

  const sql = db();
  const [exists] = await sql.query('SELECT id FROM documents WHERE id = $1', [id]);
  if (exists) return bad(`Die ID ${id} ist bereits vergeben.`, 409);

  let markdown;
  try {
    markdown = (await toMarkdown(file.name, Buffer.from(await file.arrayBuffer()))).trim();
  } catch (e) {
    return bad(e.message);
  }
  if (markdown.length < 50) return bad('Im Dokument wurde kaum Text gefunden (z. B. eingescanntes PDF).');

  const fullTitle = `${id} ${title}`;
  const chunks = chunkMarkdown(markdown).map((c) => ({ ...c, embed_text: `${fullTitle}\nAbschnitt: ${c.section}\n\n${c.content}` }));
  if (chunks.length > 300) return bad('Das Dokument ist zu umfangreich (mehr als 300 Abschnitte).');

  const vectors = [];
  for (let i = 0; i < chunks.length; i += 100) {
    const batch = chunks.slice(i, i + 100);
    vectors.push(...await embed(batch.map((c) => c.embed_text), 'RETRIEVAL_DOCUMENT', batch.map(() => fullTitle)));
  }

  await sql.query(
    `INSERT INTO documents (id, title, category, owner, version, classification, path, markdown, source, active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'upload',true)`,
    [id, fullTitle, meta.category || 'Upload', meta.owner, meta.version, meta.classification || 'Intern', `Upload: ${file.name}`, markdown]);
  const [{ next }] = await sql.query('SELECT GREATEST(COALESCE(MAX(id), 0), 99999) + 1 AS next FROM chunks');
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    const hash = createHash('sha256').update(`${config.embedModel}|${c.embed_text}`).digest('hex').slice(0, 16);
    await sql.query(
      `INSERT INTO chunks (id, doc_id, section, part, content, embed_text, hash, embedding) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::vector)`,
      [next + i, id, c.section, c.part, c.content, c.embed_text, hash, toVector(vectors[i])]);
  }
  return Response.json({ ok: true, id, title: fullTitle, chunks: chunks.length });
}
