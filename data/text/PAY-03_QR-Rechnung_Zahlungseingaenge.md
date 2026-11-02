Gletscherbank AG · Wissensdatenbank Zahlungsverkehr

PAY-03 QR-Rechnung: Zahlung und Verbuchung von Zahlungseingängen

|                     |                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------|
| **Prozess-ID**      | PAY-03                                                                                                   |
| **Prozesseigner**   | Corporate Banking Services                                                                               |
| **Systeme**         | E-Banking (Scan-Funktion), PayHub, Debitoren-Reporting camt.054                                          |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                         |
| **Klassifikation**  | Intern                                                                                                   |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Interne Zeiten, Limiten und Kontakte sind erfunden. |

# 1. Zweck und Geltungsbereich

Dieser Prozess regelt die Zahlung von QR-Rechnungen durch Kunden und die Gutschrift sowie Avisierung von Zahlungseingängen mit QR-Referenz an Firmenkunden (Rechnungssteller). Ziel ist die automatische Zuordnung offener Posten beim Rechnungssteller.

# 2. Begriffe

| **Begriff** | **Erklärung**                                                                          |
|-------------|----------------------------------------------------------------------------------------|
| QR-Rechnung | Schweizer Rechnungsstandard mit Swiss QR Code, der alle Zahlungsinformationen enthält. |
| QR-IBAN     | Spezielle IBAN für Zahlungen mit QR-Referenz (Instituts-ID 30000–31999).               |
| QR-Referenz | 27-stellige strukturierte Referenz zur automatischen Zuordnung.                        |
| SCOR        | Creditor Reference nach ISO 11649, nutzbar mit normaler IBAN.                          |
| camt.054    | Avis über Gutschriften und Belastungen, Grundlage für den Debitorenabgleich.           |

# 3. Rollen und Verantwortlichkeiten

| **Rolle**                      | **Aufgabe**                                         |
|--------------------------------|-----------------------------------------------------|
| Rechnungssteller (Firmenkunde) | Erstellt QR-Rechnungen mit QR-IBAN und QR-Referenz. |
| Zahler                         | Scannt den QR-Code und gibt die Zahlung frei.       |
| Corporate Banking Services     | Richtet QR-IBAN ein, berät zu Reporting.            |
| PayOps                         | Bearbeitet fehlerhafte Eingänge.                    |

# 4. Prozessablauf

| **Nr.** | **Schritt**        | **Beschreibung**                                                                                                                    | **Verantwortlich** | **System**       |
|---------|--------------------|-------------------------------------------------------------------------------------------------------------------------------------|--------------------|------------------|
| 1       | QR-IBAN einrichten | Firmenkunde beantragt QR-IBAN zu seinem Konto; Einrichtung camt.054-Lieferung (Einzel- oder Sammelbuchung).                         | Corporate Banking  | Kernbankensystem |
| 2       | QR-Rechnung zahlen | Zahler scannt QR-Code; Daten werden übernommen. Prüfung: QR-IBAN nur mit QR-Referenz, normale IBAN nur mit SCOR oder ohne Referenz. | Zahler / System    | E-Banking        |
| 3       | Adressprüfung      | Seit 21.11.2025 sind nur strukturierte Adressen (Typ S) zulässig; Rechnungen mit Typ K werden abgewiesen und der Zahler informiert. | System             | PayHub           |
| 4       | Gutschrift         | Eingang wird dem Konto des Rechnungsstellers gutgeschrieben.                                                                        | System             | Kernbankensystem |
| 5       | Avisierung         | Lieferung camt.054 mit QR-Referenz an den Rechnungssteller für den automatischen Debitorenabgleich.                                 | System             | Reporting        |
| 6       | Fehlerfälle        | Ungültige Referenz oder abweichender Betrag: Gutschrift erfolgt, Kennzeichnung im camt.054; Rechnungssteller klärt mit Zahler.      | PayOps             | PayHub           |

# 5. Fristen, Cut-off-Zeiten und Kennzahlen

- Gutschrift der Eingänge: am Valutatag; Avis camt.054 spätestens am Folgetag 06:00 Uhr.

- Bearbeitung von Rückfragen der Firmenkunden: innert 1 Bankwerktag.

# 6. Kontrollen und Compliance

- Validierung der QR-Referenz-Prüfziffer (Modulo 10 rekursiv) vor Ausführung.

- Kombination QR-IBAN ohne QR-Referenz wird technisch verhindert.

- Regelmässige Information der Firmenkunden über Standard-Änderungen (z. B. strukturierte Adressen).

# 7. Ausnahmen und Eskalation

- Grössere Mengen abgewiesener QR-Rechnungen eines Rechnungsstellers: Corporate-Berater kontaktiert den Kunden proaktiv.

- Fehlende camt.054-Lieferung: Incident an Reporting-Team, Information an Kunde.

# 8. Häufige Fragen (FAQ)

**Frage: Warum wird meine QR-Rechnung abgelehnt?**

Antwort: Häufigste Gründe: kombinierte statt strukturierte Adresse (seit 21.11.2025 nicht mehr zulässig) oder QR-IBAN ohne QR-Referenz. Rechnungssteller um korrigierte Rechnung bitten.

**Frage: Was ist der Unterschied zwischen QR-IBAN und IBAN?**

Antwort: Die QR-IBAN wird nur mit QR-Referenz verwendet und ermöglicht die automatische Zuordnung. Mit normaler IBAN kann eine SCOR-Referenz oder keine Referenz verwendet werden.

# 9. Ansprechstellen

Corporate Banking Services intern 4520, cbs@gletscherbank.example

# 10. Externe Referenzen

- [ZKB Merkblatt strukturierte Adressen QR-Rechnung](https://www.zkb.ch/media/zkb/dokumente/merkblaetter/fs-strukturierte-adressen-qr-rechnung-de.pdf)
