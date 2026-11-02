// Import der Wissensbasis in die Vektordatenbank (Schritt 3).
// ?step=schema  -> Tabellen und Indizes anlegen
// ?step=data&limit=100 -> Dokumente speichern, bis zu <limit> neue/geänderte Abschnitte einbetten
// ?step=stats   -> Übersicht
import { createHash } from 'node:crypto';
import knowledge from '../../../../data/chunks.json';
import fulltexts from '../../../../data/documents.json';
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
  // Erweiterung Wissensbasis-Verwaltung: Volltext, aktiv/inaktiv, Herkunft (repo | upload)
  'ALTER TABLE documents ADD COLUMN IF NOT EXISTS markdown text',
  'ALTER TABLE documents ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true',
  "ALTER TABLE documents ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'repo'",
  'ALTER TABLE documents ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now()',
  // Testing- und Adjustment-Modus: Bewertungen der Antworten
  `CREATE TABLE IF NOT EXISTS ratings (
     id serial PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(),
     question text NOT NULL, level text NOT NULL, model text, answer text,
     confidence integer, light text, sources jsonb,
     verdict text NOT NULL CHECK (verdict IN ('richtig','teilweise','falsch')),
     comment text, correction_doc_id text)`,
  `ALTER TABLE ratings ADD COLUMN IF NOT EXISTS question_embedding vector(${config.dims})`,
  'ALTER TABLE ratings ADD COLUMN IF NOT EXISTS rated_by text',
  'ALTER TABLE documents ADD COLUMN IF NOT EXISTS updated_by text',
  // Rollenkonzept: user (suchen, lesen) < superuser (+ Dokumente verwalten) < kipm (+ bewerten, Benutzer verwalten)
  `CREATE TABLE IF NOT EXISTS users (
     id serial PRIMARY KEY, username text UNIQUE NOT NULL, display_name text NOT NULL,
     role text NOT NULL CHECK (role IN ('user','superuser','kipm')), password_hash text NOT NULL,
     active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(),
     created_by text, last_login timestamptz)`,
  // Schutzmechanismen: Zähler pro Tag und Kategorie (keine Fragetexte), Einstellungen (Feature-Toggles)
  `CREATE TABLE IF NOT EXISTS guard_counts (
     day date NOT NULL, category text NOT NULL, count integer NOT NULL DEFAULT 0, PRIMARY KEY (day, category))`,
  `CREATE TABLE IF NOT EXISTS settings (
     key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now(), updated_by text)`,
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
      const overridden = new Set((await sql.query("SELECT id FROM documents WHERE source <> 'repo'")).map((r) => r.id));
      for (const d of knowledge.documents.filter((x) => !overridden.has(x.id))) {
        await sql.query(
          `INSERT INTO documents (id, title, category, owner, version, classification, path, markdown, source)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'repo')
           ON CONFLICT (id) DO UPDATE SET title=$2, category=$3, owner=$4, version=$5, classification=$6, path=$7, markdown=$8`,
          [d.id, d.title, d.category, d.owner, d.version, d.classification, d.path, fulltexts[d.id]?.markdown || null]);
      }
      const maxId = knowledge.chunks.length;
      // Nur Repository-Abschnitte (IDs < 100000) aufräumen; hochgeladene Dokumente bleiben unberührt
      await sql.query('DELETE FROM chunks WHERE id > $1 AND id < 100000', [maxId]);
      // Repository-Abschnitte von ersetzten Dokumenten entfernen (die neue Fassung liegt ab ID 100000)
      if (overridden.size) await sql.query('DELETE FROM chunks WHERE id < 100000 AND doc_id = ANY($1)', [[...overridden]]);
      const existing = new Map((await sql.query('SELECT id, hash FROM chunks WHERE embedding IS NOT NULL'))
        .map((r) => [r.id, r.hash]));
      const todo = knowledge.chunks.filter((c) => !overridden.has(c.doc_id) && existing.get(c.id) !== hashOf(c));
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
