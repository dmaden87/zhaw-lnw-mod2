Gletscherbank AG · Wissensdatenbank Zahlungsverkehr · Arbeitsanweisung

AA-02 Zahlungsrückruf im Investigation-Modul erfassen

|                       |                                                                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------------------------------|
| **Gehört zu Prozess** | PAY-09 Rückruf und Nachforschung                                                                                |
| **Zielgruppe**        | PayOps Investigations, Kundenservice (Erfassung)                                                                |
| **System**            | PayHub Investigation-Modul, KundenCockpit                                                                       |
| **Verantwortlich**    | Teamleitung PayOps Investigations                                                                               |
| **Version / Stand**   | 1.0 / 30.10.2026                                                                                                |
| **Klassifikation**    | Intern                                                                                                          |
| **Hinweis**           | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Namen, Zahlen, Preise, Systeme und Kontakte sind erfunden. |

# 1. Wann diese Anweisung gilt

Ein Kunde möchte eine bereits ausgeführte Zahlung zurückholen (falsche IBAN, Doppelzahlung, falscher Betrag). Bei Betrugsverdacht gilt stattdessen AA-04 und der Fall geht sofort an den Fraud Desk.

# 2. Bildschirmschritte – Kundenservice

| **Nr.** | **Bildschirm / Ort**                      | **Aktion**                                                                                                                             | **Ergebnis / Prüfpunkt**                           |
|---------|-------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| 1       | KundenCockpit › Kunde suchen              | Kunde identifizieren (Legitimation gemäss Telefon-Weisung: Name, Geburtsdatum, Rückfrage zu letzter Transaktion).                      | Kunde eindeutig identifiziert.                     |
| 2       | KundenCockpit › Neuer Fall                | Falltyp «Zahlungsrückruf» wählen. Pflichtfrage «Betrugsverdacht?» beantworten. Bei «Ja»: Fall wird automatisch an Fraud Desk geroutet. | Fallnummer wird angezeigt (Format FA-JJJJ-NNNNNN). |
| 3       | KundenCockpit › Fall › Zahlung verknüpfen | Über «Zahlung suchen» Datum und Betrag eingeben, Zahlung auswählen.                                                                    | Zahlungsreferenz und UETR werden übernommen.       |
| 4       | KundenCockpit › Fall › Grund              | Grund wählen: «Doppelzahlung», «Falscher Empfänger», «Falscher Betrag», «Technischer Fehler». Kundenaussage im Freitext festhalten.    | Fall an Queue «Investigations» übergeben.          |
| 5       | Telefon                                   | Kunde informieren: Fallnummer, Rückmeldung innert 5 Bankwerktagen, Rückzahlung nicht garantiert (LF-01).                               | Erwartung des Kunden geklärt.                      |

# 3. Bildschirmschritte – PayOps Investigations

| **Nr.** | **Bildschirm / Ort**                   | **Aktion**                                                                                                                         | **Ergebnis / Prüfpunkt**                                 |
|---------|----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| 1       | PayHub › Investigation-Modul › Eingang | Fall öffnen. Status der Zahlung prüfen: «Noch nicht versendet» oder «Versendet».                                                   | Weiteres Vorgehen klar.                                  |
| 2       | Zahlungsdetail › «Stopp»               | Falls noch nicht versendet: «Stopp» wählen, Begründung erfassen, zweite Person gibt frei.                                          | Zahlung storniert, Betrag zurück auf Kundenkonto.        |
| 3       | Investigation-Modul › «Rückruf senden» | Falls versendet: Grundcode wählen (DUPL, AC03 falsche Kontonummer, CUST Kundenwunsch). PayHub erzeugt camt.056 bzw. SWIFT-Anfrage. | Status «Rückruf gesendet», Frist 5 Bankwerktage gesetzt. |
| 4       | Investigation-Modul › Wiedervorlage    | Nach Ablauf der Frist ohne Antwort: «Erinnerung senden».                                                                           | Erinnerung im Verlauf sichtbar.                          |
| 5       | Investigation-Modul › Antwort          | Positive Antwort: Rückleitung (pacs.004) wird automatisch gutgeschrieben. Negative Antwort: Grund ins CRM übernehmen.              | Fall mit Ergebnis abgeschlossen.                         |
| 6       | KundenCockpit › Fall                   | Ergebnis an Kunde kommunizieren; Gebühr gemäss Preisliste PB-01 belasten (nicht bei Bankfehler).                                   | Fall geschlossen.                                        |

# 4. Hinweise

- Instant Payments können nicht technisch zurückgerufen werden; im Modul Grund «Bitte um freiwillige Rückzahlung» wählen.

- Rückrufe nur auf Auftrag des Kontoinhabers oder bei bankinternem Fehler.

- Rückrufgebühr: siehe PB-01 Preisliste.
