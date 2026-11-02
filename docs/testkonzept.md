# Testkonzept und Testautomatisierung

**Stand:** 02.11.2026 · **Verantwortlich:** Deniz (technisch), JJ (fachlich), Peri (Auswertung)

## 1. Übersicht

| Ebene | Was wird geprüft | Wie | Wann |
| --- | --- | --- | --- |
| **1. Unit-Tests** | Rechenlogik ohne Netz: Ampel, Kalibrierung, Weiterweg bei Gelb/Rot, Längenvorgabe, Aufteilen in Abschnitte, Dateiprüfung, Sitzung, Passwort-Hashes, Rollenmodell, Quellen-Links | Vitest, `app/tests/unit/` | bei jedem Push (GitHub Actions) |
| **2. API-Tests** | Zugangsschutz (Proxy), Login, Rechte je Rolle für alle schreibenden Funktionen, Eingabeprüfung der Benutzerverwaltung; Datenbank und KI werden simuliert | Vitest, `app/tests/api/` | bei jedem Push |
| **3. Build** | App lässt sich fehlerfrei bauen | `next build` | bei jedem Push |
| **4. Live-Smoke** | Produktion erreichbar, ohne Anmeldung gesperrt, Admin-API nur mit Token, falsches Passwort abgewiesen, Datenbank gefüllt | `app/tests/live/run.mjs` | nach jedem Push (nach dem Deployment) und werktags um 06:17 Uhr |
| **5. Live-Regression** | Referenzfragen gegen die echte App: richtige Quelle, erlaubte Ampelfarbe, Pflichtbegriffe, Länge je Stufe, nie eine Sackgasse | `tests/regression.json` + `run.mjs` | wie Smoke |
| **6. Fachliches Testing** | Korrektheit, Vollständigkeit, Halluzinationen und Kalibrierung der Ampel anhand des Testkatalogs | JJ im Testing-Modus der App, Export als CSV | bis M4 (29.11.) |

Die Ebenen 1 bis 5 laufen automatisch, Ebene 6 ist manuell und fachlich. Befunde aus Ebene 6 werden als Referenzfragen in Ebene 5 übernommen. So bleibt ein einmal behobener Fehler behoben.

## 2. Ausführen

```bash
cd app
npm test                       # Ebenen 1–2 (ca. 3 s, ohne Internet und Zugangsdaten)
npm run test:watch             # während der Entwicklung
BASE_URL=https://zhaw-lnw-mod2.vercel.app ADMIN_TOKEN=… npm run test:live   # Ebenen 4–5
ONLY=R01,R11 … npm run test:live                                           # nur einzelne Fragen
```

**GitHub Actions** (`.github/workflows/tests.yml`) läuft automatisch bei jedem Push und Pull Request, werktags am Morgen und auf Knopfdruck über Actions → Tests → Run workflow. Für die Live-Tests braucht das Repository das Secret `ADMIN_TOKEN`. Fehlt es, werden die Live-Tests mit einer Warnung übersprungen. Den Bericht gibt es als Download `live-bericht` beim jeweiligen Lauf.

## 3. Referenzfragen erweitern (für JJ)

Datei [`tests/regression.json`](../tests/regression.json), ein Eintrag pro Frage:

```json
{ "id": "R13", "kategorie": "Prozess", "frage": "…", "level": "basic",
  "expect_docs": ["PAY-02"], "lights": ["green", "yellow"], "must_contain": ["SIC5"] }
```

- `expect_docs`: mindestens eine dieser Quellen muss genannt sein; leer bei Fragen ausserhalb der Wissensbasis
- `lights`: erlaubte Ampelfarben
- `must_contain`: Begriffe, die in der Antwort stehen müssen, zum Beispiel Fristen oder Beträge
- `bekannt`: dokumentierter, noch offener Befund. Er wird gemeldet, lässt den Lauf aber nicht scheitern.

Faustregel: Eine Frage wird hier aufgenommen, wenn sie für die Präsentation wichtig ist oder schon einmal falsch beantwortet wurde.

## 4. Ergebnisse 02.11.2026

**Unit- und API-Tests:** 84 von 84 bestanden. Build erfolgreich, auch in GitHub Actions.

**Live-Regression (12 Referenzfragen), erster Lauf:**

| ID | Frage (gekürzt) | Ergebnis | Befund |
| --- | --- | --- | --- |
| R01 | Ablauf Instant Payment (Basic) | 🟢 100, PAY-02/PB-02 | ✘ Antwort nur 1 Satz (15 Wörter) statt 150–250 → **behoben** |
| R02 | Timeout PayHub ↔ ScreenGuard | 🟢 100, IF-01 | ✔ 800 ms Instant, 5 s Standard |
| R03 | Inhalt camt.054 | 🟢 95, IF-02, PAY-03, AA-05, PB-01 | ✔ |
| R04 | Authentifizierung Payment Initiation API | 🔴 40, IF-03 | ⚠ OAuth2/mTLS steht in IF-03, wird aber als «nicht beschrieben» gewertet → **bekannter Befund**, Backlog |
| R05 | Ablösung LSV+ | 🟢 100, PAY-07, MP-02 | ✔ 30.09.2028 |
| R06 | Sanktionsalarm Level 1 | 🟡 84, AA-03, SH-02, PAY-08 | ✔ Gelb wegen mittlerer Suchtreffer, Ansprechstelle genannt |
| R07 | Sofortmassnahmen Betrugsverdacht | 🟢 100, LF-02, AA-04, PAY-10 | ✔ |
| R08 | Preis SEPA-Überweisung Privatkunden | 🟢 100, PB-01 | ✔ CHF 2.00 |
| R09 | Verdachtsmeldung MROS | 🟢 100, WE-01, COM-02 | ✔ |
| R10 | Zuständigkeit PayHub | 🟢 95, SH-01, ORG-01 | ✔ |
| R11 | Hypothekarzins (nicht in Wissensbasis) | 🔴 0 | ✘ ehrlich «nicht im Kontext», aber **ohne Vorschläge und Ansprechstelle** (Sackgasse) → **behoben** |
| R12 | Fussball-WM (themenfremd) | 🔴 0 | ✔ 3 Vorschläge, Ansprechstelle |

**Korrekturen aus dem Lauf (live seit 02.11., 14:04 Uhr, Commit `16e0f1b`):**

- **Nie eine Sackgasse:** Gibt das Modell bei Gelb oder Rot keinen Weiterweg an, ergänzt die App feste Vorschläge und die Ansprechstelle gemäss Organigramm (ORG-01). Nachtest R11: 3 Vorschläge und eine Ansprechstelle.
- **Längenvorgabe:** Ist eine Basic- oder Full-Antwort trotz guter Datenlage zu kurz (Basic unter 80, Full unter 300 Wörtern), wird sie einmal neu erzeugt. Das kostet etwa 2 Sekunden und betrifft nur diese Fälle. Nachtest R01: 136 Wörter, 5 Stichpunkte.

**Ergebnis nach Korrektur:** 11 von 12 bestanden, 1 bekannter Befund (R04).

## 5. Grenzen

- Die Live-Tests prüfen Form und Quellen, aber nicht die fachliche Richtigkeit jedes Satzes. Das leistet das fachliche Testing (Ebene 6).
- Antworten eines Sprachmodells schwanken leicht. Die Regression lässt deshalb Bandbreiten zu, zum Beispiel Grün oder Gelb, und mehrere mögliche Quellen.
- Jeder Live-Lauf kostet einige Rappen Gemini-Guthaben (12 Fragen, rund 25 Modellaufrufe).
