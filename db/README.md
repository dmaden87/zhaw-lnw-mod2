# Datenbank

Open-Source-Vektordatenbank **PostgreSQL mit pgvector**, gehostet im Gratis-Kontingent und über Vercel angebunden.

Geplanter Inhalt dieses Ordners:

- `schema.sql` – Tabellen für Dokumente und Abschnitte (Chunks) inkl. Embedding-Spalte und Metadaten (Dokument-ID, Owner, Version, Klassifikation)
- `ingest/` – Skript, das die Dokumente aus `data/` liest, in Abschnitte teilt, Embeddings erzeugt und in die Datenbank schreibt

Die Datenbank selbst läuft nicht auf GitHub; hier liegen Schema und Skripte, damit der Aufbau nachvollziehbar und wiederholbar ist.
