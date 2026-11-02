Gletscherbank AG · Wissensdatenbank Zahlungsverkehr · Schnittstellenspezifikation (WRICEF)

IF-02 Schnittstelle camt.054 – Gutschriftsanzeige für Firmenkunden

|                     |                                                                                                                 |
|---------------------|-----------------------------------------------------------------------------------------------------------------|
| **WRICEF-ID**       | I-021 (Typ I = Interface)                                                                                       |
| **Richtung**        | PayHub Reporting → Firmenkunde (Debitorenbuchhaltung), ausgehend                                                |
| **Technik**         | ISO 20022 XML camt.054.001.08 gemäss Swiss Payment Standards; Kanal E-Banking-Download oder EBICS               |
| **Owner technisch** | Adrian Vogel, IT Payments                                                                                       |
| **Owner fachlich**  | Beat Zimmermann, Leitung Corporate Banking Services                                                             |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                                |
| **Klassifikation**  | Intern                                                                                                          |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Namen, Zahlen, Preise, Systeme und Kontakte sind erfunden. |

# 1. Zweck

Die Meldung camt.054 avisiert Firmenkunden über Gutschriften auf ihrem Konto, insbesondere über QR-Rechnungs-Eingänge (PAY-03). Die Buchhaltungssoftware des Kunden liest die QR-Referenz aus und ordnet den Eingang automatisch der offenen Rechnung zu. Einrichtung des Abos: AA-05. Preis: PB-01 (CHF 20.00 pro Monat).

# 2. Lieferung

| **Merkmal**             | **Ausprägung**                                                                                           |
|-------------------------|----------------------------------------------------------------------------------------------------------|
| Varianten               | Einzelbuchung (ein Ntry pro Zahlung) oder Sammelbuchung (ein Ntry mit mehreren TxDtls, Angabe NbOfTxs)   |
| Zeitpunkte              | Untertags 08:00, 11:00, 14:00 und 17:00 Uhr; Tagesendlieferung spätestens am Folgetag 06:00 Uhr (PAY-03) |
| Kanal                   | E-Banking-Download (Dateiablage 90 Tage) oder EBICS (Auftragsart BTD, Service «REP»)                     |
| Zeichensatz / Dateiname | UTF-8; GLB_camt054\_\<Konto-IBAN\>\_\<JJJJMMTT\>\_\<Laufnr\>.xml                                         |

# 3. Wichtigste Datenfelder

| **Feld (XML-Pfad)**                              | **Inhalt**                                  | **Hinweis**                                              |
|--------------------------------------------------|---------------------------------------------|----------------------------------------------------------|
| GrpHdr/MsgId                                     | Eindeutige Meldungs-ID                      | Für Dubletten-Erkennung beim Kunden                      |
| GrpHdr/CreDtTm                                   | Erstellungszeitpunkt                        | ISO 8601                                                 |
| Ntfctn/Acct/Id/IBAN                              | Konto des Kunden                            | Normale Konto-IBAN, nicht die QR-IBAN                    |
| Ntry/Amt, Ntry/CdtDbtInd                         | Betrag, CRDT = Gutschrift                   | Bei Sammelbuchung Gesamtbetrag                           |
| Ntry/BookgDt, Ntry/ValDt                         | Buchungs- und Valutadatum                   |                                                          |
| Ntry/AcctSvcrRef                                 | Buchungsreferenz der Gletscherbank          | Angabe bei Rückfragen an Corporate Banking Services      |
| Ntry/BkTxCd                                      | PMNT / RCDT / VCOM                          | VCOM = Eingang mit strukturierter Referenz               |
| TxDtls/Refs/EndToEndId                           | Referenz des Zahlers                        | Kann «NOTPROVIDED» sein                                  |
| TxDtls/RltdPties/Dbtr                            | Name und Adresse des Zahlers                | Strukturierte Adresse seit 21.11.2025                    |
| TxDtls/RmtInf/Strd/CdtrRefInf/Tp/CdOrPrtry/Prtry | Referenztyp: QRR oder SCOR                  | QRR nur mit QR-IBAN gültig (AA-05)                       |
| TxDtls/RmtInf/Strd/CdtrRefInf/Ref                | QR-Referenz (27 Ziffern) bzw. SCOR-Referenz | Schlüsselfeld für die automatische Zuordnung             |
| TxDtls/RmtInf/Ustrd                              | Unstrukturierte Mitteilung                  | Wird bei QR-Rechnungen nicht für die Zuordnung verwendet |

# 4. Beispiel (Auszug einer Einzelbuchung)

\<Ntry\>

\<Amt Ccy="CHF"\>1250.00\</Amt\>

\<CdtDbtInd\>CRDT\</CdtDbtInd\>

\<Sts\>\<Cd\>BOOK\</Cd\>\</Sts\>

\<BookgDt\>\<Dt\>2026-10-29\</Dt\>\</BookgDt\>

\<ValDt\>\<Dt\>2026-10-29\</Dt\>\</ValDt\>

\<AcctSvcrRef\>GLB-20261029-000481\</AcctSvcrRef\>

\<BkTxCd\>\<Domn\>\<Cd\>PMNT\</Cd\>\<Fmly\>\<Cd\>RCDT\</Cd\>\<SubFmlyCd\>VCOM\</SubFmlyCd\>\</Fmly\>\</Domn\>\</BkTxCd\>

\<NtryDtls\>\<TxDtls\>

\<Refs\>\<EndToEndId\>RE-2026-10457\</EndToEndId\>\</Refs\>

\<RltdPties\>\<Dbtr\>\<Pty\>\<Nm\>Muster Bau GmbH\</Nm\>\</Pty\>\</Dbtr\>\</RltdPties\>

\<RmtInf\>\<Strd\>\<CdtrRefInf\>

\<Tp\>\<CdOrPrtry\>\<Prtry\>QRR\</Prtry\>\</CdOrPrtry\>\</Tp\>

\<Ref\>210000000003139471430009017\</Ref\>

\</CdtrRefInf\>\</Strd\>\</RmtInf\>

\</TxDtls\>\</NtryDtls\>

\</Ntry\>

# 5. Typische Fehler und Ursachen

| **Symptom beim Kunden**           | **Ursache**                                                             | **Lösung / Zuständig**                                                                             |
|-----------------------------------|-------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Eingang wird nicht zugeordnet     | Zahler hat QR-Referenz falsch abgetippt oder SCOR statt QRR verwendet   | Gutschrift erfolgt trotzdem, Kennzeichnung im camt.054; Rechnungssteller klärt mit Zahler (PAY-03) |
| Keine Lieferung bis 06:00 Uhr     | Batch-Lauf Reporting fehlgeschlagen                                     | Incident an Reporting-Team, Information Corporate Banking Services (PAY-03)                        |
| Doppelte Buchungen in Buchhaltung | Kunde hat Datei zweimal importiert                                      | Dubletten über GrpHdr/MsgId erkennen                                                               |
| Abo liefert nichts                | Abo noch nicht aktiv (erst ab nächstem Bankwerktag) oder falscher Kanal | AA-05, Schritt 4 prüfen                                                                            |

# 6. Änderungshistorie

| **Version** | **Datum**  | **Änderung**                                                       |
|-------------|------------|--------------------------------------------------------------------|
| 0.9         | 01.09.2025 | Umstellung auf camt.054.001.08 und strukturierte Adressen          |
| 1.0         | 30.10.2026 | Untertägige Lieferzeitpunkte ergänzt; Aufnahme in Wissensdatenbank |
