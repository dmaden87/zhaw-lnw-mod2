# Projektjournal

Chronologie der wichtigsten Arbeiten und Entscheide. Neueste Einträge oben.

## 02.11.2026 – Repository, Infrastruktur, Beta v0.5

| Zeit | Ergebnis | Entscheid / Begründung |
| --- | --- | --- |
| Vormittag | GitHub-Repository `zhaw-lnw-mod2` angelegt, JJ und Peri mit Schreibrechten | Öffentlich lesbar, damit Dozierende ohne Einladung Einsicht haben; keine sensitiven Inhalte |
| | Grundstruktur `app/`, `db/`, `data/`, `docs/`, `tests/` | Code, Daten und Unterlagen an einem Ort, nachvollziehbar versioniert |
| | Vercel-Projekt verbunden (Root Directory `app`), automatisches Deployment bei jedem Push | – |
| | Passwortschutz: zuerst Browser-Dialog, dann Login-Seite | Browser-Dialog erschien nicht in allen Browsern (z. B. In-App-Browser) |
| | Vektordatenbank Neon (PostgreSQL + pgvector) in Frankfurt angebunden | Open Source, EU-Region, Gratis-Stufe; keine Datenbank-Branches pro Vorschau (eine Wissensbasis) |
| | KI-Anbieter: Google Gemini API | Vergleich Vercel AI Gateway / Gemini / Anthropic: Gemini bietet Embeddings und Sprachmodell aus einer Hand, Start ohne Kosten |
| | Modellwahl per Live-Test (`docs/modellwahl.md`) | Neuestes Modell zu langsam (85 s); 3.5 Flash Lite 0,7 s |
| | Wissensbasis aufbereitet: 60 Dokumente → 498 Abschnitte, eingebettet und gespeichert | – |
| | Wechsel auf bezahlte Gemini-Stufe (Prepaid CHF 16) | Gratis-Limit 100 Embeddings/Min. bremste Import und Tests; bezahlte Stufe nutzt Eingaben nicht fürs Training |
| Mittag | Vercel Web Analytics eingebunden | Nutzung messbar machen (KPI «Nutzungsrate» im Canvas) |
| | Chat mit Stufen, kombinierter Suche, Konfidenz-Ampel, Quellen und Vorschlägen live | Beta v0.5; erste Testfragen siehe `docs/loesungsdokumentation.md` |

## 01.11.2026 – Konzept

| Ergebnis | Entscheid / Begründung |
| --- | --- |
| AI-Canvas v0.1 → v0.2 im Interview erarbeitet | Problem, Nutzen (3 Stufen), Ampel, Scope MVP/V1, Risiken, Budget |
| Drei Schnittstellen-Dokumente ergänzt (IF-01 bis IF-03) | Wissensbasis enthielt kaum technische Inhalte; Use Case verlangt fachlich, prozessual und technisch |
| Projektplan und Task-Liste bis 8.11. | Rollen: Peri Projektleitung (Risk & Compliance), JJ Product Manager, Deniz Tech Lead; je 5 Min. Sprechzeit |
| Regulatorische Einordnung | Schweiz: revDSG, FINMA-Erwartungen; EU AI Act nicht direkt anwendbar, freiwillige Orientierung an «begrenztem Risiko» und Art. 50 (Transparenz) |
