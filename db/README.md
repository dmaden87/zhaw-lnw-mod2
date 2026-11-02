# Datenbank

Open-Source-Vektordatenbank **PostgreSQL mit pgvector**, gehostet bei Neon (Region Frankfurt, Gratis-Stufe) und über Vercel angebunden (`DATABASE_URL`).

| Datei | Zweck |
| --- | --- |
| [`schema.sql`](schema.sql) | Tabellen `documents` und `chunks` mit Embedding-Spalte und Indizes |
| [`build_chunks.py`](build_chunks.py) | Wandelt die Dokumente aus `data/` in Text um, liest Metadaten, teilt in Abschnitte → `app/data/chunks.json` und `data/text/` |

## Ablauf Import

1. `python3 db/build_chunks.py` (lokal, nach jeder Änderung an der Wissensbasis) und committen
2. Nach dem Deploy: `/api/admin/ingest?step=schema` (einmalig), dann `/api/admin/ingest?step=data` wiederholen, bis `remaining` 0 ist
3. Nur neue oder geänderte Abschnitte werden neu eingebettet (Hash-Vergleich) – schont das Gratis-Kontingent

Admin-Endpunkte brauchen den `ADMIN_TOKEN` (nur in Vercel hinterlegt).
