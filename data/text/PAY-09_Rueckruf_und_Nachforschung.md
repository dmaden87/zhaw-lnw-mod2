Gletscherbank AG · Wissensdatenbank Zahlungsverkehr

PAY-09 Zahlungsrückruf, Nachforschung und Fehlüberweisung

|                     |                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------|
| **Prozess-ID**      | PAY-09                                                                                                   |
| **Prozesseigner**   | Payment Operations (PayOps)                                                                              |
| **Systeme**         | PayHub Investigation-Modul, SWIFT gpi, SIC, Kundenservice-CRM                                            |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                         |
| **Klassifikation**  | Intern                                                                                                   |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Interne Zeiten, Limiten und Kontakte sind erfunden. |

# 1. Zweck und Geltungsbereich

Dieser Prozess regelt Rückrufe ausgeführter Zahlungen (z. B. Doppelzahlung, falsche IBAN, falscher Betrag) und Nachforschungen zu nicht angekommenen oder unklaren Zahlungen.

# 2. Begriffe

| **Begriff**         | **Erklärung**                                                                           |
|---------------------|-----------------------------------------------------------------------------------------|
| Rückruf (Recall)    | Anfrage an die Empfängerbank, eine Zahlung zurückzuleiten (camt.056).                   |
| Antwort auf Rückruf | Zustimmung oder Ablehnung durch die Empfängerbank (camt.029 bzw. Rückleitung pacs.004). |
| Nachforschung       | Abklärung des Status einer Zahlung bei beteiligten Banken.                              |
| UETR                | Eindeutige Referenz einer SWIFT-Zahlung zur Verfolgung.                                 |

# 3. Rollen und Verantwortlichkeiten

| **Rolle**             | **Aufgabe**                             |
|-----------------------|-----------------------------------------|
| Kunde                 | Meldet Fehler oder fehlende Gutschrift. |
| Kundenservice         | Erfasst Anliegen, informiert Kunde.     |
| PayOps Investigations | Führt Rückruf und Nachforschung durch.  |
| Fraud Desk            | Übernimmt bei Betrugsverdacht (PAY-10). |

# 4. Prozessablauf

| **Nr.** | **Schritt**           | **Beschreibung**                                                                                         | **Verantwortlich** | **System**          |
|---------|-----------------------|----------------------------------------------------------------------------------------------------------|--------------------|---------------------|
| 1       | Anliegen aufnehmen    | Kundenservice erfasst Zahlungsreferenz, Grund und gewünschte Massnahme; Prüfung Betrugsverdacht.         | Kundenservice      | CRM                 |
| 2       | Status prüfen         | Ist die Zahlung noch nicht versendet, kann sie intern gestoppt werden. Sonst Rückruf oder Nachforschung. | PayOps             | PayHub              |
| 3       | Rückruf senden        | Rückrufanfrage mit Grund an Empfängerbank (camt.056 bzw. SWIFT-Anfrage).                                 | PayOps             | Investigation-Modul |
| 4       | Antwort verfolgen     | Erinnerung nach 5 Bankwerktagen; Zustimmung braucht in der Regel das Einverständnis des Empfängers.      | PayOps             | Investigation-Modul |
| 5       | Rückleitung verbuchen | Rückleitung gutschreiben (abzüglich allfälliger Spesen der Empfängerbank), Kunde informieren.            | System / PayOps    | Kernbankensystem    |
| 6       | Abschluss             | Bei Ablehnung: Kunde informieren; Rechtsweg liegt beim Kunden.                                           | Kundenservice      | CRM                 |

# 5. Fristen, Cut-off-Zeiten und Kennzahlen

- Rückrufanfrage: Versand innert 1 Bankwerktag nach Meldung.

- Nachforschung SWIFT: erste Statusantwort an Kunde innert 2 Bankwerktagen.

- Instant Payments: kein technischer Rückruf; nur Bitte um freiwillige Rückzahlung.

# 6. Kontrollen und Compliance

- Rückrufe nur auf Antrag des Kontoinhabers oder bei bankinternem Fehler.

- Jeder Fall erhält eine Fallnummer; Statusänderungen werden protokolliert.

- Monatliche Auswertung der Gründe zur Prozessverbesserung.

# 7. Ausnahmen und Eskalation

- Betrugsverdacht: sofort an Fraud Desk (PAY-10), keine Wartezeit.

- Bankinterner Fehler: Korrektur nach Vier-Augen-Prinzip und Meldung an Operational Risk.

# 8. Häufige Fragen (FAQ)

**Frage: Ich habe an die falsche IBAN überwiesen. Bekomme ich das Geld zurück?**

Antwort: Die Bank stellt einen Rückruf. Die Empfängerbank braucht meist die Zustimmung des Empfängers; eine Rückzahlung ist nicht garantiert.

**Frage: Wie lange dauert ein Rückruf?**

Antwort: Meist einige Tage bis wenige Wochen, je nach Empfängerbank und Land.

# 9. Ansprechstellen

PayOps Investigations intern 4440, investigations@gletscherbank.example
