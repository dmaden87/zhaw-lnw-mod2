# Briefing-Bot – LNW 2, CAS ZHAW Modul 2

KI-Briefing-Bot für die fiktive **Gletscherbank AG**: Mitarbeitende erhalten in Meetings in Sekunden kompaktes, quellenbasiertes Wissen zu Prozessen, Schnittstellen und Fachthemen – in drei Stufen (Instant, Basic, Full) und mit Konfidenz-Ampel.

> Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Alle Namen, Zahlen, Systeme und Kontakte sind erfunden. Keine echten Daten.

**Team:** Peri (Projektleiterin, Risk & Compliance) · JJ (Product Manager, Fachexperte Zahlungsverkehr) · Deniz (Tech Lead)
**Präsentation:** 4. Dezember 2026

## Struktur

| Ordner | Inhalt |
| --- | --- |
| [`app/`](app/) | Web-App (Next.js), Deploy über Vercel, passwortgeschützt |
| [`db/`](db/) | Datenbankschema (PostgreSQL + pgvector) und Import-Skripte |
| [`data/`](data/) | Wissensdatenbank Zahlungsverkehr der Gletscherbank (60 Dokumente inkl. Schnittstellen) |
| [`docs/`](docs/) | AI-Canvas, Project Charter, Projektplan, Risiken, Budget, Folien |
| [`tests/`](tests/) | Testset mit Soll-Antworten und Auswertungen |

## Lösung auf einen Blick

- **Wissensbasis:** Dokumente → Abschnitte (Chunks) → Embeddings → Vektordatenbank PostgreSQL + pgvector
- **Antwort:** relevante Abschnitte finden, Antwort in der gewählten Stufe erzeugen, Quellen und Konfidenz-Ampel (Grün/Gelb/Rot) anzeigen
- **Zugang PoC:** Web-App auf Vercel mit Demo-Passwort; Zielbild: native Windows-Anwendung

## Meilensteine

| Datum | Meilenstein |
| --- | --- |
| So 8.11. | M1 Repository, Project Charter, Testfragen-Katalog v1 |
| Sa 14.11. | M2 Wissensbasis eingefroren, PoC v0.1 |
| So 22.11. | M3 PoC v0.5 komplett, Risiko-Register, Gantt, Budget |
| So 29.11. | M4 Testauswertung, Folien v1 |
| Di 1.12. / Do 3.12. | M5/M6 Generalproben, Repository eingefroren |
| Fr 4.12. | LNW 2 Präsentation |

## Lokal starten (für Entwicklung)

```bash
cd app
cp .env.example .env.local   # DEMO_PASSWORD setzen
npm install
npm run dev
```

Zugangsdaten (Passwort, Datenbank, LLM) gehören nie ins Repository, sondern in `.env.local` bzw. in die Environment Variables von Vercel.
