Gletscherbank AG · Wissensdatenbank Zahlungsverkehr

PAY-01 Inlandzahlung in CHF über SIC

|                     |                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------|
| **Prozess-ID**      | PAY-01                                                                                                   |
| **Prozesseigner**   | Payment Operations (PayOps)                                                                              |
| **Systeme**         | E-Banking, Zahlungsplattform PayHub, SIC (SNB/SIX), Kernbankensystem                                     |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                         |
| **Klassifikation**  | Intern                                                                                                   |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Interne Zeiten, Limiten und Kontakte sind erfunden. |

# 1. Zweck und Geltungsbereich

Dieser Prozess regelt die Ausführung von Kundenzahlungen in CHF an Empfänger bei anderen Schweizer Banken über das Interbank-Zahlungssystem SIC. Er gilt für Privat- und Firmenkunden, für Einzel- und Sammelaufträge (pain.001) aus E-Banking, Mobile Banking und Dateischnittstelle.

# 2. Begriffe

| **Begriff** | **Erklärung**                                                                                              |
|-------------|------------------------------------------------------------------------------------------------------------|
| SIC         | Swiss Interbank Clearing: das Echtzeit-Bruttozahlungssystem für CHF, betrieben von SIX im Auftrag der SNB. |
| pain.001    | ISO-20022-Meldung, mit der Kunden der Bank Zahlungsaufträge übermitteln.                                   |
| pacs.008    | ISO-20022-Interbankmeldung für Kundenzahlungen.                                                            |
| Valuta      | Datum, an dem der Betrag belastet bzw. gutgeschrieben und verzinst wird.                                   |
| STP-Quote   | Anteil der Zahlungen, die ohne manuellen Eingriff verarbeitet werden.                                      |

# 3. Rollen und Verantwortlichkeiten

| **Rolle**             | **Aufgabe**                                                |
|-----------------------|------------------------------------------------------------|
| Kunde                 | Erfasst und autorisiert den Zahlungsauftrag.               |
| PayHub (System)       | Validiert, prüft Deckung, screent und leitet weiter.       |
| PayOps Repair-Team    | Bearbeitet Zahlungen in der Reparatur-Queue.               |
| Compliance Sanktionen | Entscheidet über Treffer aus dem Screening (siehe PAY-08). |

# 4. Prozessablauf

| **Nr.** | **Schritt**      | **Beschreibung**                                                                                                          | **Verantwortlich**  | **System**          |
|---------|------------------|---------------------------------------------------------------------------------------------------------------------------|---------------------|---------------------|
| 1       | Auftrag erfassen | Kunde erfasst Zahlung mit IBAN, Name, strukturierter Adresse und Betrag; Freigabe mit Zwei-Faktor-Authentifizierung.      | Kunde               | E-Banking           |
| 2       | Formale Prüfung  | PayHub prüft IBAN-Prüfziffer, Pflichtfelder, Ausführungsdatum und Format (pain.001).                                      | System              | PayHub              |
| 3       | Deckungsprüfung  | Prüfung Kontosaldo und Limiten. Ohne Deckung: bis 3 Wiederholungen am Ausführungstag, danach Abweisung mit Kundenmeldung. | System              | Kernbankensystem    |
| 4       | Screening        | Sanktions- und Fraud-Screening. Treffer gehen in die Compliance-Queue (PAY-08) bzw. Fraud-Queue (PAY-10).                 | System / Compliance | Screening-Engine    |
| 5       | Belastung        | Belastung des Kundenkontos mit Valuta Ausführungstag.                                                                     | System              | Kernbankensystem    |
| 6       | Versand an SIC   | Umwandlung in pacs.008 und Einlieferung in SIC; Abwicklung brutto über Girokonto bei der SNB.                             | System              | SIC-Gateway         |
| 7       | Reparatur        | Nicht automatisch verarbeitbare Zahlungen werden innert 2 Stunden von PayOps korrigiert oder mit Kunde geklärt.           | PayOps              | PayHub Repair-Queue |
| 8       | Bestätigung      | Status im E-Banking auf «ausgeführt»; Kontoauszug camt.053 bzw. Avis camt.054 an Firmenkunden.                            | System              | E-Banking           |

# 5. Fristen, Cut-off-Zeiten und Kennzahlen

- Interner Annahmeschluss (Cut-off) für Ausführung am selben Bankwerktag: 15:00 Uhr (Gletscherbank-interne Vorgabe).

- Aufträge nach Cut-off werden am nächsten Bankwerktag ausgeführt.

- Ziel-STP-Quote: ≥ 97 %. Bearbeitungszeit Repair-Queue: ≤ 2 Stunden.

- Für Zahlungen, die sofort ankommen müssen, siehe Instant Payment (PAY-02).

# 6. Kontrollen und Compliance

- Vier-Augen-Prinzip bei manueller Änderung von Empfängerdaten in der Repair-Queue.

- Tägliche Abstimmung SIC-Girokonto gegen Kernbankensystem durch Treasury.

- Zahlungen ab CHF 100'000 von Privatkunden: zusätzliche Plausibilitätsprüfung durch PayOps.

- Seit 21. November 2025 sind in QR-Rechnungen nur noch strukturierte Adressen zulässig; PayHub lehnt kombinierte Adressen (Typ K) ab.

# 7. Ausnahmen und Eskalation

- SIC-Störung: Meldung an PayOps-Leitung und Treasury; Kunden-Statusmeldung via Kundenservice-Banner.

- Fehlbuchung: Korrektur nach Vier-Augen-Prinzip, Dokumentation im Incident-Tool.

- Kundenreklamation «Zahlung nicht angekommen»: Nachforschung gemäss PAY-09.

# 8. Häufige Fragen (FAQ)

**Frage: Warum ist meine Zahlung noch nicht beim Empfänger?**

Antwort: Zahlungen nach 15:00 Uhr werden am nächsten Bankwerktag ausgeführt. Die Gutschrift beim Empfänger hängt zusätzlich von dessen Bank ab. Status im E-Banking prüfen.

**Frage: Kann ich eine ausgeführte Zahlung stoppen?**

Antwort: Nach Versand an SIC nicht mehr direkt. Es kann ein Rückruf angestossen werden (PAY-09); der Empfänger muss zustimmen.

**Frage: Was passiert ohne genügende Deckung?**

Antwort: Das System versucht die Zahlung am Ausführungstag bis zu dreimal. Danach wird sie abgewiesen und der Kunde informiert.

# 9. Ansprechstellen

PayOps Hotline intern 4410, payops@gletscherbank.example

# 10. Externe Referenzen

- [SIX: Instant Payments / SIC](https://www.six-group.com/en/products-services/banking-services/billing-and-payments/instant-payments.html)

- [ZKB Merkblatt strukturierte Adressen QR-Rechnung](https://www.zkb.ch/media/zkb/dokumente/merkblaetter/fs-strukturierte-adressen-qr-rechnung-de.pdf)
