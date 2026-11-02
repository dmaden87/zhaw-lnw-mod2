Gletscherbank AG · Wissensdatenbank Zahlungsverkehr · Schnittstellenspezifikation (WRICEF)

IF-01 Schnittstelle PayHub ↔ ScreenGuard (Echtzeit-Screening)

|                     |                                                                                                                 |
|---------------------|-----------------------------------------------------------------------------------------------------------------|
| **WRICEF-ID**       | I-012 (Typ I = Interface)                                                                                       |
| **Richtung**        | PayHub → ScreenGuard (Anfrage), ScreenGuard → PayHub (Antwort), synchron                                        |
| **Technik**         | REST/JSON über HTTPS mit gegenseitiger Zertifikatsprüfung (mTLS); API-Gateway intern                            |
| **Owner technisch** | Adrian Vogel, IT Payments (PayHub) und Mirjam Kälin, IT Compliance Systems (ScreenGuard)                        |
| **Owner fachlich**  | Lukas Bühler, Compliance Sanktionen; Jonas Widmer, Fraud Desk                                                   |
| **Version / Stand** | 1.1 / 30.10.2026                                                                                                |
| **Klassifikation**  | Intern                                                                                                          |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Namen, Zahlen, Preise, Systeme und Kontakte sind erfunden. |

# 1. Zweck

Jede ausgehende und eingehende Zahlung wird vor Ausführung bzw. Gutschrift von PayHub an ScreenGuard übergeben. ScreenGuard prüft gegen Sanktionslisten und Fraud-Regeln (SH-02) und liefert einen Entscheid zurück. Ohne positive Antwort verlässt keine Zahlung die Bank (Fail-Safe).

# 2. Ablauf

| **Nr.** | **Schritt**            | **Beschreibung**                                                                                                                            |
|---------|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| 1       | Anfrage                | PayHub sendet POST /screening/v1/checks mit den Zahlungsdaten (Kapitel 3), sobald die formale Prüfung abgeschlossen ist (Status «Geprüft»). |
| 2       | Prüfung                | ScreenGuard prüft Namen, Adressen, BIC, Länder und Freitext gegen die Listen; bei Instant und neuen Empfängern zusätzlich Fraud-Regeln.     |
| 3       | Antwort                | ScreenGuard antwortet mit decision, Score und ggf. Alarm-ID (Kapitel 4).                                                                    |
| 4       | Statuswechsel          | PayHub setzt den Zahlungsstatus gemäss Mapping (Kapitel 5) und führt die Zahlung aus oder hält sie an.                                      |
| 5       | Entscheid nachgelagert | Bei Hold: Entscheid von Compliance bzw. Fraud Desk kommt als Callback POST /payhub/v1/screening-decisions zurück (RELEASE oder REJECT).     |

# 3. Datenfelder Anfrage (Request)

| **Feld**                                        | **Typ**                        | **Pflicht**    | **Beschreibung / Quelle**                                         |
|-------------------------------------------------|--------------------------------|----------------|-------------------------------------------------------------------|
| paymentId                                       | String (36, UUID)              | Ja             | Eindeutige ID der Zahlung in PayHub                               |
| endToEndId                                      | String (max. 35)               | Ja             | End-to-End-Referenz aus dem Auftrag (pain.001 / pacs.008)         |
| channel                                         | Enum                           | Ja             | EBANKING, APP, FILE, BRANCH, INCOMING                             |
| scheme                                          | Enum                           | Ja             | SIC, SIC5_INSTANT, SEPA_SCT, SEPA_INST, SWIFT                     |
| direction                                       | Enum                           | Ja             | OUTGOING oder INCOMING                                            |
| amount.value / amount.currency                  | Decimal (18,2) / ISO 4217      | Ja             | Betrag und Währung                                                |
| debtor.name, debtor.address                     | String / strukturierte Adresse | Ja             | Auftraggeber; Adresse strukturiert (Strasse, Nr., PLZ, Ort, Land) |
| creditor.name, creditor.address                 | String / strukturierte Adresse | Ja             | Empfänger                                                         |
| creditor.iban, creditor.bic                     | String                         | Ja / bedingt   | BIC Pflicht bei SWIFT                                             |
| intermediaryBics\[\]                            | Liste String                   | Nein           | Banken entlang der Zahlungskette (SWIFT)                          |
| remittanceInfo                                  | String (max. 140)              | Nein           | Zahlungszweck / Mitteilung (Freitext wird gescreent)              |
| fraudContext.newBeneficiary                     | Boolean                        | Bei Instant ja | Empfänger erstmals verwendet                                      |
| fraudContext.deviceId, fraudContext.sessionRisk | String / Integer 0–100         | Nein           | Gerät und Sitzungsrisiko aus E-Banking/App (siehe offene Punkte)  |

# 4. Datenfelder Antwort (Response)

| **Feld**    | **Typ**              | **Beschreibung**                                                             |
|-------------|----------------------|------------------------------------------------------------------------------|
| paymentId   | String               | Echo der Anfrage                                                             |
| decision    | Enum                 | CLEAR, HOLD_COMPLIANCE, HOLD_FRAUD, ERROR                                    |
| score       | Integer 0–100        | Höchster Trefferscore; Alarm ab 85 (SH-02). Kein Entscheid, nur Ähnlichkeit. |
| alertId     | String               | Nur bei HOLD\_\*; Referenz für die Queue (AA-03, AA-04)                      |
| matchedList | Enum                 | SECO, UN, EU, OFAC, FRAUD_RULE                                               |
| checkedAt   | Timestamp (ISO 8601) | Zeitpunkt der Prüfung (Audit)                                                |

# 5. Mapping Entscheid → PayHub-Status

| **decision**    | **Status in PayHub**   | **Weiteres Vorgehen**                                                               |
|-----------------|------------------------|-------------------------------------------------------------------------------------|
| CLEAR           | Versendet / Ausgeführt | Normale Verarbeitung                                                                |
| HOLD_COMPLIANCE | Compliance Hold        | Level 1 Compliance gemäss AA-03; Instant wird nicht als Instant ausgeführt (PAY-02) |
| HOLD_FRAUD      | Fraud Hold             | Fraud Desk 24/7 gemäss AA-04                                                        |
| ERROR / Timeout | Kein Versand           | Fail-Safe; siehe Kapitel 6                                                          |

# 6. Fehlerbehandlung und Timeouts

- Timeout Instant (SIC5): 800 ms. Danach wird die Zahlung nicht als Instant ausgeführt; der Kunde erhält einen Hinweis und der Auftrag geht in die normale Verarbeitung (PAY-02, Schritt 3).

- Timeout Standard (SIC, SEPA, SWIFT): 5 Sekunden, danach 3 automatische Wiederholungen im Abstand von 60 Sekunden; anschliessend Status «Repair» mit Fehlercode R-SCR.

- HTTP 5xx oder Ausfall ScreenGuard: PayHub stoppt den Versand (Fail-Safe, SH-02). Incident Priorität 1 an IT Service Desk «ScreenGuard Support».

- HTTP 400 (ungültige Daten, z. B. unstrukturierte Adresse): Status «Repair», Fehlercode R-ADR (AA-01).

# 7. Nicht-funktionale Anforderungen

| **Anforderung**            | **Zielwert**                                                    |
|----------------------------|-----------------------------------------------------------------|
| Antwortzeit Instant (p95)  | ≤ 300 ms                                                        |
| Antwortzeit Standard (p95) | ≤ 2 Sekunden                                                    |
| Verfügbarkeit              | ≥ 99,9 % (24/7, analog Instant-Modul)                           |
| Durchsatz                  | bis 150 Anfragen pro Sekunde (Lastspitze Monatsende)            |
| Protokollierung            | Jede Anfrage und Antwort revisionssicher, Aufbewahrung 10 Jahre |
| Sicherheit                 | mTLS, keine Kundendaten in Logfiles des API-Gateways            |

# 8. Testfälle (Auszug)

| **ID** | **Testfall**                                   | **Erwartetes Ergebnis**                       |
|--------|------------------------------------------------|-----------------------------------------------|
| T-01   | Inlandzahlung ohne Treffer                     | decision = CLEAR, Status «Versendet»          |
| T-02   | Empfängername ähnlich Listeneintrag (Score 91) | HOLD_COMPLIANCE, alertId vorhanden            |
| T-03   | Instant an neuen Empfänger um 03:00 Uhr        | HOLD_FRAUD, Alarm in Queue Fraud Desk         |
| T-04   | ScreenGuard antwortet nicht (Instant)          | Nach 800 ms Abbruch Instant, Hinweis an Kunde |
| T-05   | ScreenGuard nicht erreichbar (SWIFT)           | Kein Versand, Incident Priorität 1            |

# 9. Offene Punkte und Änderungshistorie

| **Version** | **Datum**       | **Änderung**                                                                                                                                                        |
|-------------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1.0         | 15.05.2026      | Erstversion, Go-live mit SIC5-Anbindung                                                                                                                             |
| 1.1         | 30.10.2026      | Timeout Instant von 1 000 ms auf 800 ms gesenkt (CR-2026-041); Callback für Entscheide ergänzt                                                                      |
| offen       | Release 2027-R1 | Felder fraudContext.deviceId und sessionRisk werden erst ab Release 2027-R1 von der App geliefert; Entscheid Produktboard ausstehend (Digital Banking, Kevin Moser) |
