# KI-Risiko-Radar: Briefing-Bot

Erstbeurteilung des Projektteams nach der Methode **KI-Risiko-Radar v4.7** (CAS AI Management & Strategy for Financial Services, ZHAW SML; Arbeitsblatt, Legende und Massnahmenkatalog aus dem Unterricht). Stand 20.11.2026.

Beurteilt wird der **Betrieb in der Bank** gemäss [zielbild-betrieb.md](zielbild-betrieb.md); zum Vergleich ist der PoC angegeben. Die Einschätzung ist eine Grundlage für das Gespräch mit den Fachstellen und keine abschliessende Kontrollliste.

## 1. Steckbrief

| | |
| --- | --- |
| **KI-System** | Briefing-Bot: verdichtete, belegte Antworten zu Prozessen und Themen im Zahlungsverkehr, in drei Detailstufen |
| **Owner im Business** | COO (Business Owner gemäss Betriebsmodell) |
| **Zweck und Nutzen** | Mitarbeitende sind schneller vorbereitet, im Meeting entscheidungsfähig und müssen kaum nachrecherchieren |
| **Anbieter, Modell, Hosting** | PoC: Vercel, Neon (Frankfurt), Google Gemini. Betrieb: Azure Switzerland North, Azure AI Search, Sprachmodell über Gateway (Azure OpenAI, EU Data Zone) |
| **Stopp-Check** | Nein. Der PoC arbeitet nur mit fiktiven Daten. Echte Daten erst nach Vertrag, DSFA und Berechtigungs-Audit (Gate 1). |

## 2. Radar

**Art der KI:** Ein Sprachmodell formuliert Texte (Ja), das System nutzt keine Werkzeuge und handelt nicht selbst (Nein). Also **GenAI**, Autonomie 0 bis 3.

| Achse | PoC | Betrieb | Begründung (Betrieb) |
| --- | --- | --- | --- |
| **A · Autonomie** | 0 | **0 keine** | Liefert nur Antworten. Die Person entscheidet und handelt selbst (Typ Recherche-Chat). |
| **B · Daten** | 1 | **2 mittel** | Interne Weisungen, Prozesse und Protokolle, darin auch Namen von Mitarbeitenden. Kundendaten und «Streng vertraulich» sind nicht im Index. |
| **C · Schadenspotenzial** | 1 | **2 mittel** | Antworten fliessen in interne Projekt- und Managemententscheide ein. Keine Entscheide über Personen oder Zahlungen. |
| **D · Angriffsfläche** | 1 | **2 mittel** | Rund 400 Mitarbeitende. Liest Dokumente aus SharePoint, die teilweise auch Externe verfasst haben (z. B. Schnittstellen-Spezifikationen, Protokolle mit Partnern). |

Keine Treiber-Achse auf Stufe 3 oder 4. Das Risiko steigt vom PoC zum Betrieb, weil echte Dokumente aus SharePoint und alle Mitarbeitenden dazukommen.

**Dreieck-Check (Willison 2025):**

| Seite | Ergebnis |
| --- | --- |
| 1 Private Daten (Daten ab 2) | Ja |
| 2 Fremde Inhalte (Angriffsfläche ab 2) | Ja |
| 3 Übermittlung an Dritte | **Nein**, seit 20.11.2026: Antworten zeigen keine Bilder und keine anklickbaren Links mehr. |

Kein gefährliches Dreieck. **Befund aus der Beurteilung:** Bis zum 20.11.2026 hat die Chat-Oberfläche Markdown-Bilder und -Links aus der Modell-Antwort dargestellt. Ein manipuliertes Dokument hätte das Modell dazu bringen können, Inhalte in eine externe Bild-URL zu schreiben, die der Browser beim Anzeigen aufruft. Die dritte Seite war damit offen. Behoben in `app/components/Chat.js` (Massnahme D1/X1). Im Betrieb gilt dieselbe Regel für die Darstellung in Teams.

## 3. Rahmen-Check

| | | Folge (Pflicht) | Fachstelle |
| --- | --- | --- | --- |
| R1 Personendaten | Ja | DSFA vor dem Pilot (MP-05), Information der Mitarbeitenden | Datenschutz |
| R2 Bankkundendaten | Ja (nur als Eingabe möglich) | Kundendaten nicht im Index, Schwärzung in Fragen, Weisung WE-03 | Compliance |
| R3 Externer Anbieter | Ja | Auslagerungsprüfung nach FINMA-RS 2018/3, bestehendes Microsoft-Vertragswerk | Third-Party Risk |
| R4 Daten im Ausland | Ja (Sprachmodell EU Data Zone) | Datenstandort festlegen: Entscheid Geschäftsleitung EU/EFTA oder nur Schweiz | Datenschutz, Legal, Compliance |
| R5 Regulierter Prozess | Nein | Keine KI-Begleitung in Meetings zu GwG-, Fraud-Fällen und Sanktionstreffern (WE-03, MP-05 E2) | – |
| R6 Mitarbeitende betroffen | Ja | Information der Personalkommission (Pendenz MP-05); keine Leistungs- oder Verhaltensauswertung | HR |
| R7 EU-Recht | Nein | – | – |
| Q1 KI-Inventar | immer | Eintrag mit Owner, Zweck, Radar und Massnahmen | Risk Management |

**Einzubindende Fachstellen:** Datenschutz, Compliance (B), Risk Officer (C), CISO sowie Sicherheitsarchitektur und IT-Betrieb (D), Third-Party Risk (R3), Legal (R4), HR (R6).

## 4. Massnahmen

Achse A steht auf 0: keine Pflichtmassnahme. Für die Achsen B, C und D auf Stufe 2 sind Massnahmen optional; wir setzen sie trotzdem um, weil der Bot für alle Mitarbeitenden gedacht ist.

| Achse | Massnahme | Umsetzung | Status |
| --- | --- | --- | --- |
| B | B1 Datenklassen-Regel | «Streng vertraulich» und Kundendaten nicht im Index (Purview-Labels) | vor Pilot |
| B | B2 Need-to-know | Ein Index mit SharePoint-Rechten je Abschnitt; Berechtigungs-Audit (Gate 1) | vor Pilot |
| B | B3 Pseudonymisierung | Schwärzung von IBAN, Karten- und AHV-Nummern sowie E-Mail-Adressen in Fragen | im PoC umgesetzt |
| C | C1 Nur geprüfte Quellen | Quellen mit Kapitel und Owner, Ampel, ohne Quelle kein Grün | im PoC umgesetzt |
| C | C2 Als KI kennzeichnen, Eskalation | Hinweis «KI-generiert – Quellen prüfen», Ansprechstelle bei Gelb und Rot | im PoC umgesetzt |
| C | C3 Qualitätstests | 137 automatische Tests, Live-Regression werktags, fachlicher Testkatalog | im PoC umgesetzt |
| D | D1 / X1 Keine externen Links und Bilder | Antworten ohne Bilder und anklickbare Links | im PoC umgesetzt (20.11.2026) |
| D | D2 Fremde Inhalte als Daten | Dokumente abgegrenzt übergeben, nie als Anweisung | im PoC umgesetzt |
| D | D3 Input- und Output-Filter | Eingangs- und Ausgangskontrolle (`app/lib/guard.js`) | im PoC umgesetzt |
| D | D4 Tests mit manipulierten Eingaben | 47 automatische Schutz-Tests; Penetrationstest | PoC umgesetzt, Pentest vor Go-live |
| D | D5 Keine Geheimnisse im System-Prompt | Regeln ausserhalb des Modells durchsetzen, Prompt-Schutz | im PoC umgesetzt |

## 5. Offene Fragen

- Genügt die Verarbeitung des Sprachmodells in EU/EFTA (R4)? Entscheid der Geschäftsleitung auf Basis der DSFA.
- Wie werden Protokolle mit Namen von Mitarbeitenden im Index behandelt (Löschfristen, Labels)?
- Radar wiederholen, wenn sich Daten, Anbieter, Autonomie oder Nutzerkreis ändern, spätestens vor dem Go-live.
