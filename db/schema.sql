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
  path           text,               -- Ablage im Repository bzw. «Upload: Dateiname»
  markdown       text,               -- Volltext für die Dokumentansicht
  active         boolean NOT NULL DEFAULT true,   -- inaktive Dokumente werden nicht durchsucht
  source         text NOT NULL DEFAULT 'repo',    -- repo | upload
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Ein Eintrag pro Abschnitt (Chunk) mit Embedding
CREATE TABLE IF NOT EXISTS chunks (
  id         integer PRIMARY KEY,    -- Repository: 1..n, Uploads: ab 100000
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

-- Testing- und Adjustment-Modus: Bewertungen der Antworten
CREATE TABLE IF NOT EXISTS ratings (
  id                 serial PRIMARY KEY,
  created_at         timestamptz NOT NULL DEFAULT now(),
  question           text NOT NULL,
  level              text NOT NULL,          -- instant | basic | full
  model              text,
  answer             text,
  confidence         integer,                -- Ampelwert zum Zeitpunkt der Bewertung
  light              text,                   -- green | yellow | red
  sources            jsonb,
  verdict            text NOT NULL CHECK (verdict IN ('richtig','teilweise','falsch')),
  comment            text,
  correction_doc_id  text,                   -- KOR-nnn, falls ergänzendes Wissen erfasst wurde
  question_embedding vector(768)             -- für die Kalibrierung bei ähnlichen Fragen
);

-- Rollenkonzept: user < superuser < kipm
CREATE TABLE IF NOT EXISTS users (
  id            serial PRIMARY KEY,
  username      text UNIQUE NOT NULL,
  display_name  text NOT NULL,
  role          text NOT NULL CHECK (role IN ('user','superuser','kipm')),
  password_hash text NOT NULL,             -- scrypt: salt:hash
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  created_by    text,
  last_login    timestamptz
);
ALTER TABLE ratings   ADD COLUMN IF NOT EXISTS rated_by   text;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS updated_by text;
