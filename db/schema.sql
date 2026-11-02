-- Schema der Wissensbasis (PostgreSQL + pgvector, Neon)
-- Wird vom Import-Endpunkt /api/admin/ingest?step=schema automatisch angelegt; hier zur Dokumentation.

CREATE EXTENSION IF NOT EXISTS vector;

-- Ein Eintrag pro Quelldokument (Metadaten für Quellenangaben)
CREATE TABLE IF NOT EXISTS documents (
  id             text PRIMARY KEY,   -- z. B. PAY-02
  title          text NOT NULL,
  category       text,               -- Prozess, Weisung, Schnittstelle, ...
  owner          text,               -- Prozesseigner / Verantwortlich
  version        text,               -- Version / Stand
  classification text,               -- Intern, Vertraulich
  path           text                -- Ablage im Repository
);

-- Ein Eintrag pro Abschnitt (Chunk) mit Embedding
CREATE TABLE IF NOT EXISTS chunks (
  id         integer PRIMARY KEY,
  doc_id     text NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  section    text,                   -- Kapitelüberschrift
  part       integer,                -- Teil innerhalb des Kapitels
  content    text NOT NULL,          -- Originaltext (für Antwort und Quellenanzeige)
  embed_text text NOT NULL,          -- Text inkl. Dokumenttitel und Kapitel, der eingebettet wird
  hash       text NOT NULL,          -- erkennt geänderte Abschnitte (nur diese werden neu eingebettet)
  embedding  vector(768),            -- Gemini Embedding 2, 768 Dimensionen
  tsv        tsvector GENERATED ALWAYS AS (to_tsvector('german', coalesce(section, '') || ' ' || content)) STORED
);

CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks USING hnsw (embedding vector_cosine_ops); -- semantische Suche
CREATE INDEX IF NOT EXISTS chunks_tsv_idx ON chunks USING gin (tsv);                               -- Volltextsuche
