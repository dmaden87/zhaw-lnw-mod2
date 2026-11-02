import { db, toVector } from './db';
import { embed } from './gemini';

// Kombinierte Suche: Bedeutung (Vektor) + Stichworte (Volltext), zusammengeführt per Reciprocal Rank Fusion.
export async function retrieve(question, k = 8) {
  const [vector] = await embed([question], 'RETRIEVAL_QUERY');
  const rows = await db().query(
    `WITH v AS (
       SELECT c.id, row_number() OVER (ORDER BY c.embedding <=> $1::vector) AS r,
              1 - (c.embedding <=> $1::vector) AS score
         FROM chunks c JOIN documents d ON d.id = c.doc_id AND d.active
        ORDER BY c.embedding <=> $1::vector LIMIT 25),
     q AS (SELECT replace(plainto_tsquery('german', $2)::text, '&', '|') AS s),
     t AS (
       SELECT c.id, row_number() OVER (ORDER BY ts_rank_cd(c.tsv, to_tsquery('german', q.s)) DESC) AS r
         FROM chunks c JOIN documents d ON d.id = c.doc_id AND d.active, q
        WHERE q.s <> '' AND c.tsv @@ to_tsquery('german', q.s)
        ORDER BY ts_rank_cd(c.tsv, to_tsquery('german', q.s)) DESC LIMIT 25)
     SELECT c.id, c.doc_id, c.section, c.content, d.title, d.category, d.owner, d.version, d.classification,
            round(coalesce(v.score, 0)::numeric, 3)::float AS score,
            (coalesce(1.0 / (60 + v.r), 0) + coalesce(1.0 / (60 + t.r), 0))::float AS rrf
       FROM chunks c JOIN documents d ON d.id = c.doc_id
       LEFT JOIN v ON v.id = c.id LEFT JOIN t ON t.id = c.id
      WHERE v.id IS NOT NULL OR t.id IS NOT NULL
      ORDER BY rrf DESC LIMIT $3`,
    [toVector(vector), question, k]);
  return rows;
}

// «Wen frage ich?» aus dem Organigramm – damit der Bot bei Unsicherheit eine Ansprechstelle nennen kann.
export async function contacts() {
  return db().query(
    `SELECT c.id, c.doc_id, c.section, c.content, d.title, d.category, d.owner, d.version, d.classification,
            0::float AS score, 0::float AS rrf
       FROM chunks c JOIN documents d ON d.id = c.doc_id
      WHERE c.doc_id = 'ORG-01' AND d.active AND c.section ILIKE '%Wen frage ich%'`);
}
