# AI-Canvas – «Briefing-Bot»

*Chat-basiertes Tool für komprimierte Informationen zu Prozessen und Themen*

Team: JJ, Peri, Deniz · Version 0.3 · Stand 02.11.2026

## Warum? Problem & Nutzen

### 1. Problem & Ausgangslage

Kernproblem: Mitarbeitende werden laufend mit Anfragen und Aufgaben konfrontiert, für die ihnen das Basiswissen im Moment fehlt – fachlich (z. B. Payment-Ablauf: Autorisierung, Settlement), technisch/architektonisch (Was macht diese Schnittstelle? Welche Datenfelder werden übertragen? Was macht dieses Tool?) und prozessual (Wie läuft der Gesamtprozess?).

Ursachen:
- Menge an Informationen
- Verteilt auf viele Quellen: Mail, Intranet, SharePoint, Confluence, Web u. a.
- Kein schneller, kondensierter und aggregierter Zugriff, um rasch «ready» zu sein
- Ziel ist nicht, Spezifikationen zu erstellen, sondern kurz und qualitativ gut informiert weiterarbeiten zu können

Typische Situationen:
1. Wiederaufgenommenes Thema: «Wir hatten das doch besprochen – du meintest, die Schnittstelle geht.» → Was habe ich damals gesagt/geschrieben? Wurde entschieden? Was machen Schnittstelle und Tool?
2. Teilschritt im Meeting: Ein Prozessschritt wird diskutiert, der Gesamtprozess ist unbekannt → kein Mitsprechen, Expertise bleibt ungenutzt.
3. Neuer Prozess per Mail: Jemand beschreibt einen neuen Ablauf für die Zahlungsabwicklung, der fachliche Payment-Ablauf und bestehende Tools/Prozesse sind aber unbekannt.

Ausmass:
- Betrifft praktisch alle im Unternehmen, je in anderem Kontext; Neue stärker als Langjährige.
- In einem Meeting von 30–45 Min. mit 4–5 Personen muss mindestens 1 Person danach 1–2 Std. zum Basisthema recherchieren.

### 2. Value Proposition

Kondensiertes, quellenbasiertes Wissen genau dann, wenn es gebraucht wird – in 3 Detailstufen:
- INSTANT (Lesezeit 5–10 Sek.): sofort gesprächsbereit – 2–3 Kernsätze
- BASIC (Lesezeit ≤ 3 Min.): noch im Meeting mehr Verständnis – Kernpunkte, Ablauf, Begriffe
- FULL (Lesezeit ≤ 15 Min.): Vor- oder Nachbereitung – Zusammenhänge, beteiligte Tools/Schnittstellen, offene Fragen, Ansprechpersonen

Nutzen:
- Nachrecherche nach Meetings sinkt drastisch (heute 1–2 Std. pro Meeting)
- Alle sprechen «vom Gleichen» → weniger Missverständnisse
- Just-in-time-Lernen: Neue rufen Wissen kompakt ab, wenn sie es brauchen, statt Webinare «auf Halde» zu konsumieren → schneller produktiv
- Jede Aussage mit Quelle und Konfidenz-Ampel (Grün/Gelb/Rot) → nachprüfbar, kein Raten, keine Sackgasse

### 3. Nutzer & Stakeholder

- Praktisch alle Mitarbeitenden, je in anderem Kontext (fachlich, technisch, prozessual)
- Meeting-Teilnehmende (Primärnutzer): schnell auf Stand kommen, aktiv mitreden
- Neue Mitarbeitende: besonders stark betroffen, grösster Hebel beim Onboarding
- Führungskräfte: kompakte Entscheidungsgrundlagen
- Wissens-Owner: pflegen Quelldokumente
- IT / Datenschutz / Compliance: Sicherheit & Governance
- Sponsor: Thomas Brunner, COO (MP-05); Entscheidungsgremium: Geschäftsleitung Gletscherbank

Projektteam (gleichberechtigt):
- Peri – Projektleiterin mit Risk- & Compliance-Fokus (Plan, Governance, DSFA, Regulatorik, Budget)
- JJ – Product Manager, Fachexperte Zahlungsverkehr (Wissensbasis, Use Cases, Testfragen, fachliche Abnahme)
- Deniz – Tech Lead, Umsetzung (Architektur, Web-App, Vektordatenbank, Demo, Business Case)

Nutzungsmomente:
- WÄHREND des Meetings (Hauptzweck) → INSTANT / BASIC
- VOR dem Meeting (Prep) → BASIC / FULL
- NACH dem Meeting (Nachbearbeitung) → FULL

## Was macht die KI? Prediction → Judgment → Action → Outcome

### 4. KI-Aufgabe (Prediction)

- Relevante Dokumentstellen zu einer Frage finden (Retrieval).
- Daraus eine kompakte, quellenbasierte Zusammenfassung erzeugen (Generierung) – wahlweise in der Stufe INSTANT, BASIC oder FULL.
- Konfidenz der Antwort schätzen (Ampel) und bei Unsicherheit Alternativen bzw. Ansprechperson vorschlagen.
- Technik: RAG mit LLM.

### 5. Judgment (menschliche Beurteilung)

Fehlerkosten: Eine falsche Antwort ist fatal – «nichts gefunden» aber ebenso. Daher weder raten noch einfach ablehnen, sondern Sicherheit transparent machen.

Konfidenz-Ampel zu jeder Antwort:
- 🟢 SICHER (≥ 85 %): mehrere übereinstimmende, aktuelle Quellen decken die Frage direkt ab
- 🟡 ZIEMLICH SICHER (60–84 %): nur eine Quelle oder Teilabdeckung → Hinweis, was fehlt
- 🔴 UNSICHER (< 60 %): keine direkte Antwort → «Meinst du vielleicht …?» mit den 2–3 nächstliegenden Themen + zuständige Ansprechperson aus ORG-01 / Dokument-Owner
→ Es gibt nie eine Sackgasse: Jede Antwort zeigt einen Weg weiter.

Berechnung (umgesetzt): Selbsteinschätzung des LLM, begrenzt durch die Qualität der Suchtreffer; bei Widerspruch höchstens Gelb; Zahlen, die nicht in den Quellen stehen → höchstens Gelb; Antworten aus Allgemeinwissen immer Gelb und gekennzeichnet; nicht beantwortete Fragen immer Rot. Bewertungen im Testing-Modus kalibrieren die Ampel für ähnliche Fragen. Schwellen werden mit dem Testset kalibriert.

Widersprüche zwischen Quellen:
- Protokoll vor Transkript (massgebend für Entscheide, vgl. TR-01)
- Neuere Version vor älterer
- Widerspruch wird immer offen angezeigt, Ampel max. Gelb

Verantwortung: Der Mensch entscheidet; der Bot liefert Kontext, keine Entscheidungen.

### 6. Aktion

- Während des Meetings: INSTANT lesen → sofort mitreden und Expertise einbringen; bei Bedarf BASIC für mehr Tiefe.
- Vor dem Meeting: BASIC/FULL als Vorbereitung.
- Nach dem Meeting: FULL statt eigener Nachrecherche; Quelle öffnen, wo nötig.
- Briefing mit Kolleg:innen teilen → gemeinsame Wissensbasis im Team.
- Zugang PoC: Web-App (passwortgeschützt); Zielbild: native Windows-Anwendung, diskret während Meetings per Tastenkürzel aufrufbar.

### 7. Outcome & KPIs

Wirkung (quantitativ):
- Nachrecherche-Aufwand pro Meeting: von heute 1–2 Std. auf < 15 Min. (= Lesezeit FULL)
- Nutzungsrate: Tool wird in ≥ 3 von 5 Meetings genutzt
- Onboarding: kürzere Einarbeitungszeit neuer Mitarbeitender (Befragung Neue + Vorgesetzte)

Wirkung (qualitativ):
- Weniger Missverständnisse, alle sprechen «vom Gleichen» (Kurzumfrage nach Meetings, 1–5)

Qualität Prototyp (Testset):
- Korrektheit ≥ 80 % · korrekte Quellenangabe ≥ 90 % · Halluzinationsrate < 5 %
- Kalibrierung Ampel: 🟢-Antworten ≥ 95 % korrekt; falsche Antworten nie mit 🟢
- Sackgassen-Quote: 0 % Antworten ohne Weiterweg (Alternative oder Ansprechperson)
- Antwortzeit INSTANT < 5 Sek. (Einsatz live im Meeting)
- Einhaltung Lesezeit je Stufe (Länge INSTANT / BASIC / FULL)

Beispielrechnung Business Case: 10 Meetings/Woche × 1 Person × 1,5 Std. Nachrecherche ≈ 15 Std./Woche – Reduktion auf 15 Min. spart ≈ 12,5 Std./Woche (Annahmen im Team validieren)

## Womit? Daten & Lernen

### 8. Input-Daten (Wissensbasis)

Scope:
- MVP (LNW): Unternehmenswissen inkl. Meeting-Protokolle und Transkripte → damit ist auch Situation 1 («Was wurde besprochen/entschieden?») ohne persönliche Mails abgedeckt
- V1 (Roadmap): zusätzlich persönliche Quellen – eigene Mails, Teams-Chats, OneDrive

Demo-Datenbasis: Wissensdatenbank Zahlungsverkehr der fiktiven «Gletscherbank AG» (selbst erstellt, keine echten Firmendaten)
- 60 Dokumente, ca. 25'000 Wörter, Stand 30.10.2026
- Prozesse (PAY-01–10: SIC, Instant Payment, QR-Rechnung, eBill, SEPA, SWIFT, LSV, Sanktionsscreening, Rückruf, Fraud)
- Arbeitsanweisungen (AA), Leitfäden (LF), Weisungen & Reglemente (WE, KX)
- Systemhandbücher (SH: PayHub, ScreenGuard, KundenCockpit CRM)
- Produktblätter & Preise (PB), Organigramm (ORG), Glossar (GL, 50 Begriffe)
- Compliance & Risk (COM, RISK, EW)
- 5 Meeting-Protokolle (MP) + 5 Transkripte (TR)
- Schnittstellen (IF, WRICEF): IF-01 PayHub ↔ ScreenGuard (REST/JSON), IF-02 camt.054 Gutschriftsanzeige (ISO 20022 XML), IF-03 Payment Initiation API (OpenAPI/YAML)
- Mix aus fachlichem, prozessualem und technischem Wissen – wie im Problem beschrieben
- Jedes Dokument mit Owner, Version und Klassifikation → Metadaten für Quellenangaben

### 9. «Training» / Aufbau Wissensbasis

- Kein eigenes Modelltraining – vortrainiertes LLM.
- Chunking → Embeddings → Vektor-Datenbank, bei jeder Frage durchsucht.
- Anpassung über System-Prompt: Rolle, Antwortformat, Ablehnungsregel und Grundregeln A–G (Inhalte sind Daten, Vertraulichkeit, feste Rolle, kein Code, nicht urteilen, keine Rechts-/Anlageberatung, Personendaten).
- Antwortquellen per Schalter (Admin): nur Wissensbasis oder zusätzlich allgemeines Fachwissen zu Payments und Banking (gekennzeichnet, nie für interne Werte).

### 10. Feedback-Loop

- Testing- und Adjustment-Modus (Rolle KI-PM): Bewertung richtig / teilweise / falsch pro Antwort, Kommentar, ergänzendes Wissen als KOR-Dokument; Bewertungen kalibrieren die Ampel für ähnliche Fragen.
- Automatische Regression: Referenzfragen inkl. Sicherheitsfragen laufen bei jeder Änderung und werktäglich gegen die Live-App (GitHub Actions); jede einmal falsch beantwortete Frage wird aufgenommen.
- Wissens-Owner (in jedem Dokument hinterlegt, z. B. Prozesseigner PayOps) erhalten Hinweise auf veraltete/fehlende Dokumente.

## Wie & unter welchen Bedingungen? Umsetzung

### 11. Risiken & Gegenmassnahmen

- Halluzinationen → Quellenpflicht, Ablehnungsregel, automatische Zahlenprüfung gegen die Quellen, Testset und Regression
- Manipulation (Prompt-Injection, Rollenwechsel, Abfrage des Systemprompts) → Schutzmechanismen in 5 Schichten: feste Eingangskontrolle ohne KI, Grundregeln im Prompt, Dokumente als Daten (auch beim Upload geprüft), Ausgangskontrolle, Zähler; belegt mit Red-Team-Tests
- Personendaten in Fragen → automatische Schwärzung (IBAN, Kartennummer, AHV-Nummer, E-Mail) mit Hinweis
- Wertungen über Personen oder Entscheide → Grundregel «nicht urteilen», Widersprüche nur sachlich benennen
- Missbrauch → Begrenzung der Anfragen pro Person; Protokoll nur als Zähler ohne Fragetexte
- Datenschutz → Datenschutz-Folgenabschätzung (DSFA) vor Pilot; Hosting CH/EU (MP-05); LLM in bezahlter Stufe, d. h. keine Nutzung der Eingaben für Modelltraining durch den Anbieter
- Zu breite Berechtigungen (offene SharePoint-Sites) → Berechtigungs-Audit als Gate 1 vor Pilotstart (MP-05, E4)
- Sensible Meetings → keine KI-Begleitung bei Personalfragen, GwG-/Fraud-Fällen und Sanktionstreffern (MP-05, E2; WE-03)
- Transkripte → Löschung nach 30 Tagen, kein Rohaudio (MP-05, E3)
- V1 persönliche Daten → jede Person sieht nur, worauf sie ohnehin Zugriff hat; Single Sign-On statt Passwort
- PoC-Zugang mit eigener Benutzerverwaltung (Rollen User, Super-User, KI-PM, Admin) → zulässig, weil ausschliesslich fiktive Demo-Daten; keine echten Daten hochladen
- Veraltete Infos → Version/Stand der Quelle anzeigen, Pflegeprozess mit Ownern
- Übervertrauen → Hinweis «KI-generiert, Quelle prüfen»; bei Widerspruch Protokoll vor Transkript
- Ablenkung im Meeting → INSTANT bewusst kurz halten
- Regulatorik → Einschätzung (Vorschlag, durch Peri zu prüfen):
    - Schweiz: kein KI-spezifisches Gesetz; massgebend sind revDSG (u. a. DSFA), Bankkundengeheimnis und FINMA-Erwartungen an Governance und Risikomanagement beim KI-Einsatz. Vernehmlassungsvorlage zur Umsetzung der Europarats-KI-Konvention ist erst für Ende 2026 angekündigt.
    - EU AI Act: nicht direkt anwendbar (rein interner Einsatz in der Schweiz, kein EU-Bezug). Freiwillige Orientierung: «begrenztes Risiko» – der Bot entscheidet nicht über Personen, Kredite oder Anstellungen, sondern liefert Kontext. Daraus übernehmen wir die Transparenzpflicht nach Art. 50 (gilt in der EU seit 2.8.2026): klar erkennbar, dass es eine KI ist, und KI-generierte Antworten werden gekennzeichnet.
    - Begleitmodus in Meetings: Mitarbeitende werden informiert (Personalkommission, MP-05), keine Emotions- oder Leistungsauswertung.

### 12. Kosten & Aufwand

PoC (LNW, Nov.–Dez. 2026): effektiv ca. CHF 16 – Prepaid-Guthaben Gemini API (bezahlte Stufe); Vercel, GitHub und Vektordatenbank im Gratis-Kontingent; Aufwand Team 3 × 70 Std.

Simulierter Budgetantrag an die Geschäftsleitung (fiktiv, alle Werte Annahmen):
- PoC: interne Aufwände 210 Std. × CHF 100 = CHF 21'000
- Pilot (Q1 2027, 25 Personen): Windows-Client & SSO CHF 18'000 · Hosting/LLM/Datenbank CH/EU CHF 1'500 · DSFA & Berechtigungs-Audit CHF 8'000 · Projektleitung & Change CHF 10'000 · Reserve 10 % → total ≈ CHF 41'000
- Rollout (ab Q2 2027, ca. 400 Mitarbeitende), laufend pro Jahr: LLM/Hosting/Datenbank CHF 15'000 · Betrieb 0,15 FTE CHF 22'500 · Content-Pflege 0,1 FTE CHF 15'000 → ≈ CHF 52'500 p. a.

Nutzen (konservativ): 400 MA × 1 Std./Woche × 45 Wochen × CHF 100 = CHF 1,8 Mio. Zeitwert; bei nur 25 % Realisierung ≈ CHF 450'000 p. a. → Amortisation < 1 Jahr
Details: Budgetplan im Repository

### 13. Technische Umsetzung

Entscheid Make-or-Buy für den PoC: MAKE – eigene Web-App, entwickelt mit KI-Unterstützung (Claude von Anthropic, Modell Claude Opus 5.5; siehe docs/ki-einsatz.md)
- Frontend & API: Next.js, gehostet auf Vercel; Code auf GitHub
- Zugang: Login mit Rollen User / Super-User / KI-PM / Admin (ausreichend, da ausschliesslich gemockte Daten der fiktiven Gletscherbank)
- Wissensbasis: 60 Dokumente → Chunking → Embeddings → Open-Source-Vektordatenbank PostgreSQL + pgvector (Kernbestandteil der Lösung); Suche kombiniert semantisch + Volltext, Metadaten (Owner, Version, Klassifikation) pro Chunk
- LLM: Google Gemini API (bezahlte Stufe, Prepaid) – Embedding: gemini-embedding-2; Antworten: gemini-3.5-flash-lite (Instant/Basic), gemini-3.5-flash (Full); Details docs/modellwahl.md
- Antwortlogik: Detailstufe (INSTANT/BASIC/FULL, alle drei parallel), Quellenangaben, Konfidenz-Ampel
- Schutzmechanismen: 5 Schichten, Schalter Allgemeinwissen (docs/loesungsdokumentation.md, Kapitel 6b)
- Qualität: 137 automatisierte Tests, Live-Regression mit 24 Referenz- und Sicherheitsfragen (docs/testkonzept.md)

Etappen:
- PoC (LNW): Web-App
- Pilot / V1: Anbindung persönliche Quellen (Mail, Teams, OneDrive), Single Sign-On
- Zielbild: native Windows-Anwendung (Plugin/Desktop-Client, z. B. per Tastenkürzel im Meeting aufrufbar)

Details: Architekturskizze im Repository.

## Verweise & Notizen

### 14. Verweise im Repository

- /data/Wissensdatenbank_Payment/ – 60 Quelldokumente der Gletscherbank AG
- /data/Wissensdatenbank_Payment/Schnittstellen/ – IF-01 bis IF-03 (WRICEF, camt.054, OpenAPI)
- /data/Wissensdatenbank_Payment/Meetings/MP-05 – Projektsteuerung KI-Wissensassistent (Entscheide E1–E5)
- /docs/project-charter.md – Ziele, Scope, Rollen
- /docs/architektur.png – Architekturskizze
- /tests/regression.json – Referenz- und Sicherheitsfragen der automatischen Regression; fachlicher Testkatalog (JJ)
- /docs/testkonzept.md – Testebenen und Ergebnisse
- /docs/erkenntnisse.md – Erkenntnisse für Präsentation und Reflexion
- /docs/ki-einsatz.md – Deklaration KI-Einsatz (Claude Opus 5.5)
- /docs/risiko-register.md – Risiken und Massnahmen
- /docs/gantt.xlsx – Zeitplan bis Rollout
- /docs/budget.xlsx – Budgetplan PoC / Pilot / Rollout (fiktiv)
- /app/ – Code der Web-App (Next.js, Vercel)

### 15. Notizen / offene Fragen

Pitch-Rahmen: Projektteam der Gletscherbank präsentiert der Geschäftsleitung den PoC und beantragt den Pilot (Go/No-Go Rollout Ende März 2027, MP-05). Ausblick: Lösung als Produkt für weitere Banken (Option).

Ablauf 15 Min. (je 5 Min. pro Person):
- Deniz: Problem & Vision (1,5') + Live-Demo (3,5')
- JJ: Use Cases, Wissensbasis & Schnittstellen (3') + Testergebnisse & Konfidenz-Ampel (2')
- Peri: Risiken & Governance (3') + Roadmap, Budget & Antrag an GL (2')

Meilensteine:
- M1 So 8.11.: Repo, Project Charter, Testfragen-Katalog v1
- M2 Sa 14.11.: Wissensbasis eingefroren (vor JJ-Ferien), PoC v0.1 (Dokumente in Vektor-DB, einfache Fragen)
- M3 So 22.11.: PoC v0.5 komplett (Stufen, Ampel, Quellen); Risiko-Register, EU-AI-Act-Einstufung, Gantt, Budget
- M4 So 29.11.: Testlauf mit Ergebnissen; Folien v1
- M5 Di 1.12.: Generalprobe 1 (mit Zeitmessung)
- M6 Do 3.12.: Generalprobe 2, Backup-Video, Repo eingefroren
- Fr 4.12.: LNW 2

JJ abwesend 15.–26.11. · Details: Projektplan (Doc) und Task-Liste bis 8.11.
