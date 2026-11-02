Gletscherbank AG · Wissensdatenbank Compliance & Risk

RISK-01 Incident-Management und Erfassung operationeller Verluste

|                     |                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------|
| **Prozess-ID**      | RISK-01                                                                                                  |
| **Prozesseigner**   | Operational Risk (Roland Suter)                                                                          |
| **Systeme**         | Incident-Tool (OpRisk-Modul), IT-Service-Management, Fallmanagement                                      |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                         |
| **Klassifikation**  | Intern                                                                                                   |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Interne Zeiten, Limiten und Kontakte sind erfunden. |

# 1. Zweck und Geltungsbereich

Dieser Prozess regelt, wie operationelle Vorfälle (Fehler, Systemausfälle, Betrug, Cyberangriffe, Datenpannen) gemeldet, bewertet, behoben und als Verlustdaten erfasst werden. Er setzt die Anforderungen des FINMA-Rundschreibens 2023/1 «Operationelle Risiken und Resilienz – Banken» um.

# 2. Begriffe

| **Begriff**     | **Erklärung**                                                                                                        |
|-----------------|----------------------------------------------------------------------------------------------------------------------|
| Incident        | Ereignis, das zu einem Verlust, Beinahe-Verlust, Kundenschaden oder Unterbruch geführt hat oder hätte führen können. |
| Beinahe-Verlust | Vorfall ohne finanziellen Schaden, z. B. rechtzeitig entdeckte Fehlbuchung.                                          |
| Schweregrad     | Einstufung 1 (gering) bis 4 (kritisch), bestimmt Meldewege und Fristen.                                              |
| Root Cause      | Grundursache eines Vorfalls.                                                                                         |
| Massnahme       | Aktion, um die Ursache zu beheben und Wiederholung zu verhindern.                                                    |

# 3. Rollen und Verantwortlichkeiten

| **Rolle**              | **Aufgabe**                                                                    |
|------------------------|--------------------------------------------------------------------------------|
| Mitarbeitende          | Melden Vorfälle sofort (LF-07).                                                |
| Incident Owner (Linie) | Teamleitung der betroffenen Einheit; behebt und dokumentiert.                  |
| Operational Risk       | Prüft Einstufung, Ursachen und Massnahmen; Reporting.                          |
| CRO / Geschäftsleitung | Werden bei Schweregrad 3 und 4 informiert; entscheiden über externe Meldungen. |

# 4. Prozessablauf

| **Nr.** | **Schritt**             | **Beschreibung**                                                                                                                | **Verantwortlich**           | **System**    |
|---------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------|------------------------------|---------------|
| 1       | Melden                  | Vorfall im Incident-Tool erfassen: was, wann, betroffene Kunden, geschätzter Schaden. Bei Dringlichkeit zusätzlich telefonisch. | Mitarbeitende                | Incident-Tool |
| 2       | Einstufen               | Schweregrad gemäss Matrix (EW-01) setzen; bei Grad 3–4 sofort Eskalation.                                                       | Incident Owner               | Incident-Tool |
| 3       | Sofortmassnahmen        | Schaden begrenzen: Zahlungen stoppen, Kunden informieren, System isolieren.                                                     | Incident Owner / Fachstellen | je nach Fall  |
| 4       | Ursache analysieren     | Root Cause bestimmen (Prozess, Mensch, System, extern).                                                                         | Incident Owner               | Incident-Tool |
| 5       | Massnahmen festlegen    | Massnahmen mit verantwortlicher Person und Termin erfassen.                                                                     | Incident Owner               | Incident-Tool |
| 6       | Prüfen und abschliessen | Operational Risk prüft Vollständigkeit; Verlust buchhalterisch erfassen; Abschluss nach Umsetzung der Massnahmen.               | Operational Risk             | Incident-Tool |

# 5. Fristen, Cut-off-Zeiten und Kennzahlen

- Erfassung: innert 24 Stunden nach Entdeckung; Grad 3–4 sofort telefonisch.

- Root-Cause-Analyse: innert 10 Bankwerktagen.

- Massnahmen: Termin gemäss Risiko; überfällige Massnahmen werden monatlich an den CRO rapportiert.

# 6. Kontrollen und Compliance

- Monatlicher Abgleich Incident-Tool mit Buchhaltungskonto «Operationelle Verluste».

- Quartalsweise Auswertung nach Ursachen und Trends an Geschäftsleitung und Risikoausschuss.

- Beinahe-Verluste werden gleich erfasst wie Verluste.

# 7. Ausnahmen und Eskalation

- Grad 3–4, Cyberangriff, Datenpanne mit Kundendaten: Meldewege gemäss EW-01 (inkl. Prüfung Meldung an FINMA und EDÖB).

- Betrugsverdacht: zusätzlich Fraud Desk (PAY-10).

# 8. Häufige Fragen (FAQ)

**Frage: Muss ich auch einen Fehler melden, der keinen Schaden verursacht hat?**

Antwort: Ja. Beinahe-Verluste sind wichtig, um Schwachstellen früh zu erkennen.

**Frage: Wird mir ein gemeldeter Fehler angelastet?**

Antwort: Nein. Die Meldung wird unterstützt; nur Verschweigen ist ein Verstoss (KX-01).

**Frage: Wer entscheidet, ob die FINMA informiert wird?**

Antwort: Der CRO zusammen mit der Geschäftsleitung, auf Antrag von Operational Risk und Compliance.

# 9. Ansprechstellen

Operational Risk intern 4800, oprisk@gletscherbank.example

# 10. Externe Referenzen

- [MME: Totalrevision FINMA-Rundschreiben 2023/1](https://www.mme.ch/en/magazine/articles/total-revision-of-finma-circular-2023-1-operational-risks-and-resilience-banks)
