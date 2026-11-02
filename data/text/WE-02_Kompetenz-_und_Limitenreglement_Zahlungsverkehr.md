Gletscherbank AG · Wissensdatenbank Zahlungsverkehr · Reglement

WE-02 Kompetenz- und Limitenreglement Zahlungsverkehr

|                     |                                                                                                                 |
|---------------------|-----------------------------------------------------------------------------------------------------------------|
| **Erlassen durch**  | Geschäftsleitung                                                                                                |
| **Verantwortlich**  | Thomas Brunner, COO (Stv. Marco Steiner, Leitung PayOps)                                                        |
| **Gilt für**        | Payment Operations, Treasury, Fraud Desk, Kundenberatung, Corporate Banking Services                            |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                                |
| **Klassifikation**  | Intern                                                                                                          |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Namen, Zahlen, Preise, Systeme und Kontakte sind erfunden. |

# 1. Grundsatz

Jede manuelle Ausführung, Änderung, Freigabe oder Stornierung einer Zahlung erfolgt im Vier-Augen-Prinzip. Die zweite Person muss mindestens die Kompetenzstufe haben, die dem Betrag entspricht. Niemand gibt eigene Erfassungen frei.

# 2. Freigabekompetenzen für manuelle Eingriffe

| **Betrag (Gegenwert CHF)**  | **Erfassung**          | **Freigabe durch**                  |
|-----------------------------|------------------------|-------------------------------------|
| **bis 250'000**             | Sachbearbeitung PayOps | Zweite Person mit Rolle PAY_APPROVE |
| **250'001 bis 1'000'000**   | Sachbearbeitung PayOps | Teamleitung PayOps                  |
| **1'000'001 bis 5'000'000** | Teamleitung PayOps     | Leitung PayOps (oder Stv.)          |
| **über 5'000'000**          | Leitung PayOps         | COO und CRO gemeinsam               |

# 3. Weitere Kompetenzen

| **Entscheid**                                          | **Wer darf entscheiden**            | **Bemerkung**                              |
|--------------------------------------------------------|-------------------------------------|--------------------------------------------|
| Instant-Tageslimite Privatkunde erhöhen bis CHF 50'000 | Kundenberatung                      | Standard CHF 10'000; Begründung im CRM     |
| Instant-Limite über CHF 50'000                         | Teamleitung Kundenberatung          | Nach Fraud-Check                           |
| Devisenkurs-Freigabe ab CHF 250'000                    | Treasury (Händler)                  | PAY-06                                     |
| Gebührenerlass bis CHF 200                             | Kundenberatung / Kundenservice      | Pro Fall, im CRM begründen                 |
| Gebührenerlass über CHF 200                            | Teamleitung                         |                                            |
| Notfall-Stopp und Fraud-Rückruf                        | Fraud Desk (jede Person)            | Ohne Vier-Augen; Nachkontrolle am Folgetag |
| Entsperrung nach Fraud                                 | Fraud Desk, Vier-Augen              | AA-04                                      |
| Freigabe Sanktions-Level-2-Fall                        | Compliance Level 2, Vier-Augen      | PAY-08                                     |
| Meldung an MROS                                        | Geldwäschereibeauftragter           | WE-01                                      |
| Änderung von Cut-off-Zeiten und Limiten im System      | Leitung PayOps + Change-Freigabe IT | SH-01                                      |

# 4. Stellvertretung

Bei Abwesenheit gehen die Kompetenzen an die im Organigramm (ORG-01) bezeichnete Stellvertretung über. Eine Stellvertretung darf nicht zugleich erfassen und freigeben.

# 5. Häufige Fragen

| **Frage**                                                           | **Antwort**                                                                                                                   |
|---------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| Wer darf eine korrigierte Zahlung über CHF 300'000 freigeben?       | Teamleitung PayOps (Stufe 250'001 bis 1 Mio.).                                                                                |
| Darf ich eine Zahlung freigeben, die meine Teamleitung erfasst hat? | Nur wenn Ihre Kompetenz für den Betrag reicht. Bei Beträgen über CHF 1 Mio. muss die Leitung PayOps freigeben.                |
| Wer darf in der Nacht eine Zahlung stoppen?                         | Der Fraud Desk (24/7) bei Betrugsverdacht; bei technischen Problemen der PayOps-Pikett mit Freigabe durch die Pikett-Leitung. |
