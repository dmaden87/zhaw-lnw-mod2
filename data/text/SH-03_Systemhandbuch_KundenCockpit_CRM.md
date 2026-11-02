Gletscherbank AG · Wissensdatenbank Zahlungsverkehr · Systemhandbuch (Kurzform)

SH-03 KundenCockpit – CRM für Kundenservice und Beratung

|                     |                                                                                                                 |
|---------------------|-----------------------------------------------------------------------------------------------------------------|
| **System-Owner**    | Yves Berger, IT Front Systems (fachlich: Isabelle Favre, Leitung Kundenservice)                                 |
| **Betrieb**         | Mo–Sa 06:00–23:00 Uhr; Fraud-Funktionen 24/7                                                                    |
| **Zugang**          | Alle Mitarbeitenden mit Kundenkontakt; Rollen gemäss Funktion                                                   |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                                |
| **Klassifikation**  | Intern                                                                                                          |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Namen, Zahlen, Preise, Systeme und Kontakte sind erfunden. |

# 1. Wofür das KundenCockpit da ist

Das KundenCockpit zeigt alle Informationen zu einem Kunden auf einen Blick: Stammdaten, Produkte, Kontakte, Vollmachten, offene Fälle und Kommunikationsverlauf. Hier werden Kundenanliegen als Fälle erfasst und an die zuständigen Teams geleitet.

# 2. Bereiche der Kundenansicht

| **Register** | **Inhalt**                                                                     |
|--------------|--------------------------------------------------------------------------------|
| Übersicht    | Kundensegment, Berater, Warnhinweise (z. B. «Notfall-Sperre aktiv»)            |
| Stammdaten   | Name, strukturierte Adresse, Geburtsdatum, Nationalität                        |
| Kontakte     | Verifizierte Telefonnummern und E-Mail – einzige zulässige Quelle für Rückrufe |
| Produkte     | Konten, Karten, QR-IBAN, eBill-Status, LSV-Ermächtigungen                      |
| Vollmachten  | Unterschriftsberechtigungen (Firmenkunden)                                     |
| Fälle        | Offene und geschlossene Fälle mit Fallnummer                                   |
| Verlauf      | Gespräche, Notizen, Korrespondenz                                              |

# 3. Falltypen

| **Falltyp**                          | **Ziel-Queue**                        | **Arbeitsanweisung** |
|--------------------------------------|---------------------------------------|----------------------|
| Zahlungsrückruf                      | PayOps Investigations                 | AA-02                |
| Nachforschung                        | PayOps Investigations / International | AA-02                |
| Betrugsverdacht                      | Fraud Desk (automatisch)              | AA-04                |
| Umstellungsberatung (QR, eBill, LSV) | Kundenberatung / Corporate Banking    | LF-05, AA-05         |
| Reklamation allgemein                | Kundenservice 2nd Level               | LF-01                |

# 4. Schnellaktionen

- «Notfall-Sperre»: sperrt E-Banking, App und Daueraufträge (AA-04).

- «Instant-Limite ändern»: nur Kundenberatung, Begründung Pflicht.

- «Rückruf an Kunde planen»: erzeugt Aufgabe mit Frist.

# 5. Dokumentationsregeln

- Jedes Kundengespräch mit Zahlungsbezug wird im Verlauf festgehalten: Anliegen, Massnahme, Zusage, Termin.

- Keine Angaben zu Sanktionstreffern oder Verdachtsmeldungen im CRM-Verlauf (LF-03); diese gehören ins Fallmanagement von Compliance.

- Keine Gesundheits- oder anderen besonders schützenswerten Daten ohne Notwendigkeit (WE-03).

# 6. Störungen

IT Service Desk, Kategorie «KundenCockpit». Bei Ausfall ist die Notfall-Sperre über den Fraud Desk (intern 4499) weiterhin möglich.
