# Tests

| Was | Wo | Verantwortlich |
| --- | --- | --- |
| Automatisierte Unit- und API-Tests | [`app/tests/`](../app/tests/), `cd app && npm test` | Deniz |
| Referenzfragen für die Live-Regression | [`regression.json`](regression.json), `npm run test:live` | JJ ergänzt, Deniz pflegt |
| Fachliches Testing | Testing-Modus in der App (Rolle KI-PM), Export `/api/admin/ratings?format=csv` | JJ, Auswertung mit Peri |

Vorgehen und Ergebnisse: [docs/testkonzept.md](../docs/testkonzept.md)

## Fachlicher Testkatalog (JJ)

- **Testfragen-Katalog v1** (bis 8.11.): 30 Fragen, je 10 fachlich, prozessual und technisch (Schnittstellen), inkl. 3 Grenzfälle
- **Pro Frage:** Soll-Antwort, Quelle(n) aus `data/`, erwartete Ampel (Grün, Gelb, Rot)
- **Zielwerte:** Korrektheit ≥ 80 %, korrekte Quellenangabe ≥ 90 %, Halluzinationsrate < 5 %, Grün-Antworten ≥ 95 % korrekt, keine Antwort ohne Weiterweg
- Wichtige oder einmal falsch beantwortete Fragen zusätzlich in `regression.json` aufnehmen; dann prüft die Automatik sie bei jeder Änderung
