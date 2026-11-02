Gletscherbank AG · Wissensdatenbank Zahlungsverkehr

PAY-06 Auslandzahlung über SWIFT (ISO 20022)

|                     |                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------|
| **Prozess-ID**      | PAY-06                                                                                                   |
| **Prozesseigner**   | Payment Operations International                                                                         |
| **Systeme**         | E-Banking, PayHub, SWIFT-Gateway, Korrespondenzbank-Netz, Screening-Engine                               |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                         |
| **Klassifikation**  | Intern                                                                                                   |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Interne Zeiten, Limiten und Kontakte sind erfunden. |

# 1. Zweck und Geltungsbereich

Dieser Prozess regelt Zahlungen in Fremdwährung oder in Länder ausserhalb SEPA über SWIFT und Korrespondenzbanken. Seit dem Ende der MT/MX-Koexistenz am 22. November 2025 erfolgen Kundenzahlungen als ISO-20022-Meldung pacs.008 (statt MT103).

# 2. Begriffe

| **Begriff**           | **Erklärung**                                                                                    |
|-----------------------|--------------------------------------------------------------------------------------------------|
| SWIFT                 | Weltweites Nachrichtennetz zwischen Banken.                                                      |
| pacs.008 / pacs.009   | ISO-20022-Meldungen für Kundenzahlung bzw. Bankenzahlung (ersetzen MT103 / MT202).               |
| Korrespondenzbank     | Bank, über die Zahlungen in eine Währung oder ein Land geleitet werden.                          |
| OUR / SHA / BEN       | Spesenoptionen: Auftraggeber zahlt alle / geteilt / Empfänger zahlt alle.                        |
| Strukturierte Adresse | Adresse in einzelnen Feldern; ab 14. November 2026 sind Ort und Land in eigenen Feldern Pflicht. |

# 3. Rollen und Verantwortlichkeiten

| **Rolle**             | **Aufgabe**                                         |
|-----------------------|-----------------------------------------------------|
| Kunde                 | Erfasst Auslandzahlung inkl. Zweck und Adresse.     |
| PayOps International  | Repair, Nachforschungen, Korrespondenzbank-Kontakt. |
| Compliance Sanktionen | Screening-Treffer, Länderrisiken.                   |
| Treasury              | Devisen und Nostro-Liquidität.                      |

# 4. Prozessablauf

| **Nr.** | **Schritt**         | **Beschreibung**                                                                                                          | **Verantwortlich**   | **System**       |
|---------|---------------------|---------------------------------------------------------------------------------------------------------------------------|----------------------|------------------|
| 1       | Zahlung erfassen    | Kunde erfasst Währung, IBAN/Konto, BIC, Name, strukturierte Adresse (mind. Ort und Land), Zahlungszweck und Spesenoption. | Kunde                | E-Banking        |
| 2       | Prüfung             | Formatprüfung, Länder- und Währungsregeln, Pflichtangaben je Land (z. B. Zweckcode).                                      | System               | PayHub           |
| 3       | Screening           | Sanktions- und Embargoscreening aller Parteien und Banken (PAY-08).                                                       | System / Compliance  | Screening-Engine |
| 4       | Devisen             | Umrechnung zum Tageskurs; Grossbeträge ab CHF 250'000 mit Kurs-Freigabe durch Treasury.                                   | System / Treasury    | FX-System        |
| 5       | Routing und Versand | Wahl der Korrespondenzbank; Versand als pacs.008 über SWIFT; Tracking mit UETR.                                           | System               | SWIFT-Gateway    |
| 6       | Nachverfolgung      | Statusabfrage über SWIFT gpi Tracker; Abweisungen werden dem Kunden gemeldet.                                             | PayOps International | SWIFT gpi        |

# 5. Fristen, Cut-off-Zeiten und Kennzahlen

- Interner Cut-off: je Währung (z. B. USD 14:00, GBP 13:00 Uhr; Gletscherbank-interne Vorgaben).

- Laufzeit: je nach Land und Korrespondenzkette 1–3 Bankwerktage.

- Ab 14. November 2026: Zahlungen ohne Ort und Land in strukturierten Feldern können abgewiesen werden.

# 6. Kontrollen und Compliance

- Pflicht strukturierte bzw. hybride Adresse; PayHub blockiert unvollständige Adressen.

- Zahlungen in Hochrisikoländer: zusätzliche Prüfung durch Compliance.

- Tägliche Abstimmung der Nostrokonten durch Treasury.

# 7. Ausnahmen und Eskalation

- Zahlung nach 3 Bankwerktagen nicht gutgeschrieben: Nachforschung via SWIFT (camt.029 / Anfrage an Korrespondenzbank), siehe PAY-09.

- Abweisung durch Korrespondenzbank: Kunde innert 1 Bankwerktag informieren.

# 8. Häufige Fragen (FAQ)

**Frage: Warum muss ich die Adresse so genau angeben?**

Antwort: Internationale Standards verlangen seit November 2026 mindestens Ort und Land in eigenen Feldern. Fehlende Angaben führen zu Abweisungen.

**Frage: Wie kann ich sehen, wo meine Zahlung ist?**

Antwort: PayOps kann mit der UETR-Nummer den Status über SWIFT gpi abfragen.

**Frage: Was bedeutet OUR?**

Antwort: Der Auftraggeber trägt alle Spesen, auch die der Empfänger- und Korrespondenzbanken.

# 9. Ansprechstellen

PayOps International intern 4430, intl-payments@gletscherbank.example

# 10. Externe Referenzen

- [Standard Chartered: ISO 20022 Milestone November 2026](https://www.sc.com/en/uploads/sites/66/content/docs/ISO-20022-Milestone-for-November-2026.pdf)
