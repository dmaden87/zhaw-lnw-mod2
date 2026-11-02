Gletscherbank AG · Wissensdatenbank Zahlungsverkehr · Arbeitsanweisung

AA-01 Repair-Queue in PayHub bearbeiten

|                       |                                                                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------------------------------|
| **Gehört zu Prozess** | PAY-01 Inlandzahlung, PAY-06 Auslandzahlung                                                                     |
| **Zielgruppe**        | PayOps Inland, PayOps International                                                                             |
| **System**            | PayHub (siehe SH-01)                                                                                            |
| **Verantwortlich**    | Teamleitung PayOps Inland                                                                                       |
| **Version / Stand**   | 1.0 / 30.10.2026                                                                                                |
| **Klassifikation**    | Intern                                                                                                          |
| **Hinweis**           | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Namen, Zahlen, Preise, Systeme und Kontakte sind erfunden. |

# 1. Wann diese Anweisung gilt

Zahlungen landen in der Repair-Queue, wenn PayHub sie nicht automatisch verarbeiten kann: unvollständige Adresse, ungültige IBAN, fehlender BIC, unklarer Zahlungszweck oder Formatfehler. Ziel: jede Zahlung innert 2 Stunden bearbeiten.

# 2. Voraussetzungen

- Rolle «PAY_REPAIR» in PayHub (Antrag über Teamleitung).

- Zugriff auf KundenCockpit (CRM) für Kontaktdaten.

- Zweite Person mit Rolle «PAY_APPROVE» für die Freigabe verfügbar (Vier-Augen-Prinzip, LF-04).

# 3. Bildschirmschritte

| **Nr.** | **Bildschirm / Ort**                         | **Aktion**                                                                                                                                  | **Ergebnis / Prüfpunkt**                                      |
|---------|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|
| 1       | PayHub › Startseite                          | Kachel «Repair-Queue» öffnen. Filter «Meine Teams» und Sortierung «Fälligkeit aufsteigend» setzen.                                          | Liste der offenen Zahlungen, älteste und fristkritische oben. |
| 2       | Repair-Queue › Liste                         | Zahlung mit Doppelklick öffnen. Status wechselt auf «In Bearbeitung – \[Ihr Kürzel\]».                                                      | Zahlung ist für andere gesperrt.                              |
| 3       | Zahlungsdetail › Register «Fehler»           | Fehlercode lesen (z. B. R-ADR-02 «Ort/Land fehlt», R-IBAN-01 «Prüfziffer falsch»). Erklärungen: SH-01, Kapitel 5.                           | Fehlerursache ist klar.                                       |
| 4       | KundenCockpit › Kunde › Kontakte             | Bei fehlenden Angaben: Kunden über die im CRM hinterlegte Telefonnummer kontaktieren. Nie Kontaktangaben aus dem Zahlungsauftrag verwenden. | Korrekte Angaben vom Kunden bestätigt.                        |
| 5       | Zahlungsdetail › Register «Parteien»         | Felder korrigieren (z. B. Ort und Land in eigenen Feldern). Keine Fantasieangaben.                                                          | Pflichtfelder grün.                                           |
| 6       | Zahlungsdetail › Feld «Begründung»           | Begründung erfassen, z. B. «Ort ergänzt nach tel. Bestätigung Kunde 30.10., 10:15».                                                         | Begründung gespeichert.                                       |
| 7       | Zahlungsdetail › Schaltfläche «Zur Freigabe» | Zahlung an Freigabe-Inbox senden. Zweite Person auswählen oder Team-Inbox wählen.                                                           | Status «Wartet auf Freigabe».                                 |
| 8       | PayHub › Freigabe-Inbox (zweite Person)      | Änderungen im Register «Änderungshistorie» gegen CRM-Notiz prüfen, dann «Freigeben» oder «Zurückweisen».                                    | Bei Freigabe: Status «Freigegeben», Zahlung läuft weiter.     |
| 9       | Repair-Queue                                 | Kann die Zahlung nicht korrigiert werden: «Abweisen» mit Code und Kundentext wählen.                                                        | Kunde erhält Meldung im E-Banking, Betrag wird zurückgebucht. |

# 4. Wichtige Regeln

- Eigene Korrekturen nie selbst freigeben; PayHub blockiert dies technisch.

- Zahlungen mit Screening-Treffer (Status «Compliance Hold») nicht bearbeiten, sondern Compliance überlassen (PAY-08).

- Ab CHF 250'000 Freigabe durch Teamleitung (WE-02 Kompetenzreglement).

- Seit 14. November 2026 bei Auslandzahlungen mindestens Ort und Land in strukturierten Feldern.

# 5. Häufige Fehlercodes

| **Code**  | **Bedeutung**                    | **Typische Lösung**                                        |
|-----------|----------------------------------|------------------------------------------------------------|
| R-ADR-01  | Adresse unstrukturiert (Typ K)   | Strasse, PLZ, Ort, Land in Einzelfelder übertragen         |
| R-ADR-02  | Ort oder Land fehlt              | Beim Kunden nachfragen                                     |
| R-IBAN-01 | IBAN-Prüfziffer falsch           | Kunde kontaktieren; nie selbst «korrigieren»               |
| R-BIC-03  | BIC unbekannt / nicht erreichbar | BIC-Verzeichnis prüfen, ggf. Routing via Korrespondenzbank |
| R-QR-04   | QR-IBAN ohne QR-Referenz         | Abweisen, Kunde soll korrekte Rechnung verlangen           |
| R-PUR-05  | Zweckcode für Zielland fehlt     | Zweck beim Kunden erfragen, Code gemäss Länderliste setzen |

# 6. Hilfe

Fragen zur Anwendung: PayOps Hotline intern 4410. Technische Störung: IT Service Desk, Ticket an «PayHub Support» (SH-01).
