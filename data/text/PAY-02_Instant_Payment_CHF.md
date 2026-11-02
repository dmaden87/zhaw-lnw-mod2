Gletscherbank AG · Wissensdatenbank Zahlungsverkehr

PAY-02 Instant Payment in CHF (SIC5)

|                     |                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------|
| **Prozess-ID**      | PAY-02                                                                                                   |
| **Prozesseigner**   | Payment Operations (PayOps)                                                                              |
| **Systeme**         | E-Banking, Mobile App, PayHub Instant-Modul, SIC5, Screening-Engine (Echtzeit)                           |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                         |
| **Klassifikation**  | Intern                                                                                                   |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Interne Zeiten, Limiten und Kontakte sind erfunden. |

# 1. Zweck und Geltungsbereich

Dieser Prozess beschreibt Senden und Empfangen von Instant Payments in CHF. Die Gutschrift erfolgt rund um die Uhr, an 365 Tagen, in wenigen Sekunden. Die Plattform SIC5 bildet seit 2023 die Grundlage; die grössten Banken müssen seit August 2024 Instant Payments empfangen können, alle übrigen Banken bis Ende 2026.

# 2. Begriffe

| **Begriff**        | **Erklärung**                                                                     |
|--------------------|-----------------------------------------------------------------------------------|
| Instant Payment    | Kontoübertrag, der innert Sekunden beim Empfänger gutgeschrieben wird, 24/7/365.  |
| SIC5               | Instant-Payment-Plattform von SIX und SNB.                                        |
| Timeout            | Maximale Verarbeitungszeit; danach wird die Zahlung abgelehnt und nicht belastet. |
| Echtzeit-Screening | Sanktions- und Fraud-Prüfung innerhalb weniger Sekunden.                          |

# 3. Rollen und Verantwortlichkeiten

| **Rolle**            | **Aufgabe**                                           |
|----------------------|-------------------------------------------------------|
| Kunde                | Wählt Option «Instant» und autorisiert die Zahlung.   |
| PayHub Instant-Modul | Prüft, screent, belastet und sendet innert Sekunden.  |
| Fraud Desk (24/7)    | Bearbeitet Echtzeit-Alarme ausserhalb der Bürozeiten. |
| PayOps Pikett        | Technische Störungen am Wochenende und in der Nacht.  |

# 4. Prozessablauf

| **Nr.** | **Schritt**                 | **Beschreibung**                                                                                                                                                 | **Verantwortlich**  | **System**       |
|---------|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|------------------|
| 1       | Zahlung erfassen            | Kunde wählt «Instant»; Anzeige der Gebühr und Hinweis, dass die Zahlung nicht rückgängig gemacht werden kann.                                                    | Kunde               | E-Banking / App  |
| 2       | Echtzeit-Prüfung            | Format, Limite (Standard CHF 10'000 pro Tag für Privatkunden, intern festgelegt), Deckung.                                                                       | System              | PayHub           |
| 3       | Echtzeit-Screening          | Sanktions- und Fraud-Prüfung. Bei Treffer: Zahlung nicht als Instant ausführen, Kunde erhält Hinweis, Auftrag geht in normale Verarbeitung oder Abklärung.       | System / Fraud Desk | Screening-Engine |
| 4       | Belastung und Versand       | Reservierung des Betrags und Versand an SIC5.                                                                                                                    | System              | SIC5-Gateway     |
| 5       | Bestätigung                 | Positive Bestätigung der Empfängerbank: definitive Belastung, Push-Mitteilung an Kunde. Negative Antwort oder Timeout: Reservierung aufheben, Kunde informieren. | System              | PayHub           |
| 6       | Eingehende Instant Payments | Prüfung Empfängerkonto (existiert, nicht saldiert, nicht gesperrt), Screening, Gutschrift innert Sekunden.                                                       | System              | PayHub           |

# 5. Fristen, Cut-off-Zeiten und Kennzahlen

- Verfügbarkeit: 24 Stunden, 7 Tage, 365 Tage.

- Zielzeit von Konto zu Konto: unter 10 Sekunden.

- Verfügbarkeit des Instant-Moduls: Ziel ≥ 99,9 %.

- Alarme des Fraud Desks ausserhalb Bürozeiten: Reaktion innert 15 Minuten.

# 6. Kontrollen und Compliance

- Tageslimite pro Kunde, anpassbar durch Kundenberater nach Prüfung.

- Erhöhte Fraud-Sensitivität für neue Empfänger und ungewöhnliche Uhrzeiten.

- Kein Rückruf möglich nach Gutschrift; nur Bitte um freiwillige Rückzahlung (PAY-09).

- Monitoring der Liquidität auf dem SIC-Konto auch am Wochenende durch Treasury-Pikett.

# 7. Ausnahmen und Eskalation

- SIC5 nicht erreichbar: Instant-Option im E-Banking automatisch ausblenden; Zahlungen laufen als Standardzahlung (PAY-01).

- Verdacht auf Betrug nach Ausführung: sofort Fraud Desk (PAY-10).

# 8. Häufige Fragen (FAQ)

**Frage: Kann ich eine Instant-Zahlung zurückholen?**

Antwort: Nein, die Gutschrift ist endgültig. Die Bank kann nur bei der Empfängerbank um freiwillige Rückzahlung bitten.

**Frage: Warum wurde meine Instant-Zahlung als normale Zahlung ausgeführt?**

Antwort: Wenn die Empfängerbank noch keine Instant Payments empfängt oder eine Prüfung länger dauert, wird die Zahlung als Standardzahlung verarbeitet.

**Frage: Funktioniert Instant auch am Sonntag?**

Antwort: Ja, an allen Tagen rund um die Uhr, sofern die Empfängerbank teilnimmt.

# 9. Ansprechstellen

Fraud Desk 24/7 intern 4499; PayOps Pikett über Leitstelle

# 10. Externe Referenzen

- [SIX: Instant Payments](https://www.six-group.com/en/products-services/banking-services/billing-and-payments/instant-payments.html)

- [SIX/SNB Medienmitteilung Instant Payments (21.08.2024)](https://www.six-group.com/de/newsroom/media-releases/2024/20240821-instant-payment-six-snb.html)
