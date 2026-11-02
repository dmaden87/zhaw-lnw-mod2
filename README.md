# Briefing-Bot – LNW 2, CAS ZHAW Modul 2

KI-Briefing-Bot für die fiktive **Gletscherbank AG**: Mitarbeitende erhalten in Meetings in Sekunden kompaktes, quellenbasiertes Wissen zu Prozessen, Schnittstellen und Fachthemen – in drei Stufen (Instant, Basic, Full) und mit Konfidenz-Ampel.

> Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Alle Namen, Zahlen, Systeme und Kontakte sind erfunden. Keine echten Daten.

**Team:** Peri (Projektleiterin, Risk & Compliance) · JJ (Product Manager, Fachexperte Zahlungsverkehr) · Deniz (Tech Lead)
**Präsentation:** 4. Dezember 2026
**Status:** Beta v0.5 live seit 02.11.2026 – [Lösungsdokumentation](docs/loesungsdokumentation.md) · [Testkonzept](docs/testkonzept.md) · [Projektjournal](docs/journal.md)

[![Tests](https://github.com/dmaden87/zhaw-lnw-mod2/actions/workflows/tests.yml/badge.svg)](https://github.com/dmaden87/zhaw-lnw-mod2/actions/workflows/tests.yml)

> **KI-Einsatz:** Erarbeitet mit Unterstützung von **Claude (Anthropic), Modell Claude Opus 5.5**: Code, Dokumentation, Tests und Moderation des AI-Canvas. Entscheide, Inhalte und Prüfung liegen beim Team. Details: [Deklaration KI-Einsatz](docs/ki-einsatz.md).

## Struktur

| Ordner | Inhalt |
| --- | --- |
| [`app/`](app/) | Web-App (Next.js), Deploy über Vercel, Login mit Rollen; automatisierte Tests in `app/tests/` |
| [`db/`](db/) | Datenbankschema (PostgreSQL + pgvector) und Import-Skripte |
| [`data/`](data/) | Wissensdatenbank Zahlungsverkehr der Gletscherbank (60 Dokumente inkl. Schnittstellen) |
| [`docs/`](docs/) | AI-Canvas, Lösungsdokumentation, Testkonzept, Deklaration KI-Einsatz, Journal (+ PDFs) |
| [`tests/`](tests/) | Referenzfragen für die Live-Regression, fachlicher Testkatalog (JJ) |
| [`.github/`](.github/workflows/tests.yml) | GitHub Actions: Tests bei jedem Push, Live-Regression werktags |

## Lösung auf einen Blick

- **Wissensbasis:** Dokumente → Abschnitte (Chunks) → Embeddings → Vektordatenbank PostgreSQL + pgvector
- **Antwort:** relevante Abschnitte finden, Antwort in der gewählten Stufe erzeugen, Quellen und Konfidenz-Ampel (Grün/Gelb/Rot) anzeigen
- **Zugang PoC:** Web-App auf Vercel mit Benutzern und Rollen (User, Super-User, KI-PM, Admin); Zielbild: native Windows-Anwendung
- **Sicherheit:** Schutzmechanismen in 5 Schichten (Manipulation, Systemprompt, Code, Personendaten, Urteile, Zahlenprüfung), Schalter für Allgemeinwissen
- **Qualität:** 134 automatisierte Unit- und API-Tests, Live-Smoke und Regression mit Referenzfragen, Testing-Modus für das fachliche Testing

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
cp .env.example .env.local   # ADMIN_PASSWORD, SESSION_SECRET usw. setzen
npm install
npm run dev
npm test                     # automatisierte Tests
```

Zugangsdaten (Passwort, Datenbank, LLM) gehören nie ins Repository, sondern in `.env.local` bzw. in die Environment Variables von Vercel.
