Gletscherbank AG · Wissensdatenbank Zahlungsverkehr · Arbeitsanweisung

AA-05 QR-IBAN und camt.054-Lieferung für Firmenkunden einrichten

|                       |                                                                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------------------------------|
| **Gehört zu Prozess** | PAY-03 QR-Rechnung                                                                                              |
| **Zielgruppe**        | Corporate Banking Services                                                                                      |
| **System**            | KundenCockpit, Kernbankensystem, PayHub Reporting                                                               |
| **Verantwortlich**    | Leitung Corporate Banking Services                                                                              |
| **Version / Stand**   | 1.0 / 30.10.2026                                                                                                |
| **Klassifikation**    | Intern                                                                                                          |
| **Hinweis**           | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Namen, Zahlen, Preise, Systeme und Kontakte sind erfunden. |

# 1. Bildschirmschritte

| **Nr.** | **Bildschirm / Ort**                   | **Aktion**                                                                                                                        | **Ergebnis / Prüfpunkt**                    |
|---------|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| 1       | KundenCockpit › Firmenkunde › Produkte | Antrag «QR-IBAN» öffnen; Konto auswählen (nur CHF- oder EUR-Kontokorrent).                                                        | Antrag im Status «Entwurf».                 |
| 2       | Antrag › Prüfung                       | Unterschriftsberechtigung des Antragstellers prüfen (Register «Vollmachten»).                                                     | Berechtigung bestätigt.                     |
| 3       | Antrag › «QR-IBAN generieren»          | System erzeugt QR-IBAN (Instituts-ID im Bereich 30000–31999).                                                                     | QR-IBAN angezeigt und dem Konto zugeordnet. |
| 4       | PayHub › Reporting › Neues Abo         | Meldung «camt.054» wählen; Variante Einzel- oder Sammelbuchung; Kanal (E-Banking-Download oder EBICS).                            | Abo aktiv ab nächstem Bankwerktag.          |
| 5       | KundenCockpit › Korrespondenz          | Bestätigungsschreiben mit QR-IBAN, Hinweis auf strukturierte Adressen (seit 21.11.2025 Pflicht) und Link zur Anleitung versenden. | Kunde informiert.                           |
| 6       | KundenCockpit › Aufgabe                | Wiedervorlage in 30 Tagen: erste Eingänge prüfen (Zuordnungsquote).                                                               | Nachkontrolle geplant.                      |

# 2. Hinweise

- QR-IBAN funktioniert nur mit QR-Referenz; mit SCOR-Referenz ist die normale IBAN zu verwenden.

- Gebühren für QR-Eingänge und camt.054: PB-01 Preisliste.
