Gletscherbank AG · Wissensdatenbank Zahlungsverkehr

PAY-07 Lastschriftverfahren LSV+/BDD und Ablösung bis 2028

|                     |                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------|
| **Prozess-ID**      | PAY-07                                                                                                   |
| **Prozesseigner**   | Corporate Banking Services                                                                               |
| **Systeme**         | PayHub Lastschrift-Modul, LSV+-Plattform (SIX), eBill                                                    |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                         |
| **Klassifikation**  | Intern                                                                                                   |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Interne Zeiten, Limiten und Kontakte sind erfunden. |

# 1. Zweck und Geltungsbereich

Dieser Prozess regelt Belastungen über das Lastschriftverfahren LSV+ (mit Widerspruchsrecht) und BDD (Business Direct Debit, ohne Widerspruchsrecht) sowie die Migration der Kunden. SIX stellt LSV+/BDD per 30. September 2028 ein.

# 2. Begriffe

| **Begriff**            | **Erklärung**                                                               |
|------------------------|-----------------------------------------------------------------------------|
| LSV+                   | Lastschrift für Privat- und Firmenkunden mit Widerspruchsrecht des Zahlers. |
| BDD                    | Business Direct Debit zwischen Firmen, ohne Widerspruchsrecht.              |
| Belastungsermächtigung | Zustimmung des Zahlers, dass ein Rechnungssteller sein Konto belasten darf. |
| Widerspruch            | Rückforderung einer LSV+-Belastung durch den Zahler innert Frist.           |

# 3. Rollen und Verantwortlichkeiten

| **Rolle**                  | **Aufgabe**                                    |
|----------------------------|------------------------------------------------|
| Zahler                     | Erteilt oder widerruft Belastungsermächtigung. |
| Rechnungssteller           | Liefert Lastschriften ein.                     |
| Corporate Banking Services | Verwaltet Ermächtigungen und Migration.        |
| Kundenservice              | Nimmt Widersprüche entgegen.                   |

# 4. Prozessablauf

| **Nr.** | **Schritt**            | **Beschreibung**                                                                                           | **Verantwortlich** | **System**        |
|---------|------------------------|------------------------------------------------------------------------------------------------------------|--------------------|-------------------|
| 1       | Ermächtigung erfassen  | Eingang Belastungsermächtigung; Erfassung und Prüfung der Unterschrift bzw. digitalen Zustimmung.          | Corporate Banking  | Lastschrift-Modul |
| 2       | Lastschrift empfangen  | Eingang Lastschrift; Prüfung, ob gültige Ermächtigung vorliegt.                                            | System             | PayHub            |
| 3       | Belastung              | Belastung des Zahlerkontos am Fälligkeitstag, falls Deckung vorhanden; sonst Rückweisung.                  | System             | Kernbankensystem  |
| 4       | Widerspruch (nur LSV+) | Zahler widerspricht innert Frist; Gutschrift an Zahler, Rückbelastung an Rechnungssteller.                 | Kundenservice      | PayHub            |
| 5       | Migration              | Information der Kunden; Empfehlung eBill / eBill Direct Debit oder Dauerauftrag; Abschluss vor 30.09.2028. | Corporate Banking  | CRM               |

# 5. Fristen, Cut-off-Zeiten und Kennzahlen

- Widerspruchsfrist LSV+: gemäss SIX-Regelwerk, im E-Banking angezeigt.

- Letzte LSV+/BDD-Einzüge: 30. September 2028.

- Interner Migrationsplan: alle Rechnungssteller bis 30.06.2028 beraten (Gletscherbank-Ziel).

# 6. Kontrollen und Compliance

- Keine Belastung ohne gültige Ermächtigung.

- Monitoring der Widerspruchsquote je Rechnungssteller; auffällige Quoten an Compliance.

- Quartalsweises Reporting zum Migrationsstand an die Geschäftsleitung.

# 7. Ausnahmen und Eskalation

- Rechnungssteller mit hoher Widerspruchsquote: Überprüfung der Geschäftsbeziehung.

- Kunde ohne E-Banking: Umstellung auf QR-Rechnung oder Dauerauftrag anbieten.

# 8. Häufige Fragen (FAQ)

**Frage: Gibt es LSV nach 2028 noch?**

Antwort: Nein. SIX stellt LSV+/BDD per 30. September 2028 ein. Alternativen sind eBill, eBill Direct Debit, QR-Rechnung oder Dauerauftrag.

**Frage: Kann ich eine Lastschrift zurückfordern?**

Antwort: Bei LSV+ ja, innert der Widerspruchsfrist. Bei BDD nicht.

# 9. Ansprechstellen

Corporate Banking Services intern 4520

# 10. Externe Referenzen

- [KMU-Portal: Einstellung LSV+/BDD per 30.09.2028](https://www.kmu.admin.ch/kmu/en/home/new/news/2026/einstellung-lsv-per-30-09-2028.html)
