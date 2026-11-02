Gletscherbank AG · Wissensdatenbank Zahlungsverkehr · Arbeitsanweisung

AA-04 Fraud-Sofortmassnahmen: Zugang sperren und Zahlungen stoppen

|                       |                                                                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------------------------------|
| **Gehört zu Prozess** | PAY-10 Betrugsverdacht, PAY-02 Instant Payment                                                                  |
| **Zielgruppe**        | Fraud Desk; Kundenservice (Schritte 1–3)                                                                        |
| **System**            | KundenCockpit, PayHub, E-Banking-Admin                                                                          |
| **Verantwortlich**    | Leitung Fraud Desk                                                                                              |
| **Version / Stand**   | 1.0 / 30.10.2026                                                                                                |
| **Klassifikation**    | Intern                                                                                                          |
| **Hinweis**           | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Namen, Zahlen, Preise, Systeme und Kontakte sind erfunden. |

Zeitziel: Sofortmassnahmen innert 15 Minuten nach Meldung, rund um die Uhr.

# 1. Bildschirmschritte

| **Nr.** | **Bildschirm / Ort**                           | **Aktion**                                                                                                                      | **Ergebnis / Prüfpunkt**                                                       |
|---------|------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| 1       | KundenCockpit › Kunde                          | Kunde identifizieren. Bei Zweifel an der Identität trotzdem weiter mit Schritt 2 – sperren ist immer erlaubt, entsperren nicht. | Kunde im CRM geöffnet.                                                         |
| 2       | KundenCockpit › Schnellaktion «Notfall-Sperre» | Sperrt E-Banking, Mobile App und offene Daueraufträge mit einem Klick. Grund «Betrugsverdacht» wählen.                          | Banner «Notfall-Sperre aktiv» im Kundenprofil.                                 |
| 3       | Telefon                                        | Kundenservice verbindet direkt mit Fraud Desk (intern 4499). Nicht auflegen und zurückrufen lassen.                             | Fraud Desk übernimmt.                                                          |
| 4       | PayHub › Suche › Kunde                         | Alle Zahlungen der letzten 72 Stunden anzeigen. Offene Zahlungen markieren › «Stopp (Fraud)».                                   | Offene Zahlungen gestoppt, ohne Vier-Augen-Freigabe (Notfallrecht Fraud Desk). |
| 5       | PayHub › Ausgeführte Zahlungen                 | Für jede verdächtige Zahlung «Rückruf (Fraud)» wählen. Bei Instant: «Bitte um Rückzahlung / Sperre Empfängerkonto».             | Rückrufe mit Priorität «Fraud» versendet (Ziel: innert 1 Stunde).              |
| 6       | Kartenmanagement (falls betroffen)             | Debit- und Kreditkarten sperren, Ersatzkarte auslösen.                                                                          | Karten gesperrt.                                                               |
| 7       | Fallmanagement › Fraud-Fall                    | Zeitstempel, Kundenaussage, betroffene Zahlungen, Betrugsmuster (Phishing, Social Engineering, CEO-Fraud) erfassen.             | Fall vollständig dokumentiert.                                                 |
| 8       | KundenCockpit › Kommunikation                  | Kunde auf Polizeianzeige hinweisen; Termin für Entsperrung und neue Zugangsdaten vereinbaren.                                   | Nächste Schritte vereinbart.                                                   |

# 2. Entsperren

Entsperren darf nur der Fraud Desk, nach persönlicher oder videobasierter Identifikation und neuem Zugangsmittel. Die Freigabe erfolgt im Vier-Augen-Prinzip.
