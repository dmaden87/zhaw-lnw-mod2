Gletscherbank AG · Wissensdatenbank Zahlungsverkehr

PAY-05 SEPA-Überweisung und SEPA Instant in EUR

|                     |                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------|
| **Prozess-ID**      | PAY-05                                                                                                   |
| **Prozesseigner**   | Payment Operations (PayOps)                                                                              |
| **Systeme**         | E-Banking, PayHub, euroSIC / SEPA-Clearing, Screening-Engine                                             |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                         |
| **Klassifikation**  | Intern                                                                                                   |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Interne Zeiten, Limiten und Kontakte sind erfunden. |

# 1. Zweck und Geltungsbereich

Dieser Prozess regelt EUR-Zahlungen in den SEPA-Raum gemäss den Regeln des European Payments Council (EPC). Er umfasst SEPA Credit Transfer (SCT) und, soweit die Gletscherbank teilnimmt, SEPA Instant Credit Transfer (SCT Inst).

# 2. Begriffe

| **Begriff**                 | **Erklärung**                                                                            |
|-----------------------------|------------------------------------------------------------------------------------------|
| SEPA                        | Single Euro Payments Area: einheitlicher Euro-Zahlungsraum.                              |
| SCT / SCT Inst              | SEPA-Überweisung bzw. SEPA-Echtzeitüberweisung.                                          |
| SHA                         | Gebührenteilung: Auftraggeber und Empfänger tragen je ihre Bankspesen; bei SEPA Pflicht. |
| Verification of Payee (VoP) | Abgleich von Empfängername und IBAN vor der Freigabe; EPC-Regelwerk seit Oktober 2025.   |

# 3. Rollen und Verantwortlichkeiten

| **Rolle**             | **Aufgabe**                                    |
|-----------------------|------------------------------------------------|
| Kunde                 | Erfasst EUR-Zahlung mit IBAN und Name.         |
| PayHub                | Prüft SEPA-Fähigkeit, Format und Spesenoption. |
| Compliance Sanktionen | Bearbeitet Screening-Treffer.                  |

# 4. Prozessablauf

| **Nr.** | **Schritt**             | **Beschreibung**                                                                                                                    | **Verantwortlich** | **System**       |
|---------|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------|--------------------|------------------|
| 1       | Zahlung erfassen        | Kunde erfasst EUR-Betrag, IBAN, Empfängername und strukturierte Adresse.                                                            | Kunde              | E-Banking        |
| 2       | SEPA-Prüfung            | PayHub prüft, ob Empfängerbank SEPA-erreichbar ist (BIC-Verzeichnis). Sonst Weiterleitung als SWIFT-Zahlung (PAY-06).               | System             | PayHub           |
| 3       | Empfängerabgleich (VoP) | Wo angeboten: Anzeige «Übereinstimmung», «teilweise Übereinstimmung» oder «keine Übereinstimmung». Kunde entscheidet über Freigabe. | Kunde / System     | E-Banking        |
| 4       | Screening und Belastung | Sanktions- und Fraud-Screening, Belastung in CHF oder EUR-Konto (mit Devisenkurs).                                                  | System             | Screening-Engine |
| 5       | Versand                 | Einlieferung ins SEPA-Clearing (SCT) bzw. Echtzeitsystem (SCT Inst).                                                                | System             | Clearing-Gateway |
| 6       | R-Transaktionen         | Rückweisungen und Rückgaben (z. B. Konto aufgelöst) werden automatisch gutgeschrieben und dem Kunden gemeldet.                      | System / PayOps    | PayHub           |

# 5. Fristen, Cut-off-Zeiten und Kennzahlen

- SCT: Gutschrift beim Empfänger in der Regel am nächsten Bankwerktag (D+1).

- SCT Inst: Gutschrift innert Sekunden, 24/7.

- Interner Cut-off SCT: 14:00 Uhr (Gletscherbank-interne Vorgabe).

# 6. Kontrollen und Compliance

- Nur Spesenoption SHA zulässig; andere Optionen werden auf SHA gesetzt.

- Devisenkurse gemäss tagesaktuellem Kursblatt; Abweichungen ab 0,5 % werden von Treasury geprüft.

- VoP-Ergebnis wird mit dem Auftrag gespeichert (Nachweis bei Betrugsfällen).

# 7. Ausnahmen und Eskalation

- Rückgabe mit unklarem Grund: PayOps klärt mit Empfängerbank, Information an Kunde innert 2 Bankwerktagen.

- Betrugsverdacht nach VoP-Warnung: Fraud Desk (PAY-10).

# 8. Häufige Fragen (FAQ)

**Frage: Warum zeigt das E-Banking «keine Übereinstimmung» beim Namen?**

Antwort: Der eingegebene Name passt nicht zum Kontoinhaber der IBAN. Bitte Angaben beim Empfänger prüfen; bei Freigabe trotz Warnung trägt der Kunde das Risiko einer Fehlüberweisung.

**Frage: Wer bezahlt die Spesen?**

Antwort: Bei SEPA gilt immer SHA: Jede Seite trägt die Gebühren ihrer eigenen Bank.

# 9. Ansprechstellen

PayOps International intern 4430

# 10. Externe Referenzen

- [EPC: Verification of Payee Scheme](https://www.europeanpaymentscouncil.eu/what-we-do/other-schemes/verification-payee)
