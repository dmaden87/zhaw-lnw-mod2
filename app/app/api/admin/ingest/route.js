// Import der Wissensbasis in die Vektordatenbank (Schritt 3).
// ?step=schema  -> Tabellen und Indizes anlegen
// ?step=data&limit=100 -> Dokumente speichern, bis zu <limit> neue/geänderte Abschnitte einbetten
// ?step=stats   -> Übersicht
import { createHash } from 'node:crypto';
import knowledge from '../../../../data/chunks.json';
import { db, toVector } from '../../../../lib/db';
import { embed } from '../../../../lib/gemini';
import { config } from '../../../../lib/config';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SCHEMA = [
  'CREATE EXTENSION IF NOT EXISTS vector',
  `CREATE TABLE IF NOT EXISTS documents (
     id text PRIMARY KEY, title text NOT NULL, category text, owner text,
     version text, classification text, path text)`,
  `CREATE TABLE IF NOT EXISTS chunks (
     id integer PRIMARY KEY,
     doc_id text NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
     section text, part integer, content text NOT NULL, embed_text text NOT NULL,
     hash text NOT NULL, embedding vector(${config.dims}),
     tsv tsvector GENERATED ALWAYS AS (to_tsvector('german', coalesce(section, '') || ' ' || content)) STORED)`,
  'CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks USING hnsw (embedding vector_cosine_ops)',
  'CREATE INDEX IF NOT EXISTS chunks_tsv_idx ON chunks USING gin (tsv)',
];

const hashOf = (c) => createHash('sha256').update(`${config.embedModel}|${c.embed_text}`).digest('hex').slice(0, 16);

async function stats(sql) {
  const [r] = await sql.query(`SELECT (SELECT count(*) FROM documents)::int AS documents,
    (SELECT count(*) FROM chunks)::int AS chunks,
    (SELECT count(*) FROM chunks WHERE embedding IS NOT NULL)::int AS embedded`);
  return { ...r, expectedChunks: knowledge.chunks.length, embedModel: config.embedModel };
}

export async function GET(request) {
  const sql = db();
  const p = request.nextUrl.searchParams;
  const step = p.get('step') || 'stats';
  try {
    if (step === 'schema') {
      for (const stmt of SCHEMA) await sql.query(stmt);
      return Response.json({ ok: true, step, ...(await stats(sql)) });
    }

    if (step === 'data') {
      const limit = Math.min(Number(p.get('limit') || 100), 100);
      for (const d of knowledge.documents) {
        await sql.query(
          `INSERT INTO documents (id, title, category, owner, version, classification, path)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (id) DO UPDATE SET title=$2, category=$3, owner=$4, version=$5, classification=$6, path=$7`,
          [d.id, d.title, d.category, d.owner, d.version, d.classification, d.path]);
      }
      const maxId = knowledge.chunks.length;
      await sql.query('DELETE FROM chunks WHERE id > $1', [maxId]);
      const existing = new Map((await sql.query('SELECT id, hash FROM chunks WHERE embedding IS NOT NULL'))
        .map((r) => [r.id, r.hash]));
      const todo = knowledge.chunks.filter((c) => existing.get(c.id) !== hashOf(c));
      const batch = todo.slice(0, limit);
      if (batch.length) {
        const titles = new Map(knowledge.documents.map((d) => [d.id, d.title]));
        const vectors = await embed(batch.map((c) => c.embed_text), 'RETRIEVAL_DOCUMENT',
          batch.map((c) => titles.get(c.doc_id)));
        for (let i = 0; i < batch.length; i++) {
          const c = batch[i];
          await sql.query(
            `INSERT INTO chunks (id, doc_id, section, part, content, embed_text, hash, embedding)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8::vector)
             ON CONFLICT (id) DO UPDATE SET doc_id=$2, section=$3, part=$4, content=$5, embed_text=$6, hash=$7, embedding=$8::vector`,
            [c.id, c.doc_id, c.section, c.part, c.content, c.embed_text, hashOf(c), toVector(vectors[i])]);
        }
      }
      return Response.json({ ok: true, step, processed: batch.length, remaining: todo.length - batch.length, ...(await stats(sql)) });
    }

    return Response.json({ ok: true, step: 'stats', ...(await stats(sql)) });
  } catch (e) {
    return Response.json({ ok: false, step, error: String(e.message || e) }, { status: 500 });
  }
}
