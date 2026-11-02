Gletscherbank AG · Wissensdatenbank Zahlungsverkehr · Systemhandbuch (Kurzform)

SH-01 PayHub – Zahlungsplattform

|                     |                                                                                                                 |
|---------------------|-----------------------------------------------------------------------------------------------------------------|
| **System-Owner**    | Adrian Vogel, IT Payments (Stv. Marco Steiner, Leitung PayOps fachlich)                                         |
| **Betrieb**         | 24/7; Wartungsfenster Sonntag 02:00–04:00 Uhr (Instant-Modul läuft weiter)                                      |
| **Zugang**          | Rollenantrag über Teamleitung im IT-Self-Service                                                                |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                                |
| **Klassifikation**  | Intern                                                                                                          |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Namen, Zahlen, Preise, Systeme und Kontakte sind erfunden. |

# 1. Wofür PayHub da ist

PayHub nimmt alle Zahlungsaufträge entgegen (E-Banking, App, Dateischnittstelle, Schalter), prüft sie, ruft das Screening auf, belastet das Kernbankensystem und versendet an SIC, SIC5 (Instant), SEPA-Clearing und SWIFT. Eingehende Zahlungen laufen den umgekehrten Weg.

# 2. Module

| **Modul**           | **Zweck**                                                 | **Wer nutzt es**                  |
|---------------------|-----------------------------------------------------------|-----------------------------------|
| Dashboard           | Volumen, STP-Quote, offene Queues, Cut-off-Countdown      | Alle PayOps                       |
| Repair-Queue        | Manuelle Korrektur nicht verarbeitbarer Zahlungen (AA-01) | PayOps                            |
| Freigabe-Inbox      | Vier-Augen-Freigaben                                      | PayOps, Teamleitungen             |
| Instant-Modul       | Echtzeitverarbeitung SIC5                                 | System; PayOps Pikett             |
| Investigation-Modul | Rückrufe, Nachforschungen (AA-02)                         | PayOps Investigations, Fraud Desk |
| Lastschrift-Modul   | LSV+/BDD-Ermächtigungen und Einzüge                       | Corporate Banking Services        |
| Reporting           | camt.053/054-Abos, Statistiken                            | Corporate Banking Services        |

# 3. Rollen

| **Rolle**   | **Rechte**                                                          |
|-------------|---------------------------------------------------------------------|
| PAY_VIEW    | Zahlungen ansehen, suchen                                           |
| PAY_REPAIR  | Zahlungen korrigieren, zur Freigabe senden, abweisen                |
| PAY_APPROVE | Fremde Korrekturen freigeben (Betragsgrenzen gemäss WE-02)          |
| PAY_INVEST  | Rückrufe und Nachforschungen auslösen                               |
| PAY_FRAUD   | Notfall-Stopp und Fraud-Rückruf ohne Vier-Augen-Freigabe            |
| PAY_ADMIN   | Parameter (Cut-offs, Limiten) – nur IT Payments mit Change-Freigabe |

# 4. Zahlungsstatus

| **Status**          | **Bedeutung**                                                  |
|---------------------|----------------------------------------------------------------|
| Erfasst             | Auftrag eingegangen, noch nicht geprüft                        |
| Geprüft             | Formal ok, wartet auf Ausführungsdatum                         |
| Compliance Hold     | Screening-Treffer, Entscheid bei Compliance – nicht bearbeiten |
| Fraud Hold          | Fraud-Alarm, Entscheid beim Fraud Desk                         |
| Repair              | Manuelle Korrektur nötig                                       |
| Wartet auf Freigabe | Korrektur erfasst, zweite Person muss freigeben                |
| Versendet           | An Clearing übergeben                                          |
| Ausgeführt          | Bestätigt bzw. gebucht                                         |
| Abgewiesen          | Nicht ausführbar, Kunde informiert, Betrag zurück              |

# 5. Fehlercodes

Die wichtigsten Repair-Fehlercodes (R-ADR, R-IBAN, R-BIC, R-QR, R-PUR) sind in AA-01, Kapitel 5 beschrieben.

# 6. Parameter (Auszug)

- Cut-off Inland CHF: 15:00 Uhr; SEPA SCT: 14:00 Uhr; Fremdwährungen gemäss Währungstabelle (z. B. USD 14:00, GBP 13:00).

- Instant-Tageslimite Privatkunden: CHF 10'000 (änderbar durch Kundenberatung).

- Deckungsprüfung: 3 Versuche am Ausführungstag.

- Timeout Instant: Zahlung wird abgebrochen, wenn keine Bestätigung innert der Systemfrist eintrifft.

# 7. Störungen

- Störung melden: IT Service Desk, Ticketkategorie «PayHub Support», Priorität 1 bei Ausfall von Versand oder Instant-Modul.

- Ausserhalb Bürozeiten: PayOps Pikett über Leitstelle.

- Bei Ausfall SIC5 blendet PayHub die Instant-Option im E-Banking automatisch aus.
